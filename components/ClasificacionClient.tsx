'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Trophy, Users, RefreshCw, Crown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useGamification } from '@/context/GamificationContext';
import { getLeaderboard, deriveLevel, type LeaderboardEntry, type LeaderboardScope } from '@/lib/leaderboard';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { ShareRankCard } from '@/components/ShareRankCard';
import { cn } from '@/lib/utils';

const TABS: { id: LeaderboardScope; label: string; icon: typeof Trophy }[] = [
  { id: 'global', label: 'Global', icon: Trophy },
  { id: 'weekly', label: 'Semanal', icon: Crown },
];

export function ClasificacionClient() {
  const { user, signInWithGoogle, loading: authLoading } = useAuth();
  const { progress, setAlias } = useGamification();
  const [scope, setScope] = useState<LeaderboardScope>('global');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aliasDraft, setAliasDraft] = useState('');
  const [aliasSaved, setAliasSaved] = useState(false);

  // Entrada del usuario construida desde el progreso local (siempre disponible,
  // aunque Firestore no permita leer la colección todavía).
  const buildLocalMe = (): LeaderboardEntry => ({
    uid: user?.uid || 'local',
    name: (progress.alias && progress.alias.trim()) || progress.displayName || user?.displayName || (user?.email ? user.email.split('@')[0] : '') || 'Sabio Anónimo',
    photoURL: progress.photoURL || user?.photoURL || '',
    avatarId: progress.selectedAvatarId || 'novice',
    level: deriveLevel(progress.xp || 0),
    xp: progress.xp || 0,
    weeklyXp: progress.weeklyXp || 0,
    achievementsCount: Array.isArray(progress.achievements) ? progress.achievements.length : 0,
    relicsCount: Array.isArray(progress.physicsRelics) ? progress.physicsRelics.length : 0,
    dailyStreak: progress.dailyStreak || 0,
  });

  // Sincronizar el borrador con el alias guardado
  useEffect(() => {
    setAliasDraft(progress.alias || '');
  }, [progress.alias]);

  const load = useCallback(async (currentScope: LeaderboardScope) => {
    setIsLoading(true);
    try {
      const result = await getLeaderboard(currentScope, {
        max: 100,
        currentUserId: user?.uid,
      });
      // Mi entrada SIEMPRE se construye desde la sesión local (nombre real,
      // avatar, XP actual). Reemplaza cualquier fila con mi uid que venga de
      // Firestore con nombre vacío (Sabio Anónimo).
      const me = buildLocalMe();
      const withoutMe = result.entries.filter(e => e.uid !== me.uid);
      const merged = me.uid !== 'local' ? [...withoutMe, me] : withoutMe;
      // ORDENAR por el scope activo (desc): la tabla muestra posiciones según
      // el índice del array, así que la lista debe llegar ya ordenada.
      const sorted = [...merged].sort((a, b) =>
        currentScope === 'weekly' ? b.weeklyXp - a.weeklyXp : b.xp - a.xp
      );
      setEntries(sorted);
      setTotalUsers(Math.max(result.totalUsers, withoutMe.length + (me.uid !== 'local' ? 1 : 0)));

      const myIdx = sorted.findIndex(e => e.uid === me.uid);
      setCurrentUserRank(myIdx >= 0 ? myIdx + 1 : result.currentUserRank);
    } catch (e) {
      console.warn('Leaderboard: error cargando clasificación', e);
      setEntries([buildLocalMe()]);
      setCurrentUserRank(1);
      setTotalUsers(1);
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, progress]);

  useEffect(() => {
    if (user) {
      load(scope);
    } else {
      setEntries([]);
      setIsLoading(false);
    }
  }, [user, scope, load]);

  const handleSaveAlias = () => {
    const clean = aliasDraft.trim().slice(0, 20);
    if (clean.length < 3) return;
    setAlias(clean);
    setAliasSaved(true);
    setTimeout(() => setAliasSaved(false), 2000);
    // Recargar para ver el alias actualizado
    setTimeout(() => load(scope), 800);
  };

  // Pantalla de login
  if (!user) {
    return (
      <div className="min-h-[70vh] bg-brand-ink flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-brand-ink border border-brand-gold/30 rounded-3xl p-8 text-center"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl border border-brand-gold/40 bg-brand-gold/10 flex items-center justify-center mb-4">
            <Trophy size={28} className="text-brand-gold" />
          </div>
          <h1 className="font-serif text-2xl text-brand-offwhite mb-2">Cuadro de Clasificación</h1>
          <p className="text-sm text-brand-offwhite/60 mb-6 font-serif">
            Inicia sesión para competir con otros sabios y ver tu posición en el ranking global y semanal.
          </p>
          <button
            onClick={signInWithGoogle}
            disabled={authLoading}
            className="w-full py-3 rounded-xl border border-brand-gold/40 text-brand-gold font-mono font-bold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-ink transition-all disabled:opacity-50"
          >
            {authLoading ? 'Cargando…' : 'Iniciar sesión con Google'}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-ink px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Trophy size={24} className="text-brand-gold" />
            <h1 className="font-serif text-3xl text-brand-offwhite">Cuadro de Clasificación</h1>
          </div>
          <p className="text-sm text-brand-offwhite/60 font-serif">
            Compite contra {totalUsers > 0 ? totalUsers : 'todos los'} sabios de Aeterna por el trono del conocimiento.
          </p>
        </motion.div>

        {/* Alias */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6 bg-brand-ink border border-brand-gold/20 rounded-2xl p-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-brand-gold/60 mb-1 block">
                Tu alias en el ranking
              </label>
              <input
                value={aliasDraft}
                onChange={(e) => { setAliasDraft(e.target.value); setAliasSaved(false); }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveAlias(); }}
                maxLength={20}
                placeholder={user.displayName || 'Escribe tu alias'}
                className="w-full bg-white/5 border border-brand-gold/20 rounded-lg px-3 py-2 text-sm text-brand-offwhite placeholder:text-brand-offwhite/30 focus:border-brand-gold focus:outline-none"
              />
            </div>
            <button
              onClick={handleSaveAlias}
              disabled={aliasDraft.trim().length < 3}
              className={cn(
                "px-4 py-2 rounded-lg border font-mono text-xs font-bold uppercase tracking-wider transition-all shrink-0",
                aliasDraft.trim().length >= 3
                  ? "border-brand-gold/40 text-brand-gold hover:bg-brand-gold hover:text-brand-ink"
                  : "border-white/10 text-brand-offwhite/30 cursor-not-allowed"
              )}
            >
              {aliasSaved ? 'Guardado ✓' : 'Guardar alias'}
            </button>
          </div>
          <p className="text-[10px] text-brand-offwhite/40 mt-2 font-mono">
            Mínimo 3 caracteres. Si no defines alias, se mostrará tu nombre de Google.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setScope(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-mono font-bold uppercase tracking-wider transition-all",
                  scope === tab.id
                    ? "bg-brand-gold text-brand-ink border-brand-gold"
                    : "bg-white/5 text-brand-offwhite/70 border-white/10 hover:text-brand-gold"
                )}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
          <button
            onClick={() => load(scope)}
            className="ml-auto p-2 rounded-lg border border-white/10 text-brand-offwhite/50 hover:text-brand-gold transition-all"
            title="Actualizar"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Posición actual del usuario */}
        {currentUserRank !== null && (
          <div className="mb-6 flex items-center gap-3 bg-brand-gold/5 border border-brand-gold/25 rounded-2xl px-4 py-3">
            <Users size={16} className="text-brand-gold" />
            <p className="text-sm font-serif text-brand-offwhite">
              Tu posición: <span className="font-bold text-brand-gold">#{currentUserRank}</span> en el ranking {scope === 'global' ? 'global' : 'semanal'}
            </p>
            <div className="ml-auto">
              <ShareRankCard
                name={(progress.alias && progress.alias.trim()) || progress.displayName || user?.displayName || (user?.email ? user.email.split('@')[0] : '') || 'Sabio Anónimo'}
                photoURL={progress.photoURL || user?.photoURL || ''}
                avatarId={progress.selectedAvatarId || 'novice'}
                rank={currentUserRank}
                xp={progress.xp || 0}
                weeklyXp={progress.weeklyXp || 0}
                level={deriveLevel(progress.xp || 0)}
                scope={scope}
                achievementsCount={Array.isArray(progress.achievements) ? progress.achievements.length : 0}
                relicsCount={Array.isArray(progress.physicsRelics) ? progress.physicsRelics.length : 0}
                dailyStreak={progress.dailyStreak || 0}
              />
            </div>
          </div>
        )}

        <LeaderboardTable
          entries={entries}
          currentUserId={user.uid}
          isLoading={isLoading}
          scope={scope}
        />
      </div>
    </div>
  );
}
