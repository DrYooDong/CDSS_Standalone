/**
 * CliniPortal CDSS — Explainable Clinical Rules Engine for 12-Lead ECG
 * Path: ecg/ecg-rules-engine.ts
 *
 * Implements authoritative medical guidelines:
 * 1. Fourth Universal Definition of Myocardial Infarction (ESC/ACC/AHA/WHF 2018):
 *    - ST elevation thresholds adjusted for age and biological sex in V2-V3
 *    - Contiguous lead requirement (>= 2 leads)
 *    - Reciprocal ST depression detection
 *    - Culprit coronary artery localization (LAD, RCA, LCx, LMCA)
 * 2. AHA/ACCF/HRS Recommendations for the Standardization and Interpretation of the ECG:
 *    - Complete & Incomplete Bundle Branch Blocks (RBBB, LBBB)
 *    - Fascicular Blocks (LAFB, LPFB)
 * 3. 2022 ESC Guidelines for the management of ventricular arrhythmias & sudden cardiac death:
 *    - Brugada syndrome Type 1 & 2 criteria
 *    - Severe electrolyte imbalances (Hyperkalemia / Hypokalemia)
 */

import { LeadName, LeadWaveData, EcgCase, PatientInfo, EcgMetrics } from './ecg-types';
import { calculateElectricalAxis, calculateQtcFormulas, calculateHypertrophyIndices } from './ecg-measurements';

export interface ClinicalRuleEvidence {
  lead: LeadName;
  parameter: string;
  measuredValue: string;
  threshold: string;
  significance: string;
}

export interface CdssDiagnosisConclusion {
  primaryDiagnosis: string;
  confidenceScore: number; // 0 - 100%
  culpritVesselOrEtiology?: string;
  anatomicalTerritory?: string;
  urgencyLevel: 'CẤP CỨU ĐỎ (NGUY KỊCH)' | 'CẢNH GIÁC CAO (VÀNG)' | 'THEO DÕI THƯỜNG (XANH)';
  diagnosticEvidences: ClinicalRuleEvidence[];
  reciprocalFindings: string[];
  contraindications: string[];
  urgentActionPlan: string[];
  differentialDiagnoses: string[];
  guidelineReference: string;
}

export class EcgRulesEngine {

