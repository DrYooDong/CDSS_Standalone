import React, { useState } from 'react';
import { 
  Activity, 
  Pill, 
  FileText, 
  Copy, 
  Check, 
  AlertTriangle, 
  User, 
  ClipboardCheck, 
  Clock, 
  Edit3, 
  ArrowUp,
  Search,
  Sparkles,
  Layers
} from 'lucide-react';
import { CalculatedRenalMetrics, DialysisMode, Language, PatientState } from '../types';

interface StickyPatientBarProps {
  patient: PatientState;
  renal: CalculatedRenalMetrics;
  dialysis: DialysisMode;
  selectedDrugName?: string;
  currentStep: 1 | 2 | 3 | 4;
  onStepChange: (step: 1 | 2 | 3 | 4) => void;
  onOpenQuickPatient: () => void;
  onOpenDrugSearch?: () => void;
  onExportPdf?: () => void;
  language: Language;
}

export const StickyPatientBar: React.FC<StickyPatientBarProps> = ({
  patient,
  renal,
  dialysis,
  selectedDrugName,
  currentStep,
  onStepChange,
  onOpenQuickPatient,
  onOpenDrugSearch,
  onExportPdf,
  language
}) => {
  const [copied, setCopied] = useState(false);
  const isEn = language === 'en';

  const getCrclColor = () => {
    if (dialysis !== 'none') return 'bg-purple-100 text-purple-900 border-purple-300';
    if (renal.isArc) return 'bg-teal-100 text-teal-900 border-teal-300';
    if (renal.crcl >= 90) return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    if (renal.crcl >= 60) return 'bg-blue-100 text-blue-900 border-blue-300';
    if (renal.crcl >= 30) return 'bg-amber-100 text-amber-900 border-amber-300';
    if (renal.crcl >= 15) return 'bg-orange-100 text-orange-900 border-orange-300';
    return 'bg-rose-100 text-rose-900 border-rose-300';
  };

  const getCrclBadgeBg = () => {
    if (dialysis !== 'none') return 'bg-purple-600 text-white';
    if (renal.isArc) return 'bg-teal-600 text-white';
    if (renal.crcl >= 90) return 'bg-emerald-600 text-white';
    if (renal.crcl >= 60) return 'bg-blue-600 text-white';
    if (renal.crcl >= 30) return 'bg-amber-500 text-white';
    if (renal.crcl >= 15) return 'bg-orange-600 text-white';
    return 'bg-rose-600 text-white';
  };

  const genderText = patient.gender === 'm' ? (isEn ? 'Male' : 'Nam') : (isEn ? 'Female' : 'Nữ');

  return (
    <>
      {/* 1. TOP STICKY PATIENT CAPSULE (Always accessible on Mobile, Tablet & Desktop when scrolled) */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs no-print transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between gap-2">
            
            {/* Left: Patient Quick Glance & Click to Edit */}
            <button
              type="button"
              onClick={onOpenQuickPatient}
              className="flex items-center space-x-2 text-left hover:bg-slate-100/80 p-1 rounded-xl transition-all cursor-pointer group min-w-0"
              title="Nhấn để chỉnh sửa nhanh thông số bệnh nhân"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200/80 text-teal-700 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-2xs">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-black text-xs text-slate-900 truncate">
                    {genderText}, {patient.age} tuổi • {patient.weight} kg
                  </span>
                  <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200/60 hidden md:inline">
                    Chỉnh thông số <Edit3 className="w-2.5 h-2.5 inline ml-0.5" />
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 font-semibold flex items-center gap-1.5 truncate">
                  <span>Scr: {patient.scr} {patient.scrUnit === 'umol' ? 'µmol/L' : 'mg/dL'}</span>
                  {patient.height && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span>{patient.height} cm</span>
                    </>
                  )}
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <span className="text-slate-500 hidden sm:inline">IBW: {renal.ibw} kg</span>
                </div>
              </div>
            </button>

            {/* Right: CrCl Metric Pill + Quick Actions */}
            <div className="flex items-center space-x-1.5 shrink-0">
              
              {/* CrCl Pill Button */}
              <button
                type="button"
                onClick={onOpenQuickPatient}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl border text-xs font-bold transition-transform active:scale-95 cursor-pointer shadow-2xs ${getCrclColor()}`}
                title="Bấm để xem và sửa chi tiết chức năng thận"
              >
                <Activity className="w-3.5 h-3.5" />
                <span className="font-black text-xs">CrCl: {renal.crcl}</span>
                <span className="text-[10px] opacity-75 hidden sm:inline">mL/p</span>
                {dialysis !== 'none' && (
                  <span className="uppercase text-[9px] font-black bg-purple-700 text-white px-1.5 py-0.2 rounded-md ml-0.5">
                    {dialysis}
                  </span>
                )}
              </button>

              {/* Drug Search Quick Trigger */}
              {onOpenDrugSearch && (
                <button
                  type="button"
                  onClick={onOpenDrugSearch}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer border border-slate-200"
                  title="Tìm nhanh trong 43 kháng sinh (Phím tắt /)"
                >
                  <Search className="w-3.5 h-3.5 text-teal-600" />
                  <span className="hidden md:inline">Tra thuốc</span>
                  <kbd className="hidden lg:inline-block px-1 py-0.2 text-[9px] bg-white border border-slate-300 rounded text-slate-500 font-mono">
                    /
                  </kbd>
                </button>
              )}

              {/* PDF Action */}
              {onExportPdf && (
                <button
                  type="button"
                  onClick={onExportPdf}
                  className="p-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition-all cursor-pointer shadow-2xs flex items-center justify-center"
                  title="Xuất phiếu hội chẩn lâm sàng PDF"
                >
                  <FileText className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* 2. MOBILE BOTTOM NAVIGATION DOCK (Thumb-friendly workflow bar for smartphones < 768px) */}
      <nav aria-label="Clinical steps on mobile" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5 no-print">
        <div className="grid grid-cols-4 gap-1">
          
          {/* Step 1 */}
          <button
            type="button"
            onClick={() => onStepChange(1)}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
              currentStep === 1
                ? 'bg-teal-50 text-teal-800 font-bold shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <ClipboardCheck className={`w-4 h-4 mb-0.5 ${currentStep === 1 ? 'text-teal-600' : 'text-slate-400'}`} />
            <span className="text-[10px] leading-tight text-center">
              1. Đánh giá
            </span>
          </button>

          {/* Step 2 */}
          <button
            type="button"
            onClick={() => onStepChange(2)}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
              currentStep === 2
                ? 'bg-teal-50 text-teal-800 font-bold shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <Pill className={`w-4 h-4 mb-0.5 ${currentStep === 2 ? 'text-teal-600' : 'text-slate-400'}`} />
            <span className="text-[10px] leading-tight text-center">
              2. Phác đồ
            </span>
          </button>

          {/* Step 3 */}
          <button
            type="button"
            onClick={() => onStepChange(3)}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer relative ${
              currentStep === 3
                ? 'bg-teal-50 text-teal-800 font-bold shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <Activity className={`w-4 h-4 mb-0.5 ${currentStep === 3 ? 'text-teal-600' : 'text-slate-400'}`} />
            <span className="text-[10px] leading-tight text-center">
              3. Tính liều
            </span>
            {selectedDrugName && (
              <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-teal-500"></span>
            )}
          </button>

          {/* Step 4 */}
          <button
            type="button"
            onClick={() => onStepChange(4)}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
              currentStep === 4
                ? 'bg-teal-50 text-teal-800 font-bold shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <Clock className={`w-4 h-4 mb-0.5 ${currentStep === 4 ? 'text-teal-600' : 'text-slate-400'}`} />
            <span className="text-[10px] leading-tight text-center">
              4. Tái đánh giá
            </span>
          </button>

        </div>
      </nav>
    </>
  );
};
