import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FilterInterface} from "../../../interfaces/global";
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
    DatePipe
  ],
  templateUrl: './tariff.component.html',
  standalone: true,
  styleUrl: './tariff.component.scss'
})
export class TariffComponent implements OnInit {
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
  total!: number | undefined;
  baseTariff!: TariffInterface | undefined;

  editedTariffID = '';

  icons = {cilCheckAlt, cilX}

  newTariff = new FormGroup({
    name: new FormControl(''),
    kind: new FormControl(''),
    limit: new FormControl(15),
    period: new FormControl(30)
  })

  editTariff = new FormGroup({
    name: new FormControl(''),
    kind: new FormControl(''),
    limit: new FormControl(15),
    period: new FormControl(30)
  })

  tab = 'company';

  constructor(private $http: HttpClient, private $router: Router) {
  }

  ngOnInit() {
    this.getTariffs();
  }

  getDate(date: string) {
    const parseDate = new Date(date);
    if (parseDate) {
      return `${parseDate.getDate().toString().padStart(2, '0')}.${(parseDate.getMonth() + 1).toString().padStart(2, '0')}.${(parseDate.getFullYear())}`
    }
    return '';
  }

  createTariff() {
    const body = {
      kind: this.newTariff.controls?.kind?.value,
      limit: this.newTariff.controls?.limit?.value,
      name: this.newTariff.controls?.name?.value,
      period: this.newTariff.controls?.period.value
    }

    this.$http.post('http://82.97.241.8:8083/admin/api/v1/tariff-create', body)
      .subscribe(() => {
        this.getTariffs();
      });
  }

  getTariffs() {
    this.$http.post('http://82.97.241.8:8083/admin/api/v1/tariffs/filter', this.filter)
      // @ts-ignore
      .subscribe((res: { data: { items: TariffInterface[], total: number } }) => {
        this.baseTariff = res.data.items?.find((el)=>el.id === '0bc810cf-707a-437f-bf72-9f3b8ea9cf72');
        this.tariffsData = res.data.items?.filter((el)=>el.id !== '0bc810cf-707a-437f-bf72-9f3b8ea9cf72');
        this.total = res?.data.total
      })
  }
  getTariffItem(id: string) {
    this.editedTariffID = id;
    this.$http.get<{ data: TariffInterface }>('http://82.97.241.8:8083/admin/api/v1/tariff/' + id)
      .subscribe((res)=>{
        this.editTariff.controls.name.setValue(res.data.name);
        this.editTariff.controls.period.setValue(res.data.period);
        this.editTariff.controls.kind.setValue(res.data.kind);
        this.editTariff.controls.limit.setValue(res.data.limit);
      })
  }
  updateTariff() {
    const body = {
      ...this.editTariff.value,
      tariff_id: this.editedTariffID
    }
    this.$http.patch<{ data: TariffInterface }>('http://82.97.241.8:8083/admin/api/v1/tariff-update', body)
      .subscribe((res)=>{
        this.getTariffs();
      });
  }

  deleteTariff(id: string) {
    this.$http.delete<{ data: TariffInterface }>('http://82.97.241.8:8083/admin/api/v1/tariff/' + id)
      .subscribe((res) => {
        this.getTariffs();
      })
  }

  protected readonly getSupportedInputTypes = getSupportedInputTypes;
}
