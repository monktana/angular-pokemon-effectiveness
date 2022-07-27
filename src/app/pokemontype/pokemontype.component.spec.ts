import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemontypeComponent } from './pokemontype.component';

describe('PokemontypeComponent', () => {
  let component: PokemontypeComponent;
  let fixture: ComponentFixture<PokemontypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PokemontypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemontypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
