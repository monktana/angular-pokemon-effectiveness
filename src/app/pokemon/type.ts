export interface Type {
  id: number;
  name: string;
  icon: string;
  color: string;
  effectiveness: TypeMatchup[];
}

export interface TypeMatchup {
  type: Type;
  multiplier: number;
}