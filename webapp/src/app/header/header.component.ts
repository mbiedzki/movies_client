import { Component, OnInit } from '@angular/core';
import {GlobalObjects} from "../global-objects";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private globalObjects: GlobalObjects,
  ) { }

  ngOnInit() {
  }
}
