/**
 * HepaCDSS Drug-Induced Liver Injury (DILI) & Anti-Tuberculosis Regimen Engine
 * Tích hợp Thang điểm RUCAM 2016, Tra cứu LiverTox, và Phác đồ xử trí độc gan do Thuốc Lao (ATS & BYT).
 */

import {
  AntiTbDiliAction,
  AntiTbDiliDecision,
  HbvReactivationAssessment,
  HbvReactivationRiskLevel,
  RucamAssessmentInput,
  RucamAssessmentResult,
  RucamCausalityCategory,
} from '../types';

export interface CommonDiliDrugInfo {
  name: string;
  nameVi: string;
  typicalPattern: 'hepatocellular' | 'cholestatic' | 'mixed';
  liverToxClass: 'A' | 'B' | 'C' | 'D' | 'E';
  latencyDescription: string;
  mechanismAndPearl: string;
}

export const COMMON_DILI_DRUGS: CommonDiliDrugInfo[] = [
  {
    name: 'Amoxicillin-Clavulanate (Augmentin)',
    nameVi: 'Kháng sinh Amoxicillin - Acid Clavulanic',
    typicalPattern: 'cholestatic',
    liverToxClass: 'A',
    latencyDescription: 'Thường khởi phát muộn: 1 đến 4 tuần (thậm chí 6-8 tuần) sau khi đã HOÀN THÀNH đợt kháng sinh.',
    mechanismAndPearl:
      'Nguyên nhân số 1 gây DILI thể ứ mật trên toàn thế giới. Thành phần gây độc chính là acid clavulanic. Thường tự hồi phục trong vòng vài tháng sau ngừng thuốc.',
  },
  {
    name: 'Isoniazid (INH)',
    nameVi: 'Thuốc chống lao Isoniazid',
    typicalPattern: 'hepatocellular',
    liverToxClass: 'A',
    latencyDescription: '1 đến 6 tháng sau khi bắt đầu dùng thuốc.',
    mechanismAndPearl:
      'Chuyển hóa tạo chất trung gian Acetylhydrazine gây độc tế bào gan. Tỷ lệ tăng men nhẹ tự thích ứng lên tới 10-20%, nhưng khoảng 1% tiến triển thành viêm gan hoại tử nặng tương tự viêm gan virus.',
  },
  {
    name: 'Rifampicin (RIF)',
    nameVi: 'Thuốc chống lao Rifampicin',
    typicalPattern: 'mixed',
    liverToxClass: 'A',
    latencyDescription: 'Vài ngày đến vài tuần đầu điều trị.',
    mechanismAndPearl:
      'Cạnh tranh bài tiết Bilirubin tại màng vi quản mật gây tăng Bilirubin sớm thoáng qua. Ít gây hủy hoại tế bào gan đơn độc, nhưng làm tăng độc tính của Isoniazid do cảm ứng enzyme Cytochrome P450.',
  },
  {
    name: 'Pyrazinamide (PZA)',
    nameVi: 'Thuốc chống lao Pyrazinamide',
    typicalPattern: 'hepatocellular',
    liverToxClass: 'A',
    latencyDescription: '1 đến 2 tháng sau dùng thuốc.',
    mechanismAndPearl:
      'Là thuốc ĐỘC GAN MẠNH NHẤT trong phác đồ điều trị lao chuẩn. Độc tính phụ thuộc liều. Thường là thủ phạm chính khi xảy ra viêm gan bùng phát rầm rộ hoặc suy gan cấp.',
  },
  {
    name: 'Paracetamol (Acetaminophen)',
    nameVi: 'Thuốc hạ sốt giảm đau Paracetamol',
    typicalPattern: 'hepatocellular',
    liverToxClass: 'A',
    latencyDescription: 'Cấp tính: 24 - 72 giờ sau khi uống quá liều (> 7.5g ở người lớn hoặc > 150mg/kg).',
    mechanismAndPearl:
      'Chất chuyển hóa NAPQI làm cạn kiệt Glutathione gây hoại tử vùng trung tâm tiểu thùy (Zone 3). Men gan tăng vọt khổng lồ (> 10,000 U/L). Có thuốc giải độc đặc hiệu N-Acetylcysteine (NAC).',
  },
  {
    name: 'Valproate (Depakine)',
    nameVi: 'Thuốc chống co giật Natri Valproate',
    typicalPattern: 'hepatocellular',
    liverToxClass: 'A',
    latencyDescription: '1 đến 6 tháng sau khi khởi trị.',
    mechanismAndPearl:
      'Ức chế quá trình beta-oxy hóa acid béo ở ty thể, gây nhiễm mỡ vi thể và tăng Amoniac máu (thậm chí khi men gan chỉ tăng nhẹ). Có thể dùng L-Carnitine giải độc.',
  },
  {
    name: 'Thảo dược / Thuốc Nam / TPCN không rõ nguồn gốc',
    nameVi: 'Thuốc sắc, thuốc lá, thảo dược giảm cân/trị đau khớp',
    typicalPattern: 'mixed',
    liverToxClass: 'A',
    latencyDescription: 'Vài ngày đến vài tháng sử dụng liên tục.',
    mechanismAndPearl:
      'Nguyên nhân DILI rất phổ biến tại Việt Nam. Thường chứa kim loại nặng, corticoid trộn lén hoặc các alkaloids tự nhiên gây độc vi quản mật và hoại tử tế bào gan.',
  },
];

