/**
 * HepaCDSS Clinical Types and Data Models
 * Chuẩn hóa theo ACG Clinical Guidelines (2017/2024), EASL (2021/2024), WHO và BYT Việt Nam.
 */

export type Gender = 'male' | 'female';

export type BilirubinUnit = 'umol_l' | 'mg_dl';
export type AlbuminUnit = 'g_l' | 'g_dl';
export type CreatinineUnit = 'umol_l' | 'mg_dl';
export type PlateletsUnit = 'g_l' | 'k_ul'; // G/L (10^9/L) hoặc 10^3/uL
export type EnzymeUnit = 'u_l';

export type ULNStandard = 'acg2017' | 'who' | 'custom';

export type AscitesGrade = 'none' | 'mild' | 'moderate_severe'; // Không có / Độ 1-2 (đáp ứng lợi tiểu) / Độ 3 (kháng trị hoặc căng)
export type EncephalopathyGrade = 'none' | 'grade_1_2' | 'grade_3_4'; // West Haven: Không / Độ 1-2 (lú lẫn nhẹ, đảo lộn nhịp ngủ) / Độ 3-4 (lơ mơ, hôn mê)

export type UltrasoundBiliaryDilatation = 'dilated' | 'non_dilated' | 'not_done';

export interface CustomULNSettings {
  altMale: number;
  altFemale: number;
  astMale: number;
  astFemale: number;
  alp: number;
  ggtMale: number;
  ggtFemale: number;
}

export interface UnitPreferences {
  bilirubin: BilirubinUnit;
  albumin: AlbuminUnit;
  creatinine: CreatinineUnit;
  platelets: PlateletsUnit;
}

/**
 * Dữ liệu xét nghiệm nhập liệu thô từ phòng xét nghiệm hoặc bác sĩ lâm sàng
 */
export interface HepaInputData {
  // Hành chính & Bối cảnh
  age: number;
  gender: Gender;
  weightKg?: number;
  heightCm?: number;
  bmi?: number; // Chỉ số khối cơ thể kg/m2
  alcoholGramsPerWeek?: number; // Gam cồn mỗi tuần (>210g nam, >140g nữ = nguy cơ)
  weeklyAlcoholUnits?: number; // Đơn vị cồn UK/tuần (1 unit ~ 8g ethanol)
  auditCScore?: number; // Điểm sàng lọc AUDIT-C (0-12)
  hasDiabetesOrMetabolicRisk?: boolean;
  hasDiabetesOrIFG?: boolean; // Đái tháo đường T2 hoặc rối loạn đường huyết đói (cho NFS)
  isTakingStatin?: boolean; // Bệnh nhân đang sử dụng thuốc Statin hạ lipid
  strenuousExercise?: boolean; // Vận động thể lực nặng / tập tạ trước xét nghiệm (cho AST cơ vân)
  vitaminDNgMl?: number; // Nồng độ 25-OH Vitamin D (ng/mL)
  isPregnancyThirdTrimester?: boolean; // Tăng ALP sinh lý do bánh nhau
  isChildOrAdolescent?: boolean; // Tăng ALP sinh lý xương

  // Men gan & Enzyme đường mật (U/L)
  alt: number;
  ast: number;
  alp: number;
  ggt?: number;
  altUln?: number;
  astUln?: number;
  alpUln?: number;
  ggtUln?: number;

  // Bilirubin
  totalBilirubin: number;
  directBilirubin?: number;
  bilirubinUnit?: BilirubinUnit;

  // Chức năng tổng hợp & Đông máu
  albumin?: number;
  albuminUnit?: AlbuminUnit;
  inr?: number;
  prothrombinTimePatientSeconds?: number;
  prothrombinTimeControlSeconds?: number; // Dùng tính Maddrey DF: 4.6 * (PT_pt - PT_ctrl) + Total Bili mg/dL
  platelets?: number; // 10^9/L hoặc G/L

