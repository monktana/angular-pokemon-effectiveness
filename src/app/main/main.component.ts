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
  currentRound!: {move: PokemonMove, attacking: Pokemon, defending: Pokemon}
  nextRound!: {move: PokemonMove, attacking: Pokemon, defending: Pokemon}

  score!: number;

  constructor(private pokemonService: PokeapiService,
              private temporaryScoreService: TemporaryScoreService,
              private localStorageService: LocalStorageScoreService) { }

  async ngOnInit(): Promise<void> {
    this.currentRound = await this.loadRound();
    this.nextRound = await this.loadRound();
  }

  private async loadRound(): Promise<any> {
    const move = await this.pokemonService.getRandomMove();
    const movePokemon = move.learned_by_pokemon[Math.floor(Math.random() * move.learned_by_pokemon.length)].name;
    const attacking = await this.pokemonService.getPokemon(movePokemon);

    const defending = await this.pokemonService.getRandomPokemon();

    return {move, attacking, defending};
  }

  public fight(guess: TypeEffectiveness): void {
    const effectiveness = attack(this.currentRound.move.type, this.currentRound.defending);
    if (guess === effectiveness) {
      this.currentRound = this.nextRound;
      this.loadRound().then((round) => this.nextRound = round);

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
