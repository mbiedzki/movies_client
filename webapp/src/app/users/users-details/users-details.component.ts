import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective, NG_VALIDATORS,
  NgForm,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {User} from "../user";
import {UserService} from "../user.service";
import {GlobalObjects} from "../../global-objects";
import {ActivatedRoute, Router} from "@angular/router";
import {Role} from "../role";
import {ErrorStateMatcher, ShowOnDirtyErrorStateMatcher} from "@angular/material";
import {forbiddenNameValidator} from "../../validators/forbidden-name-directive";
import {UsersListComponent} from "../users-list/users-list.component";

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-users-details',
  templateUrl: './users-details.component.html',
  styleUrls: ['./users-details.component.css'],
  providers: [
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
  ]
})
export class UsersDetailsComponent implements OnInit {

  userForm = new FormGroup(
    {
      name: new FormControl('', [
        Validators.required,
        forbiddenNameValidator(['admin', 'user']),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      active: new FormControl(),
      isAdmin: new FormControl(),
    });
  matcher = new MyErrorStateMatcher();

  user: User = new User();
  isNew: boolean = false;
  roleToBeAdded: Role = new Role();
  idToBeFound: number;


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

    //*********************************************************
    //for new user
    if (this.isNew == true) {
      this.user = new User();
      this.user.id = null;
      this.user.roles = [];
      this.addUserRole();
      this.user.name = this.userForm.get('name').value;
      this.user.password = this.userForm.get('password').value;
      if (this.userForm.get('isAdmin').value) {
        this.addAdminRole();
      }
      await this.userService.addUser(this.user).then((receivedUser: User) => {
          this.user = receivedUser;
        }
      ).catch(() => {
        this.globalObjects.serverError = true;
      });

    } else

    //*********************************************************
    //for update
    this.user.name = this.userForm.get('name').value;
    this.user.password = this.userForm.get('password').value;
    //if there was no new password then set empty for api to not change it
    if (this.user.password == null) {
      this.user.password = '';
    }
    this.removeAdminRole();
    if (this.userForm.get('isAdmin').value) {
      this.addAdminRole();
    }
    this.user.active = this.userForm.get('active').value;
    await this.userService.saveUser(this.user).then((receivedUser: User) => {
        this.user = receivedUser;
      }
    ).catch(() => {
      this.globalObjects.serverError = true;
    });

    //*********************************************************
    //for both after success

    this.router.navigateByUrl('/users/details/' + this.user.id);
    this.globalObjects.clearFlags();
    this.globalObjects.updateSuccessful = true;
  }

  addUserRole() {
    this.roleToBeAdded = new Role();
    this.roleToBeAdded.id = 1;
    this.roleToBeAdded.role = 'ROLE_USER';
    this.user.roles.push(this.roleToBeAdded);
  }

  addAdminRole() {
    this.roleToBeAdded = new Role();
    this.roleToBeAdded.id = 2;
    this.roleToBeAdded.role = 'ROLE_ADMIN';
    this.user.roles.push(this.roleToBeAdded);
  }

  removeAdminRole() {
    this.user.roles = this.user.roles.filter(item => item.role != 'ROLE_ADMIN')
  }
  setUserValidators() {
    const passwordControl = this.userForm.get('password');

    if (this.isNew == true) {
      passwordControl.setValidators([Validators.required, Validators.minLength(4)]);
    } else {
      passwordControl.setValidators([Validators.minLength(4)]);
    }
  }

  constructor(
    private userService: UserService,
    private globalObjects: GlobalObjects,
    private route: ActivatedRoute,
    private router: Router,
    private usersListComponent: UsersListComponent,
  ) {
  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.getUserById(id);
      this.isNew = false;
      this.setUserValidators();
    } else {
      this.isNew = true;
      this.setUserValidators();
    }
  }
}
