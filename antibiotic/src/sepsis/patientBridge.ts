/**
 * Bidirectional Clinical Data Bridge between SepsisCDSS & InfectoDose CDSS
 * Synchronizes demographics, renal creatinine/CrCl, SOFA/Phoenix scores,
 * infection source, MDR risk factors, T2Bacteria molecular genetics, and quick dosing drugs.
 */

import { PatientState } from '../types';
import {
  InfectionSite,
  MdrPathogenCategory,
  Population,
  SepsisSource,
  SpecificPathogenRisk
} from '../selection/types';
import { CDSSAssessmentResult, InfectionSource, PatientData } from './types';

export interface SepsisToAntibioticBridgeSnapshot {
  population: Population;
  site: InfectionSite;
  sepsisSource?: SepsisSource;
  sofaScore: number;
  psofaScore: number;
  generalRiskIds: string[];
  specificRisks: SpecificPathogenRisk[];
  specificRiskFactorIds: string[];
  suggestedMdrCategory?: MdrPathogenCategory;
  suggestedCreEnzyme?: 'kpc' | 'oxa48' | 'mbl';
  isMaternal: boolean;
  syncHighlightsVi: string[];
}

export interface QuickSepsisDrugChip {
  drugId: string;
  label: string;
  role: 'primary' | 'combination' | 'targeted_mdr' | 'alternative';
  noteVi?: string;
}

/**
 * Synchronize Sepsis PatientData -> Antibiotic Renal PatientState
 */
export function syncSepsisToRenalPatient(
  sepsis: PatientData,
  prevRenal: PatientState
): PatientState {
  let scr = prevRenal.scr;
  if (sepsis.creatinineUmolL !== undefined && sepsis.creatinineUmolL > 0) {
    scr =
      prevRenal.scrUnit === 'mgdl'
        ? Math.round((sepsis.creatinineUmolL / 88.4) * 100) / 100
        : Math.round(sepsis.creatinineUmolL);
  }

  return {
    ...prevRenal,
    age: sepsis.ageYears > 0 ? sepsis.ageYears : prevRenal.age,
    gender: sepsis.gender === 'female' ? 'f' : 'm',
    weight: sepsis.weightKg > 0 ? sepsis.weightKg : prevRenal.weight,
    height: sepsis.heightCm !== undefined ? sepsis.heightCm : prevRenal.height,
    dialysis: sepsis.dialysis !== undefined ? sepsis.dialysis : prevRenal.dialysis,
    scr
  };
}

/**
 * Synchronize Antibiotic Renal PatientState updates -> Sepsis PatientData
 */
export function syncRenalToSepsisPatient(
  updatedRenal: Partial<PatientState>,
  prevSepsis: PatientData,
  nextRenal: PatientState
): PatientData {
  const next: PatientData = { ...prevSepsis };

  if (updatedRenal.age !== undefined && updatedRenal.age > 0) {
    next.ageYears = updatedRenal.age;
    if (updatedRenal.age < 18 && next.patientType !== 'pediatric') {
      next.patientType = 'pediatric';
    } else if (updatedRenal.age >= 18 && next.patientType === 'pediatric') {
      next.patientType = 'adult';
    }
  }

  if (updatedRenal.gender !== undefined) {
    next.gender = updatedRenal.gender === 'f' ? 'female' : 'male';
    if (updatedRenal.gender === 'm' && next.patientType === 'maternal') {
      next.patientType = 'adult';
    }
  }

  if (updatedRenal.weight !== undefined && updatedRenal.weight > 0) {
    next.weightKg = updatedRenal.weight;
  }

  if (updatedRenal.height !== undefined) {
    next.heightCm = updatedRenal.height || undefined;
  }

  if (updatedRenal.dialysis !== undefined) {
    next.dialysis = updatedRenal.dialysis;
  }

  if (updatedRenal.scr !== undefined || updatedRenal.scrUnit !== undefined) {
    if (nextRenal.scr > 0) {
      next.creatinineUmolL =
        nextRenal.scrUnit === 'mgdl'
          ? Math.round(nextRenal.scr * 88.4)
          : Math.round(nextRenal.scr);
    }
  }

  return next;
}

/**
 * Map Sepsis InfectionSource + Diagnosis -> Antibiotic InfectionSite & SepsisSource
 */
