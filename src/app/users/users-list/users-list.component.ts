import {Component, Injectable, OnInit, ViewChild} from '@angular/core';
import {User} from "../user";
import {UserService} from "../user.service";
import {GlobalObjects} from "../../global-objects";
import {Router} from "@angular/router";
import {MatPaginator, PageEvent} from "@angular/material";
import {ServerPage} from "../../http-services/server-page";

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})

export class UsersListComponent implements OnInit {
  pageEvent: PageEvent;

  public currentList: Array<User>;
  columnsToDisplay: string[] = ['id', 'name'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private userService: UserService,
    public globalObjects: GlobalObjects,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.globalObjects.clearGlobalPaging();
    this.paginator._intl.itemsPerPageLabel = 'Liczba elementów na stronie';
    this.getUsersList('', 0, 10).then()
  }

  async getUsersList(name: string, page: number, size: number) {
    //get user from server
    await this.userService.getUsersByParams(name, page, size).then((receivedUserPage: ServerPage) => {
        this.currentList = receivedUserPage.content;
        //set current page and size
        this.globalObjects.currentPage = page;
        this.globalObjects.currentLength = receivedUserPage.totalElements;
        this.globalObjects.currentSize = size;
        this.router.navigateByUrl('users/list')
      }
    ).catch(() => {
      this.globalObjects.openErrorSnackBar('Nie można pobrać listy użytkowników !', '');
    });
  }

  getNewPageData(event?: PageEvent) {
    this.getUsersList('', event.pageIndex, event.pageSize).then()
  }
}
