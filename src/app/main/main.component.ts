import { Component, OnInit } from '@angular/core';
import { Pokemon } from "./../pokemon/pokemon";
import { PokemonService } from "./../pokemon/pokemon.service";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  pokemon: Observable<any[]>;

  constructor(pokemonService: PokemonService) {
    this.pokemon = pokemonService.getPokemon();
  }

  ngOnInit(): void {}
}
