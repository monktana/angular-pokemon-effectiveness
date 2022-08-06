import { Pokemon, PokemonMove } from '../pokemon';

export abstract class PokemonService {

  abstract getPokemon(id: number): Promise<Pokemon>;

  abstract getMove(id: number): Promise<PokemonMove>;

  abstract getRandomPokemon(): Promise<Pokemon>;

  abstract getRandomMove(): Promise<PokemonMove>;
}
