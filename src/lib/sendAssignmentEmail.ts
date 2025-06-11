import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

type Params = {
  to: string;
  nombre: string;
  tarea: {
    titulo: string;
    descripcion: string;
  };
};

export async function sendAssignmentEmail({ to, nombre, tarea }: Params) {
  try {
    const response = await resend.emails.send({
      from: "Pizzería San Pietro <info@pizzeriasanpietro.store>",
      to,
      subject: "Nueva tarea asignada",
html: `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="padding: 20px; text-align: center; background-color: #182e1e;">
        <img src="https://pizzeriasanpietro1.vercel.app/images/san_pietro_logo.png" alt="San Pietro Logo" style="width: 120px; height: 120px; margin-bottom: 10px; border-radius: 9999px;" />
      </div>
      <div style="padding: 30px;">
        <h2 style="color: #111827;">Hola ${nombre},</h2>
        <p style="color: #4B5563;">Se te ha asignado una nueva tarea en el sistema:</p>
        <ul style="color: #374151; padding-left: 20px;">
          <li><strong>Título:</strong> ${tarea.titulo}</li>
          <li><strong>Descripción:</strong> ${tarea.descripcion}</li>
        </ul>
        <p style="color: #4B5563;">Ingresa a la plataforma para verla con más detalle.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/iniciar-sesion" style="background-color: #DC2626; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
            Ir al tablero
          </a>
        </div>
        <p style="font-size: 12px; color: #9CA3AF;">Si no esperabas esta asignación, por favor contacta a tu administrador.</p>
      </div>
      <div style="padding: 20px; text-align: center; font-size: 12px; color: #9CA3AF; background-color: #F3F4F6;">
        © ${new Date().getFullYear()} Pizzería San Pietro. Todos los derechos reservados.
      </div>
    </div>
  </div>
`

    });

    return { success: true, data: response };
  } catch (error) {
    console.error("❌ Error al enviar correo de asignación:", error);
    return { success: false, error };
  }
}
