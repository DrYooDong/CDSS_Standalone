/**
 * Catalog and metadata for official Clinical Guideline Images
 * Source: BV Bệnh Nhiệt Đới TP.HCM — "Hướng dẫn sử dụng kháng sinh" (Cập nhật 02/03/2026)
 * File gốc: "7. HƯỚNG DẪN SỬ DỤNG KHÁNG SINH - BV Bệnh nhiệt đới.pdf"
 */

import { InfectionSite, Population } from '../types';

export type GuidelineCategory = 
  | 'regimen'
  | 'antibiogram'
  | 'mdr_cre'
  | 'mdr_pseudomonas'
  | 'mdr_acineto'
  | 'mdr_stenotrophomonas';

export interface GuidelineImageEntry {
  id: string;
  titleVi: string;
  subtitleVi: string;
  population: Population | 'all';
  site: InfectionSite | 'all';
  category: GuidelineCategory;
  pdfPage: number;
  imageFilename: string; // Tên file trong /assets/guidelines/
  summaryPointsVi: string[];
  clinicalCautionsVi?: string[];
  relatedDrugIds?: string[];
}

export const GUIDELINE_IMAGES: GuidelineImageEntry[] = [
  // ==========================================
  // NGƯỜI LỚN (ADULT)
  // ==========================================
  {
    id: 'adult_resp_regimen',
    titleVi: 'Điều Trị Khởi Đầu Viêm Phổi — Người Lớn',
    subtitleVi: 'Lưu đồ lựa chọn kháng sinh ban đầu theo phân nhóm nguy cơ vi khuẩn đa kháng',
    population: 'adult',
    site: 'respiratory',
    category: 'regimen',
    pdfPage: 9,
    imageFilename: 'adult_resp_regimen.png',
    summaryPointsVi: [
      'Nhóm 1 (Ít nguy cơ VKĐK): Ceftriaxon 1-2g/ngày HOẶC Amox/Clav 1g q8h ± Kháng sinh phủ VK không điển hình (Azithromycin). Thay thế bằng FQ hô hấp (Levofloxacin / Moxifloxacin).',
      'Nhóm 2 + Nguy cơ MRSA: Vancomycin (tải 25-30mg/kg, duy trì 15-20mg/kg q8-12h TDM) HOẶC Teicoplanin HOẶC Linezolid 600mg q12h. (Chống chỉ định Daptomycin).',
      'Nhóm 2 + Nguy cơ ESBL: Piperacillin/Tazobactam 4.5g q6h TKD HOẶC Ertapenem 1g q24h HOẶC Meropenem 1-2g q8h / Imipenem 1g q8h TKD.',
      'Nhóm 2 + Nguy cơ P. aeruginosa / A. baumannii: Piperacillin/Tazobactam HOẶC Cefoperazone/Sulbactam HOẶC Ceftazidime HOẶC Cefepime HOẶC Meropenem/Imipenem phối hợp Amikacin ± Colistin.'
    ],
    clinicalCautionsVi: [
      'Daptomycin bị bất hoạt bởi chất có hoạt tính bề mặt ở phế nang (surfactant), TUYỆT ĐỐI KHÔNG dùng trong viêm phổi.',
      'Nếu bệnh nhân có nguy cơ phối hợp cả Gram (+) và Gram (-) thì bắt buộc phối hợp kháng sinh theo lưu đồ.'
    ],
    relatedDrugIds: ['amox_clav', 'ceftriaxon', 'levofloxacin', 'moxifloxacin', 'vancomycin', 'linezolid', 'piperacillin_tazo', 'meropenem', 'imipenem', 'colistin']
  },
  {
    id: 'adult_resp_antibiogram',
    titleVi: 'Dữ Liệu Vi Sinh Viêm Phổi — Người Lớn',
    subtitleVi: 'Tỷ lệ phân lập vi khuẩn và độ nhạy cảm kháng sinh tại BV Bệnh Nhiệt Đới',
    population: 'adult',
    site: 'respiratory',
    category: 'antibiogram',
    pdfPage: 8,
    imageFilename: 'adult_resp_antibiogram.png',
    summaryPointsVi: [
      'Tác nhân Gram âm chiếm ưu thế áp đảo ở bệnh nhân nội viện: Klebsiella pneumoniae, Acinetobacter baumannii, Pseudomonas aeruginosa.',
      'Acinetobacter baumannii có tỷ lệ đề kháng Carbapenem rất cao (> 80%), cần chú ý phân nhóm nguy cơ sớm.',
      'Tụ cầu vàng (S. aureus) tại khoa Hồi sức đa phần là MRSA.'
    ]
  },
  {
    id: 'adult_blood_regimen',
    titleVi: 'Điều Trị Khởi Đầu Nhiễm Khuẩn Huyết — Người Lớn',
    subtitleVi: 'Phác đồ kinh nghiệm theo tiêu điểm xâm nhập và phân tầng nguy cơ',
    population: 'adult',
    site: 'sepsis',
    category: 'regimen',
    pdfPage: 13,
    imageFilename: 'adult_blood_regimen.png',
    summaryPointsVi: [
      'Kháng sinh phải được truyền ngay trong GIỜ ĐẦU TIÊN (Hour-1 bundle) sau khi lấy cấy máu.',
      'Nhóm 1: Ceftriaxon 1-2g q24h ± Ciprofloxacin/Levofloxacin HOẶC Gentamicin/Amikacin tùy ổ nhiễm.',
      'Nhóm 2 + Nghi ngờ ngõ vào Da/Catheter (Gram +): Phối hợp Vancomycin HOẶC Teicoplanin.',
      'Nhóm 2 + Sốc nhiễm khuẩn hoặc nguy cơ Pseudomonas: Meropenem 1g q8h TKD (hoặc Pip-taz 4.5g q6h TKD) + Amikacin 15-20mg/kg q24h ± Colistin.'
    ],
    clinicalCautionsVi: [
      'Luôn ưu tiên kiểm soát nguồn nhiễm (Source control): rút bỏ ngay catheter nghi nhiễm trùng, dẫn lưu ổ áp xe.',
      'Không trì hoãn truyền kháng sinh để chờ kết quả cận lâm sàng.'
    ],
    relatedDrugIds: ['ceftriaxon', 'meropenem', 'vancomycin', 'amikacin', 'colistin', 'piperacillin_tazo']
  },
  {
    id: 'adult_blood_antibiogram',
    titleVi: 'Dữ Liệu Vi Sinh Nhiễm Khuẩn Huyết — Người Lớn',
    subtitleVi: 'Tác nhân phân lập từ cấy máu và độ nhạy cảm tại BV Bệnh Nhiệt Đới',
    population: 'adult',
    site: 'sepsis',
    category: 'antibiogram',
    pdfPage: 12,
    imageFilename: 'adult_blood_antibiogram.png',
    summaryPointsVi: [
      'Trực khuẩn Gram âm (E. coli, K. pneumoniae, P. aeruginosa, Burkholderia pseudomallei) chiếm tỷ lệ cao trong cấy máu.',
      'E. coli sinh ESBL chiếm tỷ lệ đáng kể từ ngõ vào tiết niệu và tiêu hóa.',
      'Phát hiện sớm Burkholderia pseudomallei (bệnh Melioidosis) ở bệnh nhân đái tháo đường, nghiện rượu.'
    ]
  },
  {
    id: 'adult_ssti_regimen',
    titleVi: 'Điều Trị Khởi Đầu Nhiễm Khuẩn Da & Mô Mềm (SSTI) — Người Lớn',
    subtitleVi: 'Lưu đồ xử trí viêm mô tế bào, áp xe, hoại tử mô mềm',
    population: 'adult',
    site: 'skin_soft_tissue',
    category: 'regimen',
    pdfPage: 10,
    imageFilename: 'adult_ssti_regimen.png',
    summaryPointsVi: [
      'Nhẹ / Ngoại trú: Cloxacillin / Oxacillin PO, Cefalexin, Clindamycin HOẶC Co-trimoxazole.',
      'Trung bình - Nặng / Nội trú: Oxacillin 2g q4h IV, Cefazolin 1-2g q8h IV HOẶC Clindamycin 600mg q8h IV.',
      'Có nguy cơ MRSA: Vancomycin (TDM), Daptomycin 6-8mg/kg q24h, Teicoplanin HOẶC Linezolid 600mg q12h.',
      'Nhiễm khuẩn hoại tử (Necrotizing fasciitis): Phối hợp Carbapenem/Pip-taz + Clindamycin (ức chế độc tố Toxin) + Vancomycin và PHẪU THUẬT CẤP CỨU rạch giải áp.'
    ],
    clinicalCautionsVi: [
      'Clindamycin có tác dụng ức chế tổng hợp ngoại độc tố vi khuẩn (anti-toxin effect), rất quan trọng trong viêm mô bào hoại tử do Liên cầu / Tụ cầu.',
      'Hội chẩn Ngoại khoa ngay lập tức khi nghi ngờ viêm cân mạc hoại tử.'
    ],
    relatedDrugIds: ['oxacillin', 'cefazolin', 'clindamycin', 'vancomycin', 'linezolid', 'meropenem']
  },
  {
    id: 'adult_ssti_antibiogram',
    titleVi: 'Dữ Liệu Vi Sinh Da & Mô Mềm — Người Lớn',
    subtitleVi: 'Tác nhân phân lập từ mủ, mô hoại tử tại BV Bệnh Nhiệt Đới',
    population: 'adult',
    site: 'skin_soft_tissue',
    category: 'antibiogram',
    pdfPage: 9,
    imageFilename: 'adult_ssti_antibiogram.png',
    summaryPointsVi: [
      'Staphylococcus aureus và Streptococcus pyogenes là hai tác nhân hàng đầu.',
      'Tỷ lệ MRSA trong cộng đồng và bệnh viện cần được đánh giá dựa trên tiền sử dùng kháng sinh và nằm viện.',
      'Nhiễm trùng bàn chân đái tháo đường thường là đa vi khuẩn (Gram dương + Gram âm + Kỵ khí).'
    ]
  },
  {
    id: 'adult_uti_regimen',
    titleVi: 'Điều Trị Khởi Đầu Nhiễm Khuẩn Tiết Niệu — Người Lớn',
    subtitleVi: 'Lưu đồ điều trị viêm bàng quang, viêm đài bể thận và nhiễm trùng tiểu phức tạp',
    population: 'adult',
    site: 'urinary',
    category: 'regimen',
    pdfPage: 11,
    imageFilename: 'adult_uti_regimen.png',
    summaryPointsVi: [
      'Viêm bàng quang cấp không biến chứng: Fosfomycin trometamol 3g gói uống duy nhất HOẶC Nitrofurantoin 100mg bid x 5 ngày.',
      'Viêm đài bể thận cấp / Nhiễm trùng tiểu có biến chứng: Ceftriaxon 1g q24h IV HOẶC Ciprofloxacin 400mg q12h IV / Levofloxacin 750mg q24h.',
      'Nguy cơ ESBL: Ertapenem 1g q24h HOẶC Meropenem 1g q8h HOẶC Amikacin (nếu chức năng thận tốt).',
      'Nhiễm trùng tiểu do đặt sonde (CAUTI): Rút hoặc thay sonde tiểu mới trước khi cấy nước tiểu và bắt đầu kháng sinh.'
    ],
    clinicalCautionsVi: [
      'Nitrofurantoin và Fosfomycin PO KHÔNG dùng cho viêm đài bể thận vì không đạt đủ nồng độ điều trị trong nhu mô thận.',
      'Không điều trị vi khuẩn niệu không triệu chứng (ASB), ngoại trừ phụ nữ có thai hoặc trước thủ thuật niệu khoa xâm lấn.'
    ],
    relatedDrugIds: ['fosfomycin', 'ceftriaxon', 'ciprofloxacin', 'levofloxacin', 'ertapenem', 'meropenem', 'amikacin']
  },
  {
    id: 'adult_uti_antibiogram',
    titleVi: 'Dữ Liệu Vi Sinh Tiết Niệu — Người Lớn',
    subtitleVi: 'Phổ vi khuẩn cấy nước tiểu và tỷ lệ kháng kháng sinh tại BV Bệnh Nhiệt Đới',
    population: 'adult',
    site: 'urinary',
    category: 'antibiogram',
    pdfPage: 10,
    imageFilename: 'adult_uti_antibiogram.png',
    summaryPointsVi: [
      'Escherichia coli chiếm hơn 60-70% các trường hợp cấy nước tiểu dương tính.',
      'Tỷ lệ E. coli kháng Fluoroquinolone và Co-trimoxazole rất cao (> 50-60%), cần thận trọng khi điều trị kinh nghiệm.',
      'Fosfomycin và Amikacin duy trì độ nhạy cao trên các chủng sinh ESBL.'
    ]
  },
  {
    id: 'adult_sbp_regimen',
    titleVi: 'Điều Trị Khởi Đầu Nhiễm Khuẩn Dịch Báng (SBP) — Người Lớn',
    subtitleVi: 'Lưu đồ điều trị viêm phúc mạc tự phát do vi khuẩn trên bệnh nhân xơ gan',
    population: 'adult',
    site: 'peritoneal',
    category: 'regimen',
    pdfPage: 12,
    imageFilename: 'adult_sbp_regimen.png',
    summaryPointsVi: [
      'Tiêu chuẩn chẩn đoán SBP: Bạch cầu đa nhân dịch báng (PMN) ≥ 250 tế bào/mm³.',
      'Nhóm 1 (Mắc phải cộng đồng, ít nguy cơ): Cefotaxime 2g q8h IV HOẶC Ceftriaxon 1-2g q24h IV.',
      'Nhóm 2 (Mắc phải bệnh viện hoặc CLIF-SOFA ≥ 12): Piperacillin/Tazobactam 4.5g q6h HOẶC Meropenem 1g q8h TKD (hoặc Ertapenem 1g q24h).',
      'Luôn phối hợp Albumin người 20%: 1.5 g/kg trong 6 giờ đầu, sau đó 1 g/kg vào ngày thứ 3 để giảm hội chứng gan thận (HRS) và tử vong.'
    ],
    clinicalCautionsVi: [
      'Bắt buộc chọc dịch báng trước liều kháng sinh đầu tiên.',
      'Không dùng Aminoglycoside cho bệnh nhân xơ gan do nguy cơ độc thận và suy thận cấp rất cao.'
    ],
    relatedDrugIds: ['ceftriaxon', 'piperacillin_tazo', 'meropenem', 'ertapenem']
  },
  {
    id: 'adult_sbp_antibiogram',
    titleVi: 'Dữ Liệu Vi Sinh Dịch Báng — Người Lớn',
    subtitleVi: 'Tác nhân phân lập từ dịch màng bụng tại BV Bệnh Nhiệt Đới',
    population: 'adult',
    site: 'peritoneal',
    category: 'antibiogram',
    pdfPage: 11,
    imageFilename: 'adult_sbp_antibiogram.png',
    summaryPointsVi: [
      'Vi khuẩn đường ruột Gram âm (E. coli, Klebsiella pneumoniae) chiếm đa số do thẩm thấu qua thành ruột.',
      'Ở bệnh nhân đã dùng dự phòng Norfloxacin/Ciprofloxacin dài ngày, nguy cơ nhiễm vi khuẩn Gram dương và chủng kháng thuốc tăng cao.'
    ]
  },

  // ==========================================
  // TRẺ EM (PEDIATRIC)
  // ==========================================
  {
    id: 'peds_resp_regimen',
    titleVi: 'Điều Trị Khởi Đầu Viêm Phổi — Trẻ Em',
    subtitleVi: 'Lưu đồ lựa chọn kháng sinh ban đầu cho bệnh nhi theo độ tuổi và độ nặng',
    population: 'pediatric',
    site: 'respiratory',
    category: 'regimen',
    pdfPage: 4,
    imageFilename: 'peds_resp_regimen.png',
    summaryPointsVi: [
      'Viêm phổi nhẹ / vừa: Amoxicillin uống liều cao 80-90 mg/kg/ngày chia 2-3 lần HOẶC Ampicillin 150-200 mg/kg/ngày IV.',
      'Viêm phổi nặng / Nghi ngờ vi khuẩn kháng thuốc: Cefotaxime 150 mg/kg/ngày chia 3-4 lần HOẶC Ceftriaxon 50-100 mg/kg/ngày IV.',
      'Nghi ngờ Tụ cầu / MRSA (tràn dịch màng phổi, bóng khí phổi): Phối hợp Oxacillin (nếu MSSA) hoặc Vancomycin (40-60 mg/kg/ngày chia 4 lần).'
    ],
    relatedDrugIds: ['amox_clav', 'ceftriaxon', 'vancomycin']
  },
  {
    id: 'peds_resp_antibiogram',
    titleVi: 'Dữ Liệu Vi Sinh Viêm Phổi — Trẻ Em',
    subtitleVi: 'Tác nhân đường hô hấp trẻ em tại BV Bệnh Nhiệt Đới',
    population: 'pediatric',
    site: 'respiratory',
    category: 'antibiogram',
    pdfPage: 4,
    imageFilename: 'peds_resp_antibiogram.png',
    summaryPointsVi: [
      'Streptococcus pneumoniae, Haemophilus influenzae và Moraxella catarrhalis là tác nhân cộng đồng hàng đầu.',
      'Mycoplasma pneumoniae cần được nghĩ đến ở trẻ trên 5 tuổi sốt dai dẳng và ho khan kéo dài.'
    ]
  },
  {
    id: 'peds_blood_regimen',
    titleVi: 'Điều Trị Khởi Đầu Nhiễm Khuẩn Huyết — Trẻ Em',
    subtitleVi: 'Lưu đồ điều trị sốc nhiễm trùng và nhiễm khuẩn huyết nhi khoa',
    population: 'pediatric',
    site: 'sepsis',
    category: 'regimen',
    pdfPage: 6,
    imageFilename: 'peds_blood_regimen.png',
    summaryPointsVi: [
      'Sơ sinh (< 28 ngày): Ampicillin + Gentamicin HOẶC Ampicillin + Cefotaxime (tránh dùng Ceftriaxone ở trẻ sơ sinh có tăng bilirubin máu).',
      'Trẻ lớn: Cefotaxime 150-200 mg/kg/ngày HOẶC Ceftriaxon 80-100 mg/kg/ngày IV.',
      'Nhiễm khuẩn bệnh viện / Sốc nặng: Meropenem 60-120 mg/kg/ngày chia 3 lần + Vancomycin 40-60 mg/kg/ngày chia 4 lần.'
    ],
    clinicalCautionsVi: [
      'Chống chỉ định Ceftriaxone ở trẻ sơ sinh đang dùng dịch truyền chứa Canxi (nguy cơ tạo tủa ceftriaxone-canxi gây tử vong) và trẻ sơ sinh vàng da.'
    ],
    relatedDrugIds: ['ceftriaxon', 'meropenem', 'vancomycin', 'gentamicin']
  },
  {
    id: 'peds_blood_antibiogram',
    titleVi: 'Dữ Liệu Vi Sinh Nhiễm Khuẩn Huyết — Trẻ Em',
    subtitleVi: 'Tác nhân phân lập cấy máu nhi tại BV Bệnh Nhiệt Đới',
    population: 'pediatric',
    site: 'sepsis',
    category: 'antibiogram',
    pdfPage: 5,
    imageFilename: 'peds_blood_antibiogram.png',
    summaryPointsVi: [
      'Trẻ sơ sinh: Streptococcus nhóm B (GBS), E. coli, Listeria monocytogenes.',
      'Trẻ lớn: S. pneumoniae, N. meningitidis, Salmonella spp., S. aureus.'
    ]
  },
  {
    id: 'peds_ssti_regimen',
    titleVi: 'Điều Trị Khởi Đầu Da & Mô Mềm — Trẻ Em',
    subtitleVi: 'Lưu đồ điều trị chốc lở, nhọt, viêm mô bào trẻ em',
    population: 'pediatric',
    site: 'skin_soft_tissue',
    category: 'regimen',
    pdfPage: 7,
    imageFilename: 'peds_ssti_regimen.png',
    summaryPointsVi: [
      'Cloxacillin / Oxacillin 100-150 mg/kg/ngày chia 4 lần IV.',
      'Cefazolin 50-100 mg/kg/ngày chia 3 lần IV.',
      'Nghi ngờ MRSA: Vancomycin hoặc Clindamycin (nếu nhạy cảm).'
    ],
    relatedDrugIds: ['oxacillin', 'cefazolin', 'clindamycin', 'vancomycin']
  },
  {
    id: 'peds_ssti_antibiogram',
    titleVi: 'Dữ Liệu Vi Sinh Da & Mô Mềm — Trẻ Em',
    subtitleVi: 'Dữ liệu cấy mủ mô mềm trẻ em tại BV Bệnh Nhiệt Đới',
    population: 'pediatric',
    site: 'skin_soft_tissue',
    category: 'antibiogram',
    pdfPage: 6,
    imageFilename: 'peds_ssti_antibiogram.png',
    summaryPointsVi: [
      'Tụ cầu vàng (S. aureus) và Liên cầu tán huyết beta nhóm A chiếm tỷ lệ áp đảo.'
    ]
  },
  {
    id: 'peds_uti_regimen',
    titleVi: 'Điều Trị Khởi Đầu Nhiễm Khuẩn Tiết Niệu — Trẻ Em',
    subtitleVi: 'Lưu đồ xử trí nhiễm trùng tiểu trẻ em',
    population: 'pediatric',
    site: 'urinary',
    category: 'regimen',
    pdfPage: 8,
    imageFilename: 'peds_uti_regimen.png',
    summaryPointsVi: [
      'Uống (trẻ lớn, toàn trạng tốt): Cefixime 8 mg/kg/ngày HOẶC Amox/Clav 40-50 mg/kg/ngày.',
      'Tiêm truyền (trẻ sốt cao, nôn ói, trẻ nhỏ): Cefotaxime 100-150 mg/kg/ngày HOẶC Ceftriaxon 50-75 mg/kg/ngày.'
    ],
    relatedDrugIds: ['ceftriaxon', 'amox_clav']
  },
  {
    id: 'peds_uti_antibiogram',
    titleVi: 'Dữ Liệu Vi Sinh Tiết Niệu — Trẻ Em',
    subtitleVi: 'Dữ liệu cấy nước tiểu trẻ em tại BV Bệnh Nhiệt Đới',
    population: 'pediatric',
    site: 'urinary',
    category: 'antibiogram',
    pdfPage: 7,
    imageFilename: 'peds_uti_antibiogram.png',
    summaryPointsVi: [
      'E. coli là tác nhân phổ biến nhất (> 80%). Cần siêu âm hệ niệu tìm dị tật bẩm sinh (trào ngược bàng quang niệu quản VUR).'
    ]
  },

  // ==========================================
  // VI KHUẨN ĐA KHÁNG (MDR / XDR PATHWAYS)
  // ==========================================
  {
    id: 'mdr_cre_table1',
    titleVi: 'Lựa Chọn Kháng Sinh Cho CRE Còn Nhạy Cảm',
    subtitleVi: 'Bảng 1: Phác đồ theo vị trí ổ nhiễm khi chủng CRE còn nhạy một số kháng sinh',
    population: 'all',
    site: 'all',
    category: 'mdr_cre',
    pdfPage: 15,
    imageFilename: 'mdr_cre_table1.png',
    summaryPointsVi: [
      'Nhiễm trùng tiểu dưới không phức tạp: Nitrofurantoin, TMP-SMX, Cipro/Levo, Fosfomycin uống.',
      'Viêm đài bể thận / phức tạp: TMP-SMX, Cipro/Levo, Carbapenem, Aminoglycoside.',
      'Nhiễm trùng ngoài đường tiểu (kể cả nhiễm trùng huyết): Meropenem / Imipenem liều cao truyền kéo dài nếu MIC ≤ 8 mcg/mL, Ertapenem nếu còn nhạy.'
    ],
    clinicalCautionsVi: [
      'Tigecyclin hoặc Eravacyclin KHÔNG dùng cho nhiễm khuẩn huyết hoặc nhiễm khuẩn tiết niệu do nồng độ trong máu và nước tiểu thấp.',
      'Colistin là lựa chọn cuối cùng do nguy cơ độc thận.'
    ],
    relatedDrugIds: ['meropenem', 'imipenem', 'ertapenem', 'fosfomycin', 'tigecycline', 'colistin']
  },
  {
    id: 'mdr_cre_flowchart',
    titleVi: 'Lưu Đồ Điều Trị CRE Theo Kiểu Gene Kháng Thuốc',
    subtitleVi: 'Bảng 2: Phân tầng điều trị trúng đích CRE theo men KPC, OXA-48 và MBL (NDM)',
    population: 'all',
    site: 'all',
    category: 'mdr_cre',
    pdfPage: 15,
    imageFilename: 'mdr_cre_flowchart.png',
    summaryPointsVi: [
      'Men Serine nhóm A (KPC): Ưu tiên Ceftazidime/Avibactam (CAZ-AVI), Meropenem/Vaborbactam, Imipenem/Relebactam, Cefiderocol.',
      'Men Serine nhóm D (OXA-48-like): Ưu tiên CAZ-AVI, Cefiderocol. Lưu ý: Meropenem-vaborbactam và Imipenem-relebactam KHÔNG có tác dụng.',
      'Men Metallo-beta-lactamase (MBL: NDM, VIM, IMP): CAZ-AVI + Aztreonam truyền đồng thời qua Y-site HOẶC Cefiderocol.',
      'Kỹ thuật Y-site: CAZ-AVI và Aztreonam mỗi thuốc pha riêng biệt, truyền đồng thời kéo dài 3 giờ.'
    ],
    clinicalCautionsVi: [
      'CAZ-AVI đơn độc KHÔNG có hoạt tính trên vi khuẩn mang men Metallo (NDM), bắt buộc phải có Aztreonam đi kèm.'
    ],
    relatedDrugIds: ['ceftazidime_avibactam', 'aztreonam', 'meropenem', 'colistin']
  },
  {
    id: 'mdr_pseudo_dosing',
    titleVi: 'Liều Kháng Sinh Điều Trị DTR - Pseudomonas aeruginosa',
    subtitleVi: 'Bảng liều khuyến cáo theo IDSA 2024 và BV Bệnh Nhiệt Đới',
    population: 'all',
    site: 'all',
    category: 'mdr_pseudomonas',
    pdfPage: 17,
    imageFilename: 'mdr_pseudo_dosing.png',
    summaryPointsVi: [
      'Ceftolozane/Tazobactam: 3g (2g/1g) IV q8h truyền kéo dài 3 giờ.',
      'Ceftazidime/Avibactam: 2.5g (2g/0.5g) IV q8h truyền kéo dài 3 giờ.',
      'Imipenem/Cilastatin/Relebactam: 1.25g IV q6h truyền trong 30 phút.',
      'Cefiderocol: 2g IV q8h truyền kéo dài 3 giờ.',
      'Tobramycin / Amikacin: Tối ưu theo liều một lần trong ngày (ODA) và theo dõi TDM.'
    ],
    relatedDrugIds: ['ceftazidime_avibactam', 'ceftolozane_tazo', 'tobramycin', 'amikacin', 'colistin']
  },
  {
    id: 'mdr_pseudo_flowchart',
    titleVi: 'Lưu Đồ Hướng Dẫn Sử Dụng Kháng Sinh DTR - P. aeruginosa',
    subtitleVi: 'Kháng sinh ưu tiên và chiến lược đơn trị liệu / phối hợp',
    population: 'all',
    site: 'all',
    category: 'mdr_pseudomonas',
    pdfPage: 18,
    imageFilename: 'mdr_pseudo_flowchart.png',
    summaryPointsVi: [
      'Ưu tiên đơn trị liệu: Ceftolozane/Tazobactam hoặc Ceftazidime/Avibactam. Việc phối hợp không còn khuyến cáo thường quy vì tăng độc tính.',
      'Chỉ phối hợp thêm Aminoglycoside trong trường hợp cực nặng: Sốc nhiễm khuẩn hoặc Bệnh nhân giảm bạch cầu hạt.',
      'Nếu thất bại hoặc kháng thuốc ưu tiên: xem xét Cefiderocol hoặc Colistin cứu cánh.'
    ],
    clinicalCautionsVi: [
      'Nếu đã thất bại với một thuốc BL-BLI thế hệ mới (ví dụ CAZ-AVI), KHÔNG nên đổi sang Ceftolozane/Tazobactam vì cơ chế đề kháng chéo qua bơm tống hoặc đột biến porin.'
    ],
    relatedDrugIds: ['ceftolozane_tazo', 'ceftazidime_avibactam', 'amikacin', 'colistin']
  },
  {
    id: 'mdr_acineto_dosing',
    titleVi: 'Liều Kháng Sinh Cho Acinetobacter baumannii Đa Kháng (CRAB)',
    subtitleVi: 'Bảng liều kháng sinh đặc hiệu cho CRAB theo BVBND',
    population: 'all',
    site: 'all',
    category: 'mdr_acineto',
    pdfPage: 20,
    imageFilename: 'mdr_acineto_dosing.png',
    summaryPointsVi: [
      'Ampicillin/Sulbactam liều cao: 9g (6g Amp / 3g Sulbactam) IV mỗi 8 giờ truyền kéo dài 4 giờ (Tổng Sulbactam 9g/ngày = 27g Unasyn/ngày).',
      'Sulbactam-Durlobactam: 1g/1g IV mỗi 6 giờ truyền trong 3 giờ kết hợp Meropenem/Imipenem.',
      'Minocycline: Liều nạp 200mg IV/PO, duy trì 100-200mg q12h.',
      'Tigecycline liều cao: Liều nạp 200mg, sau đó 100mg q12h.',
      'Colistin / Polymyxin B: Theo liều nạp dựa trên cân nặng và hiệu chỉnh theo độ thanh thải thận.'
    ],
    clinicalCautionsVi: [
      'Sulbactam có hoạt tính diệt khuẩn nội tại trên Acinetobacter bằng cách gắn chọn lọc vào PBP1 và PBP3, nhưng bắt buộc phải dùng LIỀU RẤT CAO (ít nhất 9g sulbactam nguyên chất/ngày).'
    ],
    relatedDrugIds: ['ampicillin_sulbactam', 'minocycline', 'tigecycline', 'colistin', 'meropenem']
  },
  {
    id: 'mdr_acineto_flowchart',
    titleVi: 'Lưu Đồ Điều Trị Acinetobacter baumannii & Stenotrophomonas',
    subtitleVi: 'Lưu đồ điều trị CRAB và Stenotrophomonas maltophilia',
    population: 'all',
    site: 'all',
    category: 'mdr_acineto',
    pdfPage: 21,
    imageFilename: 'mdr_acineto_flowchart.png',
    summaryPointsVi: [
      'CRAB nhẹ: Đơn trị Ampicillin/Sulbactam liều cao hoặc Cefoperazone/Sulbactam.',
      'CRAB trung bình - nặng: Phối hợp 2 kháng sinh: Amp-Sulbactam liều cao + Minocycline / Polymyxin B / Tigecycline.',
      'CẢNH BÁO BVBND: Phối hợp Colistin + Meropenem liều cao truyền kéo dài KHÔNG CÓ HIỆU QUẢ trên CRAB (thử nghiệm OVERCOME và AIDA).',
      'Stenotrophomonas maltophilia: Đầu tay là Co-trimoxazole (TMP-SMX) HOẶC Minocycline HOẶC Levofloxacin. Nếu kháng: CAZ-AVI + Aztreonam hoặc Cefiderocol. TUYỆT ĐỐI KHÔNG dùng Ceftazidime đơn độc vì vi khuẩn có gen đề kháng tự nhiên (L1/L2 beta-lactamase).'
    ],
    clinicalCautionsVi: [
      'Chống chỉ định dùng Ceftazidime đơn độc cho S. maltophilia vì vi khuẩn mang gen cảm ứng L1 metallo-beta-lactamase.'
    ],
    relatedDrugIds: ['ampicillin_sulbactam', 'minocycline', 'tigecycline', 'colistin', 'cotrimoxazole', 'ceftazidime_avibactam', 'aztreonam']
  }
];

