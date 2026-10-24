import React, { useState } from 'react';
import { 
  User, 
  Droplet, 
  Clock, 
  Weight, 
  Ruler, 
  Activity, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Edit3, 
  Maximize2, 
  Minimize2, 
  Flame, 
  AlertTriangle,
  ArrowDown,
  FileText,
  CheckCircle2,
  Gauge
} from 'lucide-react';
import { CalculatedRenalMetrics, DialysisMode, Language, PatientState } from '../types';

interface PatientSidebarProps {
  patient: PatientState;
  onChange: (updated: Partial<PatientState>) => void;
  renal: CalculatedRenalMetrics;
  dialysis: DialysisMode;
  language: Language;
  needsHeight?: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const PatientSidebar: React.FC<PatientSidebarProps> = ({
  patient,
  onChange,
  renal,
  dialysis,
  language,
  needsHeight = false,
  isCollapsed,
  onToggleCollapse
}) => {
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);
  const isEn = language === 'en';

  const handleScrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value.replace(',', '.'));
    onChange({ scr: isNaN(val) ? 0 : val });
  };

  const handleUnitToggle = (newUnit: 'umol' | 'mgdl') => {
    if (newUnit === patient.scrUnit) return;
    if (newUnit === 'mgdl') {
      const converted = Math.round((patient.scr / 88.4) * 100) / 100;
      onChange({ scrUnit: 'mgdl', scr: converted });
    } else {
      const converted = Math.round(patient.scr * 88.4);
      onChange({ scrUnit: 'umol', scr: converted });
    }
  };

  const setPreset = (presetKey: string) => {
    if (presetKey === 'normal') {
      onChange({
        scr: patient.scrUnit === 'umol' ? 85 : 0.96,
        age: 52,
        gender: 'm',
        weight: 62,
        height: 168,
        dialysis: 'none'
      });
    } else if (presetKey === 'moderate') {
      onChange({
        scr: patient.scrUnit === 'umol' ? 165 : 1.87,
        age: 68,
        gender: 'm',
        weight: 58,
        height: 165,
        dialysis: 'none'
      });
    } else if (presetKey === 'hd') {
      onChange({
        scr: patient.scrUnit === 'umol' ? 480 : 5.43,
        age: 60,
        gender: 'f',
        weight: 52,
        height: 155,
        dialysis: 'hd'
      });
    } else if (presetKey === 'arc') {
      onChange({
        scr: patient.scrUnit === 'umol' ? 45 : 0.51,
        age: 28,
        gender: 'm',
        weight: 75,
        height: 175,
        dialysis: 'none'
      });
    } else if (presetKey === 'obese') {
      onChange({
        scr: patient.scrUnit === 'umol' ? 120 : 1.36,
        age: 58,
        gender: 'f',
        weight: 102,
        height: 158,
        dialysis: 'none'
      });
    }
  };

  const getStatusBg = () => {
    if (dialysis !== 'none') return 'bg-purple-600';
    if (renal.isArc) return 'bg-teal-600';
    if (renal.crcl >= 90) return 'bg-emerald-600';
    if (renal.crcl >= 60) return 'bg-blue-600';
    if (renal.crcl >= 30) return 'bg-amber-500';
    if (renal.crcl >= 15) return 'bg-orange-600';
    return 'bg-rose-600';
  };

  const clampedCrcl = Math.min(150, Math.max(0, renal.crcl));
  const pointerPercent = Math.round((clampedCrcl / 150) * 100);

  // ==========================================
  // VIEW 1: COLLAPSED MODE (Clean Mini-Strip)
  // ==========================================
  if (isCollapsed) {
    const isFemale = patient.gender === 'f';
    const genderLabel = isFemale ? (isEn ? 'Female' : 'Nữ') : (isEn ? 'Male' : 'Nam');

    const isNormal = renal.crcl >= 60;
    const isModerate = renal.crcl >= 30 && renal.crcl < 60;

    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all duration-200 flex flex-col">
        {/* Header */}
        <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-100 truncate">
              {isEn ? 'Patient & Renal' : 'Thông Số BN'}
            </span>
          </div>
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isEn ? 'Expand panel' : 'Mở rộng bảng nhập'}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-3 space-y-2.5">
          {/* Vertical Block 1: CrCl Primary Metric Card */}
          <div className={`p-3 rounded-2xl border flex flex-col items-center text-center ${
            isNormal 
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
              : isModerate 
              ? 'bg-amber-50/70 border-amber-200 text-amber-950' 
              : 'bg-rose-50/70 border-rose-200 text-rose-950'
          }`}>
            <span className="text-[10px] font-black uppercase tracking-wider opacity-75">
              CrCl (Cockcroft-Gault)
            </span>
            <div className="text-2xl font-black tracking-tight my-0.5">
              {renal.crcl}
              <span className="text-xs font-bold ml-1 opacity-75">mL/p</span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/80 shadow-2xs border border-current/20">
              {renal.categoryLabelVi}
            </span>
          </div>

          {/* Vertical Block 2: Patient Glance */}
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 text-xs text-slate-700">
            <div className="font-extrabold text-slate-900 truncate">
              {isEn ? 'Clinical Case' : 'Ca lâm sàng'}: {patient.age}t • {genderLabel}
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">{isEn ? 'Age / Sex:' : 'Tuổi / Giới:'}</span>
              <span className="font-bold text-slate-800">{patient.age}t • {genderLabel}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">{isEn ? 'Weight / IBW:' : 'Cân nặng / IBW:'}</span>
              <span className="font-bold text-slate-800">{patient.weight}kg / {renal.ibw}kg</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Scr:</span>
              <span className="font-bold text-slate-800">{patient.scr} {patient.scrUnit === 'umol' ? 'µmol/L' : 'mg/dL'}</span>
            </div>
            {dialysis !== 'none' && (
              <div className="pt-1 border-t border-slate-200 flex items-center justify-between text-[10px] text-purple-800 font-black uppercase">
                <span>Lọc máu:</span>
                <span>{dialysis}</span>
              </div>
            )}
          </div>

          {/* Quick Expand Button */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="w-full py-2 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition-all border border-teal-200 flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-teal-600" />
            <span>{isEn ? 'Edit Values' : 'Chỉnh sửa đầy đủ'}</span>
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: EXPANDED MODE (Full Interactive Medical HUD)
  // ==========================================
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all duration-300">
      
      {/* Top Header with Collapse Action */}
      <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold block leading-tight text-white">
              {isEn ? 'Patient & Renal Demographics' : 'Thông Số Bệnh Nhân & Thận'}
            </h2>
            <p className="text-[10px] text-slate-400">
              {isEn ? 'Cockcroft-Gault & Clinical Metrics' : 'Độ thanh thải CrCl & Cá thể hóa'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleCollapse}
          className="flex items-center space-x-1 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-2.5 py-1.5 rounded-xl transition-colors border border-slate-700 cursor-pointer"
          title={isEn ? 'Collapse to mini strip' : 'Thu gọn bảng nhập'}
        >
          <Minimize2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isEn ? 'Collapse' : 'Thu gọn'}</span>
        </button>
      </div>

      {/* Main Interactive Form Inputs */}
      <div className="p-4 space-y-3.5 text-xs">
        
        {/* Clinical Presets (1-Click) */}
        <div>
          <div className="flex items-center justify-between mb-1.5 text-[11px]">
            <span className="font-extrabold text-slate-700 flex items-center">
              <Sparkles className="w-3 h-3 text-amber-500 mr-1" />
              {isEn ? 'Quick Case Presets:' : 'Ca lâm sàng mẫu nhanh:'}
            </span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 text-[11px]">
            <button
              type="button"
              onClick={() => setPreset('normal')}
              className="px-2 py-1.5 font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors text-center"
            >
              {isEn ? 'Normal' : 'Chuẩn'}
            </button>
            <button
              type="button"
              onClick={() => setPreset('moderate')}
              className="px-2 py-1.5 font-bold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 transition-colors text-center"
            >
              {isEn ? 'Moderate' : 'Suy vừa'}
            </button>
            <button
              type="button"
              onClick={() => setPreset('hd')}
              className="px-2 py-1.5 font-bold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200/80 transition-colors text-center"
            >
              {isEn ? 'HD' : 'Lọc HD'}
            </button>
            <button
              type="button"
              onClick={() => setPreset('arc')}
              className="px-2 py-1.5 font-bold rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200/80 transition-colors text-center"
            >
              {isEn ? 'ARC' : 'ARC >130'}
            </button>
            <button
              type="button"
              onClick={() => setPreset('obese')}
              className="px-2 py-1.5 font-bold rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200/80 transition-colors text-center col-span-2 sm:col-span-1"
            >
              {isEn ? 'Obese' : 'Béo phì'}
            </button>
          </div>
        </div>

        {/* Serum Creatinine (Primary Biomarker) */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-extrabold text-slate-800 flex items-center">
              <Droplet className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
              <span>{isEn ? 'Serum Creatinine (Scr):' : 'Creatinine huyết thanh (Scr):'}</span>
            </label>
            <div className="flex items-center bg-white border border-slate-300 rounded-lg p-0.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleUnitToggle('umol')}
                className={`px-2 py-0.5 rounded-md transition-colors ${
                  patient.scrUnit === 'umol' ? 'bg-teal-600 text-white shadow-2xs' : 'text-slate-600'
                }`}
              >
                µmol/L
              </button>
              <button
                type="button"
                onClick={() => handleUnitToggle('mgdl')}
                className={`px-2 py-0.5 rounded-md transition-colors ${
                  patient.scrUnit === 'mgdl' ? 'bg-teal-600 text-white shadow-2xs' : 'text-slate-600'
                }`}
              >
                mg/dL
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="number"
              step={patient.scrUnit === 'umol' ? '1' : '0.01'}
              min="0"
              value={patient.scr || ''}
              onChange={handleScrChange}
              className="w-full text-base font-black text-slate-900 px-3 py-1.5 bg-white rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
            <span className="text-xs font-bold text-slate-500 shrink-0">
              {patient.scrUnit === 'umol' ? 'µmol/L' : 'mg/dL'}
            </span>
          </div>
        </div>

        {/* Demographics Grid: Age, Gender, Weight, Height */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Age */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
            <label className="text-[11px] font-bold text-slate-700 mb-1 block">
              {isEn ? 'Age (years):' : 'Tuổi:'}
            </label>
            <div className="flex items-center space-x-1">
              <input
                type="number"
                min="1"
                max="120"
                value={patient.age || ''}
                onChange={(e) => onChange({ age: parseInt(e.target.value) || 0 })}
                className="w-full text-sm font-black text-slate-900 px-2.5 py-1 bg-white rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
              <span className="text-[11px] text-slate-500 font-bold shrink-0">{isEn ? 'yrs' : 'tuổi'}</span>
            </div>
          </div>

          {/* Gender */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
            <label className="text-[11px] font-bold text-slate-700 mb-1 block">
              {isEn ? 'Gender:' : 'Giới tính:'}
            </label>
            <div className="grid grid-cols-2 gap-1 bg-white p-0.5 rounded-lg border border-slate-300">
              <button
                type="button"
                onClick={() => onChange({ gender: 'm' })}
                className={`py-1 rounded font-bold text-[11px] transition-all ${
                  patient.gender === 'm' ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {isEn ? 'Male' : 'Nam'}
              </button>
              <button
                type="button"
                onClick={() => onChange({ gender: 'f' })}
                className={`py-1 rounded font-bold text-[11px] transition-all ${
                  patient.gender === 'f' ? 'bg-pink-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {isEn ? 'Female' : 'Nữ'}
              </button>
            </div>
          </div>

          {/* Weight */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
            <label className="text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>{isEn ? 'Weight (kg):' : 'Cân nặng (kg):'}</span>
              <span className="text-[10px] text-teal-700 font-bold">IBW: {renal.ibw}</span>
            </label>
            <div className="flex items-center space-x-1">
              <input
                type="number"
                step="0.5"
                min="1"
                max="300"
                value={patient.weight || ''}
                onChange={(e) => onChange({ weight: parseFloat(e.target.value) || 0 })}
                className="w-full text-sm font-black text-slate-900 px-2.5 py-1 bg-white rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
              <span className="text-[11px] text-slate-500 font-bold shrink-0">kg</span>
            </div>
          </div>

          {/* Height */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
            <label className="text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>{isEn ? 'Height (cm):' : 'Chiều cao (cm):'}</span>
              <span className="text-[10px] text-slate-500 font-bold">BMI: {renal.bmi}</span>
            </label>
            <div className="flex items-center space-x-1">
              <input
                type="number"
                min="50"
                max="250"
                value={patient.height || ''}
                onChange={(e) => onChange({ height: parseInt(e.target.value) || 0 })}
                className="w-full text-sm font-black text-slate-900 px-2.5 py-1 bg-white rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
              <span className="text-[11px] text-slate-500 font-bold shrink-0">cm</span>
            </div>
          </div>
        </div>

        {/* Dialysis / RRT Mode */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
          <label className="text-[11px] font-extrabold text-slate-700 mb-1.5 flex items-center">
            <Activity className="w-3.5 h-3.5 text-purple-600 mr-1.5" />
            <span>{isEn ? 'Dialysis / RRT Status:' : 'Lọc máu thay thế thận (RRT):'}</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            {[
              { key: 'none', label: 'Không lọc máu' },
              { key: 'hd', label: 'HD Ngắt quãng' },
              { key: 'crrt', label: 'CRRT Liên tục' },
              { key: 'capd', label: 'CAPD Thẩm phân' }
            ].map((d) => (
              <button
                key={d.key}
                type="button"
                onClick={() => onChange({ dialysis: d.key as DialysisMode })}
                className={`py-1.5 px-2 rounded-lg font-bold border transition-all text-center ${
                  dialysis === d.key
                    ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Renal Output Metric Card (Visual Cockcroft-Gault Gauge) */}
        <div className="p-3.5 rounded-2xl border border-teal-200/80 bg-gradient-to-br from-teal-50/90 to-emerald-50/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-teal-900 uppercase tracking-wider flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-teal-600" />
              <span>Độ Thanh Thải CrCl</span>
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white text-teal-800 border border-teal-200 shadow-2xs">
              {renal.categoryLabelVi}
            </span>
          </div>

          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{renal.crcl}</span>
            <span className="text-xs font-bold text-slate-600">mL/phút</span>
            {renal.isArc && (
              <span className="ml-auto text-[10px] font-black uppercase tracking-wider bg-teal-600 text-white px-2 py-0.5 rounded-md">
                Tăng thải ARC
              </span>
            )}
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${getStatusBg()}`}
              style={{ width: `${Math.min(100, Math.max(5, pointerPercent))}%` }}
            />
          </div>

          <div className="flex justify-between text-[9px] text-slate-400 font-bold px-0.5">
            <span>0</span>
            <span>15</span>
            <span>30</span>
            <span>60</span>
            <span>90</span>
            <span>130+</span>
          </div>
        </div>

        {/* Advanced Clinical Anthropometrics Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)}
            className="w-full py-1.5 px-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-[11px] font-bold transition-all flex items-center justify-between border border-transparent hover:border-slate-200 cursor-pointer"
          >
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-slate-500" />
              <span>Chỉ số nhân trắc &amp; eGFR mở rộng</span>
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvancedMetrics ? 'rotate-180' : ''}`} />
          </button>

          {showAdvancedMetrics && (
            <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-[11px] animate-fadeIn">
              <div className="flex justify-between">
                <span className="text-slate-500">Cân nặng lý tưởng (IBW):</span>
                <span className="font-bold text-slate-800">{renal.ibw} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cân nặng hiệu chỉnh (AdjBW):</span>
                <span className="font-bold text-slate-800">{renal.adjBw} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Chỉ số khối cơ thể (BMI):</span>
                <span className="font-bold text-slate-800">{renal.bmi} kg/m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Trọng lượng dùng tính liều:</span>
                <span className="font-bold text-teal-700">{renal.weightUsed} kg</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
