import { Observable } from 'rxjs';
import { Pokemon, PokemonType } from '../pokemon';

export abstract class PokemonService {

  abstract getPokemon(id: number | string): Promise<Pokemon>;

  abstract getType(id: number | string): Promise<PokemonType>;

  abstract getRandomPokemon(): Promise<Pokemon>;
}
