'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, LabelList
} from 'recharts';
import { BarChart3 } from 'lucide-react';

export interface DataPoint {
  x: string | number;
  y: number;
}

export interface VisualDataProps {
  id?: string;
  title?: string;
  type?: 'scatter' | 'bar' | 'line';
  description?: string;
  dataPoints?: DataPoint[];
  realValue?: number;
}

export function VisualData({
  id,
  title = 'Visualización de Datos',
  type = 'scatter',
  description,
  dataPoints = [],
  realValue
}: VisualDataProps) {
  if (!dataPoints || dataPoints.length === 0) return null;

  const grouped = dataPoints.reduce<Record<string, DataPoint[]>>((acc, pt) => {
    const key = String(pt.x);
    if (!acc[key]) acc[key] = [];
    acc[key].push(pt);
    return acc;
  }, {});

  const colors = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#ec4899', '#06b6d4'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      id={id}
      className="my-12 rounded-none bg-[#FAF8FF] dark:bg-[#0F0B1E] border-4 border-cyan-600 dark:border-cyan-400 p-5 md:p-8 shadow-[8px_8px_0px_0px_#0891B2] dark:shadow-[8px_8px_0px_0px_#22D3EE] relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40" />

      <div className="relative flex items-center gap-3 border-b-4 border-cyan-600/30 dark:border-cyan-400/30 pb-5 mb-6">
        <div className="w-10 h-10 rounded-none bg-cyan-600 text-white dark:bg-cyan-400 dark:text-black flex items-center justify-center border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF] shrink-0">
          <BarChart3 size={20} />
        </div>
        <h3 className="font-mono text-xl md:text-2xl font-black uppercase text-brand-ink dark:text-white leading-tight">
          {title}
        </h3>
      </div>

      {description && (
        <p className="relative font-sans text-sm md:text-base text-slate-700 dark:text-slate-300 mb-6 max-w-3xl leading-relaxed">
          {description}
        </p>
      )}

      <div className="relative bg-white dark:bg-[#18122B] border-3 border-cyan-300 dark:border-cyan-800 p-3 md:p-4">
        <ResponsiveContainer width="100%" height={320}>
          <ScatterChart margin={{ top: 10, right: 30, bottom: 10, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="x"
              type="category"
              stroke="#64748b"
              tick={{ fontSize: 12, fontFamily: 'monospace' }}
            />
            <YAxis
              dataKey="y"
              stroke="#64748b"
              tick={{ fontSize: 12, fontFamily: 'monospace' }}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                fontFamily: 'monospace',
                fontSize: 12,
                border: '2px solid #0891B2',
                borderRadius: 0,
                background: '#FAF8FF'
              }}
            />
            {realValue !== undefined && (
              <ReferenceLine
                y={realValue}
                stroke="#ef4444"
                strokeDasharray="6 3"
                strokeWidth={2}
                label={{
                  value: `Valor real: ${realValue}`,
                  position: 'right',
                  fill: '#ef4444',
                  fontFamily: 'monospace',
                  fontSize: 11
                }}
              />
            )}
            {Object.entries(grouped).map(([group, points], idx) => (
              <Scatter
                key={group}
                name={group}
                data={points}
                fill={colors[idx % colors.length]}
                stroke="#000"
                strokeWidth={1.5}
                shape="circle"
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
