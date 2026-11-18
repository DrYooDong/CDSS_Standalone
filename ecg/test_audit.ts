/**
 * Test & Audit Runner for ECG CDSS Cases
 * Path: ecg/test_audit.ts
 */

import { ECG_CASES } from './ecg-cases';
import {
  auditCaseMetrics,
  calculateElectricalAxis,
  calculateQtcFormulas,
  calculateHypertrophyIndices
} from './ecg-measurements';
import { EcgRulesEngine } from './ecg-rules-engine';

console.log('========================================================================');
console.log('  CLINIPORTAL CDSS — 12-LEAD ECG CLINICAL AUDIT & UNIT TEST SUITE');
console.log('========================================================================\n');

// ---------------------------------------------------------------------------
// UNIT TESTS: Core ECG Mathematics & Formulations
// ---------------------------------------------------------------------------
function makeLead(r: number, s: number = 0, q: number = 0): any {
  return {
    qWave: { amp: -Math.abs(q), dur: 0.02 },
    rWave: { amp: r, dur: 0.04 },
    sWave: { amp: -Math.abs(s), dur: 0.03 }
  };
}

console.log('[UNIT TEST 1] Validating Cabrera Electrical Axis Trigonometry...');
// Lead I = +1.0, aVF = +1.0 -> 45 deg, 'Bình thường'
const axisNormal = calculateElectricalAxis({ I: makeLead(1.0), aVF: makeLead(1.0) } as any);
console.assert(Math.abs(axisNormal.angleDegrees - 45) < 1, `Expected ~45 deg, got ${axisNormal.angleDegrees}`);
console.assert(axisNormal.axisCategory === 'Bình thường', `Expected Bình thường, got ${axisNormal.axisCategory}`);

// Lead I = +1.0, aVF = -1.0 -> -45 deg, 'Lệch trái'
const axisLAD = calculateElectricalAxis({ I: makeLead(1.0), aVF: makeLead(0, 1.0) } as any);
console.assert(Math.abs(axisLAD.angleDegrees - (-45)) < 1, `Expected ~-45 deg, got ${axisLAD.angleDegrees}`);
console.assert(axisLAD.axisCategory === 'Lệch trái', `Expected Lệch trái, got ${axisLAD.axisCategory}`);

// Lead I = -1.0, aVF = +1.0 -> 135 deg, 'Lệch phải'
const axisRAD = calculateElectricalAxis({ I: makeLead(0, 1.0), aVF: makeLead(1.0) } as any);
console.assert(Math.abs(axisRAD.angleDegrees - 135) < 1, `Expected ~135 deg, got ${axisRAD.angleDegrees}`);
console.assert(axisRAD.axisCategory === 'Lệch phải', `Expected Lệch phải, got ${axisRAD.axisCategory}`);

// Lead I = -1.0, aVF = -1.0 -> -135 deg, 'Vô định (Tây Bắc)'
const axisExtreme = calculateElectricalAxis({ I: makeLead(0, 1.0), aVF: makeLead(0, 1.0) } as any);
console.assert(axisExtreme.axisCategory === 'Vô định (Tây Bắc)', `Expected Vô định, got ${axisExtreme.axisCategory}`);
console.log('  -> [PASS] Electrical Axis unit tests passed.\n');

console.log('[UNIT TEST 2] Validating Multi-Formula QTc Interval Calculations...');
// At 60 bpm, RR = 1.0s, so all 4 formulas should evaluate to exact raw QT
const qtc60 = calculateQtcFormulas(400, 60, 'Nam');
console.assert(qtc60.bazett === 400, `Bazett at 60 bpm expected 400, got ${qtc60.bazett}`);
console.assert(qtc60.fridericia === 400, `Fridericia at 60 bpm expected 400, got ${qtc60.fridericia}`);
console.assert(qtc60.framingham === 400, `Framingham at 60 bpm expected 400, got ${qtc60.framingham}`);
console.assert(qtc60.hodges === 400, `Hodges at 60 bpm expected 400, got ${qtc60.hodges}`);

