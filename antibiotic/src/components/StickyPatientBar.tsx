import React from 'react';
import { 
  Activity, 
  Pill, 
  User, 
  Clock, 
  Stethoscope,
  Layers,
  LayoutList,
  Copy,
  Check,
  AlertOctagon,
  Dna
} from 'lucide-react';
import { CalculatedRenalMetrics, DialysisMode, Language, PatientState } from '../types';
import { CDSSAssessmentResult, PatientData } from '../sepsis/types';

export type UnifiedStage = 1 | 2 | 3;

interface StickyPatientBarProps {
  patient: PatientState;
  renal: CalculatedRenalMetrics;
  dialysis: DialysisMode;
  sepsisPatient?: PatientData;
  sepsisResult?: CDSSAssessmentResult;
  selectedDrugName?: string;
  currentStep: UnifiedStage;
  onStepChange: (step: UnifiedStage) => void;
  viewMode: 'stepper' | 'all-in-one';
  onViewModeChange: (mode: 'stepper' | 'all-in-one') => void;
  onCopyUnifiedSummary?: () => void;
  copiedSummary?: boolean;
  onOpenQuickPatient: () => void;
  onOpenDrugSearch?: () => void;
  onExportPdf?: () => void;
  language: Language;
}

export const StickyPatientBar: React.FC<StickyPatientBarProps> = ({
  patient,
  renal,
  dialysis,
  sepsisPatient,
  sepsisResult,
  currentStep,
  onStepChange,
  viewMode,
  onViewModeChange,
  onCopyUnifiedSummary,
  copiedSummary = false,
  onOpenQuickPatient,
  language
}) => {
  const isEn = language === 'en';

  const getCrclStyle = () => {
    if (dialysis !== 'none') return 'bg-purple-50 text-purple-900 border-purple-300';
    if (renal.isArc) return 'bg-teal-50 text-teal-900 border-teal-300';
    if (renal.crcl >= 90) return 'bg-emerald-50 text-emerald-900 border-emerald-300';
    if (renal.crcl >= 60) return 'bg-sky-50 text-sky-900 border-sky-300';
    if (renal.crcl >= 30) return 'bg-amber-50 text-amber-900 border-amber-300';
    return 'bg-rose-50 text-rose-900 border-rose-300';
  };

  const genderText = patient.gender === 'm' ? (isEn ? 'M' : 'Nam') : (isEn ? 'F' : 'Nữ');
  const isEmergency = sepsisResult?.urgencyLevel === 'emergency';
  const isUrgent = sepsisResult?.urgencyLevel === 'urgent';
  const hasPositiveT2 = sepsisPatient?.rapidMolecularT2Done && sepsisPatient?.rapidMolecularResult === 'positive';

  const stages = [
    {
      id: 1 as const,
      short: isEn ? '1. Sepsis & 1h' : '1. Sepsis & Giờ Vàng',
      icon: Stethoscope,
      activeClass: 'bg-rose-600 text-white shadow-sm',
      dot: isEmergency ? 'bg-rose-500 animate-ping' : isUrgent ? 'bg-amber-500' : ''
    },
    {
      id: 2 as const,
      short: isEn ? '2. Regimens & Dose' : '2. Phác Đồ & Liều KS',
      icon: Pill,
      activeClass: 'bg-teal-600 text-white shadow-sm',
      dot: ''
    },
    {
      id: 3 as const,
      short: isEn ? '3. 48-72h AMS' : '3. Tái Đánh Giá 48-72h',
      icon: Clock,
      activeClass: 'bg-indigo-600 text-white shadow-sm',
      dot: hasPositiveT2 ? 'bg-purple-500' : ''
    }
  ];

  const handleStageSelect = (stage: UnifiedStage) => {
    onStepChange(stage);
    if (viewMode === 'all-in-one') {
      const el = document.getElementById(`section-stage-${stage}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* 1. UNIFIED CLINICAL COMMAND & TELEMETRY DOCK (Sticky cleanly right below 54px portal navbar) */}
      <div className="sticky top-[54px] z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs no-print">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-6 py-2">
          <div className="flex items-center justify-between gap-2.5">
            
            {/* LEFT: Patient Capsule (1-Click Quick Edit) */}
            <button
              type="button"
              onClick={onOpenQuickPatient}
              className="flex items-center gap-2 text-left hover:bg-slate-100/80 px-2 py-1 rounded-xl transition-all cursor-pointer group min-w-0 shrink-0"
              title="Bấm để chỉnh sửa nhanh nhân trắc & chức năng thận"
            >
              <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                isEmergency
                  ? 'bg-rose-50 border-rose-300 text-rose-600 group-hover:bg-rose-600 group-hover:text-white'
                  : 'bg-teal-50 border-teal-200 text-teal-700 group-hover:bg-teal-600 group-hover:text-white'
              }`}>
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 leading-tight">
                <div className="font-extrabold text-xs text-slate-900 truncate tabular-nums">
                  {genderText}, {patient.age}t • {patient.weight}kg
                </div>
                <div className="text-[10px] text-slate-500 font-mono tabular-nums truncate">
                  SCr {patient.scr}{patient.scrUnit === 'umol' ? 'µmol' : 'mg'}
                  {patient.height ? ` • ${patient.height}cm` : ''}
                </div>
              </div>
            </button>

            {/* CENTER: 3-Stage Segmented Clinical Pipeline Switcher (Desktop & Tablet) */}
            <div className="hidden md:flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200/90">
              {stages.map((st) => {
                const Icon = st.icon;
                const isActive = viewMode === 'stepper' && currentStep === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleStageSelect(st.id)}
                    className={`relative px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? st.activeClass
                        : 'text-slate-600 hover:text-slate-950 hover:bg-white/80'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{st.short}</span>
                    {st.dot && !isActive && (
                      <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                    )}
                    {st.id === 3 && hasPositiveT2 && !isActive && (
                      <Dna className="w-3 h-3 text-purple-600" />
                    )}
                  </button>
                );
              })}

              <div className="w-px h-5 bg-slate-300/70 mx-0.5" />

              {/* All-in-One / Stepper Toggle */}
              <button
                type="button"
                onClick={() => onViewModeChange(viewMode === 'stepper' ? 'all-in-one' : 'stepper')}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                  viewMode === 'all-in-one'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
                title={viewMode === 'all-in-one' ? 'Đang xem toàn bộ 3 giai đoạn — Bấm để xem từng bước' : 'Xem toàn bộ 3 giai đoạn trên cùng 1 trang'}
              >
                {viewMode === 'all-in-one' ? <LayoutList className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
                <span className="hidden xl:inline">{viewMode === 'all-in-one' ? 'Từng Bước' : 'Toàn Bộ'}</span>
              </button>
            </div>

            {/* RIGHT: Live Telemetry Chips (Sepsis + CrCl) & SBAR+EMR Copy */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Live Sepsis Telemetry Pill */}
              {sepsisResult && (
                <button
                  type="button"
                  onClick={() => handleStageSelect(1)}
                  className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-bold font-mono tabular-nums cursor-pointer transition-all ${
                    isEmergency
                      ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                      : isUrgent
                      ? 'bg-amber-50 text-amber-900 border-amber-300'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                  title={`Sepsis HUD: NEWS2 ${sepsisResult.news2Score} | SOFA ${sepsisResult.sofaScore} | MAP ${sepsisResult.calculatedMap} mmHg`}
                >
                  {isEmergency && <AlertOctagon className="w-3.5 h-3.5 animate-pulse shrink-0" />}
                  <span className="font-sans font-black">
                    {isEmergency ? `KS ≤${sepsisResult.niceAntibioticMaxDelayHours}h` : `NEWS2 ${sepsisResult.news2Score}`}
                  </span>
                  <span className="opacity-70 hidden xl:inline">|</span>
                  <span className="hidden xl:inline">SOFA {sepsisResult.sofaScore}</span>
                </button>
              )}

              {/* Live Renal CrCl Pill */}
              <button
                type="button"
                onClick={onOpenQuickPatient}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] font-bold font-mono tabular-nums cursor-pointer transition-transform active:scale-95 ${getCrclStyle()}`}
                title={`Độ thanh thải Creatinine (Cockcroft-Gault): ${renal.crcl} mL/phút (${renal.categoryLabelVi})`}
              >
                <Activity className="w-3.5 h-3.5 shrink-0" />
                <span>CrCl {renal.crcl}</span>
                {dialysis !== 'none' && (
                  <span className="uppercase text-[9px] font-black bg-purple-700 text-white px-1 py-0.2 rounded">
                    {dialysis}
                  </span>
                )}
              </button>

              {/* 1-Click Unified SBAR + EMR Copy */}
              {onCopyUnifiedSummary && (
                <button
                  type="button"
                  onClick={onCopyUnifiedSummary}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1 cursor-pointer ${
                    copiedSummary
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                  title="Sao chép toàn bộ tóm tắt SBAR Sepsis & Kháng sinh cho Bệnh án EMR/HIS"
                >
                  {copiedSummary ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span className="hidden xl:inline">{copiedSummary ? 'Đã chép' : 'SBAR'}</span>
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* 2. MOBILE BOTTOM NAVIGATION DOCK (3-Stage Tactile Switcher for < md) */}
      <nav aria-label="Clinical stages on mobile" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5 no-print">
        <div className="grid grid-cols-3 gap-1.5">
          {stages.map((st) => {
            const Icon = st.icon;
            const isActive = currentStep === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => handleStageSelect(st.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer relative ${
                  isActive
                    ? st.id === 1
                      ? 'bg-rose-50 text-rose-800 font-bold shadow-2xs ring-1 ring-rose-200'
                      : st.id === 2
                      ? 'bg-teal-50 text-teal-800 font-bold shadow-2xs ring-1 ring-teal-200'
                      : 'bg-indigo-50 text-indigo-800 font-bold shadow-2xs ring-1 ring-indigo-200'
                    : 'text-slate-500 hover:text-slate-900 font-medium'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span className="text-[10px] leading-tight text-center font-bold">
                  {st.id === 1 ? '1. Sepsis' : st.id === 2 ? '2. Phác đồ' : '3. 48-72h'}
                </span>
                {st.id === 1 && isEmergency && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute top-1.5 right-3" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
