import { calculateRenalMetrics, convertScrToUmol, convertScrToMgdl } from '../src/utils/clinicalFormulas';
import { decodePreviewSource } from '../src/data/rawPreviewData';
import { extractDrugData, calculateDose } from '../src/utils/drugDataExtractor';
import { ANTIBIOTICS } from '../src/data/antibiotics';
import { 
  classifyRiskGroup, 
  getEmpiricRegimens,
  getWhoRegimens, 
  evaluateStopCriteria, 
  evaluate48hReassessment, 
  evaluateIvToPo 
} from '../src/selection/engine';
import { DRUG_MAP, resolveDrugInfo } from '../src/selection/data/drugMap';
import { EMPIRIC_REGIMENS } from '../src/selection/data/empiricRegimens';
import { WHO_REGIMENS } from '../src/selection/data/whoRegimens';
import { STOP_ANTIBIOTIC_CHECKLIST } from '../src/selection/data/stopAndSwitch';
import { PatientState } from '../src/types';

interface AuditResult {
  category: string;
  test: string;
  passed: boolean;
  details?: any;
}

const results: AuditResult[] = [];

function assert(category: string, test: string, condition: boolean, details?: any) {
  results.push({ category, test, passed: condition, details });
  if (!condition) {
    console.error(`❌ [FAIL] [${category}] ${test}`, details ? JSON.stringify(details) : '');
  }
}

console.log('====================================================');
console.log('BẮT ĐẦU RÀ SOÁT TOÀN DIỆN THUẬT TOÁN INFECTODOSE');
console.log('====================================================\n');

// ---------------------------------------------------------
// 1. RÀ SOÁT CÔNG THỨC THẬN (clinicalFormulas.ts)
// ---------------------------------------------------------
console.log('>>> 1. Rà soát công thức thận (Cockcroft-Gault, IBW, AdjBW, Schwartz, CKD-EPI)...');

// 1.1 Cockcroft-Gault chuẩn Nam 60t, 60kg, SCr 100 umol/L
// CrCl = (140 - 60) * 60 / (0.814 * 100) = 4800 / 81.4 = 58.968 -> 59.0
const p1: PatientState = {
  age: 60,
  gender: 'm',
  weight: 60,
  height: 165,
  scr: 100,
  scrUnit: 'umol',
  dialysis: 'none'
};
const m1 = calculateRenalMetrics(p1);
assert('Renal', 'Nam 60t, 60kg, SCr 100 umol/L -> CrCl 59.0 mL/phút', m1.crcl === 59.0, { crcl: m1.crcl });

// 1.2 Nữ cùng thông số -> CrCl = 58.968 * 0.85 = 50.12 -> 50.1
const p2: PatientState = { ...p1, gender: 'f' };
const m2 = calculateRenalMetrics(p2);
assert('Renal', 'Nữ hệ số 0.85 -> CrCl 50.1 mL/phút', m2.crcl === 50.1, { crcl: m2.crcl });

// 1.3 Quy đổi SCr mg/dL <-> umol/L
const p3: PatientState = { ...p1, scr: 1.13, scrUnit: 'mgdl' };
const m3 = calculateRenalMetrics(p3);
assert('Renal', 'SCr 1.13 mg/dL quy đổi tương đương 100 umol/L', Math.abs(m3.scrUmol - 100) < 1.0, { scrUmol: m3.scrUmol });

// 1.4 Người cao tuổi (>= 65 tuổi) suy kiệt teo cơ SCr thấp (< 60 umol/L)
// Cần được làm tròn tối thiểu 60 umol/L để bảo vệ thận (Sanford/KDIGO)
const pElderlyLowScr: PatientState = {
  age: 75,
  gender: 'f',
  weight: 45,
  height: 155,
  scr: 35, // Rất thấp do suy kiệt teo cơ
  scrUnit: 'umol',
  dialysis: 'none'
};
const mElderly = calculateRenalMetrics(pElderlyLowScr);
// Với SCr làm tròn 60: CrCl = (140 - 75) * 45 / (0.814 * 60) * 0.85 = 2925 / 48.84 * 0.85 = 50.9
assert('Renal', 'Người cao tuổi SCr 35 umol/L được làm tròn 60 umol/L', mElderly.crcl <= 51.0, { crcl: mElderly.crcl });

