import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  standalone: true,
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit{
  isOpen = false;
  selectedNav: 'order' | 'company' | 'tariff' | 'license' | 'home' = 'company';

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
    }
  }

  navigateTo(path: 'order' | 'company' | 'tariff' | 'license' | 'home') {
    this.selectedNav = path;
    this.isOpen = false;

    switch (path) {
      case "home":
        this.$router.navigate(['']).then();
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
    }
  }

  protected readonly open = open;
}
