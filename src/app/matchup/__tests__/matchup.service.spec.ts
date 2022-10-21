import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { PokeApiPokemonRepository } from 'src/app/pokemon/repository/pokeApiPokemonRepository';
import { PokemonRepository } from 'src/app/pokemon/repository/pokemonRepository';
import { Move, Pokemon } from '../../pokemon/pokemon';
import { MatchupService } from '../services/matchup.service';
import POKEMON_FIXTURES from '../../pokemon/__tests__/fixtures/pokemon.json';
import MOVE_FIXTURES from '../../pokemon/__tests__/fixtures/moves.json';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Matchup } from '../matchup';

describe('MatchupService', () => {
  let httpTestingController: HttpTestingController;
  let matchupService: MatchupService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        MatchupService,
        { provide: PokemonRepository, useClass: PokeApiPokemonRepository },
      ],
      imports: [HttpClientTestingModule],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    matchupService = TestBed.inject(MatchupService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('getMatchup', () => {
    it('contains an attacking and a defending pokemon', fakeAsync(() => {
      const squirtle: Pokemon = POKEMON_FIXTURES.find(
        pokemon => pokemon.name === 'squirtle'
      )!;
      const tackle: Move = MOVE_FIXTURES.find(move => move.name === 'tackle')!;

      squirtle.moves.push({ move: { name: tackle.name, url: '' } });

      const charmander: Pokemon = POKEMON_FIXTURES.find(
        pokemon => pokemon.name === 'charmander'
      )!;

      matchupService.getMatchup().subscribe({
        next: (matchup: Matchup) => {
          expect(matchup.attacker.id)
            .withContext('expected attacking pokemon')
            .toEqual(squirtle.id);
          expect(matchup.attacker.move.id)
            .withContext('expected attacking move')
            .toEqual(tackle.id);
          expect(matchup.defender.id)
            .withContext('expected defending pokemon')
            .toEqual(charmander.id);
        },
        error: fail,
      });

      tick();
      const pokemonRequests = httpTestingController.match(
        (request: HttpRequest<Pokemon>) => request.url.includes('pokemon')
      );
      expect(pokemonRequests.length).toBe(2);
      expect(pokemonRequests[0].request.method).toBe('GET');
      expect(pokemonRequests[1].request.method).toBe('GET');

      const moveRequest = httpTestingController.expectOne({
        method: 'GET',
        url: 'https://pokeapi.co/api/v2/move/tackle',
      });

      pokemonRequests[0].flush(squirtle);
      pokemonRequests[1].flush(charmander);
      moveRequest.flush(tackle);
    }));
  });
});
