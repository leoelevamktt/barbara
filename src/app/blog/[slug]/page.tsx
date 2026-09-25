import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPostBySlug } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Artigo não encontrado", robots: { index: false } };
  const url = "/blog/" + slug;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title: post.title, description: post.excerpt, publishedTime: post.date },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const paragraphs = post.content.replace(/\\n/g, "\n").split(/\n\s*\n+/).map(x => x.trim()).filter(Boolean);
  const schema = {
    "@context": "https://schema.org", "@type": "BlogPosting",
    mainEntityOfPage: getSiteUrl() + "/blog/" + slug,
    headline: post.title, description: post.excerpt, datePublished: post.date,
    author: { "@type": "Person", name: "Barbara Cordeiro" },
    publisher: { "@type": "Organization", name: "Barbara Cordeiro Advocacia Criminal" }
  };
  return (
    <article>
      <section className="page-hero article-hero">
        <div className="shell article-shell">
          <nav className="article-back-nav" aria-label="Navegação do artigo">
            <Link href="/blog" className="back-link"><ArrowLeft size={16} /> Voltar ao blog</Link>
          </nav>
          <span className="article-category">{post.category}</span>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          <time dateTime={post.date}>
            {new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date(post.date + "T12:00:00"))}
          </time>
        </div>
      </section>
      <section className="section">
        <div className="shell article-content">
          {paragraphs.map((text, index) => <p key={index}>{text}</p>)}
          <div className="article-note">
            <b>Importante:</b> Este conteúdo tem caráter informativo e não substitui
            a análise individualizada de um caso concreto por profissional habilitado.
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </article>
  );
}
