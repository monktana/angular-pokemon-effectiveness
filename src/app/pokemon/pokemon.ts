import { Type } from "./type";

export interface Pokemon {
  id?: string;
  name: string;
  picture: string;
  type: Type[];
}