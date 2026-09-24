import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { listLeads } from "@/lib/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  try {
    const leads = await listLeads();
    return NextResponse.json({ leads }, {
      headers: { "Cache-Control": "private, no-store" }
    });
  } catch {
    return NextResponse.json({ error: "Falha ao carregar leads." }, { status: 503 });
  }
}
