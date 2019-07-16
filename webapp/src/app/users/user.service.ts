import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "./user";
import {GlobalObjects} from "../global-objects";
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
  async getUserById(id: string): Promise<User> {
    const url = `${this.globalObjects.userByIdUrl}${id}`;
    return this.http.get<User>(url, this.globalObjects.createHttpOptions(
      this.globalObjects.loggedUser.name, this.globalObjects.loggedUser.password)).toPromise();
  }
  async deleteUserById(id: number): Promise<any> {
    const url = `${this.globalObjects.userByIdUrl}${id}`;
    return this.http.delete<any>(url, this.globalObjects.createHttpOptions(
      this.globalObjects.loggedUser.name, this.globalObjects.loggedUser.password)).toPromise();
  }
  async saveUser(user: User): Promise<User> {
    const url = `${this.globalObjects.userByIdUrl}${user.id}`;
    return this.http.put<User>(url, user, this.globalObjects.createHttpOptions
    (this.globalObjects.loggedUser.name, this.globalObjects.loggedUser.password)).toPromise();
  }
  async addUser(user: User): Promise<User> {
    const url = `${this.globalObjects.usersByParamsUrl}`;
    return this.http.post<User>(url, user, this.globalObjects.createHttpOptions(
      this.globalObjects.loggedUser.name, this.globalObjects.loggedUser.password)).toPromise();
  }
  async getUsersByParams(name: string, page: number, length: number): Promise<UserPage> {
    const url = `${this.globalObjects.usersByParamsUrl}?name=${name}&page=${page}&size=${length}`;
    return this.http.get<UserPage>(url, this.globalObjects.createHttpOptions(
      this.globalObjects.loggedUser.name, this.globalObjects.loggedUser.password)).toPromise();
  }

  logOut() {
    this.globalObjects.isAdmin = false;
    this.globalObjects.loggedUser = new User();
    this.globalObjects.clearFlags();
    this.globalObjects.logout = true;
    this.router.navigateByUrl('login')
  }
  constructor(
    private http: HttpClient, private globalObjects: GlobalObjects, private router: Router
  ) { }
}
