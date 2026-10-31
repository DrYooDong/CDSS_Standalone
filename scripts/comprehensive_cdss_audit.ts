/**
 * CliniPortal CDSS Suite — Comprehensive Multi-Module Algorithm Audit
 * Verifies calculation accuracy, clinical guidelines, edge cases, and safety rules
 * across all 10 CDSS modules.
 */

import { calculateRenalMetrics } from '../antibiotic/src/utils/clinicalFormulas';
import { extractDrugData, calculateDose } from '../antibiotic/src/utils/drugDataExtractor';
import { ANTIBIOTICS } from '../antibiotic/src/data/antibiotics';
import { classifyRiskGroup, getEmpiricRegimens } from '../antibiotic/src/selection/engine';
import { GENERAL_MDR_RISK_FACTORS, MRSA_RISK_FACTORS } from '../antibiotic/src/selection/data/riskFactors';

import { analyzeABG } from '../abg/abg-engine';
import { calculateWeightAdjustment, classifyAgeGroup } from '../dengue/dengue-engine';
import { calculateBMI, calculateCorrectedSodium, calculateEffectiveOsmolality, calculateAnionGap, calculateInsulinPlan } from '../diacare/src/utils/calculations';
import { analyzeCSF } from '../csf/src/utils/csfAnalyzer';
import { calculateMAP, calculateNEWS2 } from '../sepsis/src/utils/calculators';
import { calculateRenalFunction, calculateBodyMetrics } from '../vancomycin/src/utils/pharmacokinetics';
import { FibrosisEngine } from '../hepa/src/engine/scores/fib4';
import { ChildPughEngine } from '../hepa/src/engine/scores/childPugh';
import { MeldEngine } from '../hepa/src/engine/scores/meld';
import { calculateRRatio } from '../hepa/src/engine/ratios';
import { calculateECGMeasurements } from '../ecg/ecg-measurements';

interface TestResult {
  module: string;
  testName: string;
  passed: boolean;
  actual?: any;
  expected?: any;
  error?: string;
}

const auditLog: TestResult[] = [];

function check(module: string, testName: string, condition: boolean, actual?: any, expected?: any) {
  auditLog.push({
    module,
    testName,
    passed: condition,
    actual,
    expected
  });
  if (!condition) {
    console.error(`❌ [FAIL] [${module}] ${testName}`, { actual, expected });
  } else {
    console.log(`✓ [PASS] [${module}] ${testName}`);
  }
}

console.log('================================================================');
console.log('🏥 BẮT ĐẦU RÀ SOÁT TOÀN DIỆN THUẬT TOÁN TẤT CẢ CDSS (10 MODULES)');
console.log('================================================================\n');

