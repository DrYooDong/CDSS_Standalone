/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { PatientSidebar } from './components/PatientSidebar';
import { StickyPatientBar } from './components/StickyPatientBar';
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
import { OriginalPreviewModal } from './components/OriginalPreviewModal';
import { PdfConsultationModal } from './components/PdfConsultationModal';
import { GuidelineImageModal } from './components/selection/GuidelineImageModal';

import { 
  Pill, 
  Droplets, 
  ShieldAlert, 
  FileText, 
  BookOpen, 
  LayoutGrid,
  Calculator,
  Sparkles,
  Search,
  Activity,
  ArrowRight,
  ChevronUp
} from 'lucide-react';

import { SelectionWizard } from './components/selection/SelectionWizard';
import { Language, PatientState } from './types';
import { ANTIBIOTICS } from './data/antibiotics';
import { DRUG_INTERACTIONS } from './data/drugInteractions';
import { calculateRenalMetrics } from './utils/clinicalFormulas';
import { extractDrugData, calculateDose, DoseResult } from './utils/drugDataExtractor';
import { ConsultationReportData } from './utils/pdfGenerator';

const DEFAULT_PATIENT: PatientState = {
  scr: 90,
  scrUnit: 'umol',
  age: 60,
  gender: 'm',
  weight: 60,
  height: 165,
  dialysis: 'none'
};

type ViewSectionTab = 'all' | 'dosing' | 'dialysis' | 'ddi' | 'notes' | 'refs';

