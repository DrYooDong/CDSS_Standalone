import { CalculatedRenalMetrics, PatientState } from '../../types';
import { InfectionSite, Population } from '../types';
import {
  AtsCapInputs,
  ClifSbpInputs,
  ClinicalScoreId,
  CnsMeningitisInputs,
  CpisInputs,
  Curb65Inputs,
  EronSstiInputs,
  LrinecInputs,
  PsiInputs,
  PsofaInputs,
  QsofaInputs,
  ScoreCalculationResult,
  ScoreDefinitionMeta,
  SofaFullInputs,
  Tg18BiliaryInputs,
  UtiEsblInputs
} from './scoringTypes';

export const SCORE_DEFINITIONS: ScoreDefinitionMeta[] = [
  // Respiratory
  {
    id: 'curb65',
    shortName: 'CURB-65',
    titleVi: 'Thang điểm CURB-65 (Viêm phổi cộng đồng)',
    subtitleVi: 'Đánh giá mức độ nặng & chỉ định nhập viện / ICU trong CAP người lớn',
    sites: ['respiratory'],
    populations: ['adult'],
    badgeText: 'CAP'
  },
  {
    id: 'psi',
    shortName: 'PSI / PORT',
    titleVi: 'Thang điểm PSI / PORT (20 biến số)',
    subtitleVi: 'Phân tầng tiên lượng tử vong 30 ngày & nơi điều trị CAP (Class I - V)',
    sites: ['respiratory'],
    populations: ['adult'],
    badgeText: 'CAP chi tiết'
  },
  {
    id: 'ats_cap',
    shortName: 'ATS/IDSA CAP',
    titleVi: 'Tiêu chuẩn ATS/IDSA Viêm phổi Nặng',
    subtitleVi: '2 tiêu chuẩn chính + 9 tiêu chuẩn phụ chỉ định ICU & tầm soát MRSA/Pseudomonas',
    sites: ['respiratory'],
    populations: ['adult'],
    badgeText: 'ICU'
  },
  {
    id: 'cpis',
    shortName: 'CPIS (VAP)',
    titleVi: 'Thang điểm CPIS (Viêm phổi bệnh viện / Thở máy)',
    subtitleVi: 'Hỗ trợ chẩn đoán VAP (ngưỡng > 6 điểm) & theo dõi ngưng kháng sinh',
    sites: ['respiratory'],
    populations: ['adult', 'pediatric'],
    badgeText: 'HAP/VAP'
  },

  // Sepsis
  {
    id: 'qsofa',
    shortName: 'qSOFA',
    titleVi: 'Thang điểm qSOFA (Sàng lọc nhanh)',
    subtitleVi: 'Sàng lọc nguy cơ tử vong / suy tạng ngoài ICU (≥ 2 điểm cần đánh giá SOFA)',
    sites: ['sepsis', 'respiratory', 'urinary', 'skin_soft_tissue'],
    populations: ['adult'],
    badgeText: 'Sàng lọc'
  },
  {
    id: 'sofa_full',
    shortName: 'SOFA (6 hệ)',
    titleVi: 'Thang điểm SOFA đầy đủ (6 hệ cơ quan)',
    subtitleVi: 'Chẩn đoán suy tạng Sepsis-3 & đồng bộ trực tiếp phân tầng BVBND 2026 (≥ 2đ)',
    sites: ['sepsis'],
    populations: ['adult'],
    badgeText: 'Sepsis-3'
  },
  {
    id: 'psofa_calc',
    shortName: 'pSOFA Nhi',
    titleVi: 'Thang điểm pSOFA (Nhi khoa)',
    subtitleVi: 'Đánh giá suy tạng trẻ em (< 16 tuổi); pSOFA ≥ 8 là ngưỡng nặng BVBND 2026',
    sites: ['sepsis', 'respiratory'],
    populations: ['pediatric'],
    badgeText: 'Nhi khoa'
  },

  // Skin & Soft Tissue
  {
    id: 'lrinec',
    shortName: 'LRINEC',
    titleVi: 'Thang điểm LRINEC (Tầm soát Viêm cân hoại tử)',
    subtitleVi: 'Phân biệt viêm mô tế bào thường với viêm cân mạc hoại tử cấp cứu ngoại khoa',
    sites: ['skin_soft_tissue'],
    populations: ['adult', 'pediatric'],
    badgeText: 'Cấp cứu'
  },
  {
    id: 'eron_ssti',
    shortName: 'Eron SSTI',
    titleVi: 'Phân độ Eron / CREST (Da & Mô mềm)',
    subtitleVi: 'Phân tầng Class I - IV định hướng đường dùng kháng sinh (PO vs IV) & nhập viện',
    sites: ['skin_soft_tissue'],
    populations: ['adult'],
    badgeText: 'Class I-IV'
  },

  // Urinary
  {
    id: 'uti_esbl',
    shortName: 'Tumbarello ESBL',
    titleVi: 'Thang điểm Nguy cơ ESBL-UTI (Tumbarello)',
    subtitleVi: 'Dự báo nhiễm Enterobacterales sinh ESBL trong nhiễm trùng tiểu nhập viện',
    sites: ['urinary'],
    populations: ['adult'],
    badgeText: 'ESBL Risk'
  },

  // Peritoneal / GI
  {
    id: 'clif_sbp',
    shortName: 'CLIF-SOFA & SBP',
    titleVi: 'Thang điểm CLIF-SOFA & Chỉ định Albumin (SBP)',
    subtitleVi: 'Đánh giá suy tạng trên bệnh nhân xơ gan (ngưỡng ≥ 12đ) & dự phòng Hội chứng gan thận',
    sites: ['peritoneal', 'gastrointestinal'],
    populations: ['adult'],
    badgeText: 'Xơ gan'
  },
  {
    id: 'tg18_biliary',
    shortName: 'Tokyo TG18',
    titleVi: 'Phân độ Tokyo Guidelines 2018 (Đường mật/Ổ bụng)',
    subtitleVi: 'Phân độ nặng Grade I - III cho viêm đường mật/túi mật cấp & chỉ định dẫn lưu',
    sites: ['peritoneal', 'gastrointestinal'],
    populations: ['adult'],
    badgeText: 'Ổ bụng'
  },

  // CNS
  {
    id: 'cns_meningitis',
    shortName: 'BMS & Listeria',
    titleVi: 'Thang điểm Viêm màng não mủ (BMS) & Chỉ định Listeria',
    subtitleVi: 'Đánh giá nguy cơ viêm màng não vi khuẩn, chỉ định Ampicillin & Dexamethasone',
    sites: ['cns'],
    populations: ['adult', 'pediatric'],
    badgeText: 'DNT / CNS'
  }
];

