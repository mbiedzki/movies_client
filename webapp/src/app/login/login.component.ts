import {Component, Input, OnInit} from '@angular/core';
import {User} from "../users/user";
import {UserService} from "../users/user.service";
import {FormControl, FormGroup} from "@angular/forms";
import {GlobalObjects} from "../global-objects";
import {Router} from "@angular/router";

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
      //set password for logged user because serves does not send any password
      this.globalObjects.loggedUser.password = this.userPassword;
      //mark if user is admin
      this.globalObjects.isUserAdmin(this.globalObjects.loggedUser);
      //clear login error if it was unsuccessful during login
      this.globalObjects.loginError = false;
      this.router.navigateByUrl('main')
    }
   ).catch(() => {
      this.globalObjects.clearFlags();
      this.globalObjects.loginError = true;
    });
  }
}
