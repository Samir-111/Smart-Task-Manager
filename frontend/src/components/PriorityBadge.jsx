import React from 'react';

export function PriorityBadge({ priority, className = '' }) {
  const configs = {
    High: {
      bg: 'bg-[#FEE2E2] dark:bg-rose-950/60 text-[#991B1B] dark:text-rose-300',
      dot: 'bg-[#DC2626]',
    },
    Medium: {
      bg: 'bg-[#FEF3C7] dark:bg-amber-950/60 text-[#92400E] dark:text-amber-300',
      dot: 'bg-[#D97706]',
    },
    Low: {
      bg: 'bg-[#ECFDF5] dark:bg-emerald-950/60 text-[#065F46] dark:text-emerald-300',
      dot: 'bg-[#059669]',
    },
  };

  const config = configs[priority] || {
    bg: 'bg-[#F1F5F9] dark:bg-slate-800 text-[#475569] dark:text-slate-300',
    dot: 'bg-[#64748B]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-tight shadow-2xs transition-colors ${config.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{priority}</span>
    </span>
  );
}
