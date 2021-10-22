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

  constructor(private pokemonService: PokeapiService) { }

  ngOnInit() { 
    this.refreshPokemon()
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

  public fight(guess: TypeEffectiveness): boolean {
    const effectiveness = attack(this.attacking, this.defending);
    return guess == effectiveness;
  }

  public get TypeEffectiveness(): typeof TypeEffectiveness {
    return TypeEffectiveness;
  }
}
