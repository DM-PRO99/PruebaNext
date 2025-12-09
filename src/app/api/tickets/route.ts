import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import { verifyToken } from '@/lib/auth';
import { sendTicketCreatedEmail } from '@/lib/email';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const authUser = await verifyToken(request);
    
    if (!authUser) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    
    const query: any = {};
    
    // Clients can only see their own tickets
    if (authUser.role === 'client') {
      query.createdBy = authUser.userId;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (priority) {
      query.priority = priority;
    }
    
    const tickets = await Ticket.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    
    return NextResponse.json(tickets);
  } catch (error: any) {
    console.error('Get tickets error:', error);
    return NextResponse.json(
      { message: 'Error al obtener tickets', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const authUser = await verifyToken(request);
    
    if (!authUser) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }
    
    // Only clients can create tickets
    if (authUser.role !== 'client') {
      return NextResponse.json(
        { message: 'Solo los clientes pueden crear tickets' },
        { status: 403 }
      );
    }
    
    const { title, description, priority } = await request.json();
    
    if (!title || !description) {
      return NextResponse.json(
        { message: 'Título y descripción son requeridos' },
        { status: 400 }
      );
    }
    
    const ticket = await Ticket.create({
      title,
      description,
      priority: priority || 'medium',
      createdBy: authUser.userId,
      status: 'open',
    });
    
    const populatedTicket = await Ticket.findById(ticket._id)
      .populate('createdBy', 'name email');
    
    // Send email notification
    const user = await User.findById(authUser.userId);
    if (user && user.email) {
      try {
        await sendTicketCreatedEmail(user.email, ticket.title, ticket._id.toString());
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Don't fail the request if email fails
      }
    }
    
    return NextResponse.json(populatedTicket, { status: 201 });
  } catch (error: any) {
    console.error('Create ticket error:', error);
    return NextResponse.json(
      { message: 'Error al crear ticket', error: error.message },
      { status: 500 }
    );
  }
}

