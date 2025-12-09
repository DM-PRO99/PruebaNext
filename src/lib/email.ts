import nodemailer from 'nodemailer';

// Crear transporter con verificación de configuración
const createTransporter = () => {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email configuration incomplete. Email sending will fail.');
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Para desarrollo, en producción debería ser true
    },
  });
};

const transporter = createTransporter();

// Verificar conexión al inicializar
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter verification failed:', error);
  } else {
    console.log('Email transporter is ready to send emails');
  }
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    // Verificar configuración de email
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      const errorMsg = 'Email configuration not found. Please configure EMAIL_USER and EMAIL_PASS in .env.local';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    if (!process.env.EMAIL_HOST) {
      const errorMsg = 'EMAIL_HOST not configured';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    console.log('Sending email with config:', {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER,
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: options.to,
    });

    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    console.log('Email sent successfully:', {
      messageId: result.messageId,
      to: options.to,
    });
  } catch (error: any) {
    console.error('Error sending email - Full error:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      stack: error.stack,
    });
    throw error;
  }
};

export const sendTicketCreatedEmail = async (email: string, ticketTitle: string, ticketId: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0; font-size: 28px;">HelpDeskPro</h1>
      </div>
      <h2 style="color: #2563eb; margin-top: 0;">✅ Ticket Creado Exitosamente</h2>
      <p style="color: #4b5563; line-height: 1.6;">Hola,</p>
      <p style="color: #4b5563; line-height: 1.6;">Tu ticket de soporte ha sido creado correctamente. Te mantendremos informado sobre su estado.</p>
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px; margin: 25px 0; color: white;">
        <p style="margin: 5px 0;"><strong>📋 Título:</strong> ${ticketTitle}</p>
        <p style="margin: 5px 0;"><strong>🆔 ID del Ticket:</strong> ${ticketId}</p>
        <p style="margin: 5px 0;"><strong>📧 Correo de seguimiento:</strong> ${email}</p>
      </div>
      <p style="color: #4b5563; line-height: 1.6;">Nuestro equipo revisará tu solicitud y te responderá pronto. Recibirás notificaciones por correo cuando haya actualizaciones.</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">Saludos,<br><strong>Equipo HelpDeskPro</strong></p>
      </div>
    </div>
  `;
  
  await sendEmail({
    to: email,
    subject: '✅ Ticket Creado - HelpDeskPro',
    html,
  });
};

export const sendTicketResponseEmail = async (email: string, ticketTitle: string, message: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0; font-size: 28px;">HelpDeskPro</h1>
      </div>
      <h2 style="color: #2563eb; margin-top: 0;">💬 Nueva Respuesta en tu Ticket</h2>
      <p style="color: #4b5563; line-height: 1.6;">Hola,</p>
      <p style="color: #4b5563; line-height: 1.6;">Has recibido una nueva respuesta de nuestro equipo de soporte:</p>
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
        <p style="margin: 0 0 10px 0; color: #1f2937;"><strong>📋 Título del Ticket:</strong> ${ticketTitle}</p>
        <div style="background-color: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
          <p style="margin: 0; color: #374151; line-height: 1.6;">${message}</p>
        </div>
      </div>
      <p style="color: #4b5563; line-height: 1.6;">Puedes responder directamente desde el panel de tickets o revisar el estado actual de tu solicitud.</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">Saludos,<br><strong>Equipo HelpDeskPro</strong></p>
      </div>
    </div>
  `;
  
  await sendEmail({
    to: email,
    subject: '💬 Nueva Respuesta en tu Ticket - HelpDeskPro',
    html,
  });
};

export const sendTicketClosedEmail = async (email: string, ticketTitle: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0; font-size: 28px;">HelpDeskPro</h1>
      </div>
      <h2 style="color: #10b981; margin-top: 0;">✅ Ticket Cerrado</h2>
      <p style="color: #4b5563; line-height: 1.6;">Hola,</p>
      <p style="color: #4b5563; line-height: 1.6;">Tu ticket ha sido cerrado por nuestro equipo de soporte.</p>
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; border-radius: 8px; margin: 25px 0; color: white;">
        <p style="margin: 5px 0;"><strong>📋 Título:</strong> ${ticketTitle}</p>
        <p style="margin: 5px 0;"><strong>✅ Estado:</strong> Cerrado</p>
      </div>
      <p style="color: #4b5563; line-height: 1.6;">Gracias por usar HelpDeskPro. Si necesitas más ayuda o tienes alguna otra consulta, no dudes en crear un nuevo ticket.</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">Saludos,<br><strong>Equipo HelpDeskPro</strong></p>
      </div>
    </div>
  `;
  
  await sendEmail({
    to: email,
    subject: '✅ Ticket Cerrado - HelpDeskPro',
    html,
  });
};

