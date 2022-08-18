import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { defer } from "rxjs";
import { Pokemon, Sprite } from "../pokemon";
import { PokeapiService } from "./pokeapi.service";

fdescribe('PokeApiService', () => {
    let httpClientSpy: jasmine.SpyObj<HttpClient>;
    let pokeapiservice: PokeapiService;

    beforeEach(async () => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
        pokeapiservice = new PokeapiService(httpClientSpy);
    });

    it('should return a pokémon (HttpClient called once)', (done: DoneFn) => {
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

        httpClientSpy.get.and.returnValue(asyncData(bulbasaur));

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

    xit('should return an error when the pokémon data is invalid (HttpClient called once)', (done: DoneFn) => {
        const sprite: Sprite = {
            "back_default": "",
            "back_shiny": "",
            "front_default": "",
            "front_shiny": "",
        };

        const bulbasaur: Pokemon = {
            id: 1,
            name: 'bulbasaur',
            sprites: sprite,
            types: [{ slot: 1, type: { name: 'grass', url: 'https://pokeapi.co/api/v2/type/12/' } }, { slot: 2, type: { name: 'poison', url: 'https://pokeapi.co/api/v2/type/4/' } }]
        };

        httpClientSpy.get.and.returnValue(asyncData(bulbasaur));

        pokeapiservice.getPokemon(1).subscribe({
            next: pokemon => done.fail('expected an error because the pokémon data is invalid'),
            error: error => {
                expect(error.message).toContain('pokémon without sprite(s)');
                done()
            }
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
});

function asyncData<T>(data: T) {
    return defer(() => Promise.resolve(data));
}

function asyncError<T>(errorObject: any) {
    return defer(() => Promise.reject(errorObject));
}