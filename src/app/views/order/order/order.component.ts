import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FilterInterface, PaginationInterface, PaginationMetaInterface} from "../../../interfaces/global";
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
import {PaginationDirective} from "../../../directives/pagination.directive";

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
    ModalFooterComponent,
    PaginationDirective
  ],
  templateUrl: './order.component.html',
  standalone: true,
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {
  tab = 'company';

  tariffsData!: TariffInterface[];
  total!: number;
  activeTariff = '';

  tariffMetaCompany: PaginationMetaInterface = {
    currentPage: 1,
    perPage: 10,
    currentCount: 0
  };

  orderDataUser: OrderInterface[] | undefined;
  orderDataCompany: OrderInterface[] | undefined;
  orderMetaUser: PaginationMetaInterface = {
    currentPage: 1,
    perPage: 10,
    currentCount: 0
  };
  orderMetaCompany: PaginationMetaInterface = {
    currentPage: 1,
    perPage: 10,
    currentCount: 0
  };

  icons = {cilCheckAlt, cilX}

  constructor(private $http: HttpClient) {
  }

  ngOnInit() {
    this.getTariffs();
    this.getOrdersUser();
    this.getOrdersCompany();
  }

  getOrdersUser() {
    const filter = {
      search: '',
      kind: {
        // @ts-ignore
        user: {}
      },
      order: {
        created_at: 'desc',
      },
      pagination: {
        "limit": this.orderMetaUser.perPage,
        "offset": (this.orderMetaUser.currentPage - 1) * this.orderMetaUser.perPage
      }
    }

    this.$http.post('orders/filter', {
      filter
    })
      // @ts-ignore
      .subscribe((res: { data: { items: OrderInterface[], total: number } }) => {
        this.orderDataUser = res?.data.items;
        this.orderMetaUser.totalCount = res.data.total;
        this.orderMetaUser.currentCount = this.orderDataUser?.length || 0;
      })
  }

  getOrdersCompany() {
    const filter = {
      search: '',
      kind: {
        company: {}
      },
      order: {
        created_at: 'desc',
      },
      pagination: {
        "limit": this.orderMetaCompany.perPage,
        "offset": (this.orderMetaCompany.currentPage - 1) * this.orderMetaCompany.perPage
      }
    }

    this.$http.post('orders/filter', {filter})
      // @ts-ignore
      .subscribe((res: { data: { items: OrderInterface[], total: number } }) => {
        this.orderDataCompany = res?.data.items;
        this.orderMetaCompany.totalCount = res.data.total;
        this.orderMetaCompany.currentCount = this.orderDataCompany?.length || 0;
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

    this.$http.post('order-accept', body)
      .subscribe({
        next: () => {
          this.tab === 'company' ? this.getOrdersCompany() : this.getOrdersUser();
        }
      });
  }

  rejectOrder(order_id: string) {
    this.$http.patch('order/' + order_id, {})
      // @ts-ignore
      .subscribe((res: { data: OrderInterface }) => {
        this.tab === 'company' ? this.getOrdersCompany() : this.getOrdersUser();
      });
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
        limit: this.tariffMetaCompany.perPage,
        offset: (this.tariffMetaCompany.currentPage - 1) * this.tariffMetaCompany.perPage
      }
    };
    this.$http.post('tariffs/filter', filter)
      // @ts-ignore
      .subscribe((res: { data: { items: TariffInterface[], total: number } }) => {
        // @ts-ignore
        this.tariffsData = res?.data?.items;
        this.tariffMetaCompany.totalCount = res.data.total;
        this.tariffMetaCompany.currentCount = this.tariffsData.length;
      })
  }

  pageChangeCompany(page: number) {
    this.orderMetaCompany.currentPage = page;
    this.getOrdersCompany();
  }

  pageChangeUser(page: number) {
    this.orderMetaUser.currentPage = page;
    this.getOrdersUser();
  }

  pageChangeTariff(page: number) {
    this.tariffMetaCompany.currentPage = page;
    this.getTariffs();
  }

  protected readonly Date = Date;
}
