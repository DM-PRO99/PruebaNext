'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Ticket } from '@/types';
import { ticketService } from '@/services/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import CreateTicketModal from '@/components/CreateTicketModal';
import { PlusIcon, TicketIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function ClientDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user && user.role !== 'client') {
      router.push('/agent/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.role === 'client') {
      loadTickets();
    }
  }, [user]);

  const loadTickets = async () => {
    try {
      setIsLoading(true);
      const data = await ticketService.getAll();
      setTickets(data);
    } catch (err: any) {
      const errorMsg = err.message || 'Error al cargar tickets';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTicket = () => {
    setShowCreateModal(true);
  };

  const handleTicketCreated = () => {
    setShowCreateModal(false);
    toast.success('Ticket creado exitosamente');
    loadTickets();
  };

  const handleViewDetail = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    router.push(`/client/tickets/${ticketId}`);
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

  if (!user || user.role !== 'client') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <TicketIcon className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                HelpDeskPro
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Hola, <span className="text-blue-600">{user.name}</span></span>
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
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Mis Tickets</h2>
            <p className="text-gray-600 mt-1">Gestiona tus solicitudes de soporte</p>
          </div>
          <Button 
            variant="primary" 
            onClick={handleCreateTicket}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Crear Nuevo Ticket
          </Button>
        </motion.div>

        {tickets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200"
          >
            <TicketIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No tienes tickets aún</p>
            <p className="text-gray-400 text-sm mb-6">Crea tu primer ticket para comenzar</p>
            <Button variant="primary" onClick={handleCreateTicket} className="flex items-center gap-2 mx-auto">
              <PlusIcon className="h-5 w-5" />
              Crear tu primer ticket
            </Button>
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
                userRole="client"
                index={index}
              />
            ))}
          </motion.div>
        )}
      </main>

      {showCreateModal && (
        <CreateTicketModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleTicketCreated}
        />
      )}
    </div>
  );
}

