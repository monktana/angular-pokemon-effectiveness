import { Move, Pokemon } from '../pokemon/pokemon';

export type Matchup = {
  move: Move;
  attacking: Pokemon;
  defending: Pokemon;
}
