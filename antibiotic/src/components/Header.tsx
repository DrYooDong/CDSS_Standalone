import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  RotateCcw, 
  Globe, 
  Menu, 
  X, 
  Activity, 
  ExternalLink,
  ShieldAlert,
  Info,
  BookOpen,
  Search,
  User,
  Edit3
} from 'lucide-react';
import { Language } from '../types';
import { CdssLogo } from './CdssLogo';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onReset: () => void;
  onOpenAmr: () => void;
  onOpenOriginal: () => void;
  onOpenPdfModal: () => void;
  onOpenGuidelineAtlas?: () => void;
  onOpenDrugSearch?: () => void;
  onOpenQuickPatient?: () => void;
  selectedDrugName: string;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onReset,
  onOpenAmr,
  onOpenOriginal,
  onOpenPdfModal,
  onOpenGuidelineAtlas,
  onOpenDrugSearch,
  onOpenQuickPatient,
  selectedDrugName
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isEn = language === 'en';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3">
            <div className="p-1 rounded-2xl bg-gradient-to-br from-slate-900 to-teal-950 shadow-md shadow-teal-500/20 border border-teal-500/30 flex items-center justify-center shrink-0">
              <CdssLogo size="md" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900">
                  InfectoDose <span className="text-teal-600">CDSS</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-100 text-teal-800 border border-teal-200/60">
                  v3.0 Pro
                </span>
                <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  BVBND 2026 • WHO AWaRe 2022 • NHSN-CDC
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                {isEn 
                  ? 'MDR Stratification & Precision Antibiotic Dosing' 
                  : 'Phân tầng VKĐK & Tính liều kháng sinh cá thể hóa'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation & Actions (Icon-First Clean Toolbar) */}
          <div className="hidden lg:flex items-center space-x-1.5">
            
            {/* Quick Drug Search Trigger */}
            {onOpenDrugSearch && (
              <button
                type="button"
                onClick={onOpenDrugSearch}
                className="px-2.5 py-1.5 rounded-xl text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
                title="Tra cứu nhanh 43 kháng sinh (Phím tắt /)"
                aria-label="Tra cứu 43 kháng sinh"
              >
                <Search className="w-3.5 h-3.5 text-teal-600" />
                <span className="text-[11px]">43 KS</span>
                <kbd className="px-1 py-0.2 text-[9px] bg-white border border-slate-300 rounded text-slate-500 font-mono">
                  /
                </kbd>
              </button>
            )}

            {/* Atlas Hướng Dẫn BVBND */}
            {onOpenGuidelineAtlas && (
              <button
                id="btn-open-bvbnd-atlas"
                onClick={onOpenGuidelineAtlas}
                className="p-2 rounded-xl text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer shadow-2xs"
                title={isEn ? 'BVBND 2026 Flowchart & Antibiogram Atlas' : 'Xem Atlas Lưu đồ Gốc & Dữ liệu Vi sinh BVBND 2026'}
                aria-label="Atlas BVBND"
              >
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span className="hidden xl:inline text-[11px]">Atlas BVBND</span>
              </button>
            )}

            {/* AMR Surveillance Lookup */}
            <button
              onClick={onOpenAmr}
              className="p-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center cursor-pointer border border-slate-200/60"
              title={isEn ? 'Antimicrobial Resistance Data (Vietnam)' : 'Tra cứu dữ liệu đề kháng kháng sinh Việt Nam'}
              aria-label="Dữ liệu Đề kháng"
            >
              <ShieldAlert className="w-4 h-4 text-amber-600" />
            </button>

            {/* Original Preview View */}
            <button
              onClick={onOpenOriginal}
              className="p-2 rounded-xl text-teal-800 bg-teal-50 hover:bg-teal-100 transition-colors flex items-center justify-center cursor-pointer border border-teal-200/60"
              title={isEn ? 'View Original Stanford/UCSF Preview' : 'Xem bản xem gốc Stanford/UCSF'}
              aria-label="Giao diện gốc"
            >
              <ExternalLink className="w-4 h-4 text-teal-600" />
            </button>

            {/* Consultation PDF Report */}
            <button
              onClick={onOpenPdfModal}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-all flex items-center space-x-1 text-xs font-bold cursor-pointer"
              title={isEn ? 'Export PDF / Print Consultation Report' : 'Xuất Phiếu Hội Chẩn / In PDF'}
              aria-label="Xuất Phiếu Hội Chẩn"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden xl:inline text-[11px]">In PDF</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={onReset}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer"
              title={isEn ? 'Reset to default patient' : 'Đặt lại thông số mặc định'}
              aria-label="Đặt lại thông số"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                onClick={() => onLanguageChange('vi')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  language === 'vi' 
                    ? 'bg-white text-teal-700 shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🇻🇳 VI
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  language === 'en' 
                    ? 'bg-white text-teal-700 shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🇬🇧 EN
              </button>
            </div>
          </div>

          {/* Mobile Right Bar */}
          <div className="flex items-center space-x-1.5 lg:hidden">
            {/* Quick Drug Search button on Mobile */}
            {onOpenDrugSearch && (
              <button
                type="button"
                onClick={onOpenDrugSearch}
                className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                title="Tra cứu 43 kháng sinh"
              >
                <Search className="w-4 h-4 text-teal-600" />
              </button>
            )}

            {/* Atlas Quick Access Button on Mobile */}
            {onOpenGuidelineAtlas && (
              <button
                id="btn-open-bvbnd-atlas-mobile"
                onClick={onOpenGuidelineAtlas}
                className="px-2.5 py-1.5 rounded-xl text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1 text-xs font-bold shadow-2xs cursor-pointer"
                title={isEn ? 'BVBND 2026 Atlas' : 'Xem Atlas Lưu đồ BVBND 2026'}
                aria-label="Atlas BVBND"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-extrabold text-[11px]">Atlas</span>
              </button>
            )}

            {/* Export PDF Mobile button */}
            <button
              onClick={onOpenPdfModal}
              className="p-2 rounded-xl bg-teal-600 text-white hover:bg-teal-700 shadow-2xs cursor-pointer"
              title={isEn ? 'PDF' : 'Xuất phiếu hội chẩn'}
            >
              <FileText className="w-4 h-4" />
            </button>

            {/* Hamburger Toggle */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg animate-slideUp">
          <div className="text-xs font-semibold text-slate-600 flex items-center justify-between pb-2 border-b border-slate-100">
            <span>Thuốc đang chọn:</span>
            <span className="font-black text-teal-700">{selectedDrugName}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onOpenAmr();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center space-x-1.5 p-2.5 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Dữ liệu Đề kháng</span>
            </button>
            <button
              onClick={() => {
                onOpenOriginal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center space-x-1.5 p-2.5 rounded-xl text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Giao diện gốc</span>
            </button>
          </div>

          {onOpenQuickPatient && (
            <button
              onClick={() => {
                onOpenQuickPatient();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 cursor-pointer"
            >
              <User className="w-4 h-4 text-teal-600" />
              <span>Chỉnh Sửa Thông Số Bệnh Nhân &amp; Thận</span>
            </button>
          )}

          {onOpenGuidelineAtlas && (
            <button
              onClick={() => {
                onOpenGuidelineAtlas();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 shadow-2xs cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>Xem Trọn Bộ Atlas BVBND 2026</span>
            </button>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="font-bold text-slate-600">Ngôn ngữ:</span>
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => onLanguageChange('vi')}
                className={`px-2.5 py-1 rounded text-xs font-bold ${language === 'vi' ? 'bg-white text-teal-700 shadow-2xs' : 'text-slate-600'}`}
              >
                🇻🇳 Tiếng Việt
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 rounded text-xs font-bold ${language === 'en' ? 'bg-white text-teal-700 shadow-2xs' : 'text-slate-600'}`}
              >
                🇬🇧 English
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              onReset();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl text-xs font-semibold text-slate-500 bg-slate-50 hover:bg-slate-100 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại thông số mặc định</span>
          </button>
        </div>
      )}
    </header>
  );
};
