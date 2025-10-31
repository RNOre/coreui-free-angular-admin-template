import {Component, computed, EventEmitter, inject, input, Output} from '@angular/core';
import {
  ColorModeService,
  ContainerComponent,
  FormSelectDirective,
  HeaderComponent,
  HeaderNavComponent,
  NavLinkDirective
} from '@coreui/angular';
import {RouterLink} from "@angular/router";
import {UserService} from "../../../core/services/user.service";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  standalone: true,
  imports: [ContainerComponent, HeaderNavComponent, NavLinkDirective, FormSelectDirective, RouterLink, JsonPipe]
})
export class DefaultHeaderComponent extends HeaderComponent {
  @Output() openModal = new EventEmitter();

  constructor(public $userService: UserService) {
    super();
  }

}
