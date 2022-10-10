import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { defer, Observable, of } from 'rxjs';
import { catchError, concatMap, tap, retry } from 'rxjs/operators';
import { Pokemon, PokemonMove } from '../pokemon';
import { PokemonService } from './pokemon.service';

@Injectable({
  providedIn: 'root',
})
export class PokeapiService implements PokemonService {
  readonly API_URL: string = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  getPokemon(id: number | string): Observable<Pokemon> {
    return this.http
      .get<Pokemon>(`${this.API_URL}/pokemon/${id}`)
      .pipe(catchError(this.handleError('getPokemon'))) as Observable<Pokemon>;
  }

  getMove(id: number | string): Observable<PokemonMove> {
    return this.http
      .get<PokemonMove>(`${this.API_URL}/move/${id}`)
      .pipe(catchError(this.handleError('getMove'))) as Observable<PokemonMove>;
  }

  getRandomPokemon(): Observable<Pokemon> {
    return this.http
      .get<Pokemon>(`${this.API_URL}/pokemon/${this.getRandomNumber(898)}`)
      .pipe(catchError(this.handleError('getPokemon'))) as Observable<Pokemon>;
  }

  getRandomMove(): Observable<PokemonMove> {
    return this.http
      .get<PokemonMove>(`${this.API_URL}/move/${this.getRandomNumber(826)}`)
      .pipe(catchError(this.handleError('getMove'))) as Observable<PokemonMove>;
  }

  private getRandomNumber(ceiling: number): number {
    return Math.floor(Math.random() * ceiling + 1);
  }

  async getAttackingPokemon(): Promise<{
    pokemon: Pokemon;
    move: PokemonMove;
  }> {
    const pokemon = await this.getRandomPokemon()
      .pipe(tap(this.validatePokemon))
      .toPromise();

    const move = await defer(() =>
      of(pokemon.moves[Math.floor(Math.random() * pokemon.moves.length)])
    )
      .pipe(
        concatMap(move =>
          this.getMove(move.move.name).pipe(tap(this.validateMove))
        ),
        retry(3)
      )
      .toPromise();

    return { pokemon, move };
  }

  filterMovePokemon(move: PokemonMove): PokemonMove {
    const clone = { ...move };
    clone.learned_by_pokemon = clone.learned_by_pokemon.filter(
      pkmn => pkmn.url.search(/(1\d{4})(?=\/$)/g) === -1
    );

    return clone;
  }

  validateMove(move: PokemonMove): void {
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

  private handleError<T>(operation = 'operation') {
    return (error: HttpErrorResponse): Observable<T> => {
      throw error;
      // TODO: send the error to remote logging infrastructure

      // if (error.error instanceof Event) {
      //   throw error.error;
      // }

      // const message = `server returned code ${error.status} with body "${error.error}"`;
      // throw new Error(`${operation} failed: ${message}`);
    };
  }
}
