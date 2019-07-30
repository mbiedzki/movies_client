import {Component, OnInit} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators
} from "@angular/forms";
import {User} from "../user";
import {UserService} from "../user.service";
import {GlobalObjects} from "../../global-objects";
import {ActivatedRoute, Router} from "@angular/router";
import {Role} from "../role";
import {ErrorStateMatcher, MatDialog, ShowOnDirtyErrorStateMatcher} from "@angular/material";
import {forbiddenNameValidator} from "../../validators/forbidden-name-directive";
import {MyErrorStateMatcher} from "../../validators/my-error-state-matcher";
import {ServerPage} from "../../http-services/server-page";
import {
  ConfirmationDialogComponent,
  ConfirmDialogModel
} from "../../shared/confirmation-dialog/confirmation-dialog.component";

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
        forbiddenNameValidator(this.globalObjects.usersInDb),
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

  async getUserById(id: number) {
    await this.userService.getUserById(id).then((receivedUser: User) => {
        this.user = receivedUser;
        this.userForm.get('name').setValue(this.user.name);
        this.userForm.get('active').setValue(this.user.active);
        this.userForm.get('isAdmin').setValue(this.globalObjects.isUserAdmin(this.user));
      }
    ).catch(() => {
      this.globalObjects.openSnackBar('Nie można pobrać użytkownika!', '');
    });
  }
  deleteUserConfirm(): void {
    const message = `Czy na pewno chesz usunąć ?`;
    const dialogData = new ConfirmDialogModel("Potwierdź", message);
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult) {this.deleteUserById();}
    });
  }

  async deleteUserById() {
      await this.userService.deleteUserById(this.user.id).then((receivedObject: any) => {
          this.globalObjects.openSnackBar('Użytkownik został usunięty', this.user.name);
          this.router.navigateByUrl('/users/list')
        }
      ).catch(() => {
        this.globalObjects.openSnackBar('Nie można usunąć użytkownika !', '');
      });
    await this.getCurrentUsersNames();
    this.userForm.updateValueAndValidity();
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
      this.user.active = this.userForm.get('active').value;
      if (this.userForm.get('isAdmin').value) {
        this.addAdminRole();
      }
      await this.userService.addUser(this.user).then((receivedUser: User) => {
          this.user = receivedUser;
        }
      ).catch(() => {
        this.globalObjects.openSnackBar('Nie można dodać użytkownika !', '');
      });

    } else {

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
        this.globalObjects.openSnackBar('Nie można zapisać użytkownika !', '');
      });
    }
    //*********************************************************
    //for both after success

    this.router.navigateByUrl('/users/list');
    this.globalObjects.openSnackBar('Użytkownik został zapisany', this.user.name)
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
    async getCurrentUsersNames() {
      //get size of users table from server
      await this.userService.getUsersByParams('', 0, 10).then((receivedPage: ServerPage) => {
          //set current page and size
          this.globalObjects.currentLength = receivedPage.totalPages;
        }
      ).catch(() => {
        this.globalObjects.openSnackBar('Nie można pobrać listy użytkowników !', '');
      });
      //get all users
      await this.userService.getUsersByParams('', 0, this.globalObjects.currentLength*10).then((receivedPage: ServerPage) => {
          //write to array of users
        this.globalObjects.usersInDb = receivedPage.content;
        }
      ).catch(() => {
        this.globalObjects.openSnackBar('Nie można pobrać listy użytkowników !', '');
      });
    }

  constructor(
    private userService: UserService,
    private globalObjects: GlobalObjects,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
  ) {
  }

  async ngOnInit() {
    await this.getCurrentUsersNames();
    this.userForm.updateValueAndValidity();
    let id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      await this.getUserById(parseInt(id));
      this.isNew = false;
      this.setUserValidators();
    } else {
      this.isNew = true;
      this.setUserValidators();
    }
  }
}
