'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Menu,
  Search,
  Bell,
  User as UserIcon,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  Sun,
  Moon,
} from 'lucide-react';

export function Navbar({ onToggleSidebar, title }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme, mounted } = useTheme();
  const router = useRouter();
  const [searchVal, setSearchVal] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchInputRef = useRef(null);

  // Keyboard shortcut listener: Press "/" to focus search bar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/all-tasks?q=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border-b border-slate-200/90 dark:border-slate-800 px-3.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3 sm:gap-4 transition-colors duration-200">
      {/* Left side: Mobile Hamburger + Search Input / Mobile Title */}
      <div className="flex items-center gap-2.5 sm:gap-3 flex-1 max-w-xl min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-1.5 sm:p-2 -ml-1 sm:-ml-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden transition-colors shrink-0"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar (Desktop / Tablet) */}
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search tasks, dependencies, users..."
            className="w-full pl-9 pr-12 py-2 bg-slate-50/90 dark:bg-slate-800/90 hover:bg-slate-100/70 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border border-slate-200/90 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-blue-500 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold text-slate-400 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-2xs pointer-events-none">
            /
          </kbd>
        </form>

        {/* Mobile Brand Title */}
        <div className="sm:hidden font-extrabold text-base tracking-tight flex items-center">
          <span className="text-slate-900 dark:text-white font-black">Smart<span className="text-blue-600 dark:text-blue-400">Task</span></span>
        </div>
      </div>

      {/* Right side: Dark Mode Toggle + Notification Bell + User Profile Chip */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Dark / Light Mode Switcher */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-95"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {mounted && isDark ? (
            <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-fade-in" />
          ) : (
            <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 dark:text-slate-300 animate-fade-in" />
          )}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white dark:ring-slate-900" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-modal p-3 z-50 animate-slide-up text-left">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 px-1">
                <span className="font-bold text-xs text-slate-900 dark:text-white">Notifications</span>
                <span className="text-[10px] bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold px-1.5 py-0.5 rounded">2 New</span>
              </div>
              <div className="mt-2 space-y-1 text-xs">
                <div className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Dependency Blocked</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">"Prepare Production Deployment" is waiting on prerequisites.</p>
                  </div>
                </div>
                <div className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Smart Guard Active</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">All task dependencies validated smoothly.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Chip */}
        {user ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full hover:bg-slate-100/90 dark:hover:bg-slate-800 transition-colors border border-slate-200/80 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-xs font-extrabold shadow-2xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden md:block max-w-[120px]">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight truncate">{user.name}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-modal py-1.5 z-50 animate-slide-up text-left text-xs">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                </div>
                <Link
                  href="/my-tasks"
                  onClick={() => setShowUserMenu(false)}
                  className="block px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                >
                  My Assigned Tasks
                </Link>
                <Link
                  href="/users"
                  onClick={() => setShowUserMenu(false)}
                  className="block px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                >
                  Switch User Profile
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                    router.push('/login');
                  }}
                  className="w-full text-left px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium border-t border-slate-100 dark:border-slate-800"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 rounded-xl transition-all shadow-2xs active:scale-98"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Login</span>
          </Link>
        )}
      </div>
    </header>
  );
}
