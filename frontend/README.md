# Front-end do PokeTeam Builder

Aplicacao Next.js responsavel pela interface do usuario, consumo da PokeAPI, segunda API dinamica e comunicacao com o back-end Spring Boot.

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios

## Estrutura Sugerida

```text
src/
|-- app/
|-- components/
|-- services/
|-- hooks/
|-- lib/
|-- types/
|-- utils/
`-- styles/
```

## Telas Previstas

- Home
- Buscar Pokemon
- Minhas Equipes
- Criar Equipe
- Editar Equipe
- Detalhes da Equipe

## Servicos Recomendados

- `services/api.ts`
- `services/pokeApi.ts`
- `services/teamApi.ts`
- `services/adviceApi.ts`

## Execucao Local

```bash
npm install
npm run dev
```

## Variaveis de Ambiente

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_POKEAPI_URL=https://pokeapi.co/api/v2
```
