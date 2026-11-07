/**
 * CDSS Vancomycin TDM Calculator Card
 * Tính năng Giám sát TDM & Hiệu chỉnh liều Vancomycin theo AUC24 chuẩn ASHP/IDSA 2020.
 * Thiết kế đơn giản, dễ hiểu, chuyên nghiệp, chống giật lắc nhập liệu và chống tràn giao diện.
 */

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Target, 
  AlertTriangle, 
  CheckCircle2, 
  LineChart as ChartIcon, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  FlaskConical, 
  Sparkles, 
  ShieldAlert, 
  Calendar,
  Check,
  RotateCcw,
  User,
  Droplet,
  Info
} from 'lucide-react';
import { 
  TdmInput, 
  TdmEvaluationResult, 
  InfusionMethod, 
  ClinCalcDosingRegimen, 
  PatientProfile, 
  RenalCalculations 
} from '../types';
import { VancomycinPkChart } from './VancomycinPkChart';

interface TdmCalculatorCardProps {
  tdmInput: TdmInput;
  tdmResult: TdmEvaluationResult;
  regimenMethod: InfusionMethod;
  patient?: PatientProfile;
  renal?: RenalCalculations;
  mic?: number;
  onChange: (updated: Partial<TdmInput>) => void;
  onMethodChange?: (method: InfusionMethod) => void;
  onApplyAdjustment: (newDose: number, newInterval?: number) => void;
}

