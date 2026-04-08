package com.poketeam.api.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TeamPokemonUpdateRequest(
    @Size(max = 60) String apelido,
    @NotNull @Min(1) @Max(6) Integer posicaoNoTime,
    @Size(max = 300) String observacao
) {
}
