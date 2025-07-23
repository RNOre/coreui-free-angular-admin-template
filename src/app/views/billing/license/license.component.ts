import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LicenseInterface} from "../../../interfaces/billing";
import {DatePipe} from "@angular/common";
import {TableDirective} from "@coreui/angular";
import {PaginationMetaInterface} from "../../../interfaces/global";
import {PaginationDirective} from "../../../directives/pagination.directive";
import {ToastService} from "../../../core/services/toast.service";

@Component({
  selector: 'app-license',
  imports: [
    TableDirective,
    DatePipe,
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

  constructor(private $http: HttpClient, private $toast: ToastService) {
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
    }>('licenses/filter', filter)
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
    }>('licenses/filter', filter)
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

  deleteLicense(id: string) {
    this.$http.delete('company-license', {
      body: {
        company_id: id
      }
    })
      .subscribe(() => {
        const index = this.licenseDataCompany
          ?.findIndex((el) => el.owner_id === id);
        if (index && this.licenseDataCompany) {
          this.licenseDataCompany[index].is_deleted = true;
        }
        this.$toast.setToast({
          show: true,
          title: 'Успешно',
          text: 'Лицензия удалена'
        })
      });
  }
}
