import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  pokemon: Observable<any>;

  constructor(firestore: Firestore) { 
    const pokemonCollection = collection(firestore, 'pokemon');
    this.pokemon = collectionData(pokemonCollection);
  }

  getPokemon() {
    return this.pokemon;
  }
}
