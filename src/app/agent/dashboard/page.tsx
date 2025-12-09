'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Ticket } from '@/types';
import { ticketService } from '@/services/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { TicketIcon, ArrowRightOnRectangleIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function AgentDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<{ status?: string; priority?: string }>({});

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user && user.role !== 'agent') {
      router.push('/client/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.role === 'agent') {
      loadTickets();
    }
  }, [user, filters]);

  const loadTickets = async () => {
    try {
      setIsLoading(true);
      const data = await ticketService.getAll(filters);
      setTickets(data);
    } catch (err: any) {
      const errorMsg = err.message || 'Error al cargar tickets';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetail = (ticketId: string) => {
    router.push(`/agent/tickets/${ticketId}`);
  };

  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    try {
      await ticketService.update(ticketId, { status: newStatus as any });
      toast.success('Estado del ticket actualizado');
      loadTickets();
    } catch (err: any) {
      const errorMsg = err.message || 'Error al actualizar ticket';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleFilterChange = (key: 'status' | 'priority', value: string) => {
    if (value === 'all') {
      const newFilters = { ...filters };
      delete newFilters[key];
      setFilters(newFilters);
    } else {
      setFilters({ ...filters, [key]: value });
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'agent') {
    return null;
  }

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    closed: tickets.filter(t => t.status === 'closed').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Panel Agente
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Hola, <span className="text-indigo-600">{user.name}</span></span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  localStorage.removeItem('token');
                  toast.success('Sesión cerrada');
                  router.push('/login');
                }}
                className="flex items-center gap-2"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Vista general de todos los tickets</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <p className="text-sm font-medium text-gray-600 mb-1">Total</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 border border-blue-200"
          >
            <p className="text-sm font-medium text-blue-700 mb-1">Abiertos</p>
            <p className="text-3xl font-bold text-blue-600">{stats.open}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-lg p-6 border border-yellow-200"
          >
            <p className="text-sm font-medium text-yellow-700 mb-1">En Progreso</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.inProgress}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-6 border border-green-200"
          >
            <p className="text-sm font-medium text-green-700 mb-1">Resueltos</p>
            <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <p className="text-sm font-medium text-gray-700 mb-1">Cerrados</p>
            <p className="text-3xl font-bold text-gray-600">{stats.closed}</p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Filtros</h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                value={filters.status || 'all'}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="all">Todos</option>
                <option value="open">Abierto</option>
                <option value="in_progress">En Progreso</option>
                <option value="resolved">Resuelto</option>
                <option value="closed">Cerrado</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
              <select
                value={filters.priority || 'all'}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="all">Todas</option>
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>
        </motion.div>

        {tickets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200"
          >
            <TicketIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No hay tickets disponibles</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {tickets.map((ticket, index) => (
              <Card
                key={ticket._id}
                ticket={ticket}
                onViewDetail={handleViewDetail}
                onUpdateStatus={handleUpdateStatus}
                userRole="agent"
                showActions={true}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}

