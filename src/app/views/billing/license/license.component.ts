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

  licenseData: LicenseInterface[] | undefined;
  licenseMeta: PaginationMetaInterface = {
    currentPage: 1,
    perPage: 10,
    currentCount: 0
  };
  tab = 'company';

  constructor(private $http: HttpClient) {
  }

  ngOnInit() {
    this.getLicenses();
  }

  getLicenses() {
    const filter = {
      "filter": {
        "search": "",
        "status": {
          "company": "{}",
          "user": "{}"
        }
      },
      "order": {
        "activatedAt": "asc"
      },
      "pagination": {
        "limit": this.licenseMeta.perPage,
        "offset": (this.licenseMeta.currentPage - 1) * this.licenseMeta.perPage
      }
    }

    this.$http.post<{
      data: { items: LicenseInterface[]; total: number }
    }>('http://82.97.241.8:8083/admin/api/v1/licenses/filter', filter)
      .subscribe(
        (res) => {
          this.licenseData = res.data?.items;
          this.licenseMeta.totalCount = res.data.total;
          this.licenseMeta.currentCount = this.licenseData?.length || 0;
        }
      )
  }

  pageChange(page: number) {
    console.log(page);
    this.licenseMeta.currentPage = page;

    this.getLicenses();
  }
}