export class DiliEngine {
  /**
   * Tính điểm Thang điểm RUCAM 2016 (Roussel Uclaf Causality Assessment Method)
   */
  static evaluateRucam(input: RucamAssessmentInput): RucamAssessmentResult {
    const isHepatocellular = input.injuryType === 'hepatocellular';

    // 1. Time to onset (Thời gian tiềm tàng)
    let timeToOnsetPoints = 0;
    if (input.timeFromStopToOnsetDays !== undefined && input.timeFromStopToOnsetDays > 0) {
      // Khởi phát sau khi đã ngừng thuốc
      if (isHepatocellular) {
        timeToOnsetPoints = input.timeFromStopToOnsetDays <= 15 ? 1 : 0;
      } else {
        timeToOnsetPoints = input.timeFromStopToOnsetDays <= 30 ? 1 : 0;
      }
    } else {
      // Đang dùng thuốc
      if (input.hasPriorExposure) {
        if (input.timeToOnsetDays >= 1 && input.timeToOnsetDays <= 15) timeToOnsetPoints = 2;
        else if (input.timeToOnsetDays > 15) timeToOnsetPoints = 1;
      } else {
        if (input.timeToOnsetDays >= 5 && input.timeToOnsetDays <= 90) timeToOnsetPoints = 2;
        else timeToOnsetPoints = 1;
      }
    }

    // 2. Course after stopping (Diễn tiến sau khi ngừng thuốc)
    let coursePoints = 0;
    if (input.courseAfterStoppingPercentDrop >= 50) {
      coursePoints = 3; // Giảm >= 50% trong 8 ngày (thể tế bào gan) hoặc 30 ngày (thể ứ mật)
    } else if (input.courseAfterStoppingPercentDrop >= 25) {
      coursePoints = 2;
    } else if (input.courseAfterStoppingPercentDrop >= 0) {
      coursePoints = 0;
    } else {
      coursePoints = -2; // Men tiếp tục tăng sau khi ngừng thuốc
    }

    // 3. Risk factors (Yếu tố nguy cơ: Tuổi, Rượu, Mang thai)
    let riskFactorPoints = 0;
    if (input.hasAlcoholOrPregnancyRisk) riskFactorPoints += 1;
    if (input.patientAge >= 55) riskFactorPoints += 1;
    riskFactorPoints = Math.min(2, riskFactorPoints);

    // 4. Concomitant drugs (Thuốc dùng đồng thời)
    let concomitantDrugsPoints = 0;
    if (input.concomitantDrugsCount === 0) {
      concomitantDrugsPoints = 0;
    } else if (input.concomitantDrugsCount === 1) {
      concomitantDrugsPoints = -1;
    } else {
      concomitantDrugsPoints = -2;
    }

    // 5. Exclusion of non-drug causes (Loại trừ các nguyên nhân ngoài thuốc)
    let exclusionPoints = 0;
    if (input.otherCausesExcludedLevel === 'complete') {
      exclusionPoints = 2; // Đã loại trừ đầy đủ HAV, HBV, HCV, tắc mật trên US, gan sốc, tự miễn...
    } else if (input.otherCausesExcludedLevel === 'partial') {
      exclusionPoints = 1;
    } else {
      exclusionPoints = -2;
    }

    // 6. Previous information on hepatotoxicity (Tra cứu LiverTox)
    let previousInformationPoints = 0;
    if (input.previousLiverToxClass === 'A' || input.previousLiverToxClass === 'B') {
      previousInformationPoints = 2; // Thuốc đã được chứng minh rõ độc tính gan trong y văn
    } else if (input.previousLiverToxClass === 'C' || input.previousLiverToxClass === 'D') {
      previousInformationPoints = 1;
    } else {
      previousInformationPoints = 0;
    }

    // 7. Rechallenge (Tái phơi nhiễm thuốc)
    let rechallengePoints = 0;
    if (input.rechallengeResult === 'positive') rechallengePoints = 3;
    else if (input.rechallengeResult === 'negative') rechallengePoints = -2;
    else rechallengePoints = 0;

    const totalScore =
      timeToOnsetPoints +
      coursePoints +
      riskFactorPoints +
      concomitantDrugsPoints +
      exclusionPoints +
      previousInformationPoints +
      rechallengePoints;

    let category: RucamCausalityCategory;
    let categoryLabelVi = '';
    let recommendation = '';

    if (totalScore >= 9) {
      category = 'highly_probable';
      categoryLabelVi = 'RẤT CÓ THỂ (Highly Probable, Điểm > 8)';
      recommendation = `Độ tin cậy gần như tuyệt đối khẳng định tổn thương gan do thuốc (${input.drugName}). Bắt buộc NGỪNG VĨNH VIỄN thuốc này, ghi rõ vào hồ sơ bệnh án dị ứng/độc chất để tránh tái chỉ định.`;
    } else if (totalScore >= 6) {
      category = 'probable';
      categoryLabelVi = 'CÓ KHẢ NĂNG CAO (Probable, Điểm 6 - 8)';
      recommendation = `Tỷ lệ cao tổn thương gan là do ${input.drugName}. Ngừng ngay thuốc và theo dõi động học men gan mỗi tuần đến khi hạ về bình thường.`;
    } else if (totalScore >= 3) {
      category = 'possible';
      categoryLabelVi = 'CÓ THỂ (Possible, Điểm 3 - 5)';
      recommendation = `Chưa thể khẳng định chắc chắn. Cần tiếp tục làm thêm các xét nghiệm loại trừ triệt để viêm gan virus, tự miễn và theo dõi đáp ứng sau khi ngừng thuốc.`;
    } else if (totalScore >= 1) {
      category = 'unlikely';
      categoryLabelVi = 'ÍT CÓ KHẢ NĂNG (Unlikely, Điểm 1 - 2)';
      recommendation = 'Khả năng tổn thương gan do thuốc thấp. Tập trung tìm kiếm các nguyên nhân nguyên phát khác (virus, sỏi mật, chuyển hóa).';
    } else {
      category = 'excluded';
      categoryLabelVi = 'BỊ LOẠI TRỪ (Excluded, Điểm <= 0)';
      recommendation = 'Loại trừ hoàn toàn thuốc nghi ngờ này.';
    }

    return {
      totalScore,
      category,
      categoryLabelVi,
      breakdown: {
        timeToOnsetPoints,
        coursePoints,
        riskFactorPoints,
        concomitantDrugsPoints,
        exclusionPoints,
        previousInformationPoints,
        rechallengePoints,
      },
      recommendation,
    };
  }

