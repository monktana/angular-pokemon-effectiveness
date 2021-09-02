import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  firestore: AngularFirestore;
  pokemon: Observable<any[]>;

  constructor(firestore: AngularFirestore) { 
    this.firestore = firestore;
    this.pokemon = this.firestore.collection('pokemon').valueChanges();
  }

  getPokemon() { return this.pokemon }
}
