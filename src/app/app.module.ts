import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';

import { CachingInterceptor } from './cache/Interceptors/caching.interceptor';
import { PokemonRepository } from './pokemon/repository/pokemonRepository';
import { PokeApiPokemonRepository } from './pokemon/repository/pokeApiPokemonRepository';
import { RoundComponent } from './round/round.component';
import { ScoreComponent } from './score/score.component';

@NgModule({
  declarations: [AppComponent, MainComponent, RoundComponent, ScoreComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true },
    {
      provide: PokemonRepository,
      useClass: PokeApiPokemonRepository,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
