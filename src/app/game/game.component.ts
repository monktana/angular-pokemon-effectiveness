import { Component, EventEmitter, Input, Output, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
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
export class GameComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() state!: State;
  @Output() stateChange = new EventEmitter<State>();;

  attacking: Pokemon | undefined;
  defending: Pokemon | undefined;

  private loadTasks: string[] = [];

  constructor(private pokemonService: PokeapiService,
              private temporaryScoreService: TemporaryScoreService,
              private localStorageService: LocalStorageScoreService) { }

  ngOnInit(): void {
    this.refreshPokemon();
    console.log('initializing game component');
  }

  ngAfterViewInit(): void {
    console.log('initialized game components view');
  }

  ngOnDestroy(): void {
    console.log('destroying game component');
  }

  private async refreshPokemon(): Promise<any> {
    this.loadTasks.push('apiResponse');
    this.loadTasks.push('imagesLoaded');

    this.attacking = undefined;
    this.defending = undefined;

    this.attacking = await this.pokemonService.getRandomPokemon().pipe(first()).toPromise();
    this.defending = await this.pokemonService.getRandomPokemon().pipe(first()).toPromise();

    this.loadTasks = this.loadTasks.filter((task) => task !== 'apiResponse')
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
    console.log(`image loaded on component ${message}`)
  }

  public get TypeEffectiveness(): typeof TypeEffectiveness {
    return TypeEffectiveness;
  }

  public get State(): typeof State {
    return State;
  }
}
