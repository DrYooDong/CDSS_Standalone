/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { PatientSidebar } from './components/PatientSidebar';
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
  Bug,
  ChevronDown,
  ChevronUp,
  Workflow,
  Calculator,
  Sparkles
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
  dialysis: 'none',
  patientName: 'Nguyễn Văn An',
  patientId: 'BN-882910',
  department: 'Hồi sức tích cực (ICU)',
  diagnosis: 'Viêm phổi bệnh viện (HAP/VAP) / Nhiễm khuẩn huyết'
};

type ViewSectionTab = 'all' | 'dosing' | 'dialysis' | 'ddi' | 'notes' | 'refs';

export default function App() {
  const [language, setLanguage] = useState<Language>('vi');
  const [patient, setPatient] = useState<PatientState>(DEFAULT_PATIENT);
  const [selectedDrugId, setSelectedDrugId] = useState<string>('meropenem');
  const [selectedScenario, setSelectedScenario] = useState<string>('standard');
  const [activeTab, setActiveTab] = useState<ViewSectionTab>('all');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Modals
  const [isAmrOpen, setIsAmrOpen] = useState(false);
  const [isOriginalOpen, setIsOriginalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isGuidelineAtlasOpen, setIsGuidelineAtlasOpen] = useState(false);
  const [guidelineAtlasImageId, setGuidelineAtlasImageId] = useState<string | undefined>(undefined);

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

  // State 'dosingResult' lấy dữ liệu từ phân hệ 2 và cung cấp trực tiếp vào Giai đoạn 2 (Phân hệ 1)
  const [dosingResult, setDosingResult] = useState<DoseResult | null>(null);

  // Đồng bộ kết quả tính liều từ Phân hệ 2 sang state dosingResult
  useEffect(() => {
    setDosingResult(doseResult);
  }, [doseResult]);

  // Hàm tính liều trực tiếp trong Giai đoạn 2 của Phân hệ 1 khi bác sĩ chọn kháng sinh
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
    setActiveTab('all');
  };

  const handleSelectDrugFromSelection = (drugId?: string) => {
    if (drugId) {
      handleCalculateDoseInSelection(drugId, true);
    }
    setTimeout(() => {
      const el = document.getElementById('unified-dosing-workspace') || document.getElementById('dosing-card-anchor');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  // Render Live Dosing & Safety Workspace (Shared between Unified and Dosing Modes)
  const renderDosingWorkspace = (isUnified = false) => (
    <div id={isUnified ? "unified-dosing-workspace" : "dosing-section"} className="space-y-4">
      {/* If Unified mode, show an informative header card */}
      {isUnified && (
        <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 text-white p-4 rounded-2xl shadow-sm border border-teal-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-600 rounded-xl text-white shadow-xs shrink-0">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider bg-teal-400/20 text-teal-200 px-2 py-0.5 rounded-full border border-teal-400/30">
                  Bước 2 trong Quy Trình Hợp Nhất
                </span>
                <h3 className="text-base font-extrabold text-white">
                  Cá Thể Hóa Tính Liều &amp; An Toàn Dược Lâm Sàng
                </h3>
              </div>
              <div className="text-xs text-teal-100/90 mt-1 flex items-center gap-2 flex-wrap">
                <span>Thuốc đang tính: <strong className="text-amber-300 font-bold">{activeDrug.name}</strong> ({activeDrug.group})</span>
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
                const el = document.getElementById('unified-step1-selection');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                else window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Về Bước 1 (Phác đồ BVBND)</span>
            </button>
          </div>
        </div>
      )}

      {/* Clinical Section Segmented Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-2 no-print">
        <div className="flex flex-wrap items-center justify-between gap-1.5">
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-teal-600 text-white shadow-xs'
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
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Pill className="w-3.5 h-3.5 text-teal-600" />
              <span>{isEn ? 'Dose & CrCl Table' : 'Liều & Bảng CrCl'}</span>
            </button>

            <button
              onClick={() => setActiveTab('dialysis')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                activeTab === 'dialysis'
                  ? 'bg-purple-600 text-white shadow-xs'
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
                  ? 'bg-rose-600 text-white shadow-xs'
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
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span>{isEn ? 'Clinical Guidance (Tier 1-3)' : 'Lưu ý Dược lý (Tier 1-3)'}</span>
            </button>

            <button
              onClick={() => setActiveTab('refs')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                activeTab === 'refs'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>{isEn ? 'References' : 'Tài liệu tham khảo'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Dosing Recommendation Hero Card */}
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

      {/* Complete Renal Adjustment Stratification Table */}
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

      {/* Dialysis / RRT Protocol Panel */}
      {(activeTab === 'all' || activeTab === 'dialysis') && (
        <div id="dialysis-section">
          <DialysisPanel
            drugDetails={drugDetails}
            dialysis={patient.dialysis}
            language={language}
          />
        </div>
      )}

      {/* Automatic Drug-Drug Interaction Warning System */}
      {(activeTab === 'all' || activeTab === 'ddi') && (
        <div id="ddi-section">
          <DrugInteractionChecker
            antibioticId={selectedDrugId}
            antibioticName={activeDrug.name}
            language={language}
          />
        </div>
      )}

      {/* Tier 1, 2, 3 Clinical Guidance & Pharmacotherapy Notes */}
      {(activeTab === 'all' || activeTab === 'notes') && (
        <div id="notes-section">
          <ClinicalNotesTiers
            drugDetails={drugDetails}
            language={language}
          />
        </div>
      )}

      {/* Evidence Base & Clinical References */}
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
    <div className="min-h-screen bg-slate-50/60 flex flex-col selection:bg-teal-600 selection:text-white">
      
      {/* Top Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        onReset={handleReset}
        onOpenAmr={() => setIsAmrOpen(true)}
        onOpenOriginal={() => setIsOriginalOpen(true)}
        onOpenPdfModal={() => setIsPdfModalOpen(true)}
        onOpenGuidelineAtlas={() => handleOpenGuidelineAtlas()}
        selectedDrugName={activeDrug.name}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">

        {/* CDSS Clinical Patient Glance & Quick-Jump Stepper Ribbon */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 mb-5 no-print">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
            {/* Left: Patient Glance Metrics */}
            <div className="flex items-center gap-3 flex-wrap min-w-0">
              <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200/80 text-teal-800 shrink-0">
                <Workflow className="w-5 h-5 text-teal-700" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black uppercase tracking-wider text-teal-800">
                    Quy Trình Lâm Sàng Hợp Nhất (CDSS)
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-100 text-teal-900 border border-teal-200/70">
                    BVBND 2026 &bull; 43 Kháng sinh
                  </span>
                </div>
                <div className="text-xs text-slate-700 font-semibold mt-1 flex items-center gap-2 flex-wrap">
                  <span><strong>{patient.patientName || 'Nguyễn Văn An'}</strong> ({patient.patientId || 'BN-882910'})</span>
                  <span className="text-slate-300">•</span>
                  <span>{patient.age}t, {patient.gender === 'm' ? 'Nam' : 'Nữ'}</span>
                  <span className="text-slate-300">•</span>
                  <span>{patient.weight} kg</span>
                  <span className="text-slate-300">•</span>
                  <span>
                    CrCl: <strong className="text-teal-700">{renal.crcl} mL/phút</strong>{' '}
                    <span className="text-[11px] font-medium text-slate-500">({renal.categoryLabelVi})</span>
                  </span>
                  {patient.dialysis !== 'none' && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-purple-100 text-purple-800 uppercase">
                        {patient.dialysis}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Quick Jump Workflow Stepper Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('unified-step1-selection');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  else window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                title="Đến Bước 1: Đánh giá lâm sàng & Phân tầng SOFA"
              >
                <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                  1
                </span>
                <span>Phân tầng SOFA</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('unified-step1-selection');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  else window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                title="Đến Bước 2: Phác đồ khởi đầu BVBND 2026 & Antibiogram"
              >
                <span className="w-4 h-4 rounded-full bg-teal-700 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                  2
                </span>
                <span>Phác đồ BVBND</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('unified-dosing-workspace');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title={`Đến Bảng tính liều & Dược lâm sàng cho ${activeDrug.name}`}
              >
                <Calculator className="w-3.5 h-3.5 text-amber-300" />
                <span>Tính liều ({activeDrug.name})</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPdfModalOpen(true)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                title="Xuất phiếu hội chẩn lâm sàng PDF"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Phiếu Hội Chẩn</span>
              </button>
            </div>
          </div>
        </div>

        {/* Master 2-Column Clinical Suite */}
        <div className="lg:flex lg:gap-6 items-start">
          {/* Sticky Left Sidebar: Patient Demographics & Renal Metrics */}
          <aside 
            aria-label="Patient and Renal Parameters" 
            className={`w-full shrink-0 mb-6 lg:mb-0 transition-all duration-300 lg:sticky lg:top-14 ${
              isSidebarCollapsed 
                ? 'lg:w-[260px] xl:w-[280px]' 
                : 'lg:w-[360px] xl:w-[390px]'
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

          {/* Right Column: Unified Clinical Flow */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* 1. Quick Global 43 Antibiotic Search Bar */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between gap-2 mb-2 px-1">
                <span className="text-xs font-black uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-teal-600" />
                  <span>Tra cứu nhanh 43 Kháng sinh &amp; Tính liều tức thì</span>
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  Nhấn <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 border border-slate-300 rounded text-slate-700">/</kbd> để tìm kiếm hoặc chọn thuốc trong phác đồ bên dưới
                </span>
              </div>
              <AntibioticSearch
                antibiotics={ANTIBIOTICS}
                selectedId={selectedDrugId}
                onSelect={(id) => {
                  handleSelectDrugFromSelection(id);
                }}
                language={language}
              />
            </div>

            {/* 2. Step 1: Selection Wizard (BVBND 2026, NHSN, Antibiogram) */}
            <div id="unified-step1-selection" className="space-y-3">
              <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-teal-900 via-teal-800 to-teal-950 text-white p-3.5 rounded-2xl shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-teal-700/80 rounded-xl text-teal-100">
                    <Workflow className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black uppercase tracking-wider bg-teal-500/30 text-teal-200 px-2 py-0.5 rounded-full border border-teal-400/30">
                        Bước 1
                      </span>
                      <h2 className="text-sm font-extrabold text-white">
                        Đánh Giá Lâm Sàng &amp; Lựa Chọn Phác Đồ Ban Đầu (BVBND 2026)
                      </h2>
                    </div>
                    <p className="text-[11px] text-teal-100/90 mt-0.5">
                      Chỉ định NHSN &bull; Phân tầng SOFA &bull; 7 Vị trí ổ nhiễm &bull; Antibiogram 2024 &bull; Tái đánh giá 48-72h
                    </p>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('unified-dosing-workspace');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-700/80 hover:bg-teal-600 text-teal-100 text-xs font-bold transition-all cursor-pointer shrink-0"
                >
                  <span>Xem Bảng Tính Liều ({activeDrug.name})</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <SelectionWizard
                onSelectDrugForDosing={handleSelectDrugFromSelection}
                onOpenGuidelineAtlas={handleOpenGuidelineAtlas}
                dosingResult={dosingResult}
                selectedDrugId={selectedDrugId}
                patient={patient}
                renal={renal}
                onCalculateDoseForDrug={handleCalculateDoseInSelection}
                onPatientChange={handlePatientChange}
              />
            </div>

            {/* 3. Step 2: Live Active Dosing & Drug Safety Workspace */}
            {renderDosingWorkspace(true)}
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
            <p>Ngày: {new Date().toLocaleDateString('vi-VN')}</p>
            <p>Mã HS: {patient.patientId || 'BN-10293'}</p>
          </div>
        </div>

        <div className="mb-4 text-xs">
          <p><strong>Bệnh nhân:</strong> {patient.patientName || 'Nguyễn Văn A'} | <strong>Tuổi/Giới:</strong> {patient.age}t / {patient.gender === 'm' ? 'Nam' : 'Nữ'} | <strong>Cân nặng:</strong> {patient.weight} kg</p>
          <p><strong>Scr:</strong> {renal.scrUmol} µmol/L ({renal.scrMgdl} mg/dL) | <strong>CrCl:</strong> {renal.crcl} mL/phút ({renal.categoryLabelVi})</p>
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
          <p className="font-semibold text-slate-700">
            {isEn 
              ? 'Antimicrobial Dosing Clinical Decision Support System (CDSS)' 
              : 'Hệ thống Hỗ trợ Quyết định Lâm sàng Quản lý Liều Kháng sinh (CDSS)'}
          </p>
          <p>
            {isEn 
              ? 'Based on Stanford SHC & UCSF IDMP adult inpatient protocols. Medical reference tool only; clinical judgment remains paramount.' 
              : 'Dựa trên phác đồ Stanford Health Care & UCSF IDMP. Công cụ hỗ trợ ra quyết định lâm sàng cho bác sĩ và dược sĩ.'}
          </p>
        </div>
      </footer>

    </div>
  );
}

