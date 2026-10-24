import { DecisionTreeDefinition } from "../types";

export const DECISION_TREES: DecisionTreeDefinition[] = [
  {
    id: 'tree-transaminases',
    title: 'Cây Quyết Định: Tăng Aminotransferase (ALT / AST)',
    subtitle: 'Lưu đồ phân tầng theo nồng độ ULN, tỷ số De Ritis và loại trừ cấp cứu suy gan cấp',
    sourceGuideline: 'ACG Clinical Guidelines 2017 & AASLD',
    rootId: 'trans-root',
    nodes: {
      'trans-root': {
        id: 'trans-root',
        label: 'Tăng ALT / AST Bất Thường',
        category: 'root',
        level: 0,
        description: 'Phát hiện ALT > 33 U/L (nam), > 25 U/L (nữ) theo chuẩn ACG 2017.',
        evidence: [
          'ALT có tính đặc hiệu cao cho gan (tế bào chất hepatocytes Zone 1-3).',
          'AST phân bố 80% trong ty thể và có cả ở cơ tim, cơ vân, thận, hồng cầu.',
          'Kiểm tra ngay dấu hiệu suy gan cấp: tri giác (bệnh não gan), dấu run vỗ cánh (asterixis), INR.'
        ],
        immediateOrders: [
          'Đo nồng độ ALT, AST kèm PT/INR và Albumin.',
          'Đánh giá tiền sử dùng thuốc trong 3 tháng gần nhất (đặc biệt Paracetamol, kháng sinh, TPCN, thảo dược).',
          'Định lượng lượng cồn tiêu thụ hàng tuần (g/tuần).'
        ],
        clinicalPearls: [
          'Không kết luận bình thường nếu ALT 30-40 U/L ở bệnh nhân có yếu tố nguy cơ chuyển hóa (MASLD) hoặc tiền sử tiếp xúc viêm gan virus.'
        ],
        childrenIds: ['trans-mild', 'trans-mod', 'trans-severe']
      },
      'trans-mild': {
        id: 'trans-mild',
        parentId: 'trans-root',
        label: 'Tăng Nhẹ / Ranh Giới (< 5x ULN)',
        category: 'decision',
        level: 1,
        condition: 'ALT hoặc AST < 5 lần ULN (thường ALT < 120 - 165 U/L)',
        description: 'Bệnh nhân ổn định, không có rối loạn đông máu hoặc suy gan cấp.',
        evidence: [
          'Nguyên nhân phổ biến nhất tại phòng khám ngoại trú: Gan thoái hóa mỡ chuyển hóa (MASLD).',
          'Viêm gan B mạn tính, Viêm gan C mạn tính.',
          'Bệnh gan do rượu (ALD), Tác dụng phụ của thuốc / TPCN.'
        ],
        immediateOrders: [
          'Bilan virus ban đầu: HBsAg, Anti-HCV (khẳng định bằng HCV RNA).',
          'Bilan chuyển hóa: Glucose đói, HbA1c, Lipid máu, BMI, Vòng bụng.',
          'Siêu âm ổ bụng tổng quát: kiểm tra cấu trúc echo gan, tĩnh mạch cửa, lách.',
          'Tính chỉ số FIB-4: Nếu < 1.30 có thể loại trừ xơ gan tiến triển với độ tin cậy >90%.'
        ],
        clinicalPearls: [
          'Nếu AST/ALT > 2:1 -> Gợi ý rất cao bệnh gan do rượu (ALD) do thiếu hụt Pyridoxal-5-phosphate.',
          'Nếu men gan vẫn tăng dai dẳng > 3 - 6 tháng không rõ nguyên nhân: làm Bilan Bậc 2 (ANA, ASMA, IgG, Sắt, Ferritin, Ceruloplasmin, Anti-tTG).'
        ],
        childrenIds: ['diag-masld', 'diag-alcohol', 'diag-viral-chronic']
      },
      'trans-mod': {
        id: 'trans-mod',
        parentId: 'trans-root',
        label: 'Tăng Vừa (5 - 15x ULN)',
        category: 'decision',
        level: 1,
        condition: 'ALT hoặc AST trong khoảng 5 - 15 lần ULN (165 - 500 U/L)',
        description: 'Tổn thương tế bào gan cấp tính hoặc đợt bùng phát cấp của bệnh gan mạn.',
        evidence: [
          'Đợt bùng phát viêm gan B/C mạn (HBV flare / HCV flare).',
          'Viêm gan tự miễn (Autoimmune Hepatitis - AIH).',
          'Tổn thương gan do thuốc (DILI) thể tế bào gan.',
          'Tắc mật thoáng qua do sỏi di chuyển (Acute Choledocholithiasis).'
        ],
        immediateOrders: [
          'Kiểm tra khẩn PT/INR để loại trừ khởi phát suy gan cấp.',
          'Huyết thanh virus cấp: IgM anti-HAV, HBsAg, IgM anti-HBc, anti-HCV kèm HCV RNA PCR.',
          'Tự miễn: ANA, ASMA (kháng thể cơ trơn), Định lượng IgG toàn phần.',
          'Siêu âm Doppler gan mật cấp cứu: kiểm tra sỏi mật và lưu thông mạch máu.'
        ],
        clinicalPearls: [
          'Sỏi mật di chuyển qua cơ vòng Oddi có thể làm ALT tăng vọt tạm thời lên 500-1000 U/L rồi giảm nhanh 50% trong 24-48 giờ tiếp theo.'
        ],
        childrenIds: ['diag-aih', 'diag-dili', 'diag-flare']
      },
      'trans-severe': {
        id: 'trans-severe',
        parentId: 'trans-root',
        label: 'Tăng Nặng (>15x ULN) & Khổng Lồ (>10,000 U/L)',
        category: 'emergency',
        level: 1,
        condition: 'ALT hoặc AST > 500 U/L, đặc biệt > 10,000 U/L',
        description: 'Hoại tử tế bào gan ồ ạt cấp tính! Nguy cơ tử vong cao nếu không can thiệp kịp thời.',
        evidence: [
          '3 nguyên nhân hàng đầu của ALT/AST > 10,000 U/L:',
          '1. Sốc gan do thiếu máu cục bộ (Ischemic hepatopathy / Shock Liver): tụt huyết áp, suy tim, sốc nhiễm trùng.',
          '2. Ngộ độc Acetaminophen (Paracetamol quá liều).',
          '3. Nấm độc Amanita phalloides hoặc virus tối cấp (HAV, HBV, HEV, HSV).'
        ],
        immediateOrders: [
          'ĐÁNH GIÁ NGUY CƠ SUY GAN CẤP (ALF): Kiểm tra ngay PT/INR và Tri giác. Nếu INR ≥ 1.5 + Bệnh não gan -> Kích hoạt ngay quy trình hội chẩn khẩn cấp trung tâm ghép gan!',
          'Định lượng nồng độ Paracetamol huyết thanh và dùng ngay N-Acetylcysteine (NAC) tĩnh mạch nếu có nghi ngờ.',
          'Hồi sức huyết động tích cực: nâng huyết áp động mạch trung bình (MAP > 65 mmHg) để khôi phục tưới máu gan.'
        ],
        clinicalPearls: [
          'Trong Sốc gan (Shock liver), AST thường tăng cao hơn ALT và LDH tăng vọt gấp hàng chục lần. Khi tưới máu được khôi phục, men gan giảm nhanh 50% mỗi 24 giờ.',
          'CẢNH BÁO: Men gan tụt giảm đột ngột nhưng Bilirubin và INR tiếp tục tăng vọt là dấu hiệu cạn kiệt tế bào gan (hoại tử toàn bộ) chứ không phải hồi phục!'
        ],
        warning: 'CẤP CỨU HỒI SỨC / GHÉP GAN: Kích hoạt quy trình ALF nếu INR ≥ 1.5 kèm rối loạn tri giác!',
        childrenIds: ['diag-shock-liver', 'diag-apap', 'diag-alf']
      },
      // Diagnoses
      'diag-masld': {
        id: 'diag-masld',
        parentId: 'trans-mild',
        label: 'Gan Thoái Hóa Mỡ Chuyển Hóa (MASLD)',
        category: 'diagnosis',
        level: 2,
        description: 'Chẩn đoán xác định khi có tăng men gan + bằng chứng mỡ hóa trên siêu âm + có yếu tố nguy cơ tim mạch/chuyển hóa (béo phì, đái tháo đường, rối loạn lipid).',
        evidence: ['De Ritis AST/ALT < 1', 'Không tiêu thụ rượu mức độc hại', 'FIB-4 đánh giá giai đoạn xơ hóa'],
        immediateOrders: ['Đo độ đàn hồi thoáng qua (FibroScan / VCTE)', 'Tối ưu hóa lối sống, giảm 7-10% trọng lượng cơ thể'],
        clinicalPearls: ['FIB-4 < 1.30: Theo dõi tại y tế cơ sở mỗi 1-2 năm. FIB-4 > 2.67: Chuyển khám chuyên khoa Gan Mật.']
      },
      'diag-alcohol': {
        id: 'diag-alcohol',
        parentId: 'trans-mild',
        label: 'Bệnh Gan Do Rượu (ALD)',
        category: 'diagnosis',
        level: 2,
        description: 'Uống rượu > 140g/tuần (nữ) hoặc > 210g/tuần (nam) kèm tỷ số De Ritis đặc trưng.',
        evidence: ['Tỷ số AST/ALT ≥ 2:1', 'AST thường < 300 - 400 U/L', 'GGT tăng cao đồng thời, MCV hồng cầu to'],
        immediateOrders: ['Ngưng rượu bia tuyệt đối', 'Bổ sung Thiamine (Vitamin B1) trước khi truyền glucose để phòng Wernicke'],
        clinicalPearls: ['AST tăng ưu thế do cồn gây tổn thương trực tiếp màng ty thể Zone 3 và làm suy giảm Pyridoxal-5-phosphate (coenzyme của ALT).']
      },
      'diag-viral-chronic': {
        id: 'diag-viral-chronic',
        parentId: 'trans-mild',
        label: 'Viêm Gan Virus Mạn Tính (HBV / HCV)',
        category: 'diagnosis',
        level: 2,
        description: 'Nhiễm virus dai dẳng > 6 tháng.',
        evidence: ['HBsAg (+) hoặc HCV RNA (+)', 'Men gan biến thiên từng đợt'],
        immediateOrders: ['Định lượng HBV DNA / HCV RNA', 'Xét nghiệm HBeAg, Anti-HBe, Tầm soát ung thư gan HCC bằng AFP + Siêu âm mỗi 6 tháng'],
        clinicalPearls: ['Viêm gan C hiện nay có thể chữa khỏi hoàn toàn >95% bằng thuốc DAA uống trong 8-12 tuần.']
      },
      'diag-aih': {
        id: 'diag-aih',
        parentId: 'trans-mod',
        label: 'Viêm Gan Tự Miễn (AIH)',
        category: 'diagnosis',
        level: 2,
        description: 'Tế bào lympho T tấn công tế bào gan, thường gặp ở nữ giới.',
        evidence: ['ANA (+) và/hoặc ASMA (+) hiệu giá cao', 'IgG toàn phần huyết thanh tăng > 1.2 - 1.5 lần bình thường'],
        immediateOrders: ['Sinh thiết gan chẩn đoán (viêm quanh khoảng cửa thâm nhiễm tương bào - Interface hepatitis)', 'Hội chẩn điều trị Corticosteroid (Prednisolone) + Azathioprine'],
        clinicalPearls: ['Đáp ứng nhanh chóng với ức chế miễn dịch là bằng chứng xác nhận chẩn đoán AIH quan trọng.']
      },
      'diag-dili': {
        id: 'diag-dili',
        parentId: 'trans-mod',
        label: 'Tổn Thương Gan Do Thuốc (DILI)',
        category: 'diagnosis',
        level: 2,
        description: 'Xuất hiện sau khi dùng thuốc 5 - 90 ngày, loại trừ các nguyên nhân khác.',
        evidence: ['R-ratio > 5 (thể hoại tử tế bào gan)', 'Điểm Roussel Uclaf (RUCAM) cao'],
        immediateOrders: ['Ngưng ngay lập tức toàn bộ các thuốc, TPCN, thảo dược nghi ngờ', 'Theo dõi men gan mỗi tuần đến khi hồi phục'],
        clinicalPearls: ['Amoxicillin-clavulanate là nguyên nhân DILI phổ biến nhất trên thế giới.']
      },
      'diag-flare': {
        id: 'diag-flare',
        parentId: 'trans-mod',
        label: 'Đợt Bùng Phát Viêm Gan B Mạn (HBV Flare)',
        category: 'diagnosis',
        level: 2,
        description: 'Virus tái hoạt động do suy giảm miễn dịch, hóa trị hoặc ngưng thuốc kháng virus đột ngột.',
        evidence: ['HBsAg (+), HBV DNA tăng vọt', 'IgM anti-HBc có thể dương tính hiệu giá thấp'],
        immediateOrders: ['Khởi trị ngay Entecavir hoặc Tenofovir (TDF/TAF)', 'Theo dõi sát INR để phòng suy gan cấp trên nền mạn (ACLF)'],
        clinicalPearls: ['Bắt buộc dự phòng thuốc kháng virus trước khi hóa trị hoặc điều trị ức chế miễn dịch ở người có HBsAg(+).']
      },
      'diag-shock-liver': {
        id: 'diag-shock-liver',
        parentId: 'trans-severe',
        label: 'Sốc Gan / Viêm Gan Thiếu Máu Cục Bộ (Ischemic Hepatopathy)',
        category: 'emergency',
        level: 2,
        description: 'Giảm tưới máu gan cấp tính do tụt huyết áp, sốc tim, sốc nhiễm trùng hoặc suy hô hấp nặng.',
        evidence: ['AST & ALT tăng vọt lên > 10,000 U/L', 'LDH tăng cực cao (tỷ số ALT/LDH < 1.5)', 'Tụt giảm men gan 50% mỗi 24-48 giờ sau khi huyết động ổn định'],
        immediateOrders: ['Hồi sức huyết động khẩn cấp, bù dịch, thuốc vận mạch nâng MAP > 65 mmHg', 'Siêu âm tim đánh giá chức năng thất trái'],
        clinicalPearls: ['Tế bào gan Zone 3 (quanh tĩnh mạch trung tâm) nhạy cảm nhất với thiếu oxy và hoại tử trước tiên.']
      },
      'diag-apap': {
        id: 'diag-apap',
        parentId: 'trans-severe',
        label: 'Ngộ Độc Paracetamol (Acetaminophen Overdose)',
        category: 'emergency',
        level: 2,
        description: 'Chất chuyển hóa NAPQI làm cạn kiệt Glutathione tế bào gan dẫn đến hoại tử ồ ạt.',
        evidence: ['Uống > 7.5 - 10g Paracetamol (hoặc liều thấp hơn ở người nghiện rượu, suy dinh dưỡng)', 'Nồng độ Paracetamol huyết thanh vượt đường cong Rumack-Matthew'],
        immediateOrders: ['Truyền ngay N-Acetylcysteine (NAC) tĩnh mạch càng sớm càng tốt', 'Kiểm tra khí máu động mạch, toan chuyển hóa, lactate máu'],
        clinicalPearls: ['Hiệu quả giải độc tối đa khi dùng NAC trong vòng 8 giờ đầu sau uống, nhưng vẫn có lợi ích rõ rệt kể cả khi dùng muộn.']
      },
      'diag-alf': {
        id: 'diag-alf',
        parentId: 'trans-severe',
        label: 'Suy Gan Cấp (Acute Liver Failure - ALF)',
        category: 'emergency',
        level: 2,
        description: 'Tổn thương gan cấp tính kèm rối loạn đông máu (INR ≥ 1.5) và rối loạn tri giác (bệnh não gan) ở người không có bệnh gan mạn trước đó.',
        evidence: ['INR ≥ 1.5', 'Bệnh não gan (từ lú lẫn, mất định hướng đến hôn mê)', 'Diễn tiến nhanh < 26 tuần'],
        immediateOrders: ['Liên hệ khẩn cấp Đơn vị Hồi Sức Tích Cực (ICU) & Trung Tâm Ghép Gan', 'Đặt nội khí quản bảo vệ đường thở nếu hôn mê (Grade III/IV)', 'Theo dõi áp lực nội sọ phòng phù não'],
        clinicalPearls: ['Ghép gan cấp cứu là phương pháp cứu sống duy nhất khi thất bại với hồi sức tích cực theo tiêu chuẩn King\'s College.']
      }
    },
    mermaidCode: `graph TD
  A[Tăng Aminotransferase ALT/AST] --> B{Mức độ bội số ULN}
  B -->|<5x ULN Nhẹ| C[Đánh giá De Ritis AST/ALT]
  B -->|5-15x ULN Vừa| D[Khảo sát Virus Cấp / Tự Miễn / DILI]
  B -->|>15x ULN Nặng/Khổng Lồ| E[CẤP CỨU: Sốc Gan, Ngộ Độc APAP, Suy Gan Cấp]

  C -->|AST/ALT < 1| C1[MASLD / Viêm gan virus B, C mạn]
  C -->|AST/ALT >= 2| C2[Bệnh gan do rượu ALD / Xơ gan]

  D --> D1[HBsAg, IgM anti-HBc, Anti-HCV, HCV RNA]
  D --> D2[Tự miễn: ANA, ASMA, IgG toàn phần]
  D --> D3[DILI: Rà soát tiền sử thuốc trong 3 tháng]

  E --> E1[Định lượng Paracetamol + Truyền NAC ngay]
  E --> E2[Kiểm tra INR & Bệnh não gan -> Báo động ALF!]
  E --> E3[Sốc gan: Hồi phục huyết động khẩn cấp MAP > 65mmHg]`
  },
  {
    id: 'tree-cholestasis',
    title: 'Cây Quyết Định: Tăng Men Ứ Mật (ALP & GGT)',
    subtitle: 'Xác nhận nguồn gốc gan mật, siêu âm phân định tắc ngoài gan và ứ mật trong gan',
    sourceGuideline: 'ACG Guideline 2017 & EASL',
    rootId: 'alp-root',
    nodes: {
      'alp-root': {
        id: 'alp-root',
        label: 'Tăng Phosphatase Kiềm (ALP)',
        category: 'root',
        level: 0,
        description: 'ALP tăng cao trong khi các men khác có thể bình thường hoặc tăng nhẹ.',
        evidence: [
          'ALP phân bố ở màng vi quản mật của tế bào gan, nhưng cũng có dồi dào ở mô xương, nhau thai, ruột non.',
          'Bước 1 bắt buộc: Khẳng định ALP có nguồn gốc từ gan mật hay ngoài gan.'
        ],
        immediateOrders: [
          'Xét nghiệm ngay GGT (Gamma-Glutamyl Transferase) hoặc 5\'-Nucleotidase.'
        ],
        clinicalPearls: [
          'GGT không có trong mô xương. GGT bình thường loại trừ chắc chắn nguồn gốc gan mật của ALP!'
        ],
        childrenIds: ['alp-nonhepatic', 'alp-hepatic']
      },
      'alp-nonhepatic': {
        id: 'alp-nonhepatic',
        parentId: 'alp-root',
        label: 'GGT Bình Thường: Nguồn Gốc Ngoài Gan',
        category: 'decision',
        level: 1,
        condition: 'ALP tăng nhưng GGT hoàn toàn bình thường',
        description: 'ALP xuất phát từ xương, thai kỳ hoặc sinh lý đang phát triển.',
        evidence: [
          'Bệnh lý xương: Bệnh Paget xương, Di căn xương (ung thư tiền liệt tuyến, vú), Nhuyễn xương do thiếu Vitamin D.',
          'Sinh lý: Phụ nữ mang thai 3 tháng cuối (ALP nhau thai), Trẻ em / thanh thiếu niên tuổi dậy thì (tạo xương).'
        ],
        immediateOrders: [
          'Định lượng Canxi, Phospho, 25-OH Vitamin D, PTH.',
          'X-quang hoặc Xạ hình xương nếu nghi ngờ u di căn.'
        ],
        clinicalPearls: [
          'Không cần làm siêu âm gan hay chụp CT bụng tốn kém khi GGT hoàn toàn bình thường.'
        ]
      },
      'alp-hepatic': {
        id: 'alp-hepatic',
        parentId: 'alp-root',
        label: 'GGT Tăng Đồng Thời: Khẳng Định Ứ Mật Gan',
        category: 'decision',
        level: 1,
        condition: 'Cả ALP và GGT cùng tăng cao',
        description: 'Xác định chắc chắn có ứ mật (Cholestasis). Chuyển sang Bước 2: Khảo sát hình ảnh học đường mật.',
        evidence: [
          'GGT gắn trên màng tế bào biểu mô đường mật và vi quản mật.',
          'Tổn thương đường mật kích thích tổng hợp và bài tiết ồ ạt ALP và GGT vào máu.'
        ],
        immediateOrders: [
          'Chỉ định ngay Siêu âm ổ bụng (USG Abdomen) khảo sát đường kính đường mật trong và ngoài gan.'
        ],
        clinicalPearls: [
          'Đường mật dãn: Ứ mật ngoài gan (Cơ học).',
          'Đường mật không dãn: Ứ mật trong gan (Nhu mô hoặc tự miễn).'
        ],
        childrenIds: ['bili-dilated-node', 'bili-nondilated-node']
      },
      'bili-dilated-node': {
        id: 'bili-dilated-node',
        parentId: 'alp-hepatic',
        label: 'Đường Mật Dãn: Tắc Mật Ngoài Gan',
        category: 'decision',
        level: 2,
        condition: 'Ống mật chủ > 6-7 mm (ở người còn túi mật) hoặc dãn đường mật trong gan',
        description: 'Tắc nghẽn cơ học dòng chảy dịch mật ngoài gan.',
        evidence: [
          'Sỏi ống mật chủ (Choledocholithiasis) - Phổ biến nhất.',
          'Khối u đầu tụy, u bóng Vater, ung thư đường mật (Cholangiocarcinoma / U Klatskin).',
          'Hẹp đường mật sau phẫu thuật cắt túi mật.'
        ],
        immediateOrders: [
          'Chụp cộng hưởng từ mật tụy (MRCP) hoặc CT ngực bụng cản quang.',
          'Nội soi mật tụy ngược dòng (ERCP) để lấy sỏi hoặc đặt stent giải áp.',
          'Khám tam chứng Charcot (Đau + Sốt + Vàng da) để phát hiện Viêm đường mật cấp.'
        ],
        clinicalPearls: [
          'Viêm đường mật cấp nhiễm trùng kèm sốc nhiễm trùng (Ngũ chứng Reynolds) là cấp cứu ngoại khoa tối khẩn!'
        ],
        childrenIds: ['diag-choledo', 'diag-tumor']
      },
      'bili-nondilated-node': {
        id: 'bili-nondilated-node',
        parentId: 'alp-hepatic',
        label: 'Đường Mật Không Dãn: Ứ Mật Trong Gan',
        category: 'decision',
        level: 2,
        condition: 'Nhu mô gan đồng nhất, không có bằng chứng dãn đường mật trên siêu âm',
        description: 'Tổn thương các đường mật nhỏ nội tại hoặc tổn thương vận chuyển muối mật ở màng tế bào.',
        evidence: [
          'Viêm đường mật tiên phát (Primary Biliary Cholangitis - PBC): Nữ giới trung niên, ngứa da.',
          'Viêm xơ đường mật tiên phát (Primary Sclerosing Cholangitis - PSC): Thường đi kèm Viêm loét đại tràng (IBD).',
          'DILI thể ứ mật (Amoxicillin-clavulanate, Anabolic steroid, Thuốc tránh thai).',
          'Ứ mật thai kỳ (Intrahepatic Cholestasis of Pregnancy - ICP).'
        ],
        immediateOrders: [
          'Xét nghiệm Kháng thể kháng ty thể (AMA) để chẩn đoán PBC.',
          'Chụp MRCP tìm hình ảnh hẹp dãn chuỗi hạt của PSC.',
          'Xét nghiệm Axit mật toàn phần huyết thanh (Total Bile Acids).'
        ],
        clinicalPearls: [
          'Bộ ba: Phụ nữ trung niên + Ngứa da dai dẳng + ALP tăng + AMA (+) -> Chẩn đoán xác định PBC mà không cần sinh thiết gan. Khởi trị ngay UDCA 13-15 mg/kg/ngày.'
        ],
        childrenIds: ['diag-pbc', 'diag-psc']
      },
      'diag-choledo': {
        id: 'diag-choledo',
        parentId: 'bili-dilated-node',
        label: 'Sỏi Ống Mật Chủ (Choledocholithiasis)',
        category: 'diagnosis',
        level: 3,
        description: 'Sỏi kẹt tại đoạn thấp OMC gây tắc nghẽn cơ học cấp/bán cấp.',
        evidence: ['Đau quặn gan hạ sườn phải, vàng da, sốt', 'Bilirubin trực tiếp tăng cao'],
        immediateOrders: ['Can thiệp ERCP lấy sỏi + Cắt cơ vòng Oddi', 'Kháng sinh phổ rộng nếu có sốt (Ceftriaxone + Metronidazole)'],
        clinicalPearls: ['Nội soi siêu âm (EUS) có độ nhạy >95% phát hiện sỏi bùn kích thước nhỏ < 3mm mà siêu âm thường bỏ sót.']
      },
      'diag-tumor': {
        id: 'diag-tumor',
        parentId: 'bili-dilated-node',
        label: 'Khối U Đầu Tụy / Ung Thư Đường Mật',
        category: 'diagnosis',
        level: 3,
        description: 'Tắc mật không đau (Painless Jaundice), sút cân, túi mật to không đau (Dấu Courvoisier).',
        evidence: ['Tuổi cao, Bilirubin tăng vọt liên tục', 'Chất chỉ điểm CA 19-9 tăng cao'],
        immediateOrders: ['CT bụng đa dãy có tiêm thuốc cản quang (Pancreas protocol)', 'Đặt stent đường mật dẫn lưu giải áp'],
        clinicalPearls: ['Vàng da tắc mật tiến triển không đau ở người trên 60 tuổi phải luôn nghĩ đến u đầu tụy cho đến khi có bằng chứng ngược lại.']
      },
      'diag-pbc': {
        id: 'diag-pbc',
        parentId: 'bili-nondilated-node',
        label: 'Viêm Đường Mật Tiên Phát (PBC)',
        category: 'diagnosis',
        level: 3,
        description: 'Bệnh tự miễn mạn tính phá hủy các ống mật nhỏ gian tiểu thùy.',
        evidence: ['ALP > 1.5x ULN', 'Kháng thể AMA (+) ở >95% bệnh nhân', 'Kháng thể ANA thể Sp100/gp210'],
        immediateOrders: ['Khởi trị ngay Ursodeoxycholic acid (UDCA)', 'Tầm soát loãng xương bằng đo mật độ xương DEXA'],
        clinicalPearls: ['UDCA làm chậm tiến triển xơ gan và cải thiện ngoạn mục thời gian sống thêm không cần ghép gan.']
      },
      'diag-psc': {
        id: 'diag-psc',
        parentId: 'bili-nondilated-node',
        label: 'Viêm Xơ Đường Mật Tiên Phát (PSC)',
        category: 'diagnosis',
        level: 3,
        description: 'Viêm xơ hóa tiến triển phá hủy toàn bộ hệ thống đường mật trong và ngoài gan.',
        evidence: ['70-80% bệnh nhân có kèm Viêm loét đại tràng (IBD)', 'Hình ảnh chuỗi hạt (Beading appearance) trên MRCP', 'Kháng thể AMA âm tính'],
        immediateOrders: ['Nội soi đại trực tràng toàn bộ tầm soát IBD', 'Tầm soát ung thư đường mật hàng năm bằng MRCP + CA 19-9'],
        clinicalPearls: ['Nguy cơ cao tiến triển thành ung thư đường mật (Cholangiocarcinoma) và ung thư đại tràng.']
      }
    },
    mermaidCode: `graph TD
  A[Tăng Phosphatase Kiềm ALP] --> B{Kiểm tra GGT hoặc 5'-NT}
  B -->|GGT Bình Thường| C[Nguồn Gốc Xương / Nhau Thai / Tuổi Dậy Thì]
  B -->|GGT Tăng Cao| D[Khẳng Định Ứ Mật Gan Mật]

  D --> E{Siêu Âm Ổ Bụng USG}
  E -->|Đường Mật Dãn| F[TẮC MẬT NGOÀI GAN: Sỏi OMC, U Đầu Tụy, U Đường Mật]
  E -->|Đường Mật Không Dãn| G[Ứ MẬT TRONG GAN: PBC, PSC, DILI, Thai Kỳ]

  F --> F1[Chỉ định MRCP hoặc can thiệp ERCP]
  G --> G1[Kháng thể AMA: Chẩn đoán PBC]
  G --> G2[MRCP: Tìm hình ảnh chuỗi hạt chẩn đoán PSC]`
  },
  {
    id: 'tree-bilirubin',
    title: 'Cây Quyết Định: Vàng Da & Tăng Bilirubin',
    subtitle: 'Phân đoạn Bilirubin Trực tiếp (liên hợp) vs Gián tiếp (tự do) và lưu đồ chẩn đoán',
    sourceGuideline: 'WHO Training Manual Session 4 & ACG',
    rootId: 'bili-root',
    nodes: {
      'bili-root': {
        id: 'bili-root',
        label: 'Vàng Da / Tăng Bilirubin (>1.2 mg/dL)',
        category: 'root',
        level: 0,
        description: 'Sắc tố mật lắng đọng ở kết mạc mắt (khi TBil > 2-3 mg/dL) và da (khi TBil > 4-5 mg/dL).',
        evidence: [
          'Bước tối quan trọng: Phân đoạn Bilirubin Trực Tiếp (Direct / Conjugated) và Bilirubin Toàn Phần (Total Bilirubin).',
          'Xác định tỷ lệ phần trăm liên hợp: % Liên hợp = (Direct / Total) * 100.'
        ],
        immediateOrders: [
          'Đo nồng độ Total Bilirubin và Direct Bilirubin.',
          'Xét nghiệm men gan toàn bộ: ALT, AST, ALP, GGT.',
          'Kiểm tra màu sắc nước tiểu và phân.'
        ],
        clinicalPearls: [
          'Bilirubin gián tiếp không tan trong nước -> Không thải qua nước tiểu -> Nước tiểu màu bình thường.',
          'Bilirubin trực tiếp tan trong nước -> Thải qua nước tiểu -> Nước tiểu vàng sẫm sủi bọt vàng (Bilirubinuria).'
        ],
        childrenIds: ['bili-unconj-branch', 'bili-conj-branch']
      },
      'bili-unconj-branch': {
        id: 'bili-unconj-branch',
        parentId: 'bili-root',
        label: 'Ưu Thế Bilirubin Gián Tiếp / Tự Do (<20% liên hợp)',
        category: 'decision',
        level: 1,
        condition: 'Bilirubin trực tiếp chiếm < 20% tổng lượng',
        description: 'Tăng sản xuất Bilirubin quá mức hoặc suy giảm quá trình thu nhận / liên hợp tại gan.',
        evidence: [
          'Tán huyết (Hemolysis): Hồng cầu bị vỡ ồ ạt vượt quá khả năng liên hợp của gan.',
          'Hội chứng Gilbert: Đột biến gen UGT1A1 làm giảm 70% hoạt tính men Glucuronosyltransferase.',
          'Hội chứng Crigler-Najjar (rất hiếm, thường phát hiện từ sơ sinh).'
        ],
        immediateOrders: [
          'Bilan tán huyết: Tổng phân tích tế bào máu, Hồng cầu lưới, Haptoglobin, LDH, Nghiệm pháp Coombs.',
          'Nếu men gan ALT, AST, ALP bình thường và KHÔNG có tán huyết -> Chẩn đoán Hội chứng Gilbert.'
        ],
        clinicalPearls: [
          'Hội chứng Gilbert là một biến thể di truyền hoàn toàn lành tính, tuổi thọ bình thường, không bao giờ tiến triển thành xơ gan hay suy gan!'
        ],
        childrenIds: ['diag-gilbert', 'diag-hemolysis']
      },
      'bili-conj-branch': {
        id: 'bili-conj-branch',
        parentId: 'bili-root',
        label: 'Ưu Thế Bilirubin Trực Tiếp / Liên Hợp (>50% liên hợp)',
        category: 'decision',
        level: 1,
        condition: 'Bilirubin trực tiếp chiếm > 50% tổng lượng',
        description: 'Bằng chứng chắc chắn của bệnh lý tế bào gan hoặc tắc nghẽn đường dẫn mật.',
        evidence: [
          'Bệnh lý tế bào gan: Viêm gan cấp, viêm gan do rượu, xơ gan mất bù.',
          'Bệnh lý tắc mật: Sỏi OMC, u đầu tụy, viêm đường mật.',
          'Rối loạn bài tiết mật bẩm sinh hiếm gặp: Dubin-Johnson, Rotor (men gan bình thường).'
        ],
        immediateOrders: [
          'Siêu âm ổ bụng ngay để loại trừ tắc nghẽn cơ học đường mật.',
          'So sánh R-ratio và men gan để phân định Tổn thương tế bào gan vs Tổn thương ứ mật.'
        ],
        clinicalPearls: [
          'Nếu Bilirubin > 30 mg/dL: Thường phối hợp giữa bệnh gan nặng + suy thận (giảm thải trừ qua nước tiểu) hoặc tán huyết đi kèm.'
        ],
        childrenIds: ['diag-hepatocellular-bili', 'diag-cholestatic-bili']
      },
      'diag-gilbert': {
        id: 'diag-gilbert',
        parentId: 'bili-unconj-branch',
        label: 'Hội Chứng Gilbert (Gilbert Syndrome)',
        category: 'diagnosis',
        level: 2,
        description: 'Bilirubin toàn phần thường tăng nhẹ (1.5 - 3.5 mg/dL), tăng rõ khi nhịn ăn, mất ngủ, nhiễm trùng, stress.',
        evidence: ['Men gan ALT, AST, ALP, GGT hoàn toàn bình thường', 'Không có tán huyết', 'Chỉ chiếm ưu thế gián tiếp'],
        immediateOrders: ['Trấn an bệnh nhân, không cần điều trị bằng thuốc', 'Tránh nhịn ăn kéo dài và kiệt sức'],
        clinicalPearls: ['Người mắc hội chứng Gilbert có nồng độ chất chống oxy hóa bilirubin cao, thậm chí có nguy cơ bệnh tim mạch xơ vữa thấp hơn người bình thường.']
      },
      'diag-hemolysis': {
        id: 'diag-hemolysis',
        parentId: 'bili-unconj-branch',
        label: 'Tán Huyết (Hemolytic Jaundice)',
        category: 'diagnosis',
        level: 2,
        description: 'Vỡ hồng cầu nội mạch hoặc ngoại mạch.',
        evidence: ['Thiếu máu, Haptoglobin giảm mạnh', 'LDH tăng cao', 'Hồng cầu lưới tăng > 2%'],
        immediateOrders: ['Hội chẩn chuyên khoa Huyết học', 'Kiểm tra thiếu men G6PD, Bệnh lý huyết sắc tố Thalassemia, Test Coombs'],
        clinicalPearls: ['Lách to thường đi kèm trong tán huyết mạn tính di truyền (như Hereditary Spherocytosis).']
      },
      'diag-hepatocellular-bili': {
        id: 'diag-conj-branch',
        parentId: 'bili-conj-branch',
        label: 'Tổn Thương Tế Bào Gan Nặng / Xơ Gan Mất Bù',
        category: 'diagnosis',
        level: 2,
        description: 'Khả năng bài tiết bilirubin của tế bào gan bị tê liệt.',
        evidence: ['ALT / AST tăng cao', 'Albumin giảm, INR kéo dài', 'Dấu sao mạch, lòng bàn tay son, cổ trướng'],
        immediateOrders: ['Bilan virus, rượu, tự miễn', 'Tính điểm MELD và Child-Pugh'],
        clinicalPearls: ['Vàng da ở bệnh nhân xơ gan mất bù là chỉ điểm tiên lượng nặng, cần theo dõi hội chứng gan thận.']
      },
      'diag-cholestatic-bili': {
        id: 'diag-cholestatic-bili',
        parentId: 'bili-conj-branch',
        label: 'Vàng Da Tắc Mật Cơ Học (Obstructive Jaundice)',
        category: 'diagnosis',
        level: 2,
        description: 'Mật bị chặn dòng chảy tràn ngược vào xoang mao mạch gan.',
        evidence: ['ALP và GGT tăng rất cao', 'Phân bạc màu (Acholic stool), nước tiểu sẫm màu', 'Ngứa da toàn thân do lắng đọng muối mật'],
        immediateOrders: ['Siêu âm khẩn tìm vị trí tắc', 'Chụp MRCP hoặc can thiệp ERCP'],
        clinicalPearls: ['Phân bạc màu như phân cò là dấu hiệu chỉ điểm tắc mật hoàn toàn (thường do u bóng Vater hoặc đầu tụy).']
      }
    },
    mermaidCode: `graph TD
  A[Vàng Da / Tăng Bilirubin] --> B{Phân đoạn Bilirubin}
  B -->|<20% Liên Hợp Gián Tiếp| C[Bilan Tán Huyết & Gilbert]
  B -->|>50% Liên Hợp Trực Tiếp| D[Bệnh Lý Gan Hoặc Tắc Đường Mật]

  C -->|Haptoglobin Giảm, LDH Tăng| C1[Tán Huyết: Huyết học, Coombs]
  C -->|Men Gan Bình Thường, Không Tán Huyết| C2[Hội Chứng Gilbert Lành Tính]

  D --> E{Siêu Âm Gan Mật}
  E -->|Đường Mật Dãn| D1[Tắc Mật Cơ Học: Sỏi OMC, U Tụy, U Đường Mật]
  E -->|Đường Mật Không Dãn| D2[Tổn Thương Nhu Mô Gan Nặng / Xơ Gan Mất Bù]`
  },
  {
    id: 'tree-deritis',
    title: 'Cây Quyết Định: Tỷ Số De Ritis (AST / ALT)',
    subtitle: 'Động học bào tương vs ty thể, phân tầng bệnh lý và cảnh báo tiêu cơ vân ngoài gan theo Sikaris (2013)',
    sourceGuideline: 'Clin Biochem Rev 2013; 34:117-130 & ACG Guidelines 2017',
    rootId: 'deritis-root',
    nodes: {
      'deritis-root': {
        id: 'deritis-root',
        label: 'Tỷ Số De Ritis (AST / ALT)',
        category: 'root',
        level: 0,
        description: 'Tỷ số kinh điển Fernando De Ritis (1957) phân biệt tổn thương ty thể (AST) và bào tương (ALT).',
        evidence: [
          'ALT chỉ có ở bào tương (cytosol), t½ ~47h (thanh thải chậm).',
          'AST 80% nằm trong ty thể (mAST), t½ ~17h (thanh thải nhanh qua thụ thể mannose ở xoang gan).',
          'AST có nồng độ rất cao ở cơ tim (7800 U/g) và cơ vân (5000 U/g) so với ALT chỉ 300 U/g.'
        ],
        immediateOrders: [
          'Tính chính xác tỷ số AST / ALT.',
          'Kiểm tra Creatine Kinase (CK) nếu AST tăng vượt trội so với ALT.',
          'Khai thác lượng rượu uống (g/tuần) và tiền sử bệnh gan mạn.'
        ],
        clinicalPearls: [
          'Ở người khỏe mạnh bình thường, tỷ số De Ritis dao động từ 0.7 đến 1.0 (trung bình ~0.8).'
        ],
        childrenIds: ['deritis-low-node', 'deritis-trans-node', 'deritis-high-node', 'deritis-extra-node']
      },
      'deritis-low-node': {
        id: 'deritis-low-node',
        parentId: 'deritis-root',
        label: 'Tỷ Số < 1.0 (Ưu Thế ALT / Bào Tương)',
        category: 'decision',
        level: 1,
        condition: 'AST < ALT (thường dao động 0.4 - 0.8)',
        description: 'Tổn thương rò rỉ màng tế bào gan cấp tính hoặc thoái hóa mỡ sớm.',
        evidence: [
          'Viêm gan virus cấp (HAV, HBV, HCV, HEV): ALT ưu thế rõ rệt do rò rỉ bào tương và t½ kéo dài.',
          'Bệnh gan nhiễm mỡ chuyển hóa (MASLD) giai đoạn đầu chưa có xơ hóa nặng.',
          'Tắc mật cấp tính trong 24 giờ đầu.'
        ],
        immediateOrders: [
          'Bilan virus: HBsAg, anti-HCV, IgM anti-HAV.',
          'Siêu âm bụng đánh giá độ nhiễm mỡ gan.',
          'Theo dõi động học men gan: ALT giảm chậm hơn AST khi hồi phục.'
        ],
        clinicalPearls: [
          'Nếu trong viêm gan virus cấp mà De Ritis đột ngột đảo ngược > 1.5 - 2.0: Báo hiệu hoại tử ty thể diện rộng và nguy cơ bùng phát suy gan cấp!'
        ],
        childrenIds: ['diag-deritis-viral', 'diag-deritis-masld']
      },
      'deritis-trans-node': {
        id: 'deritis-trans-node',
        parentId: 'deritis-root',
        label: 'Đảo Ngược Tỷ Số: De Ritis Vượt Ngưỡng > 1.0',
        category: 'decision',
        level: 1,
        condition: 'AST vượt qua ALT trong bệnh gan mạn tính',
        description: 'Dấu hiệu nhạy cảm của xơ hóa gan tiến triển (F3) và xơ gan (F4).',
        evidence: [
          'Suy giảm thanh thải AST do tế bào nội mô xoang gan bị xơ hóa phá hủy.',
          'Tổn thương sâu vào ty thể giải phóng mAST.',
          'Mô gan xơ teo làm giảm khả năng tổng hợp ALT mới.'
        ],
        immediateOrders: [
          'Tính ngay thang điểm không xâm lấn FIB-4 và APRI.',
          'Đo độ đàn hồi mô gan (FibroScan / VCTE).',
          'Nội soi thực quản tầm soát giãn tĩnh mạch nếu xơ gan.'
        ],
        clinicalPearls: [
          'Tỷ số AST/ALT > 1.0 ở bệnh nhân viêm gan C hoặc MASLD có giá trị dự báo xơ gan với độ đặc hiệu >90%.'
        ],
        childrenIds: ['diag-deritis-cirrhosis']
      },
      'deritis-high-node': {
        id: 'deritis-high-node',
        parentId: 'deritis-root',
        label: 'Tỷ Số ≥ 2.0 (Ưu Thế AST Kinh Điển)',
        category: 'decision',
        level: 1,
        condition: 'AST / ALT ≥ 2.0 (AST thường < 400 U/L)',
        description: 'Đặc trưng kinh điển của Bệnh gan do rượu hoặc Bệnh Wilson thể bùng phát.',
        evidence: [
          'Cồn gây độc trực tiếp màng ty thể làm giải phóng mAST.',
          'Thiếu hụt Pyridoxal-5-phosphate (Vitamin B6) làm ức chế tổng hợp ALT nhiều hơn AST.',
          'Bệnh Wilson: Đồng tích tụ phá hủy ty thể và gây tán huyết Coombs âm tính.'
        ],
        immediateOrders: [
          'Tính điểm Maddrey DF nếu vàng da nặng (DF ≥ 32: chỉ định Corticoid).',
          'Kiểm tra Ceruloplasmin, đồng niệu 24h, khám mắt tìm vòng Kayser-Fleischer nếu tuổi < 55.',
          'Bổ sung Vitamin B1 (Thiamine) và Vitamin B6.'
        ],
        clinicalPearls: [
          'Trong viêm gan rượu, AST hiếm khi > 400 U/L và ALT hiếm khi > 200 U/L.'
        ],
        childrenIds: ['diag-deritis-alcohol', 'diag-deritis-wilson']
      },
      'deritis-extra-node': {
        id: 'deritis-extra-node',
        parentId: 'deritis-root',
        label: 'De Ritis Cực Cao: Nguồn Gốc Ngoài Gan (Cơ Vân)',
        category: 'emergency',
        level: 1,
        condition: 'AST >> ALT (tỷ số 3 - 6), CK tăng vọt',
        description: 'Tổn thương cơ vân, tiêu cơ vân hoặc Macro-AST, gan không phải cơ quan bệnh nguyên.',
        evidence: [
          'Cơ vân chứa 5000 U/g AST nhưng chỉ chứa 300 U/g ALT (tỷ lệ 17:1).',
          'Tiêu cơ vân (Rhabdomyolysis) do chạy marathon, tập gym quá mức, chấn thương, co giật.',
          'Hội chứng Macro-AST (IgG gắn AST làm giảm thanh thải).'
        ],
        immediateOrders: [
          'Định lượng Creatine Kinase (CK) toàn phần khẩn cấp.',
          'Myoglobin niệu, tổng phân tích nước tiểu, theo dõi chức năng thận và Kali máu.',
          'Truyền dịch bù thể tích và kiềm hóa nước tiểu bảo vệ thận.'
        ],
        clinicalPearls: [
          'Tránh nhầm lẫn tiêu cơ vân với viêm gan cấp; không chỉ định sinh thiết gan hay thuốc độc gan!'
        ],
        childrenIds: ['diag-deritis-rhabdo', 'diag-deritis-macro']
      },
      'diag-deritis-viral': {
        id: 'diag-deritis-viral',
        parentId: 'deritis-low-node',
        label: 'Viêm Gan Virus Cấp / MASLD Sớm',
        category: 'diagnosis',
        level: 2,
        description: 'Tổn thương tế bào gan ưu thế bào tương, tiên lượng hồi phục theo dõi động học.',
        evidence: ['De Ritis 0.4 - 0.8', 'ALT tăng ưu thế', 'Bilan virus hoặc rối loạn chuyển hóa'],
        immediateOrders: ['Theo dõi ALT/AST mỗi 1-2 tuần', 'Khởi động thuốc kháng virus nếu HBV bùng phát'],
        clinicalPearls: ['ALT thanh thải chậm (t½ ~47h) nên sẽ hạ từ từ sau khi nguyên nhân được giải quyết.']
      },
      'diag-deritis-masld': {
        id: 'diag-deritis-masld',
        parentId: 'deritis-low-node',
        label: 'Thoái Hóa Mỡ Gan Chuyển Hóa (MASLD F0-F2)',
        category: 'diagnosis',
        level: 2,
        description: 'Men gan tăng mạn tính nhẹ, chưa có xơ hóa nặng.',
        evidence: ['BMI tăng, đái tháo đường, rối loạn mỡ máu', 'FIB-4 < 1.30'],
        immediateOrders: ['Thay đổi lối sống, giảm 7-10% trọng lượng cơ thể', 'Kiểm soát đường huyết và lipid'],
        clinicalPearls: ['Giảm cân là biện pháp hiệu quả nhất làm hạ men gan trong MASLD.']
      },
      'diag-deritis-cirrhosis': {
        id: 'diag-deritis-cirrhosis',
        parentId: 'deritis-trans-node',
        label: 'Xơ Hóa Gan Nặng / Xơ Gan Tiến Triển (F3-F4)',
        category: 'diagnosis',
        level: 2,
        description: 'Cấu trúc bè gan bị phá hủy, suy giảm thanh thải AST ở xoang gan.',
        evidence: ['De Ritis > 1.0', 'FIB-4 > 2.67', 'Tiểu cầu giảm < 150 x10^9/L', 'Albumin giảm nhẹ'],
        immediateOrders: ['Đo độ đàn hồi gan FibroScan', 'Tầm soát ung thư biểu mô gan (HCC) bằng Siêu âm + AFP mỗi 6 tháng'],
        clinicalPearls: ['Bệnh nhân viêm gan mạn có De Ritis > 1.0 cần được quản lý như một ca nghi ngờ xơ gan.']
      },
      'diag-deritis-alcohol': {
        id: 'diag-deritis-alcohol',
        parentId: 'deritis-high-node',
        label: 'Bệnh Gan Do Rượu / Viêm Gan Rượu (ALD)',
        category: 'diagnosis',
        level: 2,
        description: 'Đặc trưng bởi thiếu B6, tổn thương ty thể mAST và GGT tăng cao.',
        evidence: ['AST/ALT ≥ 2:1', 'AST < 400 U/L', 'GGT tăng cao', 'Tiền sử uống rượu kéo dài'],
        immediateOrders: ['Ngừng rượu tuyệt đối', 'Tính điểm Maddrey DF', 'Bổ sung dinh dưỡng và Vitamin nhóm B'],
        clinicalPearls: ['Nếu AST > 500 U/L ở người nghiện rượu, luôn phải tìm thêm ngộ độc Paracetamol kèm theo!']
      },
      'diag-deritis-wilson': {
        id: 'diag-deritis-wilson',
        parentId: 'deritis-high-node',
        label: 'Bệnh Wilson Bùng Phát (Fulminant Wilson)',
        category: 'emergency',
        level: 2,
        description: 'Đồng ức chế enzym ALP cấu trúc kẽm và phá hủy màng hồng cầu.',
        evidence: ['AST/ALT > 2.2', 'ALP/Bilirubin < 4.0', 'Thiếu máu tán huyết Coombs âm tính', 'Tuổi < 55'],
        immediateOrders: ['Ceruloplasmin, đồng niệu 24h, khám mắt vòng KF', 'Hội chẩn khẩn trung tâm ghép gan'],
        clinicalPearls: ['Bộ đôi AST/ALT > 2.2 và ALP/Bil < 4.0 có độ đặc hiệu gần 100% cho suy gan cấp do Wilson (ACG 2017).']
      },
      'diag-deritis-rhabdo': {
        id: 'diag-deritis-rhabdo',
        parentId: 'deritis-extra-node',
        label: 'Tiêu Cơ Vân / Tổn Thương Cơ Bắp (Rhabdomyolysis)',
        category: 'emergency',
        level: 2,
        description: 'AST và CK giải phóng ồ ạt từ tế bào cơ vân bị hoại tử.',
        evidence: ['CK > 1000 đến hàng chục nghìn U/L', 'AST >> ALT', 'Nước tiểu màu xá xị / Myoglobin (+)'],
        immediateOrders: ['Truyền dịch tinh thể tích cực bảo vệ ống thận', 'Theo dõi Creatinine và Kali máu sát sao'],
        clinicalPearls: ['Không điều trị như bệnh gan; men AST sẽ hạ nhanh chóng khi cơ vân hồi phục.']
      },
      'diag-deritis-macro': {
        id: 'diag-deritis-macro',
        parentId: 'deritis-extra-node',
        label: 'Hội Chứng Macro-AST (Lành Tính)',
        category: 'diagnosis',
        level: 2,
        description: 'Kháng thể IgG gắn với enzyme AST tạo phức hợp kích thước lớn giảm thanh thải.',
        evidence: ['AST tăng mạn tính đơn độc', 'ALT, CK, GGT, Bilirubin hoàn toàn bình thường', 'Không có triệu chứng'],
        immediateOrders: ['Nghiệm pháp kết tủa PEG', 'Trấn an bệnh nhân, tránh làm xét nghiệm xâm lấn'],
        clinicalPearls: ['Macro-AST là biến thể lành tính, không cần điều trị và không gây hại cho gan.']
      }
    },
    mermaidCode: `graph TD
  A[Tỷ Số De Ritis: AST / ALT] --> B{Phân Tầng Theo Ngưỡng}
  B -->|< 1.0 (Ưu Thế ALT)| C[Tổn Thương Bào Tương Cấp: Viêm Gan Virus, MASLD Sớm]
  B -->|> 1.0 (Nghịch Đảo Tỷ Số)| D[Xơ Hóa Gan Tiến Triển F3-F4: Giảm Thanh Thải Xoang Gan]
  B -->|≥ 2.0 (Ưu Thế AST Kinh Điển)| E[Bệnh Gan Do Rượu: Độc Ty Thể + Thiếu Vitamin B6]
  B -->|AST >> ALT & CK Tăng Vọt| F[Tổn Thương Cơ Vân / Tiêu Cơ Vân Ngoài Gan]

  E -->|ALP/Bil < 4 & Tuổi Trẻ| E1[Cảnh Báo Bệnh Wilson Cấp: Tán Huyết Coombs (-)]
  F -->|CK > 1000 U/L| F1[Tiêu Cơ Vân: Truyền Dịch Bảo Vệ Thận]`
  },
  {
    id: 'tree-dili',
    title: 'Cây Quyết Định: Tổn Thương Gan Do Thuốc (DILI) & Định Luật Hy',
    subtitle: 'Phân loại theo chỉ số R, sàng lọc tiêu chí Hy\'s Law và loại trừ suy gan cấp (ACG 2017 & FDA)',
    sourceGuideline: 'ACG Clinical Guideline 2017 & FDA DILI Guidance',
    rootId: 'dili-root',
    nodes: {
      'dili-root': {
        id: 'dili-root',
        label: 'Nghi Ngờ Tổn Thương Gan Do Thuốc (DILI)',
        category: 'root',
        level: 0,
        description: 'Tăng men gan hoặc vàng da sau khi dùng thuốc mới, kháng sinh, TPCN hoặc thảo dược.',
        evidence: [
          'Khoảng thời gian dùng thuốc đến khi phát bệnh (Latency): vài ngày đến vài tháng.',
          'Tính chỉ số R = (ALT/ULN) / (ALP/ULN) để phân loại kiểu tổn thương.',
          'Đánh giá tiêu chuẩn Định luật Hy (Hy\'s Law) để nhận diện ca nguy cơ tử vong cao.'
        ],
        immediateOrders: [
          'Rà soát toàn bộ đơn thuốc, thuốc OTC, thực phẩm chức năng, trà thảo mộc.',
          'Ngưng ngay lập tức thuốc gây nghi ngờ.',
          'Tính chỉ số R và kiểm tra Bilirubin, INR.'
        ],
        clinicalPearls: [
          'DILI là chẩn đoán loại trừ: Bắt buộc phải làm xét nghiệm loại trừ viêm gan virus A/B/C/E, tự miễn và sỏi mật.'
        ],
        childrenIds: ['dili-hys-node', 'dili-hepatocellular-node', 'dili-cholestatic-node', 'dili-mixed-node']
      },
      'dili-hys-node': {
        id: 'dili-hys-node',
        parentId: 'dili-root',
        label: 'Cảnh Báo Định Luật Hy (Hy\'s Law Alert)',
        category: 'emergency',
        level: 1,
        condition: 'ALT ≥ 3x ULN + Total Bilirubin ≥ 2.0 mg/dL (R > 3, ALP < 2x)',
        description: 'Tổn thương tế bào gan nặng do thuốc với tỷ lệ tử vong hoặc cần ghép gan lên tới 10%.',
        evidence: [
          'Định luật kinh điển của Hy Zimmerman (1978).',
          'Tổn thương nhu mô gan lan tỏa làm suy kiệt khả năng đào thải bilirubin.',
          'Tiêu chuẩn đánh giá độc tính gan nghiêm trọng của FDA.'
        ],
        immediateOrders: [
          'Dừng ngay thuốc nghi ngờ và theo dõi sát tại bệnh viện.',
          'Theo dõi INR, glucose, tri giác mỗi 12-24h để phát hiện sớm suy gan cấp.',
          'Tra cứu cơ sở dữ liệu LiverTox (livertox.nih.gov).'
        ],
        clinicalPearls: [
          'Khi một thuốc làm tăng cả ALT và Bilirubin ở thể tế bào gan, nguy cơ tử vong cao hơn nhiều so với tăng Bilirubin ở thể ứ mật.'
        ],
        childrenIds: ['diag-dili-severe']
      },
      'dili-hepatocellular-node': {
        id: 'dili-hepatocellular-node',
        parentId: 'dili-root',
        label: 'DILI Thể Tế Bào Gan (Hepatocellular: R > 5)',
        category: 'decision',
        level: 1,
        condition: 'Chỉ số R > 5.0 (ALT tăng ưu thế tuyệt đối)',
        description: 'Tổn thương hoại tử tế bào gan do độc chất hoặc phản ứng miễn dịch dị ứng.',
        evidence: [
          'Thuốc hay gặp: Paracetamol (quá liều), Isoniazid (thuốc lao), Nitrofurantoin, Statin, Thảo dược.',
          'Men gan thường hạ 50% trong vòng 1-2 tuần sau khi ngừng thuốc.'
        ],
        immediateOrders: [
          'Định lượng nồng độ Paracetamol nếu có nguy cơ quá liều; truyền NAC nếu cần.',
          'Theo dõi động học ALT/AST hàng tuần.'
        ],
        clinicalPearls: [
          'Thảo dược và thực phẩm chức năng (HDS) hiện chiếm >20% tổng số ca DILI tại nhiều quốc gia.'
        ],
        childrenIds: ['diag-dili-paracetamol', 'diag-dili-herbals']
      },
      'dili-cholestatic-node': {
        id: 'dili-cholestatic-node',
        parentId: 'dili-root',
        label: 'DILI Thể Ứ Mật (Cholestatic: R < 2)',
        category: 'decision',
        level: 1,
        condition: 'Chỉ số R < 2.0 (ALP tăng ưu thế)',
        description: 'Ứ mật do thuốc gây tắc nghẽn hoặc phá hủy vi quản mật.',
        evidence: [
          'Thuốc kinh điển: Amoxicillin-Clavulanate (Augmentin), Steroid đồng hóa, Thuốc tránh thai uống, Erythromycin.',
          'Khởi phát thường trễ sau khi đã kết thúc đợt thuốc 1-4 tuần.'
        ],
        immediateOrders: [
          'Siêu âm loại trừ tắc mật cơ học do sỏi.',
          'Xem xét dùng Ursodeoxycholic acid (UDCA) và thuốc giảm ngứa.'
        ],
        clinicalPearls: [
          'Thể ứ mật có tỷ lệ tử vong thấp hơn thể tế bào gan nhưng thời gian hồi phục kéo dài hơn (có thể 3-6 tháng).'
        ],
        childrenIds: ['diag-dili-augmentin']
      },
      'dili-mixed-node': {
        id: 'dili-mixed-node',
        parentId: 'dili-root',
        label: 'DILI Thể Hỗn Hợp (Mixed: 2 ≤ R ≤ 5)',
        category: 'decision',
        level: 1,
        condition: 'Chỉ số R từ 2.0 đến 5.0',
        description: 'Đồng thời có hoại tử tế bào gan và tổn thương đường mật.',
        evidence: [
          'Thuốc hay gặp: TMP-SMZ (Bactrim), Phenytoin, Carbamazepine, Kháng sinh Cephalosporin.',
          'Có thể kèm phát ban dị ứng, sốt, tăng bạch cầu ái toan (Hội chứng DRESS).'
        ],
        immediateOrders: [
          'Ngừng thuốc nghi ngờ, kiểm tra công thức máu tìm tăng Eosinophil.',
          'Theo dõi chức năng gan sát sao.'
        ],
        clinicalPearls: [
          'Nếu có hội chứng DRESS (sốt, ban da, hạch to, tăng bạch cầu ái toan), cân nhắc điều trị Corticosteroid toàn thân.'
        ],
        childrenIds: ['diag-dili-mixed']
      },
      'diag-dili-severe': {
        id: 'diag-dili-severe',
        parentId: 'dili-hys-node',
        label: 'DILI Thể Tối Nặng (Thỏa Tiêu Chuẩn Hy\'s Law)',
        category: 'emergency',
        level: 2,
        description: 'Nguy cơ suy gan cấp và tử vong cao, cần theo dõi hồi sức tích cực.',
        evidence: ['ALT ≥ 3x ULN', 'Bilirubin ≥ 2.0 mg/dL', 'R > 3', 'ALP < 2x ULN'],
        immediateOrders: ['Hội chẩn Trung tâm Ghép Gan', 'Ngưng ngay mọi thuốc gây nghi ngờ'],
        clinicalPearls: ['Tiêu chuẩn Hy\'s Law có độ tin cậy tiên lượng tử vong được chứng minh qua hàng trăm nghiên cứu quốc tế.']
      },
      'diag-dili-paracetamol': {
        id: 'diag-dili-paracetamol',
        parentId: 'dili-hepatocellular-node',
        label: 'Tổn Thương Gan Do Acetaminophen / Paracetamol',
        category: 'emergency',
        level: 2,
        description: 'Hoại tử vùng trung tâm Zone 3 do độc chất NAPQI làm cạn kiệt Glutathione.',
        evidence: ['Transaminase tăng cực nhanh (>15x đến >10,000 U/L)', 'Toan chuyển hóa, tăng Lactate'],
        immediateOrders: ['Truyền ngay N-Acetylcysteine (NAC) tĩnh mạch', 'Theo dõi INR và đường huyết'],
        clinicalPearls: ['NAC có hiệu quả bảo vệ tế bào gan gần như 100% nếu dùng trong vòng 8 giờ đầu sau uống.']
      },
      'diag-dili-herbals': {
        id: 'diag-dili-herbals',
        parentId: 'dili-hepatocellular-node',
        label: 'Tổn Thương Gan Do Thảo Dược & TPCN (HDS-Induced DILI)',
        category: 'diagnosis',
        level: 2,
        description: 'Viêm gan do các chất phụ gia, kim loại nặng hoặc thảo dược không rõ nguồn gốc.',
        evidence: ['Tiền sử dùng trà giảm cân, thuốc bổ khớp, nấm linh chi, hà thủ ô', 'Men gan tăng mạn tính'],
        immediateOrders: ['Dừng toàn bộ thực phẩm chức năng', 'Theo dõi men gan sau 4 tuần'],
        clinicalPearls: ['Người bệnh thường nghĩ thảo dược là "tự nhiên và lành tính", bác sĩ phải hỏi cụ thể từng loại.']
      },
      'diag-dili-augmentin': {
        id: 'diag-dili-augmentin',
        parentId: 'dili-cholestatic-node',
        label: 'DILI Do Amoxicillin-Clavulanic Acid (Augmentin)',
        category: 'diagnosis',
        level: 2,
        description: 'Tổn thương đường mật miễn dịch dị ứng do thành phần Clavulanate.',
        evidence: ['Khởi phát sau khi ngừng thuốc 1-4 tuần', 'Vàng da, ngứa da, ALP/GGT tăng cao', 'Đường mật không dãn'],
        immediateOrders: ['Dùng UDCA và kháng histamin', 'Theo dõi men gan hàng tháng'],
        clinicalPearls: ['Hầu hết bệnh nhân hồi phục hoàn toàn nhưng cần ghi chú dị ứng Augmentin vào hồ sơ bệnh án suốt đời.']
      },
      'diag-dili-mixed': {
        id: 'diag-dili-mixed',
        parentId: 'dili-mixed-node',
        label: 'DILI Thể Hỗn Hợp / Hội Chứng Quá Mẫn DRESS',
        category: 'diagnosis',
        level: 2,
        description: 'Phản ứng dị ứng toàn thân ảnh hưởng đồng thời nhu mô gan và đường mật.',
        evidence: ['Chỉ số R từ 2 đến 5', 'Bạch cầu ái toan tăng', 'Phát ban da'],
        immediateOrders: ['Dừng thuốc nghi ngờ', 'Cân nhắc Corticosteroid nếu có triệu chứng toàn thân nặng'],
        clinicalPearls: ['Hội chứng DRESS có thể bùng phát lại nếu dùng các thuốc có cấu trúc hóa học tương tự.']
      }
    },
    mermaidCode: `graph TD
  A[Nghi Ngờ DILI: Tiền Sử Dùng Thuốc] --> B{Kiểm Tra Tiêu Chuẩn Hy's Law}
  B -->|ALT ≥ 3x & Bil ≥ 2 mg/dL & R > 3| C[CẢNH BÁO ĐỊNH LUẬT HY: TỬ VONG 10%]
  B -->|Không Thỏa Hy's Law| D{Tính Chỉ Số R = ALT/ULN / ALP/ULN}

  D -->|R > 5: Thể Tế Bào Gan| E[Paracetamol, Isoniazid, Statin, Thảo Dược]
  D -->|R < 2: Thể Ứ Mật| F[Amoxicillin-Clavulanate, Steroid, Thuốc Tránh Thai]
  D -->|2 ≤ R ≤ 5: Thể Hỗn Hợp| G[TMP-SMZ, Phenytoin, Hội Chứng DRESS]`
  },
  {
    id: 'tree-sld-steatotic',
    title: 'Cây Quyết Định: Bệnh Gan Nhiễm Mỡ & Xơ Hóa (MASLD vs MetALD vs ALD)',
    subtitle: 'Đồng thuận quốc tế SLD & Phác đồ phân tầng xơ hóa BSG 2018 / BMJ 2025',
    sourceGuideline: 'BSG Guidelines on Abnormal Liver Blood Tests (Gut 2018) & BMJ 2025',
    rootId: 'sld-root',
    nodes: {
      'sld-root': {
        id: 'sld-root',
        label: 'Phát Hiện Gan Thoái Hóa Mỡ (SLD)',
        category: 'root',
        level: 0,
        description: 'Bệnh nhân có hình ảnh gan nhiễm mỡ trên siêu âm hoặc tăng men gan mạn tính đi kèm yếu tố chuyển hóa.',
        evidence: [
          'Gan nhiễm mỡ ảnh hưởng tới 25-30% dân số toàn cầu.',
          'Cần phân định rạch ròi giữa gánh nặng chuyển hóa và mức độ tiêu thụ rượu bia (g/tuần).'
        ],
        immediateOrders: [
          'Khai thác chính xác lượng cồn uống hàng tuần (g/tuần hoặc đơn vị UK).',
          'Đo BMI, vòng eo, huyết áp, Glucose đói, HbA1c và Bilan lipid máu.',
          'Tính ngay chỉ số FIB-4 và NAFLD Fibrosis Score (NFS) hiệu chỉnh theo tuổi.'
        ],
        clinicalPearls: [
          'Tiếp tục Statin an toàn nếu ALT/AST < 3x ULN theo khuyến cáo BSG 2018 & BMJ 2025.'
        ],
        childrenIds: ['branch-masld', 'branch-metald', 'branch-ald']
      },
      'branch-masld': {
        id: 'branch-masld',
        parentId: 'sld-root',
        label: 'Nhánh MASLD: Yếu Tố Chuyển Hóa + Rượu Tối Thiểu',
        category: 'decision',
        level: 1,
        condition: 'Rượu < 140g/tuần (Nữ) hoặc < 210g/tuần (Nam) + Có yếu tố chuyển hóa',
        description: 'Tổn thương gan nhiễm mỡ do rối loạn chuyển hóa thuần túy (Metabolic Dysfunction-associated Steatotic Liver Disease).',
        evidence: [
          'Thừa cân, béo phì, tiền tiểu đường hoặc ĐTĐ Type 2.',
          'Men gan tăng nhẹ-vừa, ALT thường cao hơn AST trong giai đoạn sớm.'
        ],
        immediateOrders: [
          'Chế độ ăn Địa Trung Hải, giảm 7-10% cân nặng.',
          'Tập thể lực nhịp điệu ≥ 150 phút/tuần.',
          'Tầm soát xơ hóa không xâm lấn bằng FIB-4 / NFS.'
        ],
        clinicalPearls: [
          'Nếu AST vượt ALT (De Ritis > 1.0) ở người MASLD, cảnh báo xơ hóa gan đã tiến triển đến F3-F4.'
        ],
        childrenIds: ['diag-masld-low', 'diag-masld-high']
      },
      'branch-metald': {
        id: 'branch-metald',
        parentId: 'sld-root',
        label: 'Nhánh MetALD: Thể Hỗn Hợp Chuyển Hóa & Rượu',
        category: 'decision',
        level: 1,
        condition: 'Rượu: Nữ 140-350 g/tuần (20-50g/d), Nam 210-420 g/tuần (30-60g/d)',
        description: 'Gánh nặng bệnh sinh kép: Kháng insulin phối hợp độc tính ty thể do rượu đẩy nhanh tốc độ xơ hóa.',
        evidence: [
          'Mức tiêu thụ rượu trung gian phối hợp BMI tăng hoặc ĐTĐ.',
          'Tốc độ tiến triển xơ hóa nhanh gấp 2-3 lần so với MASLD đơn thuần.'
        ],
        immediateOrders: [
          'Can thiệp kiêng hoặc giảm tiêu thụ rượu bia nghiêm ngặt.',
          'Định lượng GGT: Nếu GGT > 100 U/L phải đánh giá xơ hóa ngay (BSG 2018).',
          'Đo độ đàn hồi mô gan (FibroScan).'
        ],
        clinicalPearls: [
          'Giảm rượu về ngưỡng MASLD làm giảm đáng kể nguy cơ mất bù gan.'
        ],
        childrenIds: ['diag-metald-fibrosis']
      },
      'branch-ald': {
        id: 'branch-ald',
        parentId: 'sld-root',
        label: 'Nhánh ALD: Bệnh Gan Do Rượu Vượt Ngưỡng',
        category: 'decision',
        level: 1,
        condition: 'Rượu > 350 g/tuần (Nữ), > 420 g/tuần (Nam), hoặc AUDIT-C ≥ 5',
        description: 'Tổn thương gan do lạm dụng rượu nặng, nguy cơ viêm gan do rượu cấp tính hoặc xơ gan mất bù.',
        evidence: [
          'Uống rượu kéo dài, tỷ số De Ritis (AST:ALT) > 2.0 ở mức men < 500 U/L.',
          'GGT thường tăng vọt hàng trăm đến hàng nghìn U/L.'
        ],
        immediateOrders: [
          'Cai rượu tuyệt đối với hỗ trợ y tế (Thiamine liều cao).',
          'Khảo sát chức năng đông máu (PT/INR) và Bilirubin.',
          'Tính chỉ số Maddrey DF nếu vàng da.'
        ],
        clinicalPearls: [
          'Cai rượu là yếu tố duy nhất cải thiện tiên lượng sống còn ở mọi giai đoạn ALD.'
        ],
        childrenIds: ['diag-ald-maddrey']
      },
      'diag-masld-low': {
        id: 'diag-masld-low',
        parentId: 'branch-masld',
        label: 'MASLD Nguy Cơ Xơ Hóa Thấp (F0 - F1)',
        category: 'diagnosis',
        level: 2,
        description: 'Chỉ số FIB-4 < 1.30 (hoặc < 2.00 nếu ≥ 65 tuổi); NFS < -1.455 (hoặc < 0.12 nếu ≥ 65 tuổi).',
        evidence: ['Giá trị dự đoán âm (NPV) > 90-95% cho việc loại trừ xơ hóa tiến triển.', 'Không có triệu chứng suy tế bào gan hay tăng áp cửa.'],
        immediateOrders: ['Theo dõi định kỳ tại y tế cơ sở mỗi 2-3 năm', 'Tối ưu hóa lối sống và kiểm soát huyết áp, đường huyết'],
        clinicalPearls: ['Người cao tuổi ≥ 65 tuổi sinh lý có AST cao hơn và tiểu cầu thấp hơn, bắt buộc dùng ngưỡng cắt hiệu chỉnh (BSG 2018).']
      },
      'diag-masld-high': {
        id: 'diag-masld-high',
        parentId: 'branch-masld',
        label: 'MASLD Nguy Cơ Xơ Hóa Tiến Triển / Xơ Gan (F3 - F4)',
        category: 'emergency',
        level: 2,
        description: 'Chỉ số FIB-4 > 2.67 hoặc NFS > 0.675 (hoặc vùng xám có FibroScan LSM ≥ 8.0 kPa).',
        evidence: ['Tỷ số AST/ALT đảo ngược > 1.0', 'Tiểu cầu giảm dần (< 150 x 10^9/L)', 'Giá trị dự đoán dương (PPV) > 80%'],
        immediateOrders: ['Chuyển khám chuyên khoa Tiêu hóa - Gan mật', 'Đo độ đàn hồi gan FibroScan xác định chính xác độ cứng gan', 'Nội soi tầm soát giãn tĩnh mạch thực quản nếu LSM > 20 kPa'],
        clinicalPearls: ['Tất cả bệnh nhân xơ gan do MASLD cần được siêu âm sàng lọc ung thư biểu mô tế bào gan (HCC) định kỳ mỗi 6 tháng.']
      },
      'diag-metald-fibrosis': {
        id: 'diag-metald-fibrosis',
        parentId: 'branch-metald',
        label: 'MetALD: Xơ Hóa Gan Tiến Triển Phối Hợp',
        category: 'diagnosis',
        level: 2,
        description: 'Tổn thương gan thoái hóa mỡ phối hợp rượu cần đánh giá xơ hóa định kỳ hàng năm.',
        evidence: ['GGT > 100 U/L', 'FIB-4 tăng trong vùng xám hoặc cao', 'Gan nhiễm mỡ kèm bờ không đều trên siêu âm'],
        immediateOrders: ['Đo FibroScan', 'Chương trình cai rượu chuyên sâu', 'Theo dõi men gan mỗi 3-6 tháng'],
        clinicalPearls: ['Giảm rượu bia giúp đưa bệnh nhân từ vùng nguy cơ cao MetALD về vùng an toàn hơn của MASLD.']
      },
      'diag-ald-maddrey': {
        id: 'diag-ald-maddrey',
        parentId: 'branch-ald',
        label: 'Viêm Gan Do Rượu Cấp Nặng (Maddrey DF ≥ 32)',
        category: 'emergency',
        level: 2,
        description: 'Tình trạng viêm hoại tử gan cấp bùng phát trên nền lạm dụng rượu mạn tính.',
        evidence: ['Bilirubin máu tăng cao', 'INR kéo dài (DF = 4.6 * delta PT + Total Bilirubin ≥ 32)', 'Sốt, bạch cầu tăng, đau hạ sườn phải'],
        immediateOrders: ['Loại trừ nhiễm trùng nặng (chọc dịch màng bụng, cấy máu, cấy nước tiểu)', 'Xem xét điều trị Corticosteroid (Prednisolone 40mg/ngày x 28 ngày) nếu không có chống chỉ định', 'Hội chẩn trung tâm gan mật'],
        clinicalPearls: ['Đánh giá đáp ứng steroid vào ngày thứ 7 bằng Thang điểm Lille (nếu điểm Lille > 0.45 chứng tỏ không đáp ứng và nên ngừng steroid).']
      }
    },
    mermaidCode: `graph TD
  A[Phát Hiện Gan Thoái Hóa Mỡ: Siêu Âm / Men Gan] --> B{Khai Thác Lượng Rượu Tiêu Thụ Hàng Tuần}
  
  B -->|< 140g Nữ / < 210g Nam + Tiêu Chí Chuyển Hóa| C[MASLD: Bệnh Gan Nhiễm Mỡ Chuyển Hóa]
  B -->|140-350g Nữ / 210-420g Nam + Tiêu Chí Chuyển Hóa| D[MetALD: Thể Hỗn Hợp Chuyển Hóa & Rượu]
  B -->|> 350g Nữ / > 420g Nam hoặc AUDIT-C ≥ 5| E[ALD: Bệnh Gan Do Rượu Thuần Túy]

  C --> F{Tính FIB-4 & NFS Hiệu Chỉnh Tuổi}
  F -->|FIB-4 < 1.30 hoặc < 2.0 nếu ≥65t| G[Nguy Cơ Thấp: Theo Dõi Tuyến Cơ Sở 2-3 Năm]
  F -->|FIB-4 > 2.67 hoặc NFS > 0.675| H[Nguy Cơ Cao: Chuyển Chuyên Khoa Gan Mật & Tầm Soát HCC]

  D --> I[Cai/Giảm Rượu + Đo GGT & FibroScan Định Kỳ Hàng Năm]
  E --> J{Tính Maddrey DF Nếu Vàng Da}
  J -->|Maddrey DF ≥ 32| K[CẤP CỨU: Viêm Gan Rượu Nặng - Xem Xét Steroid]`
  }
];