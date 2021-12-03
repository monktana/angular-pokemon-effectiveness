import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Pokemon } from '../pokemon/pokemon';
import { PokeapiService } from '../pokemon/services/pokeapi.service';
import { LocalStorageScoreService } from '../score/services/local-storage-score.service';
import { TemporaryScoreService } from '../score/services/temporary-score.service';

import { GameComponent } from './game.component';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  let pokeApiServiceStub: Partial<PokeapiService>;
  let temporaryScoreServiceStub: Partial<TemporaryScoreService>;
  let localStorageServiceStub: Partial<LocalStorageScoreService>;

  const attacking: Pokemon = {name:'charmandar', sprites: {back_default: '', back_shiny: '', front_default: '', front_shiny: ''}, types: ['fire']};
  const defending: Pokemon = {name:'blubasaur', sprites: {back_default: '', back_shiny: '', front_default: '', front_shiny: ''}, types: ['grass', 'poison']};

  beforeEach(waitForAsync(() => {
    pokeApiServiceStub = {};
    temporaryScoreServiceStub = {};
    localStorageServiceStub = {};

    TestBed.configureTestingModule({
      declarations: [ GameComponent ],
      providers: [ 
        {provide: PokeapiService, useValue: pokeApiServiceStub},
        {provide: TemporaryScoreService, useValue: temporaryScoreServiceStub},
        {provide: LocalStorageScoreService, useValue: localStorageServiceStub}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.attacking = attacking;
    component.defending = defending;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
