import {Component, Injectable, Input, OnInit, ViewChild} from '@angular/core';
import {User} from "../user";
import {UserService} from "../user.service";
import {GlobalObjects} from "../../global-objects";
import{Router} from "@angular/router";
import {MatPaginator, MatSort, PageEvent} from "@angular/material";
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

  constructor(
    private userService: UserService,
    private globalObjects: GlobalObjects,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getUsersList('', 0, 10)
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
      this.globalObjects.serverError = true;
    });
  }

  getNewPageData(event?:PageEvent) {
    this.getUsersList('', event.pageIndex, event.pageSize)
  }
}
