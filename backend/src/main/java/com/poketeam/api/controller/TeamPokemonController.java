package com.poketeam.api.controller;

import com.poketeam.api.dto.TeamPokemonRequest;
import com.poketeam.api.dto.TeamPokemonUpdateRequest;
import com.poketeam.api.dto.TeamResponse;
import com.poketeam.api.security.AuthenticatedUser;
import com.poketeam.api.service.TeamService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/teams/{teamId}/pokemons")
public class TeamPokemonController {

    private final TeamService teamService;

    public TeamPokemonController(TeamService teamService) {
        this.teamService = teamService;
    }

    @PostMapping
    public ResponseEntity<TeamResponse> addPokemon(
        @PathVariable Long teamId,
        @Valid @RequestBody TeamPokemonRequest request,
        @AuthenticationPrincipal AuthenticatedUser authenticatedUser
    ) {
        TeamResponse response = teamService.addPokemon(teamId, request, authenticatedUser.getUser());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{teamPokemonId}")
    public TeamResponse updatePokemon(
        @PathVariable Long teamId,
        @PathVariable Long teamPokemonId,
        @Valid @RequestBody TeamPokemonUpdateRequest request,
        @AuthenticationPrincipal AuthenticatedUser authenticatedUser
    ) {
        return teamService.updatePokemon(teamId, teamPokemonId, request, authenticatedUser.getUser());
    }

    @DeleteMapping("/{teamPokemonId}")
    public TeamResponse deletePokemon(
        @PathVariable Long teamId,
        @PathVariable Long teamPokemonId,
        @AuthenticationPrincipal AuthenticatedUser authenticatedUser
    ) {
        return teamService.deletePokemon(teamId, teamPokemonId, authenticatedUser.getUser());
    }
}
