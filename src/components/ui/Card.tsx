'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Ticket } from '@/types';
import Badge from './Badge';
import Button from './Button';
import { CalendarIcon, UserIcon } from '@heroicons/react/24/outline';

interface CardProps {
  ticket: Ticket;
  onViewDetail?: (ticketId: string) => void;
  onUpdateStatus?: (ticketId: string, status: string) => void;
  showActions?: boolean;
  userRole?: 'client' | 'agent';
  index?: number;
}

const Card: React.FC<CardProps> = ({
  ticket,
  onViewDetail,
  onUpdateStatus,
  showActions = true,
  userRole = 'client',
  index = 0,
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
          {ticket.title}
        </h3>
        <div className="flex gap-2 ml-4 flex-shrink-0">
          <Badge type="status" value={ticket.status} />
          <Badge type="priority" value={ticket.priority} />
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {ticket.description}
      </p>
      
      <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4 items-center">
        <span className="flex items-center gap-1">
          <CalendarIcon className="h-4 w-4" />
          {formatDate(ticket.createdAt)}
        </span>
        {userRole === 'agent' && ticket.assignedTo && (
          <span className="flex items-center gap-1">
            <UserIcon className="h-4 w-4" />
            {getAssignedName()}
          </span>
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
    </motion.div>
  );
};

export default Card;

