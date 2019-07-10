import { Component, OnInit } from '@angular/core';
import {GlobalObjects} from "../global-objects";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  constructor(
    private globalObjects: GlobalObjects,
  ) { }

  ngOnInit() {
  }
}
