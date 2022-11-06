import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private cache: Map<String, HttpResponse<unknown>> = new Map();

  constructor() {}

  get(url: string): HttpResponse<unknown> | undefined {
    if (!this.cache) {
      return undefined;
    }

    return this.cache.get(url);
  }

  put(url: string, response: HttpResponse<unknown>): void {
    this.cache.set(url, response);
  }
}
