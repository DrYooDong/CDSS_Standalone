import React, { useState } from 'react';
import {
  InfectionSite,
  Population,
  RiskGroup,
  SepsisSource,
  SpecificPathogenRisk,
  EmpiricRegimen,
  AntibiogramDataset,
  GuidelineSource,
  AwareCategory
} from '../../selection/types';
import { 
  getEmpiricRegimens, 
  getAntibiogramForSite, 
  getWhoRegimens, 
  getGuidelineComparison 
} from '../../selection/engine';
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
  Globe,
  Scale,
  Stethoscope,
  HeartPulse,
  Layers,
  FileCheck,
  Star,
  RefreshCw,
  Building2
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
  // Master Guideline Source: 'bvbnd' (BV Bệnh Nhiệt Đới 2026) | 'who' (WHO AWaRe 2022) | 'compare' (So sánh song song)
  const [guidelineSource, setGuidelineSource] = useState<GuidelineSource>('bvbnd');

  // Sub-tabs for BVBND view
  const [bvbndTab, setBvbndTab] = useState<'regimens' | 'antibiogram'>('regimens');
  const [selectedFilterRisk, setSelectedFilterRisk] = useState<string>('all');
  const [copiedDrugId, setCopiedDrugId] = useState<string | null>(null);

  // Filters for WHO view
  const [whoFilterSetting, setWhoFilterSetting] = useState<'all' | 'primary_care' | 'hospital'>('all');
  const [whoFilterLine, setWhoFilterLine] = useState<'all' | 'first_choice' | 'second_choice'>('all');
  const [whoFilterAware, setWhoFilterAware] = useState<'all' | AwareCategory>('all');

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
    ? (population === 'adult' ? (bvbndTab === 'antibiogram' ? 8 : 9) : 4) 
    : site === 'sepsis' 
    ? (population === 'adult' ? (bvbndTab === 'antibiogram' ? 12 : 13) : (bvbndTab === 'antibiogram' ? 5 : 6)) 
    : site === 'skin_soft_tissue' 
    ? (population === 'adult' ? (bvbndTab === 'antibiogram' ? 9 : 10) : (bvbndTab === 'antibiogram' ? 6 : 7)) 
    : site === 'urinary' 
    ? (population === 'adult' ? (bvbndTab === 'antibiogram' ? 10 : 11) : (bvbndTab === 'antibiogram' ? 7 : 8)) 
    : (bvbndTab === 'antibiogram' ? 11 : 12);

  // 1. Lấy danh sách phác đồ khởi đầu theo chuẩn BVBND 2026
  const allBvbndRegimens: EmpiricRegimen[] = getEmpiricRegimens(
    site,
    population,
    riskGroup,
    sepsisSource,
    specificRisks
  );

  const bvbndRegimens = allBvbndRegimens.filter(r => {
    if (selectedFilterRisk === 'all') return true;
    if (selectedFilterRisk === 'base') return !r.specificRisk;
    return r.specificRisk === selectedFilterRisk;
  });

  // 2. Lấy danh sách phác đồ WHO AWaRe 2022
  const allWhoRegimensForSite = getWhoRegimens(site, population, { sepsisSource });
  const whoRegimens = getWhoRegimens(site, population, {
    sepsisSource,
    setting: whoFilterSetting,
    line: whoFilterLine,
    awareCategory: whoFilterAware
  });

  // 3. Lấy dữ liệu vi sinh tại chỗ BVBND
  const antibiogramData: AntibiogramDataset | undefined = getAntibiogramForSite(site, population);

  // 4. Lấy đối chiếu hướng dẫn BVBND vs WHO
  const comparisonData = getGuidelineComparison(site, population);

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
      {/* ============================================================== */}
      {/* 1. MASTER GUIDELINE SOURCE SELECTOR (BVBND vs WHO vs COMPARE) */}
      {/* ============================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-200">
                Giai Đoạn 2
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {population === 'adult' ? 'Người lớn' : 'Trẻ em'} • {siteLabels[site] || site}
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 w-full sm:w-auto mt-1 sm:mt-0">
                Lựa Chọn Phác Đồ Kháng Sinh Khởi Đầu
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Tích hợp đa nguồn: <strong>BV Bệnh Nhiệt Đới 2026</strong> (kháng sinh đồ tại chỗ) &amp; <strong>WHO AWaRe 2022</strong> (sách kháng sinh toàn cầu).
            </p>
          </div>

          {/* Guideline Source Segmented Control (Icon-First Streamlined) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 p-1 bg-slate-100 rounded-2xl border border-slate-200 gap-1">
            <button
              id="btn-source-bvbnd"
              type="button"
              onClick={() => setGuidelineSource('bvbnd')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                guidelineSource === 'bvbnd'
                  ? 'bg-white text-teal-900 shadow-xs border border-slate-200/80 font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Phác đồ & Kháng sinh đồ tại chỗ Bệnh Viện Bệnh Nhiệt Đới 2026"
            >
              <BookOpen className={`w-3.5 h-3.5 ${guidelineSource === 'bvbnd' ? 'text-teal-600' : 'text-slate-400'}`} />
              <span>BVBND ({allBvbndRegimens.length})</span>
            </button>

            <button
              id="btn-source-who"
              type="button"
              onClick={() => setGuidelineSource('who')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                guidelineSource === 'who'
                  ? 'bg-sky-600 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Sách Hướng dẫn Kháng sinh WHO AWaRe Book 2022"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>WHO AWaRe ({allWhoRegimensForSite.length})</span>
            </button>

            <button
              id="btn-source-compare"
              type="button"
              onClick={() => setGuidelineSource('compare')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                guidelineSource === 'compare'
                  ? 'bg-purple-600 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="So Sánh Đối Chiếu BVBND 2026 vs WHO AWaRe 2022"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Đối Chiếu</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* VIEW 1: BV BỆNH NHIỆT ĐỚI 2026 SUB-HEADER & TABS */}
        {/* ============================================================== */}
        {guidelineSource === 'bvbnd' && (
          <div className="mt-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-teal-600" />
                  <span>Hướng dẫn BVBND 2026 (Trang 4-13) • Antibiogram năm 2024</span>
                </span>
                {onOpenGuidelineAtlas && (
                  <button
                    id="btn-open-site-flowchart"
                    type="button"
                    onClick={() => onOpenGuidelineAtlas(getTargetImageId(bvbndTab))}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                    title="Xem ảnh lưu đồ phác đồ / vi sinh gốc từ Hướng dẫn Bệnh viện Bệnh Nhiệt Đới 2026"
                  >
                    <span>Lưu đồ gốc Tr.{currentPdfPage}</span>
                  </button>
                )}
              </div>

              {/* Sub-tabs: Regimens vs Antibiogram */}
              <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setBvbndTab('regimens')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                    bvbndTab === 'regimens'
                      ? 'bg-white text-teal-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ClipboardList className="w-3.5 h-3.5 text-teal-600" />
                  <span>Phác đồ BVBND ({allBvbndRegimens.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBvbndTab('antibiogram')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                    bvbndTab === 'antibiogram'
                      ? 'bg-white text-teal-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FlaskConical className="w-3.5 h-3.5 text-teal-600" />
                  <span>Vi sinh &amp; KSĐ Tại Chỗ</span>
                </button>
              </div>
            </div>

            {/* Phân tầng nguy cơ cảnh báo BVBND */}
            <div className={`p-3 rounded-xl border text-xs ${
              riskGroup === 'group_2'
                ? 'bg-amber-50/90 border-amber-200 text-amber-950'
                : 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
            }`}>
              <div className="flex items-start gap-2.5">
                <div className={`p-1 rounded-lg shrink-0 mt-0.5 ${
                  riskGroup === 'group_2' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {riskGroup === 'group_2' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                </div>
                <div>
                  <strong className="font-bold text-xs">
                    {riskGroup === 'group_2'
                      ? 'Bệnh nhân thuộc Nhóm 2 (Nguy cơ cao vi khuẩn đa kháng hoặc bệnh cảnh nặng):'
                      : 'Bệnh nhân thuộc Nhóm 1 (Ít nguy cơ vi khuẩn đa kháng):'}
                  </strong>
                  <p className="mt-0.5 leading-relaxed text-slate-700 text-[11px]">
                    {riskGroup === 'group_2'
                      ? 'Bắt buộc sử dụng kháng sinh phổ rộng theo lưu đồ BVBND (BL-BLI liều cao hoặc Carbapenem), phối hợp bao phủ MRSA nếu có chỉ định. Luôn lấy cấy máu và bệnh phẩm trước liều đầu tiên.'
                      : 'Ưu tiên kháng sinh phổ hẹp hoặc phổ trung bình phù hợp. Hạn chế lạm dụng nhóm Carbapenem, Colistin hay Vancomycin khi chưa có bằng chứng vi sinh.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Pathogen Filter if Group 2 */}
            {riskGroup === 'group_2' && bvbndTab === 'regimens' && (
              <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1 mr-1">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  Lọc nhanh:
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
                  Tất cả ({allBvbndRegimens.length})
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
                  Phác đồ nền
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
                  + MRSA
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
                  + ESBL
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
                  + Pseudo / Acineto
                </button>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: WHO AWARE 2022 SUB-HEADER & FILTERS */}
        {/* ============================================================== */}
        {guidelineSource === 'who' && (
          <div className="mt-4 space-y-4">
            {/* WHO AWaRe Global Target Banner */}
            <div className="bg-gradient-to-r from-sky-50 via-teal-50 to-slate-50 border border-sky-200 rounded-2xl p-3.5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-extrabold text-sky-950">
                        The WHO AWaRe Antibiotic Book (2022)
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-300">
                        ISBN 978-92-4-006238-2
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      Phân tầng kháng sinh thành 3 nhóm: <strong>Access (Tiếp cận)</strong>, <strong>Watch (Giám sát)</strong>, và <strong>Reserve (Dự trữ)</strong>. Mục tiêu toàn cầu của WHO: <strong>≥ 60%</strong> tổng lượng kháng sinh sử dụng phải thuộc nhóm Tiếp Cận.
                    </p>
                  </div>
                </div>

                {/* 3 AWaRe Badges */}
                <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Access (≥60%)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span>Watch</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    <span>Reserve</span>
                  </span>
                </div>
              </div>
            </div>

            {/* WHO Multi-Filter Bar (Icon-First Streamlined Chips) */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
              {/* Filter: Line */}
              <div className="flex items-center gap-1">
                <span className="font-bold text-slate-500 text-[11px]">Bậc:</span>
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setWhoFilterLine('all')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      whoFilterLine === 'all' ? 'bg-white text-sky-800 shadow-2xs' : 'text-slate-600'
                    }`}
                    title="Tất cả các bậc lựa chọn"
                  >
                    <Layers className="w-3 h-3" />
                    <span>Tất cả</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWhoFilterLine('first_choice')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      whoFilterLine === 'first_choice' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600'
                    }`}
                    title="Lựa chọn đầu tay theo WHO (First Choice)"
                  >
                    <Star className="w-3 h-3" />
                    <span>Đầu tay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWhoFilterLine('second_choice')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      whoFilterLine === 'second_choice' ? 'bg-amber-600 text-white shadow-2xs' : 'text-slate-600'
                    }`}
                    title="Lựa chọn thứ hai / thay thế (Second Choice)"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Lựa chọn 2</span>
                  </button>
                </div>
              </div>

              {/* Filter: Setting */}
              <div className="flex items-center gap-1">
                <span className="font-bold text-slate-500 text-[11px]">Tuyến:</span>
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setWhoFilterSetting('all')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      whoFilterSetting === 'all' ? 'bg-white text-sky-800 shadow-2xs' : 'text-slate-600'
                    }`}
                    title="Tất cả các tuyến điều trị"
                  >
                    <Layers className="w-3 h-3" />
                    <span>Tất cả</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWhoFilterSetting('hospital')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      whoFilterSetting === 'hospital' ? 'bg-sky-600 text-white shadow-2xs' : 'text-slate-600'
                    }`}
                    title="Tuyến Bệnh viện / Điều trị nội trú"
                  >
                    <Building2 className="w-3 h-3" />
                    <span>Bệnh viện</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWhoFilterSetting('primary_care')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      whoFilterSetting === 'primary_care' ? 'bg-teal-600 text-white shadow-2xs' : 'text-slate-600'
                    }`}
                    title="Chăm sóc ban đầu / Ngoại trú"
                  >
                    <Stethoscope className="w-3 h-3" />
                    <span>Ngoại trú</span>
                  </button>
                </div>
              </div>

              {/* Filter: AWaRe Group */}
              <div className="flex items-center gap-1">
                <span className="font-bold text-slate-500 text-[11px]">AWaRe:</span>
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setWhoFilterAware('all')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      whoFilterAware === 'all' ? 'bg-white text-sky-800 shadow-2xs' : 'text-slate-600'
                    }`}
                    title="Tất cả các nhóm AWaRe"
                  >
                    <Layers className="w-3 h-3" />
                    <span>Tất cả</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWhoFilterAware('Access')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      whoFilterAware === 'Access' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-emerald-800 hover:bg-emerald-50'
                    }`}
                    title="Nhóm ACCESS: Ưu tiên tiếp cận, mục tiêu quốc gia ≥60%"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Access</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWhoFilterAware('Watch')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      whoFilterAware === 'Watch' ? 'bg-amber-600 text-white shadow-2xs' : 'text-amber-800 hover:bg-amber-50'
                    }`}
                    title="Nhóm WATCH: Cần giám sát, nguy cơ kháng chéo"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>Watch</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWhoFilterAware('Reserve')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      whoFilterAware === 'Reserve' ? 'bg-rose-600 text-white shadow-2xs' : 'text-rose-800 hover:bg-rose-50'
                    }`}
                    title="Nhóm RESERVE: Dự trữ bước cuối cho VK đa kháng"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                    <span>Reserve</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 2. MAIN CONTENT AREA BASED ON GUIDELINE SOURCE */}
      {/* ============================================================== */}

      {/* -------------------------------------------------------------- */}
      {/* A. BVBND 2026 REGIMENS VIEW */}
      {/* -------------------------------------------------------------- */}
      {guidelineSource === 'bvbnd' && bvbndTab === 'regimens' && (
        <div className="space-y-4">
          {bvbndRegimens.length === 0 ? (
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
                Hiển thị tất cả phác đồ BVBND cho vị trí này ({allBvbndRegimens.length})
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {bvbndRegimens.map((regimen) => (
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

                  {/* Danh sách thuốc BVBND */}
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

                            {/* HIỂN THỊ KẾT QUẢ TÍNH LIỀU CÁ THỂ HÓA (DOSING RESULT) */}
                            {isCalculatedActive && dosingResult && (
                              <div className="mt-3 p-3 rounded-xl bg-white border border-teal-300 shadow-2xs space-y-2.5">
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

                                {dosingResult.loadingDoseTextVi && (
                                  <div className="text-xs bg-amber-50/80 p-2 rounded-lg border border-amber-200/70 text-amber-950">
                                    <span className="font-extrabold text-amber-900">Liều nạp:</span>{' '}
                                    <span className="font-medium">{dosingResult.loadingDoseTextVi}</span>
                                  </div>
                                )}

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

                                {dosingResult.orderTextVi && (
                                  <div className="pt-1 flex items-center justify-between gap-2 flex-wrap">
                                    <button
                                      type="button"
                                      onClick={() => handleCopyOrder(dosingResult.orderTextVi, drug.drugId!)}
                                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
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
                                    >
                                      <Zap className="w-3 h-3 text-amber-500" />
                                      <span>{isCalculatedActive ? 'Đang hiển thị' : 'Tính CrCl'}</span>
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => onSelectDrugForDosing(drug.drugId!)}
                                    className="px-2.5 py-1 text-xs font-bold rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                                    title="Chuyển sang Bảng tính liều chi tiết & kiểm tra tương tác thuốc DDI"
                                  >
                                    <Calculator className="w-3 h-3" />
                                    <span>Liều &amp; DDI</span>
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
                        <span>Quy tắc phối hợp lâm sàng (BVBND 2026):</span>
                      </h4>
                      <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                        {regimen.combinationRulesVi.map((rule, rIdx) => (
                          <li key={rIdx}>{rule}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Cảnh báo an toàn */}
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

      {/* -------------------------------------------------------------- */}
      {/* B. BVBND ANTIBIOGRAM TAB */}
      {/* -------------------------------------------------------------- */}
      {guidelineSource === 'bvbnd' && bvbndTab === 'antibiogram' && (
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

      {/* -------------------------------------------------------------- */}
      {/* C. WHO AWARE 2022 REGIMENS VIEW */}
      {/* -------------------------------------------------------------- */}
      {guidelineSource === 'who' && (
        <div className="space-y-4">
          {whoRegimens.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/90 shadow-xs">
              <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-700 text-sm font-semibold">
                Không tìm thấy phác đồ WHO khớp với bộ lọc đã chọn.
              </p>
              <button
                type="button"
                onClick={() => {
                  setWhoFilterLine('all');
                  setWhoFilterSetting('all');
                  setWhoFilterAware('all');
                }}
                className="mt-3 px-4 py-2 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-xl transition-all cursor-pointer"
              >
                Đặt lại tất cả bộ lọc WHO ({allWhoRegimensForSite.length} phác đồ)
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {whoRegimens.map((regimen) => (
                <div
                  key={regimen.id}
                  className="p-5 rounded-2xl border border-slate-200/90 bg-white shadow-xs hover:border-sky-300 transition-all space-y-4"
                >
                  {/* Regimen Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        {regimen.chapterNumber && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-sky-100 text-sky-900 border border-sky-300">
                            Ch.{regimen.chapterNumber}
                          </span>
                        )}
                        <span 
                          title={regimen.line === 'first_choice' ? 'Lựa chọn đầu tay (First Choice)' : 'Lựa chọn thay thế (Second Choice)'}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                            regimen.line === 'first_choice' 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {regimen.line === 'first_choice' ? <Star className="w-3 h-3 text-emerald-600" /> : <RefreshCw className="w-3 h-3 text-amber-600" />}
                          <span>{regimen.line === 'first_choice' ? 'Đầu tay' : 'Lựa chọn 2'}</span>
                        </span>
                        <span 
                          title={regimen.clinicalSetting === 'primary_care' ? 'Chăm sóc ban đầu / Ngoại trú' : 'Tuyến bệnh viện / Nội trú'}
                          className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1"
                        >
                          {regimen.clinicalSetting === 'primary_care' ? <Stethoscope className="w-3 h-3 text-teal-600" /> : <Building2 className="w-3 h-3 text-sky-600" />}
                          <span>{regimen.clinicalSetting === 'primary_care' ? 'Ngoại trú' : 'Bệnh viện'}</span>
                        </span>
                        {regimen.durationVi && (
                          <span 
                            title={`Thời gian điều trị khuyến cáo: ${regimen.durationVi}`}
                            className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1"
                          >
                            <Clock className="w-3 h-3 text-teal-600" />
                            <span>{regimen.durationVi}</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-extrabold text-slate-900">
                        {regimen.titleVi}
                      </h3>
                      <p className="text-xs text-slate-500 italic mt-0.5">
                        {regimen.diseaseNameEn} • {regimen.titleEn}
                      </p>
                    </div>

                    <SourceBadge source={regimen.source} />
                  </div>

                  {/* Non-antibiotic supportive care note if present */}
                  {regimen.nonAntibioticCareVi && (
                    <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 flex items-start gap-2">
                      <HeartPulse className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold">Chăm sóc không dùng kháng sinh (Non-antibiotic care):</strong>
                        <p className="mt-0.5 text-blue-900 leading-relaxed">{regimen.nonAntibioticCareVi}</p>
                      </div>
                    </div>
                  )}

                  {/* Drug choices grid */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Thuốc chỉ định theo WHO AWaRe:
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
                                ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-50/30 shadow-xs'
                                : 'border-slate-200/80 bg-slate-50/70 hover:bg-white hover:border-sky-200 hover:shadow-xs'
                            }`}
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5 flex-wrap">
                                  <span>{drugDisplayName}</span>
                                  {drug.awareCategory && (
                                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-black uppercase tracking-wider ${
                                      drug.awareCategory === 'Access'
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                        : drug.awareCategory === 'Watch'
                                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                                    }`}>
                                      {drug.awareCategory}
                                    </span>
                                  )}
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
                                  Liều chuẩn WHO:
                                </span>{' '}
                                <span className="text-slate-800 font-medium">{doseText}</span>
                              </div>

                              {drug.infusionNoteVi && (
                                <div className="mt-1.5 text-[11px] text-sky-900 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200/70 flex items-center gap-1.5 font-medium">
                                  <Info className="w-3 h-3 text-sky-600 shrink-0" />
                                  <span>{drug.infusionNoteVi}</span>
                                </div>
                              )}
                            </div>

                            {/* Live CrCl Calculated Dosing Result if Active */}
                            {isCalculatedActive && dosingResult && (
                              <div className="mt-3 p-3 rounded-xl bg-white border border-teal-300 shadow-2xs space-y-2">
                                <div className="flex items-center justify-between gap-1 flex-wrap pb-1 border-b border-slate-100">
                                  <span className="text-[11px] font-extrabold uppercase text-teal-900">
                                    Liều Cá Thể Hóa (CrCl {renal?.crcl} mL/p)
                                  </span>
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                    {dosingResult.reductionPercentage ? `Giảm ${dosingResult.reductionPercentage}% liều` : '100% liều chuẩn'}
                                  </span>
                                </div>
                                <div className="text-xs bg-teal-50/90 p-2 rounded-lg border border-teal-200 text-teal-950">
                                  <div className="text-sm font-black">{dosingResult.maintenanceDoseTextVi}</div>
                                  {dosingResult.infusionInstructionsVi && (
                                    <div className="text-[11px] text-teal-800 mt-0.5">{dosingResult.infusionInstructionsVi}</div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* 1-Click Calculator Actions */}
                            {hasDosingTool && drug.drugId && (
                              <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between gap-2 flex-wrap">
                                <span className="text-[11px] text-sky-800 font-medium flex items-center gap-1">
                                  <Calculator className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                                  <span>Có máy tính liều</span>
                                </span>
                                <div className="flex items-center gap-1.5">
                                  {onCalculateDoseForDrug && (
                                    <button
                                      type="button"
                                      onClick={() => onCalculateDoseForDrug(drug.drugId!)}
                                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-2xs ${
                                        isCalculatedActive
                                          ? 'bg-sky-700 text-white'
                                          : 'bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200'
                                      }`}
                                    >
                                      <Zap className="w-3 h-3 text-amber-500" />
                                      <span>{isCalculatedActive ? 'Đang tính' : 'Tính CrCl'}</span>
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => onSelectDrugForDosing(drug.drugId!)}
                                    className="px-2.5 py-1 text-xs font-bold rounded-lg bg-sky-600 hover:bg-sky-700 text-white shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                                    title="Chuyển sang Bảng tính liều chi tiết & kiểm tra tương tác thuốc DDI"
                                  >
                                    <Calculator className="w-3 h-3" />
                                    <span>Liều &amp; DDI</span>
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

                  {/* Combination rules */}
                  {regimen.combinationRulesVi && regimen.combinationRulesVi.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-100">
                      <h4 className="text-xs font-bold text-sky-950 mb-1 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-sky-600" />
                        <span>Thông điệp lâm sàng cốt lõi của WHO:</span>
                      </h4>
                      <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                        {regimen.combinationRulesVi.map((rule, rIdx) => (
                          <li key={rIdx}>{rule}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Caution */}
                  {regimen.cautionVi && regimen.cautionVi.length > 0 && (
                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950">
                      <h4 className="font-bold flex items-center gap-1.5 mb-1 text-amber-900">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                        <span>Lưu ý an toàn &amp; Chuyển đổi đường dùng (IV-to-PO):</span>
                      </h4>
                      <ul className="list-disc list-inside text-xs text-amber-900 space-y-0.5">
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

      {/* -------------------------------------------------------------- */}
      {/* D. GUIDELINE COMPARISON VIEW (BVBND 2026 vs WHO AWaRe 2022) */}
      {/* -------------------------------------------------------------- */}
      {guidelineSource === 'compare' && (
        <div className="space-y-5">
          {/* Top comparison introduction */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-teal-50 to-sky-50 border border-purple-200 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-purple-600 text-white shrink-0 shadow-xs">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-purple-950">
                  Đối Chiếu Chiến Lược: BV Bệnh Nhiệt Đới 2026 vs WHO AWaRe 2022
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Bảng so sánh đa chiều giúp Bác sĩ và Dược sĩ lâm sàng thấu hiểu lý do khác biệt giữa <strong>Hướng dẫn địa phương BVBND</strong> (đáp ứng áp lực đề kháng cao tại TP.HCM) và <strong>Khuyến cáo toàn cầu WHO</strong> (ưu tiên bảo tồn nhóm Tiếp cận và rút ngắn thời gian điều trị).
                </p>
              </div>
            </div>
          </div>

          {/* 2-Column Side-by-Side Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Column 1: BVBND 2026 */}
            <div className="p-5 rounded-2xl bg-white border border-teal-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-teal-100">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-teal-500"></span>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Bệnh Viện Bệnh Nhiệt Đới (2026)
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                  Tuyến cuối Truyền Nhiễm TP.HCM
                </span>
              </div>

              <div className="text-xs text-slate-700 space-y-2">
                <div className="font-bold text-slate-900">Đặc điểm chính cho {comparisonData.siteLabelVi}:</div>
                <ul className="list-disc list-inside space-y-1.5 text-slate-600">
                  {comparisonData.bvbndKeyPointsVi.map((pt, idx) => (
                    <li key={idx} className="leading-relaxed">{pt}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Column 2: WHO AWaRe 2022 */}
            <div className="p-5 rounded-2xl bg-white border border-sky-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-sky-100">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-sky-500"></span>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    WHO AWaRe Antibiotic Book (2022)
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                  Chuẩn Toàn Cầu WHO
                </span>
              </div>

              <div className="text-xs text-slate-700 space-y-2">
                <div className="font-bold text-slate-900">Đặc điểm chính cho {comparisonData.siteLabelVi}:</div>
                <ul className="list-disc list-inside space-y-1.5 text-slate-600">
                  {comparisonData.whoKeyPointsVi.map((pt, idx) => (
                    <li key={idx} className="leading-relaxed">{pt}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Key Differences Table */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-purple-600" />
              <span>Điểm Khác Biệt Mấu Chốt &amp; Nhận Định Lâm Sàng:</span>
            </h4>
            <div className="space-y-2">
              {comparisonData.keyDifferencesVi.map((diff, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed">{diff}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Pharmacist Recommendation */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 text-xs text-amber-950 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-900 font-extrabold">
              <Stethoscope className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Tư Vấn Dược Lâm Sàng (Clinical Pharmacist Stewardship Advice):</span>
            </div>
            <p className="leading-relaxed pl-6 text-amber-900 font-medium">
              {comparisonData.stewardshipAdviceVi}
            </p>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. NAVIGATION CONTROLS */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={onPrevStep}
          className="w-full sm:w-auto px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Bước 1 (Đánh giá &amp; Phân tầng)</span>
        </button>

        <button
          type="button"
          onClick={onNextStep}
          className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition-all flex items-center justify-center space-x-1.5 cursor-pointer min-h-[44px]"
        >
          <span>Tiếp tục: Bước 3 (Cá thể hóa tính liều)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
