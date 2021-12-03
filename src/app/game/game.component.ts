import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { State } from '../main/main.component';
import { attack, Pokemon, TypeEffectiveness } from '../pokemon/pokemon';
import { PokeapiService } from '../pokemon/services/pokeapi.service';
import { LocalStorageScoreService } from '../score/services/local-storage-score.service';
import { TemporaryScoreService } from '../score/services/temporary-score.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  @Input() state!: State;
  @Output() stateChange = new EventEmitter<State>();

  attacking: Pokemon | undefined;
  defending: Pokemon | undefined;

  private loadTasks: string[] = [];
  public loaded: boolean = false;

  constructor(private pokemonService: PokeapiService,
              private temporaryScoreService: TemporaryScoreService,
              private localStorageService: LocalStorageScoreService) { }

  ngOnInit(): void {
    this.refreshPokemon();
  }

  private async refreshPokemon(): Promise<any> {
    this.loaded = false;
    this.loadTasks.push('attackingPokemonLoaded');
    this.loadTasks.push('attackingImageLoaded');
    this.loadTasks.push('defendingPokemonLoaded');
    this.loadTasks.push('defendingImageLoaded');

    this.attacking = undefined;
    this.defending = undefined;

    this.attacking = await this.pokemonService.getRandomPokemon().pipe(first()).toPromise();
    this.loadTasks = this.loadTasks.filter((task) => task !== 'attackingPokemonLoaded');

    this.defending = await this.pokemonService.getRandomPokemon().pipe(first()).toPromise();
    this.loadTasks = this.loadTasks.filter((task) => task !== 'defendingPokemonLoaded');
  }

  public fight(guess: TypeEffectiveness): void {
    if (!this.attacking || !this.defending) {
      return;
    }

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
    this.state = State.GameOver;
    this.stateChange.emit(this.state);
  }

  public imageLoaded(message: string): void {
    this.loadTasks = this.loadTasks.filter((task) => task !== message);
    if (this.loadTasks.length == 0) {
      this.loaded = true;
    }
  }

  public get TypeEffectiveness(): typeof TypeEffectiveness {
    return TypeEffectiveness;
  }

  public get State(): typeof State {
    return State;
  }
}
