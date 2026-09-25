import React from 'react';
import Link from 'next/link';

export function StatsCard({
  title,
  count,
  icon,
  variant = 'default',
  trend,
  progressPercent,
  href,
}) {
  const variantStyles = {
    default: {
      iconBox: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
      bar: 'bg-slate-500',
    },
    primary: {
      iconBox: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400',
      bar: 'bg-indigo-600',
    },
    warning: {
      iconBox: 'bg-[#FEF3C7] dark:bg-amber-950/60 text-[#D97706] dark:text-amber-400',
      bar: 'bg-[#D97706]',
    },
    success: {
      iconBox: 'bg-[#E6F4EA] dark:bg-emerald-950/60 text-[#137333] dark:text-emerald-400',
      bar: 'bg-[#10B981]',
    },
    info: {
      iconBox: 'bg-[#E0F2FE] dark:bg-sky-950/60 text-[#0284C7] dark:text-sky-400',
      bar: 'bg-[#0284C7]',
    },
  };

  const style = variantStyles[variant] || variantStyles.default;

  const cardClasses = `relative p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/90 dark:border-slate-800 hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] transition-all duration-200 hover:-translate-y-0.5 group flex flex-col justify-between ${href ? 'cursor-pointer' : ''}`;

  const content = (
    <>
      <div className="flex items-center gap-3 sm:gap-3.5 mb-2">
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${style.iconBox}`}
        >
          {React.cloneElement(icon, { className: 'w-4 h-4 sm:w-5 sm:h-5' })}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate">
            {title}
          </p>
          <p className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none mt-1">
            {count}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <span className="text-[11px] font-medium truncate">
          {trend || 'Active'}
        </span>
        {typeof progressPercent === 'number' && (
          <div className="w-10 sm:w-12 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden shrink-0 ml-2">
            <div
              className={`h-full rounded-full transition-all duration-300 ${style.bar}`}
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cardClasses}>
        {content}
      </Link>
    );
  }

  return <div className={cardClasses}>{content}</div>;
}

