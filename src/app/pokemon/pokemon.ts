export interface Pokemon {
  id?: string;
  name: string;
  picture: string;
  types: Type[];
}

export interface Type {
  name: string;
  color: string;
}

export interface TypeMatchup {
  type: Type;
  multiplier: number;
}