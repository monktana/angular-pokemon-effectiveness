import { HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { CacheService } from '../cache.service';

describe('CacheService', () => {
  let service: CacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('saves a value', () => {
    const response = new HttpResponse();
    service.put('test', response);

    expect(service.get('test')).toEqual(response);
  });

  it('reads a value', () => {
    expect(service.get('test')).toBeUndefined();

    const response = new HttpResponse();
    service.put('test', response);

    expect(service.get('test')).toBeDefined();
  });
});
