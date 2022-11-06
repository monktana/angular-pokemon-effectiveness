import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PokemonRepository } from 'src/app/pokemon/repository/pokemonRepository';
import { Move, Pokemon } from '../../pokemon/pokemon';
import { MatchupService } from '../services/matchup.service';
import { Matchup } from '../matchup';
import POKEMON_FIXTURES from '../../../testing/fixtures/pokemon.json';
import MOVE_FIXTURES from '../../../testing/fixtures/moves.json';
import { asyncData } from '../../../testing/helpers';

describe('MatchupService', () => {
  let httpTestingController: HttpTestingController;
  let repositorySpy: jasmine.SpyObj<PokemonRepository>;
  let matchupService: MatchupService;

  beforeEach(() => {
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
    it('contains an attacking and a defending pokémon', fakeAsync(() => {
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
            .withContext('expected attacking pokémon')
            .toEqual(squirtle.id);
          expect(matchup.attacker.move.id)
            .withContext('expected attacking move')
            .toEqual(tackle.id);
          expect(matchup.defender.id)
            .withContext('expected defending pokémon')
            .toEqual(charmander.id);
        },
        error: fail,
      });

      tick(1000);
      expect(repositorySpy.getPokemon.calls.count())
        .withContext('spy method getPokemon was called twice')
        .toBe(2);

      expect(repositorySpy.getMove.calls.count())
        .withContext('spy method getMove was called once')
        .toBe(1);
    }));

    it('doesnt accept a pokémon without a default front or back sprite', fakeAsync(() => {
      const bulbasaur: Pokemon = structuredClone(
        POKEMON_FIXTURES.find(pokemon => pokemon.name === 'bulbasaur')!
      );
      bulbasaur.sprites.front_default = '';
      const squirtle: Pokemon = structuredClone(
        POKEMON_FIXTURES.find(pokemon => pokemon.name === 'bulbasaur')!
      );
      squirtle.sprites.back_default = '';

      const charmander: Pokemon = structuredClone(
        POKEMON_FIXTURES.find(pokemon => pokemon.name === 'charmander')!
      );

      const tackle: Move = structuredClone(
        MOVE_FIXTURES.find(move => move.name === 'tackle')!
      );

      charmander.moves.push({ move: { name: tackle.name, url: '' } });

      repositorySpy.getPokemon.and.returnValues(
        asyncData(bulbasaur),
        asyncData(charmander),
        asyncData(bulbasaur),
        asyncData(charmander)
      );

      matchupService.getMatchup().subscribe({
        next: (matchup: Matchup) => {
          expect(matchup.attacker.id)
            .withContext('expected attacking pokémon')
            .toEqual(charmander.id);
          expect(matchup.attacker.move.id)
            .withContext('expected attacking move')
            .toEqual(tackle.id);
          expect(matchup.defender.id)
            .withContext('expected defending pokémon')
            .toEqual(charmander.id);
        },
        error: fail,
      });

      tick(2000);

      expect(repositorySpy.getPokemon.calls.count())
        .withContext('spy method getPokemon got called four times')
        .toBe(4);

      expect(repositorySpy.getMove.calls.count())
        .withContext("spy method getMove wasn't called")
        .toBe(1);
    }));

    it('doesnt accept a move without power', fakeAsync(() => {
      const bulbasaur: Pokemon = structuredClone(
        POKEMON_FIXTURES.find(pokemon => pokemon.name === 'bulbasaur')!
      );

      const growl: Move = MOVE_FIXTURES.find(move => move.name === 'growl')!;
      const razorLeaf: Move = MOVE_FIXTURES.find(
        move => move.name === 'razor-leaf'
      )!;

      bulbasaur.moves.push({ move: { name: growl.name, url: '' } });
      bulbasaur.moves.push({ move: { name: razorLeaf.name, url: '' } });

      repositorySpy.getPokemon.and.returnValue(asyncData(bulbasaur));
      repositorySpy.getMove.and.returnValues(
        asyncData(growl),
        asyncData(razorLeaf)
      );

      matchupService.getMatchup().subscribe({
        next: (matchup: Matchup) => {
          expect(matchup.attacker.id)
            .withContext('expected attacking pokémon')
            .toEqual(bulbasaur.id);
          expect(matchup.attacker.move.id)
            .withContext('expected attacking move')
            .toEqual(razorLeaf.id);
          expect(matchup.defender.id)
            .withContext('expected defending pokémon')
            .toEqual(bulbasaur.id);
        },
        error: fail,
      });

      tick(1000);
      expect(repositorySpy.getPokemon.calls.count())
        .withContext('spy method getPokemon got called twice')
        .toBe(2);

      expect(repositorySpy.getMove.calls.count())
        .withContext(`spy method getMove got called twice`)
        .toBe(2);
    }));
  });
});
