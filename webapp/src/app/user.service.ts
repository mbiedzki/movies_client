import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, tap} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {User} from "./user";
import {GlobalObjects} from "./global-objects";
import {Router} from "@angular/router";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class UserService {

  getUserByName(name: string, password: string): Observable<User> {
    const url = `${this.globalObjects.usersByNameUrl}${name}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Basic ' + btoa(name + ':' + password)
      })
    };
    return this.http.get<User>(url, httpOptions).pipe(
      catchError(this.handleError<User>(`getUserByName name=${name}`))
    );
  }
  //error handling by returning empty result
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.globalObjects.loginError = true;
      this.globalObjects.sendMessage('Błędna nazwa użytkownika lub hasło');
      // Returning an empty result.
      console.error(error);
      return of(result as T);
    };
  }
  logOut() {
    this.globalObjects.globalMessage = 'Użytkownik został wylogowany'
    this.globalObjects.loginError = true;
    this.globalObjects.loggedUser = new User();
    this.router.navigateByUrl('login')
  }
  constructor(
    private http: HttpClient, private globalObjects: GlobalObjects, private router: Router
  ) { }
}
