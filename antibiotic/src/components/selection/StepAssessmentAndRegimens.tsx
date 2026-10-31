import React, { useState } from 'react';
import {
  Population,
  InfectionSite,
  SepsisSource,
  RiskClassificationResult,
  SpecificPathogenRisk,
  EmpiricRegimen,
  AntibiogramDataset
} from '../../selection/types';
import {
  getEmpiricRegimens,
  getAntibiogramForSite,
  getWhoRegimens,
  getGuidelineComparison
} from '../../selection/engine';
import { DRUG_MAP } from '../../selection/data/drugMap';
import { ANTIBIOTICS } from '../../data/antibiotics';
import { extractDrugData, calculateDose, DoseResult, ExtractedDrugData } from '../../utils/drugDataExtractor';
import { calculateRenalMetrics } from '../../utils/clinicalFormulas';
import { PatientState, CalculatedRenalMetrics } from '../../types';
import { SourceBadge } from './SourceBadge';
import {
  Stethoscope,
  Droplet,
  Flame,
  HeartHandshake,
  Brain,
  Layers,
  User,
  Baby,
  ShieldAlert,
  ShieldCheck,
  AlertCircle,
  Zap,
  Info,
  BookOpen,
  Globe,
  FlaskConical,
  Scale,
  Clock,
  ArrowRight,
  Calculator,
  Filter,
  Check,
  Star,
  RefreshCw,
  Copy,
  FileText,
  ChevronDown,
  ArrowDown
} from 'lucide-react';

interface StepAssessmentAndRegimensProps {
  site: InfectionSite;
  onSelectSite: (site: InfectionSite) => void;
  population: Population;
  onSelectPopulation: (pop: Population) => void;
  isChronicLiverDisease: boolean;
  onToggleChronicLiver: (val: boolean) => void;
  sepsisSource?: SepsisSource;
  onSelectSepsisSource: (src: SepsisSource) => void;
  riskResult: RiskClassificationResult;
  onQuickGroupSelect: (targetGroup: 'group_1' | 'group_2') => void;
  sofaScore: number;
  onSofaChange: (val: number) => void;
  psofaScore: number;
  onPsofaChange: (val: number) => void;
  clifSofaScore: number;
  onClifSofaChange: (val: number) => void;
  checkedSpecificRisks: SpecificPathogenRisk[];
  onToggleSpecificRisk: (risk: SpecificPathogenRisk) => void;
  patient: PatientState;
  renal: CalculatedRenalMetrics;
  selectedDrugId: string;
  onSelectDrug: (drugId: string) => void;
  detailedDrugId: string | null;
  onToggleDetailedDrug: (drugId: string | null) => void;
  onNextStep: () => void;
  onOpenGuidelineAtlas?: (imageId?: string) => void;
  children?: React.ReactNode; // Bảng hiển thị cụ thể kháng sinh (Dosing Workspace)
}

