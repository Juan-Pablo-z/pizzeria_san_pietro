import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function enviarCorreoRecuperacion(destinatario: string, nombre: string, link: string) {
  return resend.emails.send({
    from: 'info@pizzeriasanpietro.store',
    to: destinatario,
    subject: 'Recuperación de contraseña - San Pietro',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="padding: 20px; text-align: center; background-color: #182e1e;">
            <img src="https://pizzeriasanpietro1.vercel.app/images/san_pietro_logo.png" alt="San Pietro Logo" style="width: 120px; height: 120px; margin-bottom: 10px; border-radius: 9999px;" />
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #111827;">Hola ${nombre},</h2>
            <p style="color: #4B5563;">Recibimos una solicitud para restablecer tu contraseña.</p>
            <p style="color: #4B5563;">Haz clic en el siguiente botón para continuar:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${link}" style="background-color: #DC2626; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
                Restablecer contraseña
              </a>
            </div>
            <p style="color: #9CA3AF;">Este enlace expirará en 15 minutos.</p>
            <p style="font-size: 12px; color: #9CA3AF;">Si no solicitaste este cambio, puedes ignorar este correo.</p>
          </div>
          <div style="padding: 20px; text-align: center; font-size: 12px; color: #9CA3AF; background-color: #F3F4F6;">
            © ${new Date().getFullYear()} Pizzería San Pietro. Todos los derechos reservados.
          </div>
        </div>
      </div>
    `,
  });
}
