import {Component, Input, OnInit} from '@angular/core';
import {User} from "../users/user";
import {UserService} from "../users/user.service";
import {FormControl, FormGroup} from "@angular/forms";
import {GlobalObjects} from "../global-objects";
import {Router} from "@angular/router";
import {ServerPage} from "../http-services/server-page";
import {DirectorService} from "../_directors/director.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  //hidden password field
  hide = true;
  userName: string;
  userPassword: string;
  //login form
  loginForm = new FormGroup(
    {
    name: new FormControl(),
    password: new FormControl(),
    });

  constructor(
    private userService: UserService, private globalObjects: GlobalObjects, private router: Router,
    private directorService: DirectorService,
  ) { }

  ngOnInit() {
  }

  async onSubmit() {
    //get user name and password
    this.userName = this.loginForm.get('name').value;
    this.userPassword = this.loginForm.get('password').value;
    //get user from server
    await this.userService.getUserByName(this.userName, this.userPassword).then((receivedUser: User) => {
      this.globalObjects.loggedUser = receivedUser;
      //set password for logged user because serves does not send any password but we need it for basic auth requests
      this.globalObjects.loggedUser.password = this.userPassword;
      //mark if user is admin
      if(this.globalObjects.isUserAdmin(receivedUser)) {
        this.globalObjects.isAdmin = true;
      }
      //clear login error if previous login was unsuccessful
      this.globalObjects.loginError = false;
      this.router.navigateByUrl('main')
    }
   ).catch(() => {
      this.globalObjects.loginError = true;
    });
  }
}
