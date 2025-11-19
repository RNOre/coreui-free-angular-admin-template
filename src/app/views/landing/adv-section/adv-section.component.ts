import {Component, Input} from '@angular/core';
import {JsonPipe} from "@angular/common";
import {
  CarouselComponent, CarouselConfig,
  CarouselControlComponent,
  CarouselIndicatorsComponent, CarouselInnerComponent,
  CarouselItemComponent
} from "@coreui/angular";
import {RouterLink} from "@angular/router";
import {CarouselCustomConfig} from "../../../core/services/carouel.config";
import {AdvInterface} from "../../../interfaces/billing";

@Component({
  selector: 'app-adv-section',
  imports: [
    CarouselComponent,
    CarouselIndicatorsComponent,
    CarouselItemComponent,
    CarouselControlComponent,
    RouterLink,
    CarouselInnerComponent
  ],
  templateUrl: './adv-section.component.html',
  styleUrl: './adv-section.component.scss',
  providers: [{provide: CarouselConfig, useClass: CarouselCustomConfig}]
})
export class AdvSectionComponent {
  @Input() data: AdvInterface[] = [];
  protected readonly window = window;
}
