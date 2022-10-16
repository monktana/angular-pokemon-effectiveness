import { Injectable } from '@angular/core';
import { defer, of } from 'rxjs';
import { concatMap, tap, retry } from 'rxjs/operators';
import { PokemonRepository } from 'src/app/pokemon/repository/pokemonRepository';
import { Pokemon, Move, POKEMON_COUNT } from '../../pokemon/pokemon';
import { Attacker, Matchup } from '../matchup';

@Injectable({
  providedIn: 'root',
})
export class MatchupService {
  readonly API_URL: string = 'https://pokeapi.co/api/v2';

  constructor(private repo: PokemonRepository) {}

  private getRandomNumber(ceiling: number): number {
    return Math.floor(Math.random() * ceiling + 1);
  }

  private getPokemon(): Promise<Pokemon> {
    return defer(() =>
      this.repo.getPokemon(this.getRandomNumber(POKEMON_COUNT))
    )
      .pipe(tap(this.validatePokemon), retry(10))
      .toPromise();
  }

  private async getAttacker(): Promise<Attacker> {
    const pokemon = await this.getPokemon();

    const move = await defer(() =>
      of(pokemon.moves[Math.floor(Math.random() * pokemon.moves.length)])
    )
      .pipe(
        concatMap(move =>
          this.repo.getMove(move.move.name).pipe(tap(this.validateMove))
        ),
        retry(pokemon.moves.length)
      )
      .toPromise();

    return { ...pokemon, move };
  }

  async getMatchup(): Promise<Matchup> {
    const [attacker, defender] = await Promise.all([
      this.getAttacker(),
      this.getPokemon(),
    ]);
    return { attacker, defender };
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
