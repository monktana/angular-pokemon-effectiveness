import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon } from '../pokemon/pokemon';
import { PokemonService } from "../pokemon/pokemon.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  pokemon$!: Observable<Pokemon[]>;
  pokemon!: Pokemon[];

  constructor(private pokemonService: PokemonService) { }

  ngOnInit() {
    this.refreshPokemon()
  }

  ngOnDestroy() { }

  private refreshPokemon(): void {
    this.pokemon$ = this.pokemonService.getRandomPokemon(2);
    var subscription = this.pokemon$.subscribe((value: Pokemon[]) => this.pokemon = value);
    subscription.unsubscribe();
  }

  private fight(): number {
    return 0;
  }
}
