import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemporaryScoreService {

  private underlyingScore: number;
  public score: BehaviorSubject<number>;

  constructor() {
    this.underlyingScore = 0;
    this.score = new BehaviorSubject<number>(this.underlyingScore);
  }

  public increase(increment: number): void {
    this.underlyingScore += increment;
    this.score.next(this.underlyingScore);
  }

  public reset(): void {
    this.underlyingScore = 0;
    this.score.next(this.underlyingScore);
  }
}
