import { Component } from '@angular/core';
import { LocalStorageScoreService } from '../services/local-storage-score.service';

@Component({
  selector: 'app-highscore',
  templateUrl: './highscore.component.html',
  styleUrls: ['./highscore.component.scss'],
})
export class HighscoreComponent {
  constructor(public localStorageService: LocalStorageScoreService) {}
}
