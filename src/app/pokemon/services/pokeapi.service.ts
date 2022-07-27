import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pokemon, PokemonType } from '../pokemon';
import { PokemonService } from './pokemonservice';

@Injectable({
  providedIn: 'root'
})
export class PokeapiService implements PokemonService {

  constructor(private http: HttpClient) { }

  getPokemon(id: number | string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${id}`)
                    .pipe(map(this.parsePokemonData));
  }

  getType(id: number | string): Observable<PokemonType> {
    return this.http.get<PokemonType>(`https://pokeapi.co/api/v2/type/${id}`)
                    .pipe(map(this.parseTypeData));
  }

  // nice 👌
  getRandomPokemon(): Observable<Pokemon> {
    const random = Math.floor(Math.random() * 898 + 1);
    return this.getPokemon(random);
  }

  // also nice 👌
  getRandomType(): Observable<PokemonType> {
    const random = Math.floor(Math.random() * 18 + 1);
    return this.getType(random);
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
}
