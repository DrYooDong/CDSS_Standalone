/**
 * HepaCDSS Model for End-Stage Liver Disease (MELD, MELD-Na & MELD 3.0)
 * Chuẩn hóa theo tiêu chuẩn UNOS/OPTN và Hướng dẫn AASLD/EASL.
 */

import { Gender, MeldResult } from '../../types';

export class MeldEngine {
  /**
   * Tính MELD gốc (UNOS):
   * MELD = 9.57 * ln(Cr) + 3.78 * ln(Bili) + 11.2 * ln(INR) + 6.43
   * - Creatinine (mg/dL) chặn từ 1.0 đến 4.0
   * - Bilirubin (mg/dL) chặn dưới 1.0
   * - INR chặn dưới 1.0
   */
  static calculateMeldOriginal(
    totalBiliMgDl: number,
    inr: number,
    creatinineMgDl: number
  ): number {
    const bili = Math.max(1.0, totalBiliMgDl);
    const cr = Math.min(4.0, Math.max(1.0, creatinineMgDl));
    const inrVal = Math.max(1.0, inr);

    const raw =
      9.57 * Math.log(cr) +
      3.78 * Math.log(bili) +
      11.2 * Math.log(inrVal) +
      6.43;

    return Math.min(40, Math.max(6, Math.round(raw)));
  }

  /**
   * Tính MELD-Na (UNOS 2016):
   * Nếu MELD > 11:
   * MELD-Na = MELD + 1.32 * (137 - Na) - [0.033 * MELD * (137 - Na)]
   * Na chặn trong khoảng [125, 137] mEq/L
   */
  static calculateMeldNa(meldOriginal: number, sodiumMeqL?: number): number {
    if (sodiumMeqL === undefined || sodiumMeqL <= 0) return meldOriginal;

    if (meldOriginal <= 11) return meldOriginal;

    const na = Math.min(137, Math.max(125, sodiumMeqL));
    const raw =
      meldOriginal + 1.32 * (137 - na) - 0.033 * meldOriginal * (137 - na);

    return Math.min(40, Math.max(6, Math.round(raw)));
  }

  /**
   * Tính MELD 3.0 (Kim et al., Gastroenterology 2021)
   */
  static calculateMeld30(
    gender: Gender,
    totalBiliMgDl: number,
    inr: number,
    creatinineMgDl: number,
    albuminGDl?: number,
    sodiumMeqL?: number
  ): number | undefined {
    if (albuminGDl === undefined || sodiumMeqL === undefined) return undefined;

    const femaleTerm = gender === 'female' ? 1.33 : 0;
    const bili = Math.max(1.0, totalBiliMgDl);
    const cr = Math.min(4.0, Math.max(1.0, creatinineMgDl));
    const inrVal = Math.max(1.0, inr);
    const alb = Math.min(3.5, Math.max(1.0, albuminGDl));
    const na = Math.min(137, Math.max(125, sodiumMeqL));

    const raw =
      femaleTerm +
      4.56 * Math.log(bili) +
      0.82 * (137 - na) -
      0.24 * (137 - na) * Math.log(bili) +
      9.09 * Math.log(inrVal) +
      11.14 * Math.log(cr) +
      1.85 * (3.5 - alb) -
      1.83 * (3.5 - alb) * Math.log(cr) +
      6.43;

    return Math.min(40, Math.max(6, Math.round(raw)));
  }

  /**
   * Đánh giá tổng hợp điểm MELD và dự báo tỷ lệ tử vong trong 3 tháng
   */
  static evaluate(
    gender: Gender,
    totalBiliMgDl: number,
    inr: number,
    creatinineMgDl?: number,
    albuminGDl?: number,
    sodiumMeqL?: number
  ): MeldResult | undefined {
    if (creatinineMgDl === undefined || creatinineMgDl <= 0 || inr <= 0 || totalBiliMgDl <= 0) {
      return undefined;
    }

    const meldOriginal = this.calculateMeldOriginal(totalBiliMgDl, inr, creatinineMgDl);
    const meldNa = this.calculateMeldNa(meldOriginal, sodiumMeqL);
    const meld30 = this.calculateMeld30(
      gender,
      totalBiliMgDl,
      inr,
      creatinineMgDl,
      albuminGDl,
      sodiumMeqL
    );

    const primaryScore = meld30 ?? meldNa ?? meldOriginal;

    // Dự báo tỷ lệ tử vong 90 ngày (UNOS mortality table)
    let threeMonthMortalityPercent = 1.9;
    if (primaryScore >= 40) {
      threeMonthMortalityPercent = 71.3;
    } else if (primaryScore >= 30) {
      threeMonthMortalityPercent = 52.6;
    } else if (primaryScore >= 20) {
      threeMonthMortalityPercent = 19.6;
    } else if (primaryScore >= 10) {
      threeMonthMortalityPercent = 6.0;
    } else {
      threeMonthMortalityPercent = 1.9;
    }

    const transplantListingRecommended = primaryScore >= 15;

    let interpretation = '';
    if (primaryScore >= 25) {
      interpretation = `Điểm MELD (${primaryScore}) ở mức NGUY KỊCH: Nguy cơ tử vong trong 3 tháng > 50%. Cần khẩn cấp hội chẩn Trung tâm Ghép gan và chuẩn bị danh sách ưu tiên ghép.`;
    } else if (primaryScore >= 15) {
      interpretation = `Điểm MELD (${primaryScore}) >= 15: Đạt tiêu chuẩn khuyến cáo xem xét đưa vào danh sách chờ ghép gan (UNOS/EASL). Chức năng gan suy giảm rõ rệt.`;
    } else {
      interpretation = `Điểm MELD (${primaryScore}) < 15: Nguy cơ tử vong 3 tháng thấp (< 6%). Tiếp tục quản lý nội khoa và theo dõi định kỳ.`;
    }

    return {
      meldOriginal,
      meldNa,
      meld30,
      threeMonthMortalityPercent,
      transplantListingRecommended,
      interpretation,
    };
  }
}