export function getAvailableScoresForSite(
  site: InfectionSite,
  population: Population
): ScoreDefinitionMeta[] {
  return SCORE_DEFINITIONS.filter(
    s => s.sites.includes(site) && s.populations.includes(population)
  );
}

// Helper: auto renal subscore for SOFA (based on mg/dL)
export function inferSofaRenalFromScrMgdl(scrMgdl: number): 0 | 1 | 2 | 3 | 4 {
  if (scrMgdl >= 5.0) return 4;
  if (scrMgdl >= 3.5) return 3;
  if (scrMgdl >= 2.0) return 2;
  if (scrMgdl >= 1.2) return 1;
  return 0;
}

// Default Input Builders (Auto-prefill from PatientState & CalculatedRenalMetrics)
export function buildDefaultCurb65(patient: PatientState): Curb65Inputs {
  return {
    confusion: false,
    ureaOver7Mmol: false,
    rrOver30: false,
    bpLow: false,
    ageOver65: patient.age >= 65
  };
}

export function buildDefaultPsi(
  patient: PatientState,
  renal: CalculatedRenalMetrics,
  isChronicLiverDisease: boolean
): PsiInputs {
  return {
    age: patient.age || 60,
    isFemale: patient.gender === 'f',
    nursingHome: false,
    neoplasticDisease: false,
    liverDisease: isChronicLiverDisease,
    chf: false,
    cerebrovascularDisease: false,
    renalDisease: renal.crcl < 60 || patient.dialysis !== 'none',
    alteredMentalStatus: false,
    rrOver30: false,
    sbpUnder90: false,
    tempAbnormal: false,
    hrOver125: false,
    phUnder735: false,
    bunOver30: false,
    naUnder130: false,
    glucoseOver250: false,
    hctUnder30: false,
    pao2Under60: false,
    pleuralEffusion: false
  };
}

export function buildDefaultAtsCap(): AtsCapInputs {
  return {
    invasiveMechVent: false,
    septicShockVasopressors: false,
    rrOver30: false,
    pao2Fio2Under250: false,
    multilobarInfiltrates: false,
    confusion: false,
    bunOver20: false,
    wbcUnder4000: false,
    pltUnder100k: false,
    tempUnder36: false,
    hypotensionFluid: false
  };
}

export function buildDefaultCpis(): CpisInputs {
  return {
    tempScore: 0,
    wbcScore: 0,
    secretionsScore: 0,
    oxygenationLow: false,
    xrayScore: 0,
    progression: false,
    culturePositive: 0
  };
}

export function buildDefaultQsofa(): QsofaInputs {
  return {
    alteredMental: false,
    rrOver22: false,
    sbpUnder100: false
  };
}

export function buildDefaultSofaFull(renal: CalculatedRenalMetrics): SofaFullInputs {
  return {
    resp: 0,
    coag: 0,
    liver: 0,
    cardio: 0,
    cns: 0,
    renal: inferSofaRenalFromScrMgdl(renal.scrMgdl)
  };
}

export function buildDefaultPsofa(renal: CalculatedRenalMetrics): PsofaInputs {
  return {
    resp: 0,
    coag: 0,
    liver: 0,
    cardio: 0,
    cns: 0,
    renal: inferSofaRenalFromScrMgdl(renal.scrMgdl)
  };
}

export function buildDefaultLrinec(renal: CalculatedRenalMetrics): LrinecInputs {
  return {
    crpOver150: false,
    wbcTier: 0,
    hbTier: 0,
    naUnder135: false,
    crOver141: renal.scrUmol > 141,
    glucoseOver10: false
  };
}

export function buildDefaultEronSsti(): EronSstiInputs {
  return {
    systemicToxicity: 'none',
    uncontrolledComorbidity: false,
    rapidProgressionOrDeep: false
  };
}

export function buildDefaultUtiEsbl(patient: PatientState): UtiEsblInputs {
  return {
    recentHospitalization: false,
    transferFromHealthcare: false,
    recentAbx3m: false,
    urinaryCatheter: false,
    ageOver70: patient.age > 70,
    maleGender: patient.gender === 'm',
    isPyelonephritisOrSepsis: false
  };
}

export function buildDefaultClifSbp(renal: CalculatedRenalMetrics): ClifSbpInputs {
  return {
    liverBiliTier: 0,
    renalCrTier: inferSofaRenalFromScrMgdl(renal.scrMgdl),
    brainHeGrade: 0,
    coagInrTier: 0,
    circMapVasopressor: 0,
    respPao2Fio2Tier: 0,
    sbpScrOver1Mgdl: renal.scrMgdl > 1.0
  };
}

export function buildDefaultTg18Biliary(
  patient: PatientState,
  renal: CalculatedRenalMetrics
): Tg18BiliaryInputs {
  return {
    cardioVasopressor: false,
    neuroAltered: false,
    respPao2Fio2Under300: false,
    renalCrOver176: renal.scrUmol > 176.8,
    hepaticInrOver15: false,
    hematoPltUnder100k: false,
    wbcAbnormal: false,
    highFever39: false,
    ageOver75: patient.age >= 75,
    hyperbilirubinemia: false,
    hypoalbuminemia: false
  };
}

export function buildDefaultCnsMeningitis(patient: PatientState): CnsMeningitisInputs {
  return {
    gramStainPositive: false,
    csfProteinOver80: false,
    peripheralAncOver10k: false,
    csfAncOver1000: false,
    seizureAtPresentation: false,
    ageOver50: patient.age >= 50,
    immunocompromisedOrPregnant: false,
    neurosurgeryOrShunt: false
  };
}

// =========================================================================
// CALCULATION FUNCTIONS
// =========================================================================

