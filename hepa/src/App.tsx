/**
 * HepaCDSS Main Application Component
 * Hệ thống Hỗ trợ Ra Quyết định Lâm sàng Sinh Hóa Gan Chuẩn Y Khoa Quốc Tế & Việt Nam.
 */

import React, { useState, useMemo } from 'react';
import {
  CustomULNSettings,
  HepaInputData,
  ULNStandard,
  UnitPreferences,
} from './types';
import { HepaEngine } from './engine/engine';
import { InputPanel } from './components/InputPanel';
import { AnalysisTab } from './components/AnalysisTab';
import { ScoresTab } from './components/ScoresTab';
import { KineticsTab } from './components/KineticsTab';
import { DiliTab } from './components/DiliTab';
import { CasesTab } from './components/CasesTab';
import { DecisionTreeTab } from './components/DecisionTreeTab';
import { KnowledgeTab } from './components/KnowledgeTab';
import { generateConsultationPDF } from './utils/pdfGenerator';
import {
  Activity,
  Award,
  Clock,
  ShieldAlert,
  BookOpen,
  Printer,
  Sparkles,
  GitBranch,
  FileDown,
  Layers,
} from 'lucide-react';

const DEFAULT_INPUT: HepaInputData = {
  age: 45,
  gender: 'male',
  alt: 88,
  ast: 52,
  alp: 75,
  ggt: 65,
  totalBilirubin: 14,
  bilirubinUnit: 'umol_l',
  albumin: 42,
  albuminUnit: 'g_l',
  inr: 1.0,
  platelets: 210,
  bmi: 26.5,
  alcoholGramsPerWeek: 70,
  hasDiabetesOrMetabolicRisk: true,
  hasDiabetesOrIFG: true,
  ultrasoundBiliaryDilatation: 'non_dilated',
};

const DEFAULT_UNITS: UnitPreferences = {
  bilirubin: 'umol_l',
  albumin: 'g_l',
  creatinine: 'umol_l',
  platelets: 'g_l',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'analysis' | 'scores' | 'kinetics' | 'dili' | 'trees' | 'knowledge' | 'cases'
  >('analysis');
  const [input, setInput] = useState<HepaInputData>(DEFAULT_INPUT);
  const [units, setUnits] = useState<UnitPreferences>(DEFAULT_UNITS);
  const [standard, setStandard] = useState<ULNStandard>('acg2017');
  const [customULNs, setCustomULNs] = useState<Partial<CustomULNSettings>>({});

  // Chạy engine phân tích tức thời (Reactive Computation)
  const result = useMemo(() => {
    return HepaEngine.analyze(input, standard, customULNs);
  }, [input, standard, customULNs]);

  const handleReset = () => {
    setInput(DEFAULT_INPUT);
    setUnits(DEFAULT_UNITS);
  };

  const handleLoadCase = (caseData: HepaInputData) => {
    setInput(caseData);
    if (caseData.bilirubinUnit) {
      setUnits(prev => ({ ...prev, bilirubin: caseData.bilirubinUnit! }));
    }
    setActiveTab('analysis');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    generateConsultationPDF(input, result);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Top Application Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black shadow-xs">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-slate-900">HepaCDSS v2.0</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  ACG 2024 &amp; BYT
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Hỗ Trợ Quyết Định Lâm Sàng Sinh Hóa Gan, Xơ Hóa &amp; Độc Chất Học
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Chọn chuẩn ULN */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-semibold px-1 text-[11px]">ULN:</span>
              <button
                type="button"
                onClick={() => setStandard('acg2017')}
                className={`px-2 py-1 rounded font-bold transition text-[11px] ${
                  standard === 'acg2017'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="ACG 2017: Nam ALT 33, Nữ ALT 25 U/L"
              >
                ACG 2017
              </button>
              <button
                type="button"
                onClick={() => setStandard('who')}
                className={`px-2 py-1 rounded font-bold transition text-[11px] ${
                  standard === 'who'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="WHO Training: Nam ALT 45, Nữ ALT 35 U/L"
              >
                WHO Lab
              </button>
            </div>

            {/* Nút Xuất PDF */}
            <button
              type="button"
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold transition shadow-xs text-xs"
              title="Xuất phiếu phân tích hội chẩn định dạng PDF"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Xuất PDF</span>
            </button>

            {/* Nút In phiếu */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold transition text-xs"
              title="In phiếu hội chẩn lâm sàng"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>In Phiếu</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 sm:gap-2 overflow-x-auto border-t border-slate-100 text-xs font-bold scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('analysis')}
            className={`py-2.5 px-2.5 sm:px-3 flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'analysis'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>1. Phân Tích &amp; Tiếp Cận</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('scores')}
            className={`py-2.5 px-2.5 sm:px-3 flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'scores'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>2. Thang Điểm Tiên Lượng</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('kinetics')}
            className={`py-2.5 px-2.5 sm:px-3 flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'kinetics'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>3. Động Học Men Gan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dili')}
            className={`py-2.5 px-2.5 sm:px-3 flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'dili'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>4. DILI &amp; Thuốc Lao</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('trees')}
            className={`py-2.5 px-2.5 sm:px-3 flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'trees'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>5. Cây Quyết Định (6)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('knowledge')}
            className={`py-2.5 px-2.5 sm:px-3 flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'knowledge'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>6. Tri Thức &amp; Từ Điển</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cases')}
            className={`py-2.5 px-2.5 sm:px-3 flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'cases'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>7. 12 Ca Mẫu Lâm Sàng</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-5">
        {activeTab === 'cases' ? (
          <CasesTab onLoadCase={handleLoadCase} />
        ) : activeTab === 'trees' ? (
          <DecisionTreeTab />
        ) : activeTab === 'knowledge' ? (
          <KnowledgeTab />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Cột trái: Khung nhập liệu (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <InputPanel
                input={input}
                onChange={setInput}
                units={units}
                onUnitsChange={setUnits}
                standard={standard}
                onStandardChange={setStandard}
                customULNs={customULNs}
                onReset={handleReset}
              />
            </div>

            {/* Cột phải: Nội dung Tab được chọn (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {activeTab === 'analysis' && (
                <AnalysisTab
                  result={result}
                  onNavigateToScores={() => setActiveTab('scores')}
                  onNavigateToDili={() => setActiveTab('dili')}
                />
              )}

              {activeTab === 'scores' && <ScoresTab result={result} input={input} />}

              {activeTab === 'kinetics' && (
                <KineticsTab
                  currentLab={{
                    alt: input.alt,
                    ast: input.ast,
                    alp: input.alp,
                    ggt: input.ggt,
                    totalBilirubin: input.totalBilirubin,
                    inr: input.inr,
                  }}
                />
              )}

              {activeTab === 'dili' && <DiliTab result={result} input={input} />}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
