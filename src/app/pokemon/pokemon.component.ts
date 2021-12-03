import { Component, Input, AfterViewInit, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { Pokemon } from './pokemon';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss']
})
export class PokemonComponent implements AfterViewInit {

  @Input() pokemon: Pokemon | undefined = undefined;
  @Input() attacking: boolean = false;

  @Output() imageLoaded = new EventEmitter<string>();

  @ViewChild('sprite') spriteElement!: ElementRef;
  spriteUrl: string = '';

  constructor() { }

  async ngAfterViewInit(): Promise<any> {
    this.spriteUrl = this.determineSprite();
    await this.loadImage(this.spriteUrl, this.spriteElement.nativeElement);
    if (this.spriteElement.nativeElement.complete) {
      this.imageLoaded.emit(`${this.attacking ? 'attacking': 'defending'}ImageLoaded`);
    }
  }

  private determineSprite(): string {
    if (!this.pokemon) {
      return '';
    }

    const isShiny = (Math.round((Math.random() * 512)) === 206);
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

  private async loadImage(url: string, elem: HTMLImageElement) {
    return new Promise((resolve, reject) => {
      elem.onload = () => resolve(elem);
      elem.onerror = reject;
      elem.src = url;
    });
  }
}
