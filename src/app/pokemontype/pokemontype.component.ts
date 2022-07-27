import { Component, Input } from '@angular/core';
import { PokemonType } from '../pokemon/pokemon';

@Component({
  selector: 'app-pokemontype',
  templateUrl: './pokemontype.component.html',
  styleUrls: ['./pokemontype.component.scss']
})
export class PokemontypeComponent {

  @Input() type!: PokemonType;

  constructor() { }

}
