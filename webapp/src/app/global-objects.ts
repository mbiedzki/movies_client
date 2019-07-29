import {Injectable} from "@angular/core";
import {User} from "./users/user";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material";
import {Genre} from "./_genres/genre";
import {Director} from "./_directors/director";
import {Movie} from "./_movies/movie";

@Injectable({
    providedIn: 'root'
  }
)
export class GlobalObjects {
  //urls
  //users
  readonly userByNameUrl = 'http://localhost:8080/users/findOne?name=';
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

  //global tables
  usersInDb: Array<User> = new Array<User>();
  genresInDb: Array<Genre> = new Array<Genre>();
  directorsInDb: Array<Director> = new Array<Director>();
  moviesInDb: Array<Movie> = new Array<Movie>();

  //************************************************************************************************

  //global params and flags
  loginError: boolean = false;
  serverError: boolean = false;
  currentPage: number = 0;
  currentSize: number = 10;
  currentLength: number = 0;
  currentSortActive: string = '';
  currentSortOrder: string = '';

  //for movies
  filterTitle: string = '';
  filterDirector: string = '';
  filterYear: string = '';
  currentTitle: string = '';
  currentYear: string = '';

  //for directors
  filterDirFirstName: string = '';
  filterDirLastName: string = '';

  //for genres
  filterGenreName: string = '';

  //global function to clear flags
  public clearFlags() {
    this.loginError = false;
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
    this.currentTitle = '';
    this.currentYear = '';
  }
  //************************************************************************************************

  //snack bar messaging
  public openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
  //************************************************************************************************

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
  ) { }
}
