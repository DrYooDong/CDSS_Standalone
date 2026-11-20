export type SpectrumLevel = '+++' | '++' | '+' | '+/-' | '0';

export interface SpectrumCell {
  level: SpectrumLevel;
  note?: string;
  /** Highlight critical clinical gap (e.g. bold **0** in source) */
  emphasis?: boolean;
}

export interface SpectrumColumn {
  id: string;
  label: string;
  subLabel?: string;
  group?: 'gram_pos' | 'gram_neg' | 'anaerobe' | 'atypical';
}

export interface SpectrumRow {
  id: string;
  name: string;
  representatives?: string;
  cells: Record<string, SpectrumCell>;
  clinicalNote?: string;
  /** Matching drug IDs from src/data/antibiotics.ts for 1-click dosing lookup */
  linkedDrugIds?: string[];
}

export interface SpectrumTableDef {
  id: 'beta_lactam' | 'gram_pos' | 'gram_neg' | 'anaerobe_atypical';
  tabLabelVi: string;
  tabLabelEn: string;
  titleVi: string;
  titleEn: string;
  subtitleVi: string;
  subtitleEn: string;
  hasClinicalNoteCol?: boolean;
  columns: SpectrumColumn[];
  rows: SpectrumRow[];
}

export interface SpectrumGapRule {
  id: number;
  titleVi: string;
  titleEn: string;
  tag: string;
  accent: 'rose' | 'amber' | 'sky' | 'purple' | 'teal';
  summaryVi: string;
  highlights: string[];
}

export const SPECTRUM_LEGEND: {
  level: SpectrumLevel;
  labelVi: string;
  labelEn: string;
  descVi: string;
}[] = [
  {
    level: '+++',
    labelVi: 'Rất nhạy / Ưu tiên hàng đầu',
    labelEn: 'First-line / Strong activity',
    descVi: 'First-line / Hoạt tính mạnh và ổn định.'
  },
  {
    level: '++',
    labelVi: 'Nhạy cảm tốt / Thay thế tin cậy',
    labelEn: 'Good activity / Reliable alternative',
    descVi: 'Hoạt tính tốt / Lựa chọn thay thế phù hợp.'
  },
  {
    level: '+',
    labelVi: 'Hoạt tính trung bình / Tùy chủng',
    labelEn: 'Moderate / Strain-dependent',
    descVi: 'Phụ thuộc phân lập hoặc chỉ có tác dụng trên một số chủng nhất định.'
  },
  {
    level: '+/-',
    labelVi: 'Đề kháng cao / Cần phối hợp',
    labelEn: 'High resistance / Variable',
    descVi: 'Tỷ lệ đề kháng cao hoặc chỉ nhạy khi chưa có cơ chế kháng đặc hiệu.'
  },
  {
    level: '0',
    labelVi: 'Không có hoạt tính / Kháng tự nhiên',
    labelEn: 'No activity / Intrinsic resistance',
    descVi: 'Không có hoạt tính tự nhiên hoặc đề kháng nội tại (Intrinsic resistance).'
  }
];

export const SPECTRUM_QUADRILATERAL = [
  {
    id: 'gram_pos',
    titleVi: 'Gram dương hiếu khí',
    titleEn: 'Aerobic Gram-Positive',
    examples: 'MSSA, MRSA, S. pneumoniae, Enterococcus, Listeria',
    colorClass: 'bg-indigo-50 border-indigo-200 text-indigo-800'
  },
  {
    id: 'gram_neg',
    titleVi: 'Gram âm hiếu khí',
    titleEn: 'Aerobic Gram-Negative',
    examples: 'Enterobacterales, ESBL, AmpC, CRE, P. aeruginosa, A. baumannii',
    colorClass: 'bg-rose-50 border-rose-200 text-rose-800'
  },
  {
    id: 'anaerobe',
    titleVi: 'Vi khuẩn kỵ khí (Anaerobes)',
    titleEn: 'Anaerobes',
    examples: 'B. fragilis, Prevotella, Fusobacterium, Peptostreptococcus, C. difficile',
    colorClass: 'bg-amber-50 border-amber-200 text-amber-800'
  },
  {
    id: 'atypical',
    titleVi: 'Vi khuẩn không điển hình (Atypicals)',
    titleEn: 'Atypicals',
    examples: 'Mycoplasma, Chlamydia, Legionella',
    colorClass: 'bg-teal-50 border-teal-200 text-teal-800'
  }
];

const c = (level: SpectrumLevel, note?: string, emphasis?: boolean): SpectrumCell => ({
  level,
  ...(note ? { note } : {}),
  ...(emphasis ? { emphasis } : {})
});

