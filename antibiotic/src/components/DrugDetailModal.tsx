import React, { useEffect } from 'react';
import { X, Pill } from 'lucide-react';
import { AntibioticItem, CalculatedRenalMetrics, PatientState } from '../types';

interface DrugDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  drug: AntibioticItem;
  renal: CalculatedRenalMetrics;
  patient: PatientState;
  children: React.ReactNode;
}

export const DrugDetailModal: React.FC<DrugDetailModalProps> = ({
  isOpen,
  onClose,
  drug,
  renal,
  patient,
  children
}) => {
  // ESC key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 sm:py-6 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-slate-50 rounded-3xl max-w-5xl w-full border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Modal Sticky Header */}
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white p-3.5 sm:p-4.5 shrink-0 flex items-center justify-between gap-3 border-b border-teal-700/50 shadow-xs">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Pill className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider bg-teal-400/20 text-teal-200 px-2.5 py-0.5 rounded-full border border-teal-400/30">
                  Bảng Thông Tin Chi Tiết Kháng Sinh
                </span>
                <h3 className="text-base sm:text-lg font-black text-white truncate">
                  {drug.name} <span className="text-teal-200 text-xs sm:text-sm font-normal">({drug.group})</span>
                </h3>
              </div>
              <div className="text-xs text-teal-100/90 mt-0.5 flex items-center gap-2 flex-wrap">
                <span>CrCl: <strong className="text-white font-bold">{renal.crcl} mL/phút</strong> ({renal.categoryLabelVi})</span>
                <span>•</span>
                <span>Lọc máu: <strong className="text-white font-bold">{patient.dialysis === 'none' ? 'Không' : patient.dialysis.toUpperCase()}</strong></span>
                <span>•</span>
                <span>Cân nặng tính liều: <strong className="text-white font-bold">{renal.usedWeight} kg</strong> ({renal.usedWeightType.toUpperCase()})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Đóng bảng thông tin (Esc)"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4">
          {children}
        </div>

        {/* Modal Footer */}
        <div className="bg-white border-t border-slate-200 px-4 py-2.5 sm:px-5 sm:py-3 shrink-0 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 hidden sm:block">
            Dược lực học &amp; Dược động học chuẩn BVBND 2026 • Stanford Guide • Cockcroft-Gault
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer ml-auto flex items-center gap-1.5"
          >
            <span>Đóng cửa sổ</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] bg-white border border-slate-300 rounded text-slate-500 font-mono">
              Esc
            </kbd>
          </button>
        </div>

      </div>
    </div>
  );
};
