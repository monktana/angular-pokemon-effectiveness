import { Component, OnInit } from '@angular/core';
import { PokemonService } from "./../pokemon/pokemon.service";
import { Observable, scheduled } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  pokemon: Observable<any>;

  constructor(pokemonService: PokemonService) {
    this.pokemon = pokemonService.getPokemon();
  }

  ngOnInit(): void { }
}
