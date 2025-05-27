import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-landing',
  imports: [],
  templateUrl: './landing.component.html',
  standalone: true,
  styleUrl: './landing.component.scss'
})
export class LandingComponent {

  constructor(private $router: Router) {
  }

  mobileMenu = false;

  navigateTo(url: string) {
    switch (url) {
      case 'login': {
        this.$router.navigate(['login']).then();
        break;
      }
      case 'order': {
        this.$router.navigate(['order-create']).then();
        break;
      }
      case 'tariff': {
        this.mobileMenu = false;
        const a = document.createElement('a');
        a.href='#tariff';
        a.click();
        break;
      }
      case 'info': {
        this.mobileMenu = false;
        const a = document.createElement('a');
        a.href='#info';
        a.click();
        break;
      }
    }
  }

  protected readonly window = window;
}
