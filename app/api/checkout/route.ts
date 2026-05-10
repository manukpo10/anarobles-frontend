import { NextResponse } from "next/server"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, token } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 })
    }
    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const backendBody = {
      items: items.map((it: any) => ({
        id: parseInt(it.id) || 0,
        tipo: it.type === "course" ? "CURSO" : "PRODUCTO",
        titulo: it.title,
        precio: it.price,
        imagen: it.image,
        cantidad: it.quantity,
      })),
    }

    const res = await fetch(`${API_BASE}/api/checkout/preference`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(backendBody),
    })

    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status })
    }

    return NextResponse.json({
      preference_id: data.preferenceId,
      init_point: data.initPoint,
      sandbox_init_point: data.sandboxInitPoint,
      external_reference: data.externalReference,
      demo: data.demo,
      message: data.message,
    })
  } catch (error) {
    console.error("Checkout proxy error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
