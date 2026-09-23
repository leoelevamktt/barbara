import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MessageCircle, LockKeyhole, Crosshair, Video, Eye, Gem, Award, MapPin, Mail, Phone, Clock3 } from "lucide-react";
import AreasGrid from "@/components/AreasGrid";
import FAQ from "@/components/FAQ";
import BlogCard from "@/components/BlogCard";
import ContactForm from "@/components/ContactForm";
import MapEmbed from "@/components/MapEmbed";
import SocialLinks from "@/components/SocialLinks";
import { getPublishedPosts, getSiteContent } from "@/lib/content";

export default async function Home() {
  const site = await getSiteContent();
  const posts = (await getPublishedPosts()).slice(0, 4);
  const wa = `https://wa.me/${site.contact.whatsapp}`;
  return (
    <>
      <section className="hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Advocacia Criminal · São Paulo</span>
            <h1>Defesa Técnica,<br />Estratégica e <em>Humanizada.</em></h1>
            <p>{site.profile.heroText}</p>
            <div className="hero-actions">
              <a className="btn btn-gold" href={wa} target="_blank" rel="noreferrer"><CalendarDays size={17} /> Agendar consulta</a>
              <a className="btn btn-outline" href={wa} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Falar no WhatsApp</a>
            </div>
          </div>
          <div className="hero-photo-wrap">
            <div className="hero-glow" />
            <Image className="hero-photo" src="/images/barbara-hero.webp" alt="Dra. Bárbara Cordeiro" width={864} height={1184} priority sizes="(max-width: 900px) 100vw, 44vw" />
          </div>
        </div>
        <div className="hero-features">
          <div className="shell hero-features-grid">
            <div><Award /><span>Atendimento<br /><b>humanizado</b></span></div>
            <div><LockKeyhole /><span>Sigilo<br /><b>absoluto</b></span></div>
            <div><Crosshair /><span>Atendimento de<br /><b>urgência</b></span></div>
            <div><Video /><span>Atendimento online<br /><b>para todo o Brasil</b></span></div>
          </div>
        </div>
      </section>

      <section className="section about-preview">
        <div className="shell split-about">
          <div className="about-image-frame">
            <Image src="/images/barbara-about.webp" alt="Bárbara Cordeiro em seu escritório" width={864} height={1184} sizes="(max-width: 900px) 100vw, 45vw" />
          </div>
          <div className="about-copy">
            <div className="section-head left"><span>Sobre</span><h2>Sobre a Advogada</h2></div>
            <h3>Dra. Bárbara<br />Cordeiro</h3>
            <p className="credentials">{site.profile.title}<br />{site.profile.oab}</p>
            <div className="gold-line" />
            <p>{site.profile.aboutLead}</p>
            <p>{site.profile.aboutText}</p>
            <Link className="text-link" href="/sobre">Conheça minha trajetória →</Link>
            <div className="mv-grid">
              <div><Award /><h4>Missão</h4><p>{site.profile.mission}</p></div>
              <div><Eye /><h4>Visão</h4><p>{site.profile.vision}</p></div>
              <div><Gem /><h4>Valores</h4><p>{site.profile.values.join(" · ")}</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-darker">
        <div className="shell">
          <div className="section-head"><span>Especialidades</span><h2>Áreas de Atuação</h2><p>Atuação estratégica e individualizada em diferentes frentes do Direito Penal.</p></div>
          <AreasGrid areas={site.areas} compact />
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-head left"><span>Conteúdo jurídico</span><h2>Blog Jurídico</h2></div>
          <div className="blog-grid">{posts.map((post, i) => <BlogCard key={post.id} post={post} index={i} />)}</div>
          <div className="center-action"><Link className="btn btn-outline-gold" href="/blog">Ver todos os artigos</Link></div>
        </div>
      </section>

      <section className="section faq-section">
        <div className="shell faq-grid">
          <div>
            <div className="section-head left"><span>Orientação</span><h2>Perguntas Frequentes</h2></div>
            <FAQ faqs={site.faqs} />
            <div className="faq-cta"><span>Ainda tem dúvidas?<small>Fale conosco agora mesmo.</small></span><a className="btn btn-outline-gold" href={wa} target="_blank" rel="noreferrer"><MessageCircle size={16} /> Falar no WhatsApp</a></div>
          </div>
          <div className="justice-art" aria-hidden="true"><Image src="/images/faq-justice.webp" alt="" fill sizes="(max-width: 820px) 100vw, 34vw" /></div>
        </div>
      </section>

      <section className="section contact-home">
        <div className="shell contact-grid">
          <div className="contact-info">
            <div className="section-head left"><span>Atendimento</span><h2>Contato</h2></div>
            <p><MapPin /> <span><b>Endereço</b>{site.contact.address}<small>Atendimento somente com agendamento.</small></span></p>
            <p><Phone /> <span><b>WhatsApp</b>{site.contact.phoneDisplay}</span></p>
            <p><Mail /> <span><b>E-mail</b>{site.contact.email}</span></p>
            <p><Clock3 /> <span><b>Horário de atendimento</b>{site.contact.hours}</span></p>
            <SocialLinks instagram={site.contact.instagram} facebook={site.contact.facebook} linkedin={site.contact.linkedin} whatsapp={site.contact.whatsapp} className="contact-socials" />
          </div>
          <ContactForm whatsapp={site.contact.whatsapp} />
          <MapEmbed address={site.contact.address} />
        </div>
      </section>
    </>
  );
}
