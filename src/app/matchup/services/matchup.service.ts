import { Injectable } from '@angular/core';
import { defer, of } from 'rxjs';
import { concatMap, tap, retry } from 'rxjs/operators';
import { PokemonRepository } from 'src/app/pokemon/repository/pokemonRepository';
import { Pokemon, Move, POKEMON_COUNT } from '../../pokemon/pokemon';
import { Matchup } from '../matchup';

@Injectable({
  providedIn: 'root',
})
export class MatchupService {
  readonly API_URL: string = 'https://pokeapi.co/api/v2';

  constructor(private repo: PokemonRepository) {}

  private getRandomNumber(ceiling: number): number {
    return Math.floor(Math.random() * ceiling + 1);
  }

  async getMatchup(): Promise<Matchup> {
    const attacking = await this.repo
      .getPokemon(this.getRandomNumber(POKEMON_COUNT))
      .pipe(tap(this.validatePokemon), retry(10))
      .toPromise();

    const defending = await this.repo
      .getPokemon(this.getRandomNumber(POKEMON_COUNT))
      .pipe(tap(this.validatePokemon), retry(10))
      .toPromise();

    const move = await defer(() =>
      of(attacking.moves[Math.floor(Math.random() * attacking.moves.length)])
    )
      .pipe(
        concatMap(move =>
          this.repo.getMove(move.move.name).pipe(tap(this.validateMove))
        ),
        retry(attacking.moves.length)
      )
      .toPromise();

    return { attacking, move, defending };
  }

  validateMove(move: Move): void {
    if (!move.power) {
      throw new Error(`move without power: ${move.name}`);
    }

    if (move.learned_by_pokemon.length === 0) {
      throw new Error(`move not learned by any pokémon: ${move.name}`);
    }
  }

  validatePokemon(pokemon: Pokemon): void {
    if (!pokemon.sprites.front_default || !pokemon.sprites.back_default) {
      throw new Error(`pokémon without sprite(s): ${pokemon.name}`);
    }
  }
}
