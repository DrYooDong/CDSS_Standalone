import React, { useState } from 'react';
import { BIOMARKER_DICTIONARY } from '../data/biomarkerData';
import { KNOWLEDGE_TOPICS } from '../data/referenceKnowledge';
import { BiomarkerInfo, KnowledgeTopic } from '../types';
import {
  BookOpen,
  Search,
  Activity,
  Sparkles,
  Info,
  Clock,
  Layers,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  FileText,
} from 'lucide-react';

export const KnowledgeTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'biomarkers' | 'topics'>('biomarkers');

  // State cho Biomarkers
  const [searchMarker, setSearchMarker] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMarkerId, setSelectedMarkerId] = useState<string>(BIOMARKER_DICTIONARY[0].id);

  // State cho Topics
  const [selectedTopicId, setSelectedTopicId] = useState<string>(KNOWLEDGE_TOPICS[0].id);

  // Filter markers
  const filteredMarkers = BIOMARKER_DICTIONARY.filter(m => {
    const matchesSearch =
      m.code.toLowerCase().includes(searchMarker.toLowerCase()) ||
      m.nameVi.toLowerCase().includes(searchMarker.toLowerCase()) ||
      m.nameEn.toLowerCase().includes(searchMarker.toLowerCase());
    const matchesCat = selectedCategory === 'all' || m.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const selectedMarker =
    BIOMARKER_DICTIONARY.find(m => m.id === selectedMarkerId) || BIOMARKER_DICTIONARY[0];
  const selectedTopic =
    KNOWLEDGE_TOPICS.find(t => t.id === selectedTopicId) || KNOWLEDGE_TOPICS[0];

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Hepatocellular':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'Cholestatic':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Bilirubin':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Synthetic':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* 1. Header & Tab Switcher */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Trung Tâm Tri Thức & Từ Điển Sinh Hóa Gan (Knowledge Hub)
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Tra cứu từ điển 12 dấu ấn sinh hóa gan chuẩn chỉnh và 7 chuyên đề y văn lâm sàng sâu theo ACG & WHO.
          </p>
        </div>

        {/* Toggle SubTab */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveSubTab('biomarkers')}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-1.5 ${
              activeSubTab === 'biomarkers'
                ? 'bg-white text-teal-800 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4 text-teal-600" />
            <span>Từ Điển Chỉ Số (12)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('topics')}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-1.5 ${
              activeSubTab === 'topics'
                ? 'bg-white text-indigo-800 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>7 Chuyên Đề Y Văn</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'biomarkers' ? (
        /* PHÂN HỆ 1: TỪ ĐIỂN CHỈ SỐ SINH HÓA GAN */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Cột trái: Tìm kiếm, lọc và danh sách dấu ấn */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
              {/* Ô tìm kiếm */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Tìm ALT, AST, GGT, Ferritin..."
                  value={searchMarker}
                  onChange={e => setSearchMarker(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-slate-50"
                />
              </div>

              {/* Lọc phân nhóm */}
              <div className="flex flex-wrap gap-1">
                {['all', 'Hepatocellular', 'Cholestatic', 'Bilirubin', 'Synthetic'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition ${
                      selectedCategory === cat
                        ? 'bg-teal-600 text-white font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat === 'all' ? 'Tất cả' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Danh sách Biomarkers */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-2 space-y-1 max-h-[600px] overflow-y-auto">
              {filteredMarkers.map(m => {
                const isSelected = m.id === selectedMarkerId;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMarkerId(m.id)}
                    className={`w-full text-left p-2.5 rounded-lg border transition space-y-1 ${
                      isSelected
                        ? 'bg-teal-50 border-teal-300 text-teal-950 font-bold'
                        : 'border-transparent hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{m.code}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${getCategoryBadgeClass(
                          m.category
                        )}`}
                      >
                        {m.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{m.nameVi}</p>
                    <p className="text-[10px] text-teal-700 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 inline" />
                      <span>{m.halfLife}</span>
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cột phải: Chi tiết Dấu ấn sinh hóa */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              {/* Header dấu ấn */}
              <div className="border-b border-slate-100 pb-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-slate-900">{selectedMarker.code}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md border font-bold ${getCategoryBadgeClass(
                        selectedMarker.category
                      )}`}
                    >
                      {selectedMarker.category}
                    </span>
                  </div>
                  <span className="text-xs text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200 font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span>t½: {selectedMarker.halfLife}</span>
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-700">{selectedMarker.nameVi}</h3>
                <p className="text-xs text-slate-400 italic">{selectedMarker.nameEn}</p>
              </div>

              {/* Thông tin khoảng tham chiếu & Nguồn gốc tế bào */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">
                    Khoảng Tham Chiếu Chuẩn
                  </span>
                  <p className="font-semibold text-slate-800">
                    <span className="text-slate-500">Nam: </span>
                    {selectedMarker.normalRangeMale}
                  </p>
                  <p className="font-semibold text-slate-800">
                    <span className="text-slate-500">Nữ: </span>
                    {selectedMarker.normalRangeFemale}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">
                    Nguồn Gốc Tế Bào
                  </span>
                  <p className="font-semibold text-slate-800 leading-relaxed">
                    {selectedMarker.cellularOrigin}
                  </p>
                </div>
              </div>

              {/* Vai trò sinh lý */}
              <div className="space-y-1 text-xs">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block">
                  Vai Trò Sinh Lý & Chức Năng Enzyme:
                </span>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                  {selectedMarker.physiologicalRole}
                </p>
              </div>

              {/* Nguyên nhân tăng */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Các Nguyên Nhân Thường Gặp Làm Tăng Chỉ Số:</span>
                </span>
                <ul className="space-y-1 bg-amber-50/50 p-3 rounded-xl border border-amber-200 text-slate-800">
                  {selectedMarker.causesOfElevation.map((cause, i) => (
                    <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nguyên nhân giảm nếu có */}
              {selectedMarker.causesOfReduction && selectedMarker.causesOfReduction.length > 0 && (
                <div className="space-y-1.5 text-xs">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-indigo-600" />
                    <span>Nguyên Nhân Làm Giảm Bất Thường:</span>
                  </span>
                  <ul className="space-y-1 bg-indigo-50/50 p-3 rounded-xl border border-indigo-200 text-indigo-950">
                    {selectedMarker.causesOfReduction.map((cause, i) => (
                      <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Bẫy xét nghiệm (Testing Pitfalls) */}
              <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1.5 text-xs text-rose-950">
                <span className="font-bold flex items-center gap-1.5 text-rose-900 uppercase tracking-wide text-[11px]">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Bẫy Xét Nghiệm & Yếu Tố Gây Nhiễu (Testing Pitfalls):</span>
                </span>
                {selectedMarker.testingPitfalls.map((pitfall, i) => (
                  <p key={i} className="leading-relaxed">
                    • {pitfall}
                  </p>
                ))}
              </div>

              {/* Ngọc lâm sàng (Clinical Pearls) */}
              <div className="p-3.5 bg-teal-50/70 border border-teal-200 rounded-xl space-y-1.5 text-xs text-teal-950">
                <span className="font-bold flex items-center gap-1.5 text-teal-900 uppercase tracking-wide text-[11px]">
                  <span>💎</span>
                  <span>Ngọc Lâm Sàng (Clinical Pearls):</span>
                </span>
                {selectedMarker.clinicalPearls.map((pearl, i) => (
                  <p key={i} className="leading-relaxed">
                    • {pearl}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* PHÂN HỆ 2: THƯ VIỆN 7 CHUYÊN ĐỀ Y VĂN LÂM SÀNG SÂU */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Cột trái: Danh sách chuyên đề */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block px-1">
              7 Chuyên Đề Y Văn Tuyển Chọn:
            </span>
            <div className="space-y-1.5">
              {KNOWLEDGE_TOPICS.map(topic => {
                const isSelected = topic.id === selectedTopicId;
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => setSelectedTopicId(topic.id)}
                    className={`w-full text-left p-3 rounded-xl border transition space-y-1 ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-bold shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                        {topic.category}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{topic.readTime}</span>
                      </span>
                    </div>
                    <h4 className="text-xs font-bold leading-snug line-clamp-2">{topic.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{topic.summary}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cột phải: Nội dung bài chuyên đề */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              {/* Header chuyên đề */}
              <div className="border-b border-slate-100 pb-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                    {selectedTopic.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Thời gian đọc: {selectedTopic.readTime}</span>
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {selectedTopic.title}
                </h3>
                <p className="text-xs text-slate-500 italic">{selectedTopic.summary}</p>
              </div>

              {/* Tóm tắt then chốt (Key Takeaways) */}
              <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-xl space-y-1.5 text-xs text-teal-950">
                <span className="font-bold flex items-center gap-1.5 text-teal-900 uppercase tracking-wide text-[11px]">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Điểm Then Chốt Cần Nhớ (Key Takeaways):</span>
                </span>
                {selectedTopic.keyTakeaways.map((point, i) => (
                  <p key={i} className="leading-relaxed">
                    • {point}
                  </p>
                ))}
              </div>

              {/* Nội dung Markdown */}
              <div className="prose prose-sm max-w-none text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                {selectedTopic.contentMarkdown}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
