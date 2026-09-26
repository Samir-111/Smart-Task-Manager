'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { getTasks, completeTask, deleteTask } from '../../services/api';
import { TaskCard } from '../../components/TaskCard';
import { TaskTable } from '../../components/TaskTable';
import { DeleteModal } from '../../components/DeleteModal';
import {
  ListTodo,
  Plus,
  Loader2,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  SlidersHorizontal,
  LayoutList,
  LayoutGrid,
  Download,
} from 'lucide-react';
import { triggerConfetti } from '../../utils/confetti';
import { exportTasksToCsv } from '../../utils/exportCsv';

function AllTasksContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('q') || '';
  const urlStatus = searchParams.get('status') || 'ALL';

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [completingId, setCompletingId] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Filters
  const [statusFilter, setStatusFilter] = useState(urlStatus);
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState(urlQuery);

  // Delete Modal State
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (urlQuery) {
      setSearchQuery(urlQuery);
    }
  }, [urlQuery]);

  useEffect(() => {
    if (urlStatus) {
      setStatusFilter(urlStatus);
    }
  }, [urlStatus]);

  const fetchTasks = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await getTasks();
      if (res.success && res.data) {
        setTasks(res.data);
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleComplete = async (task) => {
    setCompletingId(task.id);
    setFeedback(null);

    const res = await completeTask(task.id, user?.id);
    setCompletingId(null);

    if (res.success) {
      triggerConfetti();
      setFeedback({ type: 'success', text: `🎉 Completed "${task.title}"!` });
      fetchTasks(true);
    } else {
      setFeedback({ type: 'error', text: res.message || 'Failed to complete task.' });
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
      fetchTasks(true);
    } else {
      setFeedback({ type: 'error', text: res.message || 'Failed to delete task.' });
    }
  };

  // Filter tasks locally based on active criteria
  const filteredTasks = tasks.filter((t) => {
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      t.title.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      (t.assignedUser && t.assignedUser.name.toLowerCase().includes(q));

    return matchesStatus && matchesPriority && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">All Tasks Directory</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage system-wide tasks and inspect dependency links ({filteredTasks.length} shown of {tasks.length})
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Table view"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Card grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => exportTasksToCsv(filteredTasks, 'smarttask_all_tasks.csv')}
            disabled={filteredTasks.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl shadow-2xs transition-all active:scale-98 disabled:opacity-50"
            title="Export filtered tasks as CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => fetchTasks(true)}
            disabled={refreshing || loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl shadow-2xs transition-all active:scale-98"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Link
            href="/create-task"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col md:flex-row gap-2.5 sm:gap-3.5 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, descriptions, or assignees..."
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

        {/* Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter:</span>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 transition-all"
          >
            <option value="ALL">All Statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          {/* Priority Filter */}
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

          {/* Reset Filters */}
          {(statusFilter !== 'ALL' || priorityFilter !== 'ALL' || searchQuery !== '') && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter('ALL');
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

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border text-xs sm:text-sm flex items-center justify-between shadow-2xs animate-slide-up ${
            feedback.type === 'success'
              ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-300'
              : 'bg-red-50/90 dark:bg-red-950/40 border-red-200 dark:border-red-900/50 text-red-900 dark:text-red-300'
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

      {/* Task Content */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-100 dark:border-slate-800 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Loading tasks directory...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-12 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <ListTodo className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white">No tasks match your filters</h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 mb-5 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'ALL' || priorityFilter !== 'ALL'
              ? 'Try adjusting your filters or search keywords.'
              : 'There are no tasks in the system yet.'}
          </p>
          <Link
            href="/create-task"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs active:scale-98 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Task</span>
          </Link>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-2 sm:p-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <TaskTable
            tasks={filteredTasks}
            onComplete={handleComplete}
            onDelete={(t) => setTaskToDelete(t)}
            completingId={completingId}
            showAssignee={true}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={handleComplete}
              onDelete={(t) => setTaskToDelete(t)}
              isCompleting={completingId === task.id}
            />
          ))}
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

export default function AllTasksPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading tasks...</div>}>
      <AllTasksContent />
    </Suspense>
  );
}

