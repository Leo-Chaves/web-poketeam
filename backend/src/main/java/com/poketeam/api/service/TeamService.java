package com.poketeam.api.service;

import com.poketeam.api.dto.TeamPokemonRequest;
import com.poketeam.api.dto.TeamPokemonResponse;
import com.poketeam.api.dto.TeamPokemonUpdateRequest;
import com.poketeam.api.dto.TeamRequest;
import com.poketeam.api.dto.TeamResponse;
import com.poketeam.api.dto.TeamSummaryResponse;
import com.poketeam.api.entity.AppUser;
import com.poketeam.api.entity.Team;
import com.poketeam.api.entity.TeamPokemon;
import com.poketeam.api.exception.BusinessException;
import com.poketeam.api.exception.ResourceNotFoundException;
import com.poketeam.api.repository.TeamPokemonRepository;
import com.poketeam.api.repository.TeamRepository;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamPokemonRepository teamPokemonRepository;

    public TeamService(TeamRepository teamRepository, TeamPokemonRepository teamPokemonRepository) {
        this.teamRepository = teamRepository;
        this.teamPokemonRepository = teamPokemonRepository;
    }

    @Transactional(readOnly = true)
    public List<TeamSummaryResponse> listTeams(AppUser user) {
        return teamRepository.findByUserIdOrderByDataCriacaoDesc(user.getId()).stream()
            .map(this::toSummaryResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public TeamResponse getTeam(Long teamId, AppUser user) {
        return toResponse(requireTeam(teamId, user));
    }

    @Transactional
    public TeamResponse createTeam(TeamRequest request, AppUser user) {
        Team team = Team.builder()
            .nomeDaEquipe(request.nomeDaEquipe().trim())
            .treinador(request.treinador().trim())
            .descricao(request.descricao().trim())
            .user(user)
            .build();
        return toResponse(teamRepository.save(team));
    }

    @Transactional
    public TeamResponse updateTeam(Long teamId, TeamRequest request, AppUser user) {
        Team team = requireTeam(teamId, user);
        team.setNomeDaEquipe(request.nomeDaEquipe().trim());
        team.setTreinador(request.treinador().trim());
        team.setDescricao(request.descricao().trim());
        return toResponse(teamRepository.save(team));
    }

    @Transactional
    public void deleteTeam(Long teamId, AppUser user) {
        Team team = requireTeam(teamId, user);
        teamRepository.delete(team);
    }

    @Transactional
    public TeamResponse addPokemon(Long teamId, TeamPokemonRequest request, AppUser user) {
        Team team = requireTeam(teamId, user);

        if (team.getPokemons().size() >= 6) {
            throw new BusinessException("A equipe ja possui 6 Pokemon cadastrados.");
        }

        if (teamPokemonRepository.existsByTeamIdAndPosicaoNoTime(team.getId(), request.posicaoNoTime())) {
            throw new BusinessException("A posicao escolhida ja esta ocupada nessa equipe.");
        }

        TeamPokemon pokemon = TeamPokemon.builder()
            .nomePokemon(request.nomePokemon().trim())
            .pokemonIdDaPokeAPI(request.pokemonIdDaPokeAPI())
            .imagem(request.imagem().trim())
            .tipoPrincipal(request.tipoPrincipal().trim())
            .apelido(sanitizeOptional(request.apelido()))
            .posicaoNoTime(request.posicaoNoTime())
            .observacao(sanitizeOptional(request.observacao()))
            .team(team)
            .build();

        team.getPokemons().add(pokemon);
        return toResponse(teamRepository.save(team));
    }

    @Transactional
    public TeamResponse updatePokemon(
        Long teamId,
        Long teamPokemonId,
        TeamPokemonUpdateRequest request,
        AppUser user
    ) {
        Team team = requireTeam(teamId, user);
        TeamPokemon pokemon = requireTeamPokemon(team, teamPokemonId);

        if (teamPokemonRepository.existsByTeamIdAndPosicaoNoTimeAndIdNot(teamId, request.posicaoNoTime(), teamPokemonId)) {
            throw new BusinessException("A posicao escolhida ja esta ocupada nessa equipe.");
        }

        pokemon.setApelido(sanitizeOptional(request.apelido()));
        pokemon.setPosicaoNoTime(request.posicaoNoTime());
        pokemon.setObservacao(sanitizeOptional(request.observacao()));
        return toResponse(teamRepository.save(team));
    }

    @Transactional
    public TeamResponse deletePokemon(Long teamId, Long teamPokemonId, AppUser user) {
        Team team = requireTeam(teamId, user);
        TeamPokemon pokemon = requireTeamPokemon(team, teamPokemonId);
        team.getPokemons().remove(pokemon);
        return toResponse(teamRepository.save(team));
    }

    private Team requireTeam(Long teamId, AppUser user) {
        return teamRepository.findByIdAndUserId(teamId, user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Equipe nao encontrada."));
    }

    private TeamPokemon requireTeamPokemon(Team team, Long teamPokemonId) {
        return team.getPokemons().stream()
            .filter(pokemon -> pokemon.getId().equals(teamPokemonId))
            .findFirst()
            .orElseThrow(() -> new ResourceNotFoundException("Pokemon da equipe nao encontrado."));
    }

    private TeamSummaryResponse toSummaryResponse(Team team) {
        return new TeamSummaryResponse(
            team.getId(),
            team.getNomeDaEquipe(),
            team.getTreinador(),
            team.getDescricao(),
            team.getPokemons().size(),
            team.getDataCriacao()
        );
    }

    private TeamResponse toResponse(Team team) {
        List<TeamPokemonResponse> pokemons = team.getPokemons().stream()
            .sorted(Comparator.comparing(TeamPokemon::getPosicaoNoTime))
            .map(this::toPokemonResponse)
            .toList();

        return new TeamResponse(
            team.getId(),
            team.getNomeDaEquipe(),
            team.getTreinador(),
            team.getDescricao(),
            team.getDataCriacao(),
            pokemons
        );
    }

    private TeamPokemonResponse toPokemonResponse(TeamPokemon pokemon) {
        return new TeamPokemonResponse(
            pokemon.getId(),
            pokemon.getNomePokemon(),
            pokemon.getPokemonIdDaPokeAPI(),
            pokemon.getImagem(),
            pokemon.getTipoPrincipal(),
            pokemon.getApelido(),
            pokemon.getPosicaoNoTime(),
            pokemon.getObservacao()
        );
    }

    private String sanitizeOptional(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isBlank() ? null : trimmed;
    }
}
