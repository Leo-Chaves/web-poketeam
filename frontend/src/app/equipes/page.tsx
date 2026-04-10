"use client";

import { useAuth } from "@/contexts/auth-context";
import { getErrorMessage } from "@/lib/get-error-message";
import { deleteTeam, listTeams } from "@/services/team-api";
import type { TeamSummary } from "@/types/team";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TeamsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [teams, setTeams] = useState<TeamSummary[]>([]);
  const [error, setError] = useState("");
  const [loadingTeams, setLoadingTeams] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    listTeams()
      .then(setTeams)
      .catch((err) => setError(getErrorMessage(err, "Não foi possível carregar as equipes.")))
      .finally(() => setLoadingTeams(false));
  }, [isAuthenticated]);

  async function handleDelete(teamId: number) {
    const confirmed = window.confirm("Deseja excluir esta equipe?");
    if (!confirmed) {
      return;
    }

    try {
      await deleteTeam(teamId);
      setTeams((current) => current.filter((team) => team.id !== teamId));
    } catch (err) {
      setError(getErrorMessage(err, "Não foi possível excluir a equipe."));
    }
  }

  if (!isLoading && !isAuthenticated) {
    return (
      <section className="panel max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">Minhas equipes</h1>
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">
          Faça login para listar e gerenciar as equipes salvas na sua conta.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/login" className="button-primary">Entrar</Link>
          <Link href="/cadastro" className="button-secondary">Criar conta</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand)]">Equipes</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">Minhas equipes salvas</h1>
        </div>
        <Link href="/equipes/nova" className="button-primary">Nova equipe</Link>
      </div>

      {error && <p className="rounded-2xl bg-[rgba(198,61,47,0.08)] px-4 py-3 text-sm text-[var(--danger)]">{error}</p>}

      {loadingTeams ? (
        <div className="panel text-sm text-[var(--muted)]">Carregando equipes...</div>
      ) : teams.length === 0 ? (
        <div className="panel">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">Nenhuma equipe criada ainda</h2>
          <p className="mt-3 text-base leading-7 text-[var(--muted)]">
            Crie sua primeira equipe para começar a adicionar Pokémon e testar o CRUD completo.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {teams.map((team) => (
            <article key={team.id} className="panel">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">
                {team.quantidadePokemons}/6 Pokémon
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">{team.nomeDaEquipe}</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">Treinador: {team.treinador}</p>
              <p className="mt-4 text-sm leading-7 text-[var(--foreground)]">{team.descricao}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/equipes/${team.id}`} className="button-primary">Detalhes</Link>
                <button type="button" onClick={() => handleDelete(team.id)} className="button-danger">
                  Excluir
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
