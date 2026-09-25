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
              className={`p-3.5 rounded-2xl border transition-all duration-200 bg-white shadow-2xs ${
                isBlocked
                  ? 'border-amber-200 bg-amber-50/10'
                  : isDone
                  ? 'border-slate-200/60 bg-slate-50/30'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              {/* Top Row: Title + Action buttons */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span
                  className={`font-bold text-sm tracking-tight leading-snug line-clamp-2 ${
                    isDone ? 'text-slate-600 line-through opacity-85' : 'text-slate-900'
                  }`}
                >
                  {task.title}
                </span>

                <div className="flex items-center gap-1 shrink-0 -mr-1">
                  <Link
                    href={`/edit-task/${task.id}`}
                    className="p-1 text-slate-400 hover:text-blue-600 rounded-lg"
                    title="Edit"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </Link>
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(task)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Description */}
              {task.description && (
                <p className="text-xs text-slate-500 line-clamp-1 mb-2">
                  {task.description}
                </p>
              )}

              {/* Badges Row: Status + Priority + Assignee */}
              <div className="flex items-center justify-between gap-2 flex-wrap pt-1.5 border-t border-slate-100">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} isBlocked={isBlocked} />
                </div>

                {/* Complete Button or Assignee */}
                <div className="flex items-center gap-1.5">
                  {!isDone && onComplete && (
                    isAssignedToMe ? (
                      <button
                        type="button"
                        onClick={() => onComplete(task)}
                        disabled={isBlocked || isCompleting}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          isBlocked
                            ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 shadow-2xs'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        <span>Done</span>
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 text-slate-400 border border-slate-200">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )
                  )}

                  {isDone && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                      <Check className="w-3 h-3 text-emerald-600" /> Done
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Metadata: Assignee & Dependency */}
              {(showAssignee && task.assignedUser) || task.dependsOnTask ? (
                <div className="mt-2 pt-1.5 border-t border-slate-50 flex items-center justify-between gap-2 text-[11px] text-slate-500">
                  {showAssignee && task.assignedUser ? (
                    <div className="flex items-center gap-1.5 truncate">
                      <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                        {task.assignedUser.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate font-medium text-slate-700">{task.assignedUser.name}</span>
                    </div>
                  ) : <span />}

                  {task.dependsOnTask && (
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold truncate max-w-[150px] ${
                        isBlocked
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
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
      <div className="hidden md:block w-full overflow-x-auto rounded-2xl border border-slate-200/90 bg-white shadow-premium-sm">
        <table className="w-full text-left border-collapse min-w-[720px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-4 sm:px-5 w-[34%]">Task Details</th>
              <th className="py-3.5 px-3 w-[12%]">Priority</th>
              <th className="py-3.5 px-3 w-[14%]">Status</th>
              <th className="py-3.5 px-3 w-[18%]">Dependency</th>
              {showAssignee && <th className="py-3.5 px-3 w-[12%]">Assignee</th>}
              <th className="py-3.5 px-4 text-right w-[10%]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
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
                  className={`hover:bg-slate-50/90 transition-colors group ${
                    isBlocked
                      ? 'bg-amber-50/20 hover:bg-amber-50/40'
                      : isDone
                      ? 'bg-slate-50/30'
                      : ''
                  }`}
                >
                  {/* Task Details */}
                  <td className="py-3.5 px-4 sm:px-5">
                    <div className="flex flex-col">
                      <span
                        className={`font-bold text-sm tracking-tight leading-snug ${
                          isDone
                            ? 'text-slate-600 font-semibold opacity-85'
                            : 'text-slate-900 group-hover:text-blue-600 transition-colors'
                        }`}
                      >
                        {task.title}
                      </span>
                      {task.description && (
                        <span className="text-xs text-slate-500 truncate mt-0.5 max-w-[280px]">
                          {task.description}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <PriorityBadge priority={task.priority} />
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <StatusBadge status={task.status} isBlocked={isBlocked} />
                  </td>

                  {/* Dependency */}
                  <td className="py-3.5 px-3">
                    {task.dependsOnTask ? (
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border max-w-[190px] truncate ${
                          isBlocked
                            ? 'bg-amber-50 text-amber-900 border-amber-200/90'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                        title={
                          isBlocked
                            ? `Blocked: Waiting for "${task.dependsOnTask.title}" (${task.dependsOnTask.status})`
                            : `Depends on: "${task.dependsOnTask.title}"`
                        }
                      >
                        {isBlocked ? (
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        ) : (
                          <LinkIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                        <span className="truncate">
                          {task.dependsOnTask.title}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">None</span>
                    )}
                  </td>

                  {/* Assigned User */}
                  {showAssignee && (
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {task.assignedUser ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shadow-2xs">
                            {task.assignedUser.name.charAt(0).toUpperCase()}
                          </div>
                          <span className={`text-xs font-bold ${isAssignedToMe ? 'text-blue-700' : 'text-slate-700'}`}>
                            {task.assignedUser.name} {isAssignedToMe && '(You)'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                  )}

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Mark as Done */}
                      {!isDone && onComplete && (
                        isAssignedToMe ? (
                          <button
                            type="button"
                            onClick={() => onComplete(task)}
                            disabled={isBlocked || isCompleting}
                            title={
                              isBlocked
                                ? `Cannot complete: waiting for "${task.dependsOnTask?.title}"`
                                : 'Mark as Complete'
                            }
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                              isBlocked
                                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 active:scale-95 shadow-2xs'
                            }`}
                          >
                            <Check className="w-3 h-3" />
                            <span className="hidden sm:inline">Complete</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={true}
                            title={`Only ${task.assignedUser?.name || 'the assigned user'} can complete this task.`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100/80 text-slate-400 border border-slate-200/70 cursor-not-allowed opacity-60"
                          >
                            <Lock className="w-3 h-3 text-slate-400" />
                            <span className="hidden sm:inline">Locked</span>
                          </button>
                        )
                      )}

                      {isDone && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80">
                          <Check className="w-3 h-3 text-emerald-600" /> Done
                        </span>
                      )}

                      {/* Edit */}
                      <Link
                        href={`/edit-task/${task.id}`}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit task"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Link>

                      {/* Delete */}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(task)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
