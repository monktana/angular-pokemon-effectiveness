import { Component, OnInit } from '@angular/core';
import { defer } from 'rxjs';
import { map, retry, tap } from 'rxjs/operators';
import { TypeEffectiveness, attack, Matchup } from '../pokemon/pokemon';
import { PokeapiService } from '../pokemon/services/pokeapi.service';
import { LocalStorageScoreService } from '../score/services/local-storage-score.service';
import { TemporaryScoreService } from '../score/services/temporary-score.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  currentMatchup: Matchup | undefined;
  nextMatchup: Matchup | undefined;

  score!: number;

  constructor(
    private pokemonService: PokeapiService,
    private temporaryScoreService: TemporaryScoreService,
    private localStorageService: LocalStorageScoreService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.currentMatchup = await this.getMatchup();
    } catch (error) {
      console.log({ msg: 'error loading round', error });
    }

    try {
      this.nextMatchup = await this.getMatchup();
    } catch (error) {
      console.log({ msg: 'error loading round', error });
    }
  }

  private getMatchup(): Promise<Matchup> {
    return defer(() => this.pokemonService.getMatchup())
      .pipe(retry(10))
      .toPromise();
  }

  public fight(guess: TypeEffectiveness): void {
    const effectiveness = attack(
      this.currentMatchup!.move.type.name,
      this.currentMatchup!.defending
    );
    if (guess === effectiveness) {
      this.currentMatchup = this.nextMatchup;
      this.getMatchup()
        .then(matchup => (this.nextMatchup = matchup))
        .catch(reason => console.log({ msg: 'error loading round', reason }));

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
