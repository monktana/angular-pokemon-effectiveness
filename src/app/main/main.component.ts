import { Component, OnInit } from '@angular/core';

export enum State {
  Menu,
  Game,
  GameOver
}

/**
 * The sole purpose of the main component is to connect other components with each other.
 * The component itself does not calculate or render anything.
 */
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  state!: State;

  constructor() { }

  ngOnInit(): void {
    this.showMenu();
  }

  public showMenu(): void {
    this.state = State.Menu;
  }

  public startGame(): void {
    this.state = State.Game;
  }

  public get State(): typeof State {
    return State;
  }
}
