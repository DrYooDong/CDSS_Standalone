import { InfectionSite, Population, SpecificPathogenRisk } from '../types';

export type ClinicalScoreId =
  | 'curb65'
  | 'psi'
  | 'ats_cap'
  | 'cpis'
  | 'qsofa'
  | 'sofa_full'
  | 'psofa_calc'
  | 'lrinec'
  | 'eron_ssti'
  | 'uti_esbl'
  | 'clif_sbp'
  | 'tg18_biliary'
  | 'cns_meningitis';

export type ScoreRiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface ScoreSuggestedAction {
  suggestGroup?: 'group_1' | 'group_2';
  suggestSofaScore?: number;
  suggestPsofaScore?: number;
  suggestClifSofaScore?: number;
  suggestSpecificRisks?: SpecificPathogenRisk[];
  actionLabelVi: string;
}

export interface ScoreCalculationResult {
  scoreId: ClinicalScoreId;
  scoreNameVi: string;
  shortName: string;
  totalScore: number;
  maxScore?: number;
  displayScoreText: string;
  riskClassVi: string;
  riskLevel: ScoreRiskLevel;
  mortalityTextVi?: string;
  dispositionVi: string;
  antibioticImpactVi: string;
  clinicalNotesVi?: string[];
  sourceText: string;
  suggestedAction?: ScoreSuggestedAction;
}

export interface ScoreDefinitionMeta {
  id: ClinicalScoreId;
  shortName: string;
  titleVi: string;
  subtitleVi: string;
  sites: InfectionSite[];
  populations: Population[];
  badgeText?: string;
}

export interface Curb65Inputs {
  confusion: boolean;
  ureaOver7Mmol: boolean; // BUN > 19 mg/dL or Urea > 7 mmol/L
  rrOver30: boolean;      // RR >= 30
  bpLow: boolean;         // SBP < 90 or DBP <= 60
  ageOver65: boolean;     // Age >= 65
}

export interface PsiInputs {
  age: number;
  isFemale: boolean;
  nursingHome: boolean;
  neoplasticDisease: boolean;
  liverDisease: boolean;
  chf: boolean;
  cerebrovascularDisease: boolean;
  renalDisease: boolean;
  alteredMentalStatus: boolean;
  rrOver30: boolean;
  sbpUnder90: boolean;
  tempAbnormal: boolean;   // < 35°C or >= 40°C
  hrOver125: boolean;
  phUnder735: boolean;
  bunOver30: boolean;      // BUN >= 30 mg/dL (Urea >= 11 mmol/L)
  naUnder130: boolean;
  glucoseOver250: boolean; // >= 250 mg/dL (13.9 mmol/L)
  hctUnder30: boolean;
  pao2Under60: boolean;    // PaO2 < 60 mmHg or SpO2 < 90%
  pleuralEffusion: boolean;
}

export interface AtsCapInputs {
  // Major criteria (2)
  invasiveMechVent: boolean;
  septicShockVasopressors: boolean;
  // Minor criteria (9)
  rrOver30: boolean;
  pao2Fio2Under250: boolean;
  multilobarInfiltrates: boolean;
  confusion: boolean;
  bunOver20: boolean;      // BUN >= 20 mg/dL (Urea >= 7 mmol/L)
  wbcUnder4000: boolean;
  pltUnder100k: boolean;
  tempUnder36: boolean;
  hypotensionFluid: boolean;
}

export interface CpisInputs {
  tempScore: 0 | 1 | 2;       // 36.5-38.4 (0), 38.5-38.9 (1), >=39 or <=36 (2)
  wbcScore: 0 | 1 | 2;        // 4-11k (0), <4 or >11k (1), + bands >=50% (2)
  secretionsScore: 0 | 1 | 2; // None (0), Non-purulent (1), Purulent (2)
  oxygenationLow: boolean;    // PaO2/FiO2 <= 240 without ARDS -> +2
  xrayScore: 0 | 1 | 2;       // No infiltrate (0), Diffuse/patchy (1), Localized (2)
  progression: boolean;       // Infiltrate progression (excluding CHF/ARDS) -> +2
  culturePositive: 0 | 1 | 2; // Negative/light (0), Moderate/heavy (1), + Gram stain match (2)
}

export interface QsofaInputs {
  alteredMental: boolean; // GCS < 15
  rrOver22: boolean;      // RR >= 22
  sbpUnder100: boolean;   // SBP <= 100
}

