import { typeMatchups } from './typematrix';

export interface Pokemon {
  id: number;
  name: string;
  sprites: Sprite;
  types: {slot: number, type: {name: string, url: string}}[];
}

export interface PokemonMove {
  id: number;
  name: string;
  power: number | null;
  type: {name: string, url: string};
  learned_by_pokemon: {name: string, url: string}[];
  names: {name: string, language: {name: string, url: string}}[];
}

export interface Matchup {
  move: PokemonMove;
  attacking: Pokemon;
  defending: Pokemon;
}

export interface Sprite {
  back_default: string;
  back_shiny: string;
  front_default: string;
  front_shiny: string;
}

export enum TypeEffectiveness {
  NoEffect,
  NotVeryEffective,
  Effective,
  SuperEffective
}

export function attack(attacking: string, target: Pokemon): TypeEffectiveness {
  let multiplier = 1;

  target.types.forEach((defendingType: any) => {
    multiplier *= typeMatchups[attacking][defendingType.type.name];
  });

  switch (true) {
    case multiplier > 1:
      return TypeEffectiveness.SuperEffective;
    case multiplier === 1:
      return TypeEffectiveness.Effective;
    case multiplier < 1 && multiplier > 0:
      return TypeEffectiveness.NotVeryEffective;
    case multiplier === 0:
      return TypeEffectiveness.NoEffect;
    default:
      throw new Error(`unknown effectiveness: ${multiplier}`);
  }
}
