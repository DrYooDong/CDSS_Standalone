import { NfsResult } from '../../types';

/**
 * Tính toán Thang điểm Xơ hóa Gan Nhiễm Mỡ (NAFLD Fibrosis Score - NFS)
 * Công thức BSG 2018 & BMJ 2025:
 * NFS = -1.675 + 0.037*Age + 0.094*BMI + 1.13*IFG/Diabetes(1/0) + 0.99*(AST/ALT) - 0.013*Platelets(10^9/L) - 0.66*Albumin(g/dL)
 */
export function calculateNFS(params: {
  age: number;
  bmi: number;
  hasDiabetesOrIFG: boolean;
  ast: number;
  alt: number;
  plateletsG_L: number; // 10^9/L
  albuminG_dL: number; // g/dL
}): NfsResult {
  const { age, bmi, hasDiabetesOrIFG, ast, alt, plateletsG_L, albuminG_dL } = params;

  if (alt <= 0 || plateletsG_L <= 0 || albuminG_dL <= 0) {
    return {
      score: 0,
      stage: 'Chưa đủ dữ liệu',
      stageDescription: 'Cần đầy đủ thông số ALT, Tiểu cầu, Albumin hợp lệ.',
      ageAdjustedNote: ''
    };
  }

  const ifgVal = hasDiabetesOrIFG ? 1 : 0;
  const astAltRatio = ast / alt;

  const rawNfs =
    -1.675 +
    0.037 * age +
    0.094 * bmi +
    1.13 * ifgVal +
    0.99 * astAltRatio -
    0.013 * plateletsG_L -
    0.66 * albuminG_dL;

  const score = Number(rawNfs.toFixed(3));
  const isElderly = age >= 65;
  const lowCutoff = isElderly ? 0.12 : -1.455;
  const highCutoff = 0.675;

  let stage = '';
  let stageDescription = '';

  if (score < lowCutoff) {
    stage = 'F0 - F2 (Nguy cơ xơ hóa thấp)';
    stageDescription =
      'Ít khả năng xơ hóa tiến triển (Giá trị dự đoán âm tính NPV ~90%). Có thể an tâm quản lý và theo dõi định kỳ tại y tế ban đầu.';
  } else if (score >= lowCutoff && score <= highCutoff) {
    stage = 'Vùng xám / Trung gian';
    stageDescription =
      'Điểm số nằm trong vùng không xác định. Khuyến cáo thực hiện xét nghiệm bậc hai không xâm lấn (đo độ đàn hồi mô gan VCTE/FibroScan) hoặc chuyển chuyên khoa Gan mật.';
  } else {
    stage = 'F3 - F4 (Nguy cơ xơ hóa tiến triển cao)';
    stageDescription =
      'Nguy cơ xơ hóa nặng hoặc xơ gan (Giá trị dự đoán dương tính PPV ~90%). Chỉ định khám chuyên khoa Gan mật, tầm soát giãn tĩnh mạch thực quản và siêu âm sàng lọc ung thư biểu mô tế bào gan (HCC) mỗi 6 tháng.';
  }

  const ageAdjustedNote = isElderly
    ? 'Điểm cắt NFS hiệu chỉnh cho người ≥65 tuổi (BSG 2018): Ngưỡng loại trừ được nâng lên < 0.12 (thay vì < -1.455) nhằm tăng độ đặc hiệu, tránh dương tính giả do tuổi tác.'
    : 'Điểm cắt NFS tiêu chuẩn người trưởng thành <65 tuổi: < -1.455 (Nguy cơ thấp), -1.455 đến 0.675 (Vùng xám), > 0.675 (Nguy cơ cao).';

  return {
    score,
    stage,
    stageDescription,
    ageAdjustedNote
  };
}
