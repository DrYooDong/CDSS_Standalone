/**
 * HepaCDSS Pattern of Injury & Severity Stratification Module
 * Chuẩn hóa theo tài liệu Hướng dẫn Lâm sàng ACG 2017 & EASL 2024.
 */

import {
  BilirubinPredominance,
  CustomULNSettings,
  Gender,
  HepaInputData,
  LiverInjuryPattern,
  TransaminaseSeverity,
  ULNStandard,
} from '../types';

export const DEFAULT_ACG_ULN: CustomULNSettings = {
  altMale: 33,
  altFemale: 25,
  astMale: 33,
  astFemale: 25,
  alp: 120,
  ggtMale: 50,
  ggtFemale: 35,
};

export const DEFAULT_WHO_ULN: CustomULNSettings = {
  altMale: 45,
  altFemale: 35,
  astMale: 40,
  astFemale: 35,
  alp: 125,
  ggtMale: 55,
  ggtFemale: 40,
};

export interface ResolvedULNs {
  altUln: number;
  astUln: number;
  alpUln: number;
  ggtUln: number;
}

export class PatternEngine {
  /**
   * Xác định giới hạn trên bình thường (ULN) phù hợp với giới tính, độ tuổi và chuẩn áp dụng
   */
  static resolveULN(
    gender: Gender,
    standard: ULNStandard = 'acg2017',
    customSettings?: Partial<CustomULNSettings>,
    inputOverrides?: {
      altUln?: number;
      astUln?: number;
      alpUln?: number;
      ggtUln?: number;
    },
    context?: {
      isPregnancyThirdTrimester?: boolean;
      isChildOrAdolescent?: boolean;
    }
  ): ResolvedULNs {
    const base =
      standard === 'who'
        ? DEFAULT_WHO_ULN
        : { ...DEFAULT_ACG_ULN, ...customSettings };

    let altUln = gender === 'male' ? base.altMale : base.altFemale;
    let astUln = gender === 'male' ? base.astMale : base.astFemale;
    let alpUln = base.alp;
    let ggtUln = gender === 'male' ? base.ggtMale : base.ggtFemale;

    // Hiệu chỉnh sinh lý theo tài liệu: Quý 3 thai kỳ hoặc thanh thiếu niên
    if (context?.isChildOrAdolescent) {
      alpUln = 350; // ALP sinh lý xương ở tuổi phát triển
    } else if (context?.isPregnancyThirdTrimester) {
      alpUln = 250; // ALP sinh lý nhau thai
    }

    // Giá trị nhập đè trực tiếp từ phòng xét nghiệm cụ thể (nếu có)
    if (inputOverrides?.altUln && inputOverrides.altUln > 0) altUln = inputOverrides.altUln;
    if (inputOverrides?.astUln && inputOverrides.astUln > 0) astUln = inputOverrides.astUln;
    if (inputOverrides?.alpUln && inputOverrides.alpUln > 0) alpUln = inputOverrides.alpUln;
    if (inputOverrides?.ggtUln && inputOverrides.ggtUln > 0) ggtUln = inputOverrides.ggtUln;

    return { altUln, astUln, alpUln, ggtUln };
  }

  /**
   * Tính Chỉ số R (R Ratio) theo ACG 2017:
   * R = (ALT / ULN_ALT) / (ALP / ULN_ALP)
   */
  static calculateRRatio(alt: number, altUln: number, alp: number, alpUln: number): number {
    const altRatio = alt / altUln;
    const alpRatio = alp / alpUln;
    if (alpRatio <= 0) return altRatio;
    return Number((altRatio / alpRatio).toFixed(2));
  }

  /**
   * Tính Chỉ số nR (dùng cho DILI theo tiêu chuẩn Roussel Uclaf RUCAM):
   * nR = max(ALT/ULN, AST/ULN) / (ALP/ULN)
   */
  static calculateNRRatio(
    alt: number,
    altUln: number,
    ast: number,
    astUln: number,
    alp: number,
    alpUln: number
  ): number {
    const maxTransaminaseRatio = Math.max(alt / altUln, ast / astUln);
    const alpRatio = alp / alpUln;
    if (alpRatio <= 0) return maxTransaminaseRatio;
    return Number((maxTransaminaseRatio / alpRatio).toFixed(2));
  }

