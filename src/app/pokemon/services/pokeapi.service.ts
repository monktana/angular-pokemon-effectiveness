import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pokemon } from '../pokemon';
import { PokemonService } from './pokemonservice';

@Injectable({
  providedIn: 'root'
})
export class PokeapiService implements PokemonService {

  constructor(private http: HttpClient) { }

  getPokemon(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${id}`)
                    .pipe(
                      map(this.parseApiData)
                    );
  }

  // nice 👌
  getRandomPokemon(): Observable<Pokemon> {
    const random = Math.floor(Math.random() * 898 + 1)
    return this.getPokemon(random);
  }

  private parseApiData(data: any): Pokemon {
    return {
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
}
