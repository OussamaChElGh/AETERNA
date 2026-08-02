'use client';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import { Trophy, Users, RefreshCw, Crown, Timer, TrendingUp, Zap, ChevronRight, Sparkles, Flame, Award, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useGamification, formatXP } from '@/context/GamificationContext';
import { getLeaderboard, deriveLevel, getLeague, getMondayKey, LEAGUES, LEAGUE_THRESHOLDS, type LeaderboardEntry, type LeaderboardScope, type League } from '@/lib/leaderboard';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { ShareRankCard } from '@/components/ShareRankCard';
import { useNotifications } from '@/context/NotificationContext';
import { useFollow } from '@/context/FollowContext';
import { useChallenges } from '@/context/ChallengeContext';
import { ChallengeBanner } from '@/components/ChallengeBanner';
import { cn } from '@/lib/utils';

type ClasificacionScope = LeaderboardScope | 'following';

const TABS: { id: ClasificacionScope; label: string; icon: typeof Trophy; color: string }[] = [
  { id: 'global', label: 'Global', icon: Trophy, color: 'brand-gold' },
  { id: 'weekly', label: 'Semanal', icon: Crown, color: 'brand-cosmic' },
  { id: 'following', label: 'Siguiendo', icon: Users, color: 'brand-gold' },
];

function WeeklyCountdown() {
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const monday = new Date(getMondayKey());
      monday.setDate(monday.getDate() + 7);
      const diff = monday.getTime() - now.getTime();
      if (diff <= 0) { setTimeLeft('Recalculando...'); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(`${d}d ${h}h ${m}m`);
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);
  if (!timeLeft) return null;
  return (
    <div className="flex items-center gap-1.5 text-[9px] font-mono text-brand-offwhite/40 bg-white/5 border border-white/5 rounded-full px-2 py-0.5">
      <Timer size={10} className="text-brand-cosmic" />
      <span>Reinicio en {timeLeft}</span>
    </div>
  );
}

