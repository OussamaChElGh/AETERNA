import assert from 'node:assert/strict';
import { test } from 'node:test';
import curriculum from '../data/curriculum/fisica.json';
import { getChestRewards, getFurnitureGrant } from '../lib/chestRewards';
import { getStudyStatus, recordStudyActivity, STUDY_LAYERS } from '../lib/studyProgress';
import { evaluateRoomUnlocks, hasRoomEngineState, loadRoomEngineState, saveRoomEngineStateDebounced,
  validateRoomChange, validatePlacement } from '../lib/roomEngineStorage';
import type { PlacedRoomItem } from '../types/roomEngine';

const item = (catalogItemId: string, tileX: number, tileY: number, tileZ = 0,
  rotation: PlacedRoomItem['rotation'] = 0): PlacedRoomItem =>
  ({ instanceId: catalogItemId, catalogItemId, tileX, tileY, tileZ, rotation });

test('Física, cofre de Fundamentos, inventario y recarga del mueble', () => {
  const lessons = curriculum.articles.filter(lesson => lesson.nivel === 1);
  const lesson = lessons[Math.ceil((lessons.length + 1) / 2) - 1];
  const before = { completedPaths: [], extraFurniture: [] };
  const studied = { ...before, completedLayers: { [lesson.slug]: [...STUDY_LAYERS] } };
  assert.equal(getStudyStatus(before, lesson.slug).completed, false);
  assert.equal(getStudyStatus(studied, lesson.slug).completed, true);
  const activity = recordStudyActivity(undefined, { slug: lesson.slug, layer: 'avanzado' }, 1);
  assert.equal(activity[0].slug, lesson.slug);

  const reward = getChestRewards(1).find(entry => entry.id === 'telescope_brass')!;
  assert(!evaluateRoomUnlocks(studied).unlockedIds.has(reward.id));
  const grant = getFurnitureGrant(studied, [reward.id], 'physics-1')!;
  const progress = { ...studied, ...grant };
  assert.equal(getFurnitureGrant(progress, ['sofa_leather'], 'physics-1'), null);
  assert(evaluateRoomUnlocks(progress).unlockedIds.has(reward.id));

  const position = item(reward.id, 3, 3);
  assert(validateRoomChange([], position, position.instanceId, 8));
  const store = new Map<string, string>();
  Object.defineProperty(globalThis, 'window', { configurable: true, value: {} });
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value)
  } });
  try {
    const room = loadRoomEngineState();
    saveRoomEngineStateDebounced({ ...room, placedItems: [position] });
    assert.deepEqual(loadRoomEngineState().placedItems, [position]);
    saveRoomEngineStateDebounced({ ...room, placedItems: [] });
    assert(hasRoomEngineState());
    assert.deepEqual(loadRoomEngineState().placedItems, []);
  } finally {
    Reflect.deleteProperty(globalThis, 'window');
    Reflect.deleteProperty(globalThis, 'localStorage');
  }
});

test('giro de un escritorio rectangular en el borde del estudio', () => {
  const desk = item('desk_academic', 4, 7);
  assert(validateRoomChange([], desk, desk.instanceId, 8));
  assert(!validateRoomChange([desk], { ...desk, rotation: 90 }, desk.instanceId, 8));
  assert(validateRoomChange([desk], { ...desk, rotation: 90 }, desk.instanceId, 10));
});

test('ventana en ambas paredes y fuera de sus ejes', () => {
  const window = item('window_gothic', 2, 0);
  assert(validateRoomChange([], window, window.instanceId, 8));
  assert(validateRoomChange([window], { ...window, tileX: 0, tileY: 2 }, window.instanceId, 8));
  assert(!validateRoomChange([window], { ...window, tileY: 2 }, window.instanceId, 8));
});

test('una mesa con objetos encima no puede borrarse ni moverse', () => {
  const desk = item('desk_academic', 3, 3);
  const book = item('book_tower', 3, 3, 1);
  assert(validatePlacement(book.tileX, book.tileY, book.tileZ, book.rotation,
    book.catalogItemId, book.instanceId, [desk], 8).isValid);
  assert(!validateRoomChange([desk, book], null, desk.instanceId, 8));
  assert(!validateRoomChange([desk, book], { ...desk, tileX: 5, tileY: 5 }, desk.instanceId, 8));
  assert(validateRoomChange([desk], null, desk.instanceId, 8));
});
