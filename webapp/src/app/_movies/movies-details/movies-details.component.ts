import {Component, OnInit} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import {GlobalObjects} from "../../global-objects";
import {ActivatedRoute, Router} from "@angular/router";
import {ErrorStateMatcher, ShowOnDirtyErrorStateMatcher} from "@angular/material";
import {MyErrorStateMatcher} from "../../validators/my-error-state-matcher";
import {Movie} from "../movie";
import {Director} from "../../_directors/director";
import {MovieService} from "../movie.service";
import {DirectorService} from "../../_directors/director.service";
import {GenreService} from "../../_genres/genre.service";

@Component({
  selector: 'app-movies-details',
  templateUrl: './movies-details.component.html',
  styleUrls: ['./movies-details.component.css'],
  providers: [
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
  ]
})
export class MoviesDetailsComponent implements OnInit {

  movieForm = new FormGroup(
    {
      title: new FormControl('', [
        Validators.required,
      ]),
      director: new FormControl('', [
        Validators.required,
      ]),
      genres: new FormControl('', [
        Validators.required,
      ]),
      year: new FormControl('', [
        Validators.required,
      ]),
      description: new FormControl('', [
      ]),
    });
  matcher = new MyErrorStateMatcher();

  movie: Movie = new Movie();
  isNew: boolean = false;
  directorToBeAdded: Director = new Director();

  async getMovieById(id: number) {
    await this.movieService.getMovieById(id).then((receivedMovie: Movie) => {
        this.movie = receivedMovie;
        this.movieForm.get('title').setValue(this.movie.title);
        this.movieForm.get('director').setValue(this.movie.director);
        this.movieForm.get('year').setValue(this.movie.year);
        this.movieForm.get('genres').setValue(this.movie.genres);
        this.movieForm.get('description').setValue(this.movie.description);

      }
    ).catch(() => {
      this.globalObjects.serverError = true;
    });
  }

  /*async deleteUserById() {
    if(confirm('Czy chcesz usunąć użytkownika : ' + this.user.name)) {
      await this.userService.deleteUserById(this.user.id).then((receivedObject: any) => {
          this.globalObjects.clearFlags();
          this.globalObjects.openSnackBar('Użytkownik został usunięty', this.user.name);
          this.router.navigateByUrl('/users/list')
        }
      ).catch(() => {
        this.globalObjects.serverError = true;
      });
    } else {

    }
    await this.getCurrentUsersNames();
    this.userForm.updateValueAndValidity();
  }

  async saveUser() {

    //!*********************************************************
    //for new user
    if (this.isNew == true) {
      this.user = new User();
      this.user.id = null;
      this.user.roles = [];
      this.addUserRole();
      this.user.name = this.userForm.get('name').value;
      this.user.password = this.userForm.get('password').value;
      if (this.userForm.get('isAdmin').value) {
        this.addAdminRole();
      }
      await this.userService.addUser(this.user).then((receivedUser: User) => {
          this.user = receivedUser;
        }
      ).catch(() => {
        this.globalObjects.serverError = true;
      });

    } else

    //!*********************************************************
    //for update
      this.user.name = this.userForm.get('name').value;
    this.user.password = this.userForm.get('password').value;
    //if there was no new password then set empty for api to not change it
    if (this.user.password == null) {
      this.user.password = '';
    }
    this.removeAdminRole();
    if (this.userForm.get('isAdmin').value) {
      this.addAdminRole();
    }
    this.user.active = this.userForm.get('active').value;
    await this.userService.saveUser(this.user).then((receivedUser: User) => {
        this.user = receivedUser;
      }
    ).catch(() => {
      this.globalObjects.serverError = true;
    });

    //!*********************************************************
    //for both after success

    this.router.navigateByUrl('/users/details/' + this.user.id);
    this.globalObjects.clearFlags();
    this.globalObjects.openSnackBar('Użytkownik został zapisany', this.user.name)
  }




  async getCurrentUsersNames() {
    //get size of users table from server
    await this.userService.getUsersByParams('', 0, 10).then((receivedUserPage: UserPage) => {
        //set current page and size
        this.globalObjects.currentLength = receivedUserPage.totalPages;
      }
    ).catch(() => {
      this.globalObjects.serverError = true;
    });
    //get all users
    await this.userService.getUsersByParams('', 0, this.globalObjects.currentLength*10).then((receivedUserPage: UserPage) => {
        //write to array of users
        this.globalObjects.usersInDb = receivedUserPage.content;
      }
    ).catch(() => {
      this.globalObjects.serverError = true;
    });
  }*/

  constructor(
    private movieService: MovieService,
    private directorService: DirectorService,
    private genreService: GenreService,
    private globalObjects: GlobalObjects,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  async ngOnInit() {
    //await this.getCurrentUsersNames();
    //this.movieForm.updateValueAndValidity();
    let id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      await this.getMovieById(parseInt(id));
      this.isNew = false;
    } else {
      this.isNew = true;
    }
  }
}
