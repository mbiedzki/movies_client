import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalObjects} from "../global-objects";
import {Router} from "@angular/router";
import {Genre} from "./genre";


@Injectable({
  providedIn: 'root'
})
export class GenreService {

  async getGenreById(id: number): Promise<Genre> {
    const url = `${this.globalObjects.genreByIdUrl}${id}`;
    return this.http.get<Genre>(url, this.globalObjects.createHttpOptions(
      this.globalObjects.loggedUser.name, this.globalObjects.loggedUser.password)).toPromise();
  }
  async deleteGenreById(id: number): Promise<any> {
    const url = `${this.globalObjects.genreByIdUrl}${id}`;
    return this.http.delete<any>(url, this.globalObjects.createHttpOptions(
      this.globalObjects.loggedUser.name, this.globalObjects.loggedUser.password)).toPromise();
  }
  async saveGenre(Genre: Genre): Promise<Genre> {
    const url = `${this.globalObjects.genreByIdUrl}${Genre.id}`;
    return this.http.put<Genre>(url, Genre, this.globalObjects.createHttpOptions
    (this.globalObjects.loggedUser.name, this.globalObjects.loggedUser.password)).toPromise();
  }
  async addGenre(Genre: Genre): Promise<Genre> {
    const url = `${this.globalObjects.genresByParamsUrl}`;
    return this.http.post<Genre>(url, Genre, this.globalObjects.createHttpOptions(
      this.globalObjects.loggedUser.name, this.globalObjects.loggedUser.password)).toPromise();
  }
  async getGenresByParams(genreName: string, page: number, size: number, sortBy: string): Promise<any> {
    const url = `${this.globalObjects.genresByParamsUrl}?genreName=${genreName}&page=${page}&size=${size}&sortBy=${sortBy}`;
    return this.http.get<any>(url, this.globalObjects.createHttpOptions(
      this.globalObjects.loggedUser.name, this.globalObjects.loggedUser.password)).toPromise();
  }
  constructor(
    private http: HttpClient, private globalObjects: GlobalObjects, private router: Router
  ) { }
}
