import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Download, 
  BookOpen, 
  Layers, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  ShieldAlert, 
  ChevronRight,
  ChevronLeft,
  FileText,
  Search,
  ExternalLink,
  PanelRightClose,
  PanelRightOpen,
  Eye
} from 'lucide-react';
import { 
  GUIDELINE_IMAGES, 
  GuidelineImageEntry, 
  getGuidelineImagesForSite, 
  getMdrGuidelineImages 
} from '../../selection/data/guidelineImages';
import { InfectionSite, Population } from '../../selection/types';

interface GuidelineImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialImageId?: string;
  currentSite?: InfectionSite;
  currentPopulation?: Population;
  currentMdr?: string;
}

export const GuidelineImageModal: React.FC<GuidelineImageModalProps> = ({
  isOpen,
  onClose,
  initialImageId,
  currentSite = 'respiratory',
  currentPopulation = 'adult',
  currentMdr
}) => {
  // Current active image entry
  const [selectedId, setSelectedId] = useState<string>(initialImageId || 'adult_resp_regimen');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [mobileTab, setMobileTab] = useState<'image' | 'notes'>('image');
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const [filterPopulation, setFilterPopulation] = useState<Population | 'all'>('adult');
  const [filterSite, setFilterSite] = useState<InfectionSite | 'all'>('respiratory');

  // Update selectedId whenever initialImageId or current context changes upon opening
  useEffect(() => {
    if (isOpen) {
      if (initialImageId) {
        setSelectedId(initialImageId);
        const img = GUIDELINE_IMAGES.find(i => i.id === initialImageId);
        if (img) {
          if (img.population !== 'all') setFilterPopulation(img.population);
          if (img.site !== 'all') setFilterSite(img.site);
        }
      } else if (currentMdr) {
        const mdrImgs = getMdrGuidelineImages(currentMdr);
        if (mdrImgs.length > 0) setSelectedId(mdrImgs[0].id);
      } else {
        const siteImgs = getGuidelineImagesForSite(currentSite, currentPopulation);
        if (siteImgs.regimen) {
          setSelectedId(siteImgs.regimen.id);
        } else if (siteImgs.antibiogram) {
          setSelectedId(siteImgs.antibiogram.id);
        }
        setFilterPopulation(currentPopulation);
        setFilterSite(currentSite);
      }
      setZoomLevel(1);
      setMobileTab('image');
    }
  }, [isOpen, initialImageId, currentSite, currentPopulation, currentMdr]);

  const currentIndex = useMemo(() => {
    return GUIDELINE_IMAGES.findIndex(i => i.id === selectedId);
  }, [selectedId]);

  const currentImage = useMemo(() => {
    return GUIDELINE_IMAGES[currentIndex >= 0 ? currentIndex : 0];
  }, [currentIndex]);

  // Pair for current site (Regimen + Antibiogram)
  const currentPair = useMemo(() => {
    if (currentImage.site !== 'all' && currentImage.population !== 'all') {
      return getGuidelineImagesForSite(currentImage.site as InfectionSite, currentImage.population as Population);
    }
    return { regimen: undefined, antibiogram: undefined };
  }, [currentImage]);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.75));
  const handleZoomReset = () => setZoomLevel(1);
  const handleToggleZoom = () => setZoomLevel(prev => (prev === 1 ? 1.5 : 1));

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + GUIDELINE_IMAGES.length) % GUIDELINE_IMAGES.length;
    setSelectedId(GUIDELINE_IMAGES[prevIdx].id);
    setZoomLevel(1);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % GUIDELINE_IMAGES.length;
    setSelectedId(GUIDELINE_IMAGES[nextIdx].id);
    setZoomLevel(1);
  };

  const imageSrc = `./assets/guidelines/${currentImage.imageFilename}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-7xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[94vh] max-h-[980px]">
        
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white p-3 sm:p-4 flex items-center justify-between shrink-0 border-b border-teal-500/20">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-teal-300" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-sm sm:text-base text-white tracking-tight truncate">
                  {currentImage.titleVi}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/25 text-teal-300 border border-teal-500/30 shrink-0">
                  Trang {currentImage.pdfPage} (BVBND 2026)
                </span>
                <span className="text-[10px] text-slate-400 hidden lg:inline">
                  (Ảnh {currentIndex + 1}/{GUIDELINE_IMAGES.length})
                </span>
              </div>
              <p className="text-xs text-slate-300 truncate mt-0.5">
                {currentImage.subtitleVi}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            {/* Prev / Next buttons in header */}
            <div className="flex items-center bg-white/10 rounded-lg p-0.5 border border-white/10 mr-1 hidden sm:flex">
              <button
                type="button"
                onClick={handlePrev}
                className="p-1.5 rounded-md hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer"
                title="Lưu đồ trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono px-1.5 text-slate-300">
                {currentIndex + 1}/{GUIDELINE_IMAGES.length}
              </span>
              <button
                type="button"
                onClick={handleNext}
                className="p-1.5 rounded-md hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer"
                title="Lưu đồ tiếp theo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Toggle Sidebar on Desktop */}
            <button
              type="button"
              onClick={() => setIsSidebarVisible(prev => !prev)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors hidden md:flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              title={isSidebarVisible ? 'Ẩn cột ghi chú' : 'Hiện cột ghi chú'}
            >
              {isSidebarVisible ? (
                <>
                  <PanelRightClose className="w-4 h-4" />
                  <span className="hidden xl:inline">Mở rộng ảnh</span>
                </>
              ) : (
                <>
                  <PanelRightOpen className="w-4 h-4" />
                  <span className="hidden xl:inline">Hiện ghi chú</span>
                </>
              )}
            </button>

            <a
              href={imageSrc}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Mở tab mới xem ảnh gốc kích thước đầy đủ"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <a
              href={imageSrc}
              download={currentImage.imageFilename}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Tải ảnh gốc về máy"
            >
              <Download className="w-4 h-4" />
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Đóng modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Secondary Navigation & Category Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs">
          
          {/* Quick Select Buttons: Regimen vs Antibiogram for same site */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {currentPair.regimen && (
              <button
                type="button"
                onClick={() => { setSelectedId(currentPair.regimen!.id); setZoomLevel(1); }}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedId === currentPair.regimen.id
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Lưu đồ Phác đồ</span>
              </button>
            )}

            {currentPair.antibiogram && (
              <button
                type="button"
                onClick={() => { setSelectedId(currentPair.antibiogram!.id); setZoomLevel(1); }}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedId === currentPair.antibiogram.id
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Dữ liệu Vi sinh</span>
              </button>
            )}

            {/* Quick switcher between Adult / Peds if site has both */}
            {currentImage.site !== 'all' && (
              <div className="h-5 w-px bg-slate-300 mx-1 hidden sm:block" />
            )}

            {currentImage.site !== 'all' && (
              <div className="inline-flex rounded-lg border border-slate-300 bg-white p-0.5">
                <button
                  type="button"
                  onClick={() => {
                    const target = GUIDELINE_IMAGES.find(i => i.site === currentImage.site && i.population === 'adult' && i.category === currentImage.category)
                      || GUIDELINE_IMAGES.find(i => i.site === currentImage.site && i.population === 'adult');
                    if (target) { setSelectedId(target.id); setZoomLevel(1); }
                  }}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                    currentImage.population === 'adult'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Người lớn
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const target = GUIDELINE_IMAGES.find(i => i.site === currentImage.site && i.population === 'pediatric' && i.category === currentImage.category)
                      || GUIDELINE_IMAGES.find(i => i.site === currentImage.site && i.population === 'pediatric');
                    if (target) { setSelectedId(target.id); setZoomLevel(1); }
                  }}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                    currentImage.population === 'pediatric'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Trẻ em
                </button>
              </div>
            )}
          </div>

          {/* Jump to any other site / MDR dropdown */}
          <div className="flex items-center gap-2 ml-auto flex-wrap">
            <span className="text-[11px] font-medium text-slate-500 hidden md:inline">Chọn lưu đồ:</span>
            <select
              value={selectedId}
              onChange={(e) => { setSelectedId(e.target.value); setZoomLevel(1); }}
              className="bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-2.5 py-1 font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-hidden max-w-[220px] sm:max-w-xs cursor-pointer"
            >
              <optgroup label="Người lớn — Tiêu điểm nhiễm trùng">
                <option value="adult_resp_regimen">Viêm phổi — Phác đồ (Trang 9)</option>
                <option value="adult_resp_antibiogram">Viêm phổi — Vi sinh (Trang 8)</option>
                <option value="adult_blood_regimen">Nhiễm khuẩn huyết — Phác đồ (Trang 13)</option>
                <option value="adult_blood_antibiogram">Nhiễm khuẩn huyết — Vi sinh (Trang 12)</option>
                <option value="adult_ssti_regimen">Da & mô mềm — Phác đồ (Trang 10)</option>
                <option value="adult_ssti_antibiogram">Da & mô mềm — Vi sinh (Trang 9)</option>
                <option value="adult_uti_regimen">Tiết niệu — Phác đồ (Trang 11)</option>
                <option value="adult_uti_antibiogram">Tiết niệu — Vi sinh (Trang 10)</option>
                <option value="adult_sbp_regimen">Dịch báng (SBP) — Phác đồ (Trang 12)</option>
                <option value="adult_sbp_antibiogram">Dịch báng (SBP) — Vi sinh (Trang 11)</option>
              </optgroup>
              <optgroup label="Trẻ em — Tiêu điểm nhiễm trùng">
                <option value="peds_resp_regimen">Nhi: Viêm phổi — Phác đồ (Trang 4)</option>
                <option value="peds_resp_antibiogram">Nhi: Viêm phổi — Vi sinh (Trang 4)</option>
                <option value="peds_blood_regimen">Nhi: Nhiễm khuẩn huyết — Phác đồ (Trang 6)</option>
                <option value="peds_blood_antibiogram">Nhi: Nhiễm khuẩn huyết — Vi sinh (Trang 5)</option>
                <option value="peds_ssti_regimen">Nhi: Da & mô mềm — Phác đồ (Trang 7)</option>
                <option value="peds_ssti_antibiogram">Nhi: Da & mô mềm — Vi sinh (Trang 6)</option>
                <option value="peds_uti_regimen">Nhi: Tiết niệu — Phác đồ (Trang 8)</option>
                <option value="peds_uti_antibiogram">Nhi: Tiết niệu — Vi sinh (Trang 7)</option>
              </optgroup>
              <optgroup label="Vi khuẩn đa kháng (MDR Pathways)">
                <option value="mdr_cre_table1">CRE: Bảng 1 KS còn nhạy (Trang 15)</option>
                <option value="mdr_cre_flowchart">CRE: Bảng 2 Lưu đồ kiểu men KPC/OXA/MBL (Trang 15)</option>
                <option value="mdr_pseudo_dosing">P. aeruginosa: Bảng liều DTR (Trang 17)</option>
                <option value="mdr_pseudo_flowchart">P. aeruginosa: Lưu đồ điều trị DTR (Trang 18)</option>
                <option value="mdr_acineto_dosing">A. baumannii: Bảng liều CRAB (Trang 20)</option>
                <option value="mdr_acineto_flowchart">A. baumannii & S. maltophilia: Lưu đồ (Trang 21)</option>
              </optgroup>
            </select>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg p-0.5">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.75}
                className="p-1 hover:bg-slate-100 rounded text-slate-700 disabled:opacity-40 cursor-pointer"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono font-bold px-1 text-slate-700 w-9 text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 2.5}
                className="p-1 hover:bg-slate-100 rounded text-slate-700 disabled:opacity-40 cursor-pointer"
                title="Phóng to"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleZoomReset}
                className="p-1 hover:bg-slate-100 rounded text-slate-700 cursor-pointer"
                title="Khôi phục 100%"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile View Switcher (Tabs) */}
        <div className="md:hidden bg-slate-200 p-1 flex items-center justify-center shrink-0 border-b border-slate-300">
          <div className="grid grid-cols-2 w-full max-w-sm bg-slate-300 rounded-lg p-0.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setMobileTab('image')}
              className={`py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mobileTab === 'image' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Xem Lưu Đồ</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileTab('notes')}
              className={`py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mobileTab === 'notes' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Ghi Chú &amp; Khuyến Cáo</span>
            </button>
          </div>
        </div>

        {/* Modal Center: Split Image Preview & Clinical Notes */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-slate-900">
          
          {/* Main Visual Frame (Scrollable & Zoomable) */}
          <div className={`flex-1 min-w-0 overflow-auto p-3 sm:p-6 items-start justify-center relative bg-slate-950/95 select-none ${
            mobileTab === 'notes' ? 'hidden md:flex' : 'flex'
          }`}>
            <div 
              className="flex items-center justify-center m-auto transition-all duration-200 cursor-zoom-in"
              onClick={handleToggleZoom}
              title="Nhấp đúp hoặc bấm để chuyển đổi phóng to 150%"
              style={{ 
                width: zoomLevel === 1 ? '100%' : `${Math.round(zoomLevel * 100)}%`,
                minWidth: zoomLevel === 1 ? 'auto' : `${Math.round(zoomLevel * 100)}%`
              }}
            >
              <img
                src={imageSrc}
                alt={currentImage.titleVi}
                className={`object-contain rounded-lg shadow-2xl bg-white border border-slate-700 transition-all ${
                  zoomLevel === 1 ? 'max-w-full max-h-[72vh]' : 'w-full h-auto'
                }`}
                loading="eager"
              />
            </div>

            {/* Floating Zoom & Hint Indicator */}
            <div className="absolute bottom-3 right-3 bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-1 rounded-md border border-slate-700 shadow-md flex items-center gap-2">
              <span>Zoom: {Math.round(zoomLevel * 100)}%</span>
              <span className="text-slate-400 text-[10px] hidden sm:inline">• Click ảnh để phóng 150%</span>
            </div>
          </div>

          {/* Right Clinical Sidebar: Key Guidelines & Rationale */}
          {isSidebarVisible && (
            <div className={`w-full md:w-80 lg:w-96 bg-white border-t md:border-t-0 md:border-l border-slate-200 overflow-y-auto p-4 sm:p-5 flex-col shrink-0 ${
              mobileTab === 'image' ? 'hidden md:flex' : 'flex'
            }`}>
              <div className="space-y-4">
                
                {/* Reference Header */}
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    Chuẩn hóa BVBND eMed 2026
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 mt-1.5">
                    Điểm Cốt Lõi Lâm Sàng
                  </h4>
                  <p className="text-xs text-slate-500">
                    Trích xuất trực tiếp từ tài liệu gốc Trang {currentImage.pdfPage}/24
                  </p>
                </div>

                {/* Summary Points */}
                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Quy tắc điều trị &amp; Khuyến cáo:
                  </div>
                  <div className="space-y-2">
                    {currentImage.summaryPointsVi.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                        <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safety Cautions (if any) */}
                {currentImage.clinicalCautionsVi && currentImage.clinicalCautionsVi.length > 0 && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900">
                      <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Lưu ý an toàn &amp; Chống chỉ định:</span>
                    </div>
                    <ul className="list-disc list-inside text-xs space-y-1 text-rose-900 leading-relaxed font-medium">
                      {currentImage.clinicalCautionsVi.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Source Footnote */}
                <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
                  <div className="font-semibold text-slate-700">Tài liệu tham chiếu chuẩn:</div>
                  <p>
                    BV Bệnh Nhiệt Đới TP.HCM — <em>Hướng dẫn sử dụng kháng sinh (Quyết định áp dụng nội viện 2026)</em>.
                  </p>
                  <p className="font-mono text-[10px] text-slate-400">
                    File gốc: 7. HƯỚNG DẪN SỬ DỤNG KHÁNG SINH - BV Bệnh nhiệt đới.pdf (Trang {currentImage.pdfPage})
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold">Bản scan số hóa 100% độ sắc nét cao (High-Fidelity)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-all cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Trang trước</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-all cursor-pointer flex items-center gap-1"
            >
              <span>Trang sau</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-2 px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all cursor-pointer shadow-2xs"
            >
              Đóng Atlas
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

