import { EmpiricRegimen } from '../types';

/**
 * Empiric Antibiotic Regimens stratified by Population, Infection Site, Risk Group & Pathogen Risk
 * Source: BV Bệnh Nhiệt Đới (File 3: Hướng dẫn sử dụng kháng sinh 2026, P.4-13)
 * All drug entries include drugId matching the 43 antibiotics in CliniPortal Dosing Calculator.
 */
export const EMPIRIC_REGIMENS: EmpiricRegimen[] = [
  // ==========================================
  // 1. ADULT - RESPIRATORY (VIÊM PHỔI NGƯỜI LỚN) (P.8-9)
  // ==========================================
  {
    id: 'adult_resp_group1',
    site: 'respiratory',
    population: 'adult',
    riskGroup: 'group_1',
    titleVi: 'Viêm phổi - Nhóm 1 (Ít nguy cơ vi khuẩn đa kháng)',
    titleEn: 'Adult Pneumonia - Group 1 (Low MDR Risk)',
    drugs: [
      {
        drugId: 'amox_clav',
        nameVi: 'Amoxicillin/Clavulanate',
        drugName: 'Amoxicillin/Clavulanate',
        nameEn: 'Amoxicillin/Clavulanate',
        standardDoseVi: '1g IV q8h hoặc 875/125mg PO q12h',
        dosageVi: '1g IV q8h hoặc 875/125mg PO q12h',
        route: 'IV/PO',
        hasDosingCalculator: true
      },
      {
        drugId: 'ceftriaxon',
        nameVi: 'Ceftriaxone',
        drugName: 'Ceftriaxone',
        nameEn: 'Ceftriaxone',
        standardDoseVi: '1 - 2g IV mỗi 24 giờ',
        dosageVi: '1 - 2g IV mỗi 24 giờ',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'azithromycin',
        nameVi: 'Azithromycin (phối hợp phủ VK không điển hình)',
        drugName: 'Azithromycin (phối hợp phủ VK không điển hình)',
        nameEn: 'Azithromycin (combo atypical)',
        standardDoseVi: '500mg IV/PO ngày 1, sau đó 250mg mỗi 24 giờ (hoặc 500mg q24h)',
        dosageVi: '500mg IV/PO ngày 1, sau đó 250mg mỗi 24 giờ (hoặc 500mg q24h)',
        route: 'IV/PO',
        hasDosingCalculator: true
      },
      {
        drugId: 'levofloxacin',
        nameVi: 'Levofloxacin (đơn trị thay thế)',
        drugName: 'Levofloxacin (đơn trị thay thế)',
        nameEn: 'Levofloxacin monotherapy',
        standardDoseVi: '750mg IV/PO mỗi 24 giờ (hoặc 500mg q12h)',
        dosageVi: '750mg IV/PO mỗi 24 giờ (hoặc 500mg q12h)',
        route: 'IV/PO',
        hasDosingCalculator: true
      },
      {
        drugId: 'moxifloxacin',
        nameVi: 'Moxifloxacin (đơn trị thay thế)',
        drugName: 'Moxifloxacin (đơn trị thay thế)',
        nameEn: 'Moxifloxacin monotherapy',
        standardDoseVi: '400mg IV/PO mỗi 24 giờ',
        dosageVi: '400mg IV/PO mỗi 24 giờ',
        route: 'IV/PO',
        hasDosingCalculator: true
      }
    ],
    combinationRulesVi: [
      'Phối hợp Ceftriaxone hoặc Amox-clav + Azithromycin khi nghi ngờ vi khuẩn không điển hình.',
      'Hoặc dùng đơn trị liệu FQ hô hấp (Levofloxacin / Moxifloxacin).',
      'Cân nhắc phối hợp Oseltamivir khi nghi ngờ cúm đồng nhiễm trong mùa dịch.'
    ],
    source: { doc: 'BVBND_HDSDKS', page: 8 }
  },
  {
    id: 'adult_resp_group2_base',
    site: 'respiratory',
    population: 'adult',
    riskGroup: 'group_2',
    titleVi: 'Viêm phổi - Nhóm 2: Khung Phác Đồ Kinh Nghiệm Khởi Đầu (HAP/VAP)',
    titleEn: 'Adult Pneumonia - Group 2 Base Empiric Regimen (HAP/VAP)',
    drugs: [
      {
        drugId: 'piperacillin_tazo',
        nameVi: 'Piperacillin/Tazobactam (lựa chọn ưu tiên)',
        drugName: 'Piperacillin/Tazobactam (lựa chọn ưu tiên)',
        nameEn: 'Piperacillin/Tazobactam',
        standardDoseVi: '4.5g IV mỗi 6 giờ truyền kéo dài 3 - 4 giờ',
        dosageVi: '4.5g IV mỗi 6 giờ truyền kéo dài 3 - 4 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        infusionNoteVi: 'Truyền kéo dài 3 - 4 giờ để tối ưu T > MIC'
      },
      {
        drugId: 'meropenem',
        nameVi: 'Meropenem (khi bệnh nặng, sốc hoặc nguy cơ ESBL)',
        drugName: 'Meropenem (khi bệnh nặng, sốc hoặc nguy cơ ESBL)',
        nameEn: 'Meropenem',
        standardDoseVi: '1g - 2g IV mỗi 8 giờ truyền kéo dài 3 - 4 giờ',
        dosageVi: '1g - 2g IV mỗi 8 giờ truyền kéo dài 3 - 4 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        infusionNoteVi: 'Truyền kéo dài 3 - 4 giờ giúp tăng diệt khuẩn'
      },
      {
        drugId: 'cefo_sulbactam_11',
        nameVi: 'Cefoperazone/Sulbactam liều cao',
        drugName: 'Cefoperazone/Sulbactam liều cao',
        nameEn: 'Cefoperazone/Sulbactam high-dose',
        standardDoseVi: '2g - 4g IV mỗi 8 - 12 giờ',
        dosageVi: '2g - 4g IV mỗi 8 - 12 giờ',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'cefepim',
        nameVi: 'Cefepime',
        drugName: 'Cefepime',
        nameEn: 'Cefepime',
        standardDoseVi: '2g IV mỗi 8 giờ truyền kéo dài 3 - 4 giờ',
        dosageVi: '2g IV mỗi 8 giờ truyền kéo dài 3 - 4 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        infusionNoteVi: 'Truyền kéo dài 3 giờ'
      },
      {
        drugId: 'amikacin',
        nameVi: 'Amikacin (phối hợp khi sốc hoặc suy hô hấp nặng)',
        drugName: 'Amikacin (phối hợp khi sốc hoặc suy hô hấp nặng)',
        nameEn: 'Amikacin',
        standardDoseVi: '15 - 20 mg/kg IV mỗi 24 giờ',
        dosageVi: '15 - 20 mg/kg IV mỗi 24 giờ',
        route: 'IV',
        hasDosingCalculator: true
      }
    ],
    combinationRulesVi: [
      'Chọn 1 Beta-lactam chống trực khuẩn mủ xanh (Pip/taz, Meropenem, Cefo/sul, Cefepime).',
      'Phối hợp thêm Amikacin 15-20mg/kg q24h nếu có sốc nhiễm trùng hoặc nguy cơ kháng thuốc cao.',
      'Nếu có nguy cơ MRSA (đặt nội khí quản > 5 ngày, dùng KS trước đó, lọc máu): Phối hợp thêm Vancomycin / Linezolid / Teicoplanin.',
      'KHÔNG dùng Daptomycin cho nhiễm trùng phổi vì bị surfactant phế nang bất hoạt hoàn toàn!'
    ],
    source: { doc: 'BVBND_HDSDKS', page: 8 }
  },
  {
    id: 'adult_resp_group2_mrsa',
    site: 'respiratory',
    population: 'adult',
    riskGroup: 'group_2',
    specificRisk: 'mrsa',
    titleVi: 'Viêm phổi - Nhóm 2 + Nguy cơ Tụ cầu vàng kháng Methicillin (MRSA)',
    titleEn: 'Adult Pneumonia - Group 2 + MRSA Risk',
    drugs: [
      {
        drugId: 'vancomycin',
        nameVi: 'Vancomycin (lựa chọn hàng đầu)',
        drugName: 'Vancomycin (lựa chọn hàng đầu)',
        nameEn: 'Vancomycin',
        standardDoseVi: 'Liều nạp 25 - 30 mg/kg, sau đó 15 - 20 mg/kg q8-12h (theo dõi TDM đáy 15-20 mcg/mL)',
        dosageVi: 'Liều nạp 25 - 30 mg/kg, sau đó 15 - 20 mg/kg q8-12h (theo dõi TDM đáy 15-20 mcg/mL)',
        route: 'IV',
        hasDosingCalculator: true,
        infusionNoteVi: 'Đo Cmin trước liều thứ 4; mục tiêu đáy 15 - 20 mcg/mL hoặc AUC/MIC 400 - 600'
      },
      {
        drugId: 'linezolid',
        nameVi: 'Linezolid (thấm mô phổi rất tốt)',
        drugName: 'Linezolid (thấm mô phổi rất tốt)',
        nameEn: 'Linezolid',
        standardDoseVi: '600mg IV/PO mỗi 12 giờ',
        dosageVi: '600mg IV/PO mỗi 12 giờ',
        route: 'IV/PO',
        hasDosingCalculator: true
      },
      {
        drugId: 'teicoplanin',
        nameVi: 'Teicoplanin',
        drugName: 'Teicoplanin',
        nameEn: 'Teicoplanin',
        standardDoseVi: 'Liều nạp 6 mg/kg (hoặc 800mg) q12h x 3 liều, sau đó 6 mg/kg/ngày',
        dosageVi: 'Liều nạp 6 mg/kg (hoặc 800mg) q12h x 3 liều, sau đó 6 mg/kg/ngày',
        route: 'IV/IM',
        hasDosingCalculator: true
      }
    ],
    combinationRulesVi: [
      'Bắt buộc phối hợp thuốc chống MRSA với kháng sinh phổ Gram (-) nếu bệnh nhân có nguy cơ phối hợp cả 2 nhóm vi khuẩn.'
    ],
    cautionVi: [
      'Daptomycin KHÔNG được sử dụng trong viêm phổi vì bị surfactant phế nang bất hoạt!'
    ],
    source: { doc: 'BVBND_HDSDKS', page: 9 }
  },
  {
    id: 'adult_resp_group2_esbl',
    site: 'respiratory',
    population: 'adult',
    riskGroup: 'group_2',
    specificRisk: 'esbl',
    titleVi: 'Viêm phổi - Nhóm 2 + Nguy cơ Enterobacterales sinh ESBL',
    titleEn: 'Adult Pneumonia - Group 2 + ESBL Risk',
    drugs: [
      {
        drugId: 'piperacillin_tazo',
        nameVi: 'Piperacillin/Tazobactam',
        drugName: 'Piperacillin/Tazobactam',
        nameEn: 'Piperacillin/Tazobactam',
        standardDoseVi: '4.5g IV mỗi 6 giờ truyền kéo dài 3 - 4 giờ',
        dosageVi: '4.5g IV mỗi 6 giờ truyền kéo dài 3 - 4 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        infusionNoteVi: 'Truyền kéo dài 3 - 4 giờ'
      },
      {
        drugId: 'ertapenem',
        nameVi: 'Ertapenem (nếu không nghi Pseudomonas)',
        drugName: 'Ertapenem (nếu không nghi Pseudomonas)',
        nameEn: 'Ertapenem',
        standardDoseVi: '1g IV mỗi 24 giờ',
        dosageVi: '1g IV mỗi 24 giờ',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'meropenem',
        nameVi: 'Meropenem',
        drugName: 'Meropenem',
        nameEn: 'Meropenem',
        standardDoseVi: '1g - 2g IV mỗi 8 giờ truyền kéo dài 3 - 4 giờ',
        dosageVi: '1g - 2g IV mỗi 8 giờ truyền kéo dài 3 - 4 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        infusionNoteVi: 'Truyền kéo dài 3 - 4 giờ'
      },
      {
        drugId: 'imipenem',
        nameVi: 'Imipenem/Cilastatin',
        drugName: 'Imipenem/Cilastatin',
        nameEn: 'Imipenem/Cilastatin',
        standardDoseVi: '500mg IV q6h hoặc 1g IV q8h truyền kéo dài 3 giờ',
        dosageVi: '500mg IV q6h hoặc 1g IV q8h truyền kéo dài 3 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        infusionNoteVi: 'Truyền kéo dài 3 giờ'
      }
    ],
    source: { doc: 'BVBND_HDSDKS', page: 9 }
  },
  {
    id: 'adult_resp_group2_pseudo_acineto',
    site: 'respiratory',
    population: 'adult',
    riskGroup: 'group_2',
    specificRisk: 'pseudo_acineto',
    titleVi: 'Viêm phổi - Nhóm 2 + Nguy cơ Pseudomonas / Acinetobacter đa kháng',
    titleEn: 'Adult Pneumonia - Group 2 + Pseudomonas/Acinetobacter Risk',
    drugs: [
      {
        drugId: 'meropenem',
        nameVi: 'Meropenem liều cao',
        drugName: 'Meropenem liều cao',
        nameEn: 'Meropenem high-dose',
        standardDoseVi: '2g IV mỗi 8 giờ truyền kéo dài ≥ 3 - 4 giờ',
        dosageVi: '2g IV mỗi 8 giờ truyền kéo dài ≥ 3 - 4 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        infusionNoteVi: 'Truyền kéo dài ≥ 3 - 4 giờ'
      },
      {
        drugId: 'piperacillin_tazo',
        nameVi: 'Piperacillin/Tazobactam',
        drugName: 'Piperacillin/Tazobactam',
        nameEn: 'Piperacillin/Tazobactam',
        standardDoseVi: '4.5g IV mỗi 6 giờ truyền kéo dài 3 - 4 giờ',
        dosageVi: '4.5g IV mỗi 6 giờ truyền kéo dài 3 - 4 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        infusionNoteVi: 'Truyền kéo dài 3 - 4 giờ'
      },
      {
        drugId: 'cefo_sulbactam_11',
        nameVi: 'Cefoperazone/Sulbactam liều cao',
        drugName: 'Cefoperazone/Sulbactam liều cao',
        nameEn: 'Cefoperazone/Sulbactam high-dose',
        standardDoseVi: '2g - 4g IV mỗi 8 - 12 giờ',
        dosageVi: '2g - 4g IV mỗi 8 - 12 giờ',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'ceftazidim',
        nameVi: 'Ceftazidime',
        drugName: 'Ceftazidime',
        nameEn: 'Ceftazidime',
        standardDoseVi: '2g IV mỗi 8 giờ truyền kéo dài',
        dosageVi: '2g IV mỗi 8 giờ truyền kéo dài',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'cefepim',
        nameVi: 'Cefepime',
        drugName: 'Cefepime',
        nameEn: 'Cefepime',
        standardDoseVi: '2g IV mỗi 8 giờ truyền kéo dài 3 - 4 giờ',
        dosageVi: '2g IV mỗi 8 giờ truyền kéo dài 3 - 4 giờ',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'amikacin',
        nameVi: 'Amikacin (phối hợp hiệp đồng)',
        drugName: 'Amikacin (phối hợp hiệp đồng)',
        nameEn: 'Amikacin (combo)',
        standardDoseVi: '15 - 20 mg/kg IV mỗi 24 giờ',
        dosageVi: '15 - 20 mg/kg IV mỗi 24 giờ',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'colistin',
        nameVi: 'Colistin (khi nghi ngờ vi khuẩn siêu kháng CRAB/DTR-PA)',
        drugName: 'Colistin (khi nghi ngờ vi khuẩn siêu kháng CRAB/DTR-PA)',
        nameEn: 'Colistin (CMS)',
        standardDoseVi: 'Nạp 300mg CBA (9M UI), duy trì 150-180mg CBA q12h',
        dosageVi: 'Nạp 300mg CBA (9M UI), duy trì 150-180mg CBA q12h',
        route: 'IV/Khí dung',
        hasDosingCalculator: true,
        infusionNoteVi: 'Liều nạp bắt buộc; phối hợp khí dung Colistin nếu thở máy VAP'
      }
    ],
    combinationRulesVi: [
      'Phối hợp 1 Beta-lactam chống trực khuẩn mủ xanh (Pip-taz / Cefepime / Meropenem) + 1 Aminoglycoside (Amikacin / Tobramycin).',
      'Nếu có nguy cơ cả ESBL và Acineto/Pseudo, luôn ưu tiên nhóm kháng sinh diệt Acineto/Pseudo.',
      'Cân nhắc phối hợp thêm Colistin nếu tỷ lệ vi khuẩn kháng Carbapenem tại khoa phòng cao.'
    ],
    source: { doc: 'BVBND_HDSDKS', page: 9 }
  },

  // ==========================================
  // 2. ADULT - SEPSIS / NHIỄM KHUẨN HUYẾT (P.12-13)
  // ==========================================
  {
    id: 'adult_sepsis_resp_group1',
    site: 'sepsis',
    sepsisSource: 'respiratory',
    population: 'adult',
    riskGroup: 'group_1',
    titleVi: 'Nhiễm khuẩn huyết từ ổ Hô hấp - Nhóm 1',
    titleEn: 'Adult Sepsis from Respiratory - Group 1',
    drugs: [
      {
        drugId: 'ceftriaxon',
        nameVi: 'Ceftriaxone ± Azithromycin',
        drugName: 'Ceftriaxone ± Azithromycin',
        nameEn: 'Ceftriaxone ± Azithromycin',
        standardDoseVi: '2g IV mỗi 24 giờ + Azithromycin 500mg IV/PO q24h',
        dosageVi: '2g IV mỗi 24 giờ + Azithromycin 500mg IV/PO q24h',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'levofloxacin',
        nameVi: 'Levofloxacin',
        drugName: 'Levofloxacin',
        nameEn: 'Levofloxacin',
        standardDoseVi: '750mg IV mỗi 24 giờ',
        dosageVi: '750mg IV mỗi 24 giờ',
        route: 'IV/PO',
        hasDosingCalculator: true
      }
    ],
    source: { doc: 'BVBND_HDSDKS', page: 13 }
  },
  {
    id: 'adult_sepsis_gi_group1',
    site: 'sepsis',
    sepsisSource: 'gastrointestinal',
    population: 'adult',
    riskGroup: 'group_1',
    titleVi: 'Nhiễm khuẩn huyết từ ổ Tiêu hóa - Nhóm 1',
    titleEn: 'Adult Sepsis from GI - Group 1',
    drugs: [
      {
        drugId: 'ceftriaxon',
        nameVi: 'Ceftriaxone',
        drugName: 'Ceftriaxone',
        nameEn: 'Ceftriaxone',
        standardDoseVi: '2g IV mỗi 24 giờ',
        dosageVi: '2g IV mỗi 24 giờ',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'metronidazol',
        nameVi: 'Metronidazole (phối hợp diệt kỵ khí)',
        drugName: 'Metronidazole (phối hợp diệt kỵ khí)',
        nameEn: 'Metronidazole',
        standardDoseVi: '500mg IV mỗi 8 giờ',
        dosageVi: '500mg IV mỗi 8 giờ',
        route: 'IV/PO',
        hasDosingCalculator: true
      },
      {
        drugId: 'amikacin',
        nameVi: 'Amikacin / Gentamicin (phối hợp)',
        drugName: 'Amikacin / Gentamicin (phối hợp)',
        nameEn: 'Amikacin / Gentamicin',
        standardDoseVi: 'Amikacin 15-20 mg/kg q24h',
        dosageVi: 'Amikacin 15-20 mg/kg q24h',
        route: 'IV',
        hasDosingCalculator: true
      }
    ],
    source: { doc: 'BVBND_HDSDKS', page: 13 }
  },
  {
    id: 'adult_sepsis_skin_group1',
    site: 'sepsis',
    sepsisSource: 'skin_soft_tissue',
    population: 'adult',
    riskGroup: 'group_1',
    titleVi: 'Nhiễm khuẩn huyết từ ổ Da & mô mềm - Nhóm 1',
    titleEn: 'Adult Sepsis from Skin/Soft Tissue - Group 1',
    drugs: [
      {
        drugId: 'cefazolin',
        nameVi: 'Cefazolin (hoặc Oxacillin 2g q4h)',
        drugName: 'Cefazolin (hoặc Oxacillin 2g q4h)',
        nameEn: 'Cefazolin',
        standardDoseVi: '2g IV mỗi 8 giờ',
        dosageVi: '2g IV mỗi 8 giờ',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'levofloxacin',
        nameVi: 'Levofloxacin / Moxifloxacin (phối hợp)',
        drugName: 'Levofloxacin / Moxifloxacin (phối hợp)',
        nameEn: 'Levofloxacin / Moxifloxacin',
        standardDoseVi: 'Levofloxacin 750mg q24h',
        dosageVi: 'Levofloxacin 750mg q24h',
        route: 'IV/PO',
        hasDosingCalculator: true
      },
      {
        drugId: 'clindamycin',
        nameVi: 'Clindamycin ± Metronidazole (khi nghi ngờ kỵ khí)',
        drugName: 'Clindamycin ± Metronidazole (khi nghi ngờ kỵ khí)',
        nameEn: 'Clindamycin ± Metronidazole',
        standardDoseVi: 'Clindamycin 600-900mg IV q8h',
        dosageVi: 'Clindamycin 600-900mg IV q8h',
        route: 'IV/PO',
        hasDosingCalculator: true
      }
    ],
    source: { doc: 'BVBND_HDSDKS', page: 13 }
  },
  {
    id: 'adult_sepsis_urinary_group1',
    site: 'sepsis',
    sepsisSource: 'urinary',
    population: 'adult',
    riskGroup: 'group_1',
    titleVi: 'Nhiễm khuẩn huyết từ ổ Tiết niệu - Nhóm 1',
    titleEn: 'Adult Sepsis from Urinary - Group 1',
    drugs: [
      {
        drugId: 'ceftriaxon',
        nameVi: 'Ceftriaxone',
        drugName: 'Ceftriaxone',
        nameEn: 'Ceftriaxone',
        standardDoseVi: '2g IV mỗi 24 giờ',
        dosageVi: '2g IV mỗi 24 giờ',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'amikacin',
        nameVi: 'Amikacin (phối hợp)',
        drugName: 'Amikacin (phối hợp)',
        nameEn: 'Amikacin',
        standardDoseVi: '15 - 20 mg/kg IV mỗi 24 giờ',
        dosageVi: '15 - 20 mg/kg IV mỗi 24 giờ',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'levofloxacin',
        nameVi: 'Levofloxacin',
        drugName: 'Levofloxacin',
        nameEn: 'Levofloxacin',
        standardDoseVi: '750mg IV mỗi 24 giờ',
        dosageVi: '750mg IV mỗi 24 giờ',
        route: 'IV/PO',
        hasDosingCalculator: true
      }
    ],
    source: { doc: 'BVBND_HDSDKS', page: 13 }
  },
  {
    id: 'adult_sepsis_group2_all_sources',
    site: 'sepsis',
    population: 'adult',
    riskGroup: 'group_2',
    titleVi: 'Nhiễm khuẩn huyết - Nhóm 2: Khung Phác Đồ Phổ Rộng (BVBND 2026)',
    titleEn: 'Adult Sepsis - Group 2 (High MDR Risk)',
    drugs: [
      {
        drugId: 'meropenem',
        nameVi: 'Meropenem liều cao (phủ ESBL / Trực khuẩn Gram -)',
        drugName: 'Meropenem liều cao (phủ ESBL / Trực khuẩn Gram -)',
        nameEn: 'Meropenem high-dose',
        standardDoseVi: '1g - 2g IV mỗi 8 giờ truyền kéo dài 3 - 4 giờ',
        dosageVi: '1g - 2g IV mỗi 8 giờ truyền kéo dài 3 - 4 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        infusionNoteVi: 'Truyền kéo dài 3 - 4 giờ'
      },
      {
        drugId: 'piperacillin_tazo',
        nameVi: 'Piperacillin/Tazobactam',
        drugName: 'Piperacillin/Tazobactam',
        nameEn: 'Piperacillin/Tazobactam',
        standardDoseVi: '4.5g IV mỗi 6 giờ truyền kéo dài',
        dosageVi: '4.5g IV mỗi 6 giờ truyền kéo dài',
        route: 'IV',
        hasDosingCalculator: true,
        infusionNoteVi: 'Truyền kéo dài 3 - 4 giờ'
      },
      {
        drugId: 'cefo_sulbactam_11',
        nameVi: 'Cefoperazone/Sulbactam liều cao',
        drugName: 'Cefoperazone/Sulbactam liều cao',
        nameEn: 'Cefoperazone/Sulbactam',
        standardDoseVi: '2g - 4g IV mỗi 8 - 12 giờ',
        dosageVi: '2g - 4g IV mỗi 8 - 12 giờ',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'vancomycin',
        nameVi: 'Vancomycin (khi có nguy cơ MRSA / Catheter)',
        drugName: 'Vancomycin (khi có nguy cơ MRSA / Catheter)',
        nameEn: 'Vancomycin (if MRSA risk)',
        standardDoseVi: 'Nạp 25 - 30 mg/kg, sau đó 15 - 20 mg/kg q8-12h',
        dosageVi: 'Nạp 25 - 30 mg/kg, sau đó 15 - 20 mg/kg q8-12h',
        route: 'IV',
        hasDosingCalculator: true,
        infusionNoteVi: 'Đo Cmin trước liều 4 (mục tiêu 15 - 20 mcg/mL)'
      },
      {
        drugId: 'teicoplanin',
        nameVi: 'Teicoplanin (thay thế Vancomycin)',
        drugName: 'Teicoplanin (thay thế Vancomycin)',
        nameEn: 'Teicoplanin',
        standardDoseVi: 'Nạp 6 mg/kg q12h x 3 liều, sau đó 6 mg/kg/ngày',
        dosageVi: 'Nạp 6 mg/kg q12h x 3 liều, sau đó 6 mg/kg/ngày',
        route: 'IV/IM',
        hasDosingCalculator: true
      },
      {
        drugId: 'amikacin',
        nameVi: 'Amikacin (phối hợp chống sốc / giảm BC hạt)',
        drugName: 'Amikacin (phối hợp chống sốc / giảm BC hạt)',
        nameEn: 'Amikacin (combo)',
        standardDoseVi: '15 - 20 mg/kg IV mỗi 24 giờ',
        dosageVi: '15 - 20 mg/kg IV mỗi 24 giờ',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'colistin',
        nameVi: 'Colistin (khi nghi ngờ Acineto/Pseudo siêu kháng)',
        drugName: 'Colistin (khi nghi ngờ Acineto/Pseudo siêu kháng)',
        nameEn: 'Colistin (CMS)',
        standardDoseVi: 'Nạp 300mg CBA, duy trì 150-180mg CBA q12h',
        dosageVi: 'Nạp 300mg CBA, duy trì 150-180mg CBA q12h',
        route: 'IV',
        hasDosingCalculator: true
      }
    ],
    combinationRulesVi: [
      'Nhiễm khuẩn huyết nặng / Sốc nhiễm khuẩn: KS bắt buộc truyền trong GIỜ ĐẦU TIÊN.',
      'Phối hợp phủ đồng thời vi khuẩn Gram (+) và Gram (-) nếu có nguy cơ cả hai (ví dụ Meropenem + Vancomycin).',
      'Nếu có nguy cơ Acinetobacter/Pseudomonas, ưu tiên Meropenem liều cao/Cefo-sulbactam + Amikacin ± Colistin.'
    ],
    source: { doc: 'BVBND_HDSDKS', page: 13 }
  },

  // ==========================================
  // 3. ADULT - SKIN & SOFT TISSUE (DA & MÔ MỀM) (P.9-10)
  // ==========================================
  {
    id: 'adult_ssti_group1',
    site: 'skin_soft_tissue',
    population: 'adult',
    riskGroup: 'group_1',
    titleVi: 'Nhiễm khuẩn Da và Mô mềm - Nhóm 1 (Ít nguy cơ VKĐK)',
    titleEn: 'Adult Skin/Soft Tissue - Group 1',
    drugs: [
      {
        drugId: 'cefazolin',
        nameVi: 'Cefazolin (Cephalosporin thế hệ 1)',
        drugName: 'Cefazolin (Cephalosporin thế hệ 1)',
        nameEn: 'Cefazolin',
        standardDoseVi: '1g - 2g IV mỗi 8 giờ',
        dosageVi: '1g - 2g IV mỗi 8 giờ',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'clindamycin',
        nameVi: 'Clindamycin',
        drugName: 'Clindamycin',
        nameEn: 'Clindamycin',
        standardDoseVi: '600mg IV mỗi 8 giờ hoặc 300-450mg PO q8h',
        dosageVi: '600mg IV mỗi 8 giờ hoặc 300-450mg PO q8h',
        route: 'IV/PO',
        hasDosingCalculator: true
      },
      {
        drugId: 'tmp_smx',
        nameVi: 'Co-trimoxazole (TMP-SMX)',
        drugName: 'Co-trimoxazole (TMP-SMX)',
        nameEn: 'Co-trimoxazole',
        standardDoseVi: '2 viên 480mg PO mỗi 12 giờ',
        dosageVi: '2 viên 480mg PO mỗi 12 giờ',
        route: 'IV/PO',
        hasDosingCalculator: true
      },
      {
        drugId: 'ceftriaxon',
        nameVi: 'Ceftriaxone',
        drugName: 'Ceftriaxone',
        nameEn: 'Ceftriaxone',
        standardDoseVi: '1g - 2g IV mỗi 24 giờ',
        dosageVi: '1g - 2g IV mỗi 24 giờ',
        route: 'IV',
        hasDosingCalculator: true
      }
    ],
    combinationRulesVi: [
      'Tùy tính chất sang thương và nguồn lây, có thể phối hợp thêm: (1) Metronidazol (nghi ngờ vi khuẩn kỵ khí), (2) Doxycyclin (nhiễm trùng tiếp xúc nước bẩn/Vibrio/rickettsia), (3) Levofloxacin (nghi ngờ vi khuẩn Gram âm).'
    ],
    source: { doc: 'BVBND_HDSDKS', page: 10 }
  },
  {
    id: 'adult_ssti_group2_base',
    site: 'skin_soft_tissue',
    population: 'adult',
    riskGroup: 'group_2',
    titleVi: 'Nhiễm khuẩn Da & Mô mềm - Nhóm 2: Viêm mô tế bào hoại tử / Nguy cơ cao VKĐK',
    titleEn: 'Adult SSTI - Group 2 Base Regimen',
    drugs: [
      {
        drugId: 'piperacillin_tazo',
        nameVi: 'Piperacillin/Tazobactam (lựa chọn ưu tiên)',
        drugName: 'Piperacillin/Tazobactam (lựa chọn ưu tiên)',
        nameEn: 'Piperacillin/Tazobactam',
        standardDoseVi: '4.5g IV mỗi 6 giờ truyền kéo dài',
        dosageVi: '4.5g IV mỗi 6 giờ truyền kéo dài',
        route: 'IV',
        hasDosingCalculator: true,
        infusionNoteVi: 'Truyền kéo dài 3 - 4 giờ'
      },
      {
        drugId: 'meropenem',
        nameVi: 'Meropenem (khi sốc / nhiễm trùng hoại tử nặng)',
        drugName: 'Meropenem (khi sốc / nhiễm trùng hoại tử nặng)',
        nameEn: 'Meropenem',
        standardDoseVi: '1g IV mỗi 8 giờ truyền 3 giờ',
        dosageVi: '1g IV mỗi 8 giờ truyền 3 giờ',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'vancomycin',
        nameVi: 'Vancomycin (phủ MRSA)',
        drugName: 'Vancomycin (phủ MRSA)',
        nameEn: 'Vancomycin',
        standardDoseVi: 'Nạp 25 - 30 mg/kg, sau đó 15 - 20 mg/kg q8-12h',
        dosageVi: 'Nạp 25 - 30 mg/kg, sau đó 15 - 20 mg/kg q8-12h',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'daptomycin',
        nameVi: 'Daptomycin (rất hiệu quả trong SSTI / vi khuẩn Gram +)',
        drugName: 'Daptomycin (rất hiệu quả trong SSTI / vi khuẩn Gram +)',
        nameEn: 'Daptomycin',
        standardDoseVi: '6 - 10 mg/kg IV mỗi 24 giờ',
        dosageVi: '6 - 10 mg/kg IV mỗi 24 giờ',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'metronidazol',
        nameVi: 'Metronidazole (phối hợp kỵ khí nếu không dùng Carbapenem/Pip-taz)',
        drugName: 'Metronidazole (phối hợp kỵ khí nếu không dùng Carbapenem/Pip-taz)',
        nameEn: 'Metronidazole',
        standardDoseVi: '500mg IV mỗi 8 giờ',
        dosageVi: '500mg IV mỗi 8 giờ',
        route: 'IV/PO',
        hasDosingCalculator: true
      }
    ],
    combinationRulesVi: [
      'Nhiễm khuẩn hoại tử da mô mềm (Necrotizing fasciitis): Phối hợp ngoại khoa rạch tháo mủ, cắt lọc sớm trong vòng 6 giờ đầu.',
      'Phác đồ nền: Beta-lactam phổ rộng chống trực khuẩn Gram (-) + Thuốc chống MRSA (Vancomycin hoặc Daptomycin) + Thuốc ức chế độc tố vi khuẩn (Clindamycin).'
    ],
    source: { doc: 'BVBND_HDSDKS', page: 10 }
  },
  {
    id: 'adult_ssti_group2_mrsa',
    site: 'skin_soft_tissue',
    population: 'adult',
    riskGroup: 'group_2',
    specificRisk: 'mrsa',
    titleVi: 'Nhiễm khuẩn Da và Mô mềm - Nhóm 2 + Nguy cơ MRSA',
    titleEn: 'Adult SSTI - Group 2 + MRSA Risk',
    drugs: [
      {
        drugId: 'vancomycin',
        nameVi: 'Vancomycin',
        drugName: 'Vancomycin',
        nameEn: 'Vancomycin',
        standardDoseVi: 'Nạp 25 - 30 mg/kg, sau đó 15 - 20 mg/kg q8-12h',
        dosageVi: 'Nạp 25 - 30 mg/kg, sau đó 15 - 20 mg/kg q8-12h',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'daptomycin',
        nameVi: 'Daptomycin (rất hiệu quả trong SSTI)',
        drugName: 'Daptomycin (rất hiệu quả trong SSTI)',
        nameEn: 'Daptomycin',
        standardDoseVi: '6 - 8 mg/kg IV mỗi 24 giờ (có thể đến 10 mg/kg nếu nặng)',
        dosageVi: '6 - 8 mg/kg IV mỗi 24 giờ (có thể đến 10 mg/kg nếu nặng)',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'teicoplanin',
        nameVi: 'Teicoplanin',
        drugName: 'Teicoplanin',
        nameEn: 'Teicoplanin',
        standardDoseVi: '6 mg/kg q12h x 3 liều, sau đó 6 mg/kg/ngày',
        dosageVi: '6 mg/kg q12h x 3 liều, sau đó 6 mg/kg/ngày',
        route: 'IV/IM',
        hasDosingCalculator: true
      },
      {
        drugId: 'linezolid',
        nameVi: 'Linezolid',
        drugName: 'Linezolid',
        nameEn: 'Linezolid',
        standardDoseVi: '600mg IV/PO mỗi 12 giờ',
        dosageVi: '600mg IV/PO mỗi 12 giờ',
        route: 'IV/PO',
        hasDosingCalculator: true
      },
      {
        drugId: 'tmp_smx',
        nameVi: 'Co-trimoxazole (TMP-SMX uống khi nhẹ/xuống thang)',
        drugName: 'Co-trimoxazole (TMP-SMX uống khi nhẹ/xuống thang)',
        nameEn: 'Co-trimoxazole',
        standardDoseVi: '2 - 3 viên 480mg PO mỗi 12 giờ',
        dosageVi: '2 - 3 viên 480mg PO mỗi 12 giờ',
        route: 'IV/PO',
        hasDosingCalculator: true
      }
    ],
    source: { doc: 'BVBND_HDSDKS', page: 10 }
  },
  {
    id: 'adult_ssti_group2_pseudo',
    site: 'skin_soft_tissue',
    population: 'adult',
    riskGroup: 'group_2',
    specificRisk: 'pseudo_acineto',
    titleVi: 'Nhiễm khuẩn Da và Mô mềm - Nhóm 2 + Nguy cơ Pseudomonas aeruginosa',
    titleEn: 'Adult SSTI - Group 2 + Pseudomonas Risk',
    drugs: [
      {
        drugId: 'piperacillin_tazo',
        nameVi: 'Piperacillin/Tazobactam',
        drugName: 'Piperacillin/Tazobactam',
        nameEn: 'Piperacillin/Tazobactam',
        standardDoseVi: '4.5g IV mỗi 6 giờ truyền kéo dài',
        dosageVi: '4.5g IV mỗi 6 giờ truyền kéo dài',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'ceftazidim',
        nameVi: 'Ceftazidime',
        drugName: 'Ceftazidime',
        nameEn: 'Ceftazidime',
        standardDoseVi: '2g IV mỗi 8 giờ truyền kéo dài',
        dosageVi: '2g IV mỗi 8 giờ truyền kéo dài',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'ciprofloxacin',
        nameVi: 'Ciprofloxacin',
        drugName: 'Ciprofloxacin',
        nameEn: 'Ciprofloxacin',
        standardDoseVi: '400mg IV q8-12h hoặc 750mg PO q12h',
        dosageVi: '400mg IV q8-12h hoặc 750mg PO q12h',
        route: 'IV/PO',
        hasDosingCalculator: true
      },
      {
        drugId: 'levofloxacin',
        nameVi: 'Levofloxacin',
        drugName: 'Levofloxacin',
        nameEn: 'Levofloxacin',
        standardDoseVi: '750mg IV/PO mỗi 24 giờ',
        dosageVi: '750mg IV/PO mỗi 24 giờ',
        route: 'IV/PO',
        hasDosingCalculator: true
      },
      {
        drugId: 'tobramycin',
        nameVi: 'Tobramycin / Amikacin (phối hợp)',
        drugName: 'Tobramycin / Amikacin (phối hợp)',
        nameEn: 'Tobramycin / Amikacin',
        standardDoseVi: 'Tobramycin 5-7 mg/kg q24h; Amikacin 15-20 mg/kg q24h',
        dosageVi: 'Tobramycin 5-7 mg/kg q24h; Amikacin 15-20 mg/kg q24h',
        route: 'IV',
        hasDosingCalculator: true
      }
    ],
    source: { doc: 'BVBND_HDSDKS', page: 10 }
  },

  // ==========================================
  // 4. ADULT - URINARY TRACT / TIẾT NIỆU (P.10-11)
  // ==========================================
  {
    id: 'adult_uti_group1',
    site: 'urinary',
    population: 'adult',
    riskGroup: 'group_1',
    titleVi: 'Nhiễm khuẩn Tiết niệu - Nhóm 1 (Ít nguy cơ VKĐK)',
    titleEn: 'Adult UTI - Group 1 (Low MDR Risk)',
    drugs: [
      {
        drugId: 'fosfomycin',
        nameVi: 'Fosfomycin uống (chỉ cho viêm bàng quang cấp E. coli)',
        drugName: 'Fosfomycin uống (chỉ cho viêm bàng quang cấp E. coli)',
        nameEn: 'Fosfomycin PO',
        standardDoseVi: 'Gói 3g pha nước uống 1 liều duy nhất',
        dosageVi: 'Gói 3g pha nước uống 1 liều duy nhất',
        route: 'PO',
        hasDosingCalculator: true
      },
      {
        drugId: 'amox_clav',
        nameVi: 'Amoxicillin/Clavulanate',
        drugName: 'Amoxicillin/Clavulanate',
        nameEn: 'Amoxicillin/Clavulanate',
        standardDoseVi: '1g IV q8h hoặc 875/125mg PO q12h',
        dosageVi: '1g IV q8h hoặc 875/125mg PO q12h',
        route: 'IV/PO',
        hasDosingCalculator: true
      },
      {
        drugId: 'ceftriaxon',
        nameVi: 'Ceftriaxone (viêm đài bể thận / có sốt)',
        drugName: 'Ceftriaxone (viêm đài bể thận / có sốt)',
        nameEn: 'Ceftriaxone',
        standardDoseVi: '1g - 2g IV mỗi 24 giờ',
        dosageVi: '1g - 2g IV mỗi 24 giờ',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'amikacin',
        nameVi: 'Amikacin (viêm đài bể thận cấp có nhiễm độc)',
        drugName: 'Amikacin (viêm đài bể thận cấp có nhiễm độc)',
        nameEn: 'Amikacin',
        standardDoseVi: '15 mg/kg IV mỗi 24 giờ',
        dosageVi: '15 mg/kg IV mỗi 24 giờ',
        route: 'IV',
        hasDosingCalculator: true
      }
    ],
    cautionVi: [
      'Không dùng Fosfomycin uống hoặc Nitrofurantoin cho Viêm đài bể thận hoặc Nhiễm khuẩn huyết do không đạt nồng độ trong nhu mô thận và máu!'
    ],
    source: { doc: 'BVBND_HDSDKS', page: 11 }
  },
  {
    id: 'adult_uti_group2_base',
    site: 'urinary',
    population: 'adult',
    riskGroup: 'group_2',
    titleVi: 'Nhiễm khuẩn Tiết niệu - Nhóm 2: Khung Phác Đồ Nguy Cơ Cao VKĐK (BVBND 2026)',
    titleEn: 'Adult UTI - Group 2 Base Regimen',
    drugs: [
      {
        drugId: 'ertapenem',
        nameVi: 'Ertapenem (lựa chọn hàng đầu cho ESBL tiết niệu)',
        drugName: 'Ertapenem (lựa chọn hàng đầu cho ESBL tiết niệu)',
        nameEn: 'Ertapenem',
        standardDoseVi: '1g IV mỗi 24 giờ',
        dosageVi: '1g IV mỗi 24 giờ',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'meropenem',
        nameVi: 'Meropenem (khi có sốc nhiễm trùng hoặc suy thận nặng)',
        drugName: 'Meropenem (khi có sốc nhiễm trùng hoặc suy thận nặng)',
        nameEn: 'Meropenem',
        standardDoseVi: '1g IV mỗi 8 giờ truyền kéo dài 3 giờ',
        dosageVi: '1g IV mỗi 8 giờ truyền kéo dài 3 giờ',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'piperacillin_tazo',
        nameVi: 'Piperacillin/Tazobactam',
        drugName: 'Piperacillin/Tazobactam',
        nameEn: 'Piperacillin/Tazobactam',
        standardDoseVi: '4.5g IV mỗi 6 giờ',
        dosageVi: '4.5g IV mỗi 6 giờ',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'amikacin',
        nameVi: 'Amikacin (đạt nồng độ nước tiểu rất cao)',
        drugName: 'Amikacin (đạt nồng độ nước tiểu rất cao)',
        nameEn: 'Amikacin',
        standardDoseVi: '15 - 20 mg/kg IV mỗi 24 giờ',
        dosageVi: '15 - 20 mg/kg IV mỗi 24 giờ',
        route: 'IV',
        hasDosingCalculator: true
      }
    ],
    combinationRulesVi: [
      'Nhiễm khuẩn tiết niệu có nguy cơ VKĐK cao tại BV Bệnh Nhiệt Đới tỷ lệ E. coli / K. pneumoniae sinh ESBL > 60%. Ertapenem 1g q24h là thuốc ưu tiên.',
      'Nếu nghi ngờ Enterococcus: Phối hợp thêm Ampicillin hoặc Vancomycin.'
    ],
    source: { doc: 'BVBND_HDSDKS', page: 11 }
  },
  {
    id: 'adult_uti_group2_esbl',
    site: 'urinary',
    population: 'adult',
    riskGroup: 'group_2',
    specificRisk: 'esbl',
    titleVi: 'Nhiễm khuẩn Tiết niệu - Nhóm 2 + Nguy cơ ESBL',
    titleEn: 'Adult UTI - Group 2 + ESBL Risk',
    drugs: [
      {
        drugId: 'ertapenem',
        nameVi: 'Ertapenem (lựa chọn ưu tiên)',
        drugName: 'Ertapenem (lựa chọn ưu tiên)',
        nameEn: 'Ertapenem',
        standardDoseVi: '1g IV mỗi 24 giờ',
        dosageVi: '1g IV mỗi 24 giờ',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'meropenem',
        nameVi: 'Meropenem (khi bệnh nặng / sốc)',
        drugName: 'Meropenem (khi bệnh nặng / sốc)',
        nameEn: 'Meropenem',
        standardDoseVi: '1g IV mỗi 8 giờ truyền kéo dài 3 giờ',
        dosageVi: '1g IV mỗi 8 giờ truyền kéo dài 3 giờ',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'amikacin',
        nameVi: 'Amikacin',
        drugName: 'Amikacin',
        nameEn: 'Amikacin',
        standardDoseVi: '15 - 20 mg/kg IV mỗi 24 giờ',
        dosageVi: '15 - 20 mg/kg IV mỗi 24 giờ',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'fosfomycin',
        nameVi: 'Fosfomycin IV (nếu có)',
        drugName: 'Fosfomycin IV (nếu có)',
        nameEn: 'Fosfomycin IV',
        standardDoseVi: '4g - 8g IV mỗi 8 giờ truyền kéo dài',
        dosageVi: '4g - 8g IV mỗi 8 giờ truyền kéo dài',
        route: 'IV',
        hasDosingCalculator: true
      }
    ],
    source: { doc: 'BVBND_HDSDKS', page: 11 }
  },
  {
    id: 'adult_uti_group2_enterococcus',
    site: 'urinary',
    population: 'adult',
    riskGroup: 'group_2',
    specificRisk: 'enterococcus',
    titleVi: 'Nhiễm khuẩn Tiết niệu - Nhóm 2 + Nguy cơ Enterococcus',
    titleEn: 'Adult UTI - Group 2 + Enterococcus Risk',
    drugs: [
      {
        drugId: 'amox_clav',
        nameVi: 'Amoxicillin/Clavulanate / Ampicillin',
        drugName: 'Amoxicillin/Clavulanate / Ampicillin',
        nameEn: 'Amox/Clav or Ampicillin',
        standardDoseVi: 'Ampicillin 2g IV q4-6h nếu còn nhạy',
        dosageVi: 'Ampicillin 2g IV q4-6h nếu còn nhạy',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'vancomycin',
        nameVi: 'Vancomycin (khi kháng Ampicillin)',
        drugName: 'Vancomycin (khi kháng Ampicillin)',
        nameEn: 'Vancomycin',
        standardDoseVi: '15 - 20 mg/kg IV q8-12h',
        dosageVi: '15 - 20 mg/kg IV q8-12h',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'teicoplanin',
        nameVi: 'Teicoplanin',
        drugName: 'Teicoplanin',
        nameEn: 'Teicoplanin',
        standardDoseVi: '6 mg/kg q12h x 3 liều, sau đó 6 mg/kg/ngày',
        dosageVi: '6 mg/kg q12h x 3 liều, sau đó 6 mg/kg/ngày',
        route: 'IV/IM',
        hasDosingCalculator: true
      },
      {
        drugId: 'linezolid',
        nameVi: 'Linezolid (khi nghi ngờ VRE - đề kháng Vancomycin)',
        drugName: 'Linezolid (khi nghi ngờ VRE - đề kháng Vancomycin)',
        nameEn: 'Linezolid (if VRE)',
        standardDoseVi: '600mg IV/PO mỗi 12 giờ',
        dosageVi: '600mg IV/PO mỗi 12 giờ',
        route: 'IV/PO',
        hasDosingCalculator: true
      }
    ],
    source: { doc: 'BVBND_HDSDKS', page: 11 }
  },

  // ==========================================
  // 5. ADULT - ASCITIC FLUID / PERITONEAL / DỊCH BÁNG (P.11-12)
  // ==========================================
  {
    id: 'adult_peritoneal_group1',
    site: 'peritoneal',
    population: 'adult',
    riskGroup: 'group_1',
    titleVi: 'Nhiễm khuẩn Dịch báng (SBP) - Nhóm 1',
    titleEn: 'Adult SBP / Ascitic Infection - Group 1',
    drugs: [
      {
        drugId: 'ceftriaxon',
        nameVi: 'Ceftriaxone (lựa chọn hàng đầu)',
        drugName: 'Ceftriaxone (lựa chọn hàng đầu)',
        nameEn: 'Ceftriaxone',
        standardDoseVi: '2g IV mỗi 24 giờ',
        dosageVi: '2g IV mỗi 24 giờ',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'cefotaxim',
        nameVi: 'Cefotaxime',
        drugName: 'Cefotaxime',
        nameEn: 'Cefotaxime',
        standardDoseVi: '2g IV mỗi 8 giờ',
        dosageVi: '2g IV mỗi 8 giờ',
        route: 'IV',
        hasDosingCalculator: true
      }
    ],
    source: { doc: 'BVBND_HDSDKS', page: 12 }
  },
  {
    id: 'adult_peritoneal_group2',
    site: 'peritoneal',
    population: 'adult',
    riskGroup: 'group_2',
    titleVi: 'Nhiễm khuẩn Dịch báng (SBP) - Nhóm 2 (Nguy cơ VKĐK / Đã dùng KS phòng ngừa)',
    titleEn: 'Adult SBP - Group 2 (High MDR Risk)',
    drugs: [
      {
        drugId: 'ertapenem',
        nameVi: 'Ertapenem (lựa chọn ưu tiên)',
        drugName: 'Ertapenem (lựa chọn ưu tiên)',
        nameEn: 'Ertapenem',
        standardDoseVi: '1g IV mỗi 24 giờ',
        dosageVi: '1g IV mỗi 24 giờ',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'piperacillin_tazo',
        nameVi: 'Piperacillin/Tazobactam',
        drugName: 'Piperacillin/Tazobactam',
        nameEn: 'Piperacillin/Tazobactam',
        standardDoseVi: '4.5g IV mỗi 6 giờ',
        dosageVi: '4.5g IV mỗi 6 giờ',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'meropenem',
        nameVi: 'Meropenem (khi suy gan cấp trên mạn CLIF-SOFA ≥ 12 hoặc sốc)',
        drugName: 'Meropenem (khi suy gan cấp trên mạn CLIF-SOFA ≥ 12 hoặc sốc)',
        nameEn: 'Meropenem',
        standardDoseVi: '1g IV mỗi 8 giờ truyền kéo dài 3 giờ',
        dosageVi: '1g IV mỗi 8 giờ truyền kéo dài 3 giờ',
        route: 'IV',
        hasDosingCalculator: true
      }
    ],
    source: { doc: 'BVBND_HDSDKS', page: 12 }
  },

  // ==========================================
  // 6. ADULT - CNS (VIÊM MÀNG NÃO MỦ / THẦN KINH TRUNG ƯƠNG)
  // ==========================================
  {
    id: 'adult_cns_group1',
    site: 'cns',
    population: 'adult',
    riskGroup: 'group_1',
    titleVi: 'Viêm màng não mủ Người lớn - Nhóm 1 (Cộng đồng)',
    titleEn: 'Adult Meningitis - Group 1 (Community-acquired)',
    drugs: [
      {
        drugId: 'ceftriaxon',
        nameVi: 'Ceftriaxone (liều thấm thần kinh)',
        drugName: 'Ceftriaxone (liều thấm thần kinh)',
        nameEn: 'Ceftriaxone meningitis dose',
        standardDoseVi: '2g IV mỗi 12 giờ',
        dosageVi: '2g IV mỗi 12 giờ',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'cefotaxim',
        nameVi: 'Cefotaxime (thay thế Ceftriaxone)',
        drugName: 'Cefotaxime (thay thế Ceftriaxone)',
        nameEn: 'Cefotaxime',
        standardDoseVi: '2g IV mỗi 4 - 6 giờ (8 - 12g/ngày)',
        dosageVi: '2g IV mỗi 4 - 6 giờ (8 - 12g/ngày)',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'vancomycin',
        nameVi: 'Vancomycin (phối hợp phủ phế cầu kháng penicillin/cephalosporin)',
        drugName: 'Vancomycin (phối hợp phủ phế cầu kháng penicillin/cephalosporin)',
        nameEn: 'Vancomycin',
        standardDoseVi: '15 - 20 mg/kg IV mỗi 8 - 12 giờ (đích đáy 15 - 20 mcg/mL)',
        dosageVi: '15 - 20 mg/kg IV mỗi 8 - 12 giờ (đích đáy 15 - 20 mcg/mL)',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'ampicillin_sulbactam',
        nameVi: 'Ampicillin (phối hợp nếu ≥ 50 tuổi hoặc suy giảm MD phòng Listeria)',
        drugName: 'Ampicillin (phối hợp nếu ≥ 50 tuổi hoặc suy giảm MD phòng Listeria)',
        nameEn: 'Ampicillin for Listeria',
        standardDoseVi: '2g IV mỗi 4 giờ',
        dosageVi: '2g IV mỗi 4 giờ',
        route: 'IV',
        hasDosingCalculator: true
      }
    ],
    combinationRulesVi: [
      'Bắt buộc phối hợp Ceftriaxone 2g q12h + Vancomycin để bao phủ phế cầu kháng thuốc.',
      'Nếu bệnh nhân ≥ 50 tuổi hoặc suy giảm miễn dịch: Bắt buộc thêm Ampicillin 2g q4h để phòng ngừa Listeria monocytogenes.',
      'Sử dụng Dexamethasone 10mg IV trước hoặc cùng lúc với liều kháng sinh đầu tiên x 4 ngày (giảm di chứng thính lực trong VMN do Phế cầu).'
    ],
    source: { doc: 'BVBND_HDSDKS', page: 7 }
  },
  {
    id: 'adult_cns_group2',
    site: 'cns',
    population: 'adult',
    riskGroup: 'group_2',
    titleVi: 'Viêm màng não - Nhóm 2 (Sau phẫu thuật thần kinh, chấn thương sọ não, Shunt DNT)',
    titleEn: 'Adult Healthcare-associated Meningitis - Group 2',
    drugs: [
      {
        drugId: 'meropenem',
        nameVi: 'Meropenem liều cao (thấm DNT tốt)',
        drugName: 'Meropenem liều cao (thấm DNT tốt)',
        nameEn: 'Meropenem meningitis dose',
        standardDoseVi: '2g IV mỗi 8 giờ truyền kéo dài 3 giờ',
        dosageVi: '2g IV mỗi 8 giờ truyền kéo dài 3 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        infusionNoteVi: 'Liều màng não 2g q8h truyền kéo dài 3 giờ'
      },
      {
        drugId: 'vancomycin',
        nameVi: 'Vancomycin (phủ MRSA & CoNS)',
        drugName: 'Vancomycin (phủ MRSA & CoNS)',
        nameEn: 'Vancomycin',
        standardDoseVi: '15 - 20 mg/kg IV mỗi 8 - 12 giờ (đích đáy 15 - 20 mcg/mL)',
        dosageVi: '15 - 20 mg/kg IV mỗi 8 - 12 giờ (đích đáy 15 - 20 mcg/mL)',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'colistin',
        nameVi: 'Colistin (khi nghi Acinetobacter CRAB hoặc P. aeruginosa siêu kháng)',
        drugName: 'Colistin (khi nghi Acinetobacter CRAB hoặc P. aeruginosa siêu kháng)',
        nameEn: 'Colistin IV ± Intrathecal',
        standardDoseVi: 'Nạp 300mg CBA IV, duy trì 150-180mg q12h ± tiêm nội tủy/não thất',
        dosageVi: 'Nạp 300mg CBA IV, duy trì 150-180mg q12h ± tiêm nội tủy/não thất',
        route: 'IV',
        hasDosingCalculator: true
      }
    ],
    combinationRulesVi: [
      'Ưu tiên Meropenem 2g q8h + Vancomycin (đích đáy 15-20 mcg/mL).',
      'Nếu Acinetobacter CRAB kháng toàn bộ: Xem xét phối hợp Colistin truyền tĩnh mạch kết hợp tiêm não thất/nội tủy (Intraventricular/Intrathecal) theo hội chẩn BVBND.'
    ],
    source: { doc: 'BVBND_HDSDKS', page: 7 }
  },

  // ==========================================
  // 7. PEDIATRIC - TRẺ EM (P.4-8)
  // ==========================================
  {
    id: 'peds_resp_group1',
    site: 'respiratory',
    population: 'pediatric',
    riskGroup: 'group_1',
    titleVi: 'Viêm phổi Trẻ em - Nhóm 1 (Ít nguy cơ VKĐK)',
    titleEn: 'Pediatric Pneumonia - Group 1',
    drugs: [
      {
        drugId: 'ceftriaxon',
        nameVi: 'Ceftriaxone',
        drugName: 'Ceftriaxone',
        nameEn: 'Ceftriaxone',
        standardDoseVi: '50 - 100 mg/kg/ngày IV chia 1 - 2 lần (tối đa 2g/ngày)',
        dosageVi: '50 - 100 mg/kg/ngày IV chia 1 - 2 lần (tối đa 2g/ngày)',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'cefotaxim',
        nameVi: 'Cefotaxime',
        drugName: 'Cefotaxime',
        nameEn: 'Cefotaxime',
        standardDoseVi: '100 - 150 mg/kg/ngày IV chia 3 - 4 lần',
        dosageVi: '100 - 150 mg/kg/ngày IV chia 3 - 4 lần',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'amox_clav',
        nameVi: 'Amoxicillin/Clavulanate',
        drugName: 'Amoxicillin/Clavulanate',
        nameEn: 'Amoxicillin/Clavulanate',
        standardDoseVi: '80 - 90 mg/kg/ngày (tính theo amox) PO chia 2 lần',
        dosageVi: '80 - 90 mg/kg/ngày (tính theo amox) PO chia 2 lần',
        route: 'PO/IV',
        hasDosingCalculator: true
      }
    ],
    source: { doc: 'BVBND_HDSDKS', page: 4 }
  },
  {
    id: 'peds_resp_group2',
    site: 'respiratory',
    population: 'pediatric',
    riskGroup: 'group_2',
    titleVi: 'Viêm phổi Trẻ em - Nhóm 2 (Viêm phổi thở máy / Nguy cơ cao VKĐK)',
    titleEn: 'Pediatric Pneumonia - Group 2 (VAP / High MDR Risk)',
    drugs: [
      {
        drugId: 'meropenem',
        nameVi: 'Meropenem',
        drugName: 'Meropenem',
        nameEn: 'Meropenem',
        standardDoseVi: '60 - 120 mg/kg/ngày IV chia 3 lần (20-40 mg/kg q8h, tối đa 2g q8h)',
        dosageVi: '60 - 120 mg/kg/ngày IV chia 3 lần (20-40 mg/kg q8h, tối đa 2g q8h)',
        route: 'IV',
        hasDosingCalculator: true,
        infusionNoteVi: 'Truyền kéo dài 3 - 4 giờ'
      },
      {
        drugId: 'piperacillin_tazo',
        nameVi: 'Piperacillin/Tazobactam',
        drugName: 'Piperacillin/Tazobactam',
        nameEn: 'Piperacillin/Tazobactam',
        standardDoseVi: '300 mg/kg/ngày IV chia 3 - 4 lần (100 mg/kg q8h, tối đa 4.5g q6h)',
        dosageVi: '300 mg/kg/ngày IV chia 3 - 4 lần (100 mg/kg q8h, tối đa 4.5g q6h)',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'cefo_sulbactam_11',
        nameVi: 'Cefoperazone/Sulbactam',
        drugName: 'Cefoperazone/Sulbactam',
        nameEn: 'Cefoperazone/Sulbactam',
        standardDoseVi: '100 - 160 mg/kg/ngày IV chia 2 - 3 lần',
        dosageVi: '100 - 160 mg/kg/ngày IV chia 2 - 3 lần',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'vancomycin',
        nameVi: 'Vancomycin (khi có nguy cơ MRSA)',
        drugName: 'Vancomycin (khi có nguy cơ MRSA)',
        nameEn: 'Vancomycin',
        standardDoseVi: '60 mg/kg/ngày IV chia 4 lần (15 mg/kg q6h, TDM đáy 15-20 mcg/mL)',
        dosageVi: '60 mg/kg/ngày IV chia 4 lần (15 mg/kg q6h, TDM đáy 15-20 mcg/mL)',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'amikacin',
        nameVi: 'Amikacin (phối hợp chống trực khuẩn Gram -)',
        drugName: 'Amikacin (phối hợp chống trực khuẩn Gram -)',
        nameEn: 'Amikacin',
        standardDoseVi: '15 - 20 mg/kg/ngày IV chia 1 lần',
        dosageVi: '15 - 20 mg/kg/ngày IV chia 1 lần',
        route: 'IV',
        hasDosingCalculator: true
      }
    ],
    combinationRulesVi: [
      'Viêm phổi thở máy ở trẻ em: Ưu tiên Meropenem hoặc Pip/taz + Vancomycin nếu có nguy cơ MRSA.',
      'Phối hợp thêm Amikacin 15-20 mg/kg q24h nếu có suy hô hấp nặng hoặc sốc nhiễm trùng.'
    ],
    source: { doc: 'BVBND_HDSDKS', page: 4 }
  },
  {
    id: 'peds_sepsis_group1',
    site: 'sepsis',
    population: 'pediatric',
    riskGroup: 'group_1',
    titleVi: 'Nhiễm khuẩn huyết Trẻ em - Nhóm 1',
    titleEn: 'Pediatric Sepsis - Group 1',
    drugs: [
      {
        drugId: 'ceftriaxon',
        nameVi: 'Ceftriaxone',
        drugName: 'Ceftriaxone',
        nameEn: 'Ceftriaxone',
        standardDoseVi: '100 mg/kg/ngày IV 1 lần (tối đa 2g)',
        dosageVi: '100 mg/kg/ngày IV 1 lần (tối đa 2g)',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'amikacin',
        nameVi: 'Amikacin / Gentamicin (phối hợp)',
        drugName: 'Amikacin / Gentamicin (phối hợp)',
        nameEn: 'Amikacin / Gentamicin',
        standardDoseVi: 'Amikacin 15-20 mg/kg/ngày IV; Gentamicin 5-7.5 mg/kg/ngày',
        dosageVi: 'Amikacin 15-20 mg/kg/ngày IV; Gentamicin 5-7.5 mg/kg/ngày',
        route: 'IV',
        hasDosingCalculator: true
      }
    ],
    combinationRulesVi: [
      'Trẻ ≤ 3 tháng: phối hợp thêm Ampicillin (150-200 mg/kg/ngày) để phòng Listeria monocytogenes.',
      'Nghi ngờ viêm màng não mủ hoặc phế cầu/tụ cầu: phối hợp thêm Vancomycin (60 mg/kg/ngày chia 4 lần).',
      'Chưa loại trừ vi khuẩn kỵ khí hoặc sốc độc tố do Streptococcus: phối hợp Clindamycin (30-40 mg/kg/ngày chia 3-4 lần).'
    ],
    source: { doc: 'BVBND_HDSDKS', page: 6 }
  },
  {
    id: 'peds_sepsis_group2',
    site: 'sepsis',
    population: 'pediatric',
    riskGroup: 'group_2',
    titleVi: 'Nhiễm khuẩn huyết Trẻ em - Nhóm 2 (Nguy cơ cao VKĐK)',
    titleEn: 'Pediatric Sepsis - Group 2 (High MDR Risk)',
    drugs: [
      {
        drugId: 'meropenem',
        nameVi: 'Meropenem',
        drugName: 'Meropenem',
        nameEn: 'Meropenem',
        standardDoseVi: '60 - 120 mg/kg/ngày IV chia 3 lần (20-40 mg/kg q8h, tối đa 2g q8h)',
        dosageVi: '60 - 120 mg/kg/ngày IV chia 3 lần (20-40 mg/kg q8h, tối đa 2g q8h)',
        route: 'IV',
        hasDosingCalculator: true,
        infusionNoteVi: 'Truyền kéo dài 3 - 4 giờ'
      },
      {
        drugId: 'piperacillin_tazo',
        nameVi: 'Piperacillin/Tazobactam',
        drugName: 'Piperacillin/Tazobactam',
        nameEn: 'Piperacillin/Tazobactam',
        standardDoseVi: '300 mg/kg/ngày IV chia 3 - 4 lần (100 mg/kg q8h)',
        dosageVi: '300 mg/kg/ngày IV chia 3 - 4 lần (100 mg/kg q8h)',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'vancomycin',
        nameVi: 'Vancomycin (khi có nguy cơ MRSA / phế cầu kháng)',
        drugName: 'Vancomycin (khi có nguy cơ MRSA / phế cầu kháng)',
        nameEn: 'Vancomycin',
        standardDoseVi: '60 mg/kg/ngày chia 4 lần (15 mg/kg q6h)',
        dosageVi: '60 mg/kg/ngày chia 4 lần (15 mg/kg q6h)',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'amikacin',
        nameVi: 'Amikacin (phối hợp)',
        drugName: 'Amikacin (phối hợp)',
        nameEn: 'Amikacin',
        standardDoseVi: '15 - 20 mg/kg/ngày IV chia 1 lần',
        dosageVi: '15 - 20 mg/kg/ngày IV chia 1 lần',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'colistin',
        nameVi: 'Colistin (khi nghi ngờ vi khuẩn siêu kháng)',
        drugName: 'Colistin (khi nghi ngờ vi khuẩn siêu kháng)',
        nameEn: 'Colistin',
        standardDoseVi: '75.000 - 150.000 UI/kg/ngày chia 3 lần',
        dosageVi: '75.000 - 150.000 UI/kg/ngày chia 3 lần',
        route: 'IV',
        hasDosingCalculator: true
      }
    ],
    source: { doc: 'BVBND_HDSDKS', page: 6 }
  },
  {
    id: 'peds_uti_group1',
    site: 'urinary',
    population: 'pediatric',
    riskGroup: 'group_1',
    titleVi: 'Nhiễm khuẩn Tiết niệu Trẻ em - Nhóm 1',
    titleEn: 'Pediatric UTI - Group 1',
    drugs: [
      {
        drugId: 'ceftriaxon',
        nameVi: 'Ceftriaxone',
        drugName: 'Ceftriaxone',
        nameEn: 'Ceftriaxone',
        standardDoseVi: '50 - 75 mg/kg/ngày IV 1 lần (tối đa 2g)',
        dosageVi: '50 - 75 mg/kg/ngày IV 1 lần (tối đa 2g)',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'cefotaxim',
        nameVi: 'Cefotaxime',
        drugName: 'Cefotaxime',
        nameEn: 'Cefotaxime',
        standardDoseVi: '100 - 150 mg/kg/ngày chia 3 lần',
        dosageVi: '100 - 150 mg/kg/ngày chia 3 lần',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'amikacin',
        nameVi: 'Amikacin (viêm đài bể thận có sốt)',
        drugName: 'Amikacin (viêm đài bể thận có sốt)',
        nameEn: 'Amikacin',
        standardDoseVi: '15 mg/kg/ngày IV 1 lần',
        dosageVi: '15 mg/kg/ngày IV 1 lần',
        route: 'IV',
        hasDosingCalculator: true
      }
    ],
    source: { doc: 'BVBND_HDSDKS', page: 7 }
  },
  {
    id: 'peds_uti_group2',
    site: 'urinary',
    population: 'pediatric',
    riskGroup: 'group_2',
    titleVi: 'Nhiễm khuẩn Tiết niệu Trẻ em - Nhóm 2 (Nguy cơ cao VKĐK / ESBL)',
    titleEn: 'Pediatric UTI - Group 2 (High MDR Risk)',
    drugs: [
      {
        drugId: 'ertapenem',
        nameVi: 'Ertapenem (trẻ ≥ 3 tháng)',
        drugName: 'Ertapenem (trẻ ≥ 3 tháng)',
        nameEn: 'Ertapenem',
        standardDoseVi: '15 mg/kg q12h (tối đa 1g/ngày; trẻ > 12 tuổi: 1g q24h)',
        dosageVi: '15 mg/kg q12h (tối đa 1g/ngày; trẻ > 12 tuổi: 1g q24h)',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'meropenem',
        nameVi: 'Meropenem (khi bệnh nặng)',
        drugName: 'Meropenem (khi bệnh nặng)',
        nameEn: 'Meropenem',
        standardDoseVi: '60 mg/kg/ngày chia 3 lần (20 mg/kg q8h)',
        dosageVi: '60 mg/kg/ngày chia 3 lần (20 mg/kg q8h)',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'amikacin',
        nameVi: 'Amikacin',
        drugName: 'Amikacin',
        nameEn: 'Amikacin',
        standardDoseVi: '15 - 20 mg/kg/ngày IV 1 lần',
        dosageVi: '15 - 20 mg/kg/ngày IV 1 lần',
        route: 'IV',
        hasDosingCalculator: true
      }
    ],
    source: { doc: 'BVBND_HDSDKS', page: 7 }
  },
  {
    id: 'peds_ssti_group1',
    site: 'skin_soft_tissue',
    population: 'pediatric',
    riskGroup: 'group_1',
    titleVi: 'Nhiễm khuẩn Da & Mô mềm Trẻ em - Nhóm 1',
    titleEn: 'Pediatric SSTI - Group 1',
    drugs: [
      {
        drugId: 'cefazolin',
        nameVi: 'Cefazolin',
        drugName: 'Cefazolin',
        nameEn: 'Cefazolin',
        standardDoseVi: '50 - 100 mg/kg/ngày chia 3 lần',
        dosageVi: '50 - 100 mg/kg/ngày chia 3 lần',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'clindamycin',
        nameVi: 'Clindamycin',
        drugName: 'Clindamycin',
        nameEn: 'Clindamycin',
        standardDoseVi: '30 - 40 mg/kg/ngày chia 3 lần',
        dosageVi: '30 - 40 mg/kg/ngày chia 3 lần',
        route: 'IV/PO',
        hasDosingCalculator: true
      }
    ],
    source: { doc: 'BVBND_HDSDKS', page: 6 }
  },
  {
    id: 'peds_ssti_group2',
    site: 'skin_soft_tissue',
    population: 'pediatric',
    riskGroup: 'group_2',
    titleVi: 'Nhiễm khuẩn Da & Mô mềm Trẻ em - Nhóm 2 (Hoại tử / Nguy cơ MRSA)',
    titleEn: 'Pediatric SSTI - Group 2 (MRSA / Necrotizing Risk)',
    drugs: [
      {
        drugId: 'vancomycin',
        nameVi: 'Vancomycin (phủ MRSA)',
        drugName: 'Vancomycin (phủ MRSA)',
        nameEn: 'Vancomycin',
        standardDoseVi: '60 mg/kg/ngày chia 4 lần (15 mg/kg q6h)',
        dosageVi: '60 mg/kg/ngày chia 4 lần (15 mg/kg q6h)',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'meropenem',
        nameVi: 'Meropenem',
        drugName: 'Meropenem',
        nameEn: 'Meropenem',
        standardDoseVi: '60 mg/kg/ngày chia 3 lần',
        dosageVi: '60 mg/kg/ngày chia 3 lần',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'piperacillin_tazo',
        nameVi: 'Piperacillin/Tazobactam',
        drugName: 'Piperacillin/Tazobactam',
        nameEn: 'Piperacillin/Tazobactam',
        standardDoseVi: '300 mg/kg/ngày chia 3 - 4 lần',
        dosageVi: '300 mg/kg/ngày chia 3 - 4 lần',
        route: 'IV',
        hasDosingCalculator: true
      }
    ],
    source: { doc: 'BVBND_HDSDKS', page: 6 }
  },
  {
    id: 'peds_cns_group1',
    site: 'cns',
    population: 'pediatric',
    riskGroup: 'group_1',
    titleVi: 'Viêm màng não mủ Trẻ em - Nhóm 1 (Cộng đồng)',
    titleEn: 'Pediatric Meningitis - Group 1',
    drugs: [
      {
        drugId: 'cefotaxim',
        nameVi: 'Cefotaxime (hoặc Ceftriaxone 100 mg/kg)',
        drugName: 'Cefotaxime (hoặc Ceftriaxone 100 mg/kg)',
        nameEn: 'Cefotaxime',
        standardDoseVi: '200 - 300 mg/kg/ngày chia 4 lần',
        dosageVi: '200 - 300 mg/kg/ngày chia 4 lần',
        route: 'IV',
        hasDosingCalculator: true
      },
      {
        drugId: 'vancomycin',
        nameVi: 'Vancomycin (phủ phế cầu kháng penicillin)',
        drugName: 'Vancomycin (phủ phế cầu kháng penicillin)',
        nameEn: 'Vancomycin',
        standardDoseVi: '60 mg/kg/ngày chia 4 lần (15 mg/kg q6h)',
        dosageVi: '60 mg/kg/ngày chia 4 lần (15 mg/kg q6h)',
        route: 'IV',
        hasDosingCalculator: true
      }
    ],
    combinationRulesVi: [
      'Trẻ sơ sinh / < 3 tháng tuổi: Phối hợp thêm Ampicillin (200 - 300 mg/kg/ngày) để phòng Listeria monocytogenes.',
      'Dexamethasone 0.15 mg/kg q6h x 4 ngày trước hoặc cùng liều kháng sinh đầu tiên.'
    ],
    source: { doc: 'BVBND_HDSDKS', page: 5 }
  },
  {
    id: 'peds_cns_group2',
    site: 'cns',
    population: 'pediatric',
    riskGroup: 'group_2',
    titleVi: 'Viêm màng não mủ Trẻ em - Nhóm 2 (Sau phẫu thuật thần kinh, Shunt DNT)',
    titleEn: 'Pediatric Healthcare-associated Meningitis - Group 2',
    drugs: [
      {
        drugId: 'meropenem',
        nameVi: 'Meropenem liều cao màng não',
        drugName: 'Meropenem liều cao màng não',
        nameEn: 'Meropenem meningitis dose',
        standardDoseVi: '120 mg/kg/ngày chia 3 lần (40 mg/kg q8h, tối đa 2g q8h) truyền 3 giờ',
        dosageVi: '120 mg/kg/ngày chia 3 lần (40 mg/kg q8h, tối đa 2g q8h) truyền 3 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        infusionNoteVi: 'Truyền kéo dài 3 giờ'
      },
      {
        drugId: 'vancomycin',
        nameVi: 'Vancomycin (phủ MRSA & CoNS)',
        drugName: 'Vancomycin (phủ MRSA & CoNS)',
        nameEn: 'Vancomycin',
        standardDoseVi: '60 mg/kg/ngày chia 4 lần (15 mg/kg q6h)',
        dosageVi: '60 mg/kg/ngày chia 4 lần (15 mg/kg q6h)',
        route: 'IV',
        hasDosingCalculator: true
      }
    ],
    source: { doc: 'BVBND_HDSDKS', page: 5 }
  }
];

