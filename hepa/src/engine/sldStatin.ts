import {
  Gender,
  SldClassification,
  StatinSafetyGuidance,
  ExtrahepaticAstEvaluation,
  IsolatedAlpVitaminDAdvice,
  IlftReflexScreen,
  LiverInjuryPattern
} from '../types';

/**
 * 1. Phân loại Bệnh Gan Thoái Hóa Mỡ (Steatotic Liver Disease - SLD Delphi 2023 Consensus)
 * Phân định MASLD vs MetALD vs ALD dựa trên các yếu tố chuyển hóa và lượng cồn uống hàng tuần.
 */
export function classifySLD(params: {
  gender: Gender;
  totalAlcoholGramsPerWeek: number;
  auditCScore?: number;
  bmi?: number;
  hasDiabetesOrMetabolicRisk: boolean;
}): SldClassification {
  const { gender, totalAlcoholGramsPerWeek, auditCScore, bmi, hasDiabetesOrMetabolicRisk } = params;

  const hasCardiometabolic = (bmi !== undefined && bmi >= 23) || hasDiabetesOrMetabolicRisk;

  // Ngưỡng cồn theo giới:
  // Nữ: ngưỡng MASLD < 140g/tuần (~20g/ngày), ngưỡng ALD > 350g/tuần (~50g/ngày)
  // Nam: ngưỡng MASLD < 210g/tuần (~30g/ngày), ngưỡng ALD > 420g/tuần (~60g/ngày)
  const femaleThresholdGrams = 140;
  const maleThresholdGrams = 210;
  const femaleUpperGrams = 350;
  const maleUpperGrams = 420;

  const threshold = gender === 'female' ? femaleThresholdGrams : maleThresholdGrams;
  const upper = gender === 'female' ? femaleUpperGrams : maleUpperGrams;

  if (totalAlcoholGramsPerWeek > upper || (auditCScore !== undefined && auditCScore >= 8)) {
    return {
      category: 'ALD',
      title: 'Bệnh Gan Liên Quan Rượu (Alcohol-related Liver Disease - ALD)',
      subtext: `Mức tiêu thụ cồn vượt ngưỡng ALD (> ${upper} g/tuần, tương đương > ${Math.round(upper / 8)} đơn vị cồn UK/tuần). Nguy cơ hoại tử tế bào gan và xơ hóa tiến triển nhanh chóng nếu tiếp tục uống rượu bia.`,
      alcoholIntakeGramsPerWeek: totalAlcoholGramsPerWeek,
      alcoholThresholdNote: `Ngưỡng ALD theo đồng thuận quốc tế: Nữ > 350 g/tuần (>50g/ngày), Nam > 420 g/tuần (>60g/ngày).`,
      metabolicCriteriaMet: hasCardiometabolic,
      recommendations: [
        'Cai rượu hoàn toàn: Biện pháp can thiệp sống còn số 1 giúp ngăn chặn tiến triển tổn thương mô học và giảm nguy cơ mất bù.',
        'Hỗ trợ tâm lý & Chuyên khoa cai nghiện: Nếu điểm AUDIT > 19 hoặc có hội chứng cai rượu.',
        'Sàng lọc định kỳ biến chứng: Siêu âm bụng, tính điểm FIB-4 / APRI, nội soi tầm soát giãn tĩnh mạch thực quản nếu có xơ gan.'
      ]
    };
  }

  if (hasCardiometabolic && totalAlcoholGramsPerWeek >= threshold) {
    return {
      category: 'MetALD',
      title: 'Bệnh Gan Nhiễm Mỡ Do Chuyển Hóa & Rượu Đồng Thời (MetALD)',
      subtext: `Thỏa tiêu chuẩn tim mạch - chuyển hóa (BMI ≥ 23 hoặc ĐTĐ) kết hợp mức uống rượu trung gian (${totalAlcoholGramsPerWeek} g/tuần). Hai yếu tố này hiệp đồng làm tăng gấp đôi tốc độ tiến triển xơ gan và nguy cơ ung thư gan so với từng yếu tố đơn độc.`,
      alcoholIntakeGramsPerWeek: totalAlcoholGramsPerWeek,
      alcoholThresholdNote: `Khoảng tiêu thụ cồn MetALD: Nữ 140 - 350 g/tuần (20 - 50 g/ngày); Nam 210 - 420 g/tuần (30 - 60 g/ngày).`,
      metabolicCriteriaMet: true,
      recommendations: [
        'Giảm tiêu thụ rượu bia về 0: Loại bỏ hoàn toàn gánh nặng kép từ ethanol lên ty thể gan.',
        'Kiểm soát tích cực hội chứng chuyển hóa: Giảm 7-10% cân nặng, kiểm soát HbA1c < 7.0%, tối ưu hóa huyết áp và lipid máu.',
        'Đo độ đàn hồi gan (FibroScan/VCTE) kết hợp FIB-4 để đánh giá xơ hóa mạn tính.'
      ]
    };
  }

  if (hasCardiometabolic && totalAlcoholGramsPerWeek < threshold) {
    return {
      category: 'MASLD',
      title: 'Bệnh Gan Nhiễm Mỡ Liên Quan Rối Loạn Chuyển Hóa (MASLD / MASH)',
      subtext: `Có ít nhất 1 tiêu chí tim mạch - chuyển hóa (thừa cân/béo phì, đái tháo đường, rối loạn lipid máu) kèm lượng cồn tiêu thụ tối thiểu (< ${threshold} g/tuần).`,
      alcoholIntakeGramsPerWeek: totalAlcoholGramsPerWeek,
      alcoholThresholdNote: `Tiêu thụ cồn trong giới hạn cho phép của MASLD: Nữ < 140 g/tuần, Nam < 210 g/tuần.`,
      metabolicCriteriaMet: true,
      recommendations: [
        'Điều chỉnh lối sống toàn diện: Chế độ ăn Địa Trung Hải (giảm đường fructose và chất béo bão hòa), tập thể lực nhịp điệu ≥ 150 phút/tuần, mục tiêu giảm 5-10% trọng lượng cơ thể.',
        'Ưu tiên nhóm thuốc đái tháo đường bảo vệ gan: Nhóm đồng vận thụ thể GLP-1 (Semaglutide/Liraglutide) hoặc ức chế SGLT2 (Dapagliflozin/Empagliflozin) đã chứng minh cải thiện viêm gan nhiễm mỡ.',
        'Phân tầng xơ hóa bằng FIB-4 hoặc NFS định kỳ mỗi 1-2 năm.'
      ]
    };
  }

  return {
    category: 'Non-SLD',
    title: 'Không Thỏa Tiêu Chuẩn Điển Hình Của Bệnh Gan Thoái Hóa Mỡ',
    subtext: 'Không ghi nhận yếu tố nguy cơ tim mạch chuyển hóa rõ rệt và mức tiêu thụ cồn thấp.',
    alcoholIntakeGramsPerWeek: totalAlcoholGramsPerWeek,
    alcoholThresholdNote: `Cần khảo sát thêm các căn nguyên viêm gan virus (B, C), tự miễn, hoặc tổn thương gan do thuốc.`,
    metabolicCriteriaMet: false,
    recommendations: [
      'Tìm nguyên nhân khác gây bất thường sinh hóa gan (khảo sát Bilan Bậc 1).',
      'Theo dõi lại men gan sau 4 tuần.'
    ]
  };
}

