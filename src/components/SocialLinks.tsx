import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";

export default function SocialLinks({
  instagram,
  facebook,
  linkedin,
  whatsapp,
  className = ""
}: {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  whatsapp?: string;
  className?: string;
}) {
  const items = [
    instagram ? { href: instagram, label: "Instagram", icon: <FaInstagram /> } : null,
    facebook ? { href: facebook, label: "Facebook", icon: <FaFacebookF /> } : null,
    linkedin ? { href: linkedin, label: "LinkedIn", icon: <FaLinkedinIn /> } : null,
    whatsapp ? { href: `https://wa.me/${whatsapp}`, label: "WhatsApp", icon: <FaWhatsapp /> } : null
  ].filter(Boolean) as Array<{ href: string; label: string; icon: React.ReactNode }>;

  return (
    <div className={`socials ${className}`.trim()}>
      {items.map((item) => (
        <a key={item.label} href={item.href} aria-label={item.label} target="_blank" rel="noreferrer">
          {item.icon}
        </a>
      ))}
    </div>
  );
}
