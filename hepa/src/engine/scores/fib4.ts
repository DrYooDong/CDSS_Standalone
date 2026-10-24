/**
 * HepaCDSS Non-invasive Liver Fibrosis Assessment: FIB-4 & APRI
 * Chuẩn hóa theo hướng dẫn của ACG (2017), EASL (2024) và WHO.
 */

import { ApriResult, Fib4Result } from '../../types';

export class FibrosisEngine {
  /**
   * Tính chỉ số FIB-4 (Fibrosis-4 Index):
   * FIB-4 = (Tuổi * AST) / (Tiểu cầu * sqrt(ALT))
   * Lưu ý:
   * - Tuổi (năm)
   * - AST, ALT (U/L)
   * - Tiểu cầu (10^9/L hay G/L)
   */
  static calculateFib4(
    age: number,
    ast: number,
    alt: number,
    platelets: number,
    diseaseType: 'masld' | 'viral' = 'masld'
  ): Fib4Result | undefined {
    if (age <= 0 || ast <= 0 || alt <= 0 || platelets <= 0) {
      return undefined;
    }

    const score = Number(((age * ast) / (platelets * Math.sqrt(alt))).toFixed(2));

    // Ngưỡng cutoff theo EASL 2024 & ACG 2017:
    // Với người >= 65 tuổi trong MASLD, ngưỡng dưới được nới rộng lên 2.0
    const isElderly = age >= 65;
    const lowerCutoff = diseaseType === 'masld' ? (isElderly ? 2.0 : 1.3) : 1.45;
    const upperCutoff = diseaseType === 'masld' ? 2.67 : 3.25;

    let riskCategory: 'low' | 'indeterminate' | 'high';
    let stageDescription = '';
    let recommendation = '';
    let ageAdjustedNote = '';

    if (isElderly && diseaseType === 'masld') {
      ageAdjustedNote = 'Bệnh nhân >= 65 tuổi: Ngưỡng loại trừ thấp được hiệu chỉnh lên 2.00 (theo EASL/AASLD).';
    }

    if (score < lowerCutoff) {
      riskCategory = 'low';
      stageDescription = 'F0 - F1: Nguy cơ xơ hóa tiến triển thấp (Giá trị dự đoán âm tính NPV > 90%).';
      recommendation = 'Quản lý theo dõi định kỳ tại Y tế cơ sở. Đánh giá lại FIB-4 sau 1 - 2 năm kết hợp kiểm soát yếu tố nguy cơ tim mạch/chuyển hóa.';
    } else if (score > upperCutoff) {
      riskCategory = 'high';
      stageDescription = 'F3 - F4: Nguy cơ cao xơ hóa tiến triển / Xơ gan.';
      recommendation = 'Chuyển khám Chuyên khoa Tiêu hóa - Gan Mật. Chỉ định đo độ đàn hồi mô gan (FibroScan/VCTE) hoặc xem xét sinh thiết gan, tầm soát giãn tĩnh mạch thực quản.';
    } else {
      riskCategory = 'indeterminate';
      stageDescription = 'Vùng xám (Indeterminate Risk): Không thể loại trừ hay khẳng định xơ hóa tiến triển chỉ bằng FIB-4.';
      recommendation = 'Khuyến cáo áp dụng lộ trình 2 bậc (EASL 2024): Chỉ định đo độ đàn hồi mô gan (FibroScan / VCTE) hoặc xét nghiệm chuyên sâu ELF test để phân tầng nguy cơ.';
    }

    return {
      score,
      riskCategory,
      stageDescription,
      recommendation,
      ageAdjustedNote: ageAdjustedNote || undefined,
    };
  }

  /**
   * Tính chỉ số APRI (AST-to-Platelet Ratio Index):
   * APRI = ((AST / ULN_AST) / Tiểu cầu) * 100
   */
  static calculateApri(ast: number, astUln: number, platelets: number): ApriResult | undefined {
    if (ast <= 0 || astUln <= 0 || platelets <= 0) {
      return undefined;
    }

    const score = Number((((ast / astUln) / platelets) * 100).toFixed(2));

    let riskCategory: 'low' | 'high';
    let stageDescription = '';
    let recommendation = '';

    if (score < 0.5) {
      riskCategory = 'low';
      stageDescription = 'Ít khả năng xơ hóa gan có ý nghĩa lâm sàng (NPV cao).';
      recommendation = 'Theo dõi thường quy.';
    } else if (score >= 1.5) {
      riskCategory = 'high';
      stageDescription = 'Nguy cơ xơ gan (F4) cao (Độ đặc hiệu > 90% ở viêm gan virus mạn).';
      recommendation = 'Chuyển chuyên khoa Gan Mật đánh giá xơ gan và tầm soát biến chứng tăng áp lực tĩnh mạch cửa.';
    } else {
      riskCategory = 'low';
      stageDescription = 'Nghi ngờ có xơ hóa gan đáng kể (F2 - F3).';
      recommendation = 'Kết hợp thêm FibroScan để xác định độ xơ hóa.';
    }

    return {
      score,
      riskCategory,
      stageDescription,
      recommendation,
    };
  }
}
