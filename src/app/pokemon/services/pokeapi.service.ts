import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { defer } from 'rxjs';
import { map, retry, tap } from 'rxjs/operators';
import { Pokemon, PokemonType, PokemonMove } from '../pokemon';
import { PokemonService } from './pokemon.service';

@Injectable({
  providedIn: 'root'
})
export class PokeapiService implements PokemonService {

  readonly API_URL: string = "https://pokeapi.co/api/v2"

  constructor(private http: HttpClient) { }

  getPokemon(id: number | string): Promise<Pokemon> {
    return this.http.get<Pokemon>(`${this.API_URL}/pokemon/${id}`)
                    .pipe(tap(this.validate),
                          map(this.parseData<Pokemon>),
                          retry(3))
                    .toPromise();
  }

  getMove(id: number | string): Promise<PokemonMove> {
    return this.http.get<PokemonMove>(`${this.API_URL}/move/${id}`)
                    .pipe(tap(this.validate),
                          map(this.parseData<PokemonMove>),
                          retry(3))
                    .toPromise();
  }

  getRandomNumber(ceiling: number): number {
    return Math.floor(Math.random() * ceiling + 1);
  }

  getRandomPokemon(): Promise<Pokemon> {
    return defer(() => this.http.get<PokemonMove>(`${this.API_URL}/pokemon/${this.getRandomNumber(898)}`))
                                .pipe(tap(this.validate),
                                      map(this.parseData<Pokemon>),
                                      retry(3))
                                .toPromise();
  }

  getRandomMove(): Promise<PokemonMove> {
    return defer(() => this.http.get<PokemonMove>(`${this.API_URL}/move/${this.getRandomNumber(826)}`))
                                .pipe(tap(this.validate),
                                      map(this.parseData<PokemonMove>),
                                      retry(3))
                                .toPromise();
  }

  private parseData<T>(data: any): T {
    return <T> data;
  }

  private validate(data: {[key: string]: any}): void {
    if (data.hasOwnProperty('sprites') && (!data.sprites.front_default || !data.sprites.back_default)) {
      throw new Error(`pokémon without sprite(s): ${data.name}`);
    }

    if (data.hasOwnProperty('learned_by_pokemon') && data.learned_by_pokemon.length === 0) {
      throw new Error(`move not learned by any pokémon: ${data.name}`);
    }

    if (data.hasOwnProperty('power') && !data.power) {
      throw new Error(`move without power: ${data.name}`);
    }
  }
}
