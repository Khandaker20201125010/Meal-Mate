export const runtime = 'nodejs';
import nodemailer from 'nodemailer';

export async function POST(req) {
  const { name, email, message } = await req.json();
  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  // 1) Notify yourself
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Contact from ${name}`,
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message}</p>
    `
  });

  // 2) Acknowledge to the user
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,  // ← send directly to them
    subject: `Thanks for contacting us, ${name}!`,
    html: `
      <p>Hi ${name},</p>
      <p>Thanks for reaching out. We received your message:</p>
      <blockquote>${message}</blockquote>
      <p>We’ll be in touch shortly.</p>
      <p>— The Team</p>
    `
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
