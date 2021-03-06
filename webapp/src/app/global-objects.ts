import {Injectable} from "@angular/core";
import {User} from "./users/user";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {MatSnackBar, MatSnackBarModule} from "@angular/material";
import {Genre} from "./_genres/genre";
import {Director} from "./_directors/director";
import {Movie} from "./_movies/movie";

@Injectable({
    providedIn: 'root'
  }
)
export class GlobalObjects {
  //TODO: for production all these urls have to be changed to server context
  //urls
  //users
  readonly userByNameUrl = 'http://localhost:8080/findUser?name=';
  readonly userByIdUrl = 'http://localhost:8080/users/';
  readonly usersByParamsUrl = 'http://localhost:8080/users';
  //************************************************************************************************
  //urls
  //directors
  readonly directorByIdUrl = 'http://localhost:8080/directors/';
  readonly directorsByParamsUrl = 'http://localhost:8080/directors';
  //************************************************************************************************
  //urls
  //genres
  readonly genreByIdUrl = 'http://localhost:8080/genres/';
  readonly genresByParamsUrl = 'http://localhost:8080/genres';
  //************************************************************************************************
  //urls
  //movies
  readonly movieByIdUrl = 'http://localhost:8080/movies/';
  readonly moviesByParamsUrl = 'http://localhost:8080/movies';
  //************************************************************************************************

  //global function to create http headers for basic auth
  public createHttpOptions(name: string, password: string) {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(name + ':' + password)
      })
    }
  }
  //************************************************************************************************

  //global logged user objects
  loggedUser: User = new User();
  isAdmin: boolean;
  result: boolean;

  isUserAdmin(user: User) {
    this.result = false;
    user.roles.forEach(role => {
      if (role.role == 'ROLE_ADMIN') {
        this.result = true;
      }
    });
    return this.result;
  }
  //************************************************************************************************

  //global tables for selection and validation
  usersInDb: Array<User> = [];
  genresInDb: Array<Genre> = [];
  directorsInDb: Array<Director> = [];
  moviesInDb: Array<Movie> = [];

  //************************************************************************************************

  //global params and flags

  //for errors
  loginError: boolean = false;
  serverError: boolean = false;
  accessError: boolean = false;

  //for sorting and paging
  currentPage: number = 0;
  currentSize: number = 10;
  currentLength: number = 0;
  currentSortActive: string = '';
  currentSortOrder: string = '';

  //for movies
  filterTitle: string = '';
  filterDirector: string = '';
  filterYear: string = '';
  filterGenreName: string = '';
  currentTitle: string = '';
  currentYear: string = '';
  currentDirector: string;
  currentDescription: string;
  currentGenres: [];

  //for directors
  filterDirFirstName: string = '';
  filterDirLastName: string = '';

  //for genres
  filterGenresGenreName: string = '';

  //global function to clear flags
  public clearAllGlobalParams() {
    this.loginError = false;
    this.accessError = false;
    this.serverError =  false;
    this.currentPage = 0;
    this.currentSize = 10;
    this.currentSortActive = '';
    this.currentSortOrder = '';
    this.filterTitle = '';
    this.filterDirector = '';
    this.filterYear = '';
    this.filterDirFirstName = '';
    this.filterDirLastName = '';
    this.filterGenreName = '';
    this.filterGenresGenreName = '';
    this.currentTitle = '';
    this.currentYear = '';
    this.currentDirector = '';
    this.currentDescription = '';
    this.currentGenres = [];
  }

  public clearGlobalPaging() {
    this.currentPage = 0;
    this.currentSize = 10;
    this.currentSortActive = '';
    this.currentSortOrder = '';
  }

  //global function to clear current movie after saving
  public clearGlobalCurrentMovie() {
    this.currentTitle = '';
    this.currentYear = '';
    this.currentDirector = '';
    this.currentDescription = '';
    this.currentGenres = [];
  }
  //************************************************************************************************

  //snack bar messaging
    public openInfoSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      panelClass: ['my-snack-bar-info'],
    });
  }
  public openErrorSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      panelClass: ['my-snack-bar-error'],
    });
  }

  //************************************************************************************************

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }
}
