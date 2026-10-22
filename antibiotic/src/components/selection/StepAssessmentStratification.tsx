import React, { useState } from 'react';
import {
  Stethoscope,
  Droplet,
  Flame,
  HeartHandshake,
  Brain,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Info,
  Sparkles,
  RotateCcw,
  User,
  Baby,
  Activity,
  Layers,
  CheckSquare,
  Bug,
  Calculator,
  Shield,
  Zap,
  AlertCircle
} from 'lucide-react';
import {
  Population,
  InfectionSite,
  SepsisSource,
  RiskClassificationResult,
  SpecificPathogenRisk
} from '../../selection/types';
import { NHSN_CRITERIA_SECTIONS } from '../../selection/data/nhsnCriteria';
import {
  GENERAL_MDR_RISK_FACTORS,
  MRSA_RISK_FACTORS,
  ESBL_RISK_FACTORS,
  PSEUDO_ACINETO_RISK_FACTORS,
  ENTEROCOCCUS_RISK_FACTORS,
  getPrimaryTargetForSite
} from '../../selection/data/riskFactors';
import { SourceBadge } from './SourceBadge';

interface StepAssessmentStratificationProps {
  indicationConfirmed: boolean;
  onConfirmIndication: (confirmed: boolean) => void;
  checkedNhsnIds: string[];
  onToggleNhsnId: (id: string) => void;
  population: Population;
  onSelectPopulation: (pop: Population) => void;
  site: InfectionSite;
  onSelectSite: (site: InfectionSite) => void;
  sepsisSource?: SepsisSource;
  onSelectSepsisSource: (src: SepsisSource) => void;
  checkedGeneralRiskIds: string[];
  onToggleGeneralRisk: (id: string) => void;
  checkedSpecificRiskFactorIds?: string[];
  onToggleSpecificRiskFactor?: (factorId: string) => void;
  sofaScore: number;
  onSofaChange: (val: number) => void;
  psofaScore: number;
  onPsofaChange: (val: number) => void;
  clifSofaScore: number;
  onClifSofaChange: (val: number) => void;
  isChronicLiverDisease: boolean;
  onToggleChronicLiver: (val: boolean) => void;
  checkedSpecificRisks: SpecificPathogenRisk[];
  onToggleSpecificRisk: (risk: SpecificPathogenRisk) => void;
  riskResult: RiskClassificationResult;
  onApplyPreset: (presetId: string) => void;
  onNextStage: () => void;
}

