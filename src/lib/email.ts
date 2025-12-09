import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Email configuration not found. Skipping email send.');
      return;
    }

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendTicketCreatedEmail = async (email: string, ticketTitle: string, ticketId: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Ticket Creado Exitosamente</h2>
      <p>Hola,</p>
      <p>Tu ticket de soporte ha sido creado correctamente:</p>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Título:</strong> ${ticketTitle}</p>
        <p><strong>ID del Ticket:</strong> ${ticketId}</p>
      </div>
      <p>Nuestro equipo revisará tu solicitud y te responderá pronto.</p>
      <p>Saludos,<br>Equipo HelpDeskPro</p>
    </div>
  `;
  
  await sendEmail({
    to: email,
    subject: 'Ticket Creado - HelpDeskPro',
    html,
  });
};

export const sendTicketResponseEmail = async (email: string, ticketTitle: string, message: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Nueva Respuesta en tu Ticket</h2>
      <p>Hola,</p>
      <p>Has recibido una nueva respuesta en tu ticket:</p>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Título:</strong> ${ticketTitle}</p>
        <p><strong>Respuesta:</strong></p>
        <p style="background-color: white; padding: 10px; border-left: 3px solid #2563eb;">${message}</p>
      </div>
      <p>Puedes responder directamente desde el panel de tickets.</p>
      <p>Saludos,<br>Equipo HelpDeskPro</p>
    </div>
  `;
  
  await sendEmail({
    to: email,
    subject: 'Nueva Respuesta en tu Ticket - HelpDeskPro',
    html,
  });
};

export const sendTicketClosedEmail = async (email: string, ticketTitle: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #10b981;">Ticket Cerrado</h2>
      <p>Hola,</p>
      <p>Tu ticket ha sido cerrado:</p>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Título:</strong> ${ticketTitle}</p>
      </div>
      <p>Gracias por usar HelpDeskPro. Si necesitas más ayuda, no dudes en crear un nuevo ticket.</p>
      <p>Saludos,<br>Equipo HelpDeskPro</p>
    </div>
  `;
  
  await sendEmail({
    to: email,
    subject: 'Ticket Cerrado - HelpDeskPro',
    html,
  });
};

