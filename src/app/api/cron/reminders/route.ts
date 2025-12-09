import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import User from '@/models/User';
import { sendEmail } from '@/lib/email';

// This endpoint should be called by a cron service (like Vercel Cron, cron-job.org, etc.)
// Or you can set up a server-side cron job using node-cron
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET || 'cron-secret'}`) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    // Find tickets that are open or in_progress and haven't been updated in 24 hours
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);
    
    const tickets = await Ticket.find({
      status: { $in: ['open', 'in_progress'] },
      updatedAt: { $lt: oneDayAgo },
      assignedTo: { $exists: true },
    }).populate('assignedTo', 'name email');
    
    let emailsSent = 0;
    
    for (const ticket of tickets) {
      const assignedTo = ticket.assignedTo as any;
      if (assignedTo && typeof assignedTo === 'object' && 'email' in assignedTo && assignedTo.email) {
        try {
          const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #f59e0b;">Recordatorio: Ticket Pendiente</h2>
              <p>Hola ${assignedTo.name},</p>
              <p>Este es un recordatorio de que tienes un ticket pendiente de respuesta:</p>
              <div style="background-color: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <p><strong>Título:</strong> ${ticket.title}</p>
                <p><strong>Estado:</strong> ${ticket.status}</p>
                <p><strong>Prioridad:</strong> ${ticket.priority}</p>
                <p><strong>Última actualización:</strong> ${new Date(ticket.updatedAt).toLocaleString('es-ES')}</p>
              </div>
              <p>Por favor, revisa y responde este ticket lo antes posible.</p>
              <p>Saludos,<br>Sistema HelpDeskPro</p>
            </div>
          `;
          
          await sendEmail({
            to: assignedTo.email,
            subject: `Recordatorio: Ticket Pendiente - ${ticket.title}`,
            html,
          });
          
          emailsSent++;
        } catch (error) {
          console.error(`Error sending reminder for ticket ${ticket._id}:`, error);
        }
      }
    }
    
    return NextResponse.json({
      message: 'Recordatorios enviados',
      ticketsChecked: tickets.length,
      emailsSent,
    });
  } catch (error: any) {
    console.error('Cron reminders error:', error);
    return NextResponse.json(
      { message: 'Error al enviar recordatorios', error: error.message },
      { status: 500 }
    );
  }
}

