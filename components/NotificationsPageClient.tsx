'use client';
import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Bell, Check, Trash2, Trophy, Crown, Sparkles, Flame, Award, AlertTriangle, Filter, Inbox } from 'lucide-react';
import { useNotifications, type NotificationData, type NotificationType } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'unread' | 'ranking' | 'progress' | 'social';

const FILTERS: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'unread', label: 'No leídas' },
  { id: 'ranking', label: 'Ranking' },
  { id: 'progress', label: 'Progreso' },
  { id: 'social', label: 'Social' },
];

function getIcon(type: NotificationType) {
  switch (type) {
    case 'level_up':
    case 'xp':
      return Sparkles;
    case 'rank_up':
    case 'top10':
      return Trophy;
    case 'overtaken':
    case 'warning':
      return AlertTriangle;
    case 'weekly_reset':
      return Crown;
    case 'relic_unlocked':
    case 'achievement':
      return Award;
    case 'streak':
      return Flame;
    default:
      return Bell;
  }
}

function getColor(type: NotificationType) {
  switch (type) {
    case 'level_up':
    case 'xp':
      return 'text-brand-gold bg-brand-gold/10 border-brand-gold/20';
    case 'rank_up':
    case 'top10':
      return 'text-brand-cosmic bg-brand-cosmic/10 border-brand-cosmic/20';
    case 'overtaken':
    case 'warning':
      return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
    case 'weekly_reset':
      return 'text-brand-cosmic bg-brand-cosmic/10 border-brand-cosmic/20';
    case 'relic_unlocked':
    case 'achievement':
      return 'text-brand-gold bg-brand-gold/10 border-brand-gold/20';
    case 'streak':
      return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
    default:
      return 'text-brand-offwhite/60 bg-white/5 border-white/10';
  }
}

function matchesFilter(notification: NotificationData, filter: FilterType): boolean {
  if (filter === 'all') return true;
  if (filter === 'unread') return !notification.read;
  if (filter === 'ranking') return ['rank_up', 'top10', 'overtaken', 'weekly_reset'].includes(notification.type);
  if (filter === 'progress') return ['level_up', 'xp', 'relic_unlocked', 'achievement', 'streak'].includes(notification.type);
  if (filter === 'social') return false;
  return true;
}

function getDateGroup(timestamp: any): string {
  if (!timestamp) return 'Anterior';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - today.getDay());

  const notifDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (notifDate.getTime() === today.getTime()) return 'Hoy';
  if (notifDate.getTime() === yesterday.getTime()) return 'Ayer';
  if (notifDate.getTime() >= weekStart.getTime()) return 'Esta semana';
  return 'Anterior';
}

