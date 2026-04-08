"use client";

import { useAuth } from "@/contexts/auth-context";
import { getErrorMessage } from "@/lib/get-error-message";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/equipes");
    }
  }, [isAuthenticated, isLoading, router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await register({ name, email, password });
      router.push("/equipes");
    } catch (err) {
      setError(getErrorMessage(err, "Nao foi possivel criar a conta agora."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-xl">
      <div className="panel">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand)]">Cadastro</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--foreground)]">Criar conta de treinador</h1>
        <p className="mt-3 text-base leading-7 text-[var(--muted)]">
          Cadastre-se para salvar equipes, editar os detalhes do seu time e manter tudo vinculado ao seu usuario.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]" htmlFor="name">
              Nome
            </label>
            <input
              id="name"
              type="text"
              className="input"
              placeholder="Ash Ketchum"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="treinador@poketeam.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              className="input"
              placeholder="Minimo de 6 caracteres"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error && <p className="rounded-2xl bg-[rgba(198,61,47,0.08)] px-4 py-3 text-sm text-[var(--danger)]">{error}</p>}

          <button type="submit" className="button-primary w-full" disabled={submitting}>
            {submitting ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <p className="mt-6 text-sm text-[var(--muted)]">
          Ja possui conta? <Link href="/login" className="font-semibold text-[var(--brand)]">Entrar</Link>
        </p>
      </div>
    </section>
  );
}
