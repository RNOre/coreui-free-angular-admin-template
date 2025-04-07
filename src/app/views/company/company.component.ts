import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FilterInterface} from "../../interfaces/global";
import {CompanyInterface, TariffInterface, UserInterface} from "../../interfaces/billing";
import {cilCheckAlt, cilX} from "@coreui/icons";
import {DatePipe} from "@angular/common";
import {IconDirective} from "@coreui/icons-angular";
import {TableDirective} from "@coreui/angular";
import {OrderWidgetComponent} from "../order-widget/order-widget.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-company',
  imports: [
    DatePipe,
    IconDirective,
    TableDirective,
    OrderWidgetComponent,
  ],
  templateUrl: './company.component.html',
  standalone: true,
  styleUrl: './company.component.scss'
})
export class CompanyComponent implements OnInit {
  filter: FilterInterface = {
    filter: {
      search: ''
    },
    order: {
      createdAt: 'asc'
    },
    pagination: {
      limit: 10,
      offset: 0
    }
  };

  companyData!: CompanyInterface[];
  userData!: UserInterface[];
  icons = {cilCheckAlt, cilX}
  tab = 'company';

  constructor(private $http: HttpClient, private $router: Router) {
  }

  ngOnInit() {
    this.getCompanyList();
    this.getUserList();
  }

  getCompanyList() {
    this.$http.post('http://82.97.241.8:8083/admin/api/v1/companies/filter', this.filter)
      // @ts-ignore
      .subscribe((res: { data: { items: TariffInterface[], total: number } }) => {
        // @ts-ignore
        this.companyData = res.data.items;
      })
  }

  getUserList() {
    this.$http.post<{
      data: { items: UserInterface[], total: number }
    }>('http://82.97.241.8:8083/admin/api/v1/users/filter', this.filter)
      .subscribe({
        next: (res) => {
          this.userData = res.data.items;
        }
      })
  }

  navigateToCompany(id: string) {
    this.$router.navigate(['company', id])
      .then();
  }
}
