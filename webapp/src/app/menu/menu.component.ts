import { Component, OnInit } from '@angular/core';
import {GlobalObjects} from "../global-objects";
import {UserService} from "../users/user.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(
    private globalObjects: GlobalObjects,
    private userService: UserService,
  ) { }

  ngOnInit() {
  }

}
