import React, { useState } from 'react';
import { CSFInput, CSFAnalysisResult } from '../types/csf';
import { 
  AlertTriangle, 
  CheckCircle2, 
  AlertOctagon, 
  Award, 
  Printer, 
  ChevronDown, 
  ChevronUp, 
  Activity, 
  Stethoscope, 
  Sparkles,
  Copy,
  Check,
  Syringe
} from 'lucide-react';
import { normalizeInputs } from '../utils/csfAnalyzer';

interface Props {
  input: CSFInput;
  result: CSFAnalysisResult;
}

export const CDSSOutput: React.FC<Props> = ({ input, result }) => {
  const [showAllDiff, setShowAllDiff] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const { proteinMgDl, csfGlucoseMgDl, serumGlucoseMgDl } = normalizeInputs(input);

  const top = result.topDiagnosis;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const summaryText = `[CDSS KẾT QUẢ PHÂN TÍCH DỊCH NÃO TỦY]
Bệnh nhân: ${input.patientAge} tuổi, Giới tính: ${input.gender === 'male' ? 'Nam' : 'Nữ'}
Chẩn đoán gợi ý hàng đầu: ${top.nameVi} (${top.nameEn}) - Độ tương đồng: ${top.score}% (Độ tin cậy: ${top.confidence})
- Bạch cầu thực tế: ${result.correctedWbc}/µL (PMN: ${input.neutrophilPercent}%, Lympho: ${input.lymphocytePercent}%)
- Protein: ${input.protein} ${input.proteinUnit}
- Glucose DNT: ${input.csfGlucose} ${input.glucoseUnit} (Tỷ số Glucose DNT/Máu: ${result.glucoseRatio ?? 'N/A'})
- Hồng cầu: ${input.rbc}/µL | Dịch nổi: ${input.supernatant}
Khuyến cáo xử trí:
${top.recommendedActions.map((a, i) => `${i + 1}. ${a}`).join('\n')}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* 1. URGENT RED FLAG WARNINGS */}
      {result.urgentAlerts.length > 0 && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-2xl p-3.5 sm:p-4.5 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs sm:text-sm">
            <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 animate-pulse" />
            <span>CẢNH BÁO LÂM SÀNG NGUY CẤP (RED FLAGS)</span>
          </div>
          <ul className="space-y-1.5 text-xs text-rose-950 dark:text-rose-200">
            {result.urgentAlerts.map((alert, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-rose-600 dark:text-rose-400 font-bold">•</span>
                <span className="leading-snug">{alert}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 2. SPANOS CRITERIA BADGE (>99% BACTERIAL MENINGITIS) */}
      {result.spanosCriteriaMet && (
        <div className="bg-gradient-to-r from-red-600 to-rose-700 dark:from-red-800 dark:to-rose-900 text-white rounded-2xl p-3.5 sm:p-4.5 shadow-xs flex items-start justify-between gap-3 border border-red-500/40">
          <div className="flex items-start gap-2.5">
            <span className="p-1.5 bg-white/20 rounded-xl shrink-0 mt-0.5">
              <Award className="w-5 h-5 text-amber-300" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-xs sm:text-sm">
                  TIÊU CHUẨN VÀNG SPANOS (JAMA): ĐẶC HIỆU &gt; 99% CHO VIÊM MÀNG NÃO MỦ
                </h4>
                <span className="bg-amber-400 text-slate-900 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">
                  &gt; 99% chắc chắn
                </span>
              </div>
              <p className="text-[11px] text-rose-100 dark:text-rose-200 mt-0.5">
                Thỏa: {result.spanosDetails.join(' | ')}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. GUILLAIN-BARRÉ ALBUMINOCYTOLOGIC DISSOCIATION */}
      {result.albuminocytologicDissociation && (
        <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-purple-900 dark:text-purple-200">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-purple-200/80 dark:bg-purple-900/60 rounded-xl text-purple-800 dark:text-purple-300 shrink-0">
              <Stethoscope className="w-4 h-4" />
            </span>
            <div>
              <h5 className="font-bold text-xs">
                Hiện tượng Phân Ly Đạm - Tế Bào (Albuminocytological Dissociation)
              </h5>
              <p className="text-[11px] text-purple-700 dark:text-purple-300 mt-0.5">
                Protein DNT tăng cao ({proteinMgDl.toFixed(0)} mg/dL) trong khi bạch cầu bình thường ({result.correctedWbc}/µL) &rarr; Gợi ý Guillain-Barré (GBS).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. MAIN CDSS TOP DIAGNOSIS CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-teal-500 dark:border-teal-500 shadow-sm p-4 sm:p-5 md:p-6 space-y-4 transition-colors duration-200">
        {/* Top bar with diagnosis and icon actions */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-teal-600 dark:bg-teal-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Kết luận CDSS
              </span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">
                {top.nameEn}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight">
              {top.nameVi}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {top.summaryVi}
            </p>
          </div>

          {/* Action icon buttons & score badge */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-1 sm:pt-0">
            {/* Quick action icons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleCopySummary}
                title={copied ? "Đã sao chép!" : "Sao chép tóm tắt lâm sàng"}
                className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-50 dark:hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={handlePrint}
                title="In phiếu kết quả"
                className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-50 dark:hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>

            {/* Score display */}
            <div className="flex items-center gap-1.5 sm:text-right">
              <span className="text-xl sm:text-2xl font-black text-teal-700 dark:text-teal-400 font-mono">
                {top.score}%
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                top.confidence === 'very_high' 
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300' 
                  : top.confidence === 'high'
                  ? 'bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300'
                  : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
              }`}>
                {top.confidence === 'very_high' ? 'Tin cậy rất cao' : top.confidence === 'high' ? 'Tin cậy cao' : 'Khả năng vừa'}
              </span>
            </div>
          </div>
        </div>

        {/* Positive Features */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Đặc điểm ủng hộ chẩn đoán:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {top.keyFeatures.map((feat, idx) => (
              <div key={idx} className="p-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mt-1.5 shrink-0"></span>
                <span className="leading-snug">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Caveats if any */}
        {top.caveats && top.caveats.length > 0 && (
          <div className="p-2.5 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl space-y-1 text-xs text-amber-900 dark:text-amber-200">
            <div className="font-bold flex items-center gap-1 text-amber-950 dark:text-amber-100 text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              Lưu ý thận trọng:
            </div>
            <ul className="space-y-0.5 text-amber-800 dark:text-amber-300 text-[11px]">
              {top.caveats.map((c, idx) => (
                <li key={idx}>• {c}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommended Actions */}
        <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-xl p-3.5 sm:p-4 space-y-2 border border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-bold flex items-center gap-1.5 text-teal-300">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              XỬ TRÍ LÂM SÀNG KHUYẾN CÁO
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">Evidence-based</span>
          </div>
          <ol className="space-y-1.5 text-xs text-slate-200">
            {top.recommendedActions.map((action, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{action}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* 5. TRAUMATIC TAP & SAH EVALUATION */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 space-y-3 transition-colors duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-1.5">
            <Syringe className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              Chạm Mạch &amp; Nguy Cơ Xuất Huyết Dưới Nhện (Nature 2023)
            </h4>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            RBC: {input.rbc.toLocaleString()}/µL
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          {/* Box 1: Corrected WBC */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-0.5">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium block">Bạch cầu thực tế (Đã trừ)</span>
            <div className="text-base font-black text-slate-900 dark:text-white font-mono">
              {result.correctedWbc.toLocaleString()} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/µL</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Trừ {result.predictedTraumaticWbc} WBC từ máu ngoại vi.
            </p>
          </div>

          {/* Box 2: 3-tube test */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-0.5">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium block">Thanh thải 3 ống</span>
            <div className="text-base font-black text-slate-900 dark:text-white font-mono">
              {result.tubeClearingPercent !== null ? `${result.tubeClearingPercent}%` : 'Chưa nhập'}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {result.tubeClearingPercent !== null
                ? result.tubeClearingPercent >= 60 ? '✓ Giảm ≥ 60% → Chạm mạch' : '⚠ Giảm ít → Nghi SAH'
                : 'Nhập RBC ống 1 & 4 để tính'}
            </p>
          </div>

          {/* Box 3: Nature 2023 Decay */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-0.5">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium block">RBC điều chỉnh thời gian</span>
            <div className="text-base font-black text-slate-900 dark:text-white font-mono">
              {result.adjustedRbcSah.toLocaleString()} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/µL</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {result.sahLikelihoodFromZinganell === 'low' ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ Loại trừ SAH (99.8% NPV)</span>
              ) : result.sahLikelihoodFromZinganell === 'high' ? (
                <span className="text-rose-600 dark:text-rose-400 font-bold">⚠ Nguy cơ SAH cao (78.8%)</span>
              ) : (
                <span>Ngưỡng: 3,667 /µL</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 6. ADVANCED EFNS INDICES (Qalb & IgG Index) */}
      {(result.qAlbumin !== undefined || result.iggIndex !== undefined) && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-2.5 text-xs transition-colors duration-200">
          <div className="flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
            <Activity className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">
              Hàng Rào Máu - Não &amp; IgG Nội Tủy (EFNS Guidelines)
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {result.qAlbumin !== undefined && (
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl">
                <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Chỉ số Qalb: <strong className="text-slate-900 dark:text-white">{result.qAlbumin} &times; 10⁻³</strong> (Giới hạn: &le; {result.qAlbuminUpperLimit})</span>
                <span className={`text-[11px] font-semibold ${result.hasBloodCerebrospinalBarrierDisruption ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {result.hasBloodCerebrospinalBarrierDisruption ? '⚠ Tổn thương hàng rào máu não' : '✓ Hàng rào máu não nguyên vẹn'}
                </span>
              </div>
            )}
            {result.iggIndex !== undefined && (
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl">
                <span className="text-slate-500 dark:text-slate-400 text-[11px] block">IgG Index: <strong className="text-slate-900 dark:text-white">{result.iggIndex}</strong> (Ngưỡng &le; 0.7)</span>
                <span className={`text-[11px] font-semibold ${result.hasIntrathecalIgGSynthesis ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>
                  {result.hasIntrathecalIgGSynthesis ? '⚠ Có tổng hợp IgG nội tủy' : '✓ Không tăng tổng hợp IgG'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. DIFFERENTIAL DIAGNOSES (Compact) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
            Chẩn Đoán Phân Biệt Khác
          </h4>
          <button
            type="button"
            onClick={() => setShowAllDiff(!showAllDiff)}
            className="p-1 text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>{showAllDiff ? 'Thu gọn' : `Tất cả (${result.likelihoods.length})`}</span>
            {showAllDiff ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="space-y-1.5">
          {(showAllDiff ? result.likelihoods : result.likelihoods.slice(0, 3)).map((item, idx) => (
            <div
              key={item.category}
              className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 transition-colors ${
                idx === 0 
                  ? 'bg-teal-50/60 dark:bg-teal-950/40 border-teal-300 dark:border-teal-700' 
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                  idx === 0 ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {idx + 1}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{item.nameVi}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="w-16 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden hidden sm:block">
                  <div
                    className={`h-full ${idx === 0 ? 'bg-teal-600' : 'bg-slate-400 dark:bg-slate-500'}`}
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300 text-xs">
                  {item.score}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
