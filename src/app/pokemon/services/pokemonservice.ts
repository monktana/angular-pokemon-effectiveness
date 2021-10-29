import { Observable } from 'rxjs';
import { Pokemon } from '../pokemon';

export abstract class PokemonService {

  abstract getPokemon(id: number): Observable<Pokemon>;

  abstract getRandomPokemon(): Observable<Pokemon>;
}
