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
import {Director} from "../director";
import {DirectorService} from "../director.service";
import {GenreService} from "../../_genres/genre.service";
import {ServerPage} from "../../http-services/server-page";
import {
  ConfirmationDialogComponent,
  ConfirmDialogModel
} from "../../shared/confirmation-dialog/confirmation-dialog.component";
import {forbiddenTitleValidator} from "../../validators/forbidden-title.directive";
import {forbiddenLastNameValidator} from "../../validators/forbidden-last-name.directive";

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-directors-details',
  templateUrl: './directors-details.component.html',
  styleUrls: ['./directors-details.component.css'],
  providers: [
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
  ]
})
export class DirectorsDetailsComponent implements OnInit {

  directorForm = new FormGroup(
    {
      lastName: new FormControl('', [
        Validators.required,
        forbiddenLastNameValidator(this.globalObjects.directorsInDb),
      ]),
      firstName: new FormControl('', [
        Validators.required,
      ]),
    });
  matcher = new MyErrorStateMatcher();

  director: Director = new Director();
  isNew: boolean = false;


  async getDirectorById(id: number) {
    await this.directorService.getDirectorById(id).then((receivedObject: Director) => {
        this.director = receivedObject;
        this.directorForm.get('lastName').setValue(this.director.lastName);
        this.directorForm.get('firstName').setValue(this.director.firstName);
      }
    ).catch(() => {
      this.globalObjects.openErrorSnackBar('Nie można pobrać danych reżysera !', '')
    });
  }

  deleteDirectorConfirm(): void {
    const message = `Czy na pewno chesz usunąć ?`;
    const dialogData = new ConfirmDialogModel("Potwierdź", message);
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteDirectorById().then();
      }
    });
  }

  async deleteDirectorById() {
    await this.directorService.deleteDirectorById(this.director.id).then((receivedObject: any) => {
        this.globalObjects.openInfoSnackBar('Reżyser został usunięty',
          this.director.firstName + ' ' + this.director.lastName);
        this.router.navigateByUrl('/directors/list')
      }
    ).catch(() => {
      this.globalObjects.openErrorSnackBar('Nie można usunąć reżysera, jest powiązany z co najmniej jednym filmem !', '')
    });
  }

  async saveDirector() {
    //!*********************************************************
    //for new create new user with null id
    if (this.isNew == true) {
      this.director = new Director();
      this.director.id = null;
    }
    //get last and first name from form
    this.director.lastName = this.directorForm.get('lastName').value;
    this.director.firstName = this.directorForm.get('firstName').value;

    //!*********************************************************
    //for new
    if (this.isNew == true) {
      await this.directorService.addDirector(this.director).then((receivedObject: Director) => {
          this.director = receivedObject;
        }
      ).catch(() => {
        this.globalObjects.openErrorSnackBar('Nie można dodać reżysera !', '');
      });

    } else {
      //!*********************************************************
      //for update
      await this.directorService.saveDirector(this.director).then((receivedObject: Director) => {
          this.director = receivedObject;
        }
      ).catch(() => {
        this.globalObjects.openErrorSnackBar('Nie można zapisać reżysera !', '');
      });
    }
    //!*********************************************************
    //for both after success
    await this.router.navigateByUrl('/directors/list');
    this.globalObjects.openInfoSnackBar('Reżyser został zapisany',
      this.director.firstName + ' ' + this.director.lastName)
  }

  async getCurrentDirectorsList() {
    //get size of directors table from server
    await this.directorService.getDirectorsByParams('', '', 0, 10, 'lastName')
      .then((receivedPage: ServerPage) => {
        //set current page and size
        this.globalObjects.currentLength = receivedPage.totalPages;
      }
    ).catch(() => {
      this.globalObjects.openErrorSnackBar('Nie można pobrać listy reżyserów !', '');
    });
    //get all directors
    await this.directorService.getDirectorsByParams('', '', 0,
      this.globalObjects.currentLength * 10, 'lastName').then((receivedPage: ServerPage) => {
        //write to array of directors
        this.globalObjects.directorsInDb = receivedPage.content;
      }
    ).catch(() => {
      this.globalObjects.openErrorSnackBar('Nie można pobrać listy reżyserów !', '');
    });
  }

  constructor(
    private directorService: DirectorService,
    public globalObjects: GlobalObjects,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) {
  }

  async ngOnInit() {
    await this.getCurrentDirectorsList();
    this.directorForm.updateValueAndValidity();
    let id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      await this.getDirectorById(parseInt(id));
      this.isNew = false;
    } else {
      this.isNew = true;
    }
  }
}
