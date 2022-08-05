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
    try {
      this.currentRound = await this.loadRound();
    } catch (error) {
      console.log({msg: 'error loading round', error});
    }
    
    try {
      this.nextRound = await this.loadRound();
    } catch (error) {
      console.log({msg: 'error loading round', error});
    }
  }

  private async loadRound(): Promise<any> {
    const move = await this.pokemonService.getRandomMove();
    
    const attackingPokemon = move.learned_by_pokemon[Math.floor(Math.random() * move.learned_by_pokemon.length)].url;
    let matches = attackingPokemon.match(/(\d{2,5})(?=\/$)/g);
    if (!matches) {
      throw new Error("no matches");
    }
    const attackingPokemonID = parseInt(matches[0]);

    const attacking = await this.pokemonService.getPokemon(attackingPokemonID);
    const defending = await this.pokemonService.getRandomPokemon();

    return {move, attacking, defending};
  }

  public fight(guess: TypeEffectiveness): void {
    const effectiveness = attack(this.currentRound.move.type.name, this.currentRound.defending);
    if (guess === effectiveness) {
      this.currentRound = this.nextRound;
      this.loadRound().then((round) => this.nextRound = round).catch((reason) => console.log({msg: 'error loading round', reason}));

      this.temporaryScoreService.increase(1);
      return;
    }

    this.temporaryScoreService
        .read()
        .subscribe(score => this.localStorageService.save(score))
        .unsubscribe();

    this.temporaryScoreService.reset();
  }
}
