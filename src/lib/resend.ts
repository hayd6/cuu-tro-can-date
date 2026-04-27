import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default resend;

/**
 * Utility to send a standardized email
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Cứu Trợ Cận Date <onboarding@resend.dev>',
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Email error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Failed to send email:', err);
    return { success: false, error: err };
  }
}
