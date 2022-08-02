import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';

import { environment } from '../environments/environment';
import { PokemonComponent } from './pokemon/pokemon.component';
import { RoundscoreComponent } from './score/roundscore/roundscore.component';
import { HighscoreComponent } from './score/highscore/highscore.component';
import { PokemonmoveComponent } from './pokemon/pokemonmove/pokemonmove.component';

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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
