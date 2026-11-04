import React, { useState } from 'react';
import { 
  User, 
  Scale, 
  Droplet, 
  Building2, 
  AlertTriangle,
  ArrowRightLeft,
  Activity,
  ChevronDown,
  ChevronUp,
  Edit3,
  Calendar,
  Ruler,
  Check
} from 'lucide-react';
import { PatientProfile, RenalCalculations } from '../types';

interface PatientInputCardProps {
  patient: PatientProfile;
  renal: RenalCalculations;
  onChange: (updated: Partial<PatientProfile>) => void;
  defaultCollapsed?: boolean;
}

const NEPHROTOXIC_DRUGS = [
  'Piperacillin/Tazobactam',
  'Flucloxacillin',
  'Aminoglycoside',
  'Furosemide (Lợi tiểu)',
  'Amphotericin B',
  'Thuốc cản quang IV',
  'Thuốc vận mạch'
];

export const PatientInputCard: React.FC<PatientInputCardProps> = ({
  patient,
  renal,
  onChange,
  defaultCollapsed = false
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  // Local state for smooth typing without 0-glitches
  const [rawAge, setRawAge] = useState<string>(String(patient.age ?? ''));
  const [rawWeight, setRawWeight] = useState<string>(String(patient.weight ?? ''));
  const [rawHeight, setRawHeight] = useState<string>(String(patient.height ?? ''));
  const [rawScr, setRawScr] = useState<string>(String(patient.scrValue ?? ''));

  // Sync from props if external load/reset happens
  React.useEffect(() => {
    setRawAge(String(patient.age ?? ''));
    setRawWeight(String(patient.weight ?? ''));
    setRawHeight(String(patient.height ?? ''));
    setRawScr(String(patient.scrValue ?? ''));
  }, [patient.age, patient.weight, patient.height, patient.scrValue]);

  const toggleNephrotoxin = (drug: string) => {
    const list = [...patient.concomitantNephrotoxins];
    const idx = list.indexOf(drug);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(drug);
    }
    onChange({ concomitantNephrotoxins: list });
  };

  const toggleScrUnit = () => {
    if (patient.scrUnit === 'umol_L') {
      const newScr = Number((patient.scrValue / 88.4).toFixed(2));
      onChange({ scrUnit: 'mg_dL', scrValue: newScr });
      setRawScr(String(newScr));
    } else {
      const newScr = Math.round(patient.scrValue * 88.4);
      onChange({ scrUnit: 'umol_L', scrValue: newScr });
      setRawScr(String(newScr));
    }
  };

  const handleAgeChange = (val: string) => {
    setRawAge(val);
    const num = Number(val);
    if (!isNaN(num) && num >= 0) {
      onChange({ age: num });
    }
  };

  const handleWeightChange = (val: string) => {
    setRawWeight(val);
    const num = Number(val);
    if (!isNaN(num) && num > 0) {
      onChange({ weight: num });
    }
  };

  const handleHeightChange = (val: string) => {
    setRawHeight(val);
    const num = Number(val);
    if (!isNaN(num) && num > 0) {
      onChange({ height: num });
    }
  };

  const handleScrChange = (val: string) => {
    setRawScr(val);
    const num = Number(val);
    if (!isNaN(num) && num > 0) {
      onChange({ scrValue: num });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-4.5 transition-all">
      {/* Header with Title and Patient Group */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100/70 shadow-2xs">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
              Bệnh Nhân &amp; Chức Năng Thận
            </h2>
            <p className="text-[10px] text-slate-500">
              Cockcroft-Gault • CKD-EPI • ASHP/IDSA 2020
            </p>
          </div>
        </div>

        {/* Action Controls: Group buttons + Collapse toggle */}
        <div className="flex items-center gap-2">
          {!isCollapsed && (
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-[10px] sm:text-[11px] font-medium border border-slate-200/60">
              <button
                type="button"
                onClick={() => onChange({ patientType: 'adult', ageUnit: 'years', age: Math.max(18, patient.age) })}
                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                  patient.patientType === 'adult' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Người lớn
              </button>
              <button
                type="button"
                onClick={() => onChange({ patientType: 'pediatric', ageUnit: 'years', age: 8 })}
                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                  patient.patientType === 'pediatric' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Trẻ em
              </button>
              <button
                type="button"
                onClick={() => onChange({ patientType: 'neonatal', ageUnit: 'weeks', age: 3 })}
                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                  patient.patientType === 'neonatal' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sơ sinh
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 rounded-lg transition-all flex items-center gap-1 cursor-pointer border border-slate-200/60"
            title={isCollapsed ? 'Mở rộng biểu mẫu' : 'Thu gọn biểu mẫu'}
          >
            {isCollapsed ? (
              <>
                <Edit3 className="w-3 h-3 text-teal-600" />
                <span>Mở</span>
                <ChevronDown className="w-3 h-3" />
              </>
            ) : (
              <>
                <span>Gọn</span>
                <ChevronUp className="w-3 h-3" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* COLLAPSED SUMMARY VIEW */}
      {isCollapsed ? (
        <div 
          onClick={() => setIsCollapsed(false)}
          className="cursor-pointer bg-slate-50 hover:bg-teal-50/40 p-3 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-y-2 gap-x-3 text-xs transition-all"
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">
              {patient.gender === 'male' ? 'Nam' : 'Nữ'}, {patient.age} {patient.ageUnit === 'years' ? 'tuổi' : 'tuần'}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-700 font-medium font-mono">
              {patient.weight} kg, {patient.height} cm
            </span>
            <span className="text-[10px] bg-slate-200/70 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
              BMI {renal.bmi}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">CrCl:</span>
              <span className={`font-black font-mono text-xs ${
                renal.crcl >= 90 ? 'text-emerald-700' :
                renal.crcl >= 50 ? 'text-teal-700' :
                renal.crcl >= 30 ? 'text-amber-700' : 'text-rose-700'
              }`}>
                {renal.crcl} mL/phút
              </span>
            </div>

            <span className="text-[10px] text-teal-700 font-bold underline underline-offset-2 flex items-center gap-0.5">
              Chỉnh sửa &rarr;
            </span>
          </div>
        </div>
      ) : (
        /* EXPANDED FULL INPUT VIEW */
        <div className="space-y-3.5">
          {/* Main 4 Input Parameters (Tuổi, Giới, Cân nặng, Chiều cao) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            {/* Age */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>Tuổi ({patient.ageUnit === 'years' ? 'năm' : 'tuần'})</span>
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={rawAge}
                onChange={(e) => handleAgeChange(e.target.value)}
                placeholder="VD: 62"
                className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none transition-all font-mono font-bold text-slate-900"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Giới tính
              </label>
              <div className="grid grid-cols-2 gap-1 bg-slate-100 p-0.5 rounded-xl h-9 border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => onChange({ gender: 'male' })}
                  className={`text-xs font-semibold rounded-lg transition-all flex items-center justify-center cursor-pointer ${
                    patient.gender === 'male' ? 'bg-white text-teal-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Nam
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ gender: 'female' })}
                  className={`text-xs font-semibold rounded-lg transition-all flex items-center justify-center cursor-pointer ${
                    patient.gender === 'female' ? 'bg-white text-teal-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Nữ
                </button>
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Scale className="w-3 h-3 text-slate-400" />
                <span>Cân nặng</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="250"
                  step="0.5"
                  value={rawWeight}
                  onChange={(e) => handleWeightChange(e.target.value)}
                  placeholder="VD: 65"
                  className="w-full h-9 pl-3 pr-8 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none transition-all font-mono font-bold text-slate-900"
                />
                <span className="absolute right-2.5 top-2.5 text-[11px] text-slate-400 font-semibold pointer-events-none">
                  kg
                </span>
              </div>
            </div>

            {/* Height */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Ruler className="w-3 h-3 text-slate-400" />
                <span>Chiều cao</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="30"
                  max="220"
                  step="1"
                  value={rawHeight}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  placeholder="VD: 168"
                  className="w-full h-9 pl-3 pr-8 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none transition-all font-mono font-bold text-slate-900"
                />
                <span className="absolute right-2.5 top-2.5 text-[11px] text-slate-400 font-semibold pointer-events-none">
                  cm
                </span>
              </div>
            </div>

            {/* Serum Creatinine (Span 2) */}
            <div className="col-span-2 sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                  <Droplet className="w-3 h-3 text-teal-600" />
                  <span>Creatinin huyết thanh (SCr)</span>
                </label>
                <button
                  type="button"
                  onClick={toggleScrUnit}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded-md border border-teal-200 transition-all cursor-pointer"
                  title="Nhấn để chuyển đổi giữa µmol/L và mg/dL"
                >
                  <ArrowRightLeft className="w-2.5 h-2.5" />
                  <span>Đổi sang {patient.scrUnit === 'umol_L' ? 'mg/dL' : 'µmol/L'}</span>
                </button>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="0.1"
                  max="2000"
                  step={patient.scrUnit === 'umol_L' ? '1' : '0.01'}
                  value={rawScr}
                  onChange={(e) => handleScrChange(e.target.value)}
                  placeholder={patient.scrUnit === 'umol_L' ? 'VD: 110' : 'VD: 1.24'}
                  className="w-full h-9 pl-3 pr-20 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none transition-all font-mono font-black text-slate-900"
                />
                <span className="absolute right-2.5 top-2.5 text-[10px] text-slate-500 font-mono font-bold">
                  {patient.scrUnit === 'umol_L' ? 'µmol/L' : 'mg/dL'}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                <span>Quy đổi: {patient.scrUnit === 'umol_L' ? `${renal.scrMgDl} mg/dL` : `${renal.scrUmolL} µmol/L`}</span>
                <span className="italic text-slate-400">Nữ cao tuổi SCr &lt; 60 được chuẩn hóa 60</span>
              </div>
            </div>

            {/* Indication (Span 2) */}
            <div className="col-span-2 sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Chỉ định điều trị
              </label>
              <div className="grid grid-cols-2 gap-1 bg-slate-100 p-0.5 rounded-xl h-9 border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => onChange({ indication: 'severe_mrsa' })}
                  className={`text-xs font-semibold rounded-lg transition-all flex items-center justify-center cursor-pointer ${
                    patient.indication === 'severe_mrsa' ? 'bg-white text-teal-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Nhiễm MRSA nặng
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ indication: 'non_severe' })}
                  className={`text-xs font-semibold rounded-lg transition-all flex items-center justify-center cursor-pointer ${
                    patient.indication === 'non_severe' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Nhiễm khuẩn khác
                </button>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                {patient.indication === 'severe_mrsa' ? 'Mục tiêu AUC24: 400 - 600 mg·h/L' : 'Mục tiêu AUC24: 400 - 600 (hoặc đáy 10-15)'}
              </span>
            </div>
          </div>

          {/* High-Yield Renal & Weight Metrics Strip */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-y-1.5 gap-x-3 text-xs">
            {/* CrCl Cockcroft-Gault */}
            <div className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-teal-600 shrink-0" />
              <span className="text-slate-600 font-medium">CrCl (Cockcroft-Gault):</span>
              <span className={`font-black font-mono text-sm ${
                renal.crcl >= 90 ? 'text-emerald-700' :
                renal.crcl >= 50 ? 'text-teal-700' :
                renal.crcl >= 30 ? 'text-amber-700' : 'text-rose-700'
              }`}>
                {renal.crcl} mL/phút
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-200/80 text-slate-700 font-mono">
                {renal.crclUsedWeight}
              </span>
            </div>

            {/* eGFR CKD-EPI */}
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-slate-500">eGFR:</span>
              <span className="font-mono font-bold text-slate-800">{renal.egfrCkdEpi}</span>
              <span className="text-slate-400">mL/phút/1.73m²</span>
            </div>

            {/* BMI & Ideal/Adjusted Weight */}
            <div className="flex items-center gap-2 text-[11px]">
              <div className="flex items-center gap-1">
                <span className="text-slate-500">BMI:</span>
                <strong className="font-mono text-slate-800">{renal.bmi}</strong>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  renal.bmi >= 30 ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {renal.bmiClassification}
                </span>
              </div>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600">
                IBW: <strong className="font-mono text-slate-800">{renal.ibw} kg</strong>
              </span>
              {renal.bmi >= 30 && (
                <span className="text-teal-800 font-bold bg-teal-50 px-1 rounded border border-teal-200">
                  ABW: {renal.abw} kg
                </span>
              )}
            </div>
          </div>

          {/* Clinical Setting & Dialysis Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 text-xs">
            {/* Ward vs ICU (4 cols) */}
            <div className="sm:col-span-4">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Khoa điều trị</span>
              </label>
              <div className="grid grid-cols-2 gap-1 bg-slate-100 p-0.5 rounded-xl h-9 border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => onChange({ clinicalSetting: 'ward' })}
                  className={`text-xs font-semibold rounded-lg transition-all flex items-center justify-center cursor-pointer ${
                    patient.clinicalSetting === 'ward' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Khoa thường
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ clinicalSetting: 'icu' })}
                  className={`text-xs font-semibold rounded-lg transition-all flex items-center justify-center cursor-pointer ${
                    patient.clinicalSetting === 'icu' ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Hồi sức (ICU)
                </button>
              </div>
            </div>

            {/* Renal / Dialysis Status (8 cols) */}
            <div className="sm:col-span-8">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5 text-slate-400" />
                <span>Tình trạng thận &amp; Phương thức lọc máu</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 bg-slate-100 p-0.5 rounded-xl h-9 border border-slate-200/80 text-[11px]">
                <button
                  type="button"
                  onClick={() => onChange({ renalStatus: 'normal_or_ckd' })}
                  className={`rounded-lg font-semibold transition-all text-center flex items-center justify-center cursor-pointer ${
                    patient.renalStatus === 'normal_or_ckd' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Không lọc
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ renalStatus: 'intermittent_hd' })}
                  className={`rounded-lg font-semibold transition-all text-center flex items-center justify-center cursor-pointer ${
                    patient.renalStatus === 'intermittent_hd' ? 'bg-white text-blue-800 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  IHD chu kỳ
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ renalStatus: 'crrt' })}
                  className={`rounded-lg font-semibold transition-all text-center flex items-center justify-center cursor-pointer ${
                    patient.renalStatus === 'crrt' ? 'bg-white text-purple-800 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Lọc CRRT
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ renalStatus: 'sled' })}
                  className={`rounded-lg font-semibold transition-all text-center flex items-center justify-center cursor-pointer ${
                    patient.renalStatus === 'sled' ? 'bg-white text-indigo-800 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Lọc SLED
                </button>
              </div>
            </div>
          </div>

          {/* IHD Membrane & Timing Controls (if Dialysis is selected) */}
          {patient.renalStatus === 'intermittent_hd' && (
            <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-blue-950 text-[11px]">Màng lọc:</span>
                <div className="flex bg-blue-100/70 p-0.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => onChange({ hdDialyzerPermeability: 'high' })}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer ${
                      patient.hdDialyzerPermeability !== 'low' ? 'bg-white text-blue-900 shadow-2xs' : 'text-blue-700'
                    }`}
                  >
                    High-flux
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange({ hdDialyzerPermeability: 'low' })}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer ${
                      patient.hdDialyzerPermeability === 'low' ? 'bg-white text-blue-900 shadow-2xs' : 'text-blue-700'
                    }`}
                  >
                    Low-flux
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-blue-950 text-[11px]">Thời điểm truyền:</span>
                <div className="flex bg-blue-100/70 p-0.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => onChange({ hdTiming: 'after_dialysis' })}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer ${
                      patient.hdTiming !== 'intradialytic' ? 'bg-white text-blue-900 shadow-2xs' : 'text-blue-700'
                    }`}
                  >
                    Sau buổi lọc
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange({ hdTiming: 'intradialytic' })}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer ${
                      patient.hdTiming === 'intradialytic' ? 'bg-white text-blue-900 shadow-2xs' : 'text-blue-700'
                    }`}
                  >
                    Trong 60–90p cuối lọc
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Nephrotoxic Drugs Row */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Thuốc gây độc thận dùng đồng thời</span>
                {patient.concomitantNephrotoxins.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-100 text-rose-700">
                    {patient.concomitantNephrotoxins.length} thuốc
                  </span>
                )}
              </label>
              <span className="text-[10px] text-slate-400">Tăng nguy cơ AKI khi dùng chung</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {NEPHROTOXIC_DRUGS.map((drug) => {
                const isSelected = patient.concomitantNephrotoxins.includes(drug);
                return (
                  <button
                    key={drug}
                    type="button"
                    onClick={() => toggleNephrotoxin(drug)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50 text-rose-800 border border-rose-300 shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {drug}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
