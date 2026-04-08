package com.poketeam.api.repository;

import com.poketeam.api.entity.Team;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamRepository extends JpaRepository<Team, Long> {

    List<Team> findByUserIdOrderByDataCriacaoDesc(Long userId);

    Optional<Team> findByIdAndUserId(Long id, Long userId);
}
