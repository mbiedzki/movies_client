import {Injectable} from "@angular/core";
import {User} from "./user";

@Injectable({
  providedIn: 'root'
  }
)
export class GlobalObjects {
  readonly  usersByNameUrl = 'http://localhost:8080/users/findOne?name='; // URL to find user by name
  loggedUser: User = new User();
}
