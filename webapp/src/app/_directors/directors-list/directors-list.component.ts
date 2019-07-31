import {Component, Injectable, Input, OnInit, ViewChild} from '@angular/core';
import {GlobalObjects} from "../../global-objects";
import{Router} from "@angular/router";
import {MatSort, MatTableDataSource, PageEvent, Sort} from "@angular/material";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DirectorService} from "../director.service";
import {Director} from "../director";

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-directors-list',
  templateUrl: './directors-list.component.html',
  styleUrls: ['./directors-list.component.css']
})

export class DirectorsListComponent implements OnInit {
  pageEvent: PageEvent;
  searchForm = new FormGroup(
    {
      firstName: new FormControl(),
      lastName: new FormControl(),
    });
  public currentList: Array<Director>;
  columnsToDisplay: string[] = ['lastName', 'firstName'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private directorService: DirectorService,
    private globalObjects: GlobalObjects,
    private router: Router,
  ) { }

  async ngOnInit() {
    this.globalObjects.clearGlobalPaging();
    this.searchForm.get('lastName').setValue(this.globalObjects.filterDirLastName);
    this.searchForm.get('firstName').setValue(this.globalObjects.filterDirFirstName);
    await this.getFilteredData();
  }

  async getDirectorsList(directorLastName: string, directorFirstName: string, page: number, size: number, sortBy: string) {
    //get directors from server
    await this.directorService.getDirectorsByParams(directorLastName, directorFirstName, page, size, sortBy).then((receivedObject: any) => {
        this.currentList = receivedObject.content;
        //set current page and size
        this.globalObjects.currentPage = page;
        this.globalObjects.currentLength = receivedObject.totalElements;
        this.globalObjects.currentSize = size;
        this.router.navigateByUrl('directors/list')
      }
    ).catch(() => {
      this.globalObjects.openErrorSnackBar('Nie można pobrać listy reżyserów !', '');
    });
  }

  getNewPageData(event?:PageEvent) {
    this.globalObjects.currentPage = event.pageIndex;
    this.globalObjects.currentSize = event.pageSize;
    this.getDirectorsList(this.globalObjects.filterDirLastName, this.globalObjects.filterDirFirstName,
      this.globalObjects.currentPage, this.globalObjects.currentSize,
      this.globalObjects.currentSortActive)
  }
  getNewSortData(sort: Sort) {
    this.globalObjects.currentSortActive = sort.active;
    this.globalObjects.currentSortOrder = sort.direction;
    this.getDirectorsList(this.globalObjects.filterDirLastName, this.globalObjects.filterDirFirstName, 0,
      this.globalObjects.currentSize, this.globalObjects.currentSortActive)
  }
  getFilteredData() {
    this.globalObjects.filterDirLastName = this.searchForm.get('lastName').value;
    this.globalObjects.filterDirFirstName = this.searchForm.get('firstName').value;
    this.getDirectorsList(this.globalObjects.filterDirLastName, this.globalObjects.filterDirFirstName, 0,
      this.globalObjects.currentSize, this.globalObjects.currentSortActive)
  }
}
