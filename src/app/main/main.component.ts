import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokemonService } from "./../pokemon/pokemon.service";
import { Observable } from 'rxjs';
import { Pokemon } from '../pokemon/pokemon';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  pokemon: Observable<Pokemon[]>;

  constructor(private pokemonService: PokemonService) { 
    this.pokemon = this.pokemonService.getRandomPokemon(2);
  }

  ngOnInit() { }

  ngOnDestroy() { }
}
