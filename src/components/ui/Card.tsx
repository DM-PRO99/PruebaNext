import React from 'react';
import { Ticket } from '@/types';
import Badge from './Badge';
import Button from './Button';

interface CardProps {
  ticket: Ticket;
  onViewDetail?: (ticketId: string) => void;
  onUpdateStatus?: (ticketId: string, status: string) => void;
  showActions?: boolean;
  userRole?: 'client' | 'agent';
}

const Card: React.FC<CardProps> = ({
  ticket,
  onViewDetail,
  onUpdateStatus,
  showActions = true,
  userRole = 'client',
}) => {
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const getAssignedName = () => {
    if (typeof ticket.assignedTo === 'object' && ticket.assignedTo?.name) {
      return ticket.assignedTo.name;
    }
    return 'Sin asignar';
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {ticket.title}
        </h3>
        <div className="flex gap-2 ml-4">
          <Badge type="status" value={ticket.status} />
          <Badge type="priority" value={ticket.priority} />
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {ticket.description}
      </p>
      
      <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
        <span>📅 {formatDate(ticket.createdAt)}</span>
        {userRole === 'agent' && ticket.assignedTo && (
          <span>👤 {getAssignedName()}</span>
        )}
      </div>
      
      {showActions && (
        <div className="flex gap-2">
          {onViewDetail && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onViewDetail(ticket._id)}
            >
              Ver Detalle
            </Button>
          )}
          {userRole === 'agent' && onUpdateStatus && ticket.status !== 'closed' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                const newStatus = ticket.status === 'open' ? 'in_progress' : 'resolved';
                onUpdateStatus(ticket._id, newStatus);
              }}
            >
              {ticket.status === 'open' ? 'Tomar' : 'Resolver'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Card;

