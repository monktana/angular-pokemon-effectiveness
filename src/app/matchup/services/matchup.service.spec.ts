import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { map, tap } from 'rxjs/operators';
import { Pokemon, Move, Sprite } from '../../pokemon/pokemon';
import { PokeapiService } from './matchup.service';

describe('PokeApiService', () => {
  let httpClient: HttpClient;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let httpTestingController: HttpTestingController;

  let pokeapiservice: PokeapiService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [PokeapiService],
      imports: [HttpClientTestingModule],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);

    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    pokeapiservice = TestBed.inject(PokeapiService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('getPokemon', () => {
    it('returns a pokémon', (done: DoneFn) => {
      const sprite: Sprite = {
        back_default:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
        back_shiny:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/1.png',
        front_default:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
        front_shiny:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png',
      };

      const bulbasaur: Pokemon = {
        id: 1,
        name: 'bulbasaur',
        sprites: sprite,
        types: [
          {
            slot: 1,
            type: { name: 'grass', url: 'https://pokeapi.co/api/v2/type/12/' },
          },
          {
            slot: 2,
            type: { name: 'poison', url: 'https://pokeapi.co/api/v2/type/4/' },
          },
        ],
      };

      pokeapiservice.getPokemon(1).subscribe({
        next: pokemon => {
          expect(pokemon).withContext('expected pokémon').toEqual(bulbasaur);
          done();
        },
        error: done.fail,
      });

      const req = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/pokemon/1'
      );

      req.flush(bulbasaur);
    });

    it('returns an error if the request fails', (done: DoneFn) => {
      pokeapiservice.getPokemon(20000).subscribe({
        next: () => fail('should have failed with the 404 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).withContext('status').toEqual(404);
          expect(error.error)
            .withContext('message')
            .toEqual('deliberate 404 error');
          done();
        },
      });

      const req = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/pokemon/20000'
      );

      expect(req.request.method).toBe('GET');

      req.flush('deliberate 404 error', {
        status: 404,
        statusText: 'Not Found',
      });
    });

    it('validates the pokémon data', (done: DoneFn) => {
      const sprite: Sprite = {
        back_default:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
        back_shiny:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/1.png',
        front_default:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
        front_shiny:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png',
      };

      const bulbasaur: Pokemon = {
        id: 1,
        name: 'bulbasaur',
        sprites: sprite,
        types: [
          {
            slot: 1,
            type: { name: 'grass', url: 'https://pokeapi.co/api/v2/type/12/' },
          },
          {
            slot: 2,
            type: { name: 'poison', url: 'https://pokeapi.co/api/v2/type/4/' },
          },
        ],
      };

      pokeapiservice
        .getPokemon(1)
        .pipe(tap(pokeapiservice.validatePokemon))
        .subscribe({
          next: pokemon => {
            expect(pokemon)
              .withContext('valid pokémon data')
              .toEqual(bulbasaur);
            done();
          },
          error: error => done.fail('expected valid pokémon data'),
        });

      const req = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/pokemon/1'
      );

      expect(req.request.method).toBe('GET');

      req.flush(bulbasaur);
    });

    it('throws an error if the pokémon is missing the default front sprite', (done: DoneFn) => {
      const sprite: Sprite = {
        back_default:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
        back_shiny:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/1.png',
        front_default: '',
        front_shiny:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png',
      };

      const bulbasaur: Pokemon = {
        id: 1,
        name: 'bulbasaur',
        sprites: sprite,
        types: [
          {
            slot: 1,
            type: { name: 'grass', url: 'https://pokeapi.co/api/v2/type/12/' },
          },
          {
            slot: 2,
            type: { name: 'poison', url: 'https://pokeapi.co/api/v2/type/4/' },
          },
        ],
      };

      pokeapiservice
        .getPokemon(1)
        .pipe(tap(pokeapiservice.validatePokemon))
        .subscribe({
          next: pokemon => done.fail('expected invalid pokémon data.'),
          error: error => {
            expect(error.message).toContain('pokémon without sprite(s)');
            done();
          },
        });

      const req = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/pokemon/1'
      );

      req.flush(bulbasaur);
    });

    it('throws an error if the pokémon is missing the default back sprite', (done: DoneFn) => {
      const sprite: Sprite = {
        back_default: '',
        back_shiny:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/1.png',
        front_default:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
        front_shiny:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png',
      };

      const bulbasaur: Pokemon = {
        id: 1,
        name: 'bulbasaur',
        sprites: sprite,
        types: [
          {
            slot: 1,
            type: { name: 'grass', url: 'https://pokeapi.co/api/v2/type/12/' },
          },
          {
            slot: 2,
            type: { name: 'poison', url: 'https://pokeapi.co/api/v2/type/4/' },
          },
        ],
      };

      pokeapiservice
        .getPokemon(1)
        .pipe(tap(pokeapiservice.validatePokemon))
        .subscribe({
          next: pokemon => done.fail('expected invalid pokémon data.'),
          error: error => {
            expect(error.message).toContain('pokémon without sprite(s)');
            done();
          },
        });

      const req = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/pokemon/1'
      );

      req.flush(bulbasaur);
    });
  });

  describe('getMove', () => {
    it('should return a move', (done: DoneFn) => {
      const tackle: Move = {
        id: 33,
        name: 'tackle',
        power: 40,
        type: { name: 'normal', url: 'https://pokeapi.co/api/v2/type/1/' },
        learned_by_pokemon: [
          {
            name: 'bulbasaur',
            url: 'https://pokeapi.co/api/v2/pokemon/1/',
          },
          {
            name: 'ivysaur',
            url: 'https://pokeapi.co/api/v2/pokemon/2/',
          },
          {
            name: 'venusaur',
            url: 'https://pokeapi.co/api/v2/pokemon/3/',
          },
          {
            name: 'calyrex-ice',
            url: 'https://pokeapi.co/api/v2/pokemon/10193/',
          },
          {
            name: 'calyrex-shadow',
            url: 'https://pokeapi.co/api/v2/pokemon/10194/',
          },
        ],
        names: [],
      };

      pokeapiservice.getMove(33).subscribe({
        next: (move: Move) => {
          expect(move).withContext('expected move').toEqual(tackle);
          done();
        },
        error: done.fail,
      });

      const req = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/move/33'
      );

      req.flush(tackle);
    });

    it('recieves an error if the request fails', (done: DoneFn) => {
      pokeapiservice.getMove(20000).subscribe({
        next: () => done.fail('expected an error, not a move'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).withContext('status').toEqual(404);
          expect(error.error)
            .withContext('message')
            .toEqual('deliberate 404 error');
          done();
        },
      });

      const req = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/move/20000'
      );

      req.flush('deliberate 404 error', {
        status: 404,
        statusText: 'Not Found',
      });
    });

    it('validates the move data', (done: DoneFn) => {
      const tackle: Move = {
        id: 33,
        name: 'tackle',
        power: 40,
        type: { name: 'normal', url: 'https://pokeapi.co/api/v2/type/1/' },
        learned_by_pokemon: [
          {
            name: 'bulbasaur',
            url: 'https://pokeapi.co/api/v2/pokemon/1/',
          },
          {
            name: 'ivysaur',
            url: 'https://pokeapi.co/api/v2/pokemon/2/',
          },
          {
            name: 'venusaur',
            url: 'https://pokeapi.co/api/v2/pokemon/3/',
          },
          {
            name: 'calyrex-ice',
            url: 'https://pokeapi.co/api/v2/pokemon/10193/',
          },
          {
            name: 'calyrex-shadow',
            url: 'https://pokeapi.co/api/v2/pokemon/10194/',
          },
        ],
        names: [],
      };

      pokeapiservice
        .getMove(33)
        .pipe(tap(pokeapiservice.validateMove))
        .subscribe({
          next: (move: Move) => {
            expect(move).withContext('valid pokémon data').toEqual(tackle);
            done();
          },
          error: error => done.fail('expected valid move data'),
        });

      const req = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/move/33'
      );

      req.flush(tackle);
    });

    it('recieves an error if the move has no power', (done: DoneFn) => {
      const growl: Move = {
        id: 45,
        name: 'growl',
        power: null,
        type: { name: 'normal', url: 'https://pokeapi.co/api/v2/type/1/' },
        learned_by_pokemon: [
          {
            name: 'bulbasaur',
            url: 'https://pokeapi.co/api/v2/pokemon/1/',
          },
          {
            name: 'ivysaur',
            url: 'https://pokeapi.co/api/v2/pokemon/2/',
          },
          {
            name: 'venusaur',
            url: 'https://pokeapi.co/api/v2/pokemon/3/',
          },
        ],
        names: [],
      };

      pokeapiservice
        .getMove(45)
        .pipe(tap(pokeapiservice.validateMove))
        .subscribe({
          next: () => done.fail('expected invalid pokémon data.'),
          error: (error: HttpErrorResponse) => {
            expect(error.message).toContain('move without power');
            done();
          },
        });

      const req = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/move/45'
      );

      req.flush(growl);
    });

    it('recieves an error if the move is not learned by any pokémon', (done: DoneFn) => {
      const tackle: Move = {
        id: 33,
        name: 'tackle',
        power: 40,
        type: { name: 'normal', url: 'https://pokeapi.co/api/v2/type/1/' },
        learned_by_pokemon: [],
        names: [],
      };

      pokeapiservice
        .getMove(33)
        .pipe(tap(pokeapiservice.validateMove))
        .subscribe({
          next: () => done.fail('expected invalid pokémon data.'),
          error: (error: HttpErrorResponse) => {
            expect(error.message).toContain('move not learned by any pokémon');
            done();
          },
        });

      const req = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/move/33'
      );

      req.flush(tackle);
    });

    it('filters pokémon with an id >= 10000', (done: DoneFn) => {
      const tackle: Move = {
        id: 33,
        name: 'tackle',
        power: 40,
        type: { name: 'normal', url: 'https://pokeapi.co/api/v2/type/1/' },
        learned_by_pokemon: [
          {
            name: 'bulbasaur',
            url: 'https://pokeapi.co/api/v2/pokemon/1/',
          },
          {
            name: 'ivysaur',
            url: 'https://pokeapi.co/api/v2/pokemon/2/',
          },
          {
            name: 'venusaur',
            url: 'https://pokeapi.co/api/v2/pokemon/3/',
          },
          {
            name: 'calyrex-ice',
            url: 'https://pokeapi.co/api/v2/pokemon/10000/',
          },
          {
            name: 'calyrex-shadow',
            url: 'https://pokeapi.co/api/v2/pokemon/10194/',
          },
        ],
        names: [],
      };

      pokeapiservice
        .getMove(33)
        .pipe(map(pokeapiservice.filterMovePokemon))
        .subscribe({
          next: (move: Move) => {
            expect(move.learned_by_pokemon.length)
              .withContext('move has less pokémon')
              .toBeLessThan(tackle.learned_by_pokemon.length);
            expect(move.learned_by_pokemon.length).toBe(3);
            done();
          },
          error: done.fail,
        });

      const req = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/move/33'
      );

      req.flush(tackle);
    });
  });
});
