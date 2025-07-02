import {Component, OnInit, signal, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {CompanyInterface, LicenseInterface, TariffInterface, UserInterface} from "../../../interfaces/billing";
import {FilterInterface, PaginationInterface, PaginationMetaInterface} from "../../../interfaces/global";
import {filter} from "rxjs";
import {
  AvatarComponent,
  ButtonCloseDirective,
  FormControlDirective,
  FormSelectDirective,
  ModalBodyComponent,
  ModalComponent, ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalToggleDirective, ProgressComponent,
  TableDirective, ToastBodyComponent, ToastComponent, ToasterComponent, ToastHeaderComponent
} from "@coreui/angular";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {OrderInterface} from "../../../interfaces/order";
import {DatePipe, JsonPipe} from "@angular/common";
import {isAdmin} from "../../../core/global";
import {PaginationDirective} from "../../../directives/pagination.directive";
import {env} from "../../../../../env";

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
    ModalToggleDirective,
    RouterLink,
    PaginationDirective,
    ToasterComponent,
    ToastComponent,
    ToastHeaderComponent,
    ProgressComponent,
    ToastBodyComponent,
    ModalFooterComponent
  ],
  templateUrl: './company-page.component.html',
  standalone: true,
  styleUrl: './company-page.component.scss'
})
export class CompanyPageComponent implements OnInit {

  @ViewChild('createUserModal') createUserModal!: ModalComponent;
  @ViewChild('selectTariffModal') selectTariffModal!: ModalComponent;

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
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    disable: new FormControl(false)
  })

  company_id!: number;
  companyData!: CompanyInterface;
  userData!: UserInterface[];
  licenseData: LicenseInterface[] | undefined;
  tariffList: TariffInterface[] | undefined;
  userMeta: PaginationMetaInterface = {
    currentPage: 1,
    perPage: 10,
    currentCount: 0
  };
  activeTariff = '';
  visible = signal(false);
  percentage = signal(0);
  hasAdmin = false;

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
    this.getTariffList();
  }

  updateCompanyData() {
    if (isAdmin()) {
      this.$http.patch('company-update', {...this.companyField.value, id: this.company_id})
        .subscribe((res) => this.getCompany());
    }else {
      this.$http.patch(env.host + 'company-update', this.companyField.value)
        .subscribe((res) => this.getCompany());
    }
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
    }>(isAdmin() ? 'licenses/filter' : env.host + 'licenses/filter', filter)
      .subscribe(
        (res) => {
          this.licenseData = res.data.items
        }
      )
  }

  getCompany() {
    this.$http.get<{
      data: CompanyInterface
    }>(this.isLegal() ? env.host + 'company/info' : 'company/' + this.company_id)
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
        limit: this.userMeta.perPage,
        offset: (this.userMeta.currentPage - 1) * this.userMeta.perPage
      }
    }
    this.$http.post<{
      data: { items: UserInterface[], total: number }
    }>(isAdmin() ? 'users/filter' : env.host + 'users/filter', filterUser)
      .subscribe({
        next: (res) => {
          this.userData = res.data.items;
          if (this.userData) {
            this.hasAdmin = !!this.userData.find((el) => el.is_admin);
            // this.userData = this.userData.filter((user) => !user.is_admin);
            this.userMeta.totalCount = this.userData.length;
            this.userMeta.currentCount = this.userData.length;
          }
        }
      })
  }

  isLegal() {
    return this.route.snapshot.params['id'] === 'legal';
  }

  createUser() {
    this.createUserModal.visible = false;
    let body = {
      ...this.userField.value,
      is_admin: !this.hasAdmin,
      company_id: isAdmin() ? this.company_id : undefined
    };

    this.$http
      .post(isAdmin() ? 'user-create' : env.host + 'user-create', body)
      .subscribe({
        next: () => this.getUsers(),
        error: () => this.toggleToast()
      });
  }

  deleteUser(id: string) {
    this.$http.delete('user/' + id)
      .subscribe((res) => this.getUsers());
  }

  pageChangeUser(page: number) {
    this.userMeta.currentPage = page;
    this.getUsers();
  }

  get limit() {
    if (this.licenseData)
      return this.licenseData[0].limit
    return 0;
  }

  onTimerChange($event: number) {
    this.percentage.set($event * 25);
  }

  toggleToast() {
    this.visible.update((value) => !value);
  }

  onVisibleChange($event: boolean) {
    this.visible.set($event);
    this.percentage.set(this.visible() ? this.percentage() : 0);
  }

  addLicense() {
    this.selectTariffModal.visible = false;
    this.$http.get<string>(env.host + 'license/payment/' + this.activeTariff)
      .subscribe((res) => {
        const a = document.createElement('a');
        a.href = res;
        a.click();
      });
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
    this.$http.post(env.host + 'tariffs/filter', filter)
      // @ts-ignore
      .subscribe((res: { data: { items: TariffInterface[], total: number } }) => {
        this.tariffList = res.data.items;
      })
  }

  protected readonly isAdmin = isAdmin;
}
