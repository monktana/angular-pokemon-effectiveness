import { typeMatchups } from "./typematrix";

export interface Pokemon {
  name: string;
  picture: string ;
  types: Type[];
}

export interface Type {
  name: string;
}

export enum TypeEffectiveness {
  NotEffective,
  Effective,
  VeryEffective
}

export function attack(attacking: Pokemon, target: Pokemon): TypeEffectiveness {
  let multiplier = 1;

  attacking.types.forEach((attackingType: Type) => {
    target.types.forEach((defendingType: Type) => {
      multiplier *= typeMatchups[attackingType.name][defendingType.name]
    })
  });
  
  switch (true) {
    case multiplier > 1:
      return TypeEffectiveness.VeryEffective
    case multiplier == 1:
      return TypeEffectiveness.Effective
    case multiplier < 1:
      return TypeEffectiveness.NotEffective
    default:
      throw new Error(`unknown effectiveness: ${multiplier}`);
  }
}