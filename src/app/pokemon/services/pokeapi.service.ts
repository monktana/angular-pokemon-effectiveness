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
                    .pipe(map(this.parseData<Pokemon>))
                    .toPromise();
  }

  getType(id: number | string): Promise<PokemonType> {
    return this.http.get<PokemonType>(`https://pokeapi.co/api/v2/type/${id}`)
                    .pipe(map(this.parseData<PokemonType>))
                    .toPromise();
  }

  getMove(id: number | string): Promise<PokemonMove> {
    return this.http.get<PokemonMove>(`https://pokeapi.co/api/v2/move/${id}`)
                    .pipe(map(this.parseData<PokemonMove>))
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

  private parseData<T>(data: any): T {
    return <T> data;
  }
}
