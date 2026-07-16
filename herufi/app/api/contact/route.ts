import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const CONTACT_INBOX = 'hello@herufi.org'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const organisation = typeof body?.organisation === 'string' ? body.organisation.trim() : ''
  const type = typeof body?.type === 'string' ? body.type.trim() : ''
  const message = typeof body?.message === 'string' ? body.message.trim() : ''

  if (!name || !email || !message || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 })
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set; cannot send contact email')
    return NextResponse.json({ error: 'Email is not configured' }, { status: 500 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const { error } = await resend.emails.send({
      from: `Herufi Website <${CONTACT_INBOX}>`,
      to: CONTACT_INBOX,
      replyTo: email,
      subject: type || `New contact form message from ${name}`,
      text: [
        message,
        '',
        '---',
        `From: ${name} <${email}>`,
        organisation && `Organisation: ${organisation}`,
      ].filter(Boolean).join('\n'),
    })

    if (error) {
      console.error('Resend failed to send contact email', error)
      return NextResponse.json({ error: 'Failed to send message' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Failed to send contact email', err)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