// 1.5 Béo phì (BMI >= 30 hoặc TBW > 1.2 * IBW) sử dụng AdjBW
const pObese: PatientState = {
  age: 50,
  gender: 'm',
  weight: 110,
  height: 170, // IBW = 50 + 0.9 * (170 - 152.4) = 65.84 kg -> BMI = 38.1
  scr: 90,
  scrUnit: 'umol',
  dialysis: 'none'
};
const mObese = calculateRenalMetrics(pObese);
// AdjBW = 65.8 + 0.4 * (110 - 65.8) = 83.5 kg
assert('Renal', 'Bệnh nhân béo phì sử dụng cân nặng hiệu chỉnh AdjBW', mObese.usedWeightType.includes('AdjBW'), { usedWeight: mObese.usedWeight, usedWeightType: mObese.usedWeightType });
assert('Renal', 'AdjBW tính đúng công thức (~83.5 kg)', Math.abs((mObese.adjBw || 0) - 83.5) < 0.5, { adjBw: mObese.adjBw });

// 1.6 Thiếu cân (TBW < IBW) sử dụng TBW
const pUnderweight: PatientState = {
  age: 40,
  gender: 'm',
  weight: 45,
  height: 170, // IBW = 65.8 kg -> TBW < IBW
  scr: 80,
  scrUnit: 'umol',
  dialysis: 'none'
};
const mUnderweight = calculateRenalMetrics(pUnderweight);
assert('Renal', 'Bệnh nhân thiếu cân dùng TBW', mUnderweight.usedWeightType.includes('Thiếu cân'), { usedWeight: mUnderweight.usedWeight });

// 1.7 Chiều cao < 152.4 cm: tính theo BMI 22 kg/m² để tránh Devine bị âm/thấp dị thường
const pShort: PatientState = {
  age: 45,
  gender: 'f',
  weight: 50,
  height: 145, // < 152.4 cm
  scr: 80,
  scrUnit: 'umol',
  dialysis: 'none'
};
const mShort = calculateRenalMetrics(pShort);
assert('Renal', 'Chiều cao < 152.4 cm IBW không bị âm và hợp lý (> 40 kg)', (mShort.ibw || 0) >= 40 && (mShort.ibw || 0) <= 50, { ibw: mShort.ibw });

// 1.8 Nhi khoa (age < 18) dùng công thức Bedside Schwartz
const pPediatric: PatientState = {
  age: 10,
  gender: 'm',
  weight: 30,
  height: 130,
  scr: 0.5, // 0.5 mg/dL
  scrUnit: 'mgdl',
  dialysis: 'none'
};
const mPediatric = calculateRenalMetrics(pPediatric);
// Schwartz 2009: eGFR = 0.413 * 130 / 0.5 = 107.38 -> 107.4 mL/phút/1.73m²
assert('Renal', 'Nhi khoa dùng Bedside Schwartz eGFR ~107.4', Math.abs(mPediatric.crcl - 107.4) < 1.0, { crcl: mPediatric.crcl });

// 1.9 Phát hiện ARC (Augmented Renal Clearance > 130 mL/min)
const pArc: PatientState = {
  age: 25,
  gender: 'm',
  weight: 75,
  height: 175,
  scr: 50,
  scrUnit: 'umol',
  dialysis: 'none'
};
const mArc = calculateRenalMetrics(pArc);
assert('Renal', 'Phát hiện chính xác tăng thanh thải thận ARC (> 130 mL/phút)', mArc.isArc === true && mArc.crcl > 130, { crcl: mArc.crcl, isArc: mArc.isArc });

// 1.10 Biên: SCr = 0, Weight = 0, Age = 0 không bị NaN hoặc Infinity
const pZero: PatientState = {
  age: 0,
  gender: 'm',
  weight: 0,
  height: 0,
  scr: 0,
  scrUnit: 'umol',
  dialysis: 'none'
};
const mZero = calculateRenalMetrics(pZero);
assert('Renal', 'Dữ liệu biên bằng 0 không sinh ra NaN hoặc Infinity', !isNaN(mZero.crcl) && isFinite(mZero.crcl) && mZero.crcl > 0, { crcl: mZero.crcl });


// ---------------------------------------------------------
// 2. RÀ SOÁT CẤU TRÚC ROWS VÀ DỮ LIỆU TẤT CẢ 43 KHÁNG SINH
// ---------------------------------------------------------
console.log('\n>>> 2. Rà soát cấu trúc ROWS và tính toán liều của 43 kháng sinh...');

const previewDrugKeys = ANTIBIOTICS.map(a => a.id);
assert('PreviewData', 'Có đủ danh sách kháng sinh (ít nhất 40 kháng sinh)', previewDrugKeys.length >= 40, { total: previewDrugKeys.length });

const testCrclValues = [150, 100, 75, 45, 20, 8];

