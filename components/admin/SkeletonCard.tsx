'use client';

export function SkeletonCard() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-white/10 rounded-lg" />
        <div className="w-4 h-4 bg-white/10 rounded" />
      </div>
      <div className="space-y-2">
        <div className="w-20 h-3 bg-white/10 rounded" />
        <div className="w-16 h-6 bg-white/10 rounded" />
      </div>
    </div>
  );
}
