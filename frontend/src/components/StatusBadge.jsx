import React from 'react';
import { Clock, CheckCircle2, ShieldAlert } from 'lucide-react';

export function StatusBadge({ status, isBlocked, className = '' }) {
  if (isBlocked && status !== 'Done') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEF3C7] dark:bg-amber-950/60 text-[#92400E] dark:text-amber-300 shadow-2xs ${className}`}
      >
        <ShieldAlert className="w-3 h-3 text-[#92400E] dark:text-amber-400 shrink-0" />
        <span>Blocked</span>
      </span>
    );
  }

  const configs = {
    'To Do': {
      label: 'To Do',
      icon: <Clock className="w-3 h-3 text-[#475569] dark:text-slate-400 shrink-0" />,
      style: 'bg-[#F1F5F9] dark:bg-slate-800 text-[#475569] dark:text-slate-300',
    },
    'In Progress': {
      label: 'In Progress',
      icon: <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] animate-pulse shrink-0" />,
      style: 'bg-[#E0F2FE] dark:bg-sky-950/60 text-[#0369A1] dark:text-sky-300',
    },
    'Done': {
      label: 'Done',
      icon: <CheckCircle2 className="w-3 h-3 text-[#137333] dark:text-emerald-400 shrink-0" />,
      style: 'bg-[#E6F4EA] dark:bg-emerald-950/60 text-[#137333] dark:text-emerald-300',
    },
  };

  const config = configs[status] || configs['To Do'];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-tight shadow-2xs ${config.style} ${className}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
}
