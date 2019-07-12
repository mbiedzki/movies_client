import {Injectable} from "@angular/core";
import {User} from "./user";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
  }
)
export class GlobalObjects {
  //urls
  readonly userByNameUrl = 'http://localhost:8080/users/findOne?name=';
  readonly usersByParamsUrl = 'http://localhost:8080/users';

  //global logged user objects
  loggedUser: User = new User();
  isAdmin: boolean;

  isUserAdmin(user: User) {
    user.roles.forEach(role => {
      if (role.role == 'ROLE_ADMIN') {
        this.isAdmin = true;
      }
    });
  }

  //global params
  loginError: boolean;
  logout: boolean;
  serverError: boolean;
  currentPage: number;
  currentSize: number;
  currentLength: number;

  //global message object
  globalMessage: string;

  //global messages function
  sendMessage(text) {
    return this.globalMessage = text;
  }

  clearMessage() {
    return this.globalMessage = '';
  }

  //global function to create http headers for basic auth
  createHttpOptions(name: string, password: string) {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(name + ':' + password)
      })
    }
  }
  constructor(
    private router: Router
  ) { }
}
