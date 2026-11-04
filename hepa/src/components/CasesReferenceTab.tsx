/**
 * HepaCDSS Cases & Reference Tab Component (Consolidated & Streamlined)
 * Tích hợp Thư viện 12 Ca Lâm Sàng Kinh Điển và Từ Điển Chỉ Số Sinh Hóa Gan.
 */

import React, { useState } from 'react';
import { CLINICAL_CASES, ClinicalCase } from '../data/cases';
import { BIOMARKER_DICTIONARY } from '../data/biomarkerData';
import { HepaInputData, BiomarkerInfo } from '../types';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  Search,
  CheckCircle2,
  Clock,
  Info,
  Activity,
  Layers,
} from 'lucide-react';

interface CasesReferenceTabProps {
  onLoadCase: (input: HepaInputData) => void;
}

export const CasesReferenceTab: React.FC<CasesReferenceTabProps> = ({ onLoadCase }) => {
  const [subTab, setSubTab] = useState<'cases' | 'dictionary'>('cases');

  // State cho Ca lâm sàng
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCaseId, setSelectedCaseId] = useState<string>(CLINICAL_CASES[0].id);

  // State cho Từ điển
  const [searchMarker, setSearchMarker] = useState('');
  const [markerCategory, setMarkerCategory] = useState<string>('all');
  const [selectedMarkerId, setSelectedMarkerId] = useState<string>(BIOMARKER_DICTIONARY[0].id);

  const categories = [
    { id: 'all', label: 'Tất Cả (12 Ca)' },
    { id: 'Metabolic', label: 'Gan Nhiễm Mỡ' },
    { id: 'Alcohol', label: 'Gan Do Rượu' },
    { id: 'Viral', label: 'Viêm Gan Virus' },
    { id: 'Biliary', label: 'Tắc Mật / Ứ Mật' },
    { id: 'Toxic_DILI', label: 'Thuốc & Độc Chất' },
    { id: 'Autoimmune', label: 'Tự Miễn (PBC/AIH)' },
    { id: 'Genetic', label: 'Di Truyền (Wilson)' },
    { id: 'Vascular', label: 'Gan Sốc / Mạch Máu' },
    { id: 'Myopathy', label: 'Tiêu Cơ Vân' },
  ];

  const filteredCases =
    selectedCategory === 'all'
      ? CLINICAL_CASES
      : CLINICAL_CASES.filter(c => c.category === selectedCategory);

  const currentCase = CLINICAL_CASES.find(c => c.id === selectedCaseId) || CLINICAL_CASES[0];

  const filteredMarkers = BIOMARKER_DICTIONARY.filter(m => {
    const matchesSearch =
      m.code.toLowerCase().includes(searchMarker.toLowerCase()) ||
      m.nameVi.toLowerCase().includes(searchMarker.toLowerCase()) ||
      m.nameEn.toLowerCase().includes(searchMarker.toLowerCase());
    const matchesCat = markerCategory === 'all' || m.category === markerCategory;
    return matchesSearch && matchesCat;
  });

  const selectedMarker =
    BIOMARKER_DICTIONARY.find(m => m.id === selectedMarkerId) || BIOMARKER_DICTIONARY[0];

  return (
    <div className="space-y-4">
      {/* THANH ĐIỀU HƯỚNG SUB-TAB */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setSubTab('cases')}
            className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 ${
              subTab === 'cases' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>12 Ca Lâm Sàng Thực Chiến</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('dictionary')}
            className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 ${
              subTab === 'dictionary' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Từ Điển Chỉ Số &amp; Hướng Dẫn</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
          {subTab === 'cases' ? '1-Click nạp số liệu vào CDSS' : 'Tham chiếu sinh hóa gan ACG & EASL'}
        </span>
      </div>

      {/* 1. CA LÂM SÀNG KINH ĐIỂN */}
      {subTab === 'cases' && (
        <div className="space-y-3">
          {/* Lọc chuyên khoa */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition text-xs ${
                  selectedCategory === cat.id
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Bố cục 2 cột: Danh sách ca & Chi tiết ca */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            {/* Cột trái: Danh sách các ca (5 cols) */}
            <div className="lg:col-span-5 space-y-2 max-h-[640px] overflow-y-auto pr-1">
              {filteredCases.map((c, idx) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                    selectedCaseId === c.id
                      ? 'bg-teal-50/70 border-teal-400 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <span className="text-[10px] font-bold text-teal-700 uppercase">
                      Ca #{idx + 1} • {c.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      ALT {c.input.alt} / AST {c.input.ast}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{c.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{c.patientProfile}</p>
                </div>
              ))}
            </div>

            {/* Cột phải: Chi tiết ca đã chọn (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-teal-100 text-teal-800 uppercase tracking-wide">
                    {currentCase.category}
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 mt-1">{currentCase.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{currentCase.patientProfile}</p>
                </div>

                <button
                  type="button"
                  onClick={() => onLoadCase(currentCase.input)}
                  className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tải vào CDSS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tóm tắt bệnh sử */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
                <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wide">
                  Tóm tắt bệnh cảnh:
                </span>
                <p className="leading-relaxed">{currentCase.summary}</p>
              </div>

              {/* Thông số cận lâm sàng của ca */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wide block">
                  Kết quả xét nghiệm vào viện:
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">ALT</span>
                    <span className="font-bold text-rose-600">{currentCase.input.alt}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">AST</span>
                    <span className="font-bold text-amber-600">{currentCase.input.ast}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">ALP</span>
                    <span className="font-bold text-teal-700">{currentCase.input.alp ?? '-'}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">GGT</span>
                    <span className="font-bold text-indigo-700">{currentCase.input.ggt ?? '-'}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Bilirubin</span>
                    <span className="font-bold text-slate-900">{currentCase.input.totalBilirubin}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">INR</span>
                    <span className="font-bold text-slate-900">{currentCase.input.inr ?? '-'}</span>
                  </div>
                </div>
              </div>

              {/* Điểm then chốt lâm sàng (Key Pearls) */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wide block">
                  Điểm then chốt y văn (Clinical Pearls):
                </span>
                <div className="space-y-1">
                  {currentCase.keyPearls.map((pearl, i) => (
                    <div key={i} className="flex items-start gap-1.5 p-2 bg-teal-50/50 rounded border border-teal-100 text-xs text-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                      <p className="leading-tight">{pearl}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TỪ ĐIỂN CHỈ SỐ SINH HÓA */}
      {subTab === 'dictionary' && (
        <div className="space-y-3">
          {/* Thanh tìm kiếm & Lọc nhóm */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm biomarker: ALT, AST, GGT, Bili..."
                value={searchMarker}
                onChange={e => setSearchMarker(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1 text-xs">
              {['all', 'Hepatocellular', 'Cholestatic', 'Bilirubin', 'Synthetic'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setMarkerCategory(cat)}
                  className={`px-2 py-1 rounded font-bold transition text-[11px] ${
                    markerCategory === cat
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat === 'all' ? 'Tất cả' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Bố cục 2 cột: Danh sách marker & Chi tiết marker */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            {/* Cột trái (4 cols) */}
            <div className="lg:col-span-4 space-y-1.5 max-h-[560px] overflow-y-auto pr-1">
              {filteredMarkers.map(m => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMarkerId(m.id)}
                  className={`p-2.5 rounded-lg border text-left cursor-pointer transition text-xs ${
                    selectedMarkerId === m.id
                      ? 'bg-teal-50/70 border-teal-400 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{m.code}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      {m.category}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block truncate">{m.nameVi}</span>
                </div>
              ))}
            </div>

            {/* Cột phải (8 cols): Chi tiết marker */}
            <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">{selectedMarker.code} — {selectedMarker.nameVi}</h3>
                  <span className="text-[11px] text-slate-500 italic">{selectedMarker.nameEn}</span>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                  {selectedMarker.category}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-bold">Nam (ULN):</span>
                  <span className="font-bold text-slate-800">{selectedMarker.normalRangeMale}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-bold">Nữ (ULN):</span>
                  <span className="font-bold text-slate-800">{selectedMarker.normalRangeFemale}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-bold">Thời gian bán hủy:</span>
                  <span className="font-bold text-teal-700">{selectedMarker.halfLife}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wide block">Nguồn gốc &amp; Sinh lý:</span>
                <p className="text-slate-700 leading-tight">{selectedMarker.cellularOrigin}. {selectedMarker.physiologicalRole}</p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wide block">Nguyên nhân tăng thường gặp:</span>
                <div className="space-y-0.5">
                  {selectedMarker.causesOfElevation.slice(0, 4).map((c, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-slate-700">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-2.5 bg-teal-50/50 rounded-lg border border-teal-100 space-y-1">
                <span className="font-bold text-teal-900 uppercase text-[10px] tracking-wide block">Điểm then chốt lâm sàng:</span>
                {selectedMarker.clinicalPearls.slice(0, 2).map((p, i) => (
                  <p key={i} className="text-slate-700 leading-tight">• {p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
