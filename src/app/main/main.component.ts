import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon, TypeEffectiveness, attack } from '../pokemon/pokemon';
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
    this.pokemon$.subscribe((value: Pokemon[]) => this.pokemon = value);
  }

  public fight(guess: TypeEffectiveness): boolean {
    const effectiveness = attack(this.pokemon[0], this.pokemon[1]);
    return guess == effectiveness;
  }

  public get TypeEffectiveness(): typeof TypeEffectiveness {
    return TypeEffectiveness;
  }
}
