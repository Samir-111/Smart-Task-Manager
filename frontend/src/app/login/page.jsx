'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { getUsers, createUser, loginUser } from '../../services/api';
import { Sparkles, UserCheck, UserPlus, AlertCircle, CheckCircle2, ArrowRight, Loader2, Shield } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user: currentUser, login } = useAuth();

  const [activeTab, setActiveTab] = useState('select');
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  
  // Create user form fields
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  const loadUsers = async () => {
    setLoading(true);
    setErrorMessage(null);
    const res = await getUsers();
    if (res.success && res.data) {
      setUsers(res.data);
      if (res.data.length > 0) {
        setSelectedUserId(res.data[0].id);
      }
    } else {
      setErrorMessage(res.message || 'Failed to load existing users. Make sure backend is running.');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Handle mock login by selecting user
  const handleSelectLogin = async (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      setErrorMessage('Please select a user to continue.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    const res = await loginUser({ userId: selectedUserId });
    setSubmitting(false);

    if (res.success && res.data) {
      login(res.data);
      router.push('/');
    } else {
      setErrorMessage(res.message || 'Login failed.');
    }
  };

  // Handle creating a new user and logging in
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!newEmail.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = await createUser(newName.trim(), newEmail.trim());
    setSubmitting(false);

    if (res.success && res.data) {
      setSuccessMessage('User registered successfully! Logging you in...');
      login(res.data);
      setTimeout(() => {
        router.push('/');
      }, 800);
    } else {
      setErrorMessage(res.message || 'Failed to create user.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          smart<span className="text-blue-600">Task</span>
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 font-medium">
          Task Management & Smart Dependency System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-premium rounded-3xl border border-slate-200/90 animate-fade-in">
          {/* Tab Selector */}
          <div className="grid grid-cols-2 p-1 bg-slate-100/80 rounded-xl mb-6 border border-slate-200/60">
            <button
              type="button"
              onClick={() => {
                setActiveTab('select');
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                activeTab === 'select'
                  ? 'bg-white text-blue-700 shadow-2xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Select Profile</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('create');
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                activeTab === 'create'
                  ? 'bg-white text-blue-700 shadow-2xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>New Account</span>
            </button>
          </div>

          {/* Error / Success Notifications */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-red-50/90 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-slide-up">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 bg-emerald-50/90 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-700 animate-slide-up">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {activeTab === 'select' ? (
            /* Select User Form */
            <form onSubmit={handleSelectLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="user-select"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                >
                  Choose Team Member
                </label>
                {loading ? (
                  <div className="p-3 text-xs text-slate-500 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span>Loading users...</span>
                  </div>
                ) : (
                  <select
                    id="user-select"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 bg-white hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting || loading || users.length === 0}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs hover:shadow-md transition-all duration-150 active:scale-98 disabled:opacity-60"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Enter Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Create New User Form */
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label
                  htmlFor="new-name"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                >
                  Full Name
                </label>
                <input
                  id="new-name"
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Vikram Verma"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder-slate-400 bg-white hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="new-email"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                >
                  Email Address
                </label>
                <input
                  id="new-email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. vikram@smarttask.ai"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder-slate-400 bg-white hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs hover:shadow-md transition-all duration-150 active:scale-98 disabled:opacity-60"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Register & Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="text-center mt-6 text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          <span>In-memory mock authentication • Zero password required</span>
        </div>
      </div>
    </div>
  );
}
