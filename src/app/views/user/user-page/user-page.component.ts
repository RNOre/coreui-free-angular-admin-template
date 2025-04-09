import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {LicenseInterface, TariffInterface, UserInterface} from "../../../interfaces/billing";
import {FilterInterface, PaginationMetaInterface} from "../../../interfaces/global";
import {FormControlDirective, FormSelectDirective, TableDirective} from "@coreui/angular";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-user-page',
  imports: [
    TableDirective,
    ReactiveFormsModule,
    DatePipe,
    FormControlDirective,
    FormSelectDirective
  ],
  templateUrl: './user-page.component.html',
  standalone: true,
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent implements OnInit {

  user_id!: number;
  licenseData: LicenseInterface[] | undefined;
  userData: UserInterface | undefined;
  meta: PaginationMetaInterface = {
    currentPage: 1,
    perPage: 10,
    currentCount: 0
  };

  userField = new FormGroup({
    birth_date: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required]),
    sex: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required])
  })

  constructor(private $http: HttpClient, private route: ActivatedRoute) {
  }


  ngOnInit() {
    this.user_id = this.route.snapshot.params['id'];

    this.getUserInfo();

    this.getLicenses();
  }

  getUserInfo() {
    const filter: FilterInterface = {
      filter: {
        id: this.user_id
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
        this.userData = res.data.items[2];
        if (this.userData) {
          this.userField.controls.name.setValue(this.userData.name)
          this.userField.controls.username.setValue(this.userData.username)
          this.userField.controls.birth_date.setValue(this.userData.birth_date)
          this.userField.controls.sex.setValue(this.userData.sex)
          this.userField.controls.email.setValue(this.userData.email)
        }
        this.meta.totalCount = res.data.total;
      })
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
      data: { items: LicenseInterface[], total: number }
    }>('licenses/filter', filter)
      .subscribe(
        (res) => {
          this.licenseData = res.data.items;
          this.meta.totalCount = res.data.total;
          this.meta.currentCount = this.licenseData?.length || 0;
        }
      )
  }

  pageChange(page: number) {
    this.meta.currentPage = page;
    this.getLicenses();
  }

  updateUserData() {
    this.$http
      .patch('user-update', {
        ...this.userField.value
      })
      .subscribe();
  }
}
