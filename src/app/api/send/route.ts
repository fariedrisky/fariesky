import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { name, email, message } = await request.json();

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'fariedrisky@gmail.com', // Ganti dengan email penerima
            subject: 'New Contact Form Submission',
            html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message}</p>
    `
        });
        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ error });
    }
}
