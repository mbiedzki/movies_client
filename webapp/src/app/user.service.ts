import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, tap} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {User} from "./user";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersByNameUrl = 'http:/localhost:8080/users?name='; // URL to web api

  getUserByName(name: string): Observable<User> {
    const url = `${this.usersByNameUrl}${name}`;
    return this.http.get<User>(url).pipe(
      catchError(this.handleError<User>(`getUserByName name=${name}`))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);

    };
  }
  constructor(
    private http: HttpClient,
  ) { }
}
