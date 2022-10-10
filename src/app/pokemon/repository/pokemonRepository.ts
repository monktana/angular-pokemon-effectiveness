import { Observable } from 'rxjs';
import { Pokemon, Move } from '../pokemon';

export abstract class PokemonRepository {
  abstract getPokemon(identifier: number | string): Observable<Pokemon>;

  abstract getMove(identifier: number | string): Observable<Move>;
}
