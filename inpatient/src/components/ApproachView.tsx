import React, { useState } from 'react';
import { ApproachTopic, BodySystem } from '../types/clinical';
import { APPROACH_TOPICS } from '../data/approachData';
import { 
  GitFork, 
  ShieldAlert, 
  HelpCircle, 
  FileDown, 
  Bookmark, 
  Edit3, 
  AlertTriangle, 
  CheckCircle2, 
  Stethoscope, 
  Lightbulb, 
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  PanelLeftClose,
  PanelLeftOpen,
  Zap,
  Activity,
  ClipboardList,
  Syringe,
  FileText,
  BookOpen
} from 'lucide-react';
import { AlgorithmViewer } from './AlgorithmViewer';
import { pdfExport } from '../utils/pdfExport';
import { storageService } from '../services/storageService';

interface ApproachViewProps {
  selectedTopicId?: string;
  onSelectTopicId: (id: string) => void;
  onOpenNotes: (topicId: string, topicTitle: string) => void;
  onToggleBookmark: (id: string, title: string, system: BodySystem) => void;
  isBookmarked: (id: string) => boolean;
}

export const ApproachView: React.FC<ApproachViewProps> = ({
  selectedTopicId,
  onSelectTopicId,
  onOpenNotes,
  onToggleBookmark,
  isBookmarked
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'Emergency' | 'Urgent' | 'general' | 'cardiovascular' | 'respiratory' | 'gastrointestinal' | 'neurological' | 'musculoskeletal'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const filteredTopics = APPROACH_TOPICS.filter(t => {
    const matchesFilter = 
      selectedFilter === 'all' || 
      t.urgencyLevel === selectedFilter || 
      t.system === selectedFilter;

    const matchesSearch = 
      !searchQuery || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.englishTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.redFlags.some(r => r.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.differentialDiagnosis.some(cat => cat.diseases.some(d => d.name.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesFilter && matchesSearch;
  });

  const currentTopic = APPROACH_TOPICS.find(t => t.id === selectedTopicId) || filteredTopics[0];

  const handleExportPDF = () => {
    if (currentTopic) {
      const notes = storageService.getNotesByTopic(currentTopic.id);
      pdfExport.exportApproachTopicToPDF(currentTopic, notes);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'Emergency', label: '🚨 Cấp cứu (Emergency)' },
            { id: 'general', label: '🌡️ Sốt & Toàn thân (FUO)' },
            { id: 'cardiovascular', label: 'Tim mạch' },
            { id: 'respiratory', label: 'Hô hấp' },
            { id: 'gastrointestinal', label: 'Tiêu hóa' },
            { id: 'neurological', label: 'Thần kinh' },
            { id: 'musculoskeletal', label: 'Cơ xương khớp' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedFilter === f.id
                  ? 'bg-slate-900 dark:bg-sky-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Lọc triệu chứng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-teal-500 shadow-2xs"
          />
        </div>
      </div>

      <div className={`grid grid-cols-1 ${isSidebarCollapsed ? 'lg:grid-cols-12 gap-5' : 'lg:grid-cols-12 gap-8'}`}>
        {/* Left Side: Topic List Cards / Collapsed Icons */}
        {isSidebarCollapsed ? (
          <div className="lg:col-span-1 flex flex-col items-center space-y-2 py-1">
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 transition-all w-full flex items-center justify-center border border-sky-200 dark:border-sky-800 shadow-2xs group"
              title="Mở rộng danh sách triệu chứng"
            >
              <PanelLeftOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>

            <div className="w-full space-y-2 pt-1">
              {filteredTopics.map((topic) => {
                const isSelected = topic.id === currentTopic?.id;
                const bookmarked = isBookmarked(topic.id);
                // Create a 2-3 letter abbreviation from title
                const words = topic.title.replace(/tiếp cận\s+/i, '').split(' ');
                const abbr = words.slice(0, 2).map(w => w[0]).join('').toUpperCase();

                return (
                  <button
                    key={topic.id}
                    onClick={() => onSelectTopicId(topic.id)}
                    className={`w-full p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all relative group ${
                      isSelected
                        ? 'bg-sky-600 text-white border-sky-600 shadow-md ring-2 ring-sky-500/20'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-800 shadow-2xs'
                    }`}
                    title={`${topic.title} (${topic.urgencyLevel} - ${topic.englishTitle})`}
                  >
                    <span className="text-xs">
                      {topic.urgencyLevel === 'Emergency' ? '🚨' : '⚡'}
                    </span>
                    <span className={`text-[10px] font-bold mt-0.5 tracking-tight ${isSelected ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                      {abbr || 'TC'}
                    </span>
                    {bookmarked && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Sơ Đồ Tiếp Cận Triệu Chứng
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                  {filteredTopics.length} lưu đồ
                </span>
              </div>
              <button
                onClick={() => setIsSidebarCollapsed(true)}
                className="flex items-center space-x-1.5 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-700 dark:hover:text-sky-300 bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                title="Thu gọn danh sách thành biểu tượng để mở rộng sơ đồ tiếp cận"
              >
                <PanelLeftClose className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Thu gọn icon</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {filteredTopics.map((topic) => {
                const isSelected = topic.id === currentTopic?.id;
                const bookmarked = isBookmarked(topic.id);
                const noteCount = storageService.getNotesByTopic(topic.id).length;

                return (
                  <div
                    key={topic.id}
                    onClick={() => onSelectTopicId(topic.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-white dark:bg-slate-900 border-sky-500 dark:border-sky-500 shadow-md ring-2 ring-sky-500/20'
                        : 'bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            topic.urgencyLevel === 'Emergency'
                              ? 'bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                              : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          }`}>
                            {topic.urgencyLevel}
                          </span>
                          <span className="text-xs text-slate-400 capitalize">{topic.system}</span>
                        </div>
                        <h4 className={`font-bold text-sm sm:text-base mt-1.5 ${isSelected ? 'text-sky-950 dark:text-sky-300' : 'text-slate-900 dark:text-white'}`}>
                          {topic.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">{topic.englishTitle}</p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(topic.id, topic.title, topic.system);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          bookmarked ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50' : 'text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                        title="Đánh dấu mục tiêu quan trọng cần nhớ"
                      >
                        <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-500' : ''}`} />
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {topic.definition}
                    </p>

                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="text-red-600 dark:text-red-400 font-semibold flex items-center space-x-1">
                        <ShieldAlert className="w-3 h-3" />
                        <span>{topic.redFlags.length} dấu hiệu cờ đỏ</span>
                      </span>
                      {noteCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800">
                          {noteCount} ghi chú
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Right Side: Detailed Clinical Decision Support */}
        {currentTopic && (
          <div className={`${isSidebarCollapsed ? 'lg:col-span-11' : 'lg:col-span-8'} space-y-6 transition-all duration-200`}>
            {/* Header Box */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs relative">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      currentTopic.urgencyLevel === 'Emergency'
                        ? 'bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                        : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    }`}>
                      {currentTopic.urgencyLevel}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{currentTopic.system}</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {currentTopic.title}
                  </h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500 italic mt-0.5">{currentTopic.englishTitle}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {currentTopic.definition}
                  </p>
                </div>

                {/* Actions Toolbar */}
                <div className="flex items-center space-x-1.5 shrink-0">
                  <button
                    onClick={() => onOpenNotes(currentTopic.id, currentTopic.title)}
                    className="p-2 text-xs font-semibold rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200 dark:border-purple-800 transition-all shadow-2xs flex items-center justify-center"
                    title="Ghi chú kinh nghiệm cá nhân"
                    aria-label="Ghi chú"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleExportPDF}
                    className="p-2 text-xs font-bold rounded-xl bg-slate-900 dark:bg-sky-600 text-white hover:bg-slate-800 dark:hover:bg-sky-500 transition-all shadow-xs flex items-center justify-center"
                    title="Xuất phác đồ tiếp cận sang PDF"
                    aria-label="Xuất PDF"
                  >
                    <FileDown className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onToggleBookmark(currentTopic.id, currentTopic.title, currentTopic.system)}
                    className={`p-2 rounded-xl border transition-all ${
                      isBookmarked(currentTopic.id)
                        ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                    title="Đánh dấu mục tiêu quan trọng cần nhớ"
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked(currentTopic.id) ? 'fill-amber-500' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Pathophysiology Box */}
              <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                <strong className="text-slate-800 dark:text-white font-semibold block mb-0.5">Cơ chế sinh lý bệnh (Pathophysiology):</strong>
                {currentTopic.pathophysiology}
              </div>
            </div>

            {/* Red Flags Alert Card */}
            <div className="bg-red-50/90 dark:bg-red-950/40 rounded-2xl p-5 border border-red-200 dark:border-red-900/60 shadow-xs">
              <div className="flex items-center space-x-2 text-red-900 dark:text-red-300 font-bold text-sm mb-3">
                <div className="p-1.5 rounded-lg bg-red-600 text-white">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <span>DẤU HIỆU CẢNH BÁO ĐỎ (RED FLAGS - ĐE DỌA TÍNH MẠNG)</span>
              </div>
              <ul className="space-y-2">
                {currentTopic.redFlags.map((flag, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-red-950 dark:text-red-200 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-2" />
                    <span className="leading-relaxed">{flag}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interactive Decision Algorithm */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                  <GitFork className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <span>Cây Quyết Định Lâm Sàng Tương Tác (Interactive CDSS Algorithm)</span>
                </h3>
              </div>
              <AlgorithmViewer key={currentTopic.id} algorithm={currentTopic.algorithm} />
            </div>

            {/* Key History Questions: SOCRATES / OPQRST */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Khai Thác Bệnh Sử Trọng Tâm (SOCRATES / OPQRST)
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {currentTopic.keyHistoryQuestions.map((q, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded bg-sky-100/80 dark:bg-sky-950/80 inline-block">
                      {q.dimension}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white italic">
                      "{q.question}"
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 leading-relaxed">
                      💡 {q.clinicalMeaning}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Focused Physical Examination */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center space-x-2">
                <Stethoscope className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Triệu Chứng Thực Thể Then Chốt Cần Tìm
                </h3>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {currentTopic.physicalExamFocus.map((item, idx) => (
                  <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-start justify-between gap-2 text-xs sm:text-sm">
                    <div className="sm:w-1/3 font-bold text-slate-800 dark:text-slate-200">
                      {item.step}
                    </div>
                    <div className="sm:w-1/3 text-red-700 dark:text-red-400 font-semibold">
                      {item.finding}
                    </div>
                    <div className="sm:w-1/3 text-slate-600 dark:text-slate-300">
                      {item.meaning}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Differential Diagnosis Matrix */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Ma Trận Chẩn Đoán Phân Biệt & Cận Lâm Sàng Ban Đầu</span>
                </h3>
              </div>

              {currentTopic.differentialDiagnosis.map((cat, idx) => (
                <div key={idx} className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-1">
                    {cat.category}
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {cat.diseases.map((dis, dIdx) => (
                      <div 
                        key={dIdx}
                        className={`p-4 rounded-xl border ${
                          dis.priority === 'cannot-miss' 
                            ? 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50' 
                            : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <h5 className="font-bold text-sm text-slate-900 dark:text-white">{dis.name}</h5>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            dis.priority === 'cannot-miss'
                              ? 'bg-red-600 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                          }`}>
                            {dis.priority === 'cannot-miss' ? 'KHÔNG ĐƯỢC BỎ SÓT' : 'THƯỜNG GẶP'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          <strong className="text-slate-900 dark:text-white">Đặc điểm nhận biết:</strong> {dis.distinguishingFeatures}
                        </p>
                        <p className="text-xs text-sky-800 dark:text-sky-300 font-medium mt-1.5 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60">
                          🔬 <strong className="text-slate-900 dark:text-white">Cận lâm sàng ban đầu:</strong> {dis.initialInvestigation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Clinical Scores & Emergency Bundles */}
            {currentTopic.clinicalScores && currentTopic.clinicalScores.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
                <div className="flex items-center space-x-2">
                  <ClipboardList className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Thang Điểm Phân Tầng & Gói Xử Trí Khẩn (Scores & Bundles)
                  </h3>
                </div>
                <div className="space-y-5">
                  {currentTopic.clinicalScores.map((score, sIdx) => (
                    <div key={sIdx} className="space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{score.title}</h4>
                        {score.source && (
                          <span className="text-[11px] font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800 w-fit">
                            {score.source}
                          </span>
                        )}
                      </div>
                      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                          <thead>
                            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                              {score.headers.map((h, hIdx) => (
                                <th key={hIdx} className="px-3.5 py-2.5 font-bold border-b border-slate-200 dark:border-slate-700">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {score.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                {row.map((cell, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className={`px-3.5 py-2.5 align-top leading-relaxed ${
                                      cIdx === 0
                                        ? 'font-semibold text-slate-900 dark:text-white whitespace-nowrap'
                                        : 'text-slate-700 dark:text-slate-300'
                                    }`}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {score.notes && score.notes.length > 0 && (
                        <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-900/50 space-y-1">
                          {score.notes.map((n, nIdx) => (
                            <p key={nIdx} className="text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed">
                              • {n}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Initial Management & Escalation */}
            {currentTopic.initialManagement && currentTopic.initialManagement.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center space-x-2">
                  <Syringe className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Hướng Xử Trí Ban Đầu & Chỉ Định Hội Chẩn / Chuyển ICU
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-3.5">
                  {currentTopic.initialManagement.map((block, mIdx) => (
                    <div
                      key={mIdx}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 space-y-2"
                    >
                      <h4 className="font-bold text-sm text-teal-900 dark:text-teal-300">{block.title}</h4>
                      <ul className="space-y-1.5">
                        {block.items.map((item, iIdx) => (
                          <li key={iIdx} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-2" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      {block.alert && (
                        <div className="mt-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 font-medium flex items-start space-x-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                          <span>{block.alert}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clinical Case Studies */}
            {currentTopic.clinicalCases && currentTopic.clinicalCases.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Ca Lâm Sàng Minh Họa Thực Tế (Clinical Case Studies)
                  </h3>
                </div>
                <div className="space-y-4">
                  {currentTopic.clinicalCases.map((c, cIdx) => (
                    <div
                      key={cIdx}
                      className="p-4 sm:p-5 rounded-xl border border-sky-200/80 dark:border-sky-900/60 bg-sky-50/40 dark:bg-sky-950/20 space-y-3"
                    >
                      <div>
                        <h4 className="font-bold text-sm sm:text-base text-sky-950 dark:text-sky-200">{c.title}</h4>
                        <p className="text-xs font-semibold text-sky-700 dark:text-sky-400 mt-0.5">{c.patientSummary}</p>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        <strong className="text-slate-900 dark:text-white">Bệnh cảnh & Thăm khám: </strong>
                        {c.presentation}
                      </p>
                      <div className="space-y-1">
                        <strong className="text-xs sm:text-sm text-slate-900 dark:text-white block">Biện luận & Cận lâm sàng:</strong>
                        <ul className="space-y-1 pl-1">
                          {c.reasoningAndWorkup.map((rw, rwIdx) => (
                            <li key={rwIdx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start space-x-2 leading-relaxed">
                              <span className="text-sky-600 dark:text-sky-400 font-bold">•</span>
                              <span>{rw}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-3 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs sm:text-sm space-y-1">
                        <p className="font-bold text-emerald-900 dark:text-emerald-300">
                          Chẩn đoán xác định: {c.diagnosis}
                        </p>
                        <p className="text-emerald-950 dark:text-emerald-200 leading-relaxed">
                          <strong>Xử trí & Diễn tiến: </strong>
                          {c.managementAndOutcome}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resident Ward Rounds Pearls */}
            {currentTopic.residentClinicalPearls.length > 0 && (
              <div className="bg-gradient-to-r from-amber-50 dark:from-amber-950/40 via-orange-50 dark:via-orange-950/30 to-amber-100/60 dark:to-amber-900/30 rounded-2xl p-5 border border-amber-200 dark:border-amber-800/60 shadow-xs space-y-3">
                <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-300 font-bold text-sm">
                  <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span>KINH NGHIỆM ĐI BUỒNG NỘI TRÚ (WARD ROUNDS PEARLS)</span>
                </div>
                <div className="space-y-2">
                  {currentTopic.residentClinicalPearls.map((pearl, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                      <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <span className="font-medium leading-relaxed">{pearl}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AMA References */}
            {currentTopic.references && currentTopic.references.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
                <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
                  <BookOpen className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>Tài Liệu Tham Khảo (Chuẩn AMA)</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {currentTopic.references.map((ref, rIdx) => (
                    <li key={rIdx}>{ref}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
