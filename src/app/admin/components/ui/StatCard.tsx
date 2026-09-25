'use client';
import React from 'react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { Card } from './Card';

export interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone?: 'orange' | 'blue' | 'green' | 'purple' | 'pink';
  trendPercent?: number;
  caption?: string;
  sparkline?: number[];
}

const TONES: Record<NonNullable<StatCardProps['tone']>, string> = {
  orange: 'bg-primary/10 text-primary',
  blue: 'bg-[#238DFB]/10 text-[#238DFB]',
  green: 'bg-emerald-500/10 text-emerald-600',
  purple: 'bg-violet-500/10 text-violet-600',
  pink: 'bg-pink-500/10 text-pink-600',
};

export default function StatCard({
  label,
  value,
  icon,
  tone = 'orange',
  trendPercent,
  caption,
  sparkline,
}: StatCardProps) {
  const hasTrend = typeof trendPercent === 'number';
  const isPositive = (trendPercent ?? 0) >= 0;

  return (
    <Card className="flex flex-col gap-4" padding="p-4 sm:p-5">
      <div className="flex items-start justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${TONES[tone]}`}>{icon}</span>
        {hasTrend && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
              isPositive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
            }`}>
            {isPositive ? '↑' : '↓'} {Math.abs(trendPercent as number)}%
          </span>
        )}
      </div>

      <div>
        <span className="text-xs font-semibold text-muted-foreground">{label}</span>
        <div className="mt-1 flex items-end justify-between gap-2">
          <strong className="font-display font-black text-2xl sm:text-3xl text-foreground leading-none">
            {value}
          </strong>
          {sparkline && sparkline.length > 1 && (
            <div className="h-8 w-16 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkline.map((v, i) => ({ i, v }))}>
                  <defs>
                    <linearGradient id={`spark-${label.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="currentColor" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    fill={`url(#spark-${label.replace(/\s+/g, '')})`}
                    className={TONES[tone].split(' ')[1]}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        {caption && <span className="mt-1 block text-[11px] text-muted-foreground">{caption}</span>}
      </div>
    </Card>
  );
}
