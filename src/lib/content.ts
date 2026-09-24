import fallback from "../../content/site.json";

export type Area = { slug: string; title: string; description: string; icon: string };
export type Faq = { q: string; a: string };
export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  published: boolean;
  content: string;
};
export type SiteContent = typeof fallback;

const RAW_URL = "https://raw.githubusercontent.com/leoelevamktt/barbara/main/content/site.json";

// Normalizes legacy blog articles that stored literal "\n" instead of paragraph breaks.
function normalizeSiteContent(content: SiteContent): SiteContent {
  return {
    ...content,
    posts: content.posts.map((post) => ({
      ...post,
      content: post.content.replace(/\\n/g, "\n").replace(/\r\n/g, "\n")
    }))
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    if (process.env.NODE_ENV === "development" && !process.env.VERCEL) return normalizeSiteContent(fallback);
    const response = await fetch(RAW_URL, { next: { revalidate: 60 } });
    if (!response.ok) throw new Error(`GitHub content fetch failed: ${response.status}`);
    return normalizeSiteContent((await response.json()) as SiteContent);
  } catch {
    return normalizeSiteContent(fallback);
  }
}

export async function getPublishedPosts() {
  const site = await getSiteContent();
  return site.posts
    .filter((post) => post.published)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export async function getPostBySlug(slug: string) {
  const posts = await getPublishedPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}
