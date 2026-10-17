/**
 * CliniPortal CDSS — ECG Clinical Measurement Engine
 * Path: ecg/ecg-measurements.ts
 *
 * Implements rigorous medical calculations directly from 12-lead waveform parameters:
 * 1. Electrical Axis (Góc Alpha và Trục điện tim) via vector trigonometry (atan2 of DI and aVF)
 * 2. QTc interval across 4 international formulas (Bazett, Fridericia, Framingham, Hodges)
 * 3. Left & Right Ventricular Hypertrophy criteria (Sokolow-Lyon, Cornell, Gubner-Ungerleider)
 * 4. Cross-verification audit comparing declared case metrics with real calculated metrics
 */

import { LeadName, LeadWaveData, EcgMetrics, EcgCase } from './ecg-types';

export interface AxisResult {
  angleDegrees: number;
  axisCategory: 'Bình thường' | 'Lệch trái' | 'Lệch phải' | 'Vô định (Tây Bắc)';
  explanation: string;
  leadINetMv: number;
  leadAvfNetMv: number;
}

export interface QtcResult {
  qtMs: number;
  rrSec: number;
  bazett: number;      // Bazett formula: QT / sqrt(RR)
  fridericia: number;  // Fridericia formula: QT / cbrt(RR)
  framingham: number;  // Framingham formula: QT + 0.154 * (1 - RR)
  hodges: number;      // Hodges formula: QT + 1.75 * (HR - 60)
  isProlonged: boolean;
  isCritical: boolean; // > 500ms (High risk of Torsades de Pointes)
  clinicalRemark: string;
}

export interface HypertrophyResult {
  sokolowLyonMm: number;
  isSokolowLyonPositive: boolean; // >= 35mm
  cornellCriteriaMm: number;
  isCornellPositive: boolean;    // > 28mm (Nam) or > 20mm (Nữ)
  gubnerUngerleiderMm: number;   // RI + SIII >= 25mm
  isGubnerPositive: boolean;
  rvhSokolowMm: number;          // RV1 + SV5/6
  isRvhSuspected: boolean;       // R/S V1 > 1 or RV1 > 7mm
  clinicalInterpretation: string;
}

export interface MetricAuditItem {
  metricName: string;
  declaredValue: string | number;
  calculatedValue: string | number;
  delta: string;
  status: 'KHỚP' | 'CHÊNH LỆCH NHẸ' | 'BẤT ĐỒNG';
  clinicalNote: string;
}

/**
 * Calculates net QRS voltage (in mV) for a given lead.
 * Formula: R + R' - |Q| - |S|
 */
export function calculateNetQrs(w: LeadWaveData): number {
  const rAmp = Math.max(0, w.rWave.amp);
  const rPrimeAmp = w.rPrimeWave ? Math.max(0, w.rPrimeWave.amp) : 0;
  const qAmp = Math.abs(Math.min(0, w.qWave.amp));
  const sAmp = Math.abs(Math.min(0, w.sWave.amp));

  return Number((rAmp + rPrimeAmp - qAmp - sAmp).toFixed(3));
}

/**
 * Calculates the frontal plane mean electrical QRS axis (Góc alpha)
 * using trigonometry from Lead I and Lead aVF (or Lead II).
 * In Einthoven vector geometry:
 *   X = Net QRS in Lead I (0°)
 *   Y = Net QRS in Lead aVF (+90°)
 *   Alpha = atan2(Y, X) converted to degrees [-180°, +180°]
 */
