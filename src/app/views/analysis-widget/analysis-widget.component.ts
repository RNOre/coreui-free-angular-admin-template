import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AnalysisInterface, PredictedClassesInterface} from "../../interfaces/analysis";
import {HttpClient} from "@angular/common/http";
import {DatePipe, NgStyle} from "@angular/common";
import {env} from "../../../../env";

@Component({
  selector: 'app-analysis-widget',
  imports: [
    DatePipe,
    NgStyle
  ],
  templateUrl: './analysis-widget.component.html',
  standalone: true,
  styleUrl: './analysis-widget.component.scss'
})
export class AnalysisWidgetComponent implements OnInit {

  @Input() page = false;

  analysisData: AnalysisInterface[] | undefined;

  constructor(private $router: Router, private $http: HttpClient) {
  }

  ngOnInit(): void {
    this.getData();
  }

  navigateToAnalysis(id: string) {
    this.$router.navigate(['analysis', id])
      .then();
  }

  navigateToAnalysisPage() {
    this.$router.navigate(['analysis']).then();
  }

  getData() {
    const filter = {
      "filter": {
        // "coloniesRange": {
        //   "end": 20,
        //   "start": 10
        // },
        // "dateRange": {
        //   "end": "2006-01-02T15:04:05Z",
        //   "start": "2022-01-02T15:04:05+05:00"
        // },
        // "search": "study's name| +"
      },
      "order": {
        "colonies": "desc",
        "createdAt": "asc"
      },
      "pagination": {
        "limit": 10,
        "offset": 0
      }
    }
    this.$http
      .post<{data: { items: AnalysisInterface[], total: number}}>(env.host + 'company-studies/filter', filter)
    .subscribe(
      {
        next: (res) => {
          this.analysisData = res.data.items;
        }
      }
    );
  }
  getPredictedClasses(data: PredictedClassesInterface): string{
    let result = []
    for (const [key, value] of Object.entries(data)) {
      result.push(`Col${key} - ${value}`);
    }
    return result.join(', ') || '';
  }
}
