import {Component, Injectable, Input, OnInit, ViewChild} from '@angular/core';
import {GlobalObjects} from "../../global-objects";
import{Router} from "@angular/router";
import {MatPaginator, MatSort, MatTableDataSource, PageEvent, Sort} from "@angular/material";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {GenreService} from "../genre.service";
import {Genre} from "../genre";

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-genres-list',
  templateUrl: './genres-list.component.html',
  styleUrls: ['./genres-list.component.css']
})

export class GenresListComponent implements OnInit {
  pageEvent: PageEvent;
  searchForm = new FormGroup(
    {
      genreName: new FormControl(),
    });
  public currentList: Array<Genre>;
  columnsToDisplay: string[] = ['genreName'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private genreService: GenreService,
    private globalObjects: GlobalObjects,
    private router: Router,
  ) { }

  async ngOnInit() {
    this.globalObjects.clearGlobalPaging();
    this.paginator._intl.itemsPerPageLabel = 'Liczba elementów na stronie';
    this.searchForm.get('genreName').setValue(this.globalObjects.filterGenresGenreName);
    await this.getFilteredData();
  }

  async getGenresList(genreName: string, page: number, size: number, sortBy: string) {
    //get genres from server
    await this.genreService.getGenresByParams(genreName, page, size, sortBy).then((receivedObject: any) => {
        this.currentList = receivedObject.content;
        //set current page and size
        this.globalObjects.currentPage = page;
        this.globalObjects.currentLength = receivedObject.totalElements;
        this.globalObjects.currentSize = size;
        this.router.navigateByUrl('genres/list')
      }
    ).catch(() => {
      this.globalObjects.openErrorSnackBar('Nie można pobrać listy gatunków !', '');
    });
  }

  getNewPageData(event?:PageEvent) {
    this.globalObjects.currentPage = event.pageIndex;
    this.globalObjects.currentSize = event.pageSize;
    this.getGenresList(this.globalObjects.filterGenresGenreName, this.globalObjects.currentPage, this.globalObjects.currentSize,
      this.globalObjects.currentSortActive)
  }
  getNewSortData(sort: Sort) {
    this.globalObjects.currentSortActive = sort.active;
    this.globalObjects.currentSortOrder = sort.direction;
    this.getGenresList(this.globalObjects.filterGenresGenreName,0,
      this.globalObjects.currentSize, this.globalObjects.currentSortActive)
  }
  getFilteredData() {
    this.globalObjects.filterGenresGenreName = this.searchForm.get('genreName').value;
    this.getGenresList(this.globalObjects.filterGenresGenreName, 0,
      this.globalObjects.currentSize, this.globalObjects.currentSortActive)
  }
}
