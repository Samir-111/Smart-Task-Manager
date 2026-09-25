'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TaskForm } from '../../../components/TaskForm';
import { getTaskById, updateTask } from '../../../services/api';
import { PriorityBadge } from '../../../components/PriorityBadge';
import { StatusBadge } from '../../../components/StatusBadge';
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
      <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3 shadow-premium-sm max-w-xl mx-auto my-8 animate-fade-in">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="text-sm font-medium">Fetching task specifications...</span>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 p-10 text-center max-w-md mx-auto my-12 shadow-premium-sm animate-fade-in">
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Task Not Found</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 mb-6">
          {error || 'The task you are looking for does not exist or has been removed.'}
        </p>
        <Link
          href="/all-tasks"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
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
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/all-tasks" className="hover:text-blue-600 hover:underline">
          All Tasks
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-bold truncate max-w-xs">{task.title}</span>
      </nav>

      {/* 2. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs shrink-0">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{task.title}</h1>
            <div className="flex items-center gap-2.5 mt-1 flex-wrap">
              <StatusBadge status={task.status} isBlocked={isBlocked} />
              <PriorityBadge priority={task.priority} />
              {task.assignedUser && (
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{task.assignedUser.name}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <Link
          href="/all-tasks"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-2xs transition-all self-start sm:self-center"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Directory</span>
        </Link>
      </div>

      {/* 3. Two-Column Layout: Form on Left (7 cols), Dependency Inspector & Details on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Task Form Editor */}
        <div className="lg:col-span-7">
          <TaskForm initialData={task} isEdit={true} onSubmit={handleUpdateTask} />
        </div>

        {/* Right: Dependency Inspector & Metadata Cards */}
        <div className="lg:col-span-5 space-y-5">
          {/* Dependency Inspector Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-premium-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-blue-600" />
                <span>Dependency Inspector</span>
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  !task.dependsOnTask
                    ? 'bg-slate-50 text-slate-600 border-slate-200'
                    : isBlocked
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : depDone
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}
              >
                {!task.dependsOnTask ? 'Independent' : isBlocked ? 'Blocked' : 'Satisfied'}
              </span>
            </div>

            {task.dependsOnTask ? (
              <div className="space-y-3 text-xs">
                {/* Visual Flow */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">This Task:</span>
                    <span className="font-bold text-slate-800 truncate max-w-[160px]">{task.title}</span>
                  </div>

                  <div className="flex items-center justify-center py-1">
                    <div className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                      ⬇ depends upon
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <span className="text-slate-500 font-medium">Prerequisite:</span>
                    <span className="font-bold text-slate-900 truncate max-w-[160px]">
                      "{task.dependsOnTask.title}"
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-500 font-medium">Prerequisite Status:</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                        depDone
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {task.dependsOnTask.status}
                    </span>
                  </div>
                </div>

                {isBlocked ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-2 text-[11px]">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      This task cannot be marked as Done until "{task.dependsOnTask.title}" reaches <strong>Done</strong> status.
                    </span>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-start gap-2 text-[11px]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      Prerequisite is satisfied! This task is ready to be executed and marked Done.
                    </span>
                  </div>
                )}

                <Link
                  href={`/edit-task/${task.dependsOnTaskId}`}
                  className="block text-center py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                >
                  View Prerequisite Task &rarr;
                </Link>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
                <p className="text-xs font-bold text-slate-700">No Prerequisites Attached</p>
                <p className="text-[11px] text-slate-500">
                  This task is completely independent and has no blocking requirements.
                </p>
              </div>
            )}
          </div>

          {/* Quick Task Info Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-premium-sm space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">
              System Audit Info
            </h4>
            <div className="flex items-center justify-between text-slate-600">
              <span>Task ID:</span>
              <span className="font-mono text-[11px] font-bold text-slate-800">{task.id}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Created At:</span>
              <span className="font-medium text-slate-800">
                {task.createdAt ? new Date(task.createdAt).toLocaleString() : 'Recent'}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Assigned Member:</span>
              <span className="font-bold text-blue-600">{task.assignedUser?.name || 'None'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
