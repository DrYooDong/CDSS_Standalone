/**
 * HepaCDSS Drug-Induced Liver Injury (DILI) & Anti-TB Regimen Tab Component
 * Tích hợp Thang điểm RUCAM 2016, Phác đồ xử trí Thuốc Lao (ATS & BYT) và Nguy cơ tái hoạt HBV.
 */

import React, { useState } from 'react';
import { HepaAnalysisResult, HepaInputData, RucamAssessmentInput } from '../types';
import { COMMON_DILI_DRUGS, DiliEngine } from '../engine/dili';
import {
  ShieldAlert,
  Pill,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  FileSpreadsheet,
  BookOpen,
} from 'lucide-react';

interface DiliTabProps {
  result: HepaAnalysisResult;
  input: HepaInputData;
}

export const DiliTab: React.FC<DiliTabProps> = ({ result, input }) => {
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
  const [chemoCategory, setChemoCategory] = useState<any>('anti_cd20_rituximab');

  const hbvReactivation = DiliEngine.evaluateHbvReactivation({
    isHbsAgPositive: hbsAgStatus,
    isAntiHbcPositive: antiHbcStatus,
    drugCategory: chemoCategory,
  });

  return (
    <div className="space-y-6">
      {/* 1. MODULE ĐẶC TRỊ: XỬ TRÍ NHIỄM ĐỘC GAN DO THUỐC LAO (ANTI-TB DILI) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-rose-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Phác Đồ Xử Trí Nhiễm Độc Gan Do Thuốc Lao (Theo ATS/CDC & Bộ Y Tế)
              </h3>
              <p className="text-[11px] text-slate-500">
                Quy tắc ngừng thuốc, phác đồ bắc cầu không độc gan và quy trình thử lại tuần tự (Rechallenge)
              </p>
            </div>
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-md text-white ${
              tbDecision.action === 'stop_all_immediately' ? 'bg-rose-600 animate-pulse' : 'bg-emerald-600'
            }`}
          >
            {tbDecision.action === 'stop_all_immediately' ? 'NGỪNG THUỐC LAO NGAY' : 'THEO DÕI SÁT'}
          </span>
        </div>

        {/* Quyết định lâm sàng tức thì */}
        <div
          className={`p-4 rounded-xl border ${
            tbDecision.action === 'stop_all_immediately'
              ? 'bg-rose-50 border-rose-300 text-rose-950'
              : 'bg-emerald-50 border-emerald-300 text-emerald-950'
          } space-y-2 text-xs`}
        >
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm uppercase tracking-wide">{tbDecision.title}</h4>
              <p className="leading-relaxed">{tbDecision.severityReason}</p>
              {tbDecision.temporaryBridgeRegimen && (
                <div className="mt-2 p-2.5 bg-white/80 rounded-lg border border-rose-200 font-medium text-slate-800">
                  <span className="font-bold text-rose-800">Phác đồ bắc cầu tạm thời: </span>
                  {tbDecision.temporaryBridgeRegimen}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lộ trình thử lại thuốc lao tuần tự (Rechallenge) */}
        <div className="space-y-2 pt-1">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-teal-600" />
            <span>Quy Trình Thử Lại Tuần Tự (Khi Men Gan Đã Hạ &lt; 2x ULN)</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {tbDecision.rechallengeSteps.map((st, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-teal-700">{st.dayRange}</span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 bg-teal-100 text-teal-900 rounded">
                    {st.drug}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed text-[11px]">{st.doseInstruction}</p>
                <div className="text-[10px] text-slate-500 font-semibold pt-1 border-t border-slate-200">
                  🔬 {st.labCheckInstruction}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1">
            <span className="font-bold">Lưu ý vàng từ chuyên gia:</span>
            <ul className="list-disc list-inside text-[11px] space-y-0.5">
              {tbDecision.clinicalPearls.map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 2. THANG ĐIỂM RUCAM 2016 TƯƠNG TÁC */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-teal-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Thang Điểm RUCAM 2016 — Đánh Giá Mối Liên Hệ Nhân Quả DILI
              </h3>
              <p className="text-[11px] text-slate-500">
                Roussel Uclaf Causality Assessment Method chuẩn quốc tế cho tổn thương gan do thuốc
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-bold">Tổng: {rucamResult.totalScore} điểm</span>
            <span
              className={`text-xs font-black px-2.5 py-1 rounded-md text-white ${
                rucamResult.totalScore >= 9
                  ? 'bg-rose-600'
                  : rucamResult.totalScore >= 6
                  ? 'bg-amber-600'
                  : 'bg-slate-600'
              }`}
            >
              {rucamResult.categoryLabelVi}
            </span>
          </div>
        </div>

        {/* Bảng câu hỏi tính điểm RUCAM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-600 font-semibold block mb-1">Tên thuốc / TPCN nghi ngờ</label>
            <input
              type="text"
              value={rucamInput.drugName}
              onChange={e => setRucamInput({ ...rucamInput, drugName: e.target.value })}
              className="w-full px-3 py-1.5 font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-600 font-semibold block mb-1">Kiểu tổn thương (Dựa trên chỉ số R)</label>
            <select
              value={rucamInput.injuryType}
              onChange={e => setRucamInput({ ...rucamInput, injuryType: e.target.value as any })}
              className="w-full px-3 py-1.5 font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
            >
              <option value="hepatocellular">Tế bào gan (Hepatocellular, R &gt; 5)</option>
              <option value="cholestatic_or_mixed">Ứ mật hoặc Hỗn hợp (Cholestatic/Mixed, R &lt;= 5)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-600 font-semibold block mb-1">
              Thời gian từ lúc uống thuốc đến lúc tăng men (ngày)
            </label>
            <input
              type="number"
              value={rucamInput.timeToOnsetDays}
              onChange={e => setRucamInput({ ...rucamInput, timeToOnsetDays: Number(e.target.value) || 0 })}
              className="w-full px-3 py-1.5 font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-600 font-semibold block mb-1">
              Mức giảm men gan sau khi ngừng thuốc (%)
            </label>
            <select
              value={rucamInput.courseAfterStoppingPercentDrop}
              onChange={e =>
                setRucamInput({
                  ...rucamInput,
                  courseAfterStoppingPercentDrop: Number(e.target.value),
                })
              }
              className="w-full px-3 py-1.5 font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
            >
              <option value="60">Giảm &gt;= 50% trong 8 ngày (hoặc 30 ngày) (+3 điểm)</option>
              <option value="35">Giảm &gt;= 25% (+2 điểm)</option>
              <option value="10">Giảm &lt; 25% (0 điểm)</option>
              <option value="-20">Men tiếp tục tăng sau ngừng thuốc (-2 điểm)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-600 font-semibold block mb-1">
              Loại trừ các nguyên nhân ngoài thuốc (Virus, Sỏi, Sốc gan, AIH)
            </label>
            <select
              value={rucamInput.otherCausesExcludedLevel}
              onChange={e =>
                setRucamInput({
                  ...rucamInput,
                  otherCausesExcludedLevel: e.target.value as any,
                })
              }
              className="w-full px-3 py-1.5 font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
            >
              <option value="complete">Đã làm đầy đủ bilan âm tính (+2 điểm)</option>
              <option value="partial">Loại trừ một phần (+1 điểm)</option>
              <option value="none">Chưa loại trừ (-2 điểm)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-600 font-semibold block mb-1">
              Mức độ độc tính gan trong y văn (LiverTox Category)
            </label>
            <select
              value={rucamInput.previousLiverToxClass}
              onChange={e =>
                setRucamInput({
                  ...rucamInput,
                  previousLiverToxClass: e.target.value as any,
                })
              }
              className="w-full px-3 py-1.5 font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
            >
              <option value="A">Class A / B: Đã chứng minh rõ ràng trong y văn (+2 điểm)</option>
              <option value="C">Class C / D: Hiếm gặp (+1 điểm)</option>
              <option value="unknown">Chưa ghi nhận / Thuốc mới (0 điểm)</option>
            </select>
          </div>
        </div>

        {/* Kết luận RUCAM */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
          <span className="font-bold text-slate-800">Khuyến nghị từ thang điểm RUCAM:</span>
          <p className="text-slate-700 leading-relaxed">{rucamResult.recommendation}</p>
        </div>
      </div>

      {/* 3. NGUY CƠ TÁI HOẠT VIÊM GAN B KHI DÙNG HÓA TRỊ / ỨC CHẾ MIỄN DỊCH */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Đánh Giá Nguy Cơ Tái Hoạt HBV Khi Dùng Thuốc Ức Chế Miễn Dịch / Hóa Trị
              </h3>
              <p className="text-[11px] text-slate-500">
                Phân tầng nguy cơ bùng phát viêm gan B và chỉ định thuốc kháng virus dự phòng (AASLD & Bộ Y Tế)
              </p>
            </div>
          </div>
          <span
            className={`text-xs font-black px-2.5 py-1 rounded-md text-white ${
              hbvReactivation.riskLevel === 'high'
                ? 'bg-rose-600'
                : hbvReactivation.riskLevel === 'moderate'
                ? 'bg-amber-600'
                : 'bg-emerald-600'
            }`}
          >
            NGUY CƠ {hbvReactivation.riskLevel.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-slate-600 font-semibold block mb-1">Kháng nguyên HBsAg</label>
            <select
              value={hbsAgStatus ? 'pos' : 'neg'}
              onChange={e => setHbsAgStatus(e.target.value === 'pos')}
              className="w-full px-2.5 py-1.5 font-bold border border-slate-300 rounded-lg bg-white"
            >
              <option value="pos">Dương tính [HBsAg (+)]</option>
              <option value="neg">Âm tính [HBsAg (-)]</option>
            </select>
          </div>

          <div>
            <label className="text-slate-600 font-semibold block mb-1">Kháng thể Anti-HBc (Tổng)</label>
            <select
              value={antiHbcStatus ? 'pos' : 'neg'}
              onChange={e => setAntiHbcStatus(e.target.value === 'pos')}
              className="w-full px-2.5 py-1.5 font-bold border border-slate-300 rounded-lg bg-white"
            >
              <option value="pos">Dương tính [Anti-HBc (+)]</option>
              <option value="neg">Âm tính [Anti-HBc (-)]</option>
            </select>
          </div>

          <div>
            <label className="text-slate-600 font-semibold block mb-1">Nhóm thuốc ức chế miễn dịch</label>
            <select
              value={chemoCategory}
              onChange={e => setChemoCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 font-bold border border-slate-300 rounded-lg bg-white"
            >
              <option value="anti_cd20_rituximab">Anti-CD20 (Rituximab, Obinutuzumab)</option>
              <option value="high_dose_corticoid">Corticoid liều cao (&gt;= 20mg/ngày &gt;= 4 tuần)</option>
              <option value="anthracycline_chemo">Hóa trị Anthracycline (Doxorubicin)</option>
              <option value="anti_tnf_biologic">Thuốc sinh học kháng TNF (Infliximab)</option>
              <option value="low_dose_corticoid">Corticoid liều thấp / ngắn ngày</option>
            </select>
          </div>
        </div>

        <div className="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-200 text-xs space-y-1.5">
          <div className="flex items-center justify-between font-bold text-indigo-950">
            <span>Tỷ lệ nguy cơ bùng phát: {hbvReactivation.riskPercentDescription}</span>
            <span>
              {hbvReactivation.prophylaxisIndicated ? 'BẮT BUỘC DỰ PHÒNG' : 'THEO DÕI ĐỊNH KỲ'}
            </span>
          </div>
          <p className="text-slate-800">
            <span className="font-bold">Thuốc kháng virus khuyến cáo: </span>
            {hbvReactivation.recommendedAgent}
          </p>
          <p className="text-slate-700 text-[11px] leading-relaxed">
            {hbvReactivation.durationInstruction}
          </p>
        </div>
      </div>

      {/* 4. TRA CỨU NHANH DANH MỤC THUỐC DILI PHỔ BIẾN TẠI VIỆT NAM */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
          <BookOpen className="w-5 h-5 text-teal-600" />
          <span>Tra Cứu Nhanh Các Thuốc Gây Độc Gan Phổ Biến Tại Việt Nam (LiverTox)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {COMMON_DILI_DRUGS.map((d, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{d.name}</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded">
                  Class {d.liverToxClass}
                </span>
              </div>
              <p className="text-slate-600 text-[11px]">
                <span className="font-bold">Kiểu tổn thương: </span>
                {d.typicalPattern.toUpperCase()}
              </p>
              <p className="text-slate-600 text-[11px]">
                <span className="font-bold">Thời gian tiềm tàng: </span>
                {d.latencyDescription}
              </p>
              <p className="text-slate-700 text-[11px] leading-relaxed pt-1 border-t border-slate-200">
                {d.mechanismAndPearl}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
