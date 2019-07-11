import {Injectable} from "@angular/core";
import {User} from "./user";

@Injectable({
  providedIn: 'root'
  }
)
export class GlobalObjects {
  //url to search user nu name
  readonly  usersByNameUrl = 'http://localhost:8080/users/findOne?name=';

  //global logged user object
  loggedUser: User = new User();

  //global login error object
  loginError: boolean;

  //global message object
  globalMessage: string;
  //global messages function
  sendMessage(text) {
    return this.globalMessage = text;
  }
  clearMessage() {
    return this.globalMessage = '';
  }


}
