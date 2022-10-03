import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PersistentScoreService } from './persistent-score-service';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageScoreService implements PersistentScoreService {
  private score: BehaviorSubject<number>;

  constructor() {
    this.score = new BehaviorSubject<number>(this.readFromLocalStorage());
  }

  observe(): Observable<number> {
    return this.score.asObservable();
  }

  private readFromLocalStorage(): number {
    return parseInt(localStorage.getItem('score') as string, 10);
  }

  save(score: number): void {
    const currentHighScore = this.readFromLocalStorage();

    try {
      if (score < currentHighScore) {
        return;
      }

      localStorage.setItem('score', score.toString());
      this.score.next(score);
    } catch (error) {
      console.log(error);
    }
  }
}
