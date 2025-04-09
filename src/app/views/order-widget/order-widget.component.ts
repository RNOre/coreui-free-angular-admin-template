import {Component, OnInit} from '@angular/core';
import {PaginationInterface} from "../../interfaces/global";
import {OrderInterface} from "../../interfaces/order";
import {HttpClient} from "@angular/common/http";
import {DatePipe, JsonPipe} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-order-widget',
  imports: [
    JsonPipe,
    DatePipe
  ],
  templateUrl: './order-widget.component.html',
  standalone: true,
  styleUrl: './order-widget.component.scss'
})
export class OrderWidgetComponent implements OnInit {
  constructor(private $http: HttpClient, private $router: Router) {
  }

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

  ngOnInit() {
    this.$http.post('orders/filter',
      {filter: this.filter})
      // @ts-ignore
      .subscribe((res: { data: { items: OrderInterface[], total: number } }) => {
        this.orderData = res?.data.items;
        this.totalCount = res?.data.total;
      })
  }

  getTime(date: string) {
    if (date) {
      return `${new Date(date).getHours().toString().padStart(2, '0')}:${new Date(date).getMinutes().toString().padStart(2, '0')}`
    }
    return '-';
  }

  getOrderID(id: string) {
    return id.substring(0, 5) + '...' + id.substring(id.length - 5);
  }

  navigateToOrder(id: string) {
    this.$router.navigate(['order', id])
      .then();
  }

  navigateToOrderPage() {
    this.$router.navigate(['order']).then();
  }
}
