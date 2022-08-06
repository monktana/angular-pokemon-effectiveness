import { Observable } from 'rxjs';
import { Pokemon, PokemonMove } from '../pokemon';

export abstract class PokemonService {

  abstract getPokemon(id: number): Promise<Pokemon>;

  abstract getMove(id: number): Promise<PokemonMove>;

  abstract getMatchup(): Observable<any>;

  abstract getRandomPokemon(): Observable<Pokemon>;

  abstract getRandomMove(): Observable<PokemonMove>;
}
