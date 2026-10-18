import React, { useState } from 'react';
import {
  InfectionSite,
  Population,
  RiskGroup,
  SepsisSource,
  SpecificPathogenRisk,
  EmpiricRegimen,
  AntibiogramDataset
} from '../../selection/types';
import { getEmpiricRegimens, getAntibiogramForSite } from '../../selection/engine';
import { SourceBadge } from './SourceBadge';
import { 
  ClipboardList, 
  FlaskConical, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Calculator,
  Clock,
  ShieldAlert,
  Info
} from 'lucide-react';

interface StepEmpiricProps {
  site: InfectionSite;
  population: Population;
  riskGroup: RiskGroup;
  sepsisSource?: SepsisSource;
  specificRisks: SpecificPathogenRisk[];
  onSelectDrugForDosing: (drugId: string) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export const StepEmpiric: React.FC<StepEmpiricProps> = ({
  site,
  population,
  riskGroup,
  sepsisSource,
  specificRisks,
  onSelectDrugForDosing,
  onNextStep,
  onPrevStep
}) => {
  const [activeTab, setActiveTab] = useState<'regimens' | 'antibiogram'>('regimens');

  // Lấy danh sách phác đồ khởi đầu theo phân tầng
  const regimens: EmpiricRegimen[] = getEmpiricRegimens(
    site,
    population,
    riskGroup,
    sepsisSource,
    specificRisks
  );

  // Lấy dữ liệu vi sinh tại chỗ
  const antibiogramData: AntibiogramDataset | undefined = getAntibiogramForSite(site, population);

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-200">
                Giai Đoạn 2
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Phác Đồ Kháng Sinh Khởi Đầu &amp; Dữ Liệu Vi Sinh
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Lựa chọn phác đồ kinh nghiệm theo phân tầng nguy cơ ({riskGroup === 'group_1' ? 'Nhóm 1 - Nguy cơ thấp' : 'Nhóm 2 - Nguy cơ cao VKĐK'}) và kháng sinh đồ tại chỗ BV Bệnh Nhiệt Đới.
            </p>
          </div>

          {/* Tab switch */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('regimens')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'regimens'
                  ? 'bg-white text-teal-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5 text-teal-600" />
              <span>Phác đồ Khuyến cáo ({regimens.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('antibiogram')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'antibiogram'
                  ? 'bg-white text-teal-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 text-teal-600" />
              <span>Vi sinh &amp; KSĐ Tại Chỗ</span>
            </button>
          </div>
        </div>

        {/* Cảnh báo phân tầng */}
        <div className={`mt-4 p-4 rounded-xl border text-sm ${
          riskGroup === 'group_2'
            ? 'bg-amber-50/90 border-amber-200 text-amber-950'
            : 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
              riskGroup === 'group_2' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {riskGroup === 'group_2' ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
            </div>
            <div>
              <strong className="font-bold text-xs sm:text-sm">
                {riskGroup === 'group_2'
                  ? 'Bệnh nhân thuộc Nhóm 2 (Nguy cơ cao vi khuẩn đa kháng hoặc bệnh cảnh nặng):'
                  : 'Bệnh nhân thuộc Nhóm 1 (Ít nguy cơ vi khuẩn đa kháng):'}
              </strong>
              <p className="text-xs mt-1 leading-relaxed text-slate-700">
                {riskGroup === 'group_2'
                  ? 'Bắt buộc sử dụng kháng sinh phổ rộng theo lưu đồ BVBND (BL-BLI liều cao hoặc Carbapenem), có thể cần phối hợp bao phủ MRSA nếu có chỉ định. Luôn lấy cấy máu và bệnh phẩm trước liều đầu tiên.'
                  : 'Ưu tiên kháng sinh phổ hẹp hoặc phổ trung bình phù hợp. Hạn chế lạm dụng nhóm Carbapenem, Colistin hay Vancomycin khi chưa có bằng chứng vi sinh.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'regimens' && (
        <div className="space-y-4">
          {/* Danh sách các phác đồ */}
          {regimens.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/90 shadow-xs">
              <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-600 text-sm font-medium">
                Không tìm thấy phác đồ đặc hiệu cho tổ hợp tiêu chí hiện tại. Vui lòng kiểm tra lại bối cảnh lâm sàng hoặc hội chẩn chuyên khoa Truyền nhiễm / Dược lâm sàng.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {regimens.map((regimen) => (
                <div
                  key={regimen.id}
                  className="p-5 rounded-2xl border border-slate-200/90 bg-white shadow-xs hover:border-teal-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">
                        {regimen.titleVi}
                      </h3>
                      <p className="text-xs text-slate-500 italic mt-0.5">
                        {regimen.titleEn}
                      </p>
                    </div>
                    <SourceBadge source={regimen.source} />
                  </div>

                  {/* Danh sách thuốc */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Thuốc lựa chọn &amp; Liều khuyến cáo:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {regimen.drugs.map((drug, dIdx) => (
                        <div
                          key={dIdx}
                          className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/70 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-bold text-sm text-teal-900">
                                {drug.drugName}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200/80 text-slate-700">
                                {drug.route}
                              </span>
                            </div>
                            <div className="mt-1.5 text-xs text-slate-700">
                              <span className="font-semibold text-slate-900">
                                Liều chuẩn:
                              </span>{' '}
                              {drug.dosageVi}
                            </div>
                            {drug.infusionNoteVi && (
                              <div className="mt-1 text-[11px] text-amber-800 bg-amber-50 px-2 py-1 rounded-md border border-amber-200/60 flex items-center gap-1 font-medium">
                                <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                                <span>{drug.infusionNoteVi}</span>
                              </div>
                            )}
                          </div>

                          {/* Nút hành động tính liều */}
                          {drug.drugId && (
                            <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between">
                              <span className="text-[11px] text-slate-500 font-medium">
                                Có sẵn công cụ tính liều
                              </span>
                              <button
                                type="button"
                                onClick={() => onSelectDrugForDosing(drug.drugId!)}
                                className="px-3 py-1 text-xs font-bold rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <Calculator className="w-3.5 h-3.5" />
                                <span>Tính liều cá thể hóa</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quy tắc phối hợp */}
                  {regimen.combinationRulesVi && regimen.combinationRulesVi.length > 0 && (
                    <div className="mt-4 p-3.5 rounded-xl bg-teal-50/60 border border-teal-100">
                      <h4 className="text-xs font-bold text-teal-950 mb-1.5 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-teal-600" />
                        <span>Quy tắc phối hợp lâm sàng:</span>
                      </h4>
                      <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                        {regimen.combinationRulesVi.map((rule, rIdx) => (
                          <li key={rIdx}>{rule}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Chú ý & Cảnh báo an toàn */}
                  {regimen.cautionVi && regimen.cautionVi.length > 0 && (
                    <div className="mt-3 p-3.5 rounded-xl bg-rose-50/70 border border-rose-200/80">
                      <h4 className="text-xs font-bold text-rose-950 mb-1.5 flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                        <span>Chú ý an toàn &amp; Chống chỉ định phối hợp:</span>
                      </h4>
                      <ul className="list-disc list-inside text-xs text-rose-900 space-y-1">
                        {regimen.cautionVi.map((c, cIdx) => (
                          <li key={cIdx}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Antibiogram */}
      {activeTab === 'antibiogram' && (
        <div className="space-y-4">
          {antibiogramData ? (
            <div className="p-5 rounded-2xl border border-slate-200/90 bg-white shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Dữ liệu Vi sinh &amp; Kháng sinh đồ tại chỗ (Nhiễm trùng {site === 'respiratory' ? 'Hô hấp' : site === 'peritoneal' ? 'Ổ bụng' : site === 'urinary' ? 'Tiết niệu' : 'Toàn thân'})
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Thời gian khảo sát: {antibiogramData.period} | Tổng số mẫu phân lập: {antibiogramData.sampleTotal} chủng
                  </p>
                </div>
                <SourceBadge source={antibiogramData.source} />
              </div>

              {/* Bảng vi khuẩn */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                      <th className="py-2.5 px-3">Tác nhân gây bệnh</th>
                      <th className="py-2.5 px-3 text-center">Tỷ lệ phân lập</th>
                      <th className="py-2.5 px-3">Độ nhạy cảm với kháng sinh thường dùng</th>
                      <th className="py-2.5 px-3">Đặc điểm kháng thuốc</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {antibiogramData.organisms.map((org, oIdx) => (
                      <tr key={oIdx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3 font-bold text-slate-900">
                          {org.organismName}
                          <div className="text-[11px] text-slate-500 font-normal">
                            (n = {org.sampleCount})
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center font-extrabold text-teal-700">
                          {org.pctOfIsolates}%
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-wrap gap-1.5">
                            {org.sensitivities.map((s, sIdx) => {
                              const isHigh = s.sensitivityPct >= 70;
                              const isLow = s.sensitivityPct < 40;
                              return (
                                <span
                                  key={sIdx}
                                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                                    isHigh
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                      : isLow
                                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                                      : 'bg-amber-50 text-amber-800 border-amber-200'
                                  }`}
                                  title={`${s.antibioticName}: ${s.sensitivityPct}% nhạy`}
                                >
                                  {s.antibioticName}: <strong className="font-extrabold">{s.sensitivityPct}%</strong>
                                </span>
                              );
                            })}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-rose-700 font-medium">
                          {org.notableResistance || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/90 shadow-xs">
              <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-600 text-sm font-medium">
                Chưa có dữ liệu Antibiogram riêng cho vị trí nhiễm trùng này. Vui lòng tham khảo báo cáo vi sinh chung của Bệnh viện Bệnh Nhiệt Đới năm 2024.
              </p>
            </div>
          )}
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
          <span>Quay lại Giai đoạn 1 (Đánh giá &amp; Phân tầng)</span>
        </button>
        <button
          type="button"
          onClick={onNextStep}
          className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
        >
          <span>Tiếp tục: Giai đoạn 3 (Tái đánh giá 48-72h)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