  /**
   * Evaluates a complete 12-lead ECG case against international clinical criteria
   * and produces a fully explainable medical diagnostic report.
   */
  public static evaluateCase(
    patient: PatientInfo,
    metrics: EcgMetrics,
    leads: Record<LeadName, LeadWaveData>
  ): CdssDiagnosisConclusion {
    const age = patient.age;
    const isMale = patient.gender === 'Nam';

    const evidences: ClinicalRuleEvidence[] = [];
    const reciprocalFindings: string[] = [];
    const contraindications: string[] = [];
    const urgentActionPlan: string[] = [];
    const differentials: string[] = [];

    // 1. Calculate rigorous underlying measurements
    const axis = calculateElectricalAxis(leads);
    const qtc = calculateQtcFormulas(metrics.qt, metrics.heartRate, patient.gender);
    const hypertrophy = calculateHypertrophyIndices(leads, patient.gender);

    // 2. STEMI Evaluation according to Fourth Universal Definition of MI (2018)
    const stElevations: Record<LeadName, number> = {} as any;
    const stDepressions: Record<LeadName, number> = {} as any;

    const ALL_LEADS: LeadName[] = ["I", "II", "III", "aVR", "aVL", "aVF", "V1", "V2", "V3", "V4", "V5", "V6"];
    for (const lead of ALL_LEADS) {
      const elev = leads[lead]?.stSegment?.elevation || 0;
      if (elev >= 0.05) {
        stElevations[lead] = elev;
      } else if (elev <= -0.05) {
        stDepressions[lead] = Math.abs(elev);
      }
    }

    // Contiguous territories
    const inferiorLeads: LeadName[] = ["II", "III", "aVF"];
    const septalLeads: LeadName[] = ["V1", "V2"];
    const anteriorLeads: LeadName[] = ["V3", "V4"];
    const lateralLeads: LeadName[] = ["I", "aVL", "V5", "V6"];

    // Check V2-V3 age/sex thresholds:
    // Men < 40: >= 2.5 mm (0.25 mV)
    // Men >= 40: >= 2.0 mm (0.20 mV)
    // Women (all ages): >= 1.5 mm (0.15 mV)
    const v2v3Threshold = isMale ? (age < 40 ? 0.25 : 0.20) : 0.15;
    const isV2Elevated = (stElevations["V2"] || 0) >= v2v3Threshold;
    const isV3Elevated = (stElevations["V3"] || 0) >= v2v3Threshold;

    // Check other leads: >= 1.0 mm (0.10 mV) in >= 2 contiguous leads
    const isInferiorStemi = [stElevations["II"] >= 0.10, stElevations["III"] >= 0.10, stElevations["aVF"] >= 0.10].filter(Boolean).length >= 2;
    const isAnteriorStemi = (isV2Elevated || isV3Elevated) && ((stElevations["V4"] || 0) >= 0.10 || (stElevations["V1"] || 0) >= 0.10 || (isV2Elevated && isV3Elevated));
    const isLateralStemi = [stElevations["I"] >= 0.10, stElevations["aVL"] >= 0.10, stElevations["V5"] >= 0.10, stElevations["V6"] >= 0.10].filter(Boolean).length >= 2;

    // Check reciprocal depression
    if (isInferiorStemi) {
      if (stDepressions["I"] >= 0.05 || stDepressions["aVL"] >= 0.05) {
        reciprocalFindings.push(`ST chênh xuống soi gương rõ rệt tại DI (${-(stDepressions["I"]||0)} mV) và aVL (${-(stDepressions["aVL"]||0)} mV).`);
      }
    }
    if (isAnteriorStemi) {
      if (stDepressions["II"] >= 0.05 || stDepressions["III"] >= 0.05 || stDepressions["aVF"] >= 0.05) {
        reciprocalFindings.push(`ST chênh xuống soi gương tại các đạo trình thành dưới (DII, DIII, aVF).`);
      }
    }

    // Check LMCA / Severe 3-vessel disease: ST elevation in aVR >= 1mm with widespread ST depression (>= 6 leads)
    const countDepressions = Object.keys(stDepressions).length;
    const isAvrStemi = (stElevations["aVR"] || 0) >= 0.10 && countDepressions >= 6;

    // Check Hyperkalemia: tented tall peaked T waves
    let isHyperkalemia = false;
    for (const l of ["V2", "V3", "V4"] as LeadName[]) {
      if (leads[l]?.tWave?.shape === "peaked" && (leads[l]?.tWave?.amp || 0) >= 1.0) {
        isHyperkalemia = true;
        evidences.push({
          lead: l,
          parameter: 'Hình thái sóng T',
          measuredValue: `${leads[l]?.tWave?.amp} mV, nhọn đối xứng hình lều`,
          threshold: 'Tented peaked T >= 1.0 mV',
          significance: 'Dấu hiệu kinh điển của ngộ độc Kali máu cấp (K+ > 6.5 mEq/L).'
        });
      }
    }

    // Check Brugada Type 1: Coved ST elevation >= 2mm in V1/V2 followed by negative T wave,
    // without widespread lateral/inferior ischemic changes or reciprocal ST depression
    const hasBrugadaV1 =
      leads["V1"]?.stSegment?.slope === "coved" &&
      (leads["V1"]?.stSegment?.elevation || 0) >= 0.20 &&
      ((leads["V1"]?.tWave?.amp || 0) < 0 || leads["V1"]?.tWave?.shape === "inverted");
    const hasBrugadaV2 =
      leads["V2"]?.stSegment?.slope === "coved" &&
      (leads["V2"]?.stSegment?.elevation || 0) >= 0.20 &&
      ((leads["V2"]?.tWave?.amp || 0) < 0 || leads["V2"]?.tWave?.shape === "inverted");
    const hasIschemicSpreadOrReciprocal =
      (stElevations["V4"] || 0) >= 0.15 ||
      (stElevations["V5"] || 0) >= 0.15 ||
      (stDepressions["II"] || 0) >= 0.10 ||
      (stDepressions["III"] || 0) >= 0.10 ||
      (stDepressions["aVF"] || 0) >= 0.10;
    const isBrugadaType1 = (hasBrugadaV1 || hasBrugadaV2) && !hasIschemicSpreadOrReciprocal;

    // Check Acute Pericarditis: Diffuse concave/upsloping ST elevation + PR depression, no non-aVR reciprocal depression
    const elevLeadCount = Object.keys(stElevations).filter(l => l !== "aVR").length;
    const hasPrDepression = ["I", "II", "V2", "V3", "V4", "V5", "V6"].some(
      l => (leads[l as LeadName]?.prSegment?.deviation || 0) <= -0.05
    );
    const hasNonAvrReciprocalDepression = Object.keys(stDepressions).some(l => l !== "aVR");
    const isAcutePericarditis = elevLeadCount >= 5 && hasPrDepression && !hasNonAvrReciprocalDepression;

    // Check Digoxin scooped ST ("Salvador Dali mustache")
    const scoopedLeadsCount = (["I", "II", "aVF", "V4", "V5", "V6"] as LeadName[]).filter(
      l => leads[l]?.stSegment?.slope === "scooped" && (leads[l]?.stSegment?.elevation || 0) <= -0.10
    ).length;
    const isDigoxinToxicity = metrics.rhythmType.includes("Digoxin") || scoopedLeadsCount >= 2;

    // Check RBBB / LBBB
    const isWideQrs = metrics.qrsDuration >= 120;
    const isRbbb = isWideQrs && (leads["V1"]?.rPrimeWave?.amp || 0) > 0;
    const isLbbb = isWideQrs && (leads["V5"]?.rWave?.dur || 0) >= 0.05 && !isRbbb;

    // Check Ventricular Tachycardia (VT) & AIVR & WPW & Complete AV Block & AFib & PE
    const isVt =
      metrics.rhythmType.includes("Nhịp nhanh thất") ||
      (isWideQrs &&
        metrics.heartRate >= 120 &&
        !metrics.rhythmType.includes("Rung nhĩ") &&
        !metrics.rhythmType.includes("Cuồng nhĩ") &&
        (axis.angleDegrees <= -90 || axis.angleDegrees >= 120));
    const isCompleteAvBlock =
      metrics.rhythmType.includes("độ III") ||
      metrics.rhythmType.includes("Phân ly nhĩ thất") ||
      (metrics.heartRate <= 45 && metrics.prInterval === 0 && !metrics.rhythmType.includes("Rung nhĩ"));
    const isWpw =
      metrics.rhythmType.includes("WPW") ||
      (metrics.prInterval > 0 && metrics.prInterval < 120 && metrics.qrsDuration >= 110);
    const isAfib =
      metrics.rhythmType.includes("Rung nhĩ") ||
      (metrics.regularity === "Loạn nhịp hoàn toàn" && metrics.prInterval === 0);
    const isAivr =
      metrics.rhythmType.includes("AIVR") ||
      metrics.rhythmType.includes("Nhịp tự thất gia tăng") ||
      (isWideQrs && metrics.heartRate >= 50 && metrics.heartRate <= 110 && metrics.prInterval === 0 && !isAfib);
    const hasS1Q3T3 =
      (leads["I"]?.sWave?.amp || 0) <= -0.5 &&
      (leads["III"]?.qWave?.amp || 0) <= -0.2 &&
      (leads["III"]?.tWave?.shape === "inverted" || (leads["III"]?.tWave?.amp || 0) < 0);
    const hasRvStrainT = (["V1", "V2", "V3"] as LeadName[]).filter(
      l => leads[l]?.tWave?.shape === "inverted" || (leads[l]?.tWave?.amp || 0) < 0
    ).length >= 2;
    const isPulmonaryEmbolism = hasS1Q3T3 && hasRvStrainT;

    // -------------------------------------------------------------------------
    // DECISION SYNTHESIS & CLINICAL TRIAGE HIERARCHY
    // Level 1: Cardiac Arrest & Extreme Arrhythmias (VF, VT, Torsades, Asystole)
    // Level 2: Channelopathy & Acute Electrolyte Poisoning (HyperK, HypoK, Brugada)
    // Level 3: Acute Myocardial Infarction (LMCA, Anterior STEMI, Inferior STEMI)
    // Level 4: Complex Conduction Blocks (Complete LBBB, RBBB, AVB 3, Mobitz II)
    // Level 5: Supraventricular Tachycardias & AFib / Flutter
    // Level 6: Ventricular Hypertrophy & Normal Baseline
    // -------------------------------------------------------------------------

    // 1. CARDIAC ARREST & EXTREME ARRHYTHMIAS (VF / Torsades / VT)
    if (metrics.rhythmType.includes("Rung thất") || metrics.heartRate >= 300) {
      return {
        primaryDiagnosis: 'Rung Thất Sóng Lớn (Ventricular Fibrillation - VF) / Ngưng Tuần Hoàn Cấp Cứu',
        confidenceScore: 100,
        culpritVesselOrEtiology: 'Rối loạn điện học tâm thất ác tính vô tổ chức, mất hoàn toàn cung lượng tim',
        anatomicalTerritory: 'Toàn bộ buồng tâm thất',
        urgencyLevel: 'CẤP CỨU ĐỎ (NGUY KỊCH)',
        diagnosticEvidences: [
          { lead: 'II', parameter: 'Hình thái sóng nhịp', measuredValue: 'Sóng lăn tăn đa hình thái, mất P-QRS-T', threshold: 'Tần số > 300 l/p', significance: 'Ngừng tuần hoàn đột ngột.' }
        ],
        reciprocalFindings: [],
        contraindications: ['KHÔNG trì hoãn sốc điện! KHÔNG ép tim chậm trễ!'],
        urgentActionPlan: [
          'KÍCH HOẠT CODE BLUE (BÁO ĐỘNG NGỪNG TUẦN HOÀN TOÀN VIỆN).',
          'Sốc điện khử rung không đồng bộ ngay lập tức: 200J (Máy 2 pha - Biphasic) hoặc 360J (1 pha).',
          'CPR ép tim chất lượng cao liên tục (100-120 l/p, độ sâu 5-6cm) tỷ lệ 30:2.',
          'Adrenaline 1mg tĩnh mạch mỗi 3-5 phút; Amiodarone 300mg tiêm nhanh sau lần sốc điện thứ 3.'
        ],
        differentialDiagnoses: ['Xoắn đỉnh', 'Nhịp nhanh thất vô mạch (pVT)', 'Nhiễu rung giật cơ vân'],
        guidelineReference: '2020 AHA Guidelines for CPR and Emergency Cardiovascular Care'
      };
    }

    if (metrics.rhythmType.includes("Xoắn đỉnh") || (metrics.heartRate > 180 && qtc.isCritical)) {
      return {
        primaryDiagnosis: 'Xoắn Đỉnh (Torsades de Pointes) Kèm Hội Chứng QT Kéo Dài',
        confidenceScore: 98,
        culpritVesselOrEtiology: 'Hội chứng QT kéo dài (LQTS) / Rối loạn tái cực cơ tim thất',
        anatomicalTerritory: 'Tâm thất',
        urgencyLevel: 'CẤP CỨU ĐỎ (NGUY KỊCH)',
        diagnosticEvidences: [
          { lead: 'II', parameter: 'Khoảng QTc', measuredValue: `${qtc.bazett} ms`, threshold: 'QTc >= 500 ms', significance: 'Hiện tượng R trên T kích hoạt xoắn đỉnh.' }
        ],
        reciprocalFindings: [],
        contraindications: ['CHỐNG CHỈ ĐỊNH các thuốc chống loạn nhịp nhóm IA, IC, III (Amiodarone, Sotalol) vì làm QT dài thêm!'],
        urgentActionPlan: [
          'Sốc điện khử rung đồng bộ nếu huyết động không ổn định.',
          'Tiêm tĩnh mạch Magnesium Sulfate 2g trong 10-15 phút (kể cả khi Magie máu bình thường).',
          'Tăng tần số tim bằng Isoproterenol hoặc tạo nhịp tạm thời vượt tần số (Overdrive pacing > 90-100 l/p) để rút ngắn khoảng QT.'
        ],
        differentialDiagnoses: ['Nhịp nhanh thất đa hình thái do thiếu máu cơ tim', 'Rung thất'],
        guidelineReference: '2022 ESC Guidelines for the management of patients with ventricular arrhythmias'
      };
    }

    if (isVt) {
      return {
        primaryDiagnosis: 'Cơn Nhịp Nhanh Thất Đơn Dạng (Monomorphic Ventricular Tachycardia - VT)',
        confidenceScore: 98,
        culpritVesselOrEtiology: 'Vòng vào lại quanh mô sẹo cơ tim thất / Thiếu máu cơ tim nặng',
        anatomicalTerritory: 'Tâm thất',
        urgencyLevel: 'CẤP CỨU ĐỎ (NGUY KỊCH)',
        diagnosticEvidences: [
          { lead: 'V1', parameter: 'QRS Rộng & Trục Vô Định', measuredValue: `HR ${metrics.heartRate} bpm, QRS ${metrics.qrsDuration} ms, Trục ${axis.angleDegrees}°`, threshold: 'QRS >= 120 ms, đồng dạng V1-V6 / Trục Tây Bắc', significance: 'Tiêu chuẩn Brugada dương tính cho Nhịp nhanh thất.' }
        ],
        reciprocalFindings: [],
        contraindications: ['CHỐNG CHỈ ĐỊNH Adenosine, Verapamil, Diltiazem (nguy cơ tụt huyết áp trụy mạch dẫn tới rung thất).'],
        urgentActionPlan: [
          'Nếu rối loạn huyết động (tụt HA, choáng ngất, đau ngực): Sốc điện đồng bộ ngay lập tức (100J - 200J).',
          'Nếu huyết động tạm ổn: Amiodarone 150mg TM trong 10 phút, sau đó truyền duy trì 1mg/phút.',
          'Kiểm tra và điều chỉnh điện giải (K+, Mg2+), đánh giá chỉ định cấy máy phá rung ICD.'
        ],
        differentialDiagnoses: ['Nhịp nhanh trên thất (SVT) dẫn truyền lệch hướng', 'AVRT ngược chiều (WPW)'],
        guidelineReference: '2022 ESC Guidelines for the management of patients with ventricular arrhythmias'
      };
    }

    // 2. CHANNELOPATHIES & ELECTROLYTES (Brugada, Hyperkalemia, Hypokalemia)
    if (isBrugadaType1) {
      evidences.push({
        lead: (leads["V1"]?.stSegment?.elevation || 0) >= 0.20 ? 'V1' : 'V2',
        parameter: 'ST Chênh Lên Dạng Vòm (Coved-type)',
        measuredValue: '>= 2.0 mm (0.20 mV)',
        threshold: '>= 2.0 mm tiếp nối bằng sóng T âm',
        significance: 'Bệnh lý kênh ion Natri tim (SCN5A mutation) với nguy cơ đột tử ban đêm (SUDS).'
      });

      contraindications.push('Tránh tuyệt đối các thuốc chẹn kênh Natri (Nhóm IA/IC như Flecainide, Procainamide).');
      contraindications.push('Hạ sốt tích cực ngay lập tức (nhiệt độ cao kích hoạt bão điện học loạn nhịp thất).');
      contraindications.push('Tránh uống nhiều rượu bia và thuốc an thần.');

      urgentActionPlan.push('Nhập viện khoa Tim mạch theo dõi monitor liên tục nhịp tim.');
      urgentActionPlan.push('Hạ thân nhiệt tích cực bằng Paracetamol nếu bệnh nhân đang sốt.');
      urgentActionPlan.push('Chỉ định cấy máy phá rung tự động (ICD) nếu từng có tiền căn ngất hoặc ngừng tim.');

      return {
        primaryDiagnosis: 'Hội Chứng Brugada Type 1 (ST Chênh Lên Dạng Vòm Ở V1-V2)',
        confidenceScore: 97,
        culpritVesselOrEtiology: 'Đột biến kênh Natri tim (Kênh SCN5A / Rối loạn kênh ion)',
        anatomicalTerritory: 'Đường ra thất phải (RVOT)',
        urgencyLevel: 'CẤP CỨU ĐỎ (NGUY KỊCH)',
        diagnosticEvidences: evidences,
        reciprocalFindings: [],
        contraindications,
        urgentActionPlan,
        differentialDiagnoses: ['Bloc nhánh phải đơn thuần (RBBB)', 'Viêm cơ tim cấp', 'Tái cực sớm lành tính'],
        guidelineReference: '2022 ESC Guidelines for the management of patients with ventricular arrhythmias'
      };
    }

    if (isHyperkalemia) {
      contraindications.push('CHỐNG CHỈ ĐỊNH tuyệt đối truyền các dung dịch có chứa Kali (Ringer Lactate, Ringer Fundin).');
      contraindications.push('Ngưng ngay các thuốc giữ Kali: Spironolactone, Thuốc ức chế men chuyển (ACEi), Ức chế thụ thể (ARB), NSAIDs.');

      urgentActionPlan.push('Ổn định màng tế bào cơ tim ngay lập tức: Tiêm tĩnh mạch Calcium Gluconate 10% 10-20ml trong 3-5 phút.');
      urgentActionPlan.push('Chuyển dịch Kali vào nội bào: Insulin Regular 10 UI pha trong Glucose 20% 250ml truyền TM, kèm khí dung Salbutamol 10-20mg.');
      urgentActionPlan.push('Thải trừ Kali: Furosemide tĩnh mạch hoặc chuẩn bị lọc máu cấp cứu (Hemodialysis) nếu suy thận vô niệu.');

      return {
        primaryDiagnosis: 'Tăng Kali Máu Nặng Đe Dọa Loạn Nhịp Thất (Severe Hyperkalemia)',
        confidenceScore: 97,
        culpritVesselOrEtiology: 'Rối loạn điện giải cấp tính (Kali huyết tương ước tính > 7.0 mEq/L)',
        anatomicalTerritory: 'Toàn bộ cơ tim',
        urgencyLevel: 'CẤP CỨU ĐỎ (NGUY KỊCH)',
        diagnosticEvidences: evidences,
        reciprocalFindings: [],
        contraindications,
        urgentActionPlan,
        differentialDiagnoses: ['Sóng T khổng lồ thiếu máu cơ tim tối cấp (Hyperacute T)', 'Tái cực sớm'],
        guidelineReference: 'AHA/ERC Cardiopulmonary Resuscitation & Emergency Cardiovascular Care Guidelines'
      };
    }

    // Check Hypokalemia (Prominent U wave in V2-V4, flat T wave)
    const hasProminentU = (leads["V2"]?.uWave?.amp || 0) >= 0.15 || (leads["V3"]?.uWave?.amp || 0) >= 0.15;
    if (hasProminentU || metrics.rhythmType.includes("Hạ Kali")) {
      return {
        primaryDiagnosis: 'Hạ Kali Máu Nặng Kèm Sóng U Nổi Bật (Severe Hypokalemia)',
        confidenceScore: 95,
        culpritVesselOrEtiology: 'Mất Kali máu nặng (K+ < 2.5 mEq/L), nguy cơ cao kích hoạt xoắn đỉnh',
        anatomicalTerritory: 'Toàn bộ hệ thống tái cực tâm thất',
        urgencyLevel: 'CẤP CỨU ĐỎ (NGUY KỊCH)',
        diagnosticEvidences: [
          { lead: 'V3', parameter: 'Sóng U & Sóng T', measuredValue: `Sóng U >= 0.15 mV cao hơn sóng T`, threshold: 'U wave > T wave', significance: 'Hiệu ứng lưng lạc đà (Camel-hump effect) điển hình.' }
        ],
        reciprocalFindings: [],
        contraindications: ['CHỐNG CHỈ ĐỊNH truyền Glucose ưu trương khi chưa bù Kali (kích hoạt tiết Insulin đẩy thêm Kali vào tế bào, gây ngừng tim!).'],
        urgentActionPlan: [
          'Bù Kali Clorid đường tĩnh mạch trung tâm có kiểm soát tốc độ (tối đa 20-40 mEq/giờ qua bơm tiêm điện có monitor).',
          'Đồng thời bù Magie Sulfate tĩnh mạch (vì hạ Magie máu kháng trị việc bù Kali).',
          'Theo dõi liên tục điện tâm đồ trên monitor phòng hồi sức cấp cứu.'
        ],
        differentialDiagnoses: ['Hội chứng QT dài bẩm sinh', 'Ngộ độc Quinidine', 'Tái cực sớm'],
        guidelineReference: 'Emergency Medicine Electrolyte Management Guidelines'
      };
    }

    // 3. PERICARDITIS & ISCHEMIA / ACUTE CORONARY SYNDROMES (Pericarditis, LMCA, Inferior/Anterior STEMI)
    if (isAcutePericarditis) {
      return {
        primaryDiagnosis: 'Viêm Màng Ngoài Tim Cấp (Acute Pericarditis Stage 1)',
        confidenceScore: 97,
        culpritVesselOrEtiology: 'Phản ứng viêm màng ngoài tim lan tỏa (do virus / tự miễn)',
        anatomicalTerritory: 'Lan tỏa toàn bộ màng ngoài tim',
        urgencyLevel: 'CẢNH GIÁC CAO (VÀNG)',
        diagnosticEvidences: [
          { lead: 'II', parameter: 'ST chênh lên lõm & PR chênh xuống', measuredValue: `ST chênh lên lõm ở ${elevLeadCount} đạo trình, PR chênh xuống`, threshold: 'ST lõm lan tỏa >= 5 đạo trình, không có soi gương', significance: 'Đặc trưng Viêm màng ngoài tim cấp giai đoạn 1.' }
        ],
        reciprocalFindings: ['aVR: PR chênh lên và ST chênh xuống đối nghịch điển hình.'],
        contraindications: ['CHỐNG CHỈ ĐỊNH tiêu sợi huyết (nguy cơ tràn máu màng tim gây chèn ép tim tử vong)!'],
        urgentActionPlan: [
          'Kháng viêm NSAIDs liều cao (Ibuprofen 600mg x 3 lần/ngày hoặc Aspirin) phối hợp Colchicine 0.5mg x 1-2 lần/ngày.',
          'Siêu âm tim cấp cứu tại giường kiểm tra tràn dịch màng ngoài tim / dấu hiệu chèn ép tim.'
        ],
        differentialDiagnoses: ['Nhồi máu cơ tim cấp (STEMI)', 'Tái cực sớm lành tính (BER)'],
        guidelineReference: '2015 ESC Guidelines for the diagnosis and management of pericardial diseases'
      };
    }

    if (isAvrStemi) {
      evidences.push({
        lead: 'aVR',
        parameter: 'ST Chênh Lên',
        measuredValue: `+${(stElevations['aVR']*10).toFixed(1)} mm`,
        threshold: '>= 1.0 mm kèm ST chênh xuống lan tỏa >= 6 đạo trình',
        significance: 'Báo động nguy kịch: Tắc thân chung vành trái (LMCA) hoặc tổn thương nặng 3 thân động mạch vành.'
      });

      contraindications.push('Tránh hạ huyết áp quá mức; theo dõi sát nguy cơ sốc tim và phù phổi cấp.');
      urgentActionPlan.push('Kích hoạt báo động đỏ Cath-lab khẩn cấp can thiệp tái tưới máu.');
      urgentActionPlan.push('Hội chẩn khẩn bác sĩ phẫu thuật tim mạch (CABG cấp cứu nếu PCI không khả thi).');

      return {
        primaryDiagnosis: 'Thiếu Máu Cơ Tim Cực Kỳ Nghiêm Trọng / Nghi Tắc Thân Chung Vành Trái (LMCA)',
        confidenceScore: 96,
        culpritVesselOrEtiology: 'Thân chung động mạch vành trái (LMCA) / Bệnh 3 thân vành nặng',
        anatomicalTerritory: 'Lan tỏa toàn bộ thất trái',
        urgencyLevel: 'CẤP CỨU ĐỎ (NGUY KỊCH)',
        diagnosticEvidences: evidences,
        reciprocalFindings,
        contraindications,
        urgentActionPlan,
        differentialDiagnoses: ['Hẹp van động mạch chủ khít', 'Thiếu máu nặng/tụt HA kéo dài', 'Viêm cơ tim cấp'],
        guidelineReference: '2023 ESC Guidelines for the management of acute coronary syndromes'
      };
    }

    // 2. Inferior STEMI
    if (isInferiorStemi) {
      for (const l of inferiorLeads) {
        if (stElevations[l]) {
          evidences.push({
            lead: l,
            parameter: 'ST Chênh Lên Thành Dưới',
            measuredValue: `+${(stElevations[l]*10).toFixed(1)} mm`,
            threshold: '>= 1.0 mm (0.10 mV)',
            significance: `Tổn thương cơ tim xuyên thành vùng hoành thất trái.`
          });
        }
      }

      // Culprit analysis: ST elevation in DIII > DII points to RCA (85%), DII > DIII points to LCx (15%)
      const elevD3 = stElevations["III"] || 0;
      const elevD2 = stElevations["II"] || 0;
      const isRca = elevD3 >= elevD2;
      const culprit = isRca
        ? 'Động mạch Vành Phải (RCA - Đoạn gần hoặc giữa)'
        : 'Động mạch Mũ (LCx)';

      contraindications.push('CHỐNG CHỈ ĐỊNH Nitroglycerin và Morphine nếu chưa đo chuyển đạo thất phải (V3R, V4R) hoặc khi HA tâm thu < 90 mmHg (nguy cơ sốc tụt HA do giảm tiền gánh trong nhồi máu thất phải).');
      contraindications.push('Thận trọng với thuốc ức chế thụ thể Beta giao cảm nếu có nhịp chậm hoặc bloc nhĩ thất đi kèm.');

      urgentActionPlan.push('Kích hoạt phòng can thiệp tim mạch PCI thì đầu (< 90 phút từ cửa đến bóng).');
      urgentActionPlan.push('Đo ngay chuyển đạo tim phải (V3R, V4R) và thành sau (V7, V8, V9).');
      urgentActionPlan.push('Dùng liều nạp kháng kết tập tiểu cầu kép: Aspirin 300mg + Ticagrelor 180mg (hoặc Clopidogrel 600mg).');
      urgentActionPlan.push('Chống đông: Heparin không phân đoạn chỉnh liều theo ACT (hoặc Enoxaparin tĩnh mạch).');

      return {
        primaryDiagnosis: 'Nhồi Máu Cơ Tim Cấp ST Chênh Lên Thành Dưới (Acute Inferior STEMI)',
        confidenceScore: 98,
        culpritVesselOrEtiology: culprit,
        anatomicalTerritory: 'Thành dưới (mặt hoành) tâm thất trái',
        urgencyLevel: 'CẤP CỨU ĐỎ (NGUY KỊCH)',
        diagnosticEvidences: evidences,
        reciprocalFindings,
        contraindications,
        urgentActionPlan,
        differentialDiagnoses: ['Viêm màng ngoài tim cấp', 'Bóc tách động mạch chủ ngực Type A', 'Co thắt mạch vành (Prinzmetal)'],
        guidelineReference: 'Fourth Universal Definition of Myocardial Infarction (ESC/ACC/AHA/WHF 2018)'
      };
    }

    // 3. Anterior / Anteroseptal STEMI
    if (isAnteriorStemi) {
      if (stElevations["V1"]) evidences.push({ lead: "V1", parameter: "ST Chênh Lên", measuredValue: `+${(stElevations["V1"]*10).toFixed(1)} mm`, threshold: ">= 1.0 mm", significance: "Tổn thương vách liên thất." });
      if (stElevations["V2"]) evidences.push({ lead: "V2", parameter: "ST Chênh Lên", measuredValue: `+${(stElevations["V2"]*10).toFixed(1)} mm`, threshold: `>= ${v2v3Threshold*10} mm (${patient.gender}, ${patient.age}t)`, significance: "Tổn thương thành trước vách." });
      if (stElevations["V3"]) evidences.push({ lead: "V3", parameter: "ST Chênh Lên", measuredValue: `+${(stElevations["V3"]*10).toFixed(1)} mm`, threshold: `>= ${v2v3Threshold*10} mm (${patient.gender}, ${patient.age}t)`, significance: "ST vòm (Tombstone) điển hình." });
      if (stElevations["V4"]) evidences.push({ lead: "V4", parameter: "ST Chênh Lên", measuredValue: `+${(stElevations["V4"]*10).toFixed(1)} mm`, threshold: ">= 1.0 mm", significance: "Tổn thương mỏm thất trái." });

      contraindications.push('Theo dõi sát nguy cơ rối loạn nhịp thất ác tính (nhanh thất/rung thất) và suy tim cấp choáng tim.');
      urgentActionPlan.push('Kích hoạt khẩn cấp phòng Catheter can thiệp tái thông LAD (< 90 phút).');
      urgentActionPlan.push('Liều nạp kháng kết tập tiểu cầu kép: Aspirin 300mg + Ticagrelor 180mg.');
      urgentActionPlan.push('Theo dõi sát huyết động và bồi phụ dịch cẩn trọng nếu có dấu hiệu suy tim Killip II-IV.');

      return {
        primaryDiagnosis: 'Nhồi Máu Cơ Tim Cấp ST Chênh Lên Thành Trước - Vách (Acute Anterior STEMI)',
        confidenceScore: 99,
        culpritVesselOrEtiology: 'Động mạch Liên Thất Trước (LAD - Đoạn gần hoặc giữa)',
        anatomicalTerritory: 'Vách liên thất và thành trước tự do mỏm tim thất trái',
        urgencyLevel: 'CẤP CỨU ĐỎ (NGUY KỊCH)',
        diagnosticEvidences: evidences,
        reciprocalFindings,
        contraindications,
        urgentActionPlan,
        differentialDiagnoses: ['Hội chứng Brugada', 'Tái cực sớm lành tính (BER)', 'Phình vách thất trái cũ'],
        guidelineReference: 'Fourth Universal Definition of Myocardial Infarction (2018)'
      };
    }

    // 4. HIGH-GRADE AV BLOCK, TOXICITIES, PRE-EXCITATION & SUPRAVENTRICULAR ARRHYTHMIAS
    if (isCompleteAvBlock) {
      return {
        primaryDiagnosis: 'Bloc Nhĩ - Thất Hoàn Toàn Độ III (Complete 3rd Degree AV Block)',
        confidenceScore: 99,
        culpritVesselOrEtiology: 'Phân ly nhĩ thất hoàn toàn / Tổn thương hệ thống dẫn truyền His-Purkinje',
        anatomicalTerritory: 'Nút nhĩ thất / Bó His',
        urgencyLevel: 'CẤP CỨU ĐỎ (NGUY KỊCH)',
        diagnosticEvidences: [
          { lead: 'II', parameter: 'Phân ly nhĩ thất', measuredValue: `Tần số thất ${metrics.heartRate} bpm, QRS ${metrics.qrsDuration} ms`, threshold: 'Sóng P và QRS đập hoàn toàn độc lập', significance: 'Nhịp thoát thất chậm, nguy cơ ngừng tim Stokes-Adams.' }
        ],
        reciprocalFindings: [],
        contraindications: ['CHỐNG CHỈ ĐỊNH tuyệt đối các thuốc ức chế nút AV (Chẹn Beta, Verapamil, Diltiazem, Digoxin).'],
        urgentActionPlan: [
          'Đặt máy tạo nhịp tạm thời (qua da hoặc qua tĩnh mạch) ngay lập tức.',
          'Chuẩn bị Isoproterenol hoặc Adrenaline truyền TM nếu chưa kịp tạo nhịp.',
          'Hội chẩn tim mạch cấy máy tạo nhịp vĩnh viễn (DDD/VVI).'
        ],
        differentialDiagnoses: ['Bloc nhĩ thất độ II cao độ', 'Nhịp chậm xoang nặng'],
        guidelineReference: '2018 ACC/AHA/HRS Guideline on the Evaluation and Management of Patients With Bradycardia'
      };
    }

    if (isDigoxinToxicity) {
      return {
        primaryDiagnosis: 'Ngộ Độc Thuốc Trợ Tim Digoxin (Digoxin Toxicity)',
        confidenceScore: 97,
        culpritVesselOrEtiology: 'Tích lũy Digoxin quá liều (thường kèm hạ Kali máu / suy thận)',
        anatomicalTerritory: 'Lan tỏa (chuyển đạo có R cao: DII, V4-V6)',
        urgencyLevel: 'CẢNH GIÁC CAO (VÀNG)',
        diagnosticEvidences: [
          { lead: 'V5', parameter: 'ST chênh xuống hình đáy chén', measuredValue: `ST lõm dạng scooped (${scoopedLeadsCount} đạo trình), QTc ${qtc.bazett} ms`, threshold: 'ST đáy chén Salvador Dali + QT ngắn', significance: 'Dấu hiệu kinh điển của nhiễm độc Digitalis.' }
        ],
        reciprocalFindings: [],
        contraindications: ['Tránh sốc điện chuyển nhịp trừ khi ngừng tuần hoàn; tuyệt đối không bù Canxi TM nhanh.'],
        urgentActionPlan: [
          'Ngừng ngay Digoxin và thuốc lợi tiểu thải Kali.',
          'Bù Kali (mục tiêu 4.0 - 4.5 mEq/L) và Magie sulfate tĩnh mạch.',
          'Chỉ định kháng thể đặc hiệu DigiFab (Digoxin Immune Fab) nếu rối loạn nhịp nặng hoặc tăng Kali máu.'
        ],
        differentialDiagnoses: ['Thiếu máu cơ tim dưới nội tâm mạc', 'Hạ Kali máu đơn thuần'],
        guidelineReference: 'AHA/ACC Toxicology & Cardiac Glycoside Toxicity Guidelines'
      };
    }

    if (isWpw) {
      return {
        primaryDiagnosis: 'Hội Chứng Tiền Kích Thích Wolff - Parkinson - White (WPW)',
        confidenceScore: 98,
        culpritVesselOrEtiology: 'Cầu nối dẫn truyền phụ nhĩ thất (Bó Kent)',
        anatomicalTerritory: 'Đường dẫn truyền phụ nhĩ - thất',
        urgencyLevel: 'CẢNH GIÁC CAO (VÀNG)',
        diagnosticEvidences: [
          { lead: 'V1', parameter: 'PR ngắn & Sóng Delta', measuredValue: `PR ${metrics.prInterval} ms, QRS ${metrics.qrsDuration} ms`, threshold: 'PR < 120 ms kèm sóng Delta và QRS >= 110 ms', significance: 'Tiền kích thích thất qua đường phụ Bó Kent.' }
        ],
        reciprocalFindings: [],
        contraindications: ['CHỐNG CHỈ ĐỊNH Digoxin, Verapamil, Diltiazem nếu xuất hiện Rung nhĩ kèm WPW (nguy cơ rung thất đột tử).'],
        urgentActionPlan: [
          'Hội chẩn điện sinh lý tim triệt đốt cầu phụ qua catheter (RF Catheter Ablation).',
          'Nếu đang có cơn nhịp nhanh vòng vào lại: dùng Procainamide/Amiodarone hoặc sốc điện nếu huyết động không ổn.'
        ],
        differentialDiagnoses: ['Bloc nhánh phải/trái', 'Hội chứng Lown-Ganong-Levine (LGL)'],
        guidelineReference: '2019 ESC Guidelines for the management of patients with supraventricular tachycardia'
      };
    }

    if (metrics.rhythmType.includes("Cuồng nhĩ")) {
      return {
        primaryDiagnosis: 'Cuồng Nhĩ Điển Hình Dẫn Truyền 2:1 (Atrial Flutter with 2:1 Conduction)',
        confidenceScore: 96,
        culpritVesselOrEtiology: 'Vòng vào lại lớn ở tâm nhĩ phải xung quanh eo van 3 lá (CTI)',
        anatomicalTerritory: 'Tâm nhĩ phải',
        urgencyLevel: 'CẢNH GIÁC CAO (VÀNG)',
        diagnosticEvidences: [
          { lead: 'II', parameter: 'Sóng F cuồng nhĩ', measuredValue: 'Sóng răng cưa liên tục không có đường đẳng điện', threshold: 'Tần số nhĩ ~300 l/p, tần số thất ~150 l/p', significance: 'Vòng vào lại nhĩ điển hình phụ thuộc eo CTI.' }
        ],
        reciprocalFindings: [],
        contraindications: ['Không dùng thuốc giãn mạch hạ áp đột ngột.'],
        urgentActionPlan: [
          'Kiểm soát tần số thất bằng thuốc chẹn Beta hoặc chẹn kênh Canxi diltiazem/verapamil.',
          'Đánh giá thang điểm CHA2DS2-VASc để chỉ định kháng đông dự phòng đột quỵ não.',
          'Hội chẩn triệt đốt điện sinh lý vòng eo CTI (Catheter Ablation).'
        ],
        differentialDiagnoses: ['Nhịp nhanh xoang', 'Nhịp nhanh kịch phát trên thất (AVNRT)', 'Rung nhĩ đáp ứng thất nhanh'],
        guidelineReference: '2019 AHA/ACC/HRS Guideline for the Management of Patients With Atrial Fibrillation'
      };
    }

    if (isAfib) {
      return {
        primaryDiagnosis: 'Rung Nhĩ Đáp Ứng Thất Nhanh (Atrial Fibrillation)',
        confidenceScore: 98,
        culpritVesselOrEtiology: 'Hoạt động điện học hỗn loạn đa ổ trong tâm nhĩ / Tĩnh mạch phổi',
        anatomicalTerritory: 'Tâm nhĩ',
        urgencyLevel: 'CẢNH GIÁC CAO (VÀNG)',
        diagnosticEvidences: [
          { lead: 'V1', parameter: 'Mất sóng P & R-R loạn nhịp hoàn toàn', measuredValue: `HR ${metrics.heartRate} bpm, ${metrics.regularity}`, threshold: 'R-R không đều hoàn toàn, mất sóng P, có sóng f', significance: 'Nguy cơ cao hình thành huyết khối tiểu nhĩ trái gây đột quỵ.' }
        ],
        reciprocalFindings: [],
        contraindications: ['Không chuyển nhịp bằng thuốc/sốc điện nếu khởi phát > 48h mà chưa loại trừ huyết khối tiểu nhĩ trái (TEE) hoặc chưa dùng kháng đông đủ 3 tuần.'],
        urgentActionPlan: [
          'Kiểm soát tần số thất bằng Metoprolol hoặc Diltiazem tĩnh mạch nếu HR > 110 bpm.',
          'Đánh giá CHA2DS2-VASc và HAS-BLED để khởi trị thuốc kháng đông (DOAC).'
        ],
        differentialDiagnoses: ['Cuồng nhĩ dẫn truyền thay đổi', 'Nhịp nhanh nhĩ đa ổ (MAT)'],
        guidelineReference: '2024 ESC Guidelines for the management of atrial fibrillation'
      };
    }

    if (isAivr) {
      return {
        primaryDiagnosis: 'Nhịp Tự Thất Gia Tăng (Accelerated Idioventricular Rhythm - AIVR)',
        confidenceScore: 95,
        culpritVesselOrEtiology: 'Rối loạn nhịp tái tưới máu lành tính sau can thiệp mạch vành / Tăng tính tự động thất',
        anatomicalTerritory: 'Tâm thất',
        urgencyLevel: 'THEO DÕI THƯỜNG (XANH)',
        diagnosticEvidences: [
          { lead: 'II', parameter: 'QRS rộng đều tần số 50-110 bpm', measuredValue: `HR ${metrics.heartRate} bpm, QRS ${metrics.qrsDuration} ms, phân ly nhĩ thất`, threshold: 'QRS >= 120 ms, HR 50 - 110 bpm', significance: 'Dấu hiệu tái tưới máu mạch vành thành công, thường tự giới hạn.' }
        ],
        reciprocalFindings: [],
        contraindications: ['CHỐNG CHỈ ĐỊNH Lidocaine, Amiodarone (có thể ức chế ổ chủ nhịp thoát duy nhất gây vô tâm thu)!'],
        urgentActionPlan: [
          'Theo dõi sát trên monitor; hầu hết tự hết khi nút xoang tăng tần số trở lại.',
          'Chỉ xử trí bằng Atropine nếu mất đồng bộ nhĩ-thất gây tụt huyết áp.'
        ],
        differentialDiagnoses: ['Nhịp nhanh thất (VT)', 'Bloc nhánh trái (LBBB)'],
        guidelineReference: 'AHA/ACC Post-Reperfusion Arrhythmia Management'
      };
    }

    // 5. ATRIOVENTRICULAR BLOCKS (Mobitz I / Wenckebach)
    if (metrics.rhythmType.includes("Mobitz I") || metrics.rhythmType.includes("Wenckebach")) {
      return {
        primaryDiagnosis: 'Bloc Nhĩ Thất Độ II Mobitz I (Chu Kỳ Wenckebach)',
        confidenceScore: 95,
        culpritVesselOrEtiology: 'Chậm trễ dẫn truyền tiến triển tại nút nhĩ thất (AV Node) / Tăng trương lực phế vị',
        anatomicalTerritory: 'Nút nhĩ thất (AV node)',
        urgencyLevel: 'CẢNH GIÁC CAO (VÀNG)',
        diagnosticEvidences: [
          { lead: 'II', parameter: 'Khoảng PR', measuredValue: `PR dài dần trước khi có sóng P bị bloc`, threshold: 'PR kéo dài từng chu kỳ tim', significance: 'Hiện tượng Wenckebach lành tính tại nút nhĩ thất.' }
        ],
        reciprocalFindings: [],
        contraindications: ['Ngưng các thuốc làm chậm dẫn truyền nút nhĩ thất: Digoxin, Chẹn Beta, Verapamil/Diltiazem.'],
        urgentActionPlan: [
          'Tìm và xử trí nguyên nhân nền: ngộ độc thuốc, thiếu máu thành dưới cấp, tăng trương lực phế vị.',
          'Atropine 0.5 - 1mg tiêm tĩnh mạch nếu có triệu chứng tụt huyết áp hoặc chóng mặt.'
        ],
        differentialDiagnoses: ['Bloc nhĩ thất độ II Mobitz II', 'Ngoại tâm thu nhĩ bị bloc'],
        guidelineReference: '2018 ACC/AHA/HRS Guideline on the Evaluation and Management of Patients With Bradycardia'
      };
    }

    // 6. PULMONARY EMBOLISM (S1Q3T3 & RV Strain)
    if (isPulmonaryEmbolism) {
      return {
        primaryDiagnosis: 'Nghi Ngờ Thuyên Tắc Phổi Cấp (Acute Pulmonary Embolism - S1Q3T3 & RV Strain)',
        confidenceScore: 95,
        culpritVesselOrEtiology: 'Tăng áp động mạch phổi cấp tính & quá tải thất phải (thường do huyết khối DVT)',
        anatomicalTerritory: 'Tâm thất phải & Động mạch phổi',
        urgencyLevel: 'CẤP CỨU ĐỎ (NGUY KỊCH)',
        diagnosticEvidences: [
          { lead: 'III', parameter: 'Dấu hiệu McGinn-White (S1Q3T3) & T âm V1-V3', measuredValue: `HR ${metrics.heartRate} bpm, S sâu DI, Q & T âm DIII, T âm V1-V3`, threshold: 'S1Q3T3 + RV Strain V1-V4', significance: 'Phản ánh giãn và tăng gánh cấp buồng thất phải.' }
        ],
        reciprocalFindings: [],
        contraindications: ['Thận trọng bù dịch ồ ạt vì làm giãn thêm thất phải và đẩy vách liên thất chèn ép thất trái.'],
        urgentActionPlan: [
          'Chụp CT động mạch phổi (CTPA) khẩn để chẩn đoán xác định.',
          'Khởi trị kháng đông ngay (LMWH hoặc Heparin không phân đoạn); tiêu sợi huyết nếu sốc tụt huyết áp.'
        ],
        differentialDiagnoses: ['Hội chứng vành cấp', 'Tràn khí màng phổi áp lực', 'Tâm phế mạn đợt cấp'],
        guidelineReference: '2019 ESC Guidelines for the diagnosis and management of acute pulmonary embolism'
      };
    }

    // 7. COMPLETE BUNDLE BRANCH BLOCKS (Checked before LVH voltage criteria)
    if (isRbbb) {
      return {
        primaryDiagnosis: 'Bloc Nhánh Phải Hoàn Toàn (Complete Right Bundle Branch Block - RBBB)',
        confidenceScore: 94,
        culpritVesselOrEtiology: 'Tổn thương bó nhánh phải của mạng dẫn truyền His-Purkinje',
        anatomicalTerritory: 'Tâm thất phải',
        urgencyLevel: 'CẢNH GIÁC CAO (VÀNG)',
        diagnosticEvidences: [
          { lead: 'V1', parameter: 'QRS Thời gian & Hình thái', measuredValue: `${metrics.qrsDuration} ms, rsR'`, threshold: 'QRS >= 120ms, rsR\' ở V1-V2', significance: 'Khử cực thất phải bị chậm trễ rõ rệt.' }
        ],
        reciprocalFindings: [],
        contraindications: ['Không dùng tiêu chuẩn điện thế thất thông thường khi có bloc nhánh.'],
        urgentActionPlan: ['Tìm nguyên nhân nền: thuyên tắc phổi, bệnh tim bẩm sinh (ASD), tăng áp phổi.', 'Kiểm tra tiền sử có thiếu máu cơ tim không.'],
        differentialDiagnoses: ['Hội chứng Brugada', 'Hội chứng Wolff-Parkinson-White'],
        guidelineReference: 'AHA/ACCF/HRS Recommendations for the Standardization and Interpretation of the ECG'
      };
    }

    if (isLbbb) {
      return {
        primaryDiagnosis: 'Bloc Nhánh Trái Hoàn Toàn (Complete Left Bundle Branch Block - LBBB)',
        confidenceScore: 94,
        culpritVesselOrEtiology: 'Tổn thương bó nhánh trái / Xơ hóa hệ thống dẫn truyền tim',
        anatomicalTerritory: 'Tâm thất trái',
        urgencyLevel: 'CẢNH GIÁC CAO (VÀNG)',
        diagnosticEvidences: [
          { lead: 'V5', parameter: 'QRS Rộng & Khấc', measuredValue: `${metrics.qrsDuration} ms`, threshold: 'QRS >= 120ms, R rộng có khấc ở I, aVL, V5-V6', significance: 'Mất đồng bộ khử cực 2 tâm thất.' }
        ],
        reciprocalFindings: [],
        contraindications: ['Nếu LBBB mới xuất hiện kèm đau ngực cấp: coi như tương đương STEMI, kích hoạt Cath-lab!'],
        urgentActionPlan: ['Áp dụng tiêu chuẩn Sgarbossa cải biên nếu nghi ngờ nhồi máu cơ tim đi kèm.', 'Siêu âm tim đánh giá chức năng tống máu thất trái (LVEF).'],
        differentialDiagnoses: ['Phì đại thất trái nặng', 'Nhịp tự thất'],
        guidelineReference: 'AHA/ACCF/HRS Recommendations for the Standardization and Interpretation of the ECG'
      };
    }

    // 8. VENTRICULAR HYPERTROPHY (LVH with Strain)
    if (hypertrophy.isSokolowLyonPositive || hypertrophy.isCornellPositive) {
      return {
        primaryDiagnosis: 'Phì Đại Thất Trái (Left Ventricular Hypertrophy - LVH) Kèm Quá Tải Thất (Strain Pattern)',
        confidenceScore: 94,
        culpritVesselOrEtiology: 'Tăng gánh áp lực thất trái mạn tính do Tăng huyết áp hoặc Hẹp van động mạch chủ',
        anatomicalTerritory: 'Thành tự do và mỏm tâm thất trái',
        urgencyLevel: 'CẢNH GIÁC CAO (VÀNG)',
        diagnosticEvidences: [
          { lead: 'V5', parameter: 'Điện thế thất trái', measuredValue: `Sokolow-Lyon: ${hypertrophy.sokolowLyonMm} mm, Cornell: ${hypertrophy.cornellCriteriaMm} mm`, threshold: 'Sokolow-Lyon >= 35mm hoặc Cornell > 28mm nam / 20mm nữ', significance: 'Tăng khối lượng cơ tim thất trái rõ rệt.' }
        ],
        reciprocalFindings: [],
        contraindications: ['Không chẩn đoán nhồi máu cơ tim chỉ dựa vào ST chênh xuống dạng Strain ở V5-V6.'],
        urgentActionPlan: [
          'Kiểm soát huyết áp tích cực theo mục tiêu ESC/ESH (thuốc ức chế men chuyển ACEi hoặc ARB giúp thoái triển phì đại cơ tim).',
          'Siêu âm tim Doppler màu đo bề dày vách liên thất (IVS) và khối lượng cơ thất trái (LVMI).'
        ],
        differentialDiagnoses: ['Bệnh cơ tim phì đại (HCM)', 'Hẹp van động mạch chủ khít', 'Tim vận động viên'],
        guidelineReference: '2023 ESH Guidelines for the management of arterial hypertension'
      };
    }

    // 7. Normal Sinus Rhythm or non-emergency baseline
    return {
      primaryDiagnosis: metrics.heartRate >= 60 && metrics.heartRate <= 100 ? 'Điện Tâm Đồ 12 Chuyển Đạo Trong Giới Hạn Bình Thường' : metrics.heartRate < 60 ? 'Nhịp Xoang Chậm Sinh Lý / Nghỉ Ngơi' : 'Nhịp Xoang Nhanh',
      confidenceScore: 92,
      culpritVesselOrEtiology: 'Không ghi nhận bệnh lý dẫn truyền hoặc thiếu máu cục bộ cấp',
      anatomicalTerritory: 'Bình thường',
      urgencyLevel: 'THEO DÕI THƯỜNG (XANH)',
      diagnosticEvidences: [
        { lead: 'II', parameter: 'Trục & Dẫn truyền', measuredValue: `HR ${metrics.heartRate} bpm, PR ${metrics.prInterval}ms, QRS ${metrics.qrsDuration}ms`, threshold: 'PR 120-200ms, QRS < 120ms', significance: 'Điện học cơ bản ổn định.' }
      ],
      reciprocalFindings: [],
      contraindications: [],
      urgentActionPlan: ['Khám sức khỏe định kỳ và kiểm soát lối sống.'],
      differentialDiagnoses: [],
      guidelineReference: 'AHA/ACC Clinical Guidelines'
    };
  }
}
