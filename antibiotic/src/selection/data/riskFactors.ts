import { RiskFactorItem } from '../types';

/**
 * 8 General Risk Factors for Multidrug-Resistant Pathogens (MDR)
 * Source: BV Bệnh Nhiệt Đới - Lưu đồ phân nhóm nguy cơ nhiễm VKĐK (File 2, P.2)
 */
export const GENERAL_MDR_RISK_FACTORS: RiskFactorItem[] = [
  {
    id: 'hospital_90d',
    labelVi: 'Điều trị ≥ 5 ngày tại cơ sở y tế trong vòng 90 ngày HOẶC nằm ICU > 2 ngày',
    labelEn: 'Hospitalized ≥ 5 days within 90 days OR ICU admission > 2 days',
    category: 'general',
    noteVi: 'Yếu tố dịch tễ phơi nhiễm vi khuẩn nội viện quan trọng.',
    source: { doc: 'BVBND_PhanNhom', page: 2 }
  },
  {
    id: 'invasive_device',
    labelVi: 'Đang đặt dụng cụ xâm lấn lưu > 7 ngày HOẶC vừa làm thủ thuật / phẫu thuật',
    labelEn: 'Invasive device in place > 7 days OR recent invasive procedure/surgery',
    category: 'general',
    noteVi: 'Bao gồm catheter tĩnh mạch trung tâm, thông tiểu lưu, nội khí quản.',
    source: { doc: 'BVBND_PhanNhom', page: 2 }
  },
  {
    id: 'iv_abx_30d',
    labelVi: 'Có dùng kháng sinh đường tĩnh mạch trong vòng 30 ngày qua',
    labelEn: 'Received intravenous antibiotics within past 30 days',
    category: 'general',
    noteVi: 'Áp lực chọn lọc vi khuẩn kháng thuốc tại chỗ.',
    source: { doc: 'BVBND_PhanNhom', page: 2 }
  },
  {
    id: 'steroid_prolonged',
    labelVi: 'Sử dụng corticosteroid kéo dài',
    labelEn: 'Prolonged corticosteroid use',
    category: 'general',
    noteVi: 'Prednisone ≥ 0.2 mg/kg/ngày > 3 tháng hoặc 1 mg/kg/ngày trong 1 tuần trong vòng 3 tháng trước nhập viện.',
    source: { doc: 'BVBND_PhanNhom', page: 2 }
  },
  {
    id: 'chronic_disease',
    labelVi: 'Có bệnh lý mạn tính nặng kèm theo',
    labelEn: 'Underlying chronic comorbid conditions',
    category: 'general',
    noteVi: 'Đái tháo đường, suy gan, xơ gan, chạy thận nhân tạo mạn tính, bệnh cấu trúc phổi (giãn PQ/COPD), xơ nang, suy giảm miễn dịch nặng.',
    source: { doc: 'BVBND_PhanNhom', page: 2 }
  },
  {
    id: 'transplant_chemo',
    labelVi: 'Ghép tủy xương, ghép tạng, giảm bạch cầu hạt do hóa trị',
    labelEn: 'Bone marrow/solid organ transplant, neutropenia due to chemotherapy',
    category: 'general',
    noteVi: 'Cơ địa suy giảm miễn dịch dòng tế bào và bạch cầu nghiêm trọng.',
    source: { doc: 'BVBND_PhanNhom', page: 2 }
  },
  {
    id: 'age_over_60',
    labelVi: 'Tuổi > 60',
    labelEn: 'Age > 60 years',
    category: 'general',
    noteVi: 'Yếu tố độc lập làm tăng nguy cơ nhiễm chủng vi khuẩn kháng thuốc.',
    source: { doc: 'BVBND_PhanNhom', page: 2 }
  },
  {
    id: 'mdr_contact',
    labelVi: 'Tiếp xúc gần với người nhiễm vi khuẩn đa kháng (MDR)',
    labelEn: 'Close contact with person known to be colonized/infected with MDR',
    category: 'general',
    noteVi: 'Lây truyền chéo vi khuẩn đề kháng trong gia đình hoặc cơ sở chăm sóc.',
    source: { doc: 'BVBND_PhanNhom', page: 2 }
  }
];

/**
 * Pathogen-Specific Risk Factors
 * Source: BV Bệnh Nhiệt Đới (File 2, P.2-3)
 */
