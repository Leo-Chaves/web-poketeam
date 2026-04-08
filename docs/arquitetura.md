# Arquitetura do Sistema

## 1. Ideia Completa do Sistema

### Nome sugerido

**PokeTeam Builder**

### Proposta

O sistema e uma aplicacao web moderna na qual o usuario pode buscar Pokemon na PokeAPI, analisar seus dados principais e montar equipes personalizadas para salvar em um back-end proprio.

O diferencial do projeto esta em unir:

- consumo de APIs externas
- CRUD completo com Spring Boot
- banco de dados relacional
- front-end responsivo e apresentavel
- regras de negocio reais no servidor

### Objetivo do produto

Permitir que o usuario atue como treinador, criando equipes estrategicas com:

- nome da equipe
- nome do treinador
- descricao da estrategia
- ate 6 Pokemon por equipe
- apelidos e observacoes individuais para cada integrante

## 2. Arquitetura Geral

```text
Next.js (Vercel)
   |
   |-- PokeAPI
   |-- Advice Slip API
   |
   `-- Spring Boot API
           |
           `-- PostgreSQL
```

### Responsabilidade por camada

### Front-end

- renderizar paginas e componentes
- consumir a PokeAPI
- consumir a segunda API dinamica
- consumir o CRUD do back-end
- exibir feedback visual e garantir boa experiencia do usuario

### Back-end

- expor endpoints REST
- validar regras de negocio
- persistir equipes e Pokemon adicionados
- responder em DTOs adequados ao front-end

### Banco de dados

- armazenar equipes
- armazenar Pokemon vinculados as equipes
- manter o relacionamento entre `Team` e `TeamPokemon`

## 3. Stack Recomendada

### Front-end

- Next.js com App Router
- React + TypeScript
- Tailwind CSS
- Axios
- Framer Motion para animacoes sutis
- Lucide React para icones

### Back-end

- Spring Boot 3
- Java 21
- Spring Web
- Spring Data JPA
- Bean Validation
- Lombok
- PostgreSQL Driver

### Banco

- PostgreSQL

### Deploy

- Vercel para o front-end
- Render ou Railway para o back-end
- PostgreSQL gerenciado em producao

## 4. Entidades Sugeridas

## Team

Representa a equipe criada pelo usuario.

### Campos

- `id`
- `nomeDaEquipe`
- `treinador`
- `descricao`
- `dataCriacao`

### Relacionamento

- `1 Team` para `N TeamPokemon`

## TeamPokemon

Representa um Pokemon adicionado a uma equipe.

### Campos

- `id`
- `nomePokemon`
- `pokemonIdDaPokeAPI`
- `imagem`
- `tipoPrincipal`
- `apelido`
- `posicaoNoTime`
- `observacao`
- `teamId`

### Observacao de modelagem

Essa entidade guarda dados essenciais vindos da PokeAPI para que a equipe continue consistente mesmo sem depender de uma nova consulta externa.

## 5. DTOs Recomendados

### `TeamRequestDTO`

```json
{
  "nomeDaEquipe": "Elite Kanto",
  "treinador": "Ash",
  "descricao": "Equipe ofensiva com boa cobertura de tipos."
}
```

### `TeamResponseDTO`

```json
{
  "id": 1,
  "nomeDaEquipe": "Elite Kanto",
  "treinador": "Ash",
  "descricao": "Equipe ofensiva com boa cobertura de tipos.",
  "dataCriacao": "2026-04-08T16:00:00",
  "pokemons": []
}
```

### `TeamSummaryDTO`

```json
{
  "id": 1,
  "nomeDaEquipe": "Elite Kanto",
  "treinador": "Ash",
  "quantidadePokemons": 4,
  "dataCriacao": "2026-04-08T16:00:00"
}
```

### `TeamPokemonRequestDTO`

```json
{
  "nomePokemon": "pikachu",
  "pokemonIdDaPokeAPI": 25,
  "imagem": "https://raw.githubusercontent.com/...",
  "tipoPrincipal": "electric",
  "apelido": "Faisca",
  "posicaoNoTime": 1,
  "observacao": "Principal atacante especial."
}
```

### `TeamPokemonResponseDTO`

```json
{
  "id": 10,
  "nomePokemon": "pikachu",
  "pokemonIdDaPokeAPI": 25,
  "imagem": "https://raw.githubusercontent.com/...",
  "tipoPrincipal": "electric",
  "apelido": "Faisca",
  "posicaoNoTime": 1,
  "observacao": "Principal atacante especial."
}
```

## 6. Endpoints REST do Spring Boot

## Teams

### `GET /api/teams`

Retorna a lista resumida das equipes salvas.

### `GET /api/teams/{id}`

Retorna os detalhes da equipe e seus Pokemon.

### `POST /api/teams`

Cria uma nova equipe.

### `PUT /api/teams/{id}`

Edita nome, treinador e descricao.

### `DELETE /api/teams/{id}`

Exclui a equipe e seus Pokemon.

## Team Pokemons

### `POST /api/teams/{teamId}/pokemons`

Adiciona um Pokemon a equipe.

