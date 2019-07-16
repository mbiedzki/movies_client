import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {User} from "../user";
import {UserService} from "../user.service";
import {GlobalObjects} from "../../global-objects";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-users-details',
  templateUrl: './users-details.component.html',
  styleUrls: ['./users-details.component.css']
})
export class UsersDetailsComponent implements OnInit {
  userForm = new FormGroup(
    {
      id: new FormControl(),
      name: new FormControl(),
      password: new FormControl(),
      active: new FormControl(),
      roles: new FormControl(),
    });

  user: User = new User();
  isNew: boolean;


  async getUserById(id: string) {
    await this.userService.getUserById(id).then((receivedUser: User) => {
        this.user = receivedUser;
        this.userForm.get('id').setValue(this.user.id);
        this.userForm.get('name').setValue(this.user.name);
        this.userForm.get('active').setValue(this.user.active);
      }
    ).catch(() => {
      this.globalObjects.serverError = true;
    });
  }
  async deleteUserById() {
    await this.userService.deleteUserById(this.user.id).then((receivedObject: any) => {
       console.warn(receivedObject);
      this.globalObjects.deleteSuccessful = true;
      }
    ).catch(() => {
      this.globalObjects.serverError = true;
    });
  }

  async saveUser() {
    this.user.name = this.userForm.get('name').value;
    this.user.password = this.userForm.get('password').value;
    if(this.user.password == null) {
      this.user.password = '';
    }
    this.user.active = this.userForm.get('active').value;
    console.log(this.isNew);
    if(this.isNew==false) {
      this.user.id = this.userForm.get('id').value;
      await this.userService.saveUser(this.user).then((receivedUser: User) => {
          this.user = receivedUser;
          this.userForm.get('id').setValue(this.user.id);
          this.userForm.get('name').setValue(this.user.name);
          this.userForm.get('password').setValue(this.user.password);
          this.userForm.get('active').setValue(this.user.active);
          this.globalObjects.updateSuccessful = true;
        }
      ).catch(() => {
        this.globalObjects.serverError = true;
      });
    } else {
      await this.userService.addUser(this.user).then((receivedUser: User) => {
          this.user = receivedUser;
          this.userForm.get('id').setValue(this.user.id);
          this.userForm.get('name').setValue(this.user.name);
          this.userForm.get('password').setValue(this.user.password);
          this.userForm.get('active').setValue(this.user.active);
          this.globalObjects.updateSuccessful = true;
        }
      ).catch(() => {
        this.globalObjects.serverError = true;
      });
    }
    this.router.navigateByUrl('/users/details/'+this.user.id)
  }

  constructor(
    private userService: UserService,
    private globalObjects: GlobalObjects,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.globalObjects.clearFlags();
    let id = this.route.snapshot.paramMap.get('id');
    if(id != null) {
      this.getUserById(id);
      this.isNew = false;
    } else {
      this.isNew = true;
      console.log(this.isNew);
    }
  }
}
