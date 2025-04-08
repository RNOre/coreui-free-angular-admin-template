import {Component, OnInit} from '@angular/core';
import {DatePipe} from "@angular/common";
import {IconDirective} from "@coreui/icons-angular";
import {TableDirective} from "@coreui/angular";
import {OrderWidgetComponent} from "../order-widget/order-widget.component";
import {FilterInterface, PaginationMetaInterface} from "../../interfaces/global";
import {CompanyInterface, TariffInterface, UserInterface} from "../../interfaces/billing";
import {cilCheckAlt, cilX} from "@coreui/icons";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {PaginationDirective} from "../../directives/pagination.directive";

@Component({
  selector: 'app-main-page',
  imports: [
    DatePipe,
    IconDirective,
    TableDirective,
    OrderWidgetComponent,
    PaginationDirective,
  ],
  templateUrl: './main-page.component.html',
  standalone: true,
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent implements OnInit {

  companyData!: CompanyInterface[];
  companyMeta: PaginationMetaInterface = {
    currentPage: 1,
    perPage: 10,
    currentCount: 0
  };
  userData!: UserInterface[];
  userMeta: PaginationMetaInterface = {
    currentPage: 1,
    perPage: 10,
    currentCount: 0
  };
  icons = {cilCheckAlt, cilX}
  tab = 'company';

  constructor(private $http: HttpClient, private $router: Router) {
  }

  ngOnInit() {
    this.getCompanyList();
    this.getUserList();
  }

  getCompanyList() {
    const filter: FilterInterface = {
      filter: {
        search: ''
      },
      order: {
        createdAt: 'asc'
      },
      pagination: {
        limit: this.companyMeta.perPage,
        offset: (this.companyMeta.currentPage - 1) * this.companyMeta.perPage
      }
    };
    this.$http.post('http://82.97.241.8:8083/admin/api/v1/companies/filter', filter)
      // @ts-ignore
      .subscribe((res: { data: { items: TariffInterface[], total: number } }) => {
        // @ts-ignore
        this.companyData = res.data.items;
        if (this.companyData.length) {
          this.companyMeta.totalCount = res.data.total;
          this.companyMeta.currentCount = this.companyData.length;
        }
      })
  }

  pageChangeCompany(page: number) {
    this.companyMeta.currentPage = page;
    this.getCompanyList();
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
        limit: this.userMeta.perPage,
        offset: (this.userMeta.currentPage - 1) * this.userMeta.perPage
      }
    };
    this.$http.post<{
      data: { items: UserInterface[], total: number }
    }>('http://82.97.241.8:8083/admin/api/v1/users/filter', filter)
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

  navigateToCompany(id: string) {
    this.$router.navigate(['company', id])
      .then();
  }
}
