"use client";

import { useAuth } from "@/contexts/auth-context";
import { getErrorMessage } from "@/lib/get-error-message";
import {
  deleteTeam,
  getTeam,
  removeTeamPokemon,
  updateTeam,
  updateTeamPokemon,
} from "@/services/team-api";
import type { Team, TeamPokemon } from "@/types/team";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TeamDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const teamId = Number(params.id);
  const hasValidTeamId = Number.isFinite(teamId);

  const [team, setTeam] = useState<Team | null>(null);
  const [nomeDaEquipe, setNomeDaEquipe] = useState("");
  const [treinador, setTreinador] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [savingTeam, setSavingTeam] = useState(false);
  const [savingPokemonId, setSavingPokemonId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !hasValidTeamId) {
      return;
    }

    getTeam(teamId)
      .then((loadedTeam) => {
        setTeam(loadedTeam);
        setNomeDaEquipe(loadedTeam.nomeDaEquipe);
        setTreinador(loadedTeam.treinador);
        setDescricao(loadedTeam.descricao);
      })
      .catch((err) => setError(getErrorMessage(err, "Não foi possível carregar a equipe.")))
      .finally(() => setLoadingTeam(false));
  }, [hasValidTeamId, isAuthenticated, teamId]);

  function updateLocalPokemon(pokemonId: number, updater: (pokemon: TeamPokemon) => TeamPokemon) {
    setTeam((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        pokemons: current.pokemons.map((pokemon) =>
          pokemon.id === pokemonId ? updater(pokemon) : pokemon
        ),
      };
    });
  }

  async function handleTeamSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!team) {
      return;
    }

    setSavingTeam(true);
    setError("");
    setMessage("");

    try {
      const updatedTeam = await updateTeam(team.id, { nomeDaEquipe, treinador, descricao });
      setTeam(updatedTeam);
      setMessage("Equipe atualizada com sucesso.");
    } catch (err) {
      setError(getErrorMessage(err, "Não foi possível atualizar a equipe."));
    } finally {
      setSavingTeam(false);
    }
  }

  async function handleDeleteTeam() {
    if (!team) {
      return;
    }

    const confirmed = window.confirm("Deseja excluir esta equipe definitivamente?");
    if (!confirmed) {
      return;
    }

    try {
      await deleteTeam(team.id);
      router.push("/equipes");
    } catch (err) {
      setError(getErrorMessage(err, "Não foi possível excluir a equipe."));
    }
  }

  async function handleSavePokemon(pokemonId: number) {
    if (!team) {
      return;
    }

    const pokemon = team.pokemons.find((item) => item.id === pokemonId);
    if (!pokemon) {
      return;
    }

    setSavingPokemonId(pokemon.id);
    setError("");
    setMessage("");

    try {
      const updatedTeam = await updateTeamPokemon(team.id, pokemon.id, {
        apelido: pokemon.apelido ?? "",
        posicaoNoTime: pokemon.posicaoNoTime,
        observacao: pokemon.observacao ?? "",
      });
      setTeam(updatedTeam);
      setMessage(`Pokémon ${pokemon.nomePokemon} atualizado.`);
    } catch (err) {
      setError(getErrorMessage(err, "Não foi possível atualizar o Pokémon."));
    } finally {
      setSavingPokemonId(null);
    }
  }

  async function handleRemovePokemon(pokemonId: number) {
    if (!team) {
      return;
    }

    try {
      const updatedTeam = await removeTeamPokemon(team.id, pokemonId);
      setTeam(updatedTeam);
      setMessage("Pokémon removido da equipe.");
    } catch (err) {
      setError(getErrorMessage(err, "Não foi possível remover o Pokémon."));
    }
  }

  if (!isLoading && !isAuthenticated) {
    return (
      <section className="panel max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">Detalhes da equipe</h1>
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">
          Faça login para abrir os detalhes da equipe e editar os Pokémon salvos.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/login" className="button-primary">Entrar</Link>
          <Link href="/cadastro" className="button-secondary">Criar conta</Link>
        </div>
      </section>
    );
  }

  if (!hasValidTeamId) {
    return (
      <section className="panel max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">Equipe inválida</h1>
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">O identificador informado não é válido.</p>
      </section>
    );
  }

  if (loadingTeam) {
    return <section className="panel text-sm text-[var(--muted)]">Carregando equipe...</section>;
  }

  if (!team) {
    return (
      <section className="panel max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">Equipe não encontrada</h1>
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">Confira o link ou volte para a listagem principal.</p>
        <div className="mt-6">
          <Link href="/equipes" className="button-primary">Voltar para equipes</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand)]">Equipe</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">{team.nomeDaEquipe}</h1>
          <p className="mt-2 text-base text-[var(--muted)]">{team.pokemons.length}/6 Pokémon cadastrados</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/buscar" className="button-secondary">Buscar Pokémon</Link>
          <button type="button" onClick={handleDeleteTeam} className="button-danger">Excluir equipe</button>
        </div>
      </div>

      {error && <p className="rounded-2xl bg-[rgba(198,61,47,0.08)] px-4 py-3 text-sm text-[var(--danger)]">{error}</p>}
      {message && <p className="rounded-2xl bg-[rgba(26,79,163,0.08)] px-4 py-3 text-sm text-[var(--brand)]">{message}</p>}

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form className="panel space-y-4" onSubmit={handleTeamSubmit}>
          <h2 className="text-xl font-semibold text-[var(--foreground)]">Dados da equipe</h2>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]" htmlFor="nomeDaEquipe">
              Nome da equipe
            </label>
            <input id="nomeDaEquipe" className="input" value={nomeDaEquipe} onChange={(event) => setNomeDaEquipe(event.target.value)} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]" htmlFor="treinador">
              Treinador
            </label>
            <input id="treinador" className="input" value={treinador} onChange={(event) => setTreinador(event.target.value)} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]" htmlFor="descricao">
              Descrição
            </label>
            <textarea id="descricao" className="textarea" value={descricao} onChange={(event) => setDescricao(event.target.value)} />
          </div>
          <button type="submit" className="button-primary" disabled={savingTeam}>
            {savingTeam ? "Salvando..." : "Salvar equipe"}
          </button>
        </form>

        <div className="space-y-4">
          {team.pokemons.length === 0 ? (
            <div className="panel">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">Nenhum Pokémon na equipe</h2>
              <p className="mt-3 text-base leading-7 text-[var(--muted)]">
                Use a tela de busca para adicionar os primeiros integrantes ao seu time.
              </p>
            </div>
          ) : (
            team.pokemons.map((pokemon) => (
              <article key={pokemon.id} className="panel">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Image
                      src={pokemon.imagem || "/file.svg"}
                      alt={pokemon.nomePokemon}
                      width={96}
                      height={96}
                      className="h-24 w-24 rounded-2xl bg-[var(--surface-alt)] object-contain p-2"
                    />
                    <div>
                      <h2 className="text-2xl font-semibold capitalize text-[var(--foreground)]">{pokemon.nomePokemon}</h2>
                      <p className="mt-1 text-sm text-[var(--muted)]">Tipo principal: {pokemon.tipoPrincipal}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => handleRemovePokemon(pokemon.id)} className="button-danger">
                    Remover
                  </button>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Apelido</label>
                    <input
                      className="input"
                      value={pokemon.apelido ?? ""}
                      onChange={(event) =>
                        updateLocalPokemon(pokemon.id, (currentPokemon) => ({
                          ...currentPokemon,
                          apelido: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Posição</label>
                    <select
                      className="input"
                      value={pokemon.posicaoNoTime}
                      onChange={(event) =>
                        updateLocalPokemon(pokemon.id, (currentPokemon) => ({
                          ...currentPokemon,
                          posicaoNoTime: Number(event.target.value),
                        }))
                      }
                    >
                      {[1, 2, 3, 4, 5, 6].map((position) => (
                        <option key={position} value={position}>
                          Slot {position}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Observação</label>
                  <textarea
                    className="textarea"
                    value={pokemon.observacao ?? ""}
                    onChange={(event) =>
                      updateLocalPokemon(pokemon.id, (currentPokemon) => ({
                        ...currentPokemon,
                        observacao: event.target.value,
                      }))
                    }
                  />
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="button-primary"
                    onClick={() => handleSavePokemon(pokemon.id)}
                    disabled={savingPokemonId === pokemon.id}
                  >
                    {savingPokemonId === pokemon.id ? "Salvando..." : "Salvar Pokémon"}
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
