import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  RotateCcw, 
  Menu, 
  X, 
  ExternalLink,
  ShieldAlert,
  BookOpen,
  Search,
  User,
  Sparkles,
  History,
  Stethoscope,
  ChevronDown,
  Library,
  Table2
} from 'lucide-react';
import { Language } from '../types';
import { CdssLogo } from './CdssLogo';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onReset: () => void;
  onOpenAmr: () => void;
  onOpenSpectrum?: () => void;
  onOpenOriginal: () => void;
  onOpenPdfModal: () => void;
  onOpenGuidelineAtlas?: () => void;
  onOpenDrugSearch?: () => void;
  onOpenQuickPatient?: () => void;
  onOpenPresets?: () => void;
  onOpenSepsisGuide?: () => void;
  onOpenHistory?: () => void;
  savedCount?: number;
  selectedDrugName: string;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onReset,
  onOpenAmr,
  onOpenSpectrum,
  onOpenOriginal,
  onOpenPdfModal,
  onOpenGuidelineAtlas,
  onOpenDrugSearch,
  onOpenQuickPatient,
  onOpenPresets,
  onOpenSepsisGuide,
  onOpenHistory,
  savedCount = 0,
  selectedDrugName
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const libraryRef = useRef<HTMLDivElement>(null);
  const isEn = language === 'en';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (libraryRef.current && !libraryRef.current.contains(e.target as Node)) {
        setLibraryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200/80 no-print relative z-40">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-15 gap-3">
          
          {/* Left: Super-CDSS Brand Identity */}
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="p-1 rounded-xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 shadow-sm border border-teal-500/30 flex items-center justify-center shrink-0">
              <CdssLogo size="sm" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-lg tracking-tight text-slate-900 truncate">
                  InfectoSepsis <span className="text-teal-600">CDSS</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-black tracking-wide bg-slate-900 text-teal-300 shrink-0">
                  v4.0
                </span>
                <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-800 border border-teal-200/80">
                  NICE NG253 • Sepsis-3 • Phoenix 2024 • BVBND 2026 • 43 KS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block truncate">
                {isEn 
                  ? 'Integrated Sepsis Triage, Hour-1 Resuscitation, MDR Regimens & Renal Dosing Cockpit' 
                  : 'Trung Tâm Hỗ Trợ Lâm Sàng Hợp Nhất: Sepsis Giờ Vàng, Phác Đồ MDR & Tính Liều Kháng Sinh'}
              </p>
            </div>
          </div>

          {/* Right: Streamlined Desktop Action Cluster */}
          <div className="hidden lg:flex items-center gap-1.5 shrink-0">
            {/* 1. Clinical Presets */}
            {onOpenPresets && (
              <button
                type="button"
                onClick={onOpenPresets}
                className="px-2.5 py-1.5 rounded-xl text-amber-900 bg-amber-50/90 hover:bg-amber-100 border border-amber-200/80 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                title={isEn ? 'Load real clinical preset cases' : 'Nạp ca lâm sàng mẫu thực tế (Sepsis + Kháng sinh)'}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{isEn ? 'Presets' : 'Ca mẫu'}</span>
              </button>
            )}

            {/* 2. Instant 43 Antibiotics Search */}
            {onOpenDrugSearch && (
              <button
                type="button"
                onClick={onOpenDrugSearch}
                className="px-2.5 py-1.5 rounded-xl text-slate-700 bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                title="Tra cứu nhanh 43 kháng sinh (Phím tắt /)"
                aria-label="Tra cứu 43 kháng sinh"
              >
                <Search className="w-3.5 h-3.5 text-teal-600" />
                <span>{isEn ? '43 Drugs' : 'Tra 43 KS'}</span>
                <kbd className="px-1.5 py-0.2 text-[9px] bg-white border border-slate-300 rounded text-slate-500 font-mono">
                  /
                </kbd>
              </button>
            )}

            {/* 2b. Full Antibiotic Spectrum Matrix */}
            {onOpenSpectrum && (
              <button
                id="btn-open-spectrum-matrix"
                type="button"
                onClick={onOpenSpectrum}
                className="px-2.5 py-1.5 rounded-xl text-indigo-900 bg-indigo-50/90 hover:bg-indigo-100 border border-indigo-200/90 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                title={isEn ? 'Open full antibiotic spectrum matrix' : 'Mở bảng phổ kháng sinh đầy đủ (Gram+, Gram-, Kỵ khí, Không điển hình)'}
                aria-label="Bảng phổ kháng sinh đầy đủ"
              >
                <Table2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>{isEn ? 'Spectrum' : 'Phổ KS'}</span>
              </button>
            )}

            {/* 3. Unified Reference Library & History Dropdown */}
            <div className="relative" ref={libraryRef}>
              <button
                type="button"
                onClick={() => setLibraryOpen(!libraryOpen)}
                className={`px-2.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer relative ${
                  libraryOpen
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <Library className={`w-3.5 h-3.5 ${libraryOpen ? 'text-teal-300' : 'text-teal-600'}`} />
                <span>{isEn ? 'Clinical Library' : 'Tài Liệu & Lịch Sử'}</span>
                {savedCount > 0 && (
                  <span className="px-1.5 min-w-[18px] h-4 rounded-full bg-teal-600 text-white text-[9px] font-black flex items-center justify-center">
                    {savedCount}
                  </span>
                )}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${libraryOpen ? 'rotate-180' : ''}`} />
              </button>

              {libraryOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-1.5 z-50 animate-fadeIn">
                  <div className="px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    {isEn ? 'Guidelines & Evidence' : 'Hướng Dẫn & Dữ Liệu Lâm Sàng'}
                  </div>

                  {onOpenSepsisGuide && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenSepsisGuide();
                        setLibraryOpen(false);
                      }}
                      className="w-full px-2.5 py-2 rounded-xl hover:bg-rose-50/80 text-left flex items-center gap-2.5 transition-colors cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                        <Stethoscope className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-rose-900">Hướng Dẫn Y Khoa Sepsis</div>
                        <div className="text-[10px] text-slate-500 truncate">NICE NG253, Phoenix 2024, NLR, T2MR</div>
                      </div>
                    </button>
                  )}

                  {onOpenGuidelineAtlas && (
                    <button
                      id="btn-open-bvbnd-atlas"
                      type="button"
                      onClick={() => {
                        onOpenGuidelineAtlas();
                        setLibraryOpen(false);
                      }}
                      className="w-full px-2.5 py-2 rounded-xl hover:bg-emerald-50/80 text-left flex items-center gap-2.5 transition-colors cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">Atlas Lưu Đồ BVBND 2026</div>
                        <div className="text-[10px] text-slate-500 truncate">Ảnh phác đồ gốc &amp; kháng sinh đồ</div>
                      </div>
                    </button>
                  )}

                  {onOpenSpectrum && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenSpectrum();
                        setLibraryOpen(false);
                      }}
                      className="w-full px-2.5 py-2 rounded-xl hover:bg-indigo-50/80 text-left flex items-center gap-2.5 transition-colors cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                        <Table2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-900">Bảng Phổ Kháng Sinh Đầy Đủ</div>
                        <div className="text-[10px] text-slate-500 truncate">Gram(+), Gram(-), Kỵ khí, Không điển hình &amp; 5 Lỗ hổng</div>
                      </div>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      onOpenAmr();
                      setLibraryOpen(false);
                    }}
                    className="w-full px-2.5 py-2 rounded-xl hover:bg-amber-50/80 text-left flex items-center gap-2.5 transition-colors cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-amber-900">Đề Kháng Kháng Sinh (AMR)</div>
                      <div className="text-[10px] text-slate-500 truncate">Dữ liệu giám sát vi sinh Việt Nam</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onOpenOriginal();
                      setLibraryOpen(false);
                    }}
                    className="w-full px-2.5 py-2 rounded-xl hover:bg-teal-50/80 text-left flex items-center gap-2.5 transition-colors cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-teal-900">Bản Gốc Stanford / UCSF</div>
                      <div className="text-[10px] text-slate-500 truncate">Đối chiếu dược động học gốc</div>
                    </div>
                  </button>

                  {onOpenHistory && (
                    <>
                      <div className="my-1.5 border-t border-slate-100" />
                      <button
                        type="button"
                        onClick={() => {
                          onOpenHistory();
                          setLibraryOpen(false);
                        }}
                        className="w-full px-2.5 py-2 rounded-xl hover:bg-slate-100 text-left flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                            <History className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">Lịch Sử Ca Đã Lưu</div>
                            <div className="text-[10px] text-slate-500">Hồ sơ lưu trên trình duyệt</div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black">
                          {savedCount}
                        </span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="h-5 w-px bg-slate-200 mx-0.5" />

            {/* 4. Primary PDF Consultation Export */}
            <button
              type="button"
              onClick={onOpenPdfModal}
              className="px-3 py-1.5 rounded-xl text-white bg-teal-600 hover:bg-teal-700 shadow-xs transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title={isEn ? 'Export Unified PDF Consultation Report' : 'Xuất Phiếu Hội Chẩn Sepsis & Kháng Sinh PDF'}
              aria-label="Xuất Phiếu Hội Chẩn PDF"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isEn ? 'PDF Report' : 'Phiếu PDF'}</span>
            </button>

            {/* 5. Reset */}
            <button
              type="button"
              onClick={onReset}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title={isEn ? 'Reset to default patient' : 'Đặt lại thông số mặc định'}
              aria-label="Đặt lại thông số"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* 6. Language Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
              <button
                type="button"
                onClick={() => onLanguageChange('vi')}
                className={`px-2 py-1 rounded-md text-[10px] font-extrabold transition-all cursor-pointer ${
                  language === 'vi' 
                    ? 'bg-white text-teal-700 shadow-2xs' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                VI
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 rounded-md text-[10px] font-extrabold transition-all cursor-pointer ${
                  language === 'en' 
                    ? 'bg-white text-teal-700 shadow-2xs' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Mobile Right Action Icons */}
          <div className="flex items-center gap-1.5 lg:hidden shrink-0">
            {onOpenPresets && (
              <button
                type="button"
                onClick={onOpenPresets}
                className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 cursor-pointer"
                title="Ca lâm sàng mẫu"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            )}

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

            {onOpenSpectrum && (
              <button
                type="button"
                onClick={onOpenSpectrum}
                className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 cursor-pointer"
                title="Bảng phổ kháng sinh đầy đủ"
              >
                <Table2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onOpenPdfModal}
              className="p-2 rounded-xl bg-teal-600 text-white hover:bg-teal-700 shadow-2xs cursor-pointer"
              title="Xuất phiếu hội chẩn PDF"
            >
              <FileText className="w-4 h-4" />
            </button>

            <button
              id="btn-mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Mở menu"
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
            <span>Kháng sinh đang chọn:</span>
            <span className="font-black text-teal-700">{selectedDrugName}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {onOpenSepsisGuide && (
              <button
                type="button"
                onClick={() => {
                  onOpenSepsisGuide();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center space-x-1.5 p-2.5 rounded-xl text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 cursor-pointer"
              >
                <Stethoscope className="w-4 h-4 text-rose-600" />
                <span>HD Sepsis</span>
              </button>
            )}
            {onOpenHistory && (
              <button
                type="button"
                onClick={() => {
                  onOpenHistory();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center space-x-1.5 p-2.5 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 cursor-pointer"
              >
                <History className="w-4 h-4 text-teal-600" />
                <span>Lịch sử ({savedCount})</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                onOpenAmr();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center space-x-1.5 p-2.5 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Dữ liệu AMR</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenOriginal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center space-x-1.5 p-2.5 rounded-xl text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Stanford/UCSF</span>
            </button>
          </div>

          {onOpenQuickPatient && (
            <button
              type="button"
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

          {onOpenSpectrum && (
            <button
              type="button"
              onClick={() => {
                onOpenSpectrum();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 cursor-pointer"
            >
              <Table2 className="w-4 h-4 text-indigo-600" />
              <span>Bảng Phổ Kháng Sinh Đầy Đủ</span>
            </button>
          )}

          {onOpenGuidelineAtlas && (
            <button
              type="button"
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
                type="button"
                onClick={() => onLanguageChange('vi')}
                className={`px-2.5 py-1 rounded text-xs font-bold ${language === 'vi' ? 'bg-white text-teal-700 shadow-2xs' : 'text-slate-600'}`}
              >
                Tiếng Việt
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 rounded text-xs font-bold ${language === 'en' ? 'bg-white text-teal-700 shadow-2xs' : 'text-slate-600'}`}
              >
                English
              </button>
            </div>
          </div>

          <button
            type="button"
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
