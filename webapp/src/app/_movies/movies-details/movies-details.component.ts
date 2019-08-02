import {Component, Injectable, OnInit} from '@angular/core';
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
import {forbiddenTitleValidator} from "../../validators/forbidden-title.directive";

@Injectable({
  providedIn: 'root'
})

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
      this.globalObjects.openErrorSnackBar('Nie można pobrać filmu !', '');
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
        this.deleteMovieById().then();
      }
    });
  }

  async deleteMovieById() {
    await this.movieService.deleteMovieById(this.movie.id).then((receivedObject: any) => {
        this.globalObjects.openInfoSnackBar('Film został usunięty', this.movie.title);
        this.router.navigateByUrl('/movies/list')
      }
    ).catch(() => {
      this.globalObjects.openErrorSnackBar('Nie można usunąć filmu !', '');
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
    if (this.isNew == true) {
      await this.movieService.addMovie(this.movie).then((receivedObject: Movie) => {
          this.movie = receivedObject;
        }
      ).catch(() => {
        this.globalObjects.openErrorSnackBar('Nie można dodać filmu !', '');
      });

    } else {
      //!*********************************************************
      //for update
      await this.movieService.saveMovie(this.movie).then((receivedMovie: Movie) => {
          this.movie = receivedMovie;
        }
      ).catch(() => {
        this.globalObjects.openErrorSnackBar('Nie można zapisać filmu !', '');
      });
    }
    //!*********************************************************
    //for both after success
    this.globalObjects.clearGlobalCurrentMovie();
    await this.router.navigateByUrl('/movies/list');
    this.globalObjects.openInfoSnackBar('Film został zapisany', this.movie.title)
  }


  async getCurrentDirectorsList() {
    //get size of directors table from server
    await this.directorService.getDirectorsByParams('', '', 0, 10, 'lastName').then((receivedPage: ServerPage) => {
        //set current page and size
        this.globalObjects.currentLength = receivedPage.totalPages;
      }
    ).catch(() => {
      this.globalObjects.openErrorSnackBar('Nie można pobrać listy reżyserów !', '');
    });
    //get all directors
    await this.directorService.getDirectorsByParams('', '', 0, this.globalObjects.currentLength * 10, 'lastName').then((receivedPage: ServerPage) => {
        //write to array of directors
        this.globalObjects.directorsInDb = receivedPage.content;
      }
    ).catch(() => {
      this.globalObjects.openErrorSnackBar('Nie można pobrać listy reżyserów !', '');
    });
  }

  async getCurrentGenresList() {
    //get size of genres table from server
    await this.genreService.getGenresByParams('', 0, 10, 'genreName').then((receivedPage: ServerPage) => {
        //set current page and size
        this.globalObjects.currentLength = receivedPage.totalPages;
      }
    ).catch(() => {
      this.globalObjects.openErrorSnackBar('Nie można pobrać listy gatunków !', '');
    });
    //get all genres
    await this.genreService.getGenresByParams('', 0, this.globalObjects.currentLength * 10, 'genreName').then((receivedPage: ServerPage) => {
        //write to array of genres
        this.globalObjects.genresInDb = receivedPage.content;
      }
    ).catch(() => {
      this.globalObjects.openErrorSnackBar('Nie można pobrać listy gatunków !', '');
    });
  }

  async getCurrentMoviesList() {
    //get size of movies table from server
    await this.movieService.getMoviesByParams('', '', '', '', 0, 10, 'title', 'asc').then((receivedPage: ServerPage) => {
        //set current page and size
        this.globalObjects.currentLength = receivedPage.totalPages;
      }
    ).catch(() => {
      this.globalObjects.openErrorSnackBar('Nie można pobrać listy filmów !', '');
    });
    //get all movies
    await this.movieService.getMoviesByParams('', '', '', '', 0, this.globalObjects.currentLength * 10, 'title', 'asc').then((receivedPage: ServerPage) => {
        //write to array of movies
        this.globalObjects.moviesInDb = receivedPage.content;
      }
    ).catch(() => {
      this.globalObjects.openErrorSnackBar('Nie można pobrać listy filmów !', '');
    });
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
    let id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      await this.getMovieById(parseInt(id));
      this.isNew = false;
      this.globalObjects.clearGlobalCurrentMovie();
    } else {
      this.isNew = true;
      this.movieForm.get('title').setValue(this.globalObjects.currentTitle);
      this.movieForm.get('year').setValue(this.globalObjects.currentYear);
      this.movieForm.get('director').setValue(this.globalObjects.currentDirector);
      this.movieForm.get('genres').setValue(this.globalObjects.currentGenres);
      this.movieForm.get('description').setValue(this.globalObjects.currentDescription);
      this.movieForm.updateValueAndValidity();
    }
  }
}
