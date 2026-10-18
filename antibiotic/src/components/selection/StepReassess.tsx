import React, { useState } from 'react';
import {
  InfectionSite,
  ClinicalResponseStatus,
  CultureStatus,
  SusceptibilityStatus,
  MdrPathogenCategory
} from '../../selection/types';
import {
  evaluate48hReassessment,
  evaluateStopCriteria,
  getMdrPathway
} from '../../selection/engine';
import {
  STOP_ANTIBIOTIC_CHECKLIST,
  IV_TO_PO_CONTRAINDICATIONS,
  IV_TO_PO_DRUG_PAIRS
} from '../../selection/data/stopAndSwitch';
import { SourceBadge } from './SourceBadge';
import {
  Clock,
  Crosshair,
  Ban,
  ArrowRightLeft,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calculator,
  ShieldCheck,
  ShieldAlert,
  Info
} from 'lucide-react';

interface StepReassessProps {
  site: InfectionSite;
  onSelectDrugForDosing: (drugId: string) => void;
  onPrevStep: () => void;
}

export const StepReassess: React.FC<StepReassessProps> = ({
  site,
  onSelectDrugForDosing,
  onPrevStep
}) => {
  // Sub-tabs in Step 3
  const [subTab, setSubTab] = useState<'decision_tree' | 'mdr_pathways' | 'stop_criteria' | 'iv_to_po'>('decision_tree');

  // 1. 48-72h Decision Tree State
  const [clinicalStatus, setClinicalStatus] = useState<ClinicalResponseStatus>('improved');
  const [cultureStatus, setCultureStatus] = useState<CultureStatus>('pending');
  const [susceptibilityStatus, setSusceptibilityStatus] = useState<SusceptibilityStatus>('sensitive');

  // 2. MDR Pathways State
  const [selectedMdr, setSelectedMdr] = useState<MdrPathogenCategory>('cre');
  const [creEnzyme, setCreEnzyme] = useState<'kpc' | 'oxa48' | 'mbl'>('mbl');

  // 3. Stop Checklist State
  const [currentDays, setCurrentDays] = useState<number>(5);
  const [checkedClinical, setCheckedClinical] = useState<string[]>([
    'crit_afebrile',
    'crit_hemodynamic',
    'crit_oxygenation',
    'crit_local_signs',
    'crit_oral_intake'
  ]);
  const [checkedLab, setCheckedLab] = useState<string[]>(['crit_pct']);

  // Evaluations
  const reassessResult = evaluate48hReassessment(
    clinicalStatus,
    cultureStatus,
    susceptibilityStatus
  );

  const stopResult = evaluateStopCriteria(
    checkedClinical,
    checkedLab,
    currentDays,
    site
  );

  const mdrData = getMdrPathway(selectedMdr);

  const toggleClinicalCheck = (id: string) => {
    setCheckedClinical(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleLabCheck = (id: string) => {
    setCheckedLab(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-200">
                Giai Đoạn 3
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Tái Đánh Giá 48-72 Giờ &amp; Quản Lý Kháng Sinh (AMS)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Lưu đồ đánh giá lại sau 48-72h, điều trị trúng đích vi khuẩn đa kháng (CRE, DTR-PA, CRAB), bảng kiểm ngưng kháng sinh an toàn và chuyển đổi IV sang PO.
            </p>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex flex-wrap gap-2 pt-4">
          <button
            type="button"
            onClick={() => setSubTab('decision_tree')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer border ${
              subTab === 'decision_tree'
                ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>1. Lưu đồ 48-72h (BVBND)</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('mdr_pathways')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer border ${
              subTab === 'mdr_pathways'
                ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>2. Trúng Đích VKĐK (CRE / CRAB / DTR-PA)</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('stop_criteria')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer border ${
              subTab === 'stop_criteria'
                ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <Ban className="w-3.5 h-3.5" />
            <span>3. Bảng Kiểm Ngưng Kháng Sinh</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('iv_to_po')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer border ${
              subTab === 'iv_to_po'
                ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>4. Chuyển Tiêm sang Uống (IV to PO)</span>
          </button>
        </div>
      </div>

      {/* 1. DECISION TREE 48-72H */}
      {subTab === 'decision_tree' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl border border-slate-200/90 bg-white shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Nhập tình trạng người bệnh tại thời điểm 48 - 72 giờ:
              </h3>
              <SourceBadge source={{ doc: 'BVBND_LuuDo', page: 2 }} />
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Đáp ứng lâm sàng */}
              <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/70">
                <label className="block text-xs font-bold text-slate-800 mb-2.5">
                  1. Đáp ứng lâm sàng:
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'improved', label: 'Cải thiện (Hết sốt, sinh hiệu ổn)', color: 'text-emerald-700' },
                    { id: 'not_improved', label: 'Không cải thiện', color: 'text-amber-700' },
                    { id: 'worsened', label: 'Xấu đi (Sốc, suy tạng tăng)', color: 'text-rose-700' }
                  ].map(opt => (
                    <label key={opt.id} className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="radio"
                        name="clinicalStatus"
                        checked={clinicalStatus === opt.id}
                        onChange={() => setClinicalStatus(opt.id as ClinicalResponseStatus)}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span className={`font-semibold ${opt.color}`}>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Kết quả cấy vi sinh */}
              <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/70">
                <label className="block text-xs font-bold text-slate-800 mb-2.5">
                  2. Kết quả cấy vi sinh:
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'pending', label: 'Đang chờ kết quả' },
                    { id: 'negative', label: 'Âm tính (Không mọc vi khuẩn)' },
                    { id: 'positive', label: 'Dương tính (Phân lập được vi khuẩn)' }
                  ].map(opt => (
                    <label key={opt.id} className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="radio"
                        name="cultureStatus"
                        checked={cultureStatus === opt.id}
                        onChange={() => setCultureStatus(opt.id as CultureStatus)}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-slate-700 font-medium">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Độ nhạy cảm với KS đang dùng */}
              <div className={`p-3.5 rounded-xl border transition-all ${
                cultureStatus !== 'positive'
                  ? 'opacity-50 pointer-events-none border-slate-200 bg-slate-100'
                  : 'border-slate-200/80 bg-slate-50/70'
              }`}>
                <label className="block text-xs font-bold text-slate-800 mb-2.5">
                  3. Độ nhạy KS trên KSĐ:
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'sensitive', label: 'Nhạy cảm (S)' },
                    { id: 'resistant', label: 'Đề kháng (R)' },
                    { id: 'intermediate', label: 'Trung gian (I)' }
                  ].map(opt => (
                    <label key={opt.id} className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="radio"
                        name="susceptibilityStatus"
                        disabled={cultureStatus !== 'positive'}
                        checked={susceptibilityStatus === opt.id}
                        onChange={() => setSusceptibilityStatus(opt.id as SusceptibilityStatus)}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-slate-700 font-medium">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Evaluation Result Banner */}
            <div className={`p-4 rounded-xl border mt-4 ${
              reassessResult.actionType === 'de_escalate'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : reassessResult.actionType === 'switch_by_ast'
                ? 'bg-rose-50 border-rose-300 text-rose-950'
                : reassessResult.actionType === 'consult'
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-teal-50 border-teal-300 text-teal-950'
            }`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">
                  {reassessResult.actionType === 'de_escalate' ? '🟢' : reassessResult.actionType === 'switch_by_ast' ? '🔴' : reassessResult.actionType === 'consult' ? '🟡' : '🔵'}
                </span>
                <div className="space-y-1.5 flex-1">
                  <h4 className="font-extrabold text-sm sm:text-base">
                    {reassessResult.actionTitleVi}
                  </h4>
                  <ul className="list-disc list-inside text-xs space-y-1 text-slate-800">
                    {reassessResult.recommendationsVi.map((rec, rIdx) => (
                      <li key={rIdx} className="leading-relaxed font-medium">{rec}</li>
                    ))}
                  </ul>

                  {/* Badges for eligibility */}
                  <div className="pt-2 flex flex-wrap gap-2">
                    {reassessResult.stopChecklistEligible && (
                      <button
                        type="button"
                        onClick={() => setSubTab('stop_criteria')}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all cursor-pointer flex items-center space-x-1"
                      >
                        <span>Kiểm tra Bảng kiểm ngưng KS ngay</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {reassessResult.ivToPoEligible && (
                      <button
                        type="button"
                        onClick={() => setSubTab('iv_to_po')}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-all cursor-pointer flex items-center space-x-1"
                      >
                        <span>Xem xét Chuyển đổi IV sang PO</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MDR PATHWAYS */}
      {subTab === 'mdr_pathways' && (
        <div className="space-y-4">
          {/* Chọn vi khuẩn */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'cre', label: 'CRE (Enterobacterales kháng Carbapenem)' },
              { id: 'dtr_pseudo', label: 'DTR-Pseudomonas aeruginosa' },
              { id: 'crab', label: 'CRAB (A. baumannii kháng Carbapenem)' },
              { id: 's_maltophilia', label: 'Stenotrophomonas maltophilia' }
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedMdr(item.id as MdrPathogenCategory)}
                className={`p-3.5 rounded-xl text-left text-xs font-bold border transition-all cursor-pointer ${
                  selectedMdr === item.id
                    ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-500/20 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Chi tiết phác đồ trúng đích */}
          {mdrData && (
            <div className="p-5 rounded-2xl border border-slate-200/90 bg-white shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {mdrData.titleVi}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {mdrData.definitionVi}
                  </p>
                </div>
                <SourceBadge source={{ doc: 'BVBND_HDSDKS_2026', page: 15 }} />
              </div>

              {/* Nếu là CRE: phân loại Carbapenemase */}
              {selectedMdr === 'cre' && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="text-xs font-bold text-slate-800">
                    Phân loại theo kiểu men Carbapenemase (kết quả PCR / test mCIM / Carba NP):
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'mbl', label: 'Metallo-beta-lactamase (MBL: NDM, VIM, IMP)' },
                      { id: 'kpc', label: 'Serine Carbapenemase nhóm A (KPC)' },
                      { id: 'oxa48', label: 'OXA-48-like (Serine Carbapenemase nhóm D)' }
                    ].map(enz => (
                      <button
                        key={enz.id}
                        type="button"
                        onClick={() => setCreEnzyme(enz.id as 'kpc' | 'oxa48' | 'mbl')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          creEnzyme === enz.id
                            ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        {enz.label}
                      </button>
                    ))}
                  </div>

                  {creEnzyme === 'mbl' && (
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-950 font-medium">
                      <strong>⚠️ MBL (NDM):</strong> Men Metallo-beta-lactamase kháng lại CAZ-AVI đơn độc. Bắt buộc phối hợp <strong>Ceftazidime/Avibactam + Aztreonam</strong> truyền đồng thời qua <strong>Y-site</strong>.
                    </div>
                  )}
                </div>
              )}

              {/* Thuốc đầu tay */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Kháng sinh Đầu tay Khuyến cáo:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {mdrData.firstLineDrugs.map((drug, dIdx) => (
                    <div
                      key={dIdx}
                      className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/70 flex flex-col justify-between"
                    >
                      <div>
                        <div className="font-bold text-sm text-teal-900">
                          {drug.nameVi}
                        </div>
                        <div className="text-xs text-slate-700 mt-1">
                          <span className="font-semibold text-slate-900">Liều:</span> {drug.standardDoseVi}
                        </div>
                        {drug.infusionNoteVi && (
                          <div className="mt-1 text-[11px] text-amber-800 bg-amber-50 px-2 py-1 rounded-md border border-amber-200/60 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                            <span>{drug.infusionNoteVi}</span>
                          </div>
                        )}
                      </div>
                      {drug.hasDosingCalculator && drug.drugId && (
                        <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex justify-end">
                          <button
                            type="button"
                            onClick={() => onSelectDrugForDosing(drug.drugId!)}
                            className="px-3 py-1 text-xs font-bold rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Calculator className="w-3.5 h-3.5" />
                            <span>Tính liều →</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Phối hợp đặc biệt (nếu có) */}
              {mdrData.combinationRegimens && mdrData.combinationRegimens.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-700">
                    Phác đồ Phối hợp Bắt buộc:
                  </h4>
                  {mdrData.combinationRegimens.map((combo, cIdx) => (
                    <div
                      key={cIdx}
                      className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-100 space-y-2"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        {combo.map((item, iIdx) => (
                          <React.Fragment key={iIdx}>
                            <span className="font-bold text-xs text-teal-950 bg-white px-2.5 py-1 rounded-md border border-teal-200 shadow-2xs">
                              {item.nameVi}
                            </span>
                            {iIdx < combo.length - 1 && (
                              <span className="font-black text-xs text-teal-600">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      {combo.some(c => c.infusionNoteVi) && (
                        <p className="text-xs text-teal-900 font-medium">
                          {combo.find(c => c.infusionNoteVi)?.infusionNoteVi}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Cảnh báo đặc thù / Chống chỉ định */}
              {mdrData.contraindicatedOrIneffectiveVi && mdrData.contraindicatedOrIneffectiveVi.length > 0 && (
                <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200/80 space-y-1">
                  <h4 className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    <span>Phác đồ KHÔNG khuyến cáo / Không hiệu quả:</span>
                  </h4>
                  <ul className="list-disc list-inside text-xs text-rose-900 space-y-0.5 font-medium">
                    {mdrData.contraindicatedOrIneffectiveVi.map((warn, wIdx) => (
                      <li key={wIdx}>{warn}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 3. STOP CRITERIA CHECKLIST */}
      {subTab === 'stop_criteria' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl border border-slate-200/90 bg-white shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Bảng kiểm Đủ điều kiện Ngưng Kháng Sinh (Stopping Checklist)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dựa trên lưu đồ BV Bệnh Nhiệt Đới &amp; các thử nghiệm lâm sàng ngẫu nhiên có đối chứng (RCTs).
                </p>
              </div>
              <SourceBadge source={{ doc: 'BVBND_LuuDo', page: 3 }} />
            </div>

            {/* Input số ngày điều trị */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-900">
                  Số ngày bệnh nhân đã dùng kháng sinh hiện tại:
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Thời gian tối thiểu chuẩn cho ổ nhiễm này: <strong className="text-teal-700">{stopResult.minDays} ngày</strong> ({stopResult.trialName})
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="42"
                  value={currentDays}
                  onChange={e => setCurrentDays(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 px-3 py-1.5 text-center text-sm font-bold rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                />
                <span className="text-xs font-semibold text-slate-700">ngày</span>
              </div>
            </div>

            {/* 5 Tiêu chuẩn Lâm sàng (Bắt buộc) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Tiêu chuẩn Lâm sàng (Bắt buộc đạt cả 5/5):
                </h4>
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                  stopResult.clinicalCriteriaMet
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : 'bg-amber-100 text-amber-800 border-amber-200'
                }`}>
                  Đạt {stopResult.clinicalCriteriaCount} / 5 tiêu chí
                </span>
              </div>

              <div className="space-y-2">
                {STOP_ANTIBIOTIC_CHECKLIST.clinicalCriteria.map(item => (
                  <label
                    key={item.id}
                    className="flex items-start gap-3 p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 cursor-pointer hover:bg-slate-100/70 transition-all text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={checkedClinical.includes(item.id)}
                      onChange={() => toggleClinicalCheck(item.id)}
                      className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-slate-800 leading-relaxed font-medium">
                      {item.textVi}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tiêu chuẩn Cận lâm sàng */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Tiêu chuẩn Cận Lâm sàng (Cần đạt ít nhất 1 chỉ số):
                </h4>
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                  stopResult.labCriteriaMet
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  Đạt {stopResult.labCriteriaCount} chỉ số
                </span>
              </div>

              <div className="space-y-2">
                {STOP_ANTIBIOTIC_CHECKLIST.labCriteria.map(item => (
                  <label
                    key={item.id}
                    className="flex items-start gap-3 p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 cursor-pointer hover:bg-slate-100/70 transition-all text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={checkedLab.includes(item.id)}
                      onChange={() => toggleLabCheck(item.id)}
                      className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-slate-800 leading-relaxed font-medium">
                      {item.textVi}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Kết luận ngưng KS */}
            <div className={`p-4 rounded-xl border text-sm ${
              stopResult.canStop
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{stopResult.canStop ? '🎉' : '⏳'}</span>
                <div>
                  <strong className="font-extrabold text-sm sm:text-base">
                    {stopResult.canStop
                      ? 'ĐỦ ĐIỀU KIỆN XEM XÉT NGƯNG KHÁNG SINH AN TOÀN'
                      : 'CHƯA ĐỦ ĐIỀU KIỆN ĐỂ NGƯNG KHÁNG SINH'}
                  </strong>
                  <p className="text-xs mt-1 leading-relaxed text-slate-700">
                    {stopResult.canStop
                      ? `Bệnh nhân đã đạt đủ số ngày tối thiểu (${currentDays}/${stopResult.minDays} ngày), thỏa mãn 5/5 tiêu chuẩn ổn định lâm sàng và ít nhất 1 chỉ số chỉ điểm cận lâm sàng thuận lợi. Khuyến cáo ngưng kháng sinh để giảm thiểu độc tính và nguy cơ chọn lọc chủng đề kháng. Ghi nhận quyết định vào hồ sơ bệnh án.`
                      : `Hiện tại chưa đạt đủ các tiêu chí ngưng thuốc. Lý do: ${
                          !stopResult.minDurationMet
                            ? `Chưa đủ ngày tối thiểu (${currentDays}/${stopResult.minDays} ngày); `
                            : ''
                        }${
                          !stopResult.clinicalCriteriaMet
                            ? `Chưa đạt đủ 5/5 tiêu chuẩn lâm sàng (${stopResult.clinicalCriteriaCount}/5); `
                            : ''
                        }${
                          !stopResult.labCriteriaMet
                            ? 'Chưa có chỉ số cận lâm sàng thuận lợi.'
                            : ''
                        }`}
                  </p>
                </div>
              </div>
            </div>

            {/* Hướng Dẫn Theo Dõi Sau Khi Ngưng Kháng Sinh (Chuẩn BVBND) */}
            <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200/80 space-y-2 text-xs">
              <h4 className="font-bold text-teal-950 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-teal-700" />
                <span>Quy trình Theo dõi Sau khi Ngưng Kháng sinh &amp; Xuống thang (BV Bệnh Nhiệt Đới):</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-800">
                <div className="bg-white p-3 rounded-lg border border-teal-100 space-y-1">
                  <strong className="text-teal-900 block font-bold">1. Theo dõi trong 24 – 48 giờ đầu:</strong>
                  <p className="text-slate-600">
                    Theo dõi sát nhiệt độ sốt, sinh hiệu, mức độ tri giác. Lặp lại xét nghiệm Procalcitonin (PCT) nếu lâm sàng có dấu hiệu nghi ngờ tái bùng phát.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-teal-100 space-y-1">
                  <strong className="text-rose-900 block font-bold">2. Xử trí khi tái phát triệu chứng:</strong>
                  <p className="text-slate-600">
                    Cấy máu / cấy bệnh phẩm lại ngay lập tức. Khởi động lại kháng sinh theo bằng chứng vi sinh và kích hoạt hội chẩn Dược lâm sàng / Hồi sức.
                  </p>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-medium mt-2">
                <strong>Quy tắc xuống thang (*):</strong> Có thể <em>KHÔNG</em> xuống thang khi thời gian sử dụng kháng sinh còn lại ≤ 2 ngày. Nếu đổi sang kháng sinh khác, bắt buộc phải duy trì thời gian điều trị ít nhất <strong>3 – 5 ngày</strong>.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. IV TO PO SWITCH */}
      {subTab === 'iv_to_po' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl border border-slate-200/90 bg-white shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Quy trình Chuyển đổi Kháng sinh từ Tiêm sang Uống (IV to PO Switch)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Theo Quyết định số 5631/QĐ-BYT năm 2020 của Bộ Y tế.
                </p>
              </div>
              <SourceBadge source={{ doc: 'BYT_5631_2020', page: 85 }} />
            </div>

            {/* Chống chỉ định chuyển sang uống */}
            <div className="p-4 rounded-xl bg-rose-50/80 border border-rose-200 space-y-2">
              <h4 className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                <Ban className="w-4 h-4 text-rose-600" />
                <span>Chống chỉ định chuyển đổi đường uống (Bắt buộc dùng toàn bộ liệu trình qua đường tiêm tĩnh mạch):</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-rose-900 font-medium">
                {IV_TO_PO_CONTRAINDICATIONS.map((c, cIdx) => (
                  <div key={cIdx} className="flex items-center gap-1.5">
                    <span>•</span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bảng các thuốc chuyển đổi */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Danh mục Kháng sinh Chuyển đổi Thường dùng (Nhóm 1 - Sinh khả dụng cao &gt; 90%):
              </h4>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                      <th className="py-2.5 px-3">Thuốc tiêm (IV)</th>
                      <th className="py-2.5 px-3">Chuyển sang thuốc uống (PO)</th>
                      <th className="py-2.5 px-3">Liều uống khuyến cáo</th>
                      <th className="py-2.5 px-3">Sinh khả dụng (F)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {IV_TO_PO_DRUG_PAIRS.filter(p => p.group === 1).map((pair, pIdx) => (
                      <tr key={pIdx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 font-extrabold text-slate-900">
                          {pair.ivName}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-teal-700">
                          {pair.poName}
                        </td>
                        <td className="py-2.5 px-3 font-medium">
                          {pair.poDoseVi}
                        </td>
                        <td className="py-2.5 px-3 text-emerald-700 font-bold">
                          {pair.bioavailabilityVi}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevStep}
          className="px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Giai đoạn 2 (Phác đồ khởi đầu &amp; Vi sinh)</span>
        </button>
      </div>
    </div>
  );
};
