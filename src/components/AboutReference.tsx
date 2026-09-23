import Image from "next/image";
import Link from "next/link";
import { Award, Eye, Gem } from "lucide-react";
import type { SiteContent } from "@/lib/content";

export default function AboutReference({ site, showJourneyLink = false, breadcrumb = false }: {
  site: SiteContent;
  showJourneyLink?: boolean;
  breadcrumb?: boolean;
}) {
  return (
    <section className="section about-reference">
      <div className="shell">
        <div className="about-reference-heading">
          {breadcrumb && <span className="about-breadcrumb">Início / Sobre</span>}
          <h2>Sobre a Advogada</h2>
        </div>

        <div className="about-reference-main">
          <div className="about-reference-photo">
            <Image
              src="/images/barbara-about.webp"
              alt="Dra. Bárbara Cordeiro"
              width={864}
              height={1184}
              priority={breadcrumb}
              sizes="(max-width: 820px) 100vw, 46vw"
            />
          </div>

          <div className="about-reference-copy">
            <h3>Dra. Bárbara<br />Cordeiro</h3>
            <p className="about-reference-role">{site.profile.title}<br />{site.profile.oab}</p>
            <div className="gold-line" />
            <p>{site.profile.aboutLead}</p>
            <p>{site.profile.aboutText}</p>
            {showJourneyLink && <Link className="text-link" href="/sobre">Conheça minha trajetória →</Link>}
          </div>
        </div>

        <div className="about-reference-cards">
          <article><Award /><div><h4>Missão</h4><p>{site.profile.mission}</p></div></article>
          <article><Eye /><div><h4>Visão</h4><p>{site.profile.vision}</p></div></article>
          <article><Gem /><div><h4>Valores</h4><p>{site.profile.values.join(" · ")}</p></div></article>
        </div>
      </div>
    </section>
  );
}
