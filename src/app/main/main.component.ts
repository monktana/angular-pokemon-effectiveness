import { Component, OnInit } from '@angular/core';
import { Pokemon, TypeEffectiveness, attack, PokemonMove } from '../pokemon/pokemon';
import { PokeapiService } from '../pokemon/services/pokeapi.service';
import { LocalStorageScoreService } from '../score/services/local-storage-score.service';
import { TemporaryScoreService } from '../score/services/temporary-score.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  move!: PokemonMove;
  attacking!: Pokemon;
  defending!: Pokemon;
  score!: number;

  constructor(private pokemonService: PokeapiService,
              private temporaryScoreService: TemporaryScoreService,
              private localStorageService: LocalStorageScoreService) { }

  async ngOnInit(): Promise<void> {
    await this.refresh();
  }

  private async refresh(): Promise<void> {
    this.move = await this.pokemonService.getRandomMove();
    const movePokemon = this.move.learned_by_pokemon[Math.floor(Math.random() * this.move.learned_by_pokemon.length)].name;
    this.attacking = await this.pokemonService.getPokemon(movePokemon);

    this.defending = await this.pokemonService.getRandomPokemon();
  }

  public fight(guess: TypeEffectiveness): void {
    const effectiveness = attack(this.move.type, this.defending);
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
