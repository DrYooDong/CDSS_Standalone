/**
 * HepaCDSS Clinical Cases Tab Component
 * Thư viện 12 Ca lâm sàng chuyên khoa kinh điển kèm tính năng 1-Click tải vào phân tích CDSS.
 */

import React, { useState } from 'react';
import { CLINICAL_CASES, ClinicalCase } from '../data/cases';
import { HepaInputData } from '../types';
import { BookOpen, CheckCircle, ArrowRight, User, Stethoscope } from 'lucide-react';

interface CasesTabProps {
  onLoadCase: (input: HepaInputData) => void;
}

export const CasesTab: React.FC<CasesTabProps> = ({ onLoadCase }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCaseId, setSelectedCaseId] = useState<string>(CLINICAL_CASES[0].id);

  const categories = [
    { id: 'all', label: 'Tất Cả (12 Ca)' },
    { id: 'Metabolic', label: 'Gan Nhiễm Mỡ' },
    { id: 'Alcohol', label: 'Gan Do Rượu' },
    { id: 'Viral', label: 'Viêm Gan Virus' },
    { id: 'Biliary', label: 'Tắc Mật / Ứ Mật' },
    { id: 'Toxic_DILI', label: 'Thuốc & Độc Chất' },
    { id: 'Autoimmune', label: 'Tự Miễn (PBC/AIH)' },
    { id: 'Genetic', label: 'Di Truyền (Wilson/Gilbert)' },
    { id: 'Vascular', label: 'Gan Sốc / Mạch Máu' },
    { id: 'Myopathy', label: 'Tiêu Cơ Vân' },
  ];

  const filteredCases =
    selectedCategory === 'all'
      ? CLINICAL_CASES
      : CLINICAL_CASES.filter(c => c.category === selectedCategory);

  const currentCase = CLINICAL_CASES.find(c => c.id === selectedCaseId) || CLINICAL_CASES[0];

  return (
    <div className="space-y-6">
      {/* 1. THANH LỌC CHUYÊN KHOA */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {categories.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition ${
              selectedCategory === cat.id
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 2. BỐ CỤC 2 CỘT: DANH SÁCH CA & CHI TIẾT CA CHỌN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Cột trái: Danh sách các ca */}
        <div className="lg:col-span-5 space-y-2.5">
          {filteredCases.map(c => {
            const isSelected = c.id === currentCase.id;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition ${
                  isSelected
                    ? 'bg-teal-50/80 border-teal-500 shadow-sm'
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700">
                    {c.category}
                  </span>
                  {isSelected && <span className="text-[10px] font-bold text-teal-700">Đang chọn</span>}
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">{c.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <User className="w-3 h-3 shrink-0" />
                  <span>{c.patientProfile}</span>
                </p>
              </div>
            );
          })}
        </div>

        {/* Cột phải: Chi tiết ca lâm sàng & Nút nạp vào CDSS */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                {currentCase.category} CLINICAL CASE
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">{currentCase.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{currentCase.patientProfile}</p>
            </div>
            <button
              type="button"
              onClick={() => onLoadCase(currentCase.input)}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-sm transition shrink-0"
            >
              <span>Nạp Ca Vào CDSS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Bệnh sử & Khám lâm sàng */}
          <div className="space-y-1.5 text-xs text-slate-700">
            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              <span>Bệnh Cảnh & Tóm Tắt Diễn Biến:</span>
            </span>
            <p className="leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              {currentCase.summary}
            </p>
          </div>

          {/* Bảng thông số sinh hóa của ca */}
          <div className="space-y-1.5 text-xs">
            <span className="font-bold text-slate-900 block">Số Liệu Xét Nghiệm Sinh Hóa Gan:</span>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 bg-rose-50/70 rounded-lg border border-rose-100">
                <span className="text-[10px] text-rose-700 block">ALT</span>
                <span className="font-black text-rose-900">{currentCase.input.alt} U/L</span>
              </div>
              <div className="p-2 bg-amber-50/70 rounded-lg border border-amber-100">
                <span className="text-[10px] text-amber-700 block">AST</span>
                <span className="font-black text-amber-900">{currentCase.input.ast} U/L</span>
              </div>
              <div className="p-2 bg-teal-50/70 rounded-lg border border-teal-100">
                <span className="text-[10px] text-teal-700 block">ALP</span>
                <span className="font-black text-teal-900">{currentCase.input.alp} U/L</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-600 block">GGT</span>
                <span className="font-black text-slate-800">{currentCase.input.ggt ?? '-'}</span>
              </div>
              <div className="p-2 bg-purple-50/70 rounded-lg border border-purple-100">
                <span className="text-[10px] text-purple-700 block">Bilirubin TP</span>
                <span className="font-black text-purple-900">
                  {currentCase.input.totalBilirubin} {currentCase.input.bilirubinUnit || 'µmol/L'}
                </span>
              </div>
              <div className="p-2 bg-indigo-50/70 rounded-lg border border-indigo-100">
                <span className="text-[10px] text-indigo-700 block">Albumin</span>
                <span className="font-black text-indigo-900">{currentCase.input.albumin ?? '-'} g/L</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-600 block">PT / INR</span>
                <span className="font-black text-slate-800">{currentCase.input.inr ?? '-'}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-600 block">Tiểu Cầu</span>
                <span className="font-black text-slate-800">{currentCase.input.platelets ?? '-'} G/L</span>
              </div>
            </div>
          </div>

          {/* Điểm then chốt & Biện luận lâm sàng */}
          <div className="space-y-1.5 text-xs text-slate-800 pt-1">
            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>Bài Học Lâm Sàng Then Chốt (Key Clinical Pearls):</span>
            </span>
            <ul className="space-y-1.5 list-disc list-inside leading-relaxed bg-teal-50/40 p-3 rounded-lg border border-teal-100 text-[11px]">
              {currentCase.keyPearls.map((pearl, idx) => (
                <li key={idx}>{pearl}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
