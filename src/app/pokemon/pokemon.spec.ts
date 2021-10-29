import { Pokemon, attack, TypeEffectiveness, Sprite } from './pokemon';

const sprite: Sprite = {
  back_default: '',
  back_shiny: '',
  front_default: '',
  front_shiny: ''
};

describe('Pokemon Typematchup', () => {
  describe('one type per pokemon', () => {
    let bulbasaur: Pokemon = {
      name: 'bulbasaur',
      sprites: sprite,
      types: ['grass']
    };

    let shiggy: Pokemon = {
      name: 'shiggy',
      sprites: sprite,
      types: ['water']
    };

    let charmander: Pokemon = {
      name: 'charmander',
      sprites: sprite,
      types: ['fire']
    };

    let gastly: Pokemon = {
      name: 'gastly',
      sprites: sprite,
      types: ['ghost']
    };

    let rattata: Pokemon = {
      name: 'rattata',
      sprites: sprite,
      types: ['normal']
    };

    it('has no effect', () => {
      expect(attack(gastly, rattata)).toBe(TypeEffectiveness.NoEffect);
    });

    it('is not effective', () => {
      expect(attack(shiggy, bulbasaur)).toBe(TypeEffectiveness.NotVeryEffective);
    });
    
    it('is effective', () => {
      expect(attack(shiggy, rattata)).toBe(TypeEffectiveness.Effective);
    });

    it('is very effective', () => {
      expect(attack(shiggy, charmander)).toBe(TypeEffectiveness.SuperEffective);
    });
  });
  
  describe('two types per pokemon', () => {
    let venusaur: Pokemon = {
      name: 'venusaur',
      sprites: sprite,
      types: ['grass','poison']
    };

    let charizard: Pokemon = {
      name: 'charmander',
      sprites: sprite,
      types: ['fire','flying']
    };

    let gengar: Pokemon = {
      name: 'gengar',
      sprites: sprite,
      types: ['ghost','poison']
    };

    let raticate: Pokemon = {
      name: 'raticate',
      sprites: sprite,
      types: ['normal']
    };

    it('has no effect', () => {
      expect(attack(gengar, raticate)).toBe(TypeEffectiveness.NoEffect);
    });

    it('is not effective', () => {
      expect(attack(venusaur, gengar)).toBe(TypeEffectiveness.NotVeryEffective);
    });
    
    it('is effective', () => {
      expect(attack(raticate, venusaur)).toBe(TypeEffectiveness.Effective);
    });

    it('is very effective', () => {
      expect(attack(charizard, venusaur)).toBe(TypeEffectiveness.SuperEffective);
    });
  });
});
