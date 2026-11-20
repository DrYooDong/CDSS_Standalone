/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { PatientSidebar } from './components/PatientSidebar';
import { StickyPatientBar, UnifiedStage } from './components/StickyPatientBar';
import { QuickPatientDrawer } from './components/QuickPatientDrawer';
import { DrugSearchModal } from './components/DrugSearchModal';
import { AntibioticSearch } from './components/AntibioticSearch';
import { DosingRecommendationCard } from './components/DosingRecommendationCard';
import { RenalAdjustmentTable } from './components/RenalAdjustmentTable';
import { DialysisPanel } from './components/DialysisPanel';
import { DrugInteractionChecker } from './components/DrugInteractionChecker';
import { ClinicalNotesTiers } from './components/ClinicalNotesTiers';
import { ReferencesList } from './components/ReferencesList';
import { AmrModal } from './components/AmrModal';
import { AntibioticSpectrumModal } from './components/AntibioticSpectrumModal';
import { OriginalPreviewModal } from './components/OriginalPreviewModal';
import { PdfConsultationModal } from './components/PdfConsultationModal';
import { GuidelineImageModal } from './components/selection/GuidelineImageModal';
import { DrugDetailModal } from './components/DrugDetailModal';
import { ClinicalGuideModal } from './components/sepsis/ClinicalGuideModal';
import { CaseHistoryModal } from './components/sepsis/CaseHistoryModal';
import { PresetCasesModal } from './components/sepsis/PresetCasesModal';

import { 
  Pill, 
  Droplets, 
  ShieldAlert, 
  FileText, 
  BookOpen, 
  LayoutGrid
} from 'lucide-react';

import { SelectionWizard } from './components/selection/SelectionWizard';
import { Language, PatientState } from './types';
import { ANTIBIOTICS } from './data/antibiotics';
import { DRUG_INTERACTIONS } from './data/drugInteractions';
import { calculateRenalMetrics } from './utils/clinicalFormulas';
import { extractDrugData, calculateDose, DoseResult } from './utils/drugDataExtractor';
import { ConsultationReportData } from './utils/pdfGenerator';

// Unified Sepsis Engine & Bridge
import { PatientData } from './sepsis/types';
import { evaluatePatientCDSS } from './sepsis/calculators';
import { NORMAL_PATIENT_CASE, PresetCase } from './sepsis/presetCases';
import {
  buildUnifiedConsultationSummary,
  syncRenalToSepsisPatient,
  syncSepsisToRenalPatient
} from './sepsis/patientBridge';

const DEFAULT_PATIENT: PatientState = {
  scr: 90,
  scrUnit: 'umol',
  age: 60,
  gender: 'm',
  weight: 60,
  height: 165,
  dialysis: 'none'
};

interface SavedRecord {
  id: string;
  savedAt: string;
  patientData: PatientData;
}

type ViewSectionTab = 'all' | 'dosing' | 'dialysis' | 'ddi' | 'notes' | 'refs';

function getInitialStage(): UnifiedStage {
  if (typeof window === 'undefined') return 2;
  try {
    const params = new URLSearchParams(window.location.search);
    const stageParam = params.get('stage');
    if (stageParam === '1' || stageParam === '2' || stageParam === '3') {
      return Number(stageParam) as UnifiedStage;
    }
    const tabParam = (params.get('tab') || '').toLowerCase();
    if (tabParam === 'sepsis') return 1;
    if (tabParam === 'antibiotic' || tabParam === 'dosing') return 2;
    if (tabParam === 'reassess' || tabParam === 'ams') return 3;

    const winStage = (window as unknown as { __CDSS_INITIAL_STAGE__?: number }).__CDSS_INITIAL_STAGE__;
    if (winStage === 1 || winStage === 2 || winStage === 3) {
      return winStage;
    }
    if (window.location.pathname.toLowerCase().includes('/sepsis')) {
      return 1;
    }
  } catch {
    // ignore URL parse errors
  }
  return 2;
}

