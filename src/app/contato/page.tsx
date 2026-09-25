import type { Metadata } from "next";
import { Clock3, Mail, MapPin, PhoneCall } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import MapEmbed from "@/components/MapEmbed";
import SocialLinks from "@/components/SocialLinks";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contato",
  description: "Entre em contato com a Barbara Cordeiro Advocacia Criminal e solicite atendimento.",
  alternates: { canonical: "/contato" }
};

export default async function Contato() {
  const site = await getSiteContent();
  const { contact } = site;
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`;
  return (
    <>
      <section className="page-hero">
        <div className="shell"><span>Início / Contato</span><h1>Contato</h1>
          <p>Entre em contato para solicitar atendimento.</p></div>
      </section>
      <section className="section">
        <div className="shell contact-page-grid">
          <div className="contact-info big">
            <p><MapPin /><span><b>Endereço</b>
              <a className="inline-contact-link" href={maps} target="_blank" rel="noopener noreferrer">
                {contact.address}
              </a><small>Atendimento presencial com agendamento.</small></span></p>
            <p><PhoneCall /><span><b>WhatsApp</b>
              <a className="inline-contact-link" href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
                {contact.phoneDisplay}
              </a></span></p>
            <p><Mail /><span><b>E-mail</b><a className="inline-contact-link" href={`mailto:${contact.email}`}>{contact.email}</a></span></p>
            <p><Clock3 /><span><b>Horário de atendimento</b>{contact.hours}<br />
              <strong className="urgent-hours">{contact.urgentHours}</strong></span></p>
            <SocialLinks instagram={contact.instagram} whatsapp={contact.whatsapp} email={contact.email} />
          </div>
          <ContactForm whatsapp={contact.whatsapp} />
          <MapEmbed address={contact.address} tall />
        </div>
      </section>
    </>
  );
}
