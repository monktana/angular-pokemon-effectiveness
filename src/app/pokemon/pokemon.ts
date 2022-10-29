import { typeMatchups } from './typematrix';

export const POKEMON_COUNT = 898;
export const MOVE_COUNT = 898;

export type Pokemon = {
  id: number;
  name: string;
  sprites: Sprite;
  types: { slot: number; type: { name: string; url: string } }[];
  moves: { move: { name: string; url: string } }[];
};

export type Move = {
  id: number;
  name: string;
  power: number | null;
  type: { name: string; url: string };
  learned_by_pokemon: { name: string; url: string }[];
  names: { name: string; language: { name: string; url: string } }[];
};

export type Sprite = {
  back_default: string;
  back_shiny: string;
  front_default: string;
  front_shiny: string;
};

export enum TypeEffectiveness {
  NoEffect,
  NotVeryEffective,
  Effective,
  SuperEffective,
}

export function attack(move: Move, target: Pokemon): TypeEffectiveness {
  const multiplier = target.types.reduce((multiplier, defendingType: any) => {
    return (multiplier *=
      typeMatchups[move.type.name][defendingType.type.name]);
  }, 1);

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