  /**
   * Phân loại kiểu tổn thương (Pattern of Liver Injury)
   */
  static determinePattern(
    rRatio: number,
    alt: number,
    altUln: number,
    ast: number,
    astUln: number,
    alp: number,
    alpUln: number,
    totalBilirubinMgDl: number
  ): { pattern: LiverInjuryPattern; description: string } {
    const isAltElevated = alt > altUln;
    const isAstElevated = ast > astUln;
    const isAlpElevated = alp > alpUln;
    const isBilirubinElevated = totalBilirubinMgDl > 1.2;

    if (!isAltElevated && !isAstElevated && !isAlpElevated) {
      if (isBilirubinElevated) {
        return {
          pattern: 'isolated_hyperbilirubinemia',
          description:
            'Tăng Bilirubin đơn độc (Isolated Hyperbilirubinemia) với men gan và ALP hoàn toàn trong giới hạn bình thường.',
        };
      }
      return {
        pattern: 'normal',
        description:
          'Các chỉ số sinh hóa gan (ALT, AST, ALP, Bilirubin) nằm trong khoảng tham chiếu bình thường.',
      };
    }

    if (rRatio > 5) {
      return {
        pattern: 'hepatocellular',
        description:
          'Tổn thương tế bào gan ưu thế (Hepatocellular Pattern, R > 5). ALT/AST tăng vượt trội so với ALP đường mật.',
      };
    } else if (rRatio < 2) {
      return {
        pattern: 'cholestatic',
        description:
          'Hội chứng ứ mật ưu thế (Cholestatic Pattern, R < 2). ALP/GGT tăng vượt trội so với ALT/AST.',
      };
    } else {
      return {
        pattern: 'mixed',
        description:
          'Tổn thương hỗn hợp tế bào gan & đường mật (Mixed Pattern, 2 <= R <= 5). Cả transaminase và ALP đều tăng tương đương.',
      };
    }
  }

  /**
   * Phân độ mức độ tăng men gan (Transaminase Severity) theo tài liệu Mục IV
   */
  static determineSeverity(
    alt: number,
    altUln: number,
    ast: number,
    astUln: number
  ): { severity: TransaminaseSeverity; maxMultiples: number } {
    const altMultiples = alt / altUln;
    const astMultiples = ast / astUln;
    const maxMultiples = Number(Math.max(altMultiples, astMultiples).toFixed(1));

    if (alt >= 10000 || ast >= 10000) {
      return { severity: 'massive', maxMultiples };
    }
    if (maxMultiples > 15) {
      return { severity: 'severe', maxMultiples };
    }
    if (maxMultiples >= 5) {
      return { severity: 'moderate', maxMultiples };
    }
    if (maxMultiples >= 2) {
      return { severity: 'mild', maxMultiples };
    }
    if (maxMultiples > 1) {
      return { severity: 'borderline', maxMultiples };
    }
    return { severity: 'normal', maxMultiples };
  }

  /**
   * Phân loại thành phần Bilirubin theo tài liệu Mục II.3:
   * - Tăng Bilirubin trực tiếp ưu thế (> 50% toàn phần): Tổn thương nhu mô gan hoặc tắc mật
   * - Tăng Bilirubin gián tiếp ưu thế (> 80% toàn phần): Tán huyết hoặc Hội chứng Gilbert
   */
  static determineBilirubinPredominance(
    totalBiliMgDl: number,
    directBiliMgDl?: number
  ): {
    predominance: BilirubinPredominance;
    conjugatedPercent?: number;
    description: string;
  } {
    if (totalBiliMgDl <= 1.2) {
      return {
        predominance: 'normal',
        description: `Bilirubin toàn phần trong giới hạn bình thường (${totalBiliMgDl} mg/dL).`,
      };
    }

    if (directBiliMgDl === undefined || directBiliMgDl === null) {
      return {
        predominance: 'mixed',
        description: `Tăng Bilirubin toàn phần (${totalBiliMgDl} mg/dL) chưa định lượng phân đoạn trực tiếp/gián tiếp.`,
      };
    }

    const conjugatedPercent = Number(((directBiliMgDl / totalBiliMgDl) * 100).toFixed(1));
    const unconjugatedPercent = 100 - conjugatedPercent;

    if (conjugatedPercent >= 50) {
      return {
        predominance: 'conjugated',
        conjugatedPercent,
        description: `Tăng Bilirubin trực tiếp (liên hợp) ưu thế (${conjugatedPercent}% > 50% tổng số). Hướng tới tổn thương nhu mô gan hoặc tắc mật cơ học.`,
      };
    }

    if (unconjugatedPercent >= 80) {
      return {
        predominance: 'unconjugated',
        conjugatedPercent,
        description: `Tăng Bilirubin gián tiếp (tự do) ưu thế tuyệt đối (${unconjugatedPercent}% >= 80% tổng số). Hướng tới tán huyết hoặc Hội chứng Gilbert.`,
      };
    }

    return {
      predominance: 'mixed',
      conjugatedPercent,
      description: `Tăng Bilirubin thể hỗn hợp (Trực tiếp ${conjugatedPercent}%).`,
    };
  }
}
