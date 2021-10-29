import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundscoreComponent } from './roundscore.component';

describe('RoundscoreComponent', () => {
  let component: RoundscoreComponent;
  let fixture: ComponentFixture<RoundscoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundscoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundscoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
