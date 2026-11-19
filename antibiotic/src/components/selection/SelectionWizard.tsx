import React, { useCallback, useEffect, useState } from 'react';
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
import {
  ClinicalScoreId,
  ScoreCalculationResult,
  ScoreSuggestedAction
} from '../../selection/scoring/scoringTypes';
import { classifyRiskGroup } from '../../selection/engine';
import { StepAssessmentAndRegimens } from './StepAssessmentAndRegimens';
import { StepReassess } from './StepReassess';
import { DecisionSummaryCard } from './DecisionSummaryCard';
import { CompactPatientForm } from '../sepsis/CompactPatientForm';
import { SepsisDashboard } from '../sepsis/SepsisDashboard';
import { PRESET_CASES, PresetCase } from '../../sepsis/presetCases';
import { CDSSAssessmentResult, PatientData } from '../../sepsis/types';
import {
  buildUnifiedConsultationSummary,
  deriveAntibioticBridgeFromSepsis
} from '../../sepsis/patientBridge';
import { 
  Sparkles,
  Activity,
  Copy,
  Check,
  FileText,
  Stethoscope,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';

import { DoseResult } from '../../utils/drugDataExtractor';
import { PatientState, CalculatedRenalMetrics } from '../../types';
import { calculateRenalMetrics } from '../../utils/clinicalFormulas';
import { UnifiedStage } from '../StickyPatientBar';

interface SelectionWizardProps {
  currentStage: UnifiedStage;
  onStageChange: (stage: UnifiedStage) => void;
  viewMode: 'stepper' | 'all-in-one';
  onViewModeChange: (mode: 'stepper' | 'all-in-one') => void;
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
  // Unified Sepsis State
  sepsisPatient: PatientData;
  sepsisResult: CDSSAssessmentResult;
  onSepsisPatientChange: (updated: PatientData) => void;
  onSelectPreset: (preset: PresetCase) => void;
  onSaveCase: () => void;
  saveSuccess: boolean;
  onOpenSepsisGuide: () => void;
  sepsisSyncToken: number;
  children?: React.ReactNode;
}

export const SelectionWizard: React.FC<SelectionWizardProps> = ({
  currentStage,
  onStageChange,
  viewMode,
  onSelectDrugForDosing,
  onOpenGuidelineAtlas,
  dosingResult,
  selectedDrugId,
  patient,
  renal,
  onExportPdf,
  detailedDrugId: externalDetailedDrugId,
  onToggleDetailedDrug: externalToggleDetailedDrug,
  sepsisPatient,
  sepsisResult,
  onSepsisPatientChange,
  onSelectPreset,
  onSaveCase,
  saveSuccess,
  onOpenSepsisGuide,
  sepsisSyncToken
}) => {
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [internalDetailedDrugId, setInternalDetailedDrugId] = useState<string | null>(null);
  const [isSepsisFormCollapsed, setIsSepsisFormCollapsed] = useState(false);
  const [sepsisMobileTab, setSepsisMobileTab] = useState<'input' | 'dashboard'>('dashboard');

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

  // Compute live bridge snapshot from Sepsis
  const bridgeSnapshot = deriveAntibioticBridgeFromSepsis(sepsisPatient, sepsisResult);

  // Clinical State (Stage 2 Antibiotic Selection)
  const [indicationConfirmed] = useState<boolean>(true);
  const [population, setPopulation] = useState<Population>(bridgeSnapshot.population);
  const [site, setSite] = useState<InfectionSite>(bridgeSnapshot.site);
  const [sepsisSource, setSepsisSource] = useState<SepsisSource | undefined>(bridgeSnapshot.sepsisSource);
  const [checkedGeneralRiskIds, setCheckedGeneralRiskIds] = useState<string[]>(
    bridgeSnapshot.generalRiskIds.length > 0
      ? bridgeSnapshot.generalRiskIds
      : ['hospital_90d', 'invasive_device', 'iv_abx_30d']
  );
  const [sofaScore, setSofaScore] = useState<number>(bridgeSnapshot.sofaScore);
  const [psofaScore, setPsofaScore] = useState<number>(bridgeSnapshot.psofaScore);
  const [clifSofaScore, setClifSofaScore] = useState<number>(0);
  const [isChronicLiverDisease, setIsChronicLiverDisease] = useState<boolean>(false);
  const [checkedSpecificRisks, setCheckedSpecificRisks] = useState<SpecificPathogenRisk[]>(
    bridgeSnapshot.specificRisks
  );
  const [checkedSpecificRiskFactorIds, setCheckedSpecificRiskFactorIds] = useState<string[]>(
    bridgeSnapshot.specificRiskFactorIds
  );
  const [savedScores, setSavedScores] = useState<Partial<Record<ClinicalScoreId, ScoreCalculationResult>>>({});
  const [isManuallyOverridden, setIsManuallyOverridden] = useState<boolean>(false);

  // 48-72h State
  const [clinicalResponse] = useState<ClinicalResponseStatus>('improved');
  const [cultureStatus] = useState<CultureStatus>('pending');
  const [susceptibilityStatus] = useState<SusceptibilityStatus>('sensitive');
  const [daysOnAntibiotic] = useState<number>(3);

  // Apply bridge snapshot helper
  const applyBridgeFromSepsis = useCallback(() => {
    const snap = deriveAntibioticBridgeFromSepsis(sepsisPatient, sepsisResult);
    setPopulation(snap.population);
    setSite(snap.site);
    setSepsisSource(snap.sepsisSource);
    setSofaScore(snap.sofaScore);
    setPsofaScore(snap.psofaScore);
    setCheckedGeneralRiskIds(snap.generalRiskIds);
    setCheckedSpecificRisks(snap.specificRisks);
    setCheckedSpecificRiskFactorIds(snap.specificRiskFactorIds);
    setIsManuallyOverridden(false);
  }, [sepsisPatient, sepsisResult]);

  // Auto-sync whenever Sepsis data is modified in Stage 1 or a preset/history case is loaded
  useEffect(() => {
    if (sepsisSyncToken > 0) {
      applyBridgeFromSepsis();
    }
  }, [sepsisSyncToken]);

  const handleToggleSpecificRisk = (risk: SpecificPathogenRisk) => {
    setIsManuallyOverridden(true);
    setCheckedSpecificRisks(prev =>
      prev.includes(risk) ? prev.filter(x => x !== risk) : [...prev, risk]
    );
  };

  const handleToggleGeneralRisk = (factorId: string) => {
    setIsManuallyOverridden(true);
    setCheckedGeneralRiskIds(prev =>
      prev.includes(factorId) ? prev.filter(x => x !== factorId) : [...prev, factorId]
    );
  };

  const handleToggleSpecificRiskFactor = (factorId: string) => {
    setIsManuallyOverridden(true);
    setCheckedSpecificRiskFactorIds(prev => {
      const next = prev.includes(factorId) ? prev.filter(x => x !== factorId) : [...prev, factorId];
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
    setIsManuallyOverridden(true);
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

  const handleSaveScoreResult = useCallback((result: ScoreCalculationResult) => {
    setSavedScores(prev => {
      const existing = prev[result.scoreId];
      if (
        existing &&
        existing.totalScore === result.totalScore &&
        existing.displayScoreText === result.displayScoreText &&
        existing.riskClassVi === result.riskClassVi
      ) {
        return prev;
      }
      return { ...prev, [result.scoreId]: result };
    });
  }, []);

  const handleApplyScoreSuggestion = useCallback(
    (action: ScoreSuggestedAction) => {
      setIsManuallyOverridden(true);
      if (action.suggestSofaScore !== undefined) {
        setSofaScore(action.suggestSofaScore);
      }
      if (action.suggestPsofaScore !== undefined) {
        setPsofaScore(action.suggestPsofaScore);
      }
      if (action.suggestClifSofaScore !== undefined) {
        setClifSofaScore(action.suggestClifSofaScore);
        setIsChronicLiverDisease(true);
      }
      if (action.suggestGroup === 'group_1') {
        setCheckedGeneralRiskIds([]);
        setCheckedSpecificRisks([]);
        setCheckedSpecificRiskFactorIds([]);
        setSofaScore(0);
        setPsofaScore(0);
        setClifSofaScore(0);
      } else if (action.suggestGroup === 'group_2') {
        setCheckedGeneralRiskIds(prev =>
          prev.length > 0 ? prev : ['hospital_90d']
        );
      }
      if (action.suggestSpecificRisks && action.suggestSpecificRisks.length > 0) {
        setCheckedSpecificRisks(prev =>
          Array.from(new Set([...prev, ...action.suggestSpecificRisks!]))
        );
      }
    },
    []
  );

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
    daysOnAntibiotic,
    calculatedScores: savedScores as Record<string, ScoreCalculationResult>
  };

  // Copy Unified Sepsis SBAR + Antibiotic EMR Consultation Summary
  const handleCopyConsultationSummary = () => {
    const text = buildUnifiedConsultationSummary({
      patient: activePatient,
      renal: activeRenal,
      sepsisPatient,
      sepsisResult,
      site,
      riskGroupLabelVi: riskResult.group === 'group_2' ? 'NHÓM 2 (Nguy cơ cao VKĐK MDR)' : 'NHÓM 1 (Ít nguy cơ VKĐK)',
      selectedDrugName: selectedDrugId?.toUpperCase(),
      doseSummaryVi: dosingResult
        ? `${dosingResult.loadingDoseTextVi ? `Liều nạp ${dosingResult.loadingDoseTextVi} | ` : ''}Liều duy trì ${dosingResult.maintenanceDoseTextVi} | ${dosingResult.infusionInstructionsVi}`
        : undefined
    });
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="space-y-6">

      {/* ============================================================== */}
      {/* STAGE 1: SEPSIS SCREENING, MULTI-SCORES & HOUR-1 RESUSCITATION */}
      {/* ============================================================== */}
      {(viewMode === 'all-in-one' || currentStage === 1) && (
        <section id="section-stage-1" className="space-y-3.5 scroll-mt-32">
          {viewMode === 'all-in-one' && (
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
              <span className="w-7 h-7 rounded-xl bg-rose-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                01
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                  Giai Đoạn 1: Sàng Lọc Sepsis Đa Thang Điểm &amp; Phác Đồ Giờ Vàng (0–1h)
                </h2>
                <p className="text-[11px] text-slate-500">NEWS2 • Sepsis-3 SOFA • Phoenix 2024 • Obstetric SOFA • LP-NEWS • NICE NG253 • NLR</p>
              </div>
            </div>
          )}

          {/* Sleek Quick Clinical Presets Strip */}
          <div className="bg-white/90 rounded-2xl border border-slate-200/90 px-3 py-2 shadow-2xs flex items-center gap-2 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1.5 shrink-0 pr-2 border-r border-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[11px] font-extrabold text-slate-700 whitespace-nowrap">Ca lâm sàng mẫu:</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {PRESET_CASES.map((c) => {
                const isSelectedPreset = sepsisPatient.id === c.patientData.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onSelectPreset(c);
                      if (window.innerWidth < 1024) {
                        setSepsisMobileTab('dashboard');
                      }
                    }}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg whitespace-nowrap transition-all cursor-pointer border ${
                      isSelectedPreset
                        ? 'bg-slate-900 text-teal-300 border-slate-900 shadow-2xs'
                        : 'bg-slate-50 border-slate-200/90 hover:border-teal-400 hover:bg-teal-50/40 text-slate-700'
                    }`}
                  >
                    {c.title.split(':')[0]} • {c.category.split('-')[0].trim()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile View Toggle (Input Form vs Results Dashboard) */}
          <div className="lg:hidden bg-white p-1 rounded-xl border border-slate-200 grid grid-cols-2 gap-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setSepsisMobileTab('input')}
              className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                sepsisMobileTab === 'input'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Nhập Khám &amp; CLS</span>
            </button>
            <button
              type="button"
              onClick={() => setSepsisMobileTab('dashboard')}
              className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors relative cursor-pointer ${
                sepsisMobileTab === 'dashboard'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Kết Quả &amp; Giờ Vàng</span>
              {sepsisResult.urgencyLevel === 'emergency' && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute top-2 right-3" />
              )}
            </button>
          </div>

          {/* Unified Split Cockpit: Sticky Scrollable Left Intake Dock + Fluid Right Command Dashboard */}
          <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-5">
            <div className={`transition-all duration-200 shrink-0 ${
              sepsisMobileTab === 'dashboard' ? 'hidden lg:block' : 'block'
            } ${
              isSepsisFormCollapsed
                ? 'w-full lg:w-16'
                : 'w-full lg:w-[360px] xl:w-[390px] lg:sticky lg:top-[116px] lg:max-h-[calc(100vh-132px)] lg:overflow-y-auto cockpit-dock-scroll lg:pr-1'
            }`}>
              <CompactPatientForm
                data={sepsisPatient}
                onChange={onSepsisPatientChange}
                isCollapsed={isSepsisFormCollapsed}
                onToggleCollapse={() => setIsSepsisFormCollapsed(!isSepsisFormCollapsed)}
                crcl={activeRenal.crcl}
              />
            </div>

            <div className={`w-full flex-1 min-w-0 ${
              sepsisMobileTab === 'input' ? 'hidden lg:block' : 'block'
            }`}>
              <SepsisDashboard
                patient={sepsisPatient}
                result={sepsisResult}
                renal={activeRenal}
                onSaveCase={onSaveCase}
                saveSuccess={saveSuccess}
                onSelectDrugForDosing={(drugId) => {
                  onSelectDrugForDosing(drugId);
                  handleToggleDetailed(drugId);
                }}
                onGoToAntibioticStage={() => {
                  applyBridgeFromSepsis();
                  onStageChange(2);
                  window.scrollTo({ top: 60, behavior: 'smooth' });
                }}
                onGoToReassessStage={() => {
                  applyBridgeFromSepsis();
                  onStageChange(3);
                  window.scrollTo({ top: 60, behavior: 'smooth' });
                }}
                onOpenSepsisGuide={onOpenSepsisGuide}
              />
            </div>
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* STAGE 2: ANTIBIOTIC MDR STRATIFICATION, REGIMENS & DOSING      */}
      {/* ============================================================== */}
      {(viewMode === 'all-in-one' || currentStage === 2) && (
        <section id="section-stage-2" className="space-y-4 scroll-mt-32">
          {viewMode === 'all-in-one' && (
            <div className="flex items-center gap-2.5 pt-2 pb-2 border-b border-slate-200">
              <span className="w-7 h-7 rounded-xl bg-teal-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                02
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                  Giai Đoạn 2: Phân Tầng MDR, Phác Đồ BVBND 2026 &amp; Tính Liều 43 Kháng Sinh
                </h2>
                <p className="text-[11px] text-slate-500">Nhóm 1 / Nhóm 2 VKĐK • BVBND 2026 vs WHO AWaRe • CrCl / HD / CRRT / DDI</p>
              </div>
            </div>
          )}

          {/* Compact Sepsis-to-Antibiotic Live Context Ribbon */}
          <div className={`px-3.5 py-2.5 rounded-2xl border shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
            sepsisResult.urgencyLevel === 'emergency'
              ? 'bg-rose-50/80 border-rose-200 text-rose-950'
              : 'bg-white border-slate-200/90 text-slate-800'
          }`}>
            <div className="flex items-center gap-2 min-w-0">
              <span className={`w-2 h-2 rounded-full shrink-0 ${
                sepsisResult.urgencyLevel === 'emergency' ? 'bg-rose-600 animate-pulse' : 'bg-teal-500'
              }`} />
              <div className="truncate flex items-center gap-1.5 flex-wrap">
                <span className="font-extrabold text-slate-900">Đồng bộ Sepsis:</span>
                <span className="font-mono font-bold text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200/80">
                  SOFA {bridgeSnapshot.sofaScore}đ
                </span>
                <span className="font-mono font-bold text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200/80">
                  NEWS2 {sepsisResult.news2Score}
                </span>
                <span className="text-[11px] font-semibold text-slate-600 truncate">
                  {sepsisResult.actions.antibioticTiming.split('.')[0]}
                </span>
                {bridgeSnapshot.isMaternal && (
                  <span className="px-1.5 py-0.5 rounded bg-pink-100 text-pink-800 text-[10px] font-extrabold border border-pink-200">
                    Sản khoa (Thai kỳ/Hậu sản)
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {isManuallyOverridden && (
                <button
                  type="button"
                  onClick={applyBridgeFromSepsis}
                  className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  title="Khôi phục đồng bộ SOFA, Ổ nhiễm & YTNC từ Giai đoạn 1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Đồng bộ lại từ Sepsis</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  onStageChange(1);
                  window.scrollTo({ top: 60, behavior: 'smooth' });
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Sepsis (Bước 1)</span>
              </button>
            </div>
          </div>
          
          <StepAssessmentAndRegimens
            site={site}
            onSelectSite={(s) => {
              setIsManuallyOverridden(true);
              setSite(s);
            }}
            population={population}
            onSelectPopulation={(p) => {
              setIsManuallyOverridden(true);
              setPopulation(p);
            }}
            isChronicLiverDisease={isChronicLiverDisease}
            onToggleChronicLiver={setIsChronicLiverDisease}
            sepsisSource={sepsisSource}
            onSelectSepsisSource={(src) => {
              setIsManuallyOverridden(true);
              setSepsisSource(src);
            }}
            riskResult={riskResult}
            onQuickGroupSelect={handleQuickGroupSelect}
            sofaScore={sofaScore}
            onSofaChange={(val) => {
              setIsManuallyOverridden(true);
              setSofaScore(val);
            }}
            psofaScore={psofaScore}
            onPsofaChange={(val) => {
              setIsManuallyOverridden(true);
              setPsofaScore(val);
            }}
            clifSofaScore={clifSofaScore}
            onClifSofaChange={(val) => {
              setIsManuallyOverridden(true);
              setClifSofaScore(val);
            }}
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
              onStageChange(3);
              window.scrollTo({ top: 60, behavior: 'smooth' });
            }}
            onOpenGuidelineAtlas={onOpenGuidelineAtlas}
            savedScores={savedScores}
            onSaveScoreResult={handleSaveScoreResult}
            onApplyScoreSuggestion={handleApplyScoreSuggestion}
          />
        </section>
      )}

      {/* ============================================================== */}
      {/* STAGE 3: 48-72h REASSESSMENT & ANTIMICROBIAL STEWARDSHIP (AMS) */}
      {/* ============================================================== */}
      {(viewMode === 'all-in-one' || currentStage === 3) && (
        <section id="section-stage-3" className="space-y-5 scroll-mt-32">
          {viewMode === 'all-in-one' && (
            <div className="flex items-center gap-2.5 pt-2 pb-2 border-b border-slate-200">
              <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                03
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                  Giai Đoạn 3: Tái Đánh Giá 48–72h, Phác Đồ Đích MDR &amp; Quản Lý Kháng Sinh (AMS)
                </h2>
                <p className="text-[11px] text-slate-500">Động học Lactate/PCT/NLR • T2MR CRE/CRAB/DTR-PA • Ngưng KS &amp; Chuyển IV-to-PO</p>
              </div>
            </div>
          )}

          <StepReassess
            site={site}
            onOpenGuidelineAtlas={onOpenGuidelineAtlas}
            sepsisPatient={sepsisPatient}
            sepsisResult={sepsisResult}
            suggestedMdrCategory={bridgeSnapshot.suggestedMdrCategory}
            suggestedCreEnzyme={bridgeSnapshot.suggestedCreEnzyme}
            onSelectDrugForDosing={(drugId) => {
              onSelectDrugForDosing(drugId);
              handleToggleDetailed(drugId);
            }}
            onPrevStep={() => {
              onStageChange(2);
              window.scrollTo({ top: 60, behavior: 'smooth' });
            }}
          />

          {/* Master CDSS Decision Summary & Export Deck */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DecisionSummaryCard
              state={wizardState}
              riskResult={riskResult}
              onNavigateStep={(s) => {
                onStageChange(s === 1 ? 2 : 3);
                window.scrollTo({ top: 60, behavior: 'smooth' });
              }}
              onSwitchToDosing={(drugId) => {
                const targetDrug = drugId || selectedDrugId || 'meropenem';
                onSelectDrugForDosing(targetDrug);
                handleToggleDetailed(targetDrug);
              }}
              currentStage={currentStage === 3 ? 2 : 1}
            />

            {/* Unified Consultation Export Deck */}
            <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-5 rounded-2xl shadow-sm border border-teal-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-teal-300 text-[11px] font-black uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Hoàn Tất Hồ Sơ Hội Chẩn Siêu Hệ Thống</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white mb-2">
                  InfectoSepsis CDSS v4.0 — Báo Cáo Tổng Hợp
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Tích hợp đầy đủ dữ liệu 3 giai đoạn: Đánh giá Sepsis &amp; Giờ vàng (NEWS2 {sepsisResult.news2Score}, SOFA {sepsisResult.sofaScore}đ, MAP {sepsisResult.calculatedMap} mmHg), Phân tầng MDR &amp; Tính liều theo CrCl {activeRenal.crcl} mL/p, và kế hoạch xuống thang AMS 48–72h.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/10 flex flex-wrap gap-2">
                {onExportPdf && (
                  <button
                    type="button"
                    onClick={onExportPdf}
                    className="px-4 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
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
                  {copiedSummary ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSummary ? 'Đã sao chép SBAR + EMR' : 'Sao chép SBAR + EMR'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
};