/**
 * Filter empiric regimens based on site, population, riskGroup, sepsisSource and specificRisks.
 * Ensures:
 * 1. Base regimens are ALWAYS returned so the clinician never sees an empty screen.
 * 2. When specific pathogen risks are present (e.g. MRSA, ESBL, Pseudomonas/Acinetobacter),
 *    targeted regimens are displayed alongside the base backbone regimen.
 */
export function findEmpiricRegimens(
  site: string,
  population: string,
  riskGroup: string,
  sepsisSource?: string,
  specificRisks: string[] = []
): EmpiricRegimen[] {
  // First get all matching population, site, riskGroup
  const candidates = EMPIRIC_REGIMENS.filter(reg => {
    if (reg.population !== population) return false;
    if (reg.site !== site) return false;
    if (reg.riskGroup !== riskGroup) return false;
    if (site === 'sepsis' && sepsisSource && reg.sepsisSource && reg.sepsisSource !== sepsisSource) {
      return false;
    }
    return true;
  });

  if (riskGroup === 'group_1') {
    return candidates;
  }

  // If group_2:
  const baseRegimens = candidates.filter(r => !r.specificRisk);
  const targetedRegimens = candidates.filter(r => r.specificRisk && specificRisks.includes(r.specificRisk));

  // If user selected specific pathogen risks, show both the base regimen and targeted add-on regimens
  if (targetedRegimens.length > 0) {
    return [...baseRegimens, ...targetedRegimens];
  }

  // If no specific risk selected, return the base group 2 regimens
  if (baseRegimens.length > 0) {
    return baseRegimens;
  }

  // Fallback: return all candidates for this site and group
  return candidates;
}
