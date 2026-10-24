/**
 * HepaCDSS King's College Criteria for Emergency Liver Transplantation in Acute Liver Failure (ALF)
 * Chuẩn hóa theo AASLD & King's College Hospital Guidelines.
 */

import { KingsCollegeResult } from '../../types';

export class KingsCollegeEngine {
  /**
   * Đánh giá tiêu chuẩn King's College
   */
  static evaluate(data: {
    isParacetamolInduced: boolean;
    arterialPh?: number;
    inr?: number;
    creatinineMgDl?: number;
    hasGrade3or4Encephalopathy?: boolean;
    age?: number;
    totalBiliMgDl?: number;
    jaundiceToEncephalopathyDays?: number;
    etiologyIsUnfavorable?: boolean; // DILI, thảo dược, viêm gan vô căn
  }): KingsCollegeResult {
    const details: string[] = [];
    let criteriaMet = false;

    if (data.isParacetamolInduced) {
      // Tiêu chuẩn cho ngộ độc Paracetamol
      if (data.arterialPh !== undefined && data.arterialPh < 7.3) {
        criteriaMet = true;
        details.push(`Toan chuyển hóa máu động mạch nặng: pH = ${data.arterialPh} < 7.30 (đủ tiêu chuẩn ghép gan đơn độc).`);
      }

      const hasSevereCoagulopathy = data.inr !== undefined && data.inr > 6.5;
      const hasSevereRenalFailure = data.creatinineMgDl !== undefined && data.creatinineMgDl > 3.4;
      const hasSevereEncephalopathy = data.hasGrade3or4Encephalopathy === true;

      if (hasSevereCoagulopathy && hasSevereRenalFailure && hasSevereEncephalopathy) {
        criteriaMet = true;
        details.push('Đồng thời thỏa mãn cả 3 tiêu chí: Hôn mê gan Độ 3-4 + INR > 6.5 + Creatinine > 3.4 mg/dL.');
      }
    } else {
      // Tiêu chuẩn cho ALF không do Paracetamol (Virus, DILI, Wilson, Tự miễn...)
      if (data.inr !== undefined && data.inr > 6.5) {
        criteriaMet = true;
        details.push(`Rối loạn đông máu tối cấp: INR = ${data.inr} > 6.5 (đủ tiêu chuẩn ghép gan khẩn cấp đơn độc).`);
      }

      let unfavorableCount = 0;
      if (data.age !== undefined && (data.age < 10 || data.age > 40)) {
        unfavorableCount++;
        details.push(`Tuổi ${data.age} (< 10 hoặc > 40 tuổi).`);
      }
      if (data.etiologyIsUnfavorable) {
        unfavorableCount++;
        details.push('Căn nguyên tiên lượng xấu (Tổn thương gan do thuốc/thảo dược DILI hoặc Viêm gan vô căn).');
      }
      if (data.jaundiceToEncephalopathyDays !== undefined && data.jaundiceToEncephalopathyDays > 7) {
        unfavorableCount++;
        details.push(`Thời gian từ lúc vàng da đến khi có bệnh não gan > 7 ngày (${data.jaundiceToEncephalopathyDays} ngày).`);
      }
      if (data.inr !== undefined && data.inr > 3.5) {
        unfavorableCount++;
        details.push(`INR = ${data.inr} > 3.5.`);
      }
      if (data.totalBiliMgDl !== undefined && data.totalBiliMgDl > 17.5) {
        unfavorableCount++;
        details.push(`Bilirubin toàn phần = ${data.totalBiliMgDl} mg/dL > 17.5 mg/dL (> 300 µmol/L).`);
      }

      if (unfavorableCount >= 3) {
        criteriaMet = true;
        details.push(`Thỏa mãn ${unfavorableCount}/5 tiêu chuẩn phụ của King's College.`);
      }
    }

    let recommendation = '';
    if (criteriaMet) {
      recommendation =
        'ĐẠT TIÊU CHUẨN GHÉP GAN KHẨN CẤP (KING\'S COLLEGE CRITERIA DƯƠNG TÍNH): Tỷ lệ tử vong nếu không được ghép gan vượt quá 80-90%. Khẩn cấp kích hoạt quy trình chuyển tuyến đến Trung tâm Hồi sức Ghép Gan, hội chẩn bác sĩ phẫu thuật ghép tạng và đặt nội khí quản bảo vệ đường thở nếu có bệnh não gan tiến triển.';
    } else {
      recommendation =
        'Chưa thỏa mãn tiêu chuẩn ghép gan King\'s College. Tiếp tục theo dõi sát tại ICU: Khí máu động mạch, đông máu toàn bộ (PT/INR) mỗi 6-12 giờ, đường huyết mao mạch và đánh giá tri giác.';
    }

    return {
      criteriaMet,
      details,
      recommendation,
    };
  }
}
