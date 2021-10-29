import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokeapiService } from '../pokemon/services/pokeapi.service';

import { MainComponent } from './main.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let pokeApiServiceStub: Partial<PokeapiService>;

  beforeEach(async () => {
    pokeApiServiceStub = {};

    TestBed.configureTestingModule({
      declarations: [ MainComponent ],
      providers: [ {provide: PokeapiService, useValue: pokeApiServiceStub} ]
    });
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
