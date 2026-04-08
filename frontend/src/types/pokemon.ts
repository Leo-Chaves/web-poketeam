export type PokemonStat = {
  name: string;
  value: number;
};

export type PokemonCardData = {
  id: number;
  name: string;
  image: string;
  types: string[];
  stats: PokemonStat[];
  height: number;
  weight: number;
};

export type AdviceSlipResponse = {
  slip: {
    id: number;
    advice: string;
  };
};
