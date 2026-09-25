'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { getTasks, getUsers, completeTask, deleteTask } from '../services/api';
import { StatsCard } from '../components/StatsCard';
import { TaskTable } from '../components/TaskTable';
import { DeleteModal } from '../components/DeleteModal';
import {
  LayoutGrid,
  Clock,
  Loader2,
  CheckCircle2,
  ShieldAlert,
  Plus,
  RefreshCw,
  Sparkles,
  Users,
  Search,
  Check,
  ListTodo,
  Download,
  Activity,
  Flame,
} from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';
import { exportTasksToCsv } from '../utils/exportCsv';

export default function DashboardPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [completingId, setCompletingId] = useState(null);
  const [searchTableQuery, setSearchTableQuery] = useState('');

  // Modal and feedback state
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const fetchDashboardData = useCallback(async (showRefreshingSpinner = false) => {
    if (showRefreshingSpinner) setRefreshing(true);
    else setLoading(true);

    try {
      const [tasksRes, usersRes] = await Promise.all([getTasks(), getUsers()]);
      if (tasksRes.success && tasksRes.data) {
        setTasks(tasksRes.data);
      }
      if (usersRes.success && usersRes.data) {
        setUsersList(usersRes.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle task completion
  const handleComplete = async (task) => {
    setCompletingId(task.id);
    setFeedbackMessage(null);

    const res = await completeTask(task.id, user?.id);
    setCompletingId(null);

    if (res.success) {
      triggerConfetti();
      setFeedbackMessage({ type: 'success', text: `🎉 Amazing! Marked "${task.title}" as completed.` });
      fetchDashboardData(true);
    } else {
      setFeedbackMessage({
        type: 'error',
        text: res.message || 'Unable to complete task.',
      });
    }
  };

  // Handle task delete confirmation
  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);
    setFeedbackMessage(null);

    const res = await deleteTask(taskToDelete.id);
    setIsDeleting(false);
    setTaskToDelete(null);

    if (res.success) {
      setFeedbackMessage({ type: 'success', text: 'Task deleted successfully.' });
      fetchDashboardData(true);
    } else {
      setFeedbackMessage({
        type: 'error',
        text: res.message || 'Failed to delete task.',
      });
    }
  };

  // Calculate task metrics
  const totalTasks = tasks.length;
  const todoTasks = tasks.filter((t) => t.status === 'To Do').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const completedTasks = tasks.filter((t) => t.status === 'Done').length;
  const blockedTasks = tasks.filter((t) => t.isBlocked).length;

  const todoPercent = totalTasks > 0 ? Math.round((todoTasks / totalTasks) * 100) : 0;
  const inProgressPercent = totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const blockedPercent = totalTasks > 0 ? Math.round((blockedTasks / totalTasks) * 100) : 0;

  // Filtered recent tasks
  const filteredRecentTasks = tasks
    .filter((t) => {
      if (!searchTableQuery) return true;
      const q = searchTableQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.assignedUser && t.assignedUser.name.toLowerCase().includes(q))
      );
    })
    .slice(0, 6);

  // High priority tasks for right-side checklist
  const priorityTasks = tasks.filter((t) => t.priority === 'High' && t.status !== 'Done').slice(0, 4);

  // Donut chart calculations
  const circumference = 2 * Math.PI * 38; // radius 38
  const doneDash = (completionRate / 100) * circumference;
  const inProgressDash = (inProgressPercent / 100) * circumference;
  const blockedDash = (blockedPercent / 100) * circumference;
  const todoDash = (todoPercent / 100) * circumference;

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in">
      {/* 1. Hero Greeting Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-100/80 via-indigo-50/60 to-blue-50/70 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-blue-200/70 shadow-premium-sm">
        {/* Background ambient accents */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 sm:w-64 h-48 sm:h-64 bg-blue-300/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-5">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-blue-700 text-[11px] font-bold mb-1.5 border border-blue-200/90 shadow-2xs">
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>SmartTask Workspace</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
              <span>Good morning{user ? `, ${user.name}` : ''}!</span>
              <span>👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-snug font-medium">
              Here&apos;s what&apos;s happening with your tasks today.
            </p>
          </div>

          {/* Banner Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-start sm:self-auto pt-1 sm:pt-0 flex-wrap">
            <button
              type="button"
              onClick={() => exportTasksToCsv(tasks, 'smarttask_sprint_report.csv')}
              disabled={tasks.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-all active:scale-98 disabled:opacity-50"
              title="Download CSV spreadsheet of all tasks"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={() => fetchDashboardData(true)}
              disabled={refreshing || loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-all active:scale-98"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <Link
              href="/create-task"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all active:scale-98"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Create Task</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Notifications / Feedback Alert */}
      {feedbackMessage && (
        <div
          className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border text-xs sm:text-sm flex items-center justify-between shadow-2xs animate-slide-up ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
              : 'bg-red-50/90 border-red-200 text-red-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span className="font-semibold">{feedbackMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-xs font-bold underline hover:opacity-75"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3. 2x2 Stats Grid on Mobile, 4-Column on Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <StatsCard
          title="Total Tasks"
          count={totalTasks}
          icon={<LayoutGrid className="w-5 h-5 text-blue-600" />}
          variant="primary"
          trend="+2 this wk"
          progressPercent={100}
          href="/all-tasks"
        />
        <StatsCard
          title="To Do"
          count={todoTasks}
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          variant="warning"
          trend={`${todoPercent}% total`}
          progressPercent={todoPercent}
          href="/all-tasks?status=To Do"
        />
        <StatsCard
          title="In Progress"
          count={inProgressTasks}
          icon={<Loader2 className="w-5 h-5 text-cyan-600" />}
          variant="info"
          trend={`${inProgressPercent}% total`}
          progressPercent={inProgressPercent}
          href="/all-tasks?status=In Progress"
        />
        <StatsCard
          title="Completed"
          count={completedTasks}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          variant="success"
          trend={`${completionRate}% total`}
          progressPercent={completionRate}
          href="/all-tasks?status=Done"
        />
      </div>

      {/* 4. Main Multi-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left / Main Section (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Recent Tasks Card with Table / Mobile Cards */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-3.5 sm:p-6 shadow-premium-sm">
            {/* Header with Search and View All */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 mb-3 sm:mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                  Recent Tasks
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  Latest tasks across the system
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTableQuery}
                    onChange={(e) => setSearchTableQuery(e.target.value)}
                    placeholder="Search..."
                    className="pl-8 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 transition-all w-full sm:w-44"
                  />
                </div>

                <Link
                  href="/all-tasks"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline shrink-0"
                >
                  View All &rarr;
                </Link>
              </div>
            </div>

            {/* Table or Empty State */}
            {loading ? (
              <div className="py-12 text-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                <span className="text-xs font-medium">Loading tasks...</span>
              </div>
            ) : filteredRecentTasks.length === 0 ? (
              <div className="p-8 text-center bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
                <ListTodo className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No tasks found</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Create a task to populate the table.
                </p>
              </div>
            ) : (
              <TaskTable
                tasks={filteredRecentTasks}
                onComplete={handleComplete}
                onDelete={(t) => setTaskToDelete(t)}
                completingId={completingId}
                showAssignee={true}
              />
            )}
          </div>
        </div>

        {/* Right Section (4 cols) */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-5">
          {/* 1. Top Priorities Widget */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-premium-sm">
            <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-slate-100 mb-2.5 sm:mb-3">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Top Priorities</span>
              </h3>
              <span className="text-[10px] font-extrabold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                High Priority
              </span>
            </div>

            {priorityTasks.length === 0 ? (
              <div className="py-3.5 px-3 text-center flex items-center justify-center gap-2 bg-slate-50/60 rounded-xl sm:rounded-2xl border border-dashed border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <p className="text-xs font-medium text-slate-600">
                  No active high-priority tasks in sprint.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {priorityTasks.map((pt, idx) => (
                  <div
                    key={pt.id}
                    className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-white transition-all flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-lg bg-blue-100 text-blue-700 font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {pt.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                        <span className="text-[10px] font-semibold text-slate-500">
                          {pt.status}
                        </span>
                        {pt.assignedUser && (
                          <span className="text-[10px] text-blue-600 font-semibold truncate">
                            • {pt.assignedUser.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Team Workload Widget */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-premium-sm">
            <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-slate-100 mb-2.5 sm:mb-3">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Team Workload</span>
              </h3>
              <Link
                href="/users"
                className="text-[11px] font-bold text-blue-600 hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="space-y-2.5 sm:space-y-3.5">
              {usersList.slice(0, 4).map((u) => {
                const userTasks = tasks.filter((t) => t.assignedUserId === u.id);
                const progress = totalTasks > 0 ? Math.round((userTasks.length / totalTasks) * 100) : 0;

                return (
                  <div key={u.id} className="space-y-1 sm:space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 truncate">
                        {u.name}
                      </span>
                      <span className="text-[11px] font-extrabold text-slate-500 shrink-0">
                        {userTasks.length} {userTasks.length === 1 ? 'task' : 'tasks'}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-1.5 sm:h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(progress, 15)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Status Distribution Widget */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-premium-sm">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight pb-2.5 sm:pb-3 border-b border-slate-100 mb-3 sm:mb-4">
              Status Distribution
            </h3>

            <div className="flex items-center gap-4">
              {/* Circular Chart Representation */}
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#f1f5f9"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  {/* Done segment (Green) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#10b981"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={`${doneDash} ${circumference}`}
                    strokeDashoffset={0}
                  />
                  {/* In Progress segment (Cyan) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#06b6d4"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={`${inProgressDash} ${circumference}`}
                    strokeDashoffset={`-${doneDash}`}
                  />
                  {/* Blocked segment (Orange) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#f97316"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={`${blockedDash} ${circumference}`}
                    strokeDashoffset={`-${doneDash + inProgressDash}`}
                  />
                  {/* To Do segment (Amber) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#fbbf24"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={`${todoDash} ${circumference}`}
                    strokeDashoffset={`-${doneDash + inProgressDash + blockedDash}`}
                  />
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-lg font-black text-slate-900 leading-none">
                    {totalTasks}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                    Total
                  </span>
                </div>
              </div>

              {/* Legend Table */}
              <div className="flex-1 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Done
                  </span>
                  <span className="font-bold">{completedTasks} ({completionRate}%)</span>
                </div>

                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    In Progress
                  </span>
                  <span className="font-bold">{inProgressTasks} ({inProgressPercent}%)</span>
                </div>

                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    Blocked
                  </span>
                  <span className="font-bold">{blockedTasks} ({blockedPercent}%)</span>
                </div>

                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    To Do
                  </span>
                  <span className="font-bold">{todoTasks} ({todoPercent}%)</span>
                </div>
              </div>
            </div>
          </div>
          {/* 4. Live Collaborative Activity Feed */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-premium-sm">
            <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-slate-100 mb-2.5 sm:mb-3">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>Sprint Pulse</span>
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live Feed
              </span>
            </div>

            <div className="space-y-3">
              {tasks.slice(0, 3).map((t, idx) => (
                <div key={t.id || idx} className="flex items-start gap-2.5 text-xs">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-[11px] shrink-0 ${
                    t.status === 'Done' ? 'bg-emerald-100 text-emerald-700' :
                    t.isBlocked ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {t.assignedUser?.name ? t.assignedUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-slate-800 leading-tight">
                      <span className="font-bold">{t.assignedUser?.name || 'Team member'}</span>{' '}
                      <span className="text-slate-500">
                        {t.status === 'Done' ? 'completed' : t.isBlocked ? 'is blocked on' : 'is working on'}
                      </span>{' '}
                      <span className="font-semibold text-slate-900 truncate block sm:inline">
                        &ldquo;{t.title}&rdquo;
                      </span>
                    </p>
                    <span className="text-[10px] font-medium text-slate-400 mt-0.5 block">
                      {idx === 0 ? 'Just now' : idx === 1 ? '15m ago' : '1h ago'}
                    </span>
                  </div>
                </div>
              ))}
              {tasks.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-2">No activity yet. Create a task to get started!</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
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