export function mapSepsisSourceToInfectionSite(
  source: InfectionSource,
  primaryDiagnosis: CDSSAssessmentResult['primaryDiagnosis']
): { site: InfectionSite; sepsisSource?: SepsisSource } {
  const isConfirmedSepsisOrShock =
    primaryDiagnosis === 'confirmed_sepsis' || primaryDiagnosis === 'septic_shock';

  if (source === 'bloodstream_catheter' || source === 'unknown' || source === 'pelvic_obstetric') {
    return {
      site: 'sepsis',
      sepsisSource: source === 'pelvic_obstetric' ? 'urinary' : undefined
    };
  }

  if (isConfirmedSepsisOrShock) {
    // Keep specific site when CNS (meningitis requires specific CNS dosing/regimen)
    if (source === 'cns') {
      return { site: 'cns' };
    }
    const mappedSepsisSource: SepsisSource =
      source === 'abdominal'
        ? 'gastrointestinal'
        : source === 'respiratory'
        ? 'respiratory'
        : source === 'urinary'
        ? 'urinary'
        : 'skin_soft_tissue';
    return {
      site: 'sepsis',
      sepsisSource: mappedSepsisSource
    };
  }

  switch (source) {
    case 'respiratory':
      return { site: 'respiratory' };
    case 'urinary':
      return { site: 'urinary' };
    case 'abdominal':
      return { site: 'gastrointestinal' };
    case 'skin_soft_tissue':
      return { site: 'skin_soft_tissue' };
    case 'cns':
      return { site: 'cns' };
    default:
      return { site: 'respiratory' };
  }
}

/**
 * Automatically derive Antibiotic Selection parameters from Sepsis assessment
 */
export function deriveAntibioticBridgeFromSepsis(
  patient: PatientData,
  result: CDSSAssessmentResult
): SepsisToAntibioticBridgeSnapshot {
  const population: Population =
    patient.patientType === 'pediatric' || patient.ageYears < 18 ? 'pediatric' : 'adult';
  const isMaternal = patient.patientType === 'maternal' || Boolean(patient.pregnancyWeek || patient.isPostpartum);

  const { site, sepsisSource } = mapSepsisSourceToInfectionSite(
    patient.infectionSource,
    result.primaryDiagnosis
  );

  const sofaScore =
    patient.patientType === 'maternal' && result.obstetricSofaScore !== undefined
      ? result.obstetricSofaScore
      : result.sofaScore;
  const psofaScore = result.phoenixScore ?? 0;

  const generalRiskIds: string[] = [];
  const specificRisks = new Set<SpecificPathogenRisk>();
  const specificRiskFactorIds: string[] = [];
  const syncHighlightsVi: string[] = [];

  if (patient.setting === 'icu') {
    generalRiskIds.push('hospital_90d');
    specificRisks.add('pseudo_acineto');
    specificRiskFactorIds.push('ps_icu_5d');
    syncHighlightsVi.push('Bối cảnh ICU → Gợi ý Nhóm 2 & nguy cơ P. aeruginosa/Acinetobacter');
  }
  if (patient.hasIndwellingCatheter || patient.hasRecentSurgery) {
    generalRiskIds.push('invasive_device');
    if (patient.hasIndwellingCatheter) {
      specificRisks.add('mrsa');
      specificRiskFactorIds.push('mrsa_cvc_foley');
      specificRisks.add('pseudo_acineto');
      specificRiskFactorIds.push('ps_devices');
    }
  }
  if (patient.hasRepeatedAntibioticUse) {
    generalRiskIds.push('iv_abx_30d');
    specificRisks.add('esbl');
  }
  if (patient.hasImmunosuppression) {
    generalRiskIds.push('transplant_chemo');
  }
  if (patient.ageYears > 60) {
    generalRiskIds.push('age_over_60');
  }

  // Rapid Molecular T2Bacteria / T2Resistance mapping
  let suggestedMdrCategory: MdrPathogenCategory | undefined = undefined;
  let suggestedCreEnzyme: 'kpc' | 'oxa48' | 'mbl' | undefined = undefined;

  if (patient.rapidMolecularT2Done && patient.rapidMolecularResult === 'positive') {
    const genes = (patient.rapidMolecularResistanceGenes || []).map(g => g.toLowerCase());
    const pathogen = (patient.rapidMolecularPathogen || '').toLowerCase();

    if (genes.some(g => g.includes('ctx-m') || g.includes('esbl'))) {
      specificRisks.add('esbl');
      syncHighlightsVi.push('T2Resistance (+): blaCTX-M (ESBL) → Ưu tiên Carbapenem');
    }
    if (genes.some(g => g.includes('meca'))) {
      specificRisks.add('mrsa');
      syncHighlightsVi.push('T2Resistance (+): mecA (MRSA) → Phủ Vancomycin/Linezolid');
    }
    if (genes.some(g => g.includes('oxa-48') || g.includes('oxa48'))) {
      suggestedMdrCategory = 'cre';
      suggestedCreEnzyme = 'oxa48';
      syncHighlightsVi.push('T2Resistance (+): blaOXA-48 (CRE) → Kích hoạt nhánh Ceftazidime/Avibactam');
    } else if (genes.some(g => g.includes('kpc'))) {
      suggestedMdrCategory = 'cre';
      suggestedCreEnzyme = 'kpc';
      syncHighlightsVi.push('T2Resistance (+): blaKPC (CRE) → Kích hoạt nhánh Ceftazidime/Avibactam');
    } else if (genes.some(g => g.includes('ndm') || g.includes('vim') || g.includes('imp'))) {
      suggestedMdrCategory = 'cre';
      suggestedCreEnzyme = 'mbl';
      syncHighlightsVi.push('T2Resistance (+): MBL (NDM/VIM) → Kích hoạt nhánh CAZ-AVI + Aztreonam');
    } else if (pathogen.includes('pseudomonas')) {
      specificRisks.add('pseudo_acineto');
      suggestedMdrCategory = 'dtr_pseudo';
    } else if (pathogen.includes('acinetobacter')) {
      specificRisks.add('pseudo_acineto');
      suggestedMdrCategory = 'crab';
    }
  }

  if (sofaScore >= 2) {
    syncHighlightsVi.unshift(`SOFA = ${sofaScore}đ (≥ 2) → Tự động phân tầng độ nặng cao`);
  } else if (population === 'pediatric' && psofaScore >= 2) {
    syncHighlightsVi.unshift(`Phoenix Sepsis = ${psofaScore}đ → Tự động đồng bộ độ nặng Nhi`);
  }

  return {
    population,
    site,
    sepsisSource,
    sofaScore,
    psofaScore,
    generalRiskIds: Array.from(new Set(generalRiskIds)),
    specificRisks: Array.from(specificRisks),
    specificRiskFactorIds: Array.from(new Set(specificRiskFactorIds)),
    suggestedMdrCategory,
    suggestedCreEnzyme,
    isMaternal,
    syncHighlightsVi
  };
}

