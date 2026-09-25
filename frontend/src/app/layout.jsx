import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import AppLayout from './AppLayout';

export const metadata = {
  title: 'SmartTask | Task Manager',
  description: 'SmartTask — Modern, high-performance task management system with intelligent prerequisite dependency tracking.',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen antialiased">
        <AuthProvider>
          <AppLayout>{children}</AppLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