/**
 * Tìm ảnh hướng dẫn tương ứng theo vị trí nhiễm trùng và đối tượng
 */
export function getGuidelineImagesForSite(
  site: InfectionSite,
  population: Population
): { regimen?: GuidelineImageEntry; antibiogram?: GuidelineImageEntry } {
  const normSite = site === 'gastrointestinal' ? 'peritoneal' : site;
  
  const siteImages = GUIDELINE_IMAGES.filter(
    img => (img.site === normSite || img.site === site) && (img.population === population || img.population === 'all')
  );

  return {
    regimen: siteImages.find(img => img.category === 'regimen'),
    antibiogram: siteImages.find(img => img.category === 'antibiogram')
  };
}

/**
 * Tìm ảnh hướng dẫn cho vi khuẩn đa kháng
 */
export function getMdrGuidelineImages(mdrCategory: string): GuidelineImageEntry[] {
  switch (mdrCategory) {
    case 'cre':
      return GUIDELINE_IMAGES.filter(img => img.category === 'mdr_cre');
    case 'dtr_pseudo':
    case 'pseudomonas':
      return GUIDELINE_IMAGES.filter(img => img.category === 'mdr_pseudomonas');
    case 'crab':
    case 'acinetobacter':
    case 's_maltophilia':
      return GUIDELINE_IMAGES.filter(img => img.category === 'mdr_acineto');
    default:
      return GUIDELINE_IMAGES.filter(img => img.category.startsWith('mdr_'));
  }
}
