import React, { useState } from 'react';
import {
  SelectionWizardState,
  Population,
  InfectionSite,
  SepsisSource,
  SpecificPathogenRisk,
  ClinicalResponseStatus,
  CultureStatus,
  SusceptibilityStatus
} from '../../selection/types';
import { classifyRiskGroup } from '../../selection/engine';
import { StepAssessmentAndRegimens } from './StepAssessmentAndRegimens';
import { StepReassess } from './StepReassess';
import { DecisionSummaryCard } from './DecisionSummaryCard';
import { 
  ClipboardCheck, 
  Pill, 
  Clock, 
  LayoutList, 
  Layers,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Copy,
  Check,
  FileText
} from 'lucide-react';

import { DoseResult } from '../../utils/drugDataExtractor';
import { PatientState, CalculatedRenalMetrics } from '../../types';
import { calculateRenalMetrics } from '../../utils/clinicalFormulas';

interface SelectionWizardProps {
  currentStage: 1 | 2;
  onStageChange: (stage: 1 | 2) => void;
  onSelectDrugForDosing: (drugId?: string) => void;
  onOpenGuidelineAtlas?: (imageId?: string) => void;
  dosingResult?: DoseResult | null;
  selectedDrugId?: string;
  patient?: PatientState;
  renal?: CalculatedRenalMetrics;
  onCalculateDoseForDrug?: (drugId: string) => void;
  onPatientChange?: (updated: Partial<PatientState>) => void;
  onExportPdf?: () => void;
  detailedDrugId?: string | null;
  onToggleDetailedDrug?: (drugId: string | null) => void;
  children?: React.ReactNode; // Dosing & Safety Workspace
}

