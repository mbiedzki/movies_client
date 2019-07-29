import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";

import { AppRoutingModule} from './app-routing.module';
import { AppComponent } from './app.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {
  MatIcon, MatInputModule, MatButtonModule, MatCardModule, _MatMenuDirectivesModule,
  MatMenuModule, MatListModule, MatSortModule, MatTableModule, MatPaginatorModule, MatCheckboxModule,
  MatSnackBarModule, MatSelectModule, MatDialogModule,
} from "@angular/material";

import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { MainPageComponent } from './main-page/main-page.component';
import {HttpInterceptorService} from "./http-services/http-interceptor.service";
import { MenuComponent } from './menu/menu.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { UsersDetailsComponent } from './users/users-details/users-details.component';
import {ForbiddenValidatorDirective} from "./validators/forbidden-name-directive";
import { DirectorsDetailsComponent } from './_directors/directors-details/directors-details.component';
import { GenresDetailsComponent } from './_genres/genres-details/genres-details.component';
import { GenresListComponent } from './_genres/genres-list/genres-list.component';
import { MoviesDetailsComponent } from './_movies/movies-details/movies-details.component';
import { MoviesListComponent } from './_movies/movies-list/movies-list.component';
import {
  ConfirmationDialogComponent,
  ConfirmDialogModel
} from './shared/confirmation-dialog/confirmation-dialog.component';
import { DirectorsListComponent } from './_directors/directors-list/directors-list.component';
import { ForbiddenTitleValidatorDirective } from './validators/forbidden-title.directive';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    MatIcon,
    MainPageComponent,
    MenuComponent,
    UsersListComponent,
    UsersDetailsComponent,
    ForbiddenValidatorDirective,
    DirectorsDetailsComponent,
    GenresDetailsComponent,
    GenresListComponent,
    MoviesDetailsComponent,
    MoviesListComponent,
    ConfirmationDialogComponent,
    DirectorsListComponent,
    ForbiddenTitleValidatorDirective,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    _MatMenuDirectivesModule,
    MatMenuModule,
    MatListModule,
    MatSortModule,
    MatTableModule,
    MatDialogModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatSelectModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpInterceptorService,
    multi: true
  }],
  entryComponents: [
    ConfirmationDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
