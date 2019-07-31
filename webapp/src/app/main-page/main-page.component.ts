import { Component, OnInit } from '@angular/core';
import {GlobalObjects} from "../global-objects";
import {DirectorsDetailsComponent} from "../_directors/directors-details/directors-details.component";
import {MoviesDetailsComponent} from "../_movies/movies-details/movies-details.component";
import {UsersDetailsComponent} from "../users/users-details/users-details.component";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  constructor(
    private globalObjects: GlobalObjects,
    private directors: DirectorsDetailsComponent,
    private movies: MoviesDetailsComponent,
    private users: UsersDetailsComponent,
  ) {
  }

//get lists for validators
  async ngOnInit() {
    await this.directors.getCurrentDirectorsList();
    await this.movies.getCurrentDirectorsList();
    await this.movies.getCurrentGenresList();
    await this.movies.getCurrentMoviesList();
    await this.users.getCurrentUsersNames();
    this.globalObjects.openInfoSnackBar(this.globalObjects.moviesInDb.length + ' filmów w bazie danych', '')
  }
}