/**
 * 2. Hướng dẫn An Toàn Dùng Thuốc Statin (BSG 2018 & BMJ 2025)
 */
export function evaluateStatinSafety(params: {
  isTakingStatin: boolean;
  altMultiples: number;
  astMultiples: number;
}): StatinSafetyGuidance | undefined {
  const { isTakingStatin, altMultiples, astMultiples } = params;
  if (!isTakingStatin) return undefined;

  const isUnder3x = altMultiples < 3.0 && astMultiples < 3.0;

  if (isUnder3x) {
    return {
      isSafe: true,
      badge: 'An toàn tiếp tục',
      title: 'An Toàn Tiếp Tục Statin (BSG 2018 & BMJ 2025 Guidance)',
      recommendation:
        'Men gan tăng nhẹ/vừa (< 3x ULN) không phải là chỉ định ngừng Statin! Bệnh nhân MASLD có nguy cơ tử vong do biến cố tim mạch cao hơn nguy cơ do suy gan; tiếp tục Statin bảo vệ tim mạch và có thể cải thiện viêm gan thoái hóa mỡ.',
      evidenceNote:
        'Theo Hướng dẫn Hội Tiêu hóa Anh (BSG 2018) và Hiệp hội Lipid Quốc gia (NLA): Statin an toàn cao ở người có bất thường men gan mạn tính. Chỉ xem xét tạm ngưng hoặc giảm liều khi ALT/AST tăng liên tục ≥ 3x ULN hoặc xuất hiện triệu chứng đau cơ/vàng da.'
    };
  }

  return {
    isSafe: false,
    badge: 'Tạm ngưng & Đánh giá lại',
    title: 'Men Gan Tăng Đáng Kể (≥ 3x ULN) Trên Bệnh Nhân Dùng Statin',
    recommendation:
      'Khuyến cáo tạm ngừng Statin, kiểm tra lại ALT/AST sau 2-4 tuần; đánh giá nguy cơ tổn thương gan do thuốc (tính điểm RUCAM) và loại trừ các bệnh gan cấp khác.',
    evidenceNote:
      'Nếu men gan trở về bình thường sau khi ngừng Statin, có thể cân nhắc đổi sang Statin chuyển hóa ít qua CYP3A4 (như Pravastatin, Rosuvastatin) với liều thấp hơn hoặc dùng cách ngày kết hợp Ezetimibe.'
  };
}

