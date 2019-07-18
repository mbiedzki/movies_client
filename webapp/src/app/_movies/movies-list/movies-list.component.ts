import {Component, Injectable, Input, OnInit, ViewChild} from '@angular/core';
import {GlobalObjects} from "../../global-objects";
import{Router} from "@angular/router";
import {MatSort, MatTableDataSource, PageEvent, Sort} from "@angular/material";
import {Movie} from "../movie";
import {MovieService} from "../movie.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.css']
})

export class MoviesListComponent implements OnInit {
  searchForm = new FormGroup(
    {
      title: new FormControl(),
      directorLastName: new FormControl(),
      year: new FormControl(),
      genres: new FormControl(),
    });
  public currentList: Array<Movie>;
  columnsToDisplay: string[] = ['title', 'directorLastName', 'year', 'genres'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private movieService: MovieService,
    private globalObjects: GlobalObjects,
    private router: Router,
  ) { }

  async ngOnInit() {
    this.globalObjects.clearFlags();
    this.searchForm.get('title').setValue('');
    this.searchForm.get('directorLastName').setValue('');
    this.searchForm.get('year').setValue('');

    await this.getMoviesList('','', '', 0,10, 'title', 'asc');
  }

  async getMoviesList(title: string, directorLastName: string, year: string, page: number, size: number, sortBy: string, sortOrder: string) {
    //get user from server
    await this.movieService.getMoviesByParams(title, directorLastName, year, page, size, sortBy, sortOrder).then((receivedObject: any) => {
        this.currentList = receivedObject.content;
        //set current page and size
        this.globalObjects.currentPage = page;
        this.globalObjects.currentLength = receivedObject.totalPages;
        this.globalObjects.currentSize = size;
        this.router.navigateByUrl('movies/list')
      }
    ).catch(() => {
      this.globalObjects.serverError = true;
    });
  }

  getNewPageData(event?:PageEvent) {
    this.getMoviesList('', '', '', event.pageIndex, event.pageSize, 'title', 'asc')
  }
  getNewSortData(sort: Sort) {
    this.getMoviesList('', '', '', 0, 10, sort.active, sort.direction)
  }
  getFilteredData() {
    this.getMoviesList(this.searchForm.get('title').value, this.searchForm.get('directorLastName').value,
      this.searchForm.get('year').value, 0, 10, 'title', 'asc');
  }
}
