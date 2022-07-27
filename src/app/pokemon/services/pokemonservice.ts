import { Observable } from 'rxjs';
import { Pokemon, PokemonType } from '../pokemon';

export abstract class PokemonService {

  abstract getPokemon(id: number | string): Observable<Pokemon>;

  abstract getType(id: number | string): Observable<PokemonType>;

  abstract getRandomPokemon(): Observable<Pokemon>;
}
