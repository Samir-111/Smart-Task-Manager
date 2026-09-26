import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';
import { Check, Edit3, Trash2, Link as LinkIcon, ShieldAlert, Lock } from 'lucide-react';

export function TaskTable({
  tasks,
  onComplete,
  onDelete,
  completingId,
  showAssignee = true,
}) {
  const { user: currentUser } = useAuth();

  if (!tasks || tasks.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Mobile Card List View (< md) */}
      <div className="md:hidden space-y-2.5">
        {tasks.map((task) => {
          const isDone = task.status === 'Done';
          const isBlocked = task.isBlocked;
          const isCompleting = completingId === task.id;
          const isAssignedToMe =
            currentUser &&
            (task.assignedUserId === currentUser.id ||
              task.assignedUser?.id === currentUser.id);

          return (
            <div
              key={task.id}
              className={`p-3.5 sm:p-4 rounded-2xl transition-all duration-200 bg-white dark:bg-slate-900 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border ${
                isBlocked
                  ? 'border-amber-200/90 dark:border-amber-900/40 bg-amber-50/15 dark:bg-amber-950/20'
                  : isDone
                  ? 'border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/60'
                  : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              {/* Top Row: Title + Action buttons */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span
                  className={`font-bold text-sm tracking-tight leading-snug line-clamp-2 ${
                    isDone
                      ? 'text-slate-500 dark:text-slate-400'
                      : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {task.title}
                </span>

                <div className="flex items-center gap-1 shrink-0 -mr-1">
                  <Link
                    href={`/edit-task/${task.id}`}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title="Edit task"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </Link>
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(task)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Description */}
              {task.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-2.5">
                  {task.description}
                </p>
              )}

              {/* Badges Row: Status + Priority + Action */}
              <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <StatusBadge status={task.status} isBlocked={isBlocked} />
                  <PriorityBadge priority={task.priority} />
                </div>

                <div className="flex items-center gap-1.5">
                  {!isDone && onComplete && (
                    isAssignedToMe ? (
                      <button
                        type="button"
                        onClick={() => onComplete(task)}
                        disabled={isBlocked || isCompleting}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          isBlocked
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs active:scale-95'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        <span>Done</span>
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-400">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )
                  )}

                  {isDone && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-[#137333] bg-[#E6F4EA] dark:bg-emerald-950/60 dark:text-emerald-300">
                      <Check className="w-3 h-3" /> Done
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Metadata: Assignee & Dependency */}
              {(showAssignee && task.assignedUser) || task.dependsOnTask ? (
                <div className="mt-2 pt-2 border-t border-slate-50 dark:border-slate-800/60 flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  {showAssignee && task.assignedUser ? (
                    <div className="flex items-center gap-1.5 truncate">
                      <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                        {task.assignedUser.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate font-medium text-slate-700 dark:text-slate-300">
                        {task.assignedUser.name}
                      </span>
                    </div>
                  ) : <span />}

                  {task.dependsOnTask && (
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold truncate max-w-[150px] ${
                        isBlocked
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                      title={
                        isBlocked
                          ? `Blocked: Waiting for "${task.dependsOnTask.title}"`
                          : `Depends on: "${task.dependsOnTask.title}"`
                      }
                    >
                      {isBlocked ? <ShieldAlert className="w-3 h-3 shrink-0 text-amber-600" /> : <LinkIcon className="w-3 h-3 shrink-0" />}
                      <span className="truncate">{task.dependsOnTask.title}</span>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Desktop Table View (>= md) */}
      <div className="hidden md:block w-full overflow-x-auto rounded-2xl bg-white dark:bg-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-slate-800">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <th className="py-3.5 px-4 w-[35%]">Task Details</th>
              <th className="py-3.5 px-3 w-[12%]">Priority</th>
              <th className="py-3.5 px-3 w-[13%]">Status</th>
              <th className="py-3.5 px-3 w-[18%]">Prerequisite</th>
              {showAssignee && <th className="py-3.5 px-3 w-[12%]">Assignee</th>}
              <th className="py-3.5 px-4 text-right w-[10%]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {tasks.map((task) => {
              const isDone = task.status === 'Done';
              const isBlocked = task.isBlocked;
              const isCompleting = completingId === task.id;
              const isAssignedToMe =
                currentUser &&
                (task.assignedUserId === currentUser.id ||
                  task.assignedUser?.id === currentUser.id);

              return (
                <tr
                  key={task.id}
                  className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors group ${
                    isBlocked
                      ? 'bg-amber-50/15 dark:bg-amber-950/10'
                      : isDone
                      ? 'bg-slate-50/20 dark:bg-slate-900/40'
                      : ''
                  }`}
                >
                  {/* Task Details */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col max-w-[320px]">
                      <span
                        className={`font-bold text-sm tracking-tight leading-snug truncate ${
                          isDone
                            ? 'text-slate-500 dark:text-slate-400 font-medium'
                            : 'text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors'
                        }`}
                      >
                        {task.title}
                      </span>
                      {task.description && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {task.description}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <PriorityBadge priority={task.priority} />
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <StatusBadge status={task.status} isBlocked={isBlocked} />
                  </td>

                  {/* Dependency */}
                  <td className="py-3 px-3">
                    {task.dependsOnTask ? (
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold max-w-[190px] truncate ${
                          isBlocked
                            ? 'bg-[#FEF3C7] dark:bg-amber-950/60 text-[#92400E] dark:text-amber-300'
                            : 'bg-[#F1F5F9] dark:bg-slate-800 text-[#475569] dark:text-slate-300'
                        }`}
                        title={
                          isBlocked
                            ? `Blocked: Waiting for "${task.dependsOnTask.title}" (${task.dependsOnTask.status})`
                            : `Depends on: "${task.dependsOnTask.title}"`
                        }
                      >
                        {isBlocked ? (
                          <ShieldAlert className="w-3.5 h-3.5 text-[#92400E] dark:text-amber-400 shrink-0" />
                        ) : (
                          <LinkIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                        <span className="truncate">
                          {task.dependsOnTask.title}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">None</span>
                    )}
                  </td>

                  {/* Assigned User */}
                  {showAssignee && (
                    <td className="py-3 px-3 whitespace-nowrap">
                      {task.assignedUser ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center text-[10px] font-extrabold shadow-2xs">
                            {task.assignedUser.name.charAt(0).toUpperCase()}
                          </div>
                          <span className={`text-xs font-bold ${isAssignedToMe ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                            {task.assignedUser.name} {isAssignedToMe && '(You)'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                  )}

                  {/* Actions */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
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
                                : 'Mark as Complete'
                            }
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              isBlocked
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs active:scale-95'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Done</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={true}
                            title={`Only ${task.assignedUser?.name || 'assigned owner'} can complete this task.`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100/80 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-60"
                          >
                            <Lock className="w-3 h-3 text-slate-400" />
                            <span className="hidden sm:inline">Locked</span>
                          </button>
                        )
                      )}

                      {isDone && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-[#137333] bg-[#E6F4EA] dark:bg-emerald-950/60 dark:text-emerald-300">
                          <Check className="w-3 h-3 text-[#137333] dark:text-emerald-400" /> Done
                        </span>
                      )}

                      {/* Edit */}
                      <Link
                        href={`/edit-task/${task.id}`}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Edit task"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Link>

                      {/* Delete */}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(task)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                          title="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

