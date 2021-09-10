import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokemonService } from "./../pokemon/pokemon.service";
import { Subscription } from 'rxjs';
import { Pokemon } from '../pokemon/pokemon';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  pokemon: Pokemon[] | undefined;
  subscription: Subscription | undefined;

  constructor(private pokemonService: PokemonService) { }

  ngOnInit() { 
    this.subscription = this.pokemonService.getAllPokemon().subscribe(pokemon => (this.pokemon = pokemon))
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
