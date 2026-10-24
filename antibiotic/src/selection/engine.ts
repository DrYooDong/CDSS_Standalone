import {
  RiskClassificationResult,
  SeverityAssessment,
  SpecificPathogenRisk,
  EmpiricRegimen,
  InfectionSite,
  Population,
  SepsisSource,
  ReassessmentEvaluation,
  ClinicalResponseStatus,
  CultureStatus,
  SusceptibilityStatus,
  IvToPoEvaluation,
  MdrPathogenCategory
} from './types';

import {
  GENERAL_MDR_RISK_FACTORS,
  inferSpecificRisksFromFactorIds,
  getSuggestedOrganisms,
  getCombinationGuidance
} from './data/riskFactors';
import { findEmpiricRegimens } from './data/empiricRegimens';
import { findWhoRegimens, WHO_REGIMENS } from './data/whoRegimens';
import { 
  EVIDENCE_BASED_DURATIONS, 
  STOP_ANTIBIOTIC_CHECKLIST, 
  IV_TO_PO_DRUG_PAIRS 
} from './data/stopAndSwitch';
import { MDR_PATHWAYS } from './data/mdrPathways';

/**
 * 1. CLINICAL RISK STRATIFICATION ALGORITHM
 * Source: BV Bệnh Nhiệt Đới - Lưu đồ phân nhóm nguy cơ nhiễm VKĐK (File 2, P.2)
 *
 * Rules:
 * - count = number of general MDR risk factors (out of 8)
 * - isHighSeverity: SOFA >= 2 (Adult) OR pSOFA >= 8 (Peds) OR CLIF-SOFA >= 12 (Cirrhosis)
 * - Group 1 (Low MDR Risk): count == 0 OR (count == 1 AND !isHighSeverity)
 * - Group 2 (High MDR Risk): count >= 2 OR (count == 1 AND isHighSeverity)
 */
