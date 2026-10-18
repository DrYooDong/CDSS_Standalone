import React, { useState } from 'react';
import {
  SelectionWizardState,
  Population,
  InfectionSite,
  SepsisSource,
  SpecificPathogenRisk,
  ClinicalResponseStatus,
  CultureStatus,
  SusceptibilityStatus
} from '../../selection/types';
import { classifyRiskGroup } from '../../selection/engine';
import { StepAssessmentStratification } from './StepAssessmentStratification';
import { StepEmpiric } from './StepEmpiric';
import { StepReassess } from './StepReassess';
import { DecisionSummaryCard } from './DecisionSummaryCard';
import { 
  ClipboardCheck, 
  Pill, 
  Clock, 
  LayoutList, 
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface SelectionWizardProps {
  onSelectDrugForDosing: (drugId?: string) => void;
}

export const SelectionWizard: React.FC<SelectionWizardProps> = ({
  onSelectDrugForDosing
}) => {
  // 3-Stage Master Workflow: 1 = Đánh giá & Phân tầng, 2 = Phác đồ & Antibiogram, 3 = Tái đánh giá 48-72h
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3>(1);
  const [viewMode, setViewMode] = useState<'stepper' | 'all-in-one'>('stepper');

  // Clinical State
  const [indicationConfirmed, setIndicationConfirmed] = useState<boolean>(true);
  const [checkedNhsnIds, setCheckedNhsnIds] = useState<string[]>([
    'vae_vac',
    'vae_ivac',
    'pneu_sputum_purulent',
    'pneu_xray'
  ]);
  const [population, setPopulation] = useState<Population>('adult');
  const [site, setSite] = useState<InfectionSite>('respiratory');
  const [sepsisSource, setSepsisSource] = useState<SepsisSource | undefined>(undefined);
  const [checkedGeneralRiskIds, setCheckedGeneralRiskIds] = useState<string[]>([
    'hospital_90d',
    'invasive_device',
    'iv_abx_30d'
  ]);
  const [sofaScore, setSofaScore] = useState<number>(8);
  const [psofaScore, setPsofaScore] = useState<number>(0);
  const [clifSofaScore, setClifSofaScore] = useState<number>(0);
  const [isChronicLiverDisease, setIsChronicLiverDisease] = useState<boolean>(false);
  const [checkedSpecificRisks, setCheckedSpecificRisks] = useState<SpecificPathogenRisk[]>([
    'pseudo_acineto',
    'mrsa'
  ]);

  // 48-72h State
  const [clinicalResponse, setClinicalResponse] = useState<ClinicalResponseStatus>('improved');
  const [cultureStatus, setCultureStatus] = useState<CultureStatus>('pending');
  const [susceptibilityStatus, setSusceptibilityStatus] = useState<SusceptibilityStatus>('sensitive');
  const [daysOnAntibiotic, setDaysOnAntibiotic] = useState<number>(3);

  // Toggle helpers
  const handleToggleNhsnId = (id: string) => {
    setCheckedNhsnIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleToggleGeneralRisk = (id: string) => {
    setCheckedGeneralRiskIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleToggleSpecificRisk = (risk: SpecificPathogenRisk) => {
    setCheckedSpecificRisks(prev =>
      prev.includes(risk) ? prev.filter(x => x !== risk) : [...prev, risk]
    );
  };

  // Presets handler
  const handleApplyPreset = (presetKey: string) => {
    if (presetKey === 'vap_severe') {
      setPopulation('adult');
      setIsChronicLiverDisease(false);
      setSite('respiratory');
      setSepsisSource(undefined);
      setIndicationConfirmed(true);
      setCheckedNhsnIds(['vae_vac', 'vae_ivac', 'pneu_sputum_purulent', 'pneu_xray']);
      setSofaScore(8);
      setCheckedGeneralRiskIds(['hospital_90d', 'invasive_device', 'iv_abx_30d']);
      setCheckedSpecificRisks(['pseudo_acineto', 'mrsa']);
    } else if (presetKey === 'cap_standard') {
      setPopulation('adult');
      setIsChronicLiverDisease(false);
      setSite('respiratory');
      setSepsisSource(undefined);
      setIndicationConfirmed(true);
      setCheckedNhsnIds(['pneu_fever_wbc', 'pneu_cough_dyspnea', 'pneu_rales', 'pneu_xray']);
      setSofaScore(0);
      setCheckedGeneralRiskIds([]);
      setCheckedSpecificRisks([]);
    } else if (presetKey === 'sepsis_cirrhosis') {
      setPopulation('adult');
      setIsChronicLiverDisease(true);
      setSite('peritoneal');
      setSepsisSource('peritoneal');
      setIndicationConfirmed(true);
      setCheckedNhsnIds(['sbp_ascites_pmfn', 'sbp_fever_abdominal_pain']);
      setClifSofaScore(13);
      setCheckedGeneralRiskIds(['chronic_disease', 'hospital_90d']);
      setCheckedSpecificRisks(['esbl']);
    } else if (presetKey === 'cauti_elderly') {
      setPopulation('adult');
      setIsChronicLiverDisease(false);
      setSite('urinary');
      setSepsisSource(undefined);
      setIndicationConfirmed(true);
      setCheckedNhsnIds(['cauti_fever', 'cauti_pyuria', 'cauti_catheter_days']);
      setSofaScore(1);
      setCheckedGeneralRiskIds(['invasive_device', 'age_over_60']);
      setCheckedSpecificRisks(['esbl', 'pseudo_acineto']);
    } else if (presetKey === 'ssti_cellulitis') {
      setPopulation('adult');
      setIsChronicLiverDisease(false);
      setSite('skin_soft_tissue');
      setSepsisSource(undefined);
      setIndicationConfirmed(true);
      setCheckedNhsnIds(['ssti_erythema_warmth', 'ssti_purulent']);
      setSofaScore(0);
      setCheckedGeneralRiskIds([]);
      setCheckedSpecificRisks([]);
    } else if (presetKey === 'custom') {
      setCheckedGeneralRiskIds([]);
      setCheckedSpecificRisks([]);
      setSofaScore(0);
      setPsofaScore(0);
      setClifSofaScore(0);
    }
  };

  // Severity & Risk Classification
  const activeSeverity = {
    scoreType: population === 'pediatric' ? ('psofa' as const) : isChronicLiverDisease ? ('clif_sofa' as const) : ('sofa' as const),
    scoreValue: population === 'pediatric' ? psofaScore : isChronicLiverDisease ? clifSofaScore : sofaScore
  };

  const riskResult = classifyRiskGroup(
    checkedGeneralRiskIds,
    activeSeverity,
    population,
    checkedSpecificRisks
  );

  // Compile wizard state object for DecisionSummaryCard
  const wizardState: SelectionWizardState = {
    currentStep: (currentStage === 1 ? 1 : currentStage === 2 ? 4 : 5) as 1 | 2 | 3 | 4 | 5,
    indicationConfirmed,
    nhsnCheckedIds: checkedNhsnIds,
    population,
    site,
    sepsisSource,
    checkedGeneralRiskIds,
    sofaScore,
    psofaScore,
    clifSofaScore,
    isChronicLiverDisease,
    checkedSpecificRisks,
    clinicalResponse,
    cultureStatus,
    susceptibilityStatus,
    checkedStopCriteriaIds: [],
    checkedIvToPoCriteriaIds: [],
    daysOnAntibiotic
  };

  const stagesList = [
    {
      stage: 1,
      title: 'Đánh Giá Lâm Sàng & Phân Tầng Nhanh',
      desc: 'Chỉ định NHSN • Vị trí ổ nhiễm • Nguy cơ VKĐK (SOFA)',
      icon: <ClipboardCheck className="w-4 h-4" />
    },
    {
      stage: 2,
      title: 'Lựa Chọn Phác Đồ & Antibiogram',
      desc: 'Phác đồ BVBND 2026 • Độ nhạy KSĐ • Cầu nối tính liều',
      icon: <Pill className="w-4 h-4" />
    },
    {
      stage: 3,
      title: 'Tái Đánh Giá 48-72h & Xuống Thang',
      desc: 'Đáp ứng lâm sàng & KSĐ • Tiêu chuẩn ngưng • Đổi tiêm sang uống',
      icon: <Clock className="w-4 h-4" />
    }
  ];

  return (
    <div className="space-y-5">
      {/* Top Protocol Stepper & View Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-teal-100 text-teal-800">
              Quy Trình 3 Giai Đoạn Rút Gọn
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Chuẩn hóa theo Lưu đồ Bệnh viện Bệnh Nhiệt Đới 2026 &amp; QĐ 5631/BYT
            </span>
          </div>

          {/* View mode toggle */}
          <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200 text-xs self-start md:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('stepper')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                viewMode === 'stepper'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>Từng Giai Đoạn</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('all-in-one')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                viewMode === 'all-in-one'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Xem Toàn Diện (Một Trang)</span>
            </button>
          </div>
        </div>

        {/* 3-Stage Clickable Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {stagesList.map(st => {
            const isActive = currentStage === st.stage;
            const isCompleted = currentStage > st.stage;
            return (
              <button
                key={st.stage}
                type="button"
                onClick={() => {
                  setCurrentStage(st.stage as 1 | 2 | 3);
                  if (viewMode === 'all-in-one') {
                    const el = document.getElementById(`section-stage-${st.stage}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start space-x-3 ${
                  isActive
                    ? 'border-teal-500 bg-teal-50/70 ring-2 ring-teal-500/20 text-teal-950 shadow-xs'
                    : isCompleted
                    ? 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                    : 'border-slate-100 bg-slate-50/50 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCompleted ? '✓' : st.stage}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Giai đoạn {st.stage}
                    </span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate mt-0.5">
                    {st.title}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {st.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Content Area + Sticky Decision Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2 Cols): Active Stage Content or All-in-one */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* STAGE 1: ASSESSMENT & STRATIFICATION */}
          {(viewMode === 'all-in-one' || currentStage === 1) && (
            <div id="section-stage-1" className="space-y-4">
              {viewMode === 'all-in-one' && (
                <div className="flex items-center space-x-2 pt-2 pb-1 border-b border-slate-200">
                  <span className="w-6 h-6 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center justify-center">1</span>
                  <h2 className="text-base font-extrabold text-slate-900">
                    Giai Đoạn 1: Đánh Giá Lâm Sàng &amp; Phân Tầng Nguy Cơ VKĐK
                  </h2>
                </div>
              )}
              <StepAssessmentStratification
                indicationConfirmed={indicationConfirmed}
                onConfirmIndication={setIndicationConfirmed}
                checkedNhsnIds={checkedNhsnIds}
                onToggleNhsnId={handleToggleNhsnId}
                population={population}
                onSelectPopulation={setPopulation}
                site={site}
                onSelectSite={setSite}
                sepsisSource={sepsisSource}
                onSelectSepsisSource={setSepsisSource}
                checkedGeneralRiskIds={checkedGeneralRiskIds}
                onToggleGeneralRisk={handleToggleGeneralRisk}
                sofaScore={sofaScore}
                onSofaChange={setSofaScore}
                psofaScore={psofaScore}
                onPsofaChange={setPsofaScore}
                clifSofaScore={clifSofaScore}
                onClifSofaChange={setClifSofaScore}
                isChronicLiverDisease={isChronicLiverDisease}
                onToggleChronicLiver={setIsChronicLiverDisease}
                checkedSpecificRisks={checkedSpecificRisks}
                onToggleSpecificRisk={handleToggleSpecificRisk}
                riskResult={riskResult}
                onApplyPreset={handleApplyPreset}
                onNextStage={() => {
                  setCurrentStage(2);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
              />
            </div>
          )}

          {/* STAGE 2: EMPIRIC REGIMEN & ANTIBIOGRAM */}
          {(viewMode === 'all-in-one' || currentStage === 2) && (
            <div id="section-stage-2" className="space-y-4">
              {viewMode === 'all-in-one' && (
                <div className="flex items-center space-x-2 pt-4 pb-1 border-b border-slate-200">
                  <span className="w-6 h-6 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center justify-center">2</span>
                  <h2 className="text-base font-extrabold text-slate-900">
                    Giai Đoạn 2: Lựa Chọn Phác Đồ Kháng Sinh Khởi Đầu &amp; Antibiogram
                  </h2>
                </div>
              )}
              <StepEmpiric
                site={site}
                population={population}
                riskGroup={riskResult.group}
                sepsisSource={sepsisSource}
                specificRisks={checkedSpecificRisks}
                onSelectDrugForDosing={(drugId) => onSelectDrugForDosing(drugId)}
                onNextStep={() => {
                  setCurrentStage(3);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                onPrevStep={() => {
                  setCurrentStage(1);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
              />
            </div>
          )}

          {/* STAGE 3: 48-72h REASSESSMENT & STEWARDSHIP */}
          {(viewMode === 'all-in-one' || currentStage === 3) && (
            <div id="section-stage-3" className="space-y-4">
              {viewMode === 'all-in-one' && (
                <div className="flex items-center space-x-2 pt-4 pb-1 border-b border-slate-200">
                  <span className="w-6 h-6 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center justify-center">3</span>
                  <h2 className="text-base font-extrabold text-slate-900">
                    Giai Đoạn 3: Tái Đánh Giá 48-72h, Xuống Thang &amp; Quản Lý Kháng Sinh (AMS)
                  </h2>
                </div>
              )}
              <StepReassess
                site={site}
                onSelectDrugForDosing={(drugId) => onSelectDrugForDosing(drugId)}
                onPrevStep={() => {
                  setCurrentStage(2);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
              />
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Sticky Decision Summary Card */}
        <div className="lg:col-span-1">
          <DecisionSummaryCard
            state={wizardState}
            riskResult={riskResult}
            currentStage={currentStage}
            onNavigateStep={(s) => {
              setCurrentStage(s);
              window.scrollTo({ top: 120, behavior: 'smooth' });
            }}
            onSwitchToDosing={(drugId) => onSelectDrugForDosing(drugId)}
          />
        </div>
      </div>
    </div>
  );
};
