import Image from "next/image";
import Link from "next/link";
import { Camera as Instagram, UsersRound as Facebook, BriefcaseBusiness as Linkedin, Phone, Mail, MapPin } from "lucide-react";
import type { SiteContent } from "@/lib/content";

export default function Footer({ site }: { site: SiteContent }) {
  const { contact } = site;
  return (
    <footer className="footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Image src="/images/logo.webp" alt="Bárbara Cordeiro Advocacia" width={310} height={142} />
        </div>
        <div>
          <h3>Navegação</h3>
          <Link href="/">Início</Link><Link href="/sobre">Sobre</Link><Link href="/areas-de-atuacao">Áreas de Atuação</Link><Link href="/blog">Blog</Link><Link href="/contato">Contato</Link>
        </div>
        <div>
          <h3>Áreas de Atuação</h3>
          {site.areas.slice(0, 8).map((area) => <Link key={area.slug} href="/areas-de-atuacao">{area.title}</Link>)}
        </div>
        <div>
          <h3>Contato</h3>
          <p><Phone size={15} /> {contact.phoneDisplay}</p>
          <p><Mail size={15} /> {contact.email}</p>
          <p><MapPin size={15} /> {contact.address}</p>
          <h3 className="social-title">Siga nas redes</h3>
          <div className="socials">
            <a href={contact.instagram} aria-label="Instagram" target="_blank" rel="noreferrer"><Instagram /></a>
            <a href={contact.facebook} aria-label="Facebook" target="_blank" rel="noreferrer"><Facebook /></a>
            <a href={contact.linkedin} aria-label="LinkedIn" target="_blank" rel="noreferrer"><Linkedin /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} Bárbara Cordeiro Advocacia Criminal. Todos os direitos reservados.</div>
    </footer>
  );
}
