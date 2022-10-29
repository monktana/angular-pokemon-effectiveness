import { Component, OnInit } from '@angular/core';
import { TypeEffectiveness, attack } from '../pokemon/pokemon';
import { MatchupService } from '../matchup/services/matchup.service';
import { LocalStorageScoreService } from '../score/services/local-storage-score.service';
import { TemporaryScoreService } from '../score/services/temporary-score.service';
import { Matchup } from '../matchup/matchup';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  currentMatchup$: Observable<Matchup> | undefined;
  nextMatchup$: Observable<Matchup> | undefined;

  score!: number;

  constructor(
    private matchupService: MatchupService,
    private temporaryScoreService: TemporaryScoreService,
    private localStorageService: LocalStorageScoreService
  ) {}

  async ngOnInit(): Promise<void> {
    this.currentMatchup$ = this.getMatchup();
    this.nextMatchup$ = this.getMatchup();
  }

  private getMatchup(): Observable<Matchup> {
    return this.matchupService.getMatchup();
  }

  public finishRound(successful: boolean): void {
    if (!successful) {
      console.log('game over');
      this.temporaryScoreService.reset();
      return;
    }

    this.currentMatchup$ = this.nextMatchup$;
    this.nextMatchup$ = this.getMatchup();

    this.temporaryScoreService.increase(1);
  }
}
