import { FaWhatsapp } from "react-icons/fa6";

export default function WhatsAppFloat({ number }: { number: string }) {
  const url = `https://wa.me/${number}?text=${encodeURIComponent("Olá, Dra. Barbara. Gostaria de solicitar atendimento.")}`;
  return (
    <a className="whatsapp-float" href={url} target="_blank" rel="noopener noreferrer"
      aria-label="Falar com a Dra. Barbara pelo WhatsApp">
      <FaWhatsapp aria-hidden="true" />
    </a>
  );
}
