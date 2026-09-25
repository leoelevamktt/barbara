import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { getSiteContent } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent();
  return {
    metadataBase: new URL(getSiteUrl()),
    title: { default: site.seo.defaultTitle, template: `%s | ${site.seo.siteName}` },
    description: site.seo.description,
    keywords: site.seo.keywords,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: site.seo.siteName,
      title: site.seo.defaultTitle,
      description: site.seo.description,
      images: [{ url: "/images/barbara-hero.webp", width: 864, height: 1184, alt: "Barbara Cordeiro - Advogada Criminalista" }]
    },
    twitter: { card: "summary_large_image", title: site.seo.defaultTitle, description: site.seo.description, images: ["/images/barbara-hero.webp"] },
    robots: { index: true, follow: true }
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const site = await getSiteContent();
  const schema = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: site.seo.siteName,
    description: site.seo.description,
    areaServed: "Brasil",
    address: { "@type": "PostalAddress", streetAddress: site.contact.address.split(",").slice(0, 3).join(",").trim(), addressLocality: "São Paulo", addressRegion: "SP", addressCountry: "BR" },
    telephone: site.contact.phoneDisplay,
    email: site.contact.email,
    image: "/images/barbara-hero.webp",
    founder: { "@type": "Person", name: site.profile.name, jobTitle: site.profile.title }
  };

  return (
    <html lang="pt-BR">
      <body>
        <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
        <Header whatsapp={site.contact.whatsapp} />
        <main id="conteudo">{children}</main>
        <Footer site={site} />
        <WhatsAppFloat number={site.contact.whatsapp} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </body>
    </html>
  );
}
