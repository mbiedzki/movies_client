import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {User} from "../user";
import {UserService} from "../user.service";
import {GlobalObjects} from "../../global-objects";
import {ActivatedRoute, Router} from "@angular/router";
import {Role} from "../role";

@Component({
  selector: 'app-users-details',
  templateUrl: './users-details.component.html',
  styleUrls: ['./users-details.component.css']
})
export class UsersDetailsComponent implements OnInit {
  userForm = new FormGroup(
    {
      name: new FormControl(),
      password: new FormControl(),
      active: new FormControl(),
      isAdmin: new FormControl(),
    });

  user: User = new User();
  isNew: boolean = false;
  roleToBeAdded: Role = new Role();


  async getUserById(id: string) {
    await this.userService.getUserById(id).then((receivedUser: User) => {
        this.user = receivedUser;
        this.userForm.get('name').setValue(this.user.name);
        this.userForm.get('active').setValue(this.user.active);
        this.userForm.get('isAdmin').setValue(this.globalObjects.isUserAdmin(this.user));
      }
    ).catch(() => {
      this.globalObjects.serverError = true;
    });
  }
  async deleteUserById() {
    await this.userService.deleteUserById(this.user.id).then((receivedObject: any) => {
      this.globalObjects.clearFlags();
      this.globalObjects.deleteSuccessful = true;
      this.router.navigateByUrl('/main')
      }
    ).catch(() => {
      this.globalObjects.serverError = true;
    });
  }

  async saveUser() {
    this.user.name = this.userForm.get('name').value;
    this.user.password = this.userForm.get('password').value;
    //if ther was no new password then set empty for api to not change it
    if(this.user.password == null) {
      this.user.password = '';
    }
    //set ROLE_ADMIN if checked in form
    if(this.userForm.get('isAdmin').value) {
      this.addAdminRole();
    } else this.removeAdminRole();
    this.user.active = this.userForm.get('active').value;
    if(this.isNew==false) {
      await this.userService.saveUser(this.user).then((receivedUser: User) => {
          this.user = receivedUser;
          this.userForm.get('name').setValue(this.user.name);
          this.userForm.get('password').setValue(this.user.password);
          this.userForm.get('active').setValue(this.user.active);
        }
      ).catch(() => {
        this.globalObjects.serverError = true;
      });
    } else {
      //if user is new - setup null id and user role
      this.user.id = null;
     this.addUserRole();
      await this.userService.addUser(this.user).then((receivedUser: User) => {
          this.user = receivedUser;
          this.userForm.get('name').setValue(this.user.name);
          this.userForm.get('password').setValue(this.user.password);
          this.userForm.get('active').setValue(this.user.active);
        }
      ).catch(() => {
        this.globalObjects.serverError = true;
      });
    }
    this.router.navigateByUrl('/users/details/'+this.user.id);
    this.globalObjects.clearFlags();
    this.globalObjects.updateSuccessful = true;
    this.globalObjects.openSnackBar('Użytkownik został zapisany', '');
  }

  addUserRole() {
    this.roleToBeAdded.id = 1;
    this.roleToBeAdded.role = 'ROLE_USER';
    if(this.user.roles == null) { this.user.roles = [];}
    this.user.roles.push(this.roleToBeAdded);
  }

  addAdminRole() {
    this.roleToBeAdded.id = 2;
    this.roleToBeAdded.role = 'ROLE_ADMIN';
    if(this.user.roles == null) { this.user.roles = [];}
    this.user.roles.push(this.roleToBeAdded);
  }

  removeAdminRole() {
    this.user.roles = this.user.roles.filter(item => item.role != 'ROLE_ADMIN')
  }

  constructor(
    private userService: UserService,
    private globalObjects: GlobalObjects,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    if(id != null) {
      this.getUserById(id);
      this.isNew = false;
    } else {
      this.isNew = true;
    }
  }
}