export function classifyRisk(
  selectedGeneralRiskIds: string[],
  severity: SeverityAssessment,
  specificRisks: SpecificPathogenRisk[] = [],
  options?: {
    site?: InfectionSite;
    specificRiskFactorIds?: string[];
    isNeutropenic?: boolean;
  }
): RiskClassificationResult {
  const generalRiskCount = selectedGeneralRiskIds.length;
  const isHighSeverity = severity.isHighSeverity;
  const site = options?.site || 'respiratory';
  const specificFactorIds = options?.specificRiskFactorIds || [];

  // Inferred risks from granular factor IDs
  const inferredRisks = inferSpecificRisksFromFactorIds(specificFactorIds);
  const combinedSpecificRisks = Array.from(new Set([...specificRisks, ...inferredRisks]));

  let group: 'group_1' | 'group_2';
  const rationalesVi: string[] = [];
  const rationalesEn: string[] = [];

  if (generalRiskCount === 0) {
    group = 'group_1';
    rationalesVi.push('Bệnh nhân KHÔNG có yếu tố nguy cơ chung nhiễm vi khuẩn đa kháng (0/8 yếu tố).');
    rationalesEn.push('No general risk factors for multidrug-resistant pathogens (0/8 factors).');
  } else if (generalRiskCount === 1) {
    if (isHighSeverity) {
      group = 'group_2';
      rationalesVi.push(
        `Bệnh nhân có 1 yếu tố nguy cơ chung nhiễm VKĐK KÈM THEO mức độ bệnh nặng (${severity.scoreType.toUpperCase()} = ${severity.scoreValue} đạt ngưỡng nặng).`
      );
      rationalesEn.push(
        `Patient has 1 general MDR risk factor combined with high illness severity (${severity.scoreType.toUpperCase()} = ${severity.scoreValue}).`
      );
    } else {
      group = 'group_1';
      rationalesVi.push(
        `Bệnh nhân có 1 yếu tố nguy cơ chung nhưng mức độ bệnh nhẹ - trung bình (${severity.scoreType.toUpperCase()} = ${severity.scoreValue} dưới ngưỡng nặng).`
      );
      rationalesEn.push(
        `Patient has 1 general MDR risk factor but low-moderate severity (${severity.scoreType.toUpperCase()} = ${severity.scoreValue}).`
      );
    }
  } else {
    // generalRiskCount >= 2
    group = 'group_2';
    rationalesVi.push(
      `Bệnh nhân có từ 2 yếu tố nguy cơ chung nhiễm VKĐK trở lên (${generalRiskCount}/8 yếu tố) → Tự động xếp Nhóm 2.`
    );
    rationalesEn.push(
      `Patient has ≥ 2 general MDR risk factors (${generalRiskCount}/8) → Classified as Group 2.`
    );
  }

  // Active risk labels
  const activeGeneralFactors = GENERAL_MDR_RISK_FACTORS
    .filter(f => selectedGeneralRiskIds.includes(f.id))
    .map(f => f.labelVi);

  const isNeutropenic = options?.isNeutropenic ?? selectedGeneralRiskIds.includes('transplant_chemo');
  const suggestedOrganismsVi = getSuggestedOrganisms(site, group, combinedSpecificRisks, isNeutropenic);
  const combinationResult = getCombinationGuidance(combinedSpecificRisks);

  if (group === 'group_2') {
    rationalesVi.push('KHUYẾN CÁO: Bắt buộc sử dụng phác đồ kháng sinh phổ rộng bao phủ vi khuẩn đa kháng.');
    rationalesEn.push('RECOMMENDATION: Broad-spectrum empiric regimen targeting MDR pathogens is required.');

    if (combinedSpecificRisks.length > 0) {
      const riskTags: string[] = [];
      if (combinedSpecificRisks.includes('mrsa')) riskTags.push('Tụ cầu vàng kháng Methicillin (MRSA)');
      if (combinedSpecificRisks.includes('esbl')) riskTags.push('Enterobacterales sinh ESBL');
      if (combinedSpecificRisks.includes('pseudo_acineto')) riskTags.push('Pseudomonas / Acinetobacter đa kháng');
      if (combinedSpecificRisks.includes('enterococcus')) riskTags.push('Enterococcus (VRE)');
      rationalesVi.push(`Xác định nguy cơ riêng cho tác nhân: ${riskTags.join('; ')}.`);
    }

    if (combinationResult.isGramPosGramNegCoRisk) {
      rationalesVi.push('LƯU Ý PHỐI HỢP: Có đồng thời nguy cơ Gram (+) và Gram (-) → Bắt buộc phối hợp 2 nhóm kháng sinh.');
    }
    if (combinationResult.isDualGramNegRisk) {
      rationalesVi.push('LƯU Ý PHỔ KHÁNG SINH: Có cả nguy cơ ESBL và Pseudomonas/Acinetobacter → Ưu tiên KS diệt Acinetobacter/Pseudomonas để bao phủ đồng thời.');
    }
  } else {
    rationalesVi.push('KHUYẾN CÁO: Chỉ định kháng sinh theo phác đồ kinh nghiệm thông thường (Nhóm 1). Tránh lạm dụng Carbapenem/Vancomycin.');
    rationalesEn.push('RECOMMENDATION: Standard Group 1 empiric antibiotic regimen. Avoid unnecessary Carbapenem/Vancomycin.');
  }

  return {
    group,
    groupLabelVi: group === 'group_1' ? 'Nhóm 1: Ít nguy cơ vi khuẩn đa kháng' : 'Nhóm 2: Nguy cơ cao vi khuẩn đa kháng',
    groupLabelEn: group === 'group_1' ? 'Group 1: Low MDR Risk' : 'Group 2: High MDR Risk',
    generalRiskCount,
    isHighSeverity,
    severityScoreType: severity.scoreType,
    severityScoreValue: severity.scoreValue,
    activeGeneralFactors,
    activeSpecificRisks: combinedSpecificRisks,
    activeSpecificRiskFactorIds: specificFactorIds,
    suggestedOrganismsVi,
    isGramPosGramNegCoRisk: combinationResult.isGramPosGramNegCoRisk,
    isDualGramNegRisk: combinationResult.isDualGramNegRisk,
    combinationGuidanceVi: combinationResult.guidanceVi,
    rationalesVi,
    rationalesEn,
    source: { doc: 'BVBND_PhanNhom', page: 2 }
  };
}

export function classifyRiskGroup(
  selectedGeneralRiskIds: string[],
  severity: { scoreType: 'sofa' | 'psofa' | 'clif_sofa'; scoreValue: number },
  population: Population,
  specificRisks: SpecificPathogenRisk[] = [],
  site: InfectionSite = 'respiratory',
  specificRiskFactorIds: string[] = []
): RiskClassificationResult {
  const isHighSeverity =
    severity.scoreType === 'psofa'
      ? severity.scoreValue >= 8
      : severity.scoreType === 'clif_sofa'
      ? severity.scoreValue >= 12
      : severity.scoreValue >= 2;

  return classifyRisk(
    selectedGeneralRiskIds,
    {
      scoreType: severity.scoreType,
      scoreValue: severity.scoreValue,
      isHighSeverity
    },
    specificRisks,
    {
      site,
      specificRiskFactorIds,
      isNeutropenic: selectedGeneralRiskIds.includes('transplant_chemo')
    }
  );
}

