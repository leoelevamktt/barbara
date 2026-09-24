"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity, BookOpen, BriefcaseBusiness, CheckCircle2, ChevronDown, ChevronUp, Copy,
  CircleHelp, Download, ExternalLink, FileText, Globe2, LayoutDashboard, LogOut, MessageSquareText,
  Plus, RefreshCw, Save, Search, Settings2, ShieldCheck, Trash2, Upload, UserRound, X
} from "lucide-react";
import type { Area, Faq, Post, SiteContent } from "@/lib/content";

type Tab = "dashboard" | "site" | "about" | "areas" | "faq" | "blog" | "seo" | "contact";

const blankPost: Post = {
  id: "",
  slug: "",
  title: "",
  excerpt: "",
  date: new Date().toISOString().slice(0, 10),
  category: "Direito Penal",
  published: true,
  content: ""
};

const blankArea: Area = {
  slug: "",
  title: "",
  description: "",
  icon: "Scale"
};

export default function AdminDashboard({ initial }: { initial: SiteContent }) {
  const [content, setContent] = useState<SiteContent>(initial);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [dirty, setDirty] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [postDraft, setPostDraft] = useState<Post>(blankPost);
  const [postQuery, setPostQuery] = useState("");

  const orderedPosts = useMemo(
    () => [...content.posts].sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    [content.posts]
  );
  const filteredPosts = useMemo(() => {
    const query = postQuery.trim().toLocaleLowerCase("pt-BR");
    if (!query) return orderedPosts;
    return orderedPosts.filter((post) => [post.title, post.category, post.slug].some((value) => value.toLocaleLowerCase("pt-BR").includes(query)));
  }, [orderedPosts, postQuery]);

  const stats = useMemo(() => ({
    published: content.posts.filter((post) => post.published).length,
    drafts: content.posts.filter((post) => !post.published).length,
    areas: content.areas.length,
    faqs: content.faqs.length
  }), [content]);

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  function mutate(updater: (prev: SiteContent) => SiteContent) {
    setContent((prev) => updater(prev));
    setDirty(true);
    setMessage("");
  }

  const updateProfile = <K extends keyof SiteContent["profile"]>(key: K, value: SiteContent["profile"][K]) =>
    mutate((prev) => ({ ...prev, profile: { ...prev.profile, [key]: value } }));

  const updateContact = <K extends keyof SiteContent["contact"]>(key: K, value: SiteContent["contact"][K]) =>
    mutate((prev) => ({ ...prev, contact: { ...prev.contact, [key]: value } }));

  const updateSeo = <K extends keyof SiteContent["seo"]>(key: K, value: SiteContent["seo"][K]) =>
    mutate((prev) => ({ ...prev, seo: { ...prev.seo, [key]: value } }));

  async function saveAll(next = content) {
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next)
    });
    const data = await response.json().catch(() => ({}));
    setSaving(false);
    if (!response.ok) {
      setMessage(data.error || "Não foi possível salvar as alterações.");
      return false;
    }
    setContent(next);
    setDirty(false);
    setMessage("Alterações publicadas com sucesso. O site pode levar até 1 minuto para atualizar.");
    return true;
  }

  async function reloadContent() {
    if (dirty && !confirm("Existem alterações não salvas. Deseja recarregar mesmo assim?")) return;
    const response = await fetch("/api/admin/content", { cache: "no-store" });
    if (!response.ok) return setMessage("Não foi possível recarregar o conteúdo.");
    setContent(await response.json());
    setDirty(false);
    setMessage("Conteúdo recarregado.");
  }

  function exportBackup() {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `barbara-cordeiro-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage("Backup exportado com sucesso.");
  }

  async function importBackup(file?: File) {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as SiteContent;
      if (!parsed?.profile?.name || !Array.isArray(parsed.posts) || !Array.isArray(parsed.areas) || !Array.isArray(parsed.faqs)) {
        throw new Error("Estrutura inválida.");
      }
      setContent(parsed);
      setDirty(true);
      setMessage("Backup carregado. Revise o conteúdo e clique em Salvar alterações para publicar.");
    } catch {
      setMessage("O arquivo selecionado não é um backup válido deste site.");
    }
  }

  function slugify(value: string) {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function editPost(post: Post) {
    setEditingId(post.id);
    setPostDraft({ ...post });
    setMessage("");
  }

  function newPost() {
    setEditingId("__new");
    setPostDraft({ ...blankPost, id: `post-${Date.now()}` });
    setMessage("");
  }

  function cancelPost() {
    setEditingId(null);
    setPostDraft(blankPost);
  }

  async function commitPost() {
    const draft = { ...postDraft, slug: postDraft.slug || slugify(postDraft.title) };
    if (!draft.title || !draft.slug || !draft.excerpt || !draft.content) {
      setMessage("Preencha título, resumo e conteúdo do artigo.");
      return;
    }
    const exists = content.posts.some((post) => post.id === draft.id);
    const posts = exists
      ? content.posts.map((post) => post.id === draft.id ? draft : post)
      : [...content.posts, draft];
    const next = { ...content, posts } as SiteContent;
    setEditingId(null);
    setPostDraft(blankPost);
    await saveAll(next);
  }

  async function deletePost(id: string) {
    if (!confirm("Excluir este artigo permanentemente?")) return;
    await saveAll({ ...content, posts: content.posts.filter((post) => post.id !== id) } as SiteContent);
  }

  function duplicatePost(post: Post) {
    const timestamp = Date.now();
    setEditingId("__new");
    setPostDraft({
      ...post,
      id: `post-${timestamp}`,
      slug: `${post.slug}-copia-${String(timestamp).slice(-5)}`,
      title: `${post.title} (cópia)`,
      published: false
    });
    setMessage("Cópia criada como rascunho. Revise antes de salvar.");
  }

  async function togglePostPublished(post: Post) {
    const posts = content.posts.map((item) => item.id === post.id ? { ...item, published: !item.published } : item);
    await saveAll({ ...content, posts } as SiteContent);
  }

  function updateArea(index: number, key: keyof Area, value: string) {
    mutate((prev) => ({
      ...prev,
      areas: prev.areas.map((area, i) => i === index ? { ...area, [key]: value } : area)
    }));
  }

  function addArea() {
    mutate((prev) => ({ ...prev, areas: [...prev.areas, { ...blankArea, slug: `nova-area-${Date.now()}` }] }));
  }

  function deleteArea(index: number) {
    if (!confirm("Remover esta área de atuação?")) return;
    mutate((prev) => ({ ...prev, areas: prev.areas.filter((_, i) => i !== index) }));
  }

  function moveArea(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= content.areas.length) return;
    mutate((prev) => {
      const areas = [...prev.areas];
      [areas[index], areas[target]] = [areas[target], areas[index]];
      return { ...prev, areas };
    });
  }

  function updateFaq(index: number, key: keyof Faq, value: string) {
    mutate((prev) => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) => i === index ? { ...faq, [key]: value } : faq)
    }));
  }

  function addFaq() {
    mutate((prev) => ({ ...prev, faqs: [...prev.faqs, { q: "Nova pergunta", a: "Nova resposta" }] }));
  }

  function deleteFaq(index: number) {
    if (!confirm("Remover esta pergunta frequente?")) return;
    mutate((prev) => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== index) }));
  }

  function moveFaq(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= content.faqs.length) return;
    mutate((prev) => {
      const faqs = [...prev.faqs];
      [faqs[index], faqs[target]] = [faqs[target], faqs[index]];
      return { ...prev, faqs };
    });
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  const nav = [
    { id: "dashboard" as Tab, label: "Visão geral", icon: LayoutDashboard },
    { id: "site" as Tab, label: "Página inicial", icon: Globe2 },
    { id: "about" as Tab, label: "Sobre", icon: UserRound },
    { id: "areas" as Tab, label: "Áreas de atuação", icon: BriefcaseBusiness },
    { id: "faq" as Tab, label: "Perguntas frequentes", icon: CircleHelp },
    { id: "blog" as Tab, label: "Blog", icon: BookOpen },
    { id: "seo" as Tab, label: "SEO", icon: Search },
    { id: "contact" as Tab, label: "Contato e redes", icon: MessageSquareText }
  ];

  const titles: Record<Tab, string> = {
    dashboard: "Visão geral",
    site: "Página inicial",
    about: "Sobre a advogada",
    areas: "Áreas de atuação",
    faq: "Perguntas frequentes",
    blog: "Blog jurídico",
    seo: "SEO e indexação",
    contact: "Contato e redes sociais"
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-monogram small">BC</span>
          <strong>Bárbara Cordeiro</strong>
          <small>Administração</small>
        </div>

        <nav aria-label="Menu administrativo">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id)}>
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="admin-side-bottom">
          <a href="/" target="_blank" rel="noreferrer"><ExternalLink size={15} />Visualizar site</a>
          <button onClick={logout}><LogOut size={15} />Sair</button>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <span>Painel administrativo</span>
            <h1>{titles[tab]}</h1>
            <p className="admin-subtitle">Gerencie o conteúdo publicado sem alterar o código do site.</p>
          </div>
          <div className="admin-top-actions">
            <button className="admin-secondary-action" onClick={reloadContent}><RefreshCw size={16} />Recarregar</button>
            <button className="btn btn-gold" onClick={() => saveAll()} disabled={saving || !dirty}>
              <Save size={16} />{saving ? "Salvando..." : dirty ? "Salvar alterações" : "Tudo salvo"}
            </button>
          </div>
        </header>

        <div className={`admin-save-state ${dirty ? "is-dirty" : ""}`}>
          {dirty ? <Activity size={15} /> : <CheckCircle2 size={15} />}
          {dirty ? "Existem alterações ainda não publicadas." : "Conteúdo sincronizado com a versão publicada."}
        </div>

        {message && <div className="admin-message">{message}</div>}

        {tab === "dashboard" && (
          <div className="admin-dashboard">
            <div className="admin-stats">
              <div><BookOpen /><strong>{stats.published}</strong><span>Artigos publicados</span></div>
              <div><FileText /><strong>{stats.drafts}</strong><span>Rascunhos</span></div>
              <div><BriefcaseBusiness /><strong>{stats.areas}</strong><span>Áreas de atuação</span></div>
              <div><CircleHelp /><strong>{stats.faqs}</strong><span>Perguntas no FAQ</span></div>
            </div>

            <div className="admin-dashboard-grid">
              <div className="admin-card">
                <div className="admin-card-head">
                  <div><span className="admin-kicker">Publicação</span><h2>Status do site</h2></div>
                  <ShieldCheck size={22} />
                </div>
                <div className="admin-health-row"><span>Conteúdo principal</span><b>Configurado</b></div>
                <div className="admin-health-row"><span>SEO básico</span><b>Ativo</b></div>
                <div className="admin-health-row"><span>Sitemap e robots</span><b>Ativos</b></div>
                <div className="admin-health-row"><span>Blog</span><b>{stats.published} publicados</b></div>
              </div>

              <div className="admin-card">
                <div className="admin-card-head"><div><span className="admin-kicker">Ações rápidas</span><h2>Atalhos</h2></div><Settings2 size={22} /></div>
                <div className="admin-quick-actions">
                  <button onClick={() => { setTab("blog"); newPost(); }}><Plus size={16} />Novo artigo</button>
                  <button onClick={() => setTab("seo")}><Search size={16} />Revisar SEO</button>
                  <button onClick={exportBackup}><Download size={16} />Exportar backup</button>
                  <label className="admin-import-action"><Upload size={16} />Importar backup<input type="file" accept="application/json,.json" onChange={(e) => importBackup(e.target.files?.[0])} /></label>
                  <button onClick={() => setTab("contact")}><MessageSquareText size={16} />Atualizar contato</button>
                  <a href="/" target="_blank" rel="noreferrer"><ExternalLink size={16} />Abrir site</a>
                </div>
              </div>
            </div>

            <div className="admin-card admin-recent">
              <div className="admin-card-head"><div><span className="admin-kicker">Conteúdo recente</span><h2>Últimos artigos</h2></div><button onClick={() => setTab("blog")}>Gerenciar blog</button></div>
              {orderedPosts.slice(0, 5).map((post) => (
                <div className="admin-post-row" key={post.id}>
                  <div><span>{post.category} · {post.date}</span><strong>{post.title}</strong><small>{post.published ? "Publicado" : "Rascunho"}</small></div>
                  <button onClick={() => { setTab("blog"); editPost(post); }}>Editar</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "site" && (
          <div className="admin-form-grid">
            <div className="admin-card full">
              <div className="admin-card-head"><div><span className="admin-kicker">Hero</span><h2>Apresentação principal</h2></div></div>
              <label>Título principal<input value={content.profile.heroTitle} onChange={(e) => updateProfile("heroTitle", e.target.value)} /></label>
              <label>Texto de abertura<textarea rows={4} value={content.profile.heroText} onChange={(e) => updateProfile("heroText", e.target.value)} /></label>
              <div className="admin-help">Esses textos aparecem no primeiro bloco da página inicial e são importantes para conversão e SEO.</div>
            </div>
          </div>
        )}

        {tab === "about" && (
          <div className="admin-form-grid">
            <div className="admin-card">
              <span className="admin-kicker">Perfil profissional</span><h2>Identificação</h2>
              <label>Nome<input value={content.profile.name} onChange={(e) => updateProfile("name", e.target.value)} /></label>
              <label>Título profissional<input value={content.profile.title} onChange={(e) => updateProfile("title", e.target.value)} /></label>
              <label>OAB<input value={content.profile.oab} onChange={(e) => updateProfile("oab", e.target.value)} /></label>
            </div>
            <div className="admin-card">
              <span className="admin-kicker">Texto institucional</span><h2>Apresentação</h2>
              <label>Parágrafo de abertura<textarea rows={5} value={content.profile.aboutLead} onChange={(e) => updateProfile("aboutLead", e.target.value)} /></label>
              <label>Texto principal<textarea rows={8} value={content.profile.aboutText} onChange={(e) => updateProfile("aboutText", e.target.value)} /></label>
            </div>
            <div className="admin-card full">
              <span className="admin-kicker">Posicionamento</span><h2>Missão, visão e valores</h2>
              <div className="three-cols">
                <label>Missão<textarea rows={6} value={content.profile.mission} onChange={(e) => updateProfile("mission", e.target.value)} /></label>
                <label>Visão<textarea rows={6} value={content.profile.vision} onChange={(e) => updateProfile("vision", e.target.value)} /></label>
                <label>Valores<textarea rows={6} value={content.profile.values.join("\n")} onChange={(e) => updateProfile("values", e.target.value.split("\n").map((v) => v.trim()).filter(Boolean))} /><small>Um valor por linha.</small></label>
              </div>
            </div>
          </div>
        )}

        {tab === "areas" && (
          <div className="admin-collection">
            <div className="admin-collection-toolbar"><p>{content.areas.length} áreas cadastradas</p><button className="btn btn-gold" onClick={addArea}><Plus size={16} />Adicionar área</button></div>
            {content.areas.map((area, index) => (
              <div className="admin-card admin-repeater" key={area.slug + index}>
                <div className="admin-repeater-index">{String(index + 1).padStart(2, "0")}</div>
                <div className="admin-repeater-fields">
                  <div className="two-cols">
                    <label>Título<input value={area.title} onChange={(e) => updateArea(index, "title", e.target.value)} /></label>
                    <label>Slug<input value={area.slug} onChange={(e) => updateArea(index, "slug", slugify(e.target.value))} /></label>
                  </div>
                  <label>Descrição<textarea rows={3} value={area.description} onChange={(e) => updateArea(index, "description", e.target.value)} /></label>
                  <label>Ícone<input value={area.icon} onChange={(e) => updateArea(index, "icon", e.target.value)} /><small>Nome do ícone Lucide usado no card.</small></label>
                </div>
                <div className="admin-repeater-actions">
                  <button aria-label="Mover para cima" onClick={() => moveArea(index, -1)} disabled={index === 0}><ChevronUp /></button>
                  <button aria-label="Mover para baixo" onClick={() => moveArea(index, 1)} disabled={index === content.areas.length - 1}><ChevronDown /></button>
                  <button className="danger" aria-label="Excluir" onClick={() => deleteArea(index)}><Trash2 /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "faq" && (
          <div className="admin-collection">
            <div className="admin-collection-toolbar"><p>{content.faqs.length} perguntas cadastradas</p><button className="btn btn-gold" onClick={addFaq}><Plus size={16} />Adicionar pergunta</button></div>
            {content.faqs.map((faq, index) => (
              <div className="admin-card admin-repeater faq-admin-item" key={index}>
                <div className="admin-repeater-index">{String(index + 1).padStart(2, "0")}</div>
                <div className="admin-repeater-fields">
                  <label>Pergunta<input value={faq.q} onChange={(e) => updateFaq(index, "q", e.target.value)} /></label>
                  <label>Resposta<textarea rows={4} value={faq.a} onChange={(e) => updateFaq(index, "a", e.target.value)} /></label>
                </div>
                <div className="admin-repeater-actions">
                  <button onClick={() => moveFaq(index, -1)} disabled={index === 0}><ChevronUp /></button>
                  <button onClick={() => moveFaq(index, 1)} disabled={index === content.faqs.length - 1}><ChevronDown /></button>
                  <button className="danger" onClick={() => deleteFaq(index)}><Trash2 /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "blog" && (
          <div>
            {editingId ? (
              <div className="admin-card full post-editor">
                <div className="admin-card-head">
                  <div><span className="admin-kicker">Editor de conteúdo</span><h2>{editingId === "__new" ? "Novo artigo" : "Editar artigo"}</h2></div>
                  <button className="admin-icon-text" onClick={cancelPost}><X size={16} />Fechar editor</button>
                </div>
                <div className="two-cols">
                  <label>Título<input value={postDraft.title} onChange={(e) => setPostDraft((p) => ({ ...p, title: e.target.value, slug: p.slug || slugify(e.target.value) }))} /></label>
                  <label>Slug<input value={postDraft.slug} onChange={(e) => setPostDraft((p) => ({ ...p, slug: slugify(e.target.value) }))} /></label>
                  <label>Categoria<input value={postDraft.category} onChange={(e) => setPostDraft((p) => ({ ...p, category: e.target.value }))} /></label>
                  <label>Data<input type="date" value={postDraft.date} onChange={(e) => setPostDraft((p) => ({ ...p, date: e.target.value }))} /></label>
                </div>
                <label>Resumo para cards e mecanismos de busca<textarea rows={3} value={postDraft.excerpt} onChange={(e) => setPostDraft((p) => ({ ...p, excerpt: e.target.value }))} /><small>{postDraft.excerpt.length}/160 caracteres recomendados.</small></label>
                <label>Conteúdo do artigo<textarea className="admin-content-editor" rows={18} value={postDraft.content} onChange={(e) => setPostDraft((p) => ({ ...p, content: e.target.value }))} /></label>
                <div className="post-publish-row">
                  <label className="check"><input type="checkbox" checked={postDraft.published} onChange={(e) => setPostDraft((p) => ({ ...p, published: e.target.checked }))} /> Publicar artigo</label>
                  <button className="btn btn-gold" onClick={commitPost} disabled={saving}><Save size={16} />{saving ? "Salvando..." : "Salvar artigo"}</button>
                </div>
              </div>
            ) : (
              <>
                <div className="admin-collection-toolbar">
                  <p>{content.posts.length} artigos · {stats.published} publicados · {stats.drafts} rascunhos</p>
                  <button className="btn btn-gold" onClick={newPost}><Plus size={16} />Novo artigo</button>
                </div>
                <div className="admin-blog-controls">
                  <div className="admin-search-box"><Search size={16} /><input value={postQuery} onChange={(e) => setPostQuery(e.target.value)} placeholder="Buscar por título, categoria ou slug..." /></div>
                  <span>{filteredPosts.length} resultado{filteredPosts.length === 1 ? "" : "s"}</span>
                </div>
                <div className="admin-posts">
                  {filteredPosts.map((post) => (
                    <div className="admin-post-row" key={post.id}>
                      <div><span>{post.category} · {post.date}</span><strong>{post.title}</strong><small className={post.published ? "status-published" : "status-draft"}>{post.published ? "Publicado" : "Rascunho"}</small></div>
                      <div>
                        <button onClick={() => togglePostPublished(post)}>{post.published ? "Despublicar" : "Publicar"}</button>
                        <button onClick={() => duplicatePost(post)} title="Duplicar artigo"><Copy size={13} /></button>
                        <button onClick={() => editPost(post)}>Editar</button>
                        <button className="danger" onClick={() => deletePost(post.id)}>Excluir</button>
                      </div>
                    </div>
                  ))}
                  {filteredPosts.length === 0 && <div className="admin-empty-state">Nenhum artigo encontrado para essa busca.</div>}
                </div>
              </>
            )}
          </div>
        )}

        {tab === "seo" && (
          <div className="admin-form-grid">
            <div className="admin-card full">
              <span className="admin-kicker">Mecanismos de busca</span><h2>Metadados globais</h2>
              <label>Nome do site<input value={content.seo.siteName} onChange={(e) => updateSeo("siteName", e.target.value)} /></label>
              <label>Título padrão<input value={content.seo.defaultTitle} onChange={(e) => updateSeo("defaultTitle", e.target.value)} /><small className={content.seo.defaultTitle.length > 60 ? "limit-warning" : ""}>{content.seo.defaultTitle.length}/60 caracteres</small></label>
              <label>Descrição padrão<textarea rows={4} value={content.seo.description} onChange={(e) => updateSeo("description", e.target.value)} /><small className={content.seo.description.length > 160 ? "limit-warning" : ""}>{content.seo.description.length}/160 caracteres</small></label>
              <label>Palavras-chave<input value={content.seo.keywords.join(", ")} onChange={(e) => updateSeo("keywords", e.target.value.split(",").map((v) => v.trim()).filter(Boolean))} /></label>
              <div className="search-preview"><span>barbara-chi.vercel.app</span><h3>{content.seo.defaultTitle}</h3><p>{content.seo.description}</p></div>
              <div className="admin-seo-checks">
                <span><CheckCircle2 />Sitemap automático</span>
                <span><CheckCircle2 />robots.txt</span>
                <span><CheckCircle2 />Dados estruturados</span>
                <span><CheckCircle2 />Open Graph</span>
              </div>
            </div>
          </div>
        )}

        {tab === "contact" && (
          <div className="admin-form-grid">
            <div className="admin-card">
              <span className="admin-kicker">Atendimento</span><h2>Dados de contato</h2>
              <label>WhatsApp (somente números)<input value={content.contact.whatsapp} onChange={(e) => updateContact("whatsapp", e.target.value.replace(/\D/g, ""))} /></label>
              <label>Telefone exibido<input value={content.contact.phoneDisplay} onChange={(e) => updateContact("phoneDisplay", e.target.value)} /></label>
              <label>E-mail<input type="email" value={content.contact.email} onChange={(e) => updateContact("email", e.target.value)} /></label>
              <label>Endereço<input value={content.contact.address} onChange={(e) => updateContact("address", e.target.value)} /></label>
              <label>Horário de atendimento<input value={content.contact.hours} onChange={(e) => updateContact("hours", e.target.value)} /></label>
              <label>Plantão de urgência<input value={content.contact.urgentHours} onChange={(e) => updateContact("urgentHours", e.target.value)} /></label>
            </div>
            <div className="admin-card">
              <span className="admin-kicker">Presença digital</span><h2>Redes sociais</h2>
              <label>Instagram<input value={content.contact.instagram} onChange={(e) => updateContact("instagram", e.target.value)} placeholder="https://instagram.com/..." /></label>
              <div className="admin-help">O site exibe apenas Instagram, WhatsApp e e-mail. Os links do WhatsApp e do e-mail usam os dados de contato cadastrados ao lado.</div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
