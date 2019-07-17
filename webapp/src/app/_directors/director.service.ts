import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalObjects} from "../global-objects";
import {Router} from "@angular/router";
import {Director} from "./director";

@Injectable({
  providedIn: 'root'
})
export class DirectorService {
  
  async getDirectorById(id: number): Promise<Director> {
    const url = `${this.globalObjects.directorByIdUrl}${id}`;
    return this.http.get<Director>(url, this.globalObjects.createHttpOptions(
      this.globalObjects.loggedUser.name, this.globalObjects.loggedUser.password)).toPromise();
  }
  async deleteDirectorById(id: number): Promise<any> {
    const url = `${this.globalObjects.directorByIdUrl}${id}`;
    return this.http.delete<any>(url, this.globalObjects.createHttpOptions(
      this.globalObjects.loggedUser.name, this.globalObjects.loggedUser.password)).toPromise();
  }
  async saveDirector(Director: Director): Promise<Director> {
    const url = `${this.globalObjects.directorByIdUrl}${Director.id}`;
    return this.http.put<Director>(url, Director, this.globalObjects.createHttpOptions
    (this.globalObjects.loggedUser.name, this.globalObjects.loggedUser.password)).toPromise();
  }
  async addDirector(Director: Director): Promise<Director> {
    const url = `${this.globalObjects.directorsByParamsUrl}`;
    return this.http.post<Director>(url, Director, this.globalObjects.createHttpOptions(
      this.globalObjects.loggedUser.name, this.globalObjects.loggedUser.password)).toPromise();
  }
  async getDirectorsByParams(lastName: string, firstName: string, page: number, size: number, sortBy: string): Promise<any> {
    const url = `${this.globalObjects.directorsByParamsUrl}?lastName=${lastName}&firstName=${firstName}&page=${page}
    &size=${size}&sortBy=${sortBy}`;
    return this.http.get<any>(url, this.globalObjects.createHttpOptions(
      this.globalObjects.loggedUser.name, this.globalObjects.loggedUser.password)).toPromise();
  }
  constructor(
    private http: HttpClient, private globalObjects: GlobalObjects, private router: Router
  ) { }
}
