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
      card: 'border-slate-200/90 hover:border-slate-300',
      iconBox: 'bg-slate-100 text-slate-700',
      iconColor: 'text-slate-600',
    },
    primary: {
      card: 'border-slate-200/90 hover:border-blue-300',
      iconBox: 'bg-blue-50 text-blue-600',
      iconColor: 'text-blue-600',
    },
    warning: {
      card: 'border-slate-200/90 hover:border-amber-300',
      iconBox: 'bg-amber-50 text-amber-600',
      iconColor: 'text-amber-600',
    },
    success: {
      card: 'border-slate-200/90 hover:border-emerald-300',
      iconBox: 'bg-emerald-50 text-emerald-600',
      iconColor: 'text-emerald-600',
    },
    info: {
      card: 'border-slate-200/90 hover:border-cyan-300',
      iconBox: 'bg-cyan-50 text-cyan-600',
      iconColor: 'text-cyan-600',
    },
  };

  const style = variantStyles[variant] || variantStyles.default;

  const cardClasses = `relative p-3.5 sm:p-5 rounded-2xl border bg-white shadow-premium-sm hover:shadow-premium-hover transition-all duration-200 hover:-translate-y-0.5 group flex flex-col justify-between ${style.card} ${href ? 'cursor-pointer' : ''}`;

  const content = (
    <>
      <div className="flex items-center gap-2.5 sm:gap-3.5 mb-1.5 sm:mb-2">
        <div
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${style.iconBox}`}
        >
          {React.cloneElement(icon, { className: 'w-4 h-4 sm:w-5 sm:h-5' })}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] sm:text-xs font-bold text-slate-500 tracking-tight truncate">
            {title}
          </p>
          <p className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-none mt-0.5">
            {count}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-1.5 pt-1.5 sm:mt-2 sm:pt-2 border-t border-slate-100 text-xs text-slate-500">
        <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 truncate">
          {trend || 'Active'}
        </span>
        {typeof progressPercent === 'number' && (
          <div className="w-8 sm:w-10 bg-slate-100 rounded-full h-1 sm:h-1.5 overflow-hidden shrink-0 ml-1.5 sm:ml-2">
            <div
              className={`h-full rounded-full ${
                variant === 'success'
                  ? 'bg-emerald-500'
                  : variant === 'warning'
                  ? 'bg-amber-500'
                  : 'bg-blue-600'
              }`}
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

