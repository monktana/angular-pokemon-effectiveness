import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Pokemon } from './pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor(private firestore: AngularFirestore) { }

  getAllPokemon() {
    return this.firestore.collection<Pokemon>('pokemon').valueChanges();
  }

  getPokemon(id: string) {
    return this.firestore.collection<Pokemon>('pokemon').doc(id).valueChanges();
  }

  getRandomPokemon () { }

  addPokemon(data: Pokemon) { 
    this.firestore.collection('pokemon').add(data);
  }
}
