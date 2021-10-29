import { Component } from '@angular/core';
import { TemporaryScoreService } from '../services/temporary-score.service';

@Component({
  selector: 'app-roundscore',
  templateUrl: './roundscore.component.html',
  styleUrls: ['./roundscore.component.scss']
})
export class RoundscoreComponent {

  constructor(public temporaryScoreService: TemporaryScoreService) { }

}
