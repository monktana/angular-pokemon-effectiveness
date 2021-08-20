import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { Types } from 'src/app/main/types';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  pokemon: any;

  constructor() {}

  ngOnInit(): void {
    this.pokemon = of([
      {
        name: 'Nidorino',
        types: [
          Types.Poison
        ]
      },
      {
        name: 'Gengar',
        types: [
          Types.Ghost,
          Types.Poison
        ]
      }
    ])
  }
}
