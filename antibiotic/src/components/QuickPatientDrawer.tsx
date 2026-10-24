import React from 'react';
import { 
  X, 
  User, 
  Droplet, 
  Weight, 
  Ruler, 
  Clock, 
  Sparkles, 
  Activity, 
  Check, 
  Save, 
  Flame, 
  Layers 
} from 'lucide-react';
import { CalculatedRenalMetrics, DialysisMode, Language, PatientState } from '../types';

interface QuickPatientDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientState;
  onChange: (updated: Partial<PatientState>) => void;
  renal: CalculatedRenalMetrics;
  language: Language;
}

export const QuickPatientDrawer: React.FC<QuickPatientDrawerProps> = ({
  isOpen,
  onClose,
  patient,
  onChange,
  renal,
  language
}) => {
  if (!isOpen) return null;

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
    if (patient.dialysis !== 'none') return 'bg-purple-600 text-white';
    if (renal.isArc) return 'bg-teal-600 text-white';
    if (renal.crcl >= 90) return 'bg-emerald-600 text-white';
    if (renal.crcl >= 60) return 'bg-blue-600 text-white';
    if (renal.crcl >= 30) return 'bg-amber-500 text-white';
    if (renal.crcl >= 15) return 'bg-orange-600 text-white';
    return 'bg-rose-600 text-white';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal / Bottom Sheet Box */}
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col z-10 animate-slideUp">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">
                {isEn ? 'Edit Patient & Renal Parameters' : 'Chỉnh Nhanh Thông Số Bệnh Nhân'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isEn ? 'Instant CrCl recalculation' : 'Tự động tính lại CrCl theo Cockcroft-Gault'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Renal Metric Capsule on Top */}
        <div className={`px-4 py-3 shrink-0 flex items-center justify-between ${getStatusBg()}`}>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 shrink-0" />
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider opacity-90">
                {isEn ? 'Calculated CrCl' : 'Độ thanh thải Creatinine'}
              </div>
              <div className="text-lg font-black leading-tight">
                {renal.crcl} <span className="text-xs font-bold">mL/phút</span>
              </div>
            </div>
          </div>
          <div className="text-right text-xs">
            <span className="inline-block px-2 py-0.5 rounded-full bg-white/20 font-bold backdrop-blur-xs">
              {renal.categoryLabelVi}
            </span>
            {patient.dialysis !== 'none' && (
              <span className="block text-[10px] uppercase font-black tracking-wider mt-0.5">
                Lọc máu: {patient.dialysis.toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          
          {/* Quick Case Presets */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 mr-1" />
              {isEn ? 'Clinical Presets (1-Click):' : 'Ca lâm sàng mẫu (1 chạm):'}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              <button
                type="button"
                onClick={() => setPreset('normal')}
                className="px-2 py-1.5 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors text-center"
              >
                {isEn ? 'Normal' : 'Bình thường'}
              </button>
              <button
                type="button"
                onClick={() => setPreset('moderate')}
                className="px-2 py-1.5 text-xs font-bold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-center"
              >
                {isEn ? 'Moderate' : 'Suy vừa (45)'}
              </button>
              <button
                type="button"
                onClick={() => setPreset('hd')}
                className="px-2 py-1.5 text-xs font-bold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 text-center"
              >
                {isEn ? 'HD' : 'Lọc máu HD'}
              </button>
              <button
                type="button"
                onClick={() => setPreset('arc')}
                className="px-2 py-1.5 text-xs font-bold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-center"
              >
                {isEn ? 'ARC' : 'Tăng thải ARC'}
              </button>
              <button
                type="button"
                onClick={() => setPreset('obese')}
                className="px-2 py-1.5 text-xs font-bold rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-center col-span-2 sm:col-span-1"
              >
                {isEn ? 'Obese' : 'Béo phì'}
              </button>
            </div>
          </div>

          {/* Serum Creatinine */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 flex items-center">
                <Droplet className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
                <span>{isEn ? 'Serum Creatinine (Scr):' : 'Creatinine huyết thanh (Scr):'}</span>
              </label>
              <div className="flex items-center bg-white border border-slate-300 rounded-lg p-0.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => handleUnitToggle('umol')}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    patient.scrUnit === 'umol' ? 'bg-teal-600 text-white' : 'text-slate-600'
                  }`}
                >
                  µmol/L
                </button>
                <button
                  type="button"
                  onClick={() => handleUnitToggle('mgdl')}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    patient.scrUnit === 'mgdl' ? 'bg-teal-600 text-white' : 'text-slate-600'
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
                className="w-full text-base font-black text-slate-900 px-3 py-2 bg-white rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
              <span className="text-xs font-bold text-slate-500 shrink-0">
                {patient.scrUnit === 'umol' ? 'µmol/L' : 'mg/dL'}
              </span>
            </div>
          </div>

          {/* Demographics Grid: Age, Gender, Weight, Height */}
          <div className="grid grid-cols-2 gap-3">
            {/* Age */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="text-xs font-bold text-slate-800 mb-1.5 block">
                {isEn ? 'Age (years):' : 'Tuổi:'}
              </label>
              <div className="flex items-center space-x-1.5">
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={patient.age || ''}
                  onChange={(e) => onChange({ age: parseInt(e.target.value) || 0 })}
                  className="w-full text-base font-black text-slate-900 px-3 py-1.5 bg-white rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-xs text-slate-500 font-bold shrink-0">{isEn ? 'yrs' : 'tuổi'}</span>
              </div>
            </div>

            {/* Gender */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="text-xs font-bold text-slate-800 mb-1.5 block">
                {isEn ? 'Biological Sex:' : 'Giới tính:'}
              </label>
              <div className="grid grid-cols-2 gap-1 bg-white p-1 rounded-xl border border-slate-300">
                <button
                  type="button"
                  onClick={() => onChange({ gender: 'm' })}
                  className={`py-1.5 rounded-lg font-bold text-xs transition-all ${
                    patient.gender === 'm' ? 'bg-teal-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {isEn ? 'Male' : 'Nam'}
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ gender: 'f' })}
                  className={`py-1.5 rounded-lg font-bold text-xs transition-all ${
                    patient.gender === 'f' ? 'bg-pink-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {isEn ? 'Female' : 'Nữ'}
                </button>
              </div>
            </div>

            {/* Weight */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                <span>{isEn ? 'Weight (kg):' : 'Cân nặng (kg):'}</span>
                <span className="text-[10px] text-teal-700 font-bold">IBW: {renal.ibw}kg</span>
              </label>
              <div className="flex items-center space-x-1.5">
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="300"
                  value={patient.weight || ''}
                  onChange={(e) => onChange({ weight: parseFloat(e.target.value) || 0 })}
                  className="w-full text-base font-black text-slate-900 px-3 py-1.5 bg-white rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-xs text-slate-500 font-bold shrink-0">kg</span>
              </div>
            </div>

            {/* Height */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                <span>{isEn ? 'Height (cm):' : 'Chiều cao (cm):'}</span>
                <span className="text-[10px] text-slate-500 font-bold">BMI: {renal.bmi}</span>
              </label>
              <div className="flex items-center space-x-1.5">
                <input
                  type="number"
                  min="50"
                  max="250"
                  value={patient.height || ''}
                  onChange={(e) => onChange({ height: parseInt(e.target.value) || 0 })}
                  className="w-full text-base font-black text-slate-900 px-3 py-1.5 bg-white rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-xs text-slate-500 font-bold shrink-0">cm</span>
              </div>
            </div>
          </div>

          {/* Dialysis / RRT Mode Selection */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 mb-2 flex items-center">
              <Activity className="w-3.5 h-3.5 text-purple-600 mr-1.5" />
              <span>{isEn ? 'Renal Replacement Therapy (RRT):' : 'Phương thức lọc máu (nếu có):'}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { key: 'none', label: 'Không lọc máu' },
                { key: 'hd', label: 'HD Ngắt Quãng' },
                { key: 'crrt', label: 'CRRT Liên Tục' },
                { key: 'capd', label: 'CAPD Thẩm Phân' }
              ].map((d) => (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => onChange({ dialysis: d.key as DialysisMode })}
                  className={`p-2 rounded-xl text-center text-xs font-bold border transition-all ${
                    patient.dialysis === d.key
                      ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 font-medium">
            CrCl: <strong className="text-slate-900 font-black">{renal.crcl} mL/phút</strong>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{isEn ? 'Apply & Close' : 'Áp Dụng & Đóng'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
