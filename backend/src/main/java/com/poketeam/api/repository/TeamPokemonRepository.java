package com.poketeam.api.repository;

import com.poketeam.api.entity.TeamPokemon;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamPokemonRepository extends JpaRepository<TeamPokemon, Long> {

    int countByTeamId(Long teamId);

    boolean existsByTeamIdAndPosicaoNoTime(Long teamId, Integer posicaoNoTime);

    boolean existsByTeamIdAndPosicaoNoTimeAndIdNot(Long teamId, Integer posicaoNoTime, Long id);
}
