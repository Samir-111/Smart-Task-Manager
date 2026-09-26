'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TaskForm } from '../../../components/TaskForm';
import { getTaskById, updateTask } from '../../../services/api';
import { PriorityBadge } from '../../../components/PriorityBadge';
import { StatusBadge } from '../../../components/StatusBadge';
import { TaskComments } from '../../../components/TaskComments';
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  Edit3,
  ChevronRight,
  ShieldAlert,
  Link as LinkIcon,
  CheckCircle2,
  Clock,
  User,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';

export default function EditTaskPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTask() {
      if (!id) return;
      setLoading(true);
      setError(null);

      const res = await getTaskById(id);
      if (res.success && res.data) {
        setTask(res.data);
      } else {
        setError(res.message || 'Task not found');
      }
      setLoading(false);
    }

    loadTask();
  }, [id]);

  const handleUpdateTask = async (data) => {
    return await updateTask(id, data);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-12 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center justify-center gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)] max-w-xl mx-auto my-8 animate-fade-in">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600 dark:text-indigo-400" />
        <span className="text-sm font-medium">Fetching task specifications...</span>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-10 text-center max-w-md mx-auto my-12 shadow-[0_4px_20px_rgba(0,0,0,0.03)] animate-fade-in">
        <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4 border border-red-100 dark:border-red-900/50">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Task Not Found</h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6">
          {error || 'The task you are looking for does not exist or has been removed.'}
        </p>
        <Link
          href="/all-tasks"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs active:scale-98"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Tasks</span>
        </Link>
      </div>
    );
  }

  const isBlocked = task.isBlocked;
  const isDone = task.status === 'Done';
  const depDone = task.dependsOnTask?.status === 'Done';

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in">
      {/* 1. Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <Link href="/all-tasks" className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline">
          All Tasks
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 dark:text-white font-bold truncate max-w-xs">{task.title}</span>
      </nav>

      {/* 2. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/50 shadow-2xs shrink-0">
            <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{task.title}</h1>
            <div className="flex items-center gap-1.5 sm:gap-2.5 mt-1 flex-wrap">
              <StatusBadge status={task.status} isBlocked={isBlocked} />
              <PriorityBadge priority={task.priority} />
              {task.assignedUser && (
                <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{task.assignedUser.name}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <Link
          href="/all-tasks"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl shadow-2xs transition-all self-start sm:self-center active:scale-98"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </Link>
      </div>

      {/* 3. Single-Column on Mobile, Two-Column on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* Left: Task Form Editor & Comments */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6">
          <TaskForm initialData={task} isEdit={true} onSubmit={handleUpdateTask} />
          <TaskComments
            taskId={task.id}
            taskTitle={task.title}
            assignedUser={task.assignedUser}
          />
        </div>

        {/* Right: Dependency Inspector & Metadata Cards */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-5">
          {/* Dependency Inspector Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 p-4 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5 sm:gap-2">
                <LinkIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Dependency Inspector</span>
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  !task.dependsOnTask
                    ? 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    : isBlocked
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                    : depDone
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                }`}
              >
                {!task.dependsOnTask ? 'Independent' : isBlocked ? 'Blocked' : 'Satisfied'}
              </span>
            </div>

            {task.dependsOnTask ? (
              <div className="space-y-2.5 sm:space-y-3 text-xs">
                {/* Visual Flow */}
                <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">This Task:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[160px]">{task.title}</span>
                  </div>

                  <div className="flex items-center justify-center py-0.5">
                    <div className="px-2 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 text-[9px] font-bold">
                      ⬇ depends upon
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Prerequisite:</span>
                    <span className="font-bold text-slate-900 dark:text-white truncate max-w-[160px]">
                      "{task.dependsOnTask.title}"
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Prerequisite Status:</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                        depDone
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {task.dependsOnTask.status}
                    </span>
                  </div>
                </div>

                {isBlocked ? (
                  <div className="p-2.5 sm:p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-xl text-amber-900 dark:text-amber-300 flex items-start gap-2 text-[11px]">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      Must reach <strong>Done</strong> status first to unlock "{task.title}".
                    </span>
                  </div>
                ) : (
                  <div className="p-2.5 sm:p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-emerald-900 dark:text-emerald-300 flex items-start gap-2 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      Prerequisite satisfied! Ready to be marked Done.
                    </span>
                  </div>
                )}

                <Link
                  href={`/edit-task/${task.dependsOnTaskId}`}
                  className="block text-center py-1.5 sm:py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
                >
                  View Prerequisite Task &rarr;
                </Link>
              </div>
            ) : (
              <div className="text-center py-4 sm:py-6 text-slate-400 dark:text-slate-500 space-y-1">
                <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500 mx-auto mb-1" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No Prerequisites Attached</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  This task is completely independent.
                </p>
              </div>
            )}
          </div>

          {/* Quick Task Info Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-2.5 sm:space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 text-xs sm:text-sm">
              System Audit Info
            </h4>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>Task ID:</span>
              <span className="font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200">{task.id}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>Created At:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200 text-[11px]">
                {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'Recent'}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>Assigned Member:</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{task.assignedUser?.name || 'None'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
