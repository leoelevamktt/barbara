"use client";
import { useMemo, useState } from "react";
import type { Post, SiteContent } from "@/lib/content";

type Tab = "site" | "blog" | "seo";
const blankPost = { id: "", slug: "", title: "", excerpt: "", date: new Date().toISOString().slice(0,10), category: "Direito Penal", published: true, content: "" };

export default function AdminDashboard({ initial }: { initial: SiteContent }) {
  const [content, setContent] = useState<SiteContent>(initial);
  const [tab, setTab] = useState<Tab>("site");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [postDraft, setPostDraft] = useState<Post>(blankPost);

  const orderedPosts = useMemo(() => [...content.posts].sort((a,b) => +new Date(b.date)-+new Date(a.date)), [content.posts]);
  const updateProfile = <K extends keyof SiteContent["profile"]>(key: K, value: SiteContent["profile"][K]) => setContent(prev => ({ ...prev, profile: { ...prev.profile, [key]: value } }));
  const updateContact = <K extends keyof SiteContent["contact"]>(key: K, value: SiteContent["contact"][K]) => setContent(prev => ({ ...prev, contact: { ...prev.contact, [key]: value } }));
  const updateSeo = <K extends keyof SiteContent["seo"]>(key: K, value: SiteContent["seo"][K]) => setContent(prev => ({ ...prev, seo: { ...prev.seo, [key]: value } }));

  async function saveAll(next = content) {
    setSaving(true); setMessage("");
    const response = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
    const data = await response.json().catch(() => ({}));
    setSaving(false);
    if (!response.ok) { setMessage(data.error || "NÃ£o foi possÃ­vel salvar."); return; }
    setMessage("AlteraÃ§Ãµes salvas. O site atualiza automaticamente em atÃ© 1 minuto.");
  }

  function editPost(post: Post) { setEditingId(post.id); setPostDraft({ ...post }); }
  function newPost() { setEditingId("__new"); setPostDraft({ ...blankPost, id: `post-${Date.now()}` }); }
  function cancelPost() { setEditingId(null); setPostDraft(blankPost); }
  function slugify(v: string) { return v.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
  async function commitPost() {
    const draft = { ...postDraft, slug: postDraft.slug || slugify(postDraft.title) };
    if (!draft.title || !draft.slug || !draft.excerpt || !draft.content) { setMessage("Preencha tÃ­tulo, resumo e conteÃºdo do artigo."); return; }
    const exists = content.posts.some(p => p.id === draft.id);
    const posts = exists ? content.posts.map(p => p.id === draft.id ? draft : p) : [...content.posts, draft];
    const next = { ...content, posts } as SiteContent;
    setContent(next); setEditingId(null); setPostDraft(blankPost); await saveAll(next);
  }
  async function deletePost(id: string) {
    if (!confirm("Excluir este artigo?")) return;
    const next = { ...content, posts: content.posts.filter(p => p.id !== id) } as SiteContent;
    setContent(next); await saveAll(next);
  }
  async function logout() { await fetch("/api/admin/logout", { method: "POST" }); window.location.reload(); }

  return <div className="admin-shell">
    <aside className="admin-sidebar"><div><span className="admin-monogram small">BC</span><strong>BÃ¡rbara Cordeiro</strong><small>AdministraÃ§Ã£o</small></div><nav><button className={tab === "site" ? "active" : ""} onClick={() => setTab("site")}>ConteÃºdo do site</button><button className={tab === "blog" ? "active" : ""} onClick={() => setTab("blog")}>Blog</button><button className={tab === "seo" ? "active" : ""} onClick={() => setTab("seo")}>SEO</button></nav><div className="admin-side-bottom"><a href="/" target="_blank">Visualizar site â†—</a><button onClick={logout}>Sair</button></div></aside>
    <section className="admin-main"><header><div><span>Painel administrativo</span><h1>{tab === "site" ? "ConteÃºdo do site" : tab === "blog" ? "Blog jurÃ­dico" : "SEO e busca"}</h1></div>{tab !== "blog" && <button className="btn btn-gold" onClick={() => saveAll()} disabled={saving}>{saving ? "Salvando..." : "Salvar alteraÃ§Ãµes"}</button>}</header>{message && <div className="admin-message">{message}</div>}

    {tab === "site" && <div className="admin-form-grid"><div className="admin-card full"><h2>ApresentaÃ§Ã£o</h2><label>TÃ­tulo principal<input value={content.profile.heroTitle} onChange={e => updateProfile("heroTitle", e.target.value)} /></label><label>Texto da abertura<textarea rows={3} value={content.profile.heroText} onChange={e => updateProfile("heroText", e.target.value)} /></label></div><div className="admin-card"><h2>Perfil profissional</h2><label>Nome<input value={content.profile.name} onChange={e => updateProfile("name", e.target.value)} /></label><label>TÃ­tulo<input value={content.profile.title} onChange={e => updateProfile("title", e.target.value)} /></label><label>OAB<input value={content.profile.oab} onChange={e => updateProfile("oab", e.target.value)} /></label><label>Texto â€œSobreâ€<textarea rows={6} value={content.profile.aboutText} onChange={e => updateProfile("aboutText", e.target.value)} /></label></div><div className="admin-card"><h2>Contato</h2><label>WhatsApp (somente nÃºmeros)<input value={content.contact.whatsapp} onChange={e => updateContact("whatsapp", e.target.value)} /></label><label>Telefone exibido<input value={content.contact.phoneDisplay} onChange={e => updateContact("phoneDisplay", e.target.value)} /></label><label>E-mail<input value={content.contact.email} onChange={e => updateContact("email", e.target.value)} /></label><label>EndereÃ§o<input value={content.contact.address} onChange={e => updateContact("address", e.target.value)} /></label><label>HorÃ¡rio<input value={content.contact.hours} onChange={e => updateContact("hours", e.target.value)} /></label><label>Instagram<input value={content.contact.instagram} onChange={e => updateContact("instagram", e.target.value)} /></label><label>LinkedIn<input value={content.contact.linkedin} onChange={e => updateContact("linkedin", e.target.value)} /></label></div></div>}

    {tab === "blog" && <div>{editingId ? <div className="admin-card full post-editor"><div className="admin-card-head"><h2>{editingId === "__new" ? "Novo artigo" : "Editar artigo"}</h2><button onClick={cancelPost}>Cancelar</button></div><div className="two-cols"><label>TÃ­tulo<input value={postDraft.title} onChange={e => setPostDraft((p: Post) => ({...p,title:e.target.value,slug:p.slug || slugify(e.target.value)}))} /></label><label>Slug<input value={postDraft.slug} onChange={e => setPostDraft((p: Post) => ({...p,slug:slugify(e.target.value)}))} /></label><label>Categoria<input value={postDraft.category} onChange={e => setPostDraft((p: Post) => ({...p,category:e.target.value}))} /></label><label>Data<input type="date" value={postDraft.date} onChange={e => setPostDraft((p: Post) => ({...p,date:e.target.value}))} /></label></div><label>Resumo para cards e Google<textarea rows={3} value={postDraft.excerpt} onChange={e => setPostDraft((p: Post) => ({...p,excerpt:e.target.value}))} /></label><label>ConteÃºdo do artigo<textarea rows={13} value={postDraft.content} onChange={e => setPostDraft((p: Post) => ({...p,content:e.target.value}))} /></label><label className="check"><input type="checkbox" checked={postDraft.published} onChange={e => setPostDraft((p: Post) => ({...p,published:e.target.checked}))} /> Publicado</label><button className="btn btn-gold" onClick={commitPost} disabled={saving}>{saving ? "Salvando..." : "Salvar artigo"}</button></div> : <><div className="admin-blog-toolbar"><p>{content.posts.length} artigos cadastrados</p><button className="btn btn-gold" onClick={newPost}>+ Novo artigo</button></div><div className="admin-posts">{orderedPosts.map(post => <div className="admin-post-row" key={post.id}><div><span>{post.category} Â· {post.date}</span><strong>{post.title}</strong><small>{post.published ? "Publicado" : "Rascunho"}</small></div><div><button onClick={() => editPost(post)}>Editar</button><button className="danger" onClick={() => deletePost(post.id)}>Excluir</button></div></div>)}</div></>}</div>}

    {tab === "seo" && <div className="admin-form-grid"><div className="admin-card full"><h2>ConfiguraÃ§Ãµes de busca</h2><label>TÃ­tulo padrÃ£o<input value={content.seo.defaultTitle} onChange={e => updateSeo("defaultTitle", e.target.value)} /><small>{content.seo.defaultTitle.length}/60 caracteres</small></label><label>DescriÃ§Ã£o padrÃ£o<textarea rows={4} value={content.seo.description} onChange={e => updateSeo("description", e.target.value)} /><small>{content.seo.description.length}/160 caracteres</small></label><label>Palavras-chave<input value={content.seo.keywords.join(", ")} onChange={e => updateSeo("keywords", e.target.value.split(",").map(v => v.trim()).filter(Boolean))} /></label><div className="search-preview"><span>barbara-cordeiro.vercel.app</span><h3>{content.seo.defaultTitle}</h3><p>{content.seo.description}</p></div></div></div>}
    </section>
  </div>;
}

