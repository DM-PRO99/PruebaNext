import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Ticket from '@/models/Ticket';
import { verifyToken } from '@/lib/auth';
import { sendTicketResponseEmail } from '@/lib/email';
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
    const ticketId = searchParams.get('ticketId');
    
    if (!ticketId) {
      return NextResponse.json(
        { message: 'ticketId es requerido' },
        { status: 400 }
      );
    }
    
    // Verify ticket exists and user has access
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return NextResponse.json(
        { message: 'Ticket no encontrado' },
        { status: 404 }
      );
    }
    
    // Clients can only see comments on their own tickets
    if (authUser.role === 'client' && ticket.createdBy.toString() !== authUser.userId) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 403 }
      );
    }
    
    const comments = await Comment.find({ ticketId })
      .populate('author', 'name email role')
      .sort({ createdAt: 1 });
    
    return NextResponse.json(comments);
  } catch (error: any) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { message: 'Error al obtener comentarios', error: error.message },
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
    
    const { ticketId, message } = await request.json();
    
    if (!ticketId || !message) {
      return NextResponse.json(
        { message: 'ticketId y message son requeridos' },
        { status: 400 }
      );
    }
    
    // Verify ticket exists and user has access
    const ticket = await Ticket.findById(ticketId)
      .populate('createdBy', 'name email');
    
    if (!ticket) {
      return NextResponse.json(
        { message: 'Ticket no encontrado' },
        { status: 404 }
      );
    }
    
    // Clients can only comment on their own tickets
    if (authUser.role === 'client' && ticket.createdBy.toString() !== authUser.userId) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 403 }
      );
    }
    
    const comment = await Comment.create({
      ticketId,
      author: authUser.userId,
      message,
    });
    
    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name email role');
    
    // Send email notification if agent is responding
    if (authUser.role === 'agent') {
      const createdBy = ticket.createdBy as any;
      if (createdBy && typeof createdBy === 'object' && 'email' in createdBy && createdBy.email) {
        try {
          await sendTicketResponseEmail(
            createdBy.email,
            ticket.title,
            message
          );
        } catch (emailError) {
          console.error('Error sending email:', emailError);
        }
      }
    }
    
    return NextResponse.json(populatedComment, { status: 201 });
  } catch (error: any) {
    console.error('Create comment error:', error);
    return NextResponse.json(
      { message: 'Error al crear comentario', error: error.message },
      { status: 500 }
    );
  }
}

