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
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl shadow-2xs transition-all active:scale-98 self-start sm:self-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Dependency Rule Banner */}
      <div className="bg-gradient-to-r from-amber-50/90 via-amber-50/40 to-white dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-900 border border-amber-200/90 dark:border-amber-900/50 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 text-xs text-amber-950 dark:text-amber-300 flex items-start gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800 shadow-2xs">
          <Lock className="w-4 h-4" />
        </div>
        <div className="leading-snug">
          <p className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">Smart Dependency Guard</p>
          <p className="text-slate-600 dark:text-slate-400 mt-0.5 text-[11px] sm:text-xs">
            Tasks with prerequisites remain blocked until prerequisites reach <strong>Done</strong>.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blocked tasks or prerequisites..."
            className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 bg-slate-50/60 dark:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-600 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 transition-all"
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

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Priority:</span>
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 transition-all"
          >
            <option value="ALL">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {(priorityFilter !== 'ALL' || searchQuery !== '') && (
            <button
              type="button"
              onClick={() => {
                setPriorityFilter('ALL');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 px-2 py-1 hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Blocked Cards Dependency Flow */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Checking task dependencies...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-emerald-200/90 dark:border-emerald-900/50 p-8 sm:p-12 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2.5 border border-emerald-100 dark:border-emerald-900/50 shadow-2xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Zero Blocked Tasks!</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4 max-w-sm mx-auto">
            {searchQuery || priorityFilter !== 'ALL'
              ? 'No blocked tasks matched your filter criteria.'
              : 'All task dependencies are satisfied. You are clear to complete sprint deliverables!'}
          </p>
          <Link
            href="/all-tasks"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 transition-colors shadow-2xs"
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Open All Tasks Directory</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredTasks.map((task) => {
            return (
              <div
                key={task.id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-amber-300/80 p-3.5 sm:p-5 shadow-premium-sm hover:border-amber-400 transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
                  {/* Left: Blocked Task */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                      <StatusBadge status={task.status} isBlocked={true} />
                      <PriorityBadge priority={task.priority} />
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        {task.description}
                      </p>
                    )}

                    {task.assignedUser && (
                      <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
                        <div className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[8px] font-bold">
                          {task.assignedUser.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold">{task.assignedUser.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Prerequisite Task Relationship */}
                  <div className="min-w-0 md:w-80 p-3 rounded-xl sm:rounded-2xl bg-amber-50/50 border border-amber-200/80 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1.5 mb-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3 text-amber-600" />
                          <span>Blocked → Prerequisite</span>
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                          {task.dependsOnTask?.status || 'Pending'}
                        </span>
                      </div>
                      <p className="font-bold text-xs text-slate-900 truncate">
                        "{task.dependsOnTask?.title || 'Prerequisite Task'}"
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-amber-200/60 flex items-center justify-between gap-2">
                      <Link
                        href={`/edit-task/${task.dependsOnTaskId}`}
                        className="text-[11px] font-bold text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1"
                      >
                        <span>Inspect</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>

                      <div className="flex items-center gap-1">
                        <Link
                          href={`/edit-task/${task.id}`}
                          className="p-1 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setTaskToDelete(task)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                          title="Delete"
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
