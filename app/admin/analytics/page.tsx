'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Award, 
  BookOpen, 
  Flame, 
  Gem,
  Trophy,
  Target,
  BarChart3,
  Activity,
  Loader2,
  Calendar,
  Star
} from 'lucide-react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
  AreaChart, Area
} from 'recharts';

interface UserProgress {
  uid: string;
  xp: number;
  level: number;
  dailyStreak: number;
  lastActiveDate: string;
  achievements: string[];
  completedPaths: string[];
  completedLayers?: Record<string, string[]>;
  physicsRelics: string[];
  answeredQuestions: string[];
  weeklyXp?: number;
  weeklyResetDate?: string;
  articleProgress?: Record<string, number>;
  alias?: string;
  displayName?: string;
}

function StatCard({ title, value, icon: Icon, color, bgColor, subtitle, index }: {
  title: string; value: string | number; icon: any; color: string; bgColor: string; subtitle?: string; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white/5 border border-white/10 rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`${bgColor} p-2.5 rounded-lg`}>
          <Icon size={20} className={color} />
        </div>
      </div>
      <p className="text-white/60 text-sm">{title}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
      {subtitle && <p className="text-white/40 text-xs mt-1">{subtitle}</p>}
    </motion.div>
  );
}

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f43f5e', '#84cc16'];

const LEVEL_DISTRIBUTION = [
  { range: '1-5', min: 1, max: 5 },
  { range: '6-10', min: 6, max: 10 },
  { range: '11-20', min: 11, max: 20 },
  { range: '21-30', min: 21, max: 30 },
  { range: '31-50', min: 31, max: 50 },
  { range: '50+', min: 51, max: 999 },
];

const ACHIEVEMENT_NAMES: Record<string, string> = {
  first_steps: 'Primer Paso',
  first_blood: 'Primera Sangre',
  reader: 'Lector Voraz',
  streak_3: 'Llama Naciente',
  streak_7: 'Fuego Inextinguible',
  level_5: 'Aprendiz Avanzado',
  critical_mind: 'Mente Crítica',
  explorer: 'Explorador',
  fisica_primer_hallazgo: 'Primera Reliquia',
  fisica_cazador_reliquias: 'Cazador Reliquias',
  fisica_coleccionista: 'Coleccionista Cosmos',
  fisica_capa_asimilada: 'Capa Asimilada',
};

