import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Matchup } from 'src/app/matchup/matchup';

import { RoundComponent } from '../round.component';

import POKEMON_FIXTURE from '../../../testing/fixtures/pokemon.json';
import MOVE_FIXTURE from '../../../testing/fixtures/moves.json';

describe('RoundComponent', () => {
  let component: RoundComponent;
  let fixture: ComponentFixture<RoundComponent>;
  let matchup: Matchup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoundComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RoundComponent);
    component = fixture.componentInstance;

    const attacker = POKEMON_FIXTURE.find(
      pokemon => pokemon.name === 'bulbasaur'
    )!;
    const move = MOVE_FIXTURE.find(move => move.name === 'tackle')!;
    const defender = POKEMON_FIXTURE.find(
      pokemon => pokemon.name === 'squirtle'
    )!;

    component.matchup = {
      attacker: { ...attacker, move },
      defender,
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