/**
 * Extract directly clickable Antibiotic Calculator chips for Stage 1 Sepsis Hour-1 Bundle
 */
export function extractSepsisQuickDrugChips(
  patient: PatientData,
  result: CDSSAssessmentResult
): QuickSepsisDrugChip[] {
  if (result.primaryDiagnosis === 'no_sepsis') {
    return [];
  }

  const chips: QuickSepsisDrugChip[] = [];
  const addChip = (chip: QuickSepsisDrugChip) => {
    if (!chips.some(c => c.drugId === chip.drugId)) {
      chips.push(chip);
    }
  };

  // 1. Targeted molecular T2MR overrides
  if (patient.rapidMolecularT2Done && patient.rapidMolecularResult === 'positive') {
    const genes = (patient.rapidMolecularResistanceGenes || []).map(g => g.toLowerCase());
    if (genes.some(g => g.includes('kpc') || g.includes('oxa-48') || g.includes('oxa48'))) {
      addChip({
        drugId: 'ceftazidim_avibactam',
        label: 'Ceftazidime/Avibactam',
        role: 'targeted_mdr',
        noteVi: 'Trúng đích KPC / OXA-48'
      });
      addChip({
        drugId: 'aztreonam',
        label: 'Aztreonam',
        role: 'combination',
        noteVi: 'Phối hợp nếu nghi MBL'
      });
      return chips;
    }
    if (genes.some(g => g.includes('ctx-m'))) {
      addChip({
        drugId: 'meropenem',
        label: 'Meropenem (TKD)',
        role: 'targeted_mdr',
        noteVi: 'Ưu tiên cho ESBL CTX-M'
      });
      addChip({
        drugId: 'ceftolozan_tazo',
        label: 'Ceftolozane/Tazo',
        role: 'alternative',
        noteVi: 'Lựa chọn thay thế'
      });
      return chips;
    }
  }

  // 2. Maternal Sepsis
  if (patient.patientType === 'maternal') {
    addChip({ drugId: 'meropenem', label: 'Meropenem', role: 'primary', noteVi: 'Truyền kéo dài 3-4h' });
    addChip({ drugId: 'daptomycin', label: 'Daptomycin', role: 'combination', noteVi: 'Phủ Gram (+)' });
    addChip({ drugId: 'linezolid', label: 'Linezolid', role: 'alternative', noteVi: 'Thay thế Gram (+)' });
    if (patient.hasImmunosuppression) {
      addChip({ drugId: 'aztreonam', label: 'Aztreonam', role: 'alternative', noteVi: 'Dị ứng Penicillin' });
      addChip({ drugId: 'amikacin', label: 'Amikacin', role: 'combination' });
    }
    return chips;
  }

  // 3. Pediatric Sepsis
  if (patient.patientType === 'pediatric') {
    addChip({ drugId: 'ceftriaxon', label: 'Ceftriaxone', role: 'primary' });
    addChip({ drugId: 'cefotaxim', label: 'Cefotaxime', role: 'alternative' });
    addChip({ drugId: 'vancomycin', label: 'Vancomycin', role: 'combination', noteVi: 'Nếu nghi MRSA' });
    return chips;
  }

  // 4. Adult Empiric by Source
  switch (patient.infectionSource) {
    case 'respiratory':
      addChip({ drugId: 'piperacillin_tazo', label: 'Pip/Tazobactam', role: 'primary', noteVi: 'TKD 3-4h' });
      addChip({ drugId: 'cefepim', label: 'Cefepime', role: 'primary' });
      addChip({ drugId: 'meropenem', label: 'Meropenem', role: 'alternative', noteVi: 'Nếu sốc/nguy cơ ESBL' });
      addChip({ drugId: 'levofloxacin', label: 'Levofloxacin', role: 'combination', noteVi: 'Không điển hình' });
      if (patient.hasIndwellingCatheter || patient.setting === 'icu') {
        addChip({ drugId: 'vancomycin', label: 'Vancomycin', role: 'combination', noteVi: 'Phủ MRSA' });
      }
      break;
    case 'urinary':
      addChip({ drugId: 'ceftriaxon', label: 'Ceftriaxone', role: 'primary', noteVi: 'Nhóm 1' });
      addChip({ drugId: 'meropenem', label: 'Meropenem', role: 'primary', noteVi: 'Nếu nguy cơ ESBL / Sốc' });
      addChip({ drugId: 'amikacin', label: 'Amikacin', role: 'combination', noteVi: 'Phối hợp sốc' });
      break;
    case 'abdominal':
      addChip({ drugId: 'piperacillin_tazo', label: 'Pip/Tazobactam', role: 'primary' });
      addChip({ drugId: 'meropenem', label: 'Meropenem', role: 'primary', noteVi: 'Sốc / ESBL' });
      addChip({ drugId: 'metronidazol', label: 'Metronidazole', role: 'combination', noteVi: 'Kỵ khí sâu' });
      break;
    case 'cns':
      addChip({ drugId: 'ceftriaxon', label: 'Ceftriaxone 2g q12h', role: 'primary' });
      addChip({ drugId: 'meropenem', label: 'Meropenem 2g q8h', role: 'alternative', noteVi: 'Liều màng não' });
      addChip({ drugId: 'vancomycin', label: 'Vancomycin', role: 'combination', noteVi: 'Phủ phế cầu kháng/MRSA' });
      break;
    case 'skin_soft_tissue':
      addChip({ drugId: 'vancomycin', label: 'Vancomycin', role: 'primary', noteVi: 'Phủ MRSA' });
      addChip({ drugId: 'piperacillin_tazo', label: 'Pip/Tazobactam', role: 'combination' });
      addChip({ drugId: 'clindamycin', label: 'Clindamycin', role: 'combination', noteVi: 'Chống độc tố' });
      break;
    default:
      addChip({ drugId: 'meropenem', label: 'Meropenem', role: 'primary', noteVi: 'Phổ rộng giờ vàng' });
      addChip({ drugId: 'vancomycin', label: 'Vancomycin', role: 'combination', noteVi: 'Nếu nguy cơ MRSA' });
      addChip({ drugId: 'piperacillin_tazo', label: 'Pip/Tazobactam', role: 'alternative' });
      break;
  }

  return chips;
}

