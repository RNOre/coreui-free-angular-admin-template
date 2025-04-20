import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FilterInterface, PaginationMetaInterface} from "../../interfaces/global";
import {CompanyInterface, TariffInterface, UserInterface} from "../../interfaces/billing";
import {cilCheckAlt, cilX} from "@coreui/icons";
import {DatePipe} from "@angular/common";
import {IconDirective} from "@coreui/icons-angular";
import {TableDirective} from "@coreui/angular";
import {OrderWidgetComponent} from "../order-widget/order-widget.component";
import {Router, RouterLink} from "@angular/router";
import {PaginationDirective} from "../../directives/pagination.directive";

@Component({
  selector: 'app-company',
  imports: [
    DatePipe,
    IconDirective,
    TableDirective,
    OrderWidgetComponent,
    PaginationDirective,
    RouterLink,
  ],
  templateUrl: './company.component.html',
  standalone: true,
  styleUrl: './company.component.scss'
})
export class CompanyComponent implements OnInit {
  meta: PaginationMetaInterface = {
    currentPage: 1,
    perPage: 10,
    currentCount: 0
  };

  companyData!: CompanyInterface[];
  icons = {cilCheckAlt, cilX}

  constructor(private $http: HttpClient, private $router: Router) {
  }

  ngOnInit() {
    this.getCompanyList();
  }

  getCompanyList() {
    const filter: FilterInterface = {
      filter: {
        search: ''
      },
      order: {
        createdAt: 'desc'
      },
      pagination: {
        "limit": this.meta.perPage,
        "offset": (this.meta.currentPage - 1) * this.meta.perPage
      }
    };
    this.$http.post('companies/filter', filter)
      // @ts-ignore
      .subscribe((res: { data: { items: TariffInterface[], total: number } }) => {
        // @ts-ignore
        this.companyData = res.data.items;
        this.meta.totalCount = res.data.total;
        this.meta.currentCount = this.companyData?.length || 0;
      })
  }
  navigateToCompany(id: string) {
    this.$router.navigate(['company', id])
      .then();
  }

  pageChange(page: number) {
    this.meta.currentPage = page;
    this.getCompanyList();
  }
}
