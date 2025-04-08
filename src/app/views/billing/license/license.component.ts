import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LicenseInterface} from "../../../interfaces/billing";
import {DatePipe, JsonPipe} from "@angular/common";
import {TableDirective} from "@coreui/angular";
import {PaginationComponent} from "../../../widgets/pagination/pagination.component";
import {PaginationMetaInterface} from "../../../interfaces/global";
import {PaginationDirective} from "../../../directives/pagination.directive";

@Component({
  selector: 'app-license',
  imports: [
    JsonPipe,
    TableDirective,
    DatePipe,
    PaginationComponent,
    PaginationDirective
  ],
  templateUrl: './license.component.html',
  standalone: true,
  styleUrl: './license.component.scss'
})
export class LicenseComponent implements OnInit {

  licenseDataCompany: LicenseInterface[] | undefined;
  licenseDataUser: LicenseInterface[] | undefined;
  licenseMetaCompany: PaginationMetaInterface = {
    currentPage: 1,
    perPage: 10,
    currentCount: 0
  };
  licenseMetaUser: PaginationMetaInterface = {
    currentPage: 1,
    perPage: 10,
    currentCount: 0
  };
  tab = 'company';

  constructor(private $http: HttpClient) {
  }

  ngOnInit() {
    this.getLicensesCompany();
    this.getLicensesUser();
  }

  getLicensesCompany() {
    const filter = {
      "filter": {
        "kind": {
          "company": "{}",
        }
      },
      "order": {
        "activatedAt": "asc"
      },
      "pagination": {
        "limit": this.licenseMetaCompany.perPage,
        "offset": (this.licenseMetaCompany.currentPage - 1) * this.licenseMetaCompany.perPage
      }
    }

    this.$http.post<{
      data: { items: LicenseInterface[]; total: number }
    }>('http://82.97.241.8:8083/admin/api/v1/licenses/filter', filter)
      .subscribe(
        (res) => {
          this.licenseDataCompany = res.data?.items;
          this.licenseMetaCompany.totalCount = res.data.total;
          this.licenseMetaCompany.currentCount = this.licenseDataCompany?.length || 0;
        }
      )
  }
  getLicensesUser() {
    const filter = {
      "filter": {
        "kind": {
          "user": "{}"
        }
      },
      "order": {
        "activatedAt": "asc"
      },
      "pagination": {
        "limit": this.licenseMetaUser.perPage,
        "offset": (this.licenseMetaUser.currentPage - 1) * this.licenseMetaUser.perPage
      }
    }

    this.$http.post<{
      data: { items: LicenseInterface[]; total: number }
    }>('http://82.97.241.8:8083/admin/api/v1/licenses/filter', filter)
      .subscribe(
        (res) => {
          this.licenseDataUser = res.data?.items;
          this.licenseMetaUser.totalCount = res.data.total;
          this.licenseMetaUser.currentCount = this.licenseDataUser?.length || 0;
        }
      )
  }

  pageChangeCompany(page: number) {
    this.licenseMetaCompany.currentPage = page;
    this.getLicensesCompany();
  }
  pageChangeUser(page: number) {
    this.licenseMetaUser.currentPage = page;
    this.getLicensesUser();
  }
}
