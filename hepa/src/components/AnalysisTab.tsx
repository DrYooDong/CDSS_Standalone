/**
 * HepaCDSS Analysis Tab Component
 * Hiển thị kết quả phân tích tổn thương, tỷ số lâm sàng, cảnh báo Red Flags và chẩn đoán phân biệt.
 */

import React from 'react';
import { HepaAnalysisResult } from '../types';
import {
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  Stethoscope,
  Info,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface AnalysisTabProps {
  result: HepaAnalysisResult;
  onNavigateToScores: () => void;
  onNavigateToDili: () => void;
}

export const AnalysisTab: React.FC<AnalysisTabProps> = ({
  result,
  onNavigateToScores,
  onNavigateToDili,
}) => {
  const getPatternBadgeColor = (pattern: string) => {
    switch (pattern) {
      case 'hepatocellular':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'cholestatic':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'mixed':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'isolated_hyperbilirubinemia':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  const getSeverityBadgeColor = (sev: string) => {
    switch (sev) {
      case 'massive':
        return 'bg-purple-900 text-white font-extrabold animate-pulse';
      case 'severe':
        return 'bg-rose-600 text-white font-bold';
      case 'moderate':
        return 'bg-amber-500 text-white font-bold';
      case 'mild':
        return 'bg-amber-100 text-amber-900';
      case 'borderline':
        return 'bg-slate-100 text-slate-800';
      default:
        return 'bg-emerald-100 text-emerald-800';
    }
  };

  const getTierBanner = (tier: string) => {
    if (tier === 'emergency_transplant') {
      return {
        bg: 'bg-rose-50 border-rose-500 text-rose-950',
        badge: 'bg-rose-600 text-white',
        icon: <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />,
        title: 'PHÂN TẦNG: CẤP CỨU HỒI SỨC GAN MẬT / XEM XÉT GHÉP GAN KHẨN CẤP',
        desc: 'Bệnh nhân có dấu hiệu suy gan cấp, tổn thương tế bào gan khổng lồ hoặc dương tính Định luật Hy.',
      };
    }
    if (tier === 'specialist') {
      return {
        bg: 'bg-amber-50 border-amber-500 text-amber-950',
        badge: 'bg-amber-500 text-white',
        icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
        title: 'PHÂN TẦNG: CHUYỂN TUYẾN CHUYÊN KHOA TIÊU HÓA - GAN MẬT',
        desc: 'Tổn thương gan mức độ vừa-nặng, hội chứng ứ mật hoặc xơ gan tiến triển cần can thiệp chuyên sâu.',
      };
    }
    return {
      bg: 'bg-emerald-50 border-emerald-500 text-emerald-950',
      badge: 'bg-emerald-600 text-white',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
      title: 'PHÂN TẦNG: QUẢN LÝ VÀ THEO DÕI TẠI TUYẾN CƠ SỞ / NGOẠI TRÚ',
      desc: 'Bất thường nhẹ hoặc nguy cơ xơ hóa thấp. Kiểm soát lối sống, chuyển hóa và hẹn tái khám.',
    };
  };

  const tierInfo = getTierBanner(result.referralTier);

  return (
    <div className="space-y-6">
      {/* 1. BANNER PHÂN TẦNG NGUY CƠ */}
      <div className={`p-4 rounded-xl border-l-4 ${tierInfo.bg} shadow-sm flex items-start justify-between gap-3`}>
        <div className="flex items-start gap-3">
          {tierInfo.icon}
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${tierInfo.badge}`}>
                {result.referralTier.replace('_', ' ')}
              </span>
              <h3 className="text-sm font-bold">{tierInfo.title}</h3>
            </div>
            <p className="text-xs text-slate-700 mt-1">{tierInfo.desc}</p>
          </div>
        </div>
      </div>

      {/* 2. CẢNH BÁO RED FLAGS KHẨN CẤP (NẾU CÓ) */}
      {result.redFlags.length > 0 && (
        <div className="space-y-3">
          {result.redFlags.map(rf => (
            <div
              key={rf.id}
              className={`p-4 rounded-xl border-l-4 ${
                rf.severity === 'emergency'
                  ? 'bg-rose-50 border-rose-600 text-rose-950'
                  : rf.severity === 'warning'
                  ? 'bg-amber-50 border-amber-600 text-amber-950'
                  : 'bg-blue-50 border-blue-600 text-blue-950'
              } shadow-sm animate-fadeIn`}
            >
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wide">{rf.title}</h4>
                  <p className="text-xs leading-relaxed">{rf.description}</p>
                  <div className="text-xs font-semibold pt-1 text-rose-800">
                    <span className="font-bold underline">Hành động ngay:</span> {rf.immediateAction}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. TỔNG HỢP CÁC CHỈ SỐ LÂM SÀNG CỐT LÕI */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Chỉ số R */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Chỉ số R (R Ratio)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{result.rRatio}</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPatternBadgeColor(
                result.pattern
              )}`}
            >
              {result.pattern.toUpperCase()}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block">
            (ALT/ULN) / (ALP/ULN)
          </span>
        </div>

        {/* De Ritis */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Tỷ số De Ritis (AST/ALT)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{result.deRitisRatio}</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                result.deRitisRatio >= 2.0
                  ? 'bg-rose-100 text-rose-800 font-bold'
                  : result.deRitisRatio > 1.0
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {result.deRitisRatio >= 2.0 ? 'ARLD / Rượu' : result.deRitisRatio > 1.0 ? 'Nghi Xơ Gan' : '< 1.0'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block">Ty thể vs Bào tương</span>
        </div>

        {/* Mức độ tăng men */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Mức Độ Tăng Men
          </span>
          <div className="flex items-baseline gap-2">
            <span className={`text-xs px-2.5 py-1 rounded-md ${getSeverityBadgeColor(result.severity)}`}>
              {result.severity.toUpperCase()}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block">
            ALT: {result.altMultiples}x | AST: {result.astMultiples}x ULN
          </span>
        </div>

        {/* Bilirubin & Xơ hóa */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            FIB-4 / Bilirubin
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-teal-700">
              {result.fib4?.score ?? `${result.conjugatedPercent || 0}%`}
            </span>
            <span className="text-[10px] text-slate-500 font-semibold">
              {result.fib4 ? 'Điểm FIB-4' : 'Bilirubin TT'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block truncate">
            {result.fib4 ? result.fib4.riskCategory.toUpperCase() : result.bilirubinPredominance}
          </span>
        </div>
      </div>

      {/* 4. DIỄN GIẢI SINH LÝ BỆNH CHI TIẾT */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
          <Info className="w-4 h-4 text-teal-600" />
          <span>Tổng Hợp Nhận Định Sinh Hóa (Biochemical Synthesis)</span>
        </h4>
        <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside leading-relaxed">
          <li>
            <span className="font-bold">Kiểu tổn thương: </span>
            {result.patternDescription}
          </li>
          <li>
            <span className="font-bold">Động học De Ritis: </span>
            {result.deRitisInterpretation}
          </li>
          {result.astLdhInterpretation && (
            <li className="text-rose-900 font-medium">
              <span className="font-bold">Tỷ số AST/LDH: </span>
              {result.astLdhInterpretation}
            </li>
          )}
          {result.wilsonRatioAlpBili && (
            <li>
              <span className="font-bold">Tỷ số ALP/Bilirubin: </span>
              {result.wilsonRatioAlpBili} (Bình thường &gt; 4.0).
            </li>
          )}
          <li>
            <span className="font-bold">Chức năng bài tiết mật: </span>
            Bilirubin toàn phần {result.normalizedValues.totalBilirubinMgDl} mg/dL (
            {result.normalizedValues.totalBilirubinUmolL} µmol/L).{' '}
            {result.conjugatedPercent !== undefined && `Bilirubin liên hợp chiếm ${result.conjugatedPercent}%.`}
          </li>
        </ul>
      </div>

      {/* 4.1. PHÂN LOẠI BỆNH GAN THOÁI HÓA MỠ (SLD CONSENSUS 2023) */}
      {result.sldClassification && result.sldClassification.category !== 'Non-SLD' && (
        <div className="bg-white p-4 rounded-xl border border-teal-200 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 uppercase tracking-wide">
                Đồng thuận Đa quốc gia 2023
              </span>
              <h4 className="text-xs font-bold text-slate-900">{result.sldClassification.title}</h4>
            </div>
            <span className="text-xs font-black text-teal-700">
              [{result.sldClassification.category}]
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {result.sldClassification.subtext}
          </p>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
            <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wide">
              Khuyến cáo xử trí then chốt:
            </span>
            {result.sldClassification.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                <span className="text-teal-600 font-bold">•</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4.2. HƯỚNG DẪN AN TOÀN DÙNG THUỐC STATIN (BSG 2018 & BMJ 2025) */}
      {result.statinGuidance && (
        <div
          className={`p-4 rounded-xl border shadow-sm space-y-2 ${
            result.statinGuidance.isSafe
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              : 'bg-amber-50/70 border-amber-300 text-amber-950'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <span>💊</span>
              <span>{result.statinGuidance.title}</span>
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                result.statinGuidance.isSafe
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-600 text-white'
              }`}
            >
              {result.statinGuidance.badge}
            </span>
          </div>

          <p className="text-xs leading-relaxed">{result.statinGuidance.recommendation}</p>
          <p className="text-[11px] text-slate-500 italic border-t border-slate-200/60 pt-1.5">
            Ghi chú y văn: {result.statinGuidance.evidenceNote}
          </p>
        </div>
      )}

      {/* 4.3. TƯ VẤN THIẾU VITAMIN D KHI ALP XƯƠNG ĐƠN ĐỘC */}
      {result.isolatedAlpVitaminD?.isTriggered && (
        <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
          <span className="font-bold flex items-center gap-1.5 text-amber-800">
            <span>☀️</span>
            <span>Tư Vấn Tầm Soát Thiếu Hụt 25-OH Vitamin D (BMJ 2025)</span>
          </span>
          <p className="leading-relaxed">{result.isolatedAlpVitaminD.recommendation}</p>
        </div>
      )}

      {/* 4.4. LỘ TRÌNH XÉT NGHIỆM PHẢN XẠ iLFT (INTELLIGENT LIVER FUNCTION TESTING) */}
      {result.ilftReflex && (
        <div className="bg-white p-4 rounded-xl border border-indigo-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
            <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5 uppercase tracking-wide">
              <span>🧬</span>
              <span>Lộ Trình Xét Nghiệm Phản Xạ Thông Minh (iLFT Protocol)</span>
            </span>
            <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
              Gut & EASL Guideline
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Tier 1 */}
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block">
                Bậc 1: Sàng lọc Tiêu chuẩn (Tier 1)
              </span>
              {result.ilftReflex.tier1StandardScreen.map((item, i) => (
                <div key={i} className="text-xs bg-white p-2 rounded border border-slate-100 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{item.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-teal-50 text-teal-700 font-semibold">
                      {item.priority}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block">{item.targetAetiology}</span>
                </div>
              ))}
            </div>

            {/* Tier 2 */}
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block">
                Bậc 2: Khảo sát Chuyên sâu (Tier 2 theo Kiểu tổn thương)
              </span>
              {result.ilftReflex.tier2ExtendedScreen.map((item, i) => (
                <div key={i} className="text-xs bg-white p-2 rounded border border-slate-100 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{item.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-semibold">
                      {item.priority}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block">{item.targetAetiology}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. CHẨN ĐOÁN PHÂN BIỆT XẾP THEO XÁC SUẤT LÂM SÀNG */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Chẩn Đoán Phân Biệt Xếp Theo Xác Suất Lâm Sàng
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            {result.differentialDiagnoses.length} bệnh cảnh phù hợp
          </span>
        </div>

        {result.differentialDiagnoses.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-3 text-center">
            Các chỉ số sinh hóa gan hiện nằm trong khoảng bình thường hoặc biến thiên tối thiểu.
          </p>
        ) : (
          <div className="space-y-3">
            {result.differentialDiagnoses.map((diff, index) => {
              const isVeryHigh = diff.likelihood === 'very_high';
              const isHigh = diff.likelihood === 'high';
              return (
                <div
                  key={index}
                  className={`p-3.5 rounded-xl border transition ${
                    isVeryHigh
                      ? 'bg-teal-50/60 border-teal-300 shadow-xs'
                      : isHigh
                      ? 'bg-slate-50 border-slate-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                        {index + 1}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{diff.disease}</h4>
                    </div>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                        isVeryHigh
                          ? 'bg-teal-600 text-white'
                          : isHigh
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {diff.likelihood.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    <span className="font-bold text-slate-800">Đặc điểm sinh lý bệnh: </span>
                    {diff.clues}
                  </p>

                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-start gap-1.5 text-xs text-teal-900">
                    <FileCheck2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Xét nghiệm xác chẩn tiếp theo: </span>
                      {diff.confirmingTests}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. LỘ TRÌNH KHUYẾN CÁO CAN THIỆP TỪNG BƯỚC THEO ACG & WHO */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
          <CheckCircle2 className="w-5 h-5 text-teal-600" />
          <span>Khuyến Cáo Lộ Trình Can Thiệp Lâm Sàng (ACG & WHO Guidelines)</span>
        </h3>

        <div className="space-y-2">
          {result.stepByStepRecommendations.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-lg text-xs text-slate-800">
              <span className="w-4 h-4 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 7. ĐIỀU HƯỚNG NHANH SANG CÁC TAB CHUYÊN SÂU */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={onNavigateToScores}
          className="p-3.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl flex items-center justify-between text-indigo-900 transition text-xs font-bold"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span>Xem Bảng Điểm Tiên Lượng (Child-Pugh, MELD, Maddrey, FIB-4)</span>
          </div>
          <ArrowRight className="w-4 h-4 text-indigo-600" />
        </button>

        <button
          type="button"
          onClick={onNavigateToDili}
          className="p-3.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl flex items-center justify-between text-rose-900 transition text-xs font-bold"
        >
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Rà Soát DILI (Thang điểm RUCAM & Phác đồ Thuốc Lao)</span>
          </div>
          <ArrowRight className="w-4 h-4 text-rose-600" />
        </button>
      </div>
    </div>
  );
};
