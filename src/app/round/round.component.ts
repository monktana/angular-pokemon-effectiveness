import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Matchup } from '../matchup/matchup';
import { attack, TypeEffectiveness } from '../pokemon/pokemon';

@Component({
  selector: 'app-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.scss'],
})
export class RoundComponent {
  @Input()
  matchup!: Matchup;

  @Output()
  finishRound: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}

  public guess(guess: TypeEffectiveness): void {
    const effectiveness = attack(
      this.matchup.attacker.move,
      this.matchup.defender
    );

    this.finishRound.emit(guess === effectiveness);
  }

  public get TypeEffectiveness(): typeof TypeEffectiveness {
    return TypeEffectiveness;
  }
}
