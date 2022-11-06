import { attack, Move, Pokemon, TypeEffectiveness } from '../pokemon';
import { typeMatchups } from '../typematrix';
import POKEMON_FIXTURES from '../../../testing/fixtures/pokemon.json';
import MOVE_FIXTURES from '../../../testing/fixtures/moves.json';

describe('pokémon matchups', () => {
  let squirtle: Pokemon;
  let charmander: Pokemon;
  let venusaur: Pokemon;
  let charizard: Pokemon;
  let gastly: Pokemon;
  let tackle: Move;
  let sludgebomb: Move;
  let watergun: Move;
  let flamethrower: Move;

  beforeAll(() => {
    squirtle = POKEMON_FIXTURES.find(pokemon => pokemon.name === 'squirtle')!;
    charmander = POKEMON_FIXTURES.find(
      pokemon => pokemon.name === 'charmander'
    )!;
    venusaur = POKEMON_FIXTURES.find(pokemon => pokemon.name === 'venusaur')!;
    charizard = POKEMON_FIXTURES.find(pokemon => pokemon.name === 'charizard')!;
    gastly = POKEMON_FIXTURES.find(pokemon => pokemon.name === 'gastly')!;
    tackle = MOVE_FIXTURES.find(move => move.name === 'tackle')!;
    sludgebomb = MOVE_FIXTURES.find(move => move.name === 'sludge-bomb')!;
    watergun = MOVE_FIXTURES.find(move => move.name === 'water-gun')!;
    flamethrower = MOVE_FIXTURES.find(move => move.name === 'flamethrower')!;
  });

  describe('one type per defending pokemon', () => {
    it('has no effect', () => {
      expect(attack(tackle, gastly)).toBe(TypeEffectiveness.NoEffect);
    });

    it('is not effective', () => {
      expect(attack(watergun, squirtle)).toBe(
        TypeEffectiveness.NotVeryEffective
      );
    });

    it('is effective', () => {
      expect(attack(tackle, squirtle)).toBe(TypeEffectiveness.Effective);
    });

    it('is very effective', () => {
      expect(attack(watergun, charmander)).toBe(
        TypeEffectiveness.SuperEffective
      );
    });
  });

  describe('two types per defending pokemon', () => {
    it('has no effect', () => {
      expect(attack(tackle, gastly)).toBe(TypeEffectiveness.NoEffect);
    });

    it('is not effective (0.25x)', () => {
      expect(attack(sludgebomb, gastly)).toBe(
        TypeEffectiveness.NotVeryEffective
      );
    });

    it('is not effective (0.5x)', () => {
      expect(attack(watergun, venusaur)).toBe(
        TypeEffectiveness.NotVeryEffective
      );
    });

    it('is effective', () => {
      expect(attack(tackle, venusaur)).toBe(TypeEffectiveness.Effective);
    });

    it('is very effective (2x)', () => {
      expect(attack(watergun, charizard)).toBe(
        TypeEffectiveness.SuperEffective
      );
    });

    it('is very effective (4x)', () => {
      expect(attack(flamethrower, venusaur)).toBe(
        TypeEffectiveness.SuperEffective
      );
    });
  });
});

// currenly not covering all possible matchups
describe('type matrix', () => {
  Object.keys(typeMatchups).forEach(type => {
    POKEMON_FIXTURES.forEach(pokemon => {
      it(`attacks ${pokemon.name} with ${type}`, () => {
        let multiplier = 1;
        pokemon.types.forEach(defendingType => {
          multiplier *= typeMatchups[type][defendingType.type.name];
        });

        const move: Move = {
          id: 0,
          name: '',
          power: null,
          type: {
            name: type,
            url: '',
          },
          learned_by_pokemon: [],
          names: [],
        };

        let effectiveness = TypeEffectiveness.Effective;
        switch (true) {
          case multiplier > 1:
            effectiveness = TypeEffectiveness.SuperEffective;
            break;
          case multiplier < 1 && multiplier > 0:
            effectiveness = TypeEffectiveness.NotVeryEffective;
            break;
          case multiplier === 0:
            effectiveness = TypeEffectiveness.NoEffect;
            break;
        }

        expect(attack(move, pokemon)).toBe(effectiveness);
      });
    });
  });
});
