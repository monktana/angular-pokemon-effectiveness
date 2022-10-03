import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Pokemon, PokemonMove, TypeEffectiveness } from '../pokemon';

@Component({
  selector: 'app-pokemonmove',
  templateUrl: './pokemonmove.component.html',
  styleUrls: ['./pokemonmove.component.scss'],
})
export class PokemonmoveComponent {
  @Input() pokemon: Pokemon | undefined;
  @Input() move: PokemonMove | undefined;

  @Output() fight = new EventEmitter<TypeEffectiveness>();

  constructor() {}

  guessEffectiveness(guess: TypeEffectiveness) {
    this.fight.emit(guess);
  }

  public get TypeEffectiveness(): typeof TypeEffectiveness {
    return TypeEffectiveness;
  }
}
