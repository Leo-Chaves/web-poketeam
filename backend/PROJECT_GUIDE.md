# Back-end Proposto

## Stack

- Spring Boot
- Spring Web
- Spring Data JPA
- Bean Validation
- PostgreSQL
- Lombok

## Objetivo do back-end

Fornecer o CRUD completo das equipes Pokémon, validando as regras de negócio e persistindo os dados necessários para o front-end.

## Estrutura sugerida

```text
backend/
|-- src/main/java/com/poketeam/api/
|   |-- config/
|   |-- controller/
|   |-- dto/
|   |-- entity/
|   |-- exception/
|   |-- mapper/
|   |-- repository/
|   `-- service/
|-- src/main/resources/
|   `-- application.yml
`-- pom.xml
```

## Entidades

### Team

- `id`
- `nomeDaEquipe`
- `treinador`
- `descricao`
- `dataCriacao`

### TeamPokemon

- `id`
- `nomePokemon`
- `pokemonIdDaPokeAPI`
- `imagem`
- `tipoPrincipal`
- `apelido`
- `posicaoNoTime`
- `observacao`
- `team`

## Relacionamento

- `Team` possui `List<TeamPokemon>`
- exclusão em cascata
- carregamento preferencial por DTO para evitar exposição desnecessária da entidade

## Repositórios

### `TeamRepository`

- `findAll()`
- `findById()`

### `TeamPokemonRepository`

- `countByTeamId(Long teamId)`
- `existsByTeamIdAndPosicaoNoTime(Long teamId, Integer posicaoNoTime)`
- `findByTeamIdOrderByPosicaoNoTimeAsc(Long teamId)`

## Serviços

### `TeamService`

Responsável por:

- criar equipe
- listar equipes
- buscar detalhes
- atualizar equipe
- excluir equipe

### `TeamPokemonService`

Responsável por:

- adicionar Pokémon
- validar limite de 6
- editar apelido e observação
- remover Pokémon
- validar posições no time

## Controllers

### `TeamController`

- `GET /api/teams`
- `GET /api/teams/{id}`
- `POST /api/teams`
- `PUT /api/teams/{id}`
- `DELETE /api/teams/{id}`

### `TeamPokemonController`

- `POST /api/teams/{teamId}/pokemons`
- `PUT /api/teams/{teamId}/pokemons/{teamPokemonId}`
- `DELETE /api/teams/{teamId}/pokemons/{teamPokemonId}`

## DTOs sugeridos

- `TeamRequestDTO`
- `TeamResponseDTO`
- `TeamSummaryDTO`
- `TeamPokemonRequestDTO`
- `TeamPokemonResponseDTO`
- `ApiErrorResponseDTO`

## Regras de negócio

- máximo de 6 Pokémons por equipe
- posições de 1 a 6
- sem repetição de posição na mesma equipe
- remoção em cascata ao excluir equipe
- validações de campos obrigatórios

## CORS

Criar configuração para permitir o domínio do front-end:

- `http://localhost:3000`
- domínio publicado na Vercel em produção

## Banco de dados

### Escolha recomendada

PostgreSQL

### Motivos

- relacional, simples e robusto
- ótimo para OneToMany
- fácil de integrar com Spring Data JPA
- adequado para demonstração acadêmica e produção simples

## Exemplo de configuração

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/poketeam
    username: postgres
    password: postgres
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true
server:
  port: 8080
```

## Dependências principais do `pom.xml`

- `spring-boot-starter-web`
- `spring-boot-starter-data-jpa`
- `spring-boot-starter-validation`
- `postgresql`
- `lombok`

## Testes recomendados

- teste de criação de equipe
- teste de bloqueio acima de 6 Pokémons
- teste de exclusão em cascata
- teste de atualização de apelido
- teste de busca de equipe por id
