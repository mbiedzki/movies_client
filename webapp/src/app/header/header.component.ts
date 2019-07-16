import {Component, OnInit, ViewChild} from '@angular/core';
import {GlobalObjects} from "../global-objects";
import {UserService} from "../users/user.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private globalObjects: GlobalObjects, private userService: UserService
  ) { }

  ngOnInit() {
  }
}
