import type { Metadata } from "next";
import Image from "next/image";
import { Award, Eye, Gem, ShieldCheck } from "lucide-react";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = { title: "Sobre a Advogada", description: "Conheça a trajetória, missão, visão e valores da Dra. Bárbara Cordeiro, advogada criminalista em São Paulo." };

export default async function Sobre() {
  const site = await getSiteContent();
  return (
    <>
      <section className="page-hero"><div className="shell"><span>Início / Sobre</span><h1>Sobre a Advogada</h1></div></section>
      <section className="section"><div className="shell split-about long-about">
        <div className="about-image-frame"><Image src="/images/barbara-about.webp" alt="Dra. Bárbara Cordeiro" width={864} height={1184} priority /></div>
        <div className="about-copy">
          <span className="eyebrow">Defesa criminal com propósito</span>
          <h2>{site.profile.name}</h2><p className="credentials">{site.profile.title} · {site.profile.oab}</p><div className="gold-line" />
          <p>{site.profile.aboutLead}</p><p>{site.profile.aboutText}</p>
          <p>O trabalho é conduzido com escuta atenta, comunicação clara e estudo aprofundado de cada caso, sempre dentro dos limites éticos da advocacia e com respeito absoluto às garantias fundamentais.</p>
          <div className="about-principles"><div><ShieldCheck /><b>Sigilo e confiança</b><span>Informações tratadas com confidencialidade.</span></div><div><Award /><b>Excelência técnica</b><span>Estratégia construída a partir da análise individual do caso.</span></div></div>
        </div>
      </div></section>
      <section className="section section-darker"><div className="shell"><div className="mv-grid large"><div><Award /><h3>Missão</h3><p>{site.profile.mission}</p></div><div><Eye /><h3>Visão</h3><p>{site.profile.vision}</p></div><div><Gem /><h3>Valores</h3><p>{site.profile.values.join(" · ")}</p></div></div></div></section>
    </>
  );
}
