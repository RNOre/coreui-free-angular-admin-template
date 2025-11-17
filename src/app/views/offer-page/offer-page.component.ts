import {Component, OnInit} from '@angular/core';
import {AdvSectionComponent} from "../landing/adv-section/adv-section.component";
import {HttpClient} from "@angular/common/http";
import {env} from "../../../../env";
import {AdvInterface} from "../../interfaces/billing";

@Component({
  selector: 'app-offer-page',
  imports: [
    AdvSectionComponent
  ],
  templateUrl: './offer-page.component.html',
  styleUrl: './offer-page.component.scss'
})
export class OfferPageComponent implements OnInit {
  advList: AdvInterface[] = [];

  constructor(private $http: HttpClient) {
  }

  ngOnInit() {
    this.$http.get<{ data: { items: AdvInterface[] } }>(env.host + 'advertisement')
      .subscribe(res => {
        this.advList = res.data.items?.filter(el => el.show_in_admins_page && el.is_active);
      })
  }
}
