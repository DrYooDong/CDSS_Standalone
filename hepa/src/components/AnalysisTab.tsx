/**
 * HepaCDSS Analysis Tab Component (Streamlined & Consolidated)
 * Tích hợp Phân tích tổn thương tế bào gan, Tỷ số sinh hóa và Động học men gan (Kinetics).
 */

import React, { useState } from 'react';
import { HepaAnalysisResult, TimePointLab } from '../types';
import { HepaKineticsEngine } from '../engine/kinetics';
import {
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  Stethoscope,
  Info,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Clock,
  Calendar,
  Plus,
  Trash2,
  Sparkles,
  Zap,
} from 'lucide-react';

interface AnalysisTabProps {
  result: HepaAnalysisResult;
  currentLab: {
    alt: number;
    ast: number;
    alp?: number;
    ggt?: number;
    totalBilirubin: number;
    inr?: number;
  };
  onNavigateToScores: () => void;
  onNavigateToProtocols: () => void;
}

export const AnalysisTab: React.FC<AnalysisTabProps> = ({
  result,
  currentLab,
  onNavigateToScores,
  onNavigateToProtocols,
}) => {
  const [subView, setSubView] = useState<'pattern' | 'kinetics'>('pattern');

  // Quản lý mốc thời gian động học
  const [points, setPoints] = useState<TimePointLab[]>([
    {
      id: 'd0',
      dayLabel: 'D0 (Vào viện)',
      timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      alt: Math.max(Math.round(currentLab.alt * 1.8), 120),
      ast: Math.max(Math.round(currentLab.ast * 2.1), 150),
      alp: currentLab.alp,
      totalBilirubin: Math.max(Math.round(currentLab.totalBilirubin * 0.8), 20),
      inr: currentLab.inr ? Number((currentLab.inr * 1.2).toFixed(1)) : 1.3,
    },
    {
      id: 'd1',
      dayLabel: 'D1 (24 giờ)',
      timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      alt: Math.max(Math.round(currentLab.alt * 1.3), 90),
      ast: Math.max(Math.round(currentLab.ast * 1.4), 100),
      alp: currentLab.alp,
      totalBilirubin: currentLab.totalBilirubin,
      inr: currentLab.inr ?? 1.1,
    },
    {
      id: 'd2',
      dayLabel: 'D2 (Hiện tại)',
      timestamp: new Date().toISOString(),
      alt: currentLab.alt,
      ast: currentLab.ast,
      alp: currentLab.alp,
      totalBilirubin: currentLab.totalBilirubin,
      inr: currentLab.inr,
    },
  ]);

  const [newLabel, setNewLabel] = useState('');
  const [newAlt, setNewAlt] = useState('');
  const [newAst, setNewAst] = useState('');
  const [newBili, setNewBili] = useState('');
  const [newInr, setNewInr] = useState('');

  // Chạy engine phân tích động học
  const kineticsAnalysis = HepaKineticsEngine.analyzeKinetics(points);

  const handleAddPoint = () => {
    if (!newLabel || !newAlt || !newAst) return;
    const newPoint: TimePointLab = {
      id: `pt-${Date.now()}`,
      dayLabel: newLabel,
      timestamp: new Date().toISOString(),
      alt: Number(newAlt) || 0,
      ast: Number(newAst) || 0,
      totalBilirubin: Number(newBili) || 15,
      inr: newInr ? Number(newInr) : undefined,
    };
    setPoints(prev => [...prev, newPoint]);
    setNewLabel('');
    setNewAlt('');
    setNewAst('');
    setNewBili('');
    setNewInr('');
  };

  const handleRemovePoint = (id: string) => {
    if (points.length <= 2) return;
    setPoints(points.filter(p => p.id !== id));
  };

  const loadScenario = (type: 'shock' | 'failure' | 'biliary') => {
    if (type === 'shock') {
      setPoints([
        { id: '1', dayLabel: 'D0 (Vào viện sau sốc)', timestamp: '2026-10-20T08:00:00Z', alt: 8200, ast: 12500, alp: 130, totalBilirubin: 38, inr: 2.1 },
        { id: '2', dayLabel: 'D1 (24h sau bù dịch)', timestamp: '2026-10-21T08:00:00Z', alt: 3600, ast: 4100, alp: 135, totalBilirubin: 35, inr: 1.6 },
        { id: '3', dayLabel: 'D2 (48h phục hồi)', timestamp: '2026-10-22T08:00:00Z', alt: 1400, ast: 1200, alp: 125, totalBilirubin: 28, inr: 1.2 },
      ]);
    } else if (type === 'failure') {
      setPoints([
        { id: '1', dayLabel: 'D0 (Khởi phát nặng)', timestamp: '2026-10-20T08:00:00Z', alt: 5600, ast: 4800, alp: 120, totalBilirubin: 45, inr: 1.3 },
        { id: '2', dayLabel: 'D2 (Men tụt, Bili vọt)', timestamp: '2026-10-22T08:00:00Z', alt: 1200, ast: 950, alp: 140, totalBilirubin: 145, inr: 2.9 },
      ]);
    } else if (type === 'biliary') {
      setPoints([
        { id: '1', dayLabel: 'D0 (Sỏi kẹt OMC sớm)', timestamp: '2026-10-20T08:00:00Z', alt: 680, ast: 590, alp: 180, totalBilirubin: 40, inr: 1.0 },
        { id: '2', dayLabel: 'D2 (Ứ mật tăng ưu thế)', timestamp: '2026-10-22T08:00:00Z', alt: 140, ast: 110, alp: 520, totalBilirubin: 120, inr: 1.1 },
      ]);
    }
  };

  const getPatternBadge = (pattern: string) => {
    switch (pattern) {
      case 'hepatocellular':
        return { label: 'Tế Bào Gan', color: 'bg-rose-100 text-rose-800 border-rose-300' };
      case 'cholestatic':
        return { label: 'Ứ Mật', color: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'mixed':
        return { label: 'Hỗn Hợp', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' };
      case 'isolated_hyperbilirubinemia':
        return { label: 'Tăng Bili Đơn Độc', color: 'bg-purple-100 text-purple-800 border-purple-300' };
      default:
        return { label: 'Bình Thường', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    }
  };

  const getTierBanner = (tier: string) => {
    if (tier === 'emergency_transplant') {
      return {
        bg: 'bg-rose-50 border-rose-500 text-rose-950',
        badge: 'bg-rose-600 text-white',
        icon: <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />,
        title: 'CẤP CỨU HỒI SỨC GAN MẬT / XEM XÉT GHÉP GAN',
        desc: 'Bệnh nhân có dấu hiệu suy gan cấp (ALF), tổn thương khổng lồ hoặc dương tính Định luật Hy.',
      };
    }
    if (tier === 'specialist') {
      return {
        bg: 'bg-amber-50 border-amber-500 text-amber-950',
        badge: 'bg-amber-500 text-white',
        icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
        title: 'CHUYỂN TUYẾN CHUYÊN KHOA TIÊU HÓA - GAN MẬT',
        desc: 'Tổn thương gan mức vừa-nặng, hội chứng ứ mật hoặc xơ gan tiến triển cần can thiệp chuyên sâu.',
      };
    }
    return {
      bg: 'bg-emerald-50 border-emerald-500 text-emerald-950',
      badge: 'bg-emerald-600 text-white',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
      title: 'QUẢN LÝ & THEO DÕI TẠI TUYẾN CƠ SỞ / NGOẠI TRÚ',
      desc: 'Bất thường nhẹ hoặc nguy cơ xơ hóa thấp. Kiểm soát chuyển hóa, lối sống và hẹn tái khám.',
    };
  };

  const tierInfo = getTierBanner(result.referralTier);
  const patternInfo = getPatternBadge(result.pattern);

  return (
    <div className="space-y-4">
      {/* 1. BANNER PHÂN TẦNG NGUY CƠ */}
      <div className={`p-3.5 rounded-xl border-l-4 ${tierInfo.bg} shadow-xs flex items-center justify-between gap-3`}>
        <div className="flex items-center gap-3">
          {tierInfo.icon}
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[9px] font-black px-2 py-0.5 rounded tracking-wider ${tierInfo.badge}`}>
                {result.referralTier.replace('_', ' ').toUpperCase()}
              </span>
              <h3 className="text-xs font-bold">{tierInfo.title}</h3>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">{tierInfo.desc}</p>
          </div>
        </div>
      </div>

      {/* 2. CẢNH BÁO RED FLAGS (NẾU CÓ) */}
      {result.redFlags.length > 0 && (
        <div className="space-y-2">
          {result.redFlags.map(rf => (
            <div
              key={rf.id}
              className={`p-3 rounded-xl border-l-4 shadow-xs flex items-start gap-2.5 ${
                rf.severity === 'emergency'
                  ? 'bg-rose-50 border-rose-600 text-rose-950'
                  : 'bg-amber-50 border-amber-600 text-amber-950'
              }`}
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div className="text-xs space-y-0.5">
                <span className="font-black uppercase tracking-wide block">{rf.title}</span>
                <p className="text-slate-700 leading-tight">{rf.description}</p>
                <div className="text-[11px] font-bold text-rose-800">
                  <span className="underline">Xử trí:</span> {rf.immediateAction}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. 4 CHỈ SỐ CỐT LÕI (HIGH-DENSITY GRID) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Chỉ số R */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Chỉ số R (Pattern)
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-black text-slate-900">{result.rRatio}</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${patternInfo.color}`}>
              {patternInfo.label}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {result.rRatio >= 5 ? 'R ≥ 5 (Tế bào)' : result.rRatio <= 2 ? 'R ≤ 2 (Ứ mật)' : '2 < R < 5'}
          </span>
        </div>

        {/* De Ritis */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            De Ritis (AST/ALT)
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-black text-slate-900">{result.deRitisRatio}</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                result.deRitisRatio >= 2.0
                  ? 'bg-rose-100 text-rose-800'
                  : result.deRitisRatio > 1.0
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {result.deRitisRatio >= 2.0 ? 'Rượu/ARLD' : result.deRitisRatio > 1.0 ? 'Nghi Xơ Gan' : '< 1.0'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            AST {currentLab.ast} / ALT {currentLab.alt}
          </span>
        </div>

        {/* Mức độ tăng men */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Mức Độ Tăng Men
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span
              className={`text-xs px-2 py-0.5 rounded font-black ${
                result.severity === 'massive'
                  ? 'bg-purple-900 text-white'
                  : result.severity === 'severe'
                  ? 'bg-rose-600 text-white'
                  : result.severity === 'moderate'
                  ? 'bg-amber-500 text-white'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {result.severity.toUpperCase()}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            ALT: {result.altMultiples}x | AST: {result.astMultiples}x ULN
          </span>
        </div>

        {/* Chức năng tổng hợp & Xơ hóa */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Xơ Hóa &amp; Bili
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-black text-teal-700">
              {result.fib4?.score ?? `${result.normalizedValues.totalBilirubinMgDl} mg`}
            </span>
            <span className="text-[10px] text-slate-500 font-semibold">
              {result.fib4 ? `FIB-4 (${result.fib4.riskCategory})` : 'Bilirubin TP'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
            INR: {currentLab.inr ?? 'N/A'} | Alb: {result.normalizedValues.albuminGDl ?? 'N/A'} g/dL
          </span>
        </div>
      </div>

      {/* 4. CHUYỂN ĐỔI CHẾ ĐỘ XEM: TỔN THƯƠNG vs ĐỘNG HỌC */}
      <div className="flex items-center justify-between border-b border-slate-200 pt-1 pb-2">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setSubView('pattern')}
            className={`px-3 py-1 rounded-md font-bold transition flex items-center gap-1.5 ${
              subView === 'pattern'
                ? 'bg-white text-teal-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Tiếp Cận Tổn Thương &amp; Chẩn Đoán</span>
          </button>

          <button
            type="button"
            onClick={() => setSubView('kinetics')}
            className={`px-3 py-1 rounded-md font-bold transition flex items-center gap-1.5 ${
              subView === 'kinetics'
                ? 'bg-white text-teal-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Động Học Diễn Tiến Men Gan (Kinetics)</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
          {subView === 'pattern' ? 'ACG 2024 & WHO Standard' : 'Theo dõi chuỗi thời gian D0-D2'}
        </span>
      </div>

      {/* SUB-VIEW 1: TIẾP CẬN TỔN THƯƠNG */}
      {subView === 'pattern' && (
        <div className="space-y-4">
          {/* Nhận định sinh hóa */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
              <Info className="w-3.5 h-3.5 text-teal-600" />
              <span>Tóm Tắt Sinh Lý Bệnh &amp; Tỷ Số</span>
            </h4>
            <div className="text-xs text-slate-700 space-y-1">
              <p>• <span className="font-bold">Kiểu tổn thương:</span> {result.patternDescription}</p>
              <p>• <span className="font-bold">Động học De Ritis:</span> {result.deRitisInterpretation}</p>
              {result.astLdhInterpretation && (
                <p className="text-rose-900 font-semibold">• <span className="font-bold">AST/LDH:</span> {result.astLdhInterpretation}</p>
              )}
              {result.wilsonRatioAlpBili && (
                <p>• <span className="font-bold">ALP/Bilirubin:</span> {result.wilsonRatioAlpBili} (Bình thường &gt; 4.0)</p>
              )}
              <p>• <span className="font-bold">Bilirubin toàn phần:</span> {result.normalizedValues.totalBilirubinMgDl} mg/dL ({result.normalizedValues.totalBilirubinUmolL} µmol/L). {result.conjugatedPercent !== undefined && `Trực tiếp: ${result.conjugatedPercent}%.`}</p>
            </div>
          </div>

          {/* Chẩn đoán phân biệt */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-teal-600" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Chẩn Đoán Phân Biệt Xếp Theo Xác Suất Lâm Sàng
                </h3>
              </div>
              <span className="text-[11px] text-slate-500 font-semibold">
                {result.differentialDiagnoses.length} bệnh cảnh phù hợp
              </span>
            </div>

            {result.differentialDiagnoses.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2 text-center">
                Các chỉ số sinh hóa gan hiện nằm trong khoảng bình thường hoặc biến thiên tối thiểu.
              </p>
            ) : (
              <div className="space-y-2">
                {result.differentialDiagnoses.map((diff, index) => {
                  const isVeryHigh = diff.likelihood === 'very_high';
                  const isHigh = diff.likelihood === 'high';
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border transition text-xs ${
                        isVeryHigh
                          ? 'bg-teal-50/70 border-teal-300'
                          : isHigh
                          ? 'bg-slate-50 border-slate-200'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                            {index + 1}
                          </span>
                          <h4 className="font-bold text-slate-900">{diff.disease}</h4>
                        </div>
                        <span
                          className={`text-[9px] font-black px-1.5 py-0.2 rounded uppercase ${
                            isVeryHigh
                              ? 'bg-teal-600 text-white'
                              : isHigh
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {diff.likelihood.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1 leading-tight">{diff.clues}</p>
                      <div className="mt-1.5 pt-1.5 border-t border-slate-200/50 flex items-center gap-1.5 text-teal-900 font-medium">
                        <FileCheck2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span><strong className="text-slate-800">Xét nghiệm kế tiếp:</strong> {diff.confirmingTests}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Lộ trình can thiệp ACG & WHO */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-2">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide border-b border-slate-100 pb-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Khuyến Cáo Lộ Trình Can Thiệp (ACG &amp; WHO Guidelines)</span>
            </h3>
            <div className="space-y-1.5">
              {result.stepByStepRecommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg text-xs text-slate-800">
                  <span className="w-3.5 h-3.5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="leading-tight">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: ĐỘNG HỌC MEN GAN (KINETICS) */}
      {subView === 'kinetics' && (
        <div className="space-y-4">
          {/* Nạp mẫu nhanh */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-teal-600" />
              <span className="font-bold text-slate-800">Kịch bản động học điển hình:</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => loadScenario('shock')}
                className="px-2 py-1 rounded bg-teal-100 hover:bg-teal-200 text-teal-900 font-bold transition text-[11px]"
              >
                Gan sốc (-50%)
              </button>
              <button
                type="button"
                onClick={() => loadScenario('failure')}
                className="px-2 py-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold transition text-[11px]"
              >
                Phân ly suy gan
              </button>
              <button
                type="button"
                onClick={() => loadScenario('biliary')}
                className="px-2 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold transition text-[11px]"
              >
                Sỏi OMC kẹt
              </button>
            </div>
          </div>

          {/* Kết luận nhận diện động học */}
          {kineticsAnalysis && (
            <div
              className={`p-3.5 rounded-xl border-l-4 shadow-xs space-y-1 ${
                kineticsAnalysis.isDissociationAlert
                  ? 'bg-rose-50 border-rose-600 text-rose-950 animate-pulse'
                  : kineticsAnalysis.pattern === 'rapid_halving_ischemic'
                  ? 'bg-teal-50 border-teal-600 text-teal-950'
                  : 'bg-indigo-50 border-indigo-600 text-indigo-950'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {kineticsAnalysis.isDissociationAlert ? (
                  <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                ) : (
                  <Sparkles className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                )}
                <div className="text-xs space-y-1">
                  <h4 className="font-black uppercase tracking-wide">{kineticsAnalysis.title}</h4>
                  <p className="font-semibold text-slate-800">{kineticsAnalysis.summary}</p>
                  <p className="text-slate-700 leading-tight">{kineticsAnalysis.clinicalImplication}</p>
                  {kineticsAnalysis.estimatedAltHalfLifeHours && (
                    <div className="text-[11px] font-bold text-teal-800 pt-0.5">
                      ⏱️ Thời gian bán hủy t½ của ALT ước tính: ~{kineticsAnalysis.estimatedAltHalfLifeHours} giờ (Bình thường ~47h).
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Bảng chuỗi số liệu */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                <span>Chuỗi Mốc Xét Nghiệm ({points.length} mốc)</span>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-2 px-3">Mốc</th>
                    <th className="py-2 px-2.5">ALT</th>
                    <th className="py-2 px-2.5">AST</th>
                    <th className="py-2 px-2.5">De Ritis</th>
                    <th className="py-2 px-2.5">ALP</th>
                    <th className="py-2 px-2.5">Bilirubin TP</th>
                    <th className="py-2 px-2.5">INR</th>
                    <th className="py-2 px-2 text-center">Xóa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {points.map(pt => {
                    const deRitis = Number((pt.ast / (pt.alt || 1)).toFixed(2));
                    return (
                      <tr key={pt.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-2 px-3 font-bold text-slate-900">{pt.dayLabel}</td>
                        <td className="py-2 px-2.5 font-bold text-rose-600">{pt.alt}</td>
                        <td className="py-2 px-2.5 font-bold text-amber-600">{pt.ast}</td>
                        <td className="py-2 px-2.5 font-bold">
                          <span className={`px-1.5 py-0.2 rounded text-[10px] ${deRitis >= 2 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'}`}>
                            {deRitis}
                          </span>
                        </td>
                        <td className="py-2 px-2.5 text-teal-700">{pt.alp ?? '-'}</td>
                        <td className="py-2 px-2.5 font-bold text-slate-800">{pt.totalBilirubin}</td>
                        <td className="py-2 px-2.5 font-bold text-indigo-700">{pt.inr ?? '-'}</td>
                        <td className="py-2 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemovePoint(pt.id)}
                            disabled={points.length <= 2}
                            className="text-slate-400 hover:text-rose-600 disabled:opacity-30 disabled:cursor-not-allowed p-0.5"
                            title="Xóa mốc"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Form thêm mốc mới */}
            <div className="p-3 bg-slate-50/80 border-t border-slate-200 flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="vd: D3 (72h)"
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                className="px-2 py-1 text-xs font-medium border border-slate-300 rounded bg-white w-24 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="ALT"
                value={newAlt}
                onChange={e => setNewAlt(e.target.value)}
                className="px-2 py-1 text-xs font-bold border border-slate-300 rounded bg-white w-16 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="AST"
                value={newAst}
                onChange={e => setNewAst(e.target.value)}
                className="px-2 py-1 text-xs font-bold border border-slate-300 rounded bg-white w-16 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Bili (µmol)"
                value={newBili}
                onChange={e => setNewBili(e.target.value)}
                className="px-2 py-1 text-xs font-semibold border border-slate-300 rounded bg-white w-20 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
              <input
                type="number"
                step="0.1"
                placeholder="INR"
                value={newInr}
                onChange={e => setNewInr(e.target.value)}
                className="px-2 py-1 text-xs font-semibold border border-slate-300 rounded bg-white w-14 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddPoint}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Mốc</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. NÚT CHUYỂN NHANH */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        <button
          type="button"
          onClick={onNavigateToScores}
          className="p-2.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl flex items-center justify-between text-indigo-900 transition text-xs font-bold"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            <span>Thang Điểm Tiên Lượng (Child-Pugh, MELD, FIB-4)</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
        </button>

        <button
          type="button"
          onClick={onNavigateToProtocols}
          className="p-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl flex items-center justify-between text-rose-900 transition text-xs font-bold"
        >
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>DILI &amp; Phác Đồ Xử Trí (Thuốc Lao &amp; RUCAM)</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-rose-600" />
        </button>
      </div>
    </div>
  );
};
