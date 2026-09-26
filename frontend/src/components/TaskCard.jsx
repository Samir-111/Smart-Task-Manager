import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';
import { Check, Edit3, Trash2, Link as LinkIcon, ShieldAlert, Calendar, Lock } from 'lucide-react';

export function TaskCard({
  task,
  onComplete,
  onDelete,
  isCompleting = false,
}) {
  const { user: currentUser } = useAuth();
  const isDone = task.status === 'Done';
  const isBlocked = task.isBlocked;
  const isAssignedToMe =
    currentUser &&
    (task.assignedUserId === currentUser.id ||
      task.assignedUser?.id === currentUser.id);

  // Format date nicely
  const formattedDate = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div
      className={`group relative overflow-hidden p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all duration-200 bg-white dark:bg-slate-900 flex flex-col justify-between ${
        isBlocked
          ? 'border-amber-300/80 dark:border-amber-900/60 bg-gradient-to-b from-white to-amber-50/20 dark:from-slate-900 dark:to-amber-950/20 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-amber-400'
          : isDone
          ? 'border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/60 shadow-2xs'
          : 'border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-premium-hover hover:border-slate-200 dark:hover:border-slate-700 hover:-translate-y-0.5'
      }`}
    >
      <div>
        {/* Card Header: Status & Priority Badges */}
        <div className="flex items-center justify-between gap-1.5 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <StatusBadge status={task.status} isBlocked={isBlocked} />
            <PriorityBadge priority={task.priority} />
          </div>

          {formattedDate && (
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-slate-400 dark:text-slate-500 shrink-0">
              <Calendar className="w-3 h-3 text-slate-400 dark:text-slate-500" />
              <span>{formattedDate}</span>
            </div>
          )}
        </div>

        {/* Task Title */}
        <h3
          className={`font-bold text-xs sm:text-sm md:text-base leading-snug mb-1 transition-colors ${
            isDone
              ? 'text-slate-500 dark:text-slate-400 font-semibold'
              : 'text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
          }`}
        >
          {task.title}
        </h3>

        {/* Task Description */}
        {task.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2.5 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Dependency Notice Box */}
        {task.dependsOnTask && (
          <div
            className={`mt-1.5 mb-2.5 p-2.5 rounded-xl border text-xs flex items-start gap-2 transition-colors ${
              isBlocked
                ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200/90 dark:border-amber-900/50 text-amber-950 dark:text-amber-300'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {isBlocked ? (
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <LinkIcon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className="font-semibold text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {isBlocked ? 'Blocked by' : 'Depends on'}
                </span>
                <span
                  className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${
                    task.dependsOnTask.status === 'Done'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                  }`}
                >
                  {task.dependsOnTask.status}
                </span>
              </div>
              <p className="font-medium text-xs text-slate-800 dark:text-slate-200 truncate">
                "{task.dependsOnTask.title}"
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Card Footer: Assignee & Action Buttons */}
      <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 mt-1">
        {/* Assignee Avatar/Name */}
        <div className="min-w-0 flex-1">
          {task.assignedUser ? (
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 px-2 py-0.5 rounded-full max-w-[140px]">
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-indigo-600 to-slate-900 text-white flex items-center justify-center text-[8px] font-bold shrink-0">
                {task.assignedUser.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium truncate text-[11px] text-slate-700 dark:text-slate-300">{task.assignedUser.name}</span>
            </div>
          ) : (
            <span className="text-[11px] text-slate-400 italic">Unassigned</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Complete Button */}
          {!isDone && onComplete && (
            isAssignedToMe ? (
              <button
                type="button"
                onClick={() => onComplete(task)}
                disabled={isBlocked || isCompleting}
                title={
                  isBlocked
                    ? `Waiting for prerequisite "${task.dependsOnTask?.title}"`
                    : 'Mark as complete'
                }
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isBlocked
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200/50 dark:border-slate-700/50'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white border border-emerald-200 dark:border-emerald-800 shadow-2xs active:scale-95'
                }`}
              >
                <Check className="w-3 h-3" />
                <span>Done</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={true}
                title={`Only ${task.assignedUser?.name || 'assigned owner'} can complete this task.`}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold bg-slate-100/80 dark:bg-slate-800/80 text-slate-400 border border-slate-200/60 dark:border-slate-700 cursor-not-allowed opacity-60"
              >
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Locked</span>
              </button>
            )
          )}

          {isDone && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 py-0.5 px-2 bg-[#E6F4EA] dark:bg-emerald-950/60 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <Check className="w-3 h-3" /> Done
            </span>
          )}

          {/* Edit Button */}
          <Link
            href={`/edit-task/${task.id}`}
            className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Edit task"
            aria-label="Edit task"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </Link>

          {/* Delete Button */}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(task)}
              className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
              title="Delete task"
              aria-label="Delete task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