for (const drugId of previewDrugKeys) {
  const drug = extractDrugData(drugId);
  
  // 2.1 Kiểm tra rows không rỗng
  assert('DrugData', `Thuốc [${drugId}] có danh sách rows hợp lệ`, drug.rows && drug.rows.length > 0, { id: drugId, rowCount: drug.rows?.length });

  // 2.2 Kiểm tra thứ tự rows (giảm dần theo threshold để find() hoạt động đúng)
  if (!drug.isColistin && drug.rows && drug.rows.length > 1) {
    let isDescending = true;
    for (let i = 0; i < drug.rows.length - 1; i++) {
      const r1 = drug.rows[i];
      const r2 = drug.rows[i + 1];
      if (r1.thr !== undefined && r2.thr !== undefined) {
        if (r1.thr < r2.thr) {
          isDescending = false;
          assert('RowOrdering', `Thuốc [${drugId}] thứ tự ROWS bị sai (tăng dần thay vì giảm dần)`, false, { index: i, r1: r1.thr, r2: r2.thr });
          break;
        }
      }
    }
    if (isDescending) {
      assert('RowOrdering', `Thuốc [${drugId}] các ngưỡng ROWS xếp giảm dần chính xác`, true);
    }
  }

  // 2.3 Kiểm tra calculateDose không bị lỗi / không sinh NaN với mọi dải CrCl
  for (const crclVal of testCrclValues) {
    const renalCat = crclVal > 130 ? 'arc' : (crclVal >= 90 ? 'normal' : (crclVal >= 60 ? 'mild' : (crclVal >= 30 ? 'moderate' : (crclVal >= 15 ? 'severe' : 'esrd'))));
    const mockRenal = { ...m1, crcl: crclVal, isArc: crclVal > 130, renalCategory: renalCat as any };
    try {
      const doseRes = calculateDose(drug, mockRenal, 'standard', p1);
      const hasError = !doseRes.maintenanceDoseTextVi || 
                       doseRes.maintenanceDoseTextVi.includes('undefined') || 
                       doseRes.maintenanceDoseTextVi.includes('NaN');
      if (hasError) {
        assert('DoseCalc', `Thuốc [${drugId}] ở CrCl ${crclVal} ra kết quả bất thường`, false, { doseRes });
      }
    } catch (err: any) {
      assert('DoseCalc', `Thuốc [${drugId}] ở CrCl ${crclVal} ném ngoại lệ: ${err.message}`, false);
    }
  }
}

// ---------------------------------------------------------
// 3. RÀ SOÁT CÁC CÔNG THỨC ĐẶC BIỆT (Colistin, Vancomycin,...)
// ---------------------------------------------------------
console.log('\n>>> 3. Rà soát thuật toán Colistin & Vancomycin...');

// 3.1 Colistin: Liều nạp & liều duy trì theo CrCl
const colistinData = extractDrugData('colistin');
const colistinCrcl100 = calculateDose(colistinData, { ...m1, crcl: 100 }, 'standard', p1);
assert('Colistin', 'Colistin CrCl 100 liều duy trì 180 mg CBA (~5.4 MIU) q12h', colistinCrcl100.maintenanceDoseTextVi.includes('180 mg CBA'), { text: colistinCrcl100.maintenanceDoseTextVi });
assert('Colistin', 'Colistin CrCl 100 liều nạp 9 MIU (~300 mg CBA)', colistinCrcl100.loadingDoseTextVi?.includes('9 MIU') || false);
assert('Colistin', 'Colistin CrCl 100 duy trì bắt đầu sau 12h', colistinCrcl100.selectedRowNoteVi?.includes('12 giờ') || false);

// Colistin suy thận CrCl = 30 (bắt đầu sau 24h)
const colistinCrcl30 = calculateDose(colistinData, { ...m1, crcl: 30 }, 'standard', p1);
assert('Colistin', 'Colistin CrCl <= 40 duy trì bắt đầu sau 24h', colistinCrcl30.selectedRowNoteVi?.includes('24 giờ') || false);

// 3.2 Vancomycin: Liều nạp cân nặng & ARC
const vancoData = extractDrugData('vancomycin');
// ARC: 15 mg/kg, max 3000 mg
const vancoArc = calculateDose(vancoData, { ...mArc, crcl: 150, isArc: true }, 'standard', pArc);
assert('Vancomycin', 'Vancomycin ARC liều nạp 15 mg/kg và khuyến cáo truyền liên tục', vancoArc.loadingDoseTextVi?.includes('15 mg/kg') || false, { text: vancoArc.loadingDoseTextVi });

