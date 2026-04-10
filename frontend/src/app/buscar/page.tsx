"use client";

import { useAuth } from "@/contexts/auth-context";
import { getErrorMessage } from "@/lib/get-error-message";
import { fetchPokemonByName, fetchPokemonList } from "@/services/poke-api";
import { addPokemonToTeam, getTeam, listTeams } from "@/services/team-api";
import type { PokemonCardData } from "@/types/pokemon";
import type { Team, TeamSummary } from "@/types/team";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function getNextAvailablePosition(team: Team | null) {
  if (!team) {
    return null;
  }

  const occupiedPositions = new Set(team.pokemons.map((pokemon) => pokemon.posicaoNoTime));
  return [1, 2, 3, 4, 5, 6].find((position) => !occupiedPositions.has(position)) ?? null;
}

export default function SearchPage() {
  const { isAuthenticated } = useAuth();
  const [query, setQuery] = useState("");
  const [pokemons, setPokemons] = useState<PokemonCardData[]>([]);
  const [teams, setTeams] = useState<TeamSummary[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [searching, setSearching] = useState(false);
  const [addingPokemonId, setAddingPokemonId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setLoadingPage(true);

    const initialLoad = isAuthenticated
      ? Promise.all([listTeams(), fetchPokemonList(6)]).then(([loadedTeams, initialPokemons]) => {
          setTeams(loadedTeams);
          setPokemons(initialPokemons);
          if (loadedTeams.length > 0) {
            setSelectedTeamId((current) => current ?? loadedTeams[0].id);
          }
        })
      : fetchPokemonList(6).then((initialPokemons) => {
          setTeams([]);
          setSelectedTeamId(null);
          setSelectedTeam(null);
          setPokemons(initialPokemons);
        });

    initialLoad
      .catch((err) => setError(getErrorMessage(err, "Não foi possível carregar a busca de Pokémon.")))
      .finally(() => setLoadingPage(false));
  }, [isAuthenticated]);

  useEffect(() => {
    if (!selectedTeamId || !isAuthenticated) {
      setSelectedTeam(null);
      return;
    }

    getTeam(selectedTeamId)
      .then(setSelectedTeam)
      .catch((err) => setError(getErrorMessage(err, "Não foi possível carregar a equipe selecionada.")));
  }, [isAuthenticated, selectedTeamId]);

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!query.trim()) {
      return;
    }

    setSearching(true);
    setError("");

    try {
      const pokemon = await fetchPokemonByName(query);
      setPokemons([pokemon]);
      setMessage(`Resultado encontrado para ${pokemon.name}.`);
    } catch (err) {
      setError(getErrorMessage(err, "Pokémon não encontrado."));
    } finally {
      setSearching(false);
    }
  }

  async function handleShowFeatured() {
    setSearching(true);
    setError("");
    try {
      const featured = await fetchPokemonList(6);
      setPokemons(featured);
      setMessage("Seis Pokémon aleatórios foram carregados.");
    } catch (err) {
      setError(getErrorMessage(err, "Não foi possível carregar a lista aleatória."));
    } finally {
      setSearching(false);
    }
  }

  async function handleAddPokemon(pokemon: PokemonCardData) {
    if (!selectedTeamId || !selectedTeam) {
      setError("Crie ou selecione uma equipe antes de adicionar Pokémon.");
      return;
    }

    const nextPosition = getNextAvailablePosition(selectedTeam);
    if (!nextPosition) {
      setError("A equipe selecionada já está completa com 6 Pokémon.");
      return;
    }

    setAddingPokemonId(pokemon.id);
    setError("");
    setMessage("");

    try {
      const updatedTeam = await addPokemonToTeam(selectedTeamId, {
        nomePokemon: pokemon.name,
        pokemonIdDaPokeAPI: pokemon.id,
        imagem: pokemon.image,
        tipoPrincipal: pokemon.types[0] ?? "unknown",
        posicaoNoTime: nextPosition,
        apelido: "",
        observacao: "",
      });
      setSelectedTeam(updatedTeam);
      const refreshedTeams = await listTeams();
      setTeams(refreshedTeams);
      setMessage(`${pokemon.name} foi adicionado na posição ${nextPosition}.`);
    } catch (err) {
      setError(getErrorMessage(err, "Não foi possível adicionar o Pokémon ao time."));
    } finally {
      setAddingPokemonId(null);
    }
  }

  const nextPosition = getNextAvailablePosition(selectedTeam);

  return (
    <section className="space-y-6">
      <div className={`grid gap-6 ${isAuthenticated ? "lg:grid-cols-[1.05fr_0.95fr]" : "lg:grid-cols-1"}`}>
        <div className="panel">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand)]">Busca</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
            {isAuthenticated ? "Buscar Pokémon e adicionar ao time" : "Buscar Pokémon"}
          </h1>
          <p className="mt-3 text-base leading-7 text-[var(--muted)]">
            {isAuthenticated
              ? "Pesquise pelo nome exato do Pokémon ou carregue seis opções aleatórias para explorar rapidamente a PokeAPI."
              : "Explore a PokeAPI livremente, pesquise pelo nome exato e visualize seis opções aleatórias sem precisar estar logado."}
          </p>

          <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={handleSearch}>
            <input
              className="input"
              placeholder="Ex.: pikachu"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="submit" className="button-primary" disabled={searching}>
              {searching ? "Buscando..." : "Buscar"}
            </button>
            <button type="button" className="button-secondary" onClick={handleShowFeatured} disabled={searching}>
              Sortear 6 aleatórios
            </button>
          </form>
        </div>

        {isAuthenticated ? (
          <div className="panel">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand)]">Equipe alvo</p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">Escolha o time que vai receber os Pokémon</h2>
            {teams.length === 0 ? (
              <div className="mt-5 rounded-2xl bg-[var(--surface-alt)] p-4 text-sm text-[var(--foreground)]">
                Nenhuma equipe criada. <Link href="/equipes/nova" className="font-semibold text-[var(--brand)]">Crie uma equipe primeiro</Link>.
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <select
                  className="input"
                  value={selectedTeamId ?? ""}
                  onChange={(event) => setSelectedTeamId(Number(event.target.value))}
                >
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.nomeDaEquipe}
                    </option>
                  ))}
                </select>

                {selectedTeam && (
                  <div className="rounded-2xl bg-[var(--surface-alt)] p-4 text-sm text-[var(--foreground)]">
                    <p className="font-semibold">{selectedTeam.nomeDaEquipe}</p>
                    <p className="mt-1 text-[var(--muted)]">Treinador: {selectedTeam.treinador}</p>
                    <p className="mt-3">Pokémon no time: {selectedTeam.pokemons.length}/6</p>
                    <p className="mt-1">Próximo slot livre: {nextPosition ?? "Equipe completa"}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="panel">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand)]">Modo visitante</p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">Pesquisa liberada, montagem bloqueada</h2>
            <p className="mt-3 text-base leading-7 text-[var(--muted)]">
              Você pode pesquisar Pokémon e explorar os cards normalmente. Para criar equipe e adicionar integrantes ao time, basta entrar na sua conta.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/login" className="button-primary">Entrar</Link>
              <Link href="/cadastro" className="button-secondary">Criar conta</Link>
            </div>
          </div>
        )}
      </div>

      {error && <p className="rounded-2xl bg-[rgba(198,61,47,0.08)] px-4 py-3 text-sm text-[var(--danger)]">{error}</p>}
      {message && <p className="rounded-2xl bg-[rgba(26,79,163,0.08)] px-4 py-3 text-sm text-[var(--brand)]">{message}</p>}

      {loadingPage ? (
        <div className="panel text-sm text-[var(--muted)]">Carregando Pokémon...</div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {pokemons.map((pokemon) => (
            <article key={pokemon.id} className="panel">
              <div className="flex items-center gap-4">
                <Image
                  src={pokemon.image || "/file.svg"}
                  alt={pokemon.name}
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-2xl bg-[var(--surface-alt)] object-contain p-2"
                />
                <div>
                  <h2 className="text-2xl font-semibold capitalize text-[var(--foreground)]">{pokemon.name}</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">#{pokemon.id}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {pokemon.types.map((type) => (
                      <span key={type} className="rounded-full bg-[var(--surface-alt)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {pokemon.stats.slice(0, 4).map((stat) => (
                  <div key={stat.name}>
                    <div className="mb-1 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                      <span>{stat.name}</span>
                      <span>{stat.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--surface-alt)]">
                      <div
                        className="h-2 rounded-full bg-[var(--brand)]"
                        style={{ width: `${Math.min(stat.value, 120) / 1.2}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--muted)]">
                <span>Altura: {pokemon.height}</span>
                <span>Peso: {pokemon.weight}</span>
              </div>

              {isAuthenticated ? (
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="button-primary"
                    disabled={!selectedTeamId || !nextPosition || addingPokemonId === pokemon.id}
                    onClick={() => handleAddPokemon(pokemon)}
                  >
                    {addingPokemonId === pokemon.id ? "Adicionando..." : "Adicionar ao time"}
                  </button>
                  {selectedTeamId && (
                    <Link href={`/equipes/${selectedTeamId}`} className="button-secondary">
                      Ver equipe
                    </Link>
                  )}
                </div>
              ) : (
                <div className="mt-6 rounded-2xl bg-[var(--surface-alt)] px-4 py-4 text-sm leading-7 text-[var(--muted)]">
                  Entre para salvar este Pokémon em uma equipe.
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
