import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {env} from "../../../../../env";
import {ButtonDirective, FormControlDirective, FormDirective, FormLabelDirective} from "@coreui/angular";
import {IconDirective} from "@coreui/icons-angular";
import {cilPlus, cilTrash} from "@coreui/icons";
import {FilterInterface, PaginationMetaInterface} from "../../../interfaces/global";
import {TariffInterface} from "../../../interfaces/billing";
import {NgStyle} from "@angular/common";
import {PaginationDirective} from "../../../directives/pagination.directive";
import {PhoneNumberDirective} from "../../../directives/phone-number.directive";
import {RouterLink} from "@angular/router";

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
    NgStyle,
    PaginationDirective,
    PhoneNumberDirective,
    RouterLink
  ],
  templateUrl: './order-create.component.html',
  standalone: true,
  styleUrl: './order-create.component.scss'
})
export class OrderCreateComponent implements OnInit {
  errorInn = '';
  constructor(private $http: HttpClient) {
  }

  ngOnInit() {
    // this.getTariffs();
  }

  step = 1;

  activeTariff = '';

  order = new FormGroup({
    company_name: new FormControl('', [
      Validators.required
    ]),
    inn: new FormControl('', [
      Validators.required, this.innValidator()
    ]),
    email: new FormControl('', [
      Validators.required, Validators.email
    ]),
    phone: new FormControl('')
  })

  tariffMetaCompany: PaginationMetaInterface = {
    currentPage: 1,
    perPage: 6,
    currentCount: 0
  };
  tariffsData!: TariffInterface[] | undefined;
  userList: { username: string }[] = [{username: ''}];
  icons = {cilPlus, cilTrash};

  successfulCreate = false;

  createOrder() {
    // const body = {
    //   company_name: this.order.controls.company_name.value,
    //   company_info: this.order.controls.email.value,
    //   inn: this.order.controls.inn.value,
    //   tariff_id: this.activeTariff === '1' ? '' : this.activeTariff,
    //   users: [
    //     ...this.userList.map((el) => {
    //       return {
    //         is_admin: true,
    //         username: el.username
    //       }
    //     })
    //   ]
    // }

    this.$http.post(env.host + 'order-create', {
      ...this.order.value
    })
      .subscribe({
        next: () => this.step = 2
      });
  }

  deleteUser(index: number) {
    this.userList.splice(index, 1);
  }

  getTariffs() {
    const filter: FilterInterface = {
      filter: {
        kind: {
          company: "{}"
        }
      },
      order: {
        activatedAt: 'asc'
      },
      pagination: {
        limit: this.tariffMetaCompany.currentPage === 1 ? 5 : 6,
        offset: (this.tariffMetaCompany.currentPage - 1) * this.tariffMetaCompany.perPage
      }
    };
    this.$http.post('tariffs/filter', filter)
      // @ts-ignore
      .subscribe((res: { data: { items: TariffInterface[], total: number } }) => {
        this.tariffsData = res.data.items;
        this.tariffMetaCompany.totalCount = res.data.total + 1;
        if (this.tariffMetaCompany.currentPage === 1)
          this.tariffsData.unshift({
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
        this.tariffMetaCompany.currentCount = this.tariffsData.length;
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

  pageChange(page: number) {
    this.tariffMetaCompany.currentPage = page;
    this.getTariffs();
  }
  innValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (!value) return null; // Пропускаем пустые значения (если нужно, можно добавить Validators.required)

      // Проверяем длину ИНН (10 или 12 цифр)
      const isValidLength = value.length === 10 || value.length === 12;
      if (!isValidLength) return {invalidInnLength: true};

      // Проверяем, что строка состоит только из цифр
      const isNumeric = /^\d+$/.test(value);
      if (!isNumeric) return {invalidInnFormat: true};

      // Дополнительно можно добавить проверку контрольной суммы (см. ниже)
      return null; // Валидация пройдена
    }
  }
}
