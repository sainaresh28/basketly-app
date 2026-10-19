import React from 'react';
import AppIcon from '@/components/ui/AppIcon';
import type { OrderStatus } from '@/types';

const TONE = {
  primary: { dot: 'bg-primary', line: 'bg-primary', text: 'text-foreground' },
  sky: { dot: 'bg-sky-500', line: 'bg-sky-500', text: 'text-foreground' },
  red: { dot: 'bg-red-500', line: 'bg-red-500', text: 'text-foreground' },
} as const;

export default function OrderProgressTrack({ status }: { status: OrderStatus }) {
  let steps: string[];
  let filled: number;
  let tone: keyof typeof TONE;

  if (status === 'cancelled') {
    steps = ['Ordered', 'Paid', 'Processing', 'Shipped'];
    filled = 0;
    tone = 'red';
  } else if (status === 'shipped' || status === 'delivered') {
    steps = ['Ordered', 'Paid', 'Shipped', 'Delivered'];
    filled = status === 'shipped' ? 2 : 3;
    tone = status === 'shipped' ? 'sky' : 'primary';
  } else {
    steps = ['Ordered', 'Paid', 'Processing', 'Shipped'];
    filled = status === 'pending' ? 0 : status === 'paid' ? 1 : 2;
    tone = 'primary';
  }

  const c = TONE[tone];

  return (
    <div className="flex items-center">
      {steps.map((label, idx) => {
        const done = idx <= filled;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  done ? c.dot : 'bg-muted'
                }`}
              >
                {done && <AppIcon name="CheckIcon" size={12} className="text-white" />}
              </div>
              <span className={`text-[10px] font-semibold uppercase tracking-wide ${done ? c.text : 'text-muted-foreground'}`}>
                {label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1.5 -mt-4 ${idx < filled ? c.line : 'bg-muted'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
