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
import {Director} from "../director";
import {DirectorService} from "../director.service";
import {GenreService} from "../../_genres/genre.service";
import {ServerPage} from "../../http-services/server-page";
import {
  ConfirmationDialogComponent,
  ConfirmDialogModel
} from "../../shared/confirmation-dialog/confirmation-dialog.component";

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
      this.globalObjects.serverError = true;
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
        this.deleteDirectorById();
      }
    });
  }

  async deleteDirectorById() {
    await this.directorService.deleteDirectorById(this.director.id).then((receivedObject: any) => {
        this.globalObjects.clearFlags();
        this.globalObjects.openSnackBar('Reżyser został usunięty', this.director.firstName+' '+this.director.lastName);
        this.router.navigateByUrl('/directors/list')
      }
    ).catch(() => {
      this.globalObjects.serverError = true;
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
    if(this.isNew == true) {
      await this.directorService.addDirector(this.director).then((receivedObject: Director) => {
          this.director = receivedObject;
        }
      ).catch(() => {
        this.globalObjects.serverError = true;
      });

    } else {
      //!*********************************************************
      //for update
      await this.directorService.saveDirector(this.director).then((receivedObject: Director) => {
          this.director = receivedObject;
        }
      ).catch(() => {
        this.globalObjects.serverError = true;
      });
    }
    //!*********************************************************
    //for both after success
    this.router.navigateByUrl('/directors/details/' + this.director.id);
    this.globalObjects.clearFlags();
    this.globalObjects.openSnackBar('Reżyser został zapisany', this.director.firstName+' '+this.director.lastName)
  }

  constructor(
    private directorService: DirectorService,
    private globalObjects: GlobalObjects,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) {
  }

  async ngOnInit() {
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
