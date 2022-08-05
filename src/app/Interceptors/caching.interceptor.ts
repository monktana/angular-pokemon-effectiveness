import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {

  private cache: Map<String, HttpResponse<any>> = new Map()

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isCachable(request)) {
      return next.handle(request);
    }

    const cachedResponse = this.cache.get(request.url);
    if (!cachedResponse) {
      console.log(`request not cached: ${request.url}`);
      return this.sendRequest(request, next);
    }

    console.log(`request cached: ${request.url}`);
    return of(cachedResponse);
  }

  sendRequest(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          console.log(`caching request: ${request.url}`);
          this.cache.set(request.url, event);
        }
      })
    );
  }

  isCachable(request: HttpRequest<unknown>): boolean {
    return request.method === 'GET';
  }
}
