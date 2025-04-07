import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {NgScrollbar} from 'ngx-scrollbar';

import {IconDirective} from '@coreui/icons-angular';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent, SidebarService,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular';

import {DefaultFooterComponent, DefaultHeaderComponent} from './';
import {navItems} from './_nav';
import {SidebarComponent} from "../../widgets/sidebar/sidebar.component";

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  standalone: true,
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    RouterLink,
    IconDirective,
    NgScrollbar,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    ShadowOnScrollDirective,
    ContainerComponent,
    RouterOutlet,
    SidebarComponent,
    DefaultHeaderComponent
  ]
})
export class DefaultLayoutComponent implements OnDestroy, OnInit {
  // @ViewChild('overflow', {static: true}) scrollbar!: NgScrollbar
  public navItems = navItems;

  constructor(private $sidebar: SidebarService) {
  }
  ngOnInit(): void {
    //@ts-ignore
    // this.$sidebar.sidebarState$.subscribe((res) => {
    //   console.log(res);
    // });
  }

  ngOnDestroy(): void {
    //
  }

  protected readonly window = window;
}
