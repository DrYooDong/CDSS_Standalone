import React from 'react';
import { PRESET_CASES } from '../data/presetCases';
import { PresetCase } from '../types/csf';
import { X, ClipboardList, Check, Sparkles, ChevronRight, Activity } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (preset: PresetCase) => void;
  currentId?: string;
}

export const PresetsModal: React.FC<Props> = ({ isOpen, onClose, onSelect, currentId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl max-w-xl w-full max-h-[88vh] sm:max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-2.5 sm:hidden"></div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 rounded-xl">
              <ClipboardList className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm md:text-base">
                Ca Bệnh Mẫu Thực Tế (Clinical Presets)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Chọn 1 ca lâm sàng kinh điển để kiểm tra phản ứng của hệ thống CDSS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="p-1.5 text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of cases */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1 divide-y divide-slate-100 dark:divide-slate-800/80">
          {PRESET_CASES.map((preset) => {
            const isSelected = currentId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  onSelect(preset);
                  onClose();
                }}
                className={`w-full text-left p-3.5 rounded-xl transition-all flex items-start justify-between gap-3 cursor-pointer group ${
                  isSelected 
                    ? 'bg-teal-50/80 dark:bg-teal-950/40 border border-teal-300 dark:border-teal-700 shadow-xs' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-800'
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs md:text-sm text-slate-900 dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                      {preset.title}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      preset.category === 'bacterial'
                        ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60'
                        : preset.category === 'viral'
                        ? 'bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60'
                        : preset.category === 'tuberculous'
                        ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60'
                        : preset.category === 'subarachnoid_hemorrhage'
                        ? 'bg-red-100 dark:bg-red-950/70 text-red-800 dark:text-red-300 border border-red-200/60 dark:border-red-800/60'
                        : preset.category === 'guillain_barre'
                        ? 'bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60'
                        : 'bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60'
                    }`}>
                      {preset.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {preset.shortDesc}
                  </p>
                </div>

                <div className="shrink-0 pt-1">
                  <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-teal-600 dark:group-hover:bg-teal-600 group-hover:text-white transition-colors flex items-center justify-center">
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
