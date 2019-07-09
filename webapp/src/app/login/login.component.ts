import {Component, Input, OnInit} from '@angular/core';
import {User} from "../user";
import {UserService} from "../user.service";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  user: User;
  userName: string;
  userPassword: string;
  loginForm = new FormGroup(
    {
    name: new FormControl(),
    password: new FormControl(),
    });

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    this.userName = this.loginForm.get('name').value;
    this.userPassword = this.loginForm.get('password').value;
    this.getUser(this.userName, this.userPassword);
  }

  getUser(name: string, password: string): void {
    this.userService.getUserByName(name, password)
      .subscribe(user => this.user = user);

  }

}
