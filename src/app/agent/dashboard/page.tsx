'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Ticket } from '@/types';
import { ticketService, commentService } from '@/services/api';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import AgentSidebar from '@/components/AgentSidebar';
import { 
  PlusIcon, 
  ArrowPathIcon, 
  FunnelIcon, 
  BellIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  TicketIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function AgentDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeStatusTab, setActiveStatusTab] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [commentsCount, setCommentsCount] = useState<Record<string, number>>({});

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
  }, [user, activeStatusTab, priorityFilter]);

  useEffect(() => {
    // Load comments count for each ticket
    const loadCommentsCount = async () => {
      const counts: Record<string, number> = {};
      for (const ticket of tickets) {
        try {
          const comments = await commentService.getByTicket(ticket._id);
          counts[ticket._id] = comments.length;
        } catch (err) {
          counts[ticket._id] = 0;
        }
      }
      setCommentsCount(counts);
    };
    if (tickets.length > 0) {
      loadCommentsCount();
    }
  }, [tickets]);

  const loadTickets = async () => {
    try {
      setIsLoading(true);
      const filters: any = {};
      if (activeStatusTab !== 'all') {
        filters.status = activeStatusTab;
      }
      if (priorityFilter !== 'all') {
        filters.priority = priorityFilter;
      }
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

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date();
    const ticketDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - ticketDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace menos de 1 hora';
    if (diffInHours < 24) return `Hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Hace 1 día';
    if (diffInDays < 7) return `Hace ${diffInDays} días`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks === 1) return 'Hace 1 semana';
    if (diffInWeeks < 4) return `Hace ${diffInWeeks} semanas`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths === 1) return 'Hace 1 mes';
    return `Hace ${diffInMonths} meses`;
  };

  const getAssignedName = (ticket: Ticket) => {
    if (typeof ticket.assignedTo === 'object' && ticket.assignedTo?.name) {
      return ticket.assignedTo.name;
    }
    return 'Sin asignar';
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-white">Cargando...</p>
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
    highPriority: tickets.filter(t => t.priority === 'high').length,
  };

  const statusTabs = [
    { value: 'all', label: 'Todos', count: stats.total },
    { value: 'open', label: 'Abiertos', count: stats.open },
    { value: 'in_progress', label: 'En Progreso', count: stats.inProgress },
    { value: 'resolved', label: 'Resueltos', count: stats.resolved },
    { value: 'closed', label: 'Cerrados', count: stats.closed },
  ];

  return (
    <div className="min-h-screen flex bg-slate-900">
      <AgentSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 px-8 py-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
              <p className="text-slate-400">Gestiona todos los tickets de soporte</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                <ArrowPathIcon className="h-5 w-5" />
              </button>
              <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                <FunnelIcon className="h-5 w-5" />
              </button>
              <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                <BellIcon className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-slate-800"></span>
              </button>
              <Button 
                variant="primary" 
                onClick={() => router.push('/client/dashboard')}
                className="flex items-center gap-2"
              >
                <PlusIcon className="h-5 w-5" />
                + Nuevo Ticket
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Tickets Totales</p>
                  <p className="text-4xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <TicketIcon className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-400 text-sm">
                <ArrowTrendingUpIcon className="h-4 w-4" />
                <span>+12%</span>
                <span className="text-slate-400">Este mes</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Tickets Abiertos</p>
                  <p className="text-4xl font-bold text-white">{stats.open}</p>
                </div>
                <div className="bg-yellow-500/20 p-2 rounded-lg">
                  <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
              <p className="text-yellow-400 text-sm">Requieren atención</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Tiempo Promedio</p>
                  <p className="text-4xl font-bold text-white">4.2h</p>
                </div>
                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-400 text-sm">
                <ArrowTrendingUpIcon className="h-4 w-4" />
                <span>+8%</span>
                <span className="text-slate-400">Primera respuesta</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Resueltos</p>
                  <p className="text-4xl font-bold text-white">{stats.resolved}</p>
                </div>
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <CheckCircleIcon className="h-6 w-6 text-green-400" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-400 text-sm">
                <ArrowTrendingUpIcon className="h-4 w-4" />
                <span>+23%</span>
                <span className="text-slate-400">Este mes</span>
              </div>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2 border-b border-slate-700">
                {statusTabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveStatusTab(tab.value)}
                    className={`px-4 py-2 font-medium transition-colors ${
                      activeStatusTab === tab.value
                        ? 'text-blue-400 border-b-2 border-blue-400'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label} {tab.count}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">Prioridad:</span>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todas</option>
                  <option value="high">Alta</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tickets List */}
          <div className="space-y-4">
            {tickets.map((ticket, index) => (
              <motion.div
                key={ticket._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleViewDetail(ticket._id)}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-blue-400 font-semibold">#{ticket._id.slice(-3).toUpperCase()}</span>
                      <Badge type="status" value={ticket.status} />
                      <Badge type="priority" value={ticket.priority} />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">{ticket.title}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2">{ticket.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    {formatTimeAgo(ticket.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <ChatBubbleLeftRightIcon className="h-4 w-4" />
                    {commentsCount[ticket._id] || 0} comentarios
                  </span>
                  <span className="flex items-center gap-1">
                    <UserIcon className="h-4 w-4" />
                    {getAssignedName(ticket)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {tickets.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-400 text-lg">No hay tickets disponibles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
