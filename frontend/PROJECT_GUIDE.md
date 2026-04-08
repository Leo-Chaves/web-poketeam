# Front-end Proposto

## Stack

- Next.js com App Router
- React + TypeScript
- Tailwind CSS
- Axios
- Framer Motion

## Objetivo do front-end

Entregar uma experiência moderna para:

- buscar Pokémons
- visualizar detalhes relevantes
- montar equipes
- integrar com o CRUD do back-end

## Estrutura sugerida

```text
frontend/
|-- public/
|   |-- images/
|   `-- icons/
|-- src/
|   |-- app/
|   |   |-- page.tsx
|   |   |-- buscar/page.tsx
|   |   |-- equipes/page.tsx
|   |   |-- equipes/nova/page.tsx
|   |   |-- equipes/[id]/page.tsx
|   |   `-- equipes/[id]/editar/page.tsx
|   |-- components/
|   |   |-- common/
|   |   |-- pokemon/
|   |   `-- team/
|   |-- services/
|   |   |-- api.ts
|   |   |-- pokeApi.ts
|   |   |-- teamApi.ts
|   |   `-- adviceApi.ts
|   |-- hooks/
|   |-- types/
|   |-- utils/
|   `-- styles/
|-- package.json
`-- next.config.ts
```

## Serviços Axios sugeridos

### `services/api.ts`

Instância base para o back-end:

- `baseURL = process.env.NEXT_PUBLIC_API_URL`
- interceptors opcionais
- tratamento padronizado de erro

### `services/pokeApi.ts`

Funções como:

- `getPokemonList(limit, offset)`
- `getPokemonByName(name)`

### `services/teamApi.ts`

Funções como:

- `getTeams()`
- `getTeamById(id)`
- `createTeam(data)`
- `updateTeam(id, data)`
- `deleteTeam(id)`
- `addPokemonToTeam(teamId, data)`
- `updateTeamPokemon(teamId, pokemonId, data)`
- `removeTeamPokemon(teamId, pokemonId)`

### `services/adviceApi.ts`

Função:

- `getRandomAdvice()`

## Componentes recomendados

### Common

- `Header`
- `Footer`
- `SectionTitle`
- `LoadingSpinner`
- `EmptyState`
- `ToastFeedback`

### Pokemon

- `PokemonSearchBar`
- `PokemonCard`
- `PokemonStats`
- `PokemonTypeBadge`
- `PokemonDetailsDrawer`

### Team

- `TeamCard`
- `TeamForm`
- `TeamPokemonSlot`
- `TeamPokemonEditor`
- `TeamSummaryPanel`

## Páginas recomendadas

### Home

- hero
- curiosidade ou dica dinâmica
- atalhos para busca e equipes

### Buscar Pokémon

- busca por nome
- grid de cards
- detalhes do Pokémon
- botão para adicionar ao time

### Minhas Equipes

- listagem das equipes salvas
- ações rápidas

### Criar/Editar Equipe

- formulário da equipe
- seleção de Pokémons

### Detalhes da Equipe

- visão completa do time
- edição de apelido e observações

## UX recomendada

- skeleton loading na busca
- toast ao adicionar ou remover Pokémon
- botão desabilitado ao atingir 6 membros
- feedback claro de erro da API
- navegação rápida entre home, busca e equipes

## Variáveis de ambiente

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Direção visual

- fundo claro com gradientes suaves
- destaques em amarelo e azul
- cards com aparência premium
- animações leves de entrada e hover

## Deploy

Planejado para Vercel, mantendo:

- renderização eficiente com App Router
- variáveis de ambiente configuradas no painel
- domínio do front liberado no CORS do back-end
