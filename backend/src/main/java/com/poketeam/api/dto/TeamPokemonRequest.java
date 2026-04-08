package com.poketeam.api.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TeamPokemonRequest(
    @NotBlank @Size(max = 60) String nomePokemon,
    @NotNull Integer pokemonIdDaPokeAPI,
    @NotBlank @Size(max = 255) String imagem,
    @NotBlank @Size(max = 40) String tipoPrincipal,
    @Size(max = 60) String apelido,
    @NotNull @Min(1) @Max(6) Integer posicaoNoTime,
    @Size(max = 300) String observacao
) {
}
