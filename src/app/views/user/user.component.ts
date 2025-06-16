import {Component, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from "@angular/common";
import {PaginationDirective} from "../../directives/pagination.directive";
import {
  ButtonCloseDirective,
  FormControlDirective,
  FormSelectDirective,
  ModalBodyComponent, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ModalToggleDirective,
  TableDirective
} from "@coreui/angular";
import {FilterInterface, PaginationMetaInterface} from "../../interfaces/global";
import {CompanyInterface, TariffInterface, UserInterface} from "../../interfaces/billing";
import {cilCheckAlt, cilX} from "@coreui/icons";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {isAdmin} from "../../core/global";

@Component({
  selector: 'app-user',
  imports: [
    DatePipe,
    PaginationDirective,
    TableDirective,
    ButtonCloseDirective,
    FormControlDirective,
    FormSelectDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ReactiveFormsModule,
    ModalToggleDirective
  ],
  templateUrl: './user.component.html',
  standalone: true,
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit{

  @ViewChild('createUserModal') createUserModal!: ModalComponent;

  meta: PaginationMetaInterface = {
    currentPage: 1,
    perPage: 10,
    currentCount: 0
  };

  userData!: UserInterface[];
  icons = {cilCheckAlt, cilX}

  userField = new FormGroup({
    avatar: new FormControl(''),
    birth_date: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required]),
    sex: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  tariffList: TariffInterface[] | undefined;
  filter = new FormControl('all');

  constructor(private $http: HttpClient, private $router: Router) {
  }

  ngOnInit() {
    this.getUserList();
    // this.getTariffList();
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

  getUserList() {
    const filter: FilterInterface = {
      filter: {
        search: '',
        tariff_id: this.filter.value
      },
      order: {
        createdAt: 'asc'
      },
      pagination: {
        "limit": this.meta.perPage,
        "offset": (this.meta.currentPage - 1) * this.meta.perPage
      }
    };
    this.$http.post('users/filter', filter)
      // @ts-ignore
      .subscribe((res: { data: { items: TariffInterface[], total: number } }) => {
        // @ts-ignore
        this.userData = res.data.items;
        this.meta.totalCount = res.data.total;
        this.meta.currentCount = this.userData?.length || 0;
      })
  }
  navigateToUser(id: string) {
    this.$router.navigate(['user', id])
      .then();
  }

  pageChange(page: number) {
    this.meta.currentPage = page;
    this.getUserList();
  }
  createUser() {
    this.createUserModal.visible = false;
    let body = {
      ...this.userField.value,
      is_admin: false
    };

    this.$http
      .post( 'user-create', body)
      .subscribe(() => this.getUserList());
  }
}
