import { EmpiricRegimen, InfectionSite, Population, SepsisSource } from '../types';

/**
 * =======================================================================
 * WHO AWaRe Antibiotic Regimens & Clinical Guidelines Dataset
 * Source: The WHO AWaRe (Access, Watch, Reserve) antibiotic book
 * Geneva: World Health Organization; 2022. Licence: CC BY-NC-SA 3.0 IGO.
 * ISBN: 978-92-4-006238-2 (electronic version)
 * =======================================================================
 */

export const WHO_REGIMENS: EmpiricRegimen[] = [
  // =======================================================================
  // 1. RESPIRATORY INFECTIONS (CH 4, 12, 13, 27, 28)
  // =======================================================================

  // --- Chapter 12: Community-Acquired Pneumonia (CAP) - Mild (Adult) ---
  {
    id: 'who_cap_mild_adult_first',
    site: 'respiratory',
    population: 'adult',
    riskGroup: 'group_1',
    guidelineSource: 'who',
    chapterNumber: 12,
    diseaseNameVi: 'Viêm phổi mắc phải cộng đồng (CAP) - Thể nhẹ / Chăm sóc ban đầu',
    diseaseNameEn: 'Community-Acquired Pneumonia (CAP) - Mild (Primary Care)',
    clinicalSetting: 'primary_care',
    line: 'first_choice',
    titleVi: 'WHO Đầu Tay: Amoxicillin uống (Nhóm Tiếp Cận - Access)',
    titleEn: 'WHO First Choice: Oral Amoxicillin (Access Group)',
    durationVi: '5 ngày (CURB-65 = 0-1 điểm)',
    durationEn: '5 days (CURB-65 score 0-1)',
    nonAntibioticCareVi: 'Bù dịch đầy đủ, nghỉ ngơi, Paracetamol 500mg-1g mỗi 4-6h hạ sốt giảm đau. Tránh lạm dụng thuốc ho có chứa opioid.',
    drugs: [
      {
        drugId: 'amox_clav',
        nameVi: 'Amoxicillin (Đơn trị đầu tay)',
        drugName: 'Amoxicillin',
        nameEn: 'Amoxicillin oral',
        standardDoseVi: '1 g uống mỗi 8 giờ (hoặc Phenoxymethylpenicillin 500 mg (800.000 IU) mỗi 6 giờ)',
        dosageVi: '1 g uống mỗi 8 giờ',
        route: 'PO',
        hasDosingCalculator: true,
        awareCategory: 'Access',
        line: 'first_choice',
        infusionNoteVi: 'Phế cầu kháng penicillin mức độ thấp/trung bình vẫn đáp ứng rất tốt với Amoxicillin liều cao 1g q8h.'
      }
    ],
    combinationRulesVi: [
      'Amoxicillin đường uống là lựa chọn số 1 thế giới của WHO cho CAP nhẹ-vừa ở người lớn.',
      'Không cần xét nghiệm vi sinh thường quy cho các trường hợp ngoại trú nhẹ.',
      'Chuyển viện hoặc hội chẩn nếu bệnh nhân không cải thiện sau 48-72 giờ.'
    ],
    cautionVi: [
      'Đánh giá thang điểm CURB-65: Nếu CURB-65 ≥ 2 điểm, bệnh nhân thuộc thể NẶNG cần nhập viện điều trị theo Chương 27.'
    ],
    source: { doc: 'WHO_AWaRe_2022', page: [147, 150], note: 'Chapter 12: CAP - mild' }
  },
  {
    id: 'who_cap_mild_adult_second',
    site: 'respiratory',
    population: 'adult',
    riskGroup: 'group_1',
    guidelineSource: 'who',
    chapterNumber: 12,
    diseaseNameVi: 'Viêm phổi mắc phải cộng đồng (CAP) - Thể nhẹ / Lựa chọn thứ hai',
    diseaseNameEn: 'Community-Acquired Pneumonia (CAP) - Mild (Second Choice)',
    clinicalSetting: 'primary_care',
    line: 'second_choice',
    titleVi: 'WHO Lựa Chọn Thứ Hai: Amox/Clav uống HOẶC Doxycycline',
    titleEn: 'WHO Second Choice: Oral Amox/Clav OR Doxycycline',
    durationVi: '5 ngày',
    durationEn: '5 days',
    drugs: [
      {
        drugId: 'amox_clav',
        nameVi: 'Amoxicillin/Clavulanic acid',
        drugName: 'Amoxicillin/Clavulanate',
        nameEn: 'Amoxicillin+clavulanic acid oral',
        standardDoseVi: '875 mg + 125 mg uống mỗi 8 giờ (hoặc 1000/125 mg phóng thích kéo dài q12h)',
        dosageVi: '875 mg + 125 mg uống mỗi 8 giờ',
        route: 'PO',
        hasDosingCalculator: true,
        awareCategory: 'Access',
        line: 'second_choice'
      },
      {
        nameVi: 'Doxycycline (Lựa chọn thay thế khi dị ứng penicillin)',
        drugName: 'Doxycycline',
        nameEn: 'Doxycycline oral',
        standardDoseVi: '100 mg uống mỗi 12 giờ',
        dosageVi: '100 mg uống mỗi 12 giờ',
        route: 'PO',
        hasDosingCalculator: false,
        awareCategory: 'Access',
        line: 'second_choice',
        infusionNoteVi: 'Bao phủ cả tác nhân điển hình và không điển hình (Mycoplasma, Chlamydia). Uống với nhiều nước tránh loét thực quản.'
      }
    ],
    combinationRulesVi: [
      'Chỉ định khi không đáp ứng với Amoxicillin đơn trị hoặc nghi ngờ vi khuẩn sinh men beta-lactamase (H. influenzae, M. catarrhalis).',
      'Doxycycline là giải pháp an toàn hàng đầu cho bệnh nhân có tiền sử dị ứng penicillin không sốc phản vệ.'
    ],
    source: { doc: 'WHO_AWaRe_2022', page: [147, 150], note: 'Chapter 12: CAP - mild' }
  },

  // --- Chapter 12: Community-Acquired Pneumonia (CAP) - Mild (Pediatric) ---
  {
    id: 'who_cap_mild_peds_first',
    site: 'respiratory',
    population: 'pediatric',
    riskGroup: 'group_1',
    guidelineSource: 'who',
    chapterNumber: 12,
    diseaseNameVi: 'Viêm phổi cộng đồng ở trẻ em – Thể nhẹ (Thở nhanh, không rút lõm ngực)',
    diseaseNameEn: 'Pediatric CAP – Mild (Fast breathing, no chest indrawing)',
    clinicalSetting: 'primary_care',
    line: 'first_choice',
    titleVi: 'WHO Nhi Đầu Tay: Amoxicillin uống liều cao (80-90 mg/kg/ngày)',
    titleEn: 'WHO Pediatric First Choice: Oral High-Dose Amoxicillin',
    durationVi: '3 ngày (vùng HIV thấp) hoặc 5 ngày (vùng HIV cao)',
    durationEn: '3 days (low HIV settings) or 5 days (high HIV settings)',
    drugs: [
      {
        drugId: 'amox_clav',
        nameVi: 'Amoxicillin siro/viên uống',
        drugName: 'Amoxicillin',
        nameEn: 'Amoxicillin oral liquid',
        standardDoseVi: '80–90 mg/kg/ngày chia 2 lần (q12h) uống sau ăn',
        dosageVi: '80–90 mg/kg/ngày chia 2 lần',
        route: 'PO',
        hasDosingCalculator: true,
        awareCategory: 'Access',
        line: 'first_choice',
        infusionNoteVi: 'Liều theo cân nặng: 3-<6kg: 250mg q12h; 6-<10kg: 375mg q12h; 10-<15kg: 500mg q12h; 15-<20kg: 750mg q12h; ≥20kg: 500mg q8h hoặc 1g q12h.'
      }
    ],
    combinationRulesVi: [
      'Trẻ chỉ có ho và chảy mũi không có thở nhanh/rút lõm ngực thường là nhiễm vi-rút hô hấp, KHÔNG dùng kháng sinh.',
      'WHO khuyến cáo rút ngắn thời gian điều trị xuống 3 ngày cho trẻ không có dấu hiệu nặng ở vùng tỷ lệ HIV thấp.'
    ],
    source: { doc: 'WHO_AWaRe_2022', page: [147, 150], note: 'Chapter 12: Pediatric CAP - mild' }
  },

  // --- Chapter 27: Community-Acquired Pneumonia (CAP) - Severe (Adult) ---
  {
    id: 'who_cap_severe_adult_first',
    site: 'respiratory',
    population: 'adult',
    riskGroup: 'group_2',
    guidelineSource: 'who',
    chapterNumber: 27,
    diseaseNameVi: 'Viêm phổi mắc phải cộng đồng (CAP) – Thể nặng (CURB-65 ≥ 2 điểm / Nhập viện)',
    diseaseNameEn: 'Community-Acquired Pneumonia (CAP) – Severe (CURB-65 ≥ 2 / Inpatient)',
    clinicalSetting: 'hospital',
    line: 'first_choice',
    titleVi: 'WHO Đầu Tay: Ceftriaxone HOẶC Cefotaxime (+/- Clarithromycin)',
    titleEn: 'WHO First Choice: Ceftriaxone OR Cefotaxime (+/- Clarithromycin)',
    durationVi: '5 ngày (đánh giá kéo dài nếu chưa ổn định lâm sàng hoặc có mủ màng phổi)',
    durationEn: '5 days (prolong if unstable or complications)',
    drugs: [
      {
        drugId: 'ceftriaxon',
        nameVi: 'Ceftriaxone',
        drugName: 'Ceftriaxone',
        nameEn: 'Ceftriaxone IV',
        standardDoseVi: '2 g IV mỗi 24 giờ (hoặc 1g IM mỗi 24 giờ)',
        dosageVi: '2 g IV mỗi 24 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Watch',
        line: 'first_choice'
      },
      {
        drugId: 'cefotaxim',
        nameVi: 'Cefotaxime (Lựa chọn thay thế tương đương)',
        drugName: 'Cefotaxime',
        nameEn: 'Cefotaxime IV',
        standardDoseVi: '2 g IV/IM mỗi 8 giờ',
        dosageVi: '2 g IV mỗi 8 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Watch',
        line: 'first_choice'
      },
      {
        drugId: 'azithromycin',
        nameVi: 'Clarithromycin (Phối hợp phủ VK không điển hình khi CURB-65 ≥ 2)',
        drugName: 'Clarithromycin / Azithromycin',
        nameEn: 'Clarithromycin oral/IV',
        standardDoseVi: '500 mg uống/IV mỗi 12 giờ (hoặc Azithromycin 500mg IV/PO q24h)',
        dosageVi: '500 mg uống/IV mỗi 12 giờ',
        route: 'PO/IV',
        hasDosingCalculator: true,
        awareCategory: 'Watch',
        line: 'first_choice',
        infusionNoteVi: 'Clarithromycin có sinh khả dụng đường uống tuyệt vời (~70-80%), ưu tiên dùng đường uống trừ khi suy giảm chức năng ruột.'
      }
    ],
    combinationRulesVi: [
      'NẾU CURB-65 ≥ 2: BẮT BUỘC BỔ SUNG Clarithromycin (hoặc Azithromycin) để bao phủ Legionella pneumophila, Mycoplasma và Chlamydia.',
      'Cấy máu và xét nghiệm kháng nguyên nước tiểu Legionella/Phế cầu trước khi tiêm kháng sinh liều đầu tiên.'
    ],
    cautionVi: [
      'Chuyển xuống đường uống (IV-to-PO switch) ngay khi bệnh nhân hết sốt 48 giờ và dung nạp đường tiêu hóa.'
    ],
    source: { doc: 'WHO_AWaRe_2022', page: [362, 364], note: 'Chapter 27: CAP - severe' }
  },
  {
    id: 'who_cap_severe_adult_second',
    site: 'respiratory',
    population: 'adult',
    riskGroup: 'group_2',
    guidelineSource: 'who',
    chapterNumber: 27,
    diseaseNameVi: 'Viêm phổi cộng đồng thể nặng – Lựa chọn thứ hai (Amox/Clav tiêm + Macrolide)',
    diseaseNameEn: 'Severe CAP – Second Choice (IV Amox/Clav + Macrolide)',
    clinicalSetting: 'hospital',
    line: 'second_choice',
    titleVi: 'WHO Thứ Hai: Amoxicillin/Clavulanate IV + Clarithromycin',
    titleEn: 'WHO Second Choice: IV Amox/Clav + Clarithromycin',
    durationVi: '5 ngày',
    durationEn: '5 days',
    drugs: [
      {
        drugId: 'amox_clav',
        nameVi: 'Amoxicillin/Clavulanic acid IV',
        drugName: 'Amoxicillin/Clavulanate',
        nameEn: 'Amoxicillin+clavulanic acid IV',
        standardDoseVi: '1 g + 200 mg (1.2g) IV mỗi 8 giờ (trường hợp rất nặng có thể tăng 1.2g q6h)',
        dosageVi: '1.2 g IV mỗi 8 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Access',
        line: 'second_choice'
      },
      {
        drugId: 'azithromycin',
        nameVi: 'Clarithromycin',
        drugName: 'Clarithromycin',
        nameEn: 'Clarithromycin oral/IV',
        standardDoseVi: '500 mg uống/IV mỗi 12 giờ',
        dosageVi: '500 mg uống/IV mỗi 12 giờ',
        route: 'PO/IV',
        hasDosingCalculator: true,
        awareCategory: 'Watch',
        line: 'second_choice'
      }
    ],
    combinationRulesVi: [
      'Phác đồ tiết kiệm Cephalosporin thế hệ 3, giúp giảm áp lực chọn lọc đề kháng ESBL tại khoa phòng.'
    ],
    source: { doc: 'WHO_AWaRe_2022', page: [362, 364], note: 'Chapter 27: CAP - severe' }
  },

  // --- Chapter 27: Severe CAP (Pediatric) ---
  {
    id: 'who_cap_severe_peds_first',
    site: 'respiratory',
    population: 'pediatric',
    riskGroup: 'group_2',
    guidelineSource: 'who',
    chapterNumber: 27,
    diseaseNameVi: 'Viêm phổi nặng ở trẻ em (Rút lõm ngực hoặc có dấu hiệu nguy hiểm toàn thân)',
    diseaseNameEn: 'Pediatric Severe CAP (Chest indrawing or danger signs)',
    clinicalSetting: 'hospital',
    line: 'first_choice',
    titleVi: 'WHO Nhi Nặng: Ampicillin/Amoxicillin IV + Gentamicin IV',
    titleEn: 'WHO Pediatric Severe First Choice: Ampicillin/Amoxicillin IV + Gentamicin IV',
    durationVi: '5 ngày (3 ngày nếu không rút lõm ngực ở vùng HIV thấp)',
    durationEn: '5 days (3 days in non-chest indrawing, low HIV)',
    drugs: [
      {
        drugId: 'ampicillin_sulbactam',
        nameVi: 'Ampicillin IV (hoặc Amoxicillin IV)',
        drugName: 'Ampicillin',
        nameEn: 'Ampicillin IV',
        standardDoseVi: '50 mg/kg/liều IV mỗi 8 giờ (sơ sinh tuần đầu: mỗi 12 giờ)',
        dosageVi: '50 mg/kg mỗi 8 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Access',
        line: 'first_choice'
      },
      {
        drugId: 'gentamicin',
        nameVi: 'Gentamicin IV',
        drugName: 'Gentamicin',
        nameEn: 'Gentamicin IV/IM',
        standardDoseVi: '7,5 mg/kg IV mỗi 24 giờ (sơ sinh: 5 mg/kg mỗi 24 giờ)',
        dosageVi: '7.5 mg/kg mỗi 24 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Access',
        line: 'first_choice',
        infusionNoteVi: 'Tiêm truyền tĩnh mạch 1 lần/ngày. Theo dõi chức năng thận và lượng nước tiểu.'
      }
    ],
    combinationRulesVi: [
      'Phối hợp kinh điển nhóm Tiếp cận (Access + Access) bao phủ cả Phế cầu, H. influenzae và vi khuẩn Gram âm đường ruột.',
      'Nếu sau 48-72h không đáp ứng: Chuyển sang lựa chọn thứ hai Ceftriaxone 80 mg/kg q24h hoặc Cefotaxime 50 mg/kg q8h.'
    ],
    source: { doc: 'WHO_AWaRe_2022', page: [365, 366], note: 'Chapter 27: Pediatric Severe CAP' }
  },

  // --- Chapter 28: Hospital-Acquired Pneumonia (HAP) & VAP (Adult) ---
  {
    id: 'who_hap_adult_low_mdr',
    site: 'respiratory',
    population: 'adult',
    riskGroup: 'group_1',
    guidelineSource: 'who',
    chapterNumber: 28,
    diseaseNameVi: 'Viêm phổi bệnh viện không thở máy (HAP non-VAP) – Nguy cơ VKĐK thấp',
    diseaseNameEn: 'Hospital-Acquired Pneumonia (non-VAP) – Low MDR Risk',
    clinicalSetting: 'hospital',
    line: 'first_choice',
    titleVi: 'WHO HAP Nguy Cơ Thấp: Amox/Clav IV HOẶC Ceftriaxone / Cefotaxime',
    titleEn: 'WHO HAP Low Risk: IV Amox/Clav OR Ceftriaxone / Cefotaxime',
    durationVi: '7 ngày (đánh giá lại nếu chưa ổn định lâm sàng vào ngày 7)',
    durationEn: '7 days (reassess at day 7)',
    drugs: [
      {
        drugId: 'amox_clav',
        nameVi: 'Amoxicillin/Clavulanic acid IV',
        drugName: 'Amoxicillin/Clavulanate',
        nameEn: 'Amoxicillin+clavulanic acid IV',
        standardDoseVi: '1 g + 200 mg (1.2g) IV mỗi 8 giờ (hoặc uống 875/125mg q8h)',
        dosageVi: '1.2 g IV mỗi 8 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Access',
        line: 'first_choice'
      },
      {
        drugId: 'ceftriaxon',
        nameVi: 'Ceftriaxone (Lựa chọn thay thế)',
        drugName: 'Ceftriaxone',
        nameEn: 'Ceftriaxone IV',
        standardDoseVi: '2 g IV mỗi 24 giờ',
        dosageVi: '2 g IV mỗi 24 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Watch',
        line: 'first_choice'
      },
      {
        drugId: 'cefotaxim',
        nameVi: 'Cefotaxime (Lựa chọn thay thế)',
        drugName: 'Cefotaxime',
        nameEn: 'Cefotaxime IV',
        standardDoseVi: '2 g IV mỗi 8 giờ',
        dosageVi: '2 g IV mỗi 8 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Watch',
        line: 'first_choice'
      }
    ],
    combinationRulesVi: [
      'Áp dụng cho bệnh nhân nằm viện ngắn ngày trước khi khởi phát triệu chứng (<5 ngày) và không có tiền sử dùng kháng sinh gần đây.',
      'Cấy đờm/dịch hút khí quản và cấy máu trước liều đầu tiên.'
    ],
    source: { doc: 'WHO_AWaRe_2022', page: [381, 383], note: 'Chapter 28: HAP non-VAP' }
  },
  {
    id: 'who_hap_adult_pseudomonas',
    site: 'respiratory',
    population: 'adult',
    riskGroup: 'group_2',
    guidelineSource: 'who',
    chapterNumber: 28,
    diseaseNameVi: 'Viêm phổi bệnh viện (HAP/VAP) – Nguy cơ Trực khuẩn mủ xanh (Pseudomonas)',
    diseaseNameEn: 'HAP/VAP – High Risk for Pseudomonas aeruginosa / Severe',
    clinicalSetting: 'hospital',
    line: 'first_choice',
    titleVi: 'WHO HAP/VAP: Piperacillin/Tazobactam 4.5g IV q6h (+/- Vancomycin)',
    titleEn: 'WHO HAP/VAP: Piperacillin/Tazobactam 4.5g IV q6h (+/- Vancomycin)',
    durationVi: '7 ngày',
    durationEn: '7 days',
    drugs: [
      {
        drugId: 'piperacillin_tazo',
        nameVi: 'Piperacillin/Tazobactam',
        drugName: 'Piperacillin/Tazobactam',
        nameEn: 'Piperacillin+tazobactam IV',
        standardDoseVi: '4,5 g (4 g + 500 mg) IV mỗi 6 giờ truyền kéo dài 3-4 giờ',
        dosageVi: '4.5 g IV mỗi 6 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Watch',
        line: 'first_choice',
        infusionNoteVi: 'WHO nhấn mạnh Pip/Tazo cung cấp phổ chống Pseudomonas aeruginosa vượt trội mà Amox/Clav và Ceftriaxone không có.'
      },
      {
        drugId: 'vancomycin',
        nameVi: 'Vancomycin (Bổ sung khi có nguy cơ MRSA)',
        drugName: 'Vancomycin',
        nameEn: 'Vancomycin IV',
        standardDoseVi: '15–20 mg/kg IV mỗi 12 giờ (liều nạp 25-30 mg/kg nếu sốc/nặng)',
        dosageVi: '15-20 mg/kg mỗi 12 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Watch',
        line: 'second_choice',
        infusionNoteVi: 'Bắt buộc theo dõi nồng độ đáy (Trough AUC/MIC) hoặc nồng độ đáy 15-20 mcg/mL.'
      }
    ],
    combinationRulesVi: [
      'Nguy cơ P. aeruginosa tăng cao ở bệnh nhân dùng kháng sinh gần đây, có bệnh phổi mạn tính (giãn phế quản, COPD) hoặc nằm ICU > 5 ngày.',
      'Xuống thang kháng sinh phổ hẹp ngay sau 48-72 giờ khi có kết quả vi sinh cấy đờm/máu.'
    ],
    source: { doc: 'WHO_AWaRe_2022', page: [381, 383], note: 'Chapter 28: HAP/VAP' }
  },

  // --- Chapter 13: Exacerbation of COPD (AECOPD) ---
  {
    id: 'who_copd_adult',
    site: 'respiratory',
    population: 'adult',
    riskGroup: 'group_1',
    guidelineSource: 'who',
    chapterNumber: 13,
    diseaseNameVi: 'Đợt cấp bệnh phổi tắc nghẽn mạn tính (AECOPD)',
    diseaseNameEn: 'Acute Exacerbation of COPD (AECOPD)',
    clinicalSetting: 'primary_care',
    line: 'first_choice',
    titleVi: 'WHO Đợt Cấp COPD: Amoxicillin uống (Access) x 5 ngày',
    titleEn: 'WHO AECOPD: Oral Amoxicillin (Access) x 5 days',
    durationVi: '5 ngày',
    durationEn: '5 days',
    nonAntibioticCareVi: 'Tối ưu hóa thuốc giãn phế quản (SABA + SAMA), Corticosteroid đường uống ngắn ngày (Prednisone 40mg x 5 ngày), thở oxy lưu lượng kiểm soát.',
    drugs: [
      {
        drugId: 'amox_clav',
        nameVi: 'Amoxicillin (Đầu tay)',
        drugName: 'Amoxicillin',
        nameEn: 'Amoxicillin oral',
        standardDoseVi: '500 mg uống mỗi 8 giờ x 5 ngày',
        dosageVi: '500 mg uống mỗi 8 giờ',
        route: 'PO',
        hasDosingCalculator: true,
        awareCategory: 'Access',
        line: 'first_choice'
      },
      {
        drugId: 'amox_clav',
        nameVi: 'Amoxicillin/Clavulanate (Lựa chọn thứ hai)',
        drugName: 'Amoxicillin/Clavulanate',
        nameEn: 'Amoxicillin+clavulanic acid oral',
        standardDoseVi: '500 mg + 125 mg uống mỗi 8 giờ x 5 ngày',
        dosageVi: '500/125 mg uống mỗi 8 giờ',
        route: 'PO',
        hasDosingCalculator: true,
        awareCategory: 'Access',
        line: 'second_choice'
      }
    ],
    combinationRulesVi: [
      'Chỉ định kháng sinh khi bệnh nhân có đủ 3 triệu chứng Anthonisen (tăng khó thở, tăng thể tích đờm, đờm chuyển mủ) hoặc có 2 triệu chứng trong đó bắt buộc có đờm mủ.'
    ],
    source: { doc: 'WHO_AWaRe_2022', page: [162, 164], note: 'Chapter 13: AECOPD' }
  },

  // =======================================================================
  // 2. SEPSIS & SEPTIC SHOCK (CH 24, 25)
  // =======================================================================

  // --- Chapter 24: Sepsis in Adults - Unknown Origin ---
  {
    id: 'who_sepsis_adult_unknown',
    site: 'sepsis',
    population: 'adult',
    riskGroup: 'group_2',
    guidelineSource: 'who',
    chapterNumber: 24,
    diseaseNameVi: 'Nhiễm khuẩn huyết ở người lớn (Sepsis-3) – Không rõ nguồn gốc ban đầu',
    diseaseNameEn: 'Adult Sepsis & Septic Shock – Sepsis of Unknown Origin',
    clinicalSetting: 'hospital',
    line: 'first_choice',
    titleVi: 'WHO Đầu Tay: Ceftriaxone/Cefotaxime + Amikacin IV (Tiết Kiệm Carbapenem)',
    titleEn: 'WHO First Choice: Ceftriaxone/Cefotaxime + Amikacin IV (Carbapenem-Sparing)',
    durationVi: '7 ngày',
    durationEn: '7 days',
    drugs: [
      {
        drugId: 'ceftriaxon',
        nameVi: 'Ceftriaxone',
        drugName: 'Ceftriaxone',
        nameEn: 'Ceftriaxone IV',
        standardDoseVi: '2 g IV mỗi 24 giờ',
        dosageVi: '2 g IV mỗi 24 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Watch',
        line: 'first_choice'
      },
      {
        drugId: 'cefotaxim',
        nameVi: 'Cefotaxime (Lựa chọn thay thế)',
        drugName: 'Cefotaxime',
        nameEn: 'Cefotaxime IV',
        standardDoseVi: '2 g IV mỗi 8 giờ',
        dosageVi: '2 g IV mỗi 8 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Watch',
        line: 'first_choice'
      },
      {
        drugId: 'amikacin',
        nameVi: 'Amikacin IV (Phối hợp diệt khuẩn nhanh & phủ ESBL)',
        drugName: 'Amikacin',
        nameEn: 'Amikacin IV',
        standardDoseVi: '15 mg/kg IV mỗi 24 giờ liều duy nhất (hoặc Gentamicin 5 mg/kg q24h)',
        dosageVi: '15 mg/kg mỗi 24 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Access',
        line: 'first_choice',
        infusionNoteVi: 'Chiến lược tiết kiệm Carbapenem của WHO: Amikacin giữ hoạt tính rất tốt trên trực khuẩn đường ruột sinh ESBL.'
      }
    ],
    combinationRulesVi: [
      'Khởi đầu kháng sinh tĩnh mạch trong vòng 1 GIỜ ĐẦU (Golden Hour) sau khi phát hiện sốc nhiễm khuẩn.',
      'Lấy 2 bộ cấy máu trước liều kháng sinh nhưng tuyệt đối không trì hoãn truyền thuốc.',
      'Chiến lược tiết kiệm Carbapenem: Dùng Ceftriaxone/Cefotaxime phối hợp Amikacin thay vì lạm dụng Meropenem ngay từ đầu.'
    ],
    cautionVi: [
      'Theo dõi sát CrCl và nồng độ đáy Aminoglycoside để tránh độc tính thận.'
    ],
    source: { doc: 'WHO_AWaRe_2022', page: [295, 302], note: 'Chapter 24: Sepsis in adults' }
  },

  // --- Chapter 24: Sepsis - Intra-abdominal Source ---
  {
    id: 'who_sepsis_adult_intraabdo',
    site: 'sepsis',
    sepsisSource: 'gastrointestinal',
    population: 'adult',
    riskGroup: 'group_2',
    guidelineSource: 'who',
    chapterNumber: 24,
    diseaseNameVi: 'Nhiễm khuẩn huyết có nguồn gốc từ Ổ bụng / Tiêu hóa',
    diseaseNameEn: 'Adult Sepsis Originating from Intra-abdominal Source',
    clinicalSetting: 'hospital',
    line: 'first_choice',
    titleVi: 'WHO Sepsis Ổ Bụng: Ceftriaxone/Cefotaxime + Metronidazole HOẶC Pip/Tazo',
    titleEn: 'WHO Intra-abdominal Sepsis: Ceftriaxone + Metronidazole OR Pip/Tazo',
    durationVi: '7 ngày (tùy thuộc vào can thiệp kiểm soát nguồn nhiễm bằng phẫu thuật)',
    durationEn: '7 days (guided by source control)',
    drugs: [
      {
        drugId: 'ceftriaxon',
        nameVi: 'Ceftriaxone',
        drugName: 'Ceftriaxone',
        nameEn: 'Ceftriaxone IV',
        standardDoseVi: '2 g IV mỗi 24 giờ',
        dosageVi: '2 g IV mỗi 24 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Watch',
        line: 'first_choice'
      },
      {
        drugId: 'metronidazol',
        nameVi: 'Metronidazole (Bao phủ vi khuẩn kỵ khí Bacteroides)',
        drugName: 'Metronidazole',
        nameEn: 'Metronidazole IV',
        standardDoseVi: '500 mg IV mỗi 8 giờ',
        dosageVi: '500 mg IV mỗi 8 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Access',
        line: 'first_choice'
      },
      {
        drugId: 'piperacillin_tazo',
        nameVi: 'Piperacillin/Tazobactam (Lựa chọn đơn trị thay thế)',
        drugName: 'Piperacillin/Tazobactam',
        nameEn: 'Piperacillin+tazobactam IV',
        standardDoseVi: '4,5 g IV mỗi 6 giờ truyền 3-4 giờ',
        dosageVi: '4.5 g IV mỗi 6 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Watch',
        line: 'first_choice'
      },
      {
        drugId: 'meropenem',
        nameVi: 'Meropenem (Lựa chọn thứ hai khi sốc nặng hoặc nguy cơ cao ESBL)',
        drugName: 'Meropenem',
        nameEn: 'Meropenem IV',
        standardDoseVi: '1 g - 2 g IV mỗi 8 giờ truyền kéo dài 3 giờ',
        dosageVi: '1 - 2 g IV mỗi 8 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Watch',
        line: 'second_choice'
      }
    ],
    combinationRulesVi: [
      'Kiểm soát nguồn bệnh (dẫn lưu ổ mủ, can thiệp phẫu thuật) là yếu tố quyết định sống còn hàng đầu.',
      'Kháng sinh bắt buộc phải bao phủ cả trực khuẩn Gram âm đường ruột và vi khuẩn kỵ khí.'
    ],
    source: { doc: 'WHO_AWaRe_2022', page: [295, 303], note: 'Chapter 24: Sepsis - Intra-abdominal' }
  },

  // --- Chapter 24: Sepsis - Urinary Source ---
  {
    id: 'who_sepsis_adult_urinary',
    site: 'sepsis',
    sepsisSource: 'urinary',
    population: 'adult',
    riskGroup: 'group_2',
    guidelineSource: 'who',
    chapterNumber: 24,
    diseaseNameVi: 'Nhiễm khuẩn huyết từ đường Tiết niệu (Urosepsis)',
    diseaseNameEn: 'Adult Urosepsis (Urinary Source)',
    clinicalSetting: 'hospital',
    line: 'first_choice',
    titleVi: 'WHO Urosepsis: Ceftriaxone/Cefotaxime + Amikacin IV',
    titleEn: 'WHO Urosepsis: Ceftriaxone/Cefotaxime + Amikacin IV',
    durationVi: '7 ngày',
    durationEn: '7 days',
    drugs: [
      {
        drugId: 'ceftriaxon',
        nameVi: 'Ceftriaxone',
        drugName: 'Ceftriaxone',
        nameEn: 'Ceftriaxone IV',
        standardDoseVi: '2 g IV mỗi 24 giờ',
        dosageVi: '2 g IV mỗi 24 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Watch',
        line: 'first_choice'
      },
      {
        drugId: 'amikacin',
        nameVi: 'Amikacin IV (Phối hợp diệt khuẩn nhanh và phủ ESBL)',
        drugName: 'Amikacin',
        nameEn: 'Amikacin IV',
        standardDoseVi: '15 mg/kg IV mỗi 24 giờ liều duy nhất',
        dosageVi: '15 mg/kg mỗi 24 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Access',
        line: 'first_choice'
      },
      {
        drugId: 'meropenem',
        nameVi: 'Meropenem (Lựa chọn thứ hai khi sốc nhiễm khuẩn hoặc tiền sử ESBL)',
        drugName: 'Meropenem',
        nameEn: 'Meropenem IV',
        standardDoseVi: '1 g IV mỗi 8 giờ truyền kéo dài 3 giờ',
        dosageVi: '1 g IV mỗi 8 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Watch',
        line: 'second_choice'
      }
    ],
    combinationRulesVi: [
      'Giải áp đường tiểu khẩn cấp nếu có sỏi hoặc u bướu gây tắc nghẽn niệu quản.',
      'Cấy nước tiểu và cấy máu trước liều đầu tiên.'
    ],
    source: { doc: 'WHO_AWaRe_2022', page: [295, 303], note: 'Chapter 24: Sepsis - Urinary' }
  },

  // --- Chapter 25: Sepsis in Neonates and Children ---
  {
    id: 'who_sepsis_peds_first',
    site: 'sepsis',
    population: 'pediatric',
    riskGroup: 'group_2',
    guidelineSource: 'who',
    chapterNumber: 25,
    diseaseNameVi: 'Nhiễm khuẩn huyết ở trẻ sơ sinh (<28 ngày) & Trẻ nhỏ',
    diseaseNameEn: 'Neonatal (<28 days) & Pediatric Sepsis',
    clinicalSetting: 'hospital',
    line: 'first_choice',
    titleVi: 'WHO Sơ Sinh Đầu Tay: Ampicillin + Gentamicin IV (Access + Access)',
    titleEn: 'WHO Neonatal First Choice: Ampicillin + Gentamicin IV (Access + Access)',
    durationVi: '7 ngày (14 ngày nếu có viêm màng não đồng nhiễm)',
    durationEn: '7 days (14 days if meningitis)',
    drugs: [
      {
        drugId: 'ampicillin_sulbactam',
        nameVi: 'Ampicillin IV (Bao phủ Listeria và Liên cầu B)',
        drugName: 'Ampicillin',
        nameEn: 'Ampicillin IV',
        standardDoseVi: '50 mg/kg IV mỗi 12h (tuần đầu đời) hoặc mỗi 8h (>1 tuần đời)',
        dosageVi: '50 mg/kg mỗi 8-12 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Access',
        line: 'first_choice'
      },
      {
        drugId: 'gentamicin',
        nameVi: 'Gentamicin IV (Hiệp đồng diệt trực khuẩn Gram âm)',
        drugName: 'Gentamicin',
        nameEn: 'Gentamicin IV',
        standardDoseVi: '5 mg/kg IV mỗi 24 giờ (trẻ sơ sinh) hoặc 7,5 mg/kg q24h (trẻ lớn)',
        dosageVi: '5 - 7.5 mg/kg mỗi 24 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Access',
        line: 'first_choice'
      },
      {
        drugId: 'cefotaxim',
        nameVi: 'Cefotaxime (Lựa chọn đầu tay cho trẻ lớn > 1 tháng)',
        drugName: 'Cefotaxime',
        nameEn: 'Cefotaxime IV',
        standardDoseVi: '50 mg/kg IV mỗi 8 giờ (hoặc Ceftriaxone 80 mg/kg q24h ở trẻ ngoài sơ sinh)',
        dosageVi: '50 mg/kg mỗi 8 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Watch',
        line: 'first_choice'
      }
    ],
    combinationRulesVi: [
      'Phối hợp kinh điển Ampicillin + Gentamicin là chuẩn vàng của WHO cho nhiễm khuẩn huyết sơ sinh.',
      'KHÔNG dùng Ceftriaxone cho trẻ sơ sinh có tăng bilirubin máu tự do hoặc đang truyền dung dịch chứa canxi (nguy cơ kết tủa ceftriaxone-canxi đe dọa tính mạng).'
    ],
    source: { doc: 'WHO_AWaRe_2022', page: [319, 323], note: 'Chapter 25: Sepsis in neonates & children' }
  },

  // =======================================================================
  // 3. URINARY TRACT INFECTIONS (CH 23, 34)
  // =======================================================================

  // --- Chapter 23: Lower Urinary Tract Infection (Acute Cystitis) ---
  {
    id: 'who_uti_lower_adult_first',
    site: 'urinary',
    population: 'adult',
    riskGroup: 'group_1',
    guidelineSource: 'who',
    chapterNumber: 23,
    diseaseNameVi: 'Nhiễm khuẩn tiết niệu dưới (Viêm bàng quang cấp) – Người lớn',
    diseaseNameEn: 'Lower Urinary Tract Infection (Acute Cystitis) – Adults',
    clinicalSetting: 'primary_care',
    line: 'first_choice',
    titleVi: 'WHO Đầu Tay: Nitrofurantoin uống (Ưu tiên số 1) HOẶC Amox/Clav',
    titleEn: 'WHO First Choice: Nitrofurantoin (Preferred) OR Amox/Clav',
    durationVi: '3–5 ngày (phụ nữ 5 ngày với nitrofurantoin; nam giới 7 ngày)',
    durationEn: '3-5 days (women 5 days with nitrofurantoin; men 7 days)',
    nonAntibioticCareVi: 'Uống nhiều nước (> 2 lít/ngày), đi tiểu thường xuyên không nhịn tiểu, dùng paracetamol giảm đau tức hạ vị nếu cần.',
    drugs: [
      {
        nameVi: 'Nitrofurantoin (Kháng sinh lựa chọn ưu tiên số 1)',
        drugName: 'Nitrofurantoin',
        nameEn: 'Nitrofurantoin oral',
        standardDoseVi: '100 mg uống mỗi 12 giờ (dạng phóng thích biến đổi macrocrystal) x 5 ngày; hoặc 50 mg mỗi 6 giờ x 5 ngày',
        dosageVi: '100 mg uống mỗi 12 giờ',
        route: 'PO',
        hasDosingCalculator: false,
        awareCategory: 'Access',
        line: 'first_choice',
        infusionNoteVi: 'Duy trì nồng độ cực cao trong nước tiểu, ít ảnh hưởng hệ vi sinh ruột và giữ hoạt tính diệt E. coli sinh ESBL.'
      },
      {
        drugId: 'amox_clav',
        nameVi: 'Amoxicillin/Clavulanic acid (Lựa chọn thay thế)',
        drugName: 'Amoxicillin/Clavulanate',
        nameEn: 'Amoxicillin+clavulanic acid oral',
        standardDoseVi: '500 mg + 125 mg uống mỗi 8 giờ x 3–5 ngày',
        dosageVi: '500/125 mg uống mỗi 8 giờ',
        route: 'PO',
        hasDosingCalculator: true,
        awareCategory: 'Access',
        line: 'first_choice'
      },
      {
        drugId: 'tmp_smx',
        nameVi: 'Sulfamethoxazole+Trimethoprim (Cotrimoxazole)',
        drugName: 'Cotrimoxazole',
        nameEn: 'Sulfamethoxazole+trimethoprim oral',
        standardDoseVi: '800 mg SMX + 160 mg TMP uống mỗi 12 giờ x 3 ngày',
        dosageVi: '800/160 mg uống mỗi 12 giờ',
        route: 'PO',
        hasDosingCalculator: true,
        awareCategory: 'Access',
        line: 'second_choice',
        infusionNoteVi: 'Chỉ dùng khi tỷ lệ đề kháng tại địa phương đã biết < 20% và bệnh nhân không có nguy cơ ESBL.'
      }
    ],
    combinationRulesVi: [
      'Nitrofurantoin là kháng sinh Tiếp cận số 1 thế giới của WHO cho viêm bàng quang cấp.',
      'CẢNH BÁO: KHÔNG dùng Nitrofurantoin cho viêm bể thận hoặc nhiễm trùng tiết niệu trên vì thuốc hầu như không ngấm vào nhu mô thận.'
    ],
    cautionVi: [
      'Tránh lạm dụng Fluoroquinolone (Ciprofloxacin) cho viêm bàng quang không biến chứng để bảo tồn thuốc cho nhiễm khuẩn nặng.'
    ],
    source: { doc: 'WHO_AWaRe_2022', page: [278, 281], note: 'Chapter 23: Lower UTI' }
  },

  // --- Chapter 34: Upper Urinary Tract Infection (Acute Pyelonephritis) ---
  {
    id: 'who_uti_upper_adult_first',
    site: 'urinary',
    population: 'adult',
    riskGroup: 'group_2',
    guidelineSource: 'who',
    chapterNumber: 34,
    diseaseNameVi: 'Nhiễm khuẩn tiết niệu trên (Viêm bể thận cấp) – Người lớn nhập viện',
    diseaseNameEn: 'Upper Urinary Tract Infection (Acute Pyelonephritis) – Hospitalized Adults',
    clinicalSetting: 'hospital',
    line: 'first_choice',
    titleVi: 'WHO Đầu Tay: Ceftriaxone/Cefotaxime (+/- Amikacin Tiết Kiệm Carbapenem)',
    titleEn: 'WHO First Choice: Ceftriaxone/Cefotaxime (+/- Amikacin Carbapenem-Sparing)',
    durationVi: '7 ngày (kéo dài 14 ngày nếu có viêm tuyến tiền liệt ở nam giới)',
    durationEn: '7 days (14 days if prostatic involvement in men)',
    drugs: [
      {
        drugId: 'ceftriaxon',
        nameVi: 'Ceftriaxone IV',
        drugName: 'Ceftriaxone',
        nameEn: 'Ceftriaxone IV/IM',
        standardDoseVi: '1 g - 2 g IV mỗi 24 giờ',
        dosageVi: '1 - 2 g IV mỗi 24 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Watch',
        line: 'first_choice'
      },
      {
        drugId: 'cefotaxim',
        nameVi: 'Cefotaxime IV',
        drugName: 'Cefotaxime',
        nameEn: 'Cefotaxime IV/IM',
        standardDoseVi: '1 g - 2 g IV mỗi 8 giờ',
        dosageVi: '1 - 2 g IV mỗi 8 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Watch',
        line: 'first_choice'
      },
      {
        drugId: 'amikacin',
        nameVi: 'Amikacin IV (Bổ sung khi nguy cơ ESBL cao hoặc bệnh nặng)',
        drugName: 'Amikacin',
        nameEn: 'Amikacin IV',
        standardDoseVi: '15 mg/kg IV mỗi 24 giờ liều duy nhất (hoặc Gentamicin 5 mg/kg q24h)',
        dosageVi: '15 mg/kg mỗi 24 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Access',
        line: 'first_choice',
        infusionNoteVi: 'Amikacin đạt nồng độ bài xuất cực cao trong thận, là phác đồ đơn trị hoặc phối hợp tiết kiệm Carbapenem lý tưởng cho ESBL.'
      },
      {
        drugId: 'ciprofloxacin',
        nameVi: 'Ciprofloxacin (Thể nhẹ ngoại trú hoặc xuống thang)',
        drugName: 'Ciprofloxacin',
        nameEn: 'Ciprofloxacin oral/IV',
        standardDoseVi: '500 mg uống mỗi 12 giờ x 7 ngày (hoặc 400 mg IV q12h)',
        dosageVi: '500 mg uống mỗi 12 giờ',
        route: 'PO/IV',
        hasDosingCalculator: true,
        awareCategory: 'Watch',
        line: 'first_choice'
      }
    ],
    combinationRulesVi: [
      'Phải cấy nước tiểu trước liều kháng sinh đầu tiên.',
      'Cải thiện lâm sàng thường rõ rệt sau 48-72 giờ; xuống thang sang kháng sinh đường uống ngay khi bệnh nhân hết sốt.'
    ],
    source: { doc: 'WHO_AWaRe_2022', page: [474, 477], note: 'Chapter 34: Upper UTI' }
  },

  // =======================================================================
  // 4. CENTRAL NERVOUS SYSTEM - MENINGITIS (CH 26)
  // =======================================================================
  {
    id: 'who_meningitis_adult_first',
    site: 'cns',
    population: 'adult',
    riskGroup: 'group_2',
    guidelineSource: 'who',
    chapterNumber: 26,
    diseaseNameVi: 'Viêm màng não mủ do vi khuẩn ở người lớn',
    diseaseNameEn: 'Acute Bacterial Meningitis in Adults',
    clinicalSetting: 'hospital',
    line: 'first_choice',
    titleVi: 'WHO Đầu Tay: Ceftriaxone liều màng não (4g/ngày) HOẶC Cefotaxime (8g/ngày) (+/- Ampicillin)',
    titleEn: 'WHO First Choice: High-Dose Ceftriaxone (4g/d) OR Cefotaxime (8g/d) (+/- Ampicillin)',
    durationVi: 'Chưa rõ tác nhân: 10 ngày; Phế cầu: 10-14 ngày; Não mô cầu: 5-7 ngày; Listeria: 21 ngày',
    durationEn: 'Unknown: 10 days; S. pneumoniae: 10-14 days; N. meningitidis: 5-7 days; Listeria: 21 days',
    drugs: [
      {
        drugId: 'ceftriaxon',
        nameVi: 'Ceftriaxone (Liều viêm màng não)',
        drugName: 'Ceftriaxone',
        nameEn: 'Ceftriaxone IV',
        standardDoseVi: '2 g IV mỗi 12 giờ (tổng liều 4 g/ngày) tiêm truyền tĩnh mạch',
        dosageVi: '2 g IV mỗi 12 giờ (4g/ngày)',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Watch',
        line: 'first_choice',
        infusionNoteVi: 'Liều màng não gấp đôi liều thông thường để đảm bảo nồng độ thuốc vượt qua hàng rào máu não.'
      },
      {
        drugId: 'cefotaxim',
        nameVi: 'Cefotaxime (Lựa chọn thay thế)',
        drugName: 'Cefotaxime',
        nameEn: 'Cefotaxime IV',
        standardDoseVi: '2 g IV mỗi 6 giờ (tổng liều 8 g/ngày)',
        dosageVi: '2 g IV mỗi 6 giờ (8g/ngày)',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Watch',
        line: 'first_choice'
      },
      {
        drugId: 'ampicillin_sulbactam',
        nameVi: 'Ampicillin IV (Bổ sung diệt Listeria monocytogenes)',
        drugName: 'Ampicillin',
        nameEn: 'Ampicillin IV',
        standardDoseVi: '2 g IV mỗi 4 giờ (hoặc Amoxicillin 2g IV q4h)',
        dosageVi: '2 g IV mỗi 4 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Access',
        line: 'first_choice',
        infusionNoteVi: 'Bắt buộc thêm Ampicillin nếu bệnh nhân ≥ 50 tuổi, phụ nữ có thai hoặc suy giảm miễn dịch.'
      }
    ],
    combinationRulesVi: [
      'Corticosteroid: Dexamethasone 0,15 mg/kg mỗi 6 giờ tiêm tĩnh mạch dùng ngay trước hoặc cùng lúc với liều kháng sinh đầu tiên.',
      'Chỉ tiếp tục dùng Dexamethasone nếu xét nghiệm khẳng định căn nguyên là Phế cầu (Streptococcus pneumoniae).'
    ],
    source: { doc: 'WHO_AWaRe_2022', page: [345, 347], note: 'Chapter 26: Bacterial meningitis' }
  },

  // =======================================================================
  // 5. INTRA-ABDOMINAL & PERITONEAL (CH 29, 30, 31, 33)
  // =======================================================================

  // --- Chapter 29: Acute Cholecystitis & Cholangitis ---
  {
    id: 'who_cholecystitis_adult',
    site: 'gastrointestinal',
    population: 'adult',
    riskGroup: 'group_1',
    guidelineSource: 'who',
    chapterNumber: 29,
    diseaseNameVi: 'Nhiễm trùng đường mật – Viêm túi mật cấp & Viêm đường mật cấp',
    diseaseNameEn: 'Acute Cholecystitis & Acute Cholangitis',
    clinicalSetting: 'hospital',
    line: 'first_choice',
    titleVi: 'WHO Đường Mật Đầu Tay: Amox/Clav IV HOẶC Ceftriaxone + Metronidazole',
    titleEn: 'WHO Biliary First Choice: IV Amox/Clav OR Ceftriaxone + Metronidazole',
    durationVi: 'Viêm túi mật không biến chứng: Ngừng sau mổ; Có biến chứng/Viêm đường mật: 5 ngày sau can thiệp',
    durationEn: 'Uncomplicated: stop after surgery; Complicated: 5 days post source control',
    drugs: [
      {
        drugId: 'amox_clav',
        nameVi: 'Amoxicillin/Clavulanic acid IV',
        drugName: 'Amoxicillin/Clavulanate',
        nameEn: 'Amoxicillin+clavulanic acid IV',
        standardDoseVi: '1,2 g IV mỗi 8 giờ (hoặc uống 875/125 mg q8h nếu nhẹ)',
        dosageVi: '1.2 g IV mỗi 8 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Access',
        line: 'first_choice'
      },
      {
        drugId: 'ceftriaxon',
        nameVi: 'Ceftriaxone IV',
        drugName: 'Ceftriaxone',
        nameEn: 'Ceftriaxone IV',
        standardDoseVi: '2 g IV mỗi 24 giờ',
        dosageVi: '2 g IV mỗi 24 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Watch',
        line: 'first_choice'
      },
      {
        drugId: 'metronidazol',
        nameVi: 'Metronidazole IV/PO',
        drugName: 'Metronidazole',
        nameEn: 'Metronidazole IV/oral',
        standardDoseVi: '500 mg mỗi 8 giờ uống hoặc IV',
        dosageVi: '500 mg mỗi 8 giờ',
        route: 'IV/PO',
        hasDosingCalculator: true,
        awareCategory: 'Access',
        line: 'first_choice'
      },
      {
        drugId: 'piperacillin_tazo',
        nameVi: 'Piperacillin/Tazobactam (Thể nặng nhập viện)',
        drugName: 'Piperacillin/Tazobactam',
        nameEn: 'Piperacillin+tazobactam IV',
        standardDoseVi: '4,5 g IV mỗi 6 giờ truyền kéo dài 3-4 giờ',
        dosageVi: '4.5 g IV mỗi 6 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Watch',
        line: 'first_choice'
      }
    ],
    combinationRulesVi: [
      'Cắt túi mật hoặc dẫn lưu mật (qua ERCP/PTCD) là can thiệp triệt để nguồn bệnh sống còn.',
      'Nếu không có biến chứng và túi mật đã cắt bỏ thành công, WHO khuyến cáo NGỪNG KHÁNG SINH ngay sau mổ.'
    ],
    source: { doc: 'WHO_AWaRe_2022', page: [396, 398], note: 'Chapter 29: Cholecystitis & cholangitis' }
  },

  // --- Chapter 30: Pyogenic Liver Abscess ---
  {
    id: 'who_liver_abscess_adult',
    site: 'gastrointestinal',
    population: 'adult',
    riskGroup: 'group_2',
    guidelineSource: 'who',
    chapterNumber: 30,
    diseaseNameVi: 'Áp xe gan sinh mủ do vi khuẩn (Pyogenic Liver Abscess)',
    diseaseNameEn: 'Pyogenic Liver Abscess',
    clinicalSetting: 'hospital',
    line: 'first_choice',
    titleVi: 'WHO Áp Xe Gan: Ceftriaxone + Metronidazole HOẶC Piperacillin/Tazobactam',
    titleEn: 'WHO Liver Abscess: Ceftriaxone + Metronidazole OR Pip/Tazo',
    durationVi: '4 tuần (bao gồm đợt điều trị IV ban đầu kết hợp rút mủ, sau đó chuyển uống)',
    durationEn: '4 weeks total (IV followed by oral step-down)',
    drugs: [
      {
        drugId: 'ceftriaxon',
        nameVi: 'Ceftriaxone IV',
        drugName: 'Ceftriaxone',
        nameEn: 'Ceftriaxone IV',
        standardDoseVi: '2 g IV mỗi 24 giờ',
        dosageVi: '2 g IV mỗi 24 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Watch',
        line: 'first_choice'
      },
      {
        drugId: 'metronidazol',
        nameVi: 'Metronidazole IV/PO',
        drugName: 'Metronidazole',
        nameEn: 'Metronidazole IV/oral',
        standardDoseVi: '500 mg IV/uống mỗi 8 giờ (áp xe amip: 750mg q8h)',
        dosageVi: '500 mg mỗi 8 giờ',
        route: 'IV/PO',
        hasDosingCalculator: true,
        awareCategory: 'Access',
        line: 'first_choice'
      },
      {
        drugId: 'piperacillin_tazo',
        nameVi: 'Piperacillin/Tazobactam (Lựa chọn thay thế)',
        drugName: 'Piperacillin/Tazobactam',
        nameEn: 'Piperacillin+tazobactam IV',
        standardDoseVi: '4,5 g IV mỗi 6 giờ',
        dosageVi: '4.5 g IV mỗi 6 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Watch',
        line: 'first_choice'
      }
    ],
    combinationRulesVi: [
      'Chọc hút hoặc đặt ống dẫn lưu ổ áp xe qua hướng dẫn siêu âm/CT là biện pháp cốt lõi kết hợp kháng sinh.',
      'Chuyển sang kháng sinh đường uống (Amox/Clav hoặc Ciprofloxacin + Metronidazole) sau khi dẫn lưu tốt và hết sốt.'
    ],
    source: { doc: 'WHO_AWaRe_2022', page: [414, 417], note: 'Chapter 30: Liver abscess' }
  },

  // --- Chapter 33: Clostridioides difficile Infection (CDI) ---
  {
    id: 'who_cdiff_adult',
    site: 'gastrointestinal',
    population: 'adult',
    riskGroup: 'group_1',
    guidelineSource: 'who',
    chapterNumber: 33,
    diseaseNameVi: 'Nhiễm khuẩn đại tràng do Clostridioides difficile (CDI)',
    diseaseNameEn: 'Clostridioides difficile Infection (CDI)',
    clinicalSetting: 'hospital',
    line: 'first_choice',
    titleVi: 'WHO C. difficile: Vancomycin ĐƯỜNG UỐNG (125mg q6h x 10 ngày)',
    titleEn: 'WHO CDI First Choice: Oral Vancomycin (125mg q6h x 10 days)',
    durationVi: '10 ngày',
    durationEn: '10 days',
    drugs: [
      {
        drugId: 'vancomycin',
        nameVi: 'Vancomycin ĐƯỜNG UỐNG (Không dùng đường tiêm)',
        drugName: 'Vancomycin oral',
        nameEn: 'Vancomycin oral formulation',
        standardDoseVi: '125 mg uống mỗi 6 giờ x 10 ngày (trường hợp tối cấp tăng 500 mg q6h)',
        dosageVi: '125 mg uống mỗi 6 giờ',
        route: 'PO',
        hasDosingCalculator: true,
        awareCategory: 'Watch',
        line: 'first_choice',
        infusionNoteVi: 'QUAN TRỌNG: Vancomycin đường tiêm tĩnh mạch KHÔNG bài tiết vào lòng ruột, bắt buộc phải dùng VANCOMYCIN ĐƯỜNG UỐNG.'
      },
      {
        drugId: 'metronidazol',
        nameVi: 'Metronidazole ĐƯỜNG UỐNG (Lựa chọn thứ hai cho đợt đầu thể nhẹ)',
        drugName: 'Metronidazole',
        nameEn: 'Metronidazole oral',
        standardDoseVi: '500 mg uống mỗi 8 giờ x 10 ngày',
        dosageVi: '500 mg uống mỗi 8 giờ',
        route: 'PO',
        hasDosingCalculator: true,
        awareCategory: 'Access',
        line: 'second_choice'
      }
    ],
    combinationRulesVi: [
      'Ngừng ngay lập tức các kháng sinh phổ rộng không cần thiết đang dùng trước đó.',
      'Nếu thể tối cấp (viêm đại tràng nhiễm độc, thủng ruột): Phối hợp Vancomycin uống 500mg q6h + Metronidazole 500mg q8h tiêm tĩnh mạch.'
    ],
    source: { doc: 'WHO_AWaRe_2022', page: [464, 467], note: 'Chapter 33: C. difficile' }
  },

  // =======================================================================
  // 6. SKIN & SOFT TISSUE INFECTIONS (CH 16, 37, 38)
  // =======================================================================

  // --- Chapter 16: Mild SSTI - Impetigo, Erysipelas, Cellulitis ---
  {
    id: 'who_ssti_mild_adult',
    site: 'skin_soft_tissue',
    population: 'adult',
    riskGroup: 'group_1',
    guidelineSource: 'who',
    chapterNumber: 16,
    diseaseNameVi: 'Nhiễm trùng da mô mềm thể nhẹ – Viêm mô tế bào, Viêm quầng, Chốc',
    diseaseNameEn: 'Mild Skin and Soft Tissue Infections (Cellulitis, Erysipelas, Impetigo)',
    clinicalSetting: 'primary_care',
    line: 'first_choice',
    titleVi: 'WHO Da Mô Mềm Nhẹ: Cloxacillin / Cefalexin HOẶC Amox/Clav uống',
    titleEn: 'WHO Mild SSTI: Cloxacillin / Cefalexin OR Amox/Clav oral',
    durationVi: '5–7 ngày',
    durationEn: '5-7 days',
    nonAntibioticCareVi: 'Vệ sinh sạch vết thương, chườm ấm, kê cao chi tổn thương để giảm phù nề tĩnh mạch.',
    drugs: [
      {
        nameVi: 'Cloxacillin đường uống',
        drugName: 'Cloxacillin',
        nameEn: 'Cloxacillin oral',
        standardDoseVi: '500 mg uống mỗi 6 giờ (trước ăn 1 giờ hoặc sau ăn 2 giờ)',
        dosageVi: '500 mg uống mỗi 6 giờ',
        route: 'PO',
        hasDosingCalculator: false,
        awareCategory: 'Access',
        line: 'first_choice'
      },
      {
        nameVi: 'Cefalexin (Cephalosporin thế hệ 1)',
        drugName: 'Cefalexin',
        nameEn: 'Cefalexin oral',
        standardDoseVi: '500 mg uống mỗi 6 giờ (hoặc 1g mỗi 12 giờ)',
        dosageVi: '500 mg uống mỗi 6 giờ',
        route: 'PO',
        hasDosingCalculator: false,
        awareCategory: 'Access',
        line: 'first_choice'
      },
      {
        drugId: 'amox_clav',
        nameVi: 'Amoxicillin/Clavulanic acid',
        drugName: 'Amoxicillin/Clavulanate',
        nameEn: 'Amoxicillin+clavulanic acid oral',
        standardDoseVi: '500 mg + 125 mg uống mỗi 8 giờ',
        dosageVi: '500/125 mg uống mỗi 8 giờ',
        route: 'PO',
        hasDosingCalculator: true,
        awareCategory: 'Access',
        line: 'first_choice'
      },
      {
        drugId: 'clindamycin',
        nameVi: 'Clindamycin (Lựa chọn thứ hai khi dị ứng penicillin)',
        drugName: 'Clindamycin',
        nameEn: 'Clindamycin oral',
        standardDoseVi: '300 mg - 450 mg uống mỗi 8 giờ',
        dosageVi: '300-450 mg uống mỗi 8 giờ',
        route: 'PO',
        hasDosingCalculator: true,
        awareCategory: 'Access',
        line: 'second_choice'
      }
    ],
    combinationRulesVi: [
      'Đại đa số viêm mô tế bào cộng đồng do Liên cầu nhóm A (GAS) và Tụ cầu nhạy methicillin (MSSA), kháng sinh nhóm Tiếp cận (Access) đạt hiệu quả khỏi bệnh > 95%.'
    ],
    source: { doc: 'WHO_AWaRe_2022', page: [193, 196], note: 'Chapter 16: Mild SSTI' }
  },

  // --- Chapter 37: Necrotizing Fasciitis ---
  {
    id: 'who_necrotizing_fasciitis_adult',
    site: 'skin_soft_tissue',
    population: 'adult',
    riskGroup: 'group_2',
    guidelineSource: 'who',
    chapterNumber: 37,
    diseaseNameVi: 'Nhiễm khuẩn hoại tử mô mềm tối cấp – Viêm cân mạc hoại tử (Necrotizing Fasciitis)',
    diseaseNameEn: 'Necrotizing Soft Tissue Infections (Necrotizing Fasciitis)',
    clinicalSetting: 'hospital',
    line: 'first_choice',
    titleVi: 'WHO Viêm Cân Hoại Tử: Piperacillin/Tazo + Clindamycin (+/- Vancomycin)',
    titleEn: 'WHO Necrotizing Fasciitis: Pip/Tazo + Clindamycin (+/- Vancomycin)',
    durationVi: '2 đến 3 tuần (tùy thuộc mức độ cắt lọc ngoại khoa và ổn định mô mềm)',
    durationEn: '2-3 weeks (guided by debridement)',
    drugs: [
      {
        drugId: 'piperacillin_tazo',
        nameVi: 'Piperacillin/Tazobactam IV',
        drugName: 'Piperacillin/Tazobactam',
        nameEn: 'Piperacillin+tazobactam IV',
        standardDoseVi: '4,5 g IV mỗi 6 giờ truyền tĩnh mạch 3 giờ',
        dosageVi: '4.5 g IV mỗi 6 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Watch',
        line: 'first_choice'
      },
      {
        drugId: 'clindamycin',
        nameVi: 'Clindamycin IV (BẮT BUỘC để ức chế độc tố vi khuẩn - Anti-toxin)',
        drugName: 'Clindamycin',
        nameEn: 'Clindamycin IV',
        standardDoseVi: '900 mg IV mỗi 8 giờ truyền tĩnh mạch',
        dosageVi: '900 mg IV mỗi 8 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Access',
        line: 'first_choice',
        infusionNoteVi: 'Tác dụng ức chế tổng hợp độc tố (anti-toxin effect) của Liên cầu sinh độc tố (Streptococcus pyogenes) và Tụ cầu vàng.'
      },
      {
        drugId: 'vancomycin',
        nameVi: 'Vancomycin (Thêm khi nghi ngờ MRSA)',
        drugName: 'Vancomycin',
        nameEn: 'Vancomycin IV',
        standardDoseVi: '15–20 mg/kg IV mỗi 12 giờ',
        dosageVi: '15-20 mg/kg mỗi 12 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Watch',
        line: 'first_choice'
      }
    ],
    combinationRulesVi: [
      'PHẪU THUẬT CẮT LỌC MÔ HOẠI TỬ KHẨN CẤP LÀ BIỆN PHÁP SỐNG CÒN SỐ 1, không được trì hoãn phẫu thuật.',
      'Clindamycin 900mg q8h là thành phần bắt buộc để dập tắt cơn bão độc tố gây sốc nhiễm độc.'
    ],
    source: { doc: 'WHO_AWaRe_2022', page: [523, 526], note: 'Chapter 37: Necrotizing fasciitis' }
  },

  // =======================================================================
  // 7. BONE & JOINT, FEBRILE NEUTROPENIA, SURGICAL PROPHYLAXIS
  // =======================================================================

  // --- Chapter 35: Acute Bacterial Osteomyelitis ---
  {
    id: 'who_osteomyelitis_adult',
    site: 'skin_soft_tissue',
    population: 'adult',
    riskGroup: 'group_2',
    guidelineSource: 'who',
    chapterNumber: 35,
    diseaseNameVi: 'Viêm tủy xương cấp tính do vi khuẩn (Acute Osteomyelitis)',
    diseaseNameEn: 'Acute Bacterial Osteomyelitis',
    clinicalSetting: 'hospital',
    line: 'first_choice',
    titleVi: 'WHO Viêm Tủy Xương: Cloxacillin IV liều cao (2g q6h) HOẶC Cefazolin / Ceftriaxone',
    titleEn: 'WHO Osteomyelitis: High-Dose IV Cloxacillin OR Cefazolin / Ceftriaxone',
    durationVi: '4 đến 6 tuần ở người lớn (~3 tuần ở trẻ em không biến chứng)',
    durationEn: '4-6 weeks in adults (~3 weeks in children)',
    drugs: [
      {
        nameVi: 'Cloxacillin IV (Liều cao ngấm xương)',
        drugName: 'Cloxacillin',
        nameEn: 'Cloxacillin IV',
        standardDoseVi: '2 g IV mỗi 6 giờ (có thể tăng tới 12 g/ngày để tăng nồng độ vào mô xương)',
        dosageVi: '2 g IV mỗi 6 giờ',
        route: 'IV',
        hasDosingCalculator: false,
        awareCategory: 'Access',
        line: 'first_choice'
      },
      {
        drugId: 'cefazolin',
        nameVi: 'Cefazolin (Lựa chọn thay thế)',
        drugName: 'Cefazolin',
        nameEn: 'Cefazolin IV',
        standardDoseVi: '2 g IV mỗi 8 giờ',
        dosageVi: '2 g IV mỗi 8 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Access',
        line: 'first_choice'
      },
      {
        drugId: 'vancomycin',
        nameVi: 'Vancomycin (Khi nghi ngờ MRSA)',
        drugName: 'Vancomycin',
        nameEn: 'Vancomycin IV',
        standardDoseVi: '15–20 mg/kg IV mỗi 12 giờ',
        dosageVi: '15-20 mg/kg mỗi 12 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Watch',
        line: 'second_choice'
      }
    ],
    combinationRulesVi: [
      'Thời gian điều trị dài ngày (4-6 tuần). Cần phối hợp sinh thiết xương hoặc cấy máu để định danh vi khuẩn chính xác.'
    ],
    source: { doc: 'WHO_AWaRe_2022', page: [489, 492], note: 'Chapter 35: Osteomyelitis' }
  },

  // --- Chapter 39: Febrile Neutropenia ---
  {
    id: 'who_febrile_neutropenia_adult',
    site: 'sepsis',
    population: 'adult',
    riskGroup: 'group_2',
    guidelineSource: 'who',
    chapterNumber: 39,
    diseaseNameVi: 'Sốt giảm bạch cầu trung tính (Febrile Neutropenia) – Nguy cơ cao',
    diseaseNameEn: 'Febrile Neutropenia – High Risk',
    clinicalSetting: 'hospital',
    line: 'first_choice',
    titleVi: 'WHO Sốt Hạ BC: Piperacillin/Tazo 4.5g q6h HOẶC Meropenem 1g q8h',
    titleEn: 'WHO Febrile Neutropenia: Pip/Tazo 4.5g q6h OR Meropenem 1g q8h',
    durationVi: 'Cho đến khi hết sốt ít nhất 48 giờ VÀ cải thiện lâm sàng (nguy cơ thấp: 7 ngày)',
    durationEn: 'Afebrile for >= 48h and clinically resolved (low-risk: 7 days)',
    drugs: [
      {
        drugId: 'piperacillin_tazo',
        nameVi: 'Piperacillin/Tazobactam (Lựa chọn đầu tay)',
        drugName: 'Piperacillin/Tazobactam',
        nameEn: 'Piperacillin+tazobactam IV',
        standardDoseVi: '4,5 g IV mỗi 6 giờ truyền 3-4 giờ',
        dosageVi: '4.5 g IV mỗi 6 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Watch',
        line: 'first_choice'
      },
      {
        drugId: 'meropenem',
        nameVi: 'Meropenem (Lựa chọn thứ hai khi nghi ngờ ESBL hoặc sốc)',
        drugName: 'Meropenem',
        nameEn: 'Meropenem IV',
        standardDoseVi: '1 g IV mỗi 8 giờ truyền 3 giờ',
        dosageVi: '1 g IV mỗi 8 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Watch',
        line: 'second_choice'
      },
      {
        drugId: 'amikacin',
        nameVi: 'Amikacin (Cân nhắc bổ sung khi nghi ngờ trực khuẩn Gram âm đa kháng)',
        drugName: 'Amikacin',
        nameEn: 'Amikacin IV',
        standardDoseVi: '15 mg/kg IV mỗi 24 giờ',
        dosageVi: '15 mg/kg mỗi 24 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Access',
        line: 'second_choice'
      },
      {
        drugId: 'vancomycin',
        nameVi: 'Vancomycin (Bổ sung khi nghi ngờ MRSA hoặc nhiễm trùng catheter CVC)',
        drugName: 'Vancomycin',
        nameEn: 'Vancomycin IV',
        standardDoseVi: '15-20 mg/kg IV mỗi 12 giờ',
        dosageVi: '15-20 mg/kg mỗi 12 giờ',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Watch',
        line: 'second_choice'
      }
    ],
    combinationRulesVi: [
      'Bắt buộc dùng kháng sinh ngay cả khi chưa tìm thấy ổ nhiễm trùng rõ ràng nếu ANC < 500 cells/mcL kèm sốt.',
      'Khuyến cáo ngừng kháng sinh dựa trên lâm sàng (hết sốt ≥ 48h và ổn định) chứ không bắt buộc chờ số lượng bạch cầu hồi phục.'
    ],
    source: { doc: 'WHO_AWaRe_2022', page: [545, 548], note: 'Chapter 39: Febrile neutropenia' }
  },

  // --- Chapter 40: Surgical Prophylaxis ---
  {
    id: 'who_surgical_prophylaxis',
    site: 'skin_soft_tissue',
    population: 'adult',
    riskGroup: 'group_1',
    guidelineSource: 'who',
    chapterNumber: 40,
    diseaseNameVi: 'Kháng sinh dự phòng phẫu thuật (Surgical Antibiotic Prophylaxis)',
    diseaseNameEn: 'Surgical Antibiotic Prophylaxis',
    clinicalSetting: 'hospital',
    line: 'first_choice',
    titleVi: 'WHO Dự Phòng Mổ: Cefazolin 2g IV liều duy nhất trong 120 phút trước rạch da',
    titleEn: 'WHO Surgical Prophylaxis: Cefazolin 2g IV single pre-op dose within 120 min',
    durationVi: 'Liều duy nhất trước mổ. TUYỆT ĐỐI KHÔNG tiếp tục sau khi đóng vết mổ',
    durationEn: 'Single pre-operative dose. No post-operative doses recommended',
    drugs: [
      {
        drugId: 'cefazolin',
        nameVi: 'Cefazolin (Chuẩn vàng dự phòng phẫu thuật toàn cầu)',
        drugName: 'Cefazolin',
        nameEn: 'Cefazolin IV',
        standardDoseVi: '2 g IV liều duy nhất trong vòng 120 phút trước khi rạch da (bệnh nhân > 120kg dùng 3g)',
        dosageVi: '2 g IV liều duy nhất',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Access',
        line: 'first_choice',
        infusionNoteVi: 'Tiêm trước khi rạch da < 120 phút để đạt nồng độ tối đa tại mô khi rạch.'
      },
      {
        drugId: 'metronidazol',
        nameVi: 'Metronidazole (Bổ sung khi phẫu thuật đường ruột/đại trực tràng)',
        drugName: 'Metronidazole',
        nameEn: 'Metronidazole IV',
        standardDoseVi: '500 mg IV liều duy nhất trước rạch da',
        dosageVi: '500 mg IV liều duy nhất',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Access',
        line: 'first_choice'
      },
      {
        drugId: 'amox_clav',
        nameVi: 'Amoxicillin/Clavulanate IV (Lựa chọn thứ hai)',
        drugName: 'Amoxicillin/Clavulanate',
        nameEn: 'Amoxicillin+clavulanic acid IV',
        standardDoseVi: '2 g + 200 mg (2.2g) IV liều duy nhất trước rạch da',
        dosageVi: '2.2 g IV liều duy nhất',
        route: 'IV',
        hasDosingCalculator: true,
        awareCategory: 'Access',
        line: 'second_choice'
      }
    ],
    combinationRulesVi: [
      'WHO 2022 KHUYẾN CÁO MẠNH MẼ: Dùng kháng sinh sau phẫu thuật không làm giảm nhiễm trùng vết mổ mà làm tăng nguy cơ kháng thuốc và tiêu chảy C. difficile.',
      'Chỉ bổ sung thêm 1 liều trong mổ nếu cuộc mổ kéo dài hơn 2 lần chu kỳ bán thải (> 4 giờ với Cefazolin) hoặc mất máu > 1.500 mL.'
    ],
    source: { doc: 'WHO_AWaRe_2022', page: [562, 565], note: 'Chapter 40: Surgical prophylaxis' }
  }
];

