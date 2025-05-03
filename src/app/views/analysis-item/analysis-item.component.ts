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

  getPdf() {
    const filter = {
      "filter": {
        search: this.analysis_id
      },
      "order": {
        "colonies": "desc",
        "createdAt": "asc"
      },
      "pagination": {
        "limit": 1,
        "offset": 0
      }
    }

    this.$http.post('http://82.97.241.8:8083/api/v1/company-studies/pdf', filter,{
      responseType: 'arraybuffer' // Explicitly tell HttpClient to expect binary data
    })
      .subscribe((res: ArrayBuffer) => {
        const blob = new Blob([res], {type: 'application/pdf'});

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'analysis_' + this.analysis_id;

        link.click();

        URL.revokeObjectURL(url);
      });
  }

}
