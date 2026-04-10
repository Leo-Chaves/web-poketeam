import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

type PokemonHomeData = {
  id: number;
  name: string;
  sprite: string;
  artwork: string;
  types: string[];
  stats: Array<{ name: string; value: number }>;
};

function formatName(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

async function getRandomPokemon(): Promise<PokemonHomeData> {
  const randomId = Math.floor(Math.random() * 1025) + 1;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Não foi possível carregar o Pokémon aleatório.");
  }

  const data = await response.json();

  return {
    id: data.id,
    name: formatName(data.name),
    sprite:
      data.sprites.front_default ??
      data.sprites.other?.showdown?.front_default ??
      data.sprites.other?.["official-artwork"]?.front_default ??
      "/file.svg",
    artwork: data.sprites.other?.["official-artwork"]?.front_default ?? "/file.svg",
    types: data.types.map((item: { type: { name: string } }) => formatName(item.type.name)),
    stats: data.stats.slice(0, 4).map((item: { base_stat: number; stat: { name: string } }) => ({
      name: item.stat.name.replace("special-", "sp. "),
      value: item.base_stat,
    })),
  };
}

const highlights = [
  {
    title: "Descoberta instantânea",
    text: "Pesquise qualquer Pokémon por nome, analise tipo e atributos, e decida rapidamente quem merece entrar no time.",
  },
  {
    title: "Montagem com identidade",
    text: "Crie equipes com nome, treinador e descrição, mantendo o time com cara de projeto real e apresentável.",
  },
  {
    title: "Gestão do seu elenco",
    text: "Edite apelidos, observações e posições de cada integrante para deixar a estratégia clara e bem documentada.",
  },
];

const journey = [
  "Entre na plataforma e escolha a identidade da sua equipe.",
  "Busque Pokémon na PokeAPI e compare rapidamente tipo, sprite e stats.",
  "Adicione cada integrante ao slot certo e ajuste apelidos ou observações.",
  "Volte aos detalhes da equipe sempre que quiser reorganizar o elenco.",
];

export default async function HomePage() {
  const pokemon = await getRandomPokemon();

  return (
    <main className="space-y-8">
      <section className="hero-panel relative overflow-hidden rounded-[2rem] border border-[var(--line)] px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:px-8 lg:px-10 lg:py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(89,150,255,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,212,71,0.16),transparent_24%)]" />

        <div className="relative grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
              PokeTeam Builder
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Monte sua equipe Pokémon com estilo, estratégia e identidade própria.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
              Descubra Pokémon aleatórios, explore atributos importantes e monte um time com a sua cara para salvar e organizar do seu jeito.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/buscar" className="button-primary">
                Explorar Pokémon
              </Link>
              <Link href="/cadastro" className="button-secondary-dark">
                Criar conta
              </Link>
            </div>
          </div>

          <div className="grid gap-4 lg:justify-items-end">
            <div className="relative w-full max-w-md rounded-[1.75rem] border border-[rgba(255,255,255,0.08)] bg-[rgba(9,17,30,0.88)] p-5 backdrop-blur">
              <div className="absolute inset-0 rounded-[1.75rem] bg-[linear-gradient(145deg,rgba(89,150,255,0.10),rgba(255,212,71,0.05))]" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--accent)]">
                    Encontro do carregamento
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">
                    {pokemon.name}
                    <span className="ml-2 text-base font-medium text-[var(--muted)]">#{pokemon.id}</span>
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {pokemon.types.map((type) => (
                      <span
                        key={type}
                        className="rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--soft-text)]"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-3">
                  <Image
                    src={pokemon.sprite}
                    alt={`Sprite de ${pokemon.name}`}
                    width={96}
                    height={96}
                    className="h-24 w-24 object-contain"
                    priority
                  />
                </div>
              </div>

              <div className="relative mt-6 grid gap-3">
                {pokemon.stats.map((stat) => (
                  <div key={stat.name}>
                    <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
                      <span>{stat.name}</span>
                      <span>{stat.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[rgba(255,255,255,0.08)]">
                      <div
                        className="h-2 rounded-full bg-[linear-gradient(90deg,var(--brand),var(--accent))]"
                        style={{ width: `${Math.min(stat.value, 120) / 1.2}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="relative mt-6 text-sm leading-7 text-[var(--muted)]">
                Recarregue a página para revelar outro Pokémon aleatório da PokeAPI.
              </p>
            </div>

            <div className="relative hidden w-full max-w-md items-center justify-center rounded-[1.75rem] border border-[rgba(255,255,255,0.08)] bg-[rgba(10,20,34,0.7)] p-6 lg:flex">
              <div className="absolute inset-0 rounded-[1.75rem] bg-[radial-gradient(circle,rgba(89,150,255,0.16),transparent_56%)]" />
              <Image
                src={pokemon.artwork}
                alt={`Arte oficial de ${pokemon.name}`}
                width={280}
                height={280}
                className="relative h-[17.5rem] w-[17.5rem] object-contain drop-shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {highlights.map((item) => (
          <article key={item.title} className="panel dark-panel">
            <h2 className="text-xl font-semibold text-white">{item.title}</h2>
            <p className="mt-3 text-base leading-7 text-[var(--muted)]">{item.text}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="panel dark-panel">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Jornada do treinador
          </p>
          <ol className="mt-6 space-y-3 text-sm text-white/90">
            {journey.map((step, index) => (
              <li key={step} className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] px-4 py-4">
                {index + 1}. {step}
              </li>
            ))}
          </ol>
        </article>

        <article className="panel dark-panel">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            O que você faz aqui
          </p>
          <div className="mt-6 grid gap-3 text-sm leading-7 text-white/90">
            <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] px-4 py-4">
              Cria a identidade do time com nome, treinador e uma descrição mais estratégica.
            </div>
            <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] px-4 py-4">
              Usa a busca para avaliar quem entra em cada slot, sempre respeitando o limite de 6 integrantes.
            </div>
            <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] px-4 py-4">
              Ajusta apelidos e observações para transformar a equipe em algo realmente pessoal e apresentável.
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
