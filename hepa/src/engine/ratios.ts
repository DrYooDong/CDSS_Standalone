/**
 * HepaCDSS Clinical Ratios & Specific Diagnostic Indices Module
 * Tính toán các tỷ số kinh điển được chuẩn hóa trong tài liệu Hướng dẫn Lâm sàng ACG & Y văn Gan Mật:
 * - De Ritis (AST/ALT)
 * - AST/LDH (Phân biệt Sốc gan vs Viêm gan virus cấp)
 * - Hy's Law (DILI thể nặng)
 * - Chỉ số Wilson (ALP/Bilirubin < 4 và AST/ALT > 2.2)
 * - Chỉ số AIH (ALP/Transaminase < 3)
 * - Đánh giá nguồn gốc ALP (Gan vs Xương/Nhau thai qua GGT)
 */

export interface DeRitisResult {
  ratio: number;
  interpretation: string;
  clinicalSignificance: 'normal_or_viral' | 'cirrhosis_progression' | 'alcoholic_pattern' | 'myopathy_or_ischemic';
}

export interface AstLdhResult {
  ratio: number;
  interpretation: string;
  suspectIschemicHepatitis: boolean;
}

export interface WilsonIndexResult {
  ratioAlpToBili: number;
  astToAltRatio: number;
  isHighlySuspicious: boolean;
  explanation: string;
}

export interface HysLawResult {
  isMet: boolean;
  explanation: string;
  mortalityRiskAlert: boolean;
}

export interface BoneVsLiverAlpResult {
  isLiverOriginConfirmed: boolean;
  isIsolatedAlpSuspiciousForBone: boolean;
  explanation: string;
}

export class ClinicalRatiosEngine {
  /**
   * Tính tỷ số De Ritis (AST / ALT) và phân tích ý nghĩa lâm sàng theo tài liệu Mục II.1
   */
  static evaluateDeRitis(ast: number, alt: number): DeRitisResult {
    if (alt <= 0) {
      return {
        ratio: 1,
        interpretation: 'Không đủ số liệu tính De Ritis.',
        clinicalSignificance: 'normal_or_viral',
      };
    }

    const ratio = Number((ast / alt).toFixed(2));

    if (ratio >= 3.0) {
      return {
        ratio,
        interpretation: `Tỷ số De Ritis rất cao (${ratio} >= 3.0). AST tăng vọt vượt trội so với ALT: Cần loại trừ ngay tổn thương ngoài gan như Tiêu cơ vân (Rhabdomyolysis), tổn thương cơ nặng hoặc Nhồi máu cơ tim (kiểm tra CK, Troponin, Myoglobin).`,
        clinicalSignificance: 'myopathy_or_ischemic',
      };
    }

    if (ratio >= 2.0) {
      return {
        ratio,
        interpretation: `Tỷ số De Ritis ${ratio} >= 2.0: Dấu hiệu kinh điển đặc trưng của Bệnh gan do rượu (ARLD). Cơ chế: Rượu gây thiếu hụt Pyridoxal-5-phosphate (Vitamin B6) ức chế tổng hợp ALT bào tương + độc ty thể giải phóng lượng lớn mAST.`,
        clinicalSignificance: 'alcoholic_pattern',
      };
    }

    if (ratio > 1.0) {
      return {
        ratio,
        interpretation: `Tỷ số De Ritis ${ratio} > 1.0: Ở bệnh nhân có bệnh gan mạn tính (HBV, HCV, MASLD), sự đảo ngược tỷ lệ từ <1 sang >1 là chỉ dấu cảnh báo xơ gan tiến triển (Advanced Fibrosis / Cirrhosis, F3-F4) do giảm thanh thải AST tại xoang gan.`,
        clinicalSignificance: 'cirrhosis_progression',
      };
    }

    return {
      ratio,
      interpretation: `Tỷ số De Ritis ${ratio} < 1.0: ALT chiếm ưu thế, hình thái phổ biến trong viêm gan virus cấp/mạn chưa xơ gan hoặc bệnh gan nhiễm mỡ chuyển hóa (MASLD) giai đoạn sớm.`,
      clinicalSignificance: 'normal_or_viral',
    };
  }

