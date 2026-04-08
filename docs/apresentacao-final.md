# Apresentacao Final

## Estrutura do Video de Ate 4 Minutos

### 1. Abertura

- apresentar o nome do projeto
- explicar o objetivo do sistema em uma frase
- mostrar rapidamente as tecnologias principais

### 2. Home

- destacar a identidade visual
- mostrar a area com a segunda API
- explicar que o projeto consome dados externos e possui back-end proprio

### 3. Busca de Pokemon

- pesquisar um Pokemon por nome
- mostrar imagem, tipos e stats
- adicionar o Pokemon a uma equipe

### 4. CRUD de Equipes

- criar uma nova equipe
- preencher nome, treinador e descricao
- adicionar ate 6 Pokemon
- editar apelido e observacao
- remover um Pokemon
- listar equipes salvas

### 5. Encerramento

- reforcar a integracao entre PokeAPI, segunda API e Spring Boot
- citar o banco de dados utilizado
- mostrar que o front esta pronto para deploy na Vercel

## Sugestao de Slides para PDF

### Slide 1

- nome do projeto
- nomes dos integrantes

### Slide 2

- problema ou objetivo do projeto
- proposta do sistema

### Slide 3

- tecnologias utilizadas no front-end
- tecnologias utilizadas no back-end
- banco de dados

### Slide 4

- diagrama da arquitetura geral
- explicacao do fluxo entre front, APIs e back-end

### Slide 5

- como a PokeAPI foi utilizada
- dados exibidos ao usuario

### Slide 6

- segunda API escolhida
- papel dela dentro da home

### Slide 7

- entidades `Team` e `TeamPokemon`
- relacionamento entre elas

### Slide 8

- endpoints principais do CRUD
- regra de negocio de limite de 6 Pokemon

### Slide 9

- principais telas do sistema
- foco na experiencia do usuario

### Slide 10

- conclusao
- principais aprendizados
- espaco para perguntas

## Falas Sugeridas para a Apresentacao

### Abertura

"O PokeTeam Builder e um sistema web que permite pesquisar Pokemon pela PokeAPI e montar equipes personalizadas salvas em um back-end proprio."

### Arquitetura

"No front-end usamos Next.js para entregar uma interface responsiva e moderna. No back-end usamos Spring Boot para centralizar o CRUD e validar as regras do dominio."

### APIs

"A PokeAPI fornece os dados principais dos Pokemon, enquanto a segunda API traz conteudo dinamico para enriquecer a experiencia da home."

### CRUD

"Cada equipe pode ter ate 6 Pokemon. Essa regra e reforcada no front-end e validada de forma definitiva no back-end."

### Fechamento

"O resultado e um projeto completo, com consumo de APIs, persistencia em banco relacional, interface profissional e organizacao adequada para publicacao e apresentacao."