  /**
   * Đánh giá và hướng dẫn xử trí Độc Gan Do Thuốc Lao (Anti-TB DILI)
   * Chuẩn hóa theo Hướng dẫn của ATS/CDC và Chương trình Chống Lao Quốc gia (Bộ Y Tế)
   */
  static evaluateAntiTbDili(data: {
    alt: number;
    ast: number;
    altUln: number;
    astUln: number;
    totalBiliMgDl: number;
    hasSymptoms: boolean; // Buồn nôn, nôn, đau bụng, mệt lả, chán ăn
    isRechallengePhase?: boolean;
    isSevereTbCase?: boolean; // Lao kê, lao màng não, lao kháng thuốc nặng
  }): AntiTbDiliDecision {
    const maxTransaminaseMultiple = Math.max(data.alt / data.altUln, data.ast / data.astUln);
    const isHyLawMet = maxTransaminaseMultiple >= 3.0 && data.totalBiliMgDl >= 2.0;

    const meetsStopCriteria =
      (maxTransaminaseMultiple >= 3.0 && data.hasSymptoms) ||
      maxTransaminaseMultiple >= 5.0 ||
      data.totalBiliMgDl >= 2.0;

    let action: AntiTbDiliAction = 'continue_monitor';
    let title = '';
    let severityReason = '';
    let temporaryBridgeRegimen: string | undefined = undefined;

    if (meetsStopCriteria) {
      action = 'stop_all_immediately';
      title = 'CHỈ ĐỊNH: NGỪNG NGAY TOÀN BỘ CÁC THUỐC LAO ĐANG DÙNG (STOP ALL ANTI-TB DRUGS)';
      severityReason = `Bệnh nhân đạt tiêu chuẩn ngừng thuốc lao bắt buộc: ${
        maxTransaminaseMultiple >= 5.0
          ? `Transaminase tăng >= 5x ULN (${maxTransaminaseMultiple.toFixed(1)}x ULN)`
          : maxTransaminaseMultiple >= 3.0 && data.hasSymptoms
          ? `Transaminase tăng >= 3x ULN (${maxTransaminaseMultiple.toFixed(1)}x ULN) KÈM TRIỆU CHỨNG LÂM SÀNG`
          : `Bilirubin toàn phần >= 2x ULN (${data.totalBiliMgDl} mg/dL)`
      }.`;

      if (data.isSevereTbCase) {
        temporaryBridgeRegimen =
          'PHÁC ĐỒ BẮC CẦU KHÔNG ĐỘC GAN (Dành cho Lao nặng/Lao màng não không thể ngừng điều trị): Phối hợp Streptomycin (S) + Ethambutol (E) + Fluoroquinolone (Levofloxacin 750mg/ngày hoặc Moxifloxacin 400mg/ngày).';
      }
    } else if (maxTransaminaseMultiple < 2.0 && data.totalBiliMgDl < 1.3 && data.isRechallengePhase) {
      action = 'rechallenge_ready';
      title = 'ĐỦ ĐIỀU KIỆN KHỞI ĐỘNG THỬ LẠI THUỐC LAO TUẦN TỰ (RECHALLENGE PROTOCOL)';
      severityReason =
        'Men gan đã hạ về mức an toàn (< 2x ULN) và Bilirubin đã về bình thường. Sẵn sàng thử lại từng thuốc theo phác đồ ATS.';
    } else {
      action = 'continue_monitor';
      title = 'TIẾP TỤC DÙNG THUỐC LAO & THEO DÕI SÁT MEN GAN MỖI TUẦN';
      severityReason = `Men gan tăng nhẹ (${maxTransaminaseMultiple.toFixed(1)}x ULN < 3-5x) và chưa có triệu chứng nhiễm độc gan. Đây có thể là hiện tượng tự thích ứng sinh học (adaptation).`;
    }

    const rechallengeSteps = [
      {
        dayRange: 'Ngày 1 - 3',
        drug: 'Rifampicin (RIF)',
        doseInstruction:
          'Khởi đầu Rifampicin 150-300 mg/ngày trong ngày 1-2, sau đó tăng lên đủ liều 450-600 mg/ngày nếu dung nạp tốt (RIF là thuốc hiệu quả cao nhất và ít độc gan nhất trong 3 thuốc R-H-Z).',
        labCheckInstruction: 'Xét nghiệm lại ALT/AST và Bilirubin vào Ngày thứ 3.',
      },
      {
        dayRange: 'Ngày 4 - 7',
        drug: 'Isoniazid (INH)',
        doseInstruction:
          'Nếu men gan ổn định sau 3 ngày dùng RIF, bắt đầu bổ sung Isoniazid: 100-150 mg/ngày trong 2 ngày đầu, sau đó tăng đủ liều 300 mg/ngày.',
        labCheckInstruction: 'Xét nghiệm lại ALT/AST và Bilirubin vào Ngày thứ 7.',
      },
      {
        dayRange: 'Sau Ngày 7',
        drug: 'Cân nhắc Pyrazinamide (PZA)',
        doseInstruction:
          'LƯU Ý QUAN TRỌNG: Nếu đợt DILI trước đó có vàng da hoặc viêm gan nặng, KHUYẾN CÁO BỎ HẲN PZA và chuyển sang phác đồ 9 tháng (2 R-H-E / 7 R-H). Nếu chỉ viêm gan nhẹ, có thể thử lại PZA liều thấp sau cùng và theo dõi rất chặt chẽ.',
        labCheckInstruction: 'Kiểm tra men gan mỗi tuần trong tháng đầu tiên.',
      },
    ];

    const clinicalPearls = [
      'Không bao giờ thử lại đồng thời cả 3 thuốc R-H-Z cùng một lúc vì sẽ không xác định được thuốc nào là thủ phạm gây độc.',
      'Bổ sung Pyridoxine (Vitamin B6 25-50mg/ngày) cho mọi bệnh nhân điều trị lao dùng Isoniazid để phòng ngừa viêm dây thần kinh ngoại biên và hỗ trợ chuyển hóa transaminase.',
      'Tránh rượu bia, paracetamol và các thuốc chuyển hóa qua gan khác trong suốt đợt điều trị.',
    ];

    return {
      action,
      title,
      severityReason,
      isHyLawMet,
      temporaryBridgeRegimen,
      rechallengeSteps,
      clinicalPearls,
    };
  }

