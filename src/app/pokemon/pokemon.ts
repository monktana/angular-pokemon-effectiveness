export interface Pokemon {
  id?: string;
  name: string;
  picture: string;
  types: Type[];
}

export interface Type {
  id: number;
  name: string;
  icon: string;
  color: string;
  effectiveness: TypeMatchup[] | null;
}

export interface TypeMatchup {
  type: Type;
  multiplier: number;
}