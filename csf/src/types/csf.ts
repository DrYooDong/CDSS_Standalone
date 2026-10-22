export interface CSFInput {
  // Patient info
  patientAge: number; // years
  ageGroup: 'adult' | 'child' | 'neonate';
  gender: 'male' | 'female' | 'other';
  daysSinceOnset: number; // days since headache / symptom onset (important for SAH / decay)
  
  // Clinical flags
  hasPriorAntibiotics: boolean;
  isImmunocompromised: boolean; // HIV, chemotherapy, steroids, transplant
  isPostNeurosurgical: boolean; // Shunt, craniotomy, EVD
  hasThunderclapHeadache: boolean;
  hasFocalDeficitOrSeizure: boolean;
  hasAlteredMentalStatus: boolean;

  // Opening pressure (mmH2O)
  openingPressure?: number;

  // Visual appearance
  color: 'clear' | 'turbid' | 'purulent' | 'bloody' | 'xanthochromic' | 'faint_pink';
  supernatant: 'clear' | 'xanthochromic';
  pellicleFormation: boolean; // Màng mạng nhện (TBM)

  // Biochemistry
  protein: number; // mg/dL
  proteinUnit: 'mg/dL' | 'g/L';
  csfGlucose: number; // mg/dL
  serumGlucose?: number; // mg/dL
  glucoseUnit: 'mg/dL' | 'mmol/L';
  lactate?: number; // mmol/L or mg/dL
  lactateUnit: 'mmol/L' | 'mg/dL';

  // Cytology & Cells
  wbc: number; // /µL
  neutrophilPercent: number; // % PMN
  lymphocytePercent: number; // % Lymphocytes
  monocytePercent: number; // % Monocytes
  eosinophils?: number; // /µL or %
  rbc: number; // /µL

  // Traumatic Tap / SAH 3-tube test
  tube1Rbc?: number;
  tube4Rbc?: number;
  bloodWbc?: number; // /µL (e.g. 7000)
  bloodRbc?: number; // M/µL (e.g. 4.5)

  // Advanced / Optional
  csfAlbumin?: number; // mg/L
  serumAlbumin?: number; // g/L
  csfIgG?: number; // mg/L
  serumIgG?: number; // g/L
  adaLevel?: number; // U/L (Adenosine deaminase for TB)

  // Microbiology / Special Tests
  gramStain: 'not_done' | 'negative' | 'gram_pos_cocci' | 'gram_neg_diplococci' | 'gram_neg_bacilli' | 'gram_pos_bacilli';
  crAgOrIndiaInk: 'not_done' | 'negative' | 'positive';
  tbPcrOrAfb: 'not_done' | 'negative' | 'positive';
  viralPcr: 'not_done' | 'negative' | 'hsv_positive' | 'enterovirus_positive' | 'vzv_positive';
}

export interface CSFReferenceRange {
  openingPressure: { min: number; max: number; unit: string };
  wbc: { max: number; unit: string; description: string };
  protein: { max: number; unit: string };
  glucoseRatio: { min: number; max: number };
  lactate: { min: number; max: number; unit: string };
}

export type DiagnosisCategory = 
  | 'bacterial'
  | 'viral'
  | 'tuberculous'
  | 'cryptococcal_fungal'
  | 'subarachnoid_hemorrhage'
  | 'traumatic_tap'
  | 'guillain_barre'
  | 'intracranial_hypertension'
  | 'intracranial_hypotension'
  | 'eosinophilic'
  | 'carcinomatous'
  | 'normal';

export interface DiagnosticLikelihood {
  category: DiagnosisCategory;
  nameVi: string;
  nameEn: string;
  score: number; // 0 - 100
  confidence: 'very_high' | 'high' | 'moderate' | 'low';
  summaryVi: string;
  keyFeatures: string[];
  caveats: string[];
  recommendedActions: string[];
}

export interface CSFAnalysisResult {
  // Calculated values
  glucoseRatio: number | null; // CSF:Serum glucose
  glucoseRatioPathological: boolean;
  correctedWbc: number; // WBC corrected for traumatic tap
  predictedTraumaticWbc: number;
  isTraumaticSuspected: boolean;
  tubeClearingPercent: number | null;
  adjustedRbcSah: number; // Decay adjusted according to Nature 2023
  sahLikelihoodFromZinganell: 'high' | 'low' | 'indeterminate';
  qAlbumin?: number;
  qAlbuminUpperLimit?: number;
  hasBloodCerebrospinalBarrierDisruption?: boolean;
  iggIndex?: number;
  hasIntrathecalIgGSynthesis?: boolean;

  // Diagnostic possibilities ranked
  likelihoods: DiagnosticLikelihood[];
  topDiagnosis: DiagnosticLikelihood;
  
  // High-priority red flags
  urgentAlerts: string[];
  
  // Specific criteria badges (e.g. Spanos 99% certainty rule)
  spanosCriteriaMet: boolean;
  spanosDetails: string[];
  albuminocytologicDissociation: boolean;
}

export interface PresetCase {
  id: string;
  title: string;
  shortDesc: string;
  category: DiagnosisCategory;
  data: CSFInput;
}
