import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {env} from "../../../../env";
import {AdvSectionComponent} from "./adv-section/adv-section.component";

@Component({
  selector: 'app-landing',
  imports: [
    AdvSectionComponent
  ],
  templateUrl: './landing.component.html',
  standalone: true,
  styleUrl: './landing.component.scss'
})
export class LandingComponent {

  constructor(private $router: Router, private $http: HttpClient) {
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

  getApp() {
    this.$http.get(env.host + 'mobile-sdk',{
      responseType: 'arraybuffer'
    })
      .subscribe((res)=> {
        const blob = new Blob([res], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);

        // Создаем ссылку для скачивания
        const link = document.createElement('a');
        link.href = url;
        link.download = 'KOE.apk';

        // Имитируем клик для скачивания
        link.click();

        // Освобождаем память
        window.URL.revokeObjectURL(url);
        link.remove();
      })
  }

  protected readonly window = window;
}
