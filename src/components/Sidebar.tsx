'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { TicketIcon, ArrowRightOnRectangleIcon, UserIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface SidebarProps {
  activeSection?: string;
}

export default function Sidebar({ activeSection = 'tickets' }: SidebarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="w-64 bg-gradient-to-b from-slate-800 to-slate-900 min-h-screen flex flex-col text-white">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold">HelpDeskPro</h1>
            <p className="text-xs text-slate-400">Portal de Soporte</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <button
          onClick={() => router.push('/client/dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-2 ${
            activeSection === 'tickets'
              ? 'bg-blue-600 text-white'
              : 'text-slate-300 hover:bg-slate-700'
          }`}
        >
          <TicketIcon className="h-5 w-5" />
          <span className="font-medium">Mis Tickets</span>
        </button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
            <UserIcon className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{user?.name || 'Usuario'}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role === 'client' ? 'Cliente' : 'Agente'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors text-sm"
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4" />
          <span>→ Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}


