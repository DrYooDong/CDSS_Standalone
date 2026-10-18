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
  CheckSquare
} from 'lucide-react';
import {
  Population,
  InfectionSite,
  SepsisSource,
  RiskClassificationResult,
  SpecificPathogenRisk
} from '../../selection/types';
import { NHSN_CRITERIA_SECTIONS } from '../../selection/data/nhsnCriteria';
import { GENERAL_MDR_RISK_FACTORS } from '../../selection/data/riskFactors';
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

          <div className="flex items-center gap-1.5 flex-wrap">
            {presets.map(p => {
              const isSelected = activePreset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPreset(p.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
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
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center space-x-1"
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
                  else if (s.id === 'urinary') setSelectedSyndrome('nhsn_cauti');
                  else if (s.id === 'sepsis') setSelectedSyndrome('nhsn_clabsi');
                  else if (s.id === 'skin_soft_tissue') setSelectedSyndrome('nhsn_ssti');
                  else if (s.id === 'peritoneal') setSelectedSyndrome('nhsn_sbp');
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
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {s.titleVi}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">
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
            <div className="flex items-center space-x-2 ml-auto">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Ngõ vào:</span>
              <select
                value={sepsisSource || 'respiratory'}
                onChange={e => onSelectSepsisSource(e.target.value as SepsisSource)}
                className="text-xs border border-slate-300 rounded-lg px-2.5 py-1 bg-white font-medium focus:ring-1 focus:ring-teal-500 cursor-pointer"
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
          
          <div className="flex items-center space-x-2">
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
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 mb-3">
          <div className="flex items-center space-x-2.5">
            <CheckSquare className="w-4 h-4 text-teal-600 shrink-0" />
            <div className="text-xs text-slate-700">
              Bệnh nhân có hội chứng nhiễm khuẩn cấp tính, sốc nhiễm khuẩn hoặc tổn thương cơ quan rõ ràng:
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => onConfirmIndication(true)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">
                Hội chứng đánh giá NHSN:
              </span>
              <select
                value={selectedSyndrome}
                onChange={e => setSelectedSyndrome(e.target.value)}
                className="text-xs border border-slate-300 rounded-lg px-2.5 py-1 bg-white font-medium focus:ring-1 focus:ring-teal-500 cursor-pointer"
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
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-teal-600" />
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
                  ? 'Điểm pSOFA ≥ 8 là chỉ dấu bệnh nặng'
                  : isChronicLiverDisease
                  ? 'Điểm CLIF-SOFA ≥ 12 là chỉ dấu suy đa tạng ở bệnh nhân xơ gan'
                  : 'Điểm SOFA ≥ 2 phản ánh rối loạn chức năng tạng nặng liên quan nhiễm khuẩn'}
              </p>
            </div>

            {/* Quick Score Stepper */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 font-medium">Điểm số:</span>
              <div className="flex items-center space-x-1">
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
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
          </div>
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

        {/* Specific Pathogen Risks */}
        <div>
          <span className="text-xs font-bold text-slate-800 block mb-2">
            Nguy Cơ Tác Nhân Đa Kháng Đặc Hiệu (Cần Phối Hợp Thuốc):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'mrsa', label: 'Tụ cầu MRSA', sub: 'Vancomycin / Linezolid' },
              { id: 'pseudo_acineto', label: 'Pseudomonas / Acinetobacter', sub: 'Carbapenem / Colistin' },
              { id: 'esbl', label: 'Enterobacterales sinh ESBL', sub: 'Carbapenem / Aminoglycoside' },
              { id: 'enterococcus', label: 'Enterococcus (VRE)', sub: 'Ampicillin / Daptomycin' }
            ].map(spec => {
              const isChecked = checkedSpecificRisks.includes(spec.id as SpecificPathogenRisk);
              return (
                <label
                  key={spec.id}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start space-x-2 ${
                    isChecked
                      ? 'border-rose-500 bg-rose-50/70 text-rose-950 font-bold'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleSpecificRisk(spec.id as SpecificPathogenRisk)}
                    className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4 mt-0.5 cursor-pointer shrink-0"
                  />
                  <div>
                    <div>{spec.label}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{spec.sub}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* RESULT CARD & PROCEED BUTTON */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
        isGroup2
          ? 'bg-rose-50/80 border-rose-300 text-rose-950 shadow-sm'
          : 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-sm'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
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
            className={`px-5 py-3 rounded-xl font-extrabold text-xs text-white shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0 ${
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