export function calculateCurb65(inputs: Curb65Inputs): ScoreCalculationResult {
  const score =
    (inputs.confusion ? 1 : 0) +
    (inputs.ureaOver7Mmol ? 1 : 0) +
    (inputs.rrOver30 ? 1 : 0) +
    (inputs.bpLow ? 1 : 0) +
    (inputs.ageOver65 ? 1 : 0);

  if (score <= 1) {
    return {
      scoreId: 'curb65',
      scoreNameVi: 'Thang điểm CURB-65 (CAP)',
      shortName: 'CURB-65',
      totalScore: score,
      maxScore: 5,
      displayScoreText: `${score}/5 điểm`,
      riskClassVi: 'Nguy cơ thấp (Nhẹ)',
      riskLevel: 'low',
      mortalityTextVi: 'Tử vong 30 ngày: ~0.7% - 3.2%',
      dispositionVi: 'Điều trị ngoại trú (hoặc theo dõi ngắn nếu có bệnh nền).',
      antibioticImpactVi: 'Phù hợp Nhóm 1 (WHO Access: Amoxicillin uống liều cao 1g q8h x 5 ngày hoặc Amox/Clav ± Macrolide).',
      sourceText: 'BTS Guidelines / WHO AWaRe Book 2022 Ch.12',
      suggestedAction: {
        suggestGroup: 'group_1',
        actionLabelVi: 'Áp dụng: Nhóm 1 (CAP nhẹ ngoại trú)'
      }
    };
  }

  if (score === 2) {
    return {
      scoreId: 'curb65',
      scoreNameVi: 'Thang điểm CURB-65 (CAP)',
      shortName: 'CURB-65',
      totalScore: score,
      maxScore: 5,
      displayScoreText: `${score}/5 điểm`,
      riskClassVi: 'Nguy cơ trung bình',
      riskLevel: 'moderate',
      mortalityTextVi: 'Tử vong 30 ngày: ~9.2% - 13%',
      dispositionVi: 'Chỉ định NHẬP VIỆN điều trị nội trú (Khoa Nội / Hô hấp).',
      antibioticImpactVi: 'Khởi đầu đường tĩnh mạch: Ceftriaxone 2g/ngày hoặc Amox/Clav IV + Azithromycin/Clarithromycin (WHO Ch.27 khuyên phối hợp Macrolide khi CURB-65 ≥ 2).',
      sourceText: 'BTS Guidelines / WHO AWaRe Book 2022 Ch.27',
      suggestedAction: {
        suggestSofaScore: 1,
        actionLabelVi: 'Ghi nhận nhập viện (CURB-65 = 2)'
      }
    };
  }

  return {
    scoreId: 'curb65',
    scoreNameVi: 'Thang điểm CURB-65 (CAP)',
    shortName: 'CURB-65',
    totalScore: score,
    maxScore: 5,
    displayScoreText: `${score}/5 điểm`,
    riskClassVi: score >= 4 ? 'Nguy cơ rất cao (Nguy kịch)' : 'Nguy cơ cao (CAP Nặng)',
    riskLevel: score >= 4 ? 'critical' : 'high',
    mortalityTextVi: score >= 4 ? 'Tử vong 30 ngày: ~27% - 57%' : 'Tử vong 30 ngày: ~15% - 22%',
    dispositionVi: 'NHẬP VIỆN KHẨN CẤP / Cân nhắc chuyển ICU (bắt buộc nếu 4-5 điểm).',
    antibioticImpactVi: 'Đánh giá thêm tiêu chuẩn ATS/IDSA & yếu tố nguy cơ VKĐK (Pseudomonas / MRSA). Cân nhắc phác đồ IV phổ rộng (Nhóm 2) nếu có suy hô hấp nặng hoặc sốc.',
    sourceText: 'BTS Guidelines / BVBND 2026',
    suggestedAction: {
      suggestGroup: 'group_2',
      suggestSofaScore: score >= 4 ? 4 : 2,
      actionLabelVi: 'Đồng bộ mức độ Nặng (SOFA ≥ 2) vào CDSS'
    }
  };
}

export function calculatePsi(inputs: PsiInputs): ScoreCalculationResult {
  let score = inputs.age;
  if (inputs.isFemale) score -= 10;
  if (inputs.nursingHome) score += 10;
  if (inputs.neoplasticDisease) score += 30;
  if (inputs.liverDisease) score += 20;
  if (inputs.chf) score += 10;
  if (inputs.cerebrovascularDisease) score += 10;
  if (inputs.renalDisease) score += 10;
  if (inputs.alteredMentalStatus) score += 20;
  if (inputs.rrOver30) score += 20;
  if (inputs.sbpUnder90) score += 20;
  if (inputs.tempAbnormal) score += 15;
  if (inputs.hrOver125) score += 10;
  if (inputs.phUnder735) score += 30;
  if (inputs.bunOver30) score += 20;
  if (inputs.naUnder130) score += 20;
  if (inputs.glucoseOver250) score += 10;
  if (inputs.hctUnder30) score += 10;
  if (inputs.pao2Under60) score += 10;
  if (inputs.pleuralEffusion) score += 10;

  score = Math.max(0, score);

  const hasAnyComorbidOrVital =
    inputs.nursingHome ||
    inputs.neoplasticDisease ||
    inputs.liverDisease ||
    inputs.chf ||
    inputs.cerebrovascularDisease ||
    inputs.renalDisease ||
    inputs.alteredMentalStatus ||
    inputs.rrOver30 ||
    inputs.sbpUnder90 ||
    inputs.tempAbnormal ||
    inputs.hrOver125;

  // Fine et al. Class I check: Age <= 50 and no comorbid/vital criteria
  if (inputs.age <= 50 && !hasAnyComorbidOrVital && score <= 70) {
    return {
      scoreId: 'psi',
      scoreNameVi: 'Thang điểm PSI / PORT (Viêm phổi cộng đồng)',
      shortName: 'PSI / PORT',
      totalScore: score,
      displayScoreText: `${score} điểm (Class I)`,
      riskClassVi: 'Phân độ I (Nguy cơ rất thấp)',
      riskLevel: 'low',
      mortalityTextVi: 'Tử vong 30 ngày: ~0.1%',
      dispositionVi: 'Điều trị ngoại trú.',
      antibioticImpactVi: 'Kháng sinh đường uống Nhóm 1 (Amoxicillin hoặc Amox/Clav ± Macrolide hoặc Doxycycline).',
      sourceText: 'Fine et al. NEJM 1997 (PORT Study)'
    };
  }

  if (score <= 70) {
    return {
      scoreId: 'psi',
      scoreNameVi: 'Thang điểm PSI / PORT (Viêm phổi cộng đồng)',
      shortName: 'PSI / PORT',
      totalScore: score,
      displayScoreText: `${score} điểm (Class II)`,
      riskClassVi: 'Phân độ II (Nguy cơ thấp)',
      riskLevel: 'low',
      mortalityTextVi: 'Tử vong 30 ngày: ~0.6%',
      dispositionVi: 'Điều trị ngoại trú (theo dõi tái khám sau 48-72h).',
      antibioticImpactVi: 'Ưu tiên phác đồ uống Nhóm 1 (Amox/Clav hoặc Levofloxacin uống nếu có bệnh nền).',
      sourceText: 'Fine et al. NEJM 1997 (PORT Study)'
    };
  }

  if (score <= 90) {
    return {
      scoreId: 'psi',
      scoreNameVi: 'Thang điểm PSI / PORT (Viêm phổi cộng đồng)',
      shortName: 'PSI / PORT',
      totalScore: score,
      displayScoreText: `${score} điểm (Class III)`,
      riskClassVi: 'Phân độ III (Nguy cơ trung bình - thấp)',
      riskLevel: 'moderate',
      mortalityTextVi: 'Tử vong 30 ngày: ~0.9% - 2.8%',
      dispositionVi: 'Theo dõi tại Cấp cứu 24h hoặc nhập viện ngắn ngày.',
      antibioticImpactVi: 'Cân nhắc khởi đầu kháng sinh tĩnh mạch (Ceftriaxone ± Azithromycin) và chuyển uống sớm khi ổn định.',
      sourceText: 'Fine et al. NEJM 1997 (PORT Study)'
    };
  }

  if (score <= 130) {
    return {
      scoreId: 'psi',
      scoreNameVi: 'Thang điểm PSI / PORT (Viêm phổi cộng đồng)',
      shortName: 'PSI / PORT',
      totalScore: score,
      displayScoreText: `${score} điểm (Class IV)`,
      riskClassVi: 'Phân độ IV (Nguy cơ cao)',
      riskLevel: 'high',
      mortalityTextVi: 'Tử vong 30 ngày: ~8.2% - 9.3%',
      dispositionVi: 'BẮT BUỘC NHẬP VIỆN điều trị nội trú.',
      antibioticImpactVi: 'Kháng sinh tĩnh mạch ngay (Ceftriaxone + Azithromycin hoặc FQ hô hấp IV); tầm soát yếu tố nguy cơ VKĐK BVBND.',
      sourceText: 'Fine et al. NEJM 1997 (PORT Study)',
      suggestedAction: {
        suggestSofaScore: 2,
        actionLabelVi: 'Đồng bộ độ nặng (SOFA ≥ 2) vào CDSS'
      }
    };
  }

  return {
    scoreId: 'psi',
    scoreNameVi: 'Thang điểm PSI / PORT (Viêm phổi cộng đồng)',
    shortName: 'PSI / PORT',
    totalScore: score,
    displayScoreText: `${score} điểm (Class V)`,
    riskClassVi: 'Phân độ V (Nguy cơ rất cao / Nguy kịch)',
    riskLevel: 'critical',
    mortalityTextVi: 'Tử vong 30 ngày: ~27% - 31%',
    dispositionVi: 'NHẬP ICU / HỒI SỨC TÍCH CỰC NGAY.',
    antibioticImpactVi: 'Áp dụng phác đồ Nhóm 2 phổ rộng bao phủ Pseudomonas / MRSA theo nguy cơ BVBND + hỗ trợ hô hấp tích cực.',
    sourceText: 'Fine et al. NEJM 1997 (PORT Study)',
    suggestedAction: {
      suggestGroup: 'group_2',
      suggestSofaScore: 4,
      actionLabelVi: 'Đồng bộ Nhóm 2 (ICU Nặng) vào CDSS'
    }
  };
}

