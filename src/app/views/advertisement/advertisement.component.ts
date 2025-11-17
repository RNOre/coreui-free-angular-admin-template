import {Component, OnInit} from '@angular/core';
import {DatePipe, NgStyle} from "@angular/common";
import {PaginationDirective} from "../../directives/pagination.directive";
import {
  ButtonCloseDirective, ButtonDirective,
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective, FormControlDirective, FormSelectDirective, ModalBodyComponent, ModalComponent,
  ModalHeaderComponent, ModalTitleDirective, ModalToggleDirective,
  TableDirective
} from "@coreui/angular";
import {HttpClient} from "@angular/common/http";
import {AdvInterface} from "../../interfaces/billing";
import {env} from "../../../../env";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-advertisement',
  imports: [
    DatePipe,
    PaginationDirective,
    TableDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormsModule,
    NgStyle,
    ButtonCloseDirective,
    ButtonDirective,
    FormControlDirective,
    FormSelectDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalToggleDirective,
    ReactiveFormsModule
  ],
  templateUrl: './advertisement.component.html',
  styleUrl: './advertisement.component.scss'
})
export class AdvertisementComponent implements OnInit {
  advList: AdvInterface[] = [];

  advItem = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    is_active: new FormControl(true),
    desktop_image_url: new FormControl<File | string>('', Validators.required),
    mobile_image_url: new FormControl<File | string>(''),
    show_in_admins_page: new FormControl(false),
    show_in_landing: new FormControl(false),
    show_in_mobile: new FormControl(false),
  })

  // true - создание, false - редактирование
  advItemType = true;

  constructor(private $http: HttpClient) {
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.$http
      .get<{ data: { items: AdvInterface[], total: number } }>(env.host + 'advertisement')
      .subscribe((res) => {
        this.advList = res.data.items;
      })
  }

  deleteAdv(id: string): void {
    this.$http
      .delete('advertisement/' + id).subscribe(() => this.getData());
  }

  createAdv() {
    const body = new FormData();

    if (this.advItem.controls.name.value) {
      body.append('name', this.advItem.controls.name.value.toString());
    }
    if (this.advItem.controls.description.value) {
      body.append('description', this.advItem.controls.description.value.toString());
    }
    // @ts-ignore
    body.append('show_in_admins_page', this.advItem.controls.show_in_admins_page.value);
    // @ts-ignore
    body.append('show_in_landing', this.advItem.controls.show_in_landing.value);
    // @ts-ignore
    body.append('show_in_mobile', this.advItem.controls.show_in_mobile.value);
    if (this.advItem.controls.desktop_image_url.value) {
      body.append('desktop_image_url', this.advItem.controls.desktop_image_url.value);
    }
    if (this.advItem.controls.mobile_image_url.value) {
      body.append('mobile_image_url', this.advItem.controls.mobile_image_url.value);
    }

    if (this.advItemType)
      this.$http
        .post('advertisement', body)
        .subscribe(() => this.getData());
    else
      this.$http
        .patch('advertisement', body)
        .subscribe(() => this.getData());
  }

  // type: true - desktop, false - mobile
  uploadFile(event: any, type: boolean) {
    const file: File = event?.target.files[0];

    if (file) {
      if (type) {
        this.advItem.controls.desktop_image_url.setValue(file);
      } else {
        this.advItem.controls.mobile_image_url.setValue(file);
      }
    }
  }

  getFileName(type: boolean) {
    if (type) {
      // @ts-ignore
      return this.advItem.controls.desktop_image_url.value?.name || this.advItem.controls.desktop_image_url.value
    } else {
      // @ts-ignore
      return this.advItem.controls.mobile_image_url.value?.name || this.advItem.controls.mobile_image_url.value
    }
  }

  toggleActive(id: string) {
    const value = this.advList.find(el => el.id === id)?.is_active;
    this.$http
      .patch<AdvInterface>('advertisement/' + id, {
        is_active: value
      })
      .subscribe((res) => {
        this.advList.map((el) => {
          if (el.id === id) {
            return {...el, is_active: res.is_active};
          }
          return el;
        })
      })
  }

  editAdv(id: string) {
    this.advItemType = false;
    const currentAdv = this.advList.find(el => el.id === id);
    this.advItem.patchValue({...currentAdv});
  }
}
