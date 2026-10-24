/**
 * HepaCDSS Alcoholic Hepatitis Prognostic Scores: Maddrey DF & Lille Model
 * Chuẩn hóa theo hướng dẫn của AASLD (2018/2024), EASL (2018) và WHO.
 */

import { LilleResult, MaddreyResult } from '../../types';

export class AlcoholicHepatitisEngine {
  /**
   * Tính chỉ số Maddrey Discriminant Function (DF):
   * Maddrey DF = 4.6 * (PT_bệnh nhân - PT_chứng) + Bilirubin toàn phần (mg/dL)
   * Ngưỡng quyết định: DF >= 32 => Viêm gan do rượu thể nặng
   */
  static calculateMaddreyDf(
    totalBiliMgDl: number,
    ptPatientSeconds?: number,
    ptControlSeconds: number = 12,
    inr?: number
  ): MaddreyResult | undefined {
    let deltaPt = 0;

    if (ptPatientSeconds !== undefined && ptPatientSeconds > 0) {
      deltaPt = Math.max(0, ptPatientSeconds - ptControlSeconds);
    } else if (inr !== undefined && inr > 0) {
      // Ước tính delta PT từ INR nếu không có giây tuyệt đối: PT ~ INR * 12
      deltaPt = Math.max(0, (inr - 1.0) * ptControlSeconds);
    } else {
      return undefined;
    }

    const dfScore = Number((4.6 * deltaPt + totalBiliMgDl).toFixed(1));
    const isSevere = dfScore >= 32;
    const shortTermMortalityPercent = isSevere ? 40 : 10;
    const steroidIndicated = isSevere;

    let clinicalRecommendation = '';
    if (isSevere) {
      clinicalRecommendation = `Maddrey DF = ${dfScore} (>= 32): VIÊM GAN DO RƯỢU THỂ NẶNG. Tỷ lệ tử vong trong 30 ngày không dùng thuốc lên tới 35-50%. Chỉ định: Prednisolone 40mg/ngày đường uống (hoặc Methylprednisolone 32mg TM) trong 28 ngày, sau khi đã LOẠI TRỪ xuất huyết tiêu hóa, viêm phúc mạc vi khuẩn tiên phát (SBP) và nhiễm trùng huyết. Đánh giá lại đáp ứng vào Ngày thứ 7 bằng thang điểm Lille Model.`;
    } else {
      clinicalRecommendation = `Maddrey DF = ${dfScore} (< 32): Viêm gan rượu thể nhẹ đến vừa. Tỷ lệ tử vong ngắn hạn thấp. KHÔNG có chỉ định Corticosteroid (nguy cơ tác dụng phụ vượt trội lợi ích). Điều trị hỗ trợ: Cai rượu tuyệt đối, hỗ trợ dinh dưỡng giàu đạm (1.5g/kg/ngày), bổ sung Thiamine (Vitamin B1 100-300mg/ngày) và Vitamin B6.`;
    }

    return {
      dfScore,
      isSevere,
      shortTermMortalityPercent,
      steroidIndicated,
      clinicalRecommendation,
    };
  }

  /**
   * Tính Thang điểm Lille Model (Đánh giá đáp ứng Corticoid vào Ngày thứ 7):
   * Lille Score >= 0.45: Không đáp ứng (Ngừng corticoid)
   * Lille Score < 0.45: Đáp ứng tốt (Tiếp tục điều trị đủ 28 ngày)
   */
  static calculateLilleModel(
    age: number,
    albuminGL: number,
    creatinineUmolL: number,
    inr: number,
    day0BiliMgDl: number,
    day7BiliMgDl: number
  ): LilleResult | undefined {
    if (
      age <= 0 ||
      albuminGL <= 0 ||
      creatinineUmolL <= 0 ||
      inr <= 0 ||
      day0BiliMgDl <= 0 ||
      day7BiliMgDl <= 0
    ) {
      return undefined;
    }

    // Renal insufficiency: 1 nếu Creatinine >= 115 µmol/L (1.3 mg/dL), ngược lại 0
    const renalInsufficiency = creatinineUmolL >= 115 ? 1 : 0;
    const deltaBili = day0BiliMgDl - day7BiliMgDl;

    // Biểu thức R của Lille Model
    const R =
      3.19 -
      0.101 * age +
      0.147 * albuminGL +
      0.0165 * deltaBili -
      0.206 * renalInsufficiency -
      0.0065 * day0BiliMgDl -
      0.11 * inr;

    const expNegR = Math.exp(-R);
    const score = Number((expNegR / (1 + expNegR)).toFixed(2));
    const isResponder = score < 0.45;
    const survivalRate6MonthPercent = isResponder ? 85 : 25;

    let recommendation = '';
    if (isResponder) {
      recommendation = `Điểm Lille = ${score} (< 0.45): ĐÁP ỨNG TỐT VỚI CORTICOID. Bilirubin giảm tốt sau 7 ngày. Tỷ lệ sống còn 6 tháng đạt ~85%. Khuyến cáo: Tiếp tục duy trì phác đồ Prednisolone 40mg/ngày cho đủ 28 ngày, sau đó giảm liều dần trong 2-4 tuần.`;
    } else {
      recommendation = `Điểm Lille = ${score} (>= 0.45): KHÔNG ĐÁP ỨNG VỚI CORTICOID (Non-responder). Tỷ lệ tử vong 6 tháng lên tới 75%. Khuyến cáo KHẨN CẤP: NGỪNG Prednisolone ngay lập tức (tiếp tục dùng không làm tăng tỷ lệ sống mà tăng nguy cơ nhiễm trùng tử vong nặng nề). Hội chẩn khẩn xem xét chỉ định ghép gan sớm (Early Liver Transplantation) nếu đủ tiêu chuẩn.`;
    }

    return {
      score,
      isResponder,
      survivalRate6MonthPercent,
      recommendation,
    };
  }
}
