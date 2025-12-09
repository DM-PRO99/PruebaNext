import { NextRequest, NextResponse } from 'next/server';
import { sendTicketCreatedEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Test email sending
    await sendTicketCreatedEmail(
      email,
      'Ticket de Prueba',
      'TKT-TEST-001'
    );

    return NextResponse.json({
      success: true,
      message: 'Email de prueba enviado correctamente',
    });
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error al enviar email de prueba',
        error: error.message,
        details: {
          hasHost: !!process.env.EMAIL_HOST,
          hasUser: !!process.env.EMAIL_USER,
          hasPass: !!process.env.EMAIL_PASS,
          hasFrom: !!process.env.EMAIL_FROM,
        },
      },
      { status: 500 }
    );
  }
}


