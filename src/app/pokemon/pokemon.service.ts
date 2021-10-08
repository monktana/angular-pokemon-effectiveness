import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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

  getRandomPokemon (limit: number) { 
    let random = this.firestore.createId();

    const result = this.firestore.collection<Pokemon>('pokemon', ref => ref.where('random', '>=', random).orderBy('random').limit(limit))
                                 .valueChanges()
                                 .pipe(
                                  switchMap((content: Pokemon[]) => {
                                    if (!content || content.length != limit) {
                                      return this.firestore.collection<Pokemon>('pokemon', ref => ref.where('random', '<', random).orderBy('random', 'desc').limit(limit)).valueChanges()
                                    } else {
                                      return of(content);
                                    }
                                   })
                                 );

    return result;
  }

  getRandomPokemonWithInt (limit: number) { 
    //TODO
  }

  addPokemon(data: Pokemon) { 
    this.firestore.collection('pokemon').add(data);
  }
}