export const MRSA_RISK_FACTORS: RiskFactorItem[] = [
  {
    id: 'mrsa_fq_90d',
    labelVi: 'Có dùng Fluoroquinolone đơn trị trong vòng 90 ngày',
    labelEn: 'Fluoroquinolone monotherapy within past 90 days',
    category: 'mrsa',
    source: { doc: 'BVBND_PhanNhom', page: 2 }
  },
  {
    id: 'mrsa_hiv_cd4_low',
    labelVi: 'HIV/AIDS chưa điều trị hoặc CD4 < 50 tế bào/µL',
    labelEn: 'Untreated HIV/AIDS or CD4 count < 50 cells/µL',
    category: 'mrsa',
    source: { doc: 'BVBND_PhanNhom', page: 2 }
  },
  {
    id: 'mrsa_cvc_foley',
    labelVi: 'Đặt catheter tĩnh mạch trung tâm hoặc sonde tiểu lưu',
    labelEn: 'Central venous catheter or indwelling Foley catheter',
    category: 'mrsa',
    source: { doc: 'BVBND_PhanNhom', page: 2 }
  },
  {
    id: 'mrsa_history',
    labelVi: 'Tiền căn nhiễm hoặc phơi nhiễm Tụ cầu vàng kháng Methicillin (MRSA)',
    labelEn: 'Prior infection or colonization with MRSA',
    category: 'mrsa',
    source: { doc: 'BVBND_PhanNhom', page: 2 }
  },
  {
    id: 'mrsa_ivdu',
    labelVi: 'Sử dụng ma túy đường tĩnh mạch',
    labelEn: 'Intravenous drug use (IVDU)',
    category: 'mrsa',
    source: { doc: 'BVBND_PhanNhom', page: 2 }
  },
  {
    id: 'mrsa_unsafe_sex',
    labelVi: 'Quan hệ tình dục không an toàn',
    labelEn: 'Unsafe sexual behavior',
    category: 'mrsa',
    source: { doc: 'BVBND_PhanNhom', page: 3 }
  }
];

export const ESBL_RISK_FACTORS: RiskFactorItem[] = [
  {
    id: 'esbl_steroid',
    labelVi: 'Sử dụng corticosteroid kéo dài (theo định nghĩa chung)',
    labelEn: 'Prolonged corticosteroid use',
    category: 'esbl',
    source: { doc: 'BVBND_PhanNhom', page: 3 }
  },
  {
    id: 'esbl_tubes',
    labelVi: 'Đặt sonde dạ dày nuôi ăn, sonde tiểu lưu',
    labelEn: 'Nasogastric feeding tube or indwelling urinary catheter',
    category: 'esbl',
    source: { doc: 'BVBND_PhanNhom', page: 3 }
  },
  {
    id: 'esbl_history',
    labelVi: 'Tiền căn nhiễm hoặc phơi nhiễm Enterobacterales sinh ESBL',
    labelEn: 'Prior infection or colonization with ESBL-producing Enterobacterales',
    category: 'esbl',
    source: { doc: 'BVBND_PhanNhom', page: 3 }
  },
  {
    id: 'esbl_long_term_care',
    labelVi: 'Nằm tại cơ sở y tế dài hạn / trung tâm điều dưỡng',
    labelEn: 'Residence in long-term care facility or nursing home',
    category: 'esbl',
    source: { doc: 'BVBND_PhanNhom', page: 3 }
  },
  {
    id: 'esbl_hemodialysis',
    labelVi: 'Chạy thận nhân tạo định kỳ',
    labelEn: 'Chronic hemodialysis',
    category: 'esbl',
    source: { doc: 'BVBND_PhanNhom', page: 3 }
  },
  {
    id: 'esbl_cvc',
    labelVi: 'Đặt catheter tĩnh mạch trung tâm',
    labelEn: 'Central venous catheter in place',
    category: 'esbl',
    source: { doc: 'BVBND_PhanNhom', page: 3 }
  }
];

