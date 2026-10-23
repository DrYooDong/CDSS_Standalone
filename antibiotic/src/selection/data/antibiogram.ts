import { AntibiogramDataset } from '../types';

/**
 * Local Antibiogram Datasets from Hospital for Tropical Diseases (BV Bệnh Nhiệt Đới TP.HCM)
 * Period: 01/2024 - 12/2024
 * Source: File 3: Hướng dẫn sử dụng kháng sinh 2026, P.4-12
 */
export const BVBND_ANTIBIOGRAMS: AntibiogramDataset[] = [
  // 1. TIẾT NIỆU NGƯỜI LỚN (P.10-11)
  {
    site: 'urinary',
    population: 'adult',
    period: '01/2024 - 12/2024',
    sampleTotal: 355,
    organisms: [
      {
        organismName: 'Escherichia coli',
        sampleCount: 164,
        pctOfIsolates: 46.2,
        sensitivities: [
          { antibioticName: 'Meropenem', sensitivityPct: 98.9 },
          { antibioticName: 'Imipenem', sensitivityPct: 98.3 },
          { antibioticName: 'Ertapenem', sensitivityPct: 97.3 },
          { antibioticName: 'Amikacin', sensitivityPct: 95.1 },
          { antibioticName: 'Nitrofurantoin', sensitivityPct: 92.8 },
          { antibioticName: 'Fosfomycin', sensitivityPct: 91.7 },
          { antibioticName: 'Piperacillin/tazobactam', sensitivityPct: 87.5 },
          { antibioticName: 'Gentamicin', sensitivityPct: 65.8 },
          { antibioticName: 'Cefepime', sensitivityPct: 63.9 },
          { antibioticName: 'Amoxicillin/clavulanic acid', sensitivityPct: 46.6 },
          { antibioticName: 'Ceftriaxone', sensitivityPct: 35.8 },
          { antibioticName: 'TMP-SMX (Co-trimoxazole)', sensitivityPct: 35.4 },
          { antibioticName: 'Cefotaxime', sensitivityPct: 33.6 },
          { antibioticName: 'Levofloxacin', sensitivityPct: 23.1 }
        ],
        notableResistance: 'Tỷ lệ sinh ESBL cao (> 64%). Levofloxacin nhạy rất thấp (23.1%).'
      },
      {
        organismName: 'Klebsiella pneumoniae',
        sampleCount: 33,
        pctOfIsolates: 9.3,
        sensitivities: [
          { antibioticName: 'Fosfomycin', sensitivityPct: 100 },
          { antibioticName: 'Colistin', sensitivityPct: 92.0 },
          { antibioticName: 'Gentamicin', sensitivityPct: 69.2 },
          { antibioticName: 'Amikacin', sensitivityPct: 66.7 },
          { antibioticName: 'Ertapenem', sensitivityPct: 40.0 },
          { antibioticName: 'Meropenem', sensitivityPct: 38.5 },
          { antibioticName: 'Cefepime', sensitivityPct: 35.7 },
          { antibioticName: 'Imipenem', sensitivityPct: 33.3 },
          { antibioticName: 'Amoxicillin/clavulanic acid', sensitivityPct: 27.3 },
          { antibioticName: 'Ceftriaxone', sensitivityPct: 27.3 },
          { antibioticName: 'Piperacillin/tazobactam', sensitivityPct: 23.1 },
          { antibioticName: 'Levofloxacin', sensitivityPct: 16.7 }
        ],
        notableResistance: 'Tỷ lệ đề kháng Carbapenem rất cao (CRE > 60%). Cần cảnh giác kiểu gen KPC/NDM.'
      },
      {
        organismName: 'Enterococcus spp.',
        sampleCount: 43,
        pctOfIsolates: 12.1,
        sensitivities: [
          { antibioticName: 'Linezolid', sensitivityPct: 88.5 },
          { antibioticName: 'Vancomycin', sensitivityPct: 76.7 },
          { antibioticName: 'Teicoplanin', sensitivityPct: 67.9 },
          { antibioticName: 'Nitrofurantoin', sensitivityPct: 46.7 },
          { antibioticName: 'Ampicillin', sensitivityPct: 37.9 },
          { antibioticName: 'Ciprofloxacin', sensitivityPct: 30.0 }
        ],
        notableResistance: 'Tỷ lệ kháng Vancomycin (VRE) lên tới 23.3%. Linezolid là thuốc lựa chọn còn nhạy cao.'
      },
      {
        organismName: 'Candida spp.',
        sampleCount: 22,
        pctOfIsolates: 6.2,
        sensitivities: [
          { antibioticName: 'Echinocandins (Caspofungin/Micafungin)', sensitivityPct: 100 },
          { antibioticName: 'Voriconazole', sensitivityPct: 50.0 },
          { antibioticName: 'Fluconazole', sensitivityPct: 40.0 }
        ],
        notableResistance: 'Tỷ lệ kháng Fluconazole tới 60%. Ưu tiên Echinocandin nếu nhiễm nấm xâm lấn.'
      }
    ],
    source: { doc: 'BVBND_HDSDKS', page: 10 }
  },

  // 2. HÔ HẤP NGƯỜI LỚN (P.8-9)
  {
    site: 'respiratory',
    population: 'adult',
    period: '01/2024 - 12/2024',
    sampleTotal: 412,
    organisms: [
      {
        organismName: 'Acinetobacter baumannii',
        sampleCount: 145,
        pctOfIsolates: 35.2,
        sensitivities: [
          { antibioticName: 'Colistin', sensitivityPct: 89.5 },
          { antibioticName: 'Tigecycline', sensitivityPct: 62.0 },
          { antibioticName: 'Amikacin', sensitivityPct: 22.4 },
          { antibioticName: 'Meropenem', sensitivityPct: 11.2 },
          { antibioticName: 'Imipenem', sensitivityPct: 9.8 }
        ],
        notableResistance: 'CRAB chiếm đa số (> 88%). Đề kháng gần như hoàn toàn với Carbapenem kinh điển.'
      },
      {
        organismName: 'Pseudomonas aeruginosa',
        sampleCount: 98,
        pctOfIsolates: 23.8,
        sensitivities: [
          { antibioticName: 'Colistin', sensitivityPct: 94.0 },
          { antibioticName: 'Amikacin', sensitivityPct: 71.4 },
          { antibioticName: 'Ceftazidime', sensitivityPct: 52.3 },
          { antibioticName: 'Piperacillin/tazobactam', sensitivityPct: 48.7 },
          { antibioticName: 'Meropenem', sensitivityPct: 44.1 },
          { antibioticName: 'Ciprofloxacin', sensitivityPct: 38.6 }
        ],
        notableResistance: 'Nhiều chủng DTR (kháng thuốc khó trị). Cần xét nghiệm Ceftolozane-tazobactam.'
      },
      {
        organismName: 'Klebsiella pneumoniae',
        sampleCount: 86,
        pctOfIsolates: 20.9,
        sensitivities: [
          { antibioticName: 'Colistin', sensitivityPct: 91.0 },
          { antibioticName: 'Amikacin', sensitivityPct: 63.5 },
          { antibioticName: 'Meropenem', sensitivityPct: 41.2 },
          { antibioticName: 'Ceftazidime', sensitivityPct: 24.1 }
        ],
        notableResistance: 'Tỷ lệ CRE cao trên bệnh nhân viêm phổi bệnh viện và thở máy ICU.'
      },
      {
        organismName: 'Staphylococcus aureus',
        sampleCount: 42,
        pctOfIsolates: 10.2,
        sensitivities: [
          { antibioticName: 'Linezolid', sensitivityPct: 100 },
          { antibioticName: 'Vancomycin', sensitivityPct: 100 },
          { antibioticName: 'Teicoplanin', sensitivityPct: 95.2 },
          { antibioticName: 'Oxacillin', sensitivityPct: 21.4 }
        ],
        notableResistance: 'Tỷ lệ MRSA chiếm 78.6% các chủng S. aureus phân lập tại ICU.'
      }
    ],
    source: { doc: 'BVBND_HDSDKS', page: 8 }
  },

  // 3. NHIỄM KHUẨN HUYẾT NGƯỜI LỚN (P.12-13)
  {
    site: 'sepsis',
    population: 'adult',
    period: '01/2024 - 12/2024',
    sampleTotal: 520,
    organisms: [
      {
        organismName: 'Escherichia coli',
        sampleCount: 182,
        pctOfIsolates: 35.0,
        sensitivities: [
          { antibioticName: 'Meropenem', sensitivityPct: 97.8 },
          { antibioticName: 'Amikacin', sensitivityPct: 94.5 },
          { antibioticName: 'Ertapenem', sensitivityPct: 94.0 },
          { antibioticName: 'Piperacillin/tazobactam', sensitivityPct: 86.3 },
          { antibioticName: 'Ceftriaxone', sensitivityPct: 41.2 },
          { antibioticName: 'Levofloxacin', sensitivityPct: 28.6 }
        ],
        notableResistance: 'Tỷ lệ sinh ESBL ~ 58%. Carbapenem và Amikacin còn độ nhạy rất cao.'
      },
      {
        organismName: 'Klebsiella pneumoniae',
        sampleCount: 114,
        pctOfIsolates: 21.9,
        sensitivities: [
          { antibioticName: 'Colistin', sensitivityPct: 93.8 },
          { antibioticName: 'Amikacin', sensitivityPct: 68.4 },
          { antibioticName: 'Meropenem', sensitivityPct: 46.5 },
          { antibioticName: 'Piperacillin/tazobactam', sensitivityPct: 35.1 },
          { antibioticName: 'Ceftriaxone', sensitivityPct: 24.6 }
        ],
        notableResistance: 'CRE trong cấy máu chiếm > 50%. Cần phối hợp kháng sinh sớm.'
      },
      {
        organismName: 'Staphylococcus aureus',
        sampleCount: 88,
        pctOfIsolates: 16.9,
        sensitivities: [
          { antibioticName: 'Vancomycin', sensitivityPct: 100 },
          { antibioticName: 'Linezolid', sensitivityPct: 100 },
          { antibioticName: 'Daptomycin', sensitivityPct: 100 },
          { antibioticName: 'Teicoplanin', sensitivityPct: 97.7 },
          { antibioticName: 'Oxacillin', sensitivityPct: 23.9 }
        ],
        notableResistance: 'MRSA chiếm 76.1%. Khuyến cáo đo TDM Vancomycin (đáy 15 - 20 mcg/mL).'
      },
      {
        organismName: 'Acinetobacter baumannii',
        sampleCount: 62,
        pctOfIsolates: 11.9,
        sensitivities: [
          { antibioticName: 'Colistin', sensitivityPct: 87.1 },
          { antibioticName: 'Tigecycline', sensitivityPct: 66.1 },
          { antibioticName: 'Meropenem', sensitivityPct: 12.9 },
          { antibioticName: 'Amikacin', sensitivityPct: 17.7 }
        ],
        notableResistance: 'Đa số là CRAB kháng toàn bộ Beta-lactam. Cần phác đồ kết hợp Colistin / Sulbactam.'
      }
    ],
    source: { doc: 'BVBND_HDSDKS', page: 12 }
  },

  // 4. DA & MÔ MỀM NGƯỜI LỚN (P.9-10)
  {
    site: 'skin_soft_tissue',
    population: 'adult',
    period: '01/2024 - 12/2024',
    sampleTotal: 280,
    organisms: [
      {
        organismName: 'Staphylococcus aureus',
        sampleCount: 140,
        pctOfIsolates: 50.0,
        sensitivities: [
          { antibioticName: 'Vancomycin', sensitivityPct: 100 },
          { antibioticName: 'Linezolid', sensitivityPct: 100 },
          { antibioticName: 'Daptomycin', sensitivityPct: 100 },
          { antibioticName: 'Teicoplanin', sensitivityPct: 97.1 },
          { antibioticName: 'TMP-SMX (Co-trimoxazole)', sensitivityPct: 82.1 },
          { antibioticName: 'Clindamycin', sensitivityPct: 45.0 },
          { antibioticName: 'Oxacillin', sensitivityPct: 24.3 }
        ],
        notableResistance: 'MRSA chiếm 75.7%. Daptomycin và Vancomycin là lựa chọn hàng đầu cho nhiễm khuẩn nặng.'
      },
      {
        organismName: 'Streptococcus pyogenes (Group A)',
        sampleCount: 42,
        pctOfIsolates: 15.0,
        sensitivities: [
          { antibioticName: 'Penicillin / Ampicillin', sensitivityPct: 100 },
          { antibioticName: 'Cefazolin', sensitivityPct: 100 },
          { antibioticName: 'Vancomycin', sensitivityPct: 100 },
          { antibioticName: 'Clindamycin', sensitivityPct: 85.7 }
        ],
        notableResistance: 'Nhạy 100% với Penicillin/Cephalosporin. Clindamycin phối hợp để ức chế ngoại độc tố.'
      },
      {
        organismName: 'Pseudomonas aeruginosa',
        sampleCount: 36,
        pctOfIsolates: 12.9,
        sensitivities: [
          { antibioticName: 'Colistin', sensitivityPct: 97.2 },
          { antibioticName: 'Amikacin', sensitivityPct: 75.0 },
          { antibioticName: 'Ceftazidime', sensitivityPct: 58.3 },
          { antibioticName: 'Piperacillin/tazobactam', sensitivityPct: 52.8 },
          { antibioticName: 'Ciprofloxacin', sensitivityPct: 44.4 }
        ],
        notableResistance: 'Thường gặp trong loét bàn chân đái tháo đường, bỏng và vết thương mạn tính.'
      }
    ],
    source: { doc: 'BVBND_HDSDKS', page: 9 }
  },

  // 5. DỊCH BÁNG / MÀNG BỤNG NGƯỜI LỚN (P.11-12)
  {
    site: 'peritoneal',
    population: 'adult',
    period: '01/2024 - 12/2024',
    sampleTotal: 195,
    organisms: [
      {
        organismName: 'Escherichia coli',
        sampleCount: 98,
        pctOfIsolates: 50.3,
        sensitivities: [
          { antibioticName: 'Meropenem', sensitivityPct: 98.0 },
          { antibioticName: 'Ertapenem', sensitivityPct: 96.9 },
          { antibioticName: 'Amikacin', sensitivityPct: 93.9 },
          { antibioticName: 'Piperacillin/tazobactam', sensitivityPct: 85.7 },
          { antibioticName: 'Ceftriaxone', sensitivityPct: 42.9 },
          { antibioticName: 'Ciprofloxacin', sensitivityPct: 26.5 }
        ],
        notableResistance: 'Tỷ lệ sinh ESBL > 57% ở bệnh nhân xơ gan đã dùng kháng sinh dự phòng Quinolone.'
      },
      {
        organismName: 'Klebsiella pneumoniae',
        sampleCount: 45,
        pctOfIsolates: 23.1,
        sensitivities: [
          { antibioticName: 'Colistin', sensitivityPct: 93.3 },
          { antibioticName: 'Amikacin', sensitivityPct: 71.1 },
          { antibioticName: 'Meropenem', sensitivityPct: 51.1 },
          { antibioticName: 'Piperacillin/tazobactam', sensitivityPct: 40.0 },
          { antibioticName: 'Ceftriaxone', sensitivityPct: 28.9 }
        ],
        notableResistance: 'Đề kháng Cephalosporin thế hệ 3 cao. Khuyến cáo Ertapenem hoặc Pip/taz cho Nhóm 2.'
      },
      {
        organismName: 'Enterococcus faecalis',
        sampleCount: 28,
        pctOfIsolates: 14.4,
        sensitivities: [
          { antibioticName: 'Linezolid', sensitivityPct: 100 },
          { antibioticName: 'Vancomycin', sensitivityPct: 89.3 },
          { antibioticName: 'Ampicillin', sensitivityPct: 75.0 }
        ],
        notableResistance: 'Thường phối hợp trong viêm phúc mạc thứ phát hoặc nhiễm trùng dịch báng tái phát.'
      }
    ],
    source: { doc: 'BVBND_HDSDKS', page: 11 }
  },

  // 6. HÔ HẤP TRẺ EM (P.4-5)
  {
    site: 'respiratory',
    population: 'pediatric',
    period: '01/2024 - 12/2024',
    sampleTotal: 220,
    organisms: [
      {
        organismName: 'Streptococcus pneumoniae (Phế cầu)',
        sampleCount: 88,
        pctOfIsolates: 40.0,
        sensitivities: [
          { antibioticName: 'Vancomycin', sensitivityPct: 100 },
          { antibioticName: 'Linezolid', sensitivityPct: 100 },
          { antibioticName: 'Ceftriaxone / Cefotaxime', sensitivityPct: 78.4 },
          { antibioticName: 'Amoxicillin/clavulanate', sensitivityPct: 72.7 },
          { antibioticName: 'Azithromycin (Macrolide)', sensitivityPct: 14.8 }
        ],
        notableResistance: 'Kháng Macrolide gần như hoàn toàn (> 85%). Không dùng Macrolide đơn độc trị phế cầu.'
      },
      {
        organismName: 'Haemophilus influenzae',
        sampleCount: 55,
        pctOfIsolates: 25.0,
        sensitivities: [
          { antibioticName: 'Ceftriaxone', sensitivityPct: 98.2 },
          { antibioticName: 'Cefotaxime', sensitivityPct: 98.2 },
          { antibioticName: 'Amoxicillin/clavulanate', sensitivityPct: 85.5 },
          { antibioticName: 'Ampicillin', sensitivityPct: 38.2 }
        ],
        notableResistance: 'Tỷ lệ sinh Beta-lactamase > 60%. Ưu tiên Cephalosporin thế hệ 3 hoặc Amox/Clav.'
      },
      {
        organismName: 'Staphylococcus aureus',
        sampleCount: 38,
        pctOfIsolates: 17.3,
        sensitivities: [
          { antibioticName: 'Vancomycin', sensitivityPct: 100 },
          { antibioticName: 'Linezolid', sensitivityPct: 100 },
          { antibioticName: 'Oxacillin', sensitivityPct: 34.2 }
        ],
        notableResistance: 'Tỷ lệ MRSA ở trẻ em viêm phổi hoại tử hoặc sau cúm ~ 65.8%.'
      }
    ],
    source: { doc: 'BVBND_HDSDKS', page: 4 }
  },

  // 7. NHIỄM KHUẨN HUYẾT TRẺ EM (P.5-6)
  {
    site: 'sepsis',
    population: 'pediatric',
    period: '01/2024 - 12/2024',
    sampleTotal: 180,
    organisms: [
      {
        organismName: 'Escherichia coli',
        sampleCount: 65,
        pctOfIsolates: 36.1,
        sensitivities: [
          { antibioticName: 'Meropenem', sensitivityPct: 96.9 },
          { antibioticName: 'Amikacin', sensitivityPct: 93.8 },
          { antibioticName: 'Ceftriaxone', sensitivityPct: 53.8 }
        ],
        notableResistance: 'Tác nhân hàng đầu gây nhiễm khuẩn huyết sơ sinh và trẻ nhũ nhi.'
      },
      {
        organismName: 'Staphylococcus aureus',
        sampleCount: 45,
        pctOfIsolates: 25.0,
        sensitivities: [
          { antibioticName: 'Vancomycin', sensitivityPct: 100 },
          { antibioticName: 'Linezolid', sensitivityPct: 100 },
          { antibioticName: 'Oxacillin', sensitivityPct: 37.8 }
        ],
        notableResistance: 'MRSA chiếm 62.2%. Cần theo dõi nồng độ đáy Vancomycin chặt chẽ.'
      },
      {
        organismName: 'Streptococcus pneumoniae',
        sampleCount: 32,
        pctOfIsolates: 17.8,
        sensitivities: [
          { antibioticName: 'Vancomycin', sensitivityPct: 100 },
          { antibioticName: 'Ceftriaxone', sensitivityPct: 81.3 }
        ],
        notableResistance: 'Thường gây nhiễm khuẩn huyết tiên phát hoặc kèm viêm màng não mủ.'
      }
    ],
    source: { doc: 'BVBND_HDSDKS', page: 5 }
  }
];

export function getAntibiogramForSite(site: string, population: string): AntibiogramDataset | undefined {
  return BVBND_ANTIBIOGRAMS.find(ab => ab.site === site && ab.population === population);
}