/**
 * 2. EMPIRIC REGIMEN SELECTION (BVBND 2026)
 */
export function getEmpiricRegimens(
  site: InfectionSite,
  population: Population,
  riskGroup: 'group_1' | 'group_2',
  sepsisSource?: SepsisSource,
  specificRisks: SpecificPathogenRisk[] = []
): EmpiricRegimen[] {
  return findEmpiricRegimens(site, population, riskGroup, sepsisSource, specificRisks);
}

/**
 * 2b. WHO AWARE REGIMEN SELECTION
 * Source: The WHO AWaRe antibiotic book (Geneva 2022, ISBN 978-92-4-006238-2)
 */
export function getWhoRegimens(
  site: InfectionSite | string,
  population: Population = 'adult',
  options?: {
    sepsisSource?: SepsisSource;
    setting?: 'all' | 'primary_care' | 'hospital';
    line?: 'all' | 'first_choice' | 'second_choice';
    awareCategory?: 'all' | 'Access' | 'Watch' | 'Reserve';
  }
): EmpiricRegimen[] {
  return findWhoRegimens(site, population, options);
}

/**
 * 2c. GUIDELINE COMPARISON HELPER (BVBND 2026 vs WHO AWaRe 2022)
 */
export interface GuidelineComparisonItem {
  site: InfectionSite;
  siteLabelVi: string;
  bvbndKeyPointsVi: string[];
  whoKeyPointsVi: string[];
  keyDifferencesVi: string[];
  stewardshipAdviceVi: string;
}

