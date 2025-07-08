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
  imports: [ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle, ReactiveFormsModule, FormsModule, JsonPipe, ToastComponent, ToastHeaderComponent, ToastBodyComponent]
})
export class LoginComponent{

  is_visible = false;

  authData = new FormGroup(
    {
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    }
  )

  isSuperAdmin = false;

  constructor(
    private $http: HttpClient,
    private $router: Router
  ) {
  }

  login() {
    if (this.isSuperAdmin) {
      this.$http
    .post<{data:{token: string}}>('auth', this.authData.value)
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
      .post<{data:{token: string}}>(env.host + 'auth', this.authData.value)
      .subscribe({
        next: (res) => {
          localStorage.removeItem('isAdmin');
          localStorage.setItem('token', res.data.token);
          this.$router.navigate([isAdmin()?'home': 'main-legal']).then();
        },
        error: () => {
          this.is_visible = true;
        }
      });
  }
}
