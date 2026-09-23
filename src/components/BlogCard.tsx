import Link from "next/link";
import { Gavel, Landmark, Scale, Shield } from "lucide-react";
import type { Post } from "@/lib/content";

const icons = [Gavel, Landmark, Scale, Shield];

export default function BlogCard({ post, index = 0 }: { post: Post; index?: number }) {
  const Icon = icons[index % icons.length];
  return (
    <article className="blog-card">
      <div className="blog-card-art"><Icon size={50} strokeWidth={1.2} /></div>
      <div className="blog-card-body">
        <span>{post.category}</span>
        <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
        <p>{post.excerpt}</p>
        <div className="blog-card-meta"><b>Leia mais →</b><time>{new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(post.date + "T12:00:00"))}</time></div>
      </div>
    </article>
  );
}