export function getGuidelineComparison(site: InfectionSite, _population: Population = 'adult'): GuidelineComparisonItem {
  const comparisons: Record<InfectionSite, GuidelineComparisonItem> = {
    respiratory: {
      site: 'respiratory',
      siteLabelVi: 'Nhiễm trùng hô hấp (CAP / HAP / VAP)',
      bvbndKeyPointsVi: [
        'Nhóm 1: Ưu tiên Amox/Clav hoặc Ceftriaxone +/- Azithromycin (phủ không điển hình) hoặc FQ hô hấp đơn trị.',
        'Nhóm 2 (HAP/VAP): Khởi đầu ngay Piperacillin/Tazo liều cao truyền 3-4h hoặc Meropenem khi có sốc/ESBL; phối hợp Vancomycin nếu có nguy cơ MRSA.',
        'Dựa trên vi sinh tại BVBND: Trực khuẩn Gram âm kháng Cephalosporin >60%, Acinetobacter baumannii kháng Carbapenem >70%.'
      ],
      whoKeyPointsVi: [
        'Thể nhẹ (Chăm sóc ban đầu): Khuyến cáo số 1 thế giới là Amoxicillin uống liều cao đơn trị (Nhóm Tiếp Cận - Access). Thời gian chỉ 5 ngày (trẻ em 3 ngày ở vùng HIV thấp).',
        'Thể nặng (Nhập viện): Ceftriaxone hoặc Cefotaxime (+ Clarithromycin nếu CURB-65 ≥ 2). Khuyến cáo thời gian dùng 5 ngày.',
        'HAP không thở máy nguy cơ thấp: Ưu tiên Amox/Clav IV hoặc Ceftriaxone (thời gian 7 ngày). Chỉ dùng Pip/Tazo khi có nguy cơ cao Pseudomonas.'
      ],
      keyDifferencesVi: [
        'Thời gian điều trị: WHO khuyến cáo 5 ngày cho CAP (rút ngắn rõ rệt so với phác đồ 7-10 ngày truyền thống).',
        'Kháng sinh đầu tay: WHO đẩy mạnh Amoxicillin đơn trị (Access) cho CAP ngoại trú, trong khi thực hành tại Việt Nam thường kê đơn Cephalosporin thế hệ 2-3 (Watch) hoặc FQ.',
        'BVBND nâng bậc nhanh hơn lên Carbapenem trong HAP do tỷ lệ vi khuẩn đa kháng nội viện tại TP.HCM rất cao.'
      ],
      stewardshipAdviceVi: 'Với CAP nhẹ điều trị ngoại trú: Ưu tiên theo WHO dùng Amoxicillin 1g q8h để bảo tồn nhóm Watch. Với HAP/VAP tại ICU: Tuân thủ BVBND 2026 vì áp lực vi khuẩn đa kháng tại chỗ rất lớn.'
    },
    sepsis: {
      site: 'sepsis',
      siteLabelVi: 'Nhiễm khuẩn huyết & Sốc nhiễm khuẩn',
      bvbndKeyPointsVi: [
        'Nhóm 1: Ceftriaxone 2g q24h hoặc Cefotaxime 2g q8h kết hợp kiểm soát ổ nhiễm.',
        'Nhóm 2: Bắt buộc dùng BL-BLI phổ rộng liều cao (Pip/Tazo 4.5g q6h) hoặc Meropenem 1-2g q8h truyền kéo dài 3h.',
        'Bắt buộc phối hợp chống Gram(+) nếu có catheter hoặc tiền sử MRSA; ưu tiên kháng sinh diệt Acinetobacter/Pseudomonas.'
      ],
      whoKeyPointsVi: [
        'Không rõ nguồn: Ceftriaxone/Cefotaxime PHỐI HỢP Amikacin 15 mg/kg/ngày (hoặc Gentamicin 5 mg/kg/ngày).',
        'Chiến lược tiết kiệm Carbapenem (Carbapenem-sparing): Amikacin giữ hoạt tính diệt khuẩn mạnh và phủ tốt ESBL, giúp giảm dùng Meropenem.',
        'Thời gian điều trị tiêu chuẩn: 7 ngày đối với nhiễm khuẩn huyết không rõ nguồn.'
      ],
      keyDifferencesVi: [
        'WHO khuyến cáo dùng Cephalosporin thế hệ 3 + Amikacin như một phác đồ đầu tay tiết kiệm Carbapenem, trong khi BVBND phân tầng Group 2 sẽ ưu tiên Meropenem hoặc Pip/Tazo.',
        'WHO nhấn mạnh thời gian điều trị ngắn ngày (7 ngày) nếu kiểm soát ổ nhiễm tốt.'
      ],
      stewardshipAdviceVi: 'Tại cấp cứu khi bệnh nhân sốc nhiễm khuẩn chưa rõ nguồn và chưa có bằng chứng sốc do Acinetobacter/CRE: Có thể áp dụng phác đồ tiết kiệm Carbapenem Ceftriaxone + Amikacin theo WHO, sau đó tái đánh giá sau 48-72h.'
    },
    urinary: {
      site: 'urinary',
      siteLabelVi: 'Nhiễm trùng tiết niệu (Viêm bàng quang / Viêm bể thận)',
      bvbndKeyPointsVi: [
        'Viêm bàng quang: Amox/Clav, Cefuroxime hoặc Fosfomycin đường uống. BVBND ghi nhận E. coli kháng Ciprofloxacin >70-80%.',
        'Viêm bể thận / Nhóm 2: Ceftriaxone, Piperacillin/Tazobactam hoặc Carbapenem tùy tiền sử ESBL.',
        'Antibiogram BVBND: E. coli sinh ESBL chiếm ~50-60% các mẫu phân lập nước tiểu.'
      ],
      whoKeyPointsVi: [
        'Viêm bàng quang cấp: Lựa chọn ưu tiên số 1 thế giới là NITROFURANTOIN 100mg q12h x 5 ngày (Access). Không bao giờ dùng cho viêm bể thận.',
        'Viêm bể thận cấp: Ngoại trú dùng Ciprofloxacin 500mg q12h x 7 ngày. Nhập viện: Ceftriaxone/Cefotaxime (+/- Amikacin 15mg/kg q24h cho ESBL).',
        'Thời gian điều trị: 3-5 ngày cho viêm bàng quang ở nữ; 7 ngày cho viêm bể thận.'
      ],
      keyDifferencesVi: [
        'WHO đặt Nitrofurantoin là thuốc số 1 cho viêm bàng quang cấp vì nồng độ cao trong nước tiểu và ít kháng thuốc, hạn chế tối đa Fluoroquinolone.',
        'Với viêm bể thận nghi ngờ ESBL: WHO khuyến cáo dùng đơn trị hoặc phối hợp Amikacin (Access) thay vì Carbapenem.'
      ],
      stewardshipAdviceVi: 'Ưu tiên chỉ định Nitrofurantoin cho viêm bàng quang cấp theo WHO (tránh dùng Ciprofloxacin vì tỷ lệ kháng tại VN quá cao). Với viêm bể thận nhập viện, cân nhắc Amikacin để tiết kiệm Carbapenem.'
    },
    skin_soft_tissue: {
      site: 'skin_soft_tissue',
      siteLabelVi: 'Da & Mô mềm (SSTI / Viêm cân hoại tử)',
      bvbndKeyPointsVi: [
        'Nhóm 1: Oxacillin/Cloxacillin IV, Cefazolin hoặc Amox/Clav; dị ứng dùng Clindamycin.',
        'Nhóm 2: Thêm Vancomycin phủ MRSA. Viêm cân mạc hoại tử phối hợp Carbapenem/Pip-Tazo + Clindamycin/Vancomycin.'
      ],
      whoKeyPointsVi: [
        'Thể nhẹ (viêm mô tế bào, chốc): Cloxacillin, Cefalexin hoặc Amox/Clav đường uống nhóm Tiếp cận (Access) trong 5-7 ngày.',
        'Viêm cân hoại tử (Necrotizing Fasciitis): Piperacillin/Tazo 4.5g q6h + CLINDAMYCIN 900mg q8h (ức chế độc tố vi khuẩn - anti-toxin).',
        'Phẫu thuật cắt lọc mô hoại tử khẩn cấp là yếu tố quyết định số 1.'
      ],
      keyDifferencesVi: [
        'Cả hai hướng dẫn đều thống nhất cao về vai trò bắt buộc của Clindamycin liều cao (900mg q8h) trong viêm cân hoại tử để ức chế độc tố GAS/Tụ cầu.',
        'WHO khuyến cáo thời gian điều trị ngắn 5-7 ngày cho viêm mô tế bào nhẹ không biến chứng.'
      ],
      stewardshipAdviceVi: 'Kháng sinh nhóm Tiếp cận (Cloxacillin, Cefazolin, Amox/Clav) đạt hiệu quả vượt trội cho phần lớn nhiễm trùng da mô mềm thông thường.'
    },
    peritoneal: {
      site: 'peritoneal',
      siteLabelVi: 'Dịch báng / Viêm phúc mạc (SBP)',
      bvbndKeyPointsVi: [
        'SBP Nhóm 1: Cefotaxime 2g q8h hoặc Ceftriaxone 2g q24h x 5-7 ngày.',
        'SBP Nhóm 2 (Xơ gan nặng CLIF-SOFA ≥ 12, nằm viện gần đây): Khởi đầu Meropenem 1g q8h +/- Daptomycin/Vancomycin do nguy cơ cao ESBL và Enterococcus.'
      ],
      whoKeyPointsVi: [
        'Nhiễm trùng ổ bụng thể nhẹ-vừa: Amox/Clav IV hoặc Ceftriaxone/Cefotaxime + Metronidazole.',
        'Nhiễm trùng ổ bụng nặng / nguy cơ ESBL: Piperacillin/Tazo hoặc Meropenem.',
        'Thời gian điều trị: 4-5 ngày sau khi đã kiểm soát được nguồn nhiễm.'
      ],
      keyDifferencesVi: [
        'BVBND có lưu đồ chuyên biệt cho bệnh nhân xơ gan cổ trướng (SBP) với phân tầng điểm CLIF-SOFA, trong khi WHO gom chung trong nhóm nhiễm trùng ổ bụng (Intra-abdominal).'
      ],
      stewardshipAdviceVi: 'Bệnh nhân xơ gan báng bụng có nhiễm trùng: Nên ưu tiên theo lưu đồ chuyên sâu BVBND 2026 (đánh giá CLIF-SOFA) để xử trí kịp thời nguy cơ suy đa tạng.'
    },
    gastrointestinal: {
      site: 'gastrointestinal',
      siteLabelVi: 'Tiêu hóa & Ổ bụng (Viêm túi mật, ruột thừa, áp xe gan, C. difficile)',
      bvbndKeyPointsVi: [
        'Viêm túi mật / đường mật: Ceftriaxone/Cefotaxime + Metronidazole hoặc Cefoperazone/Sulbactam.',
        'Áp xe gan: Ceftriaxone + Metronidazole; cấy mủ tìm Klebsiella pneumoniae sinh K1/K2.'
      ],
      whoKeyPointsVi: [
        'Viêm túi mật cắt bỏ thành công không biến chứng: Ngừng kháng sinh ngay sau mổ (không cần dùng tiếp).',
        'Clostridioides difficile: BẮT BUỘC dùng Vancomycin ĐƯỜNG UỐNG (125mg q6h x 10 ngày). Vancomycin tiêm tĩnh mạch không có tác dụng.',
        'Áp xe gan: Ceftriaxone + Metronidazole trong 4 tuần (kết hợp chọc hút dẫn lưu mủ).'
      ],
      keyDifferencesVi: [
        'WHO khuyến cáo không tiếp tục kháng sinh sau phẫu thuật cắt ruột thừa hoặc túi mật không biến chứng (giảm nguy cơ đề kháng và C. diff).',
        'WHO hướng dẫn chi tiết về điều trị C. diff bằng Vancomycin đường uống.'
      ],
      stewardshipAdviceVi: 'Kiểm soát triệt để nguồn nhiễm bằng phẫu thuật hoặc dẫn lưu là chìa khóa số 1. Ngừng kháng sinh sớm sau mổ sạch-nhiễm theo khuyến cáo của WHO.'
    },
    cns: {
      site: 'cns',
      siteLabelVi: 'Thần kinh trung ương (Viêm màng não mủ)',
      bvbndKeyPointsVi: [
        'Khởi đầu Ceftriaxone 2g q12h (4g/ngày) hoặc Cefotaxime 2g q6h (8g/ngày).',
        'Bổ sung Vancomycin liều cao ngấm màng não nếu nghi ngờ Phế cầu kháng Cephalosporin hoặc sau phẫu thuật thần kinh.',
        'Cân nhắc Ampicillin nếu nghi ngờ Listeria monocytogenes.'
      ],
      whoKeyPointsVi: [
        'Đầu tay: Ceftriaxone 2g q12h (4g/ngày) hoặc Cefotaxime 2g q6h (8g/ngày).',
        'Thêm Ampicillin 2g q4h IV nếu bệnh nhân ≥ 50 tuổi hoặc có thai (diệt Listeria).',
        'Dexamethasone 0.15 mg/kg q6h tiêm cùng liều kháng sinh đầu tiên; chỉ tiếp tục nếu là Phế cầu.',
        'Thời gian: Phế cầu 10-14 ngày; Não mô cầu 5-7 ngày; Listeria 21 ngày.'
      ],
      keyDifferencesVi: [
        'Hai hướng dẫn rất tương đồng về liều màng não gấp đôi thông thường của Cephalosporin thế hệ 3 và chỉ định Dexamethasone.',
        'WHO đưa ra thời gian điều trị nhắm đích rất rõ cho từng chủng vi khuẩn cụ thể.'
      ],
      stewardshipAdviceVi: 'Luôn dùng liều Ceftriaxone 2g mỗi 12h (tổng 4g/ngày) để thuốc đạt nồng độ diệt khuẩn trong dịch não tủy. Dùng Dexamethasone ngay trước hoặc cùng liều kháng sinh đầu tiên.'
    }
  };

  return comparisons[site] || comparisons.respiratory;
}

