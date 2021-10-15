import { Pokemon, attack, TypeEffectiveness } from './pokemon';

describe('Pokemon Typematchup', () => {
  describe('one type per pokemon', () => {
    let bulbasaur: Pokemon = {
      name: 'bulbasaur',
      picture: '',
      types: [{
        name: 'grass'
      }]
    };

    let shiggy: Pokemon = {
      name: 'shiggy',
      picture: '',
      types: [{
        name: 'water'
      }]
    };

    let charmander: Pokemon = {
      name: 'charmander',
      picture: '',
      types: [{
        name: 'fire'
      }]
    };

    let gastly: Pokemon = {
      name: 'gastly',
      picture: '',
      types: [{
        name: 'ghost'
      }]
    };

    let rattata: Pokemon = {
      name: 'rattata',
      picture: '',
      types: [{
        name: 'normal'
      }]
    };

    it('is ineffective', () => {
      expect(attack(gastly, rattata)).toBe(TypeEffectiveness.NotEffective);
    });

    it('is not effective', () => {
      expect(attack(shiggy, bulbasaur)).toBe(TypeEffectiveness.NotEffective);
    });
    
    it('is effective', () => {
      expect(attack(shiggy, rattata)).toBe(TypeEffectiveness.Effective);
    });

    it('is very effective', () => {
      expect(attack(shiggy, charmander)).toBe(TypeEffectiveness.VeryEffective);
    });
  });
  
  describe('two types per pokemon', () => {
    let venusaur: Pokemon = {
      name: 'venusaur',
      picture: '',
      types: [{
        name: 'grass'
      },{
        name: 'poison'
      }]
    };

    let charizard: Pokemon = {
      name: 'charmander',
      picture: '',
      types: [{
        name: 'fire'
      },{
        name: 'flying'
      }]
    };

    let gengar: Pokemon = {
      name: 'gengar',
      picture: '',
      types: [{
        name: 'ghost'
      },{
        name: 'poison'
      }]
    };

    let raticate: Pokemon = {
      name: 'raticate',
      picture: '',
      types: [{
        name: 'normal'
      }]
    };

    it('is ineffective', () => {
      expect(attack(gengar, raticate)).toBe(TypeEffectiveness.NotEffective);
    });

    it('is not effective', () => {
      expect(attack(venusaur, gengar)).toBe(TypeEffectiveness.NotEffective);
    });
    
    it('is effective', () => {
      expect(attack(raticate, venusaur)).toBe(TypeEffectiveness.Effective);
    });

    it('is very effective', () => {
      expect(attack(charizard, venusaur)).toBe(TypeEffectiveness.VeryEffective);
    });
  });
});
