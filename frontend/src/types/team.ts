export type TeamSummary = {
  id: number;
  nomeDaEquipe: string;
  treinador: string;
  descricao: string;
  quantidadePokemons: number;
  dataCriacao: string;
};

export type TeamPokemon = {
  id: number;
  nomePokemon: string;
  pokemonIdDaPokeAPI: number;
  imagem: string;
  tipoPrincipal: string;
  apelido: string | null;
  posicaoNoTime: number;
  observacao: string | null;
};

export type Team = {
  id: number;
  nomeDaEquipe: string;
  treinador: string;
  descricao: string;
  dataCriacao: string;
  pokemons: TeamPokemon[];
};

export type TeamPayload = {
  nomeDaEquipe: string;
  treinador: string;
  descricao: string;
};

export type TeamPokemonPayload = {
  nomePokemon: string;
  pokemonIdDaPokeAPI: number;
  imagem: string;
  tipoPrincipal: string;
  apelido?: string;
  posicaoNoTime: number;
  observacao?: string;
};

export type TeamPokemonUpdatePayload = {
  apelido?: string;
  posicaoNoTime: number;
  observacao?: string;
};
