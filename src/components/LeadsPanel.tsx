"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Mail, MessageCircle, RefreshCw, Trash2 } from "lucide-react";
import type { Lead, LeadStatus } from "@/lib/leads";

const labels: Record<LeadStatus, string> = {
  novo: "Novo",
  em_atendimento: "Em atendimento",
  concluido: "Concluído"
};

function formatDate(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(+date) ? "Data indisponível" : date.toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
  });
}

function csvCell(value: string | number) {
  const safe = String(value).replace(/^[\s]*[=+\-@]/, (match) => "'" + match);
  return '"' + safe.replace(/"/g, '""') + '"';
}

export default function LeadsPanel() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<"todos" | LeadStatus>("todos");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/leads", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível carregar os leads.");
      setLeads(result.leads);
      setSelectedId((current) => current && result.leads.some((lead: Lead) => lead.id === current)
        ? current : (result.leads[0]?.id ?? null));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Falha ao carregar os leads.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/leads", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Falha ao carregar.");
        return result.leads as Lead[];
      })
      .then((incoming) => {
        if (!active) return;
        setLeads(incoming);
        setSelectedId(incoming[0]?.id ?? null);
      })
      .catch((cause) => {
        if (active) setError(cause instanceof Error ? cause.message : "Falha ao carregar.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    return leads.filter((lead) => (filter === "todos" || lead.status === filter)
      && (!normalized || [lead.nome, lead.email, lead.telefone, lead.assunto].some((field) =>
        field.toLocaleLowerCase("pt-BR").includes(normalized))));
  }, [leads, filter, query]);
  const selected = leads.find((lead) => lead.id === selectedId);

  async function setStatus(id: number, status: LeadStatus) {
    setProcessingId(id);
    setError("");
    try {
      const response = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error((await response.json()).error || "Falha ao atualizar.");
      setLeads((prev) => prev.map((lead) => lead.id === id ? { ...lead, status } : lead));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Falha ao atualizar.");
    } finally {
      setProcessingId(null);
    }
  }

  async function remove(id: number) {
    if (!window.confirm("Excluir permanentemente este lead? Esta ação não pode ser desfeita.")) return;
    setProcessingId(id);
    setError("");
    try {
      const response = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error((await response.json()).error || "Falha ao excluir.");
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
      setSelectedId(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Falha ao excluir.");
    } finally {
      setProcessingId(null);
    }
  }

  function exportCsv() {
    const rows = [
      ["Recebido em", "Nome", "Telefone", "E-mail", "Assunto", "Mensagem", "Status"],
      ...filtered.map((lead) => [formatDate(lead.criadoEm), lead.nome, lead.telefone, lead.email,
        lead.assunto, lead.mensagem, labels[lead.status]])
    ];
    const csv = "\uFEFF" + rows.map((row) => row.map(csvCell).join(";")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-barbara-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="leads-panel">
      <div className="leads-toolbar">
        <div><strong>{leads.length} leads recebidos</strong><span>{leads.filter((lead) => lead.status === "novo").length} aguardando atendimento</span></div>
        <div className="leads-actions">
          <button type="button" onClick={exportCsv} disabled={loading || !filtered.length}><Download size={16} />Exportar CSV</button>
          <button type="button" onClick={() => void load()} disabled={loading}><RefreshCw size={16} />Atualizar</button>
        </div>
      </div>
      {error && <div className="leads-error" role="alert">{error}</div>}
      <div className="leads-filters">
        <input aria-label="Pesquisar leads" value={query} onChange={(event) => setQuery(event.target.value)}
          placeholder="Pesquisar por nome, e-mail, telefone ou assunto" />
        <select aria-label="Filtrar leads" value={filter}
          onChange={(event) => setFilter(event.target.value as typeof filter)}>
          <option value="todos">Todos os status</option>
          {Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>
      {loading ? <div className="leads-empty">Carregando leads...</div> : (
        <div className="leads-layout">
          <div className="leads-list" aria-label="Leads recebidos">
            {filtered.map((lead) => (
              <button key={lead.id} type="button"
                className={`lead-list-item ${selectedId === lead.id ? "selected" : ""}`}
                onClick={() => setSelectedId(lead.id)}>
                <span className="lead-list-date">{formatDate(lead.criadoEm)}</span>
                <strong>{lead.nome}</strong>
                <span>{lead.assunto || "Solicitação de atendimento"}</span>
                <small className={`lead-status ${lead.status}`}>{labels[lead.status]}</small>
              </button>
            ))}
            {!filtered.length && <div className="leads-empty">Nenhum lead encontrado.</div>}
          </div>
          <div className="lead-detail">
            {selected ? (
              <>
                <div className="lead-detail-head">
                  <div><span className="admin-kicker">Solicitação de atendimento</span><h2>{selected.nome}</h2>
                    <p>Recebido em {formatDate(selected.criadoEm)}</p></div>
                  <small className={`lead-status ${selected.status}`}>{labels[selected.status]}</small>
                </div>
                <div className="lead-fields">
                  <div><span>Telefone</span><strong>{selected.telefone}</strong></div>
                  <div><span>E-mail</span><strong>{selected.email}</strong></div>
                  <div><span>Assunto</span><strong>{selected.assunto || "Não informado"}</strong></div>
                  <div className="lead-message"><span>Mensagem</span><p>{selected.mensagem}</p></div>
                </div>
                <label className="lead-state-label">Status
                  <select value={selected.status} disabled={processingId === selected.id}
                    onChange={(event) => void setStatus(selected.id, event.target.value as LeadStatus)}>
                    {Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
                <div className="lead-contact-actions">
                  <a href={`https://wa.me/${selected.telefone.replace(/\D/g, "").replace(/^(?!55)/, "55")}`}
                    target="_blank" rel="noopener noreferrer"><MessageCircle size={16} />WhatsApp</a>
                  <a href={`mailto:${selected.email}`}><Mail size={16} />Responder por e-mail</a>
                </div>
                <button className="lead-delete" type="button" disabled={processingId === selected.id}
                  onClick={() => void remove(selected.id)}><Trash2 size={16} />Excluir lead</button>
              </>
            ) : <div className="leads-empty">Selecione um lead para visualizar os detalhes.</div>}
          </div>
        </div>
      )}
    </section>
  );
}
