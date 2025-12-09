export type UserRole = 'client' | 'agent';

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high';

export interface Ticket {
  _id: string;
  title: string;
  description: string;
  createdBy: string | User;
  assignedTo?: string | User;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  _id: string;
  ticketId: string | Ticket;
  author: string | User;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  isLoading: boolean;
}

