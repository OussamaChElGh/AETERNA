'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, User, Flame, Award, Sparkles, Trophy, Loader2, Swords } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useFollow } from '@/context/FollowContext';
import { formatXP } from '@/context/GamificationContext';
import { getLeague, deriveLevel, type League } from '@/lib/leaderboard';
import { cn } from '@/lib/utils';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getFollowing, isFollowing } from '@/lib/follows';
import { CreateChallengeModal } from '@/components/CreateChallengeModal';
import { ChallengeBanner } from '@/components/ChallengeBanner';

interface UserProfile {
  xp: number;
  level: number;
  achievements: string[];
  physicsRelics: string[];
  dailyStreak: number;
  alias?: string;
  displayName?: string;
  photoURL?: string;
  selectedAvatarId?: string;
  completedPaths?: string[];
}

export function UsuarioClient({ uid }: { uid: string }) {
  const { user, signInWithGoogle } = useAuth();
  const { follow, unfollow } = useFollow();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMe, setIsMe] = useState(false);
  const [rank, setRank] = useState<number | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [following, setFollowing] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);

  useEffect(() => {
    if (!user) return;
    setIsMe(user.uid === uid);
    loadProfile();
    checkFollow();
  }, [user, uid]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const snap = await getDoc(doc(db, 'aeternaProgressV3', uid));
      if (!snap.exists()) {
        setError('Este sabio no tiene perfil público.');
        return;
      }
      const data = snap.data();
      setProfile({
        xp: data.xp || 0,
        level: deriveLevel(data.xp || 0),
        achievements: data.achievements || [],
        physicsRelics: data.physicsRelics || [],
        dailyStreak: data.dailyStreak || 0,
        alias: data.alias,
        displayName: data.displayName,
        photoURL: data.photoURL,
        selectedAvatarId: data.selectedAvatarId,
        completedPaths: data.completedPaths,
      });
    } catch {
      setError('No se pudo cargar el perfil.');
    } finally {
      setLoading(false);
    }
  };

  const checkFollow = async () => {
    if (!user || user.uid === uid) return;
    const following = await isFollowing(user.uid, uid);
    setFollowing(following);
  };

  const handleToggleFollow = () => {
    if (following) {
      unfollow(uid);
      setFollowing(false);
    } else {
      follow(uid);
      setFollowing(true);
    }
  };

  const name = profile?.alias || profile?.displayName || 'Sabio Anónimo';
  const league: League = rank ? getLeague(rank) : getLeague(999);

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-ink flex items-center justify-center px-4">
        <div className="text-center">
          <User size={48} className="mx-auto text-brand-offwhite/20 mb-4" />
          <h1 className="font-serif text-2xl text-brand-offwhite mb-2">Perfil de Sabio</h1>
          <p className="text-sm text-brand-offwhite/60 mb-6 font-serif">
            Inicia sesión para ver perfiles de otros sabios.
          </p>
          <button onClick={signInWithGoogle}
            className="px-6 py-3 rounded-xl border border-brand-gold/40 text-brand-gold font-mono font-bold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-ink transition-all">
            Iniciar sesión con Google
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-ink flex items-center justify-center">
        <Loader2 size={32} className="text-brand-gold animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-brand-ink px-4 py-10">
        <div className="max-w-2xl mx-auto text-center">
          <User size={48} className="mx-auto text-brand-offwhite/20 mb-4" />
          <h1 className="font-serif text-2xl text-brand-offwhite mb-2">Sabio no encontrado</h1>
          <p className="text-sm text-brand-offwhite/60 mb-6">{error || 'Este perfil no existe.'}</p>
          <Link href="/clasificacion" className="text-brand-gold font-mono text-xs uppercase tracking-wider hover:underline">
            ← Volver a la clasificación
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-ink">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/clasificacion" className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-brand-offwhite/40 hover:text-brand-gold transition-colors mb-8">
            <ArrowLeft size={12} />
            Clasificación
          </Link>

          {/* Profile card */}
          <div className={cn("rounded-2xl border-2 p-6 mb-6", league.border, league.bg, league.glow)}>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className={cn("shrink-0 w-20 h-20 rounded-full border-2 overflow-hidden flex items-center justify-center", league.border)}>
                {profile.photoURL ? (
                  <img src={profile.photoURL} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <User size={32} className={league.icon} />
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h1 className="font-serif text-2xl text-brand-offwhite font-bold">{name}</h1>
                  <span className={cn("text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full border", league.border, league.text)}>
                    {league.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs font-mono justify-center sm:justify-start">
                  <span className="text-brand-offwhite/50">Nv.{profile.level}</span>
                  <span className="text-brand-offwhite/30">·</span>
                  <span className="text-brand-gold font-bold">{formatXP(profile.xp)} XP</span>
                  {profile.dailyStreak > 0 && (
                    <>
                      <span className="text-brand-offwhite/30">·</span>
                      <span className="text-orange-400 flex items-center gap-0.5"><Flame size={12} />{profile.dailyStreak}</span>
                    </>
                  )}
                </div>

                {isMe ? (
                  <p className="mt-2 text-[10px] font-mono text-brand-offwhite/40">Este es tu perfil</p>
                ) : (
                  <div className="flex items-center gap-2 mt-3 justify-center sm:justify-start">
                    <button
                      onClick={handleToggleFollow}
                      className={cn(
                        "px-4 py-1.5 rounded-lg border text-[10px] font-mono font-bold uppercase tracking-wider transition-all",
                        following
                          ? "bg-brand-gold/20 border-brand-gold/40 text-brand-gold hover:bg-brand-gold/30"
                          : "border-brand-gold/40 text-brand-gold hover:bg-brand-gold hover:text-brand-ink"
                      )}
                    >
                      {following ? '✓ Siguiendo' : '+ Seguir'}
                    </button>
                    <button
                      onClick={() => setShowChallengeModal(true)}
                      className="px-4 py-1.5 rounded-lg border border-brand-cosmic/40 text-brand-cosmic text-[10px] font-mono font-bold uppercase tracking-wider hover:bg-brand-cosmic hover:text-brand-ink transition-all flex items-center gap-1"
                    >
                      <Swords size={12} />
                      Retar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <StatCard label="Nivel" value={profile.level} icon={<Sparkles size={14} className="text-brand-gold" />} />
            <StatCard label="XP" value={formatXP(profile.xp)} icon={<Trophy size={14} className="text-brand-gold" />} />
            <StatCard label="Logros" value={profile.achievements.length} icon={<Award size={14} className="text-brand-gold" />} />
            <StatCard label="Reliquias" value={profile.physicsRelics.length} icon={<Award size={14} className="text-brand-cosmic" />} />
          </div>

          {/* Completed paths count */}
          {profile.completedPaths && (
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 mb-6">
              <h3 className="text-[10px] font-mono uppercase tracking-wider text-brand-offwhite/40 mb-2">Artículos completados</h3>
              <div className="text-2xl font-serif font-bold text-brand-gold">{profile.completedPaths.length}</div>
            </div>
          )}

          {profile.dailyStreak > 0 && (
            <div className="rounded-2xl border border-orange-400/10 bg-orange-400/5 p-4 mb-6">
              <div className="flex items-center gap-2">
                <Flame size={18} className="text-orange-400" />
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-orange-400/60">Racha diaria</div>
                  <div className="text-lg font-serif font-bold text-orange-400">
                    {profile.dailyStreak} {profile.dailyStreak === 1 ? 'día' : 'días'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active challenges with this user */}
          {!isMe && <ChallengeBanner currentUserId={user.uid} />}
        </motion.div>
      </div>
      <CreateChallengeModal
        challengerUid={uid}
        challengerName={name}
        isOpen={showChallengeModal}
        onClose={() => setShowChallengeModal(false)}
      />
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3 text-center">
      <div className="flex items-center justify-center gap-1 mb-1 text-[9px] font-mono uppercase tracking-wider text-brand-offwhite/40">
        {icon}
        {label}
      </div>
      <div className="text-lg font-serif font-bold text-brand-offwhite">{value}</div>
    </div>
  );
}
