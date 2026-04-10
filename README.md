# Intergrantes 

LEONARDO CHAVES DA PAZ
NATHAN MANSUR TENÓRIO DE VASCONCELOS

# PokeTeam Builder

Projeto web com temática Pokémon para buscar criaturas na PokéAPI, montar equipes personalizadas e salvar tudo em um back-end próprio com Spring Boot.

## Descrição

O PokeTeam Builder foi pensado como um projeto acadêmico e profissional de portfólio. A proposta combina:

- consumo de API externa
- CRUD completo com back-end próprio
- modelagem relacional entre equipes e Pokémon
- interface moderna e responsiva
- separação clara entre front-end, back-end e banco de dados

O usuário pode pesquisar Pokémon, visualizar imagem, tipos e stats principais, criar equipes com até 6 integrantes, personalizar apelidos e observações, e salvar tudo em uma API própria.

## Tecnologias Utilizadas

### Front-end

- Next.js com App Router
- React
- TypeScript
- Tailwind CSS
- Axios

### Back-end

- Spring Boot
- Spring Web
- Spring Data JPA
- Bean Validation
- Lombok

### Banco de dados

- PostgreSQL

### APIs externas

- PokéAPI
- Advice Slip API

### Deploy

- Vercel para o front-end
- Render ou Railway para o back-end

## Funcionalidades

- listagem de Pokémon consumindo a PokéAPI
- busca de Pokémon por nome
- exibição de imagem, tipos e stats principais
- criação de equipes personalizadas
- edição de nome, treinador e descrição da equipe
- adição e remoção de Pokémon do time
- edição de apelido e observações de cada integrante
- bloqueio de mais de 6 Pokémon por equipe
- listagem de equipes salvas
- tela de detalhes da equipe
- consumo de uma segunda API para conteúdo dinâmico na home

## Arquitetura Resumida

```text
Next.js (Vercel)
   |
   |-- PokéAPI
   |-- Advice Slip API
   |
   `-- Spring Boot API
           |
           `-- PostgreSQL
```

### Responsabilidades

- O front-end consome a PokéAPI, a segunda API e o CRUD do back-end.
- O back-end valida regras de negócio e persiste as equipes.
- O banco relacional armazena `Team` e `TeamPokemon`.

## Estrutura do Repositório

```text
/
|-- frontend/
|-- backend/
|-- docs/
`-- README.md
```

## Integrantes

Preencher com os nomes do grupo:

- Integrante 1
- Integrante 2
- Integrante 3
- Integrante 4

## Como Rodar Localmente

### 1. Back-end

```bash
cd backend
mvnw.cmd spring-boot:run
```

Configure o banco PostgreSQL em `backend/src/main/resources/application.properties` ou migre para `application.yml`.

Exemplo:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/poketeam
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.port=8080
```

### 2. Front-end

```bash
cd frontend
npm install
npm run dev
```

Crie o arquivo `.env.local` com:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_POKEAPI_URL=https://pokeapi.co/api/v2
```

## Deploy

### Front-end na Vercel

- conectar o repositório ao Vercel
- configurar `NEXT_PUBLIC_API_URL` com a URL pública do back-end
- publicar a branch principal

### Back-end

- subir a API em Render, Railway ou serviço compatível com Java
- configurar CORS para `http://localhost:3000` e domínio da Vercel
- apontar para um PostgreSQL gerenciado em produção

## Entregáveis

- repositório no GitHub com README completo
- front-end publicado na Vercel
- vídeo de até 4 minutos mostrando consumo da PokéAPI e CRUD
- apresentação em PDF com arquitetura, APIs, entidades e demonstração

## Documentação de Apoio

- [Arquitetura do sistema](/c:/projetos/web-mobile/web-poketeam/docs/arquitetura.md)
- [Guia de apresentação final](/c:/projetos/web-mobile/web-poketeam/docs/apresentacao-final.md)
- [README do front-end](/c:/projetos/web-mobile/web-poketeam/frontend/README.md)
- [README do back-end](/c:/projetos/web-mobile/web-poketeam/backend/README.md)

## Referências Oficiais

- Next.js: https://nextjs.org/docs
- Vercel com Next.js: https://vercel.com/docs/frameworks/nextjs
- Tailwind CSS: https://tailwindcss.com/docs/installation/framework-guides/nextjs
- Axios: https://axios-http.com/docs/intro
- PokéAPI: https://pokeapi.co/docs/v2
- Spring Boot: https://docs.spring.io/spring-boot/reference/index.html
- Spring Data JPA: https://spring.io/guides/gs/accessing-data-jpa
- Spring CORS: https://spring.io/guides/gs/rest-service-cors
