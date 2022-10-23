import { defer } from 'rxjs';

export const API_URL: string = 'https://pokeapi.co/api/v2';

export function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}
