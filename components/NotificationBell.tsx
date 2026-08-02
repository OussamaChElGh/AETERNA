'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, Trash2, Trophy, Crown, Sparkles, Flame, Award, AlertTriangle } from 'lucide-react';
import { useNotifications, type NotificationData, type NotificationType } from '@/context/NotificationContext';
import { cn } from '@/lib/utils';

function getIcon(type: NotificationType) {
  switch (type) {
    case 'level_up':
      return Sparkles;
    case 'rank_up':
      return Trophy;
    case 'overtaken':
      return AlertTriangle;
    case 'weekly_reset':
      return Crown;
    case 'relic_unlocked':
      return Award;
    case 'top10':
      return Trophy;
    case 'achievement':
      return Award;
    case 'streak':
      return Flame;
    case 'xp':
      return Sparkles;
    case 'warning':
      return AlertTriangle;
    default:
      return Bell;
  }
}

function getColor(type: NotificationType) {
  switch (type) {
    case 'level_up':
    case 'xp':
      return 'text-brand-gold';
    case 'rank_up':
    case 'top10':
      return 'text-brand-cosmic';
    case 'overtaken':
    case 'warning':
      return 'text-orange-400';
    case 'weekly_reset':
      return 'text-brand-cosmic';
    case 'relic_unlocked':
    case 'achievement':
      return 'text-brand-gold';
    case 'streak':
      return 'text-orange-400';
    default:
      return 'text-brand-offwhite/60';
  }
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

function NotificationRow({
  notification,
  onMarkRead,
  onDelete,
}: {
  notification: NotificationData;
  onMarkRead: () => void;
  onDelete: () => void;
}) {
  const Icon = getIcon(notification.type);
  const color = getColor(notification.type);

  return (
    <div
      className={cn(
        "group flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer",
        notification.read ? "bg-transparent hover:bg-white/5" : "bg-brand-gold/5 hover:bg-brand-gold/10"
      )}
      onClick={onMarkRead}
    >
      <div className={cn("mt-0.5 shrink-0", color)}>
        <Icon size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <div className={cn(
          "text-xs font-serif font-bold truncate",
          notification.read ? "text-brand-offwhite/70" : "text-brand-offwhite"
        )}>
          {notification.title}
        </div>
        <div className="text-[10px] text-brand-offwhite/50 line-clamp-2 mt-0.5">
          {notification.message}
        </div>
        <div className="text-[9px] font-mono text-brand-offwhite/30 mt-1">
          {timeAgo(notification.createdAt)}
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {!notification.read && (
          <button
            onClick={(e) => { e.stopPropagation(); onMarkRead(); }}
            className="p-1 rounded text-brand-offwhite/40 hover:text-brand-gold transition-colors"
            title="Marcar como leída"
          >
            <Check size={12} />
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-1 rounded text-brand-offwhite/40 hover:text-orange-400 transition-colors"
          title="Eliminar"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllRead, deleteNotification, isLoading } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const recent = notifications.slice(0, 5);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg border border-white/10 text-brand-offwhite/50 hover:text-brand-gold hover:border-brand-gold/30 transition-all"
        title="Notificaciones"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-brand-gold text-brand-ink text-[9px] font-mono font-bold flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-brand-ink border border-brand-gold/20 rounded-xl shadow-2xl z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-brand-gold/10">
            <h3 className="font-serif text-sm text-brand-offwhite font-bold">Notificaciones</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead()}
                className="text-[9px] font-mono uppercase tracking-wider text-brand-gold/60 hover:text-brand-gold transition-colors"
              >
                Marcar todo leído
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="space-y-2 p-3 animate-pulse">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-14 rounded-lg bg-white/5" />
                ))}
              </div>
            ) : recent.length === 0 ? (
              <div className="py-12 text-center">
                <Bell size={24} className="mx-auto text-brand-offwhite/20 mb-2" />
                <p className="text-[11px] text-brand-offwhite/40 font-serif">
                  Sin notificaciones
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {recent.map((n) => (
                  <NotificationRow
                    key={n.id}
                    notification={n}
                    onMarkRead={() => n.id && markAsRead(n.id)}
                    onDelete={() => n.id && deleteNotification(n.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {notifications.length > 5 && (
            <div className="px-4 py-2 border-t border-brand-gold/10">
              <a
                href="/notificaciones"
                className="block text-center text-[10px] font-mono uppercase tracking-wider text-brand-gold/60 hover:text-brand-gold transition-colors"
              >
                Ver todas ({notifications.length})
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