  /**
   * Tỷ số AST / LDH: Phân biệt Viêm gan thiếu máu cục bộ (Gan sốc) với Viêm gan virus cấp
   * Theo tài liệu Mục IV.3 và VIII:
   * - Gan sốc: AST/LDH < 1.5 (LDH tăng cực cao)
   * - Viêm gan virus cấp: AST/LDH > 1.5
   */
  static evaluateAstLdh(ast: number, ldh?: number): AstLdhResult | undefined {
    if (!ldh || ldh <= 0) return undefined;

    const ratio = Number((ast / ldh).toFixed(2));
    const suspectIschemicHepatitis = ratio < 1.5;

    let interpretation = '';
    if (suspectIschemicHepatitis) {
      interpretation = `Tỷ số AST/LDH = ${ratio} (< 1.5) kèm LDH tăng vọt: Đặc điểm nhận diện kinh điển của Viêm gan thiếu máu cục bộ (Ischemic Hepatitis / Shock Liver). Men gan thường đạt đỉnh rất cao rồi giảm nhanh 50% sau mỗi 24-48 giờ khi tưới máu phục hồi.`;
    } else {
      interpretation = `Tỷ số AST/LDH = ${ratio} (>= 1.5): Phù hợp với hoại tử tế bào gan do Viêm gan virus cấp tính hơn là gan sốc.`;
    }

    return { ratio, interpretation, suspectIschemicHepatitis };
  }

  /**
   * Tỷ số nhận diện Bệnh Wilson thể cấp / bùng phát
   * Theo tài liệu Mục IV.1, VII & VIII:
   * - Tỷ lệ ALP / Bilirubin toàn phần (mg/dL) < 4.0
   * - Kết hợp AST / ALT > 2.2
   * (Do ion Đồng ức chế cạnh tranh với Kẽm trong phân tử ALP làm ALP thấp nghịch lý)
   */
  static evaluateWilsonSuspicion(
    alp: number,
    totalBiliMgDl: number,
    ast: number,
    alt: number,
    age?: number
  ): WilsonIndexResult | undefined {
    if (totalBiliMgDl <= 1.2 || alt <= 0) return undefined;

    const ratioAlpToBili = Number((alp / totalBiliMgDl).toFixed(2));
    const astToAltRatio = Number((ast / alt).toFixed(2));

    const isAlpBiliLow = ratioAlpToBili < 4.0;
    const isAstHigh = astToAltRatio > 2.2;
    const isAgeSuspicious = age !== undefined ? age < 55 : true;

    const isHighlySuspicious = isAlpBiliLow && isAstHigh && isAgeSuspicious;

    let explanation = '';
    if (isHighlySuspicious) {
      explanation = `CẢNH BÁO BỆNH WILSON CẤP: Tỷ số ALP/Bilirubin = ${ratioAlpToBili} (< 4.0) kết hợp AST/ALT = ${astToAltRatio} (> 2.2) ở bệnh nhân ${age ? `${age} tuổi` : 'trẻ tuổi'}. Đây là mô hình sinh hóa kinh điển của đợt bùng phát Bệnh Wilson (ion Đồng ức chế phosphatase kiềm và gây vỡ hồng cầu/tán huyết Coombs âm). Chỉ định khẩn: Ceruloplasmin, Đồng niệu 24h, khám mắt tìm vòng Kayser-Fleischer.`;
    } else {
      explanation = `Tỷ số ALP/Bilirubin = ${ratioAlpToBili}, AST/ALT = ${astToAltRatio}. Chưa ghi nhận mô hình ức chế ALP đặc thù của bệnh Wilson cấp.`;
    }

    return {
      ratioAlpToBili,
      astToAltRatio,
      isHighlySuspicious,
      explanation,
    };
  }

