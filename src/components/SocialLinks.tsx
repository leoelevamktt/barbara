import { Mail } from "lucide-react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa6";

type SocialProps = {
  instagram?: string;
  whatsapp?: string;
  email?: string;
  className?: string;
};
export default function SocialLinks({ instagram, whatsapp, email, className = "" }: SocialProps) {
  const items: Array<{ href: string; label: string; icon: React.ReactNode }> = [];
  if (instagram) items.push({ href: instagram, label: "Instagram de Bárbara Cordeiro", icon: <FaInstagram /> });
  if (whatsapp) items.push({ href: `https://wa.me/${whatsapp}`, label: "Conversar pelo WhatsApp", icon: <FaWhatsapp /> });
  if (email) items.push({ href: `mailto:${email}`, label: "Enviar e-mail", icon: <Mail /> });

  return (
    <div className={`socials ${className}`.trim()}>
      {items.map(item => (
        <a key={item.label} href={item.href} aria-label={item.label}
          target={item.href.startsWith("mailto:") ? undefined : "_blank"}
          rel={item.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}>
          {item.icon}
        </a>
      ))}
    </div>
  );
}