/**
 * 3. Đánh giá Nguồn Gốc AST Ngoài Gan / Tiêu Cơ Vân
 */
export function evaluateExtrahepaticAst(params: {
  ast: number;
  alt: number;
  astUln: number;
  altUln: number;
  ckUL?: number;
  strenuousExercise?: boolean;
}): ExtrahepaticAstEvaluation {
  const { ast, alt, astUln, altUln, ckUL, strenuousExercise } = params;

  const isCkElevated = Boolean(ckUL && ckUL > 1000);
  const isAstDisproportionate = ast > 150 && ast > alt * 2.5;
  const isTriggered = Boolean(
    isCkElevated || (isAstDisproportionate && (strenuousExercise || (ckUL && ckUL > 400)))
  );

  if (isTriggered) {
    return {
      isTriggered: true,
      isRhabdo: Boolean(ckUL && ckUL > 1000),
      title: 'Báo Động Tăng AST Nguồn Gốc Cơ Vân / Tiêu Cơ Vân (Rhabdomyolysis)',
      note: `AST (${ast} U/L) tăng vượt trội so với ALT (${alt} U/L)${ckUL ? `, kèm CK tăng cao (${ckUL} U/L)` : ''}${strenuousExercise ? ', tiền sử vận động thể lực nặng' : ''}. Nguồn gốc enzyme xuất phát từ cơ bắp hoặc cơ tim, không phải hoại tử tế bào gan!`,
      recommendation:
        'Chỉ định ngay xét nghiệm Creatine Kinase (CK), Troponin I/T, điện giải đồ, tổng phân tích nước tiểu tìm Myoglobin niệu. Truyền dịch kiềm hóa nước tiểu bảo vệ thận nếu CK > 5000 U/L để phòng ngừa suy thận cấp do sắc tố cơ.'
    };
  }

  return {
    isTriggered: false,
    isRhabdo: false,
    title: 'AST Phù Hợp Nguồn Gốc Gan',
    note: 'Không có bằng chứng tổn thương cơ vân nặng.',
    recommendation: ''
  };
}

/**
 * 4. Tư Vấn Thiếu Vitamin D Khi Tăng ALP Xương Đơn Độc
 */
export function evaluateIsolatedAlpVitaminD(params: {
  alpMultiples: number;
  altMultiples: number;
  astMultiples: number;
  ggtMultiples?: number;
  boneAlpSuspicion?: boolean;
  vitaminDNgMl?: number;
}): IsolatedAlpVitaminDAdvice {
  const { alpMultiples, altMultiples, astMultiples, ggtMultiples, boneAlpSuspicion, vitaminDNgMl } =
    params;

  const isIsolatedAlp =
    alpMultiples > 1.0 &&
    altMultiples <= 1.2 &&
    astMultiples <= 1.2 &&
    (ggtMultiples === undefined || ggtMultiples <= 1.2);

  if (boneAlpSuspicion || isIsolatedAlp) {
    const isVitDLow = vitaminDNgMl !== undefined && vitaminDNgMl < 20;

    return {
      isTriggered: true,
      recommendation: isVitDLow
        ? `Xác nhận thiếu hụt 25-OH Vitamin D (${vitaminDNgMl} ng/mL < 20 ng/mL). Cường cận giáp thứ phát do thiếu Vitamin D kích thích tạo xương làm tăng ALP. Bổ sung Vitamin D (Colecalciferol 50.000 IU/tuần trong 8 tuần) và kiểm tra lại ALP sau 3-6 tháng.`
        : 'Theo BMJ 2025 & BSG 2018: Thiếu hụt Vitamin D gây cường cận giáp thứ phát là nguyên nhân phổ biến nhất của tăng ALP xương đơn độc (~30% các ca). Khuyến cáo định lượng 25-OH Vitamin D trước khi thực hiện các kỹ thuật chẩn đoán hình ảnh xương tốn kém.'
    };
  }

  return {
    isTriggered: false,
    recommendation: ''
  };
}

/**
 * 5. Hệ Thống Đề Xuất Xét Nghiệm Phản Xạ iLFT (Intelligent Liver Function Testing)
 */
