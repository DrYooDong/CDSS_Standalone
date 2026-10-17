/**
 * CliniPortal CDSS — Unified Clinical Decision Support System Types
 */

export type Gender = 'male' | 'female';
export type DengueAgeGroup = 'child' | 'adolescent' | 'adult';
export type DengueSeverity = 'warning_signs' | 'shock' | 'severe_shock';

export interface DenguePatientInput {
  ageYears: number;
  gender: Gender;
  actualWeightKg: number;
  heightCm?: number;
  severity: DengueSeverity;
  startTime?: string;
  clinicalResponse?: string;
  currentHctPercent?: number;
  baselineHctPercent?: number;
  massiveBleeding?: boolean;
  liverEnzymesAST_ALT?: number;
  plateletsCount?: number;
  fibrinogenGL?: number;
  inrValue?: number;
  cvpValue?: number;
}

export interface WeightCalculationResult {
  actualWeightKg: number;
  standardWeightKg: number;
  isObese: boolean;
  ratioToStandard: number;
  adjustedWeightKg: number;
  formulaNote: string;
  warningText?: string;
  bmi?: number;
  idealWeightKg?: number;
  isAdultMethod?: boolean;
  tableRoundedWeightKg?: number;
}

export interface FluidScheduleRow {
  stepIndex: number;
  stageName: string;
  durationHours: number;
  rateMlKgH: number;
  dropsPerMin: number;
  totalMl: number;
  timeWindow: string;
  existingFluidMl: number;
  bottlesToHang: number;
  bottleType: string;
  totalAtPoleMl: number;
  monitoringNotes: string;
  hctCheckRequired: boolean;
}

export interface VasopressorDoseInfo {
  drugName: string;
  patientWeightKg: number;
  calculationFormula: string;
  totalMg: number;
  diluentSolution: string;
  syringeVolumeMl: number;
  infusionEquivalent: string;
  standardDoseRange: string;
  recommendedPumpRateMlH: string;
  clinicalIndications: string;
  precautions: string;
}

export interface BloodProductItem {
  id: string;
  productName: string;
  indication: string;
  doseFormula: string;
  calculatedDose: string;
  thresholdMet: boolean;
  targetClinical: string;
  precautions: string;
}

export interface NACDosingPhase {
  phase: number;
  phaseName: string;
  doseMgKg: number;
  infusionTimeHours: number;
  diluent: string;
  totalMg: number;
  pumpRateMlH: string;
}

export interface NACProtocolResult {
  indicated: boolean;
  severityLevel: 'normal' | 'severe_hepatitis' | 'acute_liver_failure';
  astAltVal: number;
  summary: string;
  phases: NACDosingPhase[];
  precautions: string[];
}

export interface ABCSChecklist {
  acidosis: { title: string; criteria: string; action: string };
  bleeding: { title: string; criteria: string; action: string };
  calcium: { title: string; criteria: string; action: string };
  sugar: { title: string; criteria: string; action: string };
}

export interface CDSSAlertItem {
  id: string;
  level: 'info' | 'warning' | 'danger';
  title: string;
  message: string;
  ruleCode: string;
}

export interface BranchDecisionResult {
  branchType: 'standard' | 'cpt' | 'blood' | 'refractory_shock';
  title: string;
  recommendedFluid: string;
  rateMlKgH: number;
  durationHours: number;
  reasoning: string;
  warnings: string[];
}

export type ColloidType = 'dextran40' | 'dextran70' | 'hes200' | 'hes130' | 'gelatin';

export interface ColloidScheduleRow {
  stepIndex: number;
  stageName: string;
  fluidKind: 'colloid' | 'crystalloid';
  fluidName: string;
  durationHours: number;
  rateMlKgH: number;
  dropsPerMin: number;
  stepVolumeMl: number;
  cumulativeColloidMl: number;
  cumulativeColloidMlPerKg: number;
  timeWindow: string;
  bottlesToHang: number;
  totalAtPoleMl: number;
  monitoringNotes: string;
  hctCheckRequired: boolean;
  exceedsThreshold: boolean;
}

export interface ColloidPlanResult {
  colloidType: ColloidType;
  colloidName: string;
  rows: ColloidScheduleRow[];
  totalColloidVolumeMl: number;
  totalColloidMlPerKg: number;
  safeLimitVolumeMl: number;
  remainingSafeMl: number;
  isOverLimit: boolean;
  albuminRecommended: boolean;
  deEscalationCriteria: string[];
}

export interface HemodynamicProfile {
  cvpLevel: 'low_normal' | 'high'; // <= 15 vs > 15 cmH2O
  cardiacContractility: 'normal' | 'reduced';
  vascularTone: 'normal' | 'low_warm_shock' | 'high_cold_shock';
  isOverloaded: boolean;
}

export interface VasopressorDecisionResult {
  primaryDrug: string;
  primaryDose: string;
  primaryPumpRateMlH: string;
  secondaryDrug?: string;
  secondaryDose?: string;
  secondaryPumpRateMlH?: string;
  rescueDrug?: string;
  fluidAction: string;
  clinicalRationale: string;
  fluidTestMl: number;
  monitoringDirectives: string[];
}

export interface DengueCDSSPlan {
  patient: DenguePatientInput;
  ageGroup: DengueAgeGroup;
  weightResult: WeightCalculationResult;
  fluidRows: FluidScheduleRow[];
  totalVolumeMl: number;
  totalDurationHours: number;
  colloidPlan: ColloidPlanResult;
  vasopressorDopamin: VasopressorDoseInfo;
  vasopressorNoradrenalin: VasopressorDoseInfo;
  vasopressorDobutamin: VasopressorDoseInfo;
  vasopressorAdrenalin: VasopressorDoseInfo;
  vasopressorDecision: VasopressorDecisionResult;
  bloodProducts: BloodProductItem[];
  nacProtocol: NACProtocolResult;
  branchDecision: BranchDecisionResult;
  abcsChecklist: ABCSChecklist;
  alerts: CDSSAlertItem[];
  nursingInstructions: string[];
  soapExportText: string;
  createdAt: string;
}
