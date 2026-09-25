'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { getBlockedTasks, completeTask, deleteTask } from '../../services/api';
import { PriorityBadge } from '../../components/PriorityBadge';
import { StatusBadge } from '../../components/StatusBadge';
import { DeleteModal } from '../../components/DeleteModal';
import {
  ShieldAlert,
  Loader2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Link2,
  Lock,
  Search,
  SlidersHorizontal,
  X,
  ArrowRight,
  Edit3,
  Trash2,
  Check,
  Calendar,
} from 'lucide-react';

export default function BlockedTasksPage() {
  const { user } = useAuth();
  const [blockedTasks, setBlockedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [completingId, setCompletingId] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Delete Modal State
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchBlocked = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await getBlockedTasks();
      if (res.success && res.data) {
        setBlockedTasks(res.data);
      }
    } catch (err) {
      console.error('Failed to load blocked tasks:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBlocked();
  }, [fetchBlocked]);

  const handleComplete = async (task) => {
    setCompletingId(task.id);
    setFeedback(null);

    const res = await completeTask(task.id, user?.id);
    setCompletingId(null);

    if (res.success) {
      setFeedback({ type: 'success', text: `Task "${task.title}" completed.` });
      fetchBlocked(true);
    } else {
      setFeedback({ type: 'error', text: res.message || 'Cannot complete blocked task.' });
    }
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);
    setFeedback(null);

    const res = await deleteTask(taskToDelete.id);
    setIsDeleting(false);
    setTaskToDelete(null);

    if (res.success) {
      setFeedback({ type: 'success', text: 'Task deleted successfully.' });
      fetchBlocked(true);
    } else {
      setFeedback({ type: 'error', text: res.message || 'Failed to delete task.' });
    }
  };

  // Filtered blocked tasks
  const filteredTasks = blockedTasks.filter((task) => {
    if (priorityFilter !== 'ALL' && task.priority !== priorityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description && task.description.toLowerCase().includes(q);
      const matchParent = task.dependsOnTask?.title?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchParent) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Blocked Tasks</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100/90 text-amber-900 border border-amber-300/80 shadow-2xs">
              {blockedTasks.length} Blocked
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Tasks currently blocked and requiring parent dependencies to reach "Done" first.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchBlocked(true)}
          disabled={refreshing || loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-2xs transition-all active:scale-98 self-start sm:self-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Dependency Rule Banner */}
      <div className="bg-gradient-to-r from-amber-50/90 via-amber-50/40 to-white border border-amber-200/90 rounded-3xl p-5 sm:p-6 text-xs sm:text-sm text-amber-950 flex items-start gap-4 shadow-premium-sm">
        <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200 shadow-2xs">
          <Lock className="w-5 h-5" />
        </div>
        <div className="leading-relaxed">
          <p className="font-extrabold text-slate-900 text-sm">Smart Dependency Guard</p>
          <p className="text-slate-600 mt-1 text-xs sm:text-sm">
            When a task depends on a prerequisite, it is prevented from completing until the prerequisite is marked <strong>Done</strong>. Completing the prerequisite automatically unblocks dependent tasks in real-time.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-premium-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blocked tasks or prerequisites..."
            className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 bg-slate-50/60 hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Priority:</span>
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:border-slate-300 focus:border-blue-500 transition-all"
          >
            <option value="ALL">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          {(priorityFilter !== 'ALL' || searchQuery !== '') && (
            <button
              type="button"
              onClick={() => {
                setPriorityFilter('ALL');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 px-2 py-1 hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-center justify-between shadow-2xs animate-slide-up ${
            feedback.type === 'success'
              ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
              : 'bg-red-50/90 border-red-200 text-red-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span className="font-semibold">{feedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs font-bold underline hover:opacity-75"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Blocked Cards Dependency Flow */}
      {loading ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium">Checking task dependencies...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-white rounded-3xl border border-emerald-200/90 p-12 text-center shadow-premium-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-100 shadow-2xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Zero Blocked Tasks!</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-5 max-w-sm mx-auto">
            {searchQuery || priorityFilter !== 'ALL'
              ? 'No blocked tasks matched your filter criteria.'
              : 'All task dependencies are satisfied. You are clear to complete sprint deliverables!'}
          </p>
          <Link
            href="/all-tasks"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors shadow-2xs"
          >
            <Link2 className="w-4 h-4" />
            <span>Open All Tasks Directory</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const formattedDate = task.createdAt
              ? new Date(task.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              : null;

            return (
              <div
                key={task.id}
                className="bg-white rounded-3xl border border-amber-300/80 p-5 sm:p-6 shadow-premium-sm hover:border-amber-400 transition-all duration-200"
              >
                {/* Visual Dependency Flow: Blocked Task -> Depends On -> Required Prerequisite */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left: Blocked Task */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <StatusBadge status={task.status} isBlocked={true} />
                      <PriorityBadge priority={task.priority} />
                      {formattedDate && (
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Created {formattedDate}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 tracking-tight">
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    {task.assignedUser && (
                      <div className="mt-3 inline-flex items-center gap-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
                        <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">
                          {task.assignedUser.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold">{task.assignedUser.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Center: Dependency Arrow Indicator */}
                  <div className="flex items-center justify-center shrink-0">
                    <div className="flex lg:flex-col items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      <span className="text-[11px]">Blocked by</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-600 hidden lg:block" />
                    </div>
                  </div>

                  {/* Right: Prerequisite Task Box */}
                  <div className="flex-1 min-w-0 p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
                          Prerequisite Required Task
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                          {task.dependsOnTask?.status || 'Pending'}
                        </span>
                      </div>
                      <p className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        "{task.dependsOnTask?.title || 'Unknown Task'}"
                      </p>
                      <p className="text-[11px] text-amber-900/80 mt-1">
                        Must reach <strong>Done</strong> status to unlock "{task.title}".
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center justify-between gap-2">
                      <Link
                        href={`/edit-task/${task.dependsOnTaskId}`}
                        className="text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1"
                      >
                        <span>Inspect Prerequisite</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>

                      <div className="flex items-center gap-1">
                        <Link
                          href={`/edit-task/${task.id}`}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
                          title="Edit task"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setTaskToDelete(task)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                          title="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={!!taskToDelete}
        title="Delete Task"
        itemName={taskToDelete?.title || ''}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskToDelete(null)}
        warningNote="If other tasks depend on this task, their dependency reference will be safely removed."
      />
    </div>
  );
}