function timeAgo(timestamp: any): string {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'ahora';
  if (diffMins < 60) return `hace ${diffMins}m`;
  if (diffHours < 24) return `hace ${diffHours}h`;
  if (diffDays < 7) return `hace ${diffDays}d`;
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

function NotificationCard({
  notification,
  onMarkRead,
  onDelete,
}: {
  notification: NotificationData;
  onMarkRead: () => void;
  onDelete: () => void;
}) {
  const Icon = getIcon(notification.type);
  const colorClasses = getColor(notification.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer",
        notification.read
          ? "bg-transparent border-white/5 hover:bg-white/5"
          : "bg-brand-gold/5 border-brand-gold/20 hover:bg-brand-gold/10"
      )}
      onClick={onMarkRead}
    >
      <div className={cn("shrink-0 w-10 h-10 rounded-lg border flex items-center justify-center", colorClasses)}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className={cn(
            "font-serif font-bold text-sm",
            notification.read ? "text-brand-offwhite/70" : "text-brand-offwhite"
          )}>
            {notification.title}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            {!notification.read && (
              <button
                onClick={(e) => { e.stopPropagation(); onMarkRead(); }}
                className="p-1.5 rounded-lg text-brand-offwhite/40 hover:text-brand-gold hover:bg-brand-gold/10 transition-all"
                title="Marcar como leída"
              >
                <Check size={14} />
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-1.5 rounded-lg text-brand-offwhite/40 hover:text-orange-400 hover:bg-orange-400/10 transition-all"
              title="Eliminar"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        <div className="text-xs text-brand-offwhite/50 mt-1 leading-relaxed">
          {notification.message}
        </div>
        <div className="text-[10px] font-mono text-brand-offwhite/30 mt-2">
          {timeAgo(notification.createdAt)}
        </div>
      </div>
    </motion.div>
  );
}

export function NotificationsPageClient() {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllRead, deleteNotification, isLoading } = useNotifications();
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = useMemo(() => {
    return notifications.filter((n) => matchesFilter(n, filter));
  }, [notifications, filter]);

  const grouped = useMemo(() => {
    const groups: Record<string, NotificationData[]> = {};
    filtered.forEach((n) => {
      const group = getDateGroup(n.createdAt);
      if (!groups[group]) groups[group] = [];
      groups[group].push(n);
    });
    return groups;
  }, [filtered]);

  const groupOrder = ['Hoy', 'Ayer', 'Esta semana', 'Anterior'];

  if (!user) {
    return (
      <div className="min-h-[70vh] bg-brand-ink flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-brand-ink border border-brand-gold/30 rounded-3xl p-8 text-center"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl border border-brand-gold/40 bg-brand-gold/10 flex items-center justify-center mb-4">
            <Bell size={28} className="text-brand-gold" />
          </div>
          <h1 className="font-serif text-2xl text-brand-offwhite mb-2">Notificaciones</h1>
          <p className="text-sm text-brand-offwhite/60 font-serif">
            Inicia sesión para ver tus notificaciones de progreso, ranking y logros.
          </p>
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
            <Bell size={24} className="text-brand-gold" />
            <h1 className="font-serif text-3xl text-brand-offwhite">Notificaciones</h1>
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-brand-gold text-brand-ink text-[10px] font-mono font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          <p className="text-sm text-brand-offwhite/60 font-serif">
            Tu historial de progreso, logros y ranking.
          </p>
        </motion.div>

        {/* Filtros */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "px-4 py-2 rounded-xl border text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                filter === f.id
                  ? "bg-brand-gold text-brand-ink border-brand-gold"
                  : "bg-white/5 text-brand-offwhite/70 border-white/10 hover:text-brand-gold"
              )}
            >
              {f.label}
            </button>
          ))}
          {unreadCount > 0 && (
            <button
              onClick={() => markAllRead()}
              className="ml-auto px-4 py-2 rounded-xl border border-brand-gold/30 text-brand-gold text-[10px] font-mono font-bold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-ink transition-all"
            >
              Marcar todo leído
            </button>
          )}
        </div>

        {/* Lista agrupada */}
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-white/5 border border-white/5" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Inbox size={40} className="mx-auto text-brand-offwhite/20 mb-4" />
            <p className="text-lg text-brand-offwhite/50 font-serif">
              {filter === 'all' ? 'Sin notificaciones aún' : 'Sin notificaciones en esta categoría'}
            </p>
            <p className="text-sm text-brand-offwhite/30 font-serif mt-2">
              {filter === 'all' ? 'Completa artículos y sube en el ranking para recibir notificaciones.' : 'Prueba con otro filtro.'}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {groupOrder.map((group) => {
              const items = grouped[group];
              if (!items || items.length === 0) return null;
              return (
                <div key={group}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-brand-gold/60">
                      {group}
                    </span>
                    <div className="flex-1 border-t border-brand-gold/10" />
                    <span className="text-[9px] font-mono text-brand-offwhite/30">
                      {items.length} {items.length === 1 ? 'notificación' : 'notificaciones'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {items.map((n) => (
                      <NotificationCard
                        key={n.id}
                        notification={n}
                        onMarkRead={() => n.id && markAsRead(n.id)}
                        onDelete={() => n.id && deleteNotification(n.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
