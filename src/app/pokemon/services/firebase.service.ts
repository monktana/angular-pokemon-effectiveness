import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { concatMap, first, map } from 'rxjs/operators';
import { Pokemon } from '../pokemon';
import { PokemonService } from './pokemonservice';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService implements PokemonService {

  constructor(private firestore: AngularFirestore, private http: HttpClient) { }

  getPokemon(id: number): Observable<Pokemon> {
    return this.firestore.collection<Pokemon>('pokemon', ref => ref.where('id', '==', id))
                          .valueChanges()
                          .pipe(
                            concatMap(x => x),
                            first(),
                            map(this.parseFirebaseData)
                          );
  }

  getRandomPokemon(): Observable<Pokemon> {
    const random = Math.floor(Math.random() * 898 + 1)
    return this.getPokemon(random);
  }

  private parseFirebaseData(data: any): Pokemon {
    return {
      name: data.name,
      sprites: {
        back_default: data.sprites.back_default,
        back_shiny: data.sprites.back_shiny,
        front_default: data.sprites.front_default,
        front_shiny: data.sprites.front_shiny
      },
      types: data.types
    };
  }
}
