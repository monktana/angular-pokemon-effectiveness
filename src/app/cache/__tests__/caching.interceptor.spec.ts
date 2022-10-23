import {
  HttpClient,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Pokemon } from 'src/app/pokemon/pokemon';
import { API_URL } from 'src/testing/helpers';
import { CacheService } from '../cache.service';
import { CachingInterceptor } from '../Interceptors/caching.interceptor';
import POKEMON_FIXTURES from '../../../testing/fixtures/pokemon.json';

describe('CachingInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: CachingInterceptor,
          multi: true,
        },
        CacheService,
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('caches multiple requests to the same resource', () => {
    const bulbasaur: Pokemon = POKEMON_FIXTURES.find(
      pokemon => pokemon.name === 'bulbasaur'
    )!;
    httpClient.get<Pokemon>(`${API_URL}/pokemon/1`).subscribe({
      next: pokemon => {
        expect(pokemon).withContext('expected pokémon').toEqual(bulbasaur);
      },
      error: fail,
    });

    httpTestingController
      .expectOne({
        method: 'GET',
        url: `${API_URL}/pokemon/1`,
      })
      .flush(bulbasaur);

    httpClient.get<Pokemon>(`${API_URL}/pokemon/1`).subscribe({
      next: pokemon => {
        expect(pokemon).withContext('expected pokémon').toEqual(bulbasaur);
      },
      error: fail,
    });
    httpTestingController.expectNone(`${API_URL}/pokemon/1`);
  });

  it('doesnt cache POST requests', () => {
    httpClient.post(`${API_URL}/pokemon/1`, {}).subscribe();
    httpTestingController
      .expectOne({
        method: 'POST',
        url: `${API_URL}/pokemon/1`,
      })
      .flush({});

    httpClient.post(`${API_URL}/pokemon/1`, {}).subscribe();
    httpTestingController
      .expectOne({
        method: 'POST',
        url: `${API_URL}/pokemon/1`,
      })
      .flush({});
  });
});
