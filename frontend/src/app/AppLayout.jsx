'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isLoginPage = pathname === '/login';

  const getPageTitle = () => {
    switch (pathname) {
      case '/':
        return 'Dashboard Overview';
      case '/my-tasks':
        return 'My Tasks';
      case '/all-tasks':
        return 'All Tasks Directory';
      case '/create-task':
        return 'Create New Task';
      case '/blocked-tasks':
        return 'Blocked Tasks Tracker';
      case '/users':
        return 'Team Directory';
      default:
        if (pathname?.startsWith('/edit-task/')) return 'Edit Task';
        return 'Smart Task Manager';
    }
  };

  if (isLoginPage) {
    return <main className="min-h-screen bg-slate-50">{children}</main>;
  }

  return (
    <div className="min-h-screen flex bg-[#f1f5f9]">
      {/* Sidebar navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Shell */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 transition-all">
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title={getPageTitle()}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}

