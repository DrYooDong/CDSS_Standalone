/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { CSFInput, PresetCase } from './types/csf';
import { analyzeCSF } from './utils/csfAnalyzer';
import { PRESET_CASES } from './data/presetCases';
import { CSFInputForm } from './components/CSFInputForm';
import { CDSSOutput } from './components/CDSSOutput';
import { CSFCharts } from './components/CSFCharts';
import { CSFGuide } from './components/CSFGuide';
import { PresetsModal } from './components/PresetsModal';
import { 
  Stethoscope, 
  Activity, 
  BarChart3, 
  BookOpen, 
  RotateCcw,
  ClipboardList,
  Printer,
  ChevronRight,
  ArrowLeft,
  SlidersHorizontal,
  Sun,
  Moon
} from 'lucide-react';

const INITIAL_INPUT: CSFInput = {
  patientAge: 35,
  ageGroup: 'adult',
  gender: 'male',
  daysSinceOnset: 2,
  hasPriorAntibiotics: false,
  isImmunocompromised: false,
  isPostNeurosurgical: false,
  hasThunderclapHeadache: false,
  hasFocalDeficitOrSeizure: false,
  hasAlteredMentalStatus: false,
  openingPressure: 160,
  color: 'clear',
  supernatant: 'clear',
  pellicleFormation: false,
  protein: 35,
  proteinUnit: 'mg/dL',
  csfGlucose: 65,
  serumGlucose: 100,
  glucoseUnit: 'mg/dL',
  lactate: 1.8,
  lactateUnit: 'mmol/L',
  wbc: 3,
  neutrophilPercent: 0,
  lymphocytePercent: 75,
  monocytePercent: 25,
  rbc: 0,
  gramStain: 'not_done',
  crAgOrIndiaInk: 'not_done',
  tbPcrOrAfb: 'not_done',
  viralPcr: 'not_done',
};

