/**
 * HepaCDSS Main Application Component
 * Hệ thống Hỗ trợ Ra Quyết định Lâm sàng Sinh Hóa Gan Chuẩn Y Khoa Quốc Tế (ACG 2024 / EASL) & Việt Nam.
 * Tinh gọn 4 tab chuyên sâu, bố cục tinh tế, tối ưu cho bác sĩ đánh giá nhanh & chuẩn xác.
 */

import React, { useState, useMemo } from 'react';
import {
  CustomULNSettings,
  HepaInputData,
  ULNStandard,
  UnitPreferences,
} from './types';
import { HepaEngine } from './engine/engine';
import { CLINICAL_CASES } from './data/cases';
import { InputPanel } from './components/InputPanel';
import { AnalysisTab } from './components/AnalysisTab';
import { ScoresTab } from './components/ScoresTab';
import { DiliProtocolsTab } from './components/DiliProtocolsTab';
import { CasesReferenceTab } from './components/CasesReferenceTab';
import { generateConsultationPDF } from './utils/pdfGenerator';
import {
  Activity,
  Award,
  ShieldAlert,
  BookOpen,
  Printer,
  Sparkles,
  FileDown,
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
  const [activeTab, setActiveTab] = useState<'analysis' | 'scores' | 'protocols' | 'cases'>('analysis');
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

  const handleQuickCaseSelect = (caseId: string) => {
    if (!caseId) return;
    const found = CLINICAL_CASES.find(c => c.id === caseId);
    if (found) {
      handleLoadCase(found.input);
    }
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-black shadow-xs">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-extrabold text-slate-900 leading-tight">HepaCDSS v2.0</h1>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-teal-100 text-teal-800">
                  ACG 2024 &amp; BYT
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block">
                Hỗ Trợ Ra Quyết Định Sinh Hóa Gan, Xơ Hóa &amp; Độc Chất Học
              </p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Quick Case Selector Dropdown */}
            <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <select
                onChange={e => handleQuickCaseSelect(e.target.value)}
                defaultValue=""
                className="bg-transparent text-[11px] font-bold text-slate-700 focus:outline-none cursor-pointer max-w-[130px] sm:max-w-[180px] truncate"
                title="Chọn nhanh ca mẫu thực chiến để nạp vào hệ thống"
              >
                <option value="" disabled>⚡ Nạp ca mẫu...</option>
                {CLINICAL_CASES.map((c, i) => (
                  <option key={c.id} value={c.id}>
                    Ca #{i + 1}: {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Chọn chuẩn ULN */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <span className="text-slate-400 font-bold px-1 text-[10px]">ULN:</span>
              <button
                type="button"
                onClick={() => setStandard('acg2017')}
                className={`px-2 py-0.5 rounded font-bold transition text-[11px] ${
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
                className={`px-2 py-0.5 rounded font-bold transition text-[11px] ${
                  standard === 'who'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="WHO Lab: Nam ALT 45, Nữ ALT 35 U/L"
              >
                WHO Lab
              </button>
            </div>

            {/* Nút Xuất PDF */}
            <button
              type="button"
              onClick={handleExportPDF}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold transition shadow-xs text-[11px]"
              title="Xuất phiếu phân tích hội chẩn định dạng PDF"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Xuất PDF</span>
            </button>

            {/* Nút In phiếu */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold transition text-[11px]"
              title="In phiếu hội chẩn lâm sàng"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">In Phiếu</span>
            </button>
          </div>
        </div>

        {/* 4 Sleek Tabs Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-start gap-1 sm:gap-4 overflow-x-auto border-t border-slate-100 text-xs font-bold scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('analysis')}
            className={`py-2 px-3 flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'analysis'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>1. Phân Tích &amp; Động Học</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('scores')}
            className={`py-2 px-3 flex items-center gap-1.5 transition whitespace-nowrap ${
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
            onClick={() => setActiveTab('protocols')}
            className={`py-2 px-3 flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'protocols'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>3. DILI &amp; Phác Đồ Xử Trí</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cases')}
            className={`py-2 px-3 flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'cases'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>4. Ca Bệnh &amp; Tra Cứu</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        {activeTab === 'cases' ? (
          <CasesReferenceTab onLoadCase={handleLoadCase} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Cột trái: Khung nhập liệu (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
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
            <div className="lg:col-span-7 space-y-4">
              {activeTab === 'analysis' && (
                <AnalysisTab
                  result={result}
                  currentLab={{
                    alt: input.alt,
                    ast: input.ast,
                    alp: input.alp,
                    ggt: input.ggt,
                    totalBilirubin: input.totalBilirubin,
                    inr: input.inr,
                  }}
                  onNavigateToScores={() => setActiveTab('scores')}
                  onNavigateToProtocols={() => setActiveTab('protocols')}
                />
              )}

              {activeTab === 'scores' && <ScoresTab result={result} input={input} />}

              {activeTab === 'protocols' && <DiliProtocolsTab result={result} input={input} />}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
