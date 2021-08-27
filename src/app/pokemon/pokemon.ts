import { Type } from "./type";

export interface Pokemon {
  id: number;
  name: string;
  picture: string;
  type: Type[];
}