export function calculateAtsCap(inputs: AtsCapInputs): ScoreCalculationResult {
  const majorCount = (inputs.invasiveMechVent ? 1 : 0) + (inputs.septicShockVasopressors ? 1 : 0);
  const minorCount =
    (inputs.rrOver30 ? 1 : 0) +
    (inputs.pao2Fio2Under250 ? 1 : 0) +
    (inputs.multilobarInfiltrates ? 1 : 0) +
    (inputs.confusion ? 1 : 0) +
    (inputs.bunOver20 ? 1 : 0) +
    (inputs.wbcUnder4000 ? 1 : 0) +
    (inputs.pltUnder100k ? 1 : 0) +
    (inputs.tempUnder36 ? 1 : 0) +
    (inputs.hypotensionFluid ? 1 : 0);

  const isSevere = majorCount >= 1 || minorCount >= 3;

  return {
    scoreId: 'ats_cap',
    scoreNameVi: 'Tiêu chuẩn ATS/IDSA Viêm phổi Nặng',
    shortName: 'ATS/IDSA CAP',
    totalScore: majorCount * 10 + minorCount,
    displayScoreText: `${majorCount} Chính • ${minorCount} Phụ`,
    riskClassVi: isSevere ? 'VIÊM PHỔI NẶNG (Đạt chuẩn ICU)' : 'Chưa đạt chuẩn Viêm phổi nặng ATS/IDSA',
    riskLevel: isSevere ? (majorCount >= 1 ? 'critical' : 'high') : 'low',
    mortalityTextVi: isSevere ? 'Nguy cơ tử vong ICU cao (20-40%)' : 'Nguy cơ suy hô hấp/sốc thấp hơn',
    dispositionVi: isSevere ? 'NHẬP ICU điều trị tích cực.' : 'Theo dõi nội trú hoặc đánh giá thêm CURB-65 / PSI.',
    antibioticImpactVi: isSevere
      ? 'Bắt buộc phối hợp kháng sinh tĩnh mạch phổ rộng; kiểm tra yếu tố nguy cơ MRSA & Pseudomonas (nếu có → thêm Vancomycin/Linezolid và Pip-Tazo/Meropenem/Cefepime).'
      : 'Điều trị theo phân nhóm nguy cơ VKĐK BVBND (Nhóm 1 hoặc Nhóm 2 tùy yếu tố tiền sử).',
    sourceText: 'ATS/IDSA CAP Guidelines 2019',
    suggestedAction: isSevere
      ? {
          suggestGroup: 'group_2',
          suggestSofaScore: majorCount >= 1 ? 6 : 3,
          suggestSpecificRisks: ['pseudo_acineto'],
          actionLabelVi: 'Áp dụng chuẩn CAP Nặng ICU (Nhóm 2)'
        }
      : undefined
  };
}

export function calculateCpis(inputs: CpisInputs): ScoreCalculationResult {
  const score =
    inputs.tempScore +
    inputs.wbcScore +
    inputs.secretionsScore +
    (inputs.oxygenationLow ? 2 : 0) +
    inputs.xrayScore +
    (inputs.progression ? 2 : 0) +
    inputs.culturePositive;

  const isLikelyVap = score > 6;

  return {
    scoreId: 'cpis',
    scoreNameVi: 'Thang điểm CPIS (Viêm phổi bệnh viện / Thở máy)',
    shortName: 'CPIS',
    totalScore: score,
    maxScore: 12,
    displayScoreText: `${score}/12 điểm`,
    riskClassVi: isLikelyVap ? 'Nghi ngờ cao HAP / VAP (CPIS > 6)' : 'Ít khả năng VAP (CPIS ≤ 6)',
    riskLevel: isLikelyVap ? 'high' : 'low',
    dispositionVi: isLikelyVap
      ? 'Khởi động phác đồ HAP/VAP (Nhóm 2) + Lấy mẫu đàm/NKQ/BAL cấy định lượng trước khi đổi thuốc.'
      : 'Nếu CPIS ≤ 6 kéo dài đến ngày 3: Cân nhắc ngưng kháng sinh sớm nếu lâm sàng ổn định (Chiến lược Singh et al.).',
    antibioticImpactVi: isLikelyVap
      ? 'Áp dụng phác đồ VAP Nhóm 2 BVBND: Pip/Tazo hoặc Meropenem truyền 3-4h ± Amikacin ± Vancomycin/Linezolid.'
      : 'Tránh lạm dụng kháng sinh phổ rộng nếu không có ổ nhiễm khác; tái đánh giá lại sau 48-72h.',
    sourceText: 'Pugin et al. / IDSA HAP-VAP Guidelines',
    suggestedAction: isLikelyVap
      ? {
          suggestGroup: 'group_2',
          suggestSpecificRisks: ['pseudo_acineto'],
          actionLabelVi: 'Kích hoạt Nhóm 2 HAP/VAP (Pseudo/Acineto)'
        }
      : undefined
  };
}

