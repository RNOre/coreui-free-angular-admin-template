import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
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
  ToastBodyComponent,
  ToastComponent,
  ToasterComponent,
  ToastHeaderComponent
} from '@coreui/angular';

import {DefaultHeaderComponent} from './';
import {navItems} from './_nav';
import {SidebarComponent} from "../../widgets/sidebar/sidebar.component";
import {ToastService} from "../../core/services/toast.service";
import {SidebarService} from "../../widgets/sidebar/sidebar.service";
import {AsyncPipe} from "@angular/common";

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
    SidebarBrandComponent,
    ShadowOnScrollDirective,
    ContainerComponent,
    RouterOutlet,
    SidebarComponent,
    DefaultHeaderComponent,
    ToasterComponent,
    ToastComponent,
    ToastHeaderComponent,
    ToastBodyComponent,
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalToggleDirective,
    AsyncPipe
  ]
})
export class DefaultLayoutComponent implements OnDestroy, OnInit {
  // @ViewChild('overflow', {static: true}) scrollbar!: NgScrollbar
  public navItems = navItems;

  visible = false;

  constructor(public sidebarService: SidebarService, private $toast: ToastService) {
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