export const TdmCalculatorCard: React.FC<TdmCalculatorCardProps> = ({
  tdmInput,
  tdmResult,
  regimenMethod,
  patient,
  renal,
  mic = 1.0,
  onChange,
  onMethodChange,
  onApplyAdjustment
}) => {
  const isContinuous = regimenMethod === 'continuous';
  const [showChart, setShowChart] = useState(false);
  const intermittentMethod = tdmInput.intermittentMethod || 'bayesian_single';

  // Smooth string buffers for numeric inputs to eliminate "0" jumping and backspace bugs
  const [rawDose, setRawDose] = useState<string>(String(tdmInput.currentDoseMg ?? 1000));
  const [rawInterval, setRawInterval] = useState<string>(String(tdmInput.currentIntervalHours ?? 12));
  const [rawDuration, setRawDuration] = useState<string>(String(tdmInput.infusionDurationHours ?? 1.5));
  const [rawSingleConc, setRawSingleConc] = useState<string>(
    tdmInput.singleConcentration !== undefined && tdmInput.singleConcentration !== null 
      ? String(tdmInput.singleConcentration) 
      : ''
  );
  const [rawPeakConc, setRawPeakConc] = useState<string>(
    tdmInput.peakConcentration !== undefined && tdmInput.peakConcentration !== null 
      ? String(tdmInput.peakConcentration) 
      : ''
  );
  const [rawTroughConc, setRawTroughConc] = useState<string>(
    tdmInput.troughConcentration !== undefined && tdmInput.troughConcentration !== null 
      ? String(tdmInput.troughConcentration) 
      : ''
  );
  const [rawContDailyDose, setRawContDailyDose] = useState<string>(
    String(tdmInput.currentContinuousDailyDoseMg ?? 2000)
  );
  const [rawCss, setRawCss] = useState<string>(
    tdmInput.steadyStateConcentration !== undefined && tdmInput.steadyStateConcentration !== null 
      ? String(tdmInput.steadyStateConcentration) 
      : ''
  );

  // Sync buffers if external load or reset occurs
  useEffect(() => {
    setRawDose(String(tdmInput.currentDoseMg ?? 1000));
    setRawInterval(String(tdmInput.currentIntervalHours ?? 12));
    setRawDuration(String(tdmInput.infusionDurationHours ?? 1.5));
    setRawSingleConc(
      tdmInput.singleConcentration !== undefined && tdmInput.singleConcentration !== null 
        ? String(tdmInput.singleConcentration) 
        : ''
    );
    setRawPeakConc(
      tdmInput.peakConcentration !== undefined && tdmInput.peakConcentration !== null 
        ? String(tdmInput.peakConcentration) 
        : ''
    );
    setRawTroughConc(
      tdmInput.troughConcentration !== undefined && tdmInput.troughConcentration !== null 
        ? String(tdmInput.troughConcentration) 
        : ''
    );
    setRawContDailyDose(String(tdmInput.currentContinuousDailyDoseMg ?? 2000));
    setRawCss(
      tdmInput.steadyStateConcentration !== undefined && tdmInput.steadyStateConcentration !== null 
        ? String(tdmInput.steadyStateConcentration) 
        : ''
    );
  }, [
    tdmInput.currentDoseMg,
    tdmInput.currentIntervalHours,
    tdmInput.infusionDurationHours,
    tdmInput.singleConcentration,
    tdmInput.peakConcentration,
    tdmInput.troughConcentration,
    tdmInput.currentContinuousDailyDoseMg,
    tdmInput.steadyStateConcentration
  ]);

  // Mode switcher handler
  const handleSelectMode = (mode: 'bayesian_single' | 'two_point' | 'continuous') => {
    if (mode === 'continuous') {
      onMethodChange?.('continuous');
      onChange({
        regimenType: 'continuous',
        currentContinuousDailyDoseMg: tdmInput.currentContinuousDailyDoseMg || 2000
      });
    } else {
      onMethodChange?.('intermittent');
      onChange({
        regimenType: 'intermittent',
        intermittentMethod: mode
      });
    }
  };

  // Sample presets for quick clinical scenarios
  const loadPreset = (type: 'optimal' | 'low' | 'toxic' | 'clear') => {
    if (type === 'clear') {
      setRawSingleConc('');
      setRawPeakConc('');
      setRawTroughConc('');
      setRawCss('');
      onChange({
        singleConcentration: undefined,
        troughConcentration: undefined,
        peakConcentration: undefined,
        steadyStateConcentration: undefined
      });
      return;
    }

    if (isContinuous) {
      if (type === 'optimal') {
        setRawContDailyDose('2000');
        setRawCss('22.0');
        onChange({ 
          currentContinuousDailyDoseMg: 2000,
          steadyStateConcentration: 22.0 
        });
      } else if (type === 'low') {
        setRawContDailyDose('1500');
        setRawCss('14.0');
        onChange({ 
          currentContinuousDailyDoseMg: 1500,
          steadyStateConcentration: 14.0 
        });
      } else {
        setRawContDailyDose('2500');
        setRawCss('32.0');
        onChange({ 
          currentContinuousDailyDoseMg: 2500,
          steadyStateConcentration: 32.0 
        });
      }
    } else if (intermittentMethod === 'bayesian_single') {
      if (type === 'optimal') {
        setRawDose('1000');
        setRawInterval('12');
        setRawDuration('1.5');
        setRawSingleConc('11.5');
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
        setRawDose('1000');
        setRawInterval('12');
        setRawDuration('1.5');
        setRawSingleConc('6.0');
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
        setRawDose('1250');
        setRawInterval('12');
        setRawDuration('2.0');
        setRawSingleConc('22.5');
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
        setRawDose('1000');
        setRawInterval('12');
        setRawDuration('1.5');
        setRawPeakConc('28.5');
        setRawTroughConc('11.5');
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
        setRawDose('1000');
        setRawInterval('12');
        setRawDuration('1.5');
        setRawPeakConc('18.0');
        setRawTroughConc('6.0');
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
        setRawDose('1250');
        setRawInterval('12');
        setRawDuration('2.0');
        setRawPeakConc('42.0');
        setRawTroughConc('23.0');
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

  const getAttainmentColor = (att: string, hasToxicWarning: boolean) => {
    if (hasToxicWarning || att === 'supratherapeutic') {
      return {
        bg: 'bg-rose-50 border-rose-300 text-rose-950',
        badge: 'bg-rose-600 text-white',
        text: 'text-rose-700',
        label: 'VƯỢT NGƯỠNG AN TOÀN (AUC > 600 mg·h/L hoặc Đáy ≥ 20)',
        actionDesc: 'Nguy cơ độc tính thận (AKI) tăng cao! Cần tạm ngừng liều và giảm phác đồ điều trị.'
      };
    }
    if (att === 'target') {
      return {
        bg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
        badge: 'bg-emerald-600 text-white',
        text: 'text-emerald-700',
        label: 'ĐẠT ĐÍCH ĐIỀU TRỊ (AUC 400 - 600 mg·h/L)',
        actionDesc: 'Nồng độ vancomycin tối ưu về hiệu quả diệt khuẩn và an toàn thận. Tiếp tục duy trì phác đồ.'
      };
    }
    return {
      bg: 'bg-amber-50 border-amber-300 text-amber-950',
      badge: 'bg-amber-500 text-white',
      text: 'text-amber-700',
      label: 'DƯỚI MỤC TIÊU (AUC < 400 mg·h/L)',
      actionDesc: 'Nguy cơ thất bại điều trị hoặc chọn lọc chủng vi khuẩn kháng thuốc. Cần tăng liều.'
    };
  };

  const hasToxicity = Boolean(
    tdmResult.isHighTroughRisk || 
    (tdmResult.holdDoseHours && tdmResult.holdDoseHours > 0) ||
    (tdmResult.cMinEstimated && tdmResult.cMinEstimated >= 20) ||
    (tdmResult.auc24 > 600)
  );

  const statusStyle = getAttainmentColor(tdmResult.targetAttainment, hasToxicity);

  // Preferred regimen resolution
  const preferredRegimen = tdmResult.preferredAdjustedRegimen || 
    tdmResult.adjustedRegimens?.find((r: ClinCalcDosingRegimen) => r.isPreferred) ||
    (tdmResult.adjustedRegimens && tdmResult.adjustedRegimens.length > 0 ? tdmResult.adjustedRegimens[0] : undefined);

  const hasResults = tdmResult.auc24 > 0;

  return (
    <div id="tdm-calculator-card" className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-4">
      {/* Header: Title & Clinical Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-100 shadow-2xs">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                Hiệu Chỉnh Liều Vancomycin Dựa Trên Nồng Độ (TDM)
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                ASHP/IDSA 2020
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Đích điều trị tối ưu: AUC24 / MIC = <strong className="text-slate-700">400 – 600 mg·h/L</strong> (giảm tối đa nguy cơ suy thận cấp AKI)
            </p>
          </div>
        </div>

        {/* 3-Mode Selector Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold border border-slate-200/80 self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => handleSelectMode('bayesian_single')}
            className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap text-xs ${
              !isContinuous && intermittentMethod === 'bayesian_single'
                ? 'bg-white text-teal-950 shadow-xs font-extrabold ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bayesian 1 Mẫu (Chuẩn)
          </button>
          <button
            type="button"
            onClick={() => handleSelectMode('two_point')}
            className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap text-xs ${
              !isContinuous && intermittentMethod === 'two_point'
                ? 'bg-white text-indigo-950 shadow-xs font-extrabold ring-1 ring-indigo-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2 Mẫu (Đỉnh - Đáy)
          </button>
          <button
            type="button"
            onClick={() => handleSelectMode('continuous')}
            className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap text-xs ${
              isContinuous
                ? 'bg-white text-teal-950 shadow-xs font-extrabold ring-1 ring-teal-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Truyền Liên Tục (CIV)
          </button>
        </div>
      </div>

      {/* Patient Clinical Context Ribbon */}
      {patient && (
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <User className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="font-bold text-slate-900">{patient.name || patient.id}</span>
            <span className="text-slate-400">•</span>
            <span>{patient.age} tuổi ({patient.gender === 'male' ? 'Nam' : 'Nữ'})</span>
            <span className="text-slate-400">•</span>
            <span>{patient.weight} kg</span>
            {renal && (
              <>
                <span className="text-slate-400">•</span>
                <span>CrCl: <strong className="text-indigo-900">{renal.crcl}</strong> mL/phút</span>
                <span className="text-slate-400">•</span>
                <span>SCr: <strong>{patient.scrValue}</strong> {patient.scrUnit === 'umol_L' ? 'µmol/L' : 'mg/dL'}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500 font-semibold">MIC:</span>
            <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-mono font-bold text-slate-800 text-[11px]">
              {mic} mg/L
            </span>
          </div>
        </div>
      )}

      {/* Quick Clinical Scenario Presets */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-indigo-50/40 rounded-xl border border-indigo-100 text-xs">
        <span className="text-[11px] font-bold text-indigo-950 flex items-center gap-1.5">
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
          <button
            type="button"
            onClick={() => loadPreset('clear')}
            className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg font-medium text-[11px] transition-all cursor-pointer flex items-center gap-1"
            title="Xóa trắng để tự nhập"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Xóa</span>
          </button>
        </div>
      </div>

      {/* BƯỚC 1: NHẬP THÔNG TIN PHÁC ĐỒ & NỒNG ĐỘ ĐO ĐƯỢC */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5 uppercase tracking-wide">
            <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">1</span>
            <span>Thông tin phác đồ &amp; Nồng độ xét nghiệm</span>
          </span>
          <span className="text-slate-400 font-normal">ASHP/IDSA 2020 Standard</span>
        </div>

        {isContinuous ? (
          /* TRUYỀN LIÊN TỤC (CIV) */
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
                    value={rawContDailyDose}
                    onChange={(e) => {
                      const val = e.target.value;
                      setRawContDailyDose(val);
                      const num = Number(val);
                      if (!isNaN(num) && num > 0) {
                        onChange({ 
                          currentContinuousDailyDoseMg: num,
                          continuousDailyDoseMg: num,
                          continuousRateMgPerHour: Math.round(num / 24)
                        });
                      }
                    }}
                    placeholder="2000"
                    className="w-full h-9 px-3 text-xs font-bold font-mono bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold">mg/24h</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Tốc độ truyền: <strong>{(Number(rawContDailyDose || 2000) / 24).toFixed(1)} mg/giờ</strong>
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
                    value={rawCss}
                    onChange={(e) => {
                      const val = e.target.value;
                      setRawCss(val);
                      if (val === '') {
                        onChange({ steadyStateConcentration: undefined });
                      } else {
                        const num = Number(val);
                        if (!isNaN(num) && num >= 0) {
                          onChange({ steadyStateConcentration: num });
                        }
                      }
                    }}
                    placeholder="VD: 22.5"
                    className="w-full h-9 px-3 text-xs font-bold font-mono bg-white border border-teal-400 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold">mg/L</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Lấy mẫu sau ≥ 24h truyền liên tục (Khoảng đích tối ưu: <strong className="text-teal-700">20 – 25 mg/L</strong>).
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* TRUYỀN NGẮT QUÃNG (Bayesian 1 mẫu hoặc 2 mẫu) */
          <div className="space-y-3">
            {/* Phác đồ hiện tại */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200/90 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Liều đang dùng:</label>
                <div className="relative">
                  <input
                    type="number"
                    step="50"
                    value={rawDose}
                    onChange={(e) => {
                      const val = e.target.value;
                      setRawDose(val);
                      const num = Number(val);
                      if (!isNaN(num) && num > 0) {
                        onChange({ currentDoseMg: num });
                      }
                    }}
                    placeholder="1000"
                    className="w-full h-9 px-3 pr-8 text-xs font-mono font-bold bg-white border border-slate-300 rounded-lg outline-none focus:border-teal-600 shadow-2xs"
                  />
                  <span className="absolute right-2.5 top-2.5 text-[10px] font-bold text-slate-400">mg</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Khoảng cách liều:</label>
                <select
                  value={rawInterval}
                  onChange={(e) => {
                    const val = e.target.value;
                    setRawInterval(val);
                    onChange({ currentIntervalHours: Number(val) });
                  }}
                  className="w-full h-9 px-2.5 text-xs font-bold bg-white border border-slate-300 rounded-lg outline-none cursor-pointer focus:border-teal-600 shadow-2xs"
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
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Thời gian truyền:</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="6"
                    value={rawDuration}
                    onChange={(e) => {
                      const val = e.target.value;
                      setRawDuration(val);
                      const num = Number(val);
                      if (!isNaN(num) && num > 0) {
                        onChange({ infusionDurationHours: num });
                      }
                    }}
                    placeholder="1.5"
                    className="w-full h-9 px-3 pr-9 text-xs font-mono font-bold bg-white border border-slate-300 rounded-lg outline-none focus:border-teal-600 shadow-2xs"
                  />
                  <span className="absolute right-2.5 top-2.5 text-[10px] font-bold text-slate-400">giờ</span>
                </div>
              </div>
            </div>

            {/* Khung nhập nồng độ đo được (Bayesian 1 Mẫu) */}
            {intermittentMethod === 'bayesian_single' ? (
              <div className="p-3.5 rounded-2xl border border-teal-200 bg-teal-50/40 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-teal-200/60">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs shadow-2xs font-bold shrink-0">
                      <FlaskConical className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-teal-950">
                      Định lượng TDM Mẫu Đáy (Bayesian Single-Sample)
                    </span>
                  </div>
                  <span className="text-[10px] text-teal-800 bg-teal-100 px-2 py-0.5 rounded font-bold self-start sm:self-auto">
                    Khuyến nghị: Rút máu trước cữ ≤ 30 phút (C_trough)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
                  {/* Ô nhập nồng độ */}
                  <div>
                    <label className="block text-[11px] font-bold text-teal-950 mb-1">
                      Nồng độ đáy đo được (C_trough):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0.5"
                        max="100"
                        value={rawSingleConc}
                        onChange={(e) => {
                          const val = e.target.value;
                          setRawSingleConc(val);
                          if (val === '') {
                            onChange({
                              singleConcentration: undefined,
                              troughConcentration: undefined
                            });
                          } else {
                            const num = Number(val);
                            if (!isNaN(num) && num >= 0) {
                              onChange({
                                singleConcentration: num,
                                troughConcentration: num
                              });
                            }
                          }
                        }}
                        placeholder="VD: 11.5"
                        className="w-full h-10 px-3 pr-12 text-base font-black font-mono bg-white border border-teal-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none shadow-2xs"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">mg/L</span>
                    </div>
                    <span className="text-[10px] text-teal-800 mt-1 font-semibold block">
                      Khoảng đích an toàn: 10 – 15 mg/L
                    </span>
                  </div>

                  {/* Thời điểm lấy mẫu */}
                  <div>
                    <label className="block text-[11px] font-bold text-teal-950 mb-1">
                      Thời điểm rút máu đáy:
                    </label>
                    <div className="relative">
                      <select
                        value={tdmInput.troughTimeBeforeNextHours ?? 0.5}
                        onChange={(e) => onChange({ troughTimeBeforeNextHours: Number(e.target.value) })}
                        className="w-full h-10 pl-8 pr-7 bg-white border border-teal-300 rounded-xl font-bold text-xs text-slate-800 cursor-pointer outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 appearance-none shadow-2xs"
                      >
                        <option value="0.5">Trước cữ kế ≤ 30 phút (Chuẩn)</option>
                        <option value="1">Trước cữ kế 1.0 giờ</option>
                        <option value="1.5">Trước cữ kế 1.5 giờ</option>
                        <option value="2">Trước cữ kế 2.0 giờ</option>
                      </select>
                      <Clock className="w-4 h-4 text-teal-600 absolute left-2.5 top-3 pointer-events-none" />
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3.5 pointer-events-none" />
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 font-medium block truncate">
                      Giờ thứ <strong className="text-slate-800 font-mono">{(Math.max(0, Number(rawInterval || 12) - (tdmInput.troughTimeBeforeNextHours ?? 0.5))).toFixed(1)}</strong> của cữ liều
                    </span>
                  </div>

                  {/* Cữ liều lấy mẫu */}
                  <div>
                    <label className="block text-[11px] font-bold text-teal-950 mb-1">
                      Mẫu thuộc cữ liều:
                    </label>
                    <div className="relative">
                      <select
                        value={tdmInput.singleDoseNumber || 2}
                        onChange={(e) => onChange({ singleDoseNumber: Number(e.target.value) })}
                        className="w-full h-10 px-3 pr-7 bg-white border border-teal-300 rounded-xl font-bold text-xs text-slate-800 cursor-pointer outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 appearance-none shadow-2xs"
                      >
                        <option value="1">Cữ 1 (khởi đầu)</option>
                        <option value="2">Cữ 2 (khuyên dùng trong 24h đầu)</option>
                        <option value="3">Cữ 3 (sau 24–36h)</option>
                        <option value="4">Cữ 4+ (đã đạt ổn định)</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3.5 pointer-events-none" />
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 font-medium block">
                      Khuyến cáo ASHP: Lấy trước cữ 2 hoặc 3
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* 2 MẪU (ĐỈNH & ĐÁY) */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Đỉnh */}
                <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-teal-900 flex items-center gap-1">
                      <FlaskConical className="w-3.5 h-3.5 text-teal-700" />
                      <span>Nồng độ Đỉnh (C_peak)</span>
                    </label>
                    <span className="text-[10px] text-teal-700 font-medium">1-2h sau khi hết truyền</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={rawPeakConc}
                      onChange={(e) => {
                        const val = e.target.value;
                        setRawPeakConc(val);
                        if (val === '') {
                          onChange({ peakConcentration: undefined });
                        } else {
                          const num = Number(val);
                          if (!isNaN(num) && num >= 0) {
                            onChange({ peakConcentration: num });
                          }
                        }
                      }}
                      placeholder="VD: 28.5"
                      className="w-full h-9 px-3 text-sm font-bold font-mono bg-white border border-teal-400 rounded-xl outline-none"
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
                    <span className="text-[10px] text-indigo-700 font-medium">≤ 30p trước cữ tiếp theo</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={rawTroughConc}
                      onChange={(e) => {
                        const val = e.target.value;
                        setRawTroughConc(val);
                        if (val === '') {
                          onChange({ troughConcentration: undefined });
                        } else {
                          const num = Number(val);
                          if (!isNaN(num) && num >= 0) {
                            onChange({ troughConcentration: num });
                          }
                        }
                      }}
                      placeholder="VD: 11.5"
                      className="w-full h-9 px-3 text-sm font-bold font-mono bg-white border border-indigo-400 rounded-xl outline-none"
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
      {hasResults ? (
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/90 p-3.5 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-xs text-slate-500 font-semibold block">AUC24 thực tế ước tính:</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-black font-mono text-slate-900">{tdmResult.auc24}</span>
                <span className="text-xs font-bold text-slate-600">mg·h/L</span>
                <span className="text-xs text-slate-500 ml-1">
                  (AUC24/MIC = <strong className="font-mono text-slate-800">{Math.round(tdmResult.auc24 / Math.max(0.1, mic))}</strong>)
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
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  {isContinuous ? 'C_ss đo được' : 'C_trough dự kiến'}
                </span>
                <span className={`font-mono font-bold ${(tdmResult.cMinEstimated || 0) >= 20 ? 'text-rose-600' : 'text-slate-800'}`}>
                  {tdmResult.cMinEstimated || '-'} mg/L
                </span>
              </div>
            </div>
          </div>

          {/* CẢNH BÁO NGUY CƠ ĐỘC THẬN & TẠM NGƯNG LIỀU (HOLD DOSE) */}
          {hasToxicity && (
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
                    {isContinuous 
                      ? `Tốc độ: ${preferredRegimen.doseMg} mg/giờ (Tổng: ${preferredRegimen.dailyDoseMg} mg/24h)`
                      : `${preferredRegimen.doseMg} mg mỗi ${preferredRegimen.intervalHours} giờ (q${preferredRegimen.intervalHours}h)`
                    }
                  </div>
                  <p className="text-xs text-slate-600">
                    Dự kiến AUC24: <strong className="text-slate-900">{preferredRegimen.auc24} mg·h/L</strong> • {isContinuous ? 'Nồng độ Css' : 'Nồng độ đáy'}: <strong className="text-slate-900">{preferredRegimen.cTrough} mg/L</strong>
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
                  <table className="w-full text-left text-xs border-collapse min-w-[560px]">
                    <thead className="bg-slate-50 text-[10px] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Phác đồ ({isContinuous ? 'Tốc độ mg/h' : 'Liều x Cữ'})</th>
                        <th className="py-2.5 px-2.5">Tổng 24h</th>
                        <th className="py-2.5 px-2.5">{isContinuous ? 'C_ss dự kiến' : 'Đáy (C_trough)'}</th>
                        <th className="py-2.5 px-2.5">AUC24 dự kiến</th>
                        <th className="py-2.5 px-2.5">Đánh giá</th>
                        <th className="py-2.5 px-3 text-right">Thao tác</th>
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
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                              <div className="flex items-center gap-1.5">
                                {isRec && <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />}
                                <span>
                                  {isContinuous 
                                    ? `${opt.doseMg} mg/giờ`
                                    : `${opt.doseMg} mg q${opt.intervalHours}h`
                                  }
                                </span>
                                {isRec && (
                                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1 py-0.2 rounded">
                                    Ưu tiên
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-2.5 px-2.5 font-mono text-slate-600">{opt.dailyDoseMg} mg</td>
                            <td className={`py-2.5 px-2.5 font-mono ${isHighTrough ? 'text-rose-600 font-bold' : 'text-slate-700'}`}>
                              {troughVal} mg/L
                            </td>
                            <td className="py-2.5 px-2.5 font-mono font-bold text-slate-900">
                              {aucVal} <span className="text-[10px] font-normal text-slate-400">mg·h/L</span>
                            </td>
                            <td className="py-2.5 px-2.5">
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
                            <td className="py-2.5 px-3 text-right">
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
        /* Empty State */
        <div className="p-5 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 mx-auto flex items-center justify-center">
            <Info className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-slate-700">
            Chưa có nồng độ vancomycin xét nghiệm
          </div>
          <p className="text-[11px] text-slate-500 max-w-md mx-auto">
            Nhập nồng độ đáy C_trough (hoặc C_ss nếu truyền liên tục) ở Bước 1 ở trên, hoặc chọn một <strong>Kịch bản thử nghiệm nhanh</strong> để hệ thống tự động tính toán AUC24 và đề xuất phác đồ hiệu chỉnh.
          </p>
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
