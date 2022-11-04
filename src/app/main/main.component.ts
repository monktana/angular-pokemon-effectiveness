import { Component, OnInit } from '@angular/core';
import { MatchupService } from '../matchup/services/matchup.service';
import { Matchup } from '../matchup/matchup';
import { Observable, ObservedValueOf } from 'rxjs';
import { ScoreService } from '../score/services/score.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  currentMatchup$: Observable<Matchup> | undefined;
  nextMatchup$: Observable<Matchup> | undefined;
  score$: Observable<number> | undefined;

  constructor(
    private matchupService: MatchupService,
    private scoreService: ScoreService
  ) {}

  async ngOnInit(): Promise<void> {
    this.currentMatchup$ = this.getMatchup();
    this.nextMatchup$ = this.getMatchup();
    this.score$ = this.scoreService.get();
  }

  private getMatchup(): Observable<Matchup> {
    return this.matchupService.getMatchup();
  }

  public finishRound(successful: boolean): void {
    if (!successful) {
      console.log('game over');
      this.scoreService.reset();
      return;
    }

    this.scoreService.increase();
    this.currentMatchup$ = this.nextMatchup$;
    this.nextMatchup$ = this.getMatchup();
  }
}
