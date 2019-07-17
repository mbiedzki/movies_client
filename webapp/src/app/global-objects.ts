import {Injectable} from "@angular/core";
import {User} from "./users/user";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material";

@Injectable({
    providedIn: 'root'
  }
)
export class GlobalObjects {
  //urls
  readonly userByNameUrl = 'http://localhost:8080/users/findOne?name=';
  readonly userByIdUrl = 'http://localhost:8080/users/';
  readonly usersByParamsUrl = 'http://localhost:8080/users';

  //global logged user objects
  loggedUser: User = new User();
  isAdmin: boolean;
  result: boolean;

  isUserAdmin(user: User) {
    this.result = false;
    user.roles.forEach(role => {
      if (role.role == 'ROLE_ADMIN') {
        this.result = true;
      }
    });
    return this.result;
  }

  //global tables
  usersInDb: Array<User> = new Array<User>();

  //global params
  loginError: boolean;
  logout: boolean;
  serverError: boolean;
  updateSuccessful: boolean
  deleteSuccessful: boolean
  currentPage: number;
  currentSize: number;
  currentLength: number;

  //global function to clear flags
  public clearFlags() {
    this.loginError = false;
    this.logout = false;
    this.serverError =  false;
    this.updateSuccessful = false;
    this.deleteSuccessful = false;
  }

  //global function to create http headers for basic auth
  public createHttpOptions(name: string, password: string) {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(name + ':' + password)
      })
    }
  }

  public openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
  ) { }
}
