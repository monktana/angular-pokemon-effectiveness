import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Pokemon } from './pokemon';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss'],
})
export class PokemonComponent implements OnChanges {
  @Input() pokemon: Pokemon | undefined;
  @Input() attacking: boolean = false;

  public spriteUrl: string = '';
  private isShiny: boolean = false;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.spriteUrl = this.determineSprite();
    this.isShiny = Math.round(Math.random() * 512) === 206;
  }

  private determineSprite(): string {
    if (!this.pokemon) {
      return '';
    }

    if (this.attacking && this.isShiny) {
      return this.pokemon.sprites.back_shiny;
    }

    if (this.attacking && !this.isShiny) {
      return this.pokemon.sprites.back_default;
    }

    if (!this.attacking && this.isShiny) {
      return this.pokemon.sprites.front_shiny;
    }

    return this.pokemon.sprites.front_default;
  }
}