export const PSEUDO_ACINETO_RISK_FACTORS: RiskFactorItem[] = [
  {
    id: 'ps_icu_5d',
    labelVi: 'Đang nằm tại khoa Hồi sức tích cực (ICU) > 5 ngày',
    labelEn: 'Current ICU stay > 5 days',
    category: 'pseudo_acineto',
    source: { doc: 'BVBND_PhanNhom', page: 3 }
  },
  {
    id: 'ps_devices',
    labelVi: 'Có thiết bị xâm lấn lưu (nội khí quản / thở máy, CVC, dẫn lưu)',
    labelEn: 'Presence of invasive devices (endotracheal tube/ventilator, CVC, drains)',
    category: 'pseudo_acineto',
    source: { doc: 'BVBND_PhanNhom', page: 3 }
  },
  {
    id: 'ps_bedridden',
    labelVi: 'Trạng thái liệt giường trong cơ sở y tế',
    labelEn: 'Bedridden status in healthcare facility',
    category: 'pseudo_acineto',
    source: { doc: 'BVBND_PhanNhom', page: 3 }
  },
  {
    id: 'ps_broad_abx',
    labelVi: 'Đã dùng Cephalosporin phổ rộng, Aminoglycoside, Carbapenem, FQ hoặc nhiều loại KS',
    labelEn: 'Prior broad-spectrum cephalosporins, aminoglycosides, carbapenems, FQs, or multi-antibiotics',
    category: 'pseudo_acineto',
    source: { doc: 'BVBND_PhanNhom', page: 3 }
  },
  {
    id: 'ps_selective_abx_7d',
    labelVi: 'Đang dùng kháng sinh có nguy cơ chọn lọc dòng kháng (CG3, FQ, AG) ≥ 7 ngày',
    labelEn: 'Current use of high-risk selective antibiotics (3rd gen Ceph, FQ, AG) ≥ 7 days',
    category: 'pseudo_acineto',
    source: { doc: 'BVBND_PhanNhom', page: 3 }
  },
  {
    id: 'ps_diabetes',
    labelVi: 'Bệnh lý đái tháo đường',
    labelEn: 'Diabetes mellitus',
    category: 'pseudo_acineto',
    source: { doc: 'BVBND_PhanNhom', page: 3 }
  },
  {
    id: 'ps_surgery',
    labelVi: 'Có phẫu thuật hoặc thủ thuật can thiệp gần đây',
    labelEn: 'Recent surgery or interventional procedure',
    category: 'pseudo_acineto',
    source: { doc: 'BVBND_PhanNhom', page: 3 }
  }
];

export const ENTEROCOCCUS_RISK_FACTORS: RiskFactorItem[] = [
  {
    id: 'ent_foley_prior_abx',
    labelVi: 'Sonde tiểu lưu kéo dài HOẶC tiền sử dùng Cephalosporin / Vancomycin trước đó',
    labelEn: 'Indwelling Foley catheter OR prior cephalosporin/vancomycin exposure',
    category: 'enterococcus',
    source: { doc: 'BVBND_PhanNhom', page: 3 }
  }
];

/**
 * Combined dictionary of all pathogen-specific risk factors
 */
export const ALL_SPECIFIC_RISK_FACTORS: RiskFactorItem[] = [
  ...MRSA_RISK_FACTORS,
  ...ESBL_RISK_FACTORS,
  ...PSEUDO_ACINETO_RISK_FACTORS,
  ...ENTEROCOCCUS_RISK_FACTORS
];

/**
 * Automatically infers active SpecificPathogenRisk array from individual factor IDs
 */
export function inferSpecificRisksFromFactorIds(factorIds: string[]): import('../types').SpecificPathogenRisk[] {
  const risks = new Set<import('../types').SpecificPathogenRisk>();
  for (const id of factorIds) {
    if (id.startsWith('mrsa_')) risks.add('mrsa');
    else if (id.startsWith('esbl_')) risks.add('esbl');
    else if (id.startsWith('ps_')) risks.add('pseudo_acineto');
    else if (id.startsWith('ent_')) risks.add('enterococcus');
  }
  return Array.from(risks);
}

/**
 * Maps infection site to primary MDR pathogen suspect according to BVBND flowchart
 */
export function getPrimaryTargetForSite(site: import('../types').InfectionSite): import('../types').SpecificPathogenRisk {
  switch (site) {
    case 'skin_soft_tissue':
      return 'mrsa';
    case 'urinary':
    case 'gastrointestinal':
    case 'peritoneal':
      return 'esbl';
    case 'respiratory':
    case 'sepsis':
    case 'cns':
    default:
      return 'pseudo_acineto';
  }
}

/**
 * Generates suggested organisms according to BVBND 2026 flowchart
 */
