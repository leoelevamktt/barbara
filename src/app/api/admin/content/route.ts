import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSiteContent, type SiteContent } from "@/lib/content";
import { saveSiteContent } from "@/lib/github";

export async function GET() { if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 }); return NextResponse.json(await getSiteContent()); }
export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  try {
    const content = (await request.json()) as SiteContent;
    if (!content?.profile?.name || !Array.isArray(content.posts)) return NextResponse.json({ error: "Conteúdo inválido" }, { status: 400 });
    await saveSiteContent(content);
    revalidatePath("/", "layout");
    revalidatePath("/blog", "page");
    return NextResponse.json({ ok: true });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Erro ao salvar" }, { status: 500 }); }
}