export const StepAssessmentAndRegimens: React.FC<StepAssessmentAndRegimensProps> = ({
  site,
  onSelectSite,
  population,
  onSelectPopulation,
  isChronicLiverDisease,
  onToggleChronicLiver,
  sepsisSource,
  onSelectSepsisSource,
  riskResult,
  onQuickGroupSelect,
  sofaScore,
  onSofaChange,
  psofaScore,
  onPsofaChange,
  clifSofaScore,
  onClifSofaChange,
  checkedSpecificRisks,
  onToggleSpecificRisk,
  patient,
  renal,
  selectedDrugId,
  onSelectDrug,
  detailedDrugId,
  onToggleDetailedDrug,
  onNextStep,
  onOpenGuidelineAtlas,
  children
}) => {
  // Guideline source mode: 'bvbnd' (BV Bệnh Nhiệt Đới 2026) | 'who' (WHO AWaRe 2022) | 'antibiogram' | 'compare'
  const [activeGuidelineSource, setActiveGuidelineSource] = useState<'bvbnd' | 'who' | 'antibiogram' | 'compare'>('bvbnd');
  const [selectedFilterRisk, setSelectedFilterRisk] = useState<string>('all');
  const [copiedDrugId, setCopiedDrugId] = useState<string | null>(null);

  const isGroup2 = riskResult.group === 'group_2';

  const sitesList: Array<{
    id: InfectionSite;
    titleVi: string;
    subVi: string;
    icon: React.ReactNode;
    color: string;
    borderActive: string;
  }> = [
    {
      id: 'respiratory',
      titleVi: 'Hô Hấp (Viêm Phổi)',
      subVi: 'CAP, HAP, VAP thở máy',
      icon: <Stethoscope className="w-4 h-4 text-sky-600" />,
      color: 'bg-sky-50 text-sky-700',
      borderActive: 'border-sky-500 bg-sky-50/70 ring-2 ring-sky-500/20'
    },
    {
      id: 'sepsis',
      titleVi: 'Nhiễm Khuẩn Huyết',
      subVi: 'Sepsis, Sốc NK',
      icon: <Droplet className="w-4 h-4 text-rose-600" />,
      color: 'bg-rose-50 text-rose-700',
      borderActive: 'border-rose-500 bg-rose-50/70 ring-2 ring-rose-500/20'
    },
    {
      id: 'urinary',
      titleVi: 'Đường Tiết Niệu',
      subVi: 'UTI, Đài bể thận, CAUTI',
      icon: <HeartHandshake className="w-4 h-4 text-indigo-600" />,
      color: 'bg-indigo-50 text-indigo-700',
      borderActive: 'border-indigo-500 bg-indigo-50/70 ring-2 ring-indigo-500/20'
    },
    {
      id: 'skin_soft_tissue',
      titleVi: 'Da & Mô Mềm (SSTI)',
      subVi: 'Viêm mô TB, loét tì đè, áp xe',
      icon: <Flame className="w-4 h-4 text-amber-600" />,
      color: 'bg-amber-50 text-amber-700',
      borderActive: 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20'
    },
    {
      id: 'peritoneal',
      titleVi: 'Dịch Báng / Bụng (SBP)',
      subVi: 'Viêm phúc mạc xơ gan',
      icon: <Layers className="w-4 h-4 text-emerald-600" />,
      color: 'bg-emerald-50 text-emerald-700',
      borderActive: 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20'
    },
    {
      id: 'cns',
      titleVi: 'Thần Kinh TW (CNS)',
      subVi: 'Viêm màng não mủ, áp xe',
      icon: <Brain className="w-4 h-4 text-purple-600" />,
      color: 'bg-purple-50 text-purple-700',
      borderActive: 'border-purple-500 bg-purple-50/70 ring-2 ring-purple-500/20'
    }
  ];

  // Atlas flowchart mapping
  const getTargetImageId = () => {
    const isAdult = population === 'adult';
    if (activeGuidelineSource === 'antibiogram') {
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
    ? (population === 'adult' ? (activeGuidelineSource === 'antibiogram' ? 8 : 9) : 4) 
    : site === 'sepsis' 
    ? (population === 'adult' ? (activeGuidelineSource === 'antibiogram' ? 12 : 13) : (activeGuidelineSource === 'antibiogram' ? 5 : 6)) 
    : site === 'skin_soft_tissue' 
    ? (population === 'adult' ? (activeGuidelineSource === 'antibiogram' ? 9 : 10) : (activeGuidelineSource === 'antibiogram' ? 6 : 7)) 
    : site === 'urinary' 
    ? (population === 'adult' ? (activeGuidelineSource === 'antibiogram' ? 10 : 11) : (activeGuidelineSource === 'antibiogram' ? 7 : 8)) 
    : (activeGuidelineSource === 'antibiogram' ? 11 : 12);

  // 1. Phác đồ khởi đầu BVBND 2026
  const allBvbndRegimens: EmpiricRegimen[] = getEmpiricRegimens(
    site,
    population,
    riskResult.group,
    sepsisSource,
    checkedSpecificRisks
  );

  const bvbndRegimens = allBvbndRegimens.filter(r => {
    if (selectedFilterRisk === 'all') return true;
    if (selectedFilterRisk === 'base') return !r.specificRisk;
    return r.specificRisk === selectedFilterRisk;
  });

  // 2. Phác đồ WHO AWaRe 2022
  const whoRegimens = getWhoRegimens(site, population, { sepsisSource });

  // 3. Antibiogram vi sinh BVBND
  const antibiogramData: AntibiogramDataset | undefined = getAntibiogramForSite(site, population);

  // 4. Đối chiếu hướng dẫn
  const comparisonData = getGuidelineComparison(site, population);

  // Active severity score
  const currentSeverityScore = population === 'pediatric' ? psofaScore : isChronicLiverDisease ? clifSofaScore : sofaScore;

  // Cache/calculate personalized live dose for any drug in regimen
  const getLiveDose = (rawDrugId?: string): { details: ExtractedDrugData; dose: DoseResult } | null => {
    if (!rawDrugId) return null;
    const resolvedId = DRUG_MAP[rawDrugId]?.drugId || rawDrugId;
    const isAvailable = ANTIBIOTICS.some(a => a.id === resolvedId);
    if (!isAvailable) return null;

    try {
      const details = extractDrugData(resolvedId);
      const defScn = details.scenarios.find(s => s.def) || details.scenarios[0];
      const scnKey = defScn ? defScn.key : 'standard';
      const r = calculateRenalMetrics(patient, details.weightRule);
      const dose = calculateDose(details, r, scnKey, patient);
      return { details, dose };
    } catch (e) {
      return null;
    }
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

  const handleToggleDetailedView = (rawDrugId: string) => {
    const resolvedId = DRUG_MAP[rawDrugId]?.drugId || rawDrugId;
    onSelectDrug(resolvedId);
    onToggleDetailedDrug(resolvedId);
  };

  const detailedDrugObj = ANTIBIOTICS.find(a => a.id === (detailedDrugId || selectedDrugId)) || ANTIBIOTICS[0];

  return (
    <div className="space-y-5">

      {/* ============================================================== */}
      {/* 1. KHUNG ĐÁNH GIÁ Ổ NHIỄM & PHÂN TẦNG NGUY CƠ TINH GỌN */}
      {/* ============================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-xl bg-teal-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
              1
            </span>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Đánh Giá Lâm Sàng &amp; Phân Tầng Nguy Cơ VKĐK
              </h2>
              <p className="text-[11px] text-slate-500">
                Chuẩn Hướng Dẫn Điều Trị Kháng Sinh BV Bệnh Nhiệt Đới (BVBND 2026)
              </p>
            </div>
          </div>
          <SourceBadge source={{ doc: 'BVBND_PhanNhom', page: 2 }} />
        </div>

        {/* 1.1 Vị trí ổ nhiễm trùng (6 lựa chọn rõ ràng) */}
        <div>
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span>Vị trí ổ nhiễm trùng:</span>
            <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              {sitesList.find(s => s.id === site)?.titleVi}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {sitesList.map(s => {
              const isSelected = site === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSelectSite(s.id)}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[76px] ${
                    isSelected
                      ? s.borderActive
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className={`p-1.5 rounded-xl ${s.color}`}>
                      {s.icon}
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 leading-snug">
                      {s.titleVi}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                      {s.subVi}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 1.2 Đối tượng & Đặc điểm bệnh kèm theo */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Đối tượng:</span>
            <div className="inline-flex rounded-xl border border-slate-200 p-0.5 bg-slate-100">
              <button
                type="button"
                onClick={() => onSelectPopulation('adult')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  population === 'adult'
                    ? 'bg-white text-teal-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Người lớn (≥ 16T)</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectPopulation('pediatric')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  population === 'pediatric'
                    ? 'bg-white text-teal-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Baby className="w-3.5 h-3.5" />
                <span>Trẻ em (&lt; 16T)</span>
              </button>
            </div>
          </div>

          <label className="flex items-center space-x-2 cursor-pointer bg-slate-50 px-3 py-1 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={isChronicLiverDisease}
              onChange={e => onToggleChronicLiver(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
            />
            <span className="text-xs font-semibold text-slate-700">
              Bệnh gan mạn / Xơ gan (Thang CLIF-SOFA)
            </span>
          </label>

          {site === 'sepsis' && (
            <div className="flex items-center space-x-2 w-full sm:w-auto sm:ml-auto">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider shrink-0">Ngõ vào:</span>
              <select
                value={sepsisSource || 'respiratory'}
                onChange={e => onSelectSepsisSource(e.target.value as SepsisSource)}
                className="text-xs border border-slate-300 rounded-xl px-2.5 py-1 bg-white font-medium focus:ring-1 focus:ring-teal-500 cursor-pointer flex-1 sm:flex-none"
              >
                <option value="respiratory">Từ ổ Hô hấp (Phổi)</option>
                <option value="urinary">Từ ổ Tiết niệu</option>
                <option value="gastrointestinal">Từ ổ Tiêu hóa</option>
                <option value="peritoneal">Từ ổ Dịch báng (SBP)</option>
                <option value="skin_soft_tissue">Từ ổ Da mô mềm</option>
              </select>
            </div>
          )}
        </div>

        {/* 1.3 Phân Tầng Nguy Cơ VKĐK (Nhóm 1 vs Nhóm 2) & Điểm SOFA */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Nhóm 1 */}
            <button
              type="button"
              onClick={() => onQuickGroupSelect('group_1')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                !isGroup2
                  ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className={`w-5 h-5 ${!isGroup2 ? 'text-emerald-700' : 'text-slate-400'}`} />
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-950">
                    Nhóm 1: Ít Nguy Cơ VKĐK
                  </span>
                </div>
                {!isGroup2 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white">
                    Đang chọn
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                Nhiễm khuẩn <strong>Cộng đồng</strong>, không tiền sử dùng KS / nằm viện 90 ngày qua, không dụng cụ xâm lấn, SOFA &lt; 2.
              </p>
              <div className="text-[11px] font-semibold text-emerald-700 mt-2">
                → Khuyến cáo: Kháng sinh phổ hẹp hoặc tiêu chuẩn BVBND 2026.
              </div>
            </button>

            {/* Nhóm 2 */}
            <button
              type="button"
              onClick={() => onQuickGroupSelect('group_2')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                isGroup2
                  ? 'border-rose-500 bg-rose-50/70 ring-2 ring-rose-500/20 shadow-xs'
                  : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className={`w-5 h-5 ${isGroup2 ? 'text-rose-700' : 'text-slate-400'}`} />
                  <span className="text-xs font-black uppercase tracking-wider text-rose-950">
                    Nhóm 2: Nguy Cơ Cao VKĐK
                  </span>
                </div>
                {isGroup2 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-600 text-white">
                    Đang chọn
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                Nhiễm khuẩn <strong>Bệnh viện / ICU</strong>, thở máy, lọc máu, dùng KS 30-90 ngày qua, hoặc nhiễm khuẩn nặng (SOFA ≥ 2).
              </p>
              <div className="text-[11px] font-semibold text-rose-700 mt-2">
                → Khuyến cáo: Phổ rộng diệt Pseudomonas / Acineto, phối hợp MRSA/ESBL nếu có chỉ định.
              </div>
            </button>
          </div>

          {/* Stepper điểm SOFA & mức độ nặng */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  {population === 'pediatric' ? 'Thang điểm pSOFA (Trẻ em):' : isChronicLiverDisease ? 'Thang điểm CLIF-SOFA (Xơ gan):' : 'Mức độ nặng (Thang điểm SOFA):'}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  riskResult.isHighSeverity ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}>
                  {riskResult.isHighSeverity ? 'Bệnh cảnh Nặng / Sốc NK' : 'Mức độ Tiêu Chuẩn'}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Điểm hiện tại: <strong className="text-slate-800">{currentSeverityScore} điểm</strong> (SOFA ≥ 2 phản ánh suy tạng nặng liên quan nhiễm khuẩn)
              </div>
            </div>

            <div className="flex items-center gap-1">
              {[0, 1, 2, 4, 6, 8, 12].map(scoreVal => {
                const isCurrent = currentSeverityScore === scoreVal;
                return (
                  <button
                    key={scoreVal}
                    type="button"
                    onClick={() => {
                      if (population === 'pediatric') onPsofaChange(scoreVal);
                      else if (isChronicLiverDisease) onClifSofaChange(scoreVal);
                      else onSofaChange(scoreVal);
                    }}
                    className={`w-7 h-7 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-teal-600 text-white shadow-xs font-extrabold'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {scoreVal}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 1.4 Tác Nhân Vi Khuẩn Đa Kháng Cụ Thể Cần Bao Phủ */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-800">
                Tác Nhân Đa Kháng Cần Bao Phủ Cụ Thể (BVBND 2026):
              </span>
              <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                Đã chọn: {checkedSpecificRisks.length} tác nhân
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {[
                {
                  id: 'mrsa' as SpecificPathogenRisk,
                  title: 'MRSA',
                  name: 'Tụ cầu vàng kháng Methicillin',
                  sub: 'Vancomycin / Linezolid',
                  isTarget: site === 'skin_soft_tissue'
                },
                {
                  id: 'pseudo_acineto' as SpecificPathogenRisk,
                  title: 'Pseudomonas / Acineto',
                  name: 'Trực khuẩn mủ xanh & Acineto đa kháng',
                  sub: 'Carbapenem / Colistin / Piptaz',
                  isTarget: site === 'respiratory' || site === 'sepsis'
                },
                {
                  id: 'esbl' as SpecificPathogenRisk,
                  title: 'Enterobacterales ESBL',
                  name: 'E. coli, Klebsiella sinh ESBL',
                  sub: 'Carbapenem / Aminoglycoside',
                  isTarget: site === 'urinary' || site === 'peritoneal'
                },
                {
                  id: 'enterococcus' as SpecificPathogenRisk,
                  title: 'Enterococcus (VRE)',
                  name: 'Cầu khuẩn ruột kháng Ampicillin / VRE',
                  sub: 'Ampicillin / Linezolid / Daptomycin',
                  isTarget: site === 'urinary'
                }
              ].map(spec => {
                const isChecked = checkedSpecificRisks.includes(spec.id);
                return (
                  <label
                    key={spec.id}
                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-2 ${
                      isChecked
                        ? 'border-rose-500 bg-rose-50/70 text-slate-900 shadow-2xs font-semibold'
                        : spec.isTarget
                        ? 'border-sky-300 bg-sky-50/30 text-slate-700'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleSpecificRisk(spec.id)}
                      className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4 mt-0.5 cursor-pointer shrink-0"
                    />
                    <div className="min-w-0 flex-1 leading-snug">
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="text-xs font-black text-slate-900">{spec.title}</span>
                        {spec.isTarget && (
                          <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-sky-100 text-sky-800">
                            Gợi ý
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">{spec.name}</div>
                      <div className="text-[10px] text-teal-700 font-semibold mt-1">
                        {spec.sub}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 1.5 Cảnh Báo Quy Tắc Lâm Sàng Quan Trọng BVBND (Ghi Chú b) */}
          {(riskResult.isGramPosGramNegCoRisk || riskResult.isDualGramNegRisk) && (
            <div className="space-y-2 pt-1">
              {/* Note b: Co-risk Gram(+) & Gram(-) */}
              {riskResult.isGramPosGramNegCoRisk && (
                <div className="p-3 rounded-2xl bg-gradient-to-r from-rose-600 to-red-700 text-white shadow-xs flex items-start space-x-2.5">
                  <AlertCircle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed">
                    <div className="font-black uppercase tracking-wide text-amber-200">
                      ⚠️ QUY TẮC BVBND (Ghi chú b): BẮT BUỘC PHỐI HỢP KHÁNG SINH GRAM (+) VÀ GRAM (-)
                    </div>
                    <p className="mt-0.5 opacity-95">
                      Bệnh nhân có đồng thời nguy cơ nhiễm cầu khuẩn Gram (+) đa kháng (MRSA/VRE) và trực khuẩn Gram (-) đa kháng. <strong>Bắt buộc chỉ định phác đồ phối hợp 2 nhóm thuốc</strong> (Ví dụ: Vancomycin hoặc Linezolid phối hợp với Meropenem hoặc Piperacillin/tazobactam).
                    </p>
                  </div>
                </div>
              )}

              {/* Note b: Dual Gram(-) */}
              {riskResult.isDualGramNegRisk && (
                <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-800 text-white shadow-xs flex items-start space-x-2.5">
                  <Zap className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed">
                    <div className="font-black uppercase tracking-wide text-amber-200">
                      ⚡ QUY TẮC BVBND (Ghi chú b): ƯU TIÊN KHÁNG SINH DIỆT PSEUDOMONAS / ACINETOBACTER
                    </div>
                    <p className="mt-0.5 opacity-95">
                      Bệnh nhân có nguy cơ cả ESBL và Pseudomonas/Acinetobacter. <strong>Ưu tiên chọn kháng sinh có hoạt phổ trên Acinetobacter / Pseudomonas</strong> (như Meropenem, Cefepime, Piperacillin/tazobactam) để bao phủ luôn cả chủng sinh ESBL. <em>Tránh dùng Ertapenem đơn độc</em>.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* ============================================================== */}
      {/* 2. KHUNG PHÁC ĐỒ ĐIỀU TRỊ KHỞI ĐẦU & TÍNH LIỀU TRỰC TIẾP */}
      {/* ============================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
        
        {/* Header Bar: Guideline Source Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-7 h-7 rounded-xl bg-teal-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                2
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                Phác Đồ &amp; Liều Cá Thể Hóa Khuyến Cáo
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                isGroup2 ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}>
                {isGroup2 ? 'Nhóm 2: Nguy cơ cao VKĐK' : 'Nhóm 1: Tiêu chuẩn'}
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                CrCl {renal.crcl} mL/p • {renal.categoryLabelVi}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Liều khuyến cáo được tính toán trực tiếp cho từng kháng sinh theo thông số chức năng thận Cockcroft-Gault
            </p>
          </div>

          {/* Guideline Sources Segmented Bar */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="inline-flex rounded-2xl p-1 bg-slate-100 border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveGuidelineSource('bvbnd')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeGuidelineSource === 'bvbnd'
                    ? 'bg-white text-teal-900 shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                <span>BVBND ({allBvbndRegimens.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveGuidelineSource('who')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeGuidelineSource === 'who'
                    ? 'bg-sky-600 text-white shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>WHO AWaRe ({whoRegimens.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveGuidelineSource('antibiogram')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeGuidelineSource === 'antibiogram'
                    ? 'bg-teal-700 text-white shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>KSĐ Tại Chỗ</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveGuidelineSource('compare')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeGuidelineSource === 'compare'
                    ? 'bg-purple-600 text-white shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Đối Chiếu</span>
              </button>
            </div>

            {onOpenGuidelineAtlas && (
              <button
                type="button"
                onClick={() => onOpenGuidelineAtlas(getTargetImageId())}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-all flex items-center gap-1 cursor-pointer"
                title="Xem ảnh lưu đồ gốc từ tài liệu BV Bệnh Nhiệt Đới 2026"
              >
                <span>Lưu đồ gốc Tr.{currentPdfPage}</span>
              </button>
            )}
          </div>
        </div>

        {/* 2.1 BVBND 2026 VIEW */}
        {activeGuidelineSource === 'bvbnd' && (
          <div className="space-y-4">
            {/* Quick Filter chips if Group 2 */}
            {riskResult.group === 'group_2' && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  Lọc phác đồ:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedFilterRisk('all')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedFilterRisk === 'pseudo_acineto'
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  + Pseudo / Acineto
                </button>
              </div>
            )}

            {/* List of Regimens with Live Calculated Doses */}
            <div className="space-y-4">
              {bvbndRegimens.map(regimen => (
                <div
                  key={regimen.id}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-white shadow-xs hover:border-teal-300 transition-all space-y-3.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                        <span>{regimen.titleVi}</span>
                        {regimen.specificRisk && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-200">
                            Bao phủ {regimen.specificRisk.toUpperCase()}
                          </span>
                        )}
                      </h4>
                      <div className="text-[11px] text-slate-500 italic mt-0.5">
                        {regimen.titleEn}
                      </div>
                    </div>
                    <SourceBadge source={regimen.source} />
                  </div>

                  {/* Drug choices grid with DIRECT LIVE DOSES */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {regimen.drugs.map((drug, dIdx) => {
                      const drugName = drug.nameVi || drug.drugName || 'Kháng sinh';
                      const doseText = drug.standardDoseVi || drug.dosageVi || 'Theo hướng dẫn';
                      const routeText = drug.route || 'IV';
                      const rawDrugId = drug.drugId;
                      const resolvedDrugId = rawDrugId ? (DRUG_MAP[rawDrugId]?.drugId || rawDrugId) : undefined;
                      const liveDose = resolvedDrugId ? getLiveDose(resolvedDrugId) : null;
                      const isCurrentlyDetailed = Boolean(detailedDrugId && detailedDrugId === resolvedDrugId);

                      return (
                        <div
                          key={dIdx}
                          className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                            isCurrentlyDetailed
                              ? 'border-teal-500 ring-2 ring-teal-500/20 bg-teal-50/40 shadow-xs'
                              : 'border-slate-200/90 bg-slate-50/60 hover:bg-white hover:border-teal-300 hover:shadow-xs'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-extrabold text-xs sm:text-sm text-teal-950">
                                {drugName}
                              </span>
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-200/80 text-slate-700 shrink-0">
                                {routeText}
                              </span>
                            </div>

                            <div className="mt-1 text-xs text-slate-600">
                              <span className="font-semibold text-slate-800">Liều chuẩn BVBND:</span>{' '}
                              <span className="font-medium text-slate-700">{doseText}</span>
                            </div>

                            {drug.infusionNoteVi && (
                              <div className="mt-1 text-[11px] text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/70 flex items-center gap-1.5 font-medium">
                                <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                                <span>{drug.infusionNoteVi}</span>
                              </div>
                            )}

                            {/* LIỀU CÁ THỂ HÓA TÍNH TRỰC TIẾP */}
                            {liveDose ? (
                              <div className="mt-2.5 p-2.5 rounded-xl bg-white border border-teal-300 shadow-2xs space-y-1.5">
                                <div className="flex items-center justify-between gap-1 flex-wrap pb-1 border-b border-slate-100">
                                  <span className="text-[10px] font-black uppercase text-teal-900 tracking-wider flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                                    <span>Liều cá thể hóa (CrCl {renal.crcl} mL/p):</span>
                                  </span>
                                  {liveDose.dose.reductionPercentage && liveDose.dose.reductionPercentage > 0 ? (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                      Giảm {liveDose.dose.reductionPercentage}% liều
                                    </span>
                                  ) : patient.dialysis !== 'none' ? (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                                      Lọc máu {patient.dialysis.toUpperCase()}
                                    </span>
                                  ) : (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                      100% liều chuẩn
                                    </span>
                                  )}
                                </div>

                                {liveDose.dose.loadingDoseTextVi && (
                                  <div className="text-[11px] text-amber-950 bg-amber-50/90 p-1.5 rounded-lg border border-amber-200/80 leading-snug">
                                    <strong className="text-amber-900 font-extrabold">Liều nạp:</strong> {liveDose.dose.loadingDoseTextVi}
                                  </div>
                                )}

                                <div className="text-xs sm:text-sm font-black text-teal-950 leading-snug">
                                  {liveDose.dose.maintenanceDoseTextVi}
                                </div>

                                {liveDose.dose.infusionInstructionsVi && (
                                  <div className="text-[11px] text-teal-800 flex items-center gap-1 font-medium">
                                    <Clock className="w-3 h-3 text-teal-600 shrink-0" />
                                    <span>{liveDose.dose.infusionInstructionsVi}</span>
                                  </div>
                                )}
                              </div>
                            ) : null}
                          </div>

                          {/* ACTION BUTTONS: SAO CHÉP Y LỆNH & XEM CỤ THỂ */}
                          <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex items-center justify-between gap-2 flex-wrap">
                            {liveDose?.dose?.orderTextVi ? (
                              <button
                                type="button"
                                onClick={() => handleCopyOrder(liveDose.dose.orderTextVi, resolvedDrugId!)}
                                className="px-2.5 py-1 text-[11px] font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                                title="Sao chép y lệnh vào EMR/HIS"
                              >
                                {copiedDrugId === resolvedDrugId ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span className="text-emerald-700 font-extrabold">Đã chép!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3 text-slate-500" />
                                    <span>Sao chép y lệnh</span>
                                  </>
                                )}
                              </button>
                            ) : (
                              <div></div>
                            )}

                            {resolvedDrugId ? (
                              <button
                                type="button"
                                onClick={() => handleToggleDetailedView(rawDrugId!)}
                                className="px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs bg-teal-600 hover:bg-teal-700 text-white"
                                title="Bật bảng thông tin chi tiết về liều, hiệu chỉnh CrCl, lọc máu và tương tác thuốc"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Xem cụ thể</span>
                              </button>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Combination rules & caution */}
                  {regimen.combinationRulesVi && regimen.combinationRulesVi.length > 0 && (
                    <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-100 text-xs text-slate-700 space-y-1">
                      <div className="font-bold text-teal-950 flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>Quy tắc phối hợp lâm sàng:</span>
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 pl-1 text-[11px]">
                        {regimen.combinationRulesVi.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {regimen.cautionVi && regimen.cautionVi.length > 0 && (
                    <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-xs text-rose-950 space-y-1">
                      <div className="font-bold text-rose-950 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>Chú ý an toàn &amp; Chống chỉ định phối hợp:</span>
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 pl-1 text-[11px] text-rose-900">
                        {regimen.cautionVi.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2.2 WHO AWARE 2022 VIEW */}
        {activeGuidelineSource === 'who' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-sky-50/80 border border-sky-200 text-xs text-sky-950 flex items-start gap-2.5">
              <Globe className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-extrabold">The WHO AWaRe Antibiotic Book (2022):</strong>
                <p className="mt-0.5 text-slate-600 text-[11px] leading-relaxed">
                  Phân nhóm kháng sinh: <strong>Access</strong> (ưu tiên tiếp cận), <strong>Watch</strong> (giám sát kháng chéo), <strong>Reserve</strong> (dự trữ bước cuối).
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {whoRegimens.map(regimen => (
                <div
                  key={regimen.id}
                  className="p-4 rounded-2xl border border-slate-200/90 bg-white shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                          regimen.line === 'first_choice' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {regimen.line === 'first_choice' ? <Star className="w-3 h-3 text-emerald-600" /> : <RefreshCw className="w-3 h-3 text-amber-600" />}
                          <span>{regimen.line === 'first_choice' ? 'Đầu tay' : 'Lựa chọn 2'}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {regimen.clinicalSetting === 'primary_care' ? 'Ngoại trú' : 'Bệnh viện'}
                        </span>
                        {regimen.durationVi && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-teal-600" />
                            <span>{regimen.durationVi}</span>
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900">{regimen.titleVi}</h4>
                      <p className="text-[11px] text-slate-500 italic mt-0.5">{regimen.titleEn}</p>
                    </div>
                    <SourceBadge source={regimen.source} />
                  </div>

                  {/* Drug choices */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {regimen.drugs.map((drug, dIdx) => {
                      const drugName = drug.nameVi || drug.drugName;
                      const rawDrugId = drug.drugId;
                      const resolvedDrugId = rawDrugId ? (DRUG_MAP[rawDrugId]?.drugId || rawDrugId) : undefined;
                      const liveDose = resolvedDrugId ? getLiveDose(resolvedDrugId) : null;
                      const isCurrentlyDetailed = Boolean(detailedDrugId && detailedDrugId === resolvedDrugId);

                      return (
                        <div
                          key={dIdx}
                          className="p-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5 flex-wrap">
                                <span>{drugName}</span>
                                {drug.awareCategory && (
                                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                                    drug.awareCategory === 'Access'
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                      : drug.awareCategory === 'Watch'
                                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                                  }`}>
                                    {drug.awareCategory}
                                  </span>
                                )}
                              </span>
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-200/80 text-slate-700 shrink-0">
                                {drug.route || 'IV'}
                              </span>
                            </div>
                            <div className="mt-1 text-xs text-slate-700">
                              <span className="font-semibold text-slate-900">Liều WHO:</span>{' '}
                              <span>{drug.standardDoseVi || drug.dosageVi}</span>
                            </div>

                            {/* Live Dose for WHO drugs */}
                            {liveDose ? (
                              <div className="mt-2 p-2 rounded-xl bg-white border border-sky-200 text-xs text-sky-950 space-y-0.5">
                                <div className="text-[10px] font-bold text-sky-700 uppercase">
                                  Liều theo CrCl {renal.crcl} mL/p:
                                </div>
                                <div className="font-black text-teal-950">{liveDose.dose.maintenanceDoseTextVi}</div>
                              </div>
                            ) : null}
                          </div>

                          {resolvedDrugId ? (
                            <div className="mt-3 pt-2 border-t border-slate-200/70 flex items-center justify-end">
                              <button
                                type="button"
                                onClick={() => handleToggleDetailedView(rawDrugId!)}
                                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-sky-600 hover:bg-sky-700 text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                                title="Bật bảng thông tin chi tiết về liều, hiệu chỉnh CrCl, lọc máu và tương tác thuốc"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Xem cụ thể</span>
                              </button>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2.3 ANTIBIOGRAM VI SINH TẠI CHỖ */}
        {activeGuidelineSource === 'antibiogram' && (
          <div className="space-y-3">
            {antibiogramData ? (
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Báo Cáo Vi Sinh &amp; Kháng Sinh Đồ — BV Bệnh Nhiệt Đới
                    </h4>
                    <p className="text-xs text-slate-500">
                      Thời gian khảo sát: {antibiogramData.period} | Tổng số chủng phân lập: {antibiogramData.sampleTotal}
                    </p>
                  </div>
                  <SourceBadge source={antibiogramData.source} />
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full min-w-[500px] text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                        <th className="py-2 px-3">Tác nhân</th>
                        <th className="py-2 px-3 text-center">Tỷ lệ</th>
                        <th className="py-2 px-3">Độ nhạy cảm kháng sinh thường dùng</th>
                        <th className="py-2 px-3">Đặc điểm kháng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {antibiogramData.organisms.map((org, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/70">
                          <td className="py-2.5 px-3 font-bold text-slate-900">
                            {org.organismName}
                            <div className="text-[10px] text-slate-400 font-normal">n = {org.sampleCount}</div>
                          </td>
                          <td className="py-2.5 px-3 text-center font-extrabold text-teal-700">
                            {org.pctOfIsolates}%
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex flex-wrap gap-1">
                              {org.sensitivities.map((s, sIdx) => (
                                <span
                                  key={sIdx}
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                                    s.sensitivityPct >= 70
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                      : s.sensitivityPct < 40
                                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                                      : 'bg-amber-50 text-amber-800 border-amber-200'
                                  }`}
                                >
                                  {s.antibioticName}: <strong>{s.sensitivityPct}%</strong>
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-rose-700 font-medium text-[11px]">
                            {org.notableResistance || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
                Chưa có dữ liệu Antibiogram riêng cho ổ nhiễm này. Vui lòng tham khảo khảo sát vi sinh chung BV Bệnh Nhiệt Đới năm 2024.
              </div>
            )}
          </div>
        )}

        {/* 2.4 ĐỐI CHIẾU HƯỚNG DẪN BVBND vs WHO */}
        {activeGuidelineSource === 'compare' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-teal-200 shadow-2xs space-y-2">
                <div className="font-extrabold text-xs text-teal-950 flex items-center gap-1.5 pb-2 border-b border-teal-100">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                  <span>Bệnh Viện Bệnh Nhiệt Đới (2026)</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                  {comparisonData.bvbndKeyPointsVi.map((pt, i) => (
                    <li key={i} className="leading-relaxed">{pt}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-sky-200 shadow-2xs space-y-2">
                <div className="font-extrabold text-xs text-sky-950 flex items-center gap-1.5 pb-2 border-b border-sky-100">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                  <span>WHO AWaRe Book (2022)</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                  {comparisonData.whoKeyPointsVi.map((pt, i) => (
                    <li key={i} className="leading-relaxed">{pt}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-300 text-xs text-amber-950">
              <strong className="font-bold flex items-center gap-1.5 text-amber-900 mb-1">
                <Stethoscope className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Khuyến cáo Dược sĩ lâm sàng:</span>
              </strong>
              <p className="leading-relaxed pl-5 text-[11px] text-amber-900 font-medium">
                {comparisonData.stewardshipAdviceVi}
              </p>
            </div>
          </div>
        )}

      </div>



      {/* ============================================================== */}
      {/* 4. BOTTOM WORKFLOW STEP-FORWARD BUTTON */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex items-center justify-between">
        <div className="text-xs text-slate-500 hidden sm:block">
          Bệnh nhân: <strong>{population === 'adult' ? 'Người lớn' : 'Trẻ em'}</strong> • Ổ nhiễm: <strong>{sitesList.find(s => s.id === site)?.titleVi}</strong> • Nguy cơ: <strong>{isGroup2 ? 'Nhóm 2 (Cao VKĐK)' : 'Nhóm 1'}</strong>
        </div>

        <button
          type="button"
          onClick={onNextStep}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 transition-all flex items-center justify-center space-x-2 cursor-pointer ml-auto"
        >
          <span>Sang Bước 2: Tái Đánh Giá 48-72h</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
