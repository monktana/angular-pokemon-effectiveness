import { Injectable } from '@angular/core';
import { POKEMON } from './mock-pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor() { }

  getPokemon() { return POKEMON }
}
