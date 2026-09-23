import type { Metadata } from "next";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = { title: "Contato", description: "Entre em contato com a Bárbara Cordeiro Advocacia Criminal e solicite atendimento." };

export default async function Contato() {
  const site = await getSiteContent();
  return <><section className="page-hero"><div className="shell"><span>Início / Contato</span><h1>Contato</h1><p>Entre em contato para solicitar atendimento.</p></div></section><section className="section"><div className="shell contact-page-grid"><div className="contact-info big"><p><MapPin /><span><b>Endereço</b>{site.contact.address}<small>Atendimento somente com agendamento.</small></span></p><p><Phone /><span><b>WhatsApp</b>{site.contact.phoneDisplay}</span></p><p><Mail /><span><b>E-mail</b>{site.contact.email}</span></p><p><Clock3 /><span><b>Horário</b>{site.contact.hours}</span></p></div><ContactForm whatsapp={site.contact.whatsapp} /><div className="map-card tall"><div className="map-grid-lines" /><MapPin size={54} /><strong>Morumbi</strong><span>São Paulo · SP</span></div></div></section></>;
}
