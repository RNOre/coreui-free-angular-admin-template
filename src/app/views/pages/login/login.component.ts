import {Component} from '@angular/core';
import {JsonPipe, NgStyle} from '@angular/common';
import {IconDirective} from '@coreui/icons-angular';
import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  CardGroupComponent,
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective, ToastComponent, ToastHeaderComponent, ToastBodyComponent
} from '@coreui/angular';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {env} from "../../../../../env";
import {isAdmin} from "../../../core/global";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardGroupComponent,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective,
    ReactiveFormsModule,
    FormsModule
    ]
})
export class LoginComponent {

  is_visible = false;

  authData = new FormGroup(
    {
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    }
  )

  email = new FormControl('', [Validators.required, Validators.email]);
  otp = new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(4)]);

  isSuperAdmin = false;
  forgetPass = false;
  step: 0 | 1 | 2 = 0; // 0 - ввод почты, 1 - вод кода, 2 - ввод нового пароля
  showPassword = false;
  newPassword = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(64)]);
  newPasswordRepeat = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(64)]);

  constructor(
    private $http: HttpClient,
    private $router: Router
  ) {
  }

  login() {
    if (this.isSuperAdmin) {
      this.$http
        .post<{ data: { token: string } }>('auth', this.authData.value)
        .subscribe({
          next: (res) => {
            localStorage.setItem('isAdmin', 'true');
            localStorage.setItem('token', res.data.token);
            this.$router.navigate(['home']).then();
          },
          error: () => {
            this.is_visible = true;
          }
        });
      return;
    }
    this.$http
      .post<{ data: { token: string } }>(env.host + 'auth', this.authData.value)
      .subscribe({
        next: (res) => {
          localStorage.removeItem('isAdmin');
          localStorage.setItem('token', res.data.token);
          this.$router.navigate([isAdmin() ? 'home' : 'main-legal']).then();
        },
        error: () => {
          this.is_visible = true;
        }
      });
  }

  sendCode() {
    this.step = 2;
  }

  getCode() {
    this.step = 1;
  }

  updatePassword() {
    //
  }
}
