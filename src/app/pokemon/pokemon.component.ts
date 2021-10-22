import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Pokemon } from './pokemon';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss']
})
export class PokemonComponent implements OnInit {

  @Input() pokemon!: Pokemon;
  @Input() attacking!: boolean;

  public spriteUrl!: string;

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges) { 
    this.spriteUrl = this.determineSprite();
  }

  private determineSprite(): string { 
    const isShiny = (Math.round((Math.random() * 512)) == 206);
    if (isShiny) {
      if (this.attacking) {
        return this.pokemon.sprites.back_shiny;
      }
      return this.pokemon.sprites.front_shiny;
    }
    if (this.attacking) {
      return this.pokemon.sprites.back_default;
    }
    return this.pokemon.sprites.front_default;
  }
}
