import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {CompanyInterface, LicenseInterface, UserInterface} from "../../../interfaces/billing";
import {FilterInterface, PaginationInterface} from "../../../interfaces/global";
import {filter} from "rxjs";
import {
  AvatarComponent,
  ButtonCloseDirective,
  FormControlDirective,
  FormSelectDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalToggleDirective,
  TableDirective
} from "@coreui/angular";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {OrderInterface} from "../../../interfaces/order";
import {DatePipe, JsonPipe} from "@angular/common";
import {isAdmin} from "../../../core/global";

@Component({
  selector: 'app-company-page',
  imports: [
    FormControlDirective,
    ReactiveFormsModule,
    TableDirective,
    JsonPipe,
    DatePipe,
    AvatarComponent,
    FormSelectDirective,
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalToggleDirective
  ],
  templateUrl: './company-page.component.html',
  standalone: true,
  styleUrl: './company-page.component.scss'
})
export class CompanyPageComponent implements OnInit {

  companyField = new FormGroup({
    name: new FormControl('', [Validators.required]),
    inn: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email])
  })

  userField = new FormGroup({
    avatar: new FormControl(''),
    birth_date: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required]),
    sex: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
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

    this.getCompany();
    this.getUsers();
    this.getLicenses();
  }

  updateCompanyData() {
    this.$http.patch('http://82.97.241.8:8083/api/v1/company-update', this.companyField.value)
      .subscribe((res) => this.getCompany());
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

    this.$http.post<{
      data: { items: LicenseInterface[] }
    }>(isAdmin() ? 'licenses/filter' : 'http://82.97.241.8:8083/api/v1/licenses/filter', filter)
      .subscribe(
        (res) => {
          this.licenseData = res.data.items
        }
      )
  }

  getCompany() {
    this.$http.get<{
      data: CompanyInterface
    }>(this.isLegal() ? 'http://82.97.241.8:8083/api/v1/company/info' : 'company/' + this.company_id)
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.companyField.controls.name.setValue(res.data.name);
            this.companyField.controls.inn.setValue(res.data.inn);
            this.companyField.controls.email.setValue(res.data.email);
          }
        }
      })
  }

  getUsers() {
    const filterUser: FilterInterface = {
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
    this.$http.post<{
      data: { items: UserInterface[], total: number }
    }>(isAdmin() ? 'users/filter' : 'http://82.97.241.8:8083/api/v1/users/filter', filterUser)
      .subscribe({
        next: (res) => {
          this.userData = res.data.items;
        }
      })
  }

  isLegal() {
    return this.route.snapshot.params['id'] === 'legal';
  }

  createUser() {
    let body = {
      ...this.userField.value,
      is_admin: false,
      company_id: isAdmin() ? this.company_id : undefined
    };

    this.$http
      .post(isAdmin() ? 'user-create' : 'http://82.97.241.8:8083/api/v1/user-create', body)
      .subscribe(() => this.getUsers());
  }
}
