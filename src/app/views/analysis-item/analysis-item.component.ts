import {Component, OnInit} from '@angular/core';
import {AnalysisInterface, PredictedClassesInterface} from "../../interfaces/analysis";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-analysis-item',
  imports: [],
  templateUrl: './analysis-item.component.html',
  standalone: true,
  styleUrl: './analysis-item.component.scss'
})
export class AnalysisItemComponent implements OnInit {

  analysis: AnalysisInterface | undefined;

  analysis_id!: number;


  constructor(private $http: HttpClient, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.analysis_id = this.route.snapshot.params['id'];
    this.getData();
  }

  getData() {
    this.$http
      .get<{ data: AnalysisInterface }>('http://82.97.241.8:8083/api/v1/study/' + this.analysis_id)
      .subscribe({
        next: (res) => this.analysis = res.data
      })
  }

  getPredictedClasses(): string[] {
    let result = []
    if (this.analysis?.predicted_classes)
      for (const [key, value] of Object.entries(this.analysis.predicted_classes)) {
        result.push(`Col${key} - ${value}`);
      }
    return result;
  }

}
