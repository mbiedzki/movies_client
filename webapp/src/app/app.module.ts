import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule, HttpInterceptor, HttpRequest} from "@angular/common/http";

import { AppRoutingModule} from './app-routing.module';
import { AppComponent } from './app.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {
  PageEvent, MatIcon, MatInputModule, MatButtonModule, MatCardModule, _MatMenuDirectivesModule,
  MatMenuModule, MatListModule, MatSortModule, MatTableModule, MatPaginatorModule,
} from "@angular/material";

import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { MainPageComponent } from './main-page/main-page.component';
import {HttpInterceptorService} from "./http-services/http-interceptor.service";
import { MenuComponent } from './menu/menu.component';
import { MoviesListComponent } from './movies-list/movies-list.component';
import { MoviesDetailsComponent } from './movies-details/movies-details.component';
import { UsersListComponent } from './users-list/users-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    MatIcon,
    MainPageComponent,
    MenuComponent,
    MoviesListComponent,
    MoviesDetailsComponent,
    UsersListComponent,
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
    MatPaginatorModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
