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
  Eye
} from 'lucide-react';

export const LPProcedureGuide: React.FC = () => {
  const [subTab, setSubTab] = useState<'anatomy' | 'layers' | 'bevel' | 'steps' | 'complications'>('anatomy');
  const [activeLayer, setActiveLayer] = useState<number | null>(null);
  const [anatomyFocus, setAnatomyFocus] = useState<'all' | 'tuffier' | 'safe_gap' | 'conus'>('all');

  const layersData = [
    { num: 1, name: '1. Da (Skin)', desc: 'Sát khuẩn kỹ hình xoắn ốc và gây tê nốt phồng da bằng Lidocaine 1%.', color: 'fill-amber-200 stroke-amber-500' },
    { num: 2, name: '2. Mô dưới da (Subcutaneous tissue)', desc: 'Mô mỡ lỏng lẻo. Gây tê sâu theo trục hướng về phía rốn.', color: 'fill-amber-100 stroke-amber-400' },
    { num: 3, name: '3. Dây chằng trên gai (Supraspinous ligament)', desc: 'Dải xơ chắc kết nối các đỉnh mỏm gai đốt sống từ C7 đến xương cùng.', color: 'fill-blue-200 stroke-blue-500' },
    { num: 4, name: '4. Dây chằng liên gai (Interspinous ligament)', desc: 'Nằm giữa các mỏm gai, kim đi chính giữa đường giữa (Midline).', color: 'fill-indigo-200 stroke-indigo-500' },
    { num: 5, name: '5. Dây chằng vàng (Ligamentum flavum)', desc: 'Mô đàn hồi dày nối các cung đốt sống. Bác sĩ cảm nhận rõ sức cản tăng lên rõ rệt (Tough resistance).', color: 'fill-yellow-300 stroke-yellow-600' },
    { num: 6, name: '6. Khoang ngoài màng cứng (Epidural space)', desc: 'Khoang ảo chứa mỡ và đám rối tĩnh mạch đốt sống trong. Chọc lệch dễ gây chạm mạch tại đây.', color: 'fill-rose-100 stroke-rose-400' },
    { num: 7, name: '7. Màng cứng & Màng nhện (Dura & Arachnoid)', desc: 'Khoảnh khắc quyết định: Cảm giác "Sụp hẫng" hoặc "Pop sensation" khi kim xuyên thủng màng cứng.', color: 'fill-purple-200 stroke-purple-600' },
    { num: 8, name: '8. Khoang dưới nhện (Subarachnoid space)', desc: 'Đích đến an toàn: Chứa dịch não tủy (CSF) và rễ chùm đuôi ngựa (Cauda equina). Rút nòng stylet dịch sẽ chảy tự nhiên.', color: 'fill-cyan-100 stroke-cyan-500' },
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
              Tổng hợp chi tiết theo Hướng dẫn Encephalitis 2022 (Keun Tae Kim) và Giáo trình Lâm sàng Dr Chandra Vaidyanath (2014).
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 bg-white/10 p-1 rounded-xl">
            <span className="text-[11px] font-semibold text-teal-200 px-2">Vị trí chuẩn:</span>
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
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl text-xs">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-2 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              Xem nhanh mốc:
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
              1. Đường Tuffier (Mào chậu)
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
              3. Nón tủy L1 - L2 (Vùng nguy hiểm)
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* High-Clarity Dual-Panel Diagram */}
            <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wide text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <Crosshair className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  Sơ Đồ Đối Chiếu: Ngoài Da vs Trục Tủy Sống
                </span>
                <span className="text-[10px] bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded-full font-bold">
                  Dễ hiểu • Trực quan 2 góc nhìn
                </span>
              </div>

              {/* Redesigned Clean Vector SVG */}
              <div className="w-full bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                <svg viewBox="0 0 620 270" className="w-full h-auto max-h-[260px]" xmlns="http://www.w3.org/2000/svg">
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

                  {/* ================= PANEL 1: SURFACE VIEW (BỀ MẶT LƯNG) ================= */}
                  <g transform="translate(10, 10)">
                    {/* Background card */}
                    <rect x="0" y="0" width="285" height="250" rx="10" fill="#f8fafc" className="dark:fill-slate-800/40" stroke="#e2e8f0" strokeWidth="1.5" />
                    
                    {/* Title */}
                    <rect x="12" y="10" width="180" height="20" rx="4" fill="#0f766e" />
                    <text x="102" y="23" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">1. NHÌN TỪ NGOÀI LƯNG (TƯ THẾ)</text>

                    {/* Patient Back Silhouette (Clean, curved aesthetic) */}
                    <path 
                      d="M 60 40 C 40 100 40 180 80 230 C 130 240 220 240 260 210" 
                      fill="none" 
                      stroke="#cbd5e1" 
                      className="dark:stroke-slate-700" 
                      strokeWidth="28" 
                      strokeLinecap="round" 
                    />
                    <path 
                      d="M 60 40 C 40 100 40 180 80 230 C 130 240 220 240 260 210" 
                      fill="none" 
                      stroke="#0d9488" 
                      strokeWidth="2" 
                      strokeDasharray="4 3" 
                      opacity="0.4"
                    />

                    {/* Midline spine nodes (Spinous processes palpated) */}
                    {/* L1 */}
                    <circle cx="56" cy="65" r="5" fill="#94a3b8" />
                    <text x="38" y="68" fill="#64748b" fontSize="8" fontWeight="bold">L1</text>
                    {/* L2 */}
                    <circle cx="53" cy="98" r="5" fill="#94a3b8" />
                    <text x="35" y="101" fill="#64748b" fontSize="8" fontWeight="bold">L2</text>
                    {/* L3 */}
                    <circle cx="53" cy="132" r="6" fill={anatomyFocus === 'safe_gap' ? '#0d9488' : '#64748b'} stroke="#fff" strokeWidth="1.5" />
                    <text x="33" y="135" fill="#0d9488" fontSize="8.5" fontWeight="bold">L3</text>
                    
                    {/* L4 (Intersects Tuffier's line) */}
                    <circle cx="56" cy="166" r="6" fill={anatomyFocus === 'tuffier' ? '#f59e0b' : '#64748b'} stroke="#fff" strokeWidth="1.5" />
                    <text x="36" y="169" fill="#d97706" fontSize="8.5" fontWeight="bold">L4</text>

                    {/* L5 */}
                    <circle cx="63" cy="200" r="5" fill="#94a3b8" />
                    <text x="43" y="203" fill="#64748b" fontSize="8" fontWeight="bold">L5</text>

                    {/* Tuffier's Line (Connects Iliac crests at y=166) */}
                    <g opacity={anatomyFocus === 'all' || anatomyFocus === 'tuffier' ? 1 : 0.25} className="transition-opacity">
                      {/* Left & Right Iliac crest palpation bumps */}
                      <circle cx="56" cy="166" r="14" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />
                      <line x1="15" y1="166" x2="270" y2="166" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="5 3" />
                      
                      {/* Iliac Crest Label Pin */}
                      <rect x="155" y="156" width="115" height="18" rx="4" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" />
                      <text x="212" y="168" textAnchor="middle" fill="#92400e" fontSize="7.5" fontWeight="bold">Đường Tuffier (Mào chậu ↔ L4)</text>
                    </g>

                    {/* Safe Needle Entry Gap: L3-L4 */}
                    <g opacity={anatomyFocus === 'all' || anatomyFocus === 'safe_gap' ? 1 : 0.25} className="transition-opacity">
                      {/* Target bullseye at gap between L3 (y=132) and L4 (y=166) -> y=149 */}
                      <circle cx="54" cy="149" r="8" fill="#10b981" fillOpacity="0.3" stroke="#059669" strokeWidth="2" />
                      <circle cx="54" cy="149" r="3" fill="#059669" />

                      {/* Needle coming in from right */}
                      <line x1="160" y1="140" x2="57" y2="148" stroke="#0284c7" strokeWidth="3" />
                      <polygon points="57,148 66,145 64,151" fill="#0284c7" />
                      
                      {/* Needle handle */}
                      <rect x="160" y="133" width="30" height="14" rx="3" fill="#0284c7" />
                      <text x="175" y="143" textAnchor="middle" fill="#fff" fontSize="7.5" fontWeight="bold">Kim LP</text>

                      {/* Callout Tag */}
                      <rect x="85" y="118" width="95" height="16" rx="4" fill="#d1fae5" stroke="#10b981" strokeWidth="1" />
                      <text x="132" y="129" textAnchor="middle" fill="#065f46" fontSize="8" fontWeight="bold">★ Điểm chọc L3 - L4</text>
                    </g>
                  </g>

                  {/* ================= PANEL 2: INTERNAL ANATOMY (TRỤC CỘT SỐNG & TỦY) ================= */}
                  <g transform="translate(305, 10)">
                    {/* Background card */}
                    <rect x="0" y="0" width="305" height="250" rx="10" fill="#f8fafc" className="dark:fill-slate-800/40" stroke="#e2e8f0" strokeWidth="1.5" />
                    
                    {/* Title */}
                    <rect x="12" y="10" width="210" height="20" rx="4" fill="#312e81" />
                    <text x="117" y="23" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">2. TRỤC TỦY SỐNG &amp; VÙNG AN TOÀN (CẮT DỌC)</text>

                    {/* DANGER ZONE (Above L2) background highlight */}
                    <g opacity={anatomyFocus === 'all' || anatomyFocus === 'conus' ? 1 : 0.2}>
                      <rect x="15" y="38" width="275" height="74" rx="6" fill="url(#dangerGrad)" stroke="#f87171" strokeWidth="1" strokeDasharray="3 2" />
                      <text x="210" y="55" fill="#dc2626" fontSize="8.5" fontWeight="bold">⛔ CẤM CHỌC (CÓ TỦY SỐNG)</text>
                    </g>

                    {/* SAFE ZONE (Below L2) background highlight */}
                    <g opacity={anatomyFocus === 'all' || anatomyFocus === 'safe_gap' ? 1 : 0.2}>
                      <rect x="15" y="118" width="275" height="120" rx="6" fill="url(#safeGrad)" stroke="#34d399" strokeWidth="1.5" />
                      <text x="205" y="133" fill="#059669" fontSize="8.5" fontWeight="bold">✔ VÙNG AN TOÀN (CHỈ CÓ DNT)</text>
                    </g>

                    {/* Vertebrae Blocks column */}
                    {/* T12 */}
                    <rect x="30" y="42" width="46" height="18" rx="3" fill="#94a3b8" />
                    <text x="53" y="54" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">T12</text>
                    
                    {/* L1 */}
                    <rect x="30" y="66" width="46" height="18" rx="3" fill="#94a3b8" />
                    <text x="53" y="78" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">L1</text>
                    
                    {/* L2 */}
                    <rect x="30" y="90" width="46" height="18" rx="3" fill="#94a3b8" />
                    <text x="53" y="102" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">L2</text>

                    {/* L3 (Target upper) */}
                    <rect x="30" y="122" width="46" height="20" rx="3" fill="#0d9488" stroke="#14b8a6" strokeWidth="1.5" />
                    <text x="53" y="135" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">L3</text>

                    {/* L4 (Target lower - Tuffier level) */}
                    <rect x="30" y="156" width="46" height="20" rx="3" fill="#0d9488" stroke="#14b8a6" strokeWidth="1.5" />
                    <text x="53" y="169" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">L4</text>

                    {/* L5 */}
                    <rect x="30" y="190" width="46" height="18" rx="3" fill="#64748b" />
                    <text x="53" y="202" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">L5</text>

                    {/* Sacrum S1 */}
                    <path d="M 30 216 L 76 216 L 70 234 L 36 234 Z" fill="#475569" />
                    <text x="53" y="227" textAnchor="middle" fill="#fff" fontSize="7.5" fontWeight="bold">Xương cùng</text>

                    {/* Spinal Cord (Solid Red tube ending at L1-L2) */}
                    <rect x="88" y="40" width="10" height="65" rx="3" fill="#ef4444" />
                    {/* Conus medullaris tapered tip at L1-L2 */}
                    <polygon points="88,105 98,105 93,116" fill="#dc2626" />
                    
                    {/* Conus Pin Callout */}
                    <line x1="93" y1="114" x2="135" y2="92" stroke="#dc2626" strokeWidth="1.5" />
                    <rect x="135" y="82" width="145" height="18" rx="4" fill="#fee2e2" stroke="#ef4444" strokeWidth="1" />
                    <text x="207" y="94" textAnchor="middle" fill="#991b1b" fontSize="7.5" fontWeight="bold">Nón tủy kết thúc ở L1-L2</text>

                    {/* Subarachnoid Space with CSF (Cyan transparent column) */}
                    <rect x="86" y="116" width="14" height="115" rx="4" fill="#38bdf8" fillOpacity="0.4" stroke="#0ea5e9" strokeWidth="1.5" />
                    
                    {/* Cauda Equina fibers (Nerve rootlets floating harmlessly) */}
                    <line x1="90" y1="116" x2="89" y2="225" stroke="#0284c7" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="93" y1="116" x2="93" y2="225" stroke="#0284c7" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="96" y1="116" x2="97" y2="225" stroke="#0284c7" strokeWidth="1" strokeDasharray="3 3" />

                    {/* NEEDLE INSERTING SAFELY INTO L3-L4 GAP */}
                    <g transform="translate(0, 5)">
                      <line x1="0" y1="140" x2="89" y2="140" stroke="#059669" strokeWidth="2.5" />
                      <polygon points="89,140 82,137 82,143" fill="#059669" />
                      <rect x="105" y="145" width="140" height="18" rx="4" fill="#ecfdf5" stroke="#059669" strokeWidth="1" />
                      <text x="175" y="157" textAnchor="middle" fill="#047857" fontSize="7.5" fontWeight="bold">Mũi kim vào khoang DNT khe L3-L4</text>
                    </g>
                  </g>
                </svg>
              </div>

              {/* Dynamic Landmark Clinical Insights */}
              <div className="p-2.5 rounded-xl border text-xs transition-all bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                {anatomyFocus === 'all' && (
                  <p className="text-slate-600 dark:text-slate-300">
                    💡 <strong>Nguyên lý then chốt:</strong> Tủy sống tận cùng ở đốt <strong>L1 - L2</strong>. Khi chọc kim tại khe <strong>L3 - L4 hoặc L4 - L5</strong> (ngay mức đường Tuffier), kim đi vào bể dịch não tủy chỉ chứa rễ chùm đuôi ngựa lơ lửng, tránh 100% nguy cơ chọc vào nhu mô tủy sống.
                  </p>
                )}
                {anatomyFocus === 'tuffier' && (
                  <p className="text-amber-800 dark:text-amber-300">
                    📍 <strong>Đường Tuffier (Intercristal line):</strong> Nối 2 mào chậu, cắt cột sống tại gai L4. Đây là mốc sờ nắn đầu tiên. <em>Lưu ý:</em> Định vị bằng tay có thể chệch lên trên 1 đốt, do đó chọn khe L3-L4 hoặc L4-L5 là khoảng an toàn tuyệt đối.
                  </p>
                )}
                {anatomyFocus === 'safe_gap' && (
                  <p className="text-emerald-800 dark:text-emerald-300">
                    🎯 <strong>Khe L3 - L4 (Vị trí vàng):</strong> Nằm ngay phía trên đường Tuffier 1 khoang liên gai. Khe này rộng, dễ sờ thấy và nằm xa nón tủy nhất, là lựa chọn số 1 của các bác sĩ thần kinh.
                  </p>
                )}
                {anatomyFocus === 'conus' && (
                  <p className="text-rose-800 dark:text-rose-300">
                    ⚠️ <strong>Nón tủy (Conus Medullaris):</strong> Kết thúc ở đĩa đệm L1-L2 (ở trẻ sơ sinh kéo dài đến L3). Tuyệt đối <strong>không chọc dò ở L1 - L2 hoặc cao hơn</strong> vì sẽ gây tổn thương trực tiếp tủy sống, dẫn đến liệt hai chi dưới vĩnh viễn.
                  </p>
                )}
              </div>
            </div>

            {/* Practical Landmark Anatomy Notes */}
            <div className="lg:col-span-5 space-y-3 flex flex-col justify-between">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Mốc Vàng: Đường Tuffier (Intercristal Line)
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Đường ngang nối liền điểm cao nhất của <strong>hai mào chậu (iliac crests)</strong>. Đường này thường cắt qua mỏm gai L4 hoặc khe liên gai <strong>L4 - L5</strong>.
                </p>
                <div className="p-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-lg text-[11px] text-amber-900 dark:text-amber-300">
                  <strong>Cảnh báo lâm sàng (Encephalitis 2022):</strong> Định vị đường Tuffier bằng tay có độ chính xác 30% - 60%. Có tới 50% trường hợp chọc vào vị trí <em>cao hơn 1 tầng đốt</em> so với dự kiến. Vì vậy, lựa chọn khe <strong>L3 - L4 hoặc L4 - L5</strong> là an toàn nhất để tránh tổn thương nón tủy.
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  Tư Thế Bệnh Nhân Chuẩn (Positioning)
                </h4>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                  <li className="flex items-start gap-1.5">
                    <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
                    <span><strong>Tư thế nằm nghiêng co (Lateral Recumbent - Ưu tiên #1):</strong> Lưng vuông góc với mép giường, cổ gập nhẹ, 2 gối co sát ngực bụng ("tư thế con tôm"). Vai và hông trên cùng một mặt phẳng thẳng đứng (không vặn xoắn).</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
                    <span><strong>Lợi ích nằm nghiêng:</strong> Đo áp lực mở (Opening Pressure) chính xác nhất (60 - 250 mmH2O) và hạ thấp đầu giúp giảm tỷ lệ đau đầu sau chọc (PDPH).</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
                    <span><strong>Tư thế ngồi cúi (Sitting):</strong> Dành cho người béo phì hoặc khó tìm khe khớp, nhưng áp lực mở sẽ cao giả tạo (200 - 300 mmH2O).</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: 8 ANATOMICAL LAYERS */}
      {subTab === 'layers' && (
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 space-y-4">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                8 Lớp Cấu Trúc Giải Phẫu Kim Chọc Tủy Sống Đi Qua
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Chiều sâu trung bình để kim chạm khoang dưới nhện ở người trưởng thành là <strong>4 - 5 cm (tương đương 2/3 chiều dài kim)</strong>.
              </p>
            </div>

            {/* Interactive SVG Cross-Section Layers Diagram */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
              <svg viewBox="0 0 760 140" className="w-full min-w-[650px] h-auto">
                {/* Needle advancing horizontally */}
                <g transform="translate(0, 70)">
                  {/* Needle handle & hub */}
                  <rect x="0" y="-12" width="55" height="24" rx="4" fill="#0284c7" />
                  <text x="27" y="4" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">Đốc kim</text>
                  <circle cx="2" cy="0" r="5" fill="#f8fafc" stroke="#0284c7" strokeWidth="2" />
                  
                  {/* Needle shaft */}
                  <rect x="55" y="-2" width="620" height="4" fill="#94a3b8" />
                  <rect x="55" y="-1" width="620" height="2" fill="#f8fafc" />
                  {/* Bevel tip */}
                  <polygon points="675,-2 690,0 675,2" fill="#0284c7" />
                </g>

                {/* 8 Anatomical Layer Slices */}
                {/* Layer 1: Skin */}
                <g 
                  className="cursor-pointer transition-opacity hover:opacity-90"
                  onClick={() => setActiveLayer(1)}
                >
                  <rect x="70" y="15" width="40" height="110" rx="3" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" />
                  <text x="90" y="35" textAnchor="middle" fill="#78350f" fontSize="10" fontWeight="bold">1. Da</text>
                  <text x="90" y="110" textAnchor="middle" fill="#92400e" fontSize="8 font-mono">0-2mm</text>
                </g>

                {/* Layer 2: Subcutaneous */}
                <g 
                  className="cursor-pointer transition-opacity hover:opacity-90"
                  onClick={() => setActiveLayer(2)}
                >
                  <rect x="115" y="15" width="70" height="110" rx="3" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
                  <text x="150" y="35" textAnchor="middle" fill="#78350f" fontSize="10" fontWeight="bold">2. Dưới da</text>
                  <text x="150" y="55" textAnchor="middle" fill="#b45309" fontSize="8">Mô mỡ lỏng</text>
                </g>

                {/* Layer 3: Supraspinous */}
                <g 
                  className="cursor-pointer transition-opacity hover:opacity-90"
                  onClick={() => setActiveLayer(3)}
                >
                  <rect x="190" y="15" width="70" height="110" rx="3" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1.5" />
                  <text x="225" y="35" textAnchor="middle" fill="#1e3a8a" fontSize="9.5" fontWeight="bold">3. Trên gai</text>
                  <text x="225" y="55" textAnchor="middle" fill="#1d4ed8" fontSize="8">Dải xơ dọc</text>
                </g>

                {/* Layer 4: Interspinous */}
                <g 
                  className="cursor-pointer transition-opacity hover:opacity-90"
                  onClick={() => setActiveLayer(4)}
                >
                  <rect x="265" y="15" width="80" height="110" rx="3" fill="#c7d2fe" stroke="#6366f1" strokeWidth="1.5" />
                  <text x="305" y="35" textAnchor="middle" fill="#312e81" fontSize="9.5" fontWeight="bold">4. Liên gai</text>
                  <text x="305" y="55" textAnchor="middle" fill="#4338ca" fontSize="8">Giữa 2 mỏm gai</text>
                </g>

                {/* Layer 5: Ligamentum Flavum */}
                <g 
                  className="cursor-pointer transition-opacity hover:opacity-90"
                  onClick={() => setActiveLayer(5)}
                >
                  <rect x="350" y="15" width="75" height="110" rx="3" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" strokeDasharray="3 1" />
                  <text x="387" y="35" textAnchor="middle" fill="#713f12" fontSize="9.5" fontWeight="bold">5. D.C Vàng ★</text>
                  <text x="387" y="55" textAnchor="middle" fill="#854d0e" fontSize="8">Sức cản rõ rệt</text>
                </g>

                {/* Layer 6: Epidural Space */}
                <g 
                  className="cursor-pointer transition-opacity hover:opacity-90"
                  onClick={() => setActiveLayer(6)}
                >
                  <rect x="430" y="15" width="60" height="110" rx="3" fill="#ffe4e6" stroke="#f43f5e" strokeWidth="1.5" />
                  <text x="460" y="35" textAnchor="middle" fill="#881337" fontSize="9" fontWeight="bold">6. Ngoài MC</text>
                  <text x="460" y="55" textAnchor="middle" fill="#be123c" fontSize="7.5">Đám rối TM</text>
                </g>

                {/* Layer 7: Dura & Arachnoid */}
                <g 
                  className="cursor-pointer transition-opacity hover:opacity-90"
                  onClick={() => setActiveLayer(7)}
                >
                  <rect x="495" y="15" width="70" height="110" rx="3" fill="#e9d5ff" stroke="#9333ea" strokeWidth="2" />
                  <text x="530" y="35" textAnchor="middle" fill="#581c87" fontSize="9.5" fontWeight="bold">7. Màng Cứng ★</text>
                  <text x="530" y="55" textAnchor="middle" fill="#7e22ce" fontSize="8 font-bold">"POP" Sensation</text>
                </g>

                {/* Layer 8: Subarachnoid Space */}
                <g 
                  className="cursor-pointer transition-opacity hover:opacity-90"
                  onClick={() => setActiveLayer(8)}
                >
                  <rect x="570" y="15" width="165" height="110" rx="6" fill="#cffafe" stroke="#06b6d4" strokeWidth="2.5" />
                  <text x="652" y="35" textAnchor="middle" fill="#164e63" fontSize="10.5" fontWeight="bold">8. KHOANG DƯỚI NHỆN</text>
                  <text x="652" y="55" textAnchor="middle" fill="#0891b2" fontSize="8.5">Chứa DNT &amp; Rễ Chùm Đuôi Ngựa</text>
                  {/* CSF Waves */}
                  <path d="M 580 85 Q 610 80 640 85 T 700 85" fill="none" stroke="#0891b2" strokeWidth="2" strokeDasharray="3 2" />
                  <path d="M 580 100 Q 610 95 640 100 T 700 100" fill="none" stroke="#0891b2" strokeWidth="2" strokeDasharray="3 2" />
                </g>
              </svg>
            </div>

            {/* Click to inspect layer cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {layersData.map((layer) => {
                const isSelected = activeLayer === layer.num;
                return (
                  <div 
                    key={layer.num}
                    onClick={() => setActiveLayer(isSelected ? null : layer.num)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{layer.name}</span>
                      {layer.num === 5 && <span className="text-[9px] bg-amber-100 text-amber-800 px-1 rounded font-bold">Cản nặng</span>}
                      {layer.num === 7 && <span className="text-[9px] bg-purple-100 text-purple-800 px-1 rounded font-bold">Pop!</span>}
                      {layer.num === 8 && <span className="text-[9px] bg-cyan-100 text-cyan-800 px-1 rounded font-bold">Đích đến</span>}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {layer.desc}
                    </p>
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
            {/* Bevel Orientation Card */}
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-full">
                  Kỹ Thuật Phòng Ngừa Đau Đầu PDPH
                </span>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base mt-1 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  Nguyên Tắc Hướng Mặt Vát Kim (Bevel Orientation)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Các sợi collagen màng cứng chạy dọc theo chiều dài cột sống (Longitudinal dural fibers).
                </p>
              </div>

              {/* SVG Bevel Comparison */}
              <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <svg viewBox="0 0 340 180" className="w-full h-auto">
                  {/* Left: Parallel (CORRECT) */}
                  <g transform="translate(10, 10)">
                    {/* Dural fibers */}
                    <rect x="0" y="0" width="150" height="150" rx="8" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5" />
                    <text x="75" y="18" textAnchor="middle" fill="#166534" fontSize="10" fontWeight="bold">MẶT VÁT SONG SONG (ĐÚNG)</text>
                    
                    {/* Longitudinal fibers lines */}
                    {[25, 45, 65, 85, 105, 125].map((x, i) => (
                      <line key={i} x1={x} y1="30" x2={x} y2="140" stroke="#86efac" strokeWidth="1.5" strokeDasharray="3 2" />
                    ))}

                    {/* Needle with bevel parallel */}
                    <ellipse cx="75" cy="85" rx="8" ry="24" fill="#0284c7" opacity="0.8" />
                    <line x1="75" y1="55" x2="75" y2="115" stroke="#fff" strokeWidth="2" />
                    
                    {/* Outcome Badge */}
                    <rect x="15" y="125" width="120" height="18" rx="4" fill="#22c55e" />
                    <text x="75" y="137" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">TÁCH SỢI &rarr; TỰ ĐÓNG LỖ LẠI</text>
                  </g>

                  {/* Right: Perpendicular (INCORRECT) */}
                  <g transform="translate(180, 10)">
                    {/* Dural fibers */}
                    <rect x="0" y="0" width="150" height="150" rx="8" fill="#fff1f2" stroke="#fca5a5" strokeWidth="1.5" />
                    <text x="75" y="18" textAnchor="middle" fill="#991b1b" fontSize="10" fontWeight="bold">MẶT VÁT VUÔNG GÓC (SAI)</text>
                    
                    {/* Longitudinal fibers lines */}
                    {[25, 45, 65, 85, 105, 125].map((x, i) => (
                      <line key={i} x1={x} y1="30" x2={x} y2="140" stroke="#fca5a5" strokeWidth="1.5" strokeDasharray="3 2" />
                    ))}

                    {/* Needle with bevel perpendicular (cuts fibers) */}
                    <ellipse cx="75" cy="85" rx="24" ry="8" fill="#ef4444" opacity="0.8" />
                    <line x1="50" y1="85" x2="100" y2="85" stroke="#fff" strokeWidth="2" />

                    {/* Outcome Badge */}
                    <rect x="15" y="125" width="120" height="18" rx="4" fill="#e11d48" />
                    <text x="75" y="137" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">CẮT ĐỨT SỢI &rarr; RÒ DNT / PDPH</text>
                  </g>
                </svg>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Tư thế nằm nghiêng:</strong> Đặt mặt vát kim hướng lên trần nhà (hoặc sang bên song song trục thân) để kim lách dọc giữa các sợi màng cứng.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Lắp lại nòng thông (Stylet) trước khi rút kim:</strong> Nghiên cứu Strupp (600 bệnh nhân, JAMA) chứng minh việc đút lại nòng trước khi rút kim làm giảm tới 50% nguy cơ đau đầu PDPH vì ngăn sợi màng nhện bị hút kẹt ra ngoài.</span>
                </div>
              </div>
            </div>

            {/* Manometer & Pressure Measurement Card */}
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full">
                  Kỹ Thuật Đo Áp Lực Mở
                </span>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base mt-1 flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Đo Áp Lực DNT Bằng Áp Kế (Manometer)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Kết nối cột áp kế thủy ngân/nước qua khóa ba chạc (3-way Stopcock).
                </p>
              </div>

              {/* Manometer Diagram */}
              <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                <svg viewBox="0 0 320 180" className="w-full h-auto max-h-[170px]">
                  {/* Manometer glass column */}
                  <g transform="translate(140, 10)">
                    <rect x="0" y="0" width="22" height="135" rx="3" fill="#f1f5f9" stroke="#64748b" strokeWidth="1.5" />
                    
                    {/* Liquid Column (CSF rising to ~150 mmH2O) */}
                    <rect x="2" y="65" width="18" height="68" fill="#38bdf8" opacity="0.75" />
                    <line x1="2" y1="65" x2="20" y2="65" stroke="#0284c7" strokeWidth="2" />
                    
                    {/* Scale tick marks */}
                    <text x="30" y="20" fill="#dc2626" fontSize="7.5" fontWeight="bold">300 (Tăng nặng)</text>
                    <line x1="16" y1="18" x2="22" y2="18" stroke="#dc2626" strokeWidth="1.5" />

                    <text x="30" y="50" fill="#ea580c" fontSize="7.5" fontWeight="bold">250 (Ngưỡng tăng áp lực)</text>
                    <line x1="14" y1="48" x2="22" y2="48" stroke="#ea580c" strokeWidth="1.5" />

                    <text x="30" y="80" fill="#16a34a" fontSize="7.5" fontWeight="bold">150 mmH2O (Bình thường)</text>
                    <line x1="12" y1="78" x2="22" y2="78" stroke="#16a34a" strokeWidth="2" />

                    <text x="30" y="115" fill="#ca8a04" fontSize="7.5" fontWeight="bold">60 mmH2O (Hạ áp)</text>
                    <line x1="14" y1="113" x2="22" y2="113" stroke="#ca8a04" strokeWidth="1.5" />

                    <text x="30" y="134" fill="#64748b" fontSize="7">0 mmH2O</text>
                  </g>

                  {/* 3-way Stopcock */}
                  <g transform="translate(130, 140)">
                    <circle cx="21" cy="15" r="10" fill="#0284c7" />
                    <line x1="21" y1="5" x2="21" y2="25" stroke="#fff" strokeWidth="2.5" />
                    <line x1="11" y1="15" x2="31" y2="15" stroke="#fff" strokeWidth="2.5" />
                    <text x="40" y="18" fill="#0284c7" fontSize="8" fontWeight="bold">Khóa 3 chạc</text>
                  </g>

                  {/* Spinal Needle connected to left */}
                  <g transform="translate(20, 150)">
                    <rect x="0" y="0" width="115" height="4" fill="#94a3b8" />
                    <polygon points="0,-3 -8,2 0,7" fill="#0369a1" />
                    <text x="50" y="-5" fill="#475569" fontSize="8" fontWeight="bold">Kim tủy sống</text>
                  </g>
                </svg>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
                <div className="flex items-start gap-1.5">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
                  <span><strong>Tư thế chuẩn để đo áp lực:</strong> Bệnh nhân nằm nghiêng, <em>duỗi nhẹ 2 chân</em> và thả lỏng nhịp thở (co gập gối quá mức hoặc gồng bụng sẽ làm tăng áp lực ổ bụng và tăng giả tạo áp lực DNT).</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
                  <span><strong>Passive Drainage:</strong> Sau khi đo áp lực, chuyển khóa 3 chạc cho dịch nhỏ giọt tự nhiên vào các ống nghiệm. <em>Tuyệt đối không dùng bơm tiêm hút</em> vì có thể làm tổn thương chùm đuôi ngựa hoặc gây xuất huyết.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: STEP-BY-STEP CHECKLIST */}
      {subTab === 'steps' && (
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/80 pb-3">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  Bảng Kiểm Quy Trình Thực Hành 6 Bước (Procedure Checklist)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Chuẩn hóa theo tài liệu hướng dẫn lâm sàng cho bác sĩ nội thần kinh và cấp cứu.
                </p>
              </div>
              <span className="text-[11px] font-bold text-teal-800 dark:text-teal-300 bg-teal-100 dark:bg-teal-950 px-2.5 py-1 rounded-xl self-start sm:self-auto">
                Vô khuẩn tuyệt đối (Strict Aseptic)
              </span>
            </div>

            <div className="space-y-3">
              {[
                {
                  step: 'BƯỚC 1',
                  title: 'Chuẩn bị bệnh nhân & Đặt tư thế',
                  details: 'Giải thích thủ thuật, ký cam kết. Lập đường truyền tĩnh mạch ngoại vi sẵn sàng. Đặt bệnh nhân nằm nghiêng mép giường, cong lưng tối đa (đầu gối chạm ngực, cằm chạm ngực). Giữ trục cột sống thẳng song song mặt giường, không vặn xoắn xương chậu.',
                  badge: 'Tư thế con tôm'
                },
                {
                  step: 'BƯỚC 2',
                  title: 'Xác định mốc giải phẫu & Khe chọc an toàn',
                  details: 'Sờ tìm hai mào chậu (iliac crests), kẻ đường ngang Tuffier cắt cột sống ở mỏm gai L4. Chọn khe L3-L4 hoặc L4-L5 ngay dưới hoặc trên đường này. Đánh dấu vị trí kim đi vào chính giữa đường giữa (Midline).',
                  badge: 'Khe L3-L4 / L4-L5'
                },
                {
                  step: 'BƯỚC 3',
                  title: 'Sát khuẩn & Gây tê từng lớp',
                  details: 'Đội mũ, đeo khẩu trang, rửa tay ngoại khoa, mang găng vô khuẩn. Sát khuẩn Povidone-Iodine hoặc Chlorhexidine từ tâm ra ngoài theo hình xoắn ốc (bán kính ≥ 15 cm). Trải săng có lỗ vô khuẩn. Tiêm tê Lidocaine 1% tạo nốt phồng trong da, sau đó gây tê sâu theo hướng chọc kim vào dây chằng liên gai.',
                  badge: 'Lidocaine 1%'
                },
                {
                  step: 'BƯỚC 4',
                  title: 'Chọc kim có nòng thông (Stylet) & Hướng kim',
                  details: 'Cầm kim chọc tủy sống (Quincke 20-22G) có nòng thông giữa ngón cái và ngón trỏ. Hướng mặt vát kim song song với các sợi dọc màng cứng (hướng lên trần nhà khi nằm nghiêng). Đâm kim chậm rãi nghiêng nhẹ 10-15 độ về phía rốn (rostral direction).',
                  badge: 'Mặt vát song song'
                },
                {
                  step: 'BƯỚC 5',
                  title: 'Cảm giác "Sụp hẫng" (Pop) & Đo áp lực mở',
                  details: 'Cảm nhận sức cản qua dây chằng vàng, sau đó có cảm giác "sụp hẫng" khi qua màng cứng vào khoang dưới nhện (~4-5 cm). Rút nòng stylet quan sát dịch não tủy chảy ra. Lắp ngay khóa 3 chạc và cột áp kế Manometer, yêu cầu bệnh nhân thả lỏng chân để đo áp lực mở chính xác.',
                  badge: 'Áp kế Manometer'
                },
                {
                  step: 'BƯỚC 6',
                  title: 'Thu thập 4 lọ mẫu DNT & Chăm sóc sau chọc',
                  details: 'Chuyển khóa cho dịch chảy tự nhiên (không hút) vào 4 lọ xét nghiệm tiêu chuẩn (Ống 1: Tế bào; Ống 2: Hóa sinh; Ống 3: Vi sinh/Cấy; Ống 4: Đối chiếu/PCR). Lắp lại nòng thông Stylet TRƯỚC KHI rút kim ra. Băng ép gạc vô khuẩn. Cho bệnh nhân nằm bất động tại giường 4-6 giờ.',
                  badge: 'Nằm nghỉ 4-6h'
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
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
    </div>
  );
};