export interface SofaFullInputs {
  resp: 0 | 1 | 2 | 3 | 4;
  coag: 0 | 1 | 2 | 3 | 4;
  liver: 0 | 1 | 2 | 3 | 4;
  cardio: 0 | 1 | 2 | 3 | 4;
  cns: 0 | 1 | 2 | 3 | 4;
  renal: 0 | 1 | 2 | 3 | 4;
}

export interface PsofaInputs {
  resp: 0 | 1 | 2 | 3 | 4;
  coag: 0 | 1 | 2 | 3 | 4;
  liver: 0 | 1 | 2 | 3 | 4;
  cardio: 0 | 1 | 2 | 3 | 4;
  cns: 0 | 1 | 2 | 3 | 4;
  renal: 0 | 1 | 2 | 3 | 4;
}

export interface LrinecInputs {
  crpOver150: boolean;    // CRP >= 150 mg/L (+4)
  wbcTier: 0 | 1 | 2;     // <15 (+0), 15-25 (+1), >25 (+2)
  hbTier: 0 | 1 | 2;      // >13.5 (+0), 11-13.5 (+1), <11 (+2)
  naUnder135: boolean;    // Na < 135 mmol/L (+2)
  crOver141: boolean;     // Scr > 141 umol/L / 1.6 mg/dL (+2)
  glucoseOver10: boolean; // Glucose > 10 mmol/L / 180 mg/dL (+1)
}

export interface EronSstiInputs {
  systemicToxicity: 'none' | 'mild_comorbid' | 'moderate_sepsis' | 'severe_sepsis_necrotizing';
  uncontrolledComorbidity: boolean; // PAD, venous insufficiency, morbid obesity, uncontrolled DM
  rapidProgressionOrDeep: boolean;
}

export interface UtiEsblInputs {
  recentHospitalization: boolean; // <= 12 months (+3)
  transferFromHealthcare: boolean; // (+3)
  recentAbx3m: boolean;           // Beta-lactam/FQ within 3 months (+2)
  urinaryCatheter: boolean;       // Indwelling catheter (+2)
  ageOver70: boolean;             // (+2)
  maleGender: boolean;            // (+1)
  isPyelonephritisOrSepsis: boolean;
}

export interface ClifSbpInputs {
  liverBiliTier: 0 | 1 | 2 | 3 | 4;
  renalCrTier: 0 | 1 | 2 | 3 | 4;   // Auto from Scr
  brainHeGrade: 0 | 1 | 2 | 3 | 4;
  coagInrTier: 0 | 1 | 2 | 3 | 4;
  circMapVasopressor: 0 | 1 | 2 | 3 | 4;
  respPao2Fio2Tier: 0 | 1 | 2 | 3 | 4;
  sbpScrOver1Mgdl: boolean;       // Scr > 1 mg/dL (88.4 umol/L) or BUN > 30 or Bili > 4 mg/dL -> Albumin indication
}

export interface Tg18BiliaryInputs {
  // Grade III organ dysfunction
  cardioVasopressor: boolean;
  neuroAltered: boolean;
  respPao2Fio2Under300: boolean;
  renalCrOver176: boolean;        // Cr > 2.0 mg/dL (176.8 umol/L)
  hepaticInrOver15: boolean;
  hematoPltUnder100k: boolean;
  // Grade II moderate criteria (>= 2 of 5)
  wbcAbnormal: boolean;           // >12k or <4k
  highFever39: boolean;           // >= 39°C
  ageOver75: boolean;
  hyperbilirubinemia: boolean;    // Total bilirubin >= 5 mg/dL (85.5 umol/L)
  hypoalbuminemia: boolean;
}

export interface CnsMeningitisInputs {
  // Bacterial Meningitis Score (BMS) / CSF Indicators
  gramStainPositive: boolean;     // (+2)
  csfProteinOver80: boolean;      // >= 80 mg/dL (+1)
  peripheralAncOver10k: boolean;  // >= 10,000/mm3 (+1)
  csfAncOver1000: boolean;        // >= 1,000/mm3 (+1)
  seizureAtPresentation: boolean; // (+1)
  // Listeria & Steroid modifiers
  ageOver50: boolean;
  immunocompromisedOrPregnant: boolean;
  neurosurgeryOrShunt: boolean;
}
