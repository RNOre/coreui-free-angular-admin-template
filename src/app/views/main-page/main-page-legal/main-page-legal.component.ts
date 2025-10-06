import {Component, OnInit} from '@angular/core';
import {AnalysisWidgetComponent} from "../../analysis-widget/analysis-widget.component";
import {FilterInterface, PaginationMetaInterface} from "../../../interfaces/global";
import {UserInterface} from "../../../interfaces/billing";
import {HttpClient} from "@angular/common/http";
import {PaginationDirective} from "../../../directives/pagination.directive";
import {TableDirective} from "@coreui/angular";
import {env} from "../../../../../env";
import {Router} from "@angular/router";

@Component({
  selector: 'app-main-page-legal',
  imports: [
    AnalysisWidgetComponent,
    PaginationDirective,
    TableDirective
  ],
  templateUrl: './main-page-legal.component.html',
  standalone: true,
  styleUrl: './main-page-legal.component.scss'
})
export class MainPageLegalComponent implements OnInit {
  userData!: UserInterface[];
  userMeta: PaginationMetaInterface = {
    currentPage: 1,
    perPage: 10,
    currentCount: 0
  };

  constructor(private $http: HttpClient, private $router: Router) {
  }

  ngOnInit() {
    this.getUserList();
  }

  getUserList() {
    const filter =
      {
        "filter": {
          "search": ""
        },
        "order": {
          "createdAt": "asc",
          "created_at": "asc",
          "deleted_at": "asc",
          "modified_at": "asc",
          "name": "desc",
          "username": "asc"
        },
        pagination: {
          limit: this.userMeta.perPage,
          offset: (this.userMeta.currentPage - 1) * this.userMeta.perPage
        }
      }
    this.$http.post<{
      data: { items: UserInterface[], total: number }
    }>(env.host + 'users/filter', filter)
      .subscribe({
        next: (res) => {
          this.userData = res.data.items;
          if (this.userData.length) {
            this.userMeta.totalCount = res.data.total;
            this.userMeta.currentCount = this.userData.length;
          }
        }
      })
  }

  pageChangeUser(page: number) {
    this.userMeta.currentPage = page;
    this.getUserList();
  }

  navigateToUser(id: string) {
    this.$router.navigate(['user', id])
      .then();
  }
}
