import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  User, 
  Activity, 
  Pill, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Layers,
  Clock,
  Calculator
} from 'lucide-react';
import { SelectionWizardState, RiskClassificationResult } from '../../selection/types';

interface DecisionSummaryCardProps {
  state: SelectionWizardState;
  riskResult: RiskClassificationResult;
  onNavigateStep: (step: 1 | 2 | 3) => void;
  onSwitchToDosing: (drugId?: string) => void;
  currentStage?: number;
}

export const DecisionSummaryCard: React.FC<DecisionSummaryCardProps> = ({
  state,
  riskResult,
  onNavigateStep,
  onSwitchToDosing,
  currentStage = 1
}) => {
  const isGroup2 = riskResult.group === 'group_2';

  const siteLabels: Record<string, string> = {
    respiratory: 'Hô hấp (Viêm phổi)',
    sepsis: 'Nhiễm khuẩn huyết',
    skin_soft_tissue: 'Da & Mô mềm',
    urinary: 'Tiết niệu (UTI)',
    peritoneal: 'Dịch báng (SBP)',
    gastrointestinal: 'Tiêu hóa',
    cns: 'Thần kinh trung ương'
  };

  const sepsisSourceLabels: Record<string, string> = {
    respiratory: 'Từ ổ Hô hấp',
    gastrointestinal: 'Từ ổ Tiêu hóa',
    skin_soft_tissue: 'Từ ổ Da mô mềm',
    peritoneal: 'Từ ổ Dịch báng',
    urinary: 'Từ ổ Tiết niệu'
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 lg:sticky lg:top-16 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
          <Activity className="w-3.5 h-3.5 text-teal-600" />
          <span>Tóm Tắt Quyết Định CDSS</span>
        </h3>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
          Giai đoạn {currentStage}/3
        </span>
      </div>

      {/* 1. Indication & Site Summary */}
      <div 
        onClick={() => onNavigateStep(1)}
        className="p-3 rounded-xl border border-slate-100 hover:border-teal-300 bg-slate-50/60 cursor-pointer transition-all hover:shadow-2xs"
      >
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <span>Chỉ Định & Ổ Nhiễm</span>
          <span className="text-teal-600 font-semibold">Chỉnh sửa</span>
        </div>
        
        <div className="flex items-center space-x-1.5 mt-1.5">
          {state.indicationConfirmed ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
          )}
          <span className="text-xs font-bold text-slate-800 break-words">
            {state.indicationConfirmed ? 'Có chỉ định cấp tính' : 'Cần theo dõi thêm'}
          </span>
        </div>

        <div className="flex items-center space-x-1.5 text-xs text-slate-600 mt-1 pl-5">
          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="break-words">{state.population === 'adult' ? 'Người lớn' : 'Trẻ em'} • {siteLabels[state.site] || state.site}</span>
        </div>

        {state.site === 'sepsis' && state.sepsisSource && (
          <div className="text-[11px] text-rose-600 font-medium pl-5 mt-0.5">
            {sepsisSourceLabels[state.sepsisSource] || state.sepsisSource}
          </div>
        )}
      </div>

      {/* 2. Risk Stratification Group */}
      <div 
        onClick={() => onNavigateStep(1)}
        className={`p-3 rounded-xl border cursor-pointer transition-all hover:shadow-2xs ${
          isGroup2 
            ? 'bg-rose-50/70 border-rose-200 text-rose-950' 
            : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
        }`}
      >
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider opacity-80">
          <span>Phân Tầng Nguy Cơ VKĐK</span>
          <span className="text-[10px] underline">Chi tiết</span>
        </div>

        <div className="flex items-center space-x-2 mt-1.5">
          {isGroup2 ? (
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          )}
          <div>
            <div className="text-xs font-black">
              {isGroup2 ? 'Nhóm 2: Nguy cơ cao VKĐK' : 'Nhóm 1: Ít nguy cơ VKĐK'}
            </div>
            <div className="text-[10px] opacity-80">
              {riskResult.generalRiskCount}/8 yếu tố chung • {riskResult.severityScoreType.toUpperCase()} = {riskResult.severityScoreValue}
            </div>
          </div>
        </div>

        {/* Specific pathogen tags & BVBND Note b badges if Group 2 */}
        {isGroup2 && (
          <div className="space-y-1.5 mt-2 pt-2 border-t border-rose-200/60">
            {state.checkedSpecificRisks.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {state.checkedSpecificRisks.map(r => (
                  <span key={r} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-200/80 text-rose-800">
                    {r === 'mrsa' ? 'MRSA' : r === 'esbl' ? 'ESBL' : r === 'pseudo_acineto' ? 'Pseudo/Acineto' : 'Enterococcus'}
                  </span>
                ))}
              </div>
            )}

            {riskResult.isGramPosGramNegCoRisk && (
              <div className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-800 border border-red-200 flex items-center space-x-1">
                <span>⚠️</span>
                <span>Phối hợp Gram(+) & Gram(-)</span>
              </div>
            )}

            {riskResult.isDualGramNegRisk && (
              <div className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200 flex items-center space-x-1">
                <span>⚡</span>
                <span>Diệt Pseudo / Acineto</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Stage 2 Bridge: Empiric Regimen */}
      <div 
        onClick={() => onNavigateStep(2)}
        className="p-3 rounded-xl border border-slate-100 hover:border-teal-300 bg-slate-50/60 cursor-pointer transition-all hover:shadow-2xs"
      >
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <span>Phác Đồ & Antibiogram</span>
          <span className="text-teal-600 font-semibold">Giai đoạn 2</span>
        </div>
        <div className="flex items-center space-x-2 mt-1.5">
          <Pill className="w-4 h-4 text-teal-600 shrink-0" />
          <span className="text-xs font-bold text-slate-800">
            BVBND 2026 &bull; WHO AWaRe ({isGroup2 ? 'Phổ rộng đa kháng' : 'Phác đồ chuẩn'})
          </span>
        </div>
      </div>

      {/* 4. Action: Switch to Dosing Module */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <button
          type="button"
          onClick={() => onSwitchToDosing(state.selectedDrugForDosing)}
          className="w-full py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Tính Liều &amp; CrCl</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <p className="text-[10px] text-slate-400 text-center">
          Tự động đồng bộ chẩn đoán & thông số bệnh nhân
        </p>
      </div>
    </div>
  );
};
