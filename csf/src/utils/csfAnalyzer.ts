import { CSFInput, CSFAnalysisResult, DiagnosticLikelihood } from '../types/csf';

/**
 * Standardize units to mg/dL for calculations
 */
export function normalizeInputs(input: CSFInput) {
  const proteinMgDl = input.proteinUnit === 'g/L' ? input.protein * 100 : input.protein;
  const csfGlucoseMgDl = input.glucoseUnit === 'mmol/L' ? input.csfGlucose * 18.018 : input.csfGlucose;
  const serumGlucoseMgDl = input.serumGlucose 
    ? (input.glucoseUnit === 'mmol/L' ? input.serumGlucose * 18.018 : input.serumGlucose)
    : undefined;
  
  const lactateMmol = input.lactate !== undefined
    ? (input.lactateUnit === 'mg/dL' ? input.lactate / 9.008 : input.lactate)
    : undefined;

  return {
    proteinMgDl,
    csfGlucoseMgDl,
    serumGlucoseMgDl,
    lactateMmol,
  };
}

export function analyzeCSF(input: CSFInput): CSFAnalysisResult {
  const { proteinMgDl, csfGlucoseMgDl, serumGlucoseMgDl, lactateMmol } = normalizeInputs(input);

  // 1. Calculate CSF:Serum Glucose Ratio
  let glucoseRatio: number | null = null;
  let glucoseRatioPathological = false;
  if (serumGlucoseMgDl && serumGlucoseMgDl > 0) {
    glucoseRatio = Number((csfGlucoseMgDl / serumGlucoseMgDl).toFixed(2));
    if (glucoseRatio < 0.4) {
      glucoseRatioPathological = true;
    }
  } else if (csfGlucoseMgDl < 40) {
    // If no paired serum glucose available, CSF glucose < 40 is strongly suspicious for hypoglycemia in CSF
    glucoseRatioPathological = true;
  }

  // 2. Traumatic Tap WBC correction
  let predictedTraumaticWbc = 0;
  if (input.rbc > 0) {
    if (input.bloodWbc && input.bloodRbc && input.bloodRbc > 0) {
      // Accurate formula: CSF RBC * (Blood WBC / Blood RBC)
      // Note: bloodRbc usually in million/µL (e.g. 4.5 * 10^6), bloodWbc in /µL (e.g. 7000)
      const ratio = input.bloodWbc / (input.bloodRbc * 1_000_000);
      predictedTraumaticWbc = Math.round(input.rbc * ratio);
    } else {
      // Classic rule of thumb: 1 WBC per 750 RBCs (range 500 - 1500)
      predictedTraumaticWbc = Math.round(input.rbc / 750);
    }
  }
  const correctedWbc = Math.max(0, input.wbc - predictedTraumaticWbc);
  const isTraumaticSuspected = input.rbc > 500 && input.supernatant === 'clear';

  // 3. Three-tube clearing test
  let tubeClearingPercent: number | null = null;
  if (input.tube1Rbc && input.tube4Rbc && input.tube1Rbc > 0) {
    tubeClearingPercent = Number(
      Math.max(0, ((input.tube1Rbc - input.tube4Rbc) / input.tube1Rbc) * 100).toFixed(1)
    );
  }

  // 4. Nature 2023 Decay Adjusted RBC for SAH
  // Formula: RBC_adjusted = RBC * e^(0.281 * (Days - 1))
  const days = Math.max(1, Math.min(22, input.daysSinceOnset || 1));
  const adjustedRbcSah = Math.round(input.rbc * Math.exp(0.281 * (days - 1)));
  
  let sahLikelihoodFromZinganell: 'high' | 'low' | 'indeterminate' = 'indeterminate';
  if (adjustedRbcSah <= 3667 && input.supernatant === 'clear') {
    sahLikelihoodFromZinganell = 'low'; // 99.8% NPV
  } else if (adjustedRbcSah > 3667 && input.supernatant === 'xanthochromic') {
    sahLikelihoodFromZinganell = 'high'; // 78.8% PPV
  }

  // 5. EFNS Qalb & IgG index
  let qAlbumin: number | undefined;
  let qAlbuminUpperLimit: number | undefined;
  let hasBloodCerebrospinalBarrierDisruption: boolean | undefined;
  if (input.csfAlbumin && input.serumAlbumin && input.serumAlbumin > 0) {
    // Qalb = (CSF Alb [mg/L] / Serum Alb [g/L]) * 10^-3 or simply as ratio * 10^3 = CSF [mg/L] / Serum [g/L]
    // Standard notation: Qalb * 10^3 = CSF(mg/L) / Serum(g/L)
    const qalbValue = (input.csfAlbumin / input.serumAlbumin); // e.g. 350 / 40 = 8.75
    qAlbumin = Number(qalbValue.toFixed(2));
    qAlbuminUpperLimit = Number((4 + input.patientAge / 15).toFixed(2));
    hasBloodCerebrospinalBarrierDisruption = qAlbumin > qAlbuminUpperLimit;
  }

  let iggIndex: number | undefined;
  let hasIntrathecalIgGSynthesis: boolean | undefined;
  if (input.csfIgG && input.serumIgG && input.csfAlbumin && input.serumAlbumin) {
    const qIgG = input.csfIgG / input.serumIgG;
    const qAlb = input.csfAlbumin / input.serumAlbumin;
    if (qAlb > 0) {
      iggIndex = Number((qIgG / qAlb).toFixed(2));
      hasIntrathecalIgGSynthesis = iggIndex > 0.7;
    }
  }

  // 6. Spanos JAMA 1989 Rule (>99% certainty for Bacterial Meningitis)
  const pmnCount = Math.round(input.wbc * (input.neutrophilPercent / 100));
  const spanosDetails: string[] = [];
  if (csfGlucoseMgDl < 34) {
    spanosDetails.push(`Đường DNT < 34 mg/dL (${csfGlucoseMgDl.toFixed(1)} mg/dL)`);
  }
  if (proteinMgDl > 220) {
    spanosDetails.push(`Protein DNT > 220 mg/dL (${proteinMgDl.toFixed(1)} mg/dL)`);
  }
  if (input.wbc > 2000) {
    spanosDetails.push(`Bạch cầu DNT > 2,000 /µL (${input.wbc.toLocaleString()} /µL)`);
  }
  if (pmnCount > 1180) {
    spanosDetails.push(`Bạch cầu đa nhân trung tính (PMN) > 1,180 /µL (${pmnCount.toLocaleString()} /µL)`);
  }
  const spanosCriteriaMet = spanosDetails.length > 0;

  // 7. Albuminocytologic Dissociation
  const albuminocytologicDissociation = proteinMgDl > 50 && correctedWbc <= 10;

  // 8. Urgency Alerts (Red Flags)
  const urgentAlerts: string[] = [];
  if (input.openingPressure && input.openingPressure > 250) {
    urgentAlerts.push(`Áp lực mở tăng cao (${input.openingPressure} mmH2O) — Nguy cơ tăng áp lực nội sọ cấp! Cần theo dõi sát dấu tụt não.`);
  }
  if (input.hasFocalDeficitOrSeizure || input.hasAlteredMentalStatus) {
    urgentAlerts.push(`Có dấu thần kinh khu trú / Rối loạn tri giác — Bắt buộc loại trừ tổn thương khối choán chỗ trước chọc dò hoặc chụp CT sọ não cấp.`);
  }
  if (input.viralPcr === 'hsv_positive' || (!input.viralPcr && input.neutrophilPercent < 50 && proteinMgDl > 60 && input.hasAlteredMentalStatus)) {
    urgentAlerts.push(`Nghi ngờ hoặc xác định Viêm não HSV — Khẩn cấp chỉ định Acyclovir truyền tĩnh mạch ngay, không được trì hoãn.`);
  }
  if (spanosCriteriaMet || input.gramStain.startsWith('gram_') || (correctedWbc > 500 && input.neutrophilPercent > 70)) {
    urgentAlerts.push(`Độ đặc hiệu rất cao cho Viêm màng não mủ! Bắt đầu NGAY kháng sinh theo kinh nghiệm (Cephalosporin thế hệ 3 + Vancomycin ± Ampicillin nếu >50t) và Dexamethasone trước/cùng lúc với liều kháng sinh đầu.`);
  }
  if (sahLikelihoodFromZinganell === 'high' || (input.supernatant === 'xanthochromic' && input.hasThunderclapHeadache)) {
    urgentAlerts.push(`Nghi ngờ cao Xuất huyết dưới nhện (SAH) với dịch vàng chanh / hồng cầu tăng cao — Hội chẩn can thiệp mạch / Ngoại thần kinh khẩn cấp (CTA/DSA).`);
  }

  // 9. Scoring categories
  const scores: Record<string, { score: number; features: string[]; caveats: string[]; actions: string[] }> = {
    bacterial: { score: 0, features: [], caveats: [], actions: [] },
    viral: { score: 0, features: [], caveats: [], actions: [] },
    tuberculous: { score: 0, features: [], caveats: [], actions: [] },
    cryptococcal_fungal: { score: 0, features: [], caveats: [], actions: [] },
    subarachnoid_hemorrhage: { score: 0, features: [], caveats: [], actions: [] },
    traumatic_tap: { score: 0, features: [], caveats: [], actions: [] },
    guillain_barre: { score: 0, features: [], caveats: [], actions: [] },
    intracranial_hypertension: { score: 0, features: [], caveats: [], actions: [] },
    intracranial_hypotension: { score: 0, features: [], caveats: [], actions: [] },
    eosinophilic: { score: 0, features: [], caveats: [], actions: [] },
    normal: { score: 0, features: [], caveats: [], actions: [] },
  };

  // --- Normal Scoring ---
  if (correctedWbc <= 5 && proteinMgDl < 50 && csfGlucoseMgDl >= 45 && (!glucoseRatio || glucoseRatio >= 0.5) && input.rbc < 10) {
    scores.normal.score += 70;
    scores.normal.features.push('Tất cả chỉ số tế bào, protein và đường nằm trong giới hạn bình thường của người trưởng thành.');
  }

  // --- Bacterial Meningitis Scoring ---
  if (spanosCriteriaMet) {
    scores.bacterial.score += 55;
    scores.bacterial.features.push('Thỏa mãn tiêu chuẩn Spanos (JAMA) - độ chuẩn xác > 99% cho viêm màng não mủ.');
  }
  if (correctedWbc > 1000) {
    scores.bacterial.score += 25;
    scores.bacterial.features.push(`Bạch cầu tăng rất cao (${correctedWbc.toLocaleString()}/µL), điển hình cho nhiễm trùng sinh mủ.`);
  } else if (correctedWbc > 100) {
    scores.bacterial.score += 15;
  }
  if (input.neutrophilPercent >= 80) {
    scores.bacterial.score += 20;
    scores.bacterial.features.push(`Ưu thế bạch cầu đa nhân trung tính PMN (${input.neutrophilPercent}%) rất cao.`);
  } else if (input.neutrophilPercent >= 50) {
    scores.bacterial.score += 10;
  }
  if (glucoseRatio !== null && glucoseRatio < 0.4) {
    scores.bacterial.score += 20;
    scores.bacterial.features.push(`Tỷ số Glucose DNT/Máu < 0.4 (${glucoseRatio}) - độ nhạy 80%, độ đặc hiệu 98% cho viêm mủ.`);
  } else if (csfGlucoseMgDl < 40) {
    scores.bacterial.score += 15;
    scores.bacterial.features.push(`Nồng độ Glucose DNT hạ thấp < 40 mg/dL (${csfGlucoseMgDl.toFixed(1)} mg/dL).`);
  }
  if (proteinMgDl > 150) {
    scores.bacterial.score += 15;
    scores.bacterial.features.push(`Protein DNT tăng cao > 150 mg/dL (${proteinMgDl.toFixed(1)} mg/dL).`);
  }
  if (lactateMmol && lactateMmol > 3.9) {
    scores.bacterial.score += 25;
    scores.bacterial.features.push(`Lactate DNT > 3.9 mmol/L (${lactateMmol.toFixed(1)} mmol/L) - độ đặc hiệu 94-99% phân biệt mủ vs vô khuẩn.`);
  }
  if (input.color === 'turbid' || input.color === 'purulent') {
    scores.bacterial.score += 15;
    scores.bacterial.features.push('Dịch não tủy đục hoặc mủ như nước vo gạo.');
  }
  if (input.gramStain !== 'negative' && input.gramStain !== 'not_done') {
    scores.bacterial.score += 40;
    scores.bacterial.features.push(`Nhuộm soi Gram dương tính (${input.gramStain.replace(/_/g, ' ')}).`);
  }
  if (input.hasPriorAntibiotics) {
    scores.bacterial.caveats.push('Bệnh nhân đã dùng kháng sinh trước chọc dò: Kết quả soi tươi và cấy vi khuẩn có thể âm tính giả từ 10 - 20%, protein và bạch cầu có thể bị lu mờ một phần.');
  }
  scores.bacterial.actions = [
    'Kháng sinh tĩnh mạch liều màng não ngay lập tức (không đợi cấy): Ceftriaxone 2g IV q12h (hoặc Cefotaxime) + Vancomycin 15-20 mg/kg q8-12h.',
    'Bổ sung Ampicillin 2g IV q4h nếu bệnh nhân > 50 tuổi hoặc suy giảm miễn dịch (để bao phủ Listeria monocytogenes).',
    'Dexamethasone 10 mg IV mỗi 6 giờ x 4 ngày (dùng trước hoặc cùng lúc liều kháng sinh đầu để giảm di chứng thần kinh và tử vong ở viêm mủ phế cầu).',
    'Cấy máu và cấy DNT kháng sinh đồ; xét nghiệm Multiplex PCR căn nguyên màng não nếu có.',
  ];

  // --- Viral Meningitis Scoring ---
  if (correctedWbc >= 10 && correctedWbc <= 1000) {
    scores.viral.score += 15;
    scores.viral.features.push(`Tăng bạch cầu mức độ nhẹ đến trung bình (${correctedWbc}/µL).`);
  }
  if (input.lymphocytePercent >= 60 || input.monocytePercent >= 30) {
    scores.viral.score += 20;
    scores.viral.features.push(`Ưu thế dòng tế bào đơn nhân / Lymphocyte (${input.lymphocytePercent}%).`);
  }
  if (csfGlucoseMgDl >= 45 && (!glucoseRatio || glucoseRatio >= 0.5)) {
    scores.viral.score += 25;
    scores.viral.features.push('Nồng độ đường DNT và tỷ số Glucose DNT/máu bình thường.');
  }
  if (proteinMgDl < 120 && proteinMgDl >= 45) {
    scores.viral.score += 15;
    scores.viral.features.push('Protein DNT bình thường hoặc chỉ tăng nhẹ (< 120 mg/dL).');
  }
  if (lactateMmol && lactateMmol < 2.8) {
    scores.viral.score += 15;
    scores.viral.features.push('Lactate DNT bình thường (< 2.8 mmol/L), rất điển hình cho viêm màng não vô khuẩn/virus.');
  }
  if (input.viralPcr === 'enterovirus_positive' || input.viralPcr === 'hsv_positive' || input.viralPcr === 'vzv_positive') {
    scores.viral.score += 50;
    scores.viral.features.push(`PCR căn nguyên virus dương tính (${input.viralPcr.toUpperCase()}).`);
  }
  if (input.color === 'clear') {
    scores.viral.score += 10;
  }
  scores.viral.caveats.push('Trong 24 giờ đầu tiên của viêm màng não virus (đặc biệt là Enterovirus), bạch cầu đa nhân (PMN) có thể chiếm ưu thế thoáng qua trước khi chuyển sang dạng đơn nhân.');
  scores.viral.caveats.push('Nếu nghi ngờ viêm não HSV (Herpes simplex), PCR âm tính trong 72 giờ đầu chưa thể loại trừ hoàn toàn, cần làm lại nếu lâm sàng tiến triển nặng.');
  scores.viral.actions = [
    'Nếu có triệu chứng viêm não (sốt, lú lẫn, co giật, dấu thần kinh khu trú): Bắt đầu Acyclovir 10 mg/kg IV q8h ngay lập tức.',
    'Gửi mẫu làm Multiplex PCR panel virus thần kinh (HSV-1, HSV-2, VZV, Enterovirus, CMV).',
    'Chụp MRI sọ não có tiêm đối quang từ (đánh giá tổn thương thùy thái dương trong viêm não Herpes).',
    'Điều trị nâng đỡ, giảm đau, hạ sốt, bù dịch.',
  ];

  // --- Tuberculous Meningitis Scoring ---
  if (input.lymphocytePercent >= 60) {
    scores.tuberculous.score += 15;
    scores.tuberculous.features.push('Ưu thế dòng tế bào Lymphocyte điển hình cho viêm bán cấp/mạn tính.');
  }
  if (correctedWbc >= 20 && correctedWbc <= 1000) {
    scores.tuberculous.score += 15;
    scores.tuberculous.features.push(`Bạch cầu DNT tăng vừa phải (${correctedWbc}/µL).`);
  }
  if (proteinMgDl > 150) {
    scores.tuberculous.score += 25;
    scores.tuberculous.features.push(`Protein DNT tăng rất cao (${proteinMgDl.toFixed(1)} mg/dL), phản ánh tổn thương màng não đáy sọ và tắc nghẽn lưu thông DNT.`);
  }
  if (csfGlucoseMgDl < 40 || (glucoseRatio !== null && glucoseRatio < 0.4)) {
    scores.tuberculous.score += 25;
    scores.tuberculous.features.push(`Đường DNT hạ thấp rõ rệt (Tỷ số: ${glucoseRatio ?? (csfGlucoseMgDl/100).toFixed(2)}), vi khuẩn lao tiêu thụ glucose mạnh.`);
  }
  if (input.pellicleFormation) {
    scores.tuberculous.score += 35;
    scores.tuberculous.features.push('Hình thành màng mạng nhện (Pellicle/Cobweb clot) khi để lắng DNT - dấu hiệu kinh điển của Lao màng não.');
  }
  if (input.adaLevel && input.adaLevel > 10) {
    scores.tuberculous.score += 35;
    scores.tuberculous.features.push(`Hoạt độ men ADA DNT > 10 U/L (${input.adaLevel} U/L) - độ nhạy và độ đặc hiệu cao cho Lao.`);
  }
  if (input.tbPcrOrAfb === 'positive') {
    scores.tuberculous.score += 55;
    scores.tuberculous.features.push('Xét nghiệm AFB hoặc GenXpert / PCR Lao dương tính trong DNT.');
  }
  scores.tuberculous.caveats.push('Độ nhạy soi kính hiển vi tìm trực khuẩn kháng cồn toan (AFB) trên 1 mẫu DNT thường rất thấp (< 30%). Cần lấy thể tích lớn (>= 10 mL) và xét nghiệm nhiều lần hoặc dùng Real-time PCR / GeneXpert MTB.');
  scores.tuberculous.actions = [
    'Hội chẩn chuyên khoa Lao và Bệnh Phổi để khởi động phác đồ kháng lao chuẩn (RHEZ / RHZE).',
    'Chỉ định Dexamethasone phối hợp liệu trình giảm dần liều (giảm nguy cơ viêm dày dính màng não và đột quỵ do viêm mạch đáy não).',
    'Chụp MRI sọ não có tiêm thuốc cản từ: tìm dấu hiệu dày màng não đáy sọ, giãn não thất, u lao não (tuberculoma) hoặc nhồi máu não.',
  ];

  // --- Cryptococcal / Fungal Scoring ---
  if (input.isImmunocompromised) {
    scores.cryptococcal_fungal.score += 25;
    scores.cryptococcal_fungal.features.push('Bệnh nhân có cơ địa suy giảm miễn dịch (HIV/AIDS, dùng thuốc ức chế miễn dịch, ghép tạng).');
  }
  if (input.openingPressure && input.openingPressure > 250) {
    scores.cryptococcal_fungal.score += 25;
    scores.cryptococcal_fungal.features.push(`Áp lực mở tăng rất cao (${input.openingPressure} mmH2O) thường thấy trong viêm màng não Cryptococcus do ứ trệ hấp thu DNT qua hạt Pacchioni.`);
  }
  if (input.crAgOrIndiaInk === 'positive') {
    scores.cryptococcal_fungal.score += 65;
    scores.cryptococcal_fungal.features.push('Kháng nguyên Cryptococcus (CrAg) hoặc nhuộm soi mực tàu dương tính.');
  }
  if (input.lymphocytePercent >= 70 && correctedWbc < 500 && csfGlucoseMgDl < 45) {
    scores.cryptococcal_fungal.score += 20;
    scores.cryptococcal_fungal.features.push('DNT có phản ứng tế bào lympho kèm hạ đường DNT ở bệnh nhân có nguy cơ nấm.');
  }
  scores.cryptococcal_fungal.actions = [
    'Điều trị tấn công với Amphotericin B liposomal phối hợp Flucytosine (hoặc Fluconazole liều cao nếu không có Flucytosine).',
    'Nếu áp lực mở > 250 mmH2O: Chọc tháo bớt DNT hàng ngày hoặc đặt dẫn lưu não thất/thắt lưng để hạ áp lực sọ não về mức < 200 mmH2O hoặc giảm 50% áp lực ban đầu.',
    'Kiểm tra tình trạng miễn dịch, tải lượng HIV và đếm tế bào CD4 nếu chưa rõ căn nguyên.',
  ];

  // --- Subarachnoid Hemorrhage (SAH) Scoring ---
  if (input.rbc > 2000) {
    scores.subarachnoid_hemorrhage.score += 25;
    scores.subarachnoid_hemorrhage.features.push(`Số lượng hồng cầu DNT tăng cao (${input.rbc.toLocaleString()}/µL).`);
  }
  if (input.supernatant === 'xanthochromic') {
    scores.subarachnoid_hemorrhage.score += 35;
    scores.subarachnoid_hemorrhage.features.push('Dịch nổi (supernatant) màu vàng chanh (Xanthochromia) sau ly tâm — sản phẩm giáng hóa oxyhemoglobin thành bilirubin trong lòng màng nhện.');
  }
  if (sahLikelihoodFromZinganell === 'high') {
    scores.subarachnoid_hemorrhage.score += 25;
    scores.subarachnoid_hemorrhage.features.push(`Hồng cầu hiệu chỉnh theo thời gian (RBC adjusted = ${adjustedRbcSah.toLocaleString()}/µL > 3,667) theo nghiên cứu Nature 2023.`);
  }
  if (tubeClearingPercent !== null && tubeClearingPercent < 30) {
    scores.subarachnoid_hemorrhage.score += 20;
    scores.subarachnoid_hemorrhage.features.push(`Hồng cầu giữa ống 1 và ống 4 không giảm đáng kể (chỉ đổi ${tubeClearingPercent}%), phù hợp với máu chảy tự do đồng đều trong khoang dưới nhện.`);
  }
  if (input.hasThunderclapHeadache) {
    scores.subarachnoid_hemorrhage.score += 20;
    scores.subarachnoid_hemorrhage.features.push('Khởi phát bằng cơn đau đầu dữ dội đột ngột (đau đầu sét đánh - thunderclap headache).');
  }
  scores.subarachnoid_hemorrhage.actions = [
    'Chụp CT Mạch máu não (CTA) hoặc Chụp mạch xóa nền (DSA) khẩn cấp để tìm phình động mạch vỡ hoặc dị dạng mạch (AVM).',
    'Hội chẩn Ngoại thần kinh / Can thiệp nội mạch can thiệp nút túi phình (coiling) hoặc kẹp cổ túi phình (clipping).',
    'Dùng Nimodipine 60mg uống mỗi 4 giờ để phòng ngừa co thắt mạch não (vasospasm).',
    'Kiểm soát huyết áp nghiêm ngặt (HA tâm thu < 140-160 mmHg), giảm đau, chống nôn, theo dõi áp lực nội sọ.',
  ];

  // --- Traumatic Lumbar Puncture (Chọc chạm mạch) Scoring ---
  if (input.rbc > 500) {
    if (input.supernatant === 'clear') {
      scores.traumatic_tap.score += 40;
      scores.traumatic_tap.features.push('Dịch nổi (supernatant) sau ly tâm hoàn toàn trong suốt — chưa xảy ra quá trình ly giải tạo bilirubin in-vivo.');
    }
    if (tubeClearingPercent !== null && tubeClearingPercent >= 50) {
      scores.traumatic_tap.score += 35;
      scores.traumatic_tap.features.push(`Hồng cầu giảm mạnh từ ống 1 sang ống 4 (${tubeClearingPercent}%) - test 3 ống dương tính chỉ điểm tổn thương đám rối tĩnh mạch khi chọc kim.`);
    }
    if (correctedWbc <= 5) {
      scores.traumatic_tap.score += 20;
      scores.traumatic_tap.features.push(`Sau khi trừ bạch cầu đi kèm do máu ngoại vi lạc vào (${predictedTraumaticWbc} WBC dự kiến), bạch cầu thực tế chỉ còn ${correctedWbc}/µL (bình thường).`);
    }
  }
  scores.traumatic_tap.actions = [
    'Sử dụng số lượng bạch cầu đã hiệu chỉnh (Corrected WBC) để đánh giá viêm màng não thay vì dùng số bạch cầu thô ban đầu.',
    'Không điều trị kháng sinh hay can thiệp mạch nếu các chỉ số sinh hóa và bạch cầu hiệu chỉnh đều bình thường.',
    'Nếu vẫn còn nghi ngờ xuất huyết dưới nhện trên lâm sàng, thực hiện chụp CTA sọ não hoặc đo Bilirubin quang phổ DNT sau 12 giờ.',
  ];

  // --- Guillain-Barré Syndrome Scoring ---
  if (albuminocytologicDissociation) {
    scores.guillain_barre.score += 65;
    scores.guillain_barre.features.push(`Hiện tượng phân ly Đạm - Tế bào kinh điển (Albuminocytological dissociation): Protein tăng cao (${proteinMgDl.toFixed(1)} mg/dL) trong khi tế bào bạch cầu hoàn toàn bình thường (${correctedWbc}/µL).`);
  }
  if (csfGlucoseMgDl >= 45 && input.color === 'clear') {
    scores.guillain_barre.score += 15;
  }
  scores.guillain_barre.caveats.push('Trong 5-7 ngày đầu của hội chứng Guillain-Barré, có tới 50% bệnh nhân vẫn có nồng độ Protein DNT bình thường; nồng độ này sẽ tăng dần và đạt đỉnh ở tuần thứ 2 - 3.');
  scores.guillain_barre.actions = [
    'Khám đánh giá phản xạ gân xương, tiến triển yếu cơ tăng dần từ ngọn chi lên gốc chi và tổn thương thần kinh sọ.',
    'Đo dung tích sống thở ra (FVC) và áp lực hít vào tối đa (MIP) để phát hiện sớm suy hô hấp cơ hoành.',
    'Điện cơ và dẫn truyền thần kinh (EMG/NCS) tìm bằng chứng hủy myelin hoặc tổn thương sợi trục.',
    'Liệu pháp miễn dịch đặc hiệu: Globulin miễn dịch tĩnh mạch (IVIg 2g/kg trong 2-5 ngày) hoặc Thay huyết tương (Plasma exchange). Chống chỉ định Corticoid đơn độc.',
  ];

  // --- Idiopathic Intracranial Hypertension (IIH) ---
  if (input.openingPressure && input.openingPressure > 250 && proteinMgDl < 50 && correctedWbc <= 5 && csfGlucoseMgDl >= 45) {
    scores.intracranial_hypertension.score += 60;
    scores.intracranial_hypertension.features.push('Áp lực mở > 250 mmH2O kết hợp thành phần sinh hóa và tế bào DNT hoàn toàn bình thường (Thỏa mãn tiêu chuẩn Modified Dandy).');
  }
  scores.intracranial_hypertension.actions = [
    'Khám mắt soi đáy mắt khẩn cấp đánh giá phù gai thị và thị trường.',
    'Chụp MRI/MRV sọ não loại trừ huyết khối tĩnh mạch não và u chèn ép.',
    'Điều trị nội khoa: Acetazolamide, kiểm soát cân nặng, hoặc phẫu thuật mở bao dây thần kinh thị giác/đặt shunt nếu đe dọa mất thị lực.',
  ];

  // --- Spontaneous Intracranial Hypotension (SIH) ---
  if (input.openingPressure && input.openingPressure < 60) {
    scores.intracranial_hypotension.score += 70;
    scores.intracranial_hypotension.features.push(`Áp lực mở < 60 mmH2O — tiêu chuẩn vàng chẩn đoán hội chứng tụt áp lực nội sọ tự phát.`);
  }
  scores.intracranial_hypotension.actions = [
    'Nghỉ ngơi tại giường, bù đủ nước, cafein đường uống/truyền tĩnh mạch.',
    'Chụp MRI cột sống và sọ não tìm vị trí rò rỉ dịch não tủy (CSF leak).',
    'Cân nhắc làm thủ thuật bơm máu tự thân khoang ngoài màng cứng (Epidural Blood Patch - EBP).',
  ];

  // --- Eosinophilic Meningitis ---
  if ((input.eosinophils && input.eosinophils >= 10) || (input.wbc > 10 && input.eosinophils && input.eosinophils >= 0.1 * input.wbc)) {
    scores.eosinophilic.score += 75;
    scores.eosinophilic.features.push('Tăng bạch cầu ái toan trong DNT (>= 10/µL hoặc >= 10% tổng số tế bào).');
    scores.eosinophilic.actions = [
      'Xét nghiệm huyết thanh chẩn đoán ký sinh trùng: Angiostrongylus cantonensis (giun phổi chuột), Gnathostoma spinigerum, Giun đũa chó mèo Toxocara.',
      'Khai thác tiền sử ăn ốc sên, ếch sống, rau sống rửa không kỹ hoặc dùng thuốc.',
      'Xem xét Corticosteroid toàn thân để giảm phản ứng viêm thần kinh.',
    ];
  }

  // Compile Likelihood list
  const categoryMeta: Record<string, { nameVi: string; nameEn: string; summaryVi: string }> = {
    bacterial: {
      nameVi: 'Viêm màng não mủ (Vi khuẩn cấp)',
      nameEn: 'Acute Bacterial Meningitis',
      summaryVi: 'Hội chứng viêm màng não do vi khuẩn sinh mủ cấp tính, đe dọa tính mạng cần điều trị kháng sinh ngay.',
    },
    viral: {
      nameVi: 'Viêm màng não vi rút / Vô khuẩn',
      nameEn: 'Viral / Aseptic Meningitis',
      summaryVi: 'Tăng bạch cầu lympho ưu thế với mức đường bình thường, tiên lượng thường lành tính hơn vi khuẩn trừ viêm não Herpes.',
    },
    tuberculous: {
      nameVi: 'Viêm màng não do Lao (TBM)',
      nameEn: 'Tuberculous Meningitis',
      summaryVi: 'Bệnh lý mạn tính/bán cấp với đạm tăng rất cao, đường giảm sâu và có thể có màng mạng nhện lắng đọng.',
    },
    cryptococcal_fungal: {
      nameVi: 'Viêm màng não do Vi nấm (Cryptococcus)',
      nameEn: 'Cryptococcal / Fungal Meningitis',
      summaryVi: 'Nhiễm nấm cơ hội ở người suy giảm miễn dịch kèm tăng áp lực nội sọ rõ rệt.',
    },
    subarachnoid_hemorrhage: {
      nameVi: 'Xuất huyết dưới nhện (SAH)',
      nameEn: 'Subarachnoid Hemorrhage',
      summaryVi: 'Chảy máu vào khoang màng nhện với hồng cầu tồn lưu và dịch nổi vàng chanh (xanthochromia).',
    },
    traumatic_tap: {
      nameVi: 'Chọc dò chạm mạch (Traumatic Tap)',
      nameEn: 'Traumatic Lumbar Puncture',
      summaryVi: 'Hồng cầu xuất hiện do chấn thương mao mạch lúc chọc kim, dịch nổi trong, hồng cầu giảm dần qua các ống nghiệm.',
    },
    guillain_barre: {
      nameVi: 'Hội chứng Guillain-Barré (GBS)',
      nameEn: 'Guillain-Barré Syndrome',
      summaryVi: 'Tổn thương rễ - dây thần kinh tự miễn đặc trưng bởi hiện tượng phân ly Đạm - Tế bào.',
    },
    intracranial_hypertension: {
      nameVi: 'Tăng áp lực nội sọ vô căn (IIH)',
      nameEn: 'Idiopathic Intracranial Hypertension',
      summaryVi: 'Áp lực DNT tăng cao nhưng thành phần sinh hóa và tế bào học hoàn toàn bình thường.',
    },
    intracranial_hypotension: {
      nameVi: 'Hội chứng giảm áp lực nội sọ tự phát (SIH)',
      nameEn: 'Spontaneous Intracranial Hypotension',
      summaryVi: 'Áp lực mở DNT hạ thấp (< 60 mmH2O), thường kèm đau đầu tư thế.',
    },
    eosinophilic: {
      nameVi: 'Viêm màng não tăng bạch cầu ái toan',
      nameEn: 'Eosinophilic Meningitis',
      summaryVi: 'Gợi ý cao nhiễm ký sinh trùng giun sán hoặc dị ứng/thuốc.',
    },
    normal: {
      nameVi: 'Dịch não tủy trong giới hạn bình thường',
      nameEn: 'Normal CSF Profile',
      summaryVi: 'Các chỉ số tế bào, đạm, đường và áp lực đều nằm trong khoảng sinh lý.',
    },
  };

  const likelihoods: DiagnosticLikelihood[] = Object.entries(scores)
    .filter(([_, item]) => item.score > 0)
    .map(([key, item]) => {
      const meta = categoryMeta[key] || { nameVi: key, nameEn: key, summaryVi: '' };
      const normalizedScore = Math.min(100, item.score);
      let confidence: 'very_high' | 'high' | 'moderate' | 'low' = 'low';
      if (normalizedScore >= 75) confidence = 'very_high';
      else if (normalizedScore >= 50) confidence = 'high';
      else if (normalizedScore >= 30) confidence = 'moderate';

      return {
        category: key as any,
        nameVi: meta.nameVi,
        nameEn: meta.nameEn,
        score: normalizedScore,
        confidence,
        summaryVi: meta.summaryVi,
        keyFeatures: item.features,
        caveats: item.caveats,
        recommendedActions: item.actions,
      };
    })
    .sort((a, b) => b.score - a.score);

  const topDiagnosis: DiagnosticLikelihood = likelihoods.length > 0 
    ? likelihoods[0] 
    : {
        category: 'normal',
        nameVi: 'Chưa đủ bằng chứng kết luận',
        nameEn: 'Indeterminate / Equivocal CSF',
        score: 0,
        confidence: 'low',
        summaryVi: 'Các chỉ số hiện tại chưa biểu hiện hình thái bệnh lý rõ rệt. Cần phối hợp lâm sàng và xét nghiệm bổ trợ.',
        keyFeatures: ['Chưa ghi nhận bất thường nổi bật'],
        caveats: ['Cần kết hợp thăm khám lâm sàng'],
        recommendedActions: ['Theo dõi sát diễn tiến lâm sàng và cân nhắc chọc dò lại nếu triệu chứng tăng.'],
      };

  return {
    glucoseRatio,
    glucoseRatioPathological,
    correctedWbc,
    predictedTraumaticWbc,
    isTraumaticSuspected,
    tubeClearingPercent,
    adjustedRbcSah,
    sahLikelihoodFromZinganell,
    qAlbumin,
    qAlbuminUpperLimit,
    hasBloodCerebrospinalBarrierDisruption,
    iggIndex,
    hasIntrathecalIgGSynthesis,
    likelihoods,
    topDiagnosis,
    urgentAlerts,
    spanosCriteriaMet,
    spanosDetails,
    albuminocytologicDissociation,
  };
}