export function calculateQsofa(inputs: QsofaInputs): ScoreCalculationResult {
  const score = (inputs.alteredMental ? 1 : 0) + (inputs.rrOver22 ? 1 : 0) + (inputs.sbpUnder100 ? 1 : 0);
  const isPositive = score >= 2;

  return {
    scoreId: 'qsofa',
    scoreNameVi: 'Thang điểm qSOFA (Sàng lọc nhanh Nhiễm khuẩn huyết)',
    shortName: 'qSOFA',
    totalScore: score,
    maxScore: 3,
    displayScoreText: `${score}/3 điểm`,
    riskClassVi: isPositive ? 'qSOFA Dương tính (≥ 2đ) - Nguy cơ cao' : 'qSOFA Âm tính (< 2đ)',
    riskLevel: isPositive ? 'high' : 'low',
    mortalityTextVi: isPositive ? 'Nguy cơ tử vong nội viện tăng gấp 3-14 lần' : 'Lưu ý: qSOFA âm tính không loại trừ hoàn toàn sepsis sớm',
    dispositionVi: isPositive
      ? 'Đánh giá ngay thang điểm SOFA đầy đủ, đo Lactate máu & cấy máu 2 vị trí.'
      : 'Tiếp tục theo dõi sát sinh hiệu; tính SOFA nếu có dấu hiệu suy tạng.',
    antibioticImpactVi: isPositive
      ? 'Khởi động gói giờ vàng Sepsis (Hour-1 Bundle): Dùng kháng sinh tĩnh mạch phổ rộng trong vòng 1 giờ.'
      : 'Đánh giá phác đồ theo ổ nhiễm nguyên phát và 8 yếu tố nguy cơ VKĐK.',
    sourceText: 'Sepsis-3 Consensus (JAMA 2016)',
    suggestedAction: isPositive
      ? {
          suggestSofaScore: 2,
          actionLabelVi: 'Gợi ý độ nặng cao (SOFA ≥ 2)'
        }
      : undefined
  };
}

export function calculateSofaFull(inputs: SofaFullInputs): ScoreCalculationResult {
  const score = inputs.resp + inputs.coag + inputs.liver + inputs.cardio + inputs.cns + inputs.renal;
  const isHighSeverity = score >= 2;

  return {
    scoreId: 'sofa_full',
    scoreNameVi: 'Thang điểm SOFA đầy đủ (6 hệ cơ quan)',
    shortName: 'SOFA',
    totalScore: score,
    maxScore: 24,
    displayScoreText: `${score}/24 điểm`,
    riskClassVi: score >= 12 ? 'Suy đa tạng rất nặng' : isHighSeverity ? 'Đạt chuẩn Sepsis (SOFA ≥ 2)' : 'Chưa đạt ngưỡng suy tạng Sepsis-3',
    riskLevel: score >= 12 ? 'critical' : isHighSeverity ? 'high' : 'low',
    mortalityTextVi:
      score >= 12
        ? 'Tử vong ước tính > 50%'
        : score >= 7
        ? 'Tử vong ước tính ~20% - 40%'
        : isHighSeverity
        ? 'Tử vong ước tính ~10%'
        : 'Tử vong < 5%',
    dispositionVi: score >= 6 ? 'Điều trị Hồi sức Tích cực (ICU).' : isHighSeverity ? 'Theo dõi sát / Hồi sức tích cực.' : 'Theo dõi nội trú.',
    antibioticImpactVi: isHighSeverity
      ? 'Đạt ngưỡng bệnh nặng BVBND 2026 (SOFA ≥ 2): Nếu có ≥ 1 yếu tố nguy cơ chung VKĐK → Tự động xếp Nhóm 2 (Kháng sinh phổ rộng truyền kéo dài).'
      : 'Chưa đạt ngưỡng nặng SOFA ≥ 2.',
    sourceText: 'Vincent et al. / Sepsis-3 / BVBND 2026',
    suggestedAction: {
      suggestSofaScore: score,
      suggestGroup: isHighSeverity ? 'group_2' : undefined,
      actionLabelVi: `Đồng bộ SOFA = ${score}đ vào CDSS`
    }
  };
}

export function calculatePsofa(inputs: PsofaInputs): ScoreCalculationResult {
  const score = inputs.resp + inputs.coag + inputs.liver + inputs.cardio + inputs.cns + inputs.renal;
  const isHighSeverity = score >= 8;

  return {
    scoreId: 'psofa_calc',
    scoreNameVi: 'Thang điểm pSOFA (Nhi khoa)',
    shortName: 'pSOFA',
    totalScore: score,
    maxScore: 24,
    displayScoreText: `${score}/24 điểm`,
    riskClassVi: isHighSeverity ? 'Nhiễm khuẩn Nặng Nhi khoa (pSOFA ≥ 8)' : score >= 2 ? 'Có rối loạn cơ quan (pSOFA 2-7)' : 'Ổn định (pSOFA < 2)',
    riskLevel: isHighSeverity ? 'critical' : score >= 2 ? 'moderate' : 'low',
    dispositionVi: isHighSeverity ? 'Chuyển Hồi sức Nhi (PICU) theo dõi sát.' : 'Theo dõi khoa Nhi.',
    antibioticImpactVi: isHighSeverity
      ? 'Đạt ngưỡng nặng BVBND Nhi khoa (pSOFA ≥ 8) → Kết hợp yếu tố nguy cơ để chỉ định phác đồ Nhóm 2 Nhi.'
      : 'pSOFA < 8 điểm; phân nhóm kháng sinh Nhi dựa theo 8 yếu tố nguy cơ chung.',
    sourceText: 'Matics & Sanchez-Pinto (JAMA Pediatr 2017) / BVBND 2026',
    suggestedAction: {
      suggestPsofaScore: score,
      suggestGroup: isHighSeverity ? 'group_2' : undefined,
      actionLabelVi: `Đồng bộ pSOFA = ${score}đ vào CDSS`
    }
  };
}