export const SPECTRUM_TABLES: SpectrumTableDef[] = [
  {
    id: 'beta_lactam',
    tabLabelVi: 'Ma trận β-Lactam',
    tabLabelEn: 'β-Lactam Matrix',
    titleVi: 'Bảng Ma Trận Tổng Hợp: Nhóm β-Lactam (Penicillins, Cephalosporins, Carbapenems, Monobactams)',
    titleEn: 'Comprehensive β-Lactam Activity Matrix',
    subtitleVi: 'Đối chiếu đầy đủ 18 phân nhóm β-Lactam trên 13 nhóm tác nhân thuộc Tứ giác phổ kháng khuẩn.',
    subtitleEn: 'Complete 18 β-Lactam subclasses across 13 clinically relevant pathogen groups.',
    columns: [
      { id: 'mssa', label: 'MSSA', group: 'gram_pos' },
      { id: 'mrsa', label: 'MRSA', group: 'gram_pos' },
      { id: 'strep', label: 'Streptococci', subLabel: 'S. pneumoniae', group: 'gram_pos' },
      { id: 'efaecalis', label: 'E. faecalis', group: 'gram_pos' },
      { id: 'efaecium', label: 'E. faecium', subLabel: '/ VRE', group: 'gram_pos' },
      { id: 'entero', label: 'Enterobacterales', subLabel: '(Nhạy)', group: 'gram_neg' },
      { id: 'esbl_ampc', label: 'ESBL / AmpC', group: 'gram_neg' },
      { id: 'cre', label: 'CRE', subLabel: 'KPC, OXA-48, MBL', group: 'gram_neg' },
      { id: 'pa', label: 'P. aeruginosa', group: 'gram_neg' },
      { id: 'ab', label: 'A. baumannii', group: 'gram_neg' },
      { id: 'anaerobe_gut', label: 'Kỵ khí ruột', subLabel: 'B. fragilis', group: 'anaerobe' },
      { id: 'anaerobe_oral', label: 'Kỵ khí miệng', subLabel: '/ Gram (+)', group: 'anaerobe' },
      { id: 'atypical', label: 'VK không điển hình', group: 'atypical' }
    ],
    rows: [
      {
        id: 'bl-pen-nat',
        name: 'Penicillin tự nhiên',
        representatives: 'Penicillin G/V',
        cells: {
          mssa: c('0'), mrsa: c('0'), strep: c('+++'), efaecalis: c('+'), efaecium: c('0'),
          entero: c('0'), esbl_ampc: c('0'), cre: c('0'), pa: c('0'), ab: c('0'),
          anaerobe_gut: c('0'), anaerobe_oral: c('++'), atypical: c('0')
        }
      },
      {
        id: 'bl-antistaph',
        name: 'Antistaphylococcal Penicillins',
        representatives: 'Oxacillin, Nafcillin',
        cells: {
          mssa: c('+++'), mrsa: c('0'), strep: c('++'), efaecalis: c('0'), efaecium: c('0'),
          entero: c('0'), esbl_ampc: c('0'), cre: c('0'), pa: c('0'), ab: c('0'),
          anaerobe_gut: c('0'), anaerobe_oral: c('+'), atypical: c('0')
        }
      },
      {
        id: 'bl-aminopen',
        name: 'Aminopenicillins',
        representatives: 'Ampicillin, Amoxicillin',
        cells: {
          mssa: c('0'), mrsa: c('0'), strep: c('+++'), efaecalis: c('+++'), efaecium: c('0'),
          entero: c('+'), esbl_ampc: c('0'), cre: c('0'), pa: c('0'), ab: c('0'),
          anaerobe_gut: c('0'), anaerobe_oral: c('++'), atypical: c('0')
        }
      },
      {
        id: 'bl-aminopen-bli',
        name: 'Aminopenicillin + BLI',
        representatives: 'Amox/Clav, Amp/Sulbactam',
        linkedDrugIds: ['amox_clav', 'ampicillin_sulbactam'],
        cells: {
          mssa: c('+++'), mrsa: c('0'), strep: c('+++'), efaecalis: c('+++'), efaecium: c('0'),
          entero: c('++'), esbl_ampc: c('+/-'), cre: c('0'), pa: c('0'), ab: c('+', 'Sulbactam'),
          anaerobe_gut: c('++'), anaerobe_oral: c('+++'), atypical: c('0')
        }
      },
      {
        id: 'bl-pip-tazo',
        name: 'Antipseudomonal Penicillin + BLI',
        representatives: 'Piperacillin/Tazobactam',
        linkedDrugIds: ['piperacillin_tazo'],
        cells: {
          mssa: c('+++'), mrsa: c('0'), strep: c('+++'), efaecalis: c('++'), efaecium: c('0'),
          entero: c('+++'), esbl_ampc: c('+/-'), cre: c('0'), pa: c('+++'), ab: c('+/-'),
          anaerobe_gut: c('+++'), anaerobe_oral: c('+++'), atypical: c('0')
        }
      },
      {
        id: 'bl-ceph1',
        name: 'Cephalosporin TH1',
        representatives: 'Cefazolin, Cephalexin',
        linkedDrugIds: ['cefazolin'],
        cells: {
          mssa: c('+++'), mrsa: c('0'), strep: c('++'), efaecalis: c('0'), efaecium: c('0'),
          entero: c('+'), esbl_ampc: c('0'), cre: c('0'), pa: c('0'), ab: c('0'),
          anaerobe_gut: c('0'), anaerobe_oral: c('+'), atypical: c('0')
        }
      },
      {
        id: 'bl-ceph2',
        name: 'Cephalosporin TH2',
        representatives: 'Cefuroxime',
        linkedDrugIds: ['cefuroxim'],
        cells: {
          mssa: c('++'), mrsa: c('0'), strep: c('++'), efaecalis: c('0'), efaecium: c('0'),
          entero: c('++'), esbl_ampc: c('0'), cre: c('0'), pa: c('0'), ab: c('0'),
          anaerobe_gut: c('0'), anaerobe_oral: c('+'), atypical: c('0')
        }
      },
      {
        id: 'bl-cephamycin',
        name: 'Cephamycins (TH2)',
        representatives: 'Cefoxitin, Cefotetan',
        linkedDrugIds: ['cefoxitin'],
        cells: {
          mssa: c('+'), mrsa: c('0'), strep: c('+'), efaecalis: c('0'), efaecium: c('0'),
          entero: c('++'), esbl_ampc: c('+', 'Bền AmpC'), cre: c('0'), pa: c('0'), ab: c('0'),
          anaerobe_gut: c('++'), anaerobe_oral: c('++'), atypical: c('0')
        }
      },
      {
        id: 'bl-ceph3-nonpa',
        name: 'Cephalosporin TH3 không diệt mủ xanh',
        representatives: 'Ceftriaxone, Cefotaxime',
        linkedDrugIds: ['ceftriaxon', 'cefotaxim'],
        cells: {
          mssa: c('++'), mrsa: c('0'), strep: c('+++'), efaecalis: c('0'), efaecium: c('0'),
          entero: c('+++'), esbl_ampc: c('0'), cre: c('0'), pa: c('0'), ab: c('0'),
          anaerobe_gut: c('0'), anaerobe_oral: c('+'), atypical: c('0')
        }
      },
      {
        id: 'bl-ceph3-pa',
        name: 'Cephalosporin TH3 diệt mủ xanh',
        representatives: 'Ceftazidime',
        linkedDrugIds: ['ceftazidim'],
        cells: {
          mssa: c('+'), mrsa: c('0'), strep: c('+'), efaecalis: c('0'), efaecium: c('0'),
          entero: c('+++'), esbl_ampc: c('0'), cre: c('0'), pa: c('+++'), ab: c('0'),
          anaerobe_gut: c('0'), anaerobe_oral: c('0'), atypical: c('0')
        }
      },
      {
        id: 'bl-ceph4',
        name: 'Cephalosporin TH4',
        representatives: 'Cefepime',
        linkedDrugIds: ['cefepim'],
        cells: {
          mssa: c('++'), mrsa: c('0'), strep: c('+++'), efaecalis: c('0'), efaecium: c('0'),
          entero: c('+++'), esbl_ampc: c('++', 'Bền AmpC'), cre: c('0'), pa: c('+++'), ab: c('0'),
          anaerobe_gut: c('0'), anaerobe_oral: c('+'), atypical: c('0')
        }
      },
      {
        id: 'bl-ceph5',
        name: 'Cephalosporin TH5',
        representatives: 'Ceftaroline',
        cells: {
          mssa: c('+++'), mrsa: c('+++'), strep: c('+++'), efaecalis: c('+'), efaecium: c('0'),
          entero: c('++'), esbl_ampc: c('0'), cre: c('0'), pa: c('0'), ab: c('0'),
          anaerobe_gut: c('0'), anaerobe_oral: c('+'), atypical: c('0')
        }
      },
      {
        id: 'bl-ceftolozane',
        name: 'Cephalosporin + BLI mới',
        representatives: 'Ceftolozane/Tazobactam',
        linkedDrugIds: ['ceftolozan_tazo'],
        cells: {
          mssa: c('++'), mrsa: c('0'), strep: c('++'), efaecalis: c('0'), efaecium: c('0'),
          entero: c('+++'), esbl_ampc: c('+++'), cre: c('0'), pa: c('+++', 'DTR-PA'), ab: c('0'),
          anaerobe_gut: c('+'), anaerobe_oral: c('+'), atypical: c('0')
        }
      },
      {
        id: 'bl-caz-avi',
        name: 'Cephalosporin + BLI mới',
        representatives: 'Ceftazidime/Avibactam',
        linkedDrugIds: ['ceftazidim_avibactam'],
        cells: {
          mssa: c('+'), mrsa: c('0'), strep: c('+'), efaecalis: c('0'), efaecium: c('0'),
          entero: c('+++'), esbl_ampc: c('+++'), cre: c('+++', 'KPC, OXA-48'), pa: c('+++', 'DTR-PA'), ab: c('0'),
          anaerobe_gut: c('0'), anaerobe_oral: c('0'), atypical: c('0')
        }
      },
      {
        id: 'bl-erta',
        name: 'Carbapenem (nhóm 1)',
        representatives: 'Ertapenem',
        linkedDrugIds: ['ertapenem'],
        cells: {
          mssa: c('++'), mrsa: c('0'), strep: c('++'), efaecalis: c('0'), efaecium: c('0'),
          entero: c('+++'), esbl_ampc: c('+++'), cre: c('0'), pa: c('0', undefined, true), ab: c('0', undefined, true),
          anaerobe_gut: c('+++'), anaerobe_oral: c('+++'), atypical: c('0')
        }
      },
      {
        id: 'bl-mero-imi',
        name: 'Carbapenem (nhóm 2)',
        representatives: 'Meropenem, Imipenem',
        linkedDrugIds: ['meropenem', 'imipenem'],
        cells: {
          mssa: c('+++'), mrsa: c('0'), strep: c('+++'), efaecalis: c('++', 'E. faecalis'), efaecium: c('0'),
          entero: c('+++'), esbl_ampc: c('+++'), cre: c('0'), pa: c('+++'), ab: c('++'),
          anaerobe_gut: c('+++'), anaerobe_oral: c('+++'), atypical: c('0')
        }
      },
      {
        id: 'bl-carba-bli',
        name: 'Carbapenem + BLI mới',
        representatives: 'Mero/Vaborbactam, Imi/Relebactam',
        cells: {
          mssa: c('+++'), mrsa: c('0'), strep: c('+++'), efaecalis: c('++'), efaecium: c('0'),
          entero: c('+++'), esbl_ampc: c('+++'), cre: c('+++', 'KPC'), pa: c('++', 'Imi-Rel'), ab: c('0'),
          anaerobe_gut: c('+++'), anaerobe_oral: c('+++'), atypical: c('0')
        }
      },
      {
        id: 'bl-aztreonam',
        name: 'Monobactam',
        representatives: 'Aztreonam',
        linkedDrugIds: ['aztreonam'],
        cells: {
          mssa: c('0'), mrsa: c('0'), strep: c('0'), efaecalis: c('0'), efaecium: c('0'),
          entero: c('+++'), esbl_ampc: c('0'), cre: c('0', 'Bền MBL/NDM'), pa: c('+++'), ab: c('0'),
          anaerobe_gut: c('0'), anaerobe_oral: c('0'), atypical: c('0')
        }
      }
    ]
  },
  {
    id: 'gram_pos',
    tabLabelVi: 'Bảng 1: Gram Dương',
    tabLabelEn: 'Table 1: Gram-Positive',
    titleVi: 'Bảng 1: Phổ Tác Dụng Trên Vi Khuẩn Gram Dương',
    titleEn: 'Table 1: Gram-Positive Coverage Spectrum',
    subtitleVi: 'MSSA, MRSA, Liên cầu/Phế cầu, Enterococcus faecalis, E. faecium/VRE, Listeria monocytogenes cùng ghi chú lâm sàng.',
    subtitleEn: 'Coverage across MSSA, MRSA, Streptococci, Enterococci (VRE), and Listeria with key clinical pearls.',
    hasClinicalNoteCol: true,
    columns: [
      { id: 'mssa', label: 'MSSA', subLabel: 'Tụ cầu nhạy methicillin', group: 'gram_pos' },
      { id: 'mrsa', label: 'MRSA', subLabel: 'Tụ cầu kháng methicillin', group: 'gram_pos' },
      { id: 'strep', label: 'Liên cầu / Phế cầu', subLabel: 'S. pneumoniae', group: 'gram_pos' },
      { id: 'efaecalis', label: 'E. faecalis', group: 'gram_pos' },
      { id: 'efaecium', label: 'E. faecium / VRE', group: 'gram_pos' },
      { id: 'listeria', label: 'Listeria monocytogenes', group: 'gram_pos' }
    ],
    rows: [
      {
        id: 'gp-pen',
        name: 'Penicillin G / V',
        cells: { mssa: c('0'), mrsa: c('0'), strep: c('+++'), efaecalis: c('++'), efaecium: c('0'), listeria: c('++') },
        clinicalNote: 'Hầu hết tụ cầu hiện nay đã tiết penicillinase kháng penicillin tự nhiên.'
      },
      {
        id: 'gp-oxa',
        name: 'Oxacillin / Nafcillin',
        cells: { mssa: c('+++'), mrsa: c('0'), strep: c('++'), efaecalis: c('0'), efaecium: c('0'), listeria: c('0') },
        clinicalNote: 'Kháng sinh chuẩn đầu tay điều trị nhiễm trùng MSSA nặng.'
      },
      {
        id: 'gp-amp',
        name: 'Ampicillin / Amoxicillin',
        cells: { mssa: c('0'), mrsa: c('0'), strep: c('+++'), efaecalis: c('+++'), efaecium: c('0'), listeria: c('+++') },
        clinicalNote: 'Ampicillin là thuốc ưu tiên hàng đầu cho E. faecalis và Listeria.'
      },
      {
        id: 'gp-amox-clav',
        name: 'Amox/Clav, Amp/Sulbactam',
        linkedDrugIds: ['amox_clav', 'ampicillin_sulbactam'],
        cells: { mssa: c('+++'), mrsa: c('0'), strep: c('+++'), efaecalis: c('+++'), efaecium: c('0'), listeria: c('+++') },
        clinicalNote: 'Phối hợp chất ức chế β-lactamase giúp khôi phục hoạt tính trên MSSA.'
      },
      {
        id: 'gp-pip-tazo',
        name: 'Piperacillin / Tazobactam',
        linkedDrugIds: ['piperacillin_tazo'],
        cells: { mssa: c('+++'), mrsa: c('0'), strep: c('+++'), efaecalis: c('++'), efaecium: c('0'), listeria: c('++') },
        clinicalNote: 'Có tác dụng tốt trên MSSA và E. faecalis nhạy ampicillin.'
      },
      {
        id: 'gp-cefazolin',
        name: 'Cefazolin (Cepha TH1)',
        linkedDrugIds: ['cefazolin'],
        cells: { mssa: c('+++'), mrsa: c('0'), strep: c('++'), efaecalis: c('0'), efaecium: c('0'), listeria: c('0') },
        clinicalNote: 'Lựa chọn hàng đầu cho MSSA (ngoại khoa, viêm nội tâm mạc, mô mềm).'
      },
      {
        id: 'gp-ceftriaxone',
        name: 'Ceftriaxone (Cepha TH3)',
        linkedDrugIds: ['ceftriaxon'],
        cells: { mssa: c('++'), mrsa: c('0'), strep: c('+++'), efaecalis: c('0'), efaecium: c('0'), listeria: c('0') },
        clinicalNote: 'Tác dụng rất mạnh trên phế cầu; hoàn toàn vô hiệu trên Enterococcus.'
      },
      {
        id: 'gp-cefepime',
        name: 'Cefepime (Cepha TH4)',
        linkedDrugIds: ['cefepim'],
        cells: { mssa: c('++'), mrsa: c('0'), strep: c('+++'), efaecalis: c('0'), efaecium: c('0'), listeria: c('0') },
        clinicalNote: 'Giữ hoạt tính tốt trên MSSA và phế cầu; không tác dụng trên Enterococcus.'
      },
      {
        id: 'gp-ceftaroline',
        name: 'Ceftaroline (Cepha TH5)',
        cells: { mssa: c('+++'), mrsa: c('+++'), strep: c('+++'), efaecalis: c('+'), efaecium: c('0'), listeria: c('+') },
        clinicalNote: 'Cephalosporin duy nhất gắn ái lực cao với PBP2a để diệt MRSA.'
      },
      {
        id: 'gp-carba',
        name: 'Carbapenem (Meropenem, Imipenem)',
        linkedDrugIds: ['meropenem', 'imipenem'],
        cells: { mssa: c('+++'), mrsa: c('0'), strep: c('+++'), efaecalis: c('++', 'faecalis'), efaecium: c('0'), listeria: c('++') },
        clinicalNote: 'E. faecalis nhạy penicillin thì nhạy imipenem/meropenem; E. faecium kháng tự nhiên.'
      },
      {
        id: 'gp-erta',
        name: 'Ertapenem',
        linkedDrugIds: ['ertapenem'],
        cells: { mssa: c('++'), mrsa: c('0'), strep: c('++'), efaecalis: c('0'), efaecium: c('0'), listeria: c('0') },
        clinicalNote: 'Ertapenem không có hoạt tính tin cậy trên Enterococcus.'
      },
      {
        id: 'gp-aztreonam',
        name: 'Aztreonam',
        linkedDrugIds: ['aztreonam'],
        cells: { mssa: c('0'), mrsa: c('0'), strep: c('0'), efaecalis: c('0'), efaecium: c('0'), listeria: c('0') },
        clinicalNote: 'Hoàn toàn không có tác dụng trên vi khuẩn Gram dương.'
      },
      {
        id: 'gp-vanco',
        name: 'Vancomycin / Teicoplanin',
        linkedDrugIds: ['vancomycin', 'teicoplanin'],
        cells: { mssa: c('+++'), mrsa: c('+++'), strep: c('+++'), efaecalis: c('+++'), efaecium: c('0', 'nếu VRE'), listeria: c('+++') },
        clinicalNote: 'Glycopeptide là nền tảng điều trị MRSA xâm lấn; không tác dụng trên chủng VRE.'
      },
      {
        id: 'gp-dapto',
        name: 'Daptomycin',
        linkedDrugIds: ['daptomycin'],
        cells: { mssa: c('+++'), mrsa: c('+++'), strep: c('+++'), efaecalis: c('+++'), efaecium: c('+++', 'kể cả VRE'), listeria: c('++') },
        clinicalNote: 'Bị bất hoạt bởi surfactant phế nang, không dùng cho viêm phổi.'
      },
      {
        id: 'gp-linezolid',
        name: 'Linezolid',
        linkedDrugIds: ['linezolid'],
        cells: { mssa: c('+++'), mrsa: c('+++'), strep: c('+++'), efaecalis: c('+++'), efaecium: c('+++', 'kể cả VRE'), listeria: c('+++') },
        clinicalNote: 'Oxazolidinone kìm khuẩn; lựa chọn thay thế hàng đầu khi MRSA có MIC vancomycin cao.'
      },
      {
        id: 'gp-tmpsmx',
        name: 'TMP-SMX (Co-trimoxazole)',
        linkedDrugIds: ['tmp_smx'],
        cells: { mssa: c('++'), mrsa: c('++'), strep: c('+'), efaecalis: c('0'), efaecium: c('0'), listeria: c('+++') },
        clinicalNote: 'Lựa chọn đường uống tốt cho MRSA cộng đồng và điều trị Listeria.'
      }
    ]
  },
  {
    id: 'gram_neg',
    tabLabelVi: 'Bảng 2: Gram Âm & MDR',
    tabLabelEn: 'Table 2: Gram-Negative & MDR',
    titleVi: 'Bảng 2: Phổ Tác Dụng Trên Trực Khuẩn Gram Âm & Vi Khuẩn Không Lên Men',
    titleEn: 'Table 2: Gram-Negative Bacilli & Non-Fermenters',
    subtitleVi: 'Enterobacterales, ESBL, AmpC cảm ứng, CRE (KPC/OXA-48/MBL), P. aeruginosa, A. baumannii, Stenotrophomonas maltophilia.',
    subtitleEn: 'Activity against Enterobacterales, ESBL, inducible AmpC, CRE, Pseudomonas, Acinetobacter, and Stenotrophomonas.',
    columns: [
      { id: 'entero', label: 'Enterobacterales', subLabel: 'E. coli, Klebsiella, Proteus', group: 'gram_neg' },
      { id: 'esbl', label: 'Chủng sinh ESBL', group: 'gram_neg' },
      { id: 'ampc', label: 'AmpC cảm ứng', subLabel: 'Enterobacter, Citrobacter', group: 'gram_neg' },
      { id: 'cre', label: 'CRE', subLabel: 'KPC / OXA-48 / MBL', group: 'gram_neg' },
      { id: 'pa', label: 'P. aeruginosa', group: 'gram_neg' },
      { id: 'ab', label: 'A. baumannii', group: 'gram_neg' },
      { id: 'steno', label: 'S. maltophilia', group: 'gram_neg' }
    ],
    rows: [
      {
        id: 'gn-cro',
        name: 'Ceftriaxone / Cefotaxime',
        linkedDrugIds: ['ceftriaxon', 'cefotaxim'],
        cells: {
          entero: c('+++'), esbl: c('0'), ampc: c('0', 'nguy cơ bộc phát đề kháng'),
          cre: c('0'), pa: c('0'), ab: c('0'), steno: c('0')
        }
      },
      {
        id: 'gn-caz',
        name: 'Ceftazidime',
        linkedDrugIds: ['ceftazidim'],
        cells: {
          entero: c('+++'), esbl: c('0'), ampc: c('0'),
          cre: c('0'), pa: c('+++'), ab: c('0'), steno: c('0')
        }
      },
      {
        id: 'gn-fep',
        name: 'Cefepime',
        linkedDrugIds: ['cefepim'],
        cells: {
          entero: c('+++'), esbl: c('0'), ampc: c('++', 'Bền vững với enzyme AmpC'),
          cre: c('0'), pa: c('+++'), ab: c('0'), steno: c('0')
        }
      },
      {
        id: 'gn-tzp',
        name: 'Piperacillin / Tazobactam',
        linkedDrugIds: ['piperacillin_tazo'],
        cells: {
          entero: c('+++'), esbl: c('+/-', 'Tránh dùng nhiễm trùng nặng'), ampc: c('+/-'),
          cre: c('0'), pa: c('+++'), ab: c('+/-'), steno: c('0')
        }
      },
      {
        id: 'gn-erta',
        name: 'Ertapenem',
        linkedDrugIds: ['ertapenem'],
        cells: {
          entero: c('+++'), esbl: c('+++'), ampc: c('+++'),
          cre: c('0'), pa: c('0', undefined, true), ab: c('0', undefined, true), steno: c('0', undefined, true)
        }
      },
      {
        id: 'gn-mero',
        name: 'Meropenem / Imipenem',
        linkedDrugIds: ['meropenem', 'imipenem'],
        cells: {
          entero: c('+++'), esbl: c('+++'), ampc: c('+++'),
          cre: c('0'), pa: c('+++'), ab: c('++', 'nếu chưa kháng'), steno: c('0')
        }
      },
      {
        id: 'gn-ctol',
        name: 'Ceftolozane / Tazobactam',
        linkedDrugIds: ['ceftolozan_tazo'],
        cells: {
          entero: c('+++'), esbl: c('+++'), ampc: c('+++'),
          cre: c('0'), pa: c('+++', 'Ưu tiên DTR-PA'), ab: c('0'), steno: c('0')
        }
      },
      {
        id: 'gn-cazavi',
        name: 'Ceftazidime / Avibactam',
        linkedDrugIds: ['ceftazidim_avibactam'],
        cells: {
          entero: c('+++'), esbl: c('+++'), ampc: c('+++'),
          cre: c('+++', 'Nhạy KPC, OXA-48; vô hiệu MBL'), pa: c('+++', 'Ưu tiên DTR-PA'), ab: c('0'), steno: c('0')
        }
      },
      {
        id: 'gn-mvb',
        name: 'Meropenem / Vaborbactam',
        cells: {
          entero: c('+++'), esbl: c('+++'), ampc: c('+++'),
          cre: c('+++', 'Đặc hiệu ức chế men KPC'), pa: c('+', 'Không thêm lợi ích so meropenem'), ab: c('0'), steno: c('0')
        }
      },
      {
        id: 'gn-atm',
        name: 'Aztreonam',
        linkedDrugIds: ['aztreonam'],
        cells: {
          entero: c('+++'), esbl: c('0'), ampc: c('0'),
          cre: c('0', 'Bền men MBL, phối hợp CAZ-AVI'), pa: c('+++'), ab: c('0'), steno: c('0')
        }
      },
      {
        id: 'gn-fq',
        name: 'Ciprofloxacin / Levofloxacin',
        linkedDrugIds: ['ciprofloxacin', 'levofloxacin'],
        cells: {
          entero: c('++'), esbl: c('+/-'), ampc: c('+/-'),
          cre: c('0'), pa: c('+++', 'Cipro > Levo'), ab: c('+'), steno: c('+', 'Levo')
        }
      },
      {
        id: 'gn-ag',
        name: 'Amikacin / Tobramycin',
        linkedDrugIds: ['amikacin', 'tobramycin'],
        cells: {
          entero: c('+++'), esbl: c('++'), ampc: c('++'),
          cre: c('+/-'), pa: c('+++', 'Tobra > Amikacin'), ab: c('++'), steno: c('0')
        }
      },
      {
        id: 'gn-plazo',
        name: 'Plazomicin',
        cells: {
          entero: c('+++'), esbl: c('+++'), ampc: c('+++'),
          cre: c('+++', 'Bền với men biến đổi AMEs'), pa: c('+'), ab: c('0'), steno: c('0')
        }
      },
      {
        id: 'gn-tige',
        name: 'Tigecycline / Eravacycline',
        linkedDrugIds: ['tigecyclin'],
        cells: {
          entero: c('+++'), esbl: c('+++'), ampc: c('+++'),
          cre: c('++', 'Không dùng nhiễm trùng máu'), pa: c('0', undefined, true), ab: c('+++'), steno: c('+++')
        }
      },
      {
        id: 'gn-colistin',
        name: 'Colistin / Polymyxin B',
        linkedDrugIds: ['colistin'],
        cells: {
          entero: c('+++'), esbl: c('+++'), ampc: c('+++'),
          cre: c('+++', 'Lựa chọn cứu cánh cuối cùng'), pa: c('+++'), ab: c('+++'), steno: c('0')
        }
      },
      {
        id: 'gn-tmpsmx',
        name: 'Co-trimoxazole (TMP-SMX)',
        linkedDrugIds: ['tmp_smx'],
        cells: {
          entero: c('++'), esbl: c('+/-'), ampc: c('+/-'),
          cre: c('0'), pa: c('0'), ab: c('+'), steno: c('+++', 'Lựa chọn đầu tay')
        }
      }
    ]
  },
  {
    id: 'anaerobe_atypical',
    tabLabelVi: 'Bảng 3: Kỵ Khí & Không Điển Hình',
    tabLabelEn: 'Table 3: Anaerobes & Atypicals',
    titleVi: 'Bảng 3: Phổ Tác Dụng Trên Vi Khuẩn Kỵ Khí & Không Điển Hình',
    titleEn: 'Table 3: Anaerobes & Atypical Pathogens',
    subtitleVi: 'Kỵ khí vùng bụng (B. fragilis), kỵ khí vùng miệng (Prevotella, Fusobacterium), Peptostreptococcus, C. difficile và nhóm Không điển hình.',
    subtitleEn: 'Intra-abdominal & oral anaerobes, C. difficile, and atypical pathogens (Mycoplasma, Chlamydia, Legionella).',
    columns: [
      { id: 'bfrag', label: 'Kỵ khí Gram (-) bụng', subLabel: 'Bacteroides fragilis', group: 'anaerobe' },
      { id: 'oral', label: 'Kỵ khí miệng / Hầu họng', subLabel: 'Prevotella, Fusobacterium', group: 'anaerobe' },
      { id: 'pepto', label: 'Cầu khuẩn kỵ khí Gram (+)', subLabel: 'Peptostreptococcus', group: 'anaerobe' },
      { id: 'cdiff', label: 'Clostridioides difficile', group: 'anaerobe' },
      { id: 'atypical', label: 'VK không điển hình', subLabel: 'Mycoplasma, Chlamydia, Legionella', group: 'atypical' }
    ],
    rows: [
      {
        id: 'aa-metro',
        name: 'Metronidazole',
        linkedDrugIds: ['metronidazol'],
        cells: {
          bfrag: c('+++'),
          oral: c('+++'),
          pepto: c('++'),
          cdiff: c('+', 'Đường uống nhẹ; hiện ưu tiên vanco'),
          atypical: c('0')
        }
      },
      {
        id: 'aa-bl-bli',
        name: 'β-lactam + BLI',
        representatives: 'Amox/Clav, Pip/Tazo',
        linkedDrugIds: ['amox_clav', 'piperacillin_tazo'],
        cells: {
          bfrag: c('+++'), oral: c('+++'), pepto: c('+++'), cdiff: c('0'), atypical: c('0')
        }
      },
      {
        id: 'aa-carba',
        name: 'Carbapenem',
        representatives: 'Meropenem, Ertapenem',
        linkedDrugIds: ['meropenem', 'ertapenem'],
        cells: {
          bfrag: c('+++'), oral: c('+++'), pepto: c('+++'), cdiff: c('0'), atypical: c('0')
        }
      },
      {
        id: 'aa-cephamycin',
        name: 'Cephamycins',
        representatives: 'Cefoxitin, Cefotetan',
        linkedDrugIds: ['cefoxitin'],
        cells: {
          bfrag: c('++', 'đang tăng đề kháng'), oral: c('++'), pepto: c('++'), cdiff: c('0'), atypical: c('0')
        }
      },
      {
        id: 'aa-clinda',
        name: 'Clindamycin',
        linkedDrugIds: ['clindamycin'],
        cells: {
          bfrag: c('+', 'Tỷ lệ kháng B. fragilis > 30-40%'),
          oral: c('+++'),
          pepto: c('+++'),
          cdiff: c('0', 'Nguy cơ gây viêm đại tràng giả mạc'),
          atypical: c('0')
        }
      },
      {
        id: 'aa-vanco-po',
        name: 'Vancomycin (đường uống)',
        linkedDrugIds: ['vancomycin'],
        cells: {
          bfrag: c('0'),
          oral: c('0'),
          pepto: c('0'),
          cdiff: c('+++', 'Thuốc đầu tay trị viêm đại tràng C. diff'),
          atypical: c('0')
        }
      },
      {
        id: 'aa-macrolide',
        name: 'Macrolides',
        representatives: 'Azithromycin, Clarithromycin',
        linkedDrugIds: ['azithromycin'],
        cells: {
          bfrag: c('0'), oral: c('+'), pepto: c('+'), cdiff: c('0'), atypical: c('+++')
        }
      },
      {
        id: 'aa-resp-fq',
        name: 'Quinolone hô hấp',
        representatives: 'Levofloxacin, Moxifloxacin',
        linkedDrugIds: ['levofloxacin', 'moxifloxacin'],
        cells: {
          bfrag: c('+', 'chỉ Moxifloxacin'),
          oral: c('++', 'chỉ Moxifloxacin'),
          pepto: c('++'),
          cdiff: c('0'),
          atypical: c('+++')
        }
      },
      {
        id: 'aa-tetra',
        name: 'Tetracyclines',
        representatives: 'Doxycycline, Minocycline',
        cells: {
          bfrag: c('+'), oral: c('++'), pepto: c('++'), cdiff: c('0'), atypical: c('+++')
        }
      }
    ]
  }
];

export const SPECTRUM_GAP_RULES: SpectrumGapRule[] = [
  {
    id: 1,
    titleVi: 'Khoảng trống của Cephalosporin (Ngoại trừ TH5 Ceftaroline)',
    titleEn: 'Cephalosporin Spectrum Gap (Except 5th-Gen Ceftaroline)',
    tag: 'LAME Rule',
    accent: 'rose',
    summaryVi:
      'Tất cả các Cephalosporin thế hệ 1 đến 4 hoàn toàn không có hoạt tính trên Enterococcus, Listeria monocytogenes và MRSA. Ceftaroline (TH5) là thuốc duy nhất gắn kết được với PBP2a của MRSA nhưng vẫn không diệt được Enterococcus faecium hay trực khuẩn không lên men.',
    highlights: [
      'Cepha TH1–TH4: 0 hoạt tính trên Listeria, MRSA, Enterococcus',
      'Ceftaroline (TH5): diệt MRSA nhờ ái lực cao với PBP2a',
      'Không có Cepha nào phủ được vi khuẩn không điển hình'
    ]
  },
  {
    id: 2,
    titleVi: 'Khoảng trống của Ertapenem so với Carbapenem nhóm 2',
    titleEn: 'Ertapenem Gap vs Group-2 Carbapenems',
    tag: 'Thiếu nhóm "PEA"',
    accent: 'amber',
    summaryVi:
      'Ertapenem bao phủ tốt kỵ khí và Enterobacterales (kể cả ESBL/AmpC), nhưng thiếu hoàn toàn hoạt tính trên nhóm "PEA": Pseudomonas aeruginosa, Enterococcus và Acinetobacter.',
    highlights: [
      'P — Pseudomonas aeruginosa: 0',
      'E — Enterococcus spp.: 0',
      'A — Acinetobacter baumannii: 0'
    ]
  },
  {
    id: 3,
    titleVi: 'Khoảng trống của Monobactam (Aztreonam)',
    titleEn: 'Monobactam (Aztreonam) Narrow Spectrum & MBL Pearl',
    tag: 'Chỉ Gram âm hiếu khí',
    accent: 'sky',
    summaryVi:
      'Aztreonam là kháng sinh chỉ có một tác dụng duy nhất: chỉ diệt trực khuẩn Gram âm hiếu khí. Thuốc không có hoạt tính trên vi khuẩn Gram dương hay vi khuẩn kỵ khí. Điểm đặc biệt: Aztreonam không bị thủy phân bởi metallo-β-lactamase (NDM), nên khi phối hợp với Ceftazidime-avibactam sẽ tạo thành phác đồ cứu cánh cho chủng vi khuẩn sinh MBL.',
    highlights: [
      'Gram dương: 0 | Kỵ khí: 0',
      'Bền vững trước men metallo-β-lactamase (NDM/VIM/IMP)',
      'Phối hợp Aztreonam + CAZ-AVI là phác đồ cứu cánh cho CRE sinh MBL'
    ]
  },
  {
    id: 4,
    titleVi: 'Quy luật về vi khuẩn kỵ khí và Aminoglycoside',
    titleEn: 'Anaerobes vs Aminoglycosides & Metronidazole Rule',
    tag: 'Cơ chế vận chuyển O₂',
    accent: 'purple',
    summaryVi:
      'Aminoglycoside (Gentamicin, Amikacin, Tobramycin) cần chuỗi vận chuyển electron phụ thuộc oxy để xâm nhập vào màng tế bào vi khuẩn; do đó, nhóm này kháng tự nhiên 100% với toàn bộ vi khuẩn kỵ khí. Ngược lại, Metronidazole cần môi trường khử của vi khuẩn kỵ khí để hoạt hóa gốc tự do, nên hoàn toàn không có tác dụng trên vi khuẩn hiếu khí.',
    highlights: [
      'Aminoglycoside: kháng tự nhiên 100% với kỵ khí',
      'Metronidazole: hoàn toàn không tác dụng trên vi khuẩn hiếu khí'
    ]
  },
  {
    id: 5,
    titleVi: 'Đặc điểm vi khuẩn không điển hình (Atypicals)',
    titleEn: 'Atypical Pathogens Cell-Wall Rule',
    tag: 'Không vách / Nội bào',
    accent: 'teal',
    summaryVi:
      'Mycoplasma pneumoniae không có vách tế bào peptidoglycan; Chlamydia và Legionella ký sinh nội bào. Do đó, tất cả kháng sinh ức chế tổng hợp thành tế bào (β-lactam, Vancomycin) đều hoàn toàn vô hiệu. Nhóm thuốc lựa chọn bắt buộc phải tác động vào ribosome hoặc DNA gyrase: Macrolide, Tetracycline hoặc Fluoroquinolone.',
    highlights: [
      'β-lactam & Vancomycin: 0 hoạt tính',
      'Bắt buộc dùng: Macrolide, Tetracycline hoặc Fluoroquinolone'
    ]
  }
];
