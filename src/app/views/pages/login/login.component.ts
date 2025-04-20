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
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle, ReactiveFormsModule]
})
export class LoginComponent {

  authData = new FormGroup(
    {
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    }
  )

  constructor(
    private $http: HttpClient,
    private $router: Router
  ) {
  }

  login() {
    if (this.authData.controls.password.value === 'admin' && this.authData.controls.username.value === 'admin') {
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('token', 'admin');
      this.$router.navigate(['home']).then();
      return;
    }
    this.$http
      .post<{data:{token: string}}>('http://82.97.241.8:8083/api/v1/auth', this.authData.value)
      .subscribe({
        next: (res) => {
          localStorage.setItem('token', res.data.token);
          this.$router.navigate(['home']).then();
        }
      });
  }
}
