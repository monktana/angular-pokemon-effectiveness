import { typeMatchups } from "./typematrix";

export interface Pokemon {
  name: string;
  sprites: Sprite;
  types: string[];
}

export interface Sprite {
  back_default: string;
  back_shiny: string;
  front_default: string;
  front_shiny: string;
}

export enum TypeEffectiveness {
  NoEffect,
  NotEffective,
  Effective,
  VeryEffective
}

export function attack(attacking: Pokemon, target: Pokemon): TypeEffectiveness {
  let multiplier = 1;

  attacking.types.forEach((attackingType: string) => {
    target.types.forEach((defendingType: string) => {
      multiplier *= typeMatchups[attackingType][defendingType]
    })
  });
  
  switch (true) {
    case multiplier > 1:
      return TypeEffectiveness.VeryEffective
    case multiplier == 1:
      return TypeEffectiveness.Effective
    case multiplier < 1 && multiplier > 0:
      return TypeEffectiveness.NotEffective
    case multiplier == 0:
      return TypeEffectiveness.NoEffect
    default:
      throw new Error(`unknown effectiveness: ${multiplier}`);
  }
}