import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { ScoreService } from '../services/score.service';

describe('ScoreService', () => {
  let service: ScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('allows to observe the score', () => {
    const score$ = service.get();
    expect(score$).toBeTruthy();
    expect(score$).toBeInstanceOf(Observable);

    score$.subscribe({
      next: (score: number) => expect(score).toBe(0),
      error: fail,
    });
  });

  it('allows to increase the score', () => {
    const score$ = service.get();

    service.increase();

    score$.subscribe({
      next: (score: number) => expect(score).toBe(1),
      error: fail,
    });
  });

  it('allows to reset the score', () => {
    const score$ = service.get();

    service.increase();
    service.reset();

    score$.subscribe({
      next: (score: number) => expect(score).toBe(0),
      error: fail,
    });
  });
});
