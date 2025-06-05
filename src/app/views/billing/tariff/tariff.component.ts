import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FilterInterface, PaginationMetaInterface} from "../../../interfaces/global";
import {TariffInterface} from "../../../interfaces/billing";
import {
  ButtonCloseDirective,
  ButtonDirective,
  FormControlDirective,
  FormFloatingDirective,
  FormLabelDirective,
  FormSelectDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalToggleDirective,
  PlaceholderDirective,
  TableDirective,
  TextColorDirective
} from "@coreui/angular";
import {IconDirective} from "@coreui/icons-angular";
import {cilCheckAlt, cilX} from "@coreui/icons";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {DatePipe, JsonPipe, NgStyle} from "@angular/common";
import {getSupportedInputTypes} from "@angular/cdk/platform";
import {Router} from "@angular/router";
import {PaginationDirective} from "../../../directives/pagination.directive";
import {env} from "../../../../../env";

@Component({
  selector: 'app-tariff',
  imports: [
    ButtonDirective,
    IconDirective,
    TableDirective,
    ModalToggleDirective,
    ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalBodyComponent,
    ModalFooterComponent,
    ButtonCloseDirective,
    FormControlDirective,
    FormLabelDirective,
    ReactiveFormsModule,
    FormSelectDirective,
    PlaceholderDirective,
    FormFloatingDirective,
    NgStyle,
    JsonPipe,
    DatePipe,
    PaginationDirective
  ],
  templateUrl: './tariff.component.html',
  standalone: true,
  styleUrl: './tariff.component.scss'
})
export class TariffComponent implements OnInit {
  tariffsDataCompany!: TariffInterface[] | undefined;
  tariffsDataUser!: TariffInterface[] | undefined;
  tariffMetaCompany: PaginationMetaInterface = {
    currentPage: 1,
    perPage: 10,
    currentCount: 0
  };
  tariffMetaUser: PaginationMetaInterface = {
    currentPage: 1,
    perPage: 10,
    currentCount: 0
  };
  baseTariff!: TariffInterface | undefined;

  editedTariffID = '';

  icons = {cilCheckAlt, cilX}

  newTariff = new FormGroup({
    name: new FormControl(''),
    kind: new FormControl(''),
    limit: new FormControl(15),
    period: new FormControl(30),
    price: new FormControl()
  })

  editTariff = new FormGroup({
    name: new FormControl(''),
    kind: new FormControl(''),
    limit: new FormControl(15),
    period: new FormControl(30),
    price: new FormControl()
  })

  tab = 'company';

  constructor(private $http: HttpClient, private $router: Router) {
  }

  ngOnInit() {
    this.getTariffsCompany();
    this.getTariffsUser();
  }

  getDate(date: string) {
    const parseDate = new Date(date);
    if (parseDate) {
      return `${parseDate.getDate().toString().padStart(2, '0')}.${(parseDate.getMonth() + 1).toString().padStart(2, '0')}.${(parseDate.getFullYear())}`
    }
    return '';
  }

  createTariff() {
    this.$http.post('tariff-create', this.newTariff.value)
      .subscribe(() => {
        this.getTariffsCompany();
      });
  }

  getTariffsCompany() {
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
        limit: this.tariffMetaCompany.perPage,
        offset: (this.tariffMetaCompany.currentPage - 1) * this.tariffMetaCompany.perPage
      }
    };
    this.$http.post(env.host +'tariffs/filter', filter)
      // @ts-ignore
      .subscribe((res: { data: { items: TariffInterface[], total: number } }) => {
        this.tariffsDataCompany = res.data.items;
        if (this.tariffsDataCompany?.length) {
          this.tariffMetaCompany.totalCount = res.data.total;
          this.tariffMetaCompany.currentCount = this.tariffsDataCompany.length;
        }
      })
  }

  getTariffsUser() {
    const filter: FilterInterface = {
      filter: {
        kind: {
          user: "{}"
        }
      },
      order: {
        activatedAt: 'asc'
      },
      pagination: {
        limit: this.tariffMetaCompany.perPage,
        offset: (this.tariffMetaCompany.currentPage - 1) * this.tariffMetaCompany.perPage
      }
    };
    this.$http.post('tariffs/filter', filter)
      // @ts-ignore
      .subscribe((res: { data: { items: TariffInterface[], total: number } }) => {
        this.baseTariff = res.data.items?.find((el) => el.id === '0bc810cf-707a-437f-bf72-9f3b8ea9cf72');
        this.tariffsDataUser = res.data.items?.filter((el) => el.id !== '0bc810cf-707a-437f-bf72-9f3b8ea9cf72');
        if (this.tariffsDataUser?.length) {
          this.tariffMetaUser.totalCount = res.data.total;
          this.tariffMetaUser.totalCount--;
          this.tariffMetaUser.currentCount = this.tariffsDataUser.length;
        }
      })
  }

  getTariffItem(id: string) {
    this.editedTariffID = id;
    this.$http.get<{ data: TariffInterface }>('tariff/' + id)
      .subscribe((res) => {
        this.editTariff.controls.name.setValue(res.data.name);
        this.editTariff.controls.period.setValue(res.data.period);
        this.editTariff.controls.kind.setValue(res.data.kind);
        this.editTariff.controls.limit.setValue(res.data.limit);
        this.editTariff.controls.price.setValue(res.data.price)
      })
  }

  updateTariff() {
    const body = {
      ...this.editTariff.value,
      tariff_id: this.editedTariffID
    }
    this.$http.patch<{ data: TariffInterface }>('tariff-update', body)
      .subscribe((res) => {
        this.getTariffsCompany();
        this.getTariffsUser()
      });
  }

  deleteTariff(id: string) {
    this.$http.delete<{ data: TariffInterface }>('tariff/' + id)
      .subscribe((res) => {
        this.getTariffsCompany();
        this.getTariffsUser();
      })
  }

  pageChangeCompany(page: number) {
    this.tariffMetaCompany.currentPage = page;
    this.getTariffsCompany();
  }

  pageChangeUser(page: number) {
    this.tariffMetaUser.currentPage = page;
    this.getTariffsUser();
  }

  protected readonly getSupportedInputTypes = getSupportedInputTypes;
}
