import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FilterInterface, PaginationInterface} from "../../../interfaces/global";
import {OrderInterface} from "../../../interfaces/order";
import {
  ButtonCloseDirective,
  ButtonDirective,
  FooterComponent,
  ModalBodyComponent,
  ModalComponent, ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalToggleDirective,
  TableDirective,
  TextColorDirective,
  TooltipDirective
} from "@coreui/angular";
import {IconDirective} from "@coreui/icons-angular";
import {cilCheckAlt, cilX} from "@coreui/icons";
import {RouterLink} from "@angular/router";
import {TariffInterface} from "../../../interfaces/billing";

@Component({
  selector: 'app-order',
  imports: [
    TableDirective,
    TooltipDirective,
    ButtonDirective,
    TextColorDirective,
    IconDirective,
    RouterLink,
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalToggleDirective,
    FooterComponent,
    ModalFooterComponent
  ],
  templateUrl: './order.component.html',
  standalone: true,
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {
  tab = 'company';
  filterTariff: FilterInterface = {
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
  tariffsData!: TariffInterface[];
  total!: number;
  activeTariff = '';


  filter: {
    search: string;
    status: any;
    order: { created_at: 'asc' | 'desc' },
    pagination: PaginationInterface
  } = {
    search: '',
    status: {
      // @ts-ignore
      all: {}
    },
    order: {
      created_at: 'desc',
    },
    pagination: {
      limit: 10,
      offset: 0
    }
  }

  orderData: OrderInterface[] | undefined;
  totalCount: number | undefined;

  icons = {cilCheckAlt, cilX}

  constructor(private $http: HttpClient) {
  }

  ngOnInit() {
    this.getTariffs();
    this.getOrders();
  }

  getOrders() {
    this.$http.post('http://82.97.241.8:8083/admin/api/v1/orders/filter',
      {filter: this.filter})
      // @ts-ignore
      .subscribe((res: { data: { items: OrderInterface[], total: number } }) => {
        this.orderData = res?.data.items;
        this.totalCount = res?.data.total;
      })
  }

  getDate(date: string) {
    const parseDate = new Date(date);
    if (parseDate) {
      return `${parseDate.getDate().toString().padStart(2, '0')}.${(parseDate.getMonth() + 1).toString().padStart(2, '0')}.${(parseDate.getFullYear())}`
    }
    return '';
  }

  acceptOrder(order_id: string, tariff_id: string) {
    const body = {
      order_id,
      tariff_id
    }

    this.$http.post('http://82.97.241.8:8083/admin/api/v1/order-accept', body)
      .subscribe({
        next: () => {
          this.getOrders();
        }
      });
  }

  rejectOrder(order_id: string) {
    this.$http.patch('http://82.97.241.8:8083/admin/api/v1/order/' + order_id, {})
      // @ts-ignore
      .subscribe((res: { data: OrderInterface }) => {
        this.getOrders()
      });
  }

  getTariffs() {
    this.$http.post('http://82.97.241.8:8083/admin/api/v1/tariffs/filter', this.filterTariff)
      // @ts-ignore
      .subscribe((res: { data: { items: TariffInterface[], total: number } }) => {
        // @ts-ignore
        this.tariffsData = res?.data?.items;
        // @ts-ignore
        this.total = res?.data.total
      })
  }

  protected readonly Date = Date;
}
