import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {CompanyInterface, LicenseInterface, UserInterface} from "../../../interfaces/billing";
import {FilterInterface, PaginationInterface} from "../../../interfaces/global";
import {filter} from "rxjs";
import {FormControlDirective, TableDirective} from "@coreui/angular";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {OrderInterface} from "../../../interfaces/order";
import {DatePipe, JsonPipe} from "@angular/common";

@Component({
  selector: 'app-company-page',
  imports: [
    FormControlDirective,
    ReactiveFormsModule,
    TableDirective,
    JsonPipe,
    DatePipe
  ],
  templateUrl: './company-page.component.html',
  standalone: true,
  styleUrl: './company-page.component.scss'
})
export class CompanyPageComponent implements OnInit {

  filterUser: FilterInterface = {
    filter: {
      company_id: this.route.snapshot.params['id']
    },
    order: {
      createdAt: 'asc'
    },
    pagination: {
      limit: 10,
      offset: 0
    }
  }

  companyField = new FormGroup({
    name: new FormControl('', [Validators.required]),
    inn: new FormControl('', [Validators.required]),
  })

  company_id!: number;
  companyData!: CompanyInterface;
  userData!: UserInterface[];
  licenseData: LicenseInterface[] | undefined;

  constructor(
    private $http: HttpClient,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.company_id = this.route.snapshot.params['id'];
    // this.$http.post<{
    //   data: {
    //     items: CompanyInterface[]
    //   }
    // }>('http://82.97.241.8:8083/admin/api/v1/companies/filter', this.filterCompany)
    //   .subscribe((res) => {
    //     this.companyData = res.data.items[4];
    //     if (this.companyData) {
    //       this.companyField.controls.name.setValue(this.companyData.name);
    //       this.companyField.controls.inn.setValue(this.companyData.inn)
    //     }
    //   })
    this.getCompany();

    this.$http.post<{
      data: { items: UserInterface[], total: number }
    }>('http://82.97.241.8:8083/admin/api/v1/users/filter', this.filterUser)
      .subscribe({
        next: (res) => {
          this.userData = res.data.items;
        }
      })
    this.getLicenses();
  }

  updateCompanyData() {
    //
  }

  getLicenses() {
    const filter = {
      filter: {
        owner_id: this.route.snapshot.params['id']
      },
      "order": {
        "activatedAt": "asc"
      },
      "pagination": {
        "limit": 10,
        "offset": 0
      }
    }

    this.$http.post<{ data:{items: LicenseInterface[]} }>('http://82.97.241.8:8083/admin/api/v1/licenses/filter', filter)
      .subscribe(
        (res) => {
          this.licenseData = res.data.items
        }
      )
  }

  getCompany() {
    this.$http.get<{ data: CompanyInterface }>('http://82.97.241.8:8083/admin/api/v1/company/' + this.company_id)
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.companyField.controls.name.setValue(res.data.name);
            this.companyField.controls.inn.setValue(res.data.inn)
          }
        }
      })
  }
}
