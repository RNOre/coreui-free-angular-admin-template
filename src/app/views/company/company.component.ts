import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FilterInterface, PaginationMetaInterface} from "../../interfaces/global";
import {CompanyInterface, TariffInterface, UserInterface} from "../../interfaces/billing";
import {cilCheckAlt, cilX} from "@coreui/icons";
import {DatePipe} from "@angular/common";
import {IconDirective} from "@coreui/icons-angular";
import {FormSelectDirective, TableDirective} from "@coreui/angular";
import {OrderWidgetComponent} from "../order-widget/order-widget.component";
import {Router, RouterLink} from "@angular/router";
import {PaginationDirective} from "../../directives/pagination.directive";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-company',
  imports: [
    DatePipe,
    IconDirective,
    TableDirective,
    OrderWidgetComponent,
    PaginationDirective,
    RouterLink,
    FormSelectDirective,
    ReactiveFormsModule,
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
  filter = new FormControl('all');

  companyData!: CompanyInterface[];
  icons = {cilCheckAlt, cilX};
  tariffList: TariffInterface[] | undefined;

  constructor(private $http: HttpClient, private $router: Router) {
  }

  ngOnInit() {
    this.getCompanyList();
    // this.getTariffList();
  }

  getCompanyList() {
    const filter: FilterInterface = {
      filter: {
          tariff_id: this.filter.value
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

  getTariffList() {
    const filter: FilterInterface = {
      filter: {
        kind: {
          company: "{}"
        }
      },
      order: {
        activatedAt: 'asc'
      },
      pagination: {
        limit: 100,
        offset: 0
      }
    };
    this.$http.post('tariffs/filter', filter)
      // @ts-ignore
      .subscribe((res: { data: { items: TariffInterface[], total: number } }) => {
        this.tariffList = res.data.items;
      })
  }
}