/**
 * 3. 48-72h REASSESSMENT DECISION ENGINE
 * Source: BV Bệnh Nhiệt Đới - Lưu đồ sử dụng kháng sinh (File 1, P.2)
 */
export function evaluate48hReassessment(
  clinicalStatus: ClinicalResponseStatus,
  cultureStatus: CultureStatus,
  susceptibilityStatus: SusceptibilityStatus
): ReassessmentEvaluation {
  const recommendationsVi: string[] = [];
  const recommendationsEn: string[] = [];
  let actionType: 'continue' | 'de_escalate' | 'switch_by_ast' | 'consult';
  let actionTitleVi: string;
  let actionTitleEn: string;
  let stopChecklistEligible = false;
  let ivToPoEligible = false;

  if (clinicalStatus === 'improved') {
    if (cultureStatus === 'negative') {
      actionType = 'de_escalate';
      actionTitleVi = 'Lâm sàng cải thiện + Cấy vi sinh Âm tính';
      actionTitleEn = 'Clinical Improvement + Negative Culture';
      recommendationsVi.push('Đánh giá lại chỉ định kháng sinh ban đầu.');
      recommendationsVi.push('Xem xét điều kiện để: (1) Ngừng kháng sinh nếu đủ ngày tối thiểu, (2) Xuống thang kháng sinh phổ hẹp, (3) Chuyển từ IV sang PO.');
      recommendationsEn.push('Re-evaluate initial indication. Consider (1) Stopping if minimum duration met, (2) De-escalation, (3) IV-to-PO switch.');
      stopChecklistEligible = true;
      ivToPoEligible = true;
    } else if (cultureStatus === 'positive') {
      if (susceptibilityStatus === 'sensitive') {
        actionType = 'de_escalate';
        actionTitleVi = 'Lâm sàng cải thiện + Vi khuẩn Nhạy cảm với KS đang dùng';
        actionTitleEn = 'Clinical Improvement + Organism Sensitive';
        recommendationsVi.push('Tiếp tục / thay đổi / Xuống thang kháng sinh phổ hẹp phù hợp với kết quả Kháng sinh đồ (KSĐ).');
        recommendationsVi.push('Lưu ý BVBND (*): Có thể KHÔNG xuống thang khi thời gian sử dụng KS còn lại ≤ 2 ngày. Nếu đổi sang KS khác phải duy trì liệu trình mới ít nhất 3 – 5 ngày.');
        recommendationsVi.push('Xem xét điều kiện chuyển từ tiêm sang uống (IV sang PO) ngay khi dung nạp đường tiêu hóa.');
        recommendationsEn.push('De-escalate to narrower-spectrum agent based on AST. Note: de-escalation may be omitted if remaining duration ≤ 2 days; new agent requires ≥ 3-5 days.');
        stopChecklistEligible = true;
        ivToPoEligible = true;
      } else {
        // resistant
        actionType = 'consult';
        actionTitleVi = 'Lâm sàng cải thiện NHƯNG Vi khuẩn Kháng thuốc trên KSĐ';
        actionTitleEn = 'Clinical Improvement BUT Resistant Organism on AST';
        recommendationsVi.push('BẮT BUỘC HỘI CHẨN nếu có ý định tiếp tục dùng kháng sinh mà vi sinh báo kháng.');
        recommendationsVi.push('Đánh giá cẩn trọng xem chủng vi khuẩn phân lập là tác nhân gây bệnh thực sự hay chỉ là tạp nhiễm/định cư.');
        recommendationsVi.push('Nếu không giải trình được vi khuẩn tạp nhiễm, xem xét thay đổi kháng sinh phù hợp theo Kháng sinh đồ (KSĐ).');
        recommendationsEn.push('Mandatory consultation if continuing resistant agent. Assess true pathogen vs colonizer, or switch per AST.');
      }
    } else {
      // culture pending
      actionType = 'continue';
      actionTitleVi = 'Lâm sàng cải thiện + Đang chờ kết quả cấy vi sinh';
      actionTitleEn = 'Clinical Improvement + Culture Pending';
      recommendationsVi.push('Tiếp tục duy trì phác đồ hiện tại cho đến khi có kết quả định danh và kháng sinh đồ.');
      recommendationsVi.push('Theo dõi sát sinh hiệu và công thức máu/CRP.');
      recommendationsEn.push('Maintain current regimen until culture and AST results return.');
    }
  } else {
    // not_improved or worsened
    actionType = 'switch_by_ast';
    actionTitleVi = 'Lâm sàng KHÔNG cải thiện hoặc Diễn tiến xấu đi';
    actionTitleEn = 'Clinical Failure or Deterioration';
    recommendationsVi.push('BẮT BUỘC HỘI CHẨN CHUYÊN KHOA HỒI SỨC / TRUYỀN NHIỄM / DƯỢC LÂM SÀNG.');
    recommendationsVi.push('Tầm soát lại toàn diện ổ nhiễm trùng (chụp CT scan, siêu âm tìm ổ áp xe chưa dẫn lưu, rút bỏ catheter nghi ngờ).');

    if (cultureStatus === 'positive') {
      recommendationsVi.push('Thay đổi kháng sinh ngay lập tức theo kết quả Kháng sinh đồ (KSĐ).');
      recommendationsEn.push('Change antibiotics immediately guided by AST.');
    } else {
      recommendationsVi.push('Cấy lại máu và bệnh phẩm mới trước khi đổi kháng sinh.');
      recommendationsVi.push('Nâng bậc kháng sinh phổ rộng hơn, bao phủ vi khuẩn đa kháng (CRE, DTR-Pseudomonas, Acinetobacter) hoặc phối hợp thuốc chống nấm.');
      recommendationsEn.push('Re-culture and escalate to broader regimen targeting MDR or fungal pathogens.');
    }
  }

  return {
    actionType,
    actionTitleVi,
    actionTitleEn,
    recommendationsVi,
    recommendationsEn,
    stopChecklistEligible,
    ivToPoEligible,
    source: { doc: 'BVBND_LuuDo', page: 2 }
  };
}

