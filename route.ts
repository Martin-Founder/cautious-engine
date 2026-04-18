import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Chybí povinná pole' },
        { status: 400 }
      )
    }

    const result = await resend.emails.send({
      from: 'noreply@resend.dev',
      to: 'websure.cz@gmail.com',
      replyTo: email,
      subject: `Nová poptávka z webu od ${name}`,
      html: `
        <h2>Nová poptávka</h2>
        <p><strong>Jméno:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Zpráva:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    })

    if (result.error) {
      return NextResponse.json(
        { error: 'Chyba při odesílání emailu' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Email byl úspěšně odeslán' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json(
      { error: 'Interní chyba serveru' },
      { status: 500 }
    )
  }
}
