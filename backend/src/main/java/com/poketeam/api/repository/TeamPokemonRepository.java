package com.poketeam.api.repository;

import com.poketeam.api.entity.TeamPokemon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface TeamPokemonRepository extends JpaRepository<TeamPokemon, Long> {

    int countByTeamId(Long teamId);

    boolean existsByTeamIdAndPosicaoNoTime(Long teamId, Integer posicaoNoTime);

    boolean existsByTeamIdAndPosicaoNoTimeAndIdNot(Long teamId, Integer posicaoNoTime, Long id);

    @Modifying
    @Query("delete from TeamPokemon pokemon where pokemon.team.id = :teamId")
    void deleteByTeamId(Long teamId);
}
