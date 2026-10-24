/**
 * HepaCDSS Longitudinal Kinetics Tab Component
 * Theo dõi diễn tiến động học men gan và chức năng tổng hợp qua chuỗi ngày nằm viện.
 */

import React, { useState } from 'react';
import { TimePointLab } from '../types';
import { HepaKineticsEngine } from '../engine/kinetics';
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  Plus,
  Trash2,
  Calendar,
  CheckCircle,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

interface KineticsTabProps {
  currentLab: {
    alt: number;
    ast: number;
    alp?: number;
    ggt?: number;
    totalBilirubin: number;
    inr?: number;
  };
}

export const KineticsTab: React.FC<KineticsTabProps> = ({ currentLab }) => {
  // Khởi tạo danh sách các mốc thời gian mặc định
  const [points, setPoints] = useState<TimePointLab[]>([
    {
      id: 'd0',
      dayLabel: 'D0 (Vào viện)',
      timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      alt: 4800,
      ast: 7500,
      alp: 140,
      totalBilirubin: 35,
      inr: 1.8,
    },
    {
      id: 'd1',
      dayLabel: 'D1 (24 giờ)',
      timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      alt: 2300,
      ast: 3100,
      alp: 135,
      totalBilirubin: 32,
      inr: 1.5,
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
  const analysis = HepaKineticsEngine.analyzeKinetics(points);

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
    setPoints([...points, newPoint]);
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

  // Nạp các kịch bản động học mẫu để bác sĩ thử nghiệm nhanh
  const loadScenario = (type: 'shock' | 'failure' | 'biliary') => {
    if (type === 'shock') {
      setPoints([
        { id: '1', dayLabel: 'D0 (Vào viện sau sốc)', timestamp: '2026-10-20T08:00:00Z', alt: 8200, ast: 12500, alp: 130, totalBilirubin: 38, inr: 2.1 },
        { id: '2', dayLabel: 'D1 (24h sau bù dịch)', timestamp: '2026-10-21T08:00:00Z', alt: 3600, ast: 4100, alp: 135, totalBilirubin: 35, inr: 1.6 },
        { id: '3', dayLabel: 'D2 (48h phục hồi)', timestamp: '2026-10-22T08:00:00Z', alt: 1400, ast: 1200, alp: 125, totalBilirubin: 28, inr: 1.2 },
      ]);
    } else if (type === 'failure') {
      setPoints([
        { id: '1', dayLabel: 'D0 (Khởi phát viêm gan nặng)', timestamp: '2026-10-20T08:00:00Z', alt: 5600, ast: 4800, alp: 120, totalBilirubin: 45, inr: 1.3 },
        { id: '2', dayLabel: 'D2 (Tế bào gan hoại tử cạn)', timestamp: '2026-10-22T08:00:00Z', alt: 1200, ast: 950, alp: 140, totalBilirubin: 145, inr: 2.9 },
      ]);
    } else if (type === 'biliary') {
      setPoints([
        { id: '1', dayLabel: 'D0 (Sỏi kẹt OMC sớm)', timestamp: '2026-10-20T08:00:00Z', alt: 680, ast: 590, alp: 180, totalBilirubin: 40, inr: 1.0 },
        { id: '2', dayLabel: 'D2 (Ứ mật tăng ưu thế)', timestamp: '2026-10-22T08:00:00Z', alt: 140, ast: 110, alp: 520, totalBilirubin: 120, inr: 1.1 },
      ]);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. THANH TẢI NHANH KỊCH BẢN ĐỘNG HỌC MẪU */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-teal-600" />
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Mẫu Diễn Biến Động Học Lâm Sàng (Longitudinal Kinetics)
            </h3>
            <p className="text-[11px] text-slate-500">
              Nhận diện Gan sốc, Báo động suy gan cấp (phân ly men-bili), Sỏi mật kẹt di chuyển
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Tải mẫu nhanh:</span>
          <button
            type="button"
            onClick={() => loadScenario('shock')}
            className="text-xs px-2.5 py-1 rounded bg-teal-100 hover:bg-teal-200 text-teal-900 font-bold transition"
          >
            Gan sốc (-50%)
          </button>
          <button
            type="button"
            onClick={() => loadScenario('failure')}
            className="text-xs px-2.5 py-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold transition"
          >
            Báo động suy gan
          </button>
          <button
            type="button"
            onClick={() => loadScenario('biliary')}
            className="text-xs px-2.5 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold transition"
          >
            Sỏi OMC di chuyển
          </button>
        </div>
      </div>

      {/* 2. BANNER KẾT LUẬN NHẬN DIỆN MẪU ĐỘNG HỌC */}
      {analysis && (
        <div
          className={`p-4 rounded-xl border-l-4 ${
            analysis.isDissociationAlert
              ? 'bg-rose-50 border-rose-600 text-rose-950 animate-pulse'
              : analysis.pattern === 'rapid_halving_ischemic'
              ? 'bg-teal-50 border-teal-600 text-teal-950'
              : 'bg-indigo-50 border-indigo-600 text-indigo-950'
          } shadow-sm space-y-2`}
        >
          <div className="flex items-start gap-3">
            {analysis.isDissociationAlert ? (
              <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <Sparkles className="w-6 h-6 text-teal-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <h4 className="text-sm font-black uppercase tracking-wide">{analysis.title}</h4>
              <p className="text-xs font-semibold">{analysis.summary}</p>
              <p className="text-xs leading-relaxed text-slate-700 pt-1">
                {analysis.clinicalImplication}
              </p>
              {analysis.estimatedAltHalfLifeHours && (
                <div className="text-[11px] font-bold text-teal-800 pt-1">
                  ⏱️ Thời gian bán hủy t½ thực tế của ALT ước tính: ~{analysis.estimatedAltHalfLifeHours} giờ (Sinh lý chuẩn: ~47 giờ).
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. BẢNG DỮ LIỆU ĐỘNG HỌC QUA CÁC NGÀY */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-600" />
            <span>Chuỗi Số Liệu Xét Nghiệm ({points.length} mốc thời gian)</span>
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-2.5 px-4">Mốc Theo Dõi</th>
                <th className="py-2.5 px-3">ALT (U/L)</th>
                <th className="py-2.5 px-3">AST (U/L)</th>
                <th className="py-2.5 px-3">De Ritis (AST/ALT)</th>
                <th className="py-2.5 px-3">ALP (U/L)</th>
                <th className="py-2.5 px-3">Bilirubin TP</th>
                <th className="py-2.5 px-3">INR</th>
                <th className="py-2.5 px-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {points.map((pt, idx) => {
                const deRitis = Number((pt.ast / (pt.alt || 1)).toFixed(2));
                return (
                  <tr key={pt.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-4 font-bold text-slate-900">{pt.dayLabel}</td>
                    <td className="py-2.5 px-3 font-bold text-rose-600">{pt.alt}</td>
                    <td className="py-2.5 px-3 font-bold text-amber-600">{pt.ast}</td>
                    <td className="py-2.5 px-3 font-bold">
                      <span
                        className={`px-1.5 py-0.5 rounded ${
                          deRitis >= 2 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {deRitis}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-teal-700">{pt.alp ?? '-'}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">
                      {pt.totalBilirubin} µmol/L
                    </td>
                    <td className="py-2.5 px-3 font-bold text-indigo-700">{pt.inr ?? '-'}</td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemovePoint(pt.id)}
                        disabled={points.length <= 2}
                        className="text-slate-400 hover:text-rose-600 disabled:opacity-30 disabled:cursor-not-allowed p-1 transition"
                        title="Xóa mốc này"
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

        {/* Form thêm mốc thời gian mới */}
        <div className="p-4 bg-slate-50/60 border-t border-slate-200 flex flex-wrap items-center gap-2.5">
          <input
            type="text"
            placeholder="vd: D3 (Sau 72h)"
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-medium border border-slate-300 rounded-lg bg-white w-32 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="ALT"
            value={newAlt}
            onChange={e => setNewAlt(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-bold border border-slate-300 rounded-lg bg-white w-20 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="AST"
            value={newAst}
            onChange={e => setNewAst(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-bold border border-slate-300 rounded-lg bg-white w-20 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Bili (µmol/L)"
            value={newBili}
            onChange={e => setNewBili(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-white w-24 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
          <input
            type="number"
            step="0.1"
            placeholder="INR"
            value={newInr}
            onChange={e => setNewInr(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-white w-18 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddPoint}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Mốc</span>
          </button>
        </div>
      </div>
    </div>
  );
};
