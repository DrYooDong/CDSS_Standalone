/**
 * CDSS Vancomycin TDM Calculator Card
 * Tính năng Giám sát TDM & Hiệu chỉnh liều Vancomycin theo AUC24 chuẩn ASHP/IDSA 2020.
 * Thiết kế đơn giản, dễ hiểu, chuyên nghiệp, tối ưu cho bác sĩ lâm sàng ra quyết định nhanh.
 */

import React, { useState } from 'react';
import { 
  Activity, 
  Target, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  LineChart as ChartIcon, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  FlaskConical, 
  Sliders, 
  Sparkles, 
  ShieldAlert, 
  Calendar,
  Check,
  Zap,
  RotateCcw
} from 'lucide-react';
import { TdmInput, TdmEvaluationResult, InfusionMethod, ClinCalcDosingRegimen } from '../types';
import { VancomycinPkChart } from './VancomycinPkChart';

interface TdmCalculatorCardProps {
  tdmInput: TdmInput;
  tdmResult: TdmEvaluationResult;
  regimenMethod: InfusionMethod;
  mic?: number;
  onChange: (updated: Partial<TdmInput>) => void;
  onApplyAdjustment: (newDose: number, newInterval?: number) => void;
}

export const TdmCalculatorCard: React.FC<TdmCalculatorCardProps> = ({
  tdmInput,
  tdmResult,
  regimenMethod,
  mic = 1.0,
  onChange,
  onApplyAdjustment
}) => {
  const isContinuous = regimenMethod === 'continuous';
  const [showChart, setShowChart] = useState(false);

  // Active intermittent calculation method
  const intermittentMethod = tdmInput.intermittentMethod || 'bayesian_single';

  // Sample presets for quick clinical scenarios
  const loadPreset = (type: 'optimal' | 'low' | 'toxic') => {
    if (isContinuous) {
      if (type === 'optimal') {
        onChange({ 
          currentContinuousDailyDoseMg: 2000,
          steadyStateConcentration: 22.0 
        });
      } else if (type === 'low') {
        onChange({ 
          currentContinuousDailyDoseMg: 1500,
          steadyStateConcentration: 14.0 
        });
      } else {
        onChange({ 
          currentContinuousDailyDoseMg: 2500,
          steadyStateConcentration: 32.0 
        });
      }
    } else if (intermittentMethod === 'bayesian_single') {
      if (type === 'optimal') {
        onChange({
          currentDoseMg: 1000,
          currentIntervalHours: 12,
          infusionDurationHours: 1.5,
          singleConcentration: 11.5,
          troughConcentration: 11.5,
          singleSampleType: 'trough',
          singleDoseNumber: 2
        });
      } else if (type === 'low') {
        onChange({
          currentDoseMg: 1000,
          currentIntervalHours: 12,
          infusionDurationHours: 1.5,
          singleConcentration: 6.0,
          troughConcentration: 6.0,
          singleSampleType: 'trough',
          singleDoseNumber: 2
        });
      } else {
        onChange({
          currentDoseMg: 1250,
          currentIntervalHours: 12,
          infusionDurationHours: 2.0,
          singleConcentration: 22.5,
          troughConcentration: 22.5,
          singleSampleType: 'trough',
          singleDoseNumber: 2
        });
      }
    } else {
      // 2-point PK
      if (type === 'optimal') {
        onChange({
          currentDoseMg: 1000,
          currentIntervalHours: 12,
          infusionDurationHours: 1.5,
          peakConcentration: 28.5,
          peakTimeAfterEndHours: 1.0,
          troughConcentration: 11.5,
          troughTimeBeforeNextHours: 0.5
        });
      } else if (type === 'low') {
        onChange({
          currentDoseMg: 1000,
          currentIntervalHours: 12,
          infusionDurationHours: 1.5,
          peakConcentration: 18.0,
          peakTimeAfterEndHours: 1.0,
          troughConcentration: 6.0,
          troughTimeBeforeNextHours: 0.5
        });
      } else {
        onChange({
          currentDoseMg: 1250,
          currentIntervalHours: 12,
          infusionDurationHours: 2.0,
          peakConcentration: 42.0,
          peakTimeAfterEndHours: 1.0,
          troughConcentration: 23.0,
          troughTimeBeforeNextHours: 0.5
        });
      }
    }
  };

  const getAttainmentColor = (att: string) => {
    switch (att) {
      case 'target':
        return {
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
          badge: 'bg-emerald-600 text-white',
          text: 'text-emerald-700',
          label: 'ĐẠT ĐÍCH ĐIỀU TRỊ (AUC 400 - 600 mg·h/L)',
          actionDesc: 'Nồng độ thuốc tối ưu về hiệu quả diệt khuẩn và an toàn thận. Tiếp tục duy trì phác đồ.'
        };
      case 'subtherapeutic':
        return {
          bg: 'bg-amber-50 border-amber-300 text-amber-950',
          badge: 'bg-amber-500 text-white',
          text: 'text-amber-700',
          label: 'DƯỚI MỤC TIÊU (AUC < 400 mg·h/L)',
          actionDesc: 'Nguy cơ thất bại điều trị hoặc chọn lọc chủng vi khuẩn kháng thuốc. Cần tăng liều.'
        };
      case 'supratherapeutic':
      default:
        return {
          bg: 'bg-rose-50 border-rose-300 text-rose-950',
          badge: 'bg-rose-600 text-white',
          text: 'text-rose-700',
          label: 'VƯỢT NGƯỠNG AN TOÀN (AUC > 600 mg·h/L)',
          actionDesc: 'Nguy cơ độc tính thận (AKI) tăng gấp 3–4 lần. Cần tạm ngừng liều hoặc giảm liều.'
        };
    }
  };

  const statusStyle = getAttainmentColor(tdmResult.targetAttainment);
  const sampleConcentration = tdmInput.singleConcentration ?? tdmInput.troughConcentration ?? '';

  // Tìm phác đồ được khuyến nghị (Preferred)
  const preferredRegimen = tdmResult.preferredAdjustedRegimen || 
    tdmResult.adjustedRegimens?.find((r: ClinCalcDosingRegimen) => r.isPreferred);

  return (
    <div id="tdm-calculator-card" className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-4">
      {/* Header: Title & Minimalist Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-100 shadow-2xs">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Hiệu Chỉnh Liều Vancomycin Dựa Trên Nồng Độ (TDM)</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800">
                ASHP/IDSA 2020
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Đích điều trị tối ưu: AUC24 / MIC = <strong>400 – 600 mg·h/L</strong> (giảm tối đa nguy cơ suy thận cấp)
            </p>
          </div>
        </div>

        {/* Minimalist Method Toggle (when Intermittent) */}
        {!isContinuous && (
          <div className="flex bg-slate-100 p-0.5 rounded-xl text-xs font-semibold self-start sm:self-auto border border-slate-200/80">
            <button
              type="button"
              onClick={() => onChange({ intermittentMethod: 'bayesian_single' })}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                intermittentMethod === 'bayesian_single'
                  ? 'bg-white text-teal-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Bayesian 1 mẫu đáy
            </button>
            <button
              type="button"
              onClick={() => onChange({ intermittentMethod: 'two_point' })}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                intermittentMethod === 'two_point'
                  ? 'bg-white text-indigo-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              2 mẫu (Peak - Trough)
            </button>
          </div>
        )}
      </div>

      {/* Kịch bản nồng độ nhanh (Thử nghiệm 1 chạm) */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
        <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Kịch bản thử nghiệm nhanh:</span>
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => loadPreset('optimal')}
            className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-bold text-[11px] transition-all cursor-pointer shadow-2xs"
          >
            🎯 Đạt đích (AUC ~500)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('low')}
            className="px-2.5 py-1 bg-white hover:bg-amber-50 text-amber-800 border border-amber-200 rounded-lg font-bold text-[11px] transition-all cursor-pointer shadow-2xs"
          >
            ⚠️ Dưới đích (&lt; 400)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('toxic')}
            className="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-800 border border-rose-200 rounded-lg font-bold text-[11px] transition-all cursor-pointer shadow-2xs"
          >
            🚨 Nguy cơ độc thận (Đáy &gt; 20)
          </button>
        </div>
      </div>

      {/* BƯỚC 1: NHẬP THÔNG TIN PHÁC ĐỒ & NỒNG ĐỘ ĐO ĐƯỢC */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5 uppercase tracking-wide">
            <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">1</span>
            <span>Thông tin phác đồ &amp; Nồng độ đo được</span>
          </span>
          <span className="text-slate-400 font-normal">ASHP/IDSA 2020 Standard</span>
        </div>

        {isContinuous ? (
          /* Truyền liên tục */
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Liều truyền liên tục hiện tại:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="500"
                    max="5000"
                    step="100"
                    value={tdmInput.currentContinuousDailyDoseMg || 2000}
                    onChange={(e) => onChange({ currentContinuousDailyDoseMg: Number(e.target.value) })}
                    placeholder="2000"
                    className="w-full h-9 px-3 text-xs font-bold font-mono bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold">mg/24h</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Tốc độ: {((tdmInput.currentContinuousDailyDoseMg || 2000) / 24).toFixed(1)} mg/giờ
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Nồng độ ổn định đo được (C_ss):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="0.1"
                    value={tdmInput.steadyStateConcentration || ''}
                    onChange={(e) => onChange({ steadyStateConcentration: Number(e.target.value) })}
                    placeholder="VD: 22.5"
                    className="w-full h-9 px-3 text-xs font-bold font-mono bg-white border border-teal-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold">mg/L</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Lấy mẫu sau ≥ 24h truyền liên tục (Đích: <strong>20 – 25 mg/L</strong>).
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Truyền ngắt quãng (Bayesian 1 mẫu hoặc 2 mẫu) */
          <div className="space-y-3">
            {/* Phác đồ đang dùng */}
            <div className="grid grid-cols-3 gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Liều đang dùng:</label>
                <div className="relative">
                  <input
                    type="number"
                    step="50"
                    value={tdmInput.currentDoseMg || ''}
                    onChange={(e) => onChange({ currentDoseMg: Number(e.target.value) })}
                    placeholder="1000"
                    className="w-full h-8 px-2.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded-lg outline-none focus:border-teal-600"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400">mg</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Khoảng cách liều:</label>
                <select
                  value={tdmInput.currentIntervalHours}
                  onChange={(e) => onChange({ currentIntervalHours: Number(e.target.value) })}
                  className="w-full h-8 px-2 text-xs font-bold bg-white border border-slate-300 rounded-lg outline-none cursor-pointer focus:border-teal-600"
                >
                  <option value="8">Mỗi 8 giờ (q8h)</option>
                  <option value="12">Mỗi 12 giờ (q12h)</option>
                  <option value="18">Mỗi 18 giờ (q18h)</option>
                  <option value="24">Mỗi 24 giờ (q24h)</option>
                  <option value="36">Mỗi 36 giờ (q36h)</option>
                  <option value="48">Mỗi 48 giờ (q48h)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Thời gian truyền:</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="6"
                    value={tdmInput.infusionDurationHours || ''}
                    onChange={(e) => onChange({ infusionDurationHours: Number(e.target.value) })}
                    placeholder="1.5"
                    className="w-full h-8 px-2.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded-lg outline-none focus:border-teal-600"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400">giờ</span>
                </div>
              </div>
            </div>

            {/* Khung nhập nồng độ đo được */}
            {intermittentMethod === 'bayesian_single' ? (
              <div className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/50 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-teal-200/60">
                  <div className="flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4 text-teal-700" />
                    <span className="text-xs font-bold text-teal-950">
                      Nồng độ mẫu duy nhất (Chuẩn ASHP 2020 Bayesian TDM)
                    </span>
                  </div>
                  <span className="text-[10px] text-teal-800 bg-teal-100 px-2 py-0.5 rounded font-bold">
                    Khuyến nghị lấy mẫu đáy (C_trough)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  {/* Ô nhập nồng độ */}
                  <div className="sm:col-span-5">
                    <label className="block text-xs font-bold text-teal-950 mb-1">
                      Nồng độ đáy đo được (C_trough):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0.5"
                        max="100"
                        value={sampleConcentration}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          onChange({
                            singleConcentration: val,
                            troughConcentration: val
                          });
                        }}
                        placeholder="VD: 11.5"
                        className="w-full h-10 px-3 text-base font-black font-mono bg-white border border-teal-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                      />
                      <span className="absolute right-3 top-3 text-xs text-slate-400 font-bold">mg/L</span>
                    </div>
                  </div>

                  {/* Thời điểm lấy mẫu */}
                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Thời điểm rút máu đáy:
                    </label>
                    <div className="h-10 px-3 bg-white border border-teal-200 rounded-xl text-xs text-slate-700 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>Trước cữ kế ≤ 30 phút (giờ thứ {Math.max(0, (tdmInput.currentIntervalHours || 12) - 0.5)})</span>
                    </div>
                  </div>

                  {/* Cữ liều lấy mẫu */}
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Mẫu thuộc cữ liều:
                    </label>
                    <select
                      value={tdmInput.singleDoseNumber || 2}
                      onChange={(e) => onChange({ singleDoseNumber: Number(e.target.value) })}
                      className="w-full h-10 px-2.5 bg-white border border-teal-200 rounded-xl font-bold text-xs text-slate-800 cursor-pointer outline-none"
                    >
                      <option value="1">Cữ 1 (khởi đầu)</option>
                      <option value="2">Cữ 2 (trong 24h đầu)</option>
                      <option value="3">Cữ 3 (khoảng 24-36h)</option>
                      <option value="4">Cữ 4+ (đã ổn định)</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              /* 2 Mẫu (Đỉnh & Đáy) */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Đỉnh */}
                <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-teal-900 flex items-center gap-1">
                      <FlaskConical className="w-3.5 h-3.5 text-teal-700" />
                      <span>Nồng độ Đỉnh (C_peak)</span>
                    </label>
                    <span className="text-[10px] text-teal-700">1-2h sau truyền</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={tdmInput.peakConcentration || ''}
                      onChange={(e) => onChange({ peakConcentration: Number(e.target.value) })}
                      placeholder="VD: 28.5"
                      className="w-full h-9 px-3 text-sm font-bold font-mono bg-white border border-teal-300 rounded-xl outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400">mg/L</span>
                  </div>
                </div>

                {/* Đáy */}
                <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-indigo-900 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-700" />
                      <span>Nồng độ Đáy (C_trough)</span>
                    </label>
                    <span className="text-[10px] text-indigo-700">≤ 30p trước cữ kế</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={tdmInput.troughConcentration || ''}
                      onChange={(e) => onChange({ troughConcentration: Number(e.target.value) })}
                      placeholder="VD: 11.5"
                      className="w-full h-9 px-3 text-sm font-bold font-mono bg-white border border-indigo-300 rounded-xl outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400">mg/L</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* BƯỚC 2: KẾT QUẢ ĐÁNH GIÁ NỒNG ĐỘ & AUC24 */}
      {tdmResult.auc24 > 0 ? (
        <div className={`p-4 rounded-xl border ${statusStyle.bg} transition-all space-y-3.5`}>
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 uppercase tracking-wide">
              <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">2</span>
              <span>Đánh giá AUC24 &amp; Mức độ an toàn</span>
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${statusStyle.badge}`}>
              {statusStyle.label}
            </span>
          </div>

          {/* AUC24 Big Display */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/80 p-3.5 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-xs text-slate-500 font-semibold block">AUC24 thực tế ước tính:</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-black font-mono text-slate-900">{tdmResult.auc24}</span>
                <span className="text-xs font-bold text-slate-600">mg·h/L</span>
                <span className="text-xs text-slate-500 ml-1">
                  (AUC24/MIC = <strong className="font-mono text-slate-800">{Math.round(tdmResult.auc24 / mic)}</strong>)
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-1 font-medium">{statusStyle.actionDesc}</p>
            </div>

            {/* Dược động học PK tóm tắt */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs border-t sm:border-t-0 sm:border-l border-slate-200/80 pt-2 sm:pt-0 sm:pl-3">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">CL (Thanh thải)</span>
                <span className="font-mono font-bold text-slate-800">{tdmResult.clEstimated || '-'} L/h</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Vd (Phân bố)</span>
                <span className="font-mono font-bold text-slate-800">{tdmResult.vdEstimated || '-'} L</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">t½ (Bán thải)</span>
                <span className="font-mono font-bold text-slate-800">{tdmResult.halfLifeHours || '-'} giờ</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">C_trough dự kiến</span>
                <span className={`font-mono font-bold ${(tdmResult.cMinEstimated || 0) >= 20 ? 'text-rose-600' : 'text-slate-800'}`}>
                  {tdmResult.cMinEstimated || '-'} mg/L
                </span>
              </div>
            </div>
          </div>

          {/* CẢNH BÁO NGUY CƠ ĐỘC THẬN & TẠM NGƯNG LIỀU (HOLD DOSE) */}
          {(tdmResult.isHighTroughRisk || (tdmResult.holdDoseHours && tdmResult.holdDoseHours > 0)) && (
            <div className="p-3.5 rounded-xl bg-rose-100 border border-rose-300 text-rose-950 space-y-1.5">
              <div className="flex items-center gap-2 font-black text-xs text-rose-900">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>CẢNH BÁO NGUY CƠ ĐỘC TÍNH THẬN (AKI): NỒNG ĐỘ VƯỢT NGƯỠNG AN TOÀN!</span>
              </div>
              <p className="text-xs text-rose-900 leading-tight">
                Nồng độ đáy đo được <strong>≥ 20 mg/L</strong> hoặc AUC24 <strong>&gt; 600 mg·h/L</strong>. Cần tạm ngừng liều và điều chỉnh lại phác đồ.
              </p>
              {tdmResult.holdDoseHours && tdmResult.holdDoseHours > 0 && (
                <div className="p-2 bg-white rounded-lg border border-rose-200 text-xs text-rose-900 font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>
                    Chỉ định Tạm ngừng liều (Hold Dose): Ngưng trong <span className="underline font-black text-rose-700">{tdmResult.holdDoseHours} giờ</span> trước khi dùng liều hiệu chỉnh mới.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* BƯỚC 3: PHƯƠNG ÁN CHỈNH LIỀU TỐI ƯU & BẢNG SO SÁNH */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5 uppercase tracking-wide">
                <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">3</span>
                <span>Phương án chỉnh liều tối ưu &amp; Kế hoạch tiếp theo</span>
              </span>
            </div>

            {/* Phác đồ khuyến nghị chính (Preferred Regimen Highlight) */}
            {preferredRegimen && (
              <div className="p-3.5 bg-white rounded-xl border-2 border-emerald-500 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                      Phác Đồ Đề Xuất Tối Ưu
                    </span>
                    <span className="text-xs font-bold text-slate-600">
                      Tổng liều: {preferredRegimen.dailyDoseMg} mg/24h
                    </span>
                  </div>
                  <div className="text-base font-black text-slate-900">
                    {preferredRegimen.doseMg} mg mỗi {preferredRegimen.intervalHours} giờ (q{preferredRegimen.intervalHours}h)
                  </div>
                  <p className="text-xs text-slate-600">
                    Dự kiến AUC24: <strong className="text-slate-900">{preferredRegimen.auc24} mg·h/L</strong> • Nồng độ đáy: <strong className="text-slate-900">{preferredRegimen.cTrough} mg/L</strong>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onApplyAdjustment(preferredRegimen.doseMg, preferredRegimen.intervalHours)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Áp Dụng Phác Đồ Này</span>
                </button>
              </div>
            )}

            {/* Bảng so sánh các phương án khả thi */}
            {tdmResult.adjustedRegimens && tdmResult.adjustedRegimens.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 block">
                  Bảng so sánh các phương án liều khả thi (Candidate Regimens):
                </span>
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 text-[10px] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Phác đồ (Liều x Cữ)</th>
                        <th className="py-2 px-2.5">Tổng 24h</th>
                        <th className="py-2 px-2.5">Đáy (C_trough)</th>
                        <th className="py-2 px-2.5">AUC24 dự kiến</th>
                        <th className="py-2 px-2.5">Đánh giá</th>
                        <th className="py-2 px-3 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {tdmResult.adjustedRegimens.map((opt: any, idx) => {
                        const isRec = opt.isPreferred ?? opt.isRecommended;
                        const troughVal = opt.cTrough ?? opt.predictedTrough;
                        const aucVal = opt.auc24 ?? opt.predictedAuc24;
                        const isHighTrough = (troughVal && troughVal >= 20) || opt.isHighTroughRisk;
                        const isTarget = opt.isWithinGoal || (aucVal >= 400 && aucVal <= 600);
                        const isSub = aucVal < 400;

                        return (
                          <tr 
                            key={`regimen-${idx}`} 
                            className={`hover:bg-slate-50/80 transition-colors ${
                              isRec ? 'bg-emerald-50/50 font-semibold' : ''
                            }`}
                          >
                            <td className="py-2 px-3 font-mono font-bold text-slate-900">
                              <div className="flex items-center gap-1.5">
                                {isRec && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
                                <span>{opt.doseMg} mg q{opt.intervalHours}h</span>
                                {isRec && (
                                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1 py-0.2 rounded">
                                    Ưu tiên
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-2 px-2.5 font-mono text-slate-600">{opt.dailyDoseMg} mg</td>
                            <td className={`py-2 px-2.5 font-mono ${isHighTrough ? 'text-rose-600 font-bold' : 'text-slate-700'}`}>
                              {troughVal} mg/L
                            </td>
                            <td className="py-2 px-2.5 font-mono font-bold text-slate-900">
                              {aucVal} <span className="text-[10px] font-normal text-slate-400">mg·h/L</span>
                            </td>
                            <td className="py-2 px-2.5">
                              {isTarget ? (
                                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                                  Đạt đích
                                </span>
                              ) : isSub ? (
                                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                                  Dưới đích
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-1.5 py-0.5 rounded">
                                  Quá liều
                                </span>
                              )}
                            </td>
                            <td className="py-2 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => onApplyAdjustment(opt.doseMg, opt.intervalHours)}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-all active:scale-95 ${
                                  isRec 
                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs' 
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                              >
                                Áp dụng
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Kế hoạch theo dõi TDM tiếp theo */}
            {tdmResult.monitoringPlan && (
              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
                <Calendar className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900">Kế hoạch theo dõi TDM tiếp theo: </span>
                  <span>{tdmResult.monitoringPlan}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center text-xs text-slate-500">
          Nhập nồng độ đáy hoặc nồng độ mẫu để hệ thống tự động tính toán AUC24 và đề xuất phác đồ hiệu chỉnh liều.
        </div>
      )}

      {/* Nút bật / tắt Biểu đồ Dược động học SVG */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
        <button
          type="button"
          onClick={() => setShowChart(!showChart)}
          className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-teal-50 transition-all cursor-pointer"
        >
          <ChartIcon className="w-3.5 h-3.5" />
          <span>{showChart ? 'Thu gọn biểu đồ dược động học' : 'Xem biểu đồ nồng độ theo thời gian (AUC/MIC)'}</span>
          {showChart ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        <span className="text-[10px] text-slate-400 font-medium">
          Mô hình PK 1-ngăn &amp; 2-ngăn chuẩn ASHP 2020
        </span>
      </div>

      {showChart && (
        <VancomycinPkChart
          tdmInput={tdmInput}
          tdmResult={tdmResult}
          regimenMethod={regimenMethod}
          mic={mic}
        />
      )}
    </div>
  );
};
