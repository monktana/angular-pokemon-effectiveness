import { HttpErrorResponse } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Pokemon, Move } from '../../pokemon/pokemon';
import { PokeApiPokemonRepository } from '../repository/pokeApiPokemonRepository';
import POKEMON_FIXTURES from './fixtures/pokemon.json';
import MOVE_FIXTURES from './fixtures/moves.json';

describe('PokeApiPokemonRepository', () => {
  let httpTestingController: HttpTestingController;
  let pokeApiRepository: PokeApiPokemonRepository;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [PokeApiPokemonRepository],
      imports: [HttpClientTestingModule],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    pokeApiRepository = TestBed.inject(PokeApiPokemonRepository);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('getPokemon', () => {
    it('returns a pokémon', (done: DoneFn) => {
      const bulbasaur: Pokemon = POKEMON_FIXTURES.find(
        pokemon => pokemon.name === 'bulbasaur'
      )!;

      pokeApiRepository.getPokemon(1).subscribe({
        next: pokemon => {
          expect(pokemon).withContext('expected pokémon').toEqual(bulbasaur);
          done();
        },
        error: done.fail,
      });

      const req = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/pokemon/1'
      );
      expect(req.request.method).toEqual('GET');
      req.flush(bulbasaur);
    });

    it('returns an error if the request fails', (done: DoneFn) => {
      pokeApiRepository.getPokemon(20000).subscribe({
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
  });

  describe('getMove', () => {
    it('should return a move', (done: DoneFn) => {
      const tackle: Move = MOVE_FIXTURES.find(move => move.name === 'tackle')!;

      pokeApiRepository.getMove(33).subscribe({
        next: (move: Move) => {
          expect(move).withContext('expected move').toEqual(tackle);
          done();
        },
        error: done.fail,
      });

      const req = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/move/33'
      );
      expect(req.request.method).toBe('GET');

      req.flush(tackle);
    });

    it('recieves an error if the request fails', (done: DoneFn) => {
      pokeApiRepository.getMove(20000).subscribe({
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
      expect(req.request.method).toBe('GET');

      req.flush('deliberate 404 error', {
        status: 404,
        statusText: 'Not Found',
      });
    });
  });
});
