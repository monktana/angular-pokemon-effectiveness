import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemporaryScoreService {

  private _score: number;
  public score: BehaviorSubject<number>;

  constructor() { 
    this._score = 0;
    this.score = new BehaviorSubject<number>(this._score);
  }

  public increase(increment: number): void { 
    this._score += increment;
    this.score.next(this._score);
  }

  public reset(): void { 
    this._score = 0;
    this.score.next(this._score);
  }
}
