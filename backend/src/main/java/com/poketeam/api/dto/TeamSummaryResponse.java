package com.poketeam.api.dto;

import java.time.LocalDateTime;

public record TeamSummaryResponse(
    Long id,
    String nomeDaEquipe,
    String treinador,
    String descricao,
    int quantidadePokemons,
    LocalDateTime dataCriacao
) {
}