  // Xét nghiệm bổ sung & chuyên sâu
  creatinine?: number;
  creatinineUnit?: CreatinineUnit;
  sodiumMeqL?: number; // mmol/L dùng cho MELD-Na
  ckUL?: number; // Creatine Kinase (U/L)
  ldhUL?: number; // Lactate Dehydrogenase (U/L)
  ferritinNgMl?: number;
  transferrinSaturationPercent?: number; // Độ bão hòa Transferrin % (>= 45% nghi ứ sắt)
  ceruloplasminMgDl?: number; // mg/dL (< 20 nghi bệnh Wilson)

  // Đánh giá xơ hóa chuyên sâu
  fibroScanLsmKpa?: number; // Đo độ đàn hồi mô gan (kPa)

  // Động học viêm gan rượu (cho Lille Model ngày 7)
  day7TotalBilirubin?: number; // Bilirubin ngày thứ 7 sau điều trị Prednisolone

  // Lâm sàng Child-Pugh
  ascites?: AscitesGrade;
  encephalopathy?: EncephalopathyGrade;

  // Siêu âm đường mật
  ultrasoundBiliaryDilatation?: UltrasoundBiliaryDilatation;

  // Tiêu chí nghi ngờ ngộ độc Paracetamol
  paracetamolIngestionHours?: number; // Số giờ sau uống
  paracetamolLevelMcgMl?: number; // Nồng độ mcg/mL (hoặc mg/L)
}

/**
 * Phân loại kiểu tổn thương (Pattern of Liver Injury) theo chỉ số R
 */
export type LiverInjuryPattern =
  | 'hepatocellular' // R > 5
  | 'cholestatic' // R < 2
  | 'mixed' // 2 <= R <= 5
  | 'isolated_hyperbilirubinemia' // Men gan bình thường, Bilirubin tăng
  | 'normal'; // Bình thường

export type TransaminaseSeverity =
  | 'normal'
  | 'borderline' // < 2x ULN
  | 'mild' // 2x - 5x ULN
  | 'moderate' // 5x - 15x ULN
  | 'severe' // > 15x ULN
  | 'massive'; // > 10,000 U/L

export type BilirubinPredominance =
  | 'unconjugated' // Gián tiếp > 80% (tán huyết, Gilbert, Crigler-Najjar)
  | 'conjugated' // Trực tiếp > 50% (ứ mật, tổn thương nhu mô)
  | 'mixed' // Hỗn hợp (20% - 50%)
  | 'normal';

export interface ChildPughResult {
  score: number;
  grade: 'A' | 'B' | 'C';
  oneYearSurvivalPercent: number;
  twoYearSurvivalPercent: number;
  surgicalMortalityRisk: string;
  drugDosingNote: string;
  breakdown: {
    bilirubinPoints: number;
    albuminPoints: number;
    inrPoints: number;
    ascitesPoints: number;
    encephalopathyPoints: number;
  };
}

export interface MeldResult {
  meldOriginal: number;
  meldNa?: number;
  meld30?: number;
  threeMonthMortalityPercent: number;
  transplantListingRecommended: boolean;
  interpretation: string;
}

export interface Fib4Result {
  score: number;
  riskCategory: 'low' | 'indeterminate' | 'high';
  stageDescription: string;
  recommendation: string;
  ageAdjustedNote?: string;
}

export interface ApriResult {
  score: number;
  riskCategory: 'low' | 'high';
  stageDescription: string;
  recommendation: string;
}

export interface MaddreyResult {
  dfScore: number;
  isSevere: boolean; // DF >= 32
  shortTermMortalityPercent: number;
  steroidIndicated: boolean;
  clinicalRecommendation: string;
}

export interface LilleResult {
  score: number;
  isResponder: boolean; // Score < 0.45: đáp ứng điều trị Corticoid
  survivalRate6MonthPercent: number;
  recommendation: string;
}

export interface KingsCollegeResult {
  criteriaMet: boolean;
  details: string[];
  recommendation: string;
}

export interface RumackMatthewResult {
  toxicityRisk: 'toxic' | 'non_toxic' | 'indeterminate';
  hoursSinceIngestion: number;
  paracetamolLevelMcgMl: number;
  treatmentLineCutoffMcgMl: number;
  nacRecommended: boolean;
  nac21HourIvRegimen: {
    loadingDose: string;
    secondDose: string;
    thirdDose: string;
    totalDose: string;
  };
}

