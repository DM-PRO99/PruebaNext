import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import { verifyToken } from '@/lib/auth';
import { sendTicketClosedEmail } from '@/lib/email';
import User from '@/models/User';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const authUser = await verifyToken(request);
    
    if (!authUser) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    const ticket = await Ticket.findById(id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');
    
    if (!ticket) {
      return NextResponse.json(
        { message: 'Ticket no encontrado' },
        { status: 404 }
      );
    }
    
    // Clients can only see their own tickets
    if (authUser.role === 'client' && ticket.createdBy.toString() !== authUser.userId) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(ticket);
  } catch (error: any) {
    console.error('Get ticket error:', error);
    return NextResponse.json(
      { message: 'Error al obtener ticket', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const authUser = await verifyToken(request);
    
    if (!authUser) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }
    
    // Only agents can update tickets
    if (authUser.role !== 'agent') {
      return NextResponse.json(
        { message: 'Solo los agentes pueden actualizar tickets' },
        { status: 403 }
      );
    }
    
    const { id } = await params;
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return NextResponse.json(
        { message: 'Ticket no encontrado' },
        { status: 404 }
      );
    }
    
    const { status, priority, assignedTo } = await request.json();
    
    const updateData: any = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (assignedTo) updateData.assignedTo = assignedTo;
    
    // If agent is updating, assign to themselves if not already assigned
    if (!ticket.assignedTo && authUser.role === 'agent') {
      updateData.assignedTo = authUser.userId;
    }
    
    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');
    
    // Send email if ticket is closed
    if (status === 'closed' && ticket.status !== 'closed') {
      const user = await User.findById(ticket.createdBy);
      if (user && user.email) {
        try {
          await sendTicketClosedEmail(user.email, ticket.title);
        } catch (emailError) {
          console.error('Error sending email:', emailError);
        }
      }
    }
    
    return NextResponse.json(updatedTicket);
  } catch (error: any) {
    console.error('Update ticket error:', error);
    return NextResponse.json(
      { message: 'Error al actualizar ticket', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const authUser = await verifyToken(request);
    
    if (!authUser) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }
    
    // Only agents can delete tickets
    if (authUser.role !== 'agent') {
      return NextResponse.json(
        { message: 'Solo los agentes pueden eliminar tickets' },
        { status: 403 }
      );
    }
    
    const { id } = await params;
    const ticket = await Ticket.findByIdAndDelete(id);
    
    if (!ticket) {
      return NextResponse.json(
        { message: 'Ticket no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Ticket eliminado' });
  } catch (error: any) {
    console.error('Delete ticket error:', error);
    return NextResponse.json(
      { message: 'Error al eliminar ticket', error: error.message },
      { status: 500 }
    );
  }
}

