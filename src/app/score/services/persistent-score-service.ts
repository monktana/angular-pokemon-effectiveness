import { Observable } from 'rxjs';

export abstract class PersistentScoreService {
  abstract observe(): Observable<number>;

  abstract save(score: number): void;
}
