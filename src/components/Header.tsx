"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  ["Início", "/"],
  ["Sobre", "/sobre"],
  ["Áreas de Atuação", "/areas-de-atuacao"],
  ["Blog", "/blog"],
  ["Contato", "/contato"]
];

export default function Header({ whatsapp }: { whatsapp: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand" aria-label="Bárbara Cordeiro - início">
          <Image src="/images/logo-transparent.png" alt="Bárbara Cordeiro Advocacia Criminal" width={1280} height={587} sizes="(max-width: 820px) 160px, 178px" priority />
        </Link>
        <nav className="desktop-nav" aria-label="Navegação principal">
          {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <a className="btn btn-gold header-cta" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">Agendar consulta</a>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Abrir menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="mobile-nav" aria-label="Navegação móvel">
          {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">Agendar consulta</a>
        </nav>
      )}
    </header>
  );
}
