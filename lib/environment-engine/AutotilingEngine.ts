// Aeterna Environment System - AutotilingEngine Sub-System
// Calculates 8-neighbor adjacency bitmasks & pseudo-random variant selection

import { EnvironmentLayout } from '@/types/environmentEngine';

export class AutotilingEngine {
  private layout: EnvironmentLayout;

  constructor(layout: EnvironmentLayout) {
    this.layout = layout;
  }

  // Returns pseudo-random variant index (0..3) based on spatial coordinate hash
  public getFloorVariantIndex(tileX: number, tileY: number): number {
    const hash = (tileX * 73856093 ^ tileY * 19349663) >>> 0;
    return hash % 4;
  }

  // Inspect 8-neighbor cells and return tile classification ('center' | 'edge_n' | 'edge_s' | 'edge_e' | 'edge_w' | 'corner_nw' | 'corner_ne' | 'corner_sw' | 'corner_se')
  public getTileClassification(tileX: number, tileY: number): 'center' | 'edge_n' | 'edge_s' | 'edge_e' | 'edge_w' | 'corner_nw' | 'corner_ne' | 'corner_sw' | 'corner_se' {
    const isFloor = (x: number, y: number): boolean => {
      if (x < 0 || x >= this.layout.gridSizeX || y < 0 || y >= this.layout.gridSizeY) return false;
      return this.layout.cells[x]?.[y]?.type === 'floor' && !this.layout.blockedTiles.has(`${x},${y}`);
    };

    const n = isFloor(tileX, tileY - 1);
    const s = isFloor(tileX, tileY + 1);
    const e = isFloor(tileX + 1, tileY);
    const w = isFloor(tileX - 1, tileY);

    if (!n && !w) return 'corner_nw';
    if (!n && !e) return 'corner_ne';
    if (!s && !w) return 'corner_sw';
    if (!s && !e) return 'corner_se';

    if (!n) return 'edge_n';
    if (!w) return 'edge_w';
    if (!e) return 'edge_e';
    if (!s) return 'edge_s';

    return 'center';
  }
}