export interface ClinicalRedFlag {
  id: string;
  title: string;
  severity: 'emergency' | 'warning' | 'caution';
  description: string;
  immediateAction: string;
}

export interface DifferentialDiagnosis {
  disease: string;
  likelihood: 'very_high' | 'high' | 'possible' | 'unlikely' | 'ruled_out';
  clues: string;
  confirmingTests: string;
  evidencePoints: string[];
}

export interface HepaAnalysisResult {
  timestamp: string;

  // Chuẩn hóa SI
  normalizedValues: {
    totalBilirubinMgDl: number;
    totalBilirubinUmolL: number;
    directBilirubinMgDl?: number;
    directBilirubinUmolL?: number;
    albuminGDl?: number;
    albuminGL?: number;
    creatinineMgDl?: number;
    creatinineUmolL?: number;
    plateletsKUl?: number;
  };

  // Kiểu tổn thương & Tỷ số
  rRatio: number;
  nRRatio?: number; // DILI max R
  pattern: LiverInjuryPattern;
  patternDescription: string;
  severity: TransaminaseSeverity;
  altMultiples: number;
  astMultiples: number;
  alpMultiples: number;
  ggtMultiples?: number;

  deRitisRatio: number; // AST / ALT
  deRitisInterpretation: string;

  bilirubinPredominance: BilirubinPredominance;
  conjugatedPercent?: number;

  // Các tỷ số chuyên sâu tự động
  astLdhRatio?: number;
  astLdhInterpretation?: string;
  wilsonRatioAlpBili?: number;
  wilsonSuspicion?: boolean;
  aihRatioAlpAst?: number;
  aihSuspicion?: boolean;
  hysLawMet?: boolean;
  boneAlpSuspicion?: boolean; // ALP tăng mà GGT bình thường

  // Thang điểm tiên lượng
  fib4?: Fib4Result;
  apri?: ApriResult;
  nfs?: NfsResult; // NAFLD Fibrosis Score
  childPugh?: ChildPughResult;
  meld?: MeldResult;
  maddrey?: MaddreyResult;
  lille?: LilleResult;
  kingsCollege?: KingsCollegeResult;
  rumackMatthew?: RumackMatthewResult;

  // Đánh giá chuyển hóa & An toàn thuốc & Ngoài gan
  sldClassification?: SldClassification; // Phân loại MASLD vs MetALD vs ALD (Consensus 2023)
  statinGuidance?: StatinSafetyGuidance; // Khuyến cáo an toàn Statin (BSG 2018 & BMJ 2025)
  extrahepaticAst?: ExtrahepaticAstEvaluation; // Đánh giá AST ngoài gan / Tiêu cơ vân
  isolatedAlpVitaminD?: IsolatedAlpVitaminDAdvice; // Tư vấn thiếu Vitamin D khi ALP xương đơn độc
  ilftReflex?: IlftReflexScreen; // Hệ thống đề xuất xét nghiệm phản xạ iLFT

  // Cảnh báo & Khuyến cáo
  redFlags: ClinicalRedFlag[];
  differentialDiagnoses: DifferentialDiagnosis[];
  stepByStepRecommendations: string[];
  referralTier: 'primary' | 'specialist' | 'emergency_transplant';
}

/**
 * Xét nghiệm tại một mốc thời gian cụ thể (Theo dõi chuỗi thời gian - Longitudinal Time Series)
 */
export interface TimePointLab {
  id: string;
  dayLabel: string; // vd: "D0 (Vào viện)", "D1", "D2", "D3", "D7"
  timestamp: string; // ISO date-time
  alt: number;
  ast: number;
  alp?: number;
  ggt?: number;
  totalBilirubin: number;
  directBilirubin?: number;
  inr?: number;
  albumin?: number;
  creatinine?: number;
  platelets?: number;
}

