import { Component } from '@angular/core';
import {AnalysisWidgetComponent} from "../analysis-widget/analysis-widget.component";

@Component({
  selector: 'app-analysis-page',
  imports: [
    AnalysisWidgetComponent
  ],
  templateUrl: './analysis-page.component.html',
  standalone: true,
  styleUrl: './analysis-page.component.scss'
})
export class AnalysisPageComponent {

}