/**
 * 4. EVALUATE ANTIBIOTIC STOP CRITERIA
 * Source: BV Bệnh Nhiệt Đới (File 1, P.3)
 */
export function evaluateStopCriteria(
  checkedClinicalIds: string[],
  checkedLabIds: string[],
  currentDaysOnAbx: number,
  site: InfectionSite
) {
  const benchmark = EVIDENCE_BASED_DURATIONS.find(b => {
    if (site === 'respiratory') return b.conditionVi.includes('Viêm phổi');
    if (site === 'peritoneal') return b.conditionVi.includes('ổ bụng');
    if (site === 'urinary') return b.conditionVi.includes('tiết niệu');
    if (site === 'sepsis') return b.conditionVi.includes('huyết');
    return false;
  }) || EVIDENCE_BASED_DURATIONS[0];

  const minDurationMet = currentDaysOnAbx >= benchmark.minDays;
  const clinicalCriteriaMet = checkedClinicalIds.length === STOP_ANTIBIOTIC_CHECKLIST.clinicalCriteria.length; // 5/5
  const labCriteriaMet = checkedLabIds.length >= 1; // at least 1/3

  const canStop = minDurationMet && clinicalCriteriaMet && labCriteriaMet;

  return {
    canStop,
    minDurationMet,
    clinicalCriteriaMet,
    clinicalCriteriaCount: checkedClinicalIds.length,
    labCriteriaMet,
    labCriteriaCount: checkedLabIds.length,
    minDays: benchmark.minDays,
    benchmarkNoteVi: benchmark.noteVi,
    trialName: benchmark.trialName,
    source: { doc: 'BVBND_LuuDo', page: 3 }
  };
}

