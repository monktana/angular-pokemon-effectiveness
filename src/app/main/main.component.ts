import { Component, OnInit } from '@angular/core';
import { Pokemon, TypeEffectiveness, attack } from '../pokemon/pokemon';
import { PokeapiService } from "../pokemon/services/pokeapi.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  attacking!: Pokemon;
  defending!: Pokemon;

  score!: number;

  constructor(private pokemonService: PokeapiService) { }

  ngOnInit() { 
    this.refreshPokemon();
  }

  ngOnDestroy() { }

  private refreshPokemon(): void {
    this.pokemonService.getRandomPokemon().subscribe((value: Pokemon) => {
      this.attacking = value;
    });

    this.pokemonService.getRandomPokemon().subscribe((value: Pokemon) => {
      this.defending = value;
    });
  }

  public fight(guess: TypeEffectiveness): void {
    const effectiveness = attack(this.attacking, this.defending);
    if (guess == effectiveness) {
      this.refreshPokemon();
      return;
    }
    console.log('GAME OVER');
  }

  public get TypeEffectiveness(): typeof TypeEffectiveness {
    return TypeEffectiveness;
  }
}
