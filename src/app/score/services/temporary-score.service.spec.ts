import { TestBed } from '@angular/core/testing';

import { TemporaryScoreService } from './temporary-score.service';

describe('TemporaryscoreService', () => {
  let service: TemporaryScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemporaryScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