/**
 * 5. EVALUATE IV-TO-PO SWITCH ELIGIBILITY
 * Source: Quyết định 5631/QĐ-BYT (Phụ lục 5 & 6)
 */
export function evaluateIvToPo(
  isAfebrile24h: boolean,
  isHemodynamicStable: boolean,
  isGutFunctioning: boolean,
  hasContraindication: boolean,
  currentDrugName: string
): IvToPoEvaluation {
  const blockingReasonsVi: string[] = [];

  if (!isAfebrile24h) {
    blockingReasonsVi.push('Chưa hết sốt đủ 24 giờ (thân nhiệt chưa đạt < 38.3°C trong ít nhất 24 giờ không dùng thuốc hạ sốt).');
  }
  if (!isHemodynamicStable) {
    blockingReasonsVi.push('Huyết động chưa ổn định hoặc còn dùng thuốc vận mạch.');
  }
  if (!isGutFunctioning) {
    blockingReasonsVi.push('Đường tiêu hóa không đảm bảo hấp thu (nôn ói, tiêu chảy nặng, tắc ruột, dẫn lưu dạ dày lưu lượng lớn).');
  }
  if (hasContraindication) {
    blockingReasonsVi.push('Bệnh nhân thuộc nhóm nhiễm khuẩn sâu chống chỉ định chuyển sớm (Viêm nội tâm mạc, viêm màng não, viêm xương tủy, áp xe chưa dẫn lưu...).');
  }

  const isEligible = blockingReasonsVi.length === 0;

  // Find matching PO drug pairs
  const matchingPairs = IV_TO_PO_DRUG_PAIRS.filter(pair => 
    pair.ivName.toLowerCase().includes(currentDrugName.toLowerCase()) ||
    currentDrugName.toLowerCase().includes(pair.ivName.split(' ')[0].toLowerCase())
  );

  return {
    isEligible,
    blockingReasonsVi,
    suggestedPoDrugs: (matchingPairs.length > 0 ? matchingPairs : IV_TO_PO_DRUG_PAIRS.slice(0, 3)).map(p => ({
      ivName: p.ivName,
      poName: p.poName,
      poDoseVi: p.poDoseVi,
      groupIndex: p.group,
      bioavailabilityVi: p.bioavailabilityVi
    }))
  };
}

export function getMdrPathway(category: MdrPathogenCategory) {
  return MDR_PATHWAYS[category];
}

export { getAntibiogramForSite, BVBND_ANTIBIOGRAMS } from './data/antibiogram';
export { MDR_PATHWAYS };
export { WHO_REGIMENS } from './data/whoRegimens';

