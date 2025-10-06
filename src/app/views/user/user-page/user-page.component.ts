import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {LicenseInterface, UserInterface} from "../../../interfaces/billing";
import {PaginationMetaInterface} from "../../../interfaces/global";
import {AvatarComponent, FormControlDirective, FormSelectDirective, TableDirective} from "@coreui/angular";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {DatePipe} from "@angular/common";
import {env} from "../../../../../env";
import {isAdmin} from "../../../core/global";
import {ToastService} from "../../../core/services/toast.service";

@Component({
  selector: 'app-user-page',
  imports: [
    TableDirective,
    ReactiveFormsModule,
    DatePipe,
    FormControlDirective,
    FormSelectDirective,
    AvatarComponent
  ],
  templateUrl: './user-page.component.html',
  standalone: true,
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent implements OnInit {

  user_id!: string;
  licenseData: LicenseInterface[] | undefined;
  userData: UserInterface | undefined;
  meta: PaginationMetaInterface = {
    currentPage: 1,
    perPage: 10,
    currentCount: 0
  };

  isAdmin = localStorage.getItem('isAdmin');

  userField = new FormGroup({
    avatar: new FormControl(''),
    email: new FormControl('', [Validators.email]),
    name: new FormControl(''),
    post: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl('')
  })

  constructor(
    private $http: HttpClient,
    private route: ActivatedRoute,
    private $toast: ToastService
  ) {
  }


  ngOnInit() {
    this.user_id = this.route.snapshot.params['id'];

    this.getUserInfo();

    if (isAdmin())
      this.getLicenses();
  }

  getUserInfo() {
    this.$http.get<{
      data: UserInterface
    }>(this.isAdmin ? 'user/' + this.user_id : env.host + 'user/' + this.user_id)
      // @ts-ignore
      .subscribe((res) => {
        // @ts-ignore
        this.userData = res.data;
        if (this.userData) {
          this.userField.patchValue(this.userData)
        }
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

  updateUserData() {
    this.$http
      .patch(this.isAdmin ? 'user-update' : env.host + 'user-update', {
        ...this.userField.value,
        [isAdmin() ? 'id' : 'user_id']: this.userData?.id,
        password: this.userField.controls.password.value ?? undefined,
      })
      .subscribe(() => {
        this.getUserInfo();
        this.$toast.setToast({
          show: true,
          title: 'Успешно',
          text: 'Данные обновлены'
        })
      });
  }

  loadImage(file: any) {
    const image: File = file?.target.files[0];

    if (image) {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('user_id', this.user_id);

      this.$http
        .post(this.isAdmin ? 'user/photo' : env.host + 'user/photo', formData)
        .subscribe(() => {
          this.getUserInfo();
          this.$toast.setToast({
            show: true,
            title: 'Успешно',
            text: 'Фото обновлено'
          })
        });
    }
  }
}
