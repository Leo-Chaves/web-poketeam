"use client";

import { useAuth } from "@/contexts/auth-context";
import { getErrorMessage } from "@/lib/get-error-message";
import { createTeam } from "@/services/team-api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewTeamPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [nomeDaEquipe, setNomeDaEquipe] = useState("");
  const [treinador, setTreinador] = useState("");
  const [descricao, setDescricao] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isLoading && !isAuthenticated) {
    return (
      <section className="panel max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">Criar equipe</h1>
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">
          Faca login para criar equipes e salvar os Pokemon vinculados a sua conta.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/login" className="button-primary">Entrar</Link>
          <Link href="/cadastro" className="button-secondary">Criar conta</Link>
        </div>
      </section>
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const team = await createTeam({ nomeDaEquipe, treinador, descricao });
      router.push(`/equipes/${team.id}`);
    } catch (err) {
      setError(getErrorMessage(err, "Nao foi possivel criar a equipe."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl">
      <div className="panel">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand)]">Nova equipe</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--foreground)]">Criar equipe Pokemon</h1>
        <p className="mt-3 text-base leading-7 text-[var(--muted)]">
          Defina a identidade do time e depois siga para a busca de Pokemon ou para a tela de detalhes da equipe.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]" htmlFor="nomeDaEquipe">
              Nome da equipe
            </label>
            <input
              id="nomeDaEquipe"
              className="input"
              value={nomeDaEquipe}
              onChange={(event) => setNomeDaEquipe(event.target.value)}
              placeholder="Elite Kanto"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]" htmlFor="treinador">
              Treinador
            </label>
            <input
              id="treinador"
              className="input"
              value={treinador}
              onChange={(event) => setTreinador(event.target.value)}
              placeholder="Ash"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]" htmlFor="descricao">
              Descricao
            </label>
            <textarea
              id="descricao"
              className="textarea"
              value={descricao}
              onChange={(event) => setDescricao(event.target.value)}
              placeholder="Explique a ideia principal do time, cobertura de tipos e estrategia geral."
              required
            />
          </div>

          {error && <p className="rounded-2xl bg-[rgba(198,61,47,0.08)] px-4 py-3 text-sm text-[var(--danger)]">{error}</p>}

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="button-primary" disabled={submitting}>
              {submitting ? "Criando..." : "Criar equipe"}
            </button>
            <Link href="/buscar" className="button-secondary">Ir para busca</Link>
          </div>
        </form>
      </div>
    </section>
  );
}
