import "server-only";
import { randomUUID } from "node:crypto";

const REPO = "leoelevamktt/barbara-leads";
const API = "https://api.github.com";
export type LeadStatus = "novo" | "em_atendimento" | "concluido";
export type Lead = {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  assunto: string;
  mensagem: string;
  criadoEm: string;
  status: LeadStatus;
};

type GithubIssue = {
  number: number;
  body: string | null;
  node_id: string;
  pull_request?: unknown;
};

function githubToken() {
  const token = process.env.GITHUB_LEADS_TOKEN;
  if (!token) throw new Error("O armazenamento seguro de leads não está configurado.");
  return token;
}

async function github(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${githubToken()}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers
    },
    cache: "no-store",
    signal: AbortSignal.timeout(12000)
  });
  if (!response.ok) {
    console.error("GitHub Leads API request failed:", response.status, path.split("?")[0]);
    throw new Error("Não foi possível acessar os leads. Tente novamente.");
  }
  return response.json();
}

function parseIssue(issue: GithubIssue): Lead | null {
  if (!issue.body || issue.pull_request) return null;
  try {
    const body = JSON.parse(issue.body) as Omit<Lead, "id"> & { tipo?: string };
    if (body.tipo !== "barbara-site-lead" || !body.nome || !body.criadoEm) return null;
    return {
      id: issue.number,
      nome: body.nome,
      telefone: body.telefone,
      email: body.email,
      assunto: body.assunto || "",
      mensagem: body.mensagem,
      criadoEm: body.criadoEm,
      status: ["novo", "em_atendimento", "concluido"].includes(body.status) ? body.status : "novo"
    };
  } catch {
    return null;
  }
}

export async function createLead(fields: Pick<Lead, "nome" | "telefone" | "email" | "assunto" | "mensagem">) {
  const id = randomUUID();
  const body = {
    tipo: "barbara-site-lead",
    ...fields,
    criadoEm: new Date().toISOString(),
    status: "novo"
  };
  const issue = await github(`/repos/${REPO}/issues`, {
    method: "POST",
    body: JSON.stringify({
      title: `Contato do site - ${id.slice(0, 8)}`,
      body: JSON.stringify(body)
    })
  }) as GithubIssue;
  return { id: issue.number };
}

export async function listLeads(): Promise<Lead[]> {
  const results: Lead[] = [];
  for (let page = 1; page <= 10; page++) {
    const issues = await github(
      `/repos/${REPO}/issues?state=all&per_page=100&page=${page}&sort=created&direction=desc`
    ) as GithubIssue[];
    for (const issue of issues) {
      const lead = parseIssue(issue);
      if (lead) results.push(lead);
    }
    if (issues.length < 100) break;
  }
  return results;
}

async function getIssue(id: number): Promise<GithubIssue> {
  if (!Number.isSafeInteger(id) || id < 1) throw new Error("Identificador inválido.");
  return github(`/repos/${REPO}/issues/${id}`) as Promise<GithubIssue>;
}

export async function updateLeadStatus(id: number, status: LeadStatus) {
  const issue = await getIssue(id);
  const lead = parseIssue(issue);
  if (!lead) throw new Error("Lead não encontrado.");
  await github(`/repos/${REPO}/issues/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      body: JSON.stringify({
        tipo: "barbara-site-lead",
        nome: lead.nome,
        telefone: lead.telefone,
        email: lead.email,
        assunto: lead.assunto,
        mensagem: lead.mensagem,
        criadoEm: lead.criadoEm,
        status
      })
    })
  });
}

export async function deleteLead(id: number) {
  const issue = await getIssue(id);
  if (!parseIssue(issue)) throw new Error("Lead não encontrado.");
  const response = await fetch(`${API}/graphql`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${githubToken()}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: "mutation DeleteLead($issueId: ID!) { deleteIssue(input: {issueId: $issueId}) { clientMutationId } }",
      variables: { issueId: issue.node_id }
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(12000)
  });
  const result = await response.json();
  if (!response.ok || result.errors?.length) {
    throw new Error("Não foi possível excluir este lead. Tente novamente.");
  }
}