import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  X, 
  Search, 
  Pill, 
  Check, 
  ArrowRight, 
  Sparkles,
  Layers,
  Activity
} from 'lucide-react';
import { AntibioticItem, Language } from '../types';
import { ANTIBIOTICS } from '../data/antibiotics';

interface DrugSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDrugId: string;
  onSelectDrug: (drugId: string) => void;
  language: Language;
}

const FREQUENT_SUGGESTIONS = [
  'meropenem',
  'vancomycin',
  'piperacillin_tazobactam',
  'colistin',
  'ceftriaxone',
  'levofloxacin',
  'cefepime',
  'amikacin',
  'linezolid',
  'ampicillin_sulbactam'
];

export const DrugSearchModal: React.FC<DrugSearchModalProps> = ({
  isOpen,
  onClose,
  selectedDrugId,
  onSelectDrug,
  language
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const isEn = language === 'en';

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      setSearchTerm('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const matchingAntibiotics = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) {
      const frequent = ANTIBIOTICS.filter(a => FREQUENT_SUGGESTIONS.includes(a.id));
      const others = ANTIBIOTICS.filter(a => !FREQUENT_SUGGESTIONS.includes(a.id));
      return [...frequent, ...others];
    }

    return ANTIBIOTICS.filter((item) => {
      const matchesName = item.name.toLowerCase().includes(query);
      const matchesGroup = item.group.toLowerCase().includes(query) || (item.groupEn && item.groupEn.toLowerCase().includes(query));
      const matchesAliases = item.aliases.some(a => a.toLowerCase().includes(query));
      const matchesIndications = item.indications.some(ind => ind.toLowerCase().includes(query)) ||
        item.indicationsEn.some(ind => ind.toLowerCase().includes(query));

      return matchesName || matchesGroup || matchesAliases || matchesIndications;
    });
  }, [searchTerm]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, matchingAntibiotics.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + matchingAntibiotics.length) % Math.max(1, matchingAntibiotics.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (matchingAntibiotics.length > 0 && selectedIndex < matchingAntibiotics.length) {
        onSelectDrug(matchingAntibiotics[selectedIndex].id);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col z-10 animate-slideUp mt-8 sm:mt-0">
        
        {/* Search Input Box */}
        <div className="p-3.5 bg-white border-b border-slate-200 flex items-center gap-2">
          <Search className="w-5 h-5 text-teal-600 shrink-0 ml-1" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={isEn 
              ? 'Search 43 antibiotics (e.g. Meropenem, Vancomycin, Tazocin...)' 
              : 'Tra cứu 43 kháng sinh (vd: Meropenem, Vancomycin, Tazocin...)'}
            className="w-full text-sm font-bold text-slate-900 bg-transparent border-0 focus:outline-hidden focus:ring-0 placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer text-xs font-bold"
          >
            Esc
          </button>
        </div>

        {/* Header Label */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="font-bold flex items-center gap-1.5">
            {searchTerm ? (
              <>Tìm thấy <strong className="text-teal-700">{matchingAntibiotics.length}</strong> kháng sinh</>
            ) : (
              <><Sparkles className="w-3.5 h-3.5 text-amber-500" /> Kháng sinh thường dùng &amp; Danh bạ 43 thuốc:</>
            )}
          </span>
          <span className="text-[10px] text-slate-400 hidden sm:inline">
            Dùng phím ↑↓ và Enter để chọn
          </span>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto divide-y divide-slate-100 max-h-[60vh] p-1">
          {matchingAntibiotics.length > 0 ? (
            matchingAntibiotics.map((drug, idx) => {
              const isSelected = drug.id === selectedDrugId;
              const isHovered = idx === selectedIndex;

              return (
                <button
                  key={drug.id}
                  type="button"
                  onClick={() => {
                    onSelectDrug(drug.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50 text-teal-950 font-bold border border-teal-200'
                      : isHovered
                      ? 'bg-slate-100/90 text-slate-900'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isSelected
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {drug.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-black text-slate-900 truncate">
                          {drug.name}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded uppercase bg-slate-200 text-slate-700">
                          {drug.route}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        <span>{drug.group}</span>
                        {drug.aliases.length > 0 && (
                          <span className="text-slate-400 ml-1.5">
                            ({drug.aliases.slice(0, 2).join(', ')})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 ml-2">
                    {isSelected ? (
                      <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Đang chọn</span>
                      </span>
                    ) : (
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              <p className="font-bold text-slate-600 mb-1">Không tìm thấy kháng sinh phù hợp</p>
              <p>Hãy thử tìm theo tên hoạt chất (vd: Meropenem) hoặc biệt dược</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Tổng số: 43 Kháng sinh chuẩn hóa</span>
          <button
            type="button"
            onClick={onClose}
            className="font-bold text-teal-700 hover:underline cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
