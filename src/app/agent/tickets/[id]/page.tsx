'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Ticket, Comment } from '@/types';
import { ticketService, commentService } from '@/services/api';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function AgentTicketDetailPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user && user.role !== 'agent') {
      router.push('/client/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.role === 'agent' && ticketId) {
      loadTicket();
      loadComments();
    }
  }, [user, ticketId]);

  const loadTicket = async () => {
    try {
      setIsLoading(true);
      const data = await ticketService.getById(ticketId);
      setTicket(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar ticket');
    } finally {
      setIsLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const data = await commentService.getByTicket(ticketId);
      setComments(data);
    } catch (err: any) {
      console.error('Error loading comments:', err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsSubmitting(true);
      setError('');
      await commentService.create({ ticketId, message: newComment });
      setNewComment('');
      setSuccess('Comentario agregado correctamente');
      loadComments();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al agregar comentario');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    try {
      setError('');
      await ticketService.update(ticketId, { status: status as any });
      setSuccess('Estado actualizado correctamente');
      loadTicket();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar estado');
    }
  };

  const handleUpdatePriority = async (priority: string) => {
    try {
      setError('');
      await ticketService.update(ticketId, { priority: priority as any });
      setSuccess('Prioridad actualizada correctamente');
      loadTicket();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar prioridad');
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString('es-ES');
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

  if (!user || user.role !== 'agent' || !ticket) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold text-gray-900">HelpDeskPro</h1>
            <Button variant="outline" size="sm" onClick={() => router.push('/agent/dashboard')}>
              ← Volver
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{ticket.title}</h2>
            <div className="flex gap-2">
              <Badge type="status" value={ticket.status} />
              <Badge type="priority" value={ticket.priority} />
            </div>
          </div>

          <p className="text-gray-700 mb-4 whitespace-pre-wrap">{ticket.description}</p>

          <div className="text-sm text-gray-500 mb-4">
            <p>Creado por: {typeof ticket.createdBy === 'object' ? ticket.createdBy.name : 'Usuario'}</p>
            <p>Email: {typeof ticket.createdBy === 'object' ? ticket.createdBy.email : ''}</p>
            <p>Creado: {formatDate(ticket.createdAt)}</p>
            {ticket.updatedAt && <p>Actualizado: {formatDate(ticket.updatedAt)}</p>}
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-semibold mb-4">Gestionar Ticket</h3>
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <select
                  value={ticket.status}
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="open">Abierto</option>
                  <option value="in_progress">En Progreso</option>
                  <option value="resolved">Resuelto</option>
                  <option value="closed">Cerrado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
                <select
                  value={ticket.priority}
                  onChange={(e) => handleUpdatePriority(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Comentarios ({comments.length})</h3>

          <div className="space-y-4 mb-6">
            {comments.map((comment) => (
              <div key={comment._id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {typeof comment.author === 'object' ? comment.author.name : 'Usuario'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {typeof comment.author === 'object' && comment.author.role === 'agent' && '👨‍💼 Agente'}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{comment.message}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment}>
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Responder al Ticket
              </label>
              <textarea
                id="comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Escribe tu respuesta..."
              />
            </div>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Agregar Respuesta
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}






