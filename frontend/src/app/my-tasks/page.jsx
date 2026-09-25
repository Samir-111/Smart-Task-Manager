'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { getMyTasks, completeTask, deleteTask } from '../../services/api';
import { TaskCard } from '../../components/TaskCard';
import { TaskTable } from '../../components/TaskTable';
import { DeleteModal } from '../../components/DeleteModal';
import {
  CheckSquare,
  Plus,
  Loader2,
  RefreshCw,
  LogIn,
  AlertCircle,
  CheckCircle2,
  Search,
  SlidersHorizontal,
  X,
  LayoutList,
  LayoutGrid,
  ShieldAlert,
  ArrowUpDown,
} from 'lucide-react';

export default function MyTasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [completingId, setCompletingId] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Filter States
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'To Do' | 'In Progress' | 'Done' | 'BLOCKED'
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('DEFAULT'); // 'DEFAULT' | 'PRIORITY' | 'TITLE'

  // Modal and feedback state
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchMyTasks = useCallback(async (showRefreshing = false) => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (showRefreshing) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await getMyTasks(user.id);
      if (res.success && res.data) {
        setTasks(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch my tasks:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMyTasks();
  }, [fetchMyTasks]);

  const handleComplete = async (task) => {
    setCompletingId(task.id);
    setFeedback(null);

    const res = await completeTask(task.id);
    setCompletingId(null);

    if (res.success) {
      setFeedback({ type: 'success', text: `Marked "${task.title}" as complete.` });
      fetchMyTasks(true);
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
      fetchMyTasks(true);
    } else {
      setFeedback({ type: 'error', text: res.message || 'Failed to delete task.' });
    }
  };

  // If user is not logged in
  if (!user) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 p-10 text-center max-w-lg mx-auto my-12 shadow-premium-sm animate-fade-in">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
          <LogIn className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Authentication Required</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 mb-6 leading-relaxed">
          Please log in or select a user profile to view tasks assigned specifically to you.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xs active:scale-98"
        >
          <LogIn className="w-4 h-4" />
          <span>Go to Login</span>
        </Link>
      </div>
    );
  }

  // Calculate Tab Counts
  const countAll = tasks.length;
  const countTodo = tasks.filter((t) => t.status === 'To Do').length;
  const countInProgress = tasks.filter((t) => t.status === 'In Progress').length;
  const countCompleted = tasks.filter((t) => t.status === 'Done').length;
  const countBlocked = tasks.filter((t) => t.isBlocked).length;
  const completionPercent = countAll > 0 ? Math.round((countCompleted / countAll) * 100) : 0;

  // Filter & Sort Tasks
  const filteredTasks = tasks
    .filter((task) => {
      // Tab filter
      if (activeTab === 'To Do' && task.status !== 'To Do') return false;
      if (activeTab === 'In Progress' && task.status !== 'In Progress') return false;
      if (activeTab === 'Done' && task.status !== 'Done') return false;
      if (activeTab === 'BLOCKED' && !task.isBlocked) return false;

      // Priority filter
      if (priorityFilter !== 'ALL' && task.priority !== priorityFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(q);
        const matchDesc = task.description && task.description.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'PRIORITY') {
        const pMap = { High: 3, Medium: 2, Low: 1 };
        return (pMap[b.priority] || 0) - (pMap[a.priority] || 0);
      }
      if (sortBy === 'TITLE') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  const tabList = [
    { id: 'ALL', label: 'All Tasks', count: countAll },
    { id: 'To Do', label: 'To Do', count: countTodo },
    { id: 'In Progress', label: 'In Progress', count: countInProgress },
    { id: 'Done', label: 'Completed', count: countCompleted },
    { id: 'BLOCKED', label: 'Blocked', count: countBlocked, isBlockedTab: true },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Tasks</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage and track your assigned tasks for <span className="font-bold text-slate-800">{user.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
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
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Card grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => fetchMyTasks(true)}
            disabled={refreshing || loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-2xs transition-all active:scale-98"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Link
            href="/create-task"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </Link>
        </div>
      </div>

      {/* Workload Progress Card */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-premium-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-extrabold text-sm shadow-2xs shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Personal Sprint Completion</p>
            <p className="text-sm sm:text-base font-extrabold text-slate-900">
              {countCompleted} of {countAll} tasks completed ({completionPercent}%)
            </p>
          </div>
        </div>

        <div className="w-full sm:w-64 bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 to-emerald-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200/80">
        {tabList.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? tab.isBlockedTab
                    ? 'bg-amber-100 text-amber-900 border border-amber-300/80 shadow-2xs'
                    : 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              {tab.isBlockedTab && <ShieldAlert className="w-3.5 h-3.5" />}
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : tab.isBlockedTab && tab.count > 0
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-200/80 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-premium-sm flex flex-col md:flex-row gap-3.5 items-stretch md:items-center justify-between">
        {/* Search Box */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your assigned tasks..."
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

        {/* Filter Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
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

          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 ml-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Sort:</span>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:border-slate-300 focus:border-blue-500 transition-all"
          >
            <option value="DEFAULT">Default Order</option>
            <option value="PRIORITY">Priority (Highest first)</option>
            <option value="TITLE">Title (A-Z)</option>
          </select>

          {(priorityFilter !== 'ALL' || searchQuery !== '' || sortBy !== 'DEFAULT') && (
            <button
              type="button"
              onClick={() => {
                setPriorityFilter('ALL');
                setSearchQuery('');
                setSortBy('DEFAULT');
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

      {/* Task Content */}
      {loading ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium">Loading your tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center shadow-premium-sm">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No matching tasks</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-5 max-w-sm mx-auto">
            {searchQuery || priorityFilter !== 'ALL' || activeTab !== 'ALL'
              ? 'Try adjusting your filters, active tab, or search query.'
              : 'You currently have no tasks assigned to you.'}
          </p>
          <Link
            href="/create-task"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create & Assign Task</span>
          </Link>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-2 shadow-premium-sm">
          <TaskTable
            tasks={filteredTasks}
            onComplete={handleComplete}
            onDelete={(t) => setTaskToDelete(t)}
            completingId={completingId}
            showAssignee={false}
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
