import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {LoginComponent} from "./login/login.component";
import {MainPageComponent} from "./main-page/main-page.component";
import {UsersListComponent} from "./users/users-list/users-list.component";
import {UsersDetailsComponent} from "./users/users-details/users-details.component";
import {MoviesListComponent} from "./_movies/movies-list/movies-list.component";
import {MoviesDetailsComponent} from "./_movies/movies-details/movies-details.component";

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'main', component: MainPageComponent },
  { path: 'users/list', component: UsersListComponent },
  { path: 'users/details', component: UsersDetailsComponent },
  { path: 'users/details/:id', component: UsersDetailsComponent },
  { path: 'movies/list', component: MoviesListComponent},
  { path: 'movies/details', component: MoviesDetailsComponent},
  { path: 'movies/details/:id', component: MoviesDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
