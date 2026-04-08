package com.poketeam.api.dto;

import java.time.LocalDateTime;
import java.util.List;

public record TeamResponse(
    Long id,
    String nomeDaEquipe,
    String treinador,
    String descricao,
    LocalDateTime dataCriacao,
    List<TeamPokemonResponse> pokemons
) {
}
