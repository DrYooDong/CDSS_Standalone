/**
 * HepaCDSS DILI & Protocols Tab Component (Consolidated & Streamlined)
 * Tích hợp Phác đồ Xử trí Thuốc Lao (ATS & Bộ Y Tế), Thang điểm RUCAM 2016, và 6 Cây Quyết Định Lâm Sàng ACG 2024.
 */

import React, { useState } from 'react';
import {
  HepaAnalysisResult,
  HepaInputData,
  RucamAssessmentInput,
  DecisionNode,
} from '../types';
import { COMMON_DILI_DRUGS, DiliEngine } from '../engine/dili';
import { DECISION_TREES } from '../data/decisionTrees';
import {
  ShieldAlert,
  Pill,
  CheckCircle2,
  GitBranch,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

interface DiliProtocolsTabProps {
  result: HepaAnalysisResult;
  input: HepaInputData;
}

export const DiliProtocolsTab: React.FC<DiliProtocolsTabProps> = ({ result, input }) => {
  const [subTab, setSubTab] = useState<'tb' | 'rucam' | 'trees' | 'safety'>('tb');

  // Trạng thái cho Thang điểm RUCAM
  const [rucamInput, setRucamInput] = useState<RucamAssessmentInput>({
    drugName: 'Amoxicillin-Clavulanate (Augmentin)',
    injuryType: result.rRatio > 5 ? 'hepatocellular' : 'cholestatic_or_mixed',
    timeToOnsetDays: 21,
    hasPriorExposure: false,
    courseAfterStoppingPercentDrop: 60,
    patientAge: input.age,
    hasAlcoholOrPregnancyRisk: (input.alcoholGramsPerWeek || 0) > 140 || !!input.isPregnancyThirdTrimester,
    concomitantDrugsCount: 0,
    otherCausesExcludedLevel: 'complete',
    previousLiverToxClass: 'A',
    rechallengeResult: 'not_done',
  });

  const rucamResult = DiliEngine.evaluateRucam(rucamInput);

  // Đánh giá quyết định thuốc lao dựa trên xét nghiệm hiện tại
  const tbDecision = DiliEngine.evaluateAntiTbDili({
    alt: input.alt,
    ast: input.ast,
    altUln: input.altUln || 33,
    astUln: input.astUln || 33,
    totalBiliMgDl: result.normalizedValues.totalBilirubinMgDl,
    hasSymptoms: false,
    isRechallengePhase: false,
    isSevereTbCase: true,
  });

  // Đánh giá nguy cơ tái hoạt HBV
  const [hbsAgStatus, setHbsAgStatus] = useState<boolean>(true);
  const [antiHbcStatus, setAntiHbcStatus] = useState<boolean>(true);
  const [chemoCategory, setChemoCategory] = useState<
    | 'anti_cd20_rituximab'
    | 'high_dose_corticoid'
    | 'anthracycline_chemo'
    | 'anti_tnf_biologic'
  >('anti_cd20_rituximab');

  const hbvReactivation = DiliEngine.evaluateHbvReactivation({
    isHbsAgPositive: hbsAgStatus,
    isAntiHbcPositive: antiHbcStatus,
    drugCategory: chemoCategory,
  });

  // State cho Cây quyết định lâm sàng
  const [selectedTreeId, setSelectedTreeId] = useState<string>('tree-transaminases');
  const currentTree = DECISION_TREES.find(t => t.id === selectedTreeId) || DECISION_TREES[0];
  const [selectedNodeId, setSelectedNodeId] = useState<string>(currentTree.rootId);

  const handleSelectTree = (treeId: string) => {
    setSelectedTreeId(treeId);
    const tree = DECISION_TREES.find(t => t.id === treeId) || DECISION_TREES[0];
    setSelectedNodeId(tree.rootId);
  };

  const handleSelectNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  const handleResetToRoot = () => {
    setSelectedNodeId(currentTree.rootId);
  };

  const currentNode: DecisionNode =
    currentTree.nodes[selectedNodeId] || currentTree.nodes[currentTree.rootId];

  return (
    <div className="space-y-4">
      {/* THANH ĐIỀU HƯỚNG PHỤ */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setSubTab('tb')}
            className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 ${
              subTab === 'tb' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Phác Đồ Thuốc Lao</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('rucam')}
            className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 ${
              subTab === 'rucam' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Thang Điểm RUCAM</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('trees')}
            className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 ${
              subTab === 'trees' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Lưu Đồ ACG (6 Cây)</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('safety')}
            className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 ${
              subTab === 'safety' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Statin &amp; HBV</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
          ATS / CDC / Bộ Y Tế &amp; ACG 2024
        </span>
      </div>

      {/* 1. PHÁC ĐỒ THUỐC LAO */}
      {subTab === 'tb' && (
        <div className="space-y-3">
          {/* Banner quyết định tức thời */}
          <div
            className={`p-3.5 rounded-xl border-l-4 shadow-xs ${
              tbDecision.action === 'stop_all_immediately'
                ? 'bg-rose-50 border-rose-600 text-rose-950'
                : tbDecision.action === 'rechallenge_ready'
                ? 'bg-emerald-50 border-emerald-600 text-emerald-950'
                : 'bg-amber-50 border-amber-600 text-amber-950'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <Pill className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-black px-2 py-0.2 rounded uppercase ${
                      tbDecision.action === 'stop_all_immediately'
                        ? 'bg-rose-600 text-white'
                        : tbDecision.action === 'rechallenge_ready'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {tbDecision.action === 'stop_all_immediately'
                      ? 'CHỈ ĐỊNH DỪNG THUỐC'
                      : tbDecision.action === 'rechallenge_ready'
                      ? 'SẴN SÀNG THỬ LẠI'
                      : 'THEO DÕI SÁT'}
                  </span>
                  <h4 className="font-bold text-slate-900">{tbDecision.title}</h4>
                </div>
                <p className="font-medium text-slate-800">{tbDecision.severityReason}</p>
                {tbDecision.temporaryBridgeRegimen && (
                  <div className="font-bold pt-0.5 text-rose-900 leading-tight">
                    <span className="underline">Phác đồ bắc cầu:</span> {tbDecision.temporaryBridgeRegimen}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Phác đồ thay thế tạm thời & Quy trình tái sử dụng */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Phác đồ bắc cầu */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
              <span className="font-bold text-slate-900 uppercase tracking-wide block">
                Phác Đồ Cầu Nối Ít Độc Gan (Bridging Regimen)
              </span>
              <p className="text-slate-600 leading-tight">
                Áp dụng khi lao nặng/tiến triển mà phải dừng INH, RIF, PZA:
              </p>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-mono text-slate-800 space-y-1">
                <div className="font-bold text-teal-800">• Levofloxacin (hoặc Moxifloxacin)</div>
                <div className="font-bold text-teal-800">• Ethambutol (E)</div>
                <div className="font-bold text-teal-800">• Amikacin (hoặc Streptomycin tiêm)</div>
              </div>
              <span className="text-[11px] text-slate-500 block italic">
                Duy trì đến khi men gan hạ về &lt; 2 lần ULN trước khi thử lại thuốc.
              </span>
            </div>

            {/* Quy trình tái sử dụng */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
              <span className="font-bold text-slate-900 uppercase tracking-wide block">
                Quy Trình Tái Sử Dụng Tuần Tự (Rechallenge)
              </span>
              <div className="space-y-1.5 text-slate-700">
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <strong className="text-slate-900">Bước 1: Rifampicin (R)</strong>
                  <p className="text-[11px] text-slate-600">Ít gây hoại tử tế bào gan nhất. Khởi đầu liều chuẩn, thử men gan sau 3-7 ngày.</p>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <strong className="text-slate-900">Bước 2: Isoniazid (H)</strong>
                  <p className="text-[11px] text-slate-600">Thêm INH nếu R dung nạp tốt sau 1 tuần. Kiểm tra lại men gan sau 3-7 ngày.</p>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <strong className="text-slate-900">Bước 3: Pyrazinamide (Z)</strong>
                  <p className="text-[11px] text-slate-600">Độc gan cao nhất. Tránh tái sử dụng nếu đã viêm gan nặng hoặc chỉ dùng khi bắt buộc.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. THANG ĐIỂM RUCAM 2016 */}
      {subTab === 'rucam' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Thang Điểm RUCAM 2016 — Đánh Giá Quan Hệ Nhân Quả DILI
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Điểm: {rucamResult.totalScore}</span>
              <span
                className={`text-xs font-black px-2 py-0.5 rounded text-white ${
                  rucamResult.totalScore > 8
                    ? 'bg-rose-600'
                    : rucamResult.totalScore >= 6
                    ? 'bg-amber-600'
                    : rucamResult.totalScore >= 3
                    ? 'bg-teal-600'
                    : 'bg-slate-500'
                }`}
              >
                {(rucamResult.category || 'unlikely').replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          {/* Form cấu hình nhanh RUCAM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Thuốc nghi ngờ:</label>
              <select
                value={rucamInput.drugName}
                onChange={e => setRucamInput({ ...rucamInput, drugName: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:ring-1 focus:ring-teal-500"
              >
                {COMMON_DILI_DRUGS.map((d, i) => (
                  <option key={i} value={d.name}>
                    {d.name} ({d.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Thời gian từ lúc dùng thuốc tới khi tăng men (ngày):</label>
              <input
                type="number"
                value={rucamInput.timeToOnsetDays}
                onChange={e => setRucamInput({ ...rucamInput, timeToOnsetDays: Number(e.target.value) || 0 })}
                className="w-full p-1.5 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Mức độ giảm men sau khi ngừng thuốc (%):</label>
              <select
                value={rucamInput.courseAfterStoppingPercentDrop}
                onChange={e => setRucamInput({ ...rucamInput, courseAfterStoppingPercentDrop: Number(e.target.value) })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:ring-1 focus:ring-teal-500"
              >
                <option value={60}>Giảm &gt; 50% trong 8 ngày (Tế bào gan) (+3 điểm)</option>
                <option value={40}>Giảm 50% trong 30 ngày (+2 điểm)</option>
                <option value={10}>Không giảm hoặc men tiếp tục tăng (-2 điểm)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Loại trừ các nguyên nhân không do thuốc (Bilan A, B, C, CMV, EBV...):</label>
              <select
                value={rucamInput.otherCausesExcludedLevel}
                onChange={e => setRucamInput({ ...rucamInput, otherCausesExcludedLevel: e.target.value as any })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:ring-1 focus:ring-teal-500"
              >
                <option value="complete">Đã loại trừ đầy đủ (Nhóm 1 + Nhóm 2) (+2 điểm)</option>
                <option value="partial">Loại trừ một phần (+1 điểm)</option>
                <option value="none">Chưa khảo sát (0 điểm)</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
            <span className="font-bold text-slate-900 block">Kết luận nhân quả RUCAM:</span>
            <p className="leading-tight font-semibold text-slate-800">{rucamResult.categoryLabelVi}</p>
            <p className="text-[11px] text-teal-800 font-medium">{rucamResult.recommendation}</p>
          </div>
        </div>
      )}

      {/* 3. LƯU ĐỒ XỬ TRÍ ACG (6 CÂY QUYẾT ĐỊNH) */}
      {subTab === 'trees' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
          {/* Chọn cây */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-teal-600" />
              <select
                value={selectedTreeId}
                onChange={e => handleSelectTree(e.target.value)}
                className="font-bold text-xs p-1.5 border border-slate-300 rounded-lg bg-slate-50 focus:ring-1 focus:ring-teal-500"
              >
                {DECISION_TREES.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleResetToRoot}
              className="text-xs px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Về gốc</span>
            </button>
          </div>

          {/* Chi tiết node hiện tại */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">{currentNode.label}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800 uppercase">
                {currentNode.category}
              </span>
            </div>
            <p className="text-slate-700 leading-tight">{currentNode.description}</p>

            {currentNode.immediateOrders && currentNode.immediateOrders.length > 0 && (
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                <span className="font-bold text-teal-800 uppercase text-[10px] tracking-wide block">
                  Chỉ định xét nghiệm &amp; can thiệp ngay:
                </span>
                {currentNode.immediateOrders.map((ord, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-slate-700">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>{ord}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Các nhánh rẽ kế tiếp */}
            {currentNode.childrenIds && currentNode.childrenIds.length > 0 && (
              <div className="pt-2 border-t border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-800 text-[11px] block">Chọn nhánh diễn tiến tiếp theo:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {currentNode.childrenIds.map(childId => {
                    const childNode = currentTree.nodes[childId];
                    if (!childNode) return null;
                    return (
                      <button
                        key={childId}
                        type="button"
                        onClick={() => handleSelectNode(childId)}
                        className="p-2 text-left bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-lg transition flex items-center justify-between group"
                      >
                        <span className="font-semibold text-slate-800 group-hover:text-teal-900">{childNode.label}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. AN TOÀN STATIN & NGUY CƠ TÁI HOẠT HBV */}
      {subTab === 'safety' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* An toàn Statin */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
            <span className="font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <span>💊</span>
              <span>An Toàn Dùng Statin Khi Men Gan Tăng (BSG 2018 &amp; BMJ)</span>
            </span>
            <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-950 space-y-1">
              <span className="font-bold block">ALT/AST &lt; 3x ULN:</span>
              <p className="leading-tight">
                Hoàn toàn an toàn để khởi đầu hoặc tiếp tục điều trị Statin. Không tự ý ngưng thuốc làm tăng biến cố tim mạch.
              </p>
            </div>
            <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-950 space-y-1">
              <span className="font-bold block">ALT/AST 3 - 5x ULN:</span>
              <p className="leading-tight">
                Kiểm tra lại sau 2 tuần. Nếu vẫn cao, giảm liều Statin hoặc tạm ngưng và khảo sát nguyên nhân khác.
              </p>
            </div>
          </div>

          {/* Nguy cơ tái hoạt HBV */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
            <span className="font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <span>🧬</span>
              <span>Đánh Giá Nguy Cơ Tái Hoạt HBV (EASL/AASLD)</span>
            </span>

            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 font-semibold">
                  <input
                    type="checkbox"
                    checked={hbsAgStatus}
                    onChange={e => setHbsAgStatus(e.target.checked)}
                    className="rounded text-teal-600"
                  />
                  <span>HBsAg Dương Tính</span>
                </label>
                <label className="flex items-center gap-1.5 font-semibold">
                  <input
                    type="checkbox"
                    checked={antiHbcStatus}
                    onChange={e => setAntiHbcStatus(e.target.checked)}
                    className="rounded text-teal-600"
                  />
                  <span>Anti-HBc Dương Tính</span>
                </label>
              </div>

              <select
                value={chemoCategory}
                onChange={e => setChemoCategory(e.target.value as any)}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-slate-50"
              >
                <option value="anti_cd20_rituximab">Kháng thể Anti-CD20 (Rituximab, Ofatumumab)</option>
                <option value="high_dose_corticoid">Corticosteroid liều cao (&gt; 20mg Prednisone &gt; 4 tuần)</option>
                <option value="anthracycline_chemo">Hóa trị Anthracycline (Doxorubicin, Epirubicin)</option>
                <option value="anti_tnf_biologic">Thuốc ức chế TNF sinh học (Infliximab, Adalimumab)</option>
              </select>
            </div>

            <div
              className={`p-2.5 rounded-lg border text-xs ${
                hbvReactivation.riskLevel === 'high'
                  ? 'bg-rose-50 border-rose-300 text-rose-950 font-bold'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              <span>Phân tầng: {(hbvReactivation.riskLevel || 'low').toUpperCase()} RISK ({hbvReactivation.riskPercentDescription})</span>
              <p className="text-[11px] font-normal mt-0.5">{hbvReactivation.durationInstruction}</p>
              <p className="text-[11px] font-semibold text-teal-800 mt-0.5">Thuốc dự phòng: {hbvReactivation.recommendedAgent}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
