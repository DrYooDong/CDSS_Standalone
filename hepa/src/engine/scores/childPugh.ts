/**
 * HepaCDSS Child-Turcotte-Pugh (CTP) Score Engine
 * Thang điểm kinh điển đánh giá mức độ suy giảm chức năng tổng hợp và tiên lượng sống còn ở bệnh nhân xơ gan.
 */

import { AscitesGrade, ChildPughResult, EncephalopathyGrade } from '../../types';

export class ChildPughEngine {
  /**
   * Tính điểm Child-Pugh dựa trên 5 thông số chuẩn:
   * - Total Bilirubin (mg/dL)
   * - Serum Albumin (g/dL)
   * - INR
   * - Cổ trướng (Ascites)
   * - Bệnh não gan (Hepatic Encephalopathy)
   */
  static calculate(
    totalBiliMgDl: number,
    albuminGDl: number,
    inr: number,
    ascites: AscitesGrade = 'none',
    encephalopathy: EncephalopathyGrade = 'none'
  ): ChildPughResult {
    // 1. Điểm Bilirubin
    let bilirubinPoints = 1;
    if (totalBiliMgDl > 3.0) {
      bilirubinPoints = 3;
    } else if (totalBiliMgDl >= 2.0) {
      bilirubinPoints = 2;
    }

    // 2. Điểm Albumin
    let albuminPoints = 1;
    if (albuminGDl < 2.8) {
      albuminPoints = 3;
    } else if (albuminGDl <= 3.5) {
      albuminPoints = 2;
    }

    // 3. Điểm INR
    let inrPoints = 1;
    if (inr > 2.3) {
      inrPoints = 3;
    } else if (inr >= 1.7) {
      inrPoints = 2;
    }

    // 4. Điểm Cổ trướng
    let ascitesPoints = 1;
    if (ascites === 'moderate_severe') {
      ascitesPoints = 3;
    } else if (ascites === 'mild') {
      ascitesPoints = 2;
    }

    // 5. Điểm Bệnh não gan
    let encephalopathyPoints = 1;
    if (encephalopathy === 'grade_3_4') {
      encephalopathyPoints = 3;
    } else if (encephalopathy === 'grade_1_2') {
      encephalopathyPoints = 2;
    }

    const score =
      bilirubinPoints + albuminPoints + inrPoints + ascitesPoints + encephalopathyPoints;

    let grade: 'A' | 'B' | 'C';
    let oneYearSurvivalPercent = 100;
    let twoYearSurvivalPercent = 85;
    let surgicalMortalityRisk = 'Thấp (~10% đối với phẫu thuật bụng)';
    let drugDosingNote = 'Chức năng tổng hợp còn bù tốt. Các thuốc chuyển hóa qua gan thường dùng được liều thông thường, theo dõi chức năng gan định kỳ.';

    if (score <= 6) {
      grade = 'A';
      oneYearSurvivalPercent = 100;
      twoYearSurvivalPercent = 85;
      surgicalMortalityRisk = 'Thấp (~10% đối với phẫu thuật bụng)';
      drugDosingNote = 'Child-Pugh A (Xơ gan còn bù): Hầu hết các thuốc không bắt buộc giảm liều trừ thuốc có độc tính gan cao (black box warning).';
    } else if (score <= 9) {
      grade = 'B';
      oneYearSurvivalPercent = 80;
      twoYearSurvivalPercent = 60;
      surgicalMortalityRisk = 'Trung bình (~30% đối với phẫu thuật bụng)';
      drugDosingNote = 'Child-Pugh B (Suy giảm chức năng đáng kể): Thận trọng khi dùng thuốc chuyển hóa qua gan. Giảm liều khoảng 25-50% đối với thuốc có tỷ lệ thanh thải qua gan cao, tránh các thuốc an thần / opioid dễ thúc đẩy hôn mê gan.';
    } else {
      grade = 'C';
      oneYearSurvivalPercent = 45;
      twoYearSurvivalPercent = 35;
      surgicalMortalityRisk = 'Rất cao (>70-80% tỷ lệ tử vong chu phẫu)';
      drugDosingNote = 'Child-Pugh C (Xơ gan mất bù giai đoạn cuối): Suy sụp hoàn toàn chức năng tổng hợp & chuyển hóa. Chống chỉ định nhiều loại thuốc chuyển hóa qua gan, giảm liều tối thiểu 50%, tránh tuyệt đối thuốc ức chế TKTW và NSAIDs (nguy cơ hội chứng gan thận). Cân nhắc danh sách chờ ghép gan.';
    }

    return {
      score,
      grade,
      oneYearSurvivalPercent,
      twoYearSurvivalPercent,
      surgicalMortalityRisk,
      drugDosingNote,
      breakdown: {
        bilirubinPoints,
        albuminPoints,
        inrPoints,
        ascitesPoints,
        encephalopathyPoints,
      },
    };
  }
}
