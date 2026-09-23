import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import type { SiteContent } from "@/lib/content";
import SocialLinks from "@/components/SocialLinks";

export default function Footer({ site }: { site: SiteContent }) {
  const { contact } = site;
  return (
    <footer className="footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Image src="/images/logo.webp" alt="Bárbara Cordeiro Advocacia" width={220} height={101} />
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
          <p><Phone size={15} /> <span>{contact.phoneDisplay}</span></p>
          <p><Mail size={15} /> <span>{contact.email}</span></p>
          <p><MapPin size={15} /> <span>{contact.address}</span></p>
          <h3 className="social-title">Siga nas redes</h3>
          <SocialLinks instagram={contact.instagram} facebook={contact.facebook} linkedin={contact.linkedin} whatsapp={contact.whatsapp} />
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} Bárbara Cordeiro Advocacia Criminal. Todos os direitos reservados.</div>
    </footer>
  );
}