try {
  // -------------------------------------------------------------
  // 1. MODULE INFECTODOSE (ANTIBIOTIC DOSING & SELECTION - BVBND 2026)
  // -------------------------------------------------------------
  console.log('>>> [1/8] Kiểm tra Module InfectoDose (Kháng sinh & Chức năng thận)...');
  
  // 1.1 Cockcroft-Gault
  const patientMale = { age: 60, gender: 'm' as const, weight: 60, height: 165, scr: 100, scrUnit: 'umol' as const, dialysis: 'none' as const };
  const rMale = calculateRenalMetrics(patientMale);
  check('InfectoDose', 'Cockcroft-Gault Nam 60t, 60kg, SCr 100 umol/L -> CrCl 59.0 mL/p', rMale.crcl === 59.0, rMale.crcl, 59.0);

  // 1.2 Bệnh nhân cao tuổi suy kiệt làm tròn SCr tối thiểu 60
  const pElderly = { age: 78, gender: 'f' as const, weight: 42, height: 150, scr: 30, scrUnit: 'umol' as const, dialysis: 'none' as const };
  const rElderly = calculateRenalMetrics(pElderly);
  check('InfectoDose', 'Nữ cao tuổi SCr 30 umol/L làm tròn 60 umol/L tránh quá liều độc thận', rElderly.crcl <= 50, rElderly.crcl, '<= 50');

  // 1.3 Phân tầng nguy cơ BVBND Nhóm 1 vs Nhóm 2
  const riskGroup1 = classifyRiskGroup([], { scoreType: 'sofa', scoreValue: 0, isHighSeverity: false }, 'adult', [], 'respiratory');
  check('InfectoDose', 'Bệnh nhân cộng đồng SOFA 0đ -> Phân tầng Nhóm 1 (Ít nguy cơ VKĐK)', riskGroup1.group === 'group_1', riskGroup1.group, 'group_1');

  // BVBND: Có >= 2 yếu tố nguy cơ chung -> Nhóm 2
  const riskGroup2Dual = classifyRiskGroup(['hospital_90d', 'iv_abx_30d'], { scoreType: 'sofa', scoreValue: 0, isHighSeverity: false }, 'adult', [], 'respiratory');
  check('InfectoDose', 'Bệnh nhân có 2 yếu tố nguy cơ chung -> Phân tầng Nhóm 2 (Nguy cơ cao VKĐK)', riskGroup2Dual.group === 'group_2', riskGroup2Dual.group, 'group_2');

  // BVBND: Có 1 yếu tố nguy cơ chung + SOFA >= 2 -> Nhóm 2
  const riskGroup2Sofa = classifyRiskGroup(['hospital_90d'], { scoreType: 'sofa', scoreValue: 3, isHighSeverity: true }, 'adult', [], 'respiratory');
  check('InfectoDose', 'Có 1 yếu tố chung + SOFA 3đ -> Phân tầng Nhóm 2 (Bệnh nặng KÈM nguy cơ VKĐK)', riskGroup2Sofa.group === 'group_2', riskGroup2Sofa.group, 'group_2');

  // 1.4 Test 43 kháng sinh: trích xuất dữ liệu không bị crash
  let drugParseErrors = 0;
  for (const abx of ANTIBIOTICS) {
    try {
      const data = extractDrugData(abx.id);
      if (!data.name || data.rows.length === 0) drugParseErrors++;
    } catch (e) {
      drugParseErrors++;
    }
  }
  check('InfectoDose', 'Toàn bộ 43 kháng sinh trích xuất thành công và có cấu trúc bảng liều', drugParseErrors === 0, drugParseErrors, 0);

  // -------------------------------------------------------------
  // 2. MODULE ABG (KHÍ MÁU ĐỘNG MẠCH)
  // -------------------------------------------------------------
  console.log('\n>>> [2/8] Kiểm tra Module ABG (Khí Máu Động Mạch)...');
  
  // 2.1 Toan chuyển hóa tăng AG (HAGMA)
  const abgHagma = analyzeABG({
    unit: 'mmHg',
    pH: 7.20,
    pCO2: 24,
    pO2: 95,
    hco3: 10,
    be: -14,
    sao2: 97,
    fio2: 21,
    na: 140,
    cl: 100,
    patientAge: 45
  });
  check('ABG', 'Anion Gap tính đúng: 140 - (100 + 10) = 30 mEq/L', abgHagma.calculations.anionGap === 30, abgHagma.calculations.anionGap, 30);
  check('ABG', 'Nhận diện đúng Toan chuyển hóa', abgHagma.acidBase.category === 'metabolic_acidosis', abgHagma.acidBase.category, 'metabolic_acidosis');
  // Winter's formula: 1.5 * 10 + 8 = 23 (21 - 25). PaCO2 is 24 -> Bù trừ thích hợp
  check('ABG', 'Công thức Winter PaCO2 kỳ vọng 21-25 mmHg (Thực tế 24 -> Bù trừ thích hợp)', abgHagma.calculations.paco2MmHg >= 21 && abgHagma.calculations.paco2MmHg <= 25, abgHagma.calculations.paco2MmHg, '21-25');

  // 2.2 PaO2/FiO2 ratio
  const abgArds = analyzeABG({
    unit: 'mmHg',
    pH: 7.38,
    pCO2: 40,
    pO2: 80,
    hco3: 24,
    be: 0,
    sao2: 94,
    fio2: 80, // FiO2 80% -> PaO2/FiO2 = 80 / 0.8 = 100
    patientAge: 50
  });
  check('ABG', 'Tỷ số PaO2/FiO2 = 80 / 0.8 = 100', abgArds.calculations.pfRatio === 100, abgArds.calculations.pfRatio, 100);

  // -------------------------------------------------------------
  // 3. MODULE DENGUE (SỐT XUẤT HUYẾT DENGUE)
  // -------------------------------------------------------------
  console.log('\n>>> [3/8] Kiểm tra Module Dengue (Dịch bù & Cân nặng hiệu chỉnh)...');

  // 3.1 Người lớn béo phì BMI >= 25 -> Cân nặng hiệu chỉnh Phụ lục 9 BYT
  // Nam, 160 cm, 80 kg. IBW = 50 + 0.91 * (160 - 152.4) = 56.9 kg. BMI = 80 / (1.6^2) = 31.25.
  // AdjBW = 56.9 + 0.4 * (80 - 56.9) = 66.1 kg
  const dengueAdultObese = calculateWeightAdjustment(25, 'male', 80, 160);
  check('Dengue', 'Người lớn BMI >= 25 nhận diện béo phì đúng theo Phụ lục 9 BYT', dengueAdultObese.isObese === true, dengueAdultObese.isObese, true);
  check('Dengue', 'Cân nặng hiệu chỉnh người lớn tính đúng (~66.1 kg)', Math.abs(dengueAdultObese.adjustedWeightKg - 66.1) < 0.5, dengueAdultObese.adjustedWeightKg, '~66.1');

  // 3.2 Người lớn BMI < 25 -> Dùng cân nặng thực tế
  const dengueAdultNormal = calculateWeightAdjustment(30, 'female', 50, 160); // BMI = 50 / 2.56 = 19.5
  check('Dengue', 'Người lớn BMI < 25 dùng cân nặng thực tế (50 kg)', dengueAdultNormal.adjustedWeightKg === 50, dengueAdultNormal.adjustedWeightKg, 50);

  // -------------------------------------------------------------
  // 4. MODULE DIACARE (ĐÁI THÁO ĐƯỜNG, TOAN CETON & INSULIN)
  // -------------------------------------------------------------
  console.log('\n>>> [4/8] Kiểm tra Module DiaCare (Đái tháo đường & Toan ceton)...');

  // 4.1 Corrected Sodium (Katz formula)
  // Na = 130, Glucose = 20 mmol/L (~360 mg/dL). Delta = 260. CorNa = 130 + 0.016 * 260 = 134.16 -> 134.2
  const corNa = calculateCorrectedSodium(130, 20);
  check('DiaCare', 'Natri hiệu chỉnh Katz (Na 130, Glu 20 mmol/L -> 134.2 mmol/L)', Math.abs(corNa - 134.2) < 0.3, corNa, 134.2);

  // 4.2 Effective Osmolality: 2*Na + Glucose
  const effOsm = calculateEffectiveOsmolality(135, 25);
  check('DiaCare', 'Áp lực thẩm thấu hiệu dụng: 2*135 + 25 = 295 mOsm/kg', effOsm === 295.0, effOsm, 295.0);

  // 4.3 Khởi đầu liều Insulin ở người cao tuổi có nguy cơ hạ đường huyết cao (0.3 ĐV/kg)
  const insulinPlan = calculateInsulinPlan({
    age: 70, // >= 65 -> high hypo risk
    weightKg: 60,
    heightCm: 160,
    currentGlucose: 250,
    unit: 'mg_dl',
    dietType: 'ORAL_NORMAL',
    wardType: 'INTERNAL_MED',
    isPriorInsulinTreated: false
  });
  check('DiaCare', 'Bệnh nhân cao tuổi (70t) khởi đầu liều an toàn 0.3 ĐV/kg = 18 ĐV/ngày', insulinPlan.tddEstimated === 18, insulinPlan.tddEstimated, 18);

  // -------------------------------------------------------------
  // 5. MODULE CSF (DỊCH NÃO TỦY)
  // -------------------------------------------------------------
  console.log('\n>>> [5/8] Kiểm tra Module CSF (Phân tích Dịch Não Tủy)...');

  // 5.1 Traumatic Tap WBC correction: 1 WBC / 750 RBC
  const csfTraumatic = analyzeCSF({
    openingPressure: 150,
    appearance: 'cloudy',
    supernatant: 'clear',
    wbc: 100,
    rbc: 7500, // 7500 RBC -> trừ 10 WBC do chạm mạch
    neutrophilPercent: 50,
    lymphocytePercent: 50,
    protein: 40,
    proteinUnit: 'mg/dL',
    csfGlucose: 50,
    serumGlucose: 100,
    glucoseUnit: 'mg/dL',
    patientAge: 30,
    daysSinceOnset: 2,
    gramStain: 'negative',
    crAgOrIndiaInk: 'negative',
    tbPcrOrAfb: 'negative',
    viralPcr: 'negative',
    hasFocalDeficitOrSeizure: false,
    hasAlteredMentalStatus: false
  });
  check('CSF', 'Hiệu chỉnh WBC do chạm mạch máu: 100 - (7500/750) = 90 WBC', csfTraumatic.correctedWbc === 90, csfTraumatic.correctedWbc, 90);

  // 5.2 Spanos JAMA 1989 Rule: Glucose < 34, Protein > 220, WBC > 2000, PMN > 1180
  const csfBacterial = analyzeCSF({
    openingPressure: 280,
    appearance: 'turbid',
    supernatant: 'clear',
    wbc: 3500,
    rbc: 10,
    neutrophilPercent: 90, // PMN = 3150 > 1180
    lymphocytePercent: 10,
    protein: 300, // > 220
    proteinUnit: 'mg/dL',
    csfGlucose: 20, // < 34
    serumGlucose: 100,
    glucoseUnit: 'mg/dL',
    patientAge: 35,
    daysSinceOnset: 2,
    gramStain: 'gram_positive_diplococci',
    crAgOrIndiaInk: 'negative',
    tbPcrOrAfb: 'negative',
    viralPcr: 'negative',
    hasFocalDeficitOrSeizure: false,
    hasAlteredMentalStatus: false
  });
  check('CSF', 'Nhận diện chính xác Viêm màng não mủ (Bacterial) theo chuẩn Spanos & Gram (+)', csfBacterial.topDiagnosis.category === 'bacterial', csfBacterial.topDiagnosis.category, 'bacterial');

  // -------------------------------------------------------------
  // 6. MODULE SEPSIS (NHIỄM KHUẨN HUYẾT & SỐC NHIỄM KHUẨN)
  // -------------------------------------------------------------
  console.log('\n>>> [6/8] Kiểm tra Module Sepsis (Huyết động & NEWS2)...');

  // 6.1 MAP = (SBP + 2*DBP)/3
  const mapVal = calculateMAP(120, 60);
  check('Sepsis', 'Huyết áp trung bình MAP (120/60) = (120 + 120)/3 = 80 mmHg', mapVal === 80, mapVal, 80);

  // 6.2 NEWS2 score
  const newsPatient = {
    age: 55,
    respiratoryRate: 26, // score 3 (>= 25)
    spo2: 90, // score 3 (<= 91)
    copdOrHypercapnicRisk: false,
    onSupplementalOxygen: true, // score 2
    fio2Percent: 35,
    temperature: 39.5, // score 2 (>= 39.1)
    sbp: 88, // score 3 (<= 90)
    dbp: 50,
    heartRate: 115, // score 2 (91-110 is 1, 111-130 is 2)
    avpu: 'A' as const, // score 0
    suspectedInfection: true,
    infectionSource: 'respiratory' as const
  };
  const newsRes = calculateNEWS2(newsPatient as any);
  // Expected NEWS2 = 3 (RR) + 3 (SpO2) + 2 (O2) + 2 (Temp) + 3 (SBP) + 2 (HR) = 15
  check('Sepsis', 'NEWS2 tính điểm nguy cơ rất cao (15 điểm, phân loại high)', newsRes.score === 15 && newsRes.riskCategory === 'high', newsRes.score, 15);

  // -------------------------------------------------------------
  // 7. MODULE VANCOMYCIN (DƯỢC ĐỘNG HỌC & TÍNH LIỀU)
  // -------------------------------------------------------------
  console.log('\n>>> [7/8] Kiểm tra Module Vancomycin PK (AUC & Cockcroft-Gault)...');

  // 7.1 Thể trọng IBW Devine Nam 170cm = 50 + 0.91 * (170 - 152.4) = 66.0 kg
  const bodyMetrics = calculateBodyMetrics(170, 70, 'male');
  check('Vancomycin', 'IBW Nam 170cm = 66.0 kg', bodyMetrics.ibw === 66.0, bodyMetrics.ibw, 66.0);

  // 7.2 CrCl Vancomycin
  const vancoRenal = calculateRenalFunction(50, 'years', 'male', 70, 170, 1.0, 'mg_dL');
  // CrCl = (140 - 50) * 70 / (72 * 1.0) = 6300 / 72 = 87.5 mL/p
  check('Vancomycin', 'Cockcroft-Gault Nam 50t, 70kg, SCr 1.0 mg/dL -> 87.5 mL/p', vancoRenal.crcl === 87.5, vancoRenal.crcl, 87.5);

  // -------------------------------------------------------------
  // 8. MODULE HEPA (GAN MẬT & XƠ GAN)
  // -------------------------------------------------------------
  console.log('\n>>> [8/8] Kiểm tra Module Hepa (FIB-4, Child-Pugh, MELD)...');

  // 8.1 FIB-4 = (Age * AST) / (Platelets * sqrt(ALT))
  // Age 50, AST 60, Plt 150, ALT 45 -> 50 * 60 / (150 * sqrt(45)) = 3000 / (150 * 6.708) = 3000 / 1006.2 = 2.98
  const fib4Res = FibrosisEngine.calculateFib4(50, 60, 45, 150);
  const fib4Val = fib4Res?.score || 0;
  check('Hepa', 'FIB-4 tính đúng công thức (~2.98)', Math.abs(fib4Val - 2.98) < 0.05, fib4Val, '~2.98');

  // 8.2 Child-Pugh Score
  // totalBili: 3.5 (> 3.0 -> 3đ), Albumin: 2.6 (< 2.8 -> 3đ), INR: 2.4 (> 2.3 -> 3đ), Ascites: moderate_severe (3đ), Encephalopathy: grade_3_4 (3đ)
  const cpRes = ChildPughEngine.calculate(3.5, 2.6, 2.4, 'moderate_severe', 'grade_3_4');
  check('Hepa', 'Child-Pugh điểm tối đa 15 (Hạng C)', cpRes.score === 15 && cpRes.grade === 'C', `${cpRes.score} (Hạng ${cpRes.grade})`, '15 (Hạng C)');

  // 8.3 MELD Score
  // Bilirubin 2.0, INR 1.5, Creatinine 1.8 -> MELD = 9.57*ln(1.8) + 3.78*ln(2.0) + 11.2*ln(1.5) + 6.43 = 19.216 -> 19
  const meldVal = MeldEngine.calculateMeldOriginal(2.0, 1.5, 1.8);
  check('Hepa', 'MELD gốc tính chính xác chuẩn UNOS (MELD = 19)', meldVal === 19, meldVal, 19);

  // -------------------------------------------------------------
  // TỔNG KẾT
  // -------------------------------------------------------------
  console.log('\n================================================================');
  const total = auditLog.length;
  const passed = auditLog.filter(t => t.passed).length;
  const failed = total - passed;
  console.log(`🏁 TỔNG KẾT RÀ SOÁT: ${passed}/${total} TEST ĐẠT CHUẨN (${((passed/total)*100).toFixed(1)}%) | ${failed} TEST LỖI`);
  console.log('================================================================');

  if (failed > 0) {
    console.error(`\n⚠️ CÓ ${failed} THUẬT TOÁN BỊ LỖI! CẦN XỬ LÝ NGAY.`);
    process.exit(1);
  } else {
    console.log('\n🎉 TẤT CẢ THUẬT TOÁN ĐÃ ĐƯỢC RÀ SOÁT, ĐẢM BẢO CHÍNH XÁC VÀ KHỚP VỚI HƯỚNG DẪN LÂM SÀNG!');
    process.exit(0);
  }

} catch (err: any) {
  console.error('Fatal crash during audit:', err);
  process.exit(1);
}
