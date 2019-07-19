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
import {Genre} from "../genre";
import {GenreService} from "../../_genres/genre.service";
import {ServerPage} from "../../http-services/server-page";
import {
  ConfirmationDialogComponent,
  ConfirmDialogModel
} from "../../shared/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-genres-details',
  templateUrl: './genres-details.component.html',
  styleUrls: ['./genres-details.component.css'],
  providers: [
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
  ]
})
export class GenresDetailsComponent implements OnInit {

  genreForm = new FormGroup(
    {
      genreName: new FormControl('', [
        Validators.required,])
    });
  matcher = new MyErrorStateMatcher();

  genre: Genre = new Genre();
  isNew: boolean = false;


  async getGenreById(id: number) {
    await this.genreService.getGenreById(id).then((receivedObject: Genre) => {
        this.genre = receivedObject;
        this.genreForm.get('genreName').setValue(this.genre.genreName);
      }
    ).catch(() => {
      this.globalObjects.serverError = true;
    });
  }

  deleteGenreConfirm(): void {
    const message = `Czy na pewno chesz usunąć ?`;
    const dialogData = new ConfirmDialogModel("Potwierdź", message);
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteGenreById();
      }
    });
  }

  async deleteGenreById() {
    await this.genreService.deleteGenreById(this.genre.id).then((receivedObject: any) => {
        this.globalObjects.clearFlags();
        this.globalObjects.openSnackBar('Gatunek został usunięty', this.genre.genreName);
        this.router.navigateByUrl('/genres/list')
      }
    ).catch(() => {
      this.globalObjects.serverError = true;
    });
  }

  async saveGenre() {
    //!*********************************************************
    //for new create new user with null id
    if (this.isNew == true) {
      this.genre = new Genre();
      this.genre.id = null;
    }
    //get genre name from form
    this.genre.genreName = this.genreForm.get('genreName').value;

    //!*********************************************************
    //for new
    if(this.isNew == true) {
      await this.genreService.addGenre(this.genre).then((receivedObject: Genre) => {
          this.genre = receivedObject;
        }
      ).catch(() => {
        this.globalObjects.serverError = true;
      });

    } else {
      //!*********************************************************
      //for update
      await this.genreService.saveGenre(this.genre).then((receivedObject: Genre) => {
          this.genre = receivedObject;
        }
      ).catch(() => {
        this.globalObjects.serverError = true;
      });
    }
    //!*********************************************************
    //for both after success
    this.router.navigateByUrl('/genres/details/' + this.genre.id);
    this.globalObjects.clearFlags();
    this.globalObjects.openSnackBar('Gatunek został zapisany', this.genre.genreName)
  }

  constructor(
    private genreService: GenreService,
    private globalObjects: GlobalObjects,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) {
  }

  async ngOnInit() {
    this.genreForm.updateValueAndValidity();
    let id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      await this.getGenreById(parseInt(id));
      this.isNew = false;
    } else {
      this.isNew = true;
    }
  }
}