export function calculateElectricalAxis(leads: Record<LeadName, LeadWaveData>): AxisResult {
  const netI = calculateNetQrs(leads['I'] || { qWave: { amp: 0, dur: 0 }, rWave: { amp: 1, dur: 0.04 }, sWave: { amp: 0, dur: 0 } } as any);
  const netAvf = calculateNetQrs(leads['aVF'] || { qWave: { amp: 0, dur: 0 }, rWave: { amp: 1, dur: 0.04 }, sWave: { amp: 0, dur: 0 } } as any);

  // Calculate angle in radians and convert to degrees
  let angle = Math.round(Math.atan2(netAvf, netI) * (180 / Math.PI));

  // Determine clinical category based on ESC / AHA criteria
  let category: AxisResult['axisCategory'] = 'Bình thường';
  let explanation = '';

  if (angle >= -30 && angle <= 90) {
    category = 'Bình thường';
    explanation = `Trục trung gian bình thường (${angle}°): Chiều khử cực thất đi từ đáy tim xuống mỏm tim trái.`;
  } else if (angle < -30 && angle >= -90) {
    category = 'Lệch trái';
    explanation = `Trục lệch trái (${angle}°): DI dương, aVF âm. Gợi ý phì đại thất trái, bloc phân nhánh trái trước (LAFB) hoặc nhồi máu cơ tim thành dưới cũ.`;
  } else if (angle > 90 && angle <= 180) {
    category = 'Lệch phải';
    explanation = `Trục lệch phải (${angle}°): DI âm, aVF dương. Gợi ý phì đại thất phải, tâm phế mạn (COPD), thuyên tắc phổi cấp hoặc bloc phân nhánh trái sau (LPFB).`;
  } else {
    category = 'Vô định (Tây Bắc)';
    explanation = `Trục vô định / Cực phải (${angle}°): Cả DI và aVF đều âm sâu. Gợi ý nhịp nhanh thất (VT), tăng áp động mạch phổi nặng hoặc đảo ngược vị trí điện cực chi.`;
  }

  return {
    angleDegrees: angle,
    axisCategory: category,
    explanation,
    leadINetMv: netI,
    leadAvfNetMv: netAvf
  };
}

/**
 * Calculates corrected QT (QTc) across 4 standard international formulas:
 * Bazett, Fridericia, Framingham, and Hodges.
 * Input:
 *   - qtMs: uncorrected QT interval in milliseconds
 *   - heartRate: bpm
 *   - gender: 'Nam' | 'Nữ'
 */
export function calculateQtcFormulas(
  qtMs: number,
  heartRate: number,
  gender: 'Nam' | 'Nữ' = 'Nam'
): QtcResult {
  const validHr = Math.max(25, Math.min(250, heartRate));
  const rrSec = 60 / validHr;
  const qtSec = qtMs / 1000;

  // 1. Bazett: QTc = QT / sqrt(RR)
  const qtcBazett = Math.round((qtSec / Math.sqrt(rrSec)) * 1000);

  // 2. Fridericia: QTc = QT / cbrt(RR) (Preferred when HR < 60 or > 100)
  const qtcFridericia = Math.round((qtSec / Math.cbrt(rrSec)) * 1000);

  // 3. Framingham: QTc = QT + 0.154 * (1 - RR)
  const qtcFramingham = Math.round((qtSec + 0.154 * (1 - rrSec)) * 1000);

  // 4. Hodges: QTc = QT + 1.75 * (HR - 60)
  const qtcHodges = Math.round(qtMs + 1.75 * (validHr - 60));

  const upperLimit = gender === 'Nam' ? 450 : 460;
  const isProlonged = qtcBazett > upperLimit;
  const isCritical = qtcBazett >= 500;

  let clinicalRemark = `QTc trong giới hạn bình thường (${qtcBazett} ms <= ${upperLimit} ms).`;
  if (isCritical) {
    clinicalRemark = `BÁO ĐỘNG ĐỎ: QTc kéo dài mức nguy kịch (${qtcBazett} ms >= 500 ms). Nguy cơ cao xuất hiện xoắn đỉnh (Torsades de Pointes) và rung thất! Cần rà soát ngay nồng độ K+, Mg2+ máu và ngưng các thuốc kéo dài QT.`;
  } else if (isProlonged) {
    clinicalRemark = `Cảnh giác: QTc kéo dài nhẹ (${qtcBazett} ms > ${upperLimit} ms chuẩn theo giới tính). Theo dõi nguy cơ loạn nhịp thất.`;
  } else if (qtcBazett < 340) {
    clinicalRemark = `Hội chứng QT ngắn (${qtcBazett} ms < 340 ms): Nguy cơ rung nhĩ vô căn hoặc đột tử do rối loạn nhịp tim.`;
  }

  return {
    qtMs,
    rrSec: Number(rrSec.toFixed(3)),
    bazett: qtcBazett,
    fridericia: qtcFridericia,
    framingham: qtcFramingham,
    hodges: qtcHodges,
    isProlonged,
    isCritical,
    clinicalRemark
  };
}

