import {Component, Injectable, OnInit, ViewChild} from '@angular/core';
import {GlobalObjects} from "../../global-objects";
import {Router} from "@angular/router";
import {MatPaginator, MatSort, PageEvent, Sort} from "@angular/material";
import {Movie} from "../movie";
import {MovieService} from "../movie.service";
import {FormControl, FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.css']
})

export class MoviesListComponent implements OnInit {
  pageEvent: PageEvent;
  searchForm = new FormGroup(
    {
      title: new FormControl(),
      directorLastName: new FormControl(),
      year: new FormControl(),
      genres: new FormControl(),
      genreName: new FormControl(),
    });
  public currentList: Array<Movie>;
  columnsToDisplay: string[] = ['title', 'directorLastName', 'year', 'genres'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private movieService: MovieService,
    private globalObjects: GlobalObjects,
    private router: Router,
  ) {
  }

  async ngOnInit() {
    this.globalObjects.clearGlobalPaging();
    this.paginator._intl.itemsPerPageLabel = 'Liczba elementów na stronie';
    this.searchForm.get('title').setValue(this.globalObjects.filterTitle);
    this.searchForm.get('directorLastName').setValue(this.globalObjects.filterDirector);
    this.searchForm.get('year').setValue(this.globalObjects.filterYear);
    this.searchForm.get('genreName').setValue(this.globalObjects.filterGenreName);
    await this.getFilteredData();
  }

  async getMoviesList(title: string, directorLastName: string, year: string, genreName: string, page: number, size: number, sortBy: string, sortOrder: string) {
    //get user from server
    await this.movieService.getMoviesByParams(title, directorLastName, year, genreName, page, size, sortBy, sortOrder).then((receivedObject: any) => {
        this.currentList = receivedObject.content;
        //set current page and size
        this.globalObjects.currentPage = page;
        this.globalObjects.currentLength = receivedObject.totalElements;
        this.globalObjects.currentSize = size;
        this.router.navigateByUrl('movies/list')
      }
    ).catch(() => {
      this.globalObjects.openErrorSnackBar('Nie można pobrać listy filmów !', '');
    });
  }

  getNewPageData(event?: PageEvent) {
    this.globalObjects.currentPage = event.pageIndex;
    this.globalObjects.currentSize = event.pageSize;
    this.getMoviesList(this.globalObjects.filterTitle, this.globalObjects.filterDirector,
      this.globalObjects.filterYear, this.globalObjects.filterGenreName, this.globalObjects.currentPage, this.globalObjects.currentSize, this.globalObjects.currentSortActive,
      this.globalObjects.currentSortOrder).then();
  }

  getNewSortData(sort: Sort) {
    this.globalObjects.currentSortActive = sort.active;
    this.globalObjects.currentSortOrder = sort.direction;
    this.getMoviesList(this.searchForm.get('title').value, this.searchForm.get('directorLastName').value,
      this.searchForm.get('year').value, this.globalObjects.filterGenreName, 0, this.globalObjects.currentSize, this.globalObjects.currentSortActive,
      this.globalObjects.currentSortOrder).then()
  }

  getFilteredData() {
    this.globalObjects.filterTitle = this.searchForm.get('title').value;
    this.globalObjects.filterDirector = this.searchForm.get('directorLastName').value;
    this.globalObjects.filterYear = this.searchForm.get('year').value;
    this.globalObjects.filterGenreName = this.searchForm.get('genreName').value;
    this.getMoviesList(this.searchForm.get('title').value, this.searchForm.get('directorLastName').value,
      this.searchForm.get('year').value, this.globalObjects.filterGenreName, 0, this.globalObjects.currentSize, this.globalObjects.currentSortActive,
      this.globalObjects.currentSortOrder).then()
  }
}
