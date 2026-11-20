import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Table2,
  AlertTriangle,
  Filter,
  Pill,
  Info,
  Sparkles,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { Language } from '../types';
import { ANTIBIOTICS } from '../data/antibiotics';
import {
  SPECTRUM_TABLES,
  SPECTRUM_LEGEND,
  SPECTRUM_QUADRILATERAL,
  SPECTRUM_GAP_RULES,
  SpectrumCell,
  SpectrumLevel,
  SpectrumTableDef
} from '../data/antibioticSpectrum';

interface AntibioticSpectrumModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSelectDrug?: (drugId: string) => void;
}

type SpectrumTabId = SpectrumTableDef['id'] | 'gaps';

function getCellBadgeClasses(cell: SpectrumCell): string {
  switch (cell.level) {
    case '+++':
      return 'bg-emerald-600 text-white border-emerald-700 shadow-2xs';
    case '++':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case '+':
      return 'bg-amber-100 text-amber-900 border-amber-300';
    case '+/-':
      return 'bg-orange-50 text-orange-800 border-orange-300';
    case '0':
      return cell.emphasis
        ? 'bg-rose-50 text-rose-700 border-rose-300 font-black ring-1 ring-rose-200'
        : 'bg-slate-100 text-slate-400 border-slate-200';
  }
}

function getGroupHeaderColor(group?: 'gram_pos' | 'gram_neg' | 'anaerobe' | 'atypical'): string {
  switch (group) {
    case 'gram_pos':
      return 'bg-indigo-50/90 text-indigo-900 border-b-indigo-200';
    case 'gram_neg':
      return 'bg-rose-50/90 text-rose-900 border-b-rose-200';
    case 'anaerobe':
      return 'bg-amber-50/90 text-amber-900 border-b-amber-200';
    case 'atypical':
      return 'bg-teal-50/90 text-teal-900 border-b-teal-200';
    default:
      return 'bg-slate-50 text-slate-800 border-b-slate-200';
  }
}

function isStrongActivity(level: SpectrumLevel): boolean {
  return level === '+++' || level === '++';
}