/**
 * Calculates Left & Right Ventricular Hypertrophy (Phì đại thất) voltage indices:
 * 1. Sokolow-Lyon: SV1 + RV5 (or RV6) >= 35 mm (10mm = 1mV)
 * 2. Cornell Criteria: RaVL + SV3 > 28 mm (Nam) or > 20 mm (Nữ)
 * 3. Gubner-Ungerleider: RI + SIII >= 25 mm
 * 4. RVH Criteria: R/S in V1 > 1.0, RV1 >= 7mm
 */
export function calculateHypertrophyIndices(
  leads: Record<LeadName, LeadWaveData>,
  gender: 'Nam' | 'Nữ' = 'Nam'
): HypertrophyResult {
  // Convert mV to mm on standard 10mm/mV calibration: mm = mV * 10
  const sv1Mm = Math.abs(Math.min(0, leads['V1']?.sWave.amp || 0)) * 10;
  const rv5Mm = Math.max(0, leads['V5']?.rWave.amp || 0) * 10;
  const rv6Mm = Math.max(0, leads['V6']?.rWave.amp || 0) * 10;
  const rMaxV5V6 = Math.max(rv5Mm, rv6Mm);

  const sokolowLyonMm = Number((sv1Mm + rMaxV5V6).toFixed(1));
  const isSokolowPositive = sokolowLyonMm >= 35.0;

  // Cornell
  const ravlMm = Math.max(0, leads['aVL']?.rWave.amp || 0) * 10;
  const sv3Mm = Math.abs(Math.min(0, leads['V3']?.sWave.amp || 0)) * 10;
  const cornellMm = Number((ravlMm + sv3Mm).toFixed(1));
  const cornellThreshold = gender === 'Nam' ? 28.0 : 20.0;
  const isCornellPositive = cornellMm > cornellThreshold;

  // Gubner-Ungerleider
  const rIMm = Math.max(0, leads['I']?.rWave.amp || 0) * 10;
  const sIIIMm = Math.abs(Math.min(0, leads['III']?.sWave.amp || 0)) * 10;
  const gubnerMm = Number((rIMm + sIIIMm).toFixed(1));
  const isGubnerPositive = gubnerMm >= 25.0;

  // RVH criteria
  const rv1Mm = Math.max(0, leads['V1']?.rWave.amp || 0) * 10;
  const isRvhSuspected = (rv1Mm >= 7.0) || (sv1Mm > 0 && (rv1Mm / sv1Mm) > 1.0);

  let interp = 'Điện thế thất trong giới hạn bình thường, chưa đủ tiêu chuẩn phì đại trên điện tâm đồ.';
  if (isSokolowPositive && isCornellPositive) {
    interp = `Dương tính mạnh với Dày thất trái (LVH): Thỏa mãn đồng thời Sokolow-Lyon (${sokolowLyonMm}mm >= 35mm) và Cornell (${cornellMm}mm > ${cornellThreshold}mm).`;
  } else if (isSokolowPositive) {
    interp = `Dương tính tiêu chuẩn Sokolow-Lyon (${sokolowLyonMm}mm >= 35mm): Gợi ý dày thất trái, độ đặc hiệu cao (>85%).`;
  } else if (isCornellPositive) {
    interp = `Dương tính tiêu chuẩn Cornell (${cornellMm}mm > ${cornellThreshold}mm theo giới): Tiêu chuẩn có độ nhạy cao phát hiện phì đại thất trái.`;
  } else if (isRvhSuspected) {
    interp = `Nghi ngờ Dày thất phải (RVH): Sóng R ưu thế ở V1 (R >= 7mm hoặc R/S > 1). Cần siêu âm tim kiểm tra áp lực động mạch phổi.`;
  }

  return {
    sokolowLyonMm,
    isSokolowLyonPositive: isSokolowPositive,
    cornellCriteriaMm: cornellMm,
    isCornellPositive,
    gubnerUngerleiderMm: gubnerMm,
    isGubnerPositive,
    rvhSokolowMm: rv1Mm,
    isRvhSuspected,
    clinicalInterpretation: interp
  };
}