  /**
   * Đánh giá Tiêu chuẩn Định luật Hy (Hy's Law) trong Tổn thương gan do thuốc (DILI)
   * Theo tiêu chuẩn FDA & ACG:
   * 1. ALT hoặc AST >= 3x ULN
   * 2. Bilirubin toàn phần >= 2x ULN (thường >= 2.0 mg/dL hoặc >= 34 µmol/L)
   * 3. ALP không tăng ban đầu tương ứng (ALP < 2x ULN hoặc kiểu tế bào gan R > 5)
   * Cảnh báo: Tỷ lệ tử vong hoặc cần ghép gan từ 10% đến 50%!
   */
  static evaluateHysLaw(
    alt: number,
    altUln: number,
    ast: number,
    astUln: number,
    totalBiliMgDl: number,
    alp: number,
    alpUln: number
  ): HysLawResult {
    const isTransaminaseHigh = alt / altUln >= 3.0 || ast / astUln >= 3.0;
    const isBilirubinHigh = totalBiliMgDl >= 2.0; // >= 2x ULN chuẩn
    const isAlpNotElevatedDisproportionately = alp / alpUln < 2.0;

    const isMet = isTransaminaseHigh && isBilirubinHigh && isAlpNotElevatedDisproportionately;

    if (isMet) {
      return {
        isMet: true,
        mortalityRiskAlert: true,
        explanation: `TIÊU CHUẨN ĐỊNH LUẬT HY (HY'S LAW) DƯƠNG TÍNH: Bệnh nhân có tổn thương tế bào gan (ALT/AST >= 3x ULN) kèm vàng da (Bilirubin >= 2.0 mg/dL) mà không có tắc mật ban đầu (ALP < 2x ULN). Nếu do thuốc/TPCN (DILI), tỷ lệ tiến triển suy gan cấp dẫn tới tử vong hoặc cần ghép gan lên tới 10% - 50%. Cần ngừng ngay toàn bộ thuốc nghi ngờ và hội chẩn chuyên khoa Gan Mật.`,
      };
    }

    return {
      isMet: false,
      mortalityRiskAlert: false,
      explanation: 'Chưa đủ tiêu chí Định luật Hy (Hy\'s Law).',
    };
  }

  /**
   * Đánh giá tỷ số Viêm gan tự miễn (AIH): ALP / AST < 3 hoặc ALP / ALT < 3
   */
  static evaluateAihSuspicion(alp: number, ast: number, alt: number): boolean {
    if (ast <= 0 && alt <= 0) return false;
    const ratio = Math.min(ast > 0 ? alp / ast : 99, alt > 0 ? alp / alt : 99);
    return ratio < 3.0;
  }

  /**
   * Đánh giá nguồn gốc ALP: Gan vs Xương/Nhau thai thông qua enzyme GGT
   */
  static evaluateAlpOrigin(
    alp: number,
    alpUln: number,
    ggt?: number,
    ggtUln?: number
  ): BoneVsLiverAlpResult {
    const isAlpElevated = alp > alpUln;

    if (!isAlpElevated) {
      return {
        isLiverOriginConfirmed: false,
        isIsolatedAlpSuspiciousForBone: false,
        explanation: 'ALP trong giới hạn bình thường.',
      };
    }

    if (ggt !== undefined && ggtUln !== undefined && ggtUln > 0) {
      const isGgtElevated = ggt > ggtUln;
      if (isGgtElevated) {
        return {
          isLiverOriginConfirmed: true,
          isIsolatedAlpSuspiciousForBone: false,
          explanation: `ALP tăng (${alp} U/L) đi kèm GGT tăng (${ggt} U/L): Khẳng định 100% nguồn gốc tăng ALP phát sinh từ màng vi quản mật tế bào gan (ứ mật hoặc thâm nhiễm).`,
        };
      } else {
        return {
          isLiverOriginConfirmed: false,
          isIsolatedAlpSuspiciousForBone: true,
          explanation: `CẢNH BÁO TĂNG ALP ĐƠN ĐỘC: ALP tăng (${alp} U/L) nhưng GGT hoàn toàn bình thường (${ggt} U/L <= ${ggtUln} U/L). Do GGT có độ nhạy rất cao ở gan còn xương không chứa GGT, kết quả này gợi ý nguồn gốc ALP từ ngoài gan (bệnh lý xương: bệnh Paget, gãy xương, di căn xương, hoặc sinh lý ở thanh thiếu niên/quý 3 thai kỳ). Cần làm thêm 5'-Nucleotidase hoặc điện di isoenzyme ALP.`,
        };
      }
    }

    return {
      isLiverOriginConfirmed: false,
      isIsolatedAlpSuspiciousForBone: false,
      explanation: 'ALP tăng nhưng chưa có xét nghiệm GGT đối chứng để khẳng định nguồn gốc từ gan mật hay từ xương.',
    };
  }
}
