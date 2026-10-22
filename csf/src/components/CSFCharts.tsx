import React, { useState } from 'react';
import { CSFInput, CSFAnalysisResult } from '../types/csf';
import { 
  Activity, 
  Droplet, 
  Layers, 
  Info, 
  BarChart3, 
  Grid3X3, 
  Dna, 
  ShieldCheck 
} from 'lucide-react';
import { normalizeInputs } from '../utils/csfAnalyzer';

interface Props {
  input: CSFInput;
  result: CSFAnalysisResult;
}

export const CSFCharts: React.FC<Props> = ({ input, result }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'glucose' | 'protein' | 'wbc'>('all');
  const { proteinMgDl, csfGlucoseMgDl } = normalizeInputs(input);

  const glucoseBenchmarks = [
    { label: 'Bình thường', range: '45 - 80 mg/dL', value: 65, color: 'bg-emerald-500' },
    { label: 'Vi rút / Vô khuẩn', range: '45 - 80 mg/dL', value: 60, color: 'bg-teal-500' },
    { label: 'Vi nấm (Crypto)', range: '20 - 45 mg/dL', value: 35, color: 'bg-amber-500' },
    { label: 'Lao màng não (TBM)', range: '15 - 40 mg/dL', value: 28, color: 'bg-orange-500' },
    { label: 'Viêm màng não mủ', range: '< 34 - 40 mg/dL', value: 20, color: 'bg-rose-500' },
  ];

  const proteinBenchmarks = [
    { label: 'Bình thường', range: '15 - 45 mg/dL', value: 30, color: 'bg-emerald-500' },
    { label: 'Vi rút / Vô khuẩn', range: '50 - 100 mg/dL', value: 75, color: 'bg-teal-500' },
    { label: 'Chọc chạm mạch', range: '50 - 120 mg/dL', value: 65, color: 'bg-sky-500' },
    { label: 'H/c Guillain-Barré', range: '100 - 300+ mg/dL', value: 180, color: 'bg-purple-500' },
    { label: 'Viêm màng não mủ', range: '100 - 500+ mg/dL', value: 280, color: 'bg-rose-500' },
    { label: 'Lao màng não (TBM)', range: '100 - 500+ mg/dL', value: 320, color: 'bg-amber-600' },
  ];

  const wbcBenchmarks = [
    { label: 'Bình thường', range: '0 - 5 /µL', value: 3, color: 'bg-emerald-500' },
    { label: 'H/c Guillain-Barré', range: '0 - 5 /µL', value: 2, color: 'bg-purple-500' },
    { label: 'Vi rút / Vô khuẩn', range: '10 - 500 /µL', value: 250, color: 'bg-teal-500' },
    { label: 'Lao màng não (TBM)', range: '50 - 500 /µL', value: 300, color: 'bg-amber-600' },
    { label: 'Vi nấm (Crypto)', range: '20 - 500 /µL', value: 150, color: 'bg-amber-500' },
    { label: 'Viêm màng não mủ', range: '1,000 - 5,000+ /µL', value: 3000, color: 'bg-rose-500' },
  ];

  const getPercent = (val: number, max: number) => {
    return Math.min(100, Math.max(0, (val / max) * 100));
  };

  const getWbcLogPercent = (val: number) => {
    if (val <= 0) return 2;
    const logVal = Math.log10(val + 1);
    const maxLog = Math.log10(10000);
    return Math.min(98, Math.max(2, (logVal / maxLog) * 100));
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 sm:p-5 md:p-6 space-y-5 transition-colors">
      {/* Header & Icon Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            Biểu Đồ So Sánh: Đường - Protein - Bạch Cầu
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Định vị chỉ số bệnh nhân đối chiếu dải tham chiếu quốc tế
          </p>
        </div>

        {/* Filter buttons converted into compact icon buttons on mobile / pills on desktop */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto text-xs">
          <button
            onClick={() => setActiveTab('all')}
            title="Xem tất cả 3 biểu đồ"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'all' 
                ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-2xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tất cả</span>
          </button>

          <button
            onClick={() => setActiveTab('glucose')}
            title="Biểu đồ mức đường DNT"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'glucose' 
                ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 shadow-2xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Droplet className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Đường</span>
          </button>

          <button
            onClick={() => setActiveTab('protein')}
            title="Biểu đồ mức protein DNT"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'protein' 
                ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-2xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Dna className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Protein</span>
          </button>

          <button
            onClick={() => setActiveTab('wbc')}
            title="Biểu đồ số lượng bạch cầu"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'wbc' 
                ? 'bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-400 shadow-2xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">Bạch cầu</span>
          </button>
        </div>
      </div>

      {/* Grid: 1 col on mobile, 2 on tablet, 3 on laptop */}
      <div className={`grid gap-4 ${
        activeTab === 'all' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
      }`}>
        {/* CHART 1: GLUCOSE */}
        {(activeTab === 'all' || activeTab === 'glucose') && (
          <div className="bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 rounded-xl p-3.5 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs">1. Nồng Độ Glucose &amp; Tỷ Số</h4>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60 font-bold font-mono">
                  {csfGlucoseMgDl.toFixed(1)} mg/dL
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Tỷ số DNT/Huyết thanh:{' '}
                <strong className={result.glucoseRatioPathological ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
                  {result.glucoseRatio !== null ? result.glucoseRatio : 'Chưa có'}
                </strong>{' '}
                {result.glucoseRatioPathological ? '(Bệnh lý < 0.4)' : '(Bình thường ≥ 0.6)'}
              </p>

              {/* Spectrum Meter */}
              <div className="mt-3">
                <div className="flex justify-between text-[9px] text-slate-400 dark:text-slate-500 font-mono mb-1">
                  <span>0</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">34 (Spanos)</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">45-80 (BT)</span>
                  <span>120+</span>
                </div>
                <div className="relative h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shadow-inner flex">
                  <div style={{ width: '28%' }} className="bg-rose-500 h-full"></div>
                  <div style={{ width: '10%' }} className="bg-amber-400 h-full"></div>
                  <div style={{ width: '30%' }} className="bg-emerald-500 h-full"></div>
                  <div style={{ width: '32%' }} className="bg-sky-400 h-full"></div>
                </div>

                {/* Patient pin marker */}
                <div className="relative h-5 mt-0.5">
                  <div
                    className="absolute -top-1 transform -translate-x-1/2 flex flex-col items-center transition-all duration-300"
                    style={{ left: `${getPercent(csfGlucoseMgDl, 120)}%` }}
                  >
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[5px] border-b-slate-900 dark:border-b-white"></div>
                    <span className="bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-[9px] font-bold px-1 py-0.2 rounded shadow-2xs whitespace-nowrap">
                      BN: {csfGlucoseMgDl.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Benchmarks */}
              <div className="mt-1 space-y-1.5">
                {glucoseBenchmarks.map((item, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between text-[11px] text-slate-700 dark:text-slate-300">
                      <span className="truncate">{item.label}</span>
                      <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">{item.range}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200/80 dark:bg-slate-700/80 rounded-full overflow-hidden flex">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${getPercent(item.value, 120)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-lg p-2 text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <span>
                {csfGlucoseMgDl < 34 ? 'Thỏa Spanos (<34): Vi khuẩn mủ/Lao tiêu thụ đường mạnh.' : 'Đường bình thường: Rất có giá trị loại trừ viêm mủ.'}
              </span>
            </div>
          </div>
        )}

        {/* CHART 2: PROTEIN */}
        {(activeTab === 'all' || activeTab === 'protein') && (
          <div className="bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 rounded-xl p-3.5 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs">2. Protein Toàn Phần</h4>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 font-bold font-mono">
                  {proteinMgDl.toFixed(1)} mg/dL
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Ngưỡng sinh lý: <strong className="text-slate-700 dark:text-slate-300">15 - 45 mg/dL</strong>
              </p>

              {/* Spectrum Meter */}
              <div className="mt-3">
                <div className="flex justify-between text-[9px] text-slate-400 dark:text-slate-500 font-mono mb-1">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">15-45 (BT)</span>
                  <span className="text-teal-600 dark:text-teal-400">50-100</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">220 (Spanos)</span>
                  <span>500+</span>
                </div>
                <div className="relative h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shadow-inner flex">
                  <div style={{ width: '12%' }} className="bg-emerald-500 h-full"></div>
                  <div style={{ width: '13%' }} className="bg-teal-400 h-full"></div>
                  <div style={{ width: '25%' }} className="bg-amber-500 h-full"></div>
                  <div style={{ width: '50%' }} className="bg-rose-600 h-full"></div>
                </div>

                {/* Patient pin marker */}
                <div className="relative h-5 mt-0.5">
                  <div
                    className="absolute -top-1 transform -translate-x-1/2 flex flex-col items-center transition-all duration-300"
                    style={{ left: `${getPercent(proteinMgDl, 450)}%` }}
                  >
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[5px] border-b-slate-900 dark:border-b-white"></div>
                    <span className="bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-[9px] font-bold px-1 py-0.2 rounded shadow-2xs whitespace-nowrap">
                      BN: {proteinMgDl.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Benchmarks */}
              <div className="mt-1 space-y-1.5">
                {proteinBenchmarks.map((item, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between text-[11px] text-slate-700 dark:text-slate-300">
                      <span className="truncate">{item.label}</span>
                      <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">{item.range}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200/80 dark:bg-slate-700/80 rounded-full overflow-hidden flex">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${getPercent(item.value, 400)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-lg p-2 text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <span>
                {result.albuminocytologicDissociation ? 'Phân ly Đạm - Tế bào: Gợi ý Guillain-Barré.' : proteinMgDl > 220 ? 'Thỏa Spanos (>220): Tổn thương hàng rào máu não nặng.' : 'Protein tăng nhẹ: Thường gặp trong viêm vi rút hoặc chạm mạch.'}
              </span>
            </div>
          </div>
        )}

        {/* CHART 3: WBC & DIFF */}
        {(activeTab === 'all' || activeTab === 'wbc') && (
          <div className="bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 rounded-xl p-3.5 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs">3. Bạch Cầu &amp; Dòng Tế Bào</h4>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-900 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60 font-bold font-mono">
                  {result.correctedWbc.toLocaleString()} /µL
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Bạch cầu thực tế (đã trừ chạm mạch: <strong className="text-teal-700 dark:text-teal-400">{result.predictedTraumaticWbc}</strong>)
              </p>

              {/* Spectrum Meter */}
              <div className="mt-3">
                <div className="flex justify-between text-[9px] text-slate-400 dark:text-slate-500 font-mono mb-1">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">≤5 (BT)</span>
                  <span className="text-teal-600 dark:text-teal-400">10-500</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">2,000 (Spanos)</span>
                  <span>10,000+</span>
                </div>
                <div className="relative h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shadow-inner flex">
                  <div style={{ width: '12%' }} className="bg-emerald-500 h-full"></div>
                  <div style={{ width: '48%' }} className="bg-teal-400 h-full"></div>
                  <div style={{ width: '40%' }} className="bg-rose-600 h-full"></div>
                </div>

                {/* Patient pin marker on log scale */}
                <div className="relative h-5 mt-0.5">
                  <div
                    className="absolute -top-1 transform -translate-x-1/2 flex flex-col items-center transition-all duration-300"
                    style={{ left: `${getWbcLogPercent(result.correctedWbc)}%` }}
                  >
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[5px] border-b-slate-900 dark:border-b-white"></div>
                    <span className="bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-[9px] font-bold px-1 py-0.2 rounded shadow-2xs whitespace-nowrap">
                      BN: {result.correctedWbc.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Differential stacked bar */}
              <div className="mt-2 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                  <span>Phân bổ dòng:</span>
                  <span>PMN: {input.neutrophilPercent}% | Lympho: {input.lymphocytePercent}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div style={{ width: `${input.neutrophilPercent}%` }} className="bg-rose-500 h-full"></div>
                  <div style={{ width: `${input.lymphocytePercent}%` }} className="bg-teal-500 h-full"></div>
                  <div style={{ width: `${input.monocytePercent}%` }} className="bg-amber-400 h-full"></div>
                </div>
              </div>

              {/* Benchmarks */}
              <div className="mt-1 space-y-1.5">
                {wbcBenchmarks.map((item, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between text-[11px] text-slate-700 dark:text-slate-300">
                      <span className="truncate">{item.label}</span>
                      <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">{item.range}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200/80 dark:bg-slate-700/80 rounded-full overflow-hidden flex">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${getWbcLogPercent(item.value)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-lg p-2 text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <span>
                {result.correctedWbc > 1000 && input.neutrophilPercent >= 80 ? 'Ưu thế bạch cầu đa nhân PMN: Rất điển hình cho viêm mủ.' : 'Ưu thế lympho: Phù hợp vi rút hoặc Lao.'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Responsive Matrix Comparison Table with sticky header */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition-colors">
        <div className="bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-700 dark:text-teal-400" />
            <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wide">
              Bảng Tổng Hợp Đối Chiếu Chuẩn (EFNS &amp; AAFP)
            </h5>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-2.5">Hội chứng</th>
                <th className="p-2.5">Áp lực mở</th>
                <th className="p-2.5">Bạch cầu</th>
                <th className="p-2.5">Ưu thế tế bào</th>
                <th className="p-2.5">Protein</th>
                <th className="p-2.5">Đường &amp; Tỷ số</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
              <tr className={result.topDiagnosis.category === 'normal' ? 'bg-emerald-50/80 dark:bg-emerald-950/40 font-bold' : ''}>
                <td className="p-2.5 font-semibold text-slate-900 dark:text-slate-100">Bình thường</td>
                <td className="p-2.5">60 - 250</td>
                <td className="p-2.5">&le; 5</td>
                <td className="p-2.5">Lympho &gt; 70%</td>
                <td className="p-2.5">&lt; 45</td>
                <td className="p-2.5">&ge; 0.6 (45-80)</td>
              </tr>
              <tr className={result.topDiagnosis.category === 'bacterial' ? 'bg-rose-50/80 dark:bg-rose-950/40 font-bold' : ''}>
                <td className="p-2.5 font-semibold text-rose-700 dark:text-rose-400">Viêm màng não mủ</td>
                <td className="p-2.5">&gt; 200 - 500</td>
                <td className="p-2.5">1,000 - 5,000+</td>
                <td className="p-2.5 text-rose-700 dark:text-rose-400 font-bold">PMN (80-95%)</td>
                <td className="p-2.5 text-rose-700 dark:text-rose-400 font-bold">&gt; 100 - 500+</td>
                <td className="p-2.5 text-rose-700 dark:text-rose-400 font-bold">&lt; 0.4 (&lt; 34)</td>
              </tr>
              <tr className={result.topDiagnosis.category === 'viral' ? 'bg-teal-50/80 dark:bg-teal-950/40 font-bold' : ''}>
                <td className="p-2.5 font-semibold text-teal-700 dark:text-teal-400">Vi rút / Vô khuẩn</td>
                <td className="p-2.5">BT / Tăng nhẹ</td>
                <td className="p-2.5">10 - 500</td>
                <td className="p-2.5">Lympho ưu thế</td>
                <td className="p-2.5">50 - 100</td>
                <td className="p-2.5 text-emerald-700 dark:text-emerald-400 font-bold">&ge; 0.5 (BT)</td>
              </tr>
              <tr className={result.topDiagnosis.category === 'tuberculous' ? 'bg-amber-50/80 dark:bg-amber-950/40 font-bold' : ''}>
                <td className="p-2.5 font-semibold text-amber-800 dark:text-amber-400">Lao màng não (TBM)</td>
                <td className="p-2.5">Thường tăng</td>
                <td className="p-2.5">50 - 500</td>
                <td className="p-2.5">Lympho ưu thế</td>
                <td className="p-2.5 text-amber-800 dark:text-amber-400 font-bold">100 - 500+</td>
                <td className="p-2.5 text-amber-800 dark:text-amber-400 font-bold">&lt; 0.35 (giảm sâu)</td>
              </tr>
              <tr className={result.topDiagnosis.category === 'cryptococcal_fungal' ? 'bg-orange-50/80 dark:bg-orange-950/40 font-bold' : ''}>
                <td className="p-2.5 font-semibold text-orange-800 dark:text-orange-400">Vi nấm (Crypto)</td>
                <td className="p-2.5 text-orange-700 dark:text-orange-400 font-bold">&gt; 250</td>
                <td className="p-2.5">20 - 500</td>
                <td className="p-2.5">Lympho ưu thế</td>
                <td className="p-2.5">100 - 300</td>
                <td className="p-2.5">Hạ thấp (&lt; 0.4)</td>
              </tr>
              <tr className={result.topDiagnosis.category === 'subarachnoid_hemorrhage' ? 'bg-red-50/80 dark:bg-red-950/40 font-bold' : ''}>
                <td className="p-2.5 font-semibold text-red-700 dark:text-red-400">Xuất huyết dưới nhện</td>
                <td className="p-2.5">Tăng cao</td>
                <td className="p-2.5">Tương ứng máu</td>
                <td className="p-2.5">Tương ứng máu</td>
                <td className="p-2.5">Tăng do máu thoái biến</td>
                <td className="p-2.5">Bình thường</td>
              </tr>
              <tr className={result.topDiagnosis.category === 'guillain_barre' ? 'bg-purple-50/80 dark:bg-purple-950/40 font-bold' : ''}>
                <td className="p-2.5 font-semibold text-purple-700 dark:text-purple-400">H/c Guillain-Barré</td>
                <td className="p-2.5">Bình thường</td>
                <td className="p-2.5 text-emerald-700 dark:text-emerald-400 font-bold">&le; 5 (BT)</td>
                <td className="p-2.5">Đơn nhân</td>
                <td className="p-2.5 text-purple-700 dark:text-purple-400 font-bold">&gt; 50 - 300+</td>
                <td className="p-2.5">Bình thường</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
