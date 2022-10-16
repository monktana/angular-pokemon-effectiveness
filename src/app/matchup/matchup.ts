import { Move, Pokemon } from '../pokemon/pokemon';

export type Attacker = Pokemon & { move: Move };

export type Matchup = {
  attacker: Attacker;
  defender: Pokemon;
};
