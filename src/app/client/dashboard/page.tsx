'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Ticket } from '@/types';
import { ticketService } from '@/services/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import CreateTicketModal from '@/components/CreateTicketModal';

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
      setError(err.message || 'Error al cargar tickets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTicket = () => {
    setShowCreateModal(true);
  };

  const handleTicketCreated = () => {
    setShowCreateModal(false);
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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold text-gray-900">HelpDeskPro - Panel Cliente</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Hola, {user.name}</span>
              <Button variant="outline" size="sm" onClick={() => {
                localStorage.removeItem('token');
                router.push('/login');
              }}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Mis Tickets</h2>
          <Button variant="primary" onClick={handleCreateTicket}>
            + Crear Nuevo Ticket
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {tickets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No tienes tickets aún</p>
            <Button variant="primary" className="mt-4" onClick={handleCreateTicket}>
              Crear tu primer ticket
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <Card
                key={ticket._id}
                ticket={ticket}
                onViewDetail={handleViewDetail}
                userRole="client"
              />
            ))}
          </div>
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

