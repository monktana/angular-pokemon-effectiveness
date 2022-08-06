import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';

import { environment } from '../environments/environment';
import { PokemonComponent } from './pokemon/pokemon.component';
import { RoundscoreComponent } from './score/roundscore/roundscore.component';
import { HighscoreComponent } from './score/highscore/highscore.component';
import { PokemonmoveComponent } from './pokemon/pokemonmove/pokemonmove.component';
import { CachingInterceptor } from './cache/Interceptors/caching.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    PokemonComponent,
    RoundscoreComponent,
    HighscoreComponent,
    PokemonmoveComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
