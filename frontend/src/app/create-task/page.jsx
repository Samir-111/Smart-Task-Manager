'use client';

import React from 'react';
import { TaskForm } from '../../components/TaskForm';
import { createTask } from '../../services/api';
import { PlusCircle } from 'lucide-react';

export default function CreateTaskPage() {
  const handleCreateTask = async (data) => {
    return await createTask(data);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
          <PlusCircle className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Task</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Define deliverables, assign to team members, and configure smart dependencies.
          </p>
        </div>
      </div>

      <TaskForm onSubmit={handleCreateTask} isEdit={false} />
    </div>
  );
}
