'use client';

import React, { useState, useEffect } from 'react';
import { getUsers, createUser } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Users as UsersIcon,
  UserPlus,
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
  CheckSquare,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Search,
  X,
  Plus,
} from 'lucide-react';

export default function UsersPage() {
  const { user: currentUser, login } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State - only Name and Email
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchUsers = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    else setLoading(true);

    const res = await getUsers();
    if (res.success && res.data) {
      setUsers(res.data);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter a user name.');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Please enter an email address.');
      return;
    }

    setSubmitting(true);
    const res = await createUser(name.trim(), email.trim());
    setSubmitting(false);

    if (res.success && res.data) {
      setSuccessMessage(`User "${res.data.name}" added successfully!`);
      setName('');
      setEmail('');
      fetchUsers(true);
      setTimeout(() => {
        setShowAddModal(false);
        setSuccessMessage(null);
      }, 1200);
    } else {
      setErrorMessage(res.message || 'Failed to create user.');
    }
  };

  const filteredUsers = users.filter((u) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Users</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage team members ({users.length} total)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fetchUsers(true)}
            disabled={refreshing || loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-2xs transition-all active:scale-98"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(!showAddModal)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add User</span>
          </button>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-premium-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name or email..."
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

        {searchQuery !== '' && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 px-3 py-1.5 hover:underline self-start sm:self-center"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Add User Modal / Inline Drawer */}
      {showAddModal && (
        <div className="bg-white rounded-3xl border border-blue-200 p-6 shadow-premium animate-slide-up">
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">Create New User</h2>
                <p className="text-xs text-slate-400">Fill in details to register team member</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50/90 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50/90 border border-emerald-200 rounded-xl flex items-start gap-2 text-xs text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleCreateUser} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vikram Singh"
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. vikram@smarttask.ai"
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all active:scale-98"
              >
                {submitting ? 'Creating...' : 'Register User'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3-Column Desktop Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-5 rounded-3xl border border-slate-200 bg-white shadow-2xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full skeleton" />
                <div className="space-y-1.5 flex-1">
                  <div className="w-3/4 h-4 skeleton rounded" />
                  <div className="w-1/2 h-3 skeleton rounded" />
                </div>
              </div>
              <div className="w-full h-8 skeleton rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center shadow-premium-sm">
          <UsersIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No users found</p>
          <p className="text-xs text-slate-500 mt-1">
            {searchQuery
              ? 'Try adjusting your search query.'
              : 'Add your first team member using the button above.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((u) => {
            const isCurrent = currentUser?.id === u.id;

            return (
              <div
                key={u.id}
                className={`p-5 rounded-3xl border bg-white shadow-premium-sm flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 ${
                  isCurrent
                    ? 'border-blue-500 ring-2 ring-blue-100 shadow-md bg-gradient-to-b from-white to-blue-50/20'
                    : 'border-slate-200/90 hover:border-slate-300 hover:shadow-premium-hover'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-2xs">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-sm font-bold text-slate-900 truncate">
                            {u.name}
                          </h3>
                          {isCurrent && (
                            <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                          <Mail className="w-3 h-3 shrink-0" />
                          <span className="truncate">{u.email}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Online Status and Workload */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-emerald-700 font-semibold">Online</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <span className="flex items-center gap-1 text-slate-500 font-medium">
                        <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
                        Assigned:
                      </span>
                      <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full text-[11px]">
                        {u.taskCount ?? 0} {u.taskCount === 1 ? 'task' : 'tasks'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Switch User Action */}
                <div className="mt-4 pt-2">
                  {!isCurrent ? (
                    <button
                      type="button"
                      onClick={() => login(u)}
                      className="w-full py-2 px-3 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl border border-blue-100 transition-all duration-150 flex items-center justify-center gap-1.5 shadow-2xs active:scale-98"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Switch to this user</span>
                    </button>
                  ) : (
                    <div className="w-full py-2 text-center text-xs font-bold text-emerald-800 bg-emerald-50/90 rounded-xl border border-emerald-200 flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Currently Logged In</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