export function calculateLrinec(inputs: LrinecInputs): ScoreCalculationResult {
  const score =
    (inputs.crpOver150 ? 4 : 0) +
    inputs.wbcTier +
    inputs.hbTier +
    (inputs.naUnder135 ? 2 : 0) +
    (inputs.crOver141 ? 2 : 0) +
    (inputs.glucoseOver10 ? 1 : 0);

  if (score >= 8) {
    return {
      scoreId: 'lrinec',
      scoreNameVi: 'Thang điểm LRINEC (Viêm cân hoại tử)',
      shortName: 'LRINEC',
      totalScore: score,
      maxScore: 13,
      displayScoreText: `${score}/13 điểm`,
      riskClassVi: 'NGUY CƠ RẤT CAO Viêm cân mạc hoại tử (≥ 8đ)',
      riskLevel: 'critical',
      mortalityTextVi: 'Giá trị tiên đoán dương > 75% (Cần phẫu thuật cấp cứu)',
      dispositionVi: 'HỘI CHẨN NGOẠI KHOA CẮT LỌC KHẨN CẤP + Nhập ICU.',
      antibioticImpactVi: 'Bắt buộc phối hợp đa kháng sinh theo WHO & BVBND: Pip/Tazo hoặc Meropenem + Vancomycin/Linezolid (phủ MRSA) + CLINDAMYCIN 900mg IV q8h (ức chế độc tố).',
      sourceText: 'Wong et al. Crit Care Med 2004 / WHO AWaRe 2022',
      suggestedAction: {
        suggestGroup: 'group_2',
        suggestSofaScore: 4,
        suggestSpecificRisks: ['mrsa', 'pseudo_acineto'],
        actionLabelVi: 'Kích hoạt Nhóm 2 (MRSA + Gram âm)'
      }
    };
  }

  if (score >= 6) {
    return {
      scoreId: 'lrinec',
      scoreNameVi: 'Thang điểm LRINEC (Viêm cân hoại tử)',
      shortName: 'LRINEC',
      totalScore: score,
      maxScore: 13,
      displayScoreText: `${score}/13 điểm`,
      riskClassVi: 'Nguy cơ trung bình Viêm cân hoại tử (6 - 7đ)',
      riskLevel: 'high',
      mortalityTextVi: 'Xác suất viêm cân hoại tử: 50% - 75%',
      dispositionVi: 'Đánh giá ngoại khoa khẩn, siêu âm/CT mô mềm tìm khí dưới da, theo dõi sát diễn tiến đau vượt mức.',
      antibioticImpactVi: 'Cân nhắc nâng bậc kháng sinh phổ rộng IV + Clindamycin chống độc tố nếu lâm sàng nghi ngờ hoại tử.',
      sourceText: 'Wong et al. Crit Care Med 2004',
      suggestedAction: {
        suggestGroup: 'group_2',
        suggestSpecificRisks: ['mrsa'],
        actionLabelVi: 'Kích hoạt bao phủ MRSA (Nhóm 2)'
      }
    };
  }

  return {
    scoreId: 'lrinec',
    scoreNameVi: 'Thang điểm LRINEC (Viêm cân hoại tử)',
    shortName: 'LRINEC',
    totalScore: score,
    maxScore: 13,
    displayScoreText: `${score}/13 điểm`,
    riskClassVi: 'Nguy cơ thấp (≤ 5đ)',
    riskLevel: 'low',
    mortalityTextVi: 'Ít gợi ý viêm cân hoại tử (< 50%), tuy nhiên không loại trừ hoàn toàn nếu lâm sàng điển hình',
    dispositionVi: 'Xử trí theo viêm mô tế bào / áp xe mô mềm thông thường.',
    antibioticImpactVi: 'Nếu không có yếu tố nguy cơ VKĐK: Oxacillin/Cloxacillin, Cefazolin hoặc Amox/Clav.',
    sourceText: 'Wong et al. Crit Care Med 2004'
  };
}

export function calculateEronSsti(inputs: EronSstiInputs): ScoreCalculationResult {
  let eronClass = 1;
  if (inputs.systemicToxicity === 'severe_sepsis_necrotizing' || inputs.rapidProgressionOrDeep) {
    eronClass = 4;
  } else if (inputs.systemicToxicity === 'moderate_sepsis') {
    eronClass = 3;
  } else if (inputs.systemicToxicity === 'mild_comorbid' || inputs.uncontrolledComorbidity) {
    eronClass = 2;
  }

  const classMap: Record<number, { label: string; level: ScoreCalculationResult['riskLevel']; disp: string; abx: string }> = {
    1: {
      label: 'Eron Class I (Không độc tính toàn thân, không bệnh nền mất bù)',
      level: 'low',
      disp: 'Điều trị ngoại trú bằng kháng sinh đường uống.',
      abx: 'Amox/Clav, Cephalexin hoặc Cloxacillin uống (Nhóm 1 / WHO Access).'
    },
    2: {
      label: 'Eron Class II (Độc tính nhẹ hoặc bệnh nền cản trở lành vết thương)',
      level: 'moderate',
      disp: 'Điều trị ngoại trú có tiêm tĩnh mạch ngoại viện (OPAT) hoặc nhập viện ngắn ngày.',
      abx: 'Cefazolin / Ceftriaxone IV hoặc Amox/Clav ± bao phủ MRSA nếu có áp xe/yếu tố nguy cơ.'
    },
    3: {
      label: 'Eron Class III (Nhiễm độc toàn thân / Sốt cao / Nhịp tim nhanh / Hạ HA)',
      level: 'high',
      disp: 'NHẬP VIỆN điều trị nội trú tích cực.',
      abx: 'Kháng sinh tĩnh mạch ngay (Oxacillin/Cefazolin hoặc Vancomycin nếu nghi MRSA + Gram âm nếu loét bàn chân ĐTĐ).'
    },
    4: {
      label: 'Eron Class IV (Sốc nhiễm khuẩn hoặc Nhiễm trùng hoại tử sâu)',
      level: 'critical',
      disp: 'NHẬP ICU & HỘI CHẨN NGOẠI KHOA CẤP CỨU.',
      abx: 'Phác đồ Nhóm 2: Meropenem/Pip-Tazo + Vancomycin/Linezolid + Clindamycin.'
    }
  };

  const info = classMap[eronClass];
  return {
    scoreId: 'eron_ssti',
    scoreNameVi: 'Phân độ Eron / CREST (Da & Mô mềm)',
    shortName: 'Eron SSTI',
    totalScore: eronClass,
    maxScore: 4,
    displayScoreText: `Class ${eronClass === 1 ? 'I' : eronClass === 2 ? 'II' : eronClass === 3 ? 'III' : 'IV'}`,
    riskClassVi: info.label,
    riskLevel: info.level,
    dispositionVi: info.disp,
    antibioticImpactVi: info.abx,
    sourceText: 'Eron Classification / CREST Guidelines',
    suggestedAction:
      eronClass >= 3
        ? {
            suggestGroup: 'group_2',
            suggestSofaScore: eronClass === 4 ? 4 : 2,
            suggestSpecificRisks: eronClass === 4 ? ['mrsa', 'pseudo_acineto'] : ['mrsa'],
            actionLabelVi: `Đồng bộ SSTI Nặng (Class ${eronClass})`
          }
        : undefined
  };
}

