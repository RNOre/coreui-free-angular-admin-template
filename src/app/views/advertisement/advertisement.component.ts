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
import {HttpClient, HttpParams} from "@angular/common/http";
import {AdvInterface} from "../../interfaces/billing";
import {env} from "../../../../env";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {PaginationMetaInterface} from "../../interfaces/global";

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
  advMeta: PaginationMetaInterface = {
    currentPage: 1,
    perPage: 10,
    currentCount: 0
  };
  desktopFile!: File;
  mobileFile!: File;

  advItem = new FormGroup({
    name: new FormControl('', Validators.required),
    id: new FormControl(''),
    description: new FormControl(''),
    is_active: new FormControl(true),
    desktop_image_url: new FormControl<string>('', Validators.required),
    mobile_image_url: new FormControl<string>(''),
    show_in_admins_page: new FormControl(false),
    show_in_landing: new FormControl(false),
    show_in_mobile: new FormControl(false),
  })
  filter = new FormControl('all');

  // true - создание, false - редактирование
  advItemType = true;

  constructor(private $http: HttpClient) {
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    let params = new HttpParams();

    switch (this.filter.value) {
      case 'landing':
        params = params.set('show_in_landing', 'true');
        break;
      case 'offer':
        params = params.set('show_in_admins_page', 'true');
        break;
      case 'mobile':
        params = params.set('show_in_mobile', 'true');
        break;
    }

    params = params.set('limit', this.advMeta.perPage.toString());
    params = params.set('offset', ((this.advMeta.currentPage - 1) * this.advMeta.perPage).toString());

    this.$http
      .get<{ data: { items: AdvInterface[], total: number } }>(env.host + 'advertisement', {
        params
      })
      .subscribe((res) => {
        this.advList = res.data.items;
        this.advMeta.totalCount = res.data.total;
        this.advMeta.currentCount = this.advList?.length || 0;
      })
  }

  deleteAdv(id: string): void {
    this.$http
      .delete('advertisement/' + id).subscribe(() => this.getData());
  }

  createAdv() {
    const body = new FormData();

    if (this.advItem.controls.name.value) {
      body.append('name', `"${this.advItem.controls.name.value.toString()}"`);
    }
    if (this.advItem.controls.description.value) {
      body.append('description', `"${this.advItem.controls.description.value.toString()}"`);
    }
    // @ts-ignore
    body.append('show_in_admins_page', this.advItem.controls.show_in_admins_page.value);
    // @ts-ignore
    body.append('show_in_landing', this.advItem.controls.show_in_landing.value);
    // @ts-ignore
    body.append('show_in_mobile', this.advItem.controls.show_in_mobile.value);
    // if (this.advItem.controls.desktop_image_url.value) {
    body.append('desktop_image', this.desktopFile);
    // }
    // if (this.advItem.controls.mobile_image_url.value) {
    body.append('mobile_image', this.mobileFile);
    // }

    if (this.advItemType)
      this.$http
        .post('advertisement', body)
        .subscribe(() => this.getData());
    else {
      if (this.advItem.controls.id.value) {
        body.append('id', `"${this.advItem.controls.id.value.toString()}"`);
      }
      this.$http
        .patch('advertisement', body)
        .subscribe(() => this.getData());
    }
  }

  // type: true - desktop, false - mobile
  uploadFile(event: any, type: boolean) {
    const file: File = event?.target.files[0];
    // const fileName = file.name;

    if (file) {
      if (type) {
        this.advItem.controls.desktop_image_url.setValue(file.name);
        this.desktopFile = file;
      } else {
        this.advItem.controls.mobile_image_url.setValue(file.name);
        this.mobileFile = file;
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
    const body = new FormData();

    body.append('id', `"${id}"`);
    // @ts-ignore
    body.append('is_active', value);

    this.$http
      .patch<AdvInterface>('advertisement', body)
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

  pageChange(page: number) {
    this.advMeta.currentPage = page;
    this.getData();
  }
}
