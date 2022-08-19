import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';
import { Matchup, Pokemon, PokemonMove } from '../pokemon';
import { PokemonService } from './pokemon.service';

@Injectable({
  providedIn: 'root'
})
export class PokeapiService implements PokemonService {

  readonly API_URL: string = "https://pokeapi.co/api/v2";

  constructor(private http: HttpClient) { }

  getPokemon(id: number | string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.API_URL}/pokemon/${id}`)
                    .pipe(catchError(this.handleError('getPokemon'))) as Observable<Pokemon>;;
  }

  getMove(id: number | string): Observable<PokemonMove> {
    return this.http.get<PokemonMove>(`${this.API_URL}/move/${id}`)
                    .pipe(tap(this.validateMove), map(this.filterMovePokemon));
  }

  getRandomPokemon(): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.API_URL}/pokemon/${this.getRandomNumber(898)}`)
                    .pipe(tap(this.validatePokemon));
  }

  getRandomMove(): Observable<PokemonMove> {
    return this.http.get<PokemonMove>(`${this.API_URL}/move/${this.getRandomNumber(826)}`)
                    .pipe(tap(this.validateMove), map(this.filterMovePokemon));
  }

  private getRandomNumber(ceiling: number): number {
    return Math.floor(Math.random() * ceiling + 1);
  }

  getMatchup(): Observable<Matchup> {
    const move = this.getRandomMove()
    const attacking = move.pipe(
      concatMap((move) => {
        const learnedBy = move.learned_by_pokemon[Math.floor(Math.random() * move.learned_by_pokemon.length)];
        return this.http.get<Pokemon>(learnedBy.url)
      })
    )

    const defending = this.getRandomPokemon()

    return forkJoin({move, attacking, defending});
  }

  private filterMovePokemon(move: PokemonMove): PokemonMove {
    const clone = {...move};
    clone.learned_by_pokemon = clone.learned_by_pokemon.filter((pkmn) => pkmn.url.search(/(1\d{4})(?=\/$)/g) === -1);

    return clone;
  }

  private validateMove(move: PokemonMove): void {
    if (!move.power) {
      throw new Error(`move without power: ${move.name}`);
    }

    if (move.learned_by_pokemon.length === 0) {
      throw new Error(`move not learned by any pokémon: ${move.name}`);
    }
  }

  validatePokemon(pokemon: Pokemon): void {
    if ((!pokemon.sprites.front_default || !pokemon.sprites.back_default)) {
      throw new Error(`pokémon without sprite(s): ${pokemon.name}`);
    }
  }

  private handleError<T>(operation = 'operation') {
    return (error: HttpErrorResponse): Observable<T> => {

      // TODO: send the error to remote logging infrastructure

      if (error.error instanceof Event) {
        throw error.error;
      }

      const message = `server returned code ${error.status} with body "${error.error}"`;
      throw new Error(`${operation} failed: ${message}`);
    };

  }
}