export type KineticPatternType =
  | 'rapid_halving_ischemic' // Men giảm >= 50% / 24-48h -> Gan sốc
  | 'viral_peak_lagging_bili' // Men đạt đỉnh rồi hạ, Bili tăng muộn sau -> Viêm gan virus cấp
  | 'choledocholithiasis_spike_drop' // Transaminase tăng vọt rồi rớt nhanh, ALP/Bili tăng dần -> Sỏi OMC
  | 'enzyme_bilirubin_dissociation_failure' // Men giảm đột ngột nhưng Bili/INR tăng vọt -> Mất khối tế bào gan / Suy gan cấp!
  | 'deritis_inversion_fibrosis' // Tỷ số AST/ALT chuyển từ <1 lên >1 qua các mốc -> Xơ gan tiến triển
  | 'improving' // Đang hồi phục đều
  | 'worsening' // Đang xấu đi
  | 'stable'; // Dao động ổn định

export interface KineticAnalysisResult {
  pattern: KineticPatternType;
  title: string;
  summary: string;
  clinicalImplication: string;
  altChangePercentPer24h?: number;
  astChangePercentPer24h?: number;
  estimatedAltHalfLifeHours?: number;
  isDissociationAlert: boolean; // Báo động phân ly men gan - chức năng tổng hợp
  trendSeries: {
    dayLabel: string;
    alt: number;
    ast: number;
    alp?: number;
    totalBilirubinMgDl: number;
    inr?: number;
    deRitis: number;
  }[];
}

/**
 * Thang điểm RUCAM (Roussel Uclaf Causality Assessment Method - 2016)
 */
export type RucamCausalityCategory =
  | 'highly_probable' // > 8 điểm
  | 'probable' // 6 - 8 điểm
  | 'possible' // 3 - 5 điểm
  | 'unlikely' // 1 - 2 điểm
  | 'excluded'; // <= 0 điểm

export interface RucamAssessmentInput {
  drugName: string;
  injuryType: 'hepatocellular' | 'cholestatic_or_mixed'; // Phân biệt dựa trên chỉ số R (> 5 vs <= 5)
  timeToOnsetDays: number; // Thời gian từ lúc bắt đầu uống thuốc đến khi men tăng
  hasPriorExposure: boolean; // Đã từng dùng thuốc này trước đây chưa
  timeFromStopToOnsetDays?: number; // Nếu đã dừng thuốc trước khi khởi phát triệu chứng
  courseAfterStoppingPercentDrop: number; // Mức giảm men gan sau khi ngừng thuốc: vd giảm >= 50% trong 8 ngày (hoặc 30 ngày)
  patientAge: number;
  hasAlcoholOrPregnancyRisk: boolean; // Rượu hoặc mang thai (cho thể ứ mật)
  concomitantDrugsCount: number; // Số thuốc dùng đồng thời có nguy cơ DILI
  otherCausesExcludedLevel: 'complete' | 'partial' | 'none'; // Đã loại trừ HAV, HBV, HCV, tắc mật, sốc gan, tự miễn...
  previousLiverToxClass: 'A' | 'B' | 'C' | 'D' | 'E' | 'unknown'; // Tra cứu LiverTox
  rechallengeResult?: 'positive' | 'negative' | 'not_done';
}

export interface RucamAssessmentResult {
  totalScore: number;
  category: RucamCausalityCategory;
  categoryLabelVi: string;
  breakdown: {
    timeToOnsetPoints: number;
    coursePoints: number;
    riskFactorPoints: number;
    concomitantDrugsPoints: number;
    exclusionPoints: number;
    previousInformationPoints: number;
    rechallengePoints: number;
  };
  recommendation: string;
}

/**
 * Phác đồ độc gan do Thuốc Lao (Anti-TB DILI) theo ATS/CDC & Bộ Y Tế
 */
export type AntiTbDiliAction =
  | 'continue_monitor' // Tiếp tục dùng & theo dõi sát
  | 'stop_all_immediately' // Ngừng ngay toàn bộ thuốc lao
  | 'rechallenge_ready' // Men đã hạ, sẵn sàng thử lại tuần tự
  | 'rechallenge_in_progress';

export interface AntiTbDiliDecision {
  action: AntiTbDiliAction;
  title: string;
  severityReason: string;
  isHyLawMet: boolean;
  temporaryBridgeRegimen?: string; // Phác đồ bắc cầu (Streptomycin, Ethambutol, Fluoroquinolone)
  rechallengeSteps: {
    dayRange: string;
    drug: string;
    doseInstruction: string;
    labCheckInstruction: string;
  }[];
  clinicalPearls: string[];
}

