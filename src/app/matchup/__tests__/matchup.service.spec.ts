import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PokemonRepository } from 'src/app/pokemon/repository/pokemonRepository';
import { Move, Pokemon } from '../../pokemon/pokemon';
import { MatchupService } from '../services/matchup.service';
import POKEMON_FIXTURES from '../../pokemon/__tests__/fixtures/pokemon.json';
import MOVE_FIXTURES from '../../pokemon/__tests__/fixtures/moves.json';
import { Matchup } from '../matchup';
import { defer } from 'rxjs';

describe('MatchupService', () => {
  let httpTestingController: HttpTestingController;
  let repositorySpy: jasmine.SpyObj<PokemonRepository>;
  let matchupService: MatchupService;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PokemonRepository', [
      'getPokemon',
      'getMove',
    ]);

    TestBed.configureTestingModule({
      providers: [
        MatchupService,
        { provide: PokemonRepository, useValue: spy },
      ],
      imports: [HttpClientTestingModule],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    repositorySpy = TestBed.inject(
      PokemonRepository
    ) as jasmine.SpyObj<PokemonRepository>;
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
      tackle.learned_by_pokemon.push({ name: squirtle.name, url: '' });

      const charmander: Pokemon = POKEMON_FIXTURES.find(
        pokemon => pokemon.name === 'charmander'
      )!;

      repositorySpy.getPokemon.and.returnValues(
        asyncData(squirtle),
        asyncData(charmander)
      );
      repositorySpy.getMove.and.returnValue(asyncData(tackle));

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
      expect(repositorySpy.getPokemon.calls.count())
        .withContext('spy method getPokemon was called twice')
        .toBe(2);

      expect(repositorySpy.getMove.calls.count())
        .withContext('spy method getMove was called once')
        .toBe(1);
    }));
  });
});

function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}
