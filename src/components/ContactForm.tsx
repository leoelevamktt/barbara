"use client";

import { FormEvent } from "react";

export default function ContactForm({ whatsapp }: { whatsapp: string }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = [
      "Olá, Dra. Bárbara. Gostaria de solicitar atendimento.",
      `Nome: ${data.get("nome")}`,
      `Telefone: ${data.get("telefone")}`,
      `E-mail: ${data.get("email")}`,
      `Assunto: ${data.get("assunto")}`,
      `Mensagem: ${data.get("mensagem")}`
    ].join("\n");
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <h3>Fale Conosco</h3>
      <input name="nome" placeholder="Nome" required />
      <input name="telefone" placeholder="Telefone" required />
      <input name="email" type="email" placeholder="E-mail" required />
      <input name="assunto" placeholder="Assunto" />
      <textarea name="mensagem" placeholder="Mensagem" rows={5} required />
      <button className="btn btn-gold" type="submit">Solicitar atendimento</button>
    </form>
  );
}
