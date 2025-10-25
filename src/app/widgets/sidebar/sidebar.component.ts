import {Component, computed, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {navItem} from "../../interfaces/global";
import {isAdmin} from "../../core/global";
import {AsyncPipe, JsonPipe, NgStyle} from "@angular/common";
import {SidebarService} from "./sidebar.service";

@Component({
  selector: 'app-sidebar',
  imports: [
    NgStyle,
    AsyncPipe,
    JsonPipe
  ],
  templateUrl: './sidebar.component.html',
  standalone: true,
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  isAdmin = false;
  selectedNav: navItem = 'company';

  constructor(private $router: Router, private route: ActivatedRoute, public sidebarService: SidebarService) {
  }

  ngOnInit() {
    this.isAdmin = !!localStorage.getItem('isAdmin') || false;
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
      case "/analysis":
        this.selectedNav = 'analysis';
        break;
      case "/main-legal":
        this.selectedNav = 'main-legal';
        break;
      case "/user-legal":
        this.selectedNav = 'user-legal';
        break;
    }
  }

  navigateTo(path: navItem) {
    this.selectedNav = path;
    this.sidebarService.setIsOpen(false);

    switch (path) {
      case "home":
        this.$router.navigate(['/home']).then();
        break;
      case "tariff":
        this.$router.navigate(['/billing', 'tariffs']).then();
        break;
      case "license":
        this.$router.navigate(['/billing', 'licenses']).then();
        break;
      case "company":
        if (isAdmin())
          this.$router.navigate(['/company']).then();
        else this.$router.navigate(['/company', 'legal']).then();
        break;
      case "order":
        this.$router.navigate(['/order']).then();
        break;
      case "user":
        this.$router.navigate(['/user']).then();
        break;
      case "analysis":
        this.$router.navigate(['/analysis']).then();
        break;
      case "main-legal":
        this.$router.navigate(['/main-legal']).then();
        break;
      case "user-legal":
        this.$router.navigate(['/user-legal']).then();
        break;
    }
  }

  // setIsOpen(value: boolean) {
  //   if (value) {
  //     this.isOpen = true
  //     document.body.classList.add('no-scroll');
  //   } else {
  //     this.isOpen = false;
  //     document.body.classList.remove('no-scroll')
  //   }
  // }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    this.$router.navigate(['login']).then();
  }

  setIsOpen(state: boolean): void {
    this.sidebarService.setIsOpen(state);
  }

  get isOpen() {
    return this.sidebarService.isOpen();
  }
}
