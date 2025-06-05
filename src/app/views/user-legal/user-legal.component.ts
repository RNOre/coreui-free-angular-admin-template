import {Component, OnInit} from '@angular/core';
import {DatePipe, JsonPipe} from "@angular/common";
import {PaginationDirective} from "../../directives/pagination.directive";
import {
  ButtonCloseDirective,
  ButtonDirective,
  FormControlDirective,
  FormSelectDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalToggleDirective,
  TableDirective
} from "@coreui/angular";
import {FilterInterface, PaginationMetaInterface} from "../../interfaces/global";
import {TariffInterface, UserInterface} from "../../interfaces/billing";
import {cilCheckAlt, cilX} from "@coreui/icons";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {env} from "../../../../env";

@Component({
  selector: 'app-user-legal',
  imports: [
    DatePipe,
    PaginationDirective,
    TableDirective,
    ButtonCloseDirective,
    ButtonDirective,
    FormControlDirective,
    FormSelectDirective,
    FormsModule,
    ModalBodyComponent,
    ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalToggleDirective,
    ReactiveFormsModule,
    JsonPipe
  ],
  templateUrl: './user-legal.component.html',
  standalone: true,
  styleUrl: './user-legal.component.scss'
})
export class UserLegalComponent implements OnInit{
  meta: PaginationMetaInterface = {
    currentPage: 1,
    perPage: 10,
    currentCount: 0
  };

  userData!: UserInterface[];
  icons = {cilCheckAlt, cilX}

  newUser = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    birth_date: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    // post: new FormControl('', Validators.required),
    sex: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
  })

  constructor(private $http: HttpClient, private $router: Router) {
  }

  ngOnInit() {
    this.getUserList();
  }

  getUserList() {
    const filter =
      {
        "filter": {
          "search": ""
        },
        "order": {
          "birth_date": "asc",
          "createdAt": "asc",
          "created_at": "asc",
          "deleted_at": "asc",
          "modified_at": "asc",
          "name": "desc",
          "username": "asc"
        },
        pagination: {
          limit: this.meta.perPage,
          offset: (this.meta.currentPage - 1) * this.meta.perPage
        }
      }
    this.$http.post(env.host + 'users/filter', filter)
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

  addUser() {
    this.$http
      .post(env.host + 'user-create', this.newUser.value)
      .subscribe(()=>{
        this.getUserList();
      });
  }

  deleteUser(id: string) {
    this.$http
      .delete(env.host + 'user/' + id)
      .subscribe({
        next: () => this.getUserList()
      });
  }
}
