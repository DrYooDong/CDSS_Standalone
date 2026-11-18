import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Calculator,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Hospital,
  Info,
  RotateCcw,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { CalculatedRenalMetrics, PatientState } from '../../types';
import { InfectionSite, Population } from '../../selection/types';
import {
  AtsCapInputs,
  ClifSbpInputs,
  ClinicalScoreId,
  CnsMeningitisInputs,
  CpisInputs,
  Curb65Inputs,
  EronSstiInputs,
  LrinecInputs,
  PsiInputs,
  PsofaInputs,
  QsofaInputs,
  ScoreCalculationResult,
  ScoreRiskLevel,
  ScoreSuggestedAction,
  SofaFullInputs,
  Tg18BiliaryInputs,
  UtiEsblInputs
} from '../../selection/scoring/scoringTypes';
import {
  buildDefaultAtsCap,
  buildDefaultClifSbp,
  buildDefaultCnsMeningitis,
  buildDefaultCpis,
  buildDefaultCurb65,
  buildDefaultEronSsti,
  buildDefaultLrinec,
  buildDefaultPsi,
  buildDefaultPsofa,
  buildDefaultQsofa,
  buildDefaultSofaFull,
  buildDefaultTg18Biliary,
  buildDefaultUtiEsbl,
  calculateAtsCap,
  calculateClifSbp,
  calculateCnsMeningitis,
  calculateCpis,
  calculateCurb65,
  calculateEronSsti,
  calculateLrinec,
  calculatePsi,
  calculatePsofa,
  calculateQsofa,
  calculateSofaFull,
  calculateTg18Biliary,
  calculateUtiEsbl,
  getAvailableScoresForSite,
  inferSofaRenalFromScrMgdl
} from '../../selection/scoring/siteScoresEngine';

interface SiteScoreCalculatorsProps {
  site: InfectionSite;
  population: Population;
  patient: PatientState;
  renal: CalculatedRenalMetrics;
  isChronicLiverDisease: boolean;
  savedScores: Partial<Record<ClinicalScoreId, ScoreCalculationResult>>;
  onSaveScoreResult: (result: ScoreCalculationResult) => void;
  onClearScoreResult?: (scoreId: ClinicalScoreId) => void;
  onApplySuggestedAction: (action: ScoreSuggestedAction) => void;
}

const RISK_BADGE_STYLES: Record<ScoreRiskLevel, string> = {
  low: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  moderate: 'bg-amber-100 text-amber-800 border-amber-300',
  high: 'bg-orange-100 text-orange-900 border-orange-300',
  critical: 'bg-rose-100 text-rose-900 border-rose-300'
};

const RISK_PANEL_STYLES: Record<ScoreRiskLevel, string> = {
  low: 'bg-emerald-50/70 border-emerald-200 text-emerald-950',
  moderate: 'bg-amber-50/70 border-amber-200 text-amber-950',
  high: 'bg-orange-50/80 border-orange-300 text-orange-950',
  critical: 'bg-rose-50/90 border-rose-300 text-rose-950'
};

