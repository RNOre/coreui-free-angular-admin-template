import {Component} from '@angular/core';
import {NgStyle} from '@angular/common';
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
  ButtonDirective
} from '@coreui/angular';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {env} from "../../../../../env";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle, ReactiveFormsModule, FormsModule]
})
export class LoginComponent {

  authData = new FormGroup(
    {
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    }
  )

  isSuperAdmin = true;

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
            console.log(localStorage.getItem('token'))
            this.$router.navigate(['home']).then();
          }
        });
      return;
    }
    this.$http
      .post<{data:{token: string}}>(env.host + 'auth', this.authData.value)
      .subscribe({
        next: (res) => {
          localStorage.setItem('token', res.data.token);
          this.$router.navigate(['home']).then();
        }
      });
  }
}
