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
    // this.$http
    //   .post('auth', this.authData.value)
    //   .subscribe();
    if (this.authData.controls.password.value === 'admin' && this.authData.controls.username.value === 'admin') {
      localStorage.setItem('token', 'true');
      this.$router.navigate(['home']).then();
    }
  }
}
