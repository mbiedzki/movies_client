import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, tap} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {User} from "./user";
import {GlobalObjects} from "./global-objects";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class UserService {

  saveLoggedInUser(user: User) {
    this.globalObjects.loggedUser = user;
  }

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

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log error to console
      // Returning an empty result.
      return of(result as T);
    };
  }
  constructor(
    private http: HttpClient, private globalObjects: GlobalObjects
  ) { }
}