export default function App() {
  const [language, setLanguage] = useState<Language>('vi');
  const [patient, setPatient] = useState<PatientState>(DEFAULT_PATIENT);
  const [selectedDrugId, setSelectedDrugId] = useState<string>('meropenem');
  const [selectedScenario, setSelectedScenario] = useState<string>('standard');
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [activeTab, setActiveTab] = useState<ViewSectionTab>('all');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Drawers & Modals
  const [isQuickPatientOpen, setIsQuickPatientOpen] = useState(false);
  const [isDrugSearchOpen, setIsDrugSearchOpen] = useState(false);
  const [isAmrOpen, setIsAmrOpen] = useState(false);
  const [isOriginalOpen, setIsOriginalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isGuidelineAtlasOpen, setIsGuidelineAtlasOpen] = useState(false);
  const [guidelineAtlasImageId, setGuidelineAtlasImageId] = useState<string | undefined>(undefined);

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

  const handlePatientChange = (updated: Partial<PatientState>) => {
    setPatient(prev => ({ ...prev, ...updated }));
  };

  const handleReset = () => {
    setPatient(DEFAULT_PATIENT);
    setSelectedDrugId('meropenem');
    setSelectedScenario('standard');
    setCurrentStep(1);
    setActiveTab('all');
  };

  const handleSelectDrugFromSelection = (drugId?: string) => {
    if (drugId) {
      handleCalculateDoseInSelection(drugId, true);
    }
    setCurrentStep(3);
    setTimeout(() => {
      const el = document.getElementById('unified-dosing-workspace') || document.getElementById('dosing-card-anchor');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 80, behavior: 'smooth' });
      }
    }, 100);
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
    language
  };

  const isEn = language === 'en';

  // Render Live Dosing & Safety Workspace (Embedded in Step 3)
  const renderDosingWorkspace = () => (
    <div id="unified-dosing-workspace" className="space-y-4">
      
      {/* 1. Instant Antibiotic Search & Switcher Bar */}
      <AntibioticSearch
        antibiotics={ANTIBIOTICS}
        selectedId={selectedDrugId}
        onSelect={(drugId) => {
          setSelectedDrugId(drugId);
          handleCalculateDoseInSelection(drugId);
        }}
        language={language}
      />

      {/* 2. Dosing Workspace Informative Status Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 text-white p-4 rounded-3xl shadow-xs border border-teal-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-600 rounded-2xl text-white shadow-xs shrink-0">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider bg-teal-400/20 text-teal-200 px-2.5 py-0.5 rounded-full border border-teal-400/30">
                Bước 3: Cá Thể Hóa Tính Liều
              </span>
              <h3 className="text-base font-black text-white">
                An Toàn Dược Lâm Sàng &amp; Hiệu Chỉnh Liều Theo Thận
              </h3>
            </div>
            <div className="text-xs text-teal-100/90 mt-1 flex items-center gap-2 flex-wrap">
              <span>Thuốc đang tính: <strong className="text-amber-300 font-extrabold">{activeDrug.name}</strong> ({activeDrug.group})</span>
              <span>•</span>
              <span>CrCl: <strong className="text-white font-bold">{renal.crcl} mL/phút</strong> ({renal.categoryLabelVi})</span>
              <span>•</span>
              <span>Lọc máu: <strong className="text-white font-bold">{patient.dialysis === 'none' ? 'Không' : patient.dialysis.toUpperCase()}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setCurrentStep(2);
              window.scrollTo({ top: 80, behavior: 'smooth' });
            }}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ChevronUp className="w-3.5 h-3.5" />
            <span>Về Bước 2 (Phác đồ BVBND)</span>
          </button>
        </div>
      </div>

      {/* 3. Clinical Section Segmented Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-1.5 no-print">
        <div className="flex flex-wrap items-center gap-1">
          <button
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
    <div className="min-h-screen bg-slate-50/70 flex flex-col selection:bg-teal-600 selection:text-white pb-24 md:pb-8">
      
      {/* 1. Main Navigation Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        onReset={handleReset}
        onOpenAmr={() => setIsAmrOpen(true)}
        onOpenOriginal={() => setIsOriginalOpen(true)}
        onOpenPdfModal={() => setIsPdfModalOpen(true)}
        onOpenGuidelineAtlas={() => handleOpenGuidelineAtlas()}
        onOpenDrugSearch={() => setIsDrugSearchOpen(true)}
        onOpenQuickPatient={() => setIsQuickPatientOpen(true)}
        selectedDrugName={activeDrug.name}
      />

      {/* 2. Responsive Sticky Patient Capsule & Mobile Bottom Navigation Bar */}
      <StickyPatientBar
        patient={patient}
        renal={renal}
        dialysis={patient.dialysis}
        selectedDrugName={activeDrug.name}
        currentStep={currentStep}
        onStepChange={(step) => {
          setCurrentStep(step);
          window.scrollTo({ top: 80, behavior: 'smooth' });
        }}
        onOpenQuickPatient={() => setIsQuickPatientOpen(true)}
        onOpenDrugSearch={() => setIsDrugSearchOpen(true)}
        onExportPdf={() => setIsPdfModalOpen(true)}
        language={language}
      />

      {/* 3. Main Clinical Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        <div className="lg:flex lg:gap-6 items-start">
          
          {/* Left Column (Desktop / Laptop): Sticky Patient Demographics & Renal Metrics HUD */}
          <aside 
            aria-label="Patient and Renal Parameters" 
            className={`hidden lg:block shrink-0 mb-6 lg:mb-0 transition-all duration-300 lg:sticky lg:top-32 ${
              isSidebarCollapsed 
                ? 'lg:w-[260px] xl:w-[280px]' 
                : 'lg:w-[350px] xl:w-[380px]'
            }`}
          >
            <PatientSidebar
              patient={patient}
              onChange={handlePatientChange}
              renal={renal}
              dialysis={patient.dialysis}
              language={language}
              needsHeight={activeDrug.needsHeight}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
          </aside>

          {/* Right Column (All Devices): 4-Step Clinical Guided Pipeline */}
          <div className="flex-1 min-w-0 space-y-6">
            <SelectionWizard
              currentStage={currentStep}
              onStageChange={(st) => setCurrentStep(st)}
              onSelectDrugForDosing={handleSelectDrugFromSelection}
              onOpenGuidelineAtlas={handleOpenGuidelineAtlas}
              dosingResult={dosingResult}
              selectedDrugId={selectedDrugId}
              patient={patient}
              renal={renal}
              onCalculateDoseForDrug={handleCalculateDoseInSelection}
              onPatientChange={handlePatientChange}
              onExportPdf={() => setIsPdfModalOpen(true)}
            >
              {renderDosingWorkspace()}
            </SelectionWizard>
          </div>

        </div>

      </main>

      {/* Printable Consultation Report Structure for direct Ctrl+P */}
      <div className="print-only p-8 text-black bg-white">
        <div className="border-b-2 border-black pb-4 mb-4 flex justify-between">
          <div>
            <h1 className="text-xl font-bold uppercase">BỆNH VIỆN - KHOA DƯỢC LÂM SÀNG</h1>
            <h2 className="text-sm font-semibold">PHIẾU HỘI CHẨN & QUẢN LÝ LIỀU KHÁNG SINH (CDSS)</h2>
          </div>
          <div className="text-right text-xs">
            <p>Thời điểm tính: {new Date().toLocaleDateString('vi-VN')}</p>
            <p className="font-semibold text-slate-600">CDSS INFECTODOSE v3.0</p>
          </div>
        </div>

        <div className="mb-4 text-xs">
          <p><strong>Thông số nhân trắc:</strong> {patient.age} tuổi / {patient.gender === 'm' ? 'Nam' : 'Nữ'} | <strong>Cân nặng:</strong> {patient.weight} kg {patient.height ? `| Chiều cao: ${patient.height} cm (IBW: ${renal.ibw} kg, BMI: ${renal.bmi})` : ''}</p>
          <p><strong>Sinh hóa &amp; Thận:</strong> Scr: {renal.scrUmol} µmol/L ({renal.scrMgdl} mg/dL) | <strong>CrCl (Cockcroft-Gault):</strong> {renal.crcl} mL/phút ({renal.categoryLabelVi}) {patient.dialysis !== 'none' ? `| Lọc máu: ${patient.dialysis.toUpperCase()}` : ''}</p>
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
          setCurrentStep(3);
        }}
        language={language}
      />

      {/* Modals */}
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

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-bold text-slate-700">
            Hệ thống Hỗ Trợ Ra Quyết Định Lâm Sàng Kháng Sinh (InfectoDose CDSS v3.0 Pro)
          </p>
          <p>
            Tích hợp Hướng Dẫn BV Bệnh Nhiệt Đới 2026, Tiêu Chuẩn NHSN-CDC, QĐ 5631/BYT &amp; Dược Động Học Stanford/UCSF.
          </p>
        </div>
      </footer>

    </div>
  );
}
