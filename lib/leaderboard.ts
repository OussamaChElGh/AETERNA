import { collection, getDocs, query, orderBy, limit, where, doc, getDoc, QueryConstraint, startAfter } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface LeaderboardEntry {
  uid: string;
  name: string;
  photoURL: string;
  avatarId: string;
  level: number;
  xp: number;
  weeklyXp: number;
  achievementsCount: number;
  relicsCount: number;
  dailyStreak: number;
}

export interface LeaderboardResult {
  entries: LeaderboardEntry[];
  totalUsers: number;
  currentUserRank: number | null;
  currentUserEntry: LeaderboardEntry | null;
}

export type LeaderboardScope = 'global' | 'weekly';

/**
 * Recalcula el nivel a partir del XP usando la misma fórmula logarítmica
 * del juego, para que el nivel mostrado en el ranking siempre corresponda
 * al XP real (los documentos pueden tener el campo `level` desactualizado).
 */
export function deriveLevel(totalXp: number): number {
  const xpBase = 15000;
  const multiplier = 1.0415;
  if (totalXp <= 0) return 1;
  return Math.floor(Math.log(totalXp / xpBase + 1) / Math.log(multiplier)) + 1;
}

function mapDocToEntry(docSnap: { id: string; data: () => any }): LeaderboardEntry {
  const d = docSnap.data();
  const xp = d.xp || 0;
  return {
    uid: docSnap.id,
    name: (d.alias && d.alias.trim()) || d.displayName || 'Sabio Anónimo',
    photoURL: d.photoURL || '',
    avatarId: d.selectedAvatarId || 'novice',
    level: deriveLevel(xp),
    xp,
    weeklyXp: d.weeklyXp || 0,
    achievementsCount: Array.isArray(d.achievements) ? d.achievements.length : 0,
    relicsCount: Array.isArray(d.physicsRelics) ? d.physicsRelics.length : 0,
    dailyStreak: d.dailyStreak || 0,
  };
}

/**
 * Obtiene el ranking (global por XP total o semanal por weeklyXp de la semana actual).
 * El ranking semanal solo incluye usuarios que han ganado XP esta semana
 * (weeklyResetDate == lunes actual).
 */
export async function getLeaderboard(
  scope: LeaderboardScope,
  opts: { max?: number; currentUserId?: string; startAfterUid?: string; lastXp?: number } = {}
): Promise<LeaderboardResult> {
  const max = opts.max || 100;
  const constraints: QueryConstraint[] = [];

  if (scope === 'weekly') {
    // Semana actual: lunes 00:00 UTC. Requiere índice compuesto.
    const monday = getMondayKey();
    constraints.push(where('weeklyResetDate', '==', monday));
    constraints.push(orderBy('weeklyXp', 'desc'));
  } else {
    constraints.push(orderBy('xp', 'desc'));
  }

  constraints.push(limit(max));

  try {
    const baseQuery = query(collection(db, 'aeternaProgressV3'), ...constraints);
    const snap = await getDocs(baseQuery);
    const entries = snap.docs.map(mapDocToEntry);

    // Total de usuarios con XP > 0 (para mostrar "de N sabios")
    let totalUsers = entries.length;
    try {
      const totalSnap = await getDocs(query(
        collection(db, 'aeternaProgressV3'),
        where('xp', '>', 0)
      ));
      totalUsers = totalSnap.size;
    } catch (e) {
      console.warn('Leaderboard: no se pudo contar usuarios totales', e);
    }

    // Posición y entrada del usuario actual
    let currentUserRank: number | null = null;
    let currentUserEntry: LeaderboardEntry | null = null;
    if (opts.currentUserId) {
      try {
        const userRef = doc(db, 'aeternaProgressV3', opts.currentUserId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const me = mapDocToEntry(userSnap);
          currentUserEntry = me;
          const rankKey = scope === 'weekly' ? 'weeklyXp' : 'xp';
          const rankValue = scope === 'weekly' ? (me.weeklyXp || 0) : (me.xp || 0);
          // Contar cuántos usuarios superan a este usuario
          const aheadSnap = await getDocs(query(
            collection(db, 'aeternaProgressV3'),
            scope === 'weekly'
              ? where('weeklyResetDate', '==', getMondayKey())
              : where('xp', '>', 0),
            where(rankKey, '>', rankValue)
          ));
          currentUserRank = aheadSnap.size + 1;
        }
      } catch (e) {
        console.warn('Leaderboard: no se pudo calcular tu posición', e);
      }
    }

    return { entries, totalUsers, currentUserRank, currentUserEntry };
  } catch (error) {
    console.warn('Leaderboard: error al obtener la clasificación', error);
    return { entries: [], totalUsers: 0, currentUserRank: null, currentUserEntry: null };
  }
}

