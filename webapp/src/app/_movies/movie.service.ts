import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalObjects} from "../global-objects";
import {Router} from "@angular/router";
import {Movie} from "./movie";


@Injectable({
  providedIn: 'root'
})
export class MovieService {

  async getMovieById(id: number): Promise<Movie> {
    const url = `${this.globalObjects.movieByIdUrl}${id}`;
    return this.http.get<Movie>(url, this.globalObjects.createHttpOptions(
      this.globalObjects.loggedUser.name, this.globalObjects.loggedUser.password)).toPromise();
  }
  async deleteMovieById(id: number): Promise<any> {
    const url = `${this.globalObjects.movieByIdUrl}${id}`;
    return this.http.delete<any>(url, this.globalObjects.createHttpOptions(
      this.globalObjects.loggedUser.name, this.globalObjects.loggedUser.password)).toPromise();
  }
  async saveMovie(Movie: Movie): Promise<Movie> {
    const url = `${this.globalObjects.movieByIdUrl}${Movie.id}`;
    return this.http.put<Movie>(url, Movie, this.globalObjects.createHttpOptions
    (this.globalObjects.loggedUser.name, this.globalObjects.loggedUser.password)).toPromise();
  }
  async addMovie(Movie: Movie): Promise<Movie> {
    const url = `${this.globalObjects.moviesByParamsUrl}`;
    return this.http.post<Movie>(url, Movie, this.globalObjects.createHttpOptions(
      this.globalObjects.loggedUser.name, this.globalObjects.loggedUser.password)).toPromise();
  }
  async getMoviesByParams(title: string, directorLastName: string, year: string, page: number, size: number, sortBy: string, sortOrder: string): Promise<any> {
    const url = `${this.globalObjects.moviesByParamsUrl}?title=${title}&directorLastName=${directorLastName}&year=${year}&page=${page}&size=${size}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
    return this.http.get(url, this.globalObjects.createHttpOptions(
      this.globalObjects.loggedUser.name, this.globalObjects.loggedUser.password)).toPromise();
  }
  constructor(
    private http: HttpClient, private globalObjects: GlobalObjects, private router: Router
  ) { }
}
