import {Component, Input, OnInit} from '@angular/core';
import {User} from "../user";
import {UserService} from "../user.service";
import {FormControl, FormGroup} from "@angular/forms";
import {GlobalObjects} from "../global-objects";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  hide = true;
  userName: string;
  userPassword: string;
  parsedUser: User;
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
    this.userName = this.loginForm.get('name').value;
    this.userPassword = this.loginForm.get('password').value;
    this.parsedUser = await this.getUser(this.userName, this.userPassword);
    this.globalObjects.loggedUser = JSON.parse(JSON.stringify(this.parsedUser));
    this.globalObjects.globalMessage = '';
    this.globalObjects.loginError = false;
    this.router.navigateByUrl('main')
  }

  async getUser(name: string, password: string): Promise<User> {
    return await this.userService.getUserByName(name, password).toPromise();
  }
}
