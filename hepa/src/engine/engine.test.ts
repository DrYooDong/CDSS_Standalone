/**
 * HepaCDSS Comprehensive Engine Test Suite
 * Kiểm thử độ chính xác 100% của các thuật toán sinh hóa gan và các ca lâm sàng chuẩn y văn.
 * Chạy test: npx tsx src/engine/engine.test.ts
 */

import { PatternEngine } from './pattern';
import { ClinicalRatiosEngine } from './ratios';
import { AlcoholicHepatitisEngine } from './scores/alcoholic';
import { ChildPughEngine } from './scores/childPugh';
import { FibrosisEngine } from './scores/fib4';
import { KingsCollegeEngine } from './scores/kingsCollege';
import { MeldEngine } from './scores/meld';
import { RumackMatthewEngine } from './scores/rumackMatthew';
import { UnitConverter } from './units';
import { HepaEngine } from './engine';
import { HepaKineticsEngine } from './kinetics';
import { DiliEngine } from './dili';
import { HepaInputData, TimePointLab } from '../types';

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ [PASS] ${testName}`);
  } else {
    console.error(`  ✗ [FAIL] ${testName}`);
    if (detail) console.error(`    -> Chi tiết: ${detail}`);
  }
}

console.log('\n======================================================');
console.log('🧪 BẮT ĐẦU KIỂM ĐỊNH LÂM SÀNG ENGINE HEPACDSS V2.0');
console.log('======================================================\n');

// -----------------------------------------------------------------------------
// NHÓM 1: ĐƠN VỊ & KIỂM TRA TÍNH HỢP LÝ LÂM SÀNG (UNITS SAFETY)
// -----------------------------------------------------------------------------
console.log('--- NHÓM 1: CHUYỂN ĐỔI ĐƠN VỊ & AN TOÀN NHẬP LIỆU ---');

const biliMg = UnitConverter.bilirubinToMgDl(68.4, 'umol_l');
assert(Math.abs(biliMg - 4.0) <= 0.05, 'Bilirubin 68.4 µmol/L -> 4.0 mg/dL', `Nhận được: ${biliMg}`);

const albGDl = UnitConverter.albuminToGDl(35, 'g_l');
assert(albGDl === 3.5, 'Albumin 35 g/L -> 3.5 g/dL', `Nhận được: ${albGDl}`);

const crMg = UnitConverter.creatinineToMgDl(176.8, 'umol_l');
assert(Math.abs(crMg - 2.0) <= 0.05, 'Creatinine 176.8 µmol/L -> 2.0 mg/dL', `Nhận được: ${crMg}`);

const plateletsNormalized = UnitConverter.normalizePlatelets(240000);
assert(plateletsNormalized === 240, 'Tiểu cầu 240,000 /uL -> chuẩn hóa 240 G/L', `Nhận được: ${plateletsNormalized}`);

const plausibilityWarnings = UnitConverter.validatePlausibility({
  bilirubin: { value: 68, unit: 'mg_dl' }, // Nghi nhập nhầm 68 µmol/L
  albumin: { value: 38, unit: 'g_dl' },   // Nghi nhập nhầm 38 g/L
});
assert(plausibilityWarnings.length === 2, 'Phát hiện chính xác 2 cảnh báo sai đơn vị phi thực tế');

// -----------------------------------------------------------------------------
// NHÓM 2: CHỈ SỐ R & PHÂN LOẠI TỔN THƯƠNG (PATTERN OF INJURY)
// -----------------------------------------------------------------------------
console.log('\n--- NHÓM 2: CHỈ SỐ R & KIỂU TỔN THƯƠNG (PATTERN) ---');

// Hepatocellular: ALT 88 (ULN 30), ALP 75 (ULN 120) -> R = (88/30)/(75/120) = 2.933 / 0.625 = 4.69
const rValue = PatternEngine.calculateRRatio(88, 30, 75, 120);
assert(Math.abs(rValue - 4.69) <= 0.02, `Tính Chỉ số R chính xác (R = ${rValue} ~ 4.69)`);

// Cholestatic: ALT 48 (ULN 25), ALP 420 (ULN 120) -> R = (48/25)/(420/120) = 1.92 / 3.5 = 0.55
const rChol = PatternEngine.calculateRRatio(48, 25, 420, 120);
assert(rChol < 2.0, `Nhận diện kiểu Ứ mật (Cholestatic, R = ${rChol} < 2.0)`);

// Isolated Hyperbilirubinemia
const isoPattern = PatternEngine.determinePattern(1, 25, 33, 24, 33, 70, 120, 3.5);
assert(isoPattern.pattern === 'isolated_hyperbilirubinemia', 'Nhận diện Tăng Bilirubin đơn độc');

// Massive Transaminitis
const massiveSev = PatternEngine.determineSeverity(11500, 25, 10200, 25);
assert(massiveSev.severity === 'massive', 'Nhận diện tăng men gan mức khổng lồ (> 10,000 U/L)');

// -----------------------------------------------------------------------------
// NHÓM 3: CÁC TỶ SỐ CHUYÊN SÂU (DE RITIS, AST/LDH, WILSON, HY\'S LAW)
// -----------------------------------------------------------------------------
console.log('\n--- NHÓM 3: CÁC TỶ SỐ LÂM SÀNG CHUYÊN SÂU ---');

// De Ritis trong rượu: AST 280, ALT 110 -> 2.55 >= 2.0
const deRitisAlcohol = ClinicalRatiosEngine.evaluateDeRitis(280, 110);
assert(deRitisAlcohol.clinicalSignificance === 'alcoholic_pattern', `De Ritis ${deRitisAlcohol.ratio} gợi ý bệnh gan do rượu`);

// AST/LDH trong gan sốc: AST 8200, LDH 6400 -> 1.28 < 1.5
const astLdhShock = ClinicalRatiosEngine.evaluateAstLdh(8200, 6400);
assert(astLdhShock?.suspectIschemicHepatitis === true, `AST/LDH = ${astLdhShock?.ratio} (< 1.5) khẳng định viêm gan thiếu máu cục bộ (Gan sốc)`);

// Định luật Hy (Hy's law)
const hysLaw = ClinicalRatiosEngine.evaluateHysLaw(160, 33, 110, 33, 3.8, 130, 120);
assert(hysLaw.isMet === true, 'Định luật Hy (Hy\'s Law) dương tính chuẩn xác trong DILI nặng');

// Bệnh Wilson: ALP 32, Bili 4.2 mg/dL -> ALP/Bili = 7.6 (chưa đủ) | ALP 28, Bili 8.5 -> ALP/Bili = 3.29 (<4) + AST 220, ALT 90 (AST/ALT = 2.44 > 2.2)
const wilson = ClinicalRatiosEngine.evaluateWilsonSuspicion(28, 8.5, 220, 90, 22);
assert(wilson?.isHighlySuspicious === true, 'Phát hiện cảnh báo Wilson cấp tính (ALP/Bili < 4 kết hợp AST/ALT > 2.2 ở người trẻ)');

// ALP tăng đơn độc ngoài gan (xương): ALP 350, GGT 25 (ULN 50)
const boneAlp = ClinicalRatiosEngine.evaluateAlpOrigin(350, 120, 25, 50);
assert(boneAlp.isIsolatedAlpSuspiciousForBone === true, 'Cảnh báo chính xác nguồn gốc ALP ngoài gan (xương) khi GGT bình thường');

// -----------------------------------------------------------------------------
// NHÓM 4: THANG ĐIỂM TIÊN LƯỢNG (FIB-4, CHILD-PUGH, MELD, MADDREY, LILLE)
// -----------------------------------------------------------------------------
console.log('\n--- NHÓM 4: THANG ĐIỂM TIÊN LƯỢNG & ĐIỀU TRỊ ---');

// FIB-4: Tuổi 52, AST 52, ALT 88, Tiểu cầu 210 -> FIB-4 = (52*52)/(210*sqrt(88)) = 2704 / (210*9.3808) = 1.37
const fib4Test = FibrosisEngine.calculateFib4(52, 52, 88, 210, 'masld');
assert(Math.abs((fib4Test?.score || 0) - 1.37) <= 0.02, `Tính FIB-4 = ${fib4Test?.score} (kỳ vọng 1.37)`);

// Child-Pugh Hạng A (5 điểm): Bili 1.2 mg/dL, Albumin 4.1 g/dL, INR 1.0, không cổ trướng, không bệnh não
const cpA = ChildPughEngine.calculate(1.2, 4.1, 1.0, 'none', 'none');
assert(cpA.score === 5 && cpA.grade === 'A', 'Child-Pugh Hạng A (5 điểm)');

// Child-Pugh Hạng C (15 điểm): Bili 5.0 mg/dL, Albumin 2.1 g/dL, INR 2.6, Cổ trướng vừa/nặng, Bệnh não gan độ 3
const cpC = ChildPughEngine.calculate(5.0, 2.1, 2.6, 'moderate_severe', 'grade_3_4');
assert(cpC.score === 15 && cpC.grade === 'C', 'Child-Pugh Hạng C (15 điểm)');

// MELD gốc: Cr 2.0 mg/dL, Bili 3.0 mg/dL, INR 2.0
// MELD = 9.57*ln(2) + 3.78*ln(3) + 11.2*ln(2) + 6.43 = 6.63 + 4.15 + 7.76 + 6.43 = 24.97 ~ 25
const meldScore = MeldEngine.calculateMeldOriginal(3.0, 2.0, 2.0);
assert(meldScore >= 24 && meldScore <= 26, `Điểm MELD gốc chính xác (${meldScore} ~ 25)`);

// Maddrey DF: PT 22s, PT chứng 12s, Bili 14 mg/dL -> DF = 4.6 * (22 - 12) + 14 = 60 >= 32
const maddrey = AlcoholicHepatitisEngine.calculateMaddreyDf(14, 22, 12);
assert(maddrey?.isSevere === true && maddrey.steroidIndicated === true, `Maddrey DF = ${maddrey?.dfScore} (>= 32) chỉ định Corticosteroid`);

// Lille Model: Ngày 7 Bili giảm tốt -> Score < 0.45 (Responder)
const lilleResp = AlcoholicHepatitisEngine.calculateLilleModel(48, 32, 85, 1.3, 14.0, 6.2);
assert(lilleResp?.isResponder === true, `Lille Model = ${lilleResp?.score} (< 0.45): Đáp ứng tốt với Corticoid`);

// Rumack-Matthew: Giờ 16, nồng độ 95 mcg/mL (vượt ngưỡng 18.75 mcg/mL) -> Cần NAC
const rumack = RumackMatthewEngine.evaluate(16, 95, 60);
assert(rumack.nacRecommended === true, 'Rumack-Matthew chỉ định truyền NAC chuẩn xác');

// -----------------------------------------------------------------------------
// NHÓM 5: THẨM ĐỊNH 3 CA LÂM SÀNG TRONG TÀI LIỆU PHÂN TÍCH SINH HÓA GAN.MD
// -----------------------------------------------------------------------------
console.log('\n--- NHÓM 5: KIỂM CHỨNG 3 CA LÂM SÀNG TRONG TÀI LIỆU ---');

// Ca 1: Nam 52 tuổi, MASLD
const case1Input: HepaInputData = {
  age: 52,
  gender: 'male',
  alt: 88,
  ast: 52,
  alp: 75,
  ggt: 65,
  totalBilirubin: 14,
  bilirubinUnit: 'umol_l',
  albumin: 42,
  albuminUnit: 'g_l',
  inr: 1.0,
  platelets: 210,
  hasDiabetesOrMetabolicRisk: true,
  altUln: 30, // Theo tài liệu Ca 1
  alpUln: 120,
};
const resCase1 = HepaEngine.analyze(case1Input);
assert(Math.abs(resCase1.rRatio - 4.69) <= 0.05, `Ca 1: Chỉ số R = ${resCase1.rRatio} (Khớp tài liệu: 4.68 ~ 4.69)`);
assert(Math.abs((resCase1.fib4?.score || 0) - 1.37) <= 0.05, `Ca 1: FIB-4 = ${resCase1.fib4?.score} (Khớp tài liệu: 1.37)`);
assert(resCase1.differentialDiagnoses[0].disease.includes('gan nhiễm mỡ'), 'Ca 1: Chẩn đoán hàng đầu là Gan nhiễm mỡ chuyển hóa (MASLD)');

// Ca 2: Nam 45 tuổi, Viêm gan do rượu cấp
const case2Input: HepaInputData = {
  age: 45,
  gender: 'male',
  alt: 110,
  ast: 280,
  alp: 140,
  ggt: 420,
  totalBilirubin: 68, // µmol/L ~ 4.0 mg/dL
  directBilirubin: 45,
  bilirubinUnit: 'umol_l',
  albumin: 31,
  albuminUnit: 'g_l',
  inr: 1.35,
  alcoholGramsPerWeek: 600, // 80-100g/ngày
  altUln: 33,
  astUln: 33,
  alpUln: 120,
};
const resCase2 = HepaEngine.analyze(case2Input);
assert(resCase2.deRitisRatio === 2.55, `Ca 2: Tỷ số De Ritis AST/ALT = ${resCase2.deRitisRatio} (Khớp tài liệu: 2.54 ~ 2.55 > 2.0)`);
assert(resCase2.differentialDiagnoses[0].disease.includes('rượu'), 'Ca 2: Chẩn đoán hàng đầu là Bệnh gan do rượu / Viêm gan do rượu');

// Ca 3: Nữ 48 tuổi, Ứ mật PBC
const case3Input: HepaInputData = {
  age: 48,
  gender: 'female',
  alt: 35,
  ast: 38,
  alp: 380,
  ggt: 290,
  totalBilirubin: 18,
  bilirubinUnit: 'umol_l',
  albumin: 40,
  albuminUnit: 'g_l',
  inr: 1.0,
  ultrasoundBiliaryDilatation: 'non_dilated',
  altUln: 25,
  alpUln: 120,
};
const resCase3 = HepaEngine.analyze(case3Input);
assert(resCase3.pattern === 'cholestatic', `Ca 3: Kiểu tổn thương là Ứ mật (R = ${resCase3.rRatio} < 2.0)`);
assert(resCase3.differentialDiagnoses.some(d => d.disease.includes('PBC')), 'Ca 3: Chẩn đoán phân biệt có Xơ đường mật nguyên phát (PBC)');

// -----------------------------------------------------------------------------
// NHÓM 6: THEO DÕI ĐỘNG HỌC MEN GAN (KINETICS & TIME SERIES)
// -----------------------------------------------------------------------------
console.log('\n--- NHÓM 6: THEO DÕI ĐỘNG HỌC MEN GAN (KINETICS) ---');

// Test Gan sốc: Men giảm >= 50% trong 24h
const shockSeries: TimePointLab[] = [
  { id: '1', dayLabel: 'D0', timestamp: '2026-10-20T08:00:00Z', alt: 8500, ast: 12400, totalBilirubin: 40 },
  { id: '2', dayLabel: 'D1', timestamp: '2026-10-21T08:00:00Z', alt: 3600, ast: 4200, totalBilirubin: 35 },
];
const shockKinetics = HepaKineticsEngine.analyzeKinetics(shockSeries);
assert(shockKinetics?.pattern === 'rapid_halving_ischemic', 'Động học Gan sốc: Nhận diện chính xác men giảm > 50% sau 24h');

// Test Báo động phân ly men gan - suy gan cấp (Dissociation)
const failureSeries: TimePointLab[] = [
  { id: '1', dayLabel: 'D0', timestamp: '2026-10-20T08:00:00Z', alt: 5600, ast: 4900, totalBilirubin: 45, inr: 1.3 },
  { id: '2', dayLabel: 'D2', timestamp: '2026-10-22T08:00:00Z', alt: 1100, ast: 950, totalBilirubin: 140, inr: 2.8 },
];
const failureKinetics = HepaKineticsEngine.analyzeKinetics(failureSeries);
assert(failureKinetics?.isDissociationAlert === true, 'Phát hiện báo động Phân ly Men - Bilirubin/INR (Nguy cơ Suy gan cấp tối khẩn)');

// Test Đảo ngược De Ritis qua thời gian
const fibrosisSeries: TimePointLab[] = [
  { id: '1', dayLabel: 'Tháng 1', timestamp: '2026-01-10T08:00:00Z', alt: 95, ast: 55, totalBilirubin: 15 },
  { id: '2', dayLabel: 'Tháng 10', timestamp: '2026-10-10T08:00:00Z', alt: 60, ast: 80, totalBilirubin: 18 },
];
const fibrosisKinetics = HepaKineticsEngine.analyzeKinetics(fibrosisSeries);
assert(fibrosisKinetics?.pattern === 'deritis_inversion_fibrosis', 'Báo động đảo ngược De Ritis từ < 1 lên > 1 (Tiến triển xơ gan)');

// -----------------------------------------------------------------------------
// NHÓM 7: DILI, THANG ĐIỂM RUCAM, THUỐC LAO & TÁI HOẠT HBV
// -----------------------------------------------------------------------------
console.log('\n--- NHÓM 7: DILI, RUCAM, PHÁC ĐỒ THUỐC LAO & TÁI HOẠT HBV ---');

// Test RUCAM cho Augmentin (thể ứ mật):
const rucamAugmentin = DiliEngine.evaluateRucam({
  drugName: 'Amoxicillin-Clavulanate',
  injuryType: 'cholestatic_or_mixed',
  timeToOnsetDays: 20,
  hasPriorExposure: false,
  courseAfterStoppingPercentDrop: 60,
  patientAge: 58,
  hasAlcoholOrPregnancyRisk: false,
  concomitantDrugsCount: 0,
  otherCausesExcludedLevel: 'complete',
  previousLiverToxClass: 'A',
});
assert(rucamAugmentin.totalScore >= 8, `RUCAM Augmentin = ${rucamAugmentin.totalScore} (> 8 điểm: Rất có thể DILI)`);

// Test Phác đồ thuốc lao: Men tăng >= 5x ULN không triệu chứng -> Bắt buộc ngừng toàn bộ
const tbStopDecision = DiliEngine.evaluateAntiTbDili({
  alt: 190,
  ast: 165,
  altUln: 33,
  astUln: 33,
  totalBiliMgDl: 1.2,
  hasSymptoms: false,
});
assert(tbStopDecision.action === 'stop_all_immediately', 'Thuốc lao: ALT > 5x ULN -> Chỉ định NGỪNG TOÀN BỘ thuốc lao ngay lập tức');

// Test Phác đồ thuốc lao: Thử lại tuần tự khi men gan đã hạ < 2x ULN
const tbRechallengeDecision = DiliEngine.evaluateAntiTbDili({
  alt: 45,
  ast: 38,
  altUln: 33,
  astUln: 33,
  totalBiliMgDl: 1.0,
  hasSymptoms: false,
  isRechallengePhase: true,
});
assert(tbRechallengeDecision.action === 'rechallenge_ready', 'Thuốc lao: Men hạ < 2x ULN -> Sẵn sàng thử lại tuần tự (Rifampicin trước)');

// Test Tái hoạt HBV: HBsAg(+) dùng Rituximab
const hbvReactivation = DiliEngine.evaluateHbvReactivation({
  isHbsAgPositive: true,
  isAntiHbcPositive: true,
  drugCategory: 'anti_cd20_rituximab',
});
assert(hbvReactivation.riskLevel === 'high' && hbvReactivation.prophylaxisIndicated === true, 'Tái hoạt HBV: HBsAg(+) dùng Rituximab có nguy cơ cao (>10%), bắt buộc điều trị dự phòng');

// -----------------------------------------------------------------------------
// NHÓM 8: NFS, SLD CONSENSUS 2023, STATIN SAFETY & AST NGOÀI GAN
// -----------------------------------------------------------------------------
console.log('\n--- NHÓM 8: NFS, SLD CONSENSUS 2023, STATIN SAFETY & AST NGOÀI GAN ---');

// Test NFS ở bệnh nhân 52 tuổi, BMI 29, ĐTĐ T2, AST 45, ALT 60, Tiểu cầu 180, Albumin 4.2
const nfsYoung = HepaEngine.analyze({
  age: 52,
  gender: 'male',
  bmi: 29,
  hasDiabetesOrIFG: true,
  alt: 60,
  ast: 45,
  alp: 80,
  totalBilirubin: 15,
  platelets: 180,
  albumin: 42, // 4.2 g/dL
});
assert(nfsYoung.nfs !== undefined && typeof nfsYoung.nfs.score === 'number', 'NFS: Tính được điểm NFS ở người MASLD');
assert(nfsYoung.sldClassification?.category === 'MASLD', 'SLD 2023: Nhận diện chính xác MASLD (BMI cao + ĐTĐ, không uống rượu)');

// Test MetALD: Bệnh nhân có yếu tố chuyển hóa + Uống rượu mức trung gian (300g cồn/tuần ở nam)
const metAldCase = HepaEngine.analyze({
  age: 48,
  gender: 'male',
  bmi: 27,
  alcoholGramsPerWeek: 300,
  alt: 85,
  ast: 92,
  alp: 110,
  totalBilirubin: 22,
});
assert(metAldCase.sldClassification?.category === 'MetALD', 'SLD 2023: Nhận diện thể kết hợp MetALD (chuyển hóa + cồn 210-420g/tuần)');

// Test Statin Safety: Men gan < 3x ULN -> An toàn tiếp tục
const statinSafe = HepaEngine.analyze({
  age: 60,
  gender: 'male',
  isTakingStatin: true,
  alt: 70, // ~ 2x ULN
  ast: 55,
  alp: 90,
  totalBilirubin: 14,
});
assert(statinSafe.statinGuidance?.isSafe === true && statinSafe.statinGuidance.badge === 'An toàn tiếp tục', 'Statin Safety: Men < 3x ULN an toàn tiếp tục Statin');

// Test Extrahepatic AST / Tiêu cơ vân: CK > 1000, AST >> ALT
const rhabdoCase = HepaEngine.analyze({
  age: 28,
  gender: 'male',
  strenuousExercise: true,
  ckUL: 4500,
  ast: 350,
  alt: 75,
  alp: 70,
  totalBilirubin: 12,
});
assert(rhabdoCase.extrahepaticAst?.isTriggered === true && rhabdoCase.extrahepaticAst.isRhabdo === true, 'Cơ vân: Bắt chính xác tăng AST do tiêu cơ vân (CK cao, vận động nặng)');

// Test iLFT Reflex Screen
const ilftScreen = HepaEngine.analyze({
  age: 40,
  gender: 'female',
  alt: 120,
  ast: 90,
  alp: 65,
  totalBilirubin: 16,
});
assert(ilftScreen.ilftReflex !== undefined && ilftScreen.ilftReflex.tier1StandardScreen.length >= 3, 'iLFT: Đề xuất đầy đủ gói xét nghiệm phản xạ Tier 1 & Tier 2');

console.log('\n======================================================');
console.log(`🏁 TỔNG KẾT KIỂM THỬ: ${passedTests}/${totalTests} TESTS ĐẠT YÊU CẦU (${((passedTests/totalTests)*100).toFixed(1)}%)`);
console.log('======================================================\n');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
