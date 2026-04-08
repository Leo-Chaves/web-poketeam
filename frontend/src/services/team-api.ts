import { backendApi } from "@/services/api";
import type {
  Team,
  TeamPayload,
  TeamPokemonPayload,
  TeamPokemonUpdatePayload,
  TeamSummary,
} from "@/types/team";

export async function listTeams() {
  const response = await backendApi.get<TeamSummary[]>("/teams");
  return response.data;
}

export async function getTeam(teamId: number) {
  const response = await backendApi.get<Team>(`/teams/${teamId}`);
  return response.data;
}

export async function createTeam(payload: TeamPayload) {
  const response = await backendApi.post<Team>("/teams", payload);
  return response.data;
}

export async function updateTeam(teamId: number, payload: TeamPayload) {
  const response = await backendApi.put<Team>(`/teams/${teamId}`, payload);
  return response.data;
}

export async function deleteTeam(teamId: number) {
  await backendApi.delete(`/teams/${teamId}`);
}

export async function addPokemonToTeam(teamId: number, payload: TeamPokemonPayload) {
  const response = await backendApi.post<Team>(`/teams/${teamId}/pokemons`, payload);
  return response.data;
}

export async function updateTeamPokemon(
  teamId: number,
  teamPokemonId: number,
  payload: TeamPokemonUpdatePayload
) {
  const response = await backendApi.put<Team>(
    `/teams/${teamId}/pokemons/${teamPokemonId}`,
    payload
  );
  return response.data;
}

export async function removeTeamPokemon(teamId: number, teamPokemonId: number) {
  const response = await backendApi.delete<Team>(`/teams/${teamId}/pokemons/${teamPokemonId}`);
  return response.data;
}
