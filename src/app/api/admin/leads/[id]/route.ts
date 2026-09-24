import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { deleteLead, updateLeadStatus, type LeadStatus } from "@/lib/leads";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
const valid = new Set<LeadStatus>(["novo", "em_atendimento", "concluido"]);

export async function PATCH(request: Request, { params }: Context) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  try {
    const { id } = await params;
    const { status } = await request.json();
    if (!valid.has(status)) return NextResponse.json({ error: "Status inválido." }, { status: 400 });
    await updateLeadStatus(Number(id), status);
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Falha ao atualizar lead." }, { status: 503 });
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  try {
    const { id } = await params;
    await deleteLead(Number(id));
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Falha ao excluir lead." }, { status: 503 });
  }
}
