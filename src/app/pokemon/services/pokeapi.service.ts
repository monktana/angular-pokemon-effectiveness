import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Pokemon, PokemonType, PokemonMove } from '../pokemon';
import { PokemonService } from './pokemonservice';

@Injectable({
  providedIn: 'root'
})
export class PokeapiService implements PokemonService {

  constructor(private http: HttpClient) { }

  getPokemon(id: number | string): Promise<Pokemon> {
    return this.http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${id}`)
                    .pipe(map(this.parsePokemonData))
                    .toPromise()!;
  }

  getType(id: number | string): Promise<PokemonType> {
    return this.http.get<PokemonType>(`https://pokeapi.co/api/v2/type/${id}`)
                    .pipe(map(this.parseTypeData))
                    .toPromise();
  }

  getMove(id: number | string): Promise<PokemonMove> {
    return this.http.get<PokemonMove>(`https://pokeapi.co/api/v2/move/${id}`)
                    .pipe(map(this.parseMoveData))
                    .toPromise();
  }

  getRandomPokemon(): Promise<Pokemon> {
    const random = Math.floor(Math.random() * 898 + 1);
    return this.getPokemon(random);
  }

  getRandomType(): Promise<PokemonType> {
    const random = Math.floor(Math.random() * 18 + 1);
    return this.getType(random);
  }

  getRandomMove(): Promise<PokemonMove> {
    const random = Math.floor(Math.random() * 826 + 1);
    return this.getMove(random);
  }

  private parsePokemonData(data: any): Pokemon {
    return {
      id: data.id,
      name: data.name,
      sprites: {
        back_default: data.sprites.back_default,
        back_shiny: data.sprites.back_shiny,
        front_default: data.sprites.front_default,
        front_shiny: data.sprites.front_shiny
      },
      types: data.types.map((t: any) => t.type.name)
    };
  }

  private parseTypeData(data: any): PokemonType {
    return {
      id: data.id,
      name: data.name
    };
  }

  private parseMoveData(data: any): PokemonMove {
    return {
      id: data.id,
      name: data.name,
      type: data.type.name,
      learned_by_pokemon: data.learned_by_pokemon
    };
  }
}
