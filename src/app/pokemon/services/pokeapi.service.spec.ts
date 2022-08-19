import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { defer } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Pokemon, PokemonMove, Sprite } from "../pokemon";
import { PokeapiService } from "./pokeapi.service";

fdescribe('PokeApiService', () => {
    let httpClientSpy: jasmine.SpyObj<HttpClient>;
    let pokeapiservice: PokeapiService;

    beforeEach(async () => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
        pokeapiservice = new PokeapiService(httpClientSpy);
    });

    describe('getPokemon', () => {
        it('should return a pokémon', (done: DoneFn) => {
            const sprite: Sprite = {
                "back_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png",
                "back_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/1.png",
                "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
                "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png",
            };

            const bulbasaur: Pokemon = {
                id: 1,
                name: 'bulbasaur',
                sprites: sprite,
                types: [{ slot: 1, type: { name: 'grass', url: 'https://pokeapi.co/api/v2/type/12/' } }, { slot: 2, type: { name: 'poison', url: 'https://pokeapi.co/api/v2/type/4/' } }]
            };

            httpClientSpy.get.and.returnValue(asyncData<Pokemon>(bulbasaur));

            pokeapiservice.getPokemon(1).subscribe({
                next: pokemon => {
                    expect(pokemon)
                        .withContext('expected pokémon')
                        .toEqual(bulbasaur);
                    done();
                },
                error: done.fail
            });

            expect(httpClientSpy.get.calls.count())
                .withContext('one call')
                .toBe(1);
        });

        it('should return an error when the server returns a 404', (done: DoneFn) => {
            const errorResponse = new HttpErrorResponse({
                error: 'test 404 error',
                status: 404, statusText: 'Not Found'
            });

            httpClientSpy.get.and.returnValue(asyncError(errorResponse));

            pokeapiservice.getPokemon(1).subscribe({
                next: pokemon => done.fail('expected an error, not a pokémon'),
                error: error => {
                    expect(error.message).toContain('test 404 error');
                    done()
                }
            });
        });

        it('is able to validate the pokémon data', (done: DoneFn) => {
            const sprite: Sprite = {
                "back_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png",
                "back_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/1.png",
                "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
                "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png",
            };

            const bulbasaur: Pokemon = {
                id: 1,
                name: 'bulbasaur',
                sprites: sprite,
                types: [{ slot: 1, type: { name: 'grass', url: 'https://pokeapi.co/api/v2/type/12/' } }, { slot: 2, type: { name: 'poison', url: 'https://pokeapi.co/api/v2/type/4/' } }]
            };

            httpClientSpy.get.and.returnValue(asyncData<Pokemon>(bulbasaur));

            pokeapiservice.getPokemon(1).pipe(tap(pokeapiservice.validatePokemon)).subscribe({
                next: pokemon => {
                    expect(pokemon)
                        .withContext('valid pokémon data')
                        .toEqual(bulbasaur);
                    done();
                },
                error: error => done.fail('expected valid pokémon data'),
            });

            expect(httpClientSpy.get.calls.count())
                .withContext('one call')
                .toBe(1);
        });

        it('recieves an error if the pokémon data is invalid', (done: DoneFn) => {
            const sprite: Sprite = {
                "back_default": "",
                "back_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/1.png",
                "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
                "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png",
            };

            const bulbasaur: Pokemon = {
                id: 1,
                name: 'bulbasaur',
                sprites: sprite,
                types: [{ slot: 1, type: { name: 'grass', url: 'https://pokeapi.co/api/v2/type/12/' } }, { slot: 2, type: { name: 'poison', url: 'https://pokeapi.co/api/v2/type/4/' } }]
            };

            httpClientSpy.get.and.returnValue(asyncData<Pokemon>(bulbasaur));
            pokeapiservice.getPokemon(1).pipe(tap(pokeapiservice.validatePokemon)).subscribe({
                next: pokemon => done.fail('expected invalid pokémon data.'),
                error: error => {
                    expect(error.message).toContain('pokémon without sprite(s)');
                    done()
                }
            });

            sprite.back_default = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png";
            sprite.front_default = "";

            pokeapiservice.getPokemon(1).pipe(tap(pokeapiservice.validatePokemon)).subscribe({
                next: pokemon => done.fail('expected invalid pokémon data.'),
                error: error => {
                    expect(error.message).toContain('pokémon without sprite(s)');
                    done()
                }
            });
        });
    })

    describe('getMove', () => {
        it('should return a move', (done: DoneFn) => {
            const tackle: PokemonMove = {
                id: 33,
                name: 'tackle',
                power: 40,
                type: { name: "normal", url: "https://pokeapi.co/api/v2/type/1/" },
                learned_by_pokemon: [
                    {
                        "name": "bulbasaur",
                        "url": "https://pokeapi.co/api/v2/pokemon/1/"
                    },
                    {
                        "name": "ivysaur",
                        "url": "https://pokeapi.co/api/v2/pokemon/2/"
                    },
                    {
                        "name": "venusaur",
                        "url": "https://pokeapi.co/api/v2/pokemon/3/"
                    },
                    {
                        "name": "calyrex-ice",
                        "url": "https://pokeapi.co/api/v2/pokemon/10193/"
                    },
                    {
                        "name": "calyrex-shadow",
                        "url": "https://pokeapi.co/api/v2/pokemon/10194/"
                    }
                ],
                names: []
            };

            httpClientSpy.get.and.returnValue(asyncData<PokemonMove>(tackle));

            pokeapiservice.getMove(33).subscribe({
                next: move => {
                    expect(move)
                        .withContext('expected move')
                        .toEqual(tackle);
                    done();
                },
                error: done.fail
            });

            expect(httpClientSpy.get.calls.count())
                .withContext('one call')
                .toBe(1);
        });

        it('should return an error when the server returns a 404', (done: DoneFn) => {
            const errorResponse = new HttpErrorResponse({
                error: 'test 404 error',
                status: 404, statusText: 'Not Found'
            });

            httpClientSpy.get.and.returnValue(asyncError(errorResponse));

            pokeapiservice.getMove(33).subscribe({
                next: move => done.fail('expected an error, not a move'),
                error: error => {
                    expect(error.message).toContain('test 404 error');
                    done()
                }
            });
        });

        it('is able to validate the move data', (done: DoneFn) => {
            const tackle: PokemonMove = {
                id: 33,
                name: 'tackle',
                power: 40,
                type: { name: "normal", url: "https://pokeapi.co/api/v2/type/1/" },
                learned_by_pokemon: [
                    {
                        "name": "bulbasaur",
                        "url": "https://pokeapi.co/api/v2/pokemon/1/"
                    },
                    {
                        "name": "ivysaur",
                        "url": "https://pokeapi.co/api/v2/pokemon/2/"
                    },
                    {
                        "name": "venusaur",
                        "url": "https://pokeapi.co/api/v2/pokemon/3/"
                    },
                    {
                        "name": "calyrex-ice",
                        "url": "https://pokeapi.co/api/v2/pokemon/10193/"
                    },
                    {
                        "name": "calyrex-shadow",
                        "url": "https://pokeapi.co/api/v2/pokemon/10194/"
                    }
                ],
                names: []
            };

            httpClientSpy.get.and.returnValue(asyncData<PokemonMove>(tackle));

            pokeapiservice.getMove(33).pipe(tap(pokeapiservice.validateMove)).subscribe({
                next: move => {
                    expect(move)
                        .withContext('valid pokémon data')
                        .toEqual(tackle);
                    done();
                },
                error: error => done.fail('expected valid move data'),
            });

            expect(httpClientSpy.get.calls.count())
                .withContext('one call')
                .toBe(1);
        });

        it('recieves an error if the pokémon data is invalid', (done: DoneFn) => {
            const growl: PokemonMove = {
                id: 45,
                name: 'growl',
                power: null,
                type: { name: "normal", url: "https://pokeapi.co/api/v2/type/1/" },
                learned_by_pokemon: [
                    {
                        "name": "bulbasaur",
                        "url": "https://pokeapi.co/api/v2/pokemon/1/"
                    },
                    {
                        "name": "ivysaur",
                        "url": "https://pokeapi.co/api/v2/pokemon/2/"
                    },
                    {
                        "name": "venusaur",
                        "url": "https://pokeapi.co/api/v2/pokemon/3/"
                    }
                ],
                names: []
            };
            
            const tackle: PokemonMove = {
                id: 33,
                name: 'tackle',
                power: 40,
                type: { name: "normal", url: "https://pokeapi.co/api/v2/type/1/" },
                learned_by_pokemon: [
                    {
                        "name": "bulbasaur",
                        "url": "https://pokeapi.co/api/v2/pokemon/1/"
                    },
                    {
                        "name": "ivysaur",
                        "url": "https://pokeapi.co/api/v2/pokemon/2/"
                    },
                    {
                        "name": "venusaur",
                        "url": "https://pokeapi.co/api/v2/pokemon/3/"
                    },
                    {
                        "name": "calyrex-ice",
                        "url": "https://pokeapi.co/api/v2/pokemon/10193/"
                    },
                    {
                        "name": "calyrex-shadow",
                        "url": "https://pokeapi.co/api/v2/pokemon/10194/"
                    }
                ],
                names: []
            };

            httpClientSpy.get.and.returnValue(asyncData<PokemonMove>(growl));

            pokeapiservice.getMove(45).pipe(tap(pokeapiservice.validateMove)).subscribe({
                next: pokemon => done.fail('expected invalid pokémon data.'),
                error: error => {
                    expect(error.message).toContain('move without power');
                    done()
                }
            });

            httpClientSpy.get.and.returnValue(asyncData<PokemonMove>(tackle));
            tackle.learned_by_pokemon = [];
            pokeapiservice.getMove(33).pipe(tap(pokeapiservice.validateMove)).subscribe({
                next: pokemon => done.fail('expected invalid move data.'),
                error: error => {
                    expect(error.message).toContain('move not learned by any pokémon');
                    done()
                }
            });
        });

        it('is able to filter unwanted pokémon (id >= 10000) from move data', (done: DoneFn) => {
            const tackle: PokemonMove = {
                id: 33,
                name: 'tackle',
                power: 40,
                type: { name: "normal", url: "https://pokeapi.co/api/v2/type/1/" },
                learned_by_pokemon: [
                    {
                        "name": "bulbasaur",
                        "url": "https://pokeapi.co/api/v2/pokemon/1/"
                    },
                    {
                        "name": "ivysaur",
                        "url": "https://pokeapi.co/api/v2/pokemon/2/"
                    },
                    {
                        "name": "venusaur",
                        "url": "https://pokeapi.co/api/v2/pokemon/3/"
                    },
                    {
                        "name": "calyrex-ice",
                        "url": "https://pokeapi.co/api/v2/pokemon/10000/"
                    },
                    {
                        "name": "calyrex-shadow",
                        "url": "https://pokeapi.co/api/v2/pokemon/10194/"
                    }
                ],
                names: []
            };

            httpClientSpy.get.and.returnValue(asyncData<PokemonMove>(tackle));

            pokeapiservice.getMove(33).pipe(map(pokeapiservice.filterMovePokemon)).subscribe({
                next: move => {
                    expect(move.learned_by_pokemon.length)
                        .withContext('move has less pokémon')
                        .toBeLessThan(tackle.learned_by_pokemon.length);
                    expect(move.learned_by_pokemon.length).toBe(3);
                    done();
                },
                error: done.fail
            });
        });
    })
});

function asyncData<T>(data: T) {
    return defer(() => Promise.resolve(data));
}

function asyncError(errorObject: any) {
    return defer(() => Promise.reject(errorObject));
}