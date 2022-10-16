import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchupService } from '../matchup/services/matchup.service';

import { MainComponent } from './main.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let pokeApiServiceStub: Partial<MatchupService>;

  beforeEach(async () => {
    pokeApiServiceStub = {};

    TestBed.configureTestingModule({
      declarations: [MainComponent],
      providers: [{ provide: MatchupService, useValue: pokeApiServiceStub }],
    });
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
