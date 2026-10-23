import React, { useState } from 'react';
import {
  InfectionSite,
  Population,
  RiskGroup,
  SepsisSource,
  SpecificPathogenRisk,
  EmpiricRegimen,
  AntibiogramDataset
} from '../../selection/types';
import { getEmpiricRegimens, getAntibiogramForSite } from '../../selection/engine';
import { SourceBadge } from './SourceBadge';
import { DoseResult } from '../../utils/drugDataExtractor';
import { PatientState, CalculatedRenalMetrics } from '../../types';
import { ANTIBIOTICS } from '../../data/antibiotics';
import { 
  ClipboardList, 
  FlaskConical, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Calculator,
  Clock,
  ShieldAlert,
  Info,
  BookOpen,
  Sparkles,
  Zap,
  Filter,
  Copy,
  Check,
  User,
  Activity,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface StepEmpiricProps {
  site: InfectionSite;
  population: Population;
  riskGroup: RiskGroup;
  sepsisSource?: SepsisSource;
  specificRisks: SpecificPathogenRisk[];
  onSelectDrugForDosing: (drugId: string) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onOpenGuidelineAtlas?: (imageId?: string) => void;
  dosingResult?: DoseResult | null;
  selectedDrugId?: string;
  patient?: PatientState;
  renal?: CalculatedRenalMetrics;
  onCalculateDoseForDrug?: (drugId: string) => void;
  onPatientChange?: (updated: Partial<PatientState>) => void;
}

export const StepEmpiric: React.FC<StepEmpiricProps> = ({
  site,
  population,
  riskGroup,
  sepsisSource,
  specificRisks,
  onSelectDrugForDosing,
  onNextStep,
  onPrevStep,
  onOpenGuidelineAtlas,
  dosingResult,
  selectedDrugId,
  patient,
  renal,
  onCalculateDoseForDrug,
  onPatientChange
}) => {
  const [activeTab, setActiveTab] = useState<'regimens' | 'antibiogram'>('regimens');
  const [selectedFilterRisk, setSelectedFilterRisk] = useState<string>('all');
  const [copiedDrugId, setCopiedDrugId] = useState<string | null>(null);

  const getTargetImageId = (tab: 'regimens' | 'antibiogram') => {
    const isAdult = population === 'adult';
    if (tab === 'antibiogram') {
      if (site === 'respiratory') return isAdult ? 'adult_resp_antibiogram' : 'peds_resp_antibiogram';
      if (site === 'sepsis') return isAdult ? 'adult_blood_antibiogram' : 'peds_blood_antibiogram';
      if (site === 'skin_soft_tissue') return isAdult ? 'adult_ssti_antibiogram' : 'peds_ssti_antibiogram';
      if (site === 'urinary') return isAdult ? 'adult_uti_antibiogram' : 'peds_uti_antibiogram';
      return 'adult_sbp_antibiogram';
    } else {
      if (site === 'respiratory') return isAdult ? 'adult_resp_regimen' : 'peds_resp_regimen';
      if (site === 'sepsis') return isAdult ? 'adult_blood_regimen' : 'peds_blood_regimen';
      if (site === 'skin_soft_tissue') return isAdult ? 'adult_ssti_regimen' : 'peds_ssti_regimen';
      if (site === 'urinary') return isAdult ? 'adult_uti_regimen' : 'peds_uti_regimen';
      return 'adult_sbp_regimen';
    }
  };

  const currentPdfPage = site === 'respiratory' 
    ? (population === 'adult' ? (activeTab === 'antibiogram' ? 8 : 9) : 4) 
    : site === 'sepsis' 
    ? (population === 'adult' ? (activeTab === 'antibiogram' ? 12 : 13) : (activeTab === 'antibiogram' ? 5 : 6)) 
    : site === 'skin_soft_tissue' 
    ? (population === 'adult' ? (activeTab === 'antibiogram' ? 9 : 10) : (activeTab === 'antibiogram' ? 6 : 7)) 
    : site === 'urinary' 
    ? (population === 'adult' ? (activeTab === 'antibiogram' ? 10 : 11) : (activeTab === 'antibiogram' ? 7 : 8)) 
    : (activeTab === 'antibiogram' ? 11 : 12);

  // Lấy danh sách phác đồ khởi đầu theo phân tầng chuẩn BVBND 2026
  const allRegimens: EmpiricRegimen[] = getEmpiricRegimens(
    site,
    population,
    riskGroup,
    sepsisSource,
    specificRisks
  );

  // Filter based on quick pathogen filter if user selects one
  const regimens = allRegimens.filter(r => {
    if (selectedFilterRisk === 'all') return true;
    if (selectedFilterRisk === 'base') return !r.specificRisk;
    return r.specificRisk === selectedFilterRisk;
  });

  // Lấy dữ liệu vi sinh tại chỗ
  const antibiogramData: AntibiogramDataset | undefined = getAntibiogramForSite(site, population);

  // Active calculated drug name in Phân hệ 2
  const activeCalculatedDrug = ANTIBIOTICS.find(a => a.id === selectedDrugId);
  const activeCalculatedDrugName = activeCalculatedDrug ? activeCalculatedDrug.name : selectedDrugId;

  // Site label formatting
  const siteLabels: Record<InfectionSite, string> = {
    respiratory: 'Hô hấp (Viêm phổi CAP / HAP / VAP)',
    sepsis: 'Nhiễm khuẩn huyết / Sốc nhiễm khuẩn',
    skin_soft_tissue: 'Da và Mô mềm (SSTI)',
    urinary: 'Tiết niệu (UTI)',
    peritoneal: 'Dịch báng / Viêm phúc mạc (SBP)',
    gastrointestinal: 'Tiêu hóa / Ổ bụng',
    cns: 'Thần kinh trung ương (Viêm màng não mủ)'
  };

  const handleCopyOrder = (text: string, drugId: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedDrugId(drugId);
      setTimeout(() => setCopiedDrugId(null), 2000);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-200">
                Giai Đoạn 2
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {population === 'adult' ? 'Người lớn' : 'Trẻ em'} • {siteLabels[site] || site}
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 w-full sm:w-auto mt-1 sm:mt-0">
                Phác Đồ Kháng Sinh Khởi Đầu &amp; Dữ Liệu Vi Sinh
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Khuyến cáo phác đồ theo hướng dẫn BV Bệnh Nhiệt Đới 2026 (P.4-13) • Tích hợp tính liều cá thể hóa trực tiếp theo chức năng thận.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenGuidelineAtlas && (
              <button
                id="btn-open-site-flowchart"
                type="button"
                onClick={() => onOpenGuidelineAtlas(getTargetImageId(activeTab))}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                title="Xem ảnh lưu đồ phác đồ / vi sinh gốc từ Hướng dẫn Bệnh viện Bệnh Nhiệt Đới 2026"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>Xem Lưu Đồ Gốc BVBND (Trang {currentPdfPage})</span>
              </button>
            )}

            {/* Tab switch */}
            <div className="w-full sm:w-auto grid grid-cols-2 sm:flex p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('regimens')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  activeTab === 'regimens'
                    ? 'bg-white text-teal-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ClipboardList className="w-3.5 h-3.5 text-teal-600" />
                <span>Phác đồ Khuyến cáo ({allRegimens.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('antibiogram')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  activeTab === 'antibiogram'
                    ? 'bg-white text-teal-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5 text-teal-600" />
                <span>Vi sinh &amp; KSĐ Tại Chỗ</span>
              </button>
            </div>
          </div>
        </div>



        {/* Phân tầng nguy cơ cảnh báo */}
        <div className={`mt-3 p-3.5 rounded-xl border text-xs ${
          riskGroup === 'group_2'
            ? 'bg-amber-50/90 border-amber-200 text-amber-950'
            : 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
              riskGroup === 'group_2' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {riskGroup === 'group_2' ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
            </div>
            <div>
              <strong className="font-bold text-xs sm:text-sm">
                {riskGroup === 'group_2'
                  ? 'Bệnh nhân thuộc Nhóm 2 (Nguy cơ cao vi khuẩn đa kháng hoặc bệnh cảnh nặng):'
                  : 'Bệnh nhân thuộc Nhóm 1 (Ít nguy cơ vi khuẩn đa kháng):'}
              </strong>
              <p className="mt-1 leading-relaxed text-slate-700">
                {riskGroup === 'group_2'
                  ? 'Bắt buộc sử dụng kháng sinh phổ rộng theo lưu đồ BVBND (BL-BLI liều cao hoặc Carbapenem), phối hợp bao phủ MRSA nếu có chỉ định. Luôn lấy cấy máu và bệnh phẩm trước liều đầu tiên.'
                  : 'Ưu tiên kháng sinh phổ hẹp hoặc phổ trung bình phù hợp. Hạn chế lạm dụng nhóm Carbapenem, Colistin hay Vancomycin khi chưa có bằng chứng vi sinh.'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Pathogen Filter if Group 2 */}
        {riskGroup === 'group_2' && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              Lọc nhanh phác đồ:
            </span>
            <button
              type="button"
              onClick={() => setSelectedFilterRisk('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedFilterRisk === 'all'
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Tất cả ({allRegimens.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilterRisk('base')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedFilterRisk === 'base'
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Phác đồ Khởi đầu Nền
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilterRisk('mrsa')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedFilterRisk === 'mrsa'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              + Nguy cơ MRSA
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilterRisk('esbl')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedFilterRisk === 'esbl'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              + Nguy cơ ESBL
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilterRisk('pseudo_acineto')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedFilterRisk === 'pseudo_acineto'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              + Pseudomonas / Acineto đa kháng
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {activeTab === 'regimens' && (
        <div className="space-y-4">
          {regimens.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/90 shadow-xs">
              <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-700 text-sm font-semibold">
                Không tìm thấy phác đồ khớp với bộ lọc cụ thể hiện tại.
              </p>
              <button
                type="button"
                onClick={() => setSelectedFilterRisk('all')}
                className="mt-3 px-4 py-2 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl transition-all cursor-pointer"
              >
                Hiển thị tất cả phác đồ cho vị trí này ({allRegimens.length})
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {regimens.map((regimen) => (
                <div
                  key={regimen.id}
                  className="p-5 rounded-2xl border border-slate-200/90 bg-white shadow-xs hover:border-teal-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                        <span>{regimen.titleVi}</span>
                        {regimen.specificRisk && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            Trúng đích {regimen.specificRisk.toUpperCase()}
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-500 italic mt-0.5">
                        {regimen.titleEn}
                      </p>
                    </div>
                    <SourceBadge source={regimen.source} />
                  </div>

                  {/* Danh sách thuốc */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Thuốc lựa chọn &amp; Liều chuẩn BVBND 2026:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {regimen.drugs.map((drug, dIdx) => {
                        const drugDisplayName = drug.nameVi || drug.drugName || 'Kháng sinh';
                        const doseText = drug.standardDoseVi || drug.dosageVi || 'Theo hướng dẫn';
                        const routeText = drug.route || 'IV';
                        const hasDosingTool = Boolean(drug.drugId);
                        const isCalculatedActive = selectedDrugId === drug.drugId && Boolean(dosingResult);

                        return (
                          <div
                            key={dIdx}
                            className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                              isCalculatedActive
                                ? 'border-teal-500 ring-2 ring-teal-500/20 bg-teal-50/30 shadow-xs'
                                : 'border-slate-200/80 bg-slate-50/70 hover:bg-white hover:border-teal-200 hover:shadow-xs'
                            }`}
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-bold text-sm text-teal-950 flex items-center gap-1.5">
                                  <span>{drugDisplayName}</span>
                                  {isCalculatedActive && (
                                    <span className="px-1.5 py-0.2 rounded text-[10px] font-black uppercase tracking-wider bg-teal-600 text-white">
                                      Đang tính
                                    </span>
                                  )}
                                </span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200/80 text-slate-700 shrink-0">
                                  {routeText}
                                </span>
                              </div>
                              <div className="mt-1.5 text-xs text-slate-700">
                                <span className="font-semibold text-slate-900">
                                  Liều chuẩn BVBND:
                                </span>{' '}
                                <span className="text-slate-800 font-medium">{doseText}</span>
                              </div>
                              {drug.infusionNoteVi && (
                                <div className="mt-1.5 text-[11px] text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/70 flex items-center gap-1.5 font-medium">
                                  <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                                  <span>{drug.infusionNoteVi}</span>
                                </div>
                              )}
                            </div>

                            {/* HIỂN THỊ KẾT QUẢ TÍNH LIỀU CÁ THỂ HÓA (DOSING RESULT TỪ PHÂN HỆ 2) TRỰC TIẾP TRÊN THẺ THUỐC */}
                            {isCalculatedActive && dosingResult && (
                              <div className="mt-3 p-3 rounded-xl bg-white border border-teal-300 shadow-2xs space-y-2.5 animate-fadeIn">
                                <div className="flex items-center justify-between gap-1 flex-wrap pb-1.5 border-b border-slate-100">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                                    <span className="text-[11px] font-extrabold uppercase text-teal-900 tracking-wider">
                                      Liều Cá Thể Hóa Theo Thận (CrCl {renal?.crcl} mL/p)
                                    </span>
                                  </div>
                                  <div>
                                    {dosingResult.reductionPercentage && dosingResult.reductionPercentage > 0 ? (
                                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                        Giảm {dosingResult.reductionPercentage}% liều
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                        100% liều chuẩn
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Loading dose if applicable */}
                                {dosingResult.loadingDoseTextVi && (
                                  <div className="text-xs bg-amber-50/80 p-2 rounded-lg border border-amber-200/70 text-amber-950">
                                    <span className="font-extrabold text-amber-900">Liều nạp (Loading):</span>{' '}
                                    <span className="font-medium">{dosingResult.loadingDoseTextVi}</span>
                                  </div>
                                )}

                                {/* Maintenance dose */}
                                <div className="text-xs bg-teal-50/90 p-2.5 rounded-lg border border-teal-200/90 text-teal-950">
                                  <div className="text-[10px] font-bold text-teal-700 uppercase tracking-wider mb-0.5">
                                    Liều duy trì khuyến nghị:
                                  </div>
                                  <div className="text-sm font-black text-teal-950 leading-snug">
                                    {dosingResult.maintenanceDoseTextVi}
                                  </div>
                                  {dosingResult.infusionInstructionsVi && (
                                    <div className="mt-1 text-[11px] text-teal-800 flex items-center gap-1 font-medium">
                                      <Clock className="w-3 h-3 text-teal-600 shrink-0" />
                                      <span>{dosingResult.infusionInstructionsVi}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Renal adjustment advice */}
                                {dosingResult.renalAdjustmentAdviceVi && (
                                  <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200/70 flex items-start gap-1.5 leading-relaxed">
                                    <ShieldAlert className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                                    <span>{dosingResult.renalAdjustmentAdviceVi}</span>
                                  </div>
                                )}

                                {/* Action buttons: Copy nursing order & jump to Phân hệ 2 */}
                                {dosingResult.orderTextVi && (
                                  <div className="pt-1 flex items-center justify-between gap-2 flex-wrap">
                                    <button
                                      type="button"
                                      onClick={() => handleCopyOrder(dosingResult.orderTextVi, drug.drugId!)}
                                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                                      title="Sao chép y lệnh điều dưỡng vào clipboard"
                                    >
                                      {copiedDrugId === drug.drugId ? (
                                        <>
                                          <Check className="w-3 h-3 text-emerald-600" />
                                          <span className="text-emerald-700 font-extrabold">Đã sao chép!</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3 h-3 text-slate-500" />
                                          <span>Sao chép y lệnh</span>
                                        </>
                                      )}
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => onSelectDrugForDosing(drug.drugId!)}
                                      className="text-[11px] font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer hover:underline"
                                    >
                                      <span>Bảng tính liều chi tiết &amp; DDI</span>
                                      <ArrowRight className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Nút hành động tính liều */}
                            {hasDosingTool && drug.drugId && (
                              <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between gap-2 flex-wrap">
                                <span className="text-[11px] text-teal-700 font-medium flex items-center gap-1">
                                  <Calculator className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                                  <span>Máy tính 43 KS</span>
                                </span>
                                
                                <div className="flex items-center gap-1.5">
                                  {onCalculateDoseForDrug && (
                                    <button
                                      type="button"
                                      onClick={() => onCalculateDoseForDrug(drug.drugId!)}
                                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-2xs ${
                                        isCalculatedActive
                                          ? 'bg-teal-700 text-white'
                                          : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200'
                                      }`}
                                      title={`Tính liều ${drugDisplayName} trực tiếp tại chỗ theo CrCl ${renal?.crcl ?? 90} mL/phút`}
                                    >
                                      <Zap className="w-3 h-3 text-amber-500" />
                                      <span>{isCalculatedActive ? 'Đang hiển thị' : 'Tính liều tại đây'}</span>
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => onSelectDrugForDosing(drug.drugId!)}
                                    className="px-2.5 py-1 text-xs font-bold rounded-lg bg-teal-600 hover:bg-teal-700 active:scale-95 text-white shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                                    title={`Xem bảng tính liều cá thể hóa, tương tác thuốc và lọc máu của ${drugDisplayName}`}
                                  >
                                    <span>Bảng tính liều &amp; DDI</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quy tắc phối hợp */}
                  {regimen.combinationRulesVi && regimen.combinationRulesVi.length > 0 && (
                    <div className="mt-4 p-3.5 rounded-xl bg-teal-50/60 border border-teal-100">
                      <h4 className="text-xs font-bold text-teal-950 mb-1.5 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-teal-600" />
                        <span>Quy tắc phối hợp lâm sàng:</span>
                      </h4>
                      <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                        {regimen.combinationRulesVi.map((rule, rIdx) => (
                          <li key={rIdx}>{rule}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Chú ý & Cảnh báo an toàn */}
                  {regimen.cautionVi && regimen.cautionVi.length > 0 && (
                    <div className="mt-3 p-3.5 rounded-xl bg-rose-50/70 border border-rose-200/80">
                      <h4 className="text-xs font-bold text-rose-950 mb-1.5 flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                        <span>Chú ý an toàn &amp; Chống chỉ định phối hợp:</span>
                      </h4>
                      <ul className="list-disc list-inside text-xs text-rose-900 space-y-1">
                        {regimen.cautionVi.map((c, cIdx) => (
                          <li key={cIdx}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Antibiogram */}
      {activeTab === 'antibiogram' && (
        <div className="space-y-4">
          {antibiogramData ? (
            <div className="p-5 rounded-2xl border border-slate-200/90 bg-white shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Dữ liệu Vi sinh &amp; Kháng sinh đồ tại chỗ — {siteLabels[site] || site} ({population === 'adult' ? 'Người lớn' : 'Trẻ em'})
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Khảo sát vi sinh BV Bệnh Nhiệt Đới: {antibiogramData.period} | Tổng số mẫu phân lập: {antibiogramData.sampleTotal} chủng
                  </p>
                </div>
                <SourceBadge source={antibiogramData.source} />
              </div>

              {/* Bảng vi khuẩn */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[550px] text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                      <th className="py-2.5 px-3">Tác nhân gây bệnh</th>
                      <th className="py-2.5 px-3 text-center">Tỷ lệ phân lập</th>
                      <th className="py-2.5 px-3">Độ nhạy cảm với kháng sinh thường dùng</th>
                      <th className="py-2.5 px-3">Đặc điểm kháng thuốc</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {antibiogramData.organisms.map((org, oIdx) => (
                      <tr key={oIdx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3 font-bold text-slate-900">
                          {org.organismName}
                          <div className="text-[11px] text-slate-500 font-normal">
                            (n = {org.sampleCount})
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center font-extrabold text-teal-700">
                          {org.pctOfIsolates}%
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-wrap gap-1.5">
                            {org.sensitivities.map((s, sIdx) => {
                              const isHigh = s.sensitivityPct >= 70;
                              const isLow = s.sensitivityPct < 40;
                              return (
                                <span
                                  key={sIdx}
                                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                                    isHigh
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                      : isLow
                                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                                      : 'bg-amber-50 text-amber-800 border-amber-200'
                                  }`}
                                  title={`${s.antibioticName}: ${s.sensitivityPct}% nhạy`}
                                >
                                  {s.antibioticName}: <strong className="font-extrabold">{s.sensitivityPct}%</strong>
                                </span>
                              );
                            })}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-rose-700 font-medium">
                          {org.notableResistance || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/90 shadow-xs">
              <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-600 text-sm font-medium">
                Chưa có dữ liệu Antibiogram riêng cho vị trí nhiễm trùng này. Vui lòng tham khảo báo cáo vi sinh chung của Bệnh viện Bệnh Nhiệt Đới năm 2024.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={onPrevStep}
          className="w-full sm:w-auto px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Giai đoạn 1 (Đánh giá &amp; Phân tầng)</span>
        </button>

        <button
          type="button"
          onClick={onNextStep}
          className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition-all flex items-center justify-center space-x-1.5 cursor-pointer min-h-[44px]"
        >
          <span>Tiếp tục: Giai đoạn 3 (Tái đánh giá 48-72h)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