function buildInitialSepsisPatient(initialStage: UnifiedStage): PatientData {
  if (initialStage === 1) {
    return {
      ...NORMAL_PATIENT_CASE,
      id: 'current-patient'
    };
  }
  return {
    ...NORMAL_PATIENT_CASE,
    id: 'current-patient',
    ageYears: DEFAULT_PATIENT.age,
    gender: DEFAULT_PATIENT.gender === 'f' ? 'female' : 'male',
    weightKg: DEFAULT_PATIENT.weight,
    heightCm: DEFAULT_PATIENT.height || 165,
    dialysis: DEFAULT_PATIENT.dialysis,
    creatinineUmolL: DEFAULT_PATIENT.scr
  };
}

export default function App() {
  const [initialStage] = useState<UnifiedStage>(() => getInitialStage());
  const [language, setLanguage] = useState<Language>('vi');
  const [sepsisPatient, setSepsisPatient] = useState<PatientData>(() => buildInitialSepsisPatient(initialStage));
  const [patient, setPatient] = useState<PatientState>(() => {
    if (initialStage === 1) {
      return syncSepsisToRenalPatient(NORMAL_PATIENT_CASE, {
        ...DEFAULT_PATIENT,
        age: NORMAL_PATIENT_CASE.ageYears,
        weight: NORMAL_PATIENT_CASE.weightKg,
        height: NORMAL_PATIENT_CASE.heightCm || 168
      });
    }
    return DEFAULT_PATIENT;
  });
  const [sepsisSyncToken, setSepsisSyncToken] = useState<number>(0);

  const [selectedDrugId, setSelectedDrugId] = useState<string>('meropenem');
  const [selectedScenario, setSelectedScenario] = useState<string>('standard');
  const [currentStep, setCurrentStep] = useState<UnifiedStage>(initialStage);
  const [viewMode, setViewMode] = useState<'stepper' | 'all-in-one'>('stepper');
  const [detailedDrugId, setDetailedDrugId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ViewSectionTab>('all');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Saved Cases History (Compatible with existing SepsisCDSS localStorage)
  const [savedCases, setSavedCases] = useState<SavedRecord[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Drawers & Modals
  const [isQuickPatientOpen, setIsQuickPatientOpen] = useState(false);
  const [isDrugSearchOpen, setIsDrugSearchOpen] = useState(false);
  const [isAmrOpen, setIsAmrOpen] = useState(false);
  const [isSpectrumOpen, setIsSpectrumOpen] = useState(false);
  const [isOriginalOpen, setIsOriginalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isGuidelineAtlasOpen, setIsGuidelineAtlasOpen] = useState(false);
  const [guidelineAtlasImageId, setGuidelineAtlasImageId] = useState<string | undefined>(undefined);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isSepsisGuideOpen, setIsSepsisGuideOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load saved cases from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sepsis_cdss_saved_cases');
      if (stored) {
        setSavedCases(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse saved cases:', e);
    }
  }, []);

  // Global keyboard shortcut '/' to open instant drug search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsDrugSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Live Sepsis CDSS Assessment
  const sepsisResult = useMemo(() => {
    return evaluatePatientCDSS(sepsisPatient);
  }, [sepsisPatient]);

  const handleOpenGuidelineAtlas = (imageId?: string) => {
    setGuidelineAtlasImageId(imageId);
    setIsGuidelineAtlasOpen(true);
  };

  const activeDrug = useMemo(() => {
    return ANTIBIOTICS.find(a => a.id === selectedDrugId) || ANTIBIOTICS[0];
  }, [selectedDrugId]);

  const drugDetails = useMemo(() => {
    return extractDrugData(selectedDrugId);
  }, [selectedDrugId]);

  // When drug changes, reset scenario to its default
  useEffect(() => {
    const defScn = drugDetails.scenarios.find(s => s.def) || drugDetails.scenarios[0];
    if (defScn) {
      setSelectedScenario(defScn.key);
    }
  }, [selectedDrugId, drugDetails]);

  // Calculate renal metrics (CrCl, IBW, AdjBW, BMI, category, ARC)
  const renal = useMemo(() => {
    return calculateRenalMetrics(patient, drugDetails.weightRule);
  }, [patient, drugDetails]);

  // Calculate recommended dosing
  const doseResult = useMemo(() => {
    return calculateDose(drugDetails, renal, selectedScenario, patient);
  }, [drugDetails, renal, selectedScenario, patient]);

  const [dosingResult, setDosingResult] = useState<DoseResult | null>(null);

  useEffect(() => {
    setDosingResult(doseResult);
  }, [doseResult]);

  // Bidirectional Patient Sync Handlers
  const handlePatientChange = (updated: Partial<PatientState>) => {
    setPatient(prev => {
      const nextRenal = { ...prev, ...updated };
      setSepsisPatient(prevSepsis => syncRenalToSepsisPatient(updated, prevSepsis, nextRenal));
      return nextRenal;
    });
  };

  const handleSepsisPatientChange = (updated: PatientData) => {
    setSepsisPatient(updated);
    setPatient(prevRenal => syncSepsisToRenalPatient(updated, prevRenal));
    setSepsisSyncToken(t => t + 1);
  };

  const handleSelectPreset = (preset: PresetCase) => {
    const cloned = { ...preset.patientData };
    setSepsisPatient(cloned);
    setPatient(prevRenal => syncSepsisToRenalPatient(cloned, prevRenal));
    setSepsisSyncToken(t => t + 1);
    setIsPresetsOpen(false);
  };

  const handleSaveCurrentCase = () => {
    const newRecord: SavedRecord = {
      id: `rec-${Date.now()}`,
      savedAt: new Date().toISOString(),
      patientData: {
        ...sepsisPatient,
        heightCm: patient.height || sepsisPatient.heightCm,
        dialysis: patient.dialysis
      }
    };
    const updated = [newRecord, ...savedCases].slice(0, 30);
    setSavedCases(updated);
    try {
      localStorage.setItem('sepsis_cdss_saved_cases', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleDeleteCase = (id: string) => {
    const updated = savedCases.filter((c) => c.id !== id);
    setSavedCases(updated);
    localStorage.setItem('sepsis_cdss_saved_cases', JSON.stringify(updated));
  };

  const handleClearAllCases = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử ca bệnh đã lưu?')) {
      setSavedCases([]);
      localStorage.removeItem('sepsis_cdss_saved_cases');
    }
  };

  const handleLoadCase = (data: PatientData) => {
    const cloned = { ...data };
    setSepsisPatient(cloned);
    setPatient(prevRenal => syncSepsisToRenalPatient(cloned, prevRenal));
    setSepsisSyncToken(t => t + 1);
  };

  // Handle direct calculation for drug
  const handleCalculateDoseInSelection = (drugId: string, autoScrollToDosing = false) => {
    const exists = ANTIBIOTICS.some(a => a.id === drugId);
    if (exists) {
      setSelectedDrugId(drugId);
      const details = extractDrugData(drugId);
      const r = calculateRenalMetrics(patient, details.weightRule);
      const defScn = details.scenarios.find(s => s.def) || details.scenarios[0];
      const scnKey = defScn ? defScn.key : 'standard';
      const result = calculateDose(details, r, scnKey, patient);
      setDosingResult(result);

      if (autoScrollToDosing) {
        setTimeout(() => {
          const el = document.getElementById('unified-dosing-workspace') || document.getElementById('dosing-card-anchor');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 80);
      }
    }
  };

  // Specific interactions for this drug
  const drugInteractions = useMemo(() => {
    return DRUG_INTERACTIONS.filter(di => di.antibioticIds.includes(selectedDrugId));
  }, [selectedDrugId]);

  const handleReset = () => {
    const resetSepsis = buildInitialSepsisPatient(currentStep);
    setSepsisPatient(resetSepsis);
    setPatient(syncSepsisToRenalPatient(resetSepsis, DEFAULT_PATIENT));
    setSepsisSyncToken(t => t + 1);
    setSelectedDrugId('meropenem');
    setSelectedScenario('standard');
    setDetailedDrugId(null);
    setActiveTab('all');
  };

  const handleSelectDrugFromSelection = (drugId?: string) => {
    if (drugId) {
      setSelectedDrugId(drugId);
      handleCalculateDoseInSelection(drugId, false);
      setDetailedDrugId(drugId);
    }
  };

  const activeScenarioObj = drugDetails.scenarios.find(s => s.key === selectedScenario);
  const scenarioLabel = language === 'en' 
    ? (activeScenarioObj?.labelEn || activeScenarioObj?.label || 'Standard') 
    : (activeScenarioObj?.label || 'Tiêu chuẩn');

  const reportData: ConsultationReportData = {
    patient,
    renal,
    drug: activeDrug,
    drugDetails,
    doseResult,
    interactions: drugInteractions,
    scenarioLabel,
    language,
    sepsisPatient,
    sepsisResult
  };

  const isEn = language === 'en';
  const showDesktopRenalSidebar = !(currentStep === 1 && viewMode === 'stepper');

  const handleCopyUnifiedSummary = () => {
    const text = buildUnifiedConsultationSummary({
      patient,
      renal,
      sepsisPatient,
      sepsisResult,
      selectedDrugName: activeDrug.name,
      doseSummaryVi: doseResult
        ? `${doseResult.loadingDoseTextVi ? `Liều nạp ${doseResult.loadingDoseTextVi} | ` : ''}Liều duy trì ${doseResult.maintenanceDoseTextVi} | ${doseResult.infusionInstructionsVi}`
        : undefined
    });
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2200);
  };

  // Render Live Dosing & Safety Workspace (Housed inside DrugDetailModal)
  const renderDosingWorkspace = () => (
    <div id="unified-dosing-workspace" className="space-y-4">
      
      {/* 1. Instant Antibiotic Search & Switcher Bar */}
      <AntibioticSearch
        antibiotics={ANTIBIOTICS}
        selectedId={selectedDrugId}
        onSelect={(drugId) => {
          setSelectedDrugId(drugId);
          handleCalculateDoseInSelection(drugId);
          setDetailedDrugId(drugId);
        }}
        language={language}
      />

      {/* 3. Clinical Section Segmented Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-1.5 no-print">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-teal-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{isEn ? 'All Sections' : 'Tất cả'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dosing')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'dosing'
                ? 'bg-teal-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>{isEn ? 'Dose & CrCl Table' : 'Liều & Bảng CrCl'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dialysis')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'dialysis'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-purple-500" />
            <span>{isEn ? 'Dialysis (HD/CRRT)' : 'Lọc máu (HD/CRRT)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ddi')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'ddi'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            <span>{isEn ? 'Interactions' : 'Tương tác thuốc'}</span>
            {drugInteractions.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${activeTab === 'ddi' ? 'bg-white text-rose-600' : 'bg-rose-100 text-rose-700'}`}>
                {drugInteractions.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-500" />
            <span>{isEn ? 'Clinical Guidance (Tier 1-3)' : 'Lưu ý Dược lý'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('refs')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'refs'
                ? 'bg-slate-800 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>{isEn ? 'References' : 'Tài liệu tham khảo'}</span>
          </button>
        </div>
      </div>

      {/* 4. Primary Dosing Recommendation Hero Card */}
      {(activeTab === 'all' || activeTab === 'dosing') && (
        <div id="dosing-card-anchor">
          <DosingRecommendationCard
            drugDetails={drugDetails}
            doseResult={doseResult}
            renal={renal}
            selectedScenario={selectedScenario}
            onScenarioChange={setSelectedScenario}
            language={language}
            onExportPdf={() => setIsPdfModalOpen(true)}
          />
        </div>
      )}

      {/* 5. Complete Renal Adjustment Stratification Table */}
      {(activeTab === 'all' || activeTab === 'dosing') && (
        <div id="renal-table-section">
          <RenalAdjustmentTable
            drugDetails={drugDetails}
            renal={renal}
            selectedScenario={selectedScenario}
            language={language}
          />
        </div>
      )}

      {/* 6. Dialysis / RRT Protocol Panel */}
      {(activeTab === 'all' || activeTab === 'dialysis') && (
        <div id="dialysis-section">
          <DialysisPanel
            drugDetails={drugDetails}
            dialysis={patient.dialysis}
            language={language}
          />
        </div>
      )}

      {/* 7. Automatic Drug-Drug Interaction Warning System */}
      {(activeTab === 'all' || activeTab === 'ddi') && (
        <div id="ddi-section">
          <DrugInteractionChecker
            antibioticId={selectedDrugId}
            antibioticName={activeDrug.name}
            language={language}
          />
        </div>
      )}

      {/* 8. Tier 1, 2, 3 Clinical Guidance & Pharmacotherapy Notes */}
      {(activeTab === 'all' || activeTab === 'notes') && (
        <div id="notes-section">
          <ClinicalNotesTiers
            drugDetails={drugDetails}
            language={language}
          />
        </div>
      )}

      {/* 9. Evidence Base & Clinical References */}
      {(activeTab === 'all' || activeTab === 'refs') && (
        <div id="references-section">
          <ReferencesList
            drugDetails={drugDetails}
            language={language}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen cockpit-canvas flex flex-col selection:bg-teal-600 selection:text-white pb-24 md:pb-8">
      
      {/* 1. Executive Clinical Command Header (Scroll-away, Cleanly Grouped) */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        onReset={handleReset}
        onOpenAmr={() => setIsAmrOpen(true)}
        onOpenSpectrum={() => setIsSpectrumOpen(true)}
        onOpenOriginal={() => setIsOriginalOpen(true)}
        onOpenPdfModal={() => setIsPdfModalOpen(true)}
        onOpenGuidelineAtlas={() => handleOpenGuidelineAtlas()}
        onOpenDrugSearch={() => setIsDrugSearchOpen(true)}
        onOpenQuickPatient={() => setIsQuickPatientOpen(true)}
        onOpenPresets={() => setIsPresetsOpen(true)}
        onOpenSepsisGuide={() => setIsSepsisGuideOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        savedCount={savedCases.length}
        selectedDrugName={activeDrug.name}
      />

      {/* 2. Unified Sticky Clinical Command & Live Telemetry Dock (Zero Overlap with 54px Portal Navbar) */}
      <StickyPatientBar
        patient={patient}
        renal={renal}
        dialysis={patient.dialysis}
        sepsisPatient={sepsisPatient}
        sepsisResult={sepsisResult}
        selectedDrugName={activeDrug.name}
        currentStep={currentStep}
        onStepChange={(step) => {
          setCurrentStep(step);
          if (viewMode === 'stepper') {
            window.scrollTo({ top: 56, behavior: 'smooth' });
          }
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onCopyUnifiedSummary={handleCopyUnifiedSummary}
        copiedSummary={copiedSummary}
        onOpenQuickPatient={() => setIsQuickPatientOpen(true)}
        onOpenDrugSearch={() => setIsDrugSearchOpen(true)}
        onExportPdf={() => setIsPdfModalOpen(true)}
        language={language}
      />

      {/* 3. Main Clinical Cockpit Workspace */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-3 sm:px-5 lg:px-6 py-4 sm:py-5">
        
        <div className="lg:flex lg:gap-5 items-start">
          
          {/* Left Cockpit Dock (Stages 2-3 & All-in-One): Independently Scrollable Renal & Sepsis HUD */}
          {showDesktopRenalSidebar && (
            <aside 
              aria-label="Patient and Renal Parameters" 
              className={`hidden lg:block shrink-0 mb-6 lg:mb-0 transition-all duration-200 lg:sticky lg:top-[116px] lg:max-h-[calc(100vh-132px)] lg:overflow-y-auto cockpit-dock-scroll lg:pr-1 ${
                isSidebarCollapsed 
                  ? 'lg:w-[250px] xl:w-[270px]' 
                  : 'lg:w-[340px] xl:w-[365px]'
              }`}
            >
              <PatientSidebar
                patient={patient}
                onChange={handlePatientChange}
                renal={renal}
                dialysis={patient.dialysis}
                sepsisResult={sepsisResult}
                onGoToSepsisStage={() => {
                  setCurrentStep(1);
                  window.scrollTo({ top: 56, behavior: 'smooth' });
                }}
                language={language}
                needsHeight={activeDrug.needsHeight}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              />
            </aside>
          )}

          {/* Right/Main Column: 3-Stage Unified Clinical Pipeline */}
          <div className="flex-1 min-w-0 space-y-6">
            <SelectionWizard
              currentStage={currentStep}
              onStageChange={(st) => setCurrentStep(st)}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onSelectDrugForDosing={handleSelectDrugFromSelection}
              onOpenGuidelineAtlas={handleOpenGuidelineAtlas}
              dosingResult={dosingResult}
              selectedDrugId={selectedDrugId}
              patient={patient}
              renal={renal}
              onCalculateDoseForDrug={handleCalculateDoseInSelection}
              onPatientChange={handlePatientChange}
              onExportPdf={() => setIsPdfModalOpen(true)}
              detailedDrugId={detailedDrugId}
              onToggleDetailedDrug={(dId) => {
                setDetailedDrugId(dId);
                if (dId) {
                  setSelectedDrugId(dId);
                  handleCalculateDoseInSelection(dId, false);
                }
              }}
              sepsisPatient={sepsisPatient}
              sepsisResult={sepsisResult}
              onSepsisPatientChange={handleSepsisPatientChange}
              onSelectPreset={handleSelectPreset}
              onSaveCase={handleSaveCurrentCase}
              saveSuccess={saveSuccess}
              onOpenSepsisGuide={() => setIsSepsisGuideOpen(true)}
              sepsisSyncToken={sepsisSyncToken}
            />
          </div>

        </div>

      </main>

      {/* Printable Consultation Report Structure for direct Ctrl+P */}
      <div className="print-only p-8 text-black bg-white">
        <div className="border-b-2 border-black pb-4 mb-4 flex justify-between">
          <div>
            <h1 className="text-xl font-bold uppercase">BỆNH VIỆN - HỘI CHẨN HỒI SỨC &amp; DƯỢC LÂM SÀNG</h1>
            <h2 className="text-sm font-semibold">PHIẾU ĐÁNH GIÁ SEPSIS &amp; QUẢN LÝ LIỀU KHÁNG SINH (CDSS)</h2>
          </div>
          <div className="text-right text-xs">
            <p>Thời điểm tính: {new Date().toLocaleDateString('vi-VN')}</p>
            <p className="font-semibold text-slate-600">INFECTOSEPSIS CDSS v4.0 SUPER</p>
          </div>
        </div>

        <div className="mb-3 text-xs">
          <p><strong>Thông số nhân trắc:</strong> {patient.age} tuổi / {patient.gender === 'm' ? 'Nam' : 'Nữ'} | <strong>Cân nặng:</strong> {patient.weight} kg {patient.height ? `| Chiều cao: ${patient.height} cm (IBW: ${renal.ibw} kg, BMI: ${renal.bmi})` : ''}</p>
          <p><strong>Sinh hóa &amp; Thận:</strong> Scr: {renal.scrUmol} µmol/L ({renal.scrMgdl} mg/dL) | <strong>CrCl (Cockcroft-Gault):</strong> {renal.crcl} mL/phút ({renal.categoryLabelVi}) {patient.dialysis !== 'none' ? `| Lọc máu: ${patient.dialysis.toUpperCase()}` : ''}</p>
        </div>

        <div className="border border-black p-3 mb-3 text-xs">
          <p className="text-sm font-bold uppercase">Đánh giá Sepsis &amp; Huyết động: {sepsisResult.primaryDiagnosis.replace('_', ' ')}</p>
          <p><strong>Điểm số:</strong> NEWS2: {sepsisResult.news2Score} | SOFA: {sepsisResult.sofaScore} | LP-NEWS: {sepsisResult.lpNewsScore} | SIRS: {sepsisResult.sirsScore}/4 | qSOFA: {sepsisResult.qsofaScore}/3 | NLR: {sepsisResult.calculatedNlr ?? 'N/A'}</p>
          <p><strong>Sinh hiệu:</strong> HA {sepsisPatient.sbp}/{sepsisPatient.dbp} (MAP {sepsisResult.calculatedMap} mmHg) | HR {sepsisPatient.heartRate} | RR {sepsisPatient.respiratoryRate} | T° {sepsisPatient.temperature}°C | SpO2 {sepsisPatient.spo2}% | Lactate: {sepsisPatient.lactateInitial ?? 'N/A'} mmol/L</p>
          <p><strong>Khung giờ vàng NICE:</strong> {sepsisResult.actions.antibioticTiming}</p>
        </div>

        <div className="border border-black p-3 mb-4 text-xs">
          <p className="text-sm font-bold">Kháng sinh chỉ định: {activeDrug.name} ({activeDrug.group})</p>
          <p>Phác đồ / Kịch bản: {scenarioLabel}</p>
          {doseResult.loadingDoseTextVi && <p><strong>Liều nạp:</strong> {doseResult.loadingDoseTextVi}</p>}
          <p><strong>Liều duy trì:</strong> {doseResult.maintenanceDoseTextVi}</p>
          <p><strong>Cách dùng:</strong> {doseResult.infusionInstructionsVi}</p>
        </div>

        <div className="mb-4 text-xs">
          <p><strong>Cơ sở hiệu chỉnh liều:</strong> {doseResult.renalAdjustmentAdviceVi}</p>
        </div>

        <div className="mt-12 grid grid-cols-2 text-center text-xs">
          <div>
            <p className="font-bold">BÁC SĨ ĐIỀU TRỊ</p>
            <p className="text-[10px] italic">(Ký và ghi rõ họ tên)</p>
          </div>
          <div>
            <p className="font-bold">DƯỢC SĨ LÂM SÀNG</p>
            <p className="text-[10px] italic">(Ký và ghi rõ họ tên)</p>
          </div>
        </div>
      </div>

      {/* Floating Quick Action Drawer for Patient on Mobile & Desktop */}
      <QuickPatientDrawer
        isOpen={isQuickPatientOpen}
        onClose={() => setIsQuickPatientOpen(false)}
        patient={patient}
        onChange={handlePatientChange}
        renal={renal}
        language={language}
      />

      {/* Instant 43 Antibiotics Search Dialog */}
      <DrugSearchModal
        isOpen={isDrugSearchOpen}
        onClose={() => setIsDrugSearchOpen(false)}
        selectedDrugId={selectedDrugId}
        onSelectDrug={(drugId) => {
          setSelectedDrugId(drugId);
          handleCalculateDoseInSelection(drugId);
          setDetailedDrugId(drugId);
        }}
        language={language}
      />

      {/* Detailed Antibiotic Popup Modal Dialog */}
      <DrugDetailModal
        isOpen={Boolean(detailedDrugId)}
        onClose={() => setDetailedDrugId(null)}
        drug={activeDrug}
        renal={renal}
        patient={patient}
      >
        {renderDosingWorkspace()}
      </DrugDetailModal>

      {/* Modals */}
      <AntibioticSpectrumModal
        isOpen={isSpectrumOpen}
        onClose={() => setIsSpectrumOpen(false)}
        language={language}
        onSelectDrug={(drugId) => {
          setSelectedDrugId(drugId);
          handleCalculateDoseInSelection(drugId);
          setDetailedDrugId(drugId);
        }}
      />

      <AmrModal
        isOpen={isAmrOpen}
        onClose={() => setIsAmrOpen(false)}
        selectedDrugId={selectedDrugId}
        selectedDrugName={activeDrug.name}
        language={language}
      />

      <OriginalPreviewModal
        isOpen={isOriginalOpen}
        onClose={() => setIsOriginalOpen(false)}
        drugId={selectedDrugId}
        drugName={activeDrug.name}
        patient={patient}
        language={language}
      />

      <PdfConsultationModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        reportData={reportData}
        language={language}
      />

      <GuidelineImageModal
        isOpen={isGuidelineAtlasOpen}
        onClose={() => setIsGuidelineAtlasOpen(false)}
        initialImageId={guidelineAtlasImageId}
      />

      {/* Unified Sepsis Modals */}
      <ClinicalGuideModal
        isOpen={isSepsisGuideOpen}
        onClose={() => setIsSepsisGuideOpen(false)}
      />

      <CaseHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedCases={savedCases}
        onLoadCase={handleLoadCase}
        onDeleteCase={handleDeleteCase}
        onClearAll={handleClearAllCases}
      />

      <PresetCasesModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectCase={handleSelectPreset}
      />

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-bold text-slate-700">
            Siêu Hệ Thống Hỗ Trợ Ra Quyết Định Lâm Sàng Nhiễm Trùng, Sepsis &amp; Kháng Sinh (InfectoSepsis CDSS v4.0 Super)
          </p>
          <p>
            Hợp nhất NICE NG253 (2024/2026), Sepsis-3, Phoenix 2024, Hướng Dẫn BV Bệnh Nhiệt Đới 2026, WHO AWaRe, NHSN-CDC &amp; Dược Động Học Stanford/UCSF.
          </p>
        </div>
      </footer>

    </div>
  );
}
