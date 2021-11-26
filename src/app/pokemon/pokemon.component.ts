import { Component, Input, OnChanges, OnInit, AfterViewInit, OnDestroy, Output, SimpleChanges, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { Pokemon } from './pokemon';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss']
})
export class PokemonComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {

  @Input() pokemon: Pokemon | undefined = undefined;
  @Input() attacking: boolean = false;

  @Output() imageLoaded = new EventEmitter<string>();

  @ViewChild('sprite') spriteElement!: ElementRef;
  spriteUrl!: string;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('pokemon component input changed');
  }

  ngOnInit(): void {
    console.log('initializing pokemon component');
  }

  async ngAfterViewInit(): Promise<any> {
    this.spriteUrl = this.determineSprite();
    await this.loadImage(this.spriteUrl, this.spriteElement.nativeElement);
    if (this.spriteElement.nativeElement.complete) {
      this.imageLoaded.emit('loaded');
    }
  }

  ngOnDestroy(): void {
    console.log('destroying pokemon component');
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
