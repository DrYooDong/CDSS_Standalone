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
  BookOpen
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
  selectedDrugName
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isEn = language === 'en';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3">
            <div className="p-0.5 rounded-xl bg-gradient-to-br from-slate-900 to-teal-950 shadow-md shadow-teal-500/20 border border-teal-500/30 flex items-center justify-center">
              <CdssLogo size="md" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                  InfectoDose <span className="text-teal-600">CDSS</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
                  v3.0 Pro
                </span>
                <span className="hidden xl:inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  BVBND 2026 • NHSN-CDC
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                {isEn 
                  ? 'Clinical Infection Assessment, MDR Stratification & Precision Antibiotic Dosing' 
                  : 'Đánh Giá Nhiễm Trùng, Vi Khuẩn Đa Kháng & Liều Kháng Sinh Cá Thể Hóa'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation & Actions */}
          <div className="hidden lg:flex items-center space-x-2">
            
            {/* Atlas Hướng Dẫn BVBND */}
            {onOpenGuidelineAtlas && (
              <button
                id="btn-open-bvbnd-atlas"
                onClick={onOpenGuidelineAtlas}
                className="px-3 py-1.5 rounded-lg text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer shadow-2xs"
                title={isEn ? 'BVBND 2026 Flowchart & Antibiogram Atlas' : 'Xem trọn bộ Atlas Lưu đồ Gốc & Dữ liệu Vi sinh BVBND 2026'}
                aria-label="Atlas BVBND"
              >
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>{isEn ? 'BVBND Atlas' : 'Atlas BVBND 2026'}</span>
              </button>
            )}

            {/* AMR Surveillance Lookup */}
            <button
              onClick={onOpenAmr}
              className="p-2 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center"
              title={isEn ? 'Antimicrobial Resistance Data (Vietnam)' : 'Tra cứu dữ liệu đề kháng kháng sinh Việt Nam'}
              aria-label="Dữ liệu Đề kháng"
            >
              <ShieldAlert className="w-4 h-4 text-amber-600" />
            </button>

            {/* Original Preview View */}
            <button
              onClick={onOpenOriginal}
              className="p-2 rounded-lg text-teal-800 bg-teal-50 hover:bg-teal-100 transition-colors flex items-center justify-center"
              title={isEn ? 'View Original Stanford/UCSF Preview' : 'Xem bản xem gốc Stanford/UCSF'}
              aria-label="Giao diện gốc"
            >
              <ExternalLink className="w-4 h-4 text-teal-600" />
            </button>

            {/* Consultation PDF Report */}
            <button
              onClick={onOpenPdfModal}
              className="p-2 rounded-lg text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-all flex items-center justify-center"
              title={isEn ? 'Export PDF / Print' : 'Xuất Phiếu Hội Chẩn / In PDF'}
              aria-label="Xuất Phiếu Hội Chẩn"
            >
              <FileText className="w-4 h-4" />
            </button>

            {/* Reset Button */}
            <button
              onClick={onReset}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors flex items-center justify-center"
              title={isEn ? 'Reset to default patient' : 'Đặt lại thông số mặc định'}
              aria-label="Đặt lại thông số"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => onLanguageChange('vi')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                  language === 'vi' 
                    ? 'bg-white text-teal-700 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🇻🇳 VI
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                  language === 'en' 
                    ? 'bg-white text-teal-700 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🇬🇧 EN
              </button>
            </div>
          </div>

          {/* Mobile Right Bar */}
          <div className="flex items-center space-x-1.5 lg:hidden">
            {/* Atlas Quick Access Button on Mobile */}
            {onOpenGuidelineAtlas && (
              <button
                id="btn-open-bvbnd-atlas-mobile"
                onClick={onOpenGuidelineAtlas}
                className="px-2 py-1.5 rounded-lg text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1 text-xs font-bold shadow-2xs cursor-pointer"
                title={isEn ? 'BVBND 2026 Atlas' : 'Xem Atlas Lưu đồ BVBND 2026'}
                aria-label="Atlas BVBND"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-extrabold text-[11px]">Atlas</span>
              </button>
            )}

            {/* Language Quick Switch */}
            <button
              onClick={() => onLanguageChange(language === 'vi' ? 'en' : 'vi')}
              className="px-2 py-1 rounded-md text-xs font-bold bg-slate-100 border border-slate-200 text-slate-700"
            >
              {language === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}
            </button>

            {/* Export PDF Mobile button */}
            <button
              onClick={onOpenPdfModal}
              className="p-1.5 rounded-lg bg-teal-600 text-white hover:bg-teal-700 shadow-xs"
              title={isEn ? 'PDF' : 'Xuất phiếu'}
            >
              <FileText className="w-4 h-4" />
            </button>

            {/* Hamburger Toggle */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <div className="text-xs font-medium text-slate-500 mb-1">
            {isEn ? 'Active Antibiotic:' : 'Kháng sinh đang chọn:'} <span className="font-bold text-slate-800">{selectedDrugName}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onOpenAmr();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center space-x-1.5 p-2.5 rounded-lg text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200"
            >
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>{isEn ? 'AMR Data VN' : 'Dữ liệu Đề kháng'}</span>
            </button>
            <button
              onClick={() => {
                onOpenOriginal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center space-x-1.5 p-2.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{isEn ? 'Original Mode' : 'Giao diện gốc'}</span>
            </button>
          </div>
          {onOpenGuidelineAtlas && (
            <button
              onClick={() => {
                onOpenGuidelineAtlas();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 shadow-xs"
            >
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>{isEn ? 'Open BVBND Guideline Atlas' : 'Xem Atlas Lưu Đồ BV Bệnh Nhiệt Đới'}</span>
            </button>
          )}
          <button
            onClick={() => {
              onOpenPdfModal();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>{isEn ? 'Export PDF / Print Consultation Record' : 'Xuất Phiếu Hội Chẩn & In PDF'}</span>
          </button>
          <button
            onClick={() => {
              onReset();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isEn ? 'Reset Default Parameters' : 'Khôi phục thông số chuẩn'}</span>
          </button>
        </div>
      )}
    </header>
  );
};
