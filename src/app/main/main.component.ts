import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon, Type } from '../pokemon/pokemon';
import { PokemonService } from "../pokemon/pokemon.service";
import { typeMatchups } from "../pokemon/typematrix";

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
    this.pokemon$.subscribe((value: Pokemon[]) => this.pokemon = value);
  }

  public fight(): number {
    const defending: Pokemon = this.pokemon[0];
    const attacking: Pokemon = this.pokemon[1];

    let multiplier = 1;

    attacking.types.forEach((attackingType: Type) => {
      defending.types.forEach((defendingType: Type) => {
        multiplier *= typeMatchups[attackingType.name][defendingType.name]
      })
    });

    return multiplier;
  }
}
