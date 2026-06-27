import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || !String(email).includes("@")) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "Servicio no configurado" }, { status: 503 })
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "onboarding@resend.dev",
      to: "aroblessanguina@gmail.com",
      subject: "Nueva inscripción — lista de cursos",
      html: `<p>Nueva persona anotada en la lista de cursos:</p><p><strong>${email}</strong></p><p>Total anotados: revisá tu inbox.</p>`,
    }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: "Error al enviar" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