export const AntibioticSpectrumModal: React.FC<AntibioticSpectrumModalProps> = ({
  isOpen,
  onClose,
  language,
  onSelectDrug
}) => {
  const [activeTab, setActiveTab] = useState<SpectrumTabId>('beta_lactam');
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedColId, setFocusedColId] = useState<string | null>(null);
  const [onlyActiveForFocused, setOnlyActiveForFocused] = useState(false);

  const isEn = language === 'en';

  const drugNameMap = useMemo(() => {
    const map = new Map<string, string>();
    ANTIBIOTICS.forEach((d) => map.set(d.id, d.name));
    return map;
  }, []);

  const currentTable = useMemo(
    () => SPECTRUM_TABLES.find((t) => t.id === activeTab) || null,
    [activeTab]
  );

  const filteredRows = useMemo(() => {
    if (!currentTable) return [];
    const q = searchTerm.trim().toLowerCase();
    return currentTable.rows.filter((row) => {
      if (focusedColId && onlyActiveForFocused) {
        const cell = row.cells[focusedColId];
        if (!cell || !isStrongActivity(cell.level)) {
          return false;
        }
      }
      if (!q) return true;
      const inName = row.name.toLowerCase().includes(q);
      const inRep = row.representatives?.toLowerCase().includes(q) || false;
      const inNote = row.clinicalNote?.toLowerCase().includes(q) || false;
      const inCells = Object.values(row.cells).some((cell) =>
        cell.note?.toLowerCase().includes(q)
      );
      return inName || inRep || inNote || inCells;
    });
  }, [currentTable, searchTerm, focusedColId, onlyActiveForFocused]);

  const handleTabChange = (tabId: SpectrumTabId) => {
    setActiveTab(tabId);
    setFocusedColId(null);
    setOnlyActiveForFocused(false);
  };

  const handleColumnClick = (colId: string) => {
    if (focusedColId === colId) {
      setFocusedColId(null);
      setOnlyActiveForFocused(false);
    } else {
      setFocusedColId(colId);
    }
  };

  if (!isOpen) return null;

  const focusedColObj = currentTable?.columns.find((col) => col.id === focusedColId) || null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label={isEn ? 'Full Antibiotic Spectrum Matrix' : 'Bảng Phổ Kháng Sinh Đầy Đủ'}
    >
      <div className="bg-white rounded-2xl w-full max-w-[96vw] xl:max-w-[1400px] border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 px-4 sm:px-6 py-4 text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center shrink-0">
              <Table2 className="w-5 h-5 text-teal-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-extrabold tracking-tight truncate">
                  {isEn ? 'Full Antibiotic Spectrum Matrix' : 'Bảng Phổ Kháng Sinh Đầy Đủ'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-200 border border-teal-400/30">
                  IDSA 2024 • ESCMID • BVBND • CLSI
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 truncate mt-0.5">
                {isEn
                  ? 'Antibiotic Spectrum Quadrilateral: Gram(+), Gram(-), Anaerobes & Atypicals + 5 Clinical Spectrum Gaps'
                  : 'Tứ giác phổ kháng khuẩn: Gram dương, Gram âm, Kỵ khí & Không điển hình — kèm 5 Lỗ hổng phổ lâm sàng'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/15 transition-colors cursor-pointer shrink-0"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-3 sm:px-5 pt-2.5 pb-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex flex-wrap items-center gap-1.5">
            {SPECTRUM_TABLES.map((tbl) => {
              const active = activeTab === tbl.id;
              return (
                <button
                  key={tbl.id}
                  type="button"
                  onClick={() => handleTabChange(tbl.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{isEn ? tbl.tabLabelEn : tbl.tabLabelVi}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {tbl.rows.length}
                  </span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => handleTabChange('gaps')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'gaps'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{isEn ? '5 Spectrum Gaps' : '5 Lỗ Hổng Phổ'}</span>
            </button>
          </div>
        </div>

        {/* Table Toolbar (Search + Pathogen Reverse Lookup + Legend) */}
        {currentTable && (
          <div className="px-3 sm:px-5 py-3 bg-white border-b border-slate-200 space-y-2.5 shrink-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={
                    isEn
                      ? 'Filter antibiotic, group, or clinical note (e.g. Meropenem, MRSA, AmpC)...'
                      : 'Tìm kháng sinh, nhóm thuốc hoặc ghi chú (vd: Meropenem, Ceftaroline, AmpC, VRE)...'
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-8 py-1.5 text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    aria-label="Xóa tìm kiếm"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Focused Pathogen Reverse Filter */}
              <div className="flex flex-wrap items-center gap-2">
                {focusedColObj ? (
                  <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-xl px-2.5 py-1 text-xs">
                    <Filter className="w-3.5 h-3.5 text-teal-700" />
                    <span className="font-bold text-teal-900">
                      {isEn ? 'Target:' : 'Đang chọn:'} {focusedColObj.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => setOnlyActiveForFocused(!onlyActiveForFocused)}
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                        onlyActiveForFocused
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50'
                      }`}
                    >
                      {onlyActiveForFocused
                        ? isEn ? 'Showing +++ / ++' : 'Đang lọc +++ / ++'
                        : isEn ? 'Filter +++ / ++' : 'Chỉ hiện +++ / ++'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFocusedColId(null);
                        setOnlyActiveForFocused(false);
                      }}
                      className="text-teal-700 hover:text-teal-950 cursor-pointer"
                      title="Bỏ chọn cột"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>
                      {isEn
                        ? 'Tip: Click any pathogen column header to highlight & filter active drugs.'
                        : 'Mẹo: Bấm vào tiêu đề cột vi khuẩn bất kỳ để tô sáng và lọc nhanh thuốc nhạy (+++/++).'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Compact Legend */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] pt-1 border-t border-slate-100">
              <span className="font-extrabold text-slate-600 uppercase tracking-wide text-[10px]">
                {isEn ? 'Legend:' : 'Quy ước:'}
              </span>
              {SPECTRUM_LEGEND.map((item) => (
                <div key={item.level} className="inline-flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center justify-center min-w-[28px] px-1.5 py-0.2 rounded-md border text-[10px] font-extrabold ${getCellBadgeClasses(
                      { level: item.level }
                    )}`}
                  >
                    {item.level}
                  </span>
                  <span className="text-slate-600 font-medium">
                    {isEn ? item.labelEn : item.labelVi}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Scrollable Content */}
        <div className="flex-1 overflow-auto cockpit-dock-scroll bg-slate-50/60">
          {currentTable ? (
            <div className="p-3 sm:p-4">
              {/* Table Title */}
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    {isEn ? currentTable.titleEn : currentTable.titleVi}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isEn ? currentTable.subtitleEn : currentTable.subtitleVi}
                  </p>
                </div>
                <span className="text-[11px] font-bold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  {filteredRows.length} / {currentTable.rows.length}{' '}
                  {isEn ? 'antibiotics' : 'nhóm / kháng sinh'}
                </span>
              </div>

              {/* Matrix Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th
                        scope="col"
                        className="sticky left-0 z-20 bg-slate-900 text-white text-left px-3 py-2.5 font-extrabold min-w-[210px] sm:min-w-[250px] border-r border-slate-700"
                      >
                        {isEn ? 'Antibiotic / Class' : 'Nhóm / Kháng sinh đại diện'}
                      </th>
                      {currentTable.columns.map((col) => {
                        const isFocused = focusedColId === col.id;
                        return (
                          <th
                            key={col.id}
                            scope="col"
                            onClick={() => handleColumnClick(col.id)}
                            className={`px-2 py-2.5 text-center border-r border-slate-200/80 min-w-[86px] max-w-[130px] cursor-pointer select-none transition-colors ${
                              isFocused
                                ? 'bg-teal-600 text-white ring-2 ring-inset ring-teal-300'
                                : `${getGroupHeaderColor(col.group)} hover:brightness-95`
                            }`}
                            title={
                              isEn
                                ? `Click to focus on ${col.label}`
                                : `Bấm để tô sáng và lọc thuốc nhạy với ${col.label}`
                            }
                          >
                            <div className="font-extrabold leading-tight text-[11px]">
                              {col.label}
                            </div>
                            {col.subLabel && (
                              <div
                                className={`text-[10px] font-medium italic mt-0.5 leading-tight ${
                                  isFocused ? 'text-teal-100' : 'opacity-75'
                                }`}
                              >
                                {col.subLabel}
                              </div>
                            )}
                          </th>
                        );
                      })}
                      {currentTable.hasClinicalNoteCol && (
                        <th
                          scope="col"
                          className="bg-slate-100 text-slate-800 text-left px-3 py-2.5 font-extrabold min-w-[240px]"
                        >
                          {isEn ? 'Key Clinical Note' : 'Ghi chú lâm sàng quan trọng'}
                        </th>
                      )}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200/80">
                    {filteredRows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={
                            currentTable.columns.length +
                            1 +
                            (currentTable.hasClinicalNoteCol ? 1 : 0)
                          }
                          className="py-10 text-center text-slate-500"
                        >
                          <Info className="w-6 h-6 mx-auto mb-1.5 text-slate-400" />
                          <p className="font-semibold">
                            {isEn
                              ? 'No matching antibiotics found for the current filter.'
                              : 'Không tìm thấy kháng sinh phù hợp với bộ lọc hiện tại.'}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredRows.map((row, idx) => (
                        <tr
                          key={row.id}
                          className={`group transition-colors ${
                            idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                          } hover:bg-teal-50/40`}
                        >
                          {/* Sticky Antibiotic Column */}
                          <td className="sticky left-0 z-10 bg-white group-hover:bg-teal-50/70 px-3 py-2.5 border-r border-slate-200 align-top">
                            <div className="font-extrabold text-slate-900 leading-snug">
                              {row.name}
                            </div>
                            {row.representatives && (
                              <div className="text-[11px] italic text-slate-500 mt-0.5">
                                {row.representatives}
                              </div>
                            )}
                            {onSelectDrug && row.linkedDrugIds && row.linkedDrugIds.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {row.linkedDrugIds.map((drugId) => {
                                  const dName = drugNameMap.get(drugId);
                                  if (!dName) return null;
                                  return (
                                    <button
                                      key={drugId}
                                      type="button"
                                      onClick={() => {
                                        onSelectDrug(drugId);
                                        onClose();
                                      }}
                                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-colors cursor-pointer"
                                      title={`Xem liều & hiệu chỉnh thận của ${dName}`}
                                    >
                                      <Pill className="w-2.5 h-2.5" />
                                      <span>{dName}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </td>

                          {/* Activity Cells */}
                          {currentTable.columns.map((col) => {
                            const cell = row.cells[col.id] || { level: '0' as SpectrumLevel };
                            const isFocused = focusedColId === col.id;
                            return (
                              <td
                                key={col.id}
                                className={`px-1.5 py-2 text-center border-r border-slate-100 align-middle transition-colors ${
                                  isFocused ? 'bg-teal-50/80' : ''
                                }`}
                              >
                                <div className="flex flex-col items-center justify-center gap-0.5">
                                  <span
                                    className={`inline-flex items-center justify-center min-w-[34px] px-2 py-0.5 rounded-md border text-[11px] font-extrabold leading-none ${getCellBadgeClasses(
                                      cell
                                    )}`}
                                  >
                                    {cell.level}
                                  </span>
                                  {cell.note && (
                                    <span className="text-[10px] leading-tight text-slate-600 font-medium max-w-[125px] break-words">
                                      {cell.note}
                                    </span>
                                  )}
                                </div>
                              </td>
                            );
                          })}

                          {/* Optional Clinical Note Column (Table 1) */}
                          {currentTable.hasClinicalNoteCol && (
                            <td className="px-3 py-2 text-[11px] text-slate-700 leading-relaxed align-top">
                              {row.clinicalNote}
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* 5 Spectrum Gaps & Clinical Rules View */
            <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5">
              {/* Tứ giác phổ kháng khuẩn */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-teal-600" />
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    {isEn
                      ? 'The Antibiotic Spectrum Quadrilateral'
                      : '"Tứ Giác Phổ Kháng Khuẩn" Trong Thực Hành Lâm Sàng'}
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {SPECTRUM_QUADRILATERAL.map((q) => (
                    <div
                      key={q.id}
                      className={`rounded-xl border p-3 ${q.colorClass}`}
                    >
                      <div className="text-xs font-extrabold">
                        {isEn ? q.titleEn : q.titleVi}
                      </div>
                      <div className="text-[11px] opacity-85 mt-1 leading-snug">
                        {q.examples}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5 Spectrum Gaps */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    {isEn
                      ? '5 Essential Spectrum Gaps & Clinical Rules'
                      : '5 "Lỗ Hổng Phổ" (Spectrum Gaps) Và Quy Luật Lâm Sàng Cần Nhớ'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {SPECTRUM_GAP_RULES.map((rule) => {
                    const accentStyles: Record<typeof rule.accent, string> = {
                      rose: 'border-l-rose-500 bg-rose-50/40',
                      amber: 'border-l-amber-500 bg-amber-50/40',
                      sky: 'border-l-sky-500 bg-sky-50/40',
                      purple: 'border-l-purple-500 bg-purple-50/40',
                      teal: 'border-l-teal-500 bg-teal-50/40'
                    };
                    const badgeStyles: Record<typeof rule.accent, string> = {
                      rose: 'bg-rose-100 text-rose-800',
                      amber: 'bg-amber-100 text-amber-800',
                      sky: 'bg-sky-100 text-sky-800',
                      purple: 'bg-purple-100 text-purple-800',
                      teal: 'bg-teal-100 text-teal-800'
                    };

                    return (
                      <div
                        key={rule.id}
                        className={`bg-white rounded-xl border border-slate-200 border-l-4 p-4 shadow-2xs ${accentStyles[rule.accent]}`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs font-black flex items-center justify-center shrink-0">
                              {rule.id}
                            </span>
                            <h4 className="text-sm font-extrabold text-slate-900">
                              {isEn ? rule.titleEn : rule.titleVi}
                            </h4>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${badgeStyles[rule.accent]}`}
                          >
                            {rule.tag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed mb-2.5">
                          {rule.summaryVi}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {rule.highlights.map((h, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-800"
                            >
                              <CheckCircle2 className="w-3 h-3 text-teal-600 shrink-0" />
                              <span>{h}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-2.5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 shrink-0">
          <span>
            {isEn
              ? 'Sources: Antibiotics Basics for Clinicians, IDSA 2024 MDR Guidance, ESCMID, HTD (BVBND), CLSI.'
              : 'Nguồn tham chiếu: Antibiotics Basics for Clinicians, IDSA 2024, ESCMID, BV Bệnh Nhiệt Đới & chuẩn CLSI.'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isEn ? 'Close' : 'Đóng'}
          </button>
        </div>
      </div>
    </div>
  );
};
