import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  FileText, 
  AlertOctagon, 
  CheckCircle2, 
  Activity, 
  Droplet, 
  Scale, 
  Clock, 
  ShieldAlert, 
  ChevronRight,
  BookMarked,
  Crosshair,
  X
} from 'lucide-react';
import { LPProcedureGuide } from './LPProcedureGuide';

export const CSFGuide: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>('lp_procedure');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const topics = [
    { 
      id: 'lp_procedure', 
      label: 'Quy trình chọc dò DNT (LP)', 
      icon: Crosshair,
      keywords: ['chọc', 'chọc dò', 'thủ thuật', 'tuffier', 'l3-l4', 'l4-l5', 'mặt vát', 'quincke', 'áp kế', 'manometer', 'nón tủy', 'pop', 'tai biến', 'đau đầu', 'pdph', 'tư thế', 'con tôm', 'khe liên gai', '8 lớp', 'kim']
    },
    { 
      id: 'indices', 
      label: 'Ý nghĩa chỉ số DNT', 
      icon: Activity,
      keywords: ['chỉ số', 'áp lực mở', 'glucose', 'đường', 'protein', 'đạm', 'bạch cầu', 'wbc', 'lactate', 'màu sắc', 'đại thể']
    },
    { 
      id: 'sah_vs_traumatic', 
      label: 'SAH vs Chạm mạch', 
      icon: Scale,
      keywords: ['sah', 'chạm mạch', 'xuất huyết dưới nhện', 'xanthochromia', 'vàng chanh', '3 ống', 'nature 2023']
    },
    { 
      id: 'wbc_correction', 
      label: 'Hiệu chỉnh Bạch cầu', 
      icon: Droplet,
      keywords: ['hiệu chỉnh', 'công thức', 'bạch cầu thực tế', 'wbc', 'rbc', 'chạm mạch']
    },
    { 
      id: 'four_tubes', 
      label: 'Quy trình 4 Lọ DNT', 
      icon: FileText,
      keywords: ['4 lọ', 'lọ 1', 'lọ 2', 'lọ 3', 'lọ 4', 'ống nghiệm', 'hóa sinh', 'vi sinh', 'cấy', 'pcr']
    },
    { 
      id: 'ct_indications', 
      label: 'Chỉ định chụp CT trước LP', 
      icon: AlertOctagon,
      keywords: ['chỉ định ct', 'ct sọ', 'tụt não', 'chống chỉ định', 'phù gai thị', 'hôn mê']
    },
    { 
      id: 'spanos_rules', 
      label: 'Tiêu chuẩn vàng Spanos', 
      icon: CheckCircle2,
      keywords: ['spanos', 'tiêu chuẩn vàng', 'jama', 'viêm mủ', 'độ nhạy', 'đặc hiệu']
    },
    { 
      id: 'pitfalls', 
      label: 'Bẫy lâm sàng', 
      icon: ShieldAlert,
      keywords: ['bẫy lâm sàng', 'listeria', 'kháng sinh trước', 'hiv', 'crypto', 'nấm']
    },
  ];

  const filteredTopics = topics.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return t.label.toLowerCase().includes(q) || t.keywords.some((k) => k.includes(q));
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
      {/* Top Banner - Compact & Clean */}
      <div className="bg-gradient-to-r from-teal-700 via-indigo-700 to-sky-700 text-white p-4 sm:p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1">
              <BookOpen className="w-3 h-3" />
              Cẩm Nang Thực Hành Lâm Sàng
            </div>
            <h2 className="text-base sm:text-xl md:text-2xl font-bold">
              Hướng Dẫn Cơ Bản: Quy Trình Chọc Dò &amp; Biện Giải DNT
            </h2>
            <p className="text-[11px] sm:text-xs text-teal-100 mt-0.5 max-w-2xl">
              Y chứng theo Encephalitis 2022 (Kim KT), Dr Chandra Vaidyanath 2014, EFNS 2006, AAFP 2021 và Nature Sci Rep 2023.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-56 self-start sm:self-auto">
            <Search className="w-3.5 h-3.5 text-teal-300 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm nhanh (vd: chọc, tuffier, áp kế)..."
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                if (val.trim()) {
                  const match = topics.find(t => 
                    t.label.toLowerCase().includes(val.toLowerCase().trim()) || 
                    t.keywords.some(k => k.includes(val.toLowerCase().trim()))
                  );
                  if (match) setSelectedTopic(match.id);
                }
              }}
              className="w-full bg-white/10 placeholder-teal-200 text-white text-xs pl-8 pr-7 py-1.5 rounded-xl border border-white/20 focus:outline-hidden focus:bg-white focus:text-slate-900 focus:placeholder-slate-400 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile/Tablet Horizontal Scrollable Topics Bar */}
        <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pt-3 pb-1 -mx-2 px-2 scrollbar-none">
          {filteredTopics.map((t) => {
            const Icon = t.icon;
            const isSelected = selectedTopic === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTopic(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-teal-900 shadow-xs'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Layout: Desktop Sidebar + Content */}
      <div className="flex flex-col md:flex-row min-h-[500px]">
        {/* Desktop Sidebar (hidden on mobile/tablet because we have horizontal bar) */}
        <div className="hidden md:block w-64 bg-slate-50 dark:bg-slate-900/60 border-r border-slate-200 dark:border-slate-800 p-3 space-y-1 shrink-0">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 py-1.5">
            Mục Lục Hướng Dẫn {searchQuery && `(${filteredTopics.length})`}
          </div>
          {filteredTopics.map((t) => {
            const Icon = t.icon;
            const isSelected = selectedTopic === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTopic(t.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-teal-600 dark:bg-teal-600 text-white shadow-xs font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-teal-600 dark:text-teal-400'}`} />
                  <span className="truncate">{t.label}</span>
                </div>
                <ChevronRight className={`w-3 h-3 shrink-0 opacity-60 ${isSelected ? 'rotate-90' : ''}`} />
              </button>
            );
          })}

          <div className="mt-4 p-2.5 bg-teal-50 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/60 rounded-xl text-[11px] text-teal-800 dark:text-teal-300 space-y-1">
            <div className="font-bold flex items-center gap-1 text-teal-900 dark:text-teal-200">
              <BookMarked className="w-3 h-3" /> Tài liệu dẫn chiếu uy tín:
            </div>
            <ul className="text-[10px] space-y-0.5 text-teal-700 dark:text-teal-400">
              <li>• Encephalitis 2022: Lumbar Puncture (Kim KT)</li>
              <li>• Vaidyanath C: Clinical Procedures 2014</li>
              <li>• AAFP: Am Fam Physician 2021;103:422-428</li>
              <li>• EFNS: Eur J Neurol 2006;13:913-922</li>
              <li>• Nature: Sci Rep 2023;13:22310</li>
            </ul>
          </div>
        </div>

        {/* Content Pane */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          {/* TOPIC 0: LUMBAR PUNCTURE PROCEDURE */}
          {selectedTopic === 'lp_procedure' && <LPProcedureGuide />}

          {/* TOPIC 1 */}
          {selectedTopic === 'indices' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  1. Ý Nghĩa &amp; Khoảng Tham Chiếu Của Từng Chỉ Số DNT
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                  Biện giải giá trị lâm sàng của từng thông số xét nghiệm dịch não tủy thường quy.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm">Áp Lực Mở (Opening Pressure)</span>
                    <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.2 rounded font-mono">
                      60-250 mmH2O
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    <strong>Kỹ thuật:</strong> Đo bằng áp kế ở tư thế nằm nghiêng (lateral decubitus), chân duỗi nhẹ và bệnh nhân thư giãn.
                    <br />• <strong className="text-rose-600 dark:text-rose-400">&gt; 250 mmH2O:</strong> Tăng áp lực nội sọ (Viêm mủ 39% ca &gt; 300, Cryptococcus, u não, xuất huyết dưới nhện, IIH).
                    <br />• <strong className="text-amber-600 dark:text-amber-400">&lt; 60 mmH2O:</strong> Giảm áp lực nội sọ tự phát (SIH) hoặc rò rỉ DNT.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm">Đường DNT &amp; Tỷ Số CSF/Serum</span>
                    <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.2 rounded font-mono">
                      Tỷ số &ge; 0.6
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    <strong>Nguyên lý:</strong> Bắt buộc đo đường huyết cùng lúc.
                    <br />• <strong className="text-rose-600 dark:text-rose-400">Tỷ số &lt; 0.4 hoặc &lt; 34 mg/dL:</strong> Vi khuẩn mủ, Lao màng não, hoặc Nấm tiêu thụ glucose cực mạnh.
                    <br />• <strong>Tỷ số bình thường (&ge; 0.5):</strong> Ủng hộ Vi rút hoặc hội chứng tự miễn/GBS.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm">Protein Toàn Phần</span>
                    <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.2 rounded font-mono">
                      15-45 mg/dL
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    • <strong className="text-rose-600 dark:text-rose-400">&gt; 220 mg/dL:</strong> Thỏa tiêu chuẩn Spanos (&gt;99% viêm mủ) hoặc Lao màng não.
                    <br />• <strong className="text-purple-600 dark:text-purple-400">Tăng cao đơn độc với tế bào bình thường:</strong> Hiện tượng phân ly Đạm - Tế bào trong Hội chứng Guillain-Barré.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm">Bạch Cầu &amp; Dòng Tế Bào</span>
                    <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.2 rounded font-mono">
                      &le; 5 /µL
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    • <strong className="text-rose-600 dark:text-rose-400">&gt; 1,000 /µL và &ge; 80% PMN:</strong> Viêm màng não mủ cấp tính.
                    <br />• <strong className="text-teal-600 dark:text-teal-400">10 - 500 /µL và Lympho &gt; 60%:</strong> Vi rút, Lao, hoặc Nấm.
                    <br />• <strong className="text-amber-600 dark:text-amber-400">Eosinophils &ge; 10 /µL:</strong> Ký sinh trùng (Angiostrongylus) hoặc dị ứng thuốc.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm">Lactate DNT</span>
                    <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.2 rounded font-mono">
                      1.3-2.4 mmol/L
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Lactate DNT độc lập với máu. <strong className="text-rose-600 dark:text-rose-400">&gt; 3.9 mmol/L</strong> có độ nhạy 93-95% và độ đặc hiệu 94-99% phân biệt mủ vs vô khuẩn (rất hữu ích ở bệnh nhân sau phẫu thuật sọ não / EVD).
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm">Màu Sắc &amp; Đại Thể</span>
                    <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.2 rounded font-mono">
                      Trong suốt
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    • <strong>Đục / Mủ:</strong> Bạch cầu &gt; 200/µL.
                    <br />• <strong>Vàng chanh (Xanthochromia):</strong> Bilirubin do giáng hóa RBC trong màng nhện sau 6-12h xuất huyết.
                    <br />• <strong>Màng mạng nhện (Pellicle):</strong> Dấu hiệu kinh điển của Lao màng não.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TOPIC 2 */}
          {selectedTopic === 'sah_vs_traumatic' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  2. Phân Biệt Xuất Huyết Dưới Nhện (SAH) &amp; Chọc Dò Chạm Mạch
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                  Nghiên cứu Nature Scientific Reports (2023) &amp; Hướng dẫn EFNS.
                </p>
              </div>

              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-2.5">Tiêu chí</th>
                      <th className="p-2.5 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300">Xuất Huyết Dưới Nhện (SAH)</th>
                      <th className="p-2.5 bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300">Chọc Chạm Mạch (Traumatic Tap)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                    <tr>
                      <td className="p-2.5 font-semibold text-slate-900 dark:text-slate-100">Test 3 ống nghiệm</td>
                      <td className="p-2.5">Hồng cầu không đổi hoặc giảm &lt; 30%</td>
                      <td className="p-2.5">Hồng cầu <strong>giảm &ge; 60%</strong> từ ống 1 sang ống 4</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-slate-900 dark:text-slate-100">Dịch nổi (Supernatant)</td>
                      <td className="p-2.5 font-bold text-red-600 dark:text-red-400">Vàng chanh (Xanthochromia) sau ly tâm</td>
                      <td className="p-2.5 font-bold text-sky-600 dark:text-sky-400">Trong suốt (Clear) hoàn toàn</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-slate-900 dark:text-slate-100">Đông máu</td>
                      <td className="p-2.5">Không đông (đã defibrinogen hóa)</td>
                      <td className="p-2.5">Có thể tạo cục máu nhỏ</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  Mô hình hiệu chỉnh Hồng cầu theo thời gian (Nature 2023):
                </div>
                <div className="p-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/60 rounded-lg font-mono text-center text-indigo-700 dark:text-indigo-300 font-bold">
                  RBC_adjusted = RBC_đo &times; e^[0.281 &times; (Số_ngày - 1)]
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  • <strong>Loại trừ SAH (99.8% NPV):</strong> RBC_adjusted &le; 3,667/µL VÀ dịch nổi trong suốt.
                  <br />• <strong>Cảnh báo SAH:</strong> RBC_adjusted &gt; 3,667/µL VÀ dịch nổi vàng chanh &rarr; 78.8% là SAH thực sự.
                </p>
              </div>
            </div>
          )}

          {/* TOPIC 3 */}
          {selectedTopic === 'wbc_correction' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  3. Công Thức Hiệu Chỉnh Bạch Cầu Khi Chạm Mạch
                </h3>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-2 text-xs">
                <h4 className="font-bold text-slate-800 dark:text-slate-100">Phương pháp tỷ số máu ngoại vi:</h4>
                <div className="p-2.5 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/60 rounded-lg font-mono text-center text-indigo-900 dark:text-indigo-300 font-bold">
                  Bạch cầu lẫn vào = Hồng cầu DNT &times; [ WBC Máu / RBC Máu ]
                  <br />
                  WBC thực tế = WBC DNT - Bạch cầu lẫn vào
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  Quy tắc kinh nghiệm: Cứ 500-1000 RBC trong DNT mang theo ~1 WBC ngoại vi.
                </p>
              </div>
            </div>
          )}

          {/* TOPIC 4 */}
          {selectedTopic === 'four_tubes' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  4. Quy Trình Chuẩn 4 Lọ Mẫu DNT
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 rounded-xl space-y-1">
                  <span className="font-bold text-sky-900 dark:text-sky-300 block">Ống 1: Tế Bào</span>
                  <p className="text-slate-600 dark:text-slate-300">Đếm số lượng tế bào ban đầu.</p>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl space-y-1">
                  <span className="font-bold text-emerald-900 dark:text-emerald-300 block">Ống 2: Hóa Sinh</span>
                  <p className="text-slate-600 dark:text-slate-300">Protein, Glucose, Lactate.</p>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl space-y-1">
                  <span className="font-bold text-amber-900 dark:text-amber-300 block">Ống 3: Vi Sinh</span>
                  <p className="text-slate-600 dark:text-slate-300">Soi Gram, cấy vi khuẩn &amp; KSĐ.</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 rounded-xl space-y-1">
                  <span className="font-bold text-purple-900 dark:text-purple-300 block">Ống 4: Đối Chiếu</span>
                  <p className="text-slate-600 dark:text-slate-300">Đếm lại tế bào (3 ống), PCR, Nấm, Lao.</p>
                </div>
              </div>
            </div>
          )}

          {/* TOPIC 5 */}
          {selectedTopic === 'ct_indications' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  5. Chỉ Định Bắt Buộc Chụp CT Sọ Não Trước Khi Chọc Dò
                </h3>
              </div>

              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl space-y-2 text-xs text-rose-950 dark:text-rose-200">
                <span className="font-bold block">Chỉ định CT sọ trước chọc dò nếu có ít nhất 1 dấu hiệu:</span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 list-disc list-inside">
                  <li>Tuổi &gt; 60</li>
                  <li>Suy giảm miễn dịch (HIV, ghép, steroid)</li>
                  <li>Tiền sử bệnh lý CNS (u não, đột quỵ)</li>
                  <li>Co giật mới xuất hiện (&lt; 1 tuần)</li>
                  <li>Rối loạn tri giác / hôn mê</li>
                  <li>Dấu thần kinh khu trú / Phù gai thị</li>
                </ul>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-900 dark:text-amber-200">
                <strong>Quy tắc vàng:</strong> Tuyệt đối không hoãn kháng sinh để chờ CT! Hãy cấy máu và tiêm kháng sinh ngay trước khi đưa bệnh nhân đi chụp.
              </div>
            </div>
          )}

          {/* TOPIC 6 */}
          {selectedTopic === 'spanos_rules' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  6. Tiêu Chuẩn Vàng Spanos (JAMA / AAFP)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl dark:text-slate-200">
                  <strong className="text-slate-900 dark:text-slate-100">1. Đường DNT &lt; 34 mg/dL</strong> (&lt; 1.89 mmol/L)
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl dark:text-slate-200">
                  <strong className="text-slate-900 dark:text-slate-100">2. Protein DNT &gt; 220 mg/dL</strong> (&gt; 2.2 g/L)
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl dark:text-slate-200">
                  <strong className="text-slate-900 dark:text-slate-100">3. Bạch cầu DNT &gt; 2,000 /µL</strong>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl dark:text-slate-200">
                  <strong className="text-slate-900 dark:text-slate-100">4. Bạch cầu đa nhân PMN &gt; 1,180 /µL</strong>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Thỏa mãn bất kỳ 1 tiêu chí nào &rarr; độ chắc chắn &gt; 99% cho viêm màng não mủ cấp tính.
              </p>
            </div>
          )}

          {/* TOPIC 7 */}
          {selectedTopic === 'pitfalls' && (
            <div className="space-y-3 text-xs">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  7. Các Bẫy Lâm Sàng Cần Lưu Ý
                </h3>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-slate-100">1. Kháng sinh dùng trước:</strong> Giảm tỷ lệ dương tính Gram và cấy từ 10-20%. Hãy dựa vào Multiplex PCR và Lactate DNT.
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-slate-100">2. Listeria ở người cao tuổi:</strong> Nhuộm Gram âm tính tới 66% ca, tế bào có thể ưu thế đơn nhân. Cần thêm Ampicillin.
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-slate-100">3. Bệnh nhân HIV/suy giảm miễn dịch nặng:</strong> Bạch cầu DNT có thể hoàn toàn không tăng dù nhiễm nấm Cryptococcus nặng. Cần làm CrAg test nhanh.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
