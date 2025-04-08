import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  standalone: true,
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  isOpen = false;
  selectedNav: 'order' | 'company' | 'tariff' | 'license' | 'home' | 'user' = 'company';

  constructor(private $router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    switch (this.$router.url) {
      case '/billing/tariffs':
        this.selectedNav = 'tariff';
        break;
      case '/billing/licenses':
        this.selectedNav = 'license';
        break;
      case '/company':
        this.selectedNav = 'company';
        break;
      case '/order':
        this.selectedNav = 'order';
        break;
      case '/home':
        this.selectedNav = 'home';
        break;
      case '/user':
        this.selectedNav = 'user';
        break;
    }
  }

  navigateTo(path: 'order' | 'company' | 'tariff' | 'license' | 'home' | 'user') {
    this.selectedNav = path;
    this.isOpen = false;

    switch (path) {
      case "home":
        this.$router.navigate(['home']).then();
        break;
      case "tariff":
        this.$router.navigate(['billing', 'tariffs']).then();
        break;
      case "license":
        this.$router.navigate(['billing', 'licenses']).then();
        break;
      case "company":
        this.$router.navigate(['company']).then();
        break;
      case "order":
        this.$router.navigate(['order']).then();
        break;
      case "user":
        this.$router.navigate(['user']).then();
        break;
    }
  }

  protected readonly open = open;
}
