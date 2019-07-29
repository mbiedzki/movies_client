import {Component, OnInit} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import {GlobalObjects} from "../../global-objects";
import {ActivatedRoute, Router} from "@angular/router";
import {ErrorStateMatcher, MatDialog, ShowOnDirtyErrorStateMatcher} from "@angular/material";
import {MyErrorStateMatcher} from "../../validators/my-error-state-matcher";
import {Movie} from "../movie";
import {MovieService} from "../movie.service";
import {DirectorService} from "../../_directors/director.service";
import {GenreService} from "../../_genres/genre.service";
import {ServerPage} from "../../http-services/server-page";
import {
  ConfirmationDialogComponent,
  ConfirmDialogModel
} from "../../shared/confirmation-dialog/confirmation-dialog.component";
import {forbiddenNameValidator} from "../../validators/forbidden-name-directive";
import {forbiddenTitleValidator} from "../../validators/forbidden-title.directive";

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
        forbiddenTitleValidator(this.globalObjects.moviesInDb),
      ]),
      director: new FormControl('', [
        Validators.required,
      ]),
      genres: new FormControl('', [
        Validators.required,
      ]),
      year: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{4}'),
        Validators.maxLength(4),
      ]),
      description: new FormControl('', []),
    });
  matcher = new MyErrorStateMatcher();

  movie: Movie = new Movie();
  isNew: boolean = false;
  genresTemporaryArray = [];


  async getMovieById(id: number) {
    await this.movieService.getMovieById(id).then((receivedMovie: Movie) => {
        this.movie = receivedMovie;
        this.movieForm.get('title').setValue(this.movie.title);
        this.movieForm.get('director').setValue(this.movie.director.id);
        this.movieForm.get('year').setValue(this.movie.year);
        for (let i = 0; i < this.movie.genres.length; i++) {
          this.genresTemporaryArray.push(this.movie.genres[i].id);
        }
        this.movieForm.get('genres').setValue(this.genresTemporaryArray);
        this.movieForm.get('description').setValue(this.movie.description);

      }
    ).catch(() => {
      this.globalObjects.serverError = true;
    });
  }

  deleteMovieConfirm(): void {
    const message = `Czy na pewno chesz usunąć ?`;
    const dialogData = new ConfirmDialogModel("Potwierdź", message);
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteMovieById();
      }
    });
  }

  async deleteMovieById() {
    await this.movieService.deleteMovieById(this.movie.id).then((receivedObject: any) => {
        this.globalObjects.clearFlags();
        this.globalObjects.openSnackBar('Film został usunięty', this.movie.title);
        this.router.navigateByUrl('/movies/list')
      }
    ).catch(() => {
      this.globalObjects.serverError = true;
    });
  }

  async saveMovie() {
    //!*********************************************************
    //for new movie create new user with null id
    if (this.isNew == true) {
      this.movie = new Movie();
      this.movie.id = null;
    }
      //get title from form
      this.movie.title = this.movieForm.get('title').value;
      //get director with id received from the form
      for (let i = 0; i < this.globalObjects.directorsInDb.length; i++) {
        if (this.movieForm.get('director').value == this.globalObjects.directorsInDb[i].id) {
          this.movie.director = this.globalObjects.directorsInDb[i];
        }
      }
      //get year from the form
      this.movie.year = this.movieForm.get('year').value;
      //get genres with ids received from the form
      this.genresTemporaryArray = [];
      this.movie.genres = [];
      for (let i = 0; i < this.movieForm.get('genres').value.length; i++) {
        for (let j = 0; j < this.globalObjects.genresInDb.length; j++) {
          if (this.movieForm.get('genres').value[i] == this.globalObjects.genresInDb[j].id) {
            this.movie.genres.push(this.globalObjects.genresInDb[j]);
          }
        }
      }
      //get description from the form
      this.movie.description = this.movieForm.get('description').value;

    //!*********************************************************
    //for new
    if(this.isNew == true) {
      await this.movieService.addMovie(this.movie).then((receivedObject: Movie) => {
          this.movie = receivedObject;
        }
      ).catch(() => {
        this.globalObjects.serverError = true;
      });

    } else {
      //!*********************************************************
      //for update
      await this.movieService.saveMovie(this.movie).then((receivedMovie: Movie) => {
          this.movie = receivedMovie;
        }
      ).catch(() => {
        this.globalObjects.serverError = true;
      });
    }
    //!*********************************************************
    //for both after success
    this.router.navigateByUrl('/movies/list');
    this.globalObjects.openSnackBar('Film został zapisany', this.movie.title)
  }


  async getCurrentDirectorsList() {
    //get size of directors table from server
    await this.directorService.getDirectorsByParams('', '', 0, 10, 'lastName').then((receivedPage: ServerPage) => {
        //set current page and size
        this.globalObjects.currentLength = receivedPage.totalPages;
      }
    ).catch(() => {
      this.globalObjects.serverError = true;
    });
    //get all users
    await this.directorService.getDirectorsByParams('', '', 0, this.globalObjects.currentLength * 10, 'lastName').then((receivedPage: ServerPage) => {
        //write to array of users
        this.globalObjects.directorsInDb = receivedPage.content;
      }
    ).catch(() => {
      this.globalObjects.serverError = true;
    });
  }

  async getCurrentGenresList() {
    //get size of genres table from server
    await this.genreService.getGenresByParams('', 0, 10, 'genreName').then((receivedPage: ServerPage) => {
        //set current page and size
        this.globalObjects.currentLength = receivedPage.totalPages;
      }
    ).catch(() => {
      this.globalObjects.serverError = true;
    });
    //get all users
    await this.genreService.getGenresByParams('', 0, this.globalObjects.currentLength * 10, 'genreName').then((receivedPage: ServerPage) => {
        //write to array of users
        this.globalObjects.genresInDb = receivedPage.content;
      }
    ).catch(() => {
      this.globalObjects.serverError = true;
    });
  }

  async getCurrentMoviesList() {
    //get size of genres table from server
    await this.movieService.getMoviesByParams('', '', '', '', 0, 10, 'title', 'asc').then((receivedPage: ServerPage) => {
        //set current page and size
        this.globalObjects.currentLength = receivedPage.totalPages;
      }
    ).catch(() => {
      this.globalObjects.serverError = true;
    });
    //get all users
    await this.movieService.getMoviesByParams('', '', '', '', 0, this.globalObjects.currentLength * 10, 'title', 'asc').then((receivedPage: ServerPage) => {
        //write to array of users
        this.globalObjects.moviesInDb = receivedPage.content;
      }
    ).catch(() => {
      this.globalObjects.serverError = true;
    });
  }

  updateGlobalObjects() {
    this.globalObjects.currentYear = this.movieForm.get('year').value;
    this.globalObjects.currentTitle = this.movieForm.get('title').value;
  }

  constructor(
    private movieService: MovieService,
    private directorService: DirectorService,
    private genreService: GenreService,
    private globalObjects: GlobalObjects,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) {
  }

  async ngOnInit() {
    await this.getCurrentDirectorsList();
    await this.getCurrentGenresList();
    await this.getCurrentMoviesList();
    this.movieForm.get('title').setValue(this.globalObjects.currentTitle);
    this.movieForm.get('year').setValue(this.globalObjects.currentYear);
    this.movieForm.updateValueAndValidity();
    let id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      await this.getMovieById(parseInt(id));
      this.isNew = false;
    } else {
      this.isNew = true;
    }
  }
}