export const SiteScoreCalculators: React.FC<SiteScoreCalculatorsProps> = ({
  site,
  population,
  patient,
  renal,
  isChronicLiverDisease,
  savedScores,
  onSaveScoreResult,
  onApplySuggestedAction
}) => {
  const availableScores = useMemo(
    () => getAvailableScoresForSite(site, population),
    [site, population]
  );

  const [activeScoreId, setActiveScoreId] = useState<ClinicalScoreId | null>(null);
  const [appliedActionId, setAppliedActionId] = useState<string | null>(null);

  // Per-score interactive input states
  const [curbInputs, setCurbInputs] = useState<Curb65Inputs>(() => buildDefaultCurb65(patient));
  const [psiInputs, setPsiInputs] = useState<PsiInputs>(() =>
    buildDefaultPsi(patient, renal, isChronicLiverDisease)
  );
  const [atsInputs, setAtsInputs] = useState<AtsCapInputs>(() => buildDefaultAtsCap());
  const [cpisInputs, setCpisInputs] = useState<CpisInputs>(() => buildDefaultCpis());
  const [qsofaInputs, setQsofaInputs] = useState<QsofaInputs>(() => buildDefaultQsofa());
  const [sofaInputs, setSofaInputs] = useState<SofaFullInputs>(() => buildDefaultSofaFull(renal));
  const [psofaInputs, setPsofaInputs] = useState<PsofaInputs>(() => buildDefaultPsofa(renal));
  const [lrinecInputs, setLrinecInputs] = useState<LrinecInputs>(() => buildDefaultLrinec(renal));
  const [eronInputs, setEronInputs] = useState<EronSstiInputs>(() => buildDefaultEronSsti());
  const [utiEsblInputs, setUtiEsblInputs] = useState<UtiEsblInputs>(() =>
    buildDefaultUtiEsbl(patient)
  );
  const [clifInputs, setClifInputs] = useState<ClifSbpInputs>(() => buildDefaultClifSbp(renal));
  const [tg18Inputs, setTg18Inputs] = useState<Tg18BiliaryInputs>(() =>
    buildDefaultTg18Biliary(patient, renal)
  );
  const [cnsInputs, setCnsInputs] = useState<CnsMeningitisInputs>(() =>
    buildDefaultCnsMeningitis(patient)
  );

  // Keep patient-derived fields synced when PatientSidebar values change
  useEffect(() => {
    setCurbInputs(prev => ({ ...prev, ageOver65: patient.age >= 65 }));
    setPsiInputs(prev => ({
      ...prev,
      age: patient.age || 60,
      isFemale: patient.gender === 'f',
      liverDisease: isChronicLiverDisease || prev.liverDisease,
      renalDisease: renal.crcl < 60 || patient.dialysis !== 'none'
    }));
    const autoRenalTier = inferSofaRenalFromScrMgdl(renal.scrMgdl);
    setSofaInputs(prev => ({ ...prev, renal: autoRenalTier }));
    setPsofaInputs(prev => ({ ...prev, renal: autoRenalTier }));
    setLrinecInputs(prev => ({ ...prev, crOver141: renal.scrUmol > 141 }));
    setUtiEsblInputs(prev => ({
      ...prev,
      ageOver70: patient.age > 70,
      maleGender: patient.gender === 'm'
    }));
    setClifInputs(prev => ({
      ...prev,
      renalCrTier: autoRenalTier,
      sbpScrOver1Mgdl: renal.scrMgdl > 1.0
    }));
    setTg18Inputs(prev => ({
      ...prev,
      ageOver75: patient.age >= 75,
      renalCrOver176: renal.scrUmol > 176.8
    }));
    setCnsInputs(prev => ({ ...prev, ageOver50: patient.age >= 50 }));
  }, [patient.age, patient.gender, patient.dialysis, renal.crcl, renal.scrMgdl, renal.scrUmol, isChronicLiverDisease]);

  // Collapse or switch active score when site/population changes if current active isn't in new list
  useEffect(() => {
    if (activeScoreId && !availableScores.some(s => s.id === activeScoreId)) {
      setActiveScoreId(null);
    }
  }, [availableScores, activeScoreId]);

  // Compute live result for the currently opened score
  const activeResult: ScoreCalculationResult | null = useMemo(() => {
    if (!activeScoreId) return null;
    switch (activeScoreId) {
      case 'curb65':
        return calculateCurb65(curbInputs);
      case 'psi':
        return calculatePsi(psiInputs);
      case 'ats_cap':
        return calculateAtsCap(atsInputs);
      case 'cpis':
        return calculateCpis(cpisInputs);
      case 'qsofa':
        return calculateQsofa(qsofaInputs);
      case 'sofa_full':
        return calculateSofaFull(sofaInputs);
      case 'psofa_calc':
        return calculatePsofa(psofaInputs);
      case 'lrinec':
        return calculateLrinec(lrinecInputs);
      case 'eron_ssti':
        return calculateEronSsti(eronInputs);
      case 'uti_esbl':
        return calculateUtiEsbl(utiEsblInputs);
      case 'clif_sbp':
        return calculateClifSbp(clifInputs);
      case 'tg18_biliary':
        return calculateTg18Biliary(tg18Inputs);
      case 'cns_meningitis':
        return calculateCnsMeningitis(cnsInputs);
      default:
        return null;
    }
  }, [
    activeScoreId,
    curbInputs,
    psiInputs,
    atsInputs,
    cpisInputs,
    qsofaInputs,
    sofaInputs,
    psofaInputs,
    lrinecInputs,
    eronInputs,
    utiEsblInputs,
    clifInputs,
    tg18Inputs,
    cnsInputs
  ]);

  // Persist active result into savedScores whenever activeResult updates
  useEffect(() => {
    if (activeResult) {
      onSaveScoreResult(activeResult);
    }
  }, [activeResult, onSaveScoreResult]);

  const handleResetActiveScore = () => {
    if (!activeScoreId) return;
    switch (activeScoreId) {
      case 'curb65':
        setCurbInputs(buildDefaultCurb65(patient));
        break;
      case 'psi':
        setPsiInputs(buildDefaultPsi(patient, renal, isChronicLiverDisease));
        break;
      case 'ats_cap':
        setAtsInputs(buildDefaultAtsCap());
        break;
      case 'cpis':
        setCpisInputs(buildDefaultCpis());
        break;
      case 'qsofa':
        setQsofaInputs(buildDefaultQsofa());
        break;
      case 'sofa_full':
        setSofaInputs(buildDefaultSofaFull(renal));
        break;
      case 'psofa_calc':
        setPsofaInputs(buildDefaultPsofa(renal));
        break;
      case 'lrinec':
        setLrinecInputs(buildDefaultLrinec(renal));
        break;
      case 'eron_ssti':
        setEronInputs(buildDefaultEronSsti());
        break;
      case 'uti_esbl':
        setUtiEsblInputs(buildDefaultUtiEsbl(patient));
        break;
      case 'clif_sbp':
        setClifInputs(buildDefaultClifSbp(renal));
        break;
      case 'tg18_biliary':
        setTg18Inputs(buildDefaultTg18Biliary(patient, renal));
        break;
      case 'cns_meningitis':
        setCnsInputs(buildDefaultCnsMeningitis(patient));
        break;
    }
  };

  if (availableScores.length === 0) return null;

  const activeMeta = availableScores.find(s => s.id === activeScoreId);

  const handleTriggerApplyAction = (action: ScoreSuggestedAction, scoreId: ClinicalScoreId) => {
    onApplySuggestedAction(action);
    setAppliedActionId(scoreId);
    setTimeout(() => setAppliedActionId(null), 2200);
  };

  // Checkbox helper
  const renderCheckbox = (
    checked: boolean,
    onChange: (val: boolean) => void,
    label: string,
    pointsLabel?: string,
    autoNote?: string
  ) => (
    <label
      className={`flex items-start space-x-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
        checked
          ? 'bg-teal-50/70 border-teal-400 text-slate-900 font-semibold shadow-2xs'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 text-slate-700'
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 mt-0.5 cursor-pointer shrink-0"
      />
      <div className="flex-1 min-w-0 leading-snug">
        <div className="flex items-center justify-between gap-1.5 flex-wrap">
          <span>{label}</span>
          {pointsLabel && (
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-black shrink-0 ${
                checked ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {pointsLabel}
            </span>
          )}
        </div>
        {autoNote && (
          <div className="text-[10px] text-teal-700 font-medium mt-0.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 shrink-0" />
            <span>{autoNote}</span>
          </div>
        )}
      </div>
    </label>
  );

  // Tier selector helper (for SOFA / pSOFA / CLIF-SOFA / CPIS / LRINEC)
  const renderTierButtons = <T extends number>(
    label: string,
    value: T,
    options: Array<{ val: T; label: string; sub?: string }>,
    onChange: (val: T) => void,
    autoNote?: string
  ) => (
    <div className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
      <div className="flex items-center justify-between gap-1.5 flex-wrap">
        <span className="text-xs font-bold text-slate-800">{label}</span>
        {autoNote && (
          <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
            {autoNote}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1">
        {options.map(opt => {
          const isSelected = value === opt.val;
          return (
            <button
              key={opt.val}
              type="button"
              onClick={() => onChange(opt.val)}
              className={`px-2 py-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <div className="text-[11px] font-extrabold leading-tight">{opt.label}</div>
              {opt.sub && (
                <div className={`text-[9px] mt-0.5 leading-tight ${isSelected ? 'text-teal-100' : 'text-slate-500'}`}>
                  {opt.sub}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="pt-3 border-t border-slate-100 space-y-2.5">
      {/* Header & Score Selector Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Calculator className="w-4 h-4 text-teal-600 shrink-0" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Thang Điểm Chuyên Biệt Theo Vị Trí Nhiễm Trùng
          </span>
          <span className="text-[10px] text-slate-500 hidden md:inline">
            • Tự động lấy Tuổi ({patient.age}), Giới ({patient.gender === 'm' ? 'Nam' : 'Nữ'}), SCr ({renal.scrUmol} µmol/L)
          </span>
        </div>
      </div>

      {/* Pills Bar */}
      <div className="flex flex-wrap items-center gap-1.5">
        {availableScores.map(meta => {
          const isOpen = activeScoreId === meta.id;
          const saved = savedScores[meta.id];
          return (
            <button
              key={meta.id}
              type="button"
              onClick={() => setActiveScoreId(isOpen ? null : meta.id)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isOpen
                  ? 'bg-teal-700 text-white border-teal-700 shadow-xs ring-2 ring-teal-500/20'
                  : saved
                  ? 'bg-white border-teal-300 text-slate-900 hover:bg-teal-50/60 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
              }`}
              title={meta.subtitleVi}
            >
              <span>{meta.shortName}</span>
              {meta.badgeText && !saved && (
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                    isOpen ? 'bg-teal-600 text-teal-100' : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {meta.badgeText}
                </span>
              )}
              {saved && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black border ${
                    isOpen ? 'bg-white text-teal-900 border-white' : RISK_BADGE_STYLES[saved.riskLevel]
                  }`}
                >
                  {saved.displayScoreText}
                </span>
              )}
              {isOpen ? (
                <ChevronUp className="w-3.5 h-3.5 opacity-80" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Calculator Drawer */}
      {activeScoreId && activeMeta && activeResult && (
        <div className="rounded-2xl border border-teal-200 bg-slate-50/70 p-3.5 sm:p-4 space-y-3.5 shadow-2xs">
          {/* Calculator Title Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200/80">
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{activeMeta.titleVi}</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">{activeMeta.subtitleVi}</p>
            </div>
            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleResetActiveScore}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                title="Đặt lại về thông số mặc định của bệnh nhân"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Đặt lại</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveScoreId(null)}
                className="px-2.5 py-1 rounded-lg bg-slate-200/70 hover:bg-slate-300/70 text-slate-700 text-[11px] font-bold cursor-pointer"
              >
                Thu gọn
              </button>
            </div>
          </div>

          {/* ================= CALCULATOR INPUT BODIES ================= */}
          {activeScoreId === 'curb65' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {renderCheckbox(
                curbInputs.confusion,
                v => setCurbInputs(p => ({ ...p, confusion: v })),
                'C — Lú lẫn mới xuất hiện (AMT ≤ 8 hoặc mất định hướng)',
                '+1đ'
              )}
              {renderCheckbox(
                curbInputs.ureaOver7Mmol,
                v => setCurbInputs(p => ({ ...p, ureaOver7Mmol: v })),
                'U — Urê máu > 7 mmol/L (hoặc BUN > 19 mg/dL)',
                '+1đ'
              )}
              {renderCheckbox(
                curbInputs.rrOver30,
                v => setCurbInputs(p => ({ ...p, rrOver30: v })),
                'R — Nhịp thở ≥ 30 lần/phút',
                '+1đ'
              )}
              {renderCheckbox(
                curbInputs.bpLow,
                v => setCurbInputs(p => ({ ...p, bpLow: v })),
                'B — Huyết áp tụt (HATT < 90 hoặc HATTr ≤ 60 mmHg)',
                '+1đ'
              )}
              {renderCheckbox(
                curbInputs.ageOver65,
                v => setCurbInputs(p => ({ ...p, ageOver65: v })),
                '65 — Tuổi ≥ 65 tuổi',
                '+1đ',
                `Tự động từ hồ sơ BN: ${patient.age} tuổi`
              )}
            </div>
          )}

          {activeScoreId === 'psi' && (
            <div className="space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-2">
                  <div className="text-xs">
                    <div className="font-bold text-slate-800">Tuổi bệnh nhân (+1đ / năm)</div>
                    <div className="text-[10px] text-teal-700">Tự động từ hồ sơ BN ({patient.age} tuổi)</div>
                  </div>
                  <input
                    type="number"
                    min={18}
                    max={115}
                    value={psiInputs.age}
                    onChange={e => setPsiInputs(p => ({ ...p, age: Math.max(0, Number(e.target.value) || 0) }))}
                    className="w-16 px-2 py-1 text-center font-black text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                {renderCheckbox(
                  psiInputs.isFemale,
                  v => setPsiInputs(p => ({ ...p, isFemale: v })),
                  'Giới tính Nữ (-10 điểm)',
                  '-10đ',
                  `Hồ sơ BN: ${patient.gender === 'f' ? 'Nữ' : 'Nam'}`
                )}
              </div>

              <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider pt-1">
                Bệnh nền &amp; Yếu tố dịch tễ
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {renderCheckbox(
                  psiInputs.nursingHome,
                  v => setPsiInputs(p => ({ ...p, nursingHome: v })),
                  'Sống tại viện dưỡng lão / nhà chăm sóc',
                  '+10đ'
                )}
                {renderCheckbox(
                  psiInputs.neoplasticDisease,
                  v => setPsiInputs(p => ({ ...p, neoplasticDisease: v })),
                  'Bệnh lý ác tính / Ung thư đang tiến triển',
                  '+30đ'
                )}
                {renderCheckbox(
                  psiInputs.liverDisease,
                  v => setPsiInputs(p => ({ ...p, liverDisease: v })),
                  'Bệnh gan mạn / Xơ gan',
                  '+20đ',
                  isChronicLiverDisease ? 'Đã tích bệnh gan mạn ở trên' : undefined
                )}
                {renderCheckbox(
                  psiInputs.chf,
                  v => setPsiInputs(p => ({ ...p, chf: v })),
                  'Suy tim sung huyết (CHF)',
                  '+10đ'
                )}
                {renderCheckbox(
                  psiInputs.cerebrovascularDisease,
                  v => setPsiInputs(p => ({ ...p, cerebrovascularDisease: v })),
                  'Bệnh mạch máu não (Đột quỵ)',
                  '+10đ'
                )}
                {renderCheckbox(
                  psiInputs.renalDisease,
                  v => setPsiInputs(p => ({ ...p, renalDisease: v })),
                  'Bệnh thận mạn (CrCl < 60 hoặc lọc máu)',
                  '+10đ',
                  renal.crcl < 60 ? `CrCl hiện tại: ${renal.crcl} mL/p` : undefined
                )}
              </div>

              <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider pt-1">
                Sinh hiệu &amp; Cận lâm sàng
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {renderCheckbox(
                  psiInputs.alteredMentalStatus,
                  v => setPsiInputs(p => ({ ...p, alteredMentalStatus: v })),
                  'Rối loạn tri giác mới xuất hiện',
                  '+20đ'
                )}
                {renderCheckbox(
                  psiInputs.rrOver30,
                  v => setPsiInputs(p => ({ ...p, rrOver30: v })),
                  'Nhịp thở ≥ 30 lần/phút',
                  '+20đ'
                )}
                {renderCheckbox(
                  psiInputs.sbpUnder90,
                  v => setPsiInputs(p => ({ ...p, sbpUnder90: v })),
                  'Huyết áp tâm thu < 90 mmHg',
                  '+20đ'
                )}
                {renderCheckbox(
                  psiInputs.tempAbnormal,
                  v => setPsiInputs(p => ({ ...p, tempAbnormal: v })),
                  'Thân nhiệt < 35°C hoặc ≥ 40°C',
                  '+15đ'
                )}
                {renderCheckbox(
                  psiInputs.hrOver125,
                  v => setPsiInputs(p => ({ ...p, hrOver125: v })),
                  'Mạch ≥ 125 lần/phút',
                  '+10đ'
                )}
                {renderCheckbox(
                  psiInputs.phUnder735,
                  v => setPsiInputs(p => ({ ...p, phUnder735: v })),
                  'pH máu động mạch < 7.35',
                  '+30đ'
                )}
                {renderCheckbox(
                  psiInputs.bunOver30,
                  v => setPsiInputs(p => ({ ...p, bunOver30: v })),
                  'BUN ≥ 30 mg/dL (Urê ≥ 11 mmol/L)',
                  '+20đ'
                )}
                {renderCheckbox(
                  psiInputs.naUnder130,
                  v => setPsiInputs(p => ({ ...p, naUnder130: v })),
                  'Natri máu < 130 mmol/L',
                  '+20đ'
                )}
                {renderCheckbox(
                  psiInputs.glucoseOver250,
                  v => setPsiInputs(p => ({ ...p, glucoseOver250: v })),
                  'Glucose ≥ 250 mg/dL (≥ 13.9 mmol/L)',
                  '+10đ'
                )}
                {renderCheckbox(
                  psiInputs.hctUnder30,
                  v => setPsiInputs(p => ({ ...p, hctUnder30: v })),
                  'Hematocrit < 30%',
                  '+10đ'
                )}
                {renderCheckbox(
                  psiInputs.pao2Under60,
                  v => setPsiInputs(p => ({ ...p, pao2Under60: v })),
                  'PaO2 < 60 mmHg hoặc SpO2 < 90%',
                  '+10đ'
                )}
                {renderCheckbox(
                  psiInputs.pleuralEffusion,
                  v => setPsiInputs(p => ({ ...p, pleuralEffusion: v })),
                  'Tràn dịch màng phổi trên X-quang',
                  '+10đ'
                )}
              </div>
            </div>
          )}

          {activeScoreId === 'ats_cap' && (
            <div className="space-y-2.5">
              <div className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
                Tiêu chuẩn CHÍNH (Chỉ cần ≥ 1 tiêu chuẩn → CAP Nặng / ICU)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {renderCheckbox(
                  atsInputs.invasiveMechVent,
                  v => setAtsInputs(p => ({ ...p, invasiveMechVent: v })),
                  'Suy hô hấp cần thở máy xâm lấn',
                  'Chính'
                )}
                {renderCheckbox(
                  atsInputs.septicShockVasopressors,
                  v => setAtsInputs(p => ({ ...p, septicShockVasopressors: v })),
                  'Sốc nhiễm khuẩn cần dùng thuốc vận mạch',
                  'Chính'
                )}
              </div>

              <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider pt-1">
                Tiêu chuẩn PHỤ (Cần ≥ 3 tiêu chuẩn → CAP Nặng / ICU)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {renderCheckbox(atsInputs.rrOver30, v => setAtsInputs(p => ({ ...p, rrOver30: v })), 'Nhịp thở ≥ 30 lần/phút', 'Phụ')}
                {renderCheckbox(atsInputs.pao2Fio2Under250, v => setAtsInputs(p => ({ ...p, pao2Fio2Under250: v })), 'PaO2/FiO2 ≤ 250 mmHg', 'Phụ')}
                {renderCheckbox(atsInputs.multilobarInfiltrates, v => setAtsInputs(p => ({ ...p, multilobarInfiltrates: v })), 'Thâm nhiễm nhiều thùy phổi', 'Phụ')}
                {renderCheckbox(atsInputs.confusion, v => setAtsInputs(p => ({ ...p, confusion: v })), 'Lú lẫn / Mất định hướng', 'Phụ')}
                {renderCheckbox(atsInputs.bunOver20, v => setAtsInputs(p => ({ ...p, bunOver20: v })), 'BUN ≥ 20 mg/dL (Urê ≥ 7 mmol/L)', 'Phụ')}
                {renderCheckbox(atsInputs.wbcUnder4000, v => setAtsInputs(p => ({ ...p, wbcUnder4000: v })), 'Bạch cầu giảm < 4.000/mm³', 'Phụ')}
                {renderCheckbox(atsInputs.pltUnder100k, v => setAtsInputs(p => ({ ...p, pltUnder100k: v })), 'Tiểu cầu giảm < 100.000/mm³', 'Phụ')}
                {renderCheckbox(atsInputs.tempUnder36, v => setAtsInputs(p => ({ ...p, tempUnder36: v })), 'Hạ thân nhiệt < 36°C', 'Phụ')}
                {renderCheckbox(atsInputs.hypotensionFluid, v => setAtsInputs(p => ({ ...p, hypotensionFluid: v })), 'Tụt huyết áp cần bù dịch tích cực', 'Phụ')}
              </div>
            </div>
          )}

          {activeScoreId === 'cpis' && (
            <div className="space-y-2">
              {renderTierButtons(
                '1. Thân nhiệt (°C)',
                cpisInputs.tempScore,
                [
                  { val: 0, label: '36.5 - 38.4°C', sub: '+0đ' },
                  { val: 1, label: '38.5 - 38.9°C', sub: '+1đ' },
                  { val: 2, label: '≥ 39°C hoặc ≤ 36°C', sub: '+2đ' }
                ],
                v => setCpisInputs(p => ({ ...p, tempScore: v }))
              )}
              {renderTierButtons(
                '2. Bạch cầu máu (/mm³)',
                cpisInputs.wbcScore,
                [
                  { val: 0, label: '4.000 - 11.000', sub: '+0đ' },
                  { val: 1, label: '< 4.000 hoặc > 11.000', sub: '+1đ' },
                  { val: 2, label: 'Kèm Bands ≥ 50%', sub: '+2đ' }
                ],
                v => setCpisInputs(p => ({ ...p, wbcScore: v }))
              )}
              {renderTierButtons(
                '3. Dịch tiết khí quản / Đàm',
                cpisInputs.secretionsScore,
                [
                  { val: 0, label: 'Ít / Không có', sub: '+0đ' },
                  { val: 1, label: 'Đàm không mủ', sub: '+1đ' },
                  { val: 2, label: 'Đàm mủ đặc', sub: '+2đ' }
                ],
                v => setCpisInputs(p => ({ ...p, secretionsScore: v }))
              )}
              {renderTierButtons(
                '4. X-quang ngực (Thâm nhiễm mới)',
                cpisInputs.xrayScore,
                [
                  { val: 0, label: 'Không thâm nhiễm', sub: '+0đ' },
                  { val: 1, label: 'Lan tỏa / Đốm mờ', sub: '+1đ' },
                  { val: 2, label: 'Đông đặc khu trú', sub: '+2đ' }
                ],
                v => setCpisInputs(p => ({ ...p, xrayScore: v }))
              )}
              {renderTierButtons(
                '5. Cấy dịch hút khí quản / BAL',
                cpisInputs.culturePositive,
                [
                  { val: 0, label: 'Âm tính / Ít', sub: '+0đ' },
                  { val: 1, label: 'Mọc vừa - nhiều', sub: '+1đ' },
                  { val: 2, label: 'Mọc nhiều + Gram phù hợp', sub: '+2đ' }
                ],
                v => setCpisInputs(p => ({ ...p, culturePositive: v }))
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {renderCheckbox(
                  cpisInputs.oxygenationLow,
                  v => setCpisInputs(p => ({ ...p, oxygenationLow: v })),
                  'PaO2/FiO2 ≤ 240 và không do ARDS',
                  '+2đ'
                )}
                {renderCheckbox(
                  cpisInputs.progression,
                  v => setCpisInputs(p => ({ ...p, progression: v })),
                  'Tổn thương X-quang tiến triển (trừ phù phổi/ARDS)',
                  '+2đ'
                )}
              </div>
            </div>
          )}

          {activeScoreId === 'qsofa' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {renderCheckbox(
                qsofaInputs.alteredMental,
                v => setQsofaInputs(p => ({ ...p, alteredMental: v })),
                'Rối loạn tri giác (Glasgow < 15)',
                '+1đ'
              )}
              {renderCheckbox(
                qsofaInputs.rrOver22,
                v => setQsofaInputs(p => ({ ...p, rrOver22: v })),
                'Nhịp thở nhanh ≥ 22 lần/phút',
                '+1đ'
              )}
              {renderCheckbox(
                qsofaInputs.sbpUnder100,
                v => setQsofaInputs(p => ({ ...p, sbpUnder100: v })),
                'Huyết áp tâm thu ≤ 100 mmHg',
                '+1đ'
              )}
            </div>
          )}

          {(activeScoreId === 'sofa_full' || activeScoreId === 'psofa_calc') && (() => {
            const isPeds = activeScoreId === 'psofa_calc';
            const val = isPeds ? psofaInputs : sofaInputs;
            const setter = isPeds ? setPsofaInputs : setSofaInputs;
            return (
              <div className="space-y-2">
                {renderTierButtons(
                  '1. Hô hấp (PaO2/FiO2)',
                  val.resp,
                  [
                    { val: 0, label: '≥ 400 (0đ)' },
                    { val: 1, label: '< 400 (+1đ)' },
                    { val: 2, label: '< 300 (+2đ)' },
                    { val: 3, label: '< 200 thở máy (+3đ)' },
                    { val: 4, label: '< 100 thở máy (+4đ)' }
                  ],
                  v => setter(p => ({ ...p, resp: v }))
                )}
                {renderTierButtons(
                  '2. Đông máu (Tiểu cầu x10⁹/L)',
                  val.coag,
                  [
                    { val: 0, label: '≥ 150 (0đ)' },
                    { val: 1, label: '< 150 (+1đ)' },
                    { val: 2, label: '< 100 (+2đ)' },
                    { val: 3, label: '< 50 (+3đ)' },
                    { val: 4, label: '< 20 (+4đ)' }
                  ],
                  v => setter(p => ({ ...p, coag: v }))
                )}
                {renderTierButtons(
                  '3. Gan (Bilirubin toàn phần µmol/L)',
                  val.liver,
                  [
                    { val: 0, label: '< 20 (0đ)' },
                    { val: 1, label: '20-32 (+1đ)' },
                    { val: 2, label: '33-101 (+2đ)' },
                    { val: 3, label: '102-204 (+3đ)' },
                    { val: 4, label: '> 204 (+4đ)' }
                  ],
                  v => setter(p => ({ ...p, liver: v }))
                )}
                {renderTierButtons(
                  '4. Tim mạch (MAP / Vận mạch µg/kg/p)',
                  val.cardio,
                  [
                    { val: 0, label: 'MAP ≥ 70 (0đ)' },
                    { val: 1, label: 'MAP < 70 (+1đ)' },
                    { val: 2, label: 'Dopa ≤ 5 / Dobu (+2đ)' },
                    { val: 3, label: 'Norad ≤ 0.1 (+3đ)' },
                    { val: 4, label: 'Norad > 0.1 (+4đ)' }
                  ],
                  v => setter(p => ({ ...p, cardio: v }))
                )}
                {renderTierButtons(
                  '5. Thần kinh (Glasgow Coma Scale)',
                  val.cns,
                  [
                    { val: 0, label: 'GCS 15 (0đ)' },
                    { val: 1, label: 'GCS 13-14 (+1đ)' },
                    { val: 2, label: 'GCS 10-12 (+2đ)' },
                    { val: 3, label: 'GCS 6-9 (+3đ)' },
                    { val: 4, label: 'GCS < 6 (+4đ)' }
                  ],
                  v => setter(p => ({ ...p, cns: v }))
                )}
                {renderTierButtons(
                  '6. Thận (Creatinine huyết thanh)',
                  val.renal,
                  [
                    { val: 0, label: '< 106 µmol/L (0đ)' },
                    { val: 1, label: '106-170 (+1đ)' },
                    { val: 2, label: '171-300 (+2đ)' },
                    { val: 3, label: '301-440 (+3đ)' },
                    { val: 4, label: '> 440 / vô niệu (+4đ)' }
                  ],
                  v => setter(p => ({ ...p, renal: v })),
                  `Tự động từ SCr: ${renal.scrUmol} µmol/L (${renal.scrMgdl} mg/dL)`
                )}
              </div>
            );
          })()}

          {activeScoreId === 'lrinec' && (
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {renderCheckbox(
                  lrinecInputs.crpOver150,
                  v => setLrinecInputs(p => ({ ...p, crpOver150: v })),
                  'CRP ≥ 150 mg/L (15 mg/dL)',
                  '+4đ'
                )}
                {renderCheckbox(
                  lrinecInputs.naUnder135,
                  v => setLrinecInputs(p => ({ ...p, naUnder135: v })),
                  'Natri máu < 135 mmol/L',
                  '+2đ'
                )}
                {renderCheckbox(
                  lrinecInputs.crOver141,
                  v => setLrinecInputs(p => ({ ...p, crOver141: v })),
                  'Creatinine > 141 µmol/L (> 1.6 mg/dL)',
                  '+2đ',
                  `SCr hồ sơ BN: ${renal.scrUmol} µmol/L`
                )}
                {renderCheckbox(
                  lrinecInputs.glucoseOver10,
                  v => setLrinecInputs(p => ({ ...p, glucoseOver10: v })),
                  'Glucose máu > 10 mmol/L (> 180 mg/dL)',
                  '+1đ'
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {renderTierButtons(
                  'Bạch cầu máu (/mm³)',
                  lrinecInputs.wbcTier,
                  [
                    { val: 0, label: '< 15.000 (0đ)' },
                    { val: 1, label: '15.000 - 25.000 (+1đ)' },
                    { val: 2, label: '> 25.000 (+2đ)' }
                  ],
                  v => setLrinecInputs(p => ({ ...p, wbcTier: v }))
                )}
                {renderTierButtons(
                  'Hemoglobin (g/dL)',
                  lrinecInputs.hbTier,
                  [
                    { val: 0, label: '> 13.5 g/dL (0đ)' },
                    { val: 1, label: '11.0 - 13.5 (+1đ)' },
                    { val: 2, label: '< 11.0 g/dL (+2đ)' }
                  ],
                  v => setLrinecInputs(p => ({ ...p, hbTier: v }))
                )}
              </div>
            </div>
          )}

          {activeScoreId === 'eron_ssti' && (
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(
                  [
                    { key: 'none', title: 'Không có dấu hiệu nhiễm độc toàn thân', desc: 'Sinh hiệu bình thường, không bệnh nền mất bù (Class I)' },
                    { key: 'mild_comorbid', title: 'Độc tính nhẹ hoặc bệnh nền ổn định kém', desc: 'Sốt nhẹ, hoặc suy tĩnh mạch/bệnh mạch ngoại biên (Class II)' },
                    { key: 'moderate_sepsis', title: 'Nhiễm độc toàn thân vừa / Sepsis', desc: 'Sốt cao, nhịp tim nhanh, thở nhanh, lú lẫn (Class III)' },
                    { key: 'severe_sepsis_necrotizing', title: 'Sốc nhiễm khuẩn hoặc Viêm cân hoại tử', desc: 'Tụt huyết áp, bọng nước xuất huyết, lép bép dưới da (Class IV)' }
                  ] as const
                ).map(opt => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setEronInputs(p => ({ ...p, systemicToxicity: opt.key }))}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      eronInputs.systemicToxicity === opt.key
                        ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="text-xs font-bold">{opt.title}</div>
                    <div className={`text-[10px] mt-0.5 ${eronInputs.systemicToxicity === opt.key ? 'text-teal-100' : 'text-slate-500'}`}>
                      {opt.desc}
                    </div>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {renderCheckbox(
                  eronInputs.uncontrolledComorbidity,
                  v => setEronInputs(p => ({ ...p, uncontrolledComorbidity: v })),
                  'Bệnh nền cản trở hấp thu / lành vết thương (PAD, ĐTĐ mất bù, béo phì nặng)',
                  'Class ≥ II'
                )}
                {renderCheckbox(
                  eronInputs.rapidProgressionOrDeep,
                  v => setEronInputs(p => ({ ...p, rapidProgressionOrDeep: v })),
                  'Lan rộng nhanh từng giờ / Đau vượt mức thăm khám / Hoại tử sâu',
                  'Class IV'
                )}
              </div>
            </div>
          )}

          {activeScoreId === 'uti_esbl' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {renderCheckbox(
                utiEsblInputs.recentHospitalization,
                v => setUtiEsblInputs(p => ({ ...p, recentHospitalization: v })),
                'Nhập viện trong vòng 12 tháng qua',
                '+3đ'
              )}
              {renderCheckbox(
                utiEsblInputs.transferFromHealthcare,
                v => setUtiEsblInputs(p => ({ ...p, transferFromHealthcare: v })),
                'Chuyển từ cơ sở y tế khác / nhà dưỡng lão',
                '+3đ'
              )}
              {renderCheckbox(
                utiEsblInputs.recentAbx3m,
                v => setUtiEsblInputs(p => ({ ...p, recentAbx3m: v })),
                'Dùng Beta-lactam hoặc Fluoroquinolone trong 3 tháng qua',
                '+2đ'
              )}
              {renderCheckbox(
                utiEsblInputs.urinaryCatheter,
                v => setUtiEsblInputs(p => ({ ...p, urinaryCatheter: v })),
                'Đang đặt sonde tiểu lưu (hoặc mới rút)',
                '+2đ'
              )}
              {renderCheckbox(
                utiEsblInputs.ageOver70,
                v => setUtiEsblInputs(p => ({ ...p, ageOver70: v })),
                'Tuổi > 70 tuổi',
                '+2đ',
                `Hồ sơ BN: ${patient.age} tuổi`
              )}
              {renderCheckbox(
                utiEsblInputs.maleGender,
                v => setUtiEsblInputs(p => ({ ...p, maleGender: v })),
                'Giới tính Nam (UTI phức tạp)',
                '+1đ',
                `Hồ sơ BN: ${patient.gender === 'm' ? 'Nam' : 'Nữ'}`
              )}
              {renderCheckbox(
                utiEsblInputs.isPyelonephritisOrSepsis,
                v => setUtiEsblInputs(p => ({ ...p, isPyelonephritisOrSepsis: v })),
                'Bệnh cảnh Viêm đài bể thận / Sốt rét run / Urosepsis',
                'Lâm sàng'
              )}
            </div>
          )}

          {activeScoreId === 'clif_sbp' && (
            <div className="space-y-2">
              {renderTierButtons(
                '1. Gan (Bilirubin mg/dL)',
                clifInputs.liverBiliTier,
                [
                  { val: 0, label: '< 1.2 (0đ)' },
                  { val: 1, label: '1.2-1.9 (+1đ)' },
                  { val: 2, label: '2.0-5.9 (+2đ)' },
                  { val: 3, label: '6.0-11.9 (+3đ)' },
                  { val: 4, label: '≥ 12 (+4đ)' }
                ],
                v => setClifInputs(p => ({ ...p, liverBiliTier: v }))
              )}
              {renderTierButtons(
                '2. Thận (Creatinine)',
                clifInputs.renalCrTier,
                [
                  { val: 0, label: '< 1.2 mg/dL (0đ)' },
                  { val: 1, label: '1.2-1.9 (+1đ)' },
                  { val: 2, label: '2.0-3.4 (+2đ)' },
                  { val: 3, label: '3.5-4.9 (+3đ)' },
                  { val: 4, label: '≥ 5.0 / Lọc máu (+4đ)' }
                ],
                v => setClifInputs(p => ({ ...p, renalCrTier: v })),
                `SCr: ${renal.scrUmol} µmol/L (${renal.scrMgdl} mg/dL)`
              )}
              {renderTierButtons(
                '3. Não (Bệnh não gan - West Haven)',
                clifInputs.brainHeGrade,
                [
                  { val: 0, label: 'Không (0đ)' },
                  { val: 1, label: 'Độ I (+1đ)' },
                  { val: 2, label: 'Độ II (+2đ)' },
                  { val: 3, label: 'Độ III (+3đ)' },
                  { val: 4, label: 'Độ IV (+4đ)' }
                ],
                v => setClifInputs(p => ({ ...p, brainHeGrade: v }))
              )}
              {renderTierButtons(
                '4. Đông máu (INR)',
                clifInputs.coagInrTier,
                [
                  { val: 0, label: '< 1.1 (0đ)' },
                  { val: 1, label: '1.1-1.25 (+1đ)' },
                  { val: 2, label: '1.26-1.5 (+2đ)' },
                  { val: 3, label: '1.51-2.5 (+3đ)' },
                  { val: 4, label: '> 2.5 (+4đ)' }
                ],
                v => setClifInputs(p => ({ ...p, coagInrTier: v }))
              )}
              {renderTierButtons(
                '5. Tuần hoàn (MAP / Vận mạch)',
                clifInputs.circMapVasopressor,
                [
                  { val: 0, label: 'MAP ≥ 70 (0đ)' },
                  { val: 1, label: 'MAP < 70 (+1đ)' },
                  { val: 2, label: 'Dopa ≤ 5 (+2đ)' },
                  { val: 3, label: 'Norad ≤ 0.1 (+3đ)' },
                  { val: 4, label: 'Norad > 0.1 (+4đ)' }
                ],
                v => setClifInputs(p => ({ ...p, circMapVasopressor: v }))
              )}
              {renderTierButtons(
                '6. Hô hấp (PaO2/FiO2)',
                clifInputs.respPao2Fio2Tier,
                [
                  { val: 0, label: '> 400 (0đ)' },
                  { val: 1, label: '≤ 400 (+1đ)' },
                  { val: 2, label: '≤ 300 (+2đ)' },
                  { val: 3, label: '≤ 200 (+3đ)' },
                  { val: 4, label: '≤ 100 (+4đ)' }
                ],
                v => setClifInputs(p => ({ ...p, respPao2Fio2Tier: v }))
              )}
              {renderCheckbox(
                clifInputs.sbpScrOver1Mgdl,
                v => setClifInputs(p => ({ ...p, sbpScrOver1Mgdl: v })),
                'Tiêu chuẩn truyền Albumin SBP (SCr > 1.0 mg/dL [88.4 µmol/L] hoặc BUN > 30 hoặc Bili > 4 mg/dL)',
                'Albumin',
                `SCr hiện tại: ${renal.scrMgdl} mg/dL`
              )}
            </div>
          )}

          {activeScoreId === 'tg18_biliary' && (
            <div className="space-y-2.5">
              <div className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
                Tiêu chuẩn Độ III (Nặng — Suy ít nhất 1 cơ quan)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {renderCheckbox(tg18Inputs.cardioVasopressor, v => setTg18Inputs(p => ({ ...p, cardioVasopressor: v })), 'Tim mạch: Hạ HA cần vận mạch', 'Grade III')}
                {renderCheckbox(tg18Inputs.neuroAltered, v => setTg18Inputs(p => ({ ...p, neuroAltered: v })), 'Thần kinh: Rối loạn tri giác', 'Grade III')}
                {renderCheckbox(tg18Inputs.respPao2Fio2Under300, v => setTg18Inputs(p => ({ ...p, respPao2Fio2Under300: v })), 'Hô hấp: PaO2/FiO2 < 300', 'Grade III')}
                {renderCheckbox(
                  tg18Inputs.renalCrOver176,
                  v => setTg18Inputs(p => ({ ...p, renalCrOver176: v })),
                  'Thận: Creatinine > 2.0 mg/dL (176.8 µmol/L)',
                  'Grade III',
                  `SCr: ${renal.scrUmol} µmol/L`
                )}
                {renderCheckbox(tg18Inputs.hepaticInrOver15, v => setTg18Inputs(p => ({ ...p, hepaticInrOver15: v })), 'Gan: INR > 1.5', 'Grade III')}
                {renderCheckbox(tg18Inputs.hematoPltUnder100k, v => setTg18Inputs(p => ({ ...p, hematoPltUnder100k: v })), 'Huyết học: Tiểu cầu < 100.000/mm³', 'Grade III')}
              </div>

              <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider pt-1">
                Tiêu chuẩn Độ II (Trung bình — Có ≥ 2/5 tiêu chí)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {renderCheckbox(tg18Inputs.wbcAbnormal, v => setTg18Inputs(p => ({ ...p, wbcAbnormal: v })), 'Bạch cầu > 12.000 hoặc < 4.000/mm³', 'Grade II')}
                {renderCheckbox(tg18Inputs.highFever39, v => setTg18Inputs(p => ({ ...p, highFever39: v })), 'Sốt cao ≥ 39°C', 'Grade II')}
                {renderCheckbox(
                  tg18Inputs.ageOver75,
                  v => setTg18Inputs(p => ({ ...p, ageOver75: v })),
                  'Tuổi ≥ 75 tuổi',
                  'Grade II',
                  `Hồ sơ BN: ${patient.age} tuổi`
                )}
                {renderCheckbox(tg18Inputs.hyperbilirubinemia, v => setTg18Inputs(p => ({ ...p, hyperbilirubinemia: v })), 'Bilirubin TP ≥ 5 mg/dL (85.5 µmol/L)', 'Grade II')}
                {renderCheckbox(tg18Inputs.hypoalbuminemia, v => setTg18Inputs(p => ({ ...p, hypoalbuminemia: v })), 'Albumin máu giảm (< 0.7 giới hạn dưới)', 'Grade II')}
              </div>
            </div>
          )}

          {activeScoreId === 'cns_meningitis' && (
            <div className="space-y-2.5">
              <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Thang điểm Viêm màng não vi khuẩn (Bacterial Meningitis Score - BMS)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {renderCheckbox(cnsInputs.gramStainPositive, v => setCnsInputs(p => ({ ...p, gramStainPositive: v })), 'Nhuộm Gram dịch não tủy dương tính', '+2đ')}
                {renderCheckbox(cnsInputs.csfProteinOver80, v => setCnsInputs(p => ({ ...p, csfProteinOver80: v })), 'Protein dịch não tủy ≥ 80 mg/dL (0.8 g/L)', '+1đ')}
                {renderCheckbox(cnsInputs.peripheralAncOver10k, v => setCnsInputs(p => ({ ...p, peripheralAncOver10k: v })), 'Bạch cầu đa nhân máu ngoại vi ≥ 10.000/mm³', '+1đ')}
                {renderCheckbox(cnsInputs.csfAncOver1000, v => setCnsInputs(p => ({ ...p, csfAncOver1000: v })), 'Bạch cầu đa nhân dịch não tủy ≥ 1.000/mm³', '+1đ')}
                {renderCheckbox(cnsInputs.seizureAtPresentation, v => setCnsInputs(p => ({ ...p, seizureAtPresentation: v })), 'Có co giật trước hoặc lúc nhập viện', '+1đ')}
              </div>

              <div className="text-[11px] font-bold text-purple-800 uppercase tracking-wider pt-1">
                Yếu tố Mở rộng Phổ Kháng Sinh (Listeria &amp; Bệnh viện)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {renderCheckbox(
                  cnsInputs.ageOver50,
                  v => setCnsInputs(p => ({ ...p, ageOver50: v })),
                  'Tuổi ≥ 50 (Nguy cơ Listeria)',
                  'Ampicillin',
                  `Hồ sơ BN: ${patient.age} tuổi`
                )}
                {renderCheckbox(
                  cnsInputs.immunocompromisedOrPregnant,
                  v => setCnsInputs(p => ({ ...p, immunocompromisedOrPregnant: v })),
                  'Suy giảm miễn dịch / Thai kỳ / Nghiện rượu',
                  'Ampicillin'
                )}
                {renderCheckbox(
                  cnsInputs.neurosurgeryOrShunt,
                  v => setCnsInputs(p => ({ ...p, neurosurgeryOrShunt: v })),
                  'Sau phẫu thuật sọ não / Dẫn lưu não thất',
                  'Vanco + Mero'
                )}
              </div>
            </div>
          )}

          {/* ================= LIVE RESULT BANNER ================= */}
          <div className={`rounded-2xl border p-3.5 space-y-2.5 ${RISK_PANEL_STYLES[activeResult.riskLevel]}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base sm:text-lg font-black tracking-tight">
                  {activeResult.displayScoreText}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-black border ${RISK_BADGE_STYLES[activeResult.riskLevel]}`}>
                  {activeResult.riskClassVi}
                </span>
              </div>
              {activeResult.mortalityTextVi && (
                <span className="text-[11px] font-bold opacity-85">
                  {activeResult.mortalityTextVi}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/85 border border-black/5 space-y-1">
                <div className="font-extrabold text-[11px] uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Hospital className="w-3.5 h-3.5 text-teal-600" />
                  <span>Hướng Xử Trí &amp; Nơi Điều Trị</span>
                </div>
                <p className="text-slate-800 leading-snug font-medium">{activeResult.dispositionVi}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/85 border border-black/5 space-y-1">
                <div className="font-extrabold text-[11px] uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <ClipboardCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>Gợi Ý Kháng Sinh Liên Quan</span>
                </div>
                <p className="text-slate-800 leading-snug font-medium">{activeResult.antibioticImpactVi}</p>
              </div>
            </div>

            {activeResult.clinicalNotesVi && activeResult.clinicalNotesVi.length > 0 && (
              <div className="p-2.5 rounded-xl bg-white/90 border border-black/10 text-[11px] space-y-1 text-slate-800">
                {activeResult.clinicalNotesVi.map((note, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 leading-snug">
                    <Info className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
              <span className="text-[10px] font-semibold opacity-75">
                Tham chiếu: {activeResult.sourceText}
              </span>

              {activeResult.suggestedAction && (
                <button
                  type="button"
                  onClick={() => handleTriggerApplyAction(activeResult.suggestedAction!, activeResult.scoreId)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                    appliedActionId === activeResult.scoreId
                      ? 'bg-emerald-600 text-white'
                      : 'bg-teal-700 hover:bg-teal-800 text-white'
                  }`}
                >
                  {appliedActionId === activeResult.scoreId ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Đã đồng bộ vào CDSS!</span>
                    </>
                  ) : (
                    <>
                      <span>{activeResult.suggestedAction.actionLabelVi}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