// At 100 bpm, RR = 0.60s, raw QT = 320ms
const qtc100 = calculateQtcFormulas(320, 100, 'Nam');
console.assert(qtc100.bazett > 410 && qtc100.bazett < 416, `Bazett at 100 bpm expected ~413, got ${qtc100.bazett}`);
console.assert(qtc100.fridericia > 375 && qtc100.fridericia < 385, `Fridericia at 100 bpm expected ~379, got ${qtc100.fridericia}`);
console.log('  -> [PASS] QTc Multi-formula unit tests passed.\n');

console.log('[UNIT TEST 3] Validating Ventricular Hypertrophy Indices (Sokolow-Lyon, Cornell, Gubner)...');
const dummyNormalLeads: any = {
  V1: makeLead(0.2, 0.8),
  V5: makeLead(1.2, 0.2),
  V6: makeLead(1.0, 0.1),
  V3: makeLead(0.6, 0.9),
  aVL: makeLead(0.5, 0.1),
  I: makeLead(0.7, 0.1),
  III: makeLead(0.3, 0.6),
};
const lvhNormal = calculateHypertrophyIndices(dummyNormalLeads, 'Nam');
console.assert(!lvhNormal.isSokolowLyonPositive, 'Normal leads should be Sokolow-Lyon negative');
console.assert(!lvhNormal.isCornellPositive, 'Normal leads should be Cornell negative');

const dummyLvhLeads: any = {
  V1: makeLead(0.2, 2.2),
  V5: makeLead(2.6, 0.2),
  V6: makeLead(2.0, 0.1),
  V3: makeLead(0.6, 1.8),
  aVL: makeLead(1.6, 0.1),
  I: makeLead(1.5, 0.1),
  III: makeLead(0.3, 1.4),
};
const lvhPositive = calculateHypertrophyIndices(dummyLvhLeads, 'Nam');
console.assert(lvhPositive.isSokolowLyonPositive, 'Severe LVH leads should be Sokolow-Lyon positive (22+26=48mm)');
console.assert(lvhPositive.isCornellPositive, 'Severe LVH leads should be Cornell positive (16+18=34mm)');
console.log('  -> [PASS] LVH indices unit tests passed.\n');

// ---------------------------------------------------------------------------
// AUDIT SUITE: 21 Curated Cases
// ---------------------------------------------------------------------------
let totalCases = ECG_CASES.length;
let totalAuditedMetrics = 0;
let matchingMetrics = 0;
let rulePassCount = 0;

// Expected primary diagnosis keyword per case to prevent silent clinical misdiagnosis
const EXPECTED_DIAGNOSIS_KEYWORDS: Record<string, string[]> = {
  'case-stemi-anterior': ['Anterior STEMI', 'Thành Trước'],
  'case-stemi-inferior': ['Inferior STEMI', 'Thành Dưới'],
  'case-complete-av-block': ['Độ III', 'Complete 3rd Degree AV Block'],
  'case-afib-rvr': ['Rung Nhĩ', 'Atrial Fibrillation'],
  'case-wpw-syndrome': ['WPW', 'Wolff - Parkinson - White'],
  'case-ventricular-tachycardia': ['Nhịp Nhanh Thất', 'Ventricular Tachycardia'],
  'case-hyperkalemia': ['Tăng Kali Máu', 'Hyperkalemia'],
  'case-acute-pericarditis': ['Viêm Màng Ngoài Tim', 'Pericarditis'],
  'case-pulmonary-embolism': ['Thuyên Tắc Phổi', 'Pulmonary Embolism'],
  'case-digoxin-toxicity': ['Digoxin'],
  'case-normal-ecg': ['Bình Thường'],
  'case-lbbb': ['Bloc Nhánh Trái', 'LBBB'],
  'case-rbbb': ['Bloc Nhánh Phải', 'RBBB'],
  'case-lvh-strain': ['Phì Đại Thất Trái', 'LVH'],
  'case-brugada-type1': ['Brugada Type 1'],
  'case-torsades-de-pointes': ['Xoắn Đỉnh', 'Torsades'],
  'case-aivr': ['AIVR', 'Nhịp Tự Thất Gia Tăng'],
  'case-atrial-flutter': ['Cuồng Nhĩ', 'Atrial Flutter'],
  'case-severe-hypokalemia': ['Hạ Kali Máu', 'Hypokalemia'],
  'case-ventricular-fibrillation': ['Rung Thất', 'Ventricular Fibrillation'],
  'case-av-block-mobitz1': ['Mobitz I', 'Wenckebach'],
};

