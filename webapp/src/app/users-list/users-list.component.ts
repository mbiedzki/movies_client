import {Component, Injectable, Input, OnInit} from '@angular/core';
import {User} from "../user";
import {UserService} from "../user.service";
import {GlobalObjects} from "../global-objects";
import{Router} from "@angular/router";
import {PageEvent} from "@angular/material";
import {UserPage} from "../user-page";

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

  private currentList: Array<User>;
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
    await this.userService.getUsersByParams(name, page, size).then((receivedUserPage: UserPage) => {
        this.currentList = receivedUserPage.content;
       //set current page and size
        this.globalObjects.currentPage = page;
        this.globalObjects.currentLength = receivedUserPage.totalPages;
        this.globalObjects.currentSize = size;
      this.router.navigateByUrl('users/list')
      }
    ).catch(() => {
      this.globalObjects.serverError = true;
    });
  }

  getServerData(event?:PageEvent) {
    this.getUsersList('', event.pageIndex, event.pageSize)
  }
}