export default function App() {
  const [input, setInput] = useState<CSFInput>(PRESET_CASES[0].data);
  const [mobileTab, setMobileTab] = useState<'input' | 'cdss' | 'charts' | 'guide'>('input');
  const [desktopTab, setDesktopTab] = useState<'workbench' | 'charts' | 'guide'>('workbench');
  
  const [isPresetsModalOpen, setIsPresetsModalOpen] = useState<boolean>(false);
  const [currentPresetId, setCurrentPresetId] = useState<string>(PRESET_CASES[0].id);

  // Dark Mode state with localStorage persistence & universal synchronization
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cliniportal_theme') || localStorage.getItem('csf_dark_mode') || localStorage.getItem('theme');
      if (saved !== null) {
        return saved === 'dark' || saved === 'true';
      }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('cliniportal_theme', 'dark');
      localStorage.setItem('csf_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('cliniportal_theme', 'light');
      localStorage.setItem('csf_dark_mode', 'false');
    }
  }, [isDarkMode]);

  // Compute CDSS analysis whenever input changes
  const analysisResult = useMemo(() => {
    return analyzeCSF(input);
  }, [input]);

  const handleReset = () => {
    setInput(INITIAL_INPUT);
    setCurrentPresetId('');
  };

  const handleLoadPreset = (preset: PresetCase) => {
    setInput(preset.data);
    setCurrentPresetId(preset.id);
  };

  const handlePrint = () => {
    window.print();
  };

  const topDiag = analysisResult.topDiagnosis;

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans pb-20 lg:pb-0 transition-colors duration-200">
      {/* 1. TOP STICKY NAVBAR */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-2xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
            {/* Logo & Brand */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-xs shrink-0">
                <Stethoscope className="w-4 h-4 sm:w-5 h-5" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight truncate">
                    CDSS Phân Tích DNT
                  </h1>
                  <span className="bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 text-[10px] font-bold px-1.5 py-0.2 rounded-md uppercase">
                    v2.5
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:block truncate">
                  Hỗ trợ quyết định lâm sàng CSF &amp; Hướng dẫn y khoa
                </p>
              </div>
            </div>

            {/* Desktop Navigation Tabs (Converted to Icon Buttons) */}
            <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700" aria-label="Điều hướng chính">
              <button
                type="button"
                onClick={() => setDesktopTab('workbench')}
                title="Bàn Làm Việc CDSS (Nhập liệu & Phân tích)"
                aria-label="Bàn Làm Việc CDSS"
                className={`p-2 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                  desktopTab === 'workbench'
                    ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <Activity className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setDesktopTab('charts')}
                title="Biểu Đồ So Sánh Các Dải Tham Chiếu"
                aria-label="Biểu Đồ So Sánh"
                className={`p-2 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                  desktopTab === 'charts'
                    ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setDesktopTab('guide')}
                title="Hướng Dẫn Cơ Bản & Quy Trình Chọc Dò"
                aria-label="Hướng Dẫn Cơ Bản"
                className={`p-2 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                  desktopTab === 'guide'
                    ? 'bg-teal-700 text-white shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <BookOpen className="w-4 h-4" />
              </button>
            </nav>

            {/* Quick Action Icon Buttons: Dark Mode Toggle, Presets, Print, Reset, Back to Hub */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* DARK MODE TOGGLE BUTTON */}
              <button
                type="button"
                onClick={() => setIsDarkMode(!isDarkMode)}
                title={isDarkMode ? "Chuyển sang chế độ sáng" : "Chế độ nền tối (Ca đêm / Phòng cấp cứu)"}
                aria-label="Chuyển đổi giao diện sáng tối"
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-2xs"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                )}
              </button>

              {/* 7 CA MẪU PRESET BUTTON */}
              <button
                type="button"
                onClick={() => setIsPresetsModalOpen(true)}
                title="Tải ca bệnh mẫu lâm sàng (7 ca kinh điển)"
                aria-label="Ca lâm sàng mẫu"
                className="p-2 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60 rounded-xl transition-all cursor-pointer shadow-2xs flex items-center justify-center"
              >
                <ClipboardList className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              </button>

              {/* PRINT BUTTON */}
              <button
                type="button"
                onClick={handlePrint}
                title="In phiếu kết quả CDSS (A4)"
                aria-label="In phiếu CDSS"
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 transition-all cursor-pointer hidden sm:flex items-center justify-center"
              >
                <Printer className="w-4 h-4" />
              </button>

              {/* RESET BUTTON */}
              <button
                type="button"
                onClick={handleReset}
                title="Đặt lại thông số mặc định"
                aria-label="Đặt lại mặc định"
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 transition-all cursor-pointer flex items-center justify-center"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* BACK TO HUB CDSS */}
              <a
                href="../index.html"
                title="Trở về Trung tâm Quyết Định Lâm Sàng (Hub CDSS)"
                aria-label="Trở về Hub CDSS"
                className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 transition-all shadow-2xs flex items-center justify-center ml-0.5"
              >
                <ArrowLeft className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Quick Stats Strip (horizontally scrollable on mobile/tablet) */}
        <div className="bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200/80 dark:border-slate-800 px-3 sm:px-6 py-1.5 text-[11px] text-slate-600 dark:text-slate-400 overflow-x-auto scrollbar-none transition-colors duration-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 min-w-[500px] sm:min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 dark:text-slate-500 font-medium">Bệnh nhân:</span>
              <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 font-mono text-slate-800 dark:text-slate-200">
                WBC: <strong>{analysisResult.correctedWbc}/µL</strong>
              </span>
              <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 font-mono text-slate-800 dark:text-slate-200">
                Protein: <strong>{input.protein}</strong>
              </span>
              <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 font-mono text-slate-800 dark:text-slate-200">
                Đường: <strong>{input.csfGlucose}</strong>{' '}
                {analysisResult.glucoseRatio !== null && (
                  <span className={analysisResult.glucoseRatioPathological ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-emerald-600 dark:text-emerald-400 font-bold'}>
                    (Tỷ số: {analysisResult.glucoseRatio})
                  </span>
                )}
              </span>
              <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 font-mono text-slate-800 dark:text-slate-200">
                RBC: <strong>{input.rbc}</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-slate-400 dark:text-slate-500">Gợi ý CDSS:</span>
              <span className="bg-teal-100 dark:bg-teal-950/80 text-teal-900 dark:text-teal-200 font-bold px-2 py-0.5 rounded-full text-[10px]">
                {topDiag.nameVi} ({topDiag.score}%)
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 md:p-6 lg:p-8 space-y-5">
        {/* ========================================================= */}
        {/* DESKTOP VIEW (>= lg: 1024px)                             */}
        {/* ========================================================= */}
        <div className="hidden lg:block space-y-6">
          {desktopTab === 'workbench' && (
            <div className="grid grid-cols-12 gap-6 items-start">
              {/* Left Column: Form inputs (5 cols) */}
              <div className="col-span-5 space-y-5">
                <CSFInputForm
                  input={input}
                  onChange={setInput}
                  onReset={handleReset}
                  onOpenPresets={() => setIsPresetsModalOpen(true)}
                />
              </div>

              {/* Right Column: CDSS Results & Live Charts (7 cols) */}
              <div className="col-span-7 space-y-5">
                <CDSSOutput input={input} result={analysisResult} />
                <CSFCharts input={input} result={analysisResult} />
              </div>
            </div>
          )}

          {desktopTab === 'charts' && (
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-teal-700 to-indigo-800 dark:from-teal-900 dark:to-indigo-950 text-white rounded-2xl p-6 shadow-xs flex items-center justify-between border border-teal-600/30">
                <div>
                  <h2 className="text-xl font-bold">Biểu Đồ So Sánh: Đường, Protein &amp; Bạch Cầu</h2>
                  <p className="text-xs text-teal-100 dark:text-teal-200 mt-0.5">
                    Tự động định vị thông số bệnh nhân và đối chiếu với các khoảng bệnh cảnh kinh điển
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDesktopTab('workbench')}
                  title="Về Bàn Làm Việc CDSS"
                  aria-label="Về Bàn Làm Việc CDSS"
                  className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0"
                >
                  <Activity className="w-5 h-5" />
                </button>
              </div>
              <CSFCharts input={input} result={analysisResult} />
            </div>
          )}

          {desktopTab === 'guide' && (
            <CSFGuide />
          )}
        </div>

        {/* ========================================================= */}
        {/* MOBILE & TABLET VIEW (< lg: 1024px)                      */}
        {/* ========================================================= */}
        <div className="block lg:hidden space-y-4">
          {/* TAB 1: INPUT FORM ON MOBILE/TABLET */}
          {mobileTab === 'input' && (
            <div className="space-y-4">
              <CSFInputForm
                input={input}
                onChange={setInput}
                onReset={handleReset}
                onOpenPresets={() => setIsPresetsModalOpen(true)}
              />

              {/* Persistent Floating Quick-Jump Bar on Mobile while in Input mode */}
              <div className="sticky bottom-20 z-20">
                <button
                  type="button"
                  onClick={() => setMobileTab('cdss')}
                  title="Xem Kết Quả CDSS"
                  aria-label="Xem Kết Quả CDSS"
                  className="w-full bg-slate-900 dark:bg-slate-800 text-white p-3 rounded-2xl shadow-xl border border-teal-500/60 dark:border-teal-400/50 flex items-center justify-between gap-3 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse shrink-0"></span>
                    <div className="text-left truncate">
                      <div className="text-[10px] text-teal-300 font-bold uppercase tracking-wider">
                        CDSS Gợi ý ({topDiag.score}%):
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-white truncate">
                        {topDiag.nameVi}
                      </div>
                    </div>
                  </div>

                  <span className="p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl shrink-0 flex items-center justify-center shadow-2xs" title="Xem Kết Quả CDSS">
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CDSS OUTPUT ON MOBILE/TABLET */}
          {mobileTab === 'cdss' && (
            <div className="space-y-4">
              {/* Top back button */}
              <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setMobileTab('input')}
                  title="Sửa thông số xét nghiệm"
                  aria-label="Sửa thông số xét nghiệm"
                  className="p-2 text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer flex items-center justify-center transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setMobileTab('charts')}
                  title="Xem Biểu Đồ"
                  aria-label="Xem Biểu Đồ"
                  className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer flex items-center justify-center transition-all"
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
              </div>

              <CDSSOutput input={input} result={analysisResult} />
            </div>
          )}

          {/* TAB 3: CHARTS ON MOBILE/TABLET */}
          {mobileTab === 'charts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setMobileTab('cdss')}
                  title="Về Kết Quả CDSS"
                  aria-label="Về Kết Quả CDSS"
                  className="p-2 text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer flex items-center justify-center transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setMobileTab('input')}
                  title="Sửa thông số"
                  aria-label="Sửa thông số"
                  className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer flex items-center justify-center transition-all"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>

              <CSFCharts input={input} result={analysisResult} />
            </div>
          )}

          {/* TAB 4: GUIDE ON MOBILE/TABLET */}
          {mobileTab === 'guide' && (
            <div className="space-y-4">
              <CSFGuide />
            </div>
          )}
        </div>
      </main>

      {/* 3. MOBILE & TABLET BOTTOM NAVIGATION BAR */}
      <nav 
        aria-label="Điều hướng trên thiết bị di động"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 shadow-lg px-2 py-1.5 flex items-center justify-around transition-colors duration-200"
      >
        <button
          type="button"
          onClick={() => setMobileTab('input')}
          title="Nhập Liệu"
          aria-label="Nhập Liệu"
          className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
            mobileTab === 'input' ? 'bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 font-extrabold shadow-2xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="relative">
            <SlidersHorizontal className="w-5 h-5" />
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400 absolute -top-0.5 -right-0.5"></span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab('cdss')}
          title="CDSS Biện Giải"
          aria-label="CDSS Biện Giải"
          className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
            mobileTab === 'cdss' ? 'bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 font-extrabold shadow-2xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="relative">
            <Activity className="w-5 h-5" />
            <span className="absolute -top-1 -right-3.5 bg-rose-500 text-white text-[9px] font-bold px-1 rounded-full">
              {topDiag.score}%
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab('charts')}
          title="Biểu Đồ So Sánh"
          aria-label="Biểu Đồ So Sánh"
          className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
            mobileTab === 'charts' ? 'bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 font-extrabold shadow-2xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setMobileTab('guide')}
          title="Hướng Dẫn & Quy Trình"
          aria-label="Hướng Dẫn & Quy Trình"
          className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
            mobileTab === 'guide' ? 'bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 font-extrabold shadow-2xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-5 h-5" />
        </button>
      </nav>

      {/* 4. FOOTER (Hidden on mobile to save thumb room, visible on desktop) */}
      <footer className="hidden lg:block bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-5 mt-10 text-slate-500 dark:text-slate-400 text-xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          <div>
            <p className="font-bold text-slate-700 dark:text-slate-300">
              CDSS Phân Tích Dịch Não Tủy (CSF Decision Support System)
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              Cơ sở y lý: EFNS Task Force 2006 • AAFP 2021 • Nature Sci Rep 2023 • Univ of Arizona CSF Algorithm.
            </p>
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 text-right">
            <span>Dành cho nhân viên y tế • Chế độ nền tối hỗ trợ trực đêm &amp; cấp cứu</span>
          </div>
        </div>
      </footer>

      {/* 5. PRESETS BOTTOM SHEET / MODAL */}
      <PresetsModal
        isOpen={isPresetsModalOpen}
        onClose={() => setIsPresetsModalOpen(false)}
        onSelect={handleLoadPreset}
        currentId={currentPresetId}
      />
    </div>
  );
}
