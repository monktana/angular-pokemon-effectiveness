import { Pokemon, attack, TypeEffectiveness, Sprite } from './pokemon';
import { typeMatchups } from './typematrix';
import pokemonFixture from './fixtures/pokemon.json';

const sprite: Sprite = {
  back_default: '',
  back_shiny: '',
  front_default: '',
  front_shiny: '',
};

describe('pokémon matchups', () => {
  describe('one type per defending pokemon', () => {
    const bulbasaur: Pokemon = {
      id: 1,
      name: 'bulbasaur',
      sprites: sprite,
      types: [{ slot: 0, type: { name: 'grass', url: '' } }],
    };

    const charmander: Pokemon = {
      id: 4,
      name: 'charmander',
      sprites: sprite,
      types: [{ slot: 0, type: { name: 'fire', url: '' } }],
    };

    const rattata: Pokemon = {
      id: 19,
      name: 'rattata',
      sprites: sprite,
      types: [{ slot: 0, type: { name: 'normal', url: '' } }],
    };

    it('has no effect', () => {
      expect(attack('ghost', rattata)).toBe(TypeEffectiveness.NoEffect);
    });

    it('is not effective', () => {
      expect(attack('water', bulbasaur)).toBe(
        TypeEffectiveness.NotVeryEffective
      );
    });

    it('is effective', () => {
      expect(attack('water', rattata)).toBe(TypeEffectiveness.Effective);
    });

    it('is very effective', () => {
      expect(attack('water', charmander)).toBe(
        TypeEffectiveness.SuperEffective
      );
    });
  });

  describe('two types per defending pokemon', () => {
    const venusaur: Pokemon = {
      id: 3,
      name: 'venusaur',
      sprites: sprite,
      types: [
        { slot: 0, type: { name: 'grass', url: '' } },
        { slot: 1, type: { name: 'poison', url: '' } },
      ],
    };

    const charizard: Pokemon = {
      id: 6,
      name: 'charizard',
      sprites: sprite,
      types: [
        { slot: 0, type: { name: 'fire', url: '' } },
        { slot: 1, type: { name: 'flying', url: '' } },
      ],
    };

    const gengar: Pokemon = {
      id: 94,
      name: 'gengar',
      sprites: sprite,
      types: [
        { slot: 0, type: { name: 'ghost', url: '' } },
        { slot: 1, type: { name: 'poison', url: '' } },
      ],
    };

    it('has no effect', () => {
      expect(attack('normal', gengar)).toBe(TypeEffectiveness.NoEffect);
    });

    it('is not effective (0.25x)', () => {
      expect(attack('poison', gengar)).toBe(TypeEffectiveness.NotVeryEffective);
    });

    it('is not effective (0.5x)', () => {
      expect(attack('grass', gengar)).toBe(TypeEffectiveness.NotVeryEffective);
    });

    it('is effective', () => {
      expect(attack('normal', venusaur)).toBe(TypeEffectiveness.Effective);
    });

    it('is very effective (2x)', () => {
      expect(attack('fire', venusaur)).toBe(TypeEffectiveness.SuperEffective);
    });

    it('is very effective (4x)', () => {
      expect(attack('rock', charizard)).toBe(TypeEffectiveness.SuperEffective);
    });
  });
});

describe('type matrix', () => {
  Object.keys(typeMatchups).forEach(type => {
    pokemonFixture.forEach(pokemon => {
      it(`attacks ${pokemon.name} with ${type}`, () => {
        let multiplier = 1;
        pokemon.types.forEach(defendingType => {
          multiplier *= typeMatchups[type][defendingType.type.name];
        });

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

        expect(attack(type, pokemon)).toBe(effectiveness);
      });
    });
  });
});