/**
 * Filter and search WHO AWaRe regimens
 */
export function findWhoRegimens(
  site: InfectionSite | string,
  population: Population = 'adult',
  options?: {
    sepsisSource?: SepsisSource;
    setting?: 'all' | 'primary_care' | 'hospital';
    line?: 'all' | 'first_choice' | 'second_choice';
    awareCategory?: 'all' | 'Access' | 'Watch' | 'Reserve';
  }
): EmpiricRegimen[] {
  return WHO_REGIMENS.filter(reg => {
    // Population filter: if specific population matches
    if (reg.population !== population) {
      // allow adult regimens as general fallback if no pediatric version
      const hasSpecificPeds = WHO_REGIMENS.some(r => r.site === site && r.population === population);
      if (hasSpecificPeds) return false;
    }

    // Site match
    if (reg.site !== site) {
      // Allow gastrointestinal / peritoneal crossover
      const isPeritonealMatch = (site === 'peritoneal' || site === 'gastrointestinal') &&
        (reg.site === 'peritoneal' || reg.site === 'gastrointestinal');
      if (!isPeritonealMatch) return false;
    }

    // Sepsis source match if provided
    if (site === 'sepsis' && options?.sepsisSource && reg.sepsisSource && reg.sepsisSource !== options.sepsisSource) {
      return false;
    }

    // Setting filter
    if (options?.setting && options.setting !== 'all' && reg.clinicalSetting !== options.setting) {
      return false;
    }

    // Line filter
    if (options?.line && options.line !== 'all' && reg.line !== options.line) {
      return false;
    }

    // Aware category filter
    if (options?.awareCategory && options.awareCategory !== 'all') {
      const hasCat = reg.drugs.some(d => d.awareCategory === options.awareCategory);
      if (!hasCat) return false;
    }

    return true;
  });
}