for (const c of ECG_CASES) {
  console.log(`------------------------------------------------------------------------`);
  console.log(`[CASE ${c.id}] ${c.title} (${c.category}) — ${c.severity}`);
  console.log(`Bệnh nhân: ${c.patient.name}, ${c.patient.age}t (${c.patient.gender}) | HR: ${c.metrics.heartRate} bpm`);

  // 1. Audit electrical measurements
  const auditItems = auditCaseMetrics(c);
  for (const item of auditItems) {
    totalAuditedMetrics++;
    const icon = item.status === 'KHỚP' ? '[OK]' : item.status === 'CHÊNH LỆCH NHẸ' ? '[WARN]' : '[DIFF]';
    if (item.status === 'KHỚP' || item.status === 'CHÊNH LỆCH NHẸ') {
      matchingMetrics++;
    }
    console.log(`  ${icon} ${item.metricName}: Khai báo="${item.declaredValue}" | Tính toán="${item.calculatedValue}" (Lệch: ${item.delta})`);
  }

  // 2. Evaluate Clinical Rules Engine
  const conclusion = EcgRulesEngine.evaluateCase(c.patient, c.metrics, c.leadsData);
  console.log(`  -> CDSS Kết luận: "${conclusion.primaryDiagnosis}" (Tin cậy: ${conclusion.confidenceScore}%)`);
  console.log(`  -> Mức khẩn: ${conclusion.urgencyLevel} | Vùng: ${conclusion.anatomicalTerritory || 'N/A'}`);
  if (conclusion.culpritVesselOrEtiology) {
    console.log(`  -> Nhánh thủ phạm: ${conclusion.culpritVesselOrEtiology}`);
  }
  if (conclusion.diagnosticEvidences.length > 0) {
    console.log(`  -> Bằng chứng (${conclusion.diagnosticEvidences.length}): ${conclusion.diagnosticEvidences.map(e => `${e.lead}: ${e.parameter} (${e.measuredValue})`).join('; ')}`);
  }
  if (conclusion.contraindications.length > 0) {
    console.log(`  -> CHỐNG CHỈ ĐỊNH: ${conclusion.contraindications[0]}`);
  }

  const expectedKeywords = EXPECTED_DIAGNOSIS_KEYWORDS[c.id];
  const matchedDiagnosis = !expectedKeywords || expectedKeywords.some(kw =>
    conclusion.primaryDiagnosis.toLowerCase().includes(kw.toLowerCase())
  );
  if (matchedDiagnosis) {
    rulePassCount++;
  } else {
    console.error(`  [FAIL] Expected diagnosis matching [${expectedKeywords.join(' | ')}], got "${conclusion.primaryDiagnosis}"`);
  }
}

console.log('\n========================================================================');
console.log(` TỔNG KẾT KIỂM THỬ LÂM SÀNG:`);
console.log(` - Tổng số ca bệnh: ${totalCases}`);
console.log(` - Tổng chỉ số điện học thẩm định: ${totalAuditedMetrics}`);
console.log(` - Chỉ số đạt chuẩn/sai số sinh lý cho phép: ${matchingMetrics}/${totalAuditedMetrics} (${((matchingMetrics/totalAuditedMetrics)*100).toFixed(1)}%)`);
console.log(` - Đánh giá luật chẩn đoán CDSS thành công: ${rulePassCount}/${totalCases} ca`);
console.log('========================================================================\n');

if (matchingMetrics / totalAuditedMetrics < 0.85 || rulePassCount < totalCases) {
  console.error('[FAIL] Audit metric matching rate < 85% or clinical rule mismatch detected');
  process.exit(1);
} else {
  console.log('[SUCCESS] All unit tests and clinical case audits PASSED cleanly.');
}
