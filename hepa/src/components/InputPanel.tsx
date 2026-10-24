/**
 * HepaCDSS Input Panel Component
 * Giao diện nhập liệu lâm sàng trực quan, hỗ trợ chuyển đổi đơn vị và cảnh báo an toàn nhầm đơn vị.
 */

import React, { useState } from 'react';
import {
  AscitesGrade,
  CustomULNSettings,
  EncephalopathyGrade,
  Gender,
  HepaInputData,
  ULNStandard,
  UltrasoundBiliaryDilatation,
  UnitPreferences,
} from '../types';
import { UnitConverter } from '../engine/units';
import { PatternEngine } from '../engine/pattern';
import {
  AlertCircle,
  Activity,
  HeartPulse,
  Flame,
  RotateCcw,
  Sliders,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface InputPanelProps {
  input: HepaInputData;
  onChange: (data: HepaInputData) => void;
  units: UnitPreferences;
  onUnitsChange: (units: UnitPreferences) => void;
  standard: ULNStandard;
  onStandardChange: (std: ULNStandard) => void;
  customULNs?: Partial<CustomULNSettings>;
  onReset: () => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  input,
  onChange,
  units,
  onUnitsChange,
  standard,
  onStandardChange,
  customULNs,
  onReset,
}) => {
  const [showAdvancedLabs, setShowAdvancedLabs] = useState(false);
  const [showClinicalContext, setShowClinicalContext] = useState(true);

  // Tính ULN hiện tại để hiển thị cho bác sĩ
  const currentULNs = PatternEngine.resolveULN(
    input.gender,
    standard,
    customULNs,
    {
      altUln: input.altUln,
      astUln: input.astUln,
      alpUln: input.alpUln,
      ggtUln: input.ggtUln,
    },
    {
      isPregnancyThirdTrimester: input.isPregnancyThirdTrimester,
      isChildOrAdolescent: input.isChildOrAdolescent,
    }
  );

  // Kiểm tra cảnh báo nhầm lẫn đơn vị (Plausibility Safety Check)
  const unitWarnings = UnitConverter.validatePlausibility({
    bilirubin: { value: input.totalBilirubin, unit: units.bilirubin },
    albumin: input.albumin ? { value: input.albumin, unit: units.albumin } : undefined,
    creatinine: input.creatinine ? { value: input.creatinine, unit: units.creatinine } : undefined,
  });

  const handleBilirubinUnitToggle = () => {
    const nextUnit = units.bilirubin === 'umol_l' ? 'mg_dl' : 'umol_l';
    // Chuyển đổi giá trị hiện tại sang đơn vị mới để tránh thay đổi bản chất số liệu
    let newTotal = input.totalBilirubin;
    let newDirect = input.directBilirubin;
    if (nextUnit === 'mg_dl') {
      newTotal = UnitConverter.bilirubinToMgDl(input.totalBilirubin, 'umol_l');
      if (newDirect !== undefined) newDirect = UnitConverter.bilirubinToMgDl(newDirect, 'umol_l');
    } else {
      newTotal = UnitConverter.bilirubinToUmolL(input.totalBilirubin, 'mg_dl');
      if (newDirect !== undefined) newDirect = UnitConverter.bilirubinToUmolL(newDirect, 'mg_dl');
    }
    onUnitsChange({ ...units, bilirubin: nextUnit });
    onChange({
      ...input,
      totalBilirubin: newTotal,
      directBilirubin: newDirect,
      bilirubinUnit: nextUnit,
    });
  };

  const handleAlbuminUnitToggle = () => {
    const nextUnit = units.albumin === 'g_l' ? 'g_dl' : 'g_l';
    let newAlb = input.albumin;
    if (newAlb !== undefined) {
      if (nextUnit === 'g_dl') newAlb = UnitConverter.albuminToGDl(newAlb, 'g_l');
      else newAlb = UnitConverter.albuminToGL(newAlb, 'g_dl');
    }
    onUnitsChange({ ...units, albumin: nextUnit });
    onChange({ ...input, albumin: newAlb, albuminUnit: nextUnit });
  };

  const handleCreatinineUnitToggle = () => {
    const nextUnit = units.creatinine === 'umol_l' ? 'mg_dl' : 'umol_l';
    let newCr = input.creatinine;
    if (newCr !== undefined) {
      if (nextUnit === 'mg_dl') newCr = UnitConverter.creatinineToMgDl(newCr, 'umol_l');
      else newCr = UnitConverter.creatinineToUmolL(newCr, 'mg_dl');
    }
    onUnitsChange({ ...units, creatinine: nextUnit });
    onChange({ ...input, creatinine: newCr, creatinineUnit: nextUnit });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-6">
      {/* Tiêu đề & Nút thao tác nhanh */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-600" />
          <h2 className="text-base font-bold text-slate-800">Thông Số Xét Nghiệm & Lâm Sàng</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition"
            title="Đặt lại thông số mặc định"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Mặc định</span>
          </button>
        </div>
      </div>

      {/* Cảnh báo nhầm lẫn đơn vị (Plausibility Alert) */}
      {unitWarnings.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-3.5 rounded-r-lg space-y-1.5 animate-fadeIn">
          {unitWarnings.map((w, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Cảnh báo nhầm đơn vị: </span>
                {w.message}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 1. KHỐI HÀNH CHÍNH & BỐI CẢNH */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            1. Bệnh Nhân & Bối Cảnh
          </label>
          <button
            type="button"
            onClick={() => setShowClinicalContext(!showClinicalContext)}
            className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1 font-semibold"
          >
            <span>{showClinicalContext ? 'Thu gọn' : 'Chi tiết'}</span>
            {showClinicalContext ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-slate-600 block mb-1">Giới tính</label>
            <div className="grid grid-cols-2 gap-1 p-0.5 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => onChange({ ...input, gender: 'male' })}
                className={`py-1.5 text-xs font-bold rounded-md transition ${
                  input.gender === 'male'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Nam
              </button>
              <button
                type="button"
                onClick={() => onChange({ ...input, gender: 'female' })}
                className={`py-1.5 text-xs font-bold rounded-md transition ${
                  input.gender === 'female'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Nữ
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-600 block mb-1">Tuổi (năm)</label>
            <input
              type="number"
              min="1"
              max="120"
              value={input.age}
              onChange={e => onChange({ ...input, age: Number(e.target.value) || 0 })}
              className="w-full px-3 py-1.5 text-sm font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-slate-600 block mb-1">Cân nặng (kg)</label>
            <input
              type="number"
              min="20"
              max="250"
              value={input.weightKg || ''}
              placeholder="70"
              onChange={e => onChange({ ...input, weightKg: Number(e.target.value) || undefined })}
              className="w-full px-3 py-1.5 text-sm font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-slate-600 block mb-1">Rượu (g/tuần)</label>
            <input
              type="number"
              min="0"
              max="2000"
              value={input.alcoholGramsPerWeek || ''}
              placeholder="0"
              onChange={e =>
                onChange({ ...input, alcoholGramsPerWeek: Number(e.target.value) || undefined })
              }
              className="w-full px-3 py-1.5 text-sm font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              title="Gam cồn tiêu thụ mỗi tuần (>210g ở nam, >140g ở nữ gợi ý bệnh gan do rượu)"
            />
          </div>
        </div>

        {showClinicalContext && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            <label className="flex items-center gap-2 p-2 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                checked={!!input.hasDiabetesOrMetabolicRisk}
                onChange={e => onChange({ ...input, hasDiabetesOrMetabolicRisk: e.target.checked })}
                className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
              />
              <span className="font-medium">Hội chứng chuyển hóa / ĐTĐ type 2</span>
            </label>

            <label className="flex items-center gap-2 p-2 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                checked={!!input.isPregnancyThirdTrimester}
                onChange={e => onChange({ ...input, isPregnancyThirdTrimester: e.target.checked })}
                className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
              />
              <span className="font-medium">Mang thai quý 3 (ALP sinh lý bánh nhau)</span>
            </label>

            <label className="flex items-center gap-2 p-2 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                checked={!!input.isChildOrAdolescent}
                onChange={e => onChange({ ...input, isChildOrAdolescent: e.target.checked })}
                className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
              />
              <span className="font-medium">Trẻ em / Thanh thiếu niên (ALP xương)</span>
            </label>
          </div>
        )}
      </div>

      {/* 2. KHỐI MEN TRANSAMINASE & ENZYME MẬT (U/L) */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>2. Men Transaminase & Enzyme Đường Mật (U/L)</span>
          </label>
          <div className="text-[11px] text-slate-500">
            ULN chuẩn: <span className="font-semibold text-teal-700">{standard.toUpperCase()}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* ALT */}
          <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-rose-900">ALT (SGPT)</span>
              <span className="text-[10px] text-rose-600 font-semibold">
                ULN: {currentULNs.altUln} U/L
              </span>
            </div>
            <input
              type="number"
              min="0"
              value={input.alt}
              onChange={e => onChange({ ...input, alt: Number(e.target.value) || 0 })}
              className="w-full px-2.5 py-1.5 text-base font-bold text-slate-900 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white"
            />
            <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
              <span>Bào tương</span>
              <span className="font-bold text-rose-600">
                {(input.alt / currentULNs.altUln).toFixed(1)}x ULN
              </span>
            </div>
          </div>

          {/* AST */}
          <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-amber-900">AST (SGOT)</span>
              <span className="text-[10px] text-amber-600 font-semibold">
                ULN: {currentULNs.astUln} U/L
              </span>
            </div>
            <input
              type="number"
              min="0"
              value={input.ast}
              onChange={e => onChange({ ...input, ast: Number(e.target.value) || 0 })}
              className="w-full px-2.5 py-1.5 text-base font-bold text-slate-900 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
            />
            <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
              <span>80% Ty thể</span>
              <span className="font-bold text-amber-600">
                {(input.ast / currentULNs.astUln).toFixed(1)}x ULN
              </span>
            </div>
          </div>

          {/* ALP */}
          <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-teal-900">ALP (Kiềm Thổ)</span>
              <span className="text-[10px] text-teal-600 font-semibold">
                ULN: {currentULNs.alpUln} U/L
              </span>
            </div>
            <input
              type="number"
              min="0"
              value={input.alp}
              onChange={e => onChange({ ...input, alp: Number(e.target.value) || 0 })}
              className="w-full px-2.5 py-1.5 text-base font-bold text-slate-900 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
            />
            <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
              <span>Màng vi quản</span>
              <span className="font-bold text-teal-600">
                {(input.alp / currentULNs.alpUln).toFixed(1)}x ULN
              </span>
            </div>
          </div>

          {/* GGT */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-800">GGT</span>
              <span className="text-[10px] text-slate-500 font-semibold">
                ULN: {currentULNs.ggtUln} U/L
              </span>
            </div>
            <input
              type="number"
              min="0"
              value={input.ggt ?? ''}
              placeholder="35"
              onChange={e =>
                onChange({ ...input, ggt: e.target.value ? Number(e.target.value) : undefined })
              }
              className="w-full px-2.5 py-1.5 text-base font-bold text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
            />
            <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
              <span>Xác định gan</span>
              {input.ggt && currentULNs.ggtUln > 0 ? (
                <span className="font-bold text-slate-700">
                  {(input.ggt / currentULNs.ggtUln).toFixed(1)}x ULN
                </span>
              ) : (
                <span className="italic text-slate-400">Tùy chọn</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. KHỐI BILIRUBIN */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            3. Bilirubin & Phân Đoạn
          </label>
          <button
            type="button"
            onClick={handleBilirubinUnitToggle}
            className="text-xs px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 font-bold hover:bg-teal-100 transition flex items-center gap-1"
            title="Bấm để chuyển đổi đơn vị Bilirubin"
          >
            <span>Đơn vị:</span>
            <span className="underline">{units.bilirubin === 'umol_l' ? 'µmol/L (VN)' : 'mg/dL (US)'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-slate-600 font-semibold">
                Bilirubin toàn phần ({units.bilirubin === 'umol_l' ? 'µmol/L' : 'mg/dL'})
              </label>
              <span className="text-[10px] text-slate-400">
                {units.bilirubin === 'umol_l' ? 'BT: < 21 µmol/L' : 'BT: < 1.2 mg/dL'}
              </span>
            </div>
            <input
              type="number"
              step="0.1"
              min="0"
              value={input.totalBilirubin}
              onChange={e => onChange({ ...input, totalBilirubin: Number(e.target.value) || 0 })}
              className="w-full px-3 py-1.5 text-sm font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-slate-600 font-semibold">
                Bilirubin trực tiếp (liên hợp) ({units.bilirubin === 'umol_l' ? 'µmol/L' : 'mg/dL'})
              </label>
              <span className="text-[10px] text-slate-400">
                {input.directBilirubin && input.totalBilirubin > 0
                  ? `${((input.directBilirubin / input.totalBilirubin) * 100).toFixed(0)}% tổng`
                  : 'Tùy chọn'}
              </span>
            </div>
            <input
              type="number"
              step="0.1"
              min="0"
              value={input.directBilirubin ?? ''}
              placeholder="Nhập nếu có..."
              onChange={e =>
                onChange({
                  ...input,
                  directBilirubin: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-full px-3 py-1.5 text-sm font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 4. KHỐI CHỨC NĂNG TỔNG HỢP & XƠ HÓA */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <HeartPulse className="w-3.5 h-3.5 text-indigo-500" />
            <span>4. Chức Năng Tổng Hợp & Đánh Giá Xơ Hóa (FIB-4 / Child-Pugh)</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Albumin */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-slate-600 font-semibold">
                Albumin ({units.albumin === 'g_l' ? 'g/L' : 'g/dL'})
              </label>
              <button
                type="button"
                onClick={handleAlbuminUnitToggle}
                className="text-[10px] text-teal-600 font-bold hover:underline"
              >
                {units.albumin === 'g_l' ? 'Đổi sang g/dL' : 'Đổi sang g/L'}
              </button>
            </div>
            <input
              type="number"
              step="0.1"
              min="0"
              value={input.albumin ?? ''}
              placeholder={units.albumin === 'g_l' ? '40' : '4.0'}
              onChange={e =>
                onChange({ ...input, albumin: e.target.value ? Number(e.target.value) : undefined })
              }
              className="w-full px-3 py-1.5 text-sm font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {units.albumin === 'g_l' ? 'Bình thường: 35 - 50 g/L' : 'Bình thường: 3.5 - 5.0 g/dL'}
            </span>
          </div>

          {/* INR */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-slate-600 font-semibold">PT / INR</label>
              <span className="text-[10px] text-slate-400">ALF nếu &gt;= 1.5</span>
            </div>
            <input
              type="number"
              step="0.05"
              min="0.5"
              max="15"
              value={input.inr ?? ''}
              placeholder="1.0"
              onChange={e =>
                onChange({ ...input, inr: e.target.value ? Number(e.target.value) : undefined })
              }
              className="w-full px-3 py-1.5 text-sm font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 block mt-0.5">Bình thường: 0.9 - 1.15</span>
          </div>

          {/* Tiểu cầu */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-slate-600 font-semibold">Tiểu cầu (G/L hay 10⁹/L)</label>
              <span className="text-[10px] text-slate-400">Dùng tính FIB-4</span>
            </div>
            <input
              type="number"
              min="5"
              max="1500"
              value={input.platelets ?? ''}
              placeholder="200"
              onChange={e =>
                onChange({
                  ...input,
                  platelets: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-full px-3 py-1.5 text-sm font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 block mt-0.5">Bình thường: 150 - 400 G/L</span>
          </div>
        </div>

        {/* Lâm sàng xơ gan: Cổ trướng, Bệnh não gan, Siêu âm đường mật */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div>
            <label className="text-xs text-slate-600 font-semibold block mb-1">
              Cổ trướng (Ascites)
            </label>
            <select
              value={input.ascites || 'none'}
              onChange={e => onChange({ ...input, ascites: e.target.value as AscitesGrade })}
              className="w-full px-2.5 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
            >
              <option value="none">Không có (1 điểm)</option>
              <option value="mild">Nhẹ / Vừa - Đáp ứng lợi tiểu (2 điểm)</option>
              <option value="moderate_severe">Vừa đến Nặng / Căng / Kháng trị (3 điểm)</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-600 font-semibold block mb-1">
              Bệnh não gan (West Haven)
            </label>
            <select
              value={input.encephalopathy || 'none'}
              onChange={e =>
                onChange({ ...input, encephalopathy: e.target.value as EncephalopathyGrade })
              }
              className="w-full px-2.5 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
            >
              <option value="none">Không có (1 điểm)</option>
              <option value="grade_1_2">Độ 1 - 2: Lú lẫn nhẹ, mất ngủ (2 điểm)</option>
              <option value="grade_3_4">Độ 3 - 4: Lơ mơ, hôn mê (3 điểm)</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-600 font-semibold block mb-1">
              Siêu âm đường mật (USG)
            </label>
            <select
              value={input.ultrasoundBiliaryDilatation || 'not_done'}
              onChange={e =>
                onChange({
                  ...input,
                  ultrasoundBiliaryDilatation: e.target.value as UltrasoundBiliaryDilatation,
                })
              }
              className="w-full px-2.5 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
            >
              <option value="not_done">Chưa làm siêu âm</option>
              <option value="non_dilated">Không dãn đường mật (Ứ mật trong gan)</option>
              <option value="dilated">Có dãn đường mật (Sỏi / U tắc mật ngoài)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. KHỐI XÉT NGHIỆM MỞ RỘNG (Creatinine, CK, LDH, Ferritin...) */}
      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setShowAdvancedLabs(!showAdvancedLabs)}
          className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1.5"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{showAdvancedLabs ? 'Ẩn xét nghiệm chuyên khoa sâu' : '+ Thêm xét nghiệm chuyên khoa (Creatinine, CK, LDH, Ferritin, v.v.)'}</span>
          {showAdvancedLabs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showAdvancedLabs && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 animate-fadeIn">
            {/* Creatinine */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-slate-600 font-semibold">
                  Creatinine ({units.creatinine === 'umol_l' ? 'µmol/L' : 'mg/dL'})
                </label>
                <button
                  type="button"
                  onClick={handleCreatinineUnitToggle}
                  className="text-[9px] text-teal-600 font-bold hover:underline"
                >
                  {units.creatinine === 'umol_l' ? 'mg/dL' : 'µmol/L'}
                </button>
              </div>
              <input
                type="number"
                step="0.1"
                value={input.creatinine ?? ''}
                placeholder="mg/dL hoặc µmol/L"
                onChange={e =>
                  onChange({
                    ...input,
                    creatinine: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full px-2.5 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <span className="text-[9px] text-slate-400 block mt-0.5">Dùng tính MELD</span>
            </div>

            {/* CK */}
            <div>
              <label className="text-xs text-slate-600 font-semibold block mb-1">
                Creatine Kinase (CK)
              </label>
              <input
                type="number"
                value={input.ckUL ?? ''}
                placeholder="U/L"
                onChange={e =>
                  onChange({ ...input, ckUL: e.target.value ? Number(e.target.value) : undefined })
                }
                className="w-full px-2.5 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <span className="text-[9px] text-slate-400 block mt-0.5">Loại trừ tiêu cơ vân</span>
            </div>

            {/* LDH */}
            <div>
              <label className="text-xs text-slate-600 font-semibold block mb-1">LDH (U/L)</label>
              <input
                type="number"
                value={input.ldhUL ?? ''}
                placeholder="U/L"
                onChange={e =>
                  onChange({ ...input, ldhUL: e.target.value ? Number(e.target.value) : undefined })
                }
                className="w-full px-2.5 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <span className="text-[9px] text-slate-400 block mt-0.5">Nhận diện gan sốc</span>
            </div>

            {/* Natri máu */}
            <div>
              <label className="text-xs text-slate-600 font-semibold block mb-1">
                Natri máu (Na⁺)
              </label>
              <input
                type="number"
                step="1"
                value={input.sodiumMeqL ?? ''}
                placeholder="135-145 mEq/L"
                onChange={e =>
                  onChange({
                    ...input,
                    sodiumMeqL: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full px-2.5 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <span className="text-[9px] text-slate-400 block mt-0.5">Dùng tính MELD-Na</span>
            </div>

            {/* BMI */}
            <div>
              <label className="text-xs text-slate-600 font-semibold block mb-1">
                Chỉ số BMI (kg/m²)
              </label>
              <input
                type="number"
                step="0.1"
                value={input.bmi ?? ''}
                placeholder="24.5"
                onChange={e =>
                  onChange({
                    ...input,
                    bmi: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full px-2.5 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <span className="text-[9px] text-slate-400 block mt-0.5">Dùng tính NFS & MASLD</span>
            </div>

            {/* Lượng cồn hàng tuần */}
            <div>
              <label className="text-xs text-slate-600 font-semibold block mb-1">
                Cồn tiêu thụ (g/tuần)
              </label>
              <input
                type="number"
                step="10"
                value={input.alcoholGramsPerWeek ?? ''}
                placeholder="gam cồn / tuần"
                onChange={e =>
                  onChange({
                    ...input,
                    alcoholGramsPerWeek: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full px-2.5 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <span className="text-[9px] text-slate-400 block mt-0.5">SLD: Nữ 140g, Nam 210g</span>
            </div>

            {/* 25-OH Vitamin D */}
            <div>
              <label className="text-xs text-slate-600 font-semibold block mb-1">
                25-OH Vitamin D (ng/mL)
              </label>
              <input
                type="number"
                step="1"
                value={input.vitaminDNgMl ?? ''}
                placeholder="ng/mL"
                onChange={e =>
                  onChange({
                    ...input,
                    vitaminDNgMl: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full px-2.5 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <span className="text-[9px] text-slate-400 block mt-0.5">Đánh giá ALP xương</span>
            </div>

            {/* Checkboxes Hàng ngang */}
            <div className="col-span-2 sm:col-span-4 grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200">
              <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 text-xs font-medium cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={Boolean(input.isTakingStatin)}
                  onChange={e => onChange({ ...input, isTakingStatin: e.target.checked })}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span>Đang dùng thuốc Statin hạ mỡ</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 text-xs font-medium cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={Boolean(input.hasDiabetesOrIFG || input.hasDiabetesOrMetabolicRisk)}
                  onChange={e =>
                    onChange({
                      ...input,
                      hasDiabetesOrIFG: e.target.checked,
                      hasDiabetesOrMetabolicRisk: e.target.checked,
                    })
                  }
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span>Đái tháo đường T2 / Rối loạn đường huyết</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 text-xs font-medium cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={Boolean(input.strenuousExercise)}
                  onChange={e => onChange({ ...input, strenuousExercise: e.target.checked })}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span>Vận động thể lực nặng / Tập gym</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

