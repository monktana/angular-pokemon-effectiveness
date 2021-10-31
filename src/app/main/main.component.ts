import { Component, OnInit } from '@angular/core';
import { Pokemon, TypeEffectiveness, attack } from '../pokemon/pokemon';
import { PokeapiService } from '../pokemon/services/pokeapi.service';
import { LocalStorageScoreService } from '../score/services/local-storage-score.service';
import { TemporaryScoreService } from '../score/services/temporary-score.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  attacking!: Pokemon;
  defending!: Pokemon;

  score!: number;

  constructor(private pokemonService: PokeapiService,
              private temporaryScoreService: TemporaryScoreService,
              private localStorageService: LocalStorageScoreService) { }

  ngOnInit(): void {
    this.refreshPokemon();
  }

  private refreshPokemon(): void {
    this.pokemonService.getRandomPokemon().subscribe((value: Pokemon) => {
      this.attacking = value;
    });

    this.pokemonService.getRandomPokemon().subscribe((value: Pokemon) => {
      this.defending = value;
    });
  }

  public fight(guess: TypeEffectiveness): void {
    const effectiveness = attack(this.attacking, this.defending);
    if (guess === effectiveness) {
      this.refreshPokemon();
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
