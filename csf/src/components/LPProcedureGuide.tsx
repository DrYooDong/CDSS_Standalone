import React, { useState } from 'react';
import { 
  Crosshair, 
  Layers, 
  Gauge, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  BookMarked,
  Info,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Eye,
  Maximize2,
  Image as ImageIcon
} from 'lucide-react';

export const LPProcedureGuide: React.FC = () => {
  const [subTab, setSubTab] = useState<'anatomy' | 'layers' | 'bevel' | 'steps' | 'complications'>('anatomy');
  const [activeLayer, setActiveLayer] = useState<number | null>(null);
  const [anatomyFocus, setAnatomyFocus] = useState<'all' | 'tuffier' | 'safe_gap' | 'conus'>('all');
  const [viewStyle, setViewStyle] = useState<'both' | 'photo' | 'diagram'>('both');
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<{ src: string; title: string; desc: string; source: string } | null>(null);

  const layersData = [
    { num: 1, name: '1. Da (Skin)', depth: '0 - 2 mm', desc: 'Sát khuẩn kỹ hình xoắn ốc bằng Povidone-Iodine hoặc Chlorhexidine. Gây tê nốt phồng da (wheal) bằng Lidocaine 1%.', sensation: 'Châm kim tiêm tê', color: 'fill-amber-200 stroke-amber-500' },
    { num: 2, name: '2. Mô dưới da (Subcutaneous tissue)', depth: '2 - 20 mm', desc: 'Mô mỡ lỏng lẻo. Gây tê sâu dọc theo đường kim dự kiến, hướng nhẹ về phía rốn (rostral).', sensation: 'Sức cản nhẹ, kim đi êm', color: 'fill-amber-100 stroke-amber-400' },
    { num: 3, name: '3. Dây chằng trên gai (Supraspinous)', depth: '20 - 25 mm', desc: 'Dải xơ chắc kết nối các đỉnh mỏm gai đốt sống từ C7 đến xương cùng. Giữ kim đi chính giữa đường giữa (Midline).', sensation: 'Cảm giác bắt đầu chắc tay', color: 'fill-blue-200 stroke-blue-500' },
    { num: 4, name: '4. Dây chằng liên gai (Interspinous)', depth: '25 - 35 mm', desc: 'Nằm giữa hai mỏm gai kế cận, dẫn đường cho kim tiến thẳng vuông góc mặt phẳng lưng.', sensation: 'Sức cản xơ vừa phải', color: 'fill-indigo-200 stroke-indigo-500' },
    { num: 5, name: '5. Dây chằng vàng (Ligamentum flavum) ★', depth: '35 - 42 mm', desc: 'Mô đàn hồi dày nối các cung đốt sống. Bác sĩ cảm nhận rõ sức cản tăng lên rõ rệt (Tough resistance) như xuyên qua da dày cao su.', sensation: 'SỨC CẢN DAI NẶNG TAY', color: 'fill-yellow-300 stroke-yellow-600' },
    { num: 6, name: '6. Khoang ngoài màng cứng (Epidural space)', depth: '42 - 44 mm', desc: 'Khoang ảo chứa mỡ lỏng và đám rối tĩnh mạch đốt sống trong. Chọc lệch trục dễ gây chạm mạch (Traumatic tap) tại đây.', sensation: 'Sức cản giảm thoáng qua', color: 'fill-rose-100 stroke-rose-400' },
    { num: 7, name: '7. Màng cứng & Màng nhện (Dura & Arachnoid) ★', depth: '44 - 47 mm', desc: 'Khoảnh khắc quyết định: Bác sĩ cảm nhận tiếng "Sụp hẫng" hoặc "Pop sensation" rõ rệt khi mũi kim xuyên thủng lá màng cứng chắc.', sensation: 'TIẾNG "POP" SỤP HẪNG', color: 'fill-purple-200 stroke-purple-600' },
    { num: 8, name: '8. Khoang dưới nhện (Subarachnoid space) 🎯', depth: '45 - 55 mm', desc: 'ĐÍCH ĐẾN AN TOÀN: Bể DNT thắt lưng (Lumbar cistern) chứa dịch não tủy và rễ chùm đuôi ngựa lơ lửng. Rút nòng stylet dịch sẽ nhỏ giọt tự nhiên.', sensation: 'DNT chảy nhỏ giọt', color: 'fill-cyan-100 stroke-cyan-500' },
  ];

  return (
    <div className="space-y-5">
      {/* Sub-header Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-slate-800 to-indigo-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-teal-700/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-teal-500/20 text-teal-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <Crosshair className="w-3 h-3 text-teal-300" />
              Thủ Thuật Lâm Sàng Chuyên Sâu
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold flex items-center gap-2">
              Quy Trình Kỹ Thuật Chọc Dò Dịch Não Tủy (Lumbar Puncture)
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-300 max-w-2xl">
              Tích hợp Atlas giải phẫu thực tế và sơ đồ chuẩn theo Hướng dẫn <strong>Encephalitis 2022 (Kim KT)</strong> và Giáo trình <strong>Dr Chandra Vaidyanath (2014)</strong>.
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 bg-white/10 p-1 rounded-xl">
            <span className="text-[11px] font-semibold text-teal-200 px-2">Vị trí chọc chuẩn:</span>
            <span className="text-[11px] font-bold bg-teal-600 text-white px-2.5 py-0.5 rounded-lg shadow-2xs font-mono">
              Khe L3 - L4 hoặc L4 - L5
            </span>
          </div>
        </div>

        {/* Sub-Tabs Nav */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3.5 mt-2 border-t border-white/15 scrollbar-none">
          {[
            { id: 'anatomy', label: '1. Mốc Giải Phẫu & Tư Thế', icon: Crosshair },
            { id: 'layers', label: '2. Sơ Đồ 8 Lớp Kim Xuyên', icon: Layers },
            { id: 'bevel', label: '3. Hướng Mặt Vát & Áp Kế', icon: Gauge },
            { id: 'steps', label: '4. Các Bước Thực Hành', icon: CheckCircle2 },
            { id: 'complications', label: '5. Chống Chỉ Định & Tai Biến', icon: AlertTriangle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-200 hover:bg-white/15'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-teal-700' : 'text-teal-300'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-TAB 1: ANATOMY & POSITIONING */}
      {subTab === 'anatomy' && (
        <div className="space-y-4">
          {/* Interactive Landmark Filters */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-100 dark:bg-slate-800/80 p-2 rounded-xl text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-1 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                Mốc quan sát:
              </span>
              <button
                onClick={() => setAnatomyFocus('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  anatomyFocus === 'all'
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Toàn cảnh
              </button>
              <button
                onClick={() => setAnatomyFocus('tuffier')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  anatomyFocus === 'tuffier'
                    ? 'bg-amber-500 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-amber-600'
                }`}
              >
                1. Đường Tuffier (Mào chậu ↔ L4)
              </button>
              <button
                onClick={() => setAnatomyFocus('safe_gap')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  anatomyFocus === 'safe_gap'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
                }`}
              >
                2. Điểm chọc L3 - L4 ★
              </button>
              <button
                onClick={() => setAnatomyFocus('conus')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  anatomyFocus === 'conus'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
                }`}
              >
                3. Nón tủy L1 - L2 (Nguy hiểm)
              </button>
            </div>

            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px]">
              <button
                onClick={() => setViewStyle('both')}
                className={`px-2 py-0.5 rounded font-bold cursor-pointer ${viewStyle === 'both' ? 'bg-teal-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setViewStyle('photo')}
                className={`px-2 py-0.5 rounded font-bold cursor-pointer ${viewStyle === 'photo' ? 'bg-teal-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
              >
                Ảnh Thực Tế
              </button>
              <button
                onClick={() => setViewStyle('diagram')}
                className={`px-2 py-0.5 rounded font-bold cursor-pointer ${viewStyle === 'diagram' ? 'bg-teal-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
              >
                Sơ Đồ Vector
              </button>
            </div>
          </div>

          {/* SECTION 1A: REAL CLINICAL ATLAS PHOTOS FROM LITERATURE */}
          {(viewStyle === 'both' || viewStyle === 'photo') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Photo 1: Tuffier's Line on patient */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-lg text-xs font-bold font-mono">
                      Hình 1
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                      Mốc Đường Tuffier Trên Người Bệnh Thực Tế
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Vaidyanath (2014)</span>
                </div>

                <div 
                  className="relative p-2 bg-slate-950/5 dark:bg-slate-950 flex items-center justify-center cursor-pointer group"
                  onClick={() => setSelectedPhotoModal({
                    src: './assets/lp_guide/lp_tuffier_line.png',
                    title: 'Hình 1: Xác định đường Tuffier trên bệnh nhân nằm nghiêng',
                    desc: 'Đường ngang nối hai điểm cao nhất của mào chậu (Iliac crest) cắt ngang mỏm gai L4. Khoảng liên gai L3-L4 nằm ngay phía trên là vị trí chọc dò tối ưu.',
                    source: 'Dr Chandra Vaidyanath - Essence of clinical procedures for medical students (2014)'
                  })}
                >
                  <img 
                    src="./assets/lp_guide/lp_tuffier_line.png" 
                    alt="Đường Tuffier nối hai mào chậu và khe liên gai L3-L4"
                    className="max-h-[220px] w-auto object-contain rounded-xl shadow-xs transition-transform group-hover:scale-[1.01]" 
                  />
                  <div className="absolute top-3 right-3 bg-slate-900/70 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="p-3 text-xs text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
                  <p>
                    📍 <strong>Đường Tuffier (Intercristal line):</strong> Đường nối 2 mào chậu cắt ngang đốt sống L4. Khi sờ nắn bằng tay, bác sĩ định vị gai L4 rồi chọn khe <strong>L3 - L4</strong> (ngay trên) hoặc <strong>L4 - L5</strong> (ngay dưới) để đưa kim vào.
                  </p>
                </div>
              </div>

              {/* Photo 2: MRI scan of conus medullaris */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1 bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 rounded-lg text-xs font-bold font-mono">
                      Hình 2
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                      MRI Cột Sống: Tận Cùng Tủy Sống Ở L1 - L2
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Vaidyanath (2014)</span>
                </div>

                <div 
                  className="relative p-2 bg-slate-950/5 dark:bg-slate-950 flex items-center justify-center cursor-pointer group"
                  onClick={() => setSelectedPhotoModal({
                    src: './assets/lp_guide/lp_mri_conus.png',
                    title: 'Hình 2: Phim MRI chứng minh vị trí nón tủy và vùng an toàn L3-L4',
                    desc: 'Tủy sống người trưởng thành tận cùng ở đốt L1-L2 (1: Nón tủy). Bên dưới là bể DNT thắt lưng kéo dài đến S2 (3: Thân đốt L5). Do đó, chọc dò ở L3-L4 hoặc L4-L5 an toàn tuyệt đối, không thể chạm vào tủy sống.',
                    source: 'Dr Chandra Vaidyanath - Essence of clinical procedures for medical students (2014)'
                  })}
                >
                  <img 
                    src="./assets/lp_guide/lp_mri_conus.png" 
                    alt="Phim MRI cột sống thắt lưng minh chứng nón tủy tận cùng ở L1-L2"
                    className="max-h-[220px] w-auto object-contain rounded-xl shadow-xs transition-transform group-hover:scale-[1.01]" 
                  />
                  <div className="absolute top-3 right-3 bg-slate-900/70 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="p-3 text-xs text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
                  <p>
                    ⚠️ <strong>Cơ sở an toàn tủy sống:</strong> Tủy sống tận cùng bằng nón tủy ở <strong>L1 - L2</strong>. Từ L2 trở xuống chỉ có dịch não tủy và rễ thần kinh chùm đuôi ngựa lơ lửng tự do. Tuyệt đối <em>không chọc ở L1-L2 hoặc cao hơn</em>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 1B: ANATOMICALLY CORRECT INTERACTIVE VECTOR SCHEMATIC */}
          {(viewStyle === 'both' || viewStyle === 'diagram') && (
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wide text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <Crosshair className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  Sơ Đồ Giải Phẫu Chuẩn Xác: Trục Đốt Sống vs Hướng Đâm Kim Từ Phía Lưng
                </span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  Giải phẫu đúng chiều: Kim đâm từ sau lưng (phải) vào khoang DNT
                </span>
              </div>

              {/* Corrected Vector SVG: Anterior (Vertebrae) on LEFT, Posterior (Skin/Needle) on RIGHT */}
              <div className="w-full bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-x-auto">
                <svg viewBox="0 0 680 290" className="w-full min-w-[580px] h-auto max-h-[290px]" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="safeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#059669" stopOpacity="0.3" />
                    </linearGradient>
                    <linearGradient id="dangerGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#dc2626" stopOpacity="0.35" />
                    </linearGradient>
                  </defs>

                  {/* Orientation Guide Headers */}
                  <rect x="15" y="10" width="160" height="22" rx="4" fill="#0f766e" />
                  <text x="95" y="25" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="bold">PHÍA TRƯỚC (BỤNG / THÂN ĐỐT)</text>

                  <rect x="490" y="10" width="170" height="22" rx="4" fill="#312e81" />
                  <text x="575" y="25" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="bold">PHÍA SAU (LƯNG / MỎM GAI &amp; DA)</text>

                  {/* Danger Zone (T12 - L2) */}
                  <g opacity={anatomyFocus === 'all' || anatomyFocus === 'conus' ? 1 : 0.2}>
                    <rect x="15" y="40" width="650" height="75" rx="6" fill="url(#dangerGrad)" stroke="#f87171" strokeWidth="1" strokeDasharray="3 2" />
                    <text x="350" y="58" textAnchor="middle" fill="#dc2626" fontSize="9" fontWeight="bold">⛔ VÙNG CẤM CHỌC: CÓ TỦY SỐNG (NÓN TỦY TẬN CÙNG Ở L1-L2)</text>
                  </g>

                  {/* Safe Zone (L3 - L5) */}
                  <g opacity={anatomyFocus === 'all' || anatomyFocus === 'safe_gap' ? 1 : 0.2}>
                    <rect x="15" y="122" width="650" height="150" rx="6" fill="url(#safeGrad)" stroke="#34d399" strokeWidth="1.5" />
                    <text x="350" y="137" textAnchor="middle" fill="#059669" fontSize="9" fontWeight="bold">✔ VÙNG AN TOÀN TUYỆT ĐỐI (L3-L4 HOẶC L4-L5): CHỈ CHỨA DNT VÀ RỄ CHÙM ĐUÔI NGỰA</text>
                  </g>

                  {/* Vertebral Bodies Column (ANTERIOR: x=40 to x=110) */}
                  {/* T12 */}
                  <rect x="40" y="45" width="70" height="18" rx="3" fill="#94a3b8" />
                  <text x="75" y="58" textAnchor="middle" fill="#fff" fontSize="8.5" fontWeight="bold">Thân T12</text>
                  {/* L1 */}
                  <rect x="40" y="68" width="70" height="18" rx="3" fill="#94a3b8" />
                  <text x="75" y="81" textAnchor="middle" fill="#fff" fontSize="8.5" fontWeight="bold">Thân L1</text>
                  {/* L2 */}
                  <rect x="40" y="91" width="70" height="18" rx="3" fill="#94a3b8" />
                  <text x="75" y="104" textAnchor="middle" fill="#fff" fontSize="8.5" fontWeight="bold">Thân L2</text>

                  {/* L3 */}
                  <rect x="40" y="145" width="70" height="22" rx="3" fill="#0d9488" stroke="#14b8a6" strokeWidth="1.5" />
                  <text x="75" y="160" textAnchor="middle" fill="#fff" fontSize="9.5" fontWeight="bold">Thân L3</text>
                  {/* L4 */}
                  <rect x="40" y="185" width="70" height="22" rx="3" fill="#0d9488" stroke="#14b8a6" strokeWidth="1.5" />
                  <text x="75" y="200" textAnchor="middle" fill="#fff" fontSize="9.5" fontWeight="bold">Thân L4</text>
                  {/* L5 */}
                  <rect x="40" y="222" width="70" height="20" rx="3" fill="#64748b" />
                  <text x="75" y="236" textAnchor="middle" fill="#fff" fontSize="8.5" fontWeight="bold">Thân L5</text>
                  {/* Sacrum */}
                  <path d="M 40 248 L 110 248 L 95 268 L 55 268 Z" fill="#475569" />
                  <text x="75" y="261" textAnchor="middle" fill="#fff" fontSize="7.5" fontWeight="bold">Xương cùng</text>

                  {/* Spinal Canal (Subarachnoid Space / Dural Sac: x=145 to x=195) */}
                  {/* Dural Tube outline */}
                  <rect x="145" y="42" width="50" height="225" rx="6" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5" />
                  <text x="170" y="260" textAnchor="middle" fill="#0284c7" fontSize="8" fontWeight="bold">Khoang DNT</text>

                  {/* Spinal Cord (Solid Red ending at L1-L2) */}
                  <rect x="155" y="42" width="30" height="60" rx="4" fill="#ef4444" />
                  <polygon points="155,102 185,102 170,118" fill="#dc2626" />
                  <text x="170" y="75" textAnchor="middle" fill="#fff" fontSize="7.5" fontWeight="bold">TỦY SỐNG</text>
                  <text x="170" y="112" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="bold">Nón tủy</text>

                  {/* Cauda Equina Rootlets (Floating below L2) */}
                  {[152, 160, 168, 176, 184].map((lx, idx) => (
                    <line key={idx} x1={lx} y1="120" x2={lx + (idx % 2 === 0 ? 3 : -3)} y2="250" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4 3" />
                  ))}

                  {/* Posterior Spinous Processes (x=240 to x=360) */}
                  {/* L1 Spinous */}
                  <path d="M 195 72 L 280 82 L 275 92 L 195 80 Z" fill="#cbd5e1" />
                  <text x="290" y="88" fill="#64748b" fontSize="8" fontWeight="bold">Gai L1</text>
                  {/* L2 Spinous */}
                  <path d="M 195 95 L 285 106 L 280 116 L 195 103 Z" fill="#cbd5e1" />
                  <text x="295" y="112" fill="#64748b" fontSize="8" fontWeight="bold">Gai L2</text>
                  {/* L3 Spinous */}
                  <path d="M 195 148 L 300 160 L 295 172 L 195 158 Z" fill="#0d9488" opacity="0.8" />
                  <text x="310" y="167" fill="#0f766e" fontSize="9" fontWeight="bold">Gai L3</text>
                  {/* L4 Spinous (Intersecting Tuffier) */}
                  <path d="M 195 188 L 305 202 L 300 214 L 195 198 Z" fill="#0d9488" opacity="0.8" />
                  <text x="315" y="209" fill="#0f766e" fontSize="9" fontWeight="bold">Gai L4 (Mào chậu)</text>
                  {/* L5 Spinous */}
                  <path d="M 195 225 L 290 238 L 285 248 L 195 233 Z" fill="#cbd5e1" />
                  <text x="300" y="244" fill="#64748b" fontSize="8" fontWeight="bold">Gai L5</text>

                  {/* Interspinous Ligaments (Pink bands between spines) */}
                  <polygon points="195,160 295,172 300,202 195,188" fill="#fda4af" opacity="0.5" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2 2" />
                  <text x="250" y="185" textAnchor="middle" fill="#be123c" fontSize="7.5" fontWeight="bold">D.C liên gai</text>

                  {/* Ligamentum Flavum (Yellow band on posterior dural wall) */}
                  <rect x="195" y="125" width="8" height="125" rx="2" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
                  <text x="207" y="152" fill="#a16207" fontSize="7.5" fontWeight="bold">D.C VÀNG</text>

                  {/* Back Skin Layer (x=450) */}
                  <line x1="450" y1="40" x2="450" y2="265" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
                  <text x="460" y="60" fill="#d97706" fontSize="8.5" fontWeight="bold">Mặt da lưng</text>

                  {/* Tuffier's Line (Connects Iliac crests at L4 level y=209) */}
                  <g opacity={anatomyFocus === 'all' || anatomyFocus === 'tuffier' ? 1 : 0.25}>
                    <line x1="20" y1="209" x2="470" y2="209" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 3" />
                    <rect x="475" y="198" width="175" height="20" rx="4" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" />
                    <text x="562" y="212" textAnchor="middle" fill="#92400e" fontSize="8" fontWeight="bold">Đường Tuffier (2 mào chậu ↔ L4)</text>
                  </g>

                  {/* NEEDLE ENTERING SAFELY FROM POSTERIOR (RIGHT) THROUGH L3-L4 GAP */}
                  <g opacity={anatomyFocus === 'all' || anatomyFocus === 'safe_gap' ? 1 : 0.25}>
                    {/* Entry path line from x=590 through skin x=450 into canal x=185 at y=177 */}
                    <line x1="580" y1="182" x2="185" y2="177" stroke="#0284c7" strokeWidth="3" />
                    <polygon points="185,177 195,174 195,180" fill="#0284c7" />
                    
                    {/* Needle Hub on the right */}
                    <rect x="580" y="173" width="35" height="18" rx="4" fill="#0284c7" />
                    <text x="597" y="185" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">Đốc kim</text>

                    {/* Target Entry Bullseye at L3-L4 gap */}
                    <circle cx="185" cy="177" r="9" fill="#10b981" fillOpacity="0.3" stroke="#059669" strokeWidth="2" />
                    <circle cx="185" cy="177" r="3.5" fill="#059669" />

                    {/* Needle Callout */}
                    <rect x="330" y="148" width="130" height="20" rx="4" fill="#ecfdf5" stroke="#10b981" strokeWidth="1" />
                    <text x="395" y="161" textAnchor="middle" fill="#065f46" fontSize="8" fontWeight="bold">★ Mũi kim vào bể DNT khe L3-L4</text>
                  </g>
                </svg>
              </div>

              {/* Dynamic Landmark Clinical Insights */}
              <div className="p-3 rounded-xl border text-xs transition-all bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                {anatomyFocus === 'all' && (
                  <p className="text-slate-600 dark:text-slate-300">
                    💡 <strong>Nguyên tắc vàng:</strong> Kim chọc từ <strong>mặt da sau lưng</strong> đi xuyên qua khoảng liên gai giữa hai mỏm gai L3 và L4, xuyên qua dây chằng vàng và màng cứng để vào <strong>bể dịch não tủy thắt lưng</strong>. Thân đốt sống nằm ở phía trước đóng vai trò như thành chặn an toàn nếu kim đi quá sâu.
                  </p>
                )}
                {anatomyFocus === 'tuffier' && (
                  <p className="text-amber-800 dark:text-amber-300">
                    📍 <strong>Đường Tuffier (Intercristal line):</strong> Nối 2 mào chậu cắt cột sống tại gai L4. Chọn khe L3-L4 ngay phía trên để đảm bảo an toàn tuyệt đối, vì sờ nắn bằng tay có thể chệch lên trên 1 đốt sống.
                  </p>
                )}
                {anatomyFocus === 'safe_gap' && (
                  <p className="text-emerald-800 dark:text-emerald-300">
                    🎯 <strong>Khe L3 - L4 (Vị trí lựa chọn #1):</strong> Nằm cách xa nón tủy, khoang liên gai rộng rãi, kim đi vào chỉ gặp các rễ chùm đuôi ngựa lơ lửng trong dịch não tủy, hoàn toàn không gây tổn thương thần kinh vĩnh viễn.
                  </p>
                )}
                {anatomyFocus === 'conus' && (
                  <p className="text-rose-800 dark:text-rose-300">
                    ⚠️ <strong>Nón tủy (Conus Medullaris):</strong> Kết thúc ở mức đĩa đệm L1-L2 (như thấy trên phim MRI ở Hình 2). Tuyệt đối <strong>không chọc dò ở L1 - L2 hoặc cao hơn</strong> vì có thể đâm trực tiếp vào nhu mô tủy sống gây liệt hai chi dưới.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: 8 ANATOMICAL LAYERS */}
      {subTab === 'layers' && (
        <div className="space-y-4">
          {/* Real Clinical Atlas Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Figure 5: Spinal needle trajectory */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 rounded-lg text-xs font-bold font-mono">
                    Hình 3
                  </span>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                    Đường Đi Kim Qua Các Lớp Vào Khoang Dưới Nhện
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Vaidyanath (2014)</span>
              </div>

              <div 
                className="relative p-2 bg-slate-950/5 dark:bg-slate-950 flex items-center justify-center cursor-pointer group"
                onClick={() => setSelectedPhotoModal({
                  src: './assets/lp_guide/lp_needle_trajectory.png',
                  title: 'Hình 3: Đường đi của kim tủy sống qua mỏm gai và dây chằng vàng',
                  desc: 'Kim tủy sống đi từ phía sau qua dây chằng liên gai, vượt qua dây chằng vàng (Ligamentum flavum), xuyên thủng màng cứng (Dura) và vào khoang dưới nhện (Subarachnoid space).',
                  source: 'Dr Chandra Vaidyanath - Essence of clinical procedures for medical students (2014)'
                })}
              >
                <img 
                  src="./assets/lp_guide/lp_needle_trajectory.png" 
                  alt="Kim tủy sống đặt trong khoang dưới nhện"
                  className="max-h-[220px] w-auto object-contain rounded-xl shadow-xs transition-transform group-hover:scale-[1.01]" 
                />
                <div className="absolute top-3 right-3 bg-slate-900/70 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="p-3 text-xs text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
                <p>
                  🎯 <strong>Mũi kim dừng ở khoang dưới nhện:</strong> Chiều sâu trung bình ở người trưởng thành là <strong>4 - 5 cm (khoảng 2/3 chiều dài kim)</strong>. Khi qua màng cứng sẽ cảm nhận rõ tiếng "sụp hẫng" (pop sensation).
                </p>
              </div>
            </div>

            {/* Figure 2: Sagittal section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 rounded-lg text-xs font-bold font-mono">
                    Hình 4
                  </span>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                    Cắt Dọc Giải Phẫu Dây Chằng &amp; Đốt Sống
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Vaidyanath (2014)</span>
              </div>

              <div 
                className="relative p-2 bg-slate-950/5 dark:bg-slate-950 flex items-center justify-center cursor-pointer group"
                onClick={() => setSelectedPhotoModal({
                  src: './assets/lp_guide/lp_sagittal_anatomy.png',
                  title: 'Hình 4: Thiết đồ cắt dọc giải phẫu cột sống thắt lưng',
                  desc: '1: Dây chằng trên gai; 2: Mỏm gai đốt sống; 3: Dây chằng liên gai; 4: Dây chằng vàng; 5: Dây chằng dọc trước; 6: Dây chằng dọc sau; 7: Đĩa đệm.',
                  source: 'Dr Chandra Vaidyanath - Essence of clinical procedures for medical students (2014)'
                })}
              >
                <img 
                  src="./assets/lp_guide/lp_sagittal_anatomy.png" 
                  alt="Cắt dọc giải phẫu các dây chằng cột sống thắt lưng"
                  className="max-h-[220px] w-auto object-contain rounded-xl shadow-xs transition-transform group-hover:scale-[1.01]" 
                />
                <div className="absolute top-3 right-3 bg-slate-900/70 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="p-3 text-xs text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
                <p>
                  📖 <strong>Cấu trúc dây chằng liên kết:</strong> Dây chằng trên gai và liên gai giữ trục kim ổn định ở đường giữa. Dây chằng vàng là ranh giới đàn hồi cuối cùng trước khi vào khoang màng cứng.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive 8 Layers Detail Cards */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Bảng Tra Cứu 8 Lớp Giải Phẫu Kim Đi Qua &amp; Cảm Giác Cản Tay
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Bấm vào từng lớp để xem cảm giác xúc giác (tactile sensation) và lưu ý thực hành lâm sàng.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {layersData.map((layer) => {
                const isSelected = activeLayer === layer.num;
                return (
                  <div 
                    key={layer.num}
                    onClick={() => setActiveLayer(isSelected ? null : layer.num)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-teal-50 dark:bg-teal-950/70 border-teal-500 shadow-xs ring-2 ring-teal-500/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{layer.name}</span>
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">{layer.depth}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        {layer.desc}
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400">
                        Cảm giác tay:
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        layer.num === 5 
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' 
                          : layer.num === 7 
                          ? 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300'
                          : layer.num === 8
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}>
                        {layer.sensation}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: BEVEL ORIENTATION & MANOMETER */}
      {subTab === 'bevel' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Real Atlas Figure 1 from Encephalitis 2022: Bevel & Dural Injury */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-lg text-xs font-bold font-mono">
                    Hình 5
                  </span>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                    Cơ Chế Tổn Thương Màng Cứng &amp; Hướng Mặt Vát
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Encephalitis (2022)</span>
              </div>

              <div 
                className="relative p-2 bg-slate-950/5 dark:bg-slate-950 flex items-center justify-center cursor-pointer group"
                onClick={() => setSelectedPhotoModal({
                  src: './assets/lp_guide/lp_bevel_orientation.jpg',
                  title: 'Hình 5: Mũi kim Quincke và cơ chế tổn thương màng cứng',
                  desc: 'A: Mũi vát kim Quincke sắc nhọn. B: Hướng các thớ sợi collagen màng cứng chạy dọc. Chọc song song (Parallel insertion) chỉ tách các thớ sợi, lỗ tự đóng lại khi rút kim. Chọc vuông góc (Vertical insertion) cắt đứt các sợi collagen làm dịch não tủy rò rỉ kéo dài dẫn đến đau đầu sau chọc (PDPH).',
                  source: 'Kim KT. Lumbar puncture: considerations, procedure, and complications. Encephalitis 2022;2(4):93-97.'
                })}
              >
                <img 
                  src="./assets/lp_guide/lp_bevel_orientation.jpg" 
                  alt="Hướng mặt vát kim và cơ chế rách màng cứng theo Encephalitis 2022"
                  className="max-h-[220px] w-auto object-contain rounded-xl shadow-xs transition-transform group-hover:scale-[1.01]" 
                />
                <div className="absolute top-3 right-3 bg-slate-900/70 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="p-3 text-xs text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 space-y-1">
                <p>
                  ✔ <strong>Nguyên tắc mặt vát song song (Parallel Bevel):</strong> Khi bệnh nhân nằm nghiêng, đặt mặt vát hướng <strong>lên trần nhà</strong> (hoặc song song với trục cột sống). Mũi kim sẽ lách giữa các thớ sợi collagen mà không làm đứt sợi.
                </p>
              </div>
            </div>

            {/* Real Atlas Figures 2 & 3 from Encephalitis 2022: Spinal Needle & Stylet */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 rounded-lg text-xs font-bold font-mono">
                    Hình 6 &amp; 7
                  </span>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                    Kim Quincke &amp; Kỹ Thuật Sử Dụng Nòng Thông (Stylet)
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Encephalitis (2022)</span>
              </div>

              <div 
                className="relative p-2 bg-slate-950/5 dark:bg-slate-950 flex items-center justify-center cursor-pointer group"
                onClick={() => setSelectedPhotoModal({
                  src: './assets/lp_guide/lp_stylet_tip.jpg',
                  title: 'Hình 6 & 7: Kim Quincke có và không có nòng thông (Stylet)',
                  desc: 'A: Đầu kim có nòng thông stylet lấp kín lòng kim. B: Đầu kim rỗng khi rút nòng. Luôn đút lại nòng thông trước khi rút kim ra để tránh sợi màng nhện bị kéo kẹt ra ngoài màng cứng gây rò DNT.',
                  source: 'Kim KT. Lumbar puncture: considerations, procedure, and complications. Encephalitis 2022;2(4):93-97.'
                })}
              >
                <img 
                  src="./assets/lp_guide/lp_stylet_tip.jpg" 
                  alt="Đầu kim chọc tủy sống có và không có nòng thông stylet"
                  className="max-h-[220px] w-auto object-contain rounded-xl shadow-xs transition-transform group-hover:scale-[1.01]" 
                />
                <div className="absolute top-3 right-3 bg-slate-900/70 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="p-3 text-xs text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 space-y-1">
                <p>
                  ⭐ <strong>Nghiên cứu Strupp (JAMA, 600 bệnh nhân):</strong> Đút lại nòng thông (Stylet) <em>trước khi rút kim</em> giúp giảm tới 50% nguy cơ đau đầu sau chọc (PDPH) nhờ ngăn chặn bấc dẫn lưu sợi màng nhện.
                </p>
              </div>
            </div>
          </div>

          {/* Manometer Clinical Setup Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-5 flex justify-center">
              <div 
                className="relative p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer group"
                onClick={() => setSelectedPhotoModal({
                  src: './assets/lp_guide/lp_manometer_setup.png',
                  title: 'Hình 8: Hệ thống đo áp lực mở bằng áp kế thủy tĩnh Manometer',
                  desc: 'Kim tủy sống được kết nối với khóa 3 ngả và cột áp kế thủy tĩnh Manometer đặt vuông góc thẳng đứng để đo chính xác áp lực mở DNT ban đầu.',
                  source: 'Dr Chandra Vaidyanath - Essence of clinical procedures for medical students (2014)'
                })}
              >
                <img 
                  src="./assets/lp_guide/lp_manometer_setup.png" 
                  alt="Kim chọc dò nối với áp kế Manometer qua khóa ba chạc"
                  className="max-h-[220px] w-auto object-contain rounded-lg shadow-xs group-hover:scale-[1.02] transition-transform" 
                />
                <div className="absolute top-3 right-3 bg-slate-900/70 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            <div className="md:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                <Gauge className="w-3.5 h-3.5" /> Kỹ Thuật Đo Áp Lực Mở (Opening Pressure)
              </div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                Quy Trình Đo Áp Lực Chuẩn Bằng Áp Kế Manometer
              </h4>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
                  <span><strong>Tư thế bệnh nhân:</strong> Bắt buộc nằm nghiêng, <em>duỗi nhẹ hai chân</em> và thở đều tự nhiên. Co gập gối quá chặt hoặc gồng bụng sẽ làm tăng áp lực ổ bụng và tăng giả tạo áp lực DNT.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
                  <span><strong>Kết nối khóa 3 chạc (Stopcock):</strong> Lắp cột áp kế thẳng đứng vuông góc với mặt giường. Mở khóa cho dịch dâng lên trong cột áp kế và quan sát mực dịch đập nhẹ theo nhịp thở.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
                  <span><strong>Giá trị bình thường:</strong> 60 - 250 mmH2O ở người lớn. Nếu &gt; 250 mmH2O: Cảnh báo tăng áp lực nội sọ cấp. Nếu &lt; 60 mmH2O: Hạ áp lực nội sọ tự phát (SIH).</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: STEP-BY-STEP CHECKLIST */}
      {subTab === 'steps' && (
        <div className="space-y-4">
          {/* Equipment Photo Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-4 flex justify-center">
              <div 
                className="relative p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer group"
                onClick={() => setSelectedPhotoModal({
                  src: './assets/lp_guide/lp_equipment.png',
                  title: 'Hình 9: Bàn dụng cụ vô khuẩn chuẩn bị chọc dò DNT',
                  desc: 'Bao gồm dung dịch sát khuẩn Chlorhexidine/Povidone-Iodine, gạc vô khuẩn, săng có lỗ, kim chọc tủy sống Quincke 20-22G có nòng, khóa 3 ngả, áp kế Manometer, thuốc tê Lidocaine 1%, bơm tiêm và các lọ xét nghiệm.',
                  source: 'Dr Chandra Vaidyanath - Essence of clinical procedures for medical students (2014)'
                })}
              >
                <img 
                  src="./assets/lp_guide/lp_equipment.png" 
                  alt="Bộ dụng cụ chọc dò thắt lưng"
                  className="max-h-[190px] w-auto object-contain rounded-lg shadow-xs group-hover:scale-[1.02] transition-transform" 
                />
                <div className="absolute top-3 right-3 bg-slate-900/70 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            <div className="md:col-span-8 space-y-2">
              <span className="text-[10px] font-bold text-teal-800 dark:text-teal-300 bg-teal-100 dark:bg-teal-950 px-2.5 py-0.5 rounded-full uppercase">
                Chuẩn bị dụng cụ
              </span>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
                Bộ Dụng Cụ Vô Khuẩn Chọc Dò Tiêu Chuẩn (Sterile LP Tray)
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Đầy đủ: Dung dịch sát khuẩn Povidone-Iodine/Chlorhexidine, săng lỗ vô khuẩn, Lidocaine 1%, bơm tiêm 5ml kim 25G gây tê, kim Quincke 20-22G có nòng stylet, khóa 3 ngả, cột áp kế Manometer, 4 lọ đựng mẫu DNT vô khuẩn có nắp vặn và băng ép gạc vô khuẩn.
              </p>
            </div>
          </div>

          {/* 6 Steps Checklist */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/80 pb-2.5">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                Bảng Kiểm Quy Trình Thực Hành 6 Bước (Procedure Checklist)
              </h4>
              <span className="text-[10px] font-bold text-teal-800 dark:text-teal-300 bg-teal-100 dark:bg-teal-950 px-2 py-0.5 rounded-lg">
                Vô khuẩn ngoại khoa tuyệt đối
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  step: 'BƯỚC 1',
                  title: 'Chuẩn bị bệnh nhân & Đặt tư thế',
                  details: 'Giải thích mục đích, tai biến, ký cam kết. Lập đường truyền tĩnh mạch sẵn sàng. Đặt bệnh nhân nằm nghiêng sát mép giường, cong lưng tối đa (đầu gối gập sát ngực, cằm chạm ngực - tư thế con tôm). Trục cột sống thẳng song song mặt giường, không vặn xoắn khung chậu.',
                  badge: 'Tư thế con tôm'
                },
                {
                  step: 'BƯỚC 2',
                  title: 'Xác định mốc giải phẫu & Khe chọc an toàn',
                  details: 'Sờ tìm hai mào chậu (iliac crests), kẻ đường ngang Tuffier cắt cột sống ở mỏm gai L4. Chọn khe L3-L4 hoặc L4-L5 ngay phía trên hoặc dưới đường này. Đánh dấu vị trí kim đi vào chính giữa đường giữa (Midline).',
                  badge: 'Khe L3-L4 / L4-L5'
                },
                {
                  step: 'BƯỚC 3',
                  title: 'Sát khuẩn & Gây tê từng lớp',
                  details: 'Đội mũ, đeo khẩu trang, rửa tay ngoại khoa, mang găng vô khuẩn. Sát khuẩn Povidone-Iodine hoặc Chlorhexidine từ tâm ra ngoài theo hình xoắn ốc (bán kính ≥ 15 cm). Trải săng có lỗ. Tiêm tê Lidocaine 1% tạo nốt phồng trong da, sau đó đổi kim dài gây tê sâu theo hướng chọc vào dây chằng liên gai.',
                  badge: 'Lidocaine 1%'
                },
                {
                  step: 'BƯỚC 4',
                  title: 'Chọc kim có nòng thông (Stylet) & Hướng mặt vát',
                  details: 'Cầm kim Quincke 20-22G có nòng thông giữa ngón cái và ngón trỏ. Hướng mặt vát kim song song với các sợi dọc màng cứng (mặt vát hướng lên trần nhà khi nằm nghiêng). Đâm kim chậm rãi nghiêng nhẹ 10-15 độ về phía rốn (rostral direction).',
                  badge: 'Mặt vát song song'
                },
                {
                  step: 'BƯỚC 5',
                  title: 'Cảm giác "Sụp hẫng" (Pop) & Đo áp lực mở',
                  details: 'Cảm nhận sức cản qua dây chằng vàng, sau đó có cảm giác "sụp hẫng" khi qua màng cứng vào khoang dưới nhện (~4-5 cm). Rút nòng stylet quan sát dịch não tủy chảy ra. Lắp ngay khóa 3 chạc và cột áp kế Manometer, yêu cầu bệnh nhân duỗi nhẹ chân để đo áp lực mở chính xác.',
                  badge: 'Áp kế Manometer'
                },
                {
                  step: 'BƯỚC 6',
                  title: 'Thu thập 4 lọ mẫu DNT & Chăm sóc sau chọc',
                  details: 'Chuyển khóa cho dịch chảy tự nhiên (không hút) vào 4 lọ xét nghiệm tiêu chuẩn (Ống 1: Tế bào; Ống 2: Hóa sinh; Ống 3: Vi sinh/Cấy; Ống 4: Đối chiếu/PCR). Lắp lại nòng thông Stylet TRƯỚC KHI rút kim ra. Băng ép gạc vô khuẩn. Cho bệnh nhân nằm bất động tại giường 4-6 giờ.',
                  badge: 'Nằm nghỉ 4-6h'
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black bg-teal-600 text-white px-2 py-0.5 rounded-md font-mono">
                        {item.step}
                      </span>
                      <h5 className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm">
                        {item.title}
                      </h5>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-0.5">
                      {item.details}
                    </p>
                  </div>
                  <span className="self-start text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-lg shrink-0 border border-slate-200/60 dark:border-slate-700">
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: CONTRAINDICATIONS & COMPLICATIONS */}
      {subTab === 'complications' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contraindications */}
            <div className="bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs sm:text-sm">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                Chống Chỉ Định Cần Loại Trừ
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-rose-200/80 dark:border-rose-900/80 space-y-1">
                  <strong className="text-rose-900 dark:text-rose-200 block">1. Tăng áp lực nội sọ do khối choán chỗ:</strong>
                  <p className="text-slate-600 dark:text-slate-300">
                    Nguy cơ tụt kẹt não (Brain herniation) qua lỗ chẩm đe dọa tính mạng. Bắt buộc chụp CT/MRI sọ não trước chọc nếu có: hôn mê, dấu thần kinh khu trú, co giật mới, suy giảm miễn dịch, phù gai thị.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-rose-200/80 dark:border-rose-900/80 space-y-1">
                  <strong className="text-rose-900 dark:text-rose-200 block">2. Nhiễm trùng mô mềm tại chỗ đâm kim:</strong>
                  <p className="text-slate-600 dark:text-slate-300">
                    Nhiễm trùng da, mô dưới da vùng thắt lưng có nguy cơ gieo rắc vi khuẩn trực tiếp vào khoang dịch não tủy gây viêm màng não mủ do y sinh.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-rose-200/80 dark:border-rose-900/80 space-y-1">
                  <strong className="text-rose-900 dark:text-rose-200 block">3. Rối loạn đông máu nặng (Coagulopathy):</strong>
                  <p className="text-slate-600 dark:text-slate-300">
                    Tiểu cầu &lt; 40,000 - 50,000 /µL hoặc PT INR &gt; 1.5, hoặc đang điều trị thuốc chống đông liều cao &rarr; nguy cơ tạo tụ máu tủy sống (Spinal hematoma) chèn ép tủy dẫn đến liệt hoàn toàn.
                  </p>
                </div>
              </div>
            </div>

            {/* Complications & Management */}
            <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-xs sm:text-sm">
                <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Tai Biến Thường Gặp &amp; Cách Xử Trí
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-amber-200/80 dark:border-amber-900/80 space-y-1">
                  <strong className="text-amber-950 dark:text-amber-200 block">1. Đau đầu sau chọc (PDPH):</strong>
                  <p className="text-slate-600 dark:text-slate-300">
                    Xảy ra ở 10-30% trường hợp do rò DNT qua lỗ màng cứng. Đau tăng khi ngồi dậy, giảm hẳn khi nằm phẳng.
                    <br /><strong>Xử trí:</strong> Nằm nghỉ tại giường 4-8 giờ, uống nhiều nước/truyền dịch, caffeine, giảm đau NSAID/Paracetamol. Nếu dai dẳng &gt; 7-14 ngày: làm thủ thuật vá màng cứng bằng máu tự thân (Epidural blood patch).
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-amber-200/80 dark:border-amber-900/80 space-y-1">
                  <strong className="text-amber-950 dark:text-amber-200 block">2. Chọc dò chạm mạch (Traumatic tap):</strong>
                  <p className="text-slate-600 dark:text-slate-300">
                    Kim làm rách đám rối tĩnh mạch ngoài màng cứng. Dịch ra máu. Nếu gặp phải, rút lùi kim về lớp dưới da và chỉnh hướng lại; nếu máu đông bít kim thì phải chọc vị trí khác bằng kim mới.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-amber-200/80 dark:border-amber-900/80 space-y-1">
                  <strong className="text-amber-950 dark:text-amber-200 block">3. Tụ máu tủy sống (Spinal hematoma - Cấp cứu):</strong>
                  <p className="text-slate-600 dark:text-slate-300">
                    Hiếm gặp nhưng rất nguy hiểm. Nếu bệnh nhân đau lưng dữ dội kéo dài, đau lan rễ thần kinh, tê yếu hai chi dưới hoặc bí tiểu &rarr; <strong>Chụp MRI khẩn cấp</strong> và hội chẩn ngoại thần kinh phẫu thuật giải áp kịp thời.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FULL-VIEW LIGHTBOX FOR CLINICAL ATLAS PHOTOS */}
      {selectedPhotoModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedPhotoModal(null)}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                {selectedPhotoModal.title}
              </h4>
              <button
                onClick={() => setSelectedPhotoModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-950 flex items-center justify-center overflow-auto flex-1 min-h-[300px]">
              <img 
                src={selectedPhotoModal.src} 
                alt={selectedPhotoModal.title}
                className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-lg" 
              />
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <p className="font-medium leading-relaxed">{selectedPhotoModal.desc}</p>
              <p className="text-[10px] text-teal-700 dark:text-teal-400 font-mono">Nguồn: {selectedPhotoModal.source}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
