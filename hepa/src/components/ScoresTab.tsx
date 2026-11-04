/**
 * HepaCDSS Scores Tab Component (Streamlined & Professional)
 * Bảng tổng hợp thang điểm tiên lượng & phân tầng nguy cơ y khoa:
 * Child-Pugh, MELD/MELD-Na/MELD 3.0, FIB-4, APRI, NFS, Maddrey DF, Lille Model, King's College & Rumack-Matthew.
 */

import React, { useState } from 'react';
import { HepaAnalysisResult, HepaInputData } from '../types';
import {
  TrendingUp,
  AlertCircle,
  Pill,
  Award,
  Heart,
  Droplets,
  FileText,
  Filter,
} from 'lucide-react';

interface ScoresTabProps {
  result: HepaAnalysisResult;
  input: HepaInputData;
}

export const ScoresTab: React.FC<ScoresTabProps> = ({ result, input }) => {
  const { childPugh, meld, maddrey, lille, kingsCollege, rumackMatthew, fib4, apri, nfs } = result;
  const [filterCategory, setFilterCategory] = useState<'all' | 'cirrhosis' | 'fibrosis' | 'acute'>('all');

  const showCirrhosis = filterCategory === 'all' || filterCategory === 'cirrhosis';
  const showFibrosis = filterCategory === 'all' || filterCategory === 'fibrosis';
  const showAcute = filterCategory === 'all' || filterCategory === 'acute';

  return (
    <div className="space-y-4">
      {/* THANH LỌC PHÂN LOẠI THANG ĐIỂM */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setFilterCategory('all')}
            className={`px-2.5 py-1 rounded-md font-bold transition ${
              filterCategory === 'all' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất Cả Thang Điểm
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('cirrhosis')}
            className={`px-2.5 py-1 rounded-md font-bold transition ${
              filterCategory === 'cirrhosis' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Xơ Gan &amp; Tử Vong
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('fibrosis')}
            className={`px-2.5 py-1 rounded-md font-bold transition ${
              filterCategory === 'fibrosis' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Xơ Hóa Sớm (FIB-4)
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('acute')}
            className={`px-2.5 py-1 rounded-md font-bold transition ${
              filterCategory === 'acute' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cấp Cứu &amp; Rượu
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
          Chuẩn EASL 2024 / ACG / AASLD
        </span>
      </div>

      {/* 1. XƠ GAN: CHILD-TURCOTTE-PUGH (CTP) */}
      {showCirrhosis && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Child-Turcotte-Pugh (CTP) — Tiên Lượng Xơ Gan
                </h3>
              </div>
            </div>
            {childPugh && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">{childPugh.score} điểm</span>
                <span
                  className={`text-xs font-black px-2 py-0.5 rounded text-white ${
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
            <div className="space-y-3">
              {/* Thành phần điểm */}
              <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
                <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Bili</span>
                  <span className="font-bold text-slate-900">{childPugh.breakdown.bilirubinPoints}đ</span>
                </div>
                <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Albumin</span>
                  <span className="font-bold text-slate-900">{childPugh.breakdown.albuminPoints}đ</span>
                </div>
                <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">INR</span>
                  <span className="font-bold text-slate-900">{childPugh.breakdown.inrPoints}đ</span>
                </div>
                <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Cổ trướng</span>
                  <span className="font-bold text-slate-900">{childPugh.breakdown.ascitesPoints}đ</span>
                </div>
                <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Não gan</span>
                  <span className="font-bold text-slate-900">{childPugh.breakdown.encephalopathyPoints}đ</span>
                </div>
              </div>

              {/* Sống còn & Hiệu chỉnh thuốc */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-indigo-50/70 rounded-lg border border-indigo-100 space-y-0.5">
                  <span className="font-bold text-indigo-900 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Sống còn &amp; Phẫu thuật:</span>
                  </span>
                  <p className="text-slate-700">
                    Sống còn 1 năm: <strong>{childPugh.oneYearSurvivalPercent}%</strong> | 2 năm: <strong>{childPugh.twoYearSurvivalPercent}%</strong>
                  </p>
                  <p className="text-rose-700 font-semibold">Tử vong phẫu thuật bụng: {childPugh.surgicalMortalityRisk}</p>
                </div>

                <div className="p-2.5 bg-amber-50/70 rounded-lg border border-amber-100 space-y-0.5">
                  <span className="font-bold text-amber-900 flex items-center gap-1">
                    <Pill className="w-3.5 h-3.5 text-amber-600" />
                    <span>Hiệu chỉnh Dược lâm sàng:</span>
                  </span>
                  <p className="text-slate-700 leading-tight">{childPugh.drugDosingNote}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-1">Cần nhập Albumin và INR để tính điểm Child-Pugh.</p>
          )}
        </div>
      )}

      {/* 2. MELD / MELD-NA / MELD 3.0 */}
      {showCirrhosis && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                MELD / MELD-Na / MELD 3.0 — Tử Vong 90 Ngày &amp; Ghép Gan
              </h3>
            </div>
            {meld && (
              <span className="text-xs font-bold text-rose-600">
                Tử vong 90 ngày: {meld.threeMonthMortalityPercent}%
              </span>
            )}
          </div>

          {meld ? (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">MELD Gốc</span>
                  <div className="text-xl font-black text-slate-900">{meld.meldOriginal}</div>
                  <span className="text-[9px] text-slate-400">Bili + INR + Cr</span>
                </div>
                <div className="p-2 bg-teal-50 rounded-lg border border-teal-200">
                  <span className="text-[10px] font-bold text-teal-800 uppercase">MELD-Na</span>
                  <div className="text-xl font-black text-teal-700">{meld.meldNa ?? 'N/A'}</div>
                  <span className="text-[9px] text-teal-600">Thêm Natri (Na⁺)</span>
                </div>
                <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-200">
                  <span className="text-[10px] font-bold text-indigo-800 uppercase">MELD 3.0</span>
                  <div className="text-xl font-black text-indigo-700">{meld.meld30 ?? 'N/A'}</div>
                  <span className="text-[9px] text-indigo-600">Thêm Albumin &amp; Giới</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
                <p className="leading-tight">{meld.interpretation}</p>
                {meld.transplantListingRecommended && (
                  <div className="p-1.5 bg-rose-100 border border-rose-300 rounded text-rose-900 font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>Đạt tiêu chuẩn xem xét danh sách chờ ghép gan (MELD ≥ 15)</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-1">Cần nhập Creatinine máu và INR để tính điểm MELD.</p>
          )}
        </div>
      )}

      {/* 3. XƠ HÓA KHÔNG XÂM LẤN: FIB-4, NFS & APRI */}
      {showFibrosis && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Lượng Giá Xơ Hóa Gan: FIB-4, NFS &amp; APRI
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-semibold">Tầm soát F3-F4</span>
          </div>

          {fib4 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
              {/* FIB-4 */}
              <div className="p-3 bg-teal-50/60 rounded-lg border border-teal-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-teal-900">Điểm FIB-4</span>
                  <span className="text-lg font-black text-teal-700">{fib4.score}</span>
                </div>
                <span
                  className={`text-[9px] font-black px-1.5 py-0.2 rounded inline-block uppercase ${
                    fib4.riskCategory === 'low'
                      ? 'bg-emerald-100 text-emerald-800'
                      : fib4.riskCategory === 'high'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {fib4.riskCategory.toUpperCase()} RISK
                </span>
                <p className="font-semibold text-slate-800 text-[11px]">{fib4.stageDescription}</p>
                <p className="text-slate-600 text-[11px] leading-tight pt-1 border-t border-teal-100">
                  <strong>Xử trí:</strong> {fib4.recommendation}
                </p>
              </div>

              {/* NFS */}
              {nfs ? (
                <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-900">Điểm NFS</span>
                    <span className="text-lg font-black text-indigo-700">{nfs.score}</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800">
                    {nfs.stage}
                  </span>
                  <p className="font-semibold text-slate-800 text-[11px]">{nfs.stageDescription}</p>
                  <p className="text-slate-600 text-[11px] leading-tight pt-1 border-t border-indigo-100">
                    Phối hợp Tuổi, BMI, ĐTĐ, AST/ALT, TC, Albumin (BSG 2018).
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center text-slate-400 flex flex-col justify-center">
                  <span className="font-bold text-slate-600 text-[11px]">NFS</span>
                  <span className="text-[10px]">Cần nhập thêm BMI và Albumin.</span>
                </div>
              )}

              {/* APRI */}
              {apri && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Chỉ số APRI</span>
                    <span className="text-lg font-black text-slate-800">{apri.score}</span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono">(AST/ULN)/TC*100</span>
                  <p className="font-semibold text-slate-800 text-[11px]">{apri.stageDescription}</p>
                  <p className="text-slate-600 text-[11px] leading-tight pt-1 border-t border-slate-200">
                    {apri.recommendation}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-1">Cần nhập Tiểu cầu máu để tính toán FIB-4 và APRI.</p>
          )}
        </div>
      )}

      {/* 4. CẤP CỨU & VIÊM GAN RƯỢU: MADDREY DF, LILLE, PARACETAMOL */}
      {showAcute && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Viêm Gan Do Rượu (Maddrey DF &amp; Lille) &amp; Suy Gan Cấp
              </h3>
            </div>
            {maddrey && (
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded text-white ${
                  maddrey.isSevere ? 'bg-rose-600' : 'bg-emerald-600'
                }`}
              >
                Maddrey DF = {maddrey.dfScore} ({maddrey.isSevere ? 'NẶNG: CORTICOID' : 'NHẸ/VỪA'})
              </span>
            )}
          </div>

          <div className="space-y-2 text-xs">
            {maddrey && (
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800 block mb-0.5">Chỉ định Corticosteroid:</span>
                <p className="text-slate-700 leading-tight">{maddrey.clinicalRecommendation}</p>
              </div>
            )}

            {lille && (
              <div
                className={`p-2.5 rounded-lg border ${
                  lille.isResponder ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>Đáp ứng Ngày 7 (Lille Model): Điểm {lille.score}</span>
                  <span className="text-[10px] uppercase font-black">{lille.isResponder ? 'ĐÁP ỨNG TỐT' : 'KHÔNG ĐÁP ỨNG'}</span>
                </div>
                <p className="text-[11px] mt-0.5 leading-tight">{lille.recommendation}</p>
              </div>
            )}

            {/* King's College & Rumack-Matthew */}
            {(kingsCollege?.criteriaMet || rumackMatthew) && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg space-y-1 text-rose-950">
                {kingsCollege?.criteriaMet && (
                  <div>
                    <span className="font-bold text-rose-900 block">ĐẠT TIÊU CHUẨN GHÉP GAN KING'S COLLEGE</span>
                    <p className="text-[11px] leading-tight">{kingsCollege.recommendation}</p>
                  </div>
                )}
                {rumackMatthew && (
                  <div className="pt-1 border-t border-rose-200">
                    <span className="font-bold text-purple-900 block">
                      Ngộ độc Paracetamol: {rumackMatthew.toxicityRisk.toUpperCase()} — Chỉ định truyền NAC 21h
                    </span>
                    <p className="text-[11px] text-slate-700">
                      Nồng độ: {rumackMatthew.paracetamolLevelMcgMl} mcg/mL tại giờ {rumackMatthew.hoursSinceIngestion}.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
