"use client";

import { useState, type FormEvent } from "react";

export default function ContactForm({ whatsapp }: { whatsapp: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const lead = {
      nome: String(data.get("nome") || "").trim(),
      telefone: String(data.get("telefone") || "").trim(),
      email: String(data.get("email") || "").trim(),
      assunto: String(data.get("assunto") || "").trim(),
      mensagem: String(data.get("mensagem") || "").trim(),
      website: String(data.get("website") || ""),
      consentimento: data.get("consentimento") === "on"
    };
    const text = [
      "Olá, Dra. Bárbara. Gostaria de solicitar atendimento.",
      `Nome: ${lead.nome}`, `Telefone: ${lead.telefone}`,
      `E-mail: ${lead.email}`, `Assunto: ${lead.assunto}`,
      `Mensagem: ${lead.mensagem}`
    ].join("\n");
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Falha ao enviar.");
      setWhatsappUrl(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`);
      form.reset();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível enviar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (whatsappUrl) {
    return (
      <div className="contact-form contact-success" role="status">
        <h3>Solicitação recebida!</h3>
        <p>Seus dados foram enviados para nosso atendimento. Retornaremos pelo contato informado.</p>
        <a className="btn btn-gold" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          Continuar pelo WhatsApp
        </a>
        <button type="button" className="contact-new-request" onClick={() => setWhatsappUrl("")}>
          Enviar outra solicitação
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <h3>Fale conosco</h3>
      <input name="nome" placeholder="Nome" aria-label="Nome" minLength={2} maxLength={120} required />
      <input name="telefone" placeholder="Telefone" aria-label="Telefone" minLength={8} maxLength={32} inputMode="tel" required />
      <input name="email" type="email" placeholder="E-mail" aria-label="E-mail" maxLength={254} required />
      <input name="assunto" placeholder="Assunto" aria-label="Assunto" maxLength={120} />
      <textarea name="mensagem" placeholder="Mensagem" aria-label="Mensagem" rows={5} minLength={5} maxLength={4000} required />
      <div className="form-honeypot" aria-hidden="true">
        <label>Não preencha este campo<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <label className="contact-consent">
        <input type="checkbox" name="consentimento" required />
        <span>Autorizo o uso dos dados informados para que a equipe entre em contato sobre minha solicitação.</span>
      </label>
      {error && <p className="contact-error" role="alert">{error}</p>}
      <button className="btn btn-gold" type="submit" disabled={submitting}>
        {submitting ? "Enviando..." : "Solicitar atendimento"}
      </button>
    </form>
  );
}
