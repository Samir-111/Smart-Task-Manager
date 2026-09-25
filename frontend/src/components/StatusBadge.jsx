import React from 'react';
import { Clock, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';

export function StatusBadge({ status, isBlocked, className = '' }) {
  if (isBlocked && status !== 'Done') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300/80 shadow-2xs ${className}`}
      >
        <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0 animate-pulse" />
        <span>Blocked</span>
      </span>
    );
  }

  const configs = {
    'To Do': {
      label: 'To Do',
      icon: <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />,
      style: 'bg-slate-100/90 text-slate-700 border-slate-200/90',
    },
    'In Progress': {
      label: 'In Progress',
      icon: <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping mr-0.5" />,
      style: 'bg-blue-50/90 text-blue-700 border-blue-200/90',
    },
    'Done': {
      label: 'Done',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
      style: 'bg-emerald-50/90 text-emerald-700 border-emerald-200/90',
    },
  };

  const config = configs[status] || configs['To Do'];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-tight shadow-2xs ${config.style} ${className}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
}
