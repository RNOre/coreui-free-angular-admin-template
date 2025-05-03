import {AfterViewInit, Component, OnDestroy, OnInit, signal, ViewChild} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {NgScrollbar} from 'ngx-scrollbar';

import {IconDirective} from '@coreui/icons-angular';
import {
  ButtonCloseDirective,
  ContainerComponent,
  ModalBodyComponent,
  ModalComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalToggleDirective,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarService,
  SidebarToggleDirective,
  SidebarTogglerDirective,
  ToastBodyComponent,
  ToastComponent,
  ToasterComponent,
  ToastHeaderComponent
} from '@coreui/angular';

import {DefaultFooterComponent, DefaultHeaderComponent} from './';
import {navItems} from './_nav';
import {SidebarComponent} from "../../widgets/sidebar/sidebar.component";
import {ToastService} from "../../core/services/toast.service";
import {JsonPipe} from "@angular/common";

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
    DefaultHeaderComponent,
    ToasterComponent,
    ToastComponent,
    ToastHeaderComponent,
    ToastBodyComponent,
    JsonPipe,
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalToggleDirective
  ]
})
export class DefaultLayoutComponent implements OnDestroy, OnInit {
  // @ViewChild('overflow', {static: true}) scrollbar!: NgScrollbar
  public navItems = navItems;

  visible = false;

  constructor(private $sidebar: SidebarService, private $toast: ToastService) {
  }
  ngOnInit(): void {
    //@ts-ignore
    // this.$sidebar.sidebarState$.subscribe((res) => {
    //   console.log(res);
    // });
    // this.$toast.setToast({
    //   title: 'title',
    //   text: 'text',
    //   duration: 1000,
    //   show: true
    // })
  }

  ngOnDestroy(): void {
    //
  }

  getToast() {
    return this.$toast.$toast();
  }

  toggleModal() {
    this.visible = !this.visible;
  }

  protected readonly window = window;
}
