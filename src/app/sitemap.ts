import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> { const base = getSiteUrl(); const posts = await getPublishedPosts(); return ["", "/sobre", "/areas-de-atuacao", "/blog", "/contato"].map((url) => ({ url: base + url, lastModified: new Date(), changeFrequency: url === "/blog" ? "weekly" as const : "monthly" as const, priority: url === "" ? 1 : .8 })).concat(posts.map((post) => ({ url: `${base}/blog/${post.slug}`, lastModified: new Date(post.date), changeFrequency: "monthly" as const, priority: .7 }))); }
