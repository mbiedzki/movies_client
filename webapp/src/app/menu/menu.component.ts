import { Component, OnInit } from '@angular/core';
import {GlobalObjects} from "../global-objects";
import {UserService} from "../user.service";
import {UsersListComponent} from "../users-list/users-list.component";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(
    private globalObjects: GlobalObjects,
    private userService: UserService,
    private usersListComponent: UsersListComponent,
  ) { }

  ngOnInit() {
  }

}
