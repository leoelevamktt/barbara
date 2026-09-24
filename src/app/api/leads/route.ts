import { NextResponse } from "next/server";
import { createLead } from "@/lib/leads";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");
    const self = new URL(request.url);
    if (origin && origin !== self.origin && origin !== "https://barbara-chi.vercel.app") {
      return NextResponse.json({ error: "Origem inválida." }, { status: 403 });
    }
    if (!(request.headers.get("content-type") || "").includes("application/json")) {
      return NextResponse.json({ error: "Formato inválido." }, { status: 415 });
    }
    const input = await request.json();
    if (typeof input !== "object" || !input) {
      return NextResponse.json({ error: "Formulário inválido." }, { status: 400 });
    }
    if (input.website) return NextResponse.json({ ok: true });
    const nome = String(input.nome ?? "").trim();
    const telefone = String(input.telefone ?? "").trim();
    const email = String(input.email ?? "").trim().toLowerCase();
    const assunto = String(input.assunto ?? "").trim();
    const mensagem = String(input.mensagem ?? "").trim();
    if (!input.consentimento || nome.length < 2 || nome.length > 120 ||
        telefone.length < 8 || telefone.length > 32 ||
        email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        assunto.length > 120 || mensagem.length < 5 || mensagem.length > 4000) {
      return NextResponse.json({ error: "Preencha os dados corretamente e autorize o contato." }, { status: 400 });
    }
    await createLead({ nome, telefone, email, assunto, mensagem });
    return NextResponse.json({ ok: true }, {
      status: 201,
      headers: { "Cache-Control": "no-store" }
    });
  } catch (error) {
    console.error("Lead submission error:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({
      error: "Não foi possível registrar sua solicitação. Tente novamente ou entre pelo WhatsApp."
    }, { status: 503 });
  }
}