/**
 * Nguy cơ tái hoạt viêm gan B (HBV Reactivation Risk)
 */
export type HbvReactivationRiskLevel = 'high' | 'moderate' | 'low';

export interface HbvReactivationAssessment {
  riskLevel: HbvReactivationRiskLevel;
  riskPercentDescription: string;
  prophylaxisIndicated: boolean;
  recommendedAgent: string; // TDF, TAF hoặc Entecavir
  durationInstruction: string;
}

/**
 * NAFLD Fibrosis Score (NFS)
 */
export interface NfsResult {
  score: number;
  stage: string;
  stageDescription: string;
  ageAdjustedNote: string;
}

/**
 * Phân loại Bệnh Gan Thoái Hóa Mỡ (Steatotic Liver Disease - SLD Consensus 2023)
 */
export interface SldClassification {
  category: 'MASLD' | 'MetALD' | 'ALD' | 'Non-SLD' | 'Nghi ngờ';
  title: string;
  subtext: string;
  alcoholIntakeGramsPerWeek: number;
  alcoholThresholdNote: string;
  metabolicCriteriaMet: boolean;
  recommendations: string[];
}

/**
 * Hướng dẫn An Toàn Dùng Statin (BSG 2018 & BMJ 2025)
 */
export interface StatinSafetyGuidance {
  isSafe: boolean;
  badge: 'An toàn tiếp tục' | 'Cân nhắc giảm liều / Theo dõi' | 'Tạm ngưng & Đánh giá lại';
  title: string;
  recommendation: string;
  evidenceNote: string;
}

/**
 * Đánh giá Nguồn Gốc AST Ngoài Gan / Tiêu Cơ Vân
 */
export interface ExtrahepaticAstEvaluation {
  isTriggered: boolean;
  isRhabdo: boolean;
  title: string;
  note: string;
  recommendation: string;
}

/**
 * Tư Vấn Thiếu Vitamin D Khi Tăng ALP Xương Đơn Độc
 */
export interface IsolatedAlpVitaminDAdvice {
  isTriggered: boolean;
  recommendation: string;
}

/**
 * Phản xạ Xét nghiệm Thông minh iLFT (Reflex Liver Testing)
 */
export interface IlftRuleItem {
  name: string;
  code: string;
  targetAetiology: string;
  indication: string;
  priority: 'Bắt buộc (Tier 1)' | 'Mở rộng (Tier 2)' | 'Chuyên sâu';
}

export interface IlftReflexScreen {
  tier1StandardScreen: IlftRuleItem[];
  tier2ExtendedScreen: IlftRuleItem[];
  summary: string;
}

/**
 * Từ điển Chỉ số Sinh hóa Gan (Biomarker Dictionary)
 */
export interface BiomarkerInfo {
  id: string;
  code: string;
  nameVi: string;
  nameEn: string;
  category: 'Hepatocellular' | 'Cholestatic' | 'Bilirubin' | 'Synthetic' | 'Specialized' | 'Non-hepatic';
  normalRangeMale: string;
  normalRangeFemale: string;
  halfLife: string;
  cellularOrigin: string;
  physiologicalRole: string;
  causesOfElevation: string[];
  causesOfReduction?: string[];
  clinicalPearls: string[];
  testingPitfalls: string[];
}

/**
 * Chuyên đề Kiến thức Y khoa Lâm sàng (Reference Knowledge)
 */
export interface KnowledgeTopic {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  contentMarkdown: string;
  keyTakeaways: string[];
}

/**
 * Cây Quyết Định Lâm Sàng Tương Tác (Decision Trees)
 */
export interface DecisionNode {
  id: string;
  label: string;
  category: 'root' | 'decision' | 'diagnosis' | 'emergency';
  level: number;
  condition?: string;
  description: string;
  evidence: string[];
  immediateOrders: string[];
  clinicalPearls: string[];
  warning?: string;
  parentId?: string;
  childrenIds?: string[];
}

export interface DecisionTreeDefinition {
  id: string;
  title: string;
  subtitle: string;
  sourceGuideline: string;
  rootId: string;
  nodes: Record<string, DecisionNode>;
  mermaidCode: string;
}