/**
 * Devuelve el lunes de la semana actual a las 00:00 (UTC) como ISO string.
 * Debe coincidir con la clave usada en GamificationContext para el reinicio semanal.
 */
export function getMondayKey(date: Date = new Date()): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay();
  const diff = (day + 6) % 7;
  d.setUTCDate(d.getUTCDate() - diff);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

/**
 * Paginación simple: cargar más entradas a partir de la última conocida.
 */
export async function getMoreLeaderboard(
  scope: LeaderboardScope,
  lastEntry: LeaderboardEntry,
  max: number = 100
): Promise<LeaderboardEntry[]> {
  const constraints: QueryConstraint[] = [];

  if (scope === 'weekly') {
    constraints.push(where('weeklyResetDate', '==', getMondayKey()));
    constraints.push(orderBy('weeklyXp', 'desc'));
    constraints.push(startAfter(lastEntry.weeklyXp));
  } else {
    constraints.push(orderBy('xp', 'desc'));
    constraints.push(startAfter(lastEntry.xp));
  }

  constraints.push(limit(max));

  try {
    const q = query(collection(db, 'aeternaProgressV3'), ...constraints);
    const snap = await getDocs(q);
    return snap.docs.map(mapDocToEntry);
  } catch (error) {
    console.warn('Leaderboard: error al obtener más entradas', error);
    return [];
  }
}

// ─── League / Division system ───────────────────────────────────────────

export type LeagueId = 'legend' | 'diamond' | 'platinum' | 'gold' | 'silver' | 'bronze';

export interface League {
  id: LeagueId;
  name: string;
  emoji: string;
  border: string;
  bg: string;
  text: string;
  glow: string;
  icon: string;
}

export const LEAGUES: Record<LeagueId, League> = {
  legend: {
    id: 'legend',
    name: 'Leyenda',
    emoji: '👑',
    border: 'border-amber-300/80',
    bg: 'bg-amber-300/10',
    text: 'text-amber-300',
    glow: 'shadow-[0_0_30px_rgba(251,191,36,0.3)]',
    icon: 'text-amber-300',
  },
  diamond: {
    id: 'diamond',
    name: 'Diamante',
    emoji: '💎',
    border: 'border-brand-cosmic/70',
    bg: 'bg-brand-cosmic/10',
    text: 'text-brand-cosmic',
    glow: 'shadow-[0_0_24px_rgba(14,165,233,0.3)]',
    icon: 'text-brand-cosmic',
  },
  platinum: {
    id: 'platinum',
    name: 'Platino',
    emoji: '🧿',
    border: 'border-sky-400/60',
    bg: 'bg-sky-400/10',
    text: 'text-sky-400',
    glow: 'shadow-[0_0_20px_rgba(56,189,248,0.2)]',
    icon: 'text-sky-400',
  },
  gold: {
    id: 'gold',
    name: 'Oro',
    emoji: '🥇',
    border: 'border-brand-gold/50',
    bg: 'bg-brand-gold/10',
    text: 'text-brand-gold',
    glow: 'shadow-[0_0_16px_rgba(212,175,55,0.2)]',
    icon: 'text-brand-gold',
  },
  silver: {
    id: 'silver',
    name: 'Plata',
    emoji: '🥈',
    border: 'border-brand-offwhite/30',
    bg: 'bg-brand-offwhite/5',
    text: 'text-brand-offwhite/60',
    glow: 'shadow-[0_0_12px_rgba(245,245,240,0.1)]',
    icon: 'text-brand-offwhite/50',
  },
  bronze: {
    id: 'bronze',
    name: 'Bronce',
    emoji: '🥉',
    border: 'border-orange-700/40',
    bg: 'bg-orange-700/5',
    text: 'text-orange-400/60',
    glow: 'shadow-[0_0_8px_rgba(194,65,12,0.1)]',
    icon: 'text-orange-400/50',
  },
};

export function getLeague(rank: number): League {
  if (rank === 1) return LEAGUES.legend;
  if (rank <= 3) return LEAGUES.diamond;
  if (rank <= 10) return LEAGUES.platinum;
  if (rank <= 25) return LEAGUES.gold;
  if (rank <= 50) return LEAGUES.silver;
  return LEAGUES.bronze;
}

export const LEAGUE_THRESHOLDS: { rank: number; name: string; emoji: string }[] = [
  { rank: 1, name: 'Leyenda', emoji: '👑' },
  { rank: 3, name: 'Diamante', emoji: '💎' },
  { rank: 10, name: 'Platino', emoji: '🧿' },
  { rank: 25, name: 'Oro', emoji: '🥇' },
  { rank: 50, name: 'Plata', emoji: '🥈' },
];
