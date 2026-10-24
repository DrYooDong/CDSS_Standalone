import React, { useState } from 'react';
import { 
  Activity, 
  Target, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  Zap,
  TrendingUp,
  RefreshCw,
  LineChart as ChartIcon,
  ChevronDown,
  ChevronUp,
  Clock,
  FlaskConical,
  Sliders,
  Sparkles,
  Info,
  ShieldAlert,
  Check,
  Calendar
} from 'lucide-react';
import { TdmInput, TdmEvaluationResult, InfusionMethod } from '../types';
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
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          text: 'text-emerald-700',
          label: 'ĐẠT MỤC TIÊU (400 - 600 mg·h/L)'
        };
      case 'subtherapeutic':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-900',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          text: 'text-amber-700',
          label: 'DƯỚI MỤC TIÊU (< 400 mg·h/L)'
        };
      case 'supratherapeutic':
      default:
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-900',
          badge: 'bg-rose-100 text-rose-800 border-rose-300',
          text: 'text-rose-700',
          label: 'VƯỢT NGƯỠNG (> 600 mg·h/L) - NGUY CƠ AKI'
        };
    }
  };

  const statusStyle = getAttainmentColor(tdmResult.targetAttainment);
  const sampleConcentration = tdmInput.singleConcentration ?? tdmInput.troughConcentration ?? '';

  return (
    <div id="tdm-calculator-card" className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-4">
      {/* Title & Method Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-indigo-700" />
            Giám sát TDM & Chỉnh Liều theo AUC24
          </h2>
          <p className="text-xs text-slate-500">
            Mục tiêu điều trị: AUC24 / MIC = 400 – 600 mg·h/L (ASHP/IDSA 2020)
          </p>
        </div>

        {/* Minimalist Method Toggle (when Intermittent) */}
        {!isContinuous && (
          <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-medium self-start sm:self-auto">
            <button
              type="button"
              onClick={() => onChange({ intermittentMethod: 'bayesian_single' })}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                intermittentMethod === 'bayesian_single'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Bayesian 1 mẫu (ASHP 2020)
            </button>
            <button
              type="button"
              onClick={() => onChange({ intermittentMethod: 'two_point' })}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                intermittentMethod === 'two_point'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              2 mẫu (Peak - Trough)
            </button>
          </div>
        )}
      </div>

      {/* Quick Clinical Scenario Presets Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
        <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Kịch bản nồng độ nhanh:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => loadPreset('optimal')}
            className="px-2 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md font-medium text-[11px] transition-all cursor-pointer"
          >
            🎯 Đạt đích (AUC ~500)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('low')}
            className="px-2 py-1 bg-white hover:bg-amber-50 text-amber-800 border border-amber-200 rounded-md font-medium text-[11px] transition-all cursor-pointer"
          >
            ⚠️ Dưới đích (&lt; 400)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('toxic')}
            className="px-2 py-1 bg-white hover:bg-rose-50 text-rose-800 border border-rose-200 rounded-md font-medium text-[11px] transition-all cursor-pointer"
          >
            🚨 Nguy cơ ngộ độc (Đáy &gt; 20)
          </button>
        </div>
      </div>

      {/* Input Fields */}
      {isContinuous ? (
        /* Continuous Infusion Input */
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Liều truyền liên tục hiện tại (mg/24h):
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
                  className="w-full px-3 py-2 text-sm font-bold font-mono bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-hidden"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">mg/24h</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Tương đương: {((tdmInput.currentContinuousDailyDoseMg || 2000) / 24).toFixed(1)} mg/h
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Nồng độ ổn định đo được (C_ss) (mg/L):
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
                  className="w-full px-3 py-2 text-sm font-bold font-mono bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-hidden"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">mg/L</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Lấy mẫu sau ≥ 24–48h truyền liên tục (Đích: 20 – 25 mg/L).
              </p>
            </div>
          </div>
        </div>
      ) : intermittentMethod === 'bayesian_single' ? (
        /* Bayesian 1-Sample Intermittent Input */
        <div className="space-y-3">
          {/* Regimen Info Row */}
          <div className="grid grid-cols-3 gap-2.5 p-3 bg-slate-50/70 rounded-xl border border-slate-200/70 text-xs">
            <div>
              <label className="block font-medium text-slate-600 mb-1">Liều đang dùng (mg):</label>
              <input
                type="number"
                step="50"
                value={tdmInput.currentDoseMg || ''}
                onChange={(e) => onChange({ currentDoseMg: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 text-xs font-mono font-semibold bg-white border border-slate-200 rounded-lg outline-hidden"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-600 mb-1">Khoảng cách liều (giờ):</label>
              <select
                value={tdmInput.currentIntervalHours}
                onChange={(e) => onChange({ currentIntervalHours: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg outline-hidden cursor-pointer"
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
              <label className="block font-medium text-slate-600 mb-1">Thời gian truyền (giờ):</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="6"
                value={tdmInput.infusionDurationHours || ''}
                onChange={(e) => onChange({ infusionDurationHours: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 text-xs font-mono font-semibold bg-white border border-slate-200 rounded-lg outline-hidden"
              />
            </div>
          </div>

          {/* Bayesian Single Sample Form */}
          <div className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-teal-200/60">
              <div className="flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-teal-700" />
                <span className="text-xs font-bold text-teal-900">
                  Thông tin mẫu nồng độ duy nhất (Bayesian Sampling)
                </span>
              </div>
              <span className="text-[11px] text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded-md font-medium">
                Trong 24–48 giờ đầu khởi trị
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              {/* Concentration Input */}
              <div className="sm:col-span-4">
                <label className="block text-xs font-bold text-teal-950 mb-1">
                  Nồng độ đo được (C_meas):
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
                    className="w-full px-3 py-2 text-base font-bold font-mono bg-white border border-teal-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-hidden"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">mg/L</span>
                </div>
              </div>

              {/* Sample Type Selection */}
              <div className="sm:col-span-4">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Loại mẫu nồng độ:
                </label>
                <div className="grid grid-cols-2 gap-1 bg-white p-1 rounded-xl border border-teal-200">
                  <button
                    type="button"
                    onClick={() => onChange({ singleSampleType: 'trough' })}
                    className={`py-1.5 px-2 text-xs font-medium rounded-lg text-center transition-all cursor-pointer ${
                      (tdmInput.singleSampleType || 'trough') === 'trough'
                        ? 'bg-teal-700 text-white font-bold shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Nồng độ đáy (C_trough)
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange({ singleSampleType: 'random' })}
                    className={`py-1.5 px-2 text-xs font-medium rounded-lg text-center transition-all cursor-pointer ${
                      tdmInput.singleSampleType === 'random'
                        ? 'bg-teal-700 text-white font-bold shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Mẫu bất kỳ / Ngẫu nhiên
                  </button>
                </div>
              </div>

              {/* Timing */}
              <div className="sm:col-span-4">
                {tdmInput.singleSampleType === 'random' ? (
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Thời điểm lấy mẫu:
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.5"
                        min="1"
                        max="72"
                        value={tdmInput.singleSampleHoursAfterDose || 18}
                        onChange={(e) => onChange({ singleSampleHoursAfterDose: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 text-xs font-mono font-bold bg-white border border-teal-200 rounded-lg outline-hidden"
                      />
                      <span className="absolute right-2.5 top-2 text-[11px] text-slate-400">giờ sau liều</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Thời điểm lấy mẫu đáy:
                    </label>
                    <div className="p-1.5 bg-white border border-teal-200 rounded-lg text-[11px] text-slate-600 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>Trước liều kế ≤ 30 phút (giờ thứ {Math.max(0, (tdmInput.currentIntervalHours || 12) - 0.5)})</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Dose timing / treatment phase */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-teal-200/50 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-700">Mẫu thuộc cữ liều:</span>
                <select
                  value={tdmInput.singleDoseNumber || 2}
                  onChange={(e) => onChange({ singleDoseNumber: Number(e.target.value) })}
                  className="px-2 py-1 bg-white border border-teal-200 rounded-md font-medium text-xs text-slate-800 cursor-pointer"
                >
                  <option value="1">Liều 1 (khởi đầu / sau nạp)</option>
                  <option value="2">Liều 2 (trong 24h đầu - chuẩn ASHP 2020)</option>
                  <option value="3">Liều 3 (khoảng 24–36h)</option>
                  <option value="4">Liều 4+ / Trạng thái ổn định (sau 48h)</option>
                </select>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-teal-800">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>ASHP 2020: Mô hình Bayesian cho phép ngoại suy AUC24 ngay từ 24h đầu, không cần đợi đạt cân bằng!</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 2-Point Intermittent Input */
        <div className="space-y-3">
          {/* Regimen Info Row */}
          <div className="grid grid-cols-3 gap-2.5 p-3 bg-slate-50/70 rounded-xl border border-slate-200/70 text-xs">
            <div>
              <label className="block font-medium text-slate-600 mb-1">Liều đang dùng (mg):</label>
              <input
                type="number"
                step="50"
                value={tdmInput.currentDoseMg || ''}
                onChange={(e) => onChange({ currentDoseMg: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 text-xs font-mono font-semibold bg-white border border-slate-200 rounded-lg outline-hidden"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-600 mb-1">Khoảng cách liều (giờ):</label>
              <select
                value={tdmInput.currentIntervalHours}
                onChange={(e) => onChange({ currentIntervalHours: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg outline-hidden cursor-pointer"
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
              <label className="block font-medium text-slate-600 mb-1">Thời gian truyền (giờ):</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="6"
                value={tdmInput.infusionDurationHours || ''}
                onChange={(e) => onChange({ infusionDurationHours: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 text-xs font-mono font-semibold bg-white border border-slate-200 rounded-lg outline-hidden"
              />
            </div>
          </div>

          {/* 2 Concentrations Samples Grid with Timing Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Peak Sample */}
            <div className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4 text-teal-700" />
                  Nồng độ Đỉnh (C_peak)
                </label>
                <span className="text-[11px] text-teal-700 bg-teal-100/70 px-1.5 py-0.5 rounded font-medium">
                  Sau phân bố
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={tdmInput.peakConcentration || ''}
                  onChange={(e) => onChange({ peakConcentration: Number(e.target.value) })}
                  placeholder="VD: 28.5"
                  className="w-full px-3 py-2 text-base font-bold font-mono bg-white border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-hidden"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">mg/L</span>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Thời điểm rút máu đỉnh (sau khi hết truyền):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.25"
                    min="0.5"
                    max="6.0"
                    value={tdmInput.peakTimeAfterEndHours ?? 1.0}
                    onChange={(e) => onChange({ peakTimeAfterEndHours: Number(e.target.value) })}
                    className="w-full px-2.5 py-1 text-xs font-mono bg-white border border-teal-200 rounded-lg outline-hidden"
                  />
                  <span className="absolute right-2.5 top-1 text-[11px] text-slate-400">giờ sau truyền</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">Khuyến cáo: 1.0 – 2.0 giờ sau khi ngưng truyền</span>
              </div>
            </div>

            {/* Trough Sample */}
            <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-700" />
                  Nồng độ Đáy (C_trough)
                </label>
                <span className="text-[11px] text-indigo-700 bg-indigo-100/70 px-1.5 py-0.5 rounded font-medium">
                  Cuối khoảng liều
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={tdmInput.troughConcentration || ''}
                  onChange={(e) => onChange({ troughConcentration: Number(e.target.value) })}
                  placeholder="VD: 11.5"
                  className="w-full px-3 py-2 text-base font-bold font-mono bg-white border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">mg/L</span>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Thời điểm rút máu đáy (trước cữ liều tiếp theo):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    max="4.0"
                    value={tdmInput.troughTimeBeforeNextHours ?? 0.5}
                    onChange={(e) => onChange({ troughTimeBeforeNextHours: Number(e.target.value) })}
                    className="w-full px-2.5 py-1 text-xs font-mono bg-white border border-indigo-200 rounded-lg outline-hidden"
                  />
                  <span className="absolute right-2.5 top-1 text-[11px] text-slate-400">giờ trước liều kế</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">Khuyến cáo: Trong vòng 30 phút trước cữ liều kế (≤ 0.5h)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ClinCalc / ASHP Timing Validation Warning Banner */}
      {tdmResult.timingValidation && (tdmResult.timingValidation.warnings.length > 0 || tdmResult.timingValidation.errors.length > 0) && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-amber-950">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            Cảnh báo phân tích thời điểm lấy mẫu (ClinCalc & ASHP 2020 Timing Analysis):
          </div>
          {tdmResult.timingValidation.errors.map((err, i) => (
            <div key={`err-${i}`} className="text-rose-700 font-semibold">• {err}</div>
          ))}
          {tdmResult.timingValidation.warnings.map((warn, i) => (
            <div key={`warn-${i}`} className="text-amber-800">• {warn}</div>
          ))}
        </div>
      )}

      {/* Evaluation Results Banner */}
      {tdmResult.auc24 > 0 ? (
        <div className={`p-4 rounded-xl border ${statusStyle.bg} transition-all space-y-3.5`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200/50">
            <div className="flex items-center gap-2">
              <Target className={`w-5 h-5 ${statusStyle.text}`} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-600">
                    Giá trị AUC24 ước tính:
                  </span>
                  {tdmResult.estimationMethod === 'bayesian_single' && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-teal-100 text-teal-800 border border-teal-200">
                      MAP Bayesian (1 mẫu)
                    </span>
                  )}
                  {tdmResult.estimationMethod === 'two_point' && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
                      Mô hình Sawchuk-Zaske (2 điểm PK)
                    </span>
                  )}
                  {tdmResult.estimationMethod === 'continuous' && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Truyền liên tục (Css × 24)
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black font-mono tracking-tight text-slate-900">
                    {tdmResult.auc24}
                  </span>
                  <span className="text-sm font-semibold text-slate-600">mg·h/L</span>
                  
                  <span className="text-xs font-semibold text-slate-500 ml-1">
                    (AUC24/MIC = <strong className="font-mono text-slate-800 font-bold">{Math.round(tdmResult.auc24 / mic)}</strong>)
                  </span>
                </div>
              </div>
            </div>

            <div className="sm:text-right">
              <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${statusStyle.badge}`}>
                {statusStyle.label}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                Khoảng đích an toàn & hiệu quả: <strong>400 – 600 mg·h/L</strong>
              </p>
            </div>
          </div>

          {/* PK Parameters */}
          <div className="py-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs border-b border-slate-200/50">
            {tdmResult.clEstimated && (
              <div>
                <span className="text-slate-500 block">Độ thanh thải CL:</span>
                <strong className="font-mono text-slate-800">
                  {tdmResult.clEstimated} L/h
                  {tdmResult.popCl && (
                    <span className="text-[10px] text-slate-400 font-normal ml-1">
                      (pop: {tdmResult.popCl})
                    </span>
                  )}
                </strong>
              </div>
            )}
            {tdmResult.vdEstimated && (
              <div>
                <span className="text-slate-500 block">Thể tích phân bố Vd:</span>
                <strong className="font-mono text-slate-800">
                  {tdmResult.vdEstimated} L
                  {tdmResult.popVd && (
                    <span className="text-[10px] text-slate-400 font-normal ml-1">
                      (pop: {tdmResult.popVd})
                    </span>
                  )}
                </strong>
              </div>
            )}
            {tdmResult.halfLifeHours && (
              <div>
                <span className="text-slate-500 block">Thời gian bán thải t½:</span>
                <strong className="font-mono text-slate-800">{tdmResult.halfLifeHours} giờ</strong>
              </div>
            )}
            {tdmResult.kel && (
              <div>
                <span className="text-slate-500 block">Tốc độ thải trừ k_el:</span>
                <strong className="font-mono text-slate-800">{tdmResult.kel} h⁻¹</strong>
              </div>
            )}
            {tdmResult.cMaxEstimated && (
              <div>
                <span className="text-slate-500 block">C_max dự kiến (ss):</span>
                <strong className="font-mono text-slate-800">{tdmResult.cMaxEstimated} mg/L</strong>
              </div>
            )}
            {tdmResult.cMinEstimated && (
              <div>
                <span className="text-slate-500 block">C_min (đáy) dự kiến:</span>
                <strong className={`font-mono ${tdmResult.cMinEstimated >= 20 ? 'text-rose-600 font-bold' : 'text-slate-800'}`}>
                  {tdmResult.cMinEstimated} mg/L
                </strong>
              </div>
            )}
          </div>

          {/* High Toxicity Alert Box / Hold Dose (When Trough >= 20 or AUC > 600) */}
          {(tdmResult.isHighTroughRisk || (tdmResult.holdDoseHours && tdmResult.holdDoseHours > 0)) && (
            <div className="p-3.5 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-rose-900">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>CẢNH BÁO NGUY CƠ ĐỘC TÍNH THẬN (AKI) CAO: NỒNG ĐỘ VƯỢT NGƯỠNG AN TOÀN!</span>
              </div>
              <p className="text-xs text-rose-800 leading-relaxed">
                Nồng độ đáy đo được <strong>≥ 20 mg/L</strong> hoặc AUC24 <strong>&gt; 600 mg·h/L</strong>. Theo ASHP 2020, nguy cơ tổn thương thận cấp tăng gấp 3–4 lần.
              </p>
              {tdmResult.holdDoseHours && tdmResult.holdDoseHours > 0 && (
                <div className="p-2.5 bg-white/80 rounded-lg border border-rose-200 flex items-center gap-2 text-xs">
                  <Clock className="w-4 h-4 text-rose-600 shrink-0" />
                  <div>
                    <span className="font-bold text-rose-950">Khuyến cáo Tạm ngừng liều (Hold Dose): </span>
                    <span className="font-semibold text-rose-900">
                      Tạm ngưng trong khoảng <strong className="text-rose-600 font-mono text-sm underline">{tdmResult.holdDoseHours} giờ</strong> để nồng độ hạ về khoảng an toàn (~12–15 mg/L) trước khi dùng liều tiếp theo.
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actionable Clinical Recommendation Narrative */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-teal-600" /> Khuyến cáo hiệu chỉnh liều tiếp theo:
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {tdmResult.adjustedDoseRecommendation}
            </p>
          </div>

          {/* Candidate Regimens Grid Matrix (When available) */}
          {tdmResult.adjustedRegimens && tdmResult.adjustedRegimens.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                  Bảng các phương án phác đồ hiệu chỉnh khả thi (Candidate Regimens):
                </span>
                <span className="text-[10px] text-slate-500">Mục tiêu: AUC 400–600 mg·h/L, Đáy &lt; 20 mg/L</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[11px] text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Phác đồ (Liều x Khoảng cách)</th>
                      <th className="py-2 px-2.5">Tổng 24h</th>
                      <th className="py-2 px-2.5">Peak (C_max)</th>
                      <th className="py-2 px-2.5">Trough (C_trough)</th>
                      <th className="py-2 px-2.5">AUC24 dự kiến</th>
                      <th className="py-2 px-2.5">Đánh giá</th>
                      <th className="py-2 px-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tdmResult.adjustedRegimens.map((opt: any, idx) => {
                      const isRec = opt.isPreferred ?? opt.isRecommended;
                      const peakVal = opt.cPeak ?? opt.predictedPeak;
                      const troughVal = opt.cTrough ?? opt.predictedTrough;
                      const aucVal = opt.auc24 ?? opt.predictedAuc24;
                      const isHighTrough = (troughVal && troughVal >= 20) || opt.isHighTroughRisk;
                      const label = opt.regimenLabel || `${opt.doseMg} mg mỗi ${opt.intervalHours}h (q${opt.intervalHours}h)`;
                      const isTarget = opt.isWithinGoal || (aucVal >= 400 && aucVal <= 600);
                      const isSub = aucVal < 400;
                      return (
                        <tr 
                          key={`regimen-${idx}`} 
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isRec ? 'bg-emerald-50/60 font-semibold' : ''
                          }`}
                        >
                          <td className="py-2 px-3 font-mono">
                            <div className="flex items-center gap-1.5">
                              {isRec && (
                                <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                              )}
                              <span>{label}</span>
                              {isRec && (
                                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-300">
                                  Tối ưu
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-2 px-2.5 font-mono text-slate-600">{opt.dailyDoseMg} mg</td>
                          <td className="py-2 px-2.5 font-mono text-slate-700">{peakVal} mg/L</td>
                          <td className={`py-2 px-2.5 font-mono ${isHighTrough ? 'text-rose-600 font-bold' : 'text-slate-700'}`}>
                            {troughVal} mg/L
                          </td>
                          <td className="py-2 px-2.5 font-mono font-bold text-slate-900">
                            {aucVal} <span className="text-[10px] font-normal text-slate-500">mg·h/L</span>
                          </td>
                          <td className="py-2 px-2.5">
                            {isTarget ? (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                                Đạt đích
                              </span>
                            ) : isSub ? (
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-100/70 px-1.5 py-0.5 rounded">
                                Dưới đích
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-rose-700 bg-rose-100/70 px-1.5 py-0.5 rounded">
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
                                  ? 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-2xs' 
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

          {/* Quick Apply Primary Button (when not using table) */}
          {(!tdmResult.adjustedRegimens || tdmResult.adjustedRegimens.length === 0) && tdmResult.suggestedDoseMg && (
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onApplyAdjustment(tdmResult.suggestedDoseMg!, tdmResult.suggestedIntervalHours)}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 rounded-lg transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Áp dụng liều {tdmResult.suggestedDoseMg} mg {tdmResult.suggestedIntervalHours ? `mỗi ${tdmResult.suggestedIntervalHours}h` : ''} vào phác đồ
              </button>
              {tdmResult.predictedAuc24 && (
                <span className="text-[11px] text-slate-500">
                  (Dự đoán AUC24 mới đạt ~<strong>{tdmResult.predictedAuc24}</strong> mg·h/L)
                </span>
              )}
            </div>
          )}

          {/* Next Monitoring Plan Box */}
          {tdmResult.monitoringPlan && (
            <div className="p-3 bg-slate-100/80 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
              <Calendar className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900">Kế hoạch theo dõi TDM tiếp theo: </span>
                <span>{tdmResult.monitoringPlan}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center text-xs text-slate-500">
          Nhập nồng độ đo được để hệ thống Bayesian tự động phân tích dược động học, tính AUC24 và đưa ra khuyến cáo chỉnh liều.
        </div>
      )}

      {/* Toggle Button for Pharmacokinetic Curve Chart */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
        <button
          type="button"
          onClick={() => setShowChart(!showChart)}
          className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-teal-50 transition-all cursor-pointer"
        >
          <ChartIcon className="w-3.5 h-3.5" />
          <span>{showChart ? 'Thu gọn biểu đồ nồng độ (AUC/MIC)' : 'Xem biểu đồ nồng độ theo thời gian (AUC/MIC)'}</span>
          {showChart ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
        </button>

        <span className="text-[10px] text-slate-400">
          Mô hình PK Zero-Order & First-Order SVG
        </span>
      </div>

      {/* Render Pharmacokinetic Curve Chart */}
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
