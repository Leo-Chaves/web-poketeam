package com.poketeam.api.controller;

import com.poketeam.api.dto.TeamRequest;
import com.poketeam.api.dto.TeamResponse;
import com.poketeam.api.dto.TeamSummaryResponse;
import com.poketeam.api.security.AuthenticatedUser;
import com.poketeam.api.service.TeamService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping
    public List<TeamSummaryResponse> listTeams(@AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        return teamService.listTeams(authenticatedUser.getUser());
    }

    @GetMapping("/{teamId}")
    public TeamResponse getTeam(
        @PathVariable Long teamId,
        @AuthenticationPrincipal AuthenticatedUser authenticatedUser
    ) {
        return teamService.getTeam(teamId, authenticatedUser.getUser());
    }

    @PostMapping
    public ResponseEntity<TeamResponse> createTeam(
        @Valid @RequestBody TeamRequest request,
        @AuthenticationPrincipal AuthenticatedUser authenticatedUser
    ) {
        TeamResponse response = teamService.createTeam(request, authenticatedUser.getUser());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{teamId}")
    public TeamResponse updateTeam(
        @PathVariable Long teamId,
        @Valid @RequestBody TeamRequest request,
        @AuthenticationPrincipal AuthenticatedUser authenticatedUser
    ) {
        return teamService.updateTeam(teamId, request, authenticatedUser.getUser());
    }

    @DeleteMapping("/{teamId}")
    public ResponseEntity<Void> deleteTeam(
        @PathVariable Long teamId,
        @AuthenticationPrincipal AuthenticatedUser authenticatedUser
    ) {
        teamService.deleteTeam(teamId, authenticatedUser.getUser());
        return ResponseEntity.noContent().build();
    }
}
