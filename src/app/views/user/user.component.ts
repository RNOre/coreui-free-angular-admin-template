import {Component, OnInit} from '@angular/core';
import {DatePipe} from "@angular/common";
import {PaginationDirective} from "../../directives/pagination.directive";
import {TableDirective} from "@coreui/angular";
import {FilterInterface, PaginationMetaInterface} from "../../interfaces/global";
import {CompanyInterface, TariffInterface, UserInterface} from "../../interfaces/billing";
import {cilCheckAlt, cilX} from "@coreui/icons";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user',
  imports: [
    DatePipe,
    PaginationDirective,
    TableDirective
  ],
  templateUrl: './user.component.html',
  standalone: true,
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit{
  meta: PaginationMetaInterface = {
    currentPage: 1,
    perPage: 10,
    currentCount: 0
  };

  userData!: UserInterface[];
  icons = {cilCheckAlt, cilX}

  constructor(private $http: HttpClient, private $router: Router) {
  }

  ngOnInit() {
    this.getUserList();
  }

  getUserList() {
    const filter: FilterInterface = {
      filter: {
        search: ''
      },
      order: {
        createdAt: 'asc'
      },
      pagination: {
        "limit": this.meta.perPage,
        "offset": (this.meta.currentPage - 1) * this.meta.perPage
      }
    };
    this.$http.post('users/filter', filter)
      // @ts-ignore
      .subscribe((res: { data: { items: TariffInterface[], total: number } }) => {
        // @ts-ignore
        this.userData = res.data.items;
        this.meta.totalCount = res.data.total;
        this.meta.currentCount = this.userData?.length || 0;
      })
  }
  navigateToUser(id: string) {
    this.$router.navigate(['user', id])
      .then();
  }

  pageChange(page: number) {
    this.meta.currentPage = page;
    this.getUserList();
  }
}
