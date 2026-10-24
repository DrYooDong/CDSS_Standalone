/**
 * HepaCDSS Scores Tab Component
 * Bảng tổng hợp các thang điểm tiên lượng & quyết định điều trị lâm sàng:
 * Child-Pugh, MELD/MELD-Na/MELD 3.0, Maddrey DF, Lille Model, King's College, Rumack-Matthew, FIB-4 & APRI.
 */

import React from 'react';
import { HepaAnalysisResult, HepaInputData } from '../types';
import {
  TrendingUp,
  AlertCircle,
  Pill,
  Award,
  Heart,
  Droplets,
  HelpCircle,
  FileText,
} from 'lucide-react';

interface ScoresTabProps {
  result: HepaAnalysisResult;
  input: HepaInputData;
}

export const ScoresTab: React.FC<ScoresTabProps> = ({ result, input }) => {
  const { childPugh, meld, maddrey, lille, kingsCollege, rumackMatthew, fib4, apri, nfs } = result;

  return (
    <div className="space-y-6">
      {/* 1. THANG ĐIỂM CHILD-TURCOTTE-PUGH (CTP) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Thang Điểm Child-Turcotte-Pugh (CTP) — Tiên Lượng Xơ Gan
              </h3>
              <p className="text-[11px] text-slate-500">
                Đánh giá mức độ suy sụp chức năng gan và hướng dẫn hiệu chỉnh liều thuốc
              </p>
            </div>
          </div>
          {childPugh && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">Tổng: {childPugh.score} điểm</span>
              <span
                className={`text-xs font-black px-2.5 py-1 rounded-md text-white ${
                  childPugh.grade === 'A'
                    ? 'bg-emerald-600'
                    : childPugh.grade === 'B'
                    ? 'bg-amber-600'
                    : 'bg-rose-600'
                }`}
              >
                HẠNG {childPugh.grade}
              </span>
            </div>
          )}
        </div>

        {childPugh ? (
          <div className="space-y-4">
            {/* Chi tiết điểm thành phần */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block text-[10px]">Bilirubin</span>
                <span className="font-bold text-slate-900 text-sm">
                  {childPugh.breakdown.bilirubinPoints} điểm
                </span>
                <span className="text-[9px] text-slate-400 block">
                  {result.normalizedValues.totalBilirubinMgDl} mg/dL
                </span>
              </div>

              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block text-[10px]">Albumin</span>
                <span className="font-bold text-slate-900 text-sm">
                  {childPugh.breakdown.albuminPoints} điểm
                </span>
                <span className="text-[9px] text-slate-400 block">
                  {result.normalizedValues.albuminGDl ?? 'N/A'} g/dL
                </span>
              </div>

              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block text-[10px]">INR</span>
                <span className="font-bold text-slate-900 text-sm">
                  {childPugh.breakdown.inrPoints} điểm
                </span>
                <span className="text-[9px] text-slate-400 block">INR {input.inr ?? 'N/A'}</span>
              </div>

              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block text-[10px]">Cổ trướng</span>
                <span className="font-bold text-slate-900 text-sm">
                  {childPugh.breakdown.ascitesPoints} điểm
                </span>
                <span className="text-[9px] text-slate-400 block capitalize">
                  {input.ascites || 'Không'}
                </span>
              </div>

              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block text-[10px]">Bệnh não gan</span>
                <span className="font-bold text-slate-900 text-sm">
                  {childPugh.breakdown.encephalopathyPoints} điểm
                </span>
                <span className="text-[9px] text-slate-400 block capitalize">
                  {input.encephalopathy || 'Không'}
                </span>
              </div>
            </div>

            {/* Tiên lượng & Hiệu chỉnh liều thuốc */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-1">
                <div className="font-bold text-indigo-900 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Tiên lượng sống còn & Chu phẫu</span>
                </div>
                <div className="space-y-0.5 text-slate-700">
                  <p>• Sống còn 1 năm: <span className="font-bold text-slate-900">{childPugh.oneYearSurvivalPercent}%</span> | 2 năm: <span className="font-bold text-slate-900">{childPugh.twoYearSurvivalPercent}%</span></p>
                  <p>• Nguy cơ tử vong phẫu thuật bụng: <span className="font-semibold text-rose-700">{childPugh.surgicalMortalityRisk}</span></p>
                </div>
              </div>

              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 space-y-1">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-amber-600" />
                  <span>Khuyến cáo Dược lâm sàng & Chỉnh liều thuốc</span>
                </div>
                <p className="text-slate-700 leading-relaxed">{childPugh.drugDosingNote}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic py-2">
            Vui lòng nhập đầy đủ Albumin và INR để tính điểm Child-Pugh.
          </p>
        )}
      </div>

      {/* 2. THANG ĐIỂM MELD / MELD-NA / MELD 3.0 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Thang Điểm MELD, MELD-Na & MELD 3.0 — Dự Báo Tử Vong 90 Ngày
              </h3>
              <p className="text-[11px] text-slate-500">
                Ước tính nguy cơ tử vong ngắn hạn và xếp thứ tự ưu tiên ghép gan (UNOS / OPTN)
              </p>
            </div>
          </div>
        </div>

        {meld ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">MELD Gốc (2002)</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{meld.meldOriginal}</div>
                <span className="text-[10px] text-slate-400">Bili + INR + Creatinine</span>
              </div>

              <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-center">
                <span className="text-[10px] font-bold text-teal-800 uppercase">MELD-Na (UNOS 2016)</span>
                <div className="text-2xl font-black text-teal-700 mt-1">{meld.meldNa ?? 'N/A'}</div>
                <span className="text-[10px] text-teal-600">Bổ sung Natri máu (Na⁺)</span>
              </div>

              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-center">
                <span className="text-[10px] font-bold text-indigo-800 uppercase">MELD 3.0 (2021)</span>
                <div className="text-2xl font-black text-indigo-700 mt-1">{meld.meld30 ?? 'N/A'}</div>
                <span className="text-[10px] text-indigo-600">Bổ sung Albumin & Giới tính</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs text-slate-800">
              <div className="flex items-center justify-between">
                <span className="font-bold">Tỷ lệ tử vong dự đoán trong 3 tháng (90 ngày):</span>
                <span className="font-extrabold text-rose-600 text-sm">
                  {meld.threeMonthMortalityPercent}%
                </span>
              </div>
              <p className="leading-relaxed text-slate-700">{meld.interpretation}</p>
              {meld.transplantListingRecommended && (
                <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>ĐẠT TIÊU CHUẨN XEM XÉT ĐƯA VÀO DANH SÁCH CHỜ GHÉP GAN (MELD &gt;= 15)</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic py-2">
            Vui lòng nhập thêm Creatinine máu và INR để tính điểm MELD.
          </p>
        )}
      </div>

      {/* 3. VIÊM GAN DO RƯỢU: MADDREY DF & LILLE MODEL */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Thang Điểm Viêm Gan Do Rượu: Maddrey DF & Lille Model
              </h3>
              <p className="text-[11px] text-slate-500">
                Quyết định chỉ định Corticosteroid (DF &gt;= 32) và đánh giá đáp ứng ngày 7 (Lille &lt; 0.45)
              </p>
            </div>
          </div>
          {maddrey && (
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-md text-white ${
                maddrey.isSevere ? 'bg-rose-600' : 'bg-emerald-600'
              }`}
            >
              Maddrey DF = {maddrey.dfScore} ({maddrey.isSevere ? 'NẶNG' : 'NHẸ/VỪA'})
            </span>
          )}
        </div>

        {maddrey ? (
          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800">Khuyến cáo điều trị bằng Corticoid:</span>
              <p className="leading-relaxed text-slate-700">{maddrey.clinicalRecommendation}</p>
            </div>

            {/* Lille Model nếu có Bilirubin ngày thứ 7 */}
            {lille ? (
              <div
                className={`p-3.5 rounded-xl border ${
                  lille.isResponder
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                } space-y-1.5`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">Đánh giá đáp ứng Ngày 7 (Lille Model):</span>
                  <span className="font-black text-sm">Điểm: {lille.score} ({lille.isResponder ? 'ĐÁP ỨNG' : 'KHÔNG ĐÁP ỨNG'})</span>
                </div>
                <p className="leading-relaxed">{lille.recommendation}</p>
              </div>
            ) : (
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 flex items-center justify-between">
                <span>Chưa có Bilirubin Ngày 7 để đánh giá Lille Model.</span>
                <span className="text-[10px] text-slate-400 italic">Nhập Day 7 Bili để tính</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic py-2">
            Vui lòng nhập PT (giây) hoặc INR để tính chỉ số Maddrey DF.
          </p>
        )}
      </div>

      {/* 4. ĐÁNH GIÁ XƠ HÓA GAN 2 BẬC (FIB-4 & APRI) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Lượng Giá Xơ Hóa Gan Phi Xâm Lấn: FIB-4, NFS & APRI (EASL 2024 / BSG 2018)
              </h3>
              <p className="text-[11px] text-slate-500">
                Tầm soát giai đoạn xơ hóa tiến triển (F3 - F4) kết hợp hiệu chỉnh ngưỡng ở người cao tuổi (≥ 65 tuổi)
              </p>
            </div>
          </div>
        </div>

        {fib4 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* FIB-4 */}
            <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-teal-900">Chỉ số FIB-4</span>
                <span className="text-lg font-black text-teal-700">{fib4.score}</span>
              </div>
              <div
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded inline-block uppercase tracking-wider ${
                  fib4.riskCategory === 'low'
                    ? 'bg-emerald-100 text-emerald-800'
                    : fib4.riskCategory === 'high'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {fib4.riskCategory.toUpperCase()} RISK
              </div>
              <p className="text-slate-700 font-semibold">{fib4.stageDescription}</p>
              {fib4.ageAdjustedNote && (
                <p className="text-[10px] text-teal-800 italic">{fib4.ageAdjustedNote}</p>
              )}
              <div className="pt-2 border-t border-teal-100 text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-800">Khuyến cáo: </span>
                {fib4.recommendation}
              </div>
            </div>

            {/* NAFLD Fibrosis Score (NFS) */}
            {nfs ? (
              <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-900">Thang điểm NFS</span>
                  <span className="text-lg font-black text-indigo-700">{nfs.score}</span>
                </div>
                <div className="text-[10px] font-bold px-2 py-0.5 rounded inline-block bg-indigo-100 text-indigo-800">
                  {nfs.stage}
                </div>
                <p className="text-slate-700 font-semibold">{nfs.stageDescription}</p>
                {nfs.ageAdjustedNote && (
                  <p className="text-[10px] text-indigo-800 italic">{nfs.ageAdjustedNote}</p>
                )}
                <div className="pt-2 border-t border-indigo-100 text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-800">Ý nghĩa: </span>
                  Phối hợp tuổi, BMI, ĐTĐ, AST/ALT, tiểu cầu, albumin theo chuẩn BSG 2018.
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-center text-center text-slate-400">
                <span className="font-bold text-slate-600 mb-1">Thang điểm NFS</span>
                <span className="text-[11px]">Cần nhập thêm BMI và Albumin máu để tính điểm NFS.</span>
              </div>
            )}

            {/* APRI */}
            {apri && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Chỉ số APRI</span>
                  <span className="text-lg font-black text-slate-800">{apri.score}</span>
                </div>
                <div className="text-[10px] font-bold text-slate-500">
                  (AST / ULN) / Tiểu Cầu * 100
                </div>
                <p className="text-slate-700 font-semibold">{apri.stageDescription}</p>
                <div className="pt-2 border-t border-slate-200 text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-800">Ý nghĩa: </span>
                  {apri.recommendation}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic py-2">
            Vui lòng nhập Tiểu cầu máu để tính toán FIB-4, NFS và APRI.
          </p>
        )}
      </div>

      {/* 5. TIÊU CHUẨN KING'S COLLEGE & RUMACK-MATTHEW (NẾU CÓ) */}
      {(kingsCollege?.criteriaMet || rumackMatthew) && (
        <div className="bg-white rounded-xl border border-rose-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-rose-100 pb-3">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <h3 className="text-sm font-bold text-rose-900">
              Cấp Cứu Hồi Sức Suy Gan Cấp: King's College & Ngộ Độc Paracetamol
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            {kingsCollege?.criteriaMet && (
              <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl space-y-1.5 text-rose-950">
                <span className="font-bold text-rose-900 uppercase">
                  ĐẠT TIÊU CHUẨN GHÉP GAN KHẨN CẤP KING'S COLLEGE (CRITERIA POSITIVE)
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  {kingsCollege.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
                <p className="leading-relaxed font-medium pt-1">{kingsCollege.recommendation}</p>
              </div>
            )}

            {rumackMatthew && (
              <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-xl space-y-2 text-purple-950">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-900 uppercase">
                    Phác Đồ Rumack-Matthew & Truyền N-Acetylcysteine (NAC)
                  </span>
                  <span className="font-black px-2 py-0.5 rounded bg-purple-600 text-white text-[10px]">
                    {rumackMatthew.toxicityRisk.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs">
                  Nồng độ Paracetamol: <span className="font-bold">{rumackMatthew.paracetamolLevelMcgMl} mcg/mL</span> tại giờ thứ <span className="font-bold">{rumackMatthew.hoursSinceIngestion}</span> (Ngưỡng độc: {rumackMatthew.treatmentLineCutoffMcgMl} mcg/mL).
                </p>
                <div className="bg-white p-3 rounded-lg border border-purple-200 space-y-1 text-[11px] text-slate-800">
                  <div className="font-bold text-purple-900">Phác đồ truyền tĩnh mạch 21 giờ (3 bước):</div>
                  <p>• {rumackMatthew.nac21HourIvRegimen.loadingDose}</p>
                  <p>• {rumackMatthew.nac21HourIvRegimen.secondDose}</p>
                  <p>• {rumackMatthew.nac21HourIvRegimen.thirdDose}</p>
                  <p className="font-bold text-purple-800 pt-1">• {rumackMatthew.nac21HourIvRegimen.totalDose}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
