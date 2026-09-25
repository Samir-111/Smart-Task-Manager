'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUsers, getTasks } from '../services/api';
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft, Check, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export function TaskForm({
  initialData,
  isEdit = false,
  onSubmit,
}) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [priority, setPriority] = useState(initialData?.priority || 'Medium');
  const [status, setStatus] = useState(initialData?.status || 'To Do');
  const [assignedUserId, setAssignedUserId] = useState(initialData?.assignedUserId || '');
  const [dependsOnTaskId, setDependsOnTaskId] = useState(initialData?.dependsOnTaskId || '');

  const [users, setUsers] = useState([]);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    async function loadOptions() {
      setLoadingData(true);
      try {
        const [usersRes, tasksRes] = await Promise.all([getUsers(), getTasks()]);
        if (usersRes.success && usersRes.data) {
          setUsers(usersRes.data);
          if (!assignedUserId && usersRes.data.length > 0 && !isEdit) {
            setAssignedUserId(usersRes.data[0].id);
          }
        }
        if (tasksRes.success && tasksRes.data) {
          // Exclude current task so it cannot depend on itself
          const filtered = isEdit
            ? tasksRes.data.filter((t) => t.id !== initialData?.id)
            : tasksRes.data;
          setAvailableTasks(filtered);
        }
      } catch (err) {
        console.error('Failed to load form options:', err);
      } finally {
        setLoadingData(false);
      }
    }

    loadOptions();
  }, [isEdit, initialData?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Form validations
    if (!title.trim()) {
      setErrorMessage('Please enter a task title.');
      return;
    }

    if (!assignedUserId) {
      setErrorMessage('Please select a user to assign this task.');
      return;
    }

    // Stop task from depending on itself
    if (isEdit && initialData?.id && dependsOnTaskId === initialData.id) {
      setErrorMessage('A task cannot depend on itself.');
      return;
    }

    // Check if dependency is completed before marking as Done
    if (status === 'Done' && dependsOnTaskId) {
      const parent = availableTasks.find((t) => t.id === dependsOnTaskId);
      if (parent && parent.status !== 'Done') {
        setErrorMessage(
          `Cannot mark as Done: Dependency "${parent.title}" is still ${parent.status}.`
        );
        return;
      }
    }

    setIsSubmitting(true);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      assignedUserId,
      dependsOnTaskId: dependsOnTaskId ? dependsOnTaskId : null,
    };

    const res = await onSubmit(payload);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage(res.message || (isEdit ? 'Task updated successfully!' : 'Task created successfully!'));
      setTimeout(() => {
        router.push('/all-tasks');
      }, 900);
    } else {
      setErrorMessage(res.message || 'An error occurred while saving the task.');
    }
  };

  if (loadingData) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3 shadow-premium-sm">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="text-sm font-medium">Loading task configuration...</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-premium-sm max-w-2xl animate-fade-in"
    >
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
            {isEdit ? 'Edit Task Details' : 'New Task Details'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isEdit ? 'Modify fields and adjust dependency links' : 'Fill out details to create a new tracked task'}
          </p>
        </div>
        <Link
          href="/all-tasks"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </Link>
      </div>

      {/* Alert Messages */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50/90 border border-red-200 rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-red-700 animate-slide-up">
          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-50/90 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-emerald-700 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      <div className="space-y-5">
        {/* Title */}
        <div>
          <label htmlFor="task-title" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Task Title <span className="text-red-500">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Design Login & Onboarding Flow"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 bg-slate-50/50 hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="task-description" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Description
          </label>
          <textarea
            id="task-description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add specifications, requirements, or acceptance criteria..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 bg-slate-50/50 hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
          />
        </div>

        {/* Priority & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="task-priority" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Priority
            </label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 bg-white hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
          </div>

          <div>
            <label htmlFor="task-status" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Status
            </label>
            <select
              id="task-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 bg-white hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
        </div>

        {/* Assign User */}
        <div>
          <label htmlFor="task-assignee" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Assign To <span className="text-red-500">*</span>
          </label>
          <select
            id="task-assignee"
            value={assignedUserId}
            onChange={(e) => setAssignedUserId(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 bg-white hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          >
            <option value="">-- Select Team Member --</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} — {u.email}
              </option>
            ))}
          </select>
        </div>

        {/* Depends On */}
        <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/90">
          <label htmlFor="task-dependency" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Prerequisite Dependency (Optional)
          </label>
          <select
            id="task-dependency"
            value={dependsOnTaskId}
            onChange={(e) => setDependsOnTaskId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 bg-white hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          >
            <option value="">None (Independent task)</option>
            {availableTasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} [{t.status}]
              </option>
            ))}
          </select>
          <div className="flex items-start gap-2 mt-2.5 text-xs text-slate-500">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
            <p className="leading-relaxed">
              <strong>Smart Dependency Rule:</strong> This task will automatically be marked as <strong>Blocked</strong> until the prerequisite reaches <strong>Done</strong> status.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-end gap-3">
        <Link
          href="/all-tasks"
          className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs hover:shadow-md transition-all duration-150 active:scale-98 disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>{isEdit ? 'Save Changes' : 'Create Task'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