/**
 * Generate Unified SBAR (Sepsis) + Antimicrobial Consultation Summary for EMR / HIS
 */
export function buildUnifiedConsultationSummary(params: {
  patient: PatientState;
  renal: { crcl: number; ibw: number | null; bmi: number | null; categoryLabelVi: string };
  sepsisPatient: PatientData;
  sepsisResult: CDSSAssessmentResult;
  site?: InfectionSite;
  riskGroupLabelVi?: string;
  selectedDrugName?: string;
  doseSummaryVi?: string;
}): string {
  const {
    patient,
    renal,
    sepsisPatient,
    sepsisResult,
    site,
    riskGroupLabelVi,
    selectedDrugName,
    doseSummaryVi
  } = params;

  const siteNames: Record<string, string> = {
    respiratory: 'Hô hấp (HAP/VAP/CAP)',
    sepsis: 'Nhiễm khuẩn huyết / Sốc nhiễm khuẩn',
    skin_soft_tissue: 'Nhiễm trùng Da & Mô mềm',
    urinary: 'Nhiễm trùng Tiết niệu',
    peritoneal: 'Viêm phúc mạc / Dịch báng (SBP)',
    gastrointestinal: 'Tiêu hóa - Ổ bụng',
    cns: 'Thần kinh trung ương'
  };

  return `=== TÓM TẮT HỘI CHẨN SEPSIS & KHÁNG SINH (InfectoSepsis CDSS v4.0) ===
1. BỆNH NHÂN & THẬN: ${sepsisPatient.patientType === 'adult' ? 'Người lớn' : sepsisPatient.patientType === 'pediatric' ? 'Nhi khoa' : 'Sản khoa'}, ${patient.age} tuổi, ${patient.gender === 'm' ? 'Nam' : 'Nữ'} | CN: ${patient.weight} kg (IBW ${renal.ibw ?? 'N/A'} kg, BMI ${renal.bmi ?? 'N/A'})
   Scr: ${patient.scr} ${patient.scrUnit === 'umol' ? 'µmol/L' : 'mg/dL'} | CrCl: ${renal.crcl} mL/phút (${renal.categoryLabelVi}) | Lọc máu: ${patient.dialysis === 'none' ? 'Không' : patient.dialysis.toUpperCase()}
2. ĐÁNH GIÁ SEPSIS (GIỜ VÀNG): ${sepsisResult.primaryDiagnosis.toUpperCase()} (Mức: ${sepsisResult.urgencyLevel.toUpperCase()})
   Sinh hiệu: HA ${sepsisPatient.sbp}/${sepsisPatient.dbp} (MAP ${sepsisResult.calculatedMap} mmHg) | HR ${sepsisPatient.heartRate} | RR ${sepsisPatient.respiratoryRate} | T° ${sepsisPatient.temperature}°C | SpO2 ${sepsisPatient.spo2}%
   Điểm số: NEWS2 ${sepsisResult.news2Score} | LP-NEWS ${sepsisResult.lpNewsScore} | SOFA ${sepsisResult.sofaScore} | SIRS ${sepsisResult.sirsScore}/4 | qSOFA ${sepsisResult.qsofaScore}/3 | NLR ${sepsisResult.calculatedNlr ?? 'N/A'} | Lactate ${sepsisPatient.lactateInitial ?? 'N/A'} mmol/L (TT ${sepsisResult.lactateClearancePercent ?? 'N/A'}%)
   Hồi sức: ${sepsisResult.actions.antibioticTiming.split('.')[0]}
3. PHÂN TẦNG MDR & KHÁNG SINH (BVBND 2026):
   Ổ nhiễm: ${site ? siteNames[site] || site : sepsisPatient.infectionSource} | ${riskGroupLabelVi || (sepsisResult.sofaScore >= 2 ? 'NHÓM 2 (Nguy cơ cao VKĐK)' : 'NHÓM 1 (Ít nguy cơ VKĐK)')}
   Kháng sinh chỉ định: ${selectedDrugName || 'Theo phác đồ BVBND 2026'}${doseSummaryVi ? `\n   Liều cá thể hóa: ${doseSummaryVi}` : ''}
4. KẾ HOẠCH AMS: Cấy máu trước KS, theo dõi động học Lactate/PCT/NLR & tái đánh giá xuống thang sau 48-72h.`;
}