export function getSuggestedOrganisms(
  site: import('../types').InfectionSite,
  group: import('../types').RiskGroup,
  activeSpecificRisks: import('../types').SpecificPathogenRisk[] = [],
  isNeutropenic: boolean = false
): string[] {
  if (group === 'group_1') {
    const list: string[] = [];
    switch (site) {
      case 'skin_soft_tissue':
        list.push('Streptococcus spp. (Liên cầu tan huyết)', 'Staphylococcus aureus nhạy Methicillin (MSSA)');
        break;
      case 'urinary':
      case 'gastrointestinal':
      case 'peritoneal':
        list.push('Trực khuẩn Gram (-) đường ruột nhạy cảm (E. coli, Klebsiella spp., Proteus mirabilis)');
        break;
      case 'respiratory':
        list.push('Streptococcus pneumoniae (Phế cầu)', 'Haemophilus influenzae', 'Klebsiella pneumoniae nhạy cảm');
        break;
      case 'sepsis':
        list.push('Trực khuẩn Gram (-) đường ruột', 'Cầu khuẩn Gram (+) nhạy cảm (Staphylococcus, Streptococcus)');
        break;
      case 'cns':
        list.push('Streptococcus pneumoniae (Phế cầu)', 'Neisseria meningitidis (Não mô cầu)', 'Haemophilus influenzae');
        break;
    }
    if (isNeutropenic) {
      list.push('Lưu ý đặc biệt: Bệnh nhân giảm bạch cầu hạt cần cảnh giác thêm Pseudomonas aeruginosa');
    }
    return list;
  }

  // Group 2: High MDR Risk
  const list: string[] = [];
  if (activeSpecificRisks.includes('mrsa')) {
    list.push('Tụ cầu vàng kháng Methicillin (MRSA)');
  }
  if (activeSpecificRisks.includes('esbl')) {
    list.push('Trực khuẩn Gram (-) Enterobacterales sinh ESBL (E. coli, K. pneumoniae)');
  }
  if (activeSpecificRisks.includes('pseudo_acineto')) {
    list.push('Pseudomonas aeruginosa đa kháng (MDR-PA)', 'Acinetobacter baumannii đa kháng (MDR-AB)');
  }
  if (activeSpecificRisks.includes('enterococcus')) {
    list.push('Enterococcus spp. (VRE / Ampicillin-R)');
  }

  if (list.length === 0) {
    // If no specific risk checked yet, suggest based on site
    const primary = getPrimaryTargetForSite(site);
    if (primary === 'mrsa') list.push('Nghi ngờ hàng đầu: Tụ cầu vàng kháng Methicillin (MRSA)');
    else if (primary === 'esbl') list.push('Nghi ngờ hàng đầu: Enterobacterales sinh ESBL');
    else list.push('Nghi ngờ hàng đầu: Pseudomonas / Acinetobacter đa kháng');
  }

  return list;
}

/**
 * Evaluates combination rules & alerts according to BVBND Note b & Principle 9
 */
export function getCombinationGuidance(
  activeSpecificRisks: import('../types').SpecificPathogenRisk[]
): {
  isGramPosGramNegCoRisk: boolean;
  isDualGramNegRisk: boolean;
  guidanceVi: string[];
} {
  const hasGramPos = activeSpecificRisks.includes('mrsa') || activeSpecificRisks.includes('enterococcus');
  const hasGramNeg = activeSpecificRisks.includes('esbl') || activeSpecificRisks.includes('pseudo_acineto');
  const isGramPosGramNegCoRisk = hasGramPos && hasGramNeg;
  const isDualGramNegRisk = activeSpecificRisks.includes('esbl') && activeSpecificRisks.includes('pseudo_acineto');

  const guidanceVi: string[] = [];

  if (isGramPosGramNegCoRisk) {
    guidanceVi.push(
      'QUY TẮC BVBND (Ghi chú b): Bệnh nhân có đồng thời nguy cơ Gram (+) (MRSA/VRE) và Gram (-) (ESBL/Pseudomonas) → BẮT BUỘC PHỐI HỢP KHÁNG SINH tác dụng trên cả 2 nhóm (ví dụ: Vancomycin/Linezolid + Meropenem hoặc Piperacillin-tazobactam).'
    );
  }

  if (isDualGramNegRisk) {
    guidanceVi.push(
      'QUY TẮC BVBND (Ghi chú b): Bệnh nhân có nguy cơ của cả 2 nhóm Gram (-) (ESBL và Pseudomonas/Acinetobacter) → ƯU TIÊN nhóm kháng sinh có phổ trên Acinetobacter / Pseudomonas (như Meropenem, Cefepime, Piperacillin-tazobactam hoặc Colistin) để bao phủ đồng thời cả chủng sinh ESBL. Tránh dùng Ertapenem đơn độc (vì Ertapenem không diệt được Pseudomonas/Acinetobacter).'
    );
  }

  // Principle 9
  guidanceVi.push(
    'NGUYÊN TẮC BVBND (Mục 9): Tránh phối hợp nhiều KS không cần thiết; các thuốc BL-BLI phổ rộng (như Piperacillin-tazobactam) hoặc Carbapenem (Meropenem, Imipenem) đã có phổ hiệu quả trên vi khuẩn kỵ khí, KHÔNG dùng Metronidazole phối hợp cùng.'
  );

  return {
    isGramPosGramNegCoRisk,
    isDualGramNegRisk,
    guidanceVi
  };
}