export default function AdminAnalyticsPage() {
  const [users, setUsers] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    try {
      const q = query(collection(db, 'aeternaProgressV3'));
      const snapshot = await getDocs(q);
      const data: UserProgress[] = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data(),
      })) as UserProgress[];
      setUsers(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Error al cargar datos de analytics');
    } finally {
      setLoading(false);
    }
  }

  const stats = useMemo(() => {
    if (users.length === 0) return null;

    const totalUsers = users.length;
    const totalXP = users.reduce((sum, u) => sum + (u.xp || 0), 0);
    const avgLevel = users.reduce((sum, u) => sum + (u.level || 0), 0) / totalUsers;
    const avgStreak = users.reduce((sum, u) => sum + (u.dailyStreak || 0), 0) / totalUsers;
    const maxStreak = Math.max(...users.map(u => u.dailyStreak || 0));
    const totalArticles = users.reduce((sum, u) => {
      const completed = (u.completedPaths || []).filter(p => p.startsWith('article_read_'));
      return sum + completed.length;
    }, 0);
    const totalAchievements = users.reduce((sum, u) => sum + (u.achievements?.length || 0), 0);
    const totalRelics = users.reduce((sum, u) => sum + (u.physicsRelics?.length || 0), 0);
    const totalQuestions = users.reduce((sum, u) => sum + (u.answeredQuestions?.length || 0), 0);
    const weeklyXP = users.reduce((sum, u) => sum + (u.weeklyXp || 0), 0);

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const yesterday = new Date(now.getTime() - 86400000).toISOString().split('T')[0];
    const lastWeek = new Date(now.getTime() - 7 * 86400000).toISOString().split('T')[0];

    const dau = users.filter(u => u.lastActiveDate === today).length;
    const wau = users.filter(u => u.lastActiveDate >= lastWeek).length;

    return {
      totalUsers, totalXP, avgLevel: Math.round(avgLevel * 10) / 10,
      avgStreak: Math.round(avgStreak * 10) / 10, maxStreak,
      totalArticles, totalAchievements, totalRelics, totalQuestions,
      weeklyXP, dau, wau,
    };
  }, [users]);

  const levelDistribution = useMemo(() => {
    return LEVEL_DISTRIBUTION.map(range => ({
      name: range.range,
      count: users.filter(u => {
        const level = u.level || 0;
        return level >= range.min && level <= range.max;
      }).length,
    }));
  }, [users]);

  const topUsers = useMemo(() => {
    return [...users]
      .sort((a, b) => (b.xp || 0) - (a.xp || 0))
      .slice(0, 10)
      .map((u, i) => ({
        name: u.alias || u.displayName || `User ${u.uid.slice(0, 6)}`,
        xp: u.xp || 0,
        level: u.level || 0,
        rank: i + 1,
      }));
  }, [users]);

  const achievementDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    users.forEach(u => {
      (u.achievements || []).forEach(a => {
        counts[a] = (counts[a] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([id, count]) => ({
        name: ACHIEVEMENT_NAMES[id] || id,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [users]);

  const streakDistribution = useMemo(() => {
    const buckets = [
      { name: '0', min: 0, max: 0 },
      { name: '1-2', min: 1, max: 2 },
      { name: '3-6', min: 3, max: 6 },
      { name: '7-14', min: 7, max: 14 },
      { name: '15-30', min: 15, max: 30 },
      { name: '30+', min: 31, max: 9999 },
    ];
    return buckets.map(b => ({
      name: b.name,
      count: users.filter(u => {
        const s = u.dailyStreak || 0;
        return s >= b.min && s <= b.max;
      }).length,
    }));
  }, [users]);

  const articlePopularity = useMemo(() => {
    const counts: Record<string, number> = {};
    users.forEach(u => {
      const completed = (u.completedPaths || []).filter(p => p.startsWith('article_read_'));
      completed.forEach(p => {
        const slug = p.replace('article_read_', '');
        counts[slug] = (counts[slug] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([slug, count]) => ({ slug, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [users]);

  const xpBuckets = useMemo(() => {
    const buckets = [
      { name: '0-500', min: 0, max: 500 },
      { name: '500-2k', min: 500, max: 2000 },
      { name: '2k-5k', min: 2000, max: 5000 },
      { name: '5k-10k', min: 5000, max: 10000 },
      { name: '10k-25k', min: 10000, max: 25000 },
      { name: '25k+', min: 25000, max: Infinity },
    ];
    return buckets.map(b => ({
      name: b.name,
      count: users.filter(u => {
        const xp = u.xp || 0;
        return xp >= b.min && xp < b.max;
      }).length,
    }));
  }, [users]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <BarChart3 size={32} className="text-indigo-400" />
          Analytics de Uso
        </h1>
        <p className="text-white/60 mt-2">
          Métricas de actividad y progreso de {stats?.totalUsers || 0} usuarios
        </p>
      </motion.div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <StatCard title="Usuarios" value={stats?.totalUsers || 0} icon={Users} color="text-blue-400" bgColor="bg-blue-500/10" index={0} />
        <StatCard title="DAU" value={stats?.dau || 0} icon={Activity} color="text-green-400" bgColor="bg-green-500/10" subtitle={`WAU: ${stats?.wau || 0}`} index={1} />
        <StatCard title="XP Total" value={stats ? formatNumber(stats.totalXP) : 0} icon={TrendingUp} color="text-purple-400" bgColor="bg-purple-500/10" subtitle={`Semanal: ${stats ? formatNumber(stats.weeklyXP || 0) : 0}`} index={2} />
        <StatCard title="Nivel Promedio" value={stats?.avgLevel || 0} icon={Star} color="text-amber-400" bgColor="bg-amber-500/10" index={3} />
        <StatCard title="Racha Promedio" value={stats?.avgStreak || 0} icon={Flame} color="text-orange-400" bgColor="bg-orange-500/10" subtitle={`Max: ${stats?.maxStreak || 0}`} index={4} />
        <StatCard title="Artículos Leídos" value={stats?.totalArticles || 0} icon={BookOpen} color="text-cyan-400" bgColor="bg-cyan-500/10" index={5} />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Logros Desbloqueados" value={stats?.totalAchievements || 0} icon={Award} color="text-yellow-400" bgColor="bg-yellow-500/10" index={6} />
        <StatCard title="Reliquias Recogidas" value={stats?.totalRelics || 0} icon={Gem} color="text-pink-400" bgColor="bg-pink-500/10" index={7} />
        <StatCard title="Preguntas Respondidas" value={stats?.totalQuestions || 0} icon={Target} color="text-teal-400" bgColor="bg-teal-500/10" index={8} />
        <StatCard title="Trophies" value={users.filter(u => (u.physicsRelics?.length || 0) === 4).length} icon={Trophy} color="text-amber-400" bgColor="bg-amber-500/10" subtitle="Coleccionistas completos" index={9} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Level Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4">Distribución por Nivel</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={levelDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* XP Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4">Distribución por XP</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={xpBuckets}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="count" fill="#8b5cf6" stroke="#8b5cf6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Streak Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 border border-white/10 rounded-xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4">Distribución de Rachas</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={streakDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Achievement Popularity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 border border-white/10 rounded-xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4">Logros Más Desbloqueados</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={achievementDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" stroke="rgba(255,255,255,0.4)" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.4)" fontSize={11} width={120} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Article Popularity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 border border-white/10 rounded-xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4">Artículos Más Leídos</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={articlePopularity}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="slug" stroke="rgba(255,255,255,0.4)" fontSize={10} angle={-45} textAnchor="end" height={60} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/5 border border-white/10 rounded-xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4">Top 10 Usuarios por XP</h3>
          <div className="space-y-2">
            {topUsers.map((user, idx) => (
              <div key={idx} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    idx === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                    idx === 1 ? 'bg-gray-400/20 text-gray-300' :
                    idx === 2 ? 'bg-orange-500/20 text-orange-400' :
                    'bg-white/5 text-white/40'
                  }`}>
                    {user.rank}
                  </span>
                  <span className="text-white/80 text-sm truncate max-w-[150px]">{user.name}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-purple-400 font-mono">{formatNumber(user.xp)} XP</span>
                  <span className="text-white/40">Nv.{user.level}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}
