import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Pokemon } from './pokemon';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss']
})
export class PokemonComponent implements OnChanges {

  @Input() pokemon!: Pokemon;

  public spriteUrl!: string;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.spriteUrl = this.determineSprite();
  }

  private determineSprite(): string {
    const isShiny = (Math.round((Math.random() * 512)) === 206);
    
    if (isShiny) {
      return this.pokemon.sprites.front_shiny;
    }

    return this.pokemon.sprites.front_default;
  }
}
