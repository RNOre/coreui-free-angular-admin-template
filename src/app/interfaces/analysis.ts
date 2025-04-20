export interface AnalysisInterface {
  changed_colonies_number: number,
  colonies_number: number,
  created_at: string,
  id: string,
  image_link: string,
  name: string,
  predicted_classes: PredictedClassesInterface,
  suspicious_colonies_number: number,
}

export interface PredictedClassesInterface {
  0?: string,
  1?: string,
  3?: string,
  4?: string,

}
