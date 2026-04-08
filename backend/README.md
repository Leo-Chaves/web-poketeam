# Back-end do PokeTeam Builder

API Spring Boot responsavel pelo CRUD de equipes Pokemon, validacao das regras de negocio e persistencia dos dados em banco relacional.

## Stack

- Spring Boot
- Spring Web
- Spring Data JPA
- Bean Validation
- Lombok
- PostgreSQL

## Pacotes Recomendados

```text
com.poketeam.api
|-- config
|-- controller
|-- dto
|-- entity
|-- exception
|-- mapper
|-- repository
`-- service
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

## Endpoints Principais

- `GET /api/teams`
- `GET /api/teams/{id}`
- `POST /api/teams`
- `PUT /api/teams/{id}`
- `DELETE /api/teams/{id}`
- `POST /api/teams/{teamId}/pokemons`
- `PUT /api/teams/{teamId}/pokemons/{teamPokemonId}`
- `DELETE /api/teams/{teamId}/pokemons/{teamPokemonId}`

## Regras de Negocio

- maximo de 6 Pokemon por equipe
- posicao no time entre 1 e 6
- sem repeticao de posicao dentro da mesma equipe
- exclusao em cascata dos Pokemon da equipe

## Execucao Local

```bash
mvnw.cmd spring-boot:run
```

## Exemplo de Configuracao

```properties
spring.application.name=backend-app
spring.datasource.url=jdbc:postgresql://localhost:5432/poketeam
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.port=8080
```
