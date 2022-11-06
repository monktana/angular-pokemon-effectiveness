import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '../cache.service';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  constructor(private cache: CacheService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!this.isCachable(request)) {
      return next.handle(request);
    }

    const cachedResponse = this.cache.get(request.url);
    return cachedResponse
      ? of(cachedResponse)
      : this.sendRequest(request, next);
  }

  sendRequest(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cache.put(request.url, event);
        }
      })
    );
  }

  isCachable(request: HttpRequest<unknown>): boolean {
    return request.method === 'GET';
  }
}