### `PUT /api/teams/{teamId}/pokemons/{teamPokemonId}`

Edita apelido, observacao e posicao no time.

### `DELETE /api/teams/{teamId}/pokemons/{teamPokemonId}`

Remove um Pokemon da equipe.

### Endpoint opcional

### `PATCH /api/teams/{teamId}/pokemons/reorder`

Permite reorganizar a ordem do time.

## 7. Regras de Negocio

- uma equipe pode ter no maximo 6 Pokemon
- nao permitir adicionar mais de 6
- nao permitir `posicaoNoTime` fora do intervalo de 1 a 6
- nao permitir posicoes repetidas dentro da mesma equipe
- permitir editar apelido e observacao
- permitir remover Pokemon da equipe
- excluir em cascata os Pokemon quando a equipe for removida

## 8. Estrutura de Pastas do Front-end

```text
frontend/
|-- public/
|   |-- images/
|   `-- icons/
|-- src/
|   |-- app/
|   |   |-- layout.tsx
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
|   |-- lib/
|   |-- types/
|   |-- utils/
|   `-- styles/
|-- .env.local
|-- package.json
`-- tsconfig.json
```

## 9. Estrutura de Pastas do Back-end

```text
backend/
|-- src/
|   |-- main/
|   |   |-- java/com/poketeam/api/
|   |   |   |-- config/
|   |   |   |-- controller/
|   |   |   |-- dto/
|   |   |   |-- entity/
|   |   |   |-- exception/
|   |   |   |-- mapper/
|   |   |   |-- repository/
|   |   |   `-- service/
|   |   `-- resources/
|   |       `-- application.properties
|   `-- test/
|       `-- java/com/poketeam/api/
|-- pom.xml
`-- README.md
```

## 10. Fluxo de Telas

## Home

- hero com apresentacao do projeto
- destaque visual da proposta
- curiosidade ou conselho vindo da segunda API
- atalhos para busca e equipes salvas

## Buscar Pokemon

- barra de busca por nome
- cards com imagem, tipo e stats
- botao para adicionar ao time
- feedback visual ao adicionar

## Minhas Equipes

- listagem das equipes salvas
- resumo com treinador e quantidade de Pokemon
- acoes para visualizar, editar e excluir

## Criar ou Editar Equipe

- formulario com nome, treinador e descricao
- painel lateral com os slots do time
- bloqueio ao atingir 6 integrantes

## Detalhes da Equipe

- cabecalho com dados da equipe
- grid com os 6 integrantes
- edicao de apelido, observacao e posicao
- remocao individual de Pokemon

## 11. Sugestao de Layout

### Direcao visual

- moderno, limpo e profissional
- inspirado em Pokemon sem excesso de elementos
- visual pronto para apresentacao academica

### Paleta sugerida

- azul profundo para navegacao e titulos
- amarelo vibrante para destaques e CTAs
- vermelho moderado para acoes criticas
- off-white e cinza claro para superficies e leitura

### Componentes visuais

- hero com gradiente leve e chamadas bem definidas
- cards com cantos amplos e sombra suave
- badges coloridos para tipos dos Pokemon
- barras elegantes para stats
- hover sutil com elevacao e transicao curta

### Responsividade

- layout em coluna no mobile
- grade de 2 a 3 colunas no desktop
- busca larga em telas grandes e compacta em telas pequenas
- navegacao adaptada para diferentes larguras

## 12. Sugestao de Resposta de Erro

```json
{
  "timestamp": "2026-04-08T16:10:00",
  "status": 400,
  "error": "Business Rule Violation",
  "message": "A equipe ja possui 6 Pokemon cadastrados.",
  "path": "/api/teams/1/pokemons"
}
```

## 13. Integracao com APIs

## PokeAPI

Usos principais:

- listagem paginada
- busca por nome
- imagem oficial
- tipos
- stats

Endpoints uteis:

- `GET https://pokeapi.co/api/v2/pokemon?limit=20&offset=0`
- `GET https://pokeapi.co/api/v2/pokemon/{name}`

## Advice Slip API

Uso sugerido:

- exibir um conselho aleatorio na home, como se fosse uma dica de treinador

Endpoint:

- `GET https://api.adviceslip.com/advice`

## 14. Sugestao de Implementacao em Camadas

### Front-end

- `services/api.ts`: instancia base do Axios
- `services/pokeApi.ts`: integracao com a PokeAPI
- `services/teamApi.ts`: comunicacao com o back-end
- `services/adviceApi.ts`: consumo da segunda API

### Back-end

- `controller`: endpoints REST
- `service`: regras de negocio
- `repository`: acesso ao banco
- `entity`: entidades JPA
- `dto`: entrada e saida da API
- `mapper`: conversao entre entidade e DTO
- `exception`: tratamento padronizado de erros
- `config`: CORS e configuracoes globais

## 15. Diferenciais para a Apresentacao

- integracao entre duas APIs externas e um back-end proprio
- persistencia real com banco relacional
- modelagem relacional entre equipe e integrantes
- validacao de regra de negocio no servidor
- interface moderna e responsiva
