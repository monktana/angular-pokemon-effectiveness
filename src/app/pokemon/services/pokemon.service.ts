import { Observable } from 'rxjs';
import { Matchup, Pokemon, PokemonMove } from '../pokemon';

export abstract class PokemonService {
  abstract getPokemon(id: number): Observable<Pokemon>;

  abstract getMove(id: number): Observable<PokemonMove>;

  abstract getRandomPokemon(): Observable<Pokemon>;

  abstract getRandomMove(): Observable<PokemonMove>;
}
