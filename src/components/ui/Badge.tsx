import React from 'react';
import { TicketStatus, TicketPriority } from '@/types';

interface BadgeProps {
  type: 'status' | 'priority' | 'custom';
  value: TicketStatus | TicketPriority | string;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ type, value, className = '' }) => {
  const getStatusStyles = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPriorityStyles = (priority: TicketPriority) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getLabel = (val: string) => {
    if (type === 'status') {
      const labels: Record<TicketStatus, string> = {
        open: 'Abierto',
        in_progress: 'En Progreso',
        resolved: 'Resuelto',
        closed: 'Cerrado',
      };
      return labels[val as TicketStatus] || val;
    }
    if (type === 'priority') {
      const labels: Record<TicketPriority, string> = {
        low: 'Baja',
        medium: 'Media',
        high: 'Alta',
      };
      return labels[val as TicketPriority] || val;
    }
    return val;
  };
  
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  let colorStyles = '';
  
  if (type === 'status') {
    colorStyles = getStatusStyles(value as TicketStatus);
  } else if (type === 'priority') {
    colorStyles = getPriorityStyles(value as TicketPriority);
  } else {
    colorStyles = 'bg-gray-100 text-gray-800';
  }
  
  return (
    <span className={`${baseStyles} ${colorStyles} ${className}`}>
      {getLabel(value)}
    </span>
  );
};

export default Badge;






