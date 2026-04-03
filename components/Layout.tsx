import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  GraduationCap, 
  LayoutDashboard, 
  Library, 
  Menu, 
  MessageCircle, 
  X,
  Moon,
  Sun,
  LogOut,
  BarChart
} from 'lucide-react';
import { UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: UserProfile;
  onLogout: () => void;
}

const NavItem = ({ to, icon: Icon, label, onClick }: { to: string, icon: any, label: string, onClick?: () => void }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
  
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        isActive 
          ? 'bg-brand-100 text-brand-900 dark:bg-brand-900 dark:text-brand-50 font-medium' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex font-sans">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full bg-white dark:bg-gray-900 z-20 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-2 min-w-fit">
           <GraduationCap className="text-brand-500 flex-shrink-0" />
           <span className="font-bold text-lg dark:text-white whitespace-nowrap">DeutschPro</span>
        </div>
        <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
        z-40 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center space-x-2 border-b border-gray-100 dark:border-gray-800 min-w-fit">
          <GraduationCap className="text-brand-600 h-8 w-8 flex-shrink-0" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-400 whitespace-nowrap">
            DeutschPro
          </span>
        </div>

        <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
           <div className="flex items-center space-x-3 px-2">
              <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-800 flex items-center justify-center text-brand-600 dark:text-brand-200 font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
              </div>
           </div>
        </div>

        <nav className="p-4 space-y-2 flex-1">
          <NavItem to="/" icon={LayoutDashboard} label="Главная" onClick={() => setSidebarOpen(false)} />
          <NavItem to="/dictionary" icon={Library} label="Словарь" onClick={() => setSidebarOpen(false)} />
          <NavItem to="/progress" icon={BarChart} label="Прогресс" onClick={() => setSidebarOpen(false)} />
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="flex items-center justify-center space-x-2 w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            <span>{isDark ? 'Светлая тема' : 'Темная тема'}</span>
          </button>
          
          <button 
            onClick={onLogout}
            className="flex items-center justify-center space-x-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
          >
            <LogOut size={18} />
            <span>Выйти</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full pt-16 lg:pt-0 overflow-y-auto h-screen p-4 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};