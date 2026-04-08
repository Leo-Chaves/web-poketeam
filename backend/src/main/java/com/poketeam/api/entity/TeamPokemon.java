package com.poketeam.api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "team_pokemons")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamPokemon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 60)
    private String nomePokemon;

    @Column(nullable = false)
    private Integer pokemonIdDaPokeAPI;

    @Column(nullable = false, length = 255)
    private String imagem;

    @Column(nullable = false, length = 40)
    private String tipoPrincipal;

    @Column(length = 60)
    private String apelido;

    @Column(nullable = false)
    private Integer posicaoNoTime;

    @Column(length = 300)
    private String observacao;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;
}
