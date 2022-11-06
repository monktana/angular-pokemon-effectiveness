import { Injectable } from '@angular/core';
import { defer, forkJoin, Observable } from 'rxjs';
import { tap, retry, switchMap, map } from 'rxjs/operators';
import { PokemonRepository } from 'src/app/pokemon/repository/pokemonRepository';
import { Pokemon, Move, POKEMON_COUNT } from '../../pokemon/pokemon';
import { Attacker, Matchup } from '../matchup';

@Injectable({
  providedIn: 'root',
})
export class MatchupService {
  readonly MAX_RETRIES = 9;

  constructor(private repo: PokemonRepository) {}

  private getRandomNumber(ceiling: number): number {
    return Math.floor(Math.random() * ceiling + 1);
  }

  private getPokemon(): Observable<Pokemon> {
    return defer(() =>
      this.repo.getPokemon(this.getRandomNumber(POKEMON_COUNT))
    ).pipe(tap(this.validatePokemon), retry(this.MAX_RETRIES));
  }

  private getRandomMoveOfPokemon(pokemon: Pokemon): string {
    return pokemon.moves[Math.floor(Math.random() * pokemon.moves.length)].move
      .name;
  }

  private getAttacker(): Observable<Attacker> {
    return this.getPokemon().pipe(
      switchMap((pokemon: Pokemon) =>
        defer(() =>
          this.repo.getMove(this.getRandomMoveOfPokemon(pokemon))
        ).pipe(
          tap(this.validateMove),
          map((move: Move) => ({ ...pokemon, move })),
          retry(this.MAX_RETRIES)
        )
      )
    );
  }

  getMatchup(): Observable<Matchup> {
    return forkJoin({
      attacker: this.getAttacker(),
      defender: this.getPokemon(),
    });
  }

  validateMove(move: Move): void {
    if (!move.power) {
      throw new Error(`move without power: ${move.name}`);
    }
  }

  validatePokemon(pokemon: Pokemon): void {
    if (!pokemon.sprites.front_default || !pokemon.sprites.back_default) {
      throw new Error(`pokémon without sprite(s): ${pokemon.name}`);
    }
  }
}