export function ClasificacionClient() {
  const { user, signInWithGoogle, loading: authLoading } = useAuth();
  const { progress, setAlias } = useGamification();
  const { addNotification } = useNotifications();
  const { following } = useFollow();
  const [scope, setScope] = useState<ClasificacionScope>('global');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aliasDraft, setAliasDraft] = useState('');
  const [aliasSaved, setAliasSaved] = useState(false);

  const myLevel = deriveLevel(progress.xp || 0);

  const buildLocalMe = (): LeaderboardEntry => ({
    uid: user?.uid || 'local',
    name: (progress.alias && progress.alias.trim()) || progress.displayName || user?.displayName || (user?.email ? user.email.split('@')[0] : '') || 'Sabio Anónimo',
    photoURL: progress.photoURL || user?.photoURL || '',
    avatarId: progress.selectedAvatarId || 'novice',
    level: myLevel,
    xp: progress.xp || 0,
    weeklyXp: progress.weeklyXp || 0,
    achievementsCount: Array.isArray(progress.achievements) ? progress.achievements.length : 0,
    relicsCount: Array.isArray(progress.physicsRelics) ? progress.physicsRelics.length : 0,
    dailyStreak: progress.dailyStreak || 0,
  });

  const myLeague: League = useMemo(() =>
    currentUserRank ? getLeague(currentUserRank) : LEAGUES.bronze,
    [currentUserRank]
  );

  const nextLeague = useMemo(() => {
    for (const t of LEAGUE_THRESHOLDS) {
      if (currentUserRank && currentUserRank > t.rank) break;
      if (myLeague.id === LEAGUES.bronze.id) return null;
      return t;
    }
    return null;
  }, [currentUserRank, myLeague]);

  useEffect(() => { setAliasDraft(progress.alias || ''); }, [progress.alias]);

  // Filter entries for "following" tab (client-side, global data already loaded)
  const effectiveScope: LeaderboardScope = scope === 'following' ? 'global' : scope;
  const displayedEntries = useMemo(() => {
    if (scope !== 'following') return entries;
    const followingSet = new Set(following);
    const me = buildLocalMe();
    return entries.filter(e => followingSet.has(e.uid) || e.uid === me.uid);
  }, [scope, entries, following, progress]);

  const displayedRank = useMemo(() => {
    if (scope !== 'following') return currentUserRank;
    const me = buildLocalMe();
    const idx = displayedEntries.findIndex(e => e.uid === me.uid);
    return idx >= 0 ? idx + 1 : currentUserRank;
  }, [scope, displayedEntries, currentUserRank, progress]);

  // Final values used in the UI (with following filter applied)
  const visibleEntries = scope === 'following' ? displayedEntries : entries;
  const visibleRank = scope === 'following' ? displayedRank : currentUserRank;

  const load = useCallback(async (currentScope: LeaderboardScope) => {
    setIsLoading(true);
    try {
      const result = await getLeaderboard(currentScope, { max: 100, currentUserId: user?.uid });
      const me = buildLocalMe();
      const withoutMe = result.entries.filter(e => e.uid !== me.uid);
      const merged = me.uid !== 'local' ? [...withoutMe, me] : withoutMe;
      const sorted = [...merged].sort((a, b) =>
        currentScope === 'weekly' ? b.weeklyXp - a.weeklyXp : b.xp - a.xp
      );
      setEntries(sorted);
      setTotalUsers(Math.max(result.totalUsers, withoutMe.length + (me.uid !== 'local' ? 1 : 0)));
      const myIdx = sorted.findIndex(e => e.uid === me.uid);
      setCurrentUserRank(myIdx >= 0 ? myIdx + 1 : result.currentUserRank);
    } catch {
      setEntries([buildLocalMe()]);
      setCurrentUserRank(1);
      setTotalUsers(1);
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, progress]);

  useEffect(() => {
    if (user) { load(effectiveScope); } else { setEntries([]); setIsLoading(false); }
  }, [user, effectiveScope, load]);

  // ─── Ranking notifications ───
  useEffect(() => {
    if (!user || currentUserRank === null) return;
    const storageKey = `aeterna_rank_${scope}`;
    const prevRankStr = localStorage.getItem(storageKey);
    const prevRank = prevRankStr ? parseInt(prevRankStr, 10) : null;
    if (prevRank !== null && !isNaN(prevRank)) {
      if (currentUserRank < prevRank) {
        const diff = prevRank - currentUserRank;
        addNotification('rank_up', '¡Has subido en el ranking!', `Has subido ${diff} ${diff === 1 ? 'posición' : 'posiciones'} en el ranking ${scope === 'weekly' ? 'semanal' : 'global'}. Ahora estás en el puesto #${currentUserRank}.`);
      } else if (currentUserRank > prevRank) {
        const diff = currentUserRank - prevRank;
        addNotification('overtaken', 'Has bajado en el ranking', `Has bajado ${diff} ${diff === 1 ? 'posición' : 'posiciones'} en el ranking ${scope === 'weekly' ? 'semanal' : 'global'}. Ahora estás en el puesto #${currentUserRank}. ¡Sigue aprendiendo!`);
      }
      if (currentUserRank <= 10 && prevRank > 10) {
        addNotification('top10', '¡Estás en el Top 10!', `Has entrado en el top 10 del ranking ${scope === 'weekly' ? 'semanal' : 'global'}. ¡Eres uno de los sabios más destacados!`);
      }
    }
    localStorage.setItem(storageKey, currentUserRank.toString());
  }, [user, currentUserRank, scope, addNotification]);

  const handleSaveAlias = () => {
    const clean = aliasDraft.trim().slice(0, 20);
    if (clean.length < 3) return;
    setAlias(clean);
    setAliasSaved(true);
    setTimeout(() => setAliasSaved(false), 2000);
    setTimeout(() => load(effectiveScope), 800);
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] bg-brand-ink flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-brand-ink border border-brand-gold/30 rounded-3xl p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl border border-brand-gold/40 bg-brand-gold/10 flex items-center justify-center mb-4">
            <Trophy size={28} className="text-brand-gold" />
          </div>
          <h1 className="font-serif text-2xl text-brand-offwhite mb-2">Cuadro de Clasificación</h1>
          <p className="text-sm text-brand-offwhite/60 mb-6 font-serif">
            Inicia sesión para competir con otros sabios y ver tu posición en el ranking global y semanal.
          </p>
          <button onClick={signInWithGoogle} disabled={authLoading}
            className="w-full py-3 rounded-xl border border-brand-gold/40 text-brand-gold font-mono font-bold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-ink transition-all disabled:opacity-50">
            {authLoading ? 'Cargando…' : 'Iniciar sesión con Google'}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-ink">
      {/* ─── HERO HEADER ─── */}
      <div className="relative overflow-hidden border-b border-brand-gold/10">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-gold/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl text-brand-offwhite font-bold mb-2 tracking-tight">
              Cuadro de <span className="text-brand-gold italic">Clasificación</span>
            </h1>
            <p className="text-sm text-brand-offwhite/50 font-serif mb-6">
              {totalUsers > 0 ? `${totalUsers} sabios compitiendo` : 'Compite con todos los sabios'} por el trono del conocimiento
            </p>

            {/* League badge */}
            {visibleRank && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
                className={cn(
                  "inline-flex items-center gap-2 px-5 py-2 rounded-full border-2 mb-6",
                  myLeague.border, myLeague.bg, myLeague.glow
                )}
              >
                <span className="text-lg">{myLeague.emoji}</span>
                <div className="text-left">
                  <div className={cn("text-[9px] font-mono uppercase tracking-wider opacity-70", myLeague.text)}>
                    Liga
                  </div>
                  <div className={cn("text-sm font-serif font-bold", myLeague.text)}>
                    {myLeague.name}
                  </div>
                </div>
                <div className={cn("w-px h-8 ml-1 mr-1", myLeague.border)} style={{ borderWidth: 1, borderStyle: 'solid' }} />
                <div className="text-right">
                  <div className="text-[9px] font-mono uppercase tracking-wider text-brand-offwhite/40">Puesto</div>
                  <div className="font-mono font-black text-brand-gold text-lg">#{visibleRank}</div>
                </div>
              </motion.div>
            )}

            {/* Next league progress */}
            {visibleRank && nextLeague && (
              <div className="max-w-xs mx-auto mb-4">
                <div className="flex items-center justify-between text-[9px] font-mono text-brand-offwhite/40 mb-1">
                  <span>{myLeague.emoji} {myLeague.name}</span>
                  <span>{nextLeague.emoji} {nextLeague.name}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, ((nextLeague.rank - (visibleRank || 999)) / nextLeague.rank) * 100)}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-brand-gold to-brand-cosmic"
                  />
                </div>
                <p className="text-[8px] font-mono text-brand-offwhite/30 mt-1 text-center">
                  Faltan {nextLeague.rank - (visibleRank || 999)} puestos para {nextLeague.name}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* ─── TABS + CONTROLS ─── */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = scope === tab.id;
            return (
              <button key={tab.id} onClick={() => setScope(tab.id)} className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-mono font-bold uppercase tracking-wider transition-all",
                active
                  ? `${tab.id === 'global' ? 'bg-brand-gold text-brand-ink border-brand-gold' : 'bg-brand-cosmic text-brand-ink border-brand-cosmic'}`
                  : 'bg-white/5 text-brand-offwhite/70 border-white/10 hover:text-brand-gold'
              )}>
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
          {scope === 'weekly' && <WeeklyCountdown />}
          <button onClick={() => load(effectiveScope)}
            className="ml-auto p-2 rounded-lg border border-white/10 text-brand-offwhite/50 hover:text-brand-gold transition-all" title="Actualizar">
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* ─── CHALLENGE BANNER ─── */}
        <ChallengeBanner currentUserId={user.uid} />

        {/* ─── MY STATS CARD ─── */}
        {visibleRank !== null && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className={cn(
              "rounded-2xl border-2 p-4 flex flex-col sm:flex-row sm:items-center gap-4",
              myLeague.border, myLeague.bg
            )}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={cn("shrink-0 w-12 h-12 rounded-full border-2 overflow-hidden flex items-center justify-center", myLeague.border, myLeague.glow)}>
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} className={myLeague.icon} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-serif font-bold text-brand-offwhite truncate">
                      {buildLocalMe().name}
                    </span>
                    <span className={cn("text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full border", myLeague.border, myLeague.text)}>
                      {myLeague.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono">
                    <span className="text-brand-gold font-bold">#{visibleRank}</span>
                    <span className="text-brand-offwhite/30">·</span>
                    <span className="text-brand-offwhite/50">Nv.{myLevel}</span>
                    <span className="text-brand-offwhite/30">·</span>
                    <span className="text-brand-offwhite/50">{formatXP(progress.xp)} XP</span>
                    {progress.dailyStreak > 0 && (
                      <>
                        <span className="text-brand-offwhite/30">·</span>
                        <span className="text-orange-400 flex items-center gap-0.5"><Flame size={10} />{progress.dailyStreak}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <ShareRankCard
                  name={buildLocalMe().name}
                  photoURL={progress.photoURL || user?.photoURL || ''}
                  avatarId={progress.selectedAvatarId || 'novice'}
                  rank={visibleRank || 1}
                  xp={progress.xp || 0}
                  weeklyXp={progress.weeklyXp || 0}
                  level={myLevel}
                  scope={scope === 'following' ? 'global' : scope}
                  achievementsCount={Array.isArray(progress.achievements) ? progress.achievements.length : 0}
                  relicsCount={Array.isArray(progress.physicsRelics) ? progress.physicsRelics.length : 0}
                  dailyStreak={progress.dailyStreak || 0}
                />
              </div>
            </div>

            {/* Alias */}
            <div className="mt-3 bg-white/[0.02] border border-white/5 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex-1">
                <label className="text-[9px] font-mono uppercase tracking-wider text-brand-offwhite/40 mb-1 block">Tu alias</label>
                <input
                  value={aliasDraft}
                  onChange={(e) => { setAliasDraft(e.target.value); setAliasSaved(false); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSaveAlias(); }}
                  maxLength={20}
                  placeholder={user.displayName || 'Escribe tu alias'}
                  className="w-full bg-transparent text-sm text-brand-offwhite placeholder:text-brand-offwhite/30 focus:outline-none"
                />
              </div>
              <button onClick={handleSaveAlias} disabled={aliasDraft.trim().length < 3}
                className={cn("px-3 py-1.5 rounded-lg border text-[10px] font-mono font-bold uppercase tracking-wider transition-all shrink-0",
                  aliasDraft.trim().length >= 3 ? "border-brand-gold/40 text-brand-gold hover:bg-brand-gold hover:text-brand-ink" : "border-white/10 text-brand-offwhite/30 cursor-not-allowed")}>
                {aliasSaved ? '✓ Guardado' : 'Guardar'}
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── LEADERBOARD ─── */}
        <LeaderboardTable entries={visibleEntries} currentUserId={user.uid} isLoading={isLoading} scope={scope === 'following' ? 'global' : scope} />
      </div>
    </div>
  );
}
