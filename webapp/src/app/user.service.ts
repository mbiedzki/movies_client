import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "./user";
import {GlobalObjects} from "./global-objects";
import {Router} from "@angular/router";
import {UserPage} from "./user-page";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  async getUserByName(name: string, password: string): Promise<User> {
    const url = `${this.globalObjects.userByNameUrl}${name}`;
    return this.http.get<User>(url, this.globalObjects.createHttpOptions(name, password)).toPromise();
  }
  async getUsersByParams(name: string, page: number, length: number): Promise<UserPage> {
    const url = `${this.globalObjects.usersByParamsUrl}?name=${name}&page=${page}&size=${length}`;
    return this.http.get<UserPage>(url, this.globalObjects.createHttpOptions(this.globalObjects.loggedUser.name, this.globalObjects.loggedUser.password)).toPromise();
  }

  logOut() {
    this.globalObjects.logout = true;
    this.globalObjects.isAdmin = false;
    this.globalObjects.loggedUser = new User();
    this.router.navigateByUrl('login')
  }
  constructor(
    private http: HttpClient, private globalObjects: GlobalObjects, private router: Router
  ) { }
}
