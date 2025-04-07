import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {OrderInterface} from "../../../interfaces/order";
import {HttpClient} from "@angular/common/http";
import {ButtonDirective, FormControlDirective, FormSelectDirective} from "@coreui/angular";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {DatePipe} from "@angular/common";
import {TariffInterface} from "../../../interfaces/billing";
import {FilterInterface} from "../../../interfaces/global";

@Component({
  selector: 'app-order-item',
  imports: [
    FormControlDirective,
    ReactiveFormsModule,
    DatePipe,
    FormSelectDirective,
    ButtonDirective
  ],
  templateUrl: './order-item.component.html',
  standalone: true,
  styleUrl: './order-item.component.scss'
})
export class OrderItemComponent implements OnInit {

  $order!: OrderInterface;
  orderData = new FormGroup({
    company_name: new FormControl(''),
    id: new FormControl(''),
    tariff_id: new FormControl(''),
    status: new FormControl('')
  });
  tariffList!: TariffInterface[] | undefined;
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

  constructor(private route: ActivatedRoute, private $http: HttpClient, private $router: Router) {
  }

  ngOnInit() {
    if (this.route.snapshot.params['id'])
      this.getOrderInfo();
  }

  getOrderInfo() {
    this.$http.get<{
      data: OrderInterface
    }>('http://82.97.241.8:8083/admin/api/v1/order/' + this.route.snapshot.params['id'])
      .subscribe((res) => {
        this.$order = res.data;
        this.orderData.controls.id.setValue(this.$order.id);
        this.orderData.controls.company_name.setValue(this.$order.company_name);
        this.orderData.controls.tariff_id.setValue(this.$order.tariff_id);
        this.orderData.controls.status.setValue(this.$order.status);

        this.getTariffList();
      });
  }

  getTariffList() {
    this.$http.post('http://82.97.241.8:8083/admin/api/v1/tariffs/filter', this.filter)
      // @ts-ignore
      .subscribe((res: { data: { items: TariffInterface[], total: number } }) => {
        // @ts-ignore
        this.tariffList = res?.data?.items;
      })
  }

  selectTariff() {
    const body = {
      order_id: this.$order.id,
      tariff_id: this.orderData.controls.tariff_id.value
    }

    this.$http.post('http://82.97.241.8:8083/admin/api/v1/order-accept', body)
      .subscribe();
  }

  rejectOrder() {
    this.$http.patch(`http://82.97.241.8:8083/admin/api/v1/order/${this.$order.id}`,{})
      .subscribe(() => this.$router.navigate(['/company', 'order']).then())
  }
}