export function calculateUtiEsbl(inputs: UtiEsblInputs): ScoreCalculationResult {
  const score =
    (inputs.recentHospitalization ? 3 : 0) +
    (inputs.transferFromHealthcare ? 3 : 0) +
    (inputs.recentAbx3m ? 2 : 0) +
    (inputs.urinaryCatheter ? 2 : 0) +
    (inputs.ageOver70 ? 2 : 0) +
    (inputs.maleGender ? 1 : 0);

  const isHighRiskEsbl = score >= 3;
  const isVeryHigh = score >= 6;

  return {
    scoreId: 'uti_esbl',
    scoreNameVi: 'Thang điểm Nguy cơ ESBL-UTI (Tumbarello)',
    shortName: 'Tumbarello ESBL',
    totalScore: score,
    maxScore: 13,
    displayScoreText: `${score}/13 điểm`,
    riskClassVi: isVeryHigh
      ? 'Nguy cơ RẤT CAO nhiễm ESBL (≥ 6đ)'
      : isHighRiskEsbl
      ? 'Nguy cơ CAO nhiễm ESBL (≥ 3đ)'
      : 'Nguy cơ thấp ESBL (< 3đ)',
    riskLevel: isVeryHigh ? 'critical' : isHighRiskEsbl ? 'high' : 'low',
    mortalityTextVi: isVeryHigh ? 'Tỷ lệ phân lập vi khuẩn sinh ESBL > 60-75%' : isHighRiskEsbl ? 'Tỷ lệ sinh ESBL ~30-50%' : 'Tỷ lệ sinh ESBL thấp (< 10%)',
    dispositionVi: inputs.isPyelonephritisOrSepsis
      ? 'Viêm bể thận / Urosepsis: Nhập viện truyền tĩnh mạch & cấy nước tiểu + cấy máu trước khi cho thuốc.'
      : 'Viêm bàng quang không biến chứng: Có thể điều trị ngoại trú đường uống.',
    antibioticImpactVi: isHighRiskEsbl
      ? 'Cân nhắc kích hoạt cờ ESBL (Nhóm 2): Ertapenem 1g/ngày (nếu chưa sốc) hoặc Meropenem/Amikacin tiết kiệm Carbapenem.'
      : inputs.isPyelonephritisOrSepsis
      ? 'Viêm bể thận Nhóm 1: Ceftriaxone 1-2g/ngày (tránh Ciprofloxacin kinh nghiệm do kháng >70% tại BVBND).'
      : 'Viêm bàng quang cấp: Ưu tiên Nitrofurantoin 100mg q12h x 5 ngày (WHO Access) hoặc Fosfomycin 3g liều duy nhất.',
    sourceText: 'Tumbarello et al. / BVBND Antibiogram 2024',
    suggestedAction: isHighRiskEsbl
      ? {
          suggestGroup: 'group_2',
          suggestSpecificRisks: ['esbl'],
          actionLabelVi: 'Kích hoạt bao phủ ESBL (Nhóm 2)'
        }
      : undefined
  };
}

export function calculateClifSbp(inputs: ClifSbpInputs): ScoreCalculationResult {
  const score =
    inputs.liverBiliTier +
    inputs.renalCrTier +
    inputs.brainHeGrade +
    inputs.coagInrTier +
    inputs.circMapVasopressor +
    inputs.respPao2Fio2Tier;

  const isHighSeverity = score >= 12;

  return {
    scoreId: 'clif_sbp',
    scoreNameVi: 'Thang điểm CLIF-SOFA & Chỉ định Albumin (SBP)',
    shortName: 'CLIF-SOFA',
    totalScore: score,
    maxScore: 24,
    displayScoreText: `${score}/24 điểm`,
    riskClassVi: isHighSeverity ? 'Suy đa tạng Xơ gan Nặng (CLIF-SOFA ≥ 12)' : 'Chưa đạt ngưỡng nặng CLIF-SOFA (< 12)',
    riskLevel: isHighSeverity ? 'critical' : score >= 8 ? 'moderate' : 'low',
    dispositionVi: isHighSeverity
      ? 'Theo dõi sát Hồi sức / Gan mật, đề phòng suy đa tạng cấp trên nền mạn (ACLF).'
      : 'Điều trị nội trú khoa Gan mật / Truyền nhiễm.',
    antibioticImpactVi: isHighSeverity
      ? 'Đạt ngưỡng nặng BVBND (CLIF-SOFA ≥ 12) → Phân tầng SBP Nhóm 2: Meropenem 1g q8h ± Daptomycin/Vancomycin (phủ ESBL + Enterococcus).'
      : 'SBP Nhóm 1 (nếu không có yếu tố nguy cơ VKĐK khác): Cefotaxime 2g q8h hoặc Ceftriaxone 2g q24h.',
    clinicalNotesVi: inputs.sbpScrOver1Mgdl
      ? [
          'CHỈ ĐỊNH ALBUMIN BẮT BUỘC (Sort et al.): Bệnh nhân có Scr > 1 mg/dL (88.4 µmol/L) / BUN > 30 / Bili > 4 → Truyền Albumin 1.5 g/kg ngày 1 và 1.0 g/kg ngày 3 để giảm tỷ lệ Hội chứng gan thận và tử vong.'
        ]
      : ['Chưa có tiêu chuẩn suy thận/tăng Bili nặng, tiếp tục theo dõi chức năng thận sát mỗi 48h.'],
    sourceText: 'CLIF-SOFA / EASL SBP Guidelines / BVBND 2026',
    suggestedAction: {
      suggestClifSofaScore: score,
      suggestGroup: isHighSeverity ? 'group_2' : undefined,
      suggestSpecificRisks: isHighSeverity ? ['esbl', 'enterococcus'] : undefined,
      actionLabelVi: `Đồng bộ CLIF-SOFA = ${score}đ vào CDSS`
    }
  };
}

