import {Component, Input} from '@angular/core';
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-adv-section',
  imports: [
    JsonPipe
  ],
  templateUrl: './adv-section.component.html',
  styleUrl: './adv-section.component.scss'
})
export class AdvSectionComponent {
  @Input() data: {
    image: string;
    link: string;
  } = {
    image: 'https://media.lpgenerator.ru/uploads/2019/10/10/6.png',
    link: 'https://media.lpgenerator.ru/uploads/2019/10/10/6.png',
  }
}
