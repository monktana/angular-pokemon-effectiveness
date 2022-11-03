import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { RoundComponent } from '../round.component';

import POKEMON_FIXTURE from '../../../testing/fixtures/pokemon.json';
import MOVE_FIXTURE from '../../../testing/fixtures/moves.json';
import { TypeEffectiveness } from 'src/app/pokemon/pokemon';
import { first } from 'rxjs/operators';

const attacker = POKEMON_FIXTURE.find(pokemon => pokemon.name === 'bulbasaur')!;
const move = MOVE_FIXTURE.find(move => move.name === 'tackle')!;
const defender = POKEMON_FIXTURE.find(pokemon => pokemon.name === 'squirtle')!;

describe('RoundComponent', () => {
  let component: RoundComponent;
  let fixture: ComponentFixture<RoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoundComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RoundComponent);
    component = fixture.componentInstance;

    component.matchup = {
      attacker: { ...attacker, move },
      defender,
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('class cests', () => {
    it('raises the correct event on a correct guess', () => {
      component.finishRound
        .pipe(first())
        .subscribe((result: boolean) => expect(result).toBe(true));
      component.guess(TypeEffectiveness.Effective);
    });

    it('raises the correct event on a false guess', () => {
      component.finishRound
        .pipe(first())
        .subscribe((result: boolean) => expect(result).toBe(false));
      component.guess(TypeEffectiveness.NoEffect);
    });
  });

  describe('DOM tests', () => {
    it('displays the name of the attacking pokemon', () => {
      const round: HTMLElement = fixture.nativeElement;
      const attackerName = round.querySelector(
        '.pokemon-container div.pokemon-name > p'
      );

      expect(attackerName?.textContent).toEqual(
        component.matchup.attacker.name
      );
    });

    it('displays the name of the attacking move', () => {
      const round: HTMLElement = fixture.nativeElement;
      const moveName = round.querySelector(
        '.pokemonmove-container .pokemonmove-name'
      );

      expect(moveName?.textContent).toEqual(
        component.matchup.attacker.move.name
      );
    });

    it('displays the name of the defending pokemon', () => {
      const round: HTMLElement = fixture.nativeElement;
      const defenderName = round.querySelectorAll(
        '.pokemon-container div.pokemon-name > p'
      )[1];

      expect(defenderName?.textContent).toEqual(
        component.matchup.defender.name
      );
    });

    describe('decision buttons', () => {
      it('displays four decison buttons', () => {
        const round: HTMLElement = fixture.nativeElement;
        const buttons = round.querySelectorAll('.decisions-container button');
        expect(buttons?.length).toEqual(4);
      });

      it('guesses super effective when first button is clicked', fakeAsync(() => {
        const round: HTMLElement = fixture.nativeElement;
        const button: HTMLButtonElement = round.querySelector(
          '.decisions-container button:first-child'
        ) as HTMLButtonElement;

        const spy = spyOn(component, 'guess');
        button.click();
        tick();

        expect(spy).toHaveBeenCalledWith(TypeEffectiveness.SuperEffective);
      }));

      it('guesses effective when second button is clicked', fakeAsync(() => {
        const round: HTMLElement = fixture.nativeElement;
        const button: HTMLButtonElement = round.querySelector(
          '.decisions-container button:nth-child(2)'
        ) as HTMLButtonElement;

        const spy = spyOn(component, 'guess');
        button.click();
        tick();

        expect(spy).toHaveBeenCalledWith(TypeEffectiveness.Effective);
      }));

      it('guesses not very effective when third button is clicked', fakeAsync(() => {
        const round: HTMLElement = fixture.nativeElement;
        const button: HTMLButtonElement = round.querySelector(
          '.decisions-container button:nth-child(3)'
        ) as HTMLButtonElement;

        const spy = spyOn(component, 'guess');
        button.click();
        tick();

        expect(spy).toHaveBeenCalledWith(TypeEffectiveness.NotVeryEffective);
      }));

      it('guesses no effect when last button is clicked', fakeAsync(() => {
        const round: HTMLElement = fixture.nativeElement;
        const button: HTMLButtonElement = round.querySelector(
          '.decisions-container button:nth-child(4)'
        ) as HTMLButtonElement;

        const spy = spyOn(component, 'guess');
        button.click();
        tick();

        expect(spy).toHaveBeenCalledWith(TypeEffectiveness.NoEffect);
      }));
    });
  });
});
