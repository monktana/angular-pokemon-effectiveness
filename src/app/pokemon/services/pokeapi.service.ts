import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, zip } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { Matchup, Pokemon, PokemonMove } from '../pokemon';
import { PokemonService } from './pokemon.service';

@Injectable({
  providedIn: 'root'
})
export class PokeapiService implements PokemonService {

  readonly MAX_RETRY_COUNT = 9;
  readonly API_URL: string = "https://pokeapi.co/api/v2";

  constructor(private http: HttpClient) { }

  getPokemon(id: number | string): Promise<Pokemon> {
    return this.http.get<Pokemon>(`${this.API_URL}/pokemon/${id}`)
                    .pipe(map(this.parseData<Pokemon>),
                          retry(this.MAX_RETRY_COUNT))
                    .toPromise();
  }

  getMove(id: number | string): Promise<PokemonMove> {
    return this.http.get<PokemonMove>(`${this.API_URL}/move/${id}`)
                    .pipe(map(this.parseData<PokemonMove>),
                          retry(this.MAX_RETRY_COUNT))
                    .toPromise();
  }

  getRandomNumber(ceiling: number): number {
    return Math.floor(Math.random() * ceiling + 1);
  }

  getRandomPokemon(): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.API_URL}/pokemon/${this.getRandomNumber(898)}`)
                                .pipe(map(this.parseData<Pokemon>),
                                      retry(this.MAX_RETRY_COUNT));
  }

  getRandomMove(): Observable<PokemonMove> {
    return this.http.get<PokemonMove>(`${this.API_URL}/move/${this.getRandomNumber(826)}`)
                                .pipe(map(this.parseData<PokemonMove>),
                                      retry(this.MAX_RETRY_COUNT));
  }

  getMatchup(): Observable<any> {
    const move = this.getRandomMove();
    const attacking = this.getRandomPokemon();
    const defending = this.getRandomPokemon();

    return zip(move, attacking, defending);
  }

  parseData<T>(data: any): T {
    return <T> data;
  }

  public validate(matchup: Matchup): void {
    if (!matchup.move.power) {
      console.log(`move without power: ${matchup.move.name}`);
      throw new Error(`move without power: ${matchup.move.name}`);
    }

    if (matchup.move.learned_by_pokemon.length === 0) {
      console.log(`move not learned by any pokémon: ${matchup.move.name}`);
      throw new Error(`move not learned by any pokémon: ${matchup.move.name}`);
    }

    const moveLearnedByAttacking = matchup.move.learned_by_pokemon.find(pkmn => pkmn.name === matchup.attacking.name);
    if (!moveLearnedByAttacking) {
      console.log(`move not learned by attacking pokémon: ${matchup.move.name}`);
      throw new Error(`move not learned by attacking pokémon: ${matchup.move.name}`);
    }

    if ((!matchup.attacking.sprites.front_default || !matchup.attacking.sprites.back_default) ||
        (!matchup.defending.sprites.front_default || !matchup.defending.sprites.back_default)) {
      console.log(`pokémon without sprite(s): ${matchup}`);
      throw new Error(`pokémon without sprite(s): ${matchup}`);
    }
  }
}
