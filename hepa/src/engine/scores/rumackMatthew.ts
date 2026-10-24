/**
 * HepaCDSS Rumack-Matthew Nomogram & N-Acetylcysteine (NAC) Dosing Protocol
 * Phác đồ xử trí ngộ độc Paracetamol cấp theo chuẩn độc chất học quốc tế và Bộ Y Tế.
 */

import { RumackMatthewResult } from '../../types';

export class RumackMatthewEngine {
  /**
   * Tính ngưỡng điều trị theo Rumack-Matthew Nomogram (Treatment line tại 150 mcg/mL ở 4 giờ):
   * Cutoff = 150 * (0.5)^((hours - 4) / 4)
   */
  static getTreatmentLineThreshold(hours: number): number {
    if (hours < 4) return 150;
    if (hours > 24) return 4.7; // Ngưỡng sau 24 giờ
    return Number((150 * Math.pow(0.5, (hours - 4) / 4)).toFixed(1));
  }

  /**
   * Đánh giá nguy cơ ngộ độc và tính toán phác đồ liều NAC theo cân nặng
   */
  static evaluate(
    hoursSinceIngestion: number,
    paracetamolLevelMcgMl: number,
    weightKg: number = 70
  ): RumackMatthewResult {
    // Giới hạn cân nặng an toàn (tối đa tính 100-110 kg để tránh quá liều NAC)
    const effectiveWeight = Math.min(100, Math.max(30, weightKg));
    const treatmentThreshold = this.getTreatmentLineThreshold(hoursSinceIngestion);

    const isAboveLine = paracetamolLevelMcgMl >= treatmentThreshold;
    const nacRecommended = isAboveLine || hoursSinceIngestion > 8 || paracetamolLevelMcgMl > 100;

    // Phác đồ truyền tĩnh mạch 21 giờ (Phác đồ 3 chai chuẩn):
    // - Chai 1 (Loading): 150 mg/kg trong 60 phút (pha trong 200 mL Glucose 5%)
    // - Chai 2: 50 mg/kg trong 4 giờ (pha trong 500 mL Glucose 5%)
    // - Chai 3: 100 mg/kg trong 16 giờ (pha trong 1000 mL Glucose 5%)
    const dose1Mg = effectiveWeight * 150;
    const dose2Mg = effectiveWeight * 50;
    const dose3Mg = effectiveWeight * 100;
    const totalDoseMg = dose1Mg + dose2Mg + dose3Mg;

    const nac21HourIvRegimen = {
      loadingDose: `Chai 1 (Tấn công): ${dose1Mg.toLocaleString()} mg (${(dose1Mg / 1000).toFixed(1)} g) pha trong 200 mL Dextrose 5% truyền TM trong 60 phút (tốc độ ~200 mL/h).`,
      secondDose: `Chai 2: ${dose2Mg.toLocaleString()} mg (${(dose2Mg / 1000).toFixed(1)} g) pha trong 500 mL Dextrose 5% truyền TM liên tục trong 4 giờ (tốc độ ~125 mL/h).`,
      thirdDose: `Chai 3: ${dose3Mg.toLocaleString()} mg (${(dose3Mg / 1000).toFixed(1)} g) pha trong 1000 mL Dextrose 5% truyền TM liên tục trong 16 giờ (tốc độ ~62.5 mL/h).`,
      totalDose: `Tổng liều toàn phác đồ 21h: ${totalDoseMg.toLocaleString()} mg (${(totalDoseMg / 1000).toFixed(1)} g) tương đương 300 mg/kg theo cân nặng ${effectiveWeight} kg.`,
    };

    return {
      toxicityRisk: isAboveLine ? 'toxic' : 'non_toxic',
      hoursSinceIngestion,
      paracetamolLevelMcgMl,
      treatmentLineCutoffMcgMl: treatmentThreshold,
      nacRecommended,
      nac21HourIvRegimen,
    };
  }
}
