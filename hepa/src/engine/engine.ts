/**
 * HepaCDSS Core Clinical Decision Support Engine
 * Tích hợp toàn diện các quy chuẩn từ ACG 2017/2024, EASL 2024, WHO và Bộ Y Tế Việt Nam.
 */

import {
  ClinicalRedFlag,
  CustomULNSettings,
  DifferentialDiagnosis,
  HepaAnalysisResult,
  HepaInputData,
  ULNStandard,
} from '../types';
import { PatternEngine } from './pattern';
import { ClinicalRatiosEngine } from './ratios';
import { AlcoholicHepatitisEngine } from './scores/alcoholic';
import { ChildPughEngine } from './scores/childPugh';
import { FibrosisEngine } from './scores/fib4';
import { calculateNFS } from './scores/nfs';
import { KingsCollegeEngine } from './scores/kingsCollege';
import { MeldEngine } from './scores/meld';
import { RumackMatthewEngine } from './scores/rumackMatthew';
import {
  classifySLD,
  evaluateStatinSafety,
  evaluateExtrahepaticAst,
  evaluateIsolatedAlpVitaminD,
  generateIlftReflexScreen,
} from './sldStatin';
import { UnitConverter } from './units';

export class HepaEngine {
  /**
   * Phân tích toàn diện bộ dữ liệu đầu vào và đưa ra kết luận CDSS
   */
  static analyze(
    input: HepaInputData,
    standard: ULNStandard = 'acg2017',
    customULNs?: Partial<CustomULNSettings>
  ): HepaAnalysisResult {
    // 1. Chuẩn hóa giá trị về cả hai hệ đơn vị (SI & US)
    const totalBilirubinMgDl = UnitConverter.bilirubinToMgDl(
      input.totalBilirubin,
      input.bilirubinUnit || 'umol_l'
    );
    const totalBilirubinUmolL = UnitConverter.bilirubinToUmolL(
      input.totalBilirubin,
      input.bilirubinUnit || 'umol_l'
    );

    const directBilirubinMgDl =
      input.directBilirubin !== undefined
        ? UnitConverter.bilirubinToMgDl(input.directBilirubin, input.bilirubinUnit || 'umol_l')
        : undefined;
    const directBilirubinUmolL =
      input.directBilirubin !== undefined
        ? UnitConverter.bilirubinToUmolL(input.directBilirubin, input.bilirubinUnit || 'umol_l')
        : undefined;

    const albuminGDl =
      input.albumin !== undefined
        ? UnitConverter.albuminToGDl(input.albumin, input.albuminUnit || 'g_l')
        : undefined;
    const albuminGL =
      input.albumin !== undefined
        ? UnitConverter.albuminToGL(input.albumin, input.albuminUnit || 'g_l')
        : undefined;

    const creatinineMgDl =
      input.creatinine !== undefined
        ? UnitConverter.creatinineToMgDl(input.creatinine, input.creatinineUnit || 'umol_l')
        : undefined;
    const creatinineUmolL =
      input.creatinine !== undefined
        ? UnitConverter.creatinineToUmolL(input.creatinine, input.creatinineUnit || 'umol_l')
        : undefined;

    const plateletsKUl =
      input.platelets !== undefined ? UnitConverter.normalizePlatelets(input.platelets) : undefined;

    // 2. Xác định các ngưỡng ULN phù hợp
    const ulns = PatternEngine.resolveULN(
      input.gender,
      standard,
      customULNs,
      {
        altUln: input.altUln,
        astUln: input.astUln,
        alpUln: input.alpUln,
        ggtUln: input.ggtUln,
      },
      {
        isPregnancyThirdTrimester: input.isPregnancyThirdTrimester,
        isChildOrAdolescent: input.isChildOrAdolescent,
      }
    );

    // 3. Tính bội số và chỉ số R
    const altMultiples = Number((input.alt / ulns.altUln).toFixed(1));
    const astMultiples = Number((input.ast / ulns.astUln).toFixed(1));
    const alpMultiples = Number((input.alp / ulns.alpUln).toFixed(1));
    const ggtMultiples =
      input.ggt !== undefined && ulns.ggtUln > 0
        ? Number((input.ggt / ulns.ggtUln).toFixed(1))
        : undefined;

    const rRatio = PatternEngine.calculateRRatio(
      input.alt,
      ulns.altUln,
      input.alp,
      ulns.alpUln
    );
    const nRRatio = PatternEngine.calculateNRRatio(
      input.alt,
      ulns.altUln,
      input.ast,
      ulns.astUln,
      input.alp,
      ulns.alpUln
    );

    const { pattern, description: patternDescription } = PatternEngine.determinePattern(
      rRatio,
      input.alt,
      ulns.altUln,
      input.ast,
      ulns.astUln,
      input.alp,
      ulns.alpUln,
      totalBilirubinMgDl
    );

    const { severity } = PatternEngine.determineSeverity(
      input.alt,
      ulns.altUln,
      input.ast,
      ulns.astUln
    );

    const {
      predominance: bilirubinPredominance,
      conjugatedPercent,
    } = PatternEngine.determineBilirubinPredominance(
      totalBilirubinMgDl,
      directBilirubinMgDl
    );

    // 4. Các tỷ số lâm sàng chuyên sâu
    const deRitisResult = ClinicalRatiosEngine.evaluateDeRitis(input.ast, input.alt);
    const astLdhResult = ClinicalRatiosEngine.evaluateAstLdh(input.ast, input.ldhUL);
    const wilsonResult = ClinicalRatiosEngine.evaluateWilsonSuspicion(
      input.alp,
      totalBilirubinMgDl,
      input.ast,
      input.alt,
      input.age
    );
    const hysLawResult = ClinicalRatiosEngine.evaluateHysLaw(
      input.alt,
      ulns.altUln,
      input.ast,
      ulns.astUln,
      totalBilirubinMgDl,
      input.alp,
      ulns.alpUln
    );
    const aihSuspicion = ClinicalRatiosEngine.evaluateAihSuspicion(
      input.alp,
      input.ast,
      input.alt
    );
    const alpOrigin = ClinicalRatiosEngine.evaluateAlpOrigin(
      input.alp,
      ulns.alpUln,
      input.ggt,
      ulns.ggtUln
    );

    // 5. Thang điểm tiên lượng
    const bmi =
      input.bmi !== undefined
        ? input.bmi
        : input.weightKg && input.heightCm
        ? Number((input.weightKg / Math.pow(input.heightCm / 100, 2)).toFixed(1))
        : undefined;

    const fib4 =
      plateletsKUl !== undefined
        ? FibrosisEngine.calculateFib4(
            input.age,
            input.ast,
            input.alt,
            plateletsKUl,
            input.hasDiabetesOrMetabolicRisk ? 'masld' : 'viral'
          )
        : undefined;

    const apri =
      plateletsKUl !== undefined
        ? FibrosisEngine.calculateApri(input.ast, ulns.astUln, plateletsKUl)
        : undefined;

    const nfs =
      bmi !== undefined && plateletsKUl !== undefined && albuminGDl !== undefined
        ? calculateNFS({
            age: input.age,
            bmi,
            hasDiabetesOrIFG: Boolean(input.hasDiabetesOrIFG || input.hasDiabetesOrMetabolicRisk),
            ast: input.ast,
            alt: input.alt,
            plateletsG_L: plateletsKUl,
            albuminG_dL: albuminGDl,
          })
        : undefined;

    const childPugh =
      albuminGDl !== undefined && input.inr !== undefined
        ? ChildPughEngine.calculate(
            totalBilirubinMgDl,
            albuminGDl,
            input.inr,
            input.ascites || 'none',
            input.encephalopathy || 'none'
          )
        : undefined;

    const meld =
      input.inr !== undefined
        ? MeldEngine.evaluate(
            input.gender,
            totalBilirubinMgDl,
            input.inr,
            creatinineMgDl,
            albuminGDl,
            input.sodiumMeqL
          )
        : undefined;

    const maddrey = AlcoholicHepatitisEngine.calculateMaddreyDf(
      totalBilirubinMgDl,
      input.prothrombinTimePatientSeconds,
      input.prothrombinTimeControlSeconds || 12,
      input.inr
    );

    const lille =
      input.day7TotalBilirubin !== undefined && albuminGL !== undefined && creatinineUmolL !== undefined && input.inr !== undefined
        ? AlcoholicHepatitisEngine.calculateLilleModel(
            input.age,
            albuminGL,
            creatinineUmolL,
            input.inr,
            totalBilirubinMgDl,
            input.day7TotalBilirubin
          )
        : undefined;

    const kingsCollege = KingsCollegeEngine.evaluate({
      isParacetamolInduced: input.paracetamolLevelMcgMl !== undefined && input.paracetamolLevelMcgMl > 0,
      inr: input.inr,
      creatinineMgDl,
      hasGrade3or4Encephalopathy: input.encephalopathy === 'grade_3_4',
      age: input.age,
      totalBiliMgDl: totalBilirubinMgDl,
    });

    const rumackMatthew =
      input.paracetamolIngestionHours !== undefined && input.paracetamolLevelMcgMl !== undefined
        ? RumackMatthewEngine.evaluate(
            input.paracetamolIngestionHours,
            input.paracetamolLevelMcgMl,
            input.weightKg || 70
          )
        : undefined;

    // 5.1. Phân loại SLD 2023, Statin, AST ngoài gan, iLFT Reflex
    const totalAlcoholGrams =
      input.alcoholGramsPerWeek ??
      (input.weeklyAlcoholUnits ? input.weeklyAlcoholUnits * 8 : 0);

    const sldClassification = classifySLD({
      gender: input.gender,
      totalAlcoholGramsPerWeek: totalAlcoholGrams,
      auditCScore: input.auditCScore,
      bmi,
      hasDiabetesOrMetabolicRisk: Boolean(
        input.hasDiabetesOrMetabolicRisk || input.hasDiabetesOrIFG
      ),
    });

    const statinGuidance = input.isTakingStatin
      ? evaluateStatinSafety({
          isTakingStatin: true,
          altMultiples,
          astMultiples,
        })
      : undefined;

    const extrahepaticAst = evaluateExtrahepaticAst({
      ast: input.ast,
      alt: input.alt,
      astUln: ulns.astUln,
      altUln: ulns.altUln,
      ckUL: input.ckUL,
      strenuousExercise: input.strenuousExercise,
    });

    const isolatedAlpVitaminD = evaluateIsolatedAlpVitaminD({
      alpMultiples,
      altMultiples,
      astMultiples,
      ggtMultiples,
      boneAlpSuspicion: alpOrigin.isIsolatedAlpSuspiciousForBone,
      vitaminDNgMl: input.vitaminDNgMl,
    });

    const ilftReflex = generateIlftReflexScreen({
      pattern,
      altMultiples,
      rRatio,
      deRitisRatio: deRitisResult.ratio,
      age: input.age,
    });

    // 6. Phát hiện Cảnh báo khẩn cấp (Clinical Red Flags)
    const redFlags: ClinicalRedFlag[] = [];

    // Suy gan cấp (ALF)
    const isAcuteLiverFailure =
      input.inr !== undefined &&
      input.inr >= 1.5 &&
      input.encephalopathy !== undefined &&
      input.encephalopathy !== 'none';

    if (isAcuteLiverFailure) {
      redFlags.push({
        id: 'alf_warning',
        title: 'CẢNH BÁO TỐI KHẨN: NGUY CƠ SUY GAN CẤP (ACUTE LIVER FAILURE - ALF)',
        severity: 'emergency',
        description: `Bệnh nhân có rối loạn đông máu cấp (INR = ${input.inr} >= 1.5) đi kèm bệnh não gan. Tỷ lệ tử vong nếu không hồi sức chuyên khoa hoặc ghép gan lên tới > 80%.`,
        immediateAction:
          'Chuyển ngay đến Đơn vị Hồi sức Gan Mật / Ghép gan. Đặt đường truyền lớn, theo dõi đường huyết mao mạch, khí máu động mạch, cân nhắc truyền NAC tĩnh mạch sớm.',
      });
    }

    // Tăng men gan mức khổng lồ
    if (severity === 'massive') {
      redFlags.push({
        id: 'massive_transaminitis',
        title: 'TĂNG TRANSAMINASE MỨC ĐỘ KHỔNG LỒ (> 10,000 U/L)',
        severity: 'emergency',
        description: `ALT (${input.alt} U/L) hoặc AST (${input.ast} U/L) vượt ngưỡng 10,000 U/L. Gợi ý 3 căn nguyên đe dọa tính mạng: (1) Sốc gan / Viêm gan thiếu máu cục bộ; (2) Ngộ độc Paracetamol; (3) Nấm độc Amanita phalloides.`,
        immediateAction:
          'Định lượng ngay nồng độ Paracetamol huyết thanh, làm khí máu động mạch (lactate, pH), siêu âm Doppler mạch máu gan, hồi phục ngay huyết động.',
      });
    }

    // Tiêu chuẩn Định luật Hy (Hy's Law)
    if (hysLawResult.isMet) {
      redFlags.push({
        id: 'hys_law_positive',
        title: 'CẢNH BÁO TIÊU CHUẨN ĐỊNH LUẬT HY (HY\'S LAW DƯƠNG TÍNH)',
        severity: 'emergency',
        description: hysLawResult.explanation,
        immediateAction:
          'Rà soát và NGỪNG NGAY toàn bộ các thuốc kê đơn, OTC, thực phẩm chức năng, thảo dược nghi ngờ gây độc gan (DILI).',
      });
    }

    // Tiêu cơ vân (Rhabdomyolysis)
    if (input.ckUL && input.ckUL > 1000 && deRitisResult.ratio >= 3.0) {
      redFlags.push({
        id: 'rhabdomyolysis_alert',
        title: 'CẢNH BÁO TIÊU CƠ VÂN (PSEUDO-HEPATITIS DO HỦY CƠ)',
        severity: 'warning',
        description: `Creatine Kinase (CK) tăng rất cao (${input.ckUL} U/L) đi kèm AST tăng vọt vượt trội so với ALT (De Ritis = ${deRitisResult.ratio}). Đây là tình trạng giải phóng AST từ cơ xương chứ không phải hủy hoại tế bào gan nguyên phát.`,
        immediateAction:
          'Truyền dịch kiềm hóa nước tiểu phòng ngừa suy thận cấp do Myoglobin, kiểm tra Myoglobin niệu và chức năng thận.',
      });
    }

    // Nghi ngờ nguồn gốc ALP ngoài gan
    if (alpOrigin.isIsolatedAlpSuspiciousForBone) {
      redFlags.push({
        id: 'isolated_alp_bone',
        title: 'LƯU Ý: TĂNG ALP ĐƠN ĐỘC GỢI Ý NGUỒN GỐC XƯƠNG',
        severity: 'caution',
        description: alpOrigin.explanation,
        immediateAction:
          'Kiểm tra thêm xét nghiệm xương (Canxi, Phospho, PTH, X-quang/Xạ hình xương) hoặc định lượng 5\'-Nucleotidase trước khi can thiệp đường mật.',
      });
    }

    // 7. Chẩn đoán phân biệt xếp hạng theo xác suất lâm sàng (Differential Diagnoses)
    const differentialDiagnoses: DifferentialDiagnosis[] = [];

    // Viêm gan thiếu máu cục bộ (Gan sốc)
    if (
      (severity === 'severe' || severity === 'massive') &&
      (astLdhResult?.suspectIschemicHepatitis || deRitisResult.ratio > 1.2)
    ) {
      differentialDiagnoses.push({
        disease: 'Viêm gan thiếu máu cục bộ / Gan sốc (Ischemic Hepatitis / Shock Liver)',
        likelihood: astLdhResult?.suspectIschemicHepatitis ? 'very_high' : 'high',
        clues: `Men gan tăng cực cao (>15x đến >10,000 U/L), AST thường tăng cao hơn ALT giai đoạn đầu, LDH tăng vọt (AST/LDH < 1.5). Thường xảy ra sau đợt tụt huyết áp, sốc tim hoặc suy hô hấp.`,
        confirmingTests:
          'Theo dõi động học men gan (giảm >50% sau 24-48h khi tưới máu phục hồi), siêu âm Doppler tĩnh mạch cửa/tĩnh mạch gan.',
        evidencePoints: [
          `Mức độ tăng men: ${severity.toUpperCase()}`,
          `Tỷ số AST/LDH: ${astLdhResult?.ratio || 'Chưa có'}`,
          `De Ritis: ${deRitisResult.ratio}`,
        ],
      });
    }

    // Ngộ độc Paracetamol
    if (
      severity === 'massive' ||
      (rumackMatthew && rumackMatthew.toxicityRisk === 'toxic') ||
      (input.paracetamolLevelMcgMl && input.paracetamolLevelMcgMl > 50)
    ) {
      differentialDiagnoses.push({
        disease: 'Ngộ độc Paracetamol cấp (Acetaminophen-induced Acute Liver Injury)',
        likelihood:
          rumackMatthew?.toxicityRisk === 'toxic' ? 'very_high' : severity === 'massive' ? 'high' : 'possible',
        clues:
          'ALT/AST tăng vọt cực nhanh, rối loạn đông máu xuất hiện sớm, nguy cơ toan chuyển hóa tăng acid lactic.',
        confirmingTests:
          'Định lượng nồng độ Paracetamol huyết thanh đối chiếu Rumack-Matthew, khí máu động mạch, chỉ định ngay N-Acetylcysteine.',
        evidencePoints: [
          `ALT ${input.alt} U/L, AST ${input.ast} U/L`,
          `Nồng độ Paracetamol: ${input.paracetamolLevelMcgMl || 'Chưa định lượng'} mcg/mL`,
        ],
      });
    }

    // Viêm gan virus cấp tính (HAV, HBV, HCV, HEV)
    if (
      (pattern === 'hepatocellular' || pattern === 'mixed') &&
      severity !== 'normal' &&
      deRitisResult.ratio < 1.0
    ) {
      const isViralHigh = severity === 'severe' || severity === 'moderate';
      differentialDiagnoses.push({
        disease: isViralHigh
          ? 'Viêm gan virus cấp tính (Acute Viral Hepatitis A, B, C, E)'
          : 'Viêm gan virus mạn tính bùng phát nhẹ (Chronic Viral Hepatitis B/C Flare)',
        likelihood: isViralHigh ? 'very_high' : input.hasDiabetesOrMetabolicRisk ? 'possible' : 'high',
        clues: `Tổn thương tế bào gan rõ rệt (R = ${rRatio}), ALT tăng ưu thế hơn AST (De Ritis = ${deRitisResult.ratio} < 1.0 do ALT có thời gian bán hủy dài ~47h), Bilirubin trực tiếp tăng kèm sau đỉnh men.`,
        confirmingTests:
          'Bilan serology: HBsAg, IgM anti-HBc, Anti-HCV (+ HCV-RNA), IgM anti-HAV, IgM anti-HEV.',
        evidencePoints: [
          `Chỉ số R = ${rRatio} (${pattern})`,
          `Tỷ số De Ritis = ${deRitisResult.ratio} (< 1.0)`,
          `Bilirubin trực tiếp chiếm ${conjugatedPercent || 0}%`,
        ],
      });
    }

    // Bệnh gan do rượu (ARLD / Alcoholic Hepatitis)
    if (deRitisResult.ratio >= 2.0 && input.alt < 500) {
      const isHighAlcohol = (input.alcoholGramsPerWeek || 0) > 140;
      differentialDiagnoses.push({
        disease: 'Bệnh gan do rượu / Viêm gan do rượu (Alcohol-Related Liver Disease)',
        likelihood: isHighAlcohol ? 'very_high' : 'high',
        clues: `Tỷ số De Ritis AST/ALT = ${deRitisResult.ratio} (>= 2:1 là dấu hiệu kinh điển của rượu do thiếu hụt Vitamin B6 ức chế ALT và hủy ty thể giải phóng mAST). Men AST hiếm khi vượt quá 400 U/L. GGT thường tăng rất cao.`,
        confirmingTests:
          'Khai thác lượng rượu tiêu thụ, định lượng PEth nếu cần, tính điểm Maddrey DF nếu vàng da nặng để chỉ định Corticoid.',
        evidencePoints: [
          `Tỷ số De Ritis = ${deRitisResult.ratio} (>= 2.0)`,
          `AST = ${input.ast} U/L (< 400-500 U/L)`,
          `Lượng cồn khai thác: ${input.alcoholGramsPerWeek || 0} g/tuần`,
        ],
      });
    }

    // Gan nhiễm mỡ chuyển hóa (MASLD / MASH)
    if (
      (pattern === 'hepatocellular' || pattern === 'mixed') &&
      (severity === 'borderline' || severity === 'mild') &&
      deRitisResult.ratio <= 1.2
    ) {
      differentialDiagnoses.push({
        disease: 'Bệnh gan nhiễm mỡ chuyển hóa (MASLD / MASH)',
        likelihood: input.hasDiabetesOrMetabolicRisk ? 'very_high' : 'high',
        clues: `Men gan tăng nhẹ dai dẳng (< 5x ULN), ALT thường > AST (trừ khi có xơ hóa tiến triển chuyển sang AST > ALT), liên quan hội chứng chuyển hóa, thừa cân/béo phì, đái tháo đường type 2.`,
        confirmingTests:
          'Siêu âm gan tìm hình ảnh tăng âm lan tỏa, đo độ đàn hồi mô gan (FibroScan) đánh giá CAP nhiễm mỡ và độ cứng mô gan (kPa).',
        evidencePoints: [
          `Mức độ tăng men: ${severity}`,
          `De Ritis: ${deRitisResult.ratio}`,
          `Chỉ số FIB-4: ${fib4?.score || 'Chưa tính'}`,
        ],
      });
    }

    // Tắc mật cơ học ngoài gan (Sỏi OMC / U đường mật tụy)
    if (pattern === 'cholestatic' && input.ultrasoundBiliaryDilatation === 'dilated') {
      differentialDiagnoses.push({
        disease: 'Tắc mật cơ học ngoài gan (Sỏi ống mật chủ / U bóng Vater - Đầu tụy)',
        likelihood: 'very_high',
        clues: `Hội chứng ứ mật rõ rệt (R = ${rRatio} < 2), ALP và GGT tăng cao song hành, Bilirubin trực tiếp ưu thế, siêu âm ghi nhận DÃN ĐƯỜNG MẬT.`,
        confirmingTests:
          'Chụp cộng hưởng từ mật tụy (MRCP) hoặc ERCP can thiệp lấy sỏi / đặt stent đường mật cấp cứu nếu có viêm đường mật cấp (tam chứng Charcot).',
        evidencePoints: [
          `Chỉ số R = ${rRatio} (Ứ mật)`,
          `Siêu âm: Có dãn đường mật trong/ngoài gan`,
          `Bilirubin trực tiếp: ${conjugatedPercent || 0}%`,
        ],
      });
    }

    // Xơ đường mật nguyên phát (PBC)
    if (pattern === 'cholestatic' && input.ultrasoundBiliaryDilatation === 'non_dilated') {
      differentialDiagnoses.push({
        disease: 'Xơ đường mật nguyên phát (Primary Biliary Cholangitis - PBC)',
        likelihood: input.gender === 'female' ? 'high' : 'possible',
        clues: `Ứ mật trong gan mạn tính (ALP và GGT tăng cao kéo dài), siêu âm xác nhận KHÔNG DÃN ĐƯỜNG MẬT (loại trừ sỏi/u), thường gặp ở phụ nữ trung niên với triệu chứng ngứa và mệt mỏi.`,
        confirmingTests:
          'Định lượng Kháng thể kháng ty thể (AMA - dương tính >95% ở PBC), IgM huyết thanh. Khởi trị sớm bằng Ursodeoxycholic acid (UDCA 13-15 mg/kg/ngày).',
        evidencePoints: [
          `Chỉ số R = ${rRatio} (Ứ mật)`,
          `Siêu âm: Đường mật không dãn`,
          `Giới tính: ${input.gender === 'female' ? 'Nữ' : 'Nam'}`,
        ],
      });
    }

    // Viêm gan tự miễn (AIH)
    if (pattern === 'hepatocellular' && (severity === 'moderate' || severity === 'severe') && aihSuspicion) {
      differentialDiagnoses.push({
        disease: 'Viêm gan tự miễn (Autoimmune Hepatitis - AIH)',
        likelihood: input.gender === 'female' ? 'high' : 'possible',
        clues: `Tổn thương hoại tử tế bào gan rõ rệt (R > 5), tỷ lệ ALP/AST < 3, thường gặp ở nữ giới có tiền sử bệnh tự miễn đi kèm.`,
        confirmingTests:
          'Định lượng IgG huyết thanh (tăng đa dòng), bộ tự kháng thể: ANA, ASMA, Anti-LKM1; cân nhắc sinh thiết gan.',
        evidencePoints: [
          `Chỉ số R = ${rRatio}`,
          `Tỷ số ALP/AST < 3.0 (phù hợp AIH)`,
          `Giới tính: ${input.gender === 'female' ? 'Nữ' : 'Nam'}`,
        ],
      });
    }

    // Bệnh Wilson
    if (wilsonResult?.isHighlySuspicious) {
      differentialDiagnoses.push({
        disease: 'Bệnh Wilson thể cấp (Wilson Disease)',
        likelihood: 'high',
        clues: wilsonResult.explanation,
        confirmingTests:
          'Định lượng Ceruloplasmin huyết thanh (< 20 mg/dL), Đồng nước tiểu 24h, khám mắt đèn khe tìm vòng Kayser-Fleischer.',
        evidencePoints: [
          `ALP/Bilirubin = ${wilsonResult.ratioAlpToBili} (< 4.0)`,
          `AST/ALT = ${wilsonResult.astToAltRatio} (> 2.2)`,
        ],
      });
    }

    // Hội chứng Gilbert
    if (pattern === 'isolated_hyperbilirubinemia' && bilirubinPredominance === 'unconjugated') {
      differentialDiagnoses.push({
        disease: 'Hội chứng Gilbert (Tăng Bilirubin gián tiếp lành tính)',
        likelihood: 'very_high',
        clues: `Tăng Bilirubin đơn độc ưu thế gián tiếp (${100 - (conjugatedPercent || 0)}% > 80%), tất cả men gan (ALT, AST, ALP, GGT) hoàn toàn bình thường, không có triệu chứng thực thể, thường rõ lên sau khi nhịn đói hoặc stress/thiếu ngủ.`,
        confirmingTests:
          'Công thức máu, hồng cầu lưới, LDH, Haptoglobin để loại trừ tán huyết. Trấn an bệnh nhân đây là biến dị di truyền lành tính của gen UGT1A1, không cần dùng thuốc.',
        evidencePoints: [
          `Bilirubin toàn phần = ${totalBilirubinMgDl} mg/dL (${totalBilirubinUmolL} µmol/L)`,
          `Bilirubin gián tiếp ưu thế tuyệt đối`,
          `Các men ALT, AST, ALP bình thường`,
        ],
      });
    }

    // Sắp xếp chẩn đoán phân biệt theo trọng số xác suất lâm sàng (Likelihood Priority)
    const likelihoodWeight: Record<string, number> = {
      very_high: 4,
      high: 3,
      possible: 2,
      unlikely: 1,
      ruled_out: 0,
    };
    differentialDiagnoses.sort(
      (a, b) => (likelihoodWeight[b.likelihood] || 0) - (likelihoodWeight[a.likelihood] || 0)
    );

    // 8. Lộ trình khuyến cáo can thiệp từng bước theo ACG 2017
    const stepByStepRecommendations: string[] = [];

    if (isAcuteLiverFailure || kingsCollege.criteriaMet) {
      stepByStepRecommendations.push(
        'BƯỚC CẤP CỨU: Hội chẩn khẩn cấp chuyên khoa Hồi sức Cấp cứu & Ghép Gan. Chuẩn bị đường thở, kiểm soát đông máu và đường huyết.'
      );
    }

    stepByStepRecommendations.push(
      'BƯỚC 1 (Đánh giá bối cảnh lâm sàng): Tái xác nhận kết quả nếu bất thường nhẹ không triệu chứng để loại trừ sai số tạm thời. Rà soát danh mục thuốc (kê đơn, OTC, thực phẩm chức năng, thuốc nam), định lượng lượng cồn sử dụng (AUDIT-C).'
    );

    if (pattern === 'hepatocellular') {
      stepByStepRecommendations.push(
        'BƯỚC 2 (Tầm soát căn nguyên tế bào gan): Chỉ định bộ huyết thanh vi rút (HBsAg, Anti-HCV, IgM anti-HAV), siêu âm bụng tổng quát đánh giá nhu mô gan và tĩnh mạch cửa.'
      );
      if (input.age < 55) {
        stepByStepRecommendations.push(
          'BƯỚC 3 (Tầm soát mở rộng): Khung sắt huyết thanh (Ferritin, %Sat Transferrin); Kháng thể tự miễn (ANA, ASMA, IgG); Ceruloplasmin nếu nghi ngờ Wilson.'
        );
      }
    } else if (pattern === 'cholestatic') {
      stepByStepRecommendations.push(
        'BƯỚC 2 (Khảo sát hình ảnh học đường mật): Siêu âm bụng hạ sườn phải khẩn cấp để phân biệt dãn đường mật (sỏi/u tắc mật ngoài gan) hay không dãn (ứ mật trong gan).'
      );
      if (input.ultrasoundBiliaryDilatation === 'dilated') {
        stepByStepRecommendations.push(
          'BƯỚC 3 (Xử trí tắc mật ngoài gan): Chỉ định chụp cộng hưởng từ mật tụy (MRCP) hoặc can thiệp nội soi mật tụy ngược dòng (ERCP) lấy sỏi/đặt stent.'
        );
      } else {
        stepByStepRecommendations.push(
          'BƯỚC 3 (Khảo sát ứ mật trong gan): Định lượng kháng thể kháng ty thể (AMA) để chẩn đoán PBC, định lượng IgG4 loại trừ viêm xơ đường mật liên quan IgG4.'
        );
      }
    } else if (pattern === 'isolated_hyperbilirubinemia') {
      stepByStepRecommendations.push(
        'BƯỚC 2 (Phân biệt tán huyết vs Gilbert): Tổng phân tích tế bào máu, hồng cầu lưới, nghiệm pháp Coombs, LDH và Haptoglobin.'
      );
    }

    if (fib4) {
      stepByStepRecommendations.push(
        `BƯỚC 4 (Lượng giá xơ hóa gan): Điểm FIB-4 = ${fib4.score} (${fib4.stageDescription}) -> ${fib4.recommendation}`
      );
    }

    // 9. Xác định phân tuyến can thiệp
    let referralTier: 'primary' | 'specialist' | 'emergency_transplant' = 'primary';
    if (isAcuteLiverFailure || kingsCollege.criteriaMet || severity === 'massive' || hysLawResult.isMet) {
      referralTier = 'emergency_transplant';
    } else if (
      pattern !== 'normal' &&
      (severity === 'moderate' ||
        severity === 'severe' ||
        pattern === 'cholestatic' ||
        (fib4 && fib4.riskCategory === 'high') ||
        (childPugh && childPugh.grade !== 'A'))
    ) {
      referralTier = 'specialist';
    } else {
      referralTier = 'primary';
    }

    return {
      timestamp: new Date().toISOString(),
      normalizedValues: {
        totalBilirubinMgDl,
        totalBilirubinUmolL,
        directBilirubinMgDl,
        directBilirubinUmolL,
        albuminGDl,
        albuminGL,
        creatinineMgDl,
        creatinineUmolL,
        plateletsKUl,
      },
      rRatio,
      nRRatio,
      pattern,
      patternDescription,
      severity,
      altMultiples,
      astMultiples,
      alpMultiples,
      ggtMultiples,
      deRitisRatio: deRitisResult.ratio,
      deRitisInterpretation: deRitisResult.interpretation,
      bilirubinPredominance,
      conjugatedPercent,
      astLdhRatio: astLdhResult?.ratio,
      astLdhInterpretation: astLdhResult?.interpretation,
      wilsonRatioAlpBili: wilsonResult?.ratioAlpToBili,
      wilsonSuspicion: wilsonResult?.isHighlySuspicious,
      aihRatioAlpAst: Number((input.alp / (input.ast || 1)).toFixed(2)),
      aihSuspicion,
      hysLawMet: hysLawResult.isMet,
      boneAlpSuspicion: alpOrigin.isIsolatedAlpSuspiciousForBone,
      fib4,
      apri,
      nfs,
      childPugh,
      meld,
      maddrey,
      lille,
      kingsCollege,
      rumackMatthew,
      sldClassification,
      statinGuidance,
      extrahepaticAst,
      isolatedAlpVitaminD,
      ilftReflex,
      redFlags,
      differentialDiagnoses,
      stepByStepRecommendations,
      referralTier,
    };
  }
}