export const StepAssessmentStratification: React.FC<StepAssessmentStratificationProps> = ({
  indicationConfirmed,
  onConfirmIndication,
  checkedNhsnIds,
  onToggleNhsnId,
  population,
  onSelectPopulation,
  site,
  onSelectSite,
  sepsisSource,
  onSelectSepsisSource,
  checkedGeneralRiskIds,
  onToggleGeneralRisk,
  checkedSpecificRiskFactorIds = [],
  onToggleSpecificRiskFactor,
  sofaScore,
  onSofaChange,
  psofaScore,
  onPsofaChange,
  clifSofaScore,
  onClifSofaChange,
  isChronicLiverDisease,
  onToggleChronicLiver,
  checkedSpecificRisks,
  onToggleSpecificRisk,
  riskResult,
  onApplyPreset,
  onNextStage
}) => {
  const [showNhsnDetails, setShowNhsnDetails] = useState<boolean>(true);
  const [selectedSyndrome, setSelectedSyndrome] = useState<string>('nhsn_pneumonia_adult');
  const [activePreset, setActivePreset] = useState<string>('vap_severe');
  const [showSofaCalculator, setShowSofaCalculator] = useState<boolean>(false);
  const [expandedPathogen, setExpandedPathogen] = useState<SpecificPathogenRisk | null>(null);

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

  const presets = [
    { id: 'vap_severe', label: 'VAP Thở Máy (ICU • SOFA 8)', desc: 'Nguy cơ cao VKĐK Nhóm 2' },
    { id: 'cap_standard', label: 'CAP Viêm Phổi (Khoa Nội • SOFA 0)', desc: 'Ít nguy cơ Nhóm 1' },
    { id: 'sepsis_cirrhosis', label: 'Sepsis / SBP Xơ Gan (CLIF-SOFA 13)', desc: 'Nguy cơ cao VKĐK' },
    { id: 'cauti_elderly', label: 'CAUTI Tiết Niệu Sonde Lưu', desc: 'Có nguy cơ ESBL/Pseudomonas' },
    { id: 'ssti_cellulitis', label: 'SSTI Viêm Mô Tế Bào', desc: 'Ít nguy cơ Nhóm 1' }
  ];

  const activeNhsnSection = NHSN_CRITERIA_SECTIONS.find(s => s.id === selectedSyndrome) || NHSN_CRITERIA_SECTIONS[0];
  const metCount = activeNhsnSection.criteria.filter(c => checkedNhsnIds.includes(c.id)).length;
  const isCriteriaMet = metCount >= activeNhsnSection.requiredCriteriaCount;

  const handleSelectPreset = (presetId: string) => {
    setActivePreset(presetId);
    if (presetId === 'vap_severe') setSelectedSyndrome('nhsn_vap_vae');
    else if (presetId === 'cap_standard') setSelectedSyndrome('nhsn_pneumonia_adult');
    else if (presetId === 'sepsis_cirrhosis') setSelectedSyndrome('nhsn_sbp_peritoneal');
    else if (presetId === 'cauti_elderly') setSelectedSyndrome('nhsn_uti');
    else if (presetId === 'ssti_cellulitis') setSelectedSyndrome('nhsn_ssti');
    onApplyPreset(presetId);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner: Quick Preset Picker Bar */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-sky-950 text-white rounded-2xl p-4 shadow-sm border border-teal-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-wider text-teal-400">
                  Mẫu Ca Lâm Sàng Nhanh
                </span>
                <span className="text-[10px] bg-teal-500/20 text-teal-200 px-2 py-0.5 rounded-full border border-teal-400/20">
                  1-Click Điền Tức Thì
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Tải kịch bản mẫu điển hình để rút ngắn thời gian đánh giá bệnh nhân
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 max-w-full scrollbar-none sm:flex-wrap">
            {presets.map(p => {
              const isSelected = activePreset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPreset(p.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 whitespace-nowrap ${
                    isSelected
                      ? 'bg-teal-500 text-slate-950 font-bold shadow-sm ring-2 ring-white/30'
                      : 'bg-white/10 text-slate-200 hover:bg-white/20 hover:text-white border border-white/10'
                  }`}
                  title={p.desc}
                >
                  <span>{p.label}</span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => handleSelectPreset('custom')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center space-x-1 shrink-0 whitespace-nowrap"
              title="Làm mới để tự nhập ca bệnh"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Tự nhập</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: Ổ NHIỄM & DÂN SỐ */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
              A
            </span>
            <h3 className="text-sm font-extrabold text-slate-900">
              Vị Trí Ổ Nhiễm & Đối Tượng Bệnh Nhân
            </h3>
          </div>
          <SourceBadge source={{ doc: 'BVBND_LuuDo', page: 2 }} />
        </div>

        {/* Site Selector Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
          {sitesList.map(s => {
            const isSelected = site === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  onSelectSite(s.id);
                  if (s.id === 'respiratory') setSelectedSyndrome('nhsn_pneumonia_adult');
                  else if (s.id === 'urinary') setSelectedSyndrome('nhsn_uti');
                  else if (s.id === 'sepsis') setSelectedSyndrome('nhsn_sepsis_bloodstream');
                  else if (s.id === 'skin_soft_tissue') setSelectedSyndrome('nhsn_ssti');
                  else if (s.id === 'peritoneal') setSelectedSyndrome('nhsn_sbp_peritoneal');
                  else if (s.id === 'cns') setSelectedSyndrome('nhsn_cns_meningitis');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? s.borderActive
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className={`p-1.5 rounded-lg ${s.color}`}>
                    {s.icon}
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 leading-snug break-words">
                    {s.titleVi}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 leading-snug break-words line-clamp-1 sm:line-clamp-none">
                    {s.subVi}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Population & Sepsis Source row */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Đối tượng:</span>
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
              <button
                type="button"
                onClick={() => onSelectPopulation('adult')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  population === 'adult'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Người lớn (≥ 16T)</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectPopulation('pediatric')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  population === 'pediatric'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Baby className="w-3.5 h-3.5" />
                <span>Trẻ em (&lt; 16T)</span>
              </button>
            </div>
          </div>

          <label className="flex items-center space-x-2 cursor-pointer bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={isChronicLiverDisease}
              onChange={e => onToggleChronicLiver(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
            />
            <span className="text-xs font-semibold text-slate-700">
              Bệnh gan mạn / Xơ gan (Áp dụng thang điểm CLIF-SOFA)
            </span>
          </label>

          {site === 'sepsis' && (
            <div className="flex items-center space-x-2 w-full sm:w-auto sm:ml-auto">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider shrink-0">Ngõ vào:</span>
              <select
                value={sepsisSource || 'respiratory'}
                onChange={e => onSelectSepsisSource(e.target.value as SepsisSource)}
                className="text-xs border border-slate-300 rounded-lg px-2.5 py-1 bg-white font-medium focus:ring-1 focus:ring-teal-500 cursor-pointer flex-1 sm:flex-none"
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
      </div>

      {/* SECTION 2: BẢNG KIỂM CHỈ ĐỊNH & TIÊU CHUẨN NHSN-CDC */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
              B
            </span>
            <h3 className="text-sm font-extrabold text-slate-900">
              Xác Nhận Chỉ Định & Bảng Kiểm NHSN-CDC 2019
            </h3>
          </div>
          
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center space-x-1 ${
              isCriteriaMet
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {isCriteriaMet ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Đạt {metCount}/{activeNhsnSection.requiredCriteriaCount} tiêu chuẩn NHSN</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Đã chọn {metCount}/{activeNhsnSection.requiredCriteriaCount} tiêu chuẩn</span>
                </>
              )}
            </div>
            
            <button
              type="button"
              onClick={() => setShowNhsnDetails(!showNhsnDetails)}
              className="text-slate-500 hover:text-slate-800 p-1 rounded-md text-xs font-medium flex items-center space-x-1 cursor-pointer"
            >
              <span>{showNhsnDetails ? 'Thu gọn' : 'Xem chi tiết'}</span>
              {showNhsnDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Quick Indication Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 mb-3">
          <div className="flex items-center space-x-2.5 flex-1 min-w-0">
            <CheckSquare className="w-4 h-4 text-teal-600 shrink-0" />
            <div className="text-xs text-slate-700 font-medium">
              Bệnh nhân có hội chứng nhiễm khuẩn cấp tính, sốc nhiễm khuẩn hoặc tổn thương cơ quan rõ ràng:
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={() => onConfirmIndication(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                indicationConfirmed
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              ✓ Xác nhận có chỉ định
            </button>
            <button
              type="button"
              onClick={() => onConfirmIndication(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                !indicationConfirmed
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Chưa rõ / Nghi do virus
            </button>
          </div>
        </div>

        {/* Expandable NHSN Criteria Checklist */}
        {showNhsnDetails && (
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-600">
                Hội chứng đánh giá NHSN:
              </span>
              <select
                value={selectedSyndrome}
                onChange={e => setSelectedSyndrome(e.target.value)}
                className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white font-medium focus:ring-1 focus:ring-teal-500 cursor-pointer w-full sm:w-auto"
              >
                {NHSN_CRITERIA_SECTIONS.map(sec => (
                  <option key={sec.id} value={sec.id}>
                    {sec.titleVi}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {activeNhsnSection.criteria.map(crit => {
                const isChecked = checkedNhsnIds.includes(crit.id);
                return (
                  <label
                    key={crit.id}
                    className={`flex items-start space-x-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      isChecked
                        ? 'border-teal-500 bg-teal-50/50 text-slate-900 font-medium'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleNhsnId(crit.id)}
                      className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 mt-0.5 cursor-pointer shrink-0"
                    />
                    <div className="flex-1 leading-snug">
                      <span>{crit.textVi}</span>
                      {crit.isImaging && (
                        <span className="ml-1.5 px-1 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-700">
                          X-quang / CT
                        </span>
                      )}
                      {crit.isLab && (
                        <span className="ml-1.5 px-1 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-700">
                          Xét nghiệm
                        </span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: PHÂN TẦNG NGUY CƠ VKĐK & MỨC ĐỘ NẶNG */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
              C
            </span>
            <h3 className="text-sm font-extrabold text-slate-900">
              Phân Tầng Nguy Cơ Vi Khuẩn Đa Kháng (VKĐK) & Mức Độ Nặng
            </h3>
          </div>
          <SourceBadge source={{ doc: 'BVBND_PhanNhom', page: 2 }} />
        </div>

        {/* Severity Score Component */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <Activity className="w-4 h-4 text-teal-600 shrink-0" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  {population === 'pediatric' ? 'Thang điểm pSOFA (Trẻ em)' : isChronicLiverDisease ? 'Thang điểm CLIF-SOFA (Xơ gan)' : 'Thang điểm SOFA (Người lớn)'}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                  riskResult.isHighSeverity ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {riskResult.isHighSeverity ? 'Mức độ Nặng / Sốc NK' : 'Mức độ Nhẹ - Trung bình'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {population === 'pediatric'
                  ? 'Điểm pSOFA ≥ 8 là chỉ dấu bệnh nặng (Sepsis-3 Nhi khoa)'
                  : isChronicLiverDisease
                  ? 'Điểm CLIF-SOFA ≥ 12 là chỉ dấu suy tạng nặng ở bệnh nhân xơ gan'
                  : 'Điểm SOFA ≥ 2 phản ánh rối loạn chức năng tạng nặng liên quan nhiễm khuẩn'}
              </p>
            </div>

            {/* Quick Score Stepper & Calculator Trigger */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
                <span className="text-xs text-slate-500 font-medium shrink-0">Điểm số:</span>
                <div className="flex items-center gap-1 shrink-0">
                  {[0, 1, 2, 4, 6, 8, 12].map(scoreVal => {
                    const currentScore = population === 'pediatric' ? psofaScore : isChronicLiverDisease ? clifSofaScore : sofaScore;
                    const isCurrent = currentScore === scoreVal;
                    return (
                      <button
                        key={scoreVal}
                        type="button"
                        onClick={() => {
                          if (population === 'pediatric') onPsofaChange(scoreVal);
                          else if (isChronicLiverDisease) onClifSofaChange(scoreVal);
                          else onSofaChange(scoreVal);
                        }}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                          isCurrent
                            ? 'bg-teal-600 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {scoreVal}
                      </button>
                    );
                  })}
                </div>
              </div>
              {population === 'adult' && !isChronicLiverDisease && (
                <button
                  type="button"
                  onClick={() => setShowSofaCalculator(!showSofaCalculator)}
                  className={`w-full sm:w-auto px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                    showSofaCalculator
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200'
                  }`}
                  title="Mở máy tính nhanh 6 hệ cơ quan SOFA"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>{showSofaCalculator ? 'Đóng tính nhanh' : 'Máy tính SOFA'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick SOFA 6 Organ Criteria Panel */}
          {showSofaCalculator && population === 'adult' && !isChronicLiverDisease && (
            <div className="pt-2 border-t border-slate-200/80 space-y-2">
              <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                <span>Chọn các rối loạn chức năng cơ quan ghi nhận ở bệnh nhân:</span>
                <span className="text-teal-700 font-semibold">SOFA hiện tại: {sofaScore} điểm</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
                {[
                  { organ: '🫁 Hô hấp', label: 'PaO2/FiO2 ≤ 300 (hoặc SpO2/FiO2 tương đương)', pts: 2 },
                  { organ: '🫁 Hô hấp thở máy', label: 'PaO2/FiO2 ≤ 200 có hỗ trợ thở máy', pts: 3 },
                  { organ: '🩸 Đông máu', label: 'Tiểu cầu < 100 x 10⁹/L', pts: 2 },
                  { organ: '🩸 Đông máu nặng', label: 'Tiểu cầu < 50 x 10⁹/L', pts: 3 },
                  { organ: '🧪 Gan mật', label: 'Bilirubin ≥ 33 µmol/L (≥ 2.0 mg/dL)', pts: 2 },
                  { organ: '🫀 Tim mạch', label: 'Tụt HA cần bù dịch / Dopamine ≤ 5 µg/kg/p', pts: 2 },
                  { organ: '🫀 Tim mạch nặng', label: 'Cần Noradrenaline / Dopamine > 5 µg/kg/p', pts: 3 },
                  { organ: '🧠 Thần kinh', label: 'Glasgow 10 - 12 điểm (lơ mơ, rối loạn tri giác)', pts: 2 },
                  { organ: '💧 Thận', label: 'Creatinine ≥ 171 µmol/L (≥ 2.0 mg/dL) / thiểu niệu', pts: 2 }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      const newScore = Math.min(24, Math.max(0, sofaScore + (sofaScore >= item.pts ? -item.pts : item.pts)));
                      onSofaChange(newScore);
                    }}
                    className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-left text-[11px] transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="font-bold text-slate-800 flex items-center justify-between">
                      <span>{item.organ}</span>
                      <span className="px-1.5 py-0.2 rounded bg-teal-50 text-teal-700 font-black">+{item.pts}đ</span>
                    </div>
                    <div className="text-slate-500 text-[10px] mt-0.5 leading-snug">{item.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 8 General MDR Risk Factors */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800">
              8 Yếu Tố Nguy Cơ Chung Nhiễm VKĐK (BVBND 2026):
            </span>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
              {checkedGeneralRiskIds.length}/8 Yếu tố đã chọn
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {GENERAL_MDR_RISK_FACTORS.map(factor => {
              const isChecked = checkedGeneralRiskIds.includes(factor.id);
              return (
                <label
                  key={factor.id}
                  className={`flex items-start space-x-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    isChecked
                      ? 'border-amber-500 bg-amber-50/60 text-slate-900 font-medium shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleGeneralRisk(factor.id)}
                    className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 mt-0.5 cursor-pointer shrink-0"
                  />
                  <div className="flex-1">
                    <div className="leading-snug">{factor.labelVi}</div>
                    {factor.noteVi && (
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {factor.noteVi}
                      </div>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Specific Pathogen Risks with Granular Factor Checklist */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Đánh Giá Yếu Tố Nguy Cơ Riêng Của Từng Tác Nhân Đa Kháng (BVBND 2026):
              </span>
              <span className="text-[11px] text-slate-500">
                Tự động suy luận kháng sinh bao phủ & hiển thị cảnh báo phối hợp thuốc theo Ghi chú b
              </span>
            </div>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
              Đã nhận diện: {checkedSpecificRisks.length} nhóm tác nhân
            </span>
          </div>

          {/* 4 Pathogen Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              {
                id: 'mrsa' as SpecificPathogenRisk,
                title: 'Tụ Cầu Vàng Kháng Methicillin (MRSA)',
                sub: 'Vancomycin / Linezolid',
                color: 'rose',
                isSiteTarget: site === 'skin_soft_tissue',
                siteLabel: '🎯 Khuyên kiểm tra theo ổ Da & Mô mềm',
                factors: MRSA_RISK_FACTORS
              },
              {
                id: 'esbl' as SpecificPathogenRisk,
                title: 'Enterobacterales sinh ESBL (E. coli, Klebsiella)',
                sub: 'Carbapenem / Aminoglycoside',
                color: 'amber',
                isSiteTarget: site === 'urinary' || site === 'gastrointestinal' || site === 'peritoneal',
                siteLabel: '🎯 Khuyên kiểm tra theo ổ Tiết niệu / Tiêu hóa',
                factors: ESBL_RISK_FACTORS
              },
              {
                id: 'pseudo_acineto' as SpecificPathogenRisk,
                title: 'Pseudomonas / Acinetobacter Đa Kháng',
                sub: 'Carbapenem / Colistin / Cefepime / Piptaz',
                color: 'purple',
                isSiteTarget: site === 'respiratory' || site === 'sepsis',
                siteLabel: '🎯 Khuyên kiểm tra theo ổ Hô hấp / Nhiễm trùng huyết',
                factors: PSEUDO_ACINETO_RISK_FACTORS
              },
              {
                id: 'enterococcus' as SpecificPathogenRisk,
                title: 'Enterococcus spp. (VRE / Ampicillin-R)',
                sub: 'Ampicillin / Daptomycin / Linezolid',
                color: 'indigo',
                isSiteTarget: site === 'urinary' && checkedGeneralRiskIds.includes('invasive_device'),
                siteLabel: '🎯 Khuyên kiểm tra khi có sonde tiểu lưu kéo dài',
                factors: ENTEROCOCCUS_RISK_FACTORS
              }
            ].map(spec => {
              const isChecked = checkedSpecificRisks.includes(spec.id);
              const isExpanded = expandedPathogen === spec.id;
              const activeCount = spec.factors.filter(f => checkedSpecificRiskFactorIds.includes(f.id)).length;

              return (
                <div
                  key={spec.id}
                  className={`rounded-xl border transition-all ${
                    isChecked
                      ? 'border-rose-400 bg-rose-50/40 shadow-xs'
                      : spec.isSiteTarget
                      ? 'border-sky-300 bg-sky-50/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="p-3 flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                    <label className="flex items-start space-x-2.5 cursor-pointer flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggleSpecificRisk(spec.id)}
                        className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4 mt-0.5 cursor-pointer shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                          <span className={`text-xs font-bold ${isChecked ? 'text-rose-950 font-black' : 'text-slate-900'} break-words`}>
                            {spec.title}
                          </span>
                          {spec.isSiteTarget && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-sky-100 text-sky-800 break-words">
                              {spec.siteLabel}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                          Thuốc bao phủ: <span className="font-semibold text-slate-700">{spec.sub}</span>
                        </div>
                      </div>
                    </label>

                    <button
                      type="button"
                      onClick={() => setExpandedPathogen(isExpanded ? null : spec.id)}
                      className={`self-start sm:self-auto px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center space-x-1 shrink-0 ${
                        isExpanded
                          ? 'bg-slate-200 text-slate-800'
                          : activeCount > 0
                          ? 'bg-rose-100 text-rose-800 font-black'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>{activeCount > 0 ? `${activeCount}/${spec.factors.length} yếu tố` : `Xem ${spec.factors.length} yếu tố`}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>

                  {/* Granular Factors Checklist Expandable Panel */}
                  {isExpanded && (
                    <div className="px-3 pb-3 pt-1 border-t border-slate-100 space-y-1.5 bg-slate-50/50 rounded-b-xl">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Bảng kiểm yếu tố nguy cơ riêng (BVBND):
                      </div>
                      {spec.factors.map(fact => {
                        const isFactorChecked = checkedSpecificRiskFactorIds.includes(fact.id);
                        return (
                          <label
                            key={fact.id}
                            className={`flex items-start space-x-2 p-1.5 rounded-lg border text-[11px] cursor-pointer transition-all ${
                              isFactorChecked
                                ? 'bg-white border-rose-400 font-semibold text-slate-900 shadow-2xs'
                                : 'border-slate-200/80 bg-white/70 hover:bg-white text-slate-600'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isFactorChecked}
                              onChange={() => {
                                onToggleSpecificRiskFactor?.(fact.id);
                                if (!isChecked) onToggleSpecificRisk(spec.id);
                              }}
                              className="rounded text-rose-600 focus:ring-rose-500 w-3.5 h-3.5 mt-0.5 cursor-pointer shrink-0"
                            />
                            <div className="flex-1 leading-snug">
                              <span>{fact.labelVi}</span>
                              {fact.noteVi && (
                                <div className="text-[10px] text-slate-400 mt-0.5">{fact.noteVi}</div>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 4: THẺ TÁC NHÂN GỢI Ý & CẢNH BÁO QUY TẮC BVBND (Ghi Chú b) */}
      <div className="space-y-3">
        {/* Suggested Organisms Card */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isGroup2
            ? 'bg-rose-50/80 border-rose-200 text-rose-950'
            : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
        }`}>
          <div className="flex items-start space-x-3">
            {isGroup2 ? (
              <Bug className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-black uppercase tracking-wider">
                  {isGroup2 ? 'Tác Nhân Vi Khuẩn Đa Kháng Cần Bao Phủ (BVBND 2026):' : 'Tác Nhân Thường Gặp Cần Bao Phủ Theo Ổ Nhiễm (BVBND 2026):'}
                </span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  isGroup2 ? 'bg-rose-200 text-rose-900' : 'bg-emerald-200 text-emerald-900'
                }`}>
                  {isGroup2 ? 'Nhóm 2: Nguy cơ cao VKĐK' : 'Nhóm 1: Ít nguy cơ VKĐK'}
                </span>
              </div>

              {/* Organism Tags */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {riskResult.suggestedOrganismsVi.map((org, idx) => (
                  <span
                    key={idx}
                    className={`text-xs px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1 ${
                      isGroup2
                        ? 'bg-white border border-rose-300 text-rose-900 shadow-2xs'
                        : 'bg-white border border-emerald-300 text-emerald-900 shadow-2xs'
                    }`}
                  >
                    <span>•</span>
                    <span>{org}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BVBND Note b: Co-Risk Gram(+) and Gram(-) Alert Banner */}
        {riskResult.isGramPosGramNegCoRisk && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-700 text-white shadow-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <div className="font-black text-sm uppercase tracking-wide text-amber-200 flex items-center space-x-1.5">
                <span>⚠️ QUY TẮC BVBND (Ghi chú b): BẮT BUỘC PHỐI HỢP KHÁNG SINH GRAM (+) VÀ GRAM (-)</span>
              </div>
              <p className="mt-1 opacity-95">
                Bệnh nhân có đồng thời nguy cơ nhiễm cầu khuẩn Gram (+) đa kháng (MRSA / VRE) VÀ trực khuẩn Gram (-) đa kháng (ESBL / Pseudomonas / Acinetobacter). 
                <strong> Bắt buộc chỉ định phác đồ phối hợp 2 nhóm thuốc</strong> (ví dụ: Vancomycin hoặc Linezolid KẾT HỢP VỚI Meropenem hoặc Piperacillin-tazobactam).
              </p>
            </div>
          </div>
        )}

        {/* BVBND Note b: Dual Gram(-) Risk Prioritization Banner */}
        {riskResult.isDualGramNegRisk && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-800 text-white shadow-sm flex items-start space-x-3">
            <Zap className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <div className="font-black text-sm uppercase tracking-wide text-amber-200 flex items-center space-x-1.5">
                <span>⚡ QUY TẮC BVBND (Ghi chú b): ƯU TIÊN KHÁNG SINH DIỆT PSEUDOMONAS / ACINETOBACTER</span>
              </div>
              <p className="mt-1 opacity-95">
                Bệnh nhân có nguy cơ đồng thời cả 2 nhóm Gram (-) (Enterobacterales sinh ESBL và Pseudomonas / Acinetobacter). 
                <strong> ƯU TIÊN chọn kháng sinh có hoạt phổ trên Acinetobacter / Pseudomonas</strong> (như Meropenem, Cefepime, Piperacillin-tazobactam hoặc Colistin phối hợp) 
                để bao phủ luôn cả các chủng sinh ESBL. <em>Tránh dùng Ertapenem đơn độc</em> vì Ertapenem không có phổ trên Pseudomonas hay Acinetobacter.
              </p>
            </div>
          </div>
        )}

        {/* BVBND Principle 9: Anaerobic Coverage Note */}
        <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs flex items-center space-x-2">
          <Info className="w-4 h-4 text-slate-500 shrink-0" />
          <span>
            <strong>Nguyên tắc số 9 BVBND:</strong> Các kháng sinh phổ rộng nhóm BL-BLI (như Piperacillin-tazobactam) hoặc Carbapenem (Meropenem, Imipenem) đã có phổ kỵ khí hiệu quả, <strong>không dùng Metronidazole phối hợp cùng</strong>.
          </span>
        </div>
      </div>

      {/* RESULT CARD & PROCEED BUTTON */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
        isGroup2
          ? 'bg-rose-50/90 border-rose-300 text-rose-950 shadow-sm'
          : 'bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-sm'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            {isGroup2 ? (
              <ShieldAlert className="w-8 h-8 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-black uppercase tracking-wide">
                  {riskResult.groupLabelVi}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  isGroup2 ? 'bg-rose-200 text-rose-900' : 'bg-emerald-200 text-emerald-900'
                }`}>
                  {isGroup2 ? 'Cần Phổ Rộng / Phối Hợp' : 'Phác Đồ Tiêu Chuẩn'}
                </span>
              </div>
              <ul className="text-xs mt-1.5 space-y-0.5 opacity-90">
                {riskResult.rationalesVi.map((r, i) => (
                  <li key={i} className="flex items-center space-x-1.5">
                    <span>•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            type="button"
            onClick={onNextStage}
            className={`w-full md:w-auto px-5 py-3 rounded-xl font-extrabold text-xs text-white shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0 min-h-[44px] ${
              isGroup2
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
            }`}
          >
            <span>Sang Giai Đoạn 2: Xem Phác Đồ Khuyến Cáo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

