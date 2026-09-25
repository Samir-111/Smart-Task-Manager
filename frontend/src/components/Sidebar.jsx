'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  CheckSquare,
  ListTodo,
  PlusCircle,
  ShieldAlert,
  Users,
  LogOut,
  Layers,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'My Tasks', href: '/my-tasks', icon: CheckSquare },
    { label: 'All Tasks', href: '/all-tasks', icon: ListTodo },
    { label: 'Create Task', href: '/create-task', icon: PlusCircle },
    { label: 'Blocked Tasks', href: '/blocked-tasks', icon: ShieldAlert },
    { label: 'Users', href: '/users', icon: Users },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-200"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[78%] sm:w-64 max-w-[320px] bg-[#0F172A] border-r border-slate-800 flex flex-col justify-between transition-transform duration-250 ease-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand Logo Header */}
          <div className="h-14 sm:h-16 px-4 sm:px-6 border-b border-slate-800/90 flex items-center justify-between shrink-0">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-2.5 sm:gap-3 group"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <span className="font-extrabold text-white tracking-tight text-base sm:text-lg">
                Smart<span className="text-indigo-400">Task</span>
              </span>
            </Link>
          </div>

          {/* Navigation Section */}
          <div className="px-2.5 sm:px-3.5 py-3 sm:py-4 flex-1 flex flex-col justify-between">
            <div>
              <p className="px-2.5 sm:px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5 sm:mb-2">
                Workspace Menu
              </p>
              <nav className="space-y-0.5 sm:space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-2.5 sm:gap-3 px-3 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold translate-x-0.5'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white hover:translate-x-0.5'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-white' : 'text-slate-400'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Subtle System Status Badge in Sidebar */}
            <div className="mt-4 sm:mt-6 mx-0.5 sm:mx-1 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-white truncate">
                    Smart Dependency Guard
                  </p>
                  <p className="text-[10px] text-slate-300">
                    Auto-validation Active
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile Card at bottom of Sidebar */}
        <div className="p-3.5 border-t border-slate-800 bg-[#0B1120] shrink-0">
          {user ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/70">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-2xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden min-w-0 flex-1">
                  <p className="text-xs font-extrabold text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-slate-300 truncate">{user.email}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  logout();
                  if (onClose) onClose();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-red-400 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              <span>Sign In</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
