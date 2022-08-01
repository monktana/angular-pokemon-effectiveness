import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonmoveComponent } from './pokemonmove.component';

describe('PokemonmoveComponent', () => {
  let component: PokemonmoveComponent;
  let fixture: ComponentFixture<PokemonmoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PokemonmoveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonmoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
