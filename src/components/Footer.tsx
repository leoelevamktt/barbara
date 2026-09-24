import Image from "next/image";
import Link from "next/link";
import { Clock3, Mail, MapPin, PhoneCall } from "lucide-react";
import type { SiteContent } from "@/lib/content";
import SocialLinks from "@/components/SocialLinks";

export default function Footer({ site }: { site: SiteContent }) {
  const { contact } = site;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`;
  return (
    <footer className="footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Image src="/images/logo-transparent.png" alt="Bárbara Cordeiro Advocacia Criminal"
            width={1280} height={587} sizes="(max-width: 560px) 210px, 220px" />
        </div>
        <div>
          <h3>Navegação</h3>
          <Link href="/">Início</Link><Link href="/sobre">Sobre</Link>
          <Link href="/areas-de-atuacao">Áreas de atuação</Link>
          <Link href="/blog">Blog</Link><Link href="/contato">Contato</Link>
        </div>
        <div>
          <h3>Áreas de atuação</h3>
          {site.areas.slice(0, 8).map(area => (
            <Link key={area.slug} href="/areas-de-atuacao">{area.title}</Link>
          ))}
        </div>
        <div className="footer-contacts">
          <h3>Contato</h3>
          <a href={mapLink} target="_blank" rel="noopener noreferrer"><MapPin size={17} /><span>{contact.address}</span></a>
          <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
            <PhoneCall size={17} /><span>{contact.phoneDisplay}</span>
          </a>
          <a href={`mailto:${contact.email}`}><Mail size={17} /><span>{contact.email}</span></a>
          <p className="footer-hours"><Clock3 size={17} /><span>{contact.hours}<br />
            <strong>{contact.urgentHours}</strong></span></p>
          <h3 className="social-title">Redes e atendimento</h3>
          <SocialLinks instagram={contact.instagram} whatsapp={contact.whatsapp} email={contact.email} />
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} Bárbara Cordeiro Advocacia Criminal. Todos os direitos reservados.</div>
    </footer>
  );
}