  /**
   * Đánh giá nguy cơ tái hoạt Viêm gan B (HBV Reactivation) khi dùng ức chế miễn dịch
   */
  static evaluateHbvReactivation(data: {
    isHbsAgPositive: boolean;
    isAntiHbcPositive: boolean;
    drugCategory:
      | 'anti_cd20_rituximab'
      | 'high_dose_corticoid' // >= 20mg Prednisolone/ngày kéo dài >= 4 tuần
      | 'anthracycline_chemo'
      | 'anti_tnf_biologic'
      | 'low_dose_corticoid'
      | 'standard_chemo';
  }): HbvReactivationAssessment {
    let riskLevel: HbvReactivationRiskLevel = 'low';
    let riskPercentDescription = '< 1% (Nguy cơ thấp)';
    let prophylaxisIndicated = false;

    if (data.isHbsAgPositive) {
      if (
        data.drugCategory === 'anti_cd20_rituximab' ||
        data.drugCategory === 'high_dose_corticoid' ||
        data.drugCategory === 'anthracycline_chemo'
      ) {
        riskLevel = 'high';
        riskPercentDescription = '> 10% (NGUY CƠ CAO BÙNG PHÁT VIÊM GAN B TỐI CẤP)';
        prophylaxisIndicated = true;
      } else {
        riskLevel = 'moderate';
        riskPercentDescription = '1% - 10% (Nguy cơ trung bình)';
        prophylaxisIndicated = true;
      }
    } else if (data.isAntiHbcPositive) {
      // HBsAg âm tính nhưng Anti-HBc dương tính (Nhiễm HBV tiềm ẩn / đã hồi phục)
      if (data.drugCategory === 'anti_cd20_rituximab') {
        riskLevel = 'high';
        riskPercentDescription = '> 10% (Nguy cơ cao tái hoạt dù HBsAg âm tính)';
        prophylaxisIndicated = true;
      } else if (data.drugCategory === 'high_dose_corticoid' || data.drugCategory === 'anthracycline_chemo') {
        riskLevel = 'moderate';
        riskPercentDescription = '1% - 10%';
        prophylaxisIndicated = true;
      }
    }

    return {
      riskLevel,
      riskPercentDescription,
      prophylaxisIndicated,
      recommendedAgent: 'Tenofovir alafenamide (TAF 25mg/ngày) hoặc Entecavir (ETV 0.5mg/ngày) hoặc TDF 300mg/ngày.',
      durationInstruction:
        'Khởi trị thuốc kháng virus trước khi bắt đầu hóa trị/ức chế miễn dịch ít nhất 1-2 tuần và duy trì liên tục ít nhất 12 - 18 tháng sau khi kết thúc đợt ức chế miễn dịch (theo Hướng dẫn Bộ Y Tế & AASLD).',
    };
  }
}
