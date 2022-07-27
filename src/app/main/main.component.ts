import { Component, OnInit } from '@angular/core';
import { Pokemon, PokemonType, TypeEffectiveness, attack } from '../pokemon/pokemon';
import { PokeapiService } from '../pokemon/services/pokeapi.service';
import { LocalStorageScoreService } from '../score/services/local-storage-score.service';
import { TemporaryScoreService } from '../score/services/temporary-score.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  type!: PokemonType;
  pokemon!: Pokemon;

  score!: number;

  constructor(private pokemonService: PokeapiService,
              private temporaryScoreService: TemporaryScoreService,
              private localStorageService: LocalStorageScoreService) { }

  ngOnInit(): void {
    this.refresh();
  }

  private refresh(): void {
    this.pokemonService.getRandomType().subscribe((type: PokemonType) => {
      this.type = { ...type };
    });

    this.pokemonService.getRandomPokemon().subscribe((pokemon: Pokemon) => {
      this.pokemon = { ...pokemon };
    });
  }

  public fight(guess: TypeEffectiveness): void {
    const effectiveness = attack(this.type.name, this.pokemon);
    if (guess === effectiveness) {
      this.refresh();
      this.temporaryScoreService.increase(1);
      return;
    }

    this.temporaryScoreService
        .read()
        .subscribe(score => this.localStorageService.save(score))
        .unsubscribe();

    this.temporaryScoreService.reset();
  }

  public get TypeEffectiveness(): typeof TypeEffectiveness {
    return TypeEffectiveness;
  }
}
