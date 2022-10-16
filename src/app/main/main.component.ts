import { Component, OnInit } from '@angular/core';
import { TypeEffectiveness, Pokemon, Move } from '../pokemon/pokemon';
import { MatchupService } from '../matchup/services/matchup.service';
import { LocalStorageScoreService } from '../score/services/local-storage-score.service';
import { TemporaryScoreService } from '../score/services/temporary-score.service';
import { Matchup } from '../matchup/matchup';
import { typeMatchups } from '../pokemon/typematrix';

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
    private matchupService: MatchupService,
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

  private async getMatchup(): Promise<Matchup> {
    return this.matchupService.getMatchup();
  }

  public fight(guess: TypeEffectiveness): void {
    const effectiveness = this.attack(
      this.currentMatchup!.attacker.move,
      this.currentMatchup!.defender
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

  public get TypeEffectiveness(): typeof TypeEffectiveness {
    return TypeEffectiveness;
  }

  private attack(move: Move, target: Pokemon): TypeEffectiveness {
    let multiplier = 1;

    target.types.forEach((defendingType: any) => {
      multiplier *= typeMatchups[move.type.name][defendingType.type.name];
    });

    switch (true) {
      case multiplier > 1:
        return TypeEffectiveness.SuperEffective;
      case multiplier === 1:
        return TypeEffectiveness.Effective;
      case multiplier < 1 && multiplier > 0:
        return TypeEffectiveness.NotVeryEffective;
      case multiplier === 0:
        return TypeEffectiveness.NoEffect;
      default:
        throw new Error(`unknown effectiveness: ${multiplier}`);
    }
  }
}
