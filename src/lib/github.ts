import type { SiteContent } from "./content";

const apiBase = "https://api.github.com";

function repoConfig() {
  return {
    owner: process.env.GITHUB_REPO_OWNER || "leoelevamktt",
    repo: process.env.GITHUB_REPO_NAME || "barbara",
    token: process.env.GITHUB_CMS_TOKEN
  };
}

export async function saveSiteContent(content: SiteContent) {
  const { owner, repo, token } = repoConfig();
  if (!token) throw new Error("GITHUB_CMS_TOKEN não configurado.");
  const path = "content/site.json";
  const endpoint = `${apiBase}/repos/${owner}/${repo}/contents/${path}`;
  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json"
  };

  const current = await fetch(endpoint, { headers, cache: "no-store" });
  if (!current.ok) throw new Error(`Não foi possível carregar o conteúdo atual (${current.status}).`);
  const existing = (await current.json()) as { sha: string };
  const body = {
    message: `cms: atualiza conteúdo do site ${new Date().toISOString()}`,
    content: Buffer.from(JSON.stringify(content, null, 2) + "\n").toString("base64"),
    sha: existing.sha,
    branch: "main"
  };

  const updated = await fetch(endpoint, { method: "PUT", headers, body: JSON.stringify(body), cache: "no-store" });
  if (!updated.ok) {
    const detail = await updated.text();
    throw new Error(`Falha ao salvar no GitHub (${updated.status}): ${detail.slice(0, 240)}`);
  }
  return updated.json();
}
