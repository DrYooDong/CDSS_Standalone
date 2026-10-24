import React, { useMemo, useState } from 'react';
import { TdmEvaluationResult, TdmInput, InfusionMethod } from '../types';
import { Activity, ShieldAlert, Sparkles, CheckCircle2, Clock } from 'lucide-react';

interface VancomycinPkChartProps {
  tdmInput: TdmInput;
  tdmResult: TdmEvaluationResult;
  regimenMethod: InfusionMethod;
  mic?: number;
}

export const VancomycinPkChart: React.FC<VancomycinPkChartProps> = ({
  tdmInput,
  tdmResult,
  regimenMethod,
  mic = 1.0
}) => {
  const isContinuous = regimenMethod === 'continuous';
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Generate 24-hour pharmacokinetic simulation curve data points
  const points = useMemo(() => {
    const pts: {
      time: number;
      conc: number;
      isPeakSample?: boolean;
      isTroughSample?: boolean;
      isSingleSample?: boolean;
    }[] = [];

    if (isContinuous) {
      const css = tdmInput.steadyStateConcentration || 22.0;
      const kel = tdmResult.kel || 0.05;

      for (let t = 0; t <= 24; t += 0.25) {
        // Smooth approach to steady-state or steady curve
        const conc = Number((css * (1 - 0.08 * Math.exp(-kel * t))).toFixed(1));
        pts.push({
          time: t,
          conc
        });
      }
    } else {
      const dose = tdmInput.currentDoseMg || 1000;
      const tau = tdmInput.currentIntervalHours || 12;
      const tinf = tdmInput.infusionDurationHours || 1.5;
      const kel = tdmResult.kel || 0.058;
      const cMax = tdmResult.cMaxEstimated || 30.8;
      const cMin = tdmResult.cMinEstimated || 11.5;
      const vd = tdmResult.vdEstimated || 45;

      // Sample markers timing:
      const peakSampleTimeInCycle = tinf + (tdmInput.peakTimeAfterEndHours ?? 1.0);
      const troughSampleTimeInCycle = Math.max(0.5, tau - (tdmInput.troughTimeBeforeNextHours ?? 0.5));
      const singleSampleTimeInCycle = tdmInput.singleSampleType === 'random' && tdmInput.singleSampleHoursAfterDose
        ? Math.min(tau, tdmInput.singleSampleHoursAfterDose)
        : Math.max(0.5, tau - (tdmInput.troughTimeBeforeNextHours ?? 0.5));

      for (let t = 0; t <= 24; t += 0.25) {
        const tCycle = t % tau;
        let conc = cMin;

        if (tCycle <= tinf) {
          // Exact zero-order infusion with 1st-order elimination:
          const r = dose / tinf; // mg/h
          const rise = (r / (kel * vd)) * (1 - Math.exp(-kel * tCycle));
          conc = cMin * Math.exp(-kel * tCycle) + rise;
        } else {
          // Post-infusion mono-exponential elimination:
          const tElim = tCycle - tinf;
          conc = cMax * Math.exp(-kel * tElim);
        }

        const cleanConc = Math.max(0, Number(conc.toFixed(1)));
        const isPeak = Math.abs(tCycle - peakSampleTimeInCycle) < 0.15;
        const isTrough = Math.abs(tCycle - troughSampleTimeInCycle) < 0.15;
        const isSingle = Math.abs(tCycle - singleSampleTimeInCycle) < 0.15;

        pts.push({
          time: t,
          conc: cleanConc,
          isPeakSample: isPeak,
          isTroughSample: isTrough,
          isSingleSample: isSingle
        });
      }
    }

    return pts;
  }, [tdmInput, tdmResult, isContinuous]);

  const aucValue = tdmResult.auc24 > 0 ? tdmResult.auc24 : (isContinuous ? (tdmInput.steadyStateConcentration || 22) * 24 : 480);
  const aucMicRatio = Number((aucValue / mic).toFixed(0));

  const isTarget = aucMicRatio >= 400 && aucMicRatio <= 600;
  const isLow = aucMicRatio < 400;

  // Chart dimensions & scaling
  const width = 640;
  const height = 220;
  const padLeft = 40;
  const padRight = 20;
  const padTop = 15;
  const padBottom = 28;

  const innerW = width - padLeft - padRight;
  const innerH = height - padTop - padBottom;

  const maxConc = isContinuous ? 35 : 45;
  const getX = (t: number) => padLeft + (t / 24) * innerW;
  const getY = (c: number) => padTop + innerH - (Math.min(c, maxConc) / maxConc) * innerH;

  // Generate SVG path for curve
  const pathD = points.reduce((acc, p, idx) => {
    const x = getX(p.time);
    const y = getY(p.conc);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Generate Area path (closed at baseline y = innerH)
  const baseY = getY(0);
  const areaD = `${pathD} L ${getX(24)} ${baseY} L ${getX(0)} ${baseY} Z`;

  // Target band coordinates
  const targetBandTop = isContinuous ? getY(25) : getY(15);
  const targetBandBottom = isContinuous ? getY(20) : getY(10);
  const targetBandHeight = Math.abs(targetBandBottom - targetBandTop);

  // Toxic threshold y
  const toxicY = isContinuous ? getY(25) : getY(20);

  const hoveredPoint = hoverIndex !== null && points[hoverIndex] ? points[hoverIndex] : null;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3.5 sm:p-4 mt-3">
      {/* Chart Header & Target Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 mb-2.5 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              Đường cong Dược động học & Diện tích dưới đường cong (AUC/MIC)
            </h3>
            <p className="text-[11px] text-slate-500">
              Mô phỏng nồng độ vancomycin 24 giờ dựa trên thông số TDM thực tế
            </p>
          </div>
        </div>

        {/* Dynamic AUC/MIC Clinical Target Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-baseline gap-1 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg">
            <span className="text-[10px] text-slate-500 font-medium">AUC24/MIC:</span>
            <span className="text-xs font-bold font-mono text-slate-900">{aucMicRatio}</span>
            <span className="text-[9px] text-slate-400">mg·h/L</span>
          </div>

          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border tracking-tight ${
              isTarget
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : isLow
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-rose-50 text-rose-700 border-rose-300'
            }`}
          >
            {isTarget ? '✓ ĐẠT ĐÍCH (400 - 600)' : isLow ? '⚠️ DƯỚI ĐÍCH (<400)' : '⛔ VƯỢT ĐÍCH (>600)'}
          </span>
        </div>
      </div>

      {/* Pure Responsive SVG Chart */}
      <div className="w-full relative select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
          onMouseLeave={() => setHoverIndex(null)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = ((e.clientX - rect.left) / rect.width) * width;
            if (relX >= padLeft && relX <= width - padRight) {
              const t = ((relX - padLeft) / innerW) * 24;
              const idx = Math.min(points.length - 1, Math.max(0, Math.round(t / 0.25)));
              setHoverIndex(idx);
            }
          }}
        >
          <defs>
            <linearGradient id="pkGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d9488" stopOpacity={0.35} />
              <stop offset="90%" stopColor="#0d9488" stopOpacity={0.03} />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal) */}
          {[0, 10, 20, 30, 40].map((c) => {
            if (c > maxConc) return null;
            const y = getY(c);
            return (
              <g key={`grid-${c}`}>
                <line x1={padLeft} y1={y} x2={width - padRight} y2={y} stroke="#f1f5f9" strokeWidth={1} />
                <text x={padLeft - 6} y={y + 3} textAnchor="end" fontSize={9} fill="#94a3b8" fontFamily="monospace">
                  {c}
                </text>
              </g>
            );
          })}

          {/* Grid lines (vertical - time 0, 4, 8, 12, 16, 20, 24) */}
          {[0, 4, 8, 12, 16, 20, 24].map((t) => {
            const x = getX(t);
            return (
              <g key={`time-${t}`}>
                <line x1={x} y1={padTop} x2={x} y2={baseY} stroke="#f8fafc" strokeWidth={1} />
                <text x={x} y={baseY + 14} textAnchor="middle" fontSize={9} fill="#94a3b8" fontFamily="monospace">
                  {t}h
                </text>
              </g>
            );
          })}

          {/* Target therapeutic corridor (Green shaded area) */}
          <rect
            x={padLeft}
            y={targetBandTop}
            width={innerW}
            height={targetBandHeight}
            fill="#10b981"
            fillOpacity={0.08}
            stroke="#10b981"
            strokeWidth={1}
            strokeDasharray="3 3"
            strokeOpacity={0.3}
          />
          <text
            x={width - padRight - 6}
            y={targetBandTop + 11}
            textAnchor="end"
            fontSize={8.5}
            fill="#059669"
            fontWeight={600}
          >
            {isContinuous ? 'Vùng đích Css: 20–25 mg/L' : 'Vùng đích C_đáy: 10–15 mg/L'}
          </text>

          {/* Toxic threshold line */}
          <line
            x1={padLeft}
            y1={toxicY}
            x2={width - padRight}
            y2={toxicY}
            stroke="#f43f5e"
            strokeWidth={1.2}
            strokeDasharray="4 3"
          />
          <text
            x={width - padRight - 6}
            y={toxicY - 3}
            textAnchor="end"
            fontSize={8}
            fill="#e11d48"
            fontWeight={600}
          >
            {isContinuous ? 'Ngưỡng độc tính >25' : 'Nguy cơ AKI (Đáy >20)'}
          </text>

          {/* Area & PK Curve Line */}
          <path d={areaD} fill="url(#pkGradient)" />
          <path d={pathD} fill="none" stroke="#0d9488" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />

          {/* Measured Points Markers (if peak or trough) */}
          {points.map((p, idx) => {
            if (p.isPeakSample && idx > 0 && idx < points.length - 2) {
              const x = getX(p.time);
              const y = getY(p.conc);
              return (
                <g key={`pk-${idx}`}>
                  <circle cx={x} cy={y} r={4.5} fill="#0d9488" stroke="#ffffff" strokeWidth={2} />
                  <text x={x} y={y - 8} textAnchor="middle" fontSize={8} fontWeight={700} fill="#0f766e">
                    Đỉnh: {p.conc}
                  </text>
                </g>
              );
            }
            if (p.isTroughSample && idx > 0 && idx < points.length - 2) {
              const x = getX(p.time);
              const y = getY(p.conc);
              return (
                <g key={`tr-${idx}`}>
                  <circle cx={x} cy={y} r={4.5} fill="#4338ca" stroke="#ffffff" strokeWidth={2} />
                  <text x={x} y={y + 12} textAnchor="middle" fontSize={8} fontWeight={700} fill="#4338ca">
                    Đáy: {p.conc}
                  </text>
                </g>
              );
            }
            return null;
          })}

          {/* Active Hover Cursor & Tooltip */}
          {hoveredPoint && (
            <g>
              <line
                x1={getX(hoveredPoint.time)}
                y1={padTop}
                x2={getX(hoveredPoint.time)}
                y2={baseY}
                stroke="#64748b"
                strokeWidth={1}
                strokeDasharray="2 2"
              />
              <circle
                cx={getX(hoveredPoint.time)}
                cy={getY(hoveredPoint.conc)}
                r={5}
                fill="#0d9488"
                stroke="#ffffff"
                strokeWidth={2}
              />
            </g>
          )}
        </svg>

        {/* Hover Floating Box */}
        {hoveredPoint && (
          <div
            className="absolute pointer-events-none bg-slate-900/95 text-white px-2.5 py-1.5 rounded-lg text-[10px] shadow-lg border border-slate-700 z-10 transition-all"
            style={{
              left: `${Math.min(80, Math.max(10, (hoveredPoint.time / 24) * 100))}%`,
              top: '15px'
            }}
          >
            <div className="font-semibold text-teal-300">Giờ thứ {hoveredPoint.time}h</div>
            <div className="font-mono text-xs font-bold text-white">Nồng độ: {hoveredPoint.conc} mg/L</div>
            <div className="text-[9px] text-slate-400">
              {isContinuous ? 'Đích Css: 20–25 mg/L' : 'Mục tiêu C_đáy: 10–15 mg/L'}
            </div>
          </div>
        )}
      </div>

      {/* Clinical Interpretation Footer */}
      <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500/20 border border-emerald-500"></span>
            Khoảng nồng độ mục tiêu
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-rose-500"></span>
            Ngưỡng độc thận (AKI)
          </span>
        </div>

        <span className="text-slate-400 italic">
          * Diện tích tô màu phản ánh tích phân AUC24 (Mục tiêu 400 – 600 mg·h/L)
        </span>
      </div>
    </div>
  );
};
