import React, { useState } from 'react';
import { PatientData, CDSSAssessmentResult } from '../../sepsis/types';
import {
  deriveAntibioticBridgeFromSepsis,
  extractSepsisQuickDrugChips
} from '../../sepsis/patientBridge';
import { CalculatedRenalMetrics } from '../../types';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Droplet, 
  Pill, 
  Heart, 
  Copy, 
  Check, 
  BookmarkPlus, 
  Users,
  ChevronDown,
  ChevronUp,
  Dna,
  TestTube,
  Calculator,
  ArrowRight,
  Sparkles,
  BookOpen,
  Microscope
} from 'lucide-react';

interface SepsisDashboardProps {
  patient: PatientData;
  result: CDSSAssessmentResult;
  renal: CalculatedRenalMetrics;
  onSaveCase: () => void;
  saveSuccess: boolean;
  onSelectDrugForDosing: (drugId: string) => void;
  onGoToAntibioticStage: () => void;
  onGoToReassessStage?: () => void;
  onOpenSepsisGuide?: () => void;
}

export const SepsisDashboard: React.FC<SepsisDashboardProps> = ({
  patient,
  result,
  renal,
  onSaveCase,
  saveSuccess,
  onSelectDrugForDosing,
  onGoToAntibioticStage,
  onGoToReassessStage,
  onOpenSepsisGuide
}) => {
  const [copiedSbar, setCopiedSbar] = useState(false);
  const [showDetailedActions, setShowDetailedActions] = useState(false);
  const [showNlrEbm, setShowNlrEbm] = useState(false);

  const quickDrugs = extractSepsisQuickDrugChips(patient, result);
  const bridgeSnapshot = deriveAntibioticBridgeFromSepsis(patient, result);

  const generateSbarText = () => {
    return `[SBAR INFECTOSEPSIS CDSS v4.0] ${new Date().toLocaleTimeString('vi-VN')}
Đối tượng: ${patient.patientType === 'adult' ? 'Người lớn' : patient.patientType === 'pediatric' ? 'Nhi' : 'Sản khoa'} (${patient.ageYears}t, ${patient.gender === 'male' ? 'Nam' : 'Nữ'}, ${patient.weightKg}kg) | CrCl: ${renal.crcl} mL/p | Bối cảnh: ${patient.setting}
1. S: ${result.summarySentence} - Mức: ${result.urgencyLevel.toUpperCase()}
2. B: Ổ nhiễm ${patient.infectionSource} | YTNC: ${patient.hasImmunosuppression ? 'Suy giảm MD;' : ''} ${patient.hasIndwellingCatheter ? 'Sonde lưu;' : ''}
3. A: LS: HA ${patient.sbp}/${patient.dbp} mmHg (MAP ${result.calculatedMap}) | HR ${patient.heartRate} bpm | RR ${patient.respiratoryRate} l/p | T° ${patient.temperature}°C | SpO2 ${patient.spo2}%
   CLS: WBC ${patient.wbc ?? 'N/A'} G/L | NEU ${patient.neutrophilCount ?? 'N/A'} | LYM ${patient.lymphocyteCount ?? 'N/A'} | NLR ${result.calculatedNlr ?? 'N/A'} | Lac 0h ${patient.lactateInitial ?? 'N/A'} | Lac 6h ${patient.lactateRepeat6h ?? 'N/A'} (TT ${result.lactateClearancePercent ?? 'N/A'}%) | PCT ${patient.procalcitonin ?? 'N/A'} ng/mL
   Điểm số: NEWS2 ${result.news2Score} | LP-NEWS ${result.lpNewsScore} | SOFA ${result.sofaScore} | SIRS ${result.sirsScore}/4 | qSOFA ${result.qsofaScore}/3
4. R: ${result.actions.antibioticTiming} - Dịch: ${result.actions.fluidResuscitation} - Vận mạch: ${result.actions.vasopressorStrategy}`;
  };

  const handleCopySbar = () => {
    navigator.clipboard.writeText(generateSbarText());
    setCopiedSbar(true);
    setTimeout(() => setCopiedSbar(false), 2000);
  };

  const isEmergency = result.urgencyLevel === 'emergency';
  const isUrgent = result.urgencyLevel === 'urgent';

  const diagnosisHeadline =
    result.primaryDiagnosis === 'septic_shock'
      ? 'SỐC NHIỄM KHUẨN (SEPTIC SHOCK)'
      : result.primaryDiagnosis === 'confirmed_sepsis'
      ? 'XÁC NHẬN NHIỄM KHUẨN HUYẾT (SEPSIS)'
      : result.primaryDiagnosis === 'suspected_sepsis'
      ? 'NGHI NGỜ CAO NHIỄM KHUẨN HUYẾT'
      : result.primaryDiagnosis === 'uncomplicated_infection'
      ? 'NHIỄM KHUẨN THƯỜNG (CHƯA SUY TẠNG)'
      : 'CHƯA GHI NHẬN NGUY CƠ NHIỄM KHUẨN HUYẾT';

  const organScoreValue =
    patient.patientType === 'pediatric'
      ? result.phoenixScore
      : patient.patientType === 'maternal'
      ? result.obstetricSofaScore
      : result.sofaScore;

  const isShockOrgan = Boolean(
    result.isSepticShock3 || result.isPhoenixSepticShock || result.isObstetricSepticShock
  );
  const isSepsisOrgan = Boolean(
    result.isSepsis3 || result.isPhoenixSepsis || result.isObstetricSepsis
  );

  return (
    <div className="space-y-4">
      
      {/* ===================================================================== */}
      {/* 1. EXECUTIVE TRIAGE HERO BANNER                                       */}
      {/* ===================================================================== */}
      <div className={`bg-white rounded-2xl border shadow-xs overflow-hidden transition-all border-l-[6px] ${
        isEmergency
          ? 'border-rose-200 border-l-rose-600'
          : isUrgent
          ? 'border-amber-200 border-l-amber-500'
          : 'border-emerald-200 border-l-emerald-500'
      }`}>
        <div className={`p-4 sm:p-5 ${
          isEmergency
            ? 'bg-gradient-to-r from-rose-50/90 via-rose-50/40 to-white'
            : isUrgent
            ? 'bg-gradient-to-r from-amber-50/80 via-amber-50/30 to-white'
            : 'bg-gradient-to-r from-emerald-50/70 via-emerald-50/20 to-white'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className={`w-10 h-10 rounded-xl text-white shrink-0 flex items-center justify-center shadow-sm mt-0.5 ${
                isEmergency ? 'bg-rose-600 animate-pulse' : isUrgent ? 'bg-amber-500' : 'bg-emerald-600'
              }`}>
                {isEmergency ? (
                  <AlertOctagon className="w-5 h-5" />
                ) : isUrgent ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                    isEmergency
                      ? 'bg-rose-600 text-white'
                      : isUrgent
                      ? 'bg-amber-500 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}>
                    {isEmergency ? 'TỐI KHẨN CẤP' : isUrgent ? 'MỨC ĐỘ KHẨN' : 'THEO DÕI CHUẨN'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {patient.patientType === 'adult' ? 'Người lớn' : patient.patientType === 'pediatric' ? 'Nhi khoa' : 'Sản khoa'}
                  </span>
                  {result.primaryDiagnosis !== 'no_sepsis' && (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black font-mono ${
                      result.niceAntibioticMaxDelayHours <= 1
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : result.niceAntibioticMaxDelayHours <= 3
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-teal-100 text-teal-800 border border-teal-200'
                    }`}>
                      <Clock className="w-3 h-3" />
                      MỤC TIÊU KS ≤ {result.niceAntibioticMaxDelayHours}H
                    </span>
                  )}
                </div>

                <h2 className={`text-lg sm:text-xl font-black tracking-tight leading-snug ${
                  isEmergency ? 'text-rose-950' : isUrgent ? 'text-amber-950' : 'text-slate-900'
                }`}>
                  {diagnosisHeadline}
                </h2>

                <p className="text-xs text-slate-700 mt-1 leading-relaxed font-medium">
                  {result.summarySentence}
                </p>
              </div>
            </div>

            {/* Right Action Cluster */}
            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start">
              {onOpenSepsisGuide && (
                <button
                  type="button"
                  onClick={onOpenSepsisGuide}
                  className="p-2 bg-white text-slate-600 hover:text-teal-700 border border-slate-200 rounded-xl shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
                  title="Hướng dẫn Y khoa Sepsis (NICE NG253, Phoenix, NLR, T2MR)"
                >
                  <BookOpen className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={handleCopySbar}
                className="p-2 bg-white text-slate-600 hover:text-teal-700 border border-slate-200 rounded-xl shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
                title="Sao chép báo cáo SBAR"
              >
                {copiedSbar ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={onSaveCase}
                className="p-2 bg-white text-slate-600 hover:text-teal-700 border border-slate-200 rounded-xl shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
                title="Lưu hồ sơ ca bệnh"
              >
                {saveSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <BookmarkPlus className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Live Hemodynamic & Renal Telemetry Footer Strip */}
        <div className="px-4 sm:px-5 py-2.5 bg-slate-50/90 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono tabular-nums text-[11px]">
            <span className="text-slate-600">
              MAP: <strong className={result.calculatedMap < 65 ? 'text-rose-700 font-black' : 'text-slate-900'}>{result.calculatedMap}</strong> mmHg
            </span>
            <span className="text-slate-600">
              CrCl: <strong className={renal.crcl < 50 ? 'text-amber-700 font-black' : 'text-teal-700 font-bold'}>{renal.crcl}</strong> mL/p
            </span>
            {result.calculatedNlr !== undefined && (
              <span className="text-slate-600">
                NLR: <strong className={
                  result.nlrRiskLevel === 'critical'
                    ? 'text-rose-700 font-black'
                    : result.nlrRiskLevel === 'high'
                    ? 'text-rose-600 font-bold'
                    : 'text-slate-900'
                }>{result.calculatedNlr}</strong>
              </span>
            )}
            {patient.lactateInitial !== undefined && (
              <span className="text-slate-600">
                Lac: <strong className={patient.lactateInitial > 2 ? 'text-rose-700 font-black' : 'text-slate-900'}>{patient.lactateInitial}</strong> mmol/L
                {result.lactateClearancePercent !== undefined && (
                  <span className={`ml-1 px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    result.lactateClearancePercent >= 10 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    TT {result.lactateClearancePercent}%
                  </span>
                )}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onGoToAntibioticStage}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
          >
            <span>Chọn Phác Đồ &amp; Liều KS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. PRECISION 5-SCORE TELEMETRY MATRIX                                 */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2.5">
        {/* Card 1: NEWS2 */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col">
          <div className={`h-1 w-full ${
            result.news2RiskCategory === 'high' ? 'bg-rose-500' : result.news2RiskCategory === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
          }`} />
          <div className="p-3 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">NEWS2</span>
              <span className={`font-black px-1.5 py-0.5 rounded-md text-[9px] uppercase ${
                result.news2RiskCategory === 'high' ? 'bg-rose-100 text-rose-800' : result.news2RiskCategory === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {result.news2RiskCategory}
              </span>
            </div>
            <div className="my-1.5 flex items-baseline gap-1 font-mono tabular-nums">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">{result.news2Score}</span>
              <span className="text-[10px] text-slate-400">/ 20</span>
            </div>
            <p className="text-[10.5px] text-slate-600 leading-snug line-clamp-2">
              {result.hasSingleParam3RedFlag ? (
                <span className="text-rose-700 font-bold">● Red Flag: Thông số 3đ</span>
              ) : (
                `Theo dõi mỗi ${result.news2Score >= 7 ? '30p' : result.news2Score >= 5 ? '1h' : '4-6h'}`
              )}
            </p>
          </div>
        </div>

        {/* Card 2: SOFA / Phoenix / Obstetric */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col">
          <div className={`h-1 w-full ${
            isShockOrgan ? 'bg-rose-600' : isSepsisOrgan ? 'bg-amber-500' : 'bg-slate-300'
          }`} />
          <div className="p-3 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider truncate">
                {patient.patientType === 'pediatric' ? 'Phoenix 2024' : patient.patientType === 'maternal' ? 'Obs SOFA' : 'SOFA'}
              </span>
              <span className={`font-black px-1.5 py-0.5 rounded-md text-[9px] uppercase shrink-0 ${
                isShockOrgan ? 'bg-rose-100 text-rose-800' : isSepsisOrgan ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {isShockOrgan ? 'SỐC NK' : isSepsisOrgan ? 'SEPSIS' : 'ỔN'}
              </span>
            </div>
            <div className="my-1.5 flex items-baseline gap-1 font-mono tabular-nums">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">{organScoreValue}</span>
              <span className="text-[10px] text-slate-400">điểm</span>
            </div>
            <p className="text-[10.5px] text-slate-600 leading-snug line-clamp-2">
              {patient.patientType === 'pediatric'
                ? `Tim mạch: ${result.phoenixCardiovascularScore}đ`
                : patient.patientType === 'maternal'
                ? `Obs qSOFA: ${result.obstetricQsofaScore}/3`
                : `ΔSOFA +${result.deltaSofa}đ • qSOFA ${result.qsofaScore}/3`}
            </p>
          </div>
        </div>

        {/* Card 3: SIRS */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col">
          <div className={`h-1 w-full ${result.sirsScore >= 2 ? 'bg-amber-500' : 'bg-slate-300'}`} />
          <div className="p-3 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">SIRS</span>
              <span className={`font-black px-1.5 py-0.5 rounded-md text-[9px] ${
                result.sirsScore >= 2 ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-600'
              }`}>
                {result.sirsScore >= 2 ? 'SIRS (+)' : 'SIRS (-)'}
              </span>
            </div>
            <div className="my-1.5 flex items-baseline gap-1 font-mono tabular-nums">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">{result.sirsScore}</span>
              <span className="text-[10px] text-slate-400">/ 4</span>
            </div>
            <p className="text-[10.5px] text-slate-600 leading-snug line-clamp-2">
              {result.sirsScore >= 2 ? 'Đáp ứng viêm hệ thống (≥ 2/4)' : 'Chưa đủ tiêu chí SIRS'}
            </p>
          </div>
        </div>

        {/* Card 4: LP-NEWS */}
        <div className="bg-white rounded-2xl border border-cyan-200/90 shadow-2xs overflow-hidden flex flex-col">
          <div className="h-1 w-full bg-cyan-500" />
          <div className="p-3 flex-1 flex flex-col justify-between bg-gradient-to-b from-cyan-50/30 to-white">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-extrabold text-cyan-800 uppercase tracking-wider">LP-NEWS</span>
              <span className="font-black px-1.5 py-0.5 rounded-md text-[9px] bg-cyan-100 text-cyan-800 font-mono">
                AUC .966
              </span>
            </div>
            <div className="my-1.5 flex items-baseline gap-1 font-mono tabular-nums">
              <span className="text-2xl sm:text-3xl font-black text-cyan-950">{result.lpNewsScore}</span>
              <span className="text-[10px] text-cyan-700">điểm</span>
            </div>
            <p className="text-[10.5px] text-slate-600 leading-snug line-clamp-2">
              {result.lpNewsMortalityRiskTier === 'critical'
                ? 'Tử vong 14d rất cao'
                : result.lpNewsMortalityRiskTier === 'high'
                ? 'Tiên lượng tử vong cao'
                : 'Nguy cơ tử vong thấp'}
            </p>
          </div>
        </div>

        {/* Card 5: NICE NG253 */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col col-span-2 sm:col-span-1">
          <div className={`h-1 w-full ${
            result.niceRiskCategory === 'high' ? 'bg-rose-600' : result.niceRiskCategory === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
          }`} />
          <div className="p-3 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">NICE NG253</span>
              <span className={`font-black px-1.5 py-0.5 rounded-md text-[9px] uppercase ${
                result.niceRiskCategory === 'high' ? 'bg-rose-100 text-rose-800' : result.niceRiskCategory === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {result.niceRiskCategory === 'high' ? 'RẤT CAO' : result.niceRiskCategory === 'medium' ? 'VỪA' : 'THẤP'}
              </span>
            </div>
            <div className="my-1.5 flex items-baseline gap-1 font-mono tabular-nums">
              <span className="text-xl sm:text-2xl font-black text-slate-900">
                KS ≤ {result.niceAntibioticMaxDelayHours}h
              </span>
            </div>
            <p className="text-[10.5px] text-slate-600 leading-snug line-clamp-2">
              {result.niceHighRiskCriteriaMet.length > 0
                ? `${result.niceHighRiskCriteriaMet.length} dấu hiệu nguy cơ cao`
                : 'Theo dõi sát diễn tiến'}
            </p>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. REFINED NLR 4-TIER BIOMARKER GAUGE                                 */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200/80 text-teal-700 flex items-center justify-center">
              <TestTube className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-900 block leading-tight">
                Phân Tầng Tỷ Lệ NLR (Neutrophil / Lymphocyte)
              </span>
              <span className="text-[10px] text-slate-500 font-mono tabular-nums">
                NEU {patient.neutrophilCount ?? '--'} G/L ÷ LYM {patient.lymphocyteCount ?? '--'} G/L
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {result.calculatedNlr !== undefined ? (
              <span className={`text-[11px] font-mono tabular-nums px-2.5 py-1 rounded-lg font-extrabold ${
                result.nlrRiskLevel === 'critical'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : result.nlrRiskLevel === 'high'
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : result.nlrRiskLevel === 'mild' || result.nlrRiskLevel === 'elevated'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}>
                NLR = {result.calculatedNlr} •{' '}
                {result.nlrRiskLevel === 'critical'
                  ? 'MỨC 4: NGUY KỊCH (≥ 10.0)'
                  : result.nlrRiskLevel === 'high'
                  ? 'MỨC 3: NGUY CƠ CAO (6.0–9.9)'
                  : result.nlrRiskLevel === 'mild' || result.nlrRiskLevel === 'elevated'
                  ? 'MỨC 2: CẢNH BÁO (3.0–5.9)'
                  : 'MỨC 1: BÌNH THƯỜNG (< 3.0)'}
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 font-mono">Chưa nhập NEU/LYM</span>
            )}
            <button
              type="button"
              onClick={() => setShowNlrEbm(!showNlrEbm)}
              className="text-[10px] font-bold text-slate-500 hover:text-teal-700 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer"
            >
              {showNlrEbm ? 'Ẩn EBM' : 'EBM & Nhiễu'}
            </button>
          </div>
        </div>

        {/* 4-Segment Visual Gauge Track */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10.5px]">
          <div className={`p-2.5 rounded-xl border transition-all ${
            result.calculatedNlr !== undefined && result.calculatedNlr < 3.0
              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400/50 shadow-xs'
              : 'bg-slate-50/70 border-slate-200/80 text-slate-500'
          }`}>
            <div className="flex items-center justify-between font-mono font-black">
              <span>&lt; 3.0</span>
              <span className="text-[9px] font-sans px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">Mức 1</span>
            </div>
            <div className="font-bold text-slate-800 mt-0.5">Sinh lý / Bình thường</div>
          </div>

          <div className={`p-2.5 rounded-xl border transition-all ${
            result.calculatedNlr !== undefined && result.calculatedNlr >= 3.0 && result.calculatedNlr < 6.0
              ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-400/50 shadow-xs'
              : 'bg-slate-50/70 border-slate-200/80 text-slate-500'
          }`}>
            <div className="flex items-center justify-between font-mono font-black">
              <span>3.0 – 5.9</span>
              <span className="text-[9px] font-sans px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">Mức 2</span>
            </div>
            <div className="font-bold text-slate-800 mt-0.5">Cảnh báo / Viêm nhẹ</div>
          </div>

          <div className={`p-2.5 rounded-xl border transition-all ${
            result.calculatedNlr !== undefined && result.calculatedNlr >= 6.0 && result.calculatedNlr < 10.0
              ? 'bg-rose-50 border-rose-500 text-rose-950 ring-2 ring-rose-400/50 shadow-xs'
              : 'bg-slate-50/70 border-slate-200/80 text-slate-500'
          }`}>
            <div className="flex items-center justify-between font-mono font-black">
              <span>6.0 – 9.9</span>
              <span className="text-[9px] font-sans px-1.5 py-0.2 rounded bg-rose-100 text-rose-800">Mức 3</span>
            </div>
            <div className="font-bold text-slate-800 mt-0.5">Sepsis rõ (NPV 97%)</div>
          </div>

          <div className={`p-2.5 rounded-xl border transition-all ${
            result.calculatedNlr !== undefined && result.calculatedNlr >= 10.0
              ? 'bg-rose-600 border-rose-700 text-white ring-2 ring-rose-500/40 shadow-sm'
              : 'bg-slate-50/70 border-slate-200/80 text-slate-500'
          }`}>
            <div className="flex items-center justify-between font-mono font-black">
              <span>≥ 10.0</span>
              <span className={`text-[9px] font-sans px-1.5 py-0.2 rounded ${
                result.calculatedNlr !== undefined && result.calculatedNlr >= 10.0
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}>Mức 4</span>
            </div>
            <div className={`font-bold mt-0.5 ${
              result.calculatedNlr !== undefined && result.calculatedNlr >= 10.0 ? 'text-white' : 'text-slate-800'
            }`}>
              {result.calculatedNlr !== undefined && result.calculatedNlr >= 15.0 ? 'Báo động Septicemia' : 'Báo động Nguy kịch'}
            </div>
          </div>
        </div>

        {showNlrEbm && (
          <div className="p-2.5 rounded-xl bg-teal-50/60 border border-teal-200/80 text-[11px] text-slate-700 leading-relaxed space-y-1 animate-fadeIn">
            <div>
              <strong className="text-teal-900">EBM (Zahorec 2021, Demni 2026, Naess 2017):</strong> Ở BN sốt &lt; 7 ngày, NLR phân biệt <strong>Nhiễm trùng huyết (Median 15.7)</strong> với nhiễm khuẩn khu trú (Median ~8.0, p=0.006) vượt trội WBC &amp; CRP.
            </div>
            <div className="text-amber-900">
              <strong>Lưu ý nhiễu:</strong> Corticoid hoặc stress hậu phẫu làm tăng giả NLR; sốt kéo dài &gt; 7 ngày có thể làm giảm giả NLR.
            </div>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 4. HOUR-1 RESUSCITATION & ANTIMICROBIAL ACTION GRID (2×2)             */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center text-[11px] font-black">
              1h
            </span>
            <span>Phác Đồ Xử Trí Giờ Vàng &amp; Hành Động Can Thiệp</span>
          </h3>
          <button
            type="button"
            onClick={() => setShowDetailedActions(!showDetailedActions)}
            className="text-[11px] text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors cursor-pointer"
          >
            <span>{showDetailedActions ? 'Ẩn Source Control & Vi sinh' : 'Xem Source Control & Vi sinh'}</span>
            {showDetailedActions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Card 1: Kháng sinh Tĩnh mạch + Interactive CrCl Dosing Chips */}
          <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200/90 flex flex-col justify-between space-y-2.5">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-extrabold text-teal-950 text-[11px] uppercase flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-teal-600" />
                  1. Kháng Sinh Tĩnh Mạch (NICE NG253)
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white text-teal-800 border border-teal-200 tabular-nums">
                  CrCl {renal.crcl} mL/p
                </span>
              </div>
              <p className="font-bold text-teal-900 text-[11.5px] leading-snug">
                {result.actions.antibioticTiming}
              </p>
              <ul className="text-slate-700 space-y-1 list-disc pl-4 text-[11px] leading-relaxed">
                {result.actions.antibioticRegimen.map((r, idx) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>

            {quickDrugs.length > 0 && (
              <div className="pt-2.5 border-t border-teal-200/70">
                <span className="text-[10px] font-extrabold text-teal-900 uppercase tracking-wide block mb-1.5">
                  Bấm để tính liều cá thể hóa theo CrCl ({renal.crcl} mL/p):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {quickDrugs.map((chip) => (
                    <button
                      key={chip.drugId}
                      type="button"
                      onClick={() => onSelectDrugForDosing(chip.drugId)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer shadow-2xs ${
                        chip.role === 'targeted_mdr'
                          ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-700'
                          : chip.role === 'primary'
                          ? 'bg-teal-600 hover:bg-teal-700 text-white border-teal-700'
                          : 'bg-white hover:bg-teal-50 text-teal-900 border-teal-300'
                      }`}
                      title={chip.noteVi ? `${chip.label} — ${chip.noteVi}` : `Tính liều ${chip.label}`}
                    >
                      <Calculator className="w-3 h-3 shrink-0" />
                      <span>{chip.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Dịch tinh thể */}
          <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-200/90 space-y-1.5">
            <span className="font-extrabold text-sky-950 text-[11px] uppercase flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-sky-600" />
              2. Liệu Pháp Dịch Tinh Thể Cân Bằng
            </span>
            <p className="text-slate-800 text-[11.5px] leading-relaxed">
              {result.actions.fluidResuscitation}
            </p>
          </div>

          {/* Card 3: Vận mạch */}
          <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/90 space-y-1.5">
            <span className="font-extrabold text-rose-950 text-[11px] uppercase flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-600" />
              3. Thuốc Vận Mạch &amp; Huyết Động
            </span>
            <p className="text-slate-800 text-[11.5px] leading-relaxed">
              {result.actions.vasopressorStrategy}
            </p>
          </div>

          {/* Card 4: Báo động & Hội chẩn */}
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/90 space-y-1.5">
            <span className="font-extrabold text-amber-950 text-[11px] uppercase flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-600" />
              4. Bậc Thang Báo Động &amp; Hội Chẩn
            </span>
            <ul className="text-slate-800 space-y-1 list-disc pl-4 text-[11.5px] leading-relaxed">
              {result.actions.escalationAndConsult.map((e, idx) => (
                <li key={idx}>{e}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Expandable Source Control, Monitoring & Microbiology Details */}
        {showDetailedActions && (
          <div className="pt-3 border-t border-slate-100 text-xs text-slate-700 space-y-2.5 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="font-extrabold text-slate-900 block mb-1 text-[11px] uppercase">
                  Kiểm Soát Nguồn Nhiễm (Source Control)
                </span>
                <p className="text-[11px] text-slate-700 leading-relaxed">{result.actions.sourceControlNotes}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="font-extrabold text-slate-900 block mb-1 text-[11px] uppercase">
                  Tần Suất Theo Dõi Sinh Hiệu
                </span>
                <p className="text-[11px] text-slate-700 leading-relaxed">{result.actions.monitoringFrequency}</p>
              </div>
            </div>

            {result.actions.microbiologySteps.length > 0 && (
              <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-200/80">
                <span className="font-extrabold text-indigo-950 text-[11px] uppercase flex items-center gap-1.5 mb-1">
                  <Microscope className="w-3.5 h-3.5 text-indigo-600" />
                  Chiến Lược Cấy Máu &amp; Vi Sinh
                </span>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-700">
                  {result.actions.microbiologySteps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
            )}

            {patient.rapidMolecularResult === 'positive' && (
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                <span className="font-extrabold text-[11px] flex items-center gap-1.5 uppercase">
                  <Dna className="w-3.5 h-3.5 text-purple-600" />
                  Kết Quả Phân Tử T2Bacteria / T2Resistance Siêu Tốc (3-5h)
                </span>
                <p className="text-[11px] mt-1 leading-relaxed">
                  Phát hiện: <strong>{patient.rapidMolecularPathogen}</strong>. Gen kháng: <strong>{patient.rapidMolecularResistanceGenes?.join(', ') || 'Chưa ghi nhận'}</strong>. Cần chuyển kháng sinh nhắm đích ngay lập tức!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 5. SUPER-CDSS STAGE-TRANSITION COMMAND STRIP                          */}
      {/* ===================================================================== */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-teal-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-1.5 text-teal-300 text-[10.5px] font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cầu Nối Dữ Liệu Tự Động → Phân Hệ Kháng Sinh &amp; AMS</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              Đã đồng bộ tự động <strong className="text-white">SOFA {bridgeSnapshot.sofaScore}đ</strong>,{' '}
              <strong className="text-teal-300">CrCl {renal.crcl} mL/p</strong>, ổ nhiễm trùng và{' '}
              <strong className="text-white">{bridgeSnapshot.generalRiskIds.length} YTNC đa kháng</strong> sang Giai đoạn 2.
            </p>
            {bridgeSnapshot.syncHighlightsVi.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {bridgeSnapshot.syncHighlightsVi.slice(0, 3).map((hl, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/10 text-teal-200 border border-teal-400/20"
                  >
                    {hl}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {patient.rapidMolecularResult === 'positive' && onGoToReassessStage && (
              <button
                type="button"
                onClick={onGoToReassessStage}
                className="px-3.5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Dna className="w-4 h-4" />
                <span>Phác Đồ Đích MDR (Bước 3)</span>
              </button>
            )}
            <button
              type="button"
              onClick={onGoToAntibioticStage}
              className="px-4 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>Tiếp Tục: Phác Đồ BVBND &amp; Liều KS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
