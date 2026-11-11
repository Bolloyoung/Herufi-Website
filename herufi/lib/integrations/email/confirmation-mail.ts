import { Resend } from 'resend'
import { appBaseUrl, sendMode, senderDefaults } from '@/lib/server/env'
import { UpstreamError } from '@/lib/server/errors'
import type { Logger } from '@/lib/server/logger'
import { canSendTo } from './send-guard'

export type ConfirmationMailer = (msg: { to: string; subject: string; text: string; html: string; from: string }) => Promise<void>

/** Sends through Resend, which the contact form already uses. The sending domain is verified there. */
const resendMailer: ConfirmationMailer = async (msg) => {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new UpstreamError('resend', 'Email is not configured', false, 503)
  const { error } = await new Resend(key).emails.send({ from: msg.from, to: msg.to, subject: msg.subject, text: msg.text, html: msg.html })
  if (error) throw new UpstreamError('resend', 'Could not send the confirmation email', true)
}

export function confirmationUrl(token: string): string {
  return `${appBaseUrl()}/subscribe/confirm?token=${encodeURIComponent(token)}`
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export function buildConfirmationMessage(input: { to: string; token: string; audienceNames: string[] }) {
  const url = confirmationUrl(input.token)
  const topics = input.audienceNames.join(', ')
  const text = [
    'Please confirm your subscription to Herufi updates.',
    '',
    `You asked to receive email about: ${topics}.`,
    '',
    'Confirm by opening this link:',
    url,
    '',
    'The link works for 48 hours. If you did not ask for this, you can ignore this email and nothing will happen.',
    '',
    'Herufi',
  ].join('\n')
  const html = `<p>Please confirm your subscription to Herufi updates.</p>
<p>You asked to receive email about: <strong>${escapeHtml(topics)}</strong>.</p>
<p><a href="${escapeHtml(url)}" style="display:inline-block;background:#1B4332;color:#FAFAF8;padding:12px 22px;text-decoration:none;border-radius:6px;font-weight:600;">Confirm subscription</a></p>
<p style="color:#555;">The link works for 48 hours. If you did not ask for this, you can ignore this email and nothing will happen.</p>
<p>Herufi</p>`
  return { text, html, subject: 'Confirm your subscription to Herufi updates' }
}

/**
 * Honours the send guard: nothing is sent while sending is disabled, and in
 * allowlist mode only allowlisted addresses receive it. Returns whether it was sent.
 */
export async function sendConfirmationEmail(
  input: { to: string; token: string; audienceNames: string[] },
  log?: Logger,
  mailer: ConfirmationMailer = resendMailer,
): Promise<{ sent: boolean }> {
  if (!canSendTo(input.to)) {
    log?.info('confirmation email not sent: send guard', { mode: sendMode() })
    return { sent: false }
  }
  const { fromName, fromEmail } = senderDefaults()
  await mailer({ ...buildConfirmationMessage(input), to: input.to, from: `${fromName} <${fromEmail}>` })
  return { sent: true }
}
