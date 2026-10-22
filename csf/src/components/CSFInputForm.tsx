import React, { useState } from 'react';
import { CSFInput } from '../types/csf';
import { 
  RotateCcw, 
  ClipboardList, 
  FlaskConical, 
  Activity, 
  Microscope, 
  ChevronDown, 
  ChevronUp,
  SlidersHorizontal,
  Check
} from 'lucide-react';

interface Props {
  input: CSFInput;
  onChange: (input: CSFInput) => void;
  onReset: () => void;
  onOpenPresets: () => void;
}

export const CSFInputForm: React.FC<Props> = ({ input, onChange, onReset, onOpenPresets }) => {
  const [viewMode, setViewMode] = useState<'standard' | 'full'>('standard');
  const [showAdvancedTests, setShowAdvancedTests] = useState<boolean>(false);

  const updateField = <K extends keyof CSFInput>(field: K, value: CSFInput[K]) => {
    onChange({ ...input, [field]: value });
  };

  // Live calculation of CSF:Serum Glucose ratio
  const glucoseRatio = (input.serumGlucose && input.serumGlucose > 0)
    ? Number((input.csfGlucose / input.serumGlucose).toFixed(2))
    : null;

  // Live sum of differential
  const diffSum = input.neutrophilPercent + input.lymphocytePercent + input.monocytePercent;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-colors duration-200">
      {/* 1. TOP HEADER (DIV:NTH-OF-TYPE(1)) - Clean & Minimalist */}
      <div className="bg-slate-50/80 dark:bg-slate-900/90 px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-teal-600 dark:bg-teal-500 text-white rounded-lg shadow-2xs">
              <SlidersHorizontal className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                Nhập Chỉ Số Dịch Não Tủy
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Điền nhanh các chỉ số xét nghiệm thường quy
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenPresets}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Ca Mẫu</span>
            </button>

            <button
              type="button"
              onClick={onReset}
              title="Đặt lại thông số mặc định"
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-800 active:scale-95 rounded-xl transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Simple Mode Toggle */}
        <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-200/60 dark:border-slate-800">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Chế độ hiển thị:</span>
          <div className="flex items-center bg-slate-200/70 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('standard')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === 'standard' ? 'bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-200 shadow-2xs font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Cơ Bản (Thường quy)
            </button>
            <button
              type="button"
              onClick={() => setViewMode('full')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === 'full' ? 'bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-200 shadow-2xs font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Đầy Đủ (Chi tiết)
            </button>
          </div>
        </div>
      </div>

      {/* 2. FORM BODY (DIV:NTH-OF-TYPE(2)) - Simplified, Professional & High Usability */}
      <div className="p-4 sm:p-5 space-y-4">
        {/* BLOCK 1: SINH HÓA CỐT LÕI (ĐƯỜNG & PROTEIN) */}
        <div className="bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-amber-500" />
              1. Sinh Hóa &amp; Tỷ Số Đường
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Đường &gt; 45 • Protein &lt; 45</span>
          </div>

          {/* Đường DNT & Đường Máu & Tỷ số tự động */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Đường DNT */}
            <div className="bg-white dark:bg-slate-800/90 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Đường DNT</label>
                <button
                  type="button"
                  onClick={() => updateField('glucoseUnit', input.glucoseUnit === 'mg/dL' ? 'mmol/L' : 'mg/dL')}
                  className="text-[9px] font-mono text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 px-1 py-0.2 rounded hover:bg-teal-100"
                >
                  {input.glucoseUnit}
                </button>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={input.csfGlucose}
                  onChange={(e) => updateField('csfGlucose', Math.max(0, Number(e.target.value)))}
                  className="w-full text-base font-black text-slate-900 dark:text-white bg-transparent focus:outline-hidden font-mono"
                />
                <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 dark:text-slate-500">
                  BT: 45-80
                </span>
              </div>
            </div>

            {/* Đường Máu */}
            <div className="bg-white dark:bg-slate-800/90 p-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50/30 dark:bg-teal-950/20 shadow-2xs">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold text-teal-900 dark:text-teal-300">Đường Máu</label>
                <span className="text-[9px] text-teal-700 dark:text-teal-400 font-mono font-bold">Cần thiết</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  placeholder="100"
                  value={input.serumGlucose ?? ''}
                  onChange={(e) => updateField('serumGlucose', e.target.value ? Math.max(0, Number(e.target.value)) : undefined)}
                  className="w-full text-base font-black text-teal-950 dark:text-teal-100 bg-transparent focus:outline-hidden font-mono"
                />
                <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-teal-700 dark:text-teal-400 font-mono">
                  {input.glucoseUnit}
                </span>
              </div>
            </div>

            {/* Tỷ Số Tự Động */}
            <div className="bg-white dark:bg-slate-800/90 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Tỷ số DNT/Máu</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                  glucoseRatio !== null && glucoseRatio < 0.4 ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                }`}>
                  {glucoseRatio !== null && glucoseRatio < 0.4 ? 'Hạ (<0.4)' : 'Chuẩn ≥ 0.6'}
                </span>
              </div>
              <div className="text-base font-black font-mono mt-0.5">
                <span className={glucoseRatio !== null && glucoseRatio < 0.4 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
                  {glucoseRatio !== null ? glucoseRatio : 'Chưa có'}
                </span>
              </div>
            </div>
          </div>

          {/* Protein & Lactate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Protein */}
            <div className="bg-white dark:bg-slate-800/90 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Protein DNT</label>
                <button
                  type="button"
                  onClick={() => updateField('proteinUnit', input.proteinUnit === 'mg/dL' ? 'g/L' : 'mg/dL')}
                  className="text-[9px] font-mono text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 px-1 py-0.2 rounded hover:bg-teal-100"
                >
                  {input.proteinUnit}
                </button>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={input.protein}
                  onChange={(e) => updateField('protein', Math.max(0, Number(e.target.value)))}
                  className="w-full text-base font-black text-slate-900 dark:text-white bg-transparent focus:outline-hidden font-mono"
                />
                <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 dark:text-slate-500">
                  BT: 15-45 {input.proteinUnit}
                </span>
              </div>
            </div>

            {/* Lactate */}
            <div className="bg-white dark:bg-slate-800/90 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Lactate DNT</label>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono">BT: 1.3 - 2.4</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  placeholder="2.1"
                  value={input.lactate ?? ''}
                  onChange={(e) => updateField('lactate', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full text-base font-black text-slate-900 dark:text-white bg-transparent focus:outline-hidden font-mono"
                />
                <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  {input.lactateUnit}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BLOCK 2: TẾ BÀO HỌC (WBC, RBC & CÔNG THỨC) */}
        <div className="bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-rose-500" />
              2. Tế Bào Học (WBC, RBC &amp; Dòng Tế Bào)
            </span>
            <div className="flex items-center gap-1.5 text-[10px]">
              <button
                type="button"
                onClick={() => onChange({ ...input, neutrophilPercent: 85, lymphocytePercent: 10, monocytePercent: 5 })}
                className="text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/80 hover:bg-rose-200 font-bold px-1.5 py-0.5 rounded cursor-pointer"
              >
                Gán PMN mủ
              </button>
              <button
                type="button"
                onClick={() => onChange({ ...input, neutrophilPercent: 15, lymphocytePercent: 75, monocytePercent: 10 })}
                className="text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-950/80 hover:bg-teal-200 font-bold px-1.5 py-0.5 rounded cursor-pointer"
              >
                Gán Lympho
              </button>
            </div>
          </div>

          {/* WBC & RBC Inputs */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white dark:bg-slate-800/90 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Bạch cầu (WBC thô)</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={input.wbc}
                  onChange={(e) => updateField('wbc', Math.max(0, Number(e.target.value)))}
                  className="w-full text-base font-black text-slate-900 dark:text-white bg-transparent focus:outline-hidden font-mono"
                />
                <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 dark:text-slate-500">
                  BT: ≤ 5 /µL
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/90 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Hồng cầu (RBC)</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={input.rbc}
                  onChange={(e) => updateField('rbc', Math.max(0, Number(e.target.value)))}
                  className="w-full text-base font-black text-slate-900 dark:text-white bg-transparent focus:outline-hidden font-mono"
                />
                <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 dark:text-slate-500">
                  /µL
                </span>
              </div>
            </div>
          </div>

          {/* Differential Row: PMN, Lympho, Mono */}
          <div className="bg-white dark:bg-slate-800/90 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-700 dark:text-slate-300">Công thức phân bố bạch cầu (%)</span>
              <span className={`font-mono text-[10px] font-bold ${diffSum === 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                Tổng: {diffSum}% {diffSum === 100 ? '✓' : ''}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-rose-50/60 dark:bg-rose-950/30 p-1.5 rounded-lg border border-rose-200 dark:border-rose-900">
                <label className="text-[10px] font-bold text-rose-800 dark:text-rose-300 block">% Đa nhân (PMN)</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={input.neutrophilPercent}
                    onChange={(e) => updateField('neutrophilPercent', Math.min(100, Math.max(0, Number(e.target.value))))}
                    className="w-full text-xs font-black text-rose-950 dark:text-rose-100 bg-transparent focus:outline-hidden font-mono"
                  />
                  <span className="text-[10px] text-rose-400 font-mono">%</span>
                </div>
              </div>

              <div className="bg-teal-50/60 dark:bg-teal-950/30 p-1.5 rounded-lg border border-teal-200 dark:border-teal-900">
                <label className="text-[10px] font-bold text-teal-800 dark:text-teal-300 block">% Lymphocyte</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={input.lymphocytePercent}
                    onChange={(e) => updateField('lymphocytePercent', Math.min(100, Math.max(0, Number(e.target.value))))}
                    className="w-full text-xs font-black text-teal-950 dark:text-teal-100 bg-transparent focus:outline-hidden font-mono"
                  />
                  <span className="text-[10px] text-teal-400 font-mono">%</span>
                </div>
              </div>

              <div className="bg-amber-50/60 dark:bg-amber-950/30 p-1.5 rounded-lg border border-amber-200 dark:border-amber-900">
                <label className="text-[10px] font-bold text-amber-800 dark:text-amber-300 block">% Monocyte</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={input.monocytePercent}
                    onChange={(e) => updateField('monocytePercent', Math.min(100, Math.max(0, Number(e.target.value))))}
                    className="w-full text-xs font-black text-amber-950 dark:text-amber-100 bg-transparent focus:outline-hidden font-mono"
                  />
                  <span className="text-[10px] text-amber-400 font-mono">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BLOCK 3: LÂM SÀNG & ĐẠI THỂ */}
        <div className="bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            3. Lâm Sàng &amp; Tính Chất Đại Thể
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-white dark:bg-slate-800/90 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block mb-0.5">Tuổi</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={input.patientAge}
                  onChange={(e) => updateField('patientAge', Math.max(0, Number(e.target.value)))}
                  className="w-full text-xs font-black text-slate-900 dark:text-white bg-transparent focus:outline-hidden font-mono"
                />
                <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 dark:text-slate-500">tuổi</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/90 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block mb-0.5">Giới tính</label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => updateField('gender', 'male')}
                  className={`flex-1 py-1 rounded text-[11px] font-bold cursor-pointer transition-all ${
                    input.gender === 'male' ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Nam
                </button>
                <button
                  type="button"
                  onClick={() => updateField('gender', 'female')}
                  className={`flex-1 py-1 rounded text-[11px] font-bold cursor-pointer transition-all ${
                    input.gender === 'female' ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Nữ
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/90 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block mb-0.5">Khởi phát</label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={input.daysSinceOnset}
                  onChange={(e) => updateField('daysSinceOnset', Math.max(1, Number(e.target.value)))}
                  className="w-full text-xs font-black text-slate-900 dark:text-white bg-transparent focus:outline-hidden font-mono"
                />
                <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 dark:text-slate-500">ngày</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/90 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block mb-0.5">Áp lực mở</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="160"
                  value={input.openingPressure ?? ''}
                  onChange={(e) => updateField('openingPressure', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full text-xs font-black text-slate-900 dark:text-white bg-transparent focus:outline-hidden font-mono"
                />
                <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[9px] text-slate-400 dark:text-slate-500 font-mono">mmH2O</span>
              </div>
            </div>
          </div>

          {/* Màu sắc & Dịch nổi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="bg-white dark:bg-slate-800/90 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-300 block mb-1">Màu sắc đại thể</label>
              <select
                value={input.color}
                onChange={(e) => updateField('color', e.target.value as any)}
                className="w-full text-xs font-bold text-slate-900 dark:text-white bg-transparent focus:outline-hidden cursor-pointer"
              >
                <option value="clear" className="dark:bg-slate-800">Trong suốt (Bình thường)</option>
                <option value="turbid" className="dark:bg-slate-800">Đục / Mờ khói (Bạch cầu &gt; 200)</option>
                <option value="purulent" className="dark:bg-slate-800">Đục mủ / Nước vo gạo</option>
                <option value="faint_pink" className="dark:bg-slate-800">Hồng nhạt (Chạm mạch)</option>
                <option value="bloody" className="dark:bg-slate-800">Đỏ máu tươi</option>
                <option value="xanthochromic" className="dark:bg-slate-800">Vàng chanh đậm</option>
              </select>
            </div>

            <div className="bg-white dark:bg-slate-800/90 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-300 block mb-1">Dịch nổi (Ly tâm)</label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => updateField('supernatant', 'clear')}
                  className={`flex-1 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                    input.supernatant === 'clear' ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Trong (Clear)
                </button>
                <button
                  type="button"
                  onClick={() => updateField('supernatant', 'xanthochromic')}
                  className={`flex-1 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                    input.supernatant === 'xanthochromic' ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Vàng chanh
                </button>
              </div>
            </div>
          </div>

          {/* Cờ hiệu lâm sàng (Clean chips with dark mode) */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block">
              Cờ hiệu lâm sàng:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {[
                { field: 'hasPriorAntibiotics', label: 'Đã dùng kháng sinh' },
                { field: 'isImmunocompromised', label: 'Suy giảm miễn dịch' },
                { field: 'hasThunderclapHeadache', label: 'Đau đầu sét đánh' },
                { field: 'hasAlteredMentalStatus', label: 'Rối loạn tri giác' },
                { field: 'hasFocalDeficitOrSeizure', label: 'Thần kinh khu trú' },
                { field: 'isPostNeurosurgical', label: 'Hậu phẫu sọ não' },
              ].map(({ field, label }) => {
                const isActive = !!(input as any)[field];
                return (
                  <button
                    key={field}
                    type="button"
                    onClick={() => updateField(field as any, !isActive)}
                    className={`flex items-center justify-between p-2 rounded-xl border text-[11px] text-left transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-400 dark:border-teal-600 text-teal-900 dark:text-teal-200 font-bold shadow-2xs' 
                        : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    <span className="truncate">{label}</span>
                    {isActive && <Check className="w-3 h-3 text-teal-600 dark:text-teal-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* BLOCK 4: VI SINH & XÉT NGHIỆM MỞ RỘNG (GỌN GÀNG TRONG 1 ACCORDION) */}
        {(viewMode === 'full' || showAdvancedTests) ? (
          <div className="bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                <Microscope className="w-3.5 h-3.5 text-indigo-500" />
                4. Vi Sinh &amp; Xét Nghiệm Mở Rộng
              </span>
              {viewMode !== 'full' && (
                <button
                  type="button"
                  onClick={() => setShowAdvancedTests(false)}
                  className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                >
                  Thu gọn
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="bg-white dark:bg-slate-800/90 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-300 block mb-1">Nhuộm soi Gram</label>
                <select
                  value={input.gramStain}
                  onChange={(e) => updateField('gramStain', e.target.value as any)}
                  className="w-full text-xs font-bold text-slate-900 dark:text-white bg-transparent focus:outline-hidden cursor-pointer"
                >
                  <option value="not_done" className="dark:bg-slate-800">Chưa làm</option>
                  <option value="negative" className="dark:bg-slate-800">Âm tính</option>
                  <option value="gram_pos_cocci" className="dark:bg-slate-800">Song cầu Gram(+) (Phế cầu/Tụ cầu)</option>
                  <option value="gram_neg_diplococci" className="dark:bg-slate-800">Song cầu Gram(-) hạt cà phê (Não mô cầu)</option>
                  <option value="gram_neg_bacilli" className="dark:bg-slate-800">Trực khuẩn Gram(-) (Haemophilus/E.coli)</option>
                  <option value="gram_pos_bacilli" className="dark:bg-slate-800">Trực khuẩn Gram(+) (Listeria)</option>
                </select>
              </div>

              <div className="bg-white dark:bg-slate-800/90 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-300 block mb-1">Nấm / Kháng nguyên CrAg</label>
                <select
                  value={input.crAgOrIndiaInk}
                  onChange={(e) => updateField('crAgOrIndiaInk', e.target.value as any)}
                  className={`w-full text-xs font-bold bg-transparent focus:outline-hidden cursor-pointer ${
                    input.crAgOrIndiaInk === 'positive' ? 'text-rose-700 dark:text-rose-400' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  <option value="not_done" className="dark:bg-slate-800">Chưa làm</option>
                  <option value="negative" className="dark:bg-slate-800">Âm tính</option>
                  <option value="positive" className="dark:bg-slate-800">DƯƠNG TÍNH (Cryptococcus)</option>
                </select>
              </div>

              <div className="bg-white dark:bg-slate-800/90 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-300 block mb-1">Lao (GeneXpert / AFB)</label>
                <select
                  value={input.tbPcrOrAfb}
                  onChange={(e) => updateField('tbPcrOrAfb', e.target.value as any)}
                  className={`w-full text-xs font-bold bg-transparent focus:outline-hidden cursor-pointer ${
                    input.tbPcrOrAfb === 'positive' ? 'text-amber-700 dark:text-amber-400' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  <option value="not_done" className="dark:bg-slate-800">Chưa làm</option>
                  <option value="negative" className="dark:bg-slate-800">Âm tính</option>
                  <option value="positive" className="dark:bg-slate-800">DƯƠNG TÍNH (M. tuberculosis)</option>
                </select>
              </div>

              <div className="bg-white dark:bg-slate-800/90 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-300 block mb-1">PCR Virus Thần Kinh</label>
                <select
                  value={input.viralPcr}
                  onChange={(e) => updateField('viralPcr', e.target.value as any)}
                  className={`w-full text-xs font-bold bg-transparent focus:outline-hidden cursor-pointer ${
                    input.viralPcr !== 'negative' && input.viralPcr !== 'not_done' ? 'text-teal-700 dark:text-teal-400' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  <option value="not_done" className="dark:bg-slate-800">Chưa làm</option>
                  <option value="negative" className="dark:bg-slate-800">Âm tính</option>
                  <option value="enterovirus_positive" className="dark:bg-slate-800">Dương tính Enterovirus</option>
                  <option value="hsv_positive" className="dark:bg-slate-800">Dương tính Herpes simplex (HSV)</option>
                  <option value="vzv_positive" className="dark:bg-slate-800">Dương tính Varicella zoster (VZV)</option>
                </select>
              </div>
            </div>

            {/* Test 3 ống & Qalb */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="bg-white dark:bg-slate-800/90 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block mb-0.5">RBC Ống 1</label>
                <input
                  type="number"
                  placeholder="15000"
                  value={input.tube1Rbc ?? ''}
                  onChange={(e) => updateField('tube1Rbc', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full text-xs font-bold text-slate-900 dark:text-white bg-transparent focus:outline-hidden font-mono"
                />
              </div>

              <div className="bg-white dark:bg-slate-800/90 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block mb-0.5">RBC Ống 4</label>
                <input
                  type="number"
                  placeholder="3000"
                  value={input.tube4Rbc ?? ''}
                  onChange={(e) => updateField('tube4Rbc', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full text-xs font-bold text-slate-900 dark:text-white bg-transparent focus:outline-hidden font-mono"
                />
              </div>

              <div className="bg-white dark:bg-slate-800/90 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block mb-0.5">Men ADA (Lao)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="U/L"
                  value={input.adaLevel ?? ''}
                  onChange={(e) => updateField('adaLevel', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full text-xs font-bold text-slate-900 dark:text-white bg-transparent focus:outline-hidden font-mono"
                />
              </div>

              <div className="bg-white dark:bg-slate-800/90 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block mb-0.5">Màng mạng nhện</label>
                <select
                  value={input.pellicleFormation ? 'yes' : 'no'}
                  onChange={(e) => updateField('pellicleFormation', e.target.value === 'yes')}
                  className="w-full text-xs font-bold text-slate-900 dark:text-white bg-transparent focus:outline-hidden cursor-pointer"
                >
                  <option value="no" className="dark:bg-slate-800">Không</option>
                  <option value="yes" className="dark:bg-slate-800">Có (Lao)</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowAdvancedTests(true)}
            className="w-full p-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-600 hover:bg-teal-50/50 dark:hover:bg-teal-950/20 text-slate-600 dark:text-slate-400 hover:text-teal-800 dark:hover:text-teal-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Microscope className="w-3.5 h-3.5" />
            <span>Thêm Xét Nghiệm Vi Sinh, Test 3 Ống &amp; Men ADA...</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
