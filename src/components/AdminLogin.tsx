"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError("");
    const data = new FormData(e.currentTarget);
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: data.get("password") }) });
    setLoading(false);
    if (!response.ok) { setError("Senha incorreta ou acesso ainda não configurado."); return; }
    window.location.reload();
  }
  return <div className="admin-login-wrap"><form className="admin-login" onSubmit={submit}><div className="admin-monogram">BC</div><h1>Painel Administrativo</h1><p>Gerencie conteúdo, blog e informações institucionais.</p><input name="password" type="password" placeholder="Senha de acesso" autoFocus required />{error && <small className="admin-error">{error}</small>}<button className="btn btn-gold" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button><Link href="/">← Voltar ao site</Link></form></div>;
}