export const SelectionWizard: React.FC<SelectionWizardProps> = ({
  currentStage,
  onStageChange,
  onSelectDrugForDosing,
  onOpenGuidelineAtlas,
  dosingResult,
  selectedDrugId,
  patient,
  renal,
  onCalculateDoseForDrug,
  onPatientChange,
  onExportPdf,
  detailedDrugId: externalDetailedDrugId,
  onToggleDetailedDrug: externalToggleDetailedDrug,
  children
}) => {
  const [viewMode, setViewMode] = useState<'stepper' | 'all-in-one'>('stepper');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [internalDetailedDrugId, setInternalDetailedDrugId] = useState<string | null>(null);

  const activeDetailedDrugId = externalDetailedDrugId !== undefined ? externalDetailedDrugId : internalDetailedDrugId;
  const handleToggleDetailed = (dId: string | null) => {
    if (externalToggleDetailedDrug) {
      externalToggleDetailedDrug(dId);
    } else {
      setInternalDetailedDrugId(dId);
    }
    if (dId) {
      onSelectDrugForDosing(dId);
    }
  };

  const activePatient: PatientState = patient || {
    scr: 90,
    scrUnit: 'umol',
    age: 60,
    gender: 'm',
    weight: 60,
    height: 165,
    dialysis: 'none'
  };
  const activeRenal: CalculatedRenalMetrics = renal || calculateRenalMetrics(activePatient);

  // Clinical State
  const [indicationConfirmed, setIndicationConfirmed] = useState<boolean>(true);
  const [population, setPopulation] = useState<Population>('adult');
  const [site, setSite] = useState<InfectionSite>('respiratory');
  const [sepsisSource, setSepsisSource] = useState<SepsisSource | undefined>(undefined);
  const [checkedGeneralRiskIds, setCheckedGeneralRiskIds] = useState<string[]>([
    'hospital_90d',
    'invasive_device',
    'iv_abx_30d'
  ]);
  const [sofaScore, setSofaScore] = useState<number>(8);
  const [psofaScore, setPsofaScore] = useState<number>(0);
  const [clifSofaScore, setClifSofaScore] = useState<number>(0);
  const [isChronicLiverDisease, setIsChronicLiverDisease] = useState<boolean>(false);
  const [checkedSpecificRisks, setCheckedSpecificRisks] = useState<SpecificPathogenRisk[]>([
    'pseudo_acineto',
    'mrsa'
  ]);
  const [checkedSpecificRiskFactorIds, setCheckedSpecificRiskFactorIds] = useState<string[]>([
    'ps_icu_5d',
    'ps_devices',
    'mrsa_cvc_foley'
  ]);

  // 48-72h State
  const [clinicalResponse, setClinicalResponse] = useState<ClinicalResponseStatus>('improved');
  const [cultureStatus, setCultureStatus] = useState<CultureStatus>('pending');
  const [susceptibilityStatus, setSusceptibilityStatus] = useState<SusceptibilityStatus>('sensitive');
  const [daysOnAntibiotic, setDaysOnAntibiotic] = useState<number>(3);

  const handleToggleSpecificRisk = (risk: SpecificPathogenRisk) => {
    setCheckedSpecificRisks(prev =>
      prev.includes(risk) ? prev.filter(x => x !== risk) : [...prev, risk]
    );
  };

  const handleToggleGeneralRisk = (factorId: string) => {
    setCheckedGeneralRiskIds(prev =>
      prev.includes(factorId) ? prev.filter(x => x !== factorId) : [...prev, factorId]
    );
  };

  const handleToggleSpecificRiskFactor = (factorId: string) => {
    setCheckedSpecificRiskFactorIds(prev => {
      const next = prev.includes(factorId) ? prev.filter(x => x !== factorId) : [...prev, factorId];
      // Automatically sync corresponding SpecificPathogenRisk
      let riskType: SpecificPathogenRisk | null = null;
      if (factorId.startsWith('mrsa_')) riskType = 'mrsa';
      else if (factorId.startsWith('esbl_')) riskType = 'esbl';
      else if (factorId.startsWith('ps_')) riskType = 'pseudo_acineto';
      else if (factorId.startsWith('ent_')) riskType = 'enterococcus';
      else if (factorId.startsWith('candida_')) riskType = 'candida';

      if (riskType) {
        if (!next.includes(factorId)) {
          const hasOther = next.some(id => {
            if (riskType === 'mrsa') return id.startsWith('mrsa_');
            if (riskType === 'esbl') return id.startsWith('esbl_');
            if (riskType === 'pseudo_acineto') return id.startsWith('ps_');
            if (riskType === 'enterococcus') return id.startsWith('ent_');
            if (riskType === 'candida') return id.startsWith('candida_');
            return false;
          });
          if (!hasOther) {
            setCheckedSpecificRisks(r => r.filter(x => x !== riskType));
          }
        } else {
          setCheckedSpecificRisks(r => (r.includes(riskType!) ? r : [...r, riskType!]));
        }
      }
      return next;
    });
  };

  // Severity & Risk Classification
  const activeSeverity = {
    scoreType: population === 'pediatric' ? ('psofa' as const) : isChronicLiverDisease ? ('clif_sofa' as const) : ('sofa' as const),
    scoreValue: population === 'pediatric' ? psofaScore : isChronicLiverDisease ? clifSofaScore : sofaScore
  };

  const riskResult = classifyRiskGroup(
    checkedGeneralRiskIds,
    activeSeverity,
    population,
    checkedSpecificRisks,
    site,
    checkedSpecificRiskFactorIds
  );

  // Quick 1-click group adjust
  const handleQuickGroupSelect = (targetGroup: 'group_1' | 'group_2') => {
    if (targetGroup === 'group_1') {
      setCheckedGeneralRiskIds([]);
      setCheckedSpecificRisks([]);
      setCheckedSpecificRiskFactorIds([]);
      setSofaScore(0);
      setPsofaScore(0);
      setClifSofaScore(0);
    } else {
      if (!checkedGeneralRiskIds.includes('hospital_90d')) {
        setCheckedGeneralRiskIds(prev => [...prev, 'hospital_90d', 'iv_abx_30d']);
      }
      if (!checkedSpecificRisks.includes('pseudo_acineto')) {
        setCheckedSpecificRisks(prev => [...prev, 'pseudo_acineto']);
      }
      if (sofaScore < 2) setSofaScore(4);
    }
  };

  // Compile wizard state object for DecisionSummaryCard
  const wizardState: SelectionWizardState = {
    currentStep: (currentStage === 1 ? 1 : currentStage === 2 ? 4 : 5) as 1 | 2 | 3 | 4 | 5,
    indicationConfirmed,
    nhsnCheckedIds: [],
    population,
    site,
    sepsisSource,
    checkedGeneralRiskIds,
    checkedSpecificRiskFactorIds,
    sofaScore,
    psofaScore,
    clifSofaScore,
    isChronicLiverDisease,
    checkedSpecificRisks,
    clinicalResponse,
    cultureStatus,
    susceptibilityStatus,
    checkedStopCriteriaIds: [],
    checkedIvToPoCriteriaIds: [],
    daysOnAntibiotic
  };

  // Copy clinical consultation summary to clipboard
  const handleCopyConsultationSummary = () => {
    const isGroup2 = riskResult.group === 'group_2';
    const siteNames: Record<string, string> = {
      respiratory: 'Hô hấp (HAP/VAP/CAP)',
      sepsis: 'Nhiễm khuẩn huyết / Sốc nhiễm khuẩn',
      skin_soft_tissue: 'Nhiễm trùng Da & Mô mềm',
      urinary: 'Nhiễm trùng Tiết niệu',
      peritoneal: 'Viêm phúc mạc / Dịch báng (SBP)',
      gastrointestinal: 'Tiêu hóa - Ổ bụng',
      cns: 'Thần kinh trung ương'
    };

    const text = `=== TÓM TẮT HỘI CHẨN LÂM SÀNG & KHÁNG SINH (InfectoDose CDSS) ===
THÔNG SỐ LÂM SÀNG: ${population === 'adult' ? 'Người lớn' : 'Trẻ em'}, ${patient?.age} tuổi, ${patient?.gender === 'm' ? 'Nam' : 'Nữ'} | Cân nặng: ${patient?.weight} kg (IBW ${renal?.ibw} kg, BMI ${renal?.bmi})
CHỨC NĂNG THẬN: Scr ${patient?.scr} ${patient?.scrUnit === 'umol' ? 'µmol/L' : 'mg/dL'} | CrCl: ${renal?.crcl} mL/phút (${renal?.categoryLabelVi}) | Lọc máu: ${patient?.dialysis === 'none' ? 'Không' : patient?.dialysis?.toUpperCase()}
Ổ NHIỄM TRÙNG: ${siteNames[site] || site} | Đối tượng: ${population === 'adult' ? 'Người lớn' : 'Trẻ em'}
ĐIỂM ĐỘ NẶNG: SOFA ${activeSeverity.scoreValue} điểm
PHÂN TẦNG NGUY CƠ: ${isGroup2 ? 'NHÓM 2 (Nguy cơ cao vi khuẩn đa kháng MDR)' : 'NHÓM 1 (Ít nguy cơ VKĐK)'}
KHÁNG SINH CHỈ ĐỊNH: ${selectedDrugId?.toUpperCase() || 'Kháng sinh theo phác đồ BVBND 2026'}
${dosingResult ? `LIỀU CÁ THỂ HÓA: Liều duy trì: ${dosingResult.maintenanceDoseTextVi} | Cách dùng: ${dosingResult.infusionInstructionsVi}` : ''}
KẾ HOẠCH: Tái đánh giá đáp ứng lâm sàng & vi sinh sau 48-72 giờ; xuống thang kháng sinh đồ khi có kết quả cấy.`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  // 2 Unified Clinical Stages (Step 1: Phác đồ & Tính liều, Step 2: Tái đánh giá 48-72h)
  const stagesList = [
    {
      stage: 1 as const,
      badge: '1. Phác Đồ & Tính Liều',
      sub: 'BVBND 2026 • Tính liều trực tiếp',
      title: 'Phác Đồ & Cá Thể Hóa Liều',
      desc: 'Đánh giá ổ nhiễm, phân tầng nguy cơ VKĐK, tính liều trực tiếp theo CrCl và bảng chi tiết kháng sinh',
      icon: <Pill className="w-4 h-4" />
    },
    {
      stage: 2 as const,
      badge: '2. Tái Đánh Giá',
      sub: '48-72h • Xuống thang KSĐ',
      title: 'Tái Đánh Giá 48-72h & Quản Lý Kháng Sinh (AMS)',
      desc: 'Đáp ứng lâm sàng & KSĐ • Xuống thang • Ngưng KS / Chuyển đường uống IV-to-PO',
      icon: <Clock className="w-4 h-4" />
    }
  ];

  return (
    <div className="space-y-4">
      
      {/* Top Clinical Pipeline Header & View Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-2.5 sm:p-3 shadow-xs">
        
        {/* Top meta row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-100 text-teal-800">
              Quy Trình 2 Bước
            </span>
            <span className="text-[11px] text-slate-500 hidden md:inline">
              BVBND 2026 • Tính Liều Trực Tiếp &amp; Bảng Cụ Thể • Tái Đánh Giá 48-72h
            </span>
          </div>

          <div className="flex items-center space-x-1.5 self-end sm:self-auto">
            {/* Copy Summary Button */}
            <button
              type="button"
              onClick={handleCopyConsultationSummary}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer border ${
                copiedSummary
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
              title="Sao chép toàn bộ tóm tắt hội chẩn để dán vào Bệnh án EMR/HIS"
              aria-label="Sao chép tóm tắt EMR"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span className="text-[11px]">{copiedSummary ? 'Đã sao chép' : 'EMR'}</span>
            </button>

            {/* View Mode Toggle */}
            <div className="inline-flex rounded-xl p-0.5 bg-slate-100 border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setViewMode('stepper')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1 ${
                  viewMode === 'stepper'
                    ? 'bg-white text-teal-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Chế độ Từng Bước lâm sàng"
                aria-label="Từng bước"
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Từng Bước</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('all-in-one')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1 ${
                  viewMode === 'all-in-one'
                    ? 'bg-white text-teal-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Chế độ Xem Toàn Bộ trên 1 trang"
                aria-label="Toàn bộ"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Toàn Bộ</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2-Step Interactive Pipeline Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {stagesList.map((st) => {
            const isActive = currentStage === st.stage;
            const isCompleted = currentStage > st.stage;

            return (
              <button
                key={st.stage}
                type="button"
                onClick={() => {
                  onStageChange(st.stage);
                  if (viewMode === 'all-in-one') {
                    const el = document.getElementById(`section-stage-${st.stage}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                title={st.desc}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center space-x-2.5 ${
                  isActive
                    ? 'border-teal-500 bg-teal-50/90 ring-2 ring-teal-500/20 text-teal-950 shadow-xs'
                    : isCompleted
                    ? 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                    : 'border-slate-100 bg-slate-50/60 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-bold text-xs ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 text-white" /> : st.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 truncate">
                      {st.badge}
                    </span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0"></span>
                    )}
                  </div>
                  <div className="text-[10px] font-semibold text-slate-500 truncate mt-0.5">
                    {st.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Mobile Quick Decision Banner (Always visible on mobile & tablet) */}
        <div className="lg:hidden mt-3 p-3 rounded-2xl border bg-slate-50/80 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2.5 min-w-0">
            {riskResult.group === 'group_2' ? (
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-black text-slate-900 truncate">
                  {riskResult.group === 'group_2' ? 'Nhóm 2: Nguy cơ cao VKĐK' : 'Nhóm 1: Ít nguy cơ VKĐK'}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  riskResult.group === 'group_2' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {riskResult.isHighSeverity ? 'Nặng (SOFA ≥2)' : 'Tiêu chuẩn'}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 truncate mt-0.5">
                {population === 'adult' ? 'Người lớn' : 'Trẻ em'} • SOFA: {activeSeverity.scoreValue}đ • CrCl: {activeRenal.crcl} mL/p
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {currentStage === 1 ? (
              <button
                type="button"
                onClick={() => {
                  onStageChange(2);
                  window.scrollTo({ top: 80, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-xs flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>Sang Bước 2</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onStageChange(1);
                  window.scrollTo({ top: 80, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 shadow-xs flex items-center justify-center space-x-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Về Bước 1</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Main Clinical Content Area */}
      <div className="w-full space-y-6">
        
        {/* ============================================================== */}
        {/* STEP 1: UNIFIED CLINICAL ASSESSMENT, REGIMENS & DIRECT DOSING */}
        {/* ============================================================== */}
        {(viewMode === 'all-in-one' || currentStage === 1) && (
          <div id="section-stage-1" className="space-y-4">
            {viewMode === 'all-in-one' && (
              <div className="flex items-center space-x-2 pt-2 pb-1 border-b border-slate-200">
                <span className="w-6 h-6 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center justify-center">1</span>
                <h2 className="text-base font-extrabold text-slate-900">
                  Bước 1: Đánh Giá, Lựa Chọn Phác Đồ BVBND 2026 &amp; Cá Thể Hóa Tính Liều
                </h2>
              </div>
            )}
            
            <StepAssessmentAndRegimens
              site={site}
              onSelectSite={setSite}
              population={population}
              onSelectPopulation={setPopulation}
              isChronicLiverDisease={isChronicLiverDisease}
              onToggleChronicLiver={setIsChronicLiverDisease}
              sepsisSource={sepsisSource}
              onSelectSepsisSource={setSepsisSource}
              riskResult={riskResult}
              onQuickGroupSelect={handleQuickGroupSelect}
              sofaScore={sofaScore}
              onSofaChange={setSofaScore}
              psofaScore={psofaScore}
              onPsofaChange={setPsofaScore}
              clifSofaScore={clifSofaScore}
              onClifSofaChange={setClifSofaScore}
              checkedSpecificRisks={checkedSpecificRisks}
              onToggleSpecificRisk={handleToggleSpecificRisk}
              checkedGeneralRiskIds={checkedGeneralRiskIds}
              onToggleGeneralRisk={handleToggleGeneralRisk}
              checkedSpecificRiskFactorIds={checkedSpecificRiskFactorIds}
              onToggleSpecificRiskFactor={handleToggleSpecificRiskFactor}
              patient={activePatient}
              renal={activeRenal}
              selectedDrugId={selectedDrugId || 'meropenem'}
              onSelectDrug={(drugId) => {
                onSelectDrugForDosing(drugId);
                handleToggleDetailed(drugId);
              }}
              detailedDrugId={activeDetailedDrugId}
              onToggleDetailedDrug={handleToggleDetailed}
              onNextStep={() => {
                onStageChange(2);
                window.scrollTo({ top: 80, behavior: 'smooth' });
              }}
              onOpenGuidelineAtlas={onOpenGuidelineAtlas}
            />
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 2: 48-72h REASSESSMENT & ANTIMICROBIAL STEWARDSHIP (AMS) */}
        {/* ============================================================== */}
        {(viewMode === 'all-in-one' || currentStage === 2) && (
          <div id="section-stage-2" className="space-y-6">
            {viewMode === 'all-in-one' && (
              <div className="flex items-center space-x-2 pt-4 pb-1 border-b border-slate-200">
                <span className="w-6 h-6 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center justify-center">2</span>
                <h2 className="text-base font-extrabold text-slate-900">
                  Bước 2: Tái Đánh Giá 48-72h, Xuống Thang &amp; Quản Lý Kháng Sinh (AMS)
                </h2>
              </div>
            )}

            <StepReassess
              site={site}
              onOpenGuidelineAtlas={onOpenGuidelineAtlas}
              onSelectDrugForDosing={(drugId) => {
                onSelectDrugForDosing(drugId);
                handleToggleDetailed(drugId);
                onStageChange(1);
                setTimeout(() => {
                  const el = document.getElementById('detailed-drug-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              onPrevStep={() => {
                onStageChange(1);
                window.scrollTo({ top: 80, behavior: 'smooth' });
              }}
            />

            {/* Master CDSS Decision Summary Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DecisionSummaryCard
                state={wizardState}
                riskResult={riskResult}
                onNavigateStep={(s) => {
                  onStageChange(s as 1 | 2);
                  window.scrollTo({ top: 80, behavior: 'smooth' });
                }}
                onSwitchToDosing={(drugId) => {
                  const targetDrug = drugId || selectedDrugId || 'meropenem';
                  onSelectDrugForDosing(targetDrug);
                  handleToggleDetailed(targetDrug);
                  onStageChange(1);
                  setTimeout(() => {
                    const el = document.getElementById('detailed-drug-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                currentStage={currentStage}
              />

              {/* Consultation Next Steps Card */}
              <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white p-5 rounded-3xl shadow-md border border-teal-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-teal-400 text-xs font-black uppercase tracking-wider mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Hành Động Khuyến Nghị Tiếp Theo</span>
                  </div>
                  <h3 className="text-lg font-black text-white mb-2">
                    Hoàn Tất Quy Trình Hội Chẩn InfectoDose CDSS
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Bạn đã hoàn thành đánh giá toàn diện 2 bước từ tiếp nhận, phân tầng nguy cơ &amp; lựa chọn phác đồ BVBND 2026 kèm tính liều trực tiếp theo CrCl {activeRenal.crcl} mL/phút, và lập kế hoạch tái đánh giá 48-72h.
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/10 flex flex-wrap gap-2">
                  {onExportPdf && (
                    <button
                      type="button"
                      onClick={onExportPdf}
                      className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Xuất Phiếu Hội Chẩn PDF</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleCopyConsultationSummary}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center space-x-1.5 cursor-pointer border border-white/20"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copiedSummary ? 'Đã sao chép tóm tắt EMR' : 'Sao chép tóm tắt EMR'}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
