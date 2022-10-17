import { attack, Move, Pokemon, TypeEffectiveness } from '../pokemon';
import { typeMatchups } from '../typematrix';
import pokemon from './fixtures/pokemon.json';
import moves from './fixtures/moves.json';

describe('pokémon matchups', () => {
  describe('one type per defending pokemon', () => {
    const squirtle: Pokemon = pokemon.find(
      pokemon => pokemon.name === 'squirtle'
    )!;

    const charmander: Pokemon = pokemon.find(
      pokemon => pokemon.name === 'charmander'
    )!;

    const gastly: Pokemon = pokemon.find(pokemon => pokemon.name === 'gastly')!;

    const tackle: Move = moves.find(move => move.name === 'tackle')!;

    const watergun: Move = moves.find(move => move.name === 'water-gun')!;

    const flamethrower: Move = moves.find(
      move => move.name === 'flamethrower'
    )!;

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
    const venusaur: Pokemon = pokemon.find(
      pokemon => pokemon.name === 'venusaur'
    )!;

    const charizard: Pokemon = pokemon.find(
      pokemon => pokemon.name === 'charizard'
    )!;

    const gastly: Pokemon = pokemon.find(pokemon => pokemon.name === 'gastly')!;

    const tackle: Move = moves.find(move => move.name === 'tackle')!;

    const sludgebomb: Move = moves.find(move => move.name === 'sludge-bomb')!;

    const watergun: Move = moves.find(move => move.name === 'water-gun')!;

    const flamethrower: Move = moves.find(
      move => move.name === 'flamethrower'
    )!;

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
    pokemon.forEach(pokemon => {
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
