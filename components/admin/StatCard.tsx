'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface Stat {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const Icon = stat.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.2, type: "spring" }}
            className={`${stat.bgColor} p-3 rounded-lg`}
          >
            <Icon className={stat.color} size={24} />
          </motion.div>
          <ArrowUpRight size={16} className="text-white/40 group-hover:text-white/80 transition-colors" />
        </div>
        <div>
          <p className="text-white/60 text-sm">{stat.title}</p>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
            className="text-2xl font-bold text-white mt-1"
          >
            {stat.value}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
