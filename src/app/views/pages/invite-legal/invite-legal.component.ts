import { Component } from '@angular/core';
import {ButtonDirective, FormControlDirective, FormDirective, FormLabelDirective} from "@coreui/angular";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {env} from "../../../../../env";

@Component({
  selector: 'app-invite-legal',
  imports: [
    FormDirective,
    FormLabelDirective,
    FormControlDirective,
    ButtonDirective,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './invite-legal.component.html',
  standalone: true,
  styleUrl: './invite-legal.component.scss'
})
export class InviteLegalComponent {
  legalInfo = new FormGroup({
    company_name: new FormControl(''),
    inn: new FormControl('')
  })
  constructor(private $http: HttpClient) {
  }
  createLegal(){
    const body = {
      company_name: this.legalInfo.controls.company_name.value,
      inn: this.legalInfo.controls.inn.value,
    }
    this.$http.post(env.host + 'company-create', body)
      .subscribe();
  }
}
