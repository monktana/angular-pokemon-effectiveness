export interface Pokemon {
  name: string;
  picture: string;
  types: Type[];
}

export interface Type {
  name: string;
}

export interface TypeMatchup {
  type: Type;
  multiplier: number;
}