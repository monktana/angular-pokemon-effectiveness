import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Pokemon, Move } from '../pokemon';
import { PokemonRepository } from './pokemonRepository';

@Injectable({ providedIn: 'root' })
export class PokeApiPokemonRepository implements PokemonRepository {
  readonly API_URL: string = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  getPokemon(id: number | string): Observable<Pokemon> {
    return this.http
      .get<Pokemon>(`${this.API_URL}/pokemon/${id}`)
      .pipe(catchError(this.handleError())) as Observable<Pokemon>;
  }

  getMove(id: number | string): Observable<Move> {
    return this.http
      .get<Move>(`${this.API_URL}/move/${id}`)
      .pipe(catchError(this.handleError())) as Observable<Move>;
  }

  private handleError<T>() {
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
