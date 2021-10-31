import { TestBed } from '@angular/core/testing';

import { LocalStorageScoreService } from './local-storage-score.service';

describe('LocalStorageScoreService', () => {
  let service: LocalStorageScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