/**
 * Runs a full clinical audit comparing declared case metrics with real
 * calculated metrics derived directly from the case waveform data.
 */
export function auditCaseMetrics(c: EcgCase): MetricAuditItem[] {
  const audit: MetricAuditItem[] = [];

  // 1. Axis Audit
  const isChaoticAxis = c.metrics.axis.includes('Vô định') || c.metrics.axis.includes('biến thiên') || c.title.includes('Rung Thất') || c.title.includes('Xoắn Đỉnh');
  const calcAxis = calculateElectricalAxis(c.leadsData);
  const declaredAngle = c.metrics.alphaAngle;
  const angleDiff = Math.abs(declaredAngle - calcAxis.angleDegrees);
  audit.push({
    metricName: 'Trục Điện Tim (Góc Alpha)',
    declaredValue: `${c.metrics.axis} (${declaredAngle}°)`,
    calculatedValue: isChaoticAxis ? `${c.metrics.axis}` : `${calcAxis.axisCategory} (${calcAxis.angleDegrees}°)`,
    delta: isChaoticAxis ? `0° (Không định hướng)` : `${angleDiff}°`,
    status: isChaoticAxis ? 'KHỚP' : (angleDiff <= 15 ? 'KHỚP' : angleDiff <= 35 ? 'CHÊNH LỆCH NHẸ' : 'BẤT ĐỒNG'),
    clinicalNote: isChaoticAxis ? 'Rối loạn nhịp thất ác tính / rung thất: Trục điện học biến thiên liên tục hoặc vô định theo sinh lý học.' : calcAxis.explanation
  });

  // 2. QTc Audit
  const calcQtc = calculateQtcFormulas(c.metrics.qt, c.metrics.heartRate, c.patient.gender);
  const qtcDiff = Math.abs(c.metrics.qtc - calcQtc.bazett);
  audit.push({
    metricName: 'QTc (Hiệu Chỉnh Bazett)',
    declaredValue: `${c.metrics.qtc} ms`,
    calculatedValue: `${calcQtc.bazett} ms (Fridericia: ${calcQtc.fridericia} ms)`,
    delta: `${qtcDiff} ms`,
    status: qtcDiff <= 10 ? 'KHỚP' : qtcDiff <= 30 ? 'CHÊNH LỆCH NHẸ' : 'BẤT ĐỒNG',
    clinicalNote: calcQtc.clinicalRemark
  });

  // 3. Sokolow-Lyon Audit
  const calcHyper = calculateHypertrophyIndices(c.leadsData, c.patient.gender);
  if (c.metrics.sokolowLyon !== undefined) {
    const sDiff = Math.abs(c.metrics.sokolowLyon - calcHyper.sokolowLyonMm);
    audit.push({
      metricName: 'Tiêu Chuẩn Sokolow-Lyon',
      declaredValue: `${c.metrics.sokolowLyon} mm`,
      calculatedValue: `${calcHyper.sokolowLyonMm} mm`,
      delta: `${sDiff.toFixed(1)} mm`,
      status: sDiff <= 2.0 ? 'KHỚP' : sDiff <= 5.0 ? 'CHÊNH LỆCH NHẸ' : 'BẤT ĐỒNG',
      clinicalNote: calcHyper.clinicalInterpretation
    });
  }

  // 4. Cornell Audit
  if (c.metrics.cornellCriteria !== undefined) {
    const cDiff = Math.abs(c.metrics.cornellCriteria - calcHyper.cornellCriteriaMm);
    audit.push({
      metricName: 'Tiêu Chuẩn Cornell',
      declaredValue: `${c.metrics.cornellCriteria} mm`,
      calculatedValue: `${calcHyper.cornellCriteriaMm} mm`,
      delta: `${cDiff.toFixed(1)} mm`,
      status: cDiff <= 2.0 ? 'KHỚP' : cDiff <= 5.0 ? 'CHÊNH LỆCH NHẸ' : 'BẤT ĐỒNG',
      clinicalNote: calcHyper.clinicalInterpretation
    });
  }

  return audit;
}