export function generateIlftReflexScreen(params: {
  pattern: LiverInjuryPattern;
  altMultiples: number;
  rRatio: number;
  deRitisRatio: number;
  age: number;
}): IlftReflexScreen {
  const { pattern, altMultiples, rRatio, deRitisRatio, age } = params;

  const tier1: IlftReflexScreen['tier1StandardScreen'] = [
    {
      name: 'HBsAg & Anti-HCV',
      code: 'SERO_VIRAL',
      targetAetiology: 'Viêm gan virus B và C',
      indication: 'Bắt buộc đối với mọi bệnh nhân có bất thường men gan dù không triệu chứng.',
      priority: 'Bắt buộc (Tier 1)'
    },
    {
      name: 'Bilan Sắt: Ferritin & Độ Bão Hòa Transferrin (TSAT)',
      code: 'IRON_PANEL',
      targetAetiology: 'Bệnh ứ sắt mô (Hemochromatosis) & phản ứng viêm',
      indication: 'Tầm soát TSAT ≥ 45% ở nam hoặc ≥ 40% ở nữ.',
      priority: 'Bắt buộc (Tier 1)'
    },
    {
      name: 'Siêu âm Ổ bụng Tổng quát',
      code: 'US_ABDOMEN',
      targetAetiology: 'Đánh giá cấu trúc nhu mô gan, gan nhiễm mỡ, giãn đường mật, lách to, TM cửa',
      indication: 'Tiêu chuẩn ban đầu cho mọi thể tổn thương gan.',
      priority: 'Bắt buộc (Tier 1)'
    }
  ];

  const tier2: IlftReflexScreen['tier2ExtendedScreen'] = [];

  // Nếu tăng tế bào gan hoặc tổn thương hỗn hợp
  if (pattern === 'hepatocellular' || pattern === 'mixed' || rRatio >= 2.0) {
    tier2.push({
      name: 'Kháng Thể Tự Miễn: ANA, ASMA, Định Lượng IgG',
      code: 'AUTOIMMUNE',
      targetAetiology: 'Viêm gan tự miễn (AIH type 1)',
      indication: 'Chỉ định khi men gan tăng kéo dài > 3-6 tháng hoặc đợt bùng phát men gan cấp.',
      priority: 'Mở rộng (Tier 2)'
    });

    if (age <= 55) {
      tier2.push({
        name: 'Định Lượng Ceruloplasmin & Khám Mắt Đèn Khe (Vòng Kayser-Fleischer)',
        code: 'WILSON_SCREEN',
        targetAetiology: 'Bệnh Wilson (Rối loạn chuyển hóa đồng)',
        indication: 'Bắt buộc ở bệnh nhân ≤ 55 tuổi có bất thường men gan không rõ nguyên nhân.',
        priority: 'Mở rộng (Tier 2)'
      });
    }

    tier2.push({
      name: 'Định Lượng Nồng Độ Alpha-1 Antitrypsin (A1AT) & Phenotype',
      code: 'A1AT',
      targetAetiology: 'Thiếu hụt men Alpha-1 Antitrypsin',
      indication: 'Đánh giá bệnh gan mạn tính phối hợp bệnh phổi tắc nghẽn ở người trẻ.',
      priority: 'Chuyên sâu'
    });
  }

  // Nếu tổn thương ứ mật hoặc hỗn hợp
  if (pattern === 'cholestatic' || pattern === 'mixed') {
    tier2.push({
      name: 'Kháng Thể Kháng Ty Thể (Anti-Mitochondrial Antibodies - AMA)',
      code: 'AMA_PBC',
      targetAetiology: 'Viêm đường mật tiên phát (PBC)',
      indication: 'Chỉ định khi ALP tăng ưu thế (đặc biệt ở phụ nữ trung niên).',
      priority: 'Mở rộng (Tier 2)'
    });

    tier2.push({
      name: 'Chụp Cộng Hưởng Từ Đường Mật (MRCP)',
      code: 'MRCP',
      targetAetiology: 'Viêm xơ đường mật tiên phát (PSC), sỏi vi thể, u đường mật',
      indication: 'Kỹ thuật hình ảnh không xâm lấn tiêu chuẩn vàng khi siêu âm không thấy giãn đường mật ngoài gan.',
      priority: 'Mở rộng (Tier 2)'
    });
  }

  return {
    tier1StandardScreen: tier1,
    tier2ExtendedScreen: tier2,
    summary: `Đề xuất lộ trình kiểm tra phản xạ iLFT: Bắt đầu bằng ${tier1.length} xét nghiệm Tier 1 ban đầu; nếu âm tính tiếp tục thực hiện ${tier2.length} xét nghiệm chuyên sâu Tier 2 theo kiểu tổn thương ${pattern}.`
  };
}
