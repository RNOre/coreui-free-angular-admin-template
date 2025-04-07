import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {env} from "../../../../../env";
import {ButtonDirective, FormControlDirective, FormDirective, FormLabelDirective} from "@coreui/angular";
import {IconDirective} from "@coreui/icons-angular";
import {cilPlus, cilTrash} from "@coreui/icons";
import {FilterInterface} from "../../../interfaces/global";
import {TariffInterface} from "../../../interfaces/billing";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-order-create',
  imports: [
    FormsModule,
    FormDirective,
    FormLabelDirective,
    FormControlDirective,
    ReactiveFormsModule,
    ButtonDirective,
    IconDirective,
    NgStyle
  ],
  templateUrl: './order-create.component.html',
  standalone: true,
  styleUrl: './order-create.component.scss'
})
export class OrderCreateComponent implements OnInit {
  constructor(private $http: HttpClient) {
  }

  ngOnInit() {
    this.getTariffs();
  }

  step = 1;

  activeTariff = '';

  order = new FormGroup({
    company_name: new FormControl('', [
      Validators.required
    ]),
    company_info: new FormControl('', [
      Validators.required
    ]),
    inn: new FormControl('', [
      Validators.required
    ]),
  })

  filter: FilterInterface = {
    filter: {
      search: ''
    },
    order: {
      activatedAt: 'asc'
    },
    pagination: {
      limit: 10,
      offset: 0
    }
  };
  tariffsData!: TariffInterface[] | undefined;
  userList: { username: string }[] = [{username: ''}];
  icons = {cilPlus, cilTrash};

  successfulCreate = false;

  createOrder() {
    const body = {
      company_name: this.order.controls.company_name.value,
      company_info: this.order.controls.company_info.value,
      inn: this.order.controls.inn.value,
      tariff_id: this.activeTariff === '1'? '' : this.activeTariff,
      users: [
        ...this.userList.map((el) => {
          return {
            is_admin: true,
            username: el.username
          }
        })
      ]
    }

    this.$http.post('http://82.97.241.8:8083/api/v1/order-create', body)
      .subscribe({
        next: () => this.step = 3
      });
  }

  deleteUser(index: number) {
    this.userList.splice(index, 1);
  }

  getTariffs() {
    this.$http.post('http://82.97.241.8:8083/admin/api/v1/tariffs/filter', this.filter)
      // @ts-ignore
      .subscribe((res: { data: { items: TariffInterface[], total: number } }) => {
        this.tariffsData = res.data.items;
        this.tariffsData.push({
          id: '1',
          created_at: '',
          deleted_at: null,
          is_deleted: false,
          is_free: true,
          kind: "company",
          limit: 0,
          name: "Собственный",
          period: 0,
          price: 0,
          extra: 'Если вы не нашли подходящий тариф, мы с вами свяжемся'
        })
      })
  }

  getContainerWidth() {
    switch (this.step) {
      case 1: {
        return '480px';
      }
      case 2: {
        return '700px';
      }
      case 3: {
        return '350px';
      }
      default:
        return '700px'
    }
  }
}
