import { Component, OnInit, OnDestroy } from '@angular/core';
import { TemporaryScoreService } from '../services/temporary-score.service';

@Component({
  selector: 'app-roundscore',
  templateUrl: './roundscore.component.html',
  styleUrls: ['./roundscore.component.scss']
})
export class RoundscoreComponent implements OnInit, OnDestroy {

  constructor(public temporaryScoreService: TemporaryScoreService) { }

  ngOnInit(): void { }

  ngOnDestroy(): void { }

}
