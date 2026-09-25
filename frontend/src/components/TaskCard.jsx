import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';
import { Check, Edit3, Trash2, User as UserIcon, Link as LinkIcon, ShieldAlert, Calendar, Lock } from 'lucide-react';

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
      className={`group relative overflow-hidden p-5 rounded-xl border transition-all duration-200 bg-white flex flex-col justify-between ${
        isBlocked
          ? 'border-amber-300/80 bg-gradient-to-b from-white to-amber-50/20 shadow-premium-sm hover:border-amber-400'
          : isDone
          ? 'border-slate-200/60 bg-slate-50/40 opacity-90 shadow-2xs'
          : 'border-slate-200/80 shadow-premium-sm hover:shadow-premium-hover hover:border-slate-300/90 hover:-translate-y-0.5'
      }`}
    >
      <div>
        {/* Card Header: Status & Priority Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={task.status} isBlocked={isBlocked} />
            <PriorityBadge priority={task.priority} />
          </div>

          {formattedDate && (
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{formattedDate}</span>
            </div>
          )}
        </div>

        {/* Task Title */}
        <h3
          className={`font-bold text-sm sm:text-base leading-snug mb-1.5 transition-colors ${
            isDone ? 'text-slate-700 font-semibold opacity-85' : 'text-slate-900 group-hover:text-blue-950'
          }`}
        >
          {task.title}
        </h3>

        {/* Task Description */}
        {task.description && (
          <p className="text-xs sm:text-sm text-slate-500 mb-3.5 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Dependency Notice Box */}
        {task.dependsOnTask && (
          <div
            className={`mt-2 mb-3.5 p-3 rounded-lg border text-xs flex items-start gap-2.5 transition-colors ${
              isBlocked
                ? 'bg-amber-50/80 border-amber-200/90 text-amber-950'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            {isBlocked ? (
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            ) : (
              <LinkIcon className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className="font-semibold text-[11px] uppercase tracking-wider text-slate-500">
                  {isBlocked ? 'Blocked by Prerequisite' : 'Depends on'}
                </span>
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${
                    task.dependsOnTask.status === 'Done'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-100 text-amber-800 border-amber-200'
                  }`}
                >
                  {task.dependsOnTask.status}
                </span>
              </div>
              <p className="font-medium text-slate-800 truncate">
                "{task.dependsOnTask.title}"
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Card Footer: Assignee & Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
        {/* Assignee Avatar/Name */}
        <div className="min-w-0 flex-1">
          {task.assignedUser ? (
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200/60 px-2 py-1 rounded-full max-w-[150px]">
              <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                {task.assignedUser.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium truncate text-slate-700">{task.assignedUser.name}</span>
            </div>
          ) : (
            <span className="text-xs text-slate-400 italic">Unassigned</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Complete Button */}
          {!isDone && onComplete && (
            isAssignedToMe ? (
              <button
                type="button"
                onClick={() => onComplete(task)}
                disabled={isBlocked || isCompleting}
                title={
                  isBlocked
                    ? `Cannot complete: waiting for "${task.dependsOnTask?.title}" to be completed.`
                    : 'Mark as complete'
                }
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isBlocked
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/50'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 shadow-2xs active:scale-95'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Complete</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={true}
                title={`Only ${task.assignedUser?.name || 'the assigned user'} can complete this task.`}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100/80 text-slate-400 border border-slate-200/60 cursor-not-allowed opacity-60"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Locked</span>
              </button>
            )
          )}

          {isDone && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 py-1 px-2 bg-emerald-50/50 rounded-lg border border-emerald-100">
              <Check className="w-3.5 h-3.5" /> Done
            </span>
          )}

          {/* Edit Button */}
          <Link
            href={`/edit-task/${task.id}`}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
