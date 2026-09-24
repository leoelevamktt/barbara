import type { Metadata } from "next";
import AreasGrid from "@/components/AreasGrid";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = { title: "Áreas de Atuação", description: "Conheça as principais áreas de atuação em Direito Penal e Processo Penal da Bárbara Cordeiro Advocacia Criminal.", alternates: { canonical: "/areas-de-atuacao" } };

export default async function Areas() {
  const site = await getSiteContent();
  return <><section className="page-hero"><div className="shell"><span>Início / Áreas de Atuação</span><h1>Áreas de Atuação</h1><p>Defesa técnica e estratégica em diferentes frentes do Direito Penal.</p></div></section><section className="section"><div className="shell"><AreasGrid areas={site.areas} /></div></section></>;
}
