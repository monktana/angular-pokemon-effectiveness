import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ScoreService } from 'src/app/score/services/score.service';
import { MatchupService } from '../../matchup/services/matchup.service';
import { MainComponent } from '../main.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let matchupServiceSpy: jasmine.SpyObj<MatchupService>;
  let scoreServiceSpy: jasmine.SpyObj<ScoreService>;

  beforeEach(async () => {
    matchupServiceSpy = jasmine.createSpyObj('MatchupService', ['getMatchup']);
    scoreServiceSpy = jasmine.createSpyObj('ScoreService', [
      'get',
      'increase',
      'reset',
    ]);

    TestBed.configureTestingModule({
      declarations: [MainComponent],
      providers: [
        { provide: MatchupService, useValue: matchupServiceSpy },
        { provide: ScoreService, useValue: scoreServiceSpy },
      ],
    });
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('loads two matchups on initialization', fakeAsync(() => {
    component.ngOnInit();
    expect(matchupServiceSpy.getMatchup).toHaveBeenCalledTimes(2);
  }));

  it('loads the score on initialization', fakeAsync(() => {
    component.ngOnInit();
    expect(scoreServiceSpy.get).toHaveBeenCalled();
  }));

  it('can finish a round successfully', () => {
    component.finishRound(true);
    expect(scoreServiceSpy.increase).toHaveBeenCalled();
    expect(matchupServiceSpy.getMatchup).toHaveBeenCalled();
  });

  it('can finish a round unsuccessfully', () => {
    component.finishRound(false);
    expect(scoreServiceSpy.reset).toHaveBeenCalled();
    expect(matchupServiceSpy.getMatchup).not.toHaveBeenCalled();
  });
});
