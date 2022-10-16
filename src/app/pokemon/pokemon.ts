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
