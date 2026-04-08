package com.poketeam.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TeamRequest(
    @NotBlank @Size(min = 3, max = 80) String nomeDaEquipe,
    @NotBlank @Size(min = 3, max = 80) String treinador,
    @NotBlank @Size(min = 10, max = 300) String descricao
) {
}
