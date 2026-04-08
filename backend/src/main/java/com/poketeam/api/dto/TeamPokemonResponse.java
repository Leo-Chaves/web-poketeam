package com.poketeam.api.dto;

public record TeamPokemonResponse(
    Long id,
    String nomePokemon,
    Integer pokemonIdDaPokeAPI,
    String imagem,
    String tipoPrincipal,
    String apelido,
    Integer posicaoNoTime,
    String observacao
) {
}
