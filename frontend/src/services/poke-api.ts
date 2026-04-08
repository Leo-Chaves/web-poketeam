import { pokeApi } from "@/services/api";
import type { PokemonCardData } from "@/types/pokemon";

type PokeDetailResponse = {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    other?: {
      "official-artwork"?: {
        front_default?: string | null;
      };
    };
    front_default?: string | null;
  };
  stats: Array<{
    base_stat: number;
    stat: { name: string };
  }>;
  types: Array<{
    type: { name: string };
  }>;
};

const MAX_POKEMON_ID = 1025;

function toPokemonCardData(payload: PokeDetailResponse): PokemonCardData {
  return {
    id: payload.id,
    name: payload.name,
    image:
      payload.sprites.other?.["official-artwork"]?.front_default ?? payload.sprites.front_default ?? "",
    types: payload.types.map((item) => item.type.name),
    stats: payload.stats.map((item) => ({
      name: item.stat.name,
      value: item.base_stat,
    })),
    height: payload.height,
    weight: payload.weight,
  };
}

function getRandomPokemonIds(limit: number) {
  const uniqueIds = new Set<number>();

  while (uniqueIds.size < limit) {
    uniqueIds.add(Math.floor(Math.random() * MAX_POKEMON_ID) + 1);
  }

  return Array.from(uniqueIds);
}

export async function fetchPokemonByName(name: string) {
  const response = await pokeApi.get<PokeDetailResponse>(`/pokemon/${name.toLowerCase().trim()}`);
  return toPokemonCardData(response.data);
}

export async function fetchPokemonById(id: number) {
  const response = await pokeApi.get<PokeDetailResponse>(`/pokemon/${id}`);
  return toPokemonCardData(response.data);
}

export async function fetchPokemonList(limit = 6) {
  const randomIds = getRandomPokemonIds(limit);
  const pokemons = await Promise.all(randomIds.map((id) => fetchPokemonById(id)));
  return pokemons.sort((firstPokemon, secondPokemon) => firstPokemon.id - secondPokemon.id);
}