// Béo phì hoặc CrCl < 30: 20-25 mg/kg, max 2000 mg
const vancoObese = calculateDose(vancoData, { ...mObese, crcl: 80, isArc: false }, 'standard', pObese);
assert('Vancomycin', 'Vancomycin béo phì liều nạp 20-25 mg/kg cap 2.000 mg', !!(vancoObese.loadingDoseTextVi?.includes('20-25 mg/kg') && vancoObese.loadingDoseTextVi?.includes('2.000 mg')), { text: vancoObese.loadingDoseTextVi });

// Bình thường: 25-30 mg/kg, max 3000 mg
const vancoNormal = calculateDose(vancoData, { ...m1, crcl: 95, isArc: false }, 'standard', p1);
assert('Vancomycin', 'Vancomycin bình thường liều nạp 25-30 mg/kg cap 3.000 mg', !!(vancoNormal.loadingDoseTextVi?.includes('25-30 mg/kg') && vancoNormal.loadingDoseTextVi?.includes('3.000 mg')), { text: vancoNormal.loadingDoseTextVi });


// ---------------------------------------------------------
// 4. RÀ SOÁT CÔNG THỨC PHÂN TẦNG VÀ KHUYẾN CÁO PHÁC ĐỒ (engine.ts)
// ---------------------------------------------------------
console.log('\n>>> 4. Rà soát thuật toán phân tầng lâm sàng & phác đồ kinh nghiệm...');

// 4.1 Phân nhóm nguy cơ: 0 yếu tố -> Nhóm 1
const g1 = classifyRiskGroup([], { scoreType: 'sofa', scoreValue: 0 }, 'adult');
assert('RiskEngine', '0 yếu tố nguy cơ -> Nhóm 1', g1.group === 'group_1');

// 4.2 1 yếu tố nguy cơ + SOFA < 2 -> Nhóm 1
const g2 = classifyRiskGroup(['abx_prior_90d'], { scoreType: 'sofa', scoreValue: 1 }, 'adult');
assert('RiskEngine', '1 yếu tố nguy cơ + SOFA 1 -> Nhóm 1', g2.group === 'group_1');

// 4.3 1 yếu tố nguy cơ + SOFA >= 2 -> Nhóm 2 (nhiễm khuẩn nặng/nhiễm khuẩn huyết)
const g3 = classifyRiskGroup(['abx_prior_90d'], { scoreType: 'sofa', scoreValue: 3 }, 'adult');
assert('RiskEngine', '1 yếu tố nguy cơ + SOFA >= 2 -> Nhóm 2', g3.group === 'group_2');

// 4.4 >= 2 yếu tố nguy cơ -> Nhóm 2 bất kể SOFA
const g4 = classifyRiskGroup(['abx_prior_90d', 'invasive_device'], { scoreType: 'sofa', scoreValue: 0 }, 'adult');
assert('RiskEngine', '>= 2 yếu tố nguy cơ -> Nhóm 2', g4.group === 'group_2');

// 4.5 CLIF-SOFA >= 12 (bệnh nhân xơ gan/suy gan cấp) -> Nhóm 2
const g5 = classifyRiskGroup(['abx_prior_90d'], { scoreType: 'clif_sofa', scoreValue: 12 }, 'adult');
assert('RiskEngine', 'CLIF-SOFA >= 12 -> Nhóm 2', g5.group === 'group_2');

// 4.6 pSOFA >= 8 (nhi khoa) -> Nhóm 2
const g6 = classifyRiskGroup(['abx_prior_90d'], { scoreType: 'psofa', scoreValue: 8 }, 'pediatric');
assert('RiskEngine', 'pSOFA >= 8 -> Nhóm 2', g6.group === 'group_2');

// 4.7 Rà soát khả năng chọn phác đồ của TẤT CẢ các vị trí nhiễm trùng
const sites: Array<any> = ['respiratory', 'sepsis', 'urinary', 'skin_soft_tissue', 'peritoneal', 'gastrointestinal', 'cns'];
for (const site of sites) {
  // Nhóm 1
  const reg1 = getEmpiricRegimens(site, 'adult', 'group_1');
  assert('RegimenSelection', `Vị trí [${site}] - Nhóm 1 BVBND có phác đồ`, reg1.length > 0, { site, count: reg1.length });

  // Nhóm 2
  const reg2 = getEmpiricRegimens(site, 'adult', 'group_2', undefined, ['mrsa', 'pseudo_acineto']);
  assert('RegimenSelection', `Vị trí [${site}] - Nhóm 2 BVBND có phác đồ`, reg2.length > 0, { site, count: reg2.length });
}

// 4.8 Rà soát mapping giữa phác đồ và máy tính liều (DRUG_MAP)
console.log('\n>>> 5. Rà soát mapping thuốc trong phác đồ sang công cụ tính liều...');
const allBvbndDrugIds = new Set<string>();
for (const reg of EMPIRIC_REGIMENS) {
  for (const comp of reg.drugs) {
    if (comp.drugId) allBvbndDrugIds.add(comp.drugId);
  }
}

