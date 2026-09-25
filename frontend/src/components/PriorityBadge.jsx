import React from 'react';

export function PriorityBadge({ priority, className = '' }) {
  const configs = {
    High: {
      bg: 'bg-red-50/80 text-red-700 border-red-200/80',
      dot: 'bg-red-500',
    },
    Medium: {
      bg: 'bg-amber-50/80 text-amber-700 border-amber-200/80',
      dot: 'bg-amber-500',
    },
    Low: {
      bg: 'bg-emerald-50/80 text-emerald-700 border-emerald-200/80',
      dot: 'bg-emerald-500',
    },
  };

  const config = configs[priority] || {
    bg: 'bg-slate-50 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-tight shadow-2xs transition-colors ${config.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{priority}</span>
    </span>
  );
}