export function calculateTg18Biliary(inputs: Tg18BiliaryInputs): ScoreCalculationResult {
  const hasOrganDysfunction =
    inputs.cardioVasopressor ||
    inputs.neuroAltered ||
    inputs.respPao2Fio2Under300 ||
    inputs.renalCrOver176 ||
    inputs.hepaticInrOver15 ||
    inputs.hematoPltUnder100k;

  const grade2Count =
    (inputs.wbcAbnormal ? 1 : 0) +
    (inputs.highFever39 ? 1 : 0) +
    (inputs.ageOver75 ? 1 : 0) +
    (inputs.hyperbilirubinemia ? 1 : 0) +
    (inputs.hypoalbuminemia ? 1 : 0);

  if (hasOrganDysfunction) {
    return {
      scoreId: 'tg18_biliary',
      scoreNameVi: 'Phân độ Tokyo Guidelines 2018 (Đường mật/Ổ bụng)',
      shortName: 'Tokyo TG18',
      totalScore: 3,
      maxScore: 3,
      displayScoreText: 'Grade III (Nặng)',
      riskClassVi: 'Mức độ Nặng - Grade III (Có suy ít nhất 1 cơ quan)',
      riskLevel: 'critical',
      dispositionVi: 'HỒI SỨC TÍCH CỰC + Dẫn lưu mật khẩn cấp (ERCP / PTBD) sau khi ổn định huyết động.',
      antibioticImpactVi: 'Kháng sinh phổ rộng Nhóm 2 (Meropenem / Imipenem hoặc Pip-Tazo) ± Vancomycin/Daptomycin nếu sốc nặng nghi Enterococcus.',
      sourceText: 'Tokyo Guidelines 2018 (TG18)',
      suggestedAction: {
        suggestGroup: 'group_2',
        suggestSofaScore: 4,
        suggestSpecificRisks: ['esbl'],
        actionLabelVi: 'Kích hoạt Nhóm 2 Ổ bụng nặng (TG18 III)'
      }
    };
  }

  if (grade2Count >= 2) {
    return {
      scoreId: 'tg18_biliary',
      scoreNameVi: 'Phân độ Tokyo Guidelines 2018 (Đường mật/Ổ bụng)',
      shortName: 'Tokyo TG18',
      totalScore: 2,
      maxScore: 3,
      displayScoreText: `Grade II (${grade2Count}/5 tiêu chí)`,
      riskClassVi: 'Mức độ Trung bình - Grade II',
      riskLevel: 'moderate',
      dispositionVi: 'Nhập viện, kháng sinh tĩnh mạch sớm & Dẫn lưu mật sớm trong 24-48h.',
      antibioticImpactVi: 'Ceftriaxone + Metronidazole hoặc Cefoperazone/Sulbactam hoặc Pip/Tazo (nếu có nguy cơ ESBL).',
      sourceText: 'Tokyo Guidelines 2018 (TG18)'
    };
  }

  return {
    scoreId: 'tg18_biliary',
    scoreNameVi: 'Phân độ Tokyo Guidelines 2018 (Đường mật/Ổ bụng)',
    shortName: 'Tokyo TG18',
    totalScore: 1,
    maxScore: 3,
    displayScoreText: 'Grade I (Nhẹ)',
    riskClassVi: 'Mức độ Nhẹ - Grade I',
    riskLevel: 'low',
    dispositionVi: 'Kháng sinh tĩnh mạch/uống + theo dõi đáp ứng; xử trí nguyên nhân sỏi mật.',
    antibioticImpactVi: 'Phác đồ Nhóm 1: Ceftriaxone + Metronidazole hoặc Amox/Clav.',
    sourceText: 'Tokyo Guidelines 2018 (TG18)'
  };
}

export function calculateCnsMeningitis(inputs: CnsMeningitisInputs): ScoreCalculationResult {
  const bmsScore =
    (inputs.gramStainPositive ? 2 : 0) +
    (inputs.csfProteinOver80 ? 1 : 0) +
    (inputs.peripheralAncOver10k ? 1 : 0) +
    (inputs.csfAncOver1000 ? 1 : 0) +
    (inputs.seizureAtPresentation ? 1 : 0);

  const needsListeria = inputs.ageOver50 || inputs.immunocompromisedOrPregnant;
  const needsNosocomialMrsa = inputs.neurosurgeryOrShunt;

  const clinicalNotesVi: string[] = [
    'Liều màng não bắt buộc: Ceftriaxone 2g IV mỗi 12 giờ (4g/ngày) hoặc Cefotaxime 2g IV mỗi 6 giờ (8g/ngày).',
    'Dexamethasone 0.15 mg/kg IV q6h (hoặc 10mg IV q6h): Tiêm ngay TRƯỚC hoặc CÙNG liều kháng sinh đầu tiên (ngừng nếu không phải phế cầu).'
  ];
  if (needsListeria) {
    clinicalNotesVi.push('⚠️ CHỈ ĐỊNH BỔ SUNG LISTERIA: BN ≥ 50 tuổi hoặc suy giảm miễn dịch/có thai → BẮT BUỘC thêm Ampicillin 2g IV mỗi 4 giờ.');
  }
  if (needsNosocomialMrsa) {
    clinicalNotesVi.push('⚠️ VIÊM MÀNG NÃO SAU PHẪU THUẬT / SHUNT: Bắt buộc phối hợp Vancomycin + Meropenem/Cefepime (phủ MRSA & Pseudomonas).');
  }

  return {
    scoreId: 'cns_meningitis',
    scoreNameVi: 'Đánh giá Viêm màng não mủ (BMS & Yếu tố Listeria)',
    shortName: 'BMS / CNS',
    totalScore: bmsScore,
    maxScore: 6,
    displayScoreText: `BMS ${bmsScore}/6 điểm`,
    riskClassVi:
      bmsScore >= 2
        ? 'Nguy cơ rất cao Viêm màng não vi khuẩn (BMS ≥ 2)'
        : bmsScore === 1
        ? 'Không thể loại trừ Viêm màng não vi khuẩn (BMS = 1)'
        : 'Ít khả năng viêm màng não vi khuẩn (BMS = 0)',
    riskLevel: needsNosocomialMrsa ? 'critical' : bmsScore >= 2 ? 'high' : bmsScore === 1 ? 'moderate' : 'low',
    dispositionVi: 'Cấp cứu Nội khoa / Thần kinh / Truyền nhiễm — Dùng kháng sinh trong vòng 1 giờ (không trì hoãn nếu phải chụp CT trước chọc DNT).',
    antibioticImpactVi: needsNosocomialMrsa
      ? 'Phác đồ Nhóm 2 Thần kinh TW: Vancomycin liều cao + Meropenem 2g q8h (hoặc Cefepime 2g q8h).'
      : needsListeria
      ? 'Ceftriaxone 2g q12h + Ampicillin 2g q4h (bao phủ Listeria) +/- Vancomycin.'
      : 'Ceftriaxone 2g q12h (+/- Vancomycin nếu nghi phế cầu kháng Cephalosporin).',
    clinicalNotesVi,
    sourceText: 'Nigrovic BMS Score / IDSA & WHO AWaRe 2022',
    suggestedAction: needsNosocomialMrsa
      ? {
          suggestGroup: 'group_2',
          suggestSpecificRisks: ['mrsa', 'pseudo_acineto'],
          actionLabelVi: 'Kích hoạt Nhóm 2 Viêm màng não BV'
        }
      : undefined
  };
}