let unmappedCount = 0;
for (const drugId of allBvbndDrugIds) {
  const resolved = resolveDrugInfo(drugId).drugId || drugId;
  const existsInPreview = !!decodePreviewSource(resolved);
  const existsInAntibiotics = ANTIBIOTICS.some(a => a.id === resolved);
  if (!existsInPreview && !existsInAntibiotics) {
    unmappedCount++;
    assert('DrugMapping', `Mã thuốc [${drugId}] trong phác đồ chưa map được sang máy tính liều`, false, { drugId, resolved });
  }
}
if (unmappedCount === 0) {
  assert('DrugMapping', `Tất cả ${allBvbndDrugIds.size} thuốc trong phác đồ BVBND đều map được sang máy tính liều`, true);
}

// ---------------------------------------------------------
// 5. RÀ SOÁT TIÊU CHÍ NGỪNG & XUỐNG THANG (stopAndSwitch)
// ---------------------------------------------------------
console.log('\n>>> 6. Rà soát thuật toán đánh giá 48h & tiêu chí ngừng thuốc...');
const allClinicalChecklistIds = STOP_ANTIBIOTIC_CHECKLIST.clinicalCriteria.map(c => c.id);
const allLabChecklistIds = STOP_ANTIBIOTIC_CHECKLIST.labCriteria.map(l => l.id);

// CAP: minDays = 3 (PTC trial). Đủ 5/5 lâm sàng + 1 lab
const stopCapDay3 = evaluateStopCriteria(allClinicalChecklistIds, [allLabChecklistIds[0]], 3, 'respiratory', 'cap');
assert('StopCriteria', 'CAP ngày 3, đủ lâm sàng & lab -> Đủ tiêu chuẩn ngừng KS', stopCapDay3.canStop === true, { stopCapDay3 });

const stopCapDay2 = evaluateStopCriteria(allClinicalChecklistIds, [allLabChecklistIds[0]], 2, 'respiratory', 'cap');
assert('StopCriteria', 'CAP ngày 2 (chưa đủ minDays 3) -> Không đủ tiêu chuẩn ngừng', stopCapDay2.canStop === false);

// VAP: minDays = 7. Ngày 5 chưa đủ, ngày 7 đủ
const stopVapDay5 = evaluateStopCriteria(allClinicalChecklistIds, [allLabChecklistIds[0]], 5, 'respiratory', 'vap');
assert('StopCriteria', 'VAP ngày 5 (chưa đủ minDays 7) -> Không đủ tiêu chuẩn ngừng', stopVapDay5.canStop === false);

const stopVapDay7 = evaluateStopCriteria(allClinicalChecklistIds, [allLabChecklistIds[0]], 7, 'respiratory', 'vap');
assert('StopCriteria', 'VAP ngày 7 -> Đủ tiêu chuẩn ngừng', stopVapDay7.canStop === true);

// Đánh giá 48h
const reassessWorsening = evaluate48hReassessment('worsened', 'positive', 'resistant');
assert('Reassessment', 'Lâm sàng xấu đi + cấy kháng -> Khuyến cáo đổi KS theo KSĐ & hội chẩn', reassessWorsening.actionType === 'switch_by_ast');

const reassessImproving = evaluate48hReassessment('improved', 'positive', 'sensitive');
assert('Reassessment', 'Lâm sàng cải thiện + vi khuẩn nhạy -> Khuyến cáo xuống thang / chuyển PO', reassessImproving.actionType === 'de_escalate');

// Chuyển IV sang PO
const ivToPoEligible = evaluateIvToPo(true, true, true, false, 'Ceftriaxone');
assert('IvToPo', 'Hết sốt 24h, ăn uống được, huyết động ổn -> Đủ điều kiện chuyển PO', ivToPoEligible.isEligible === true, { ivToPoEligible });

const ivToPoIneligible = evaluateIvToPo(false, true, true, false, 'Ceftriaxone');
assert('IvToPo', 'Còn sốt -> Bị chặn chuyển PO', ivToPoIneligible.isEligible === false);

// ---------------------------------------------------------
// TỔNG KẾT
// ---------------------------------------------------------
const passedTests = results.filter(r => r.passed).length;
const failedTests = results.filter(r => !r.passed).length;
console.log('\n====================================================');
console.log(`TỔNG KẾT RÀ SOÁT: ${passedTests} TEST ĐẠT, ${failedTests} TEST LỖI`);
console.log('====================================================');
