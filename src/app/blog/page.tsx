import type { Metadata } from "next";
import BlogCard from "@/components/BlogCard";
import { getPublishedPosts } from "@/lib/content";

export const metadata: Metadata = { title: "Blog Jurídico", description: "Conteúdos informativos sobre Direito Penal, Processo Penal, garantias fundamentais e defesa criminal.", alternates: { canonical: "/blog" } };

export default async function Blog() {
  const posts = await getPublishedPosts();
  return <><section className="page-hero"><div className="shell"><span>Início / Blog Jurídico</span><h1>Blog Jurídico</h1><p>Informação jurídica em linguagem clara, responsável e acessível.</p></div></section><section className="section"><div className="shell"><div className="blog-grid blog-page-grid">{posts.map((post, i) => <BlogCard key={post.id} post={post} index={i} />)}</div></div></section></>;
}
