import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScoreService {
  private score: BehaviorSubject<number>;

  constructor() {
    this.score = new BehaviorSubject<number>(0);
  }

  public get(): Observable<number> {
    return this.score;
  }

  public increase(): void {
    this.score.next(this.score.value + 1);
  }

  public reset(): void {
    this.score.next(0);
  }
}
