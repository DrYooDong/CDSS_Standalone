import { KnowledgeTopic } from '../types';


export const KNOWLEDGE_TOPICS: KnowledgeTopic[] = [
  {
    id: 'core-concept',
    title: '1. Bản Chất Xét Nghiệm: Dấu Ấn Tổn Thương vs Chức Năng Gan Thực Sự',
    category: 'Nền tảng',
    readTime: '4 phút',
    summary: 'Phân định rạch ròi giữa "Liver Chemistries" (chỉ thị vị trí và mức độ hoại tử tế bào gan/ứ mật) và "True Liver Function Tests" (đo lường năng lực tổng hợp và bài tiết thực chất của gan).',
    contentMarkdown: `### "Liver Function Tests" - Một Thuật Ngữ Chưa Hoàn Toàn Chính Xác
Trong thực hành lâm sàng hàng ngày, xét nghiệm bộ sinh hóa gan thường được gọi chung là "xét nghiệm chức năng gan" (LFTs). Tuy nhiên, theo các hướng dẫn chính thức từ Hội Tiêu hóa Hoa Kỳ (**ACG 2017**) và Tổ chức Y tế Thế giới (**WHO**):
* **ALT (Alanine Aminotransferase) & AST (Aspartate Aminotransferase)**: Không hề phản ánh chức năng hoạt động của gan, mà là **chỉ thị hoại tử / rò rỉ màng tế bào gan** (markers of hepatocellular injury or death). Nồng độ men gan có thể tăng vọt trong khi chức năng chuyển hóa của gan vẫn còn nguyên vẹn; ngược lại, ở giai đoạn xơ gan mất bù giai đoạn cuối, tế bào gan bị teo xơ kiệt quệ thì men gan có thể chỉ ở mức bình thường hoặc tăng nhẹ.
* **ALP (Alkaline Phosphatase) & GGT (Gamma-Glutamyl Transferase)**: Là các enzyme gắn trên màng vi quản mật, đóng vai trò **chỉ thị tổn thương biểu mô đường mật và hội chứng ứ mật** (markers of cholestasis and biliary epithelial injury).
* **Xét nghiệm chức năng thực sự (True Tests of Hepatic Function)**:
  1. **Năng lực tổng hợp Protein (Synthetic Capacity)**: Đo lường qua nồng độ **Albumin huyết thanh** (thời gian bán thải t½ ~ 21 ngày) và **Thời gian Prothrombin / INR** (phản ánh các yếu tố đông máu chu kỳ ngắn, đặc biệt Yếu tố VII t½ ~ 6 giờ).
  2. **Năng lực chuyển hóa và bài tiết (Excretory Capacity)**: Đo lường qua khả năng liên hợp và bài tiết **Bilirubin** vào đường mật.`,
    keyTakeaways: [
      'Men gan cao không đồng nghĩa với suy gan; men gan bình thường không loại trừ xơ gan tiến triển.',
      'Albumin và PT/INR là hai thước đo chuẩn xác nhất về khả năng tổng hợp của gan trên lâm sàng.',
      'Bilirubin và Albumin chịu ảnh hưởng của các yếu tố ngoài gan (như dinh dưỡng, thận, tán huyết) nên phải phân tích trong tổng thể bệnh cảnh.'
    ]
  },
  {
    id: 'microscopic-anatomy',
    title: '2. Giải Phẫu Vi Thể & Dòng Chảy Huyết Học Tiểu Thùy Gan',
    category: 'Giải phẫu & Sinh lý',
    readTime: '5 phút',
    summary: 'Cấu trúc hình lục giác của tiểu thùy gan, bộ ba khoảng cửa, mạng xoang gan và định hướng tổn thương theo các vùng Rappaport (Zone 1, 2, 3).',
    contentMarkdown: `### Kiến trúc tiểu thùy gan (Hepatic Lobule)
Mỗi tiểu thùy gan là một cấu trúc hình lăng trụ 5-6 cạnh (penta- to hexagonal), ở mỗi góc là một **Bộ ba khoảng cửa (Portal tract)** bao gồm:
* Nhánh của **Tĩnh mạch cửa (Portal vein)**: đưa máu giàu dưỡng chất từ đường tiêu hóa về gan.
* Nhánh của **Động mạch gan (Hepatic artery)**: cung cấp máu giàu oxy.
* Nhánh của **Ống mật (Bile duct)**: dẫn lưu dịch mật được tiết từ tế bào gan.

Ở trung tâm mỗi tiểu thùy là **Tĩnh mạch trung tâm tiểu thùy (Central vein)**, máu từ các xoang gan sẽ đổ về đây trước khi hợp lưu vào tĩnh mạch gan và tĩnh mạch chủ dưới.

### Chiều dòng chảy và sinh lý học trao đổi chất
* **Dòng chảy của máu**: Đi từ các góc (khoảng cửa) hướng tâm về phía tĩnh mạch trung tâm tiểu thùy. Dòng máu trong xoang gan chảy chậm với áp lực thấp, tạo điều kiện tối đa cho sự tiếp xúc giữa huyết tương và bề mặt tế bào gan qua **Khoảng Disse**.
* **Dòng chảy của dịch mật**: Ngược chiều với dòng máu! Dịch mật do tế bào gan chế tiết được đổ vào các **Vi quản mật (Bile canaliculi)** nằm xen kẽ giữa các bè tế bào gan, sau đó chảy ly tâm về các ống mật tại khoảng cửa.

### Phân vùng chức năng (Rappaport Acinus) và tính nhạy cảm tổn thương:
* **Zone 1 (Quanh khoảng cửa - Periportal)**: Nhận máu giàu oxy và chất dinh dưỡng đầu tiên. Tế bào gan ở đây có hoạt tính tổng hợp protein, tân tạo đường và chu trình urê cao. Nhạy cảm nhất với độc chất trực tiếp từ ruột.
* **Zone 3 (Quanh tĩnh mạch trung tâm - Perivenular / Centrilobular)**: Xa nguồn cấp máu giàu oxy nhất, phân áp oxy thấp nhất. Tế bào tại đây giàu enzym Cytochrome P450 (CYP2E1), chuyên phụ trách chuyển hóa độc chất và lipogenesis.
  * **Hệ quả lâm sàng**: Vùng Zone 3 là nơi **dễ bị tổn thương nhất khi tụt huyết áp / thiếu máu cục bộ (Shock Liver)** và là vị trí chịu ảnh hưởng nặng nề nhất do độc chất chuyển hóa như **Paracetamol (NAPQI)** hoặc viêm gan do rượu.`,
    keyTakeaways: [
      'Máu chảy hướng tâm (từ khoảng cửa vào tĩnh mạch trung tâm), dịch mật chảy ly tâm (ngược chiều).',
      'Vùng Zone 3 nhạy cảm nhất với thiếu oxy (sốc gan) và độc chất chuyển hóa P450 (Paracetamol, rượu).'
    ]
  },
  {
    id: 'de-ritis-ratio',
    title: '3. Chuyên Đề Tỷ Số De Ritis (AST/ALT): 50 Năm Vững Vàng Giá Trị Lâm Sàng',
    category: 'Men gan hoại tử',
    readTime: '6 phút',
    summary: 'Nghiên cứu kinh điển của Fernando De Ritis (1957) và tổng kết từ Ken Sikaris: Vị trí bào tương vs ty thể, thời gian bán hủy t½ và ngưỡng quyết định lâm sàng.',
    contentMarkdown: `### Nguồn gốc tế bào học của ALT và AST
* **ALT (Alanine Aminotransferase / SGPT)**: 
  * Định vị **chỉ trong bào tương (Cytosol)** của tế bào gan.
  * Tính đặc hiệu gan rất cao (trong gan nồng độ 2850 U/g, cơ vân chỉ 300 U/g).
  * Thời gian bán hủy dài: **t½ ~ 47 ± 10 giờ** (~2 ngày).
  * Vì nằm ở bào tương, chỉ cần tổn thương vi mô hoặc thay đổi tính thấm màng tế bào, ALT đã dễ dàng rò rỉ ra máu.
* **AST (Aspartate Aminotransferase / SGOT)**:
  * Tồn tại ở 2 dạng isoenzyme: **80% nằm trong ty thể (mAST)** và **20% nằm trong bào tương (cAST)**.
  * Phân bố rộng ở nhiều mô: Tim (7800 U/g), Cơ vân (5000 U/g), Thận (4500 U/g), Não và Hồng cầu.
  * Thời gian bán hủy ngắn: **t½ ~ 17 ± 5 giờ** (bị thực bào qua tế bào nội mô xoang gan nhanh gấp đôi ALT).

### Diễn giải tỷ số De Ritis (AST/ALT) theo bối cảnh lâm sàng:
| Tỷ số De Ritis | Bệnh lý đặc trưng | Cơ chế sinh hóa giải thích |
|---|---|---|
| **< 1.0** (0.5 - 0.7) | Viêm gan virus cấp (A, B, C, E), Thoái hóa mỡ gan (MASLD) | ALT rò rỉ nhiều từ bào tương và thanh thải chậm (t½ dài hơn AST gấp gần 3 lần), nồng độ ALT duy trì cao hơn trong máu. |
| **> 1.5 - 2.0** (trong viêm gan virus cấp) | Viêm gan tối cấp / Suy gan bùng phát | Đột ngột phá hủy sâu tới tận ty thể; tỷ số >1.5 ở bệnh nhân viêm gan cấp báo hiệu nguy cơ tử vong tăng 40 lần (Botros & Sikaris 2013). |
| **> 2.0** (AST < 400 U/L) | Viêm gan do rượu (Alcoholic Hepatitis) | (1) Cồn gây độc trực tiếp màng ty thể giải phóng mAST; (2) Thiếu Pyridoxine (B6) ở người nghiện rượu làm ức chế tổng hợp ALT mạnh hơn AST; (3) Giảm thanh thải AST qua xoang gan. |
| **> 1.0** (trong bệnh mạn tính) | Xơ hóa gan tiến triển / Xơ gan (F3 - F4) | Sự xơ hóa làm đảo lộn cấu trúc xoang gan, giảm bắt giữ và thanh thải AST; là thành phần then chốt trong công thức FIB-4 và APRI. |
| **> 3.0 - 5.0** (AST tăng vọt) | Tiêu cơ vân / Chấn thương cơ / Nhồi máu cơ tim | Cơ bắp chứa lượng AST khổng lồ (tỷ lệ AST/ALT mô cơ là 17:1). Kiểm tra ngay Creatine Kinase (CK) để tránh nhầm với bệnh gan. |
| **> 1.0 kèm ALP thấp dị thường** | Bệnh Wilson (Wilson Disease) | Ion đồng lắng đọng phá hủy ty thể đồng thời ức chế cạnh tranh với ion kẽm của enzyme Phosphatase kiềm (ALP). |`,
    keyTakeaways: [
      'AST:ALT > 2:1 là chỉ dấu kinh điển của viêm gan do rượu, nhưng giá trị tuyệt đối của AST hiếm khi quá 400 U/L.',
      'Viêm gan virus cấp điển hình có De Ritis < 1.0; nếu De Ritis đảo chiều > 1.5 thì phải cảnh giác nguy cơ suy gan bùng phát.',
      'AST tăng đơn độc hoặc AST >> ALT luôn luôn phải loại trừ tổn thương cơ (bằng xét nghiệm CK) hoặc mẫu máu vỡ hồng cầu.'
    ]
  },
  {
    id: 'cholestasis-approach',
    title: '4. Tiếp Cận Hội Chứng Ứ Mật (ALP & GGT) & Tỷ Số R-Ratio',
    category: 'Ứ mật & Đường mật',
    readTime: '5 phút',
    summary: 'Cách sử dụng chỉ số R-ratio chuẩn ACG để phân loại tổn thương gan, xác minh nguồn gốc của ALP bằng GGT, và vai trò của chẩn đoán hình ảnh.',
    contentMarkdown: `### Chỉ số R-ratio (R-value) theo ACG & DILIN
Để phân biệt chính xác kiểu tổn thương tế bào gan hay ứ mật, hiệp hội ACG khuyến cáo sử dụng **chỉ số R**:
$$\\text{R} = \\frac{\\text{ALT} / \\text{ULN}_{\\text{ALT}}}{\\text{ALP} / \\text{ULN}_{\\text{ALP}}}$$
* **R > 5.0**: **Tổn thương tế bào gan (Hepatocellular pattern)** - Điển hình: Viêm gan virus, ngộ độc thuốc, thiếu máu cục bộ, tự miễn.
* **R < 2.0**: **Tổn thương ứ mật (Cholestatic pattern)** - Điển hình: Tắc mật sỏi/u, PBC, PSC, DILI thể ứ mật (Augmentin, Steroid).
* **2.0 ≤ R ≤ 5.0**: **Tổn thương thể hỗn hợp (Mixed pattern)** - Gặp trong DILI thể hỗn hợp, tắc mật giai đoạn sớm, hội chứng chồng lấp tự miễn.

### Xác nhận nguồn gốc gan của Alkaline Phosphatase (ALP)
ALP là enzyme xúc tác thủy phân este phosphat ở pH kiềm, phân bố ở:
* Gan (màng vi quản mật của tế bào gan).
* Xương (nguyên bào xương tạo xương - tăng ở trẻ em đang lớn, gãy xương, bệnh Paget, đa u tủy xương).
* Nhau thai (tăng sinh lý từ tam cá nguyệt thứ 2 và 3 của thai kỳ).
* Ruột non (tăng nhẹ sau bữa ăn nhiều dầu mỡ ở người có nhóm máu O hoặc B).

**Nguyên tắc ACG 2017**:
1. Nếu ALP tăng đi kèm men gan hoặc bilirubin tăng: Nguồn gốc gan rõ ràng, không cần xét nghiệm phụ.
2. Nếu **ALP tăng đơn độc**: Bắt buộc làm **GGT (Gamma-Glutamyl Transferase)** hoặc **5'-Nucleotidase** để xác nhận. GGT vắng mặt ở mô xương. Nếu GGT bình thường, nguyên nhân chắc chắn từ xương hoặc ngoài gan!`,
    keyTakeaways: [
      'R-ratio chuẩn hóa theo ULN là công cụ khách quan nhất để phân định tổn thương gan hoại tử vs ứ mật.',
      'GGT đóng vai trò "người bảo lãnh" khẳng định ALP tăng do bệnh lý gan mật hay do bệnh xương/sinh lý thai kỳ.',
      'Bước kế tiếp bắt buộc khi khẳng định ứ mật là Siêu âm bụng để tách đôi: Đường mật dãn (tắc ngoài gan) vs Không dãn (ứ mật trong gan).'
    ]
  },
  {
    id: 'bilirubin-metabolism',
    title: '5. Chuyển Hóa Bilirubin & Lưu Đồ Tiếp Cận Vàng Da Lâm Sàng',
    category: 'Vàng da & Bilirubin',
    readTime: '6 phút',
    summary: 'Sinh lý học gián tiếp vs liên hợp, vai trò enzym UGT1A1, tiếp cận vàng da trước gan, tại gan, sau gan theo hướng dẫn của WHO và ACG.',
    contentMarkdown: `### Chu trình chuyển hóa Bilirubin trong cơ thể
Người trưởng thành khỏe mạnh tạo ra khoảng **250 - 350 mg Bilirubin mỗi ngày**, trong đó 80-85% từ sự phá hủy hồng cầu già tại lách và tủy xương (thoái giáng Heme).
1. **Bilirubin gián tiếp (Không liên hợp / Unconjugated / Indirect)**:
   * Không tan trong nước, gắn chặt với Albumin trong huyết tương để di chuyển đến gan.
   * **Không thể lọc qua cầu thận**, do đó không xuất hiện trong nước tiểu.
2. **Quá trình liên hợp tại tế bào gan**:
   * Tại lưới nội chất tế bào gan, enzym **UDP-glucuronosyltransferase 1A1 (UGT1A1)** gắn 2 phân tử acid glucuronic vào bilirubin để tạo thành **Bilirubin trực tiếp (Bilirubin liên hợp / Diglucuronide)**.
3. **Bài tiết vào dịch mật**:
   * Bilirubin liên hợp tan trong nước, được bơm chủ động qua màng vi quản mật đổ vào đường ruột.
   * Tại đại tràng, vi khuẩn khử bilirubin thành **Urobilinogen** và **Stercobilin** (tạo màu vàng nâu đặc trưng của phân). Một phần nhỏ tái hấp thu theo chu trình gan ruột và đào thải qua nước tiểu.

### Phân đoạn Bilirubin và Định hướng nguyên nhân:
* **Tăng Bilirubin gián tiếp ưu thế (Bilirubin trực tiếp < 20% tổng số)**:
  * **Tăng sản xuất quá mức**: Tán huyết nội mạch hoặc ngoại mạch (Sốt rét, Thalassemia, tự miễn, tụ máu lớn đang tiêu).
  * **Giảm bắt giữ và liên hợp tại gan**: 
    * **Hội chứng Gilbert**: Đột biến promoter gen UGT1A1 lành tính (gặp 5-7% dân số), bilirubin hiếm khi vượt quá 3-4 mg/dL.
    * **Hội chứng Crigler-Najjar**: Thiếu hụt UGT1A1 nặng hoặc hoàn toàn (Type I & II), vàng da nhân ở trẻ sơ sinh.
* **Tăng Bilirubin trực tiếp ưu thế (Bilirubin trực tiếp > 50% tổng số)**:
  * **Tắc mật cơ học ngoài gan**: Sỏi ống mật chủ, u đầu tụy, u bóng Vater, u đường mật Klatskin (phân bạc màu, ngứa, nước tiểu sẫm màu).
  * **Tổn thương tế bào gan nặng**: Viêm gan virus bùng phát, viêm gan rượu, xơ gan (do ức chế bơm bài tiết mật vào vi quản).
  * **Bệnh lý bài tiết bẩm sinh hiếm gặp**: Hội chứng Dubin-Johnson (khiếm khuyết gen bơm MRP2) và Rotor (men gan bình thường).`,
    keyTakeaways: [
      'Bilirubin gián tiếp không qua nước tiểu; khi nước tiểu sậm màu vàng sẫm có bọt chứng tỏ Bilirubin trực tiếp tan trong nước bị rò rỉ vào máu.',
      'Nếu Bilirubin tăng đơn độc ưu thế gián tiếp và men gan bình thường: Loại trừ tán huyết rồi nghĩ ngay tới Hội chứng Gilbert lành tính.',
      'Delta Bilirubin (liên hợp gắn bền vững với Albumin) có thời gian bán hủy 3 tuần, giải thích hiện tượng vàng da chậm biến mất dù bệnh gan đã hồi phục.'
    ]
  },
  {
    id: 'pitfalls-interfering',
    title: '6. Bẫy Xét Nghiệm & Yếu Tố Nhiễu Sinh Hóa Cần Cảnh Giác',
    category: 'Thực hành xét nghiệm',
    readTime: '4 phút',
    summary: 'Nhận diện tán huyết trong ống nghiệm (in vitro hemolysis), đục mỡ (lipemia), vàng da đậm (icterus), ảnh hưởng của vận động, thuốc và nhịp sinh học.',
    contentMarkdown: `### 1. Mẫu máu vỡ hồng cầu (In Vitro Hemolysis)
* Hồng cầu chứa nồng độ **AST cao gấp 40 lần** so với huyết thanh, cùng với lượng lớn **LDH** và **Kali**.
* Kỹ thuật lấy máu kém, garô quá chặt hoặc bơm kim tiêm áp lực cao làm vỡ hồng cầu giải phóng AST vào huyết thanh, tạo ra kết quả **tăng giả AST đơn độc** trong khi ALT và GGT hoàn toàn bình thường.

### 2. Hiện tượng nhiễu quang học (Spectrophotometric Interference)
Các máy xét nghiệm tự động đo hoạt độ enzyme dựa trên độ hấp thụ ánh sáng ở các bước sóng xác định (theo định luật Beer-Lambert):
* **Huyết sắc tố (Hemoglobin)**: Hấp thụ cực đại ở 415 nm (320 - 580 nm), gây sai lệch kết quả định lượng Sắt, Albumin, Lipase và GGT.
* **Đục mỡ (Lipemia)**: Gây tán xạ ánh sáng, đặc biệt làm nhiễu nặng các phản ứng đo quang ở bước sóng ngắn **340 nm** (phản ứng tiêu thụ NADH để đo ALT và AST).
* **Vàng da đậm (Icterus)**: Bilirubin hấp thụ mạnh ở 400 - 540 nm, có thể gây sai lệch kết quả Creatinine hoặc một số enzyme khác.

### 3. Nhịp sinh học và Bữa ăn
* Nồng độ **ALT có nhịp sinh học dao động tới 45%** trong ngày, thường đạt đỉnh vào buổi chiều và thấp nhất vào rạng sáng.
* Bữa ăn nhiều chất béo có thể làm tăng transaminase tạm thời từ 2 đến 3 lần và kích hoạt tăng ALP ruột (đặc biệt ở người nhóm máu O và B). Do đó, **mẫu máu nên được lấy vào buổi sáng sau khi nhịn đói qua đêm**.

### 4. Thuốc can thiệp phản ứng đo quang
* Thuốc kháng sinh **Metronidazole** hấp thụ ánh sáng ở vùng 340 nm, có thể can thiệp làm kết quả đo ALT bị sai lệch thấp giả tạo trên một số dòng máy phân tích sử dụng phương pháp IFCC.`,
    keyTakeaways: [
      'Luôn kiểm tra chỉ số Hemolysis Index trên phiếu xét nghiệm khi thấy AST tăng cao đơn độc.',
      'Lấy máu buổi sáng lúc đói giúp loại bỏ biến thiên nhịp sinh học và ảnh hưởng từ chuyển hóa thức ăn.',
      'Khai thác thuốc đang dùng (kể cả kháng sinh như Metronidazole hay thực phẩm chức năng) để diễn giải chính xác.'
    ]
  },
  {
    id: 'sld-masld-metald-consensus',
    title: '7. Đồng Thuận Mới Về Bệnh Gan Nhiễm Mỡ (SLD): MASLD, MetALD và ALD',
    category: 'Chuyển hóa & Dịch tễ',
    readTime: '6 phút',
    summary: 'Phân tích danh pháp quốc tế đa hội Steatotic Liver Disease (SLD), ngưỡng rượu phân định MASLD vs MetALD vs ALD, công thức NAFLD Fibrosis Score (NFS) và chỉ dẫn an toàn Statin.',
    contentMarkdown: `### 1. Vì Sao Thay Đổi Danh Pháp Từ NAFLD Sang MASLD?
Vào năm 2023-2024, các hiệp hội gan mật hàng đầu thế giới (AASLD, EASL, ALEH) đã đạt được **Đồng thuận Delphi Đa hội** thay thế thuật ngữ NAFLD (Non-Alcoholic Fatty Liver Disease) bằng **MASLD (Metabolic Dysfunction-associated Steatotic Liver Disease)** vì các lý do chính:
* Tránh thuật ngữ mang tính kỳ thị ("Fatty" và "Alcoholic").
* Xác lập vai trò chủ động của các **tiêu chuẩn tim mạch - chuyển hóa (Cardiometabolic criteria)** thay vì chẩn đoán loại trừ tiêu cực.
* Định danh nhóm bệnh nhân có sự chồng lấp giữa chuyển hóa và rượu: **MetALD**.

### 2. Tiêu Chuẩn Tim Mạch - Chuyển Hóa (Cardiometabolic Risk Factors)
Bệnh nhân có bằng chứng gan thoái hóa mỡ (trên siêu âm, CT, MRI hoặc mô học) được xếp vào phổ SLD nếu có ít nhất **1 trong 5 tiêu chí**:
1. **Thừa cân / Béo phì**: BMI ≥ 25 kg/m² (hoặc ≥ 23 kg/m² ở người châu Á) hoặc vòng bụng > 94 cm (nam), > 80 cm (nữ).
2. **Rối loạn đường huyết**: Đường huyết đói ≥ 100 mg/dL (5.6 mmol/L) hoặc HbA1c ≥ 5.7% hoặc đang điều trị ĐTĐ Type 2.
3. **Tăng huyết áp**: Huyết áp ≥ 130/85 mmHg hoặc đang dùng thuốc hạ áp.
4. **Tăng Triglyceride máu**: Triglyceride ≥ 150 mg/dL (1.7 mmol/L) hoặc đang điều trị hạ mỡ máu.
5. **Giảm HDL-Cholesterol**: HDL < 40 mg/dL (1.0 mmol/L) ở nam, < 50 mg/dL (1.3 mmol/L) ở nữ.

### 3. Phân Định Ranh Giới Tiêu Thụ Rượu (Alcohol Thresholds)
* **MASLD thuần túy**: Thỏa tiêu chuẩn chuyển hóa + uống rượu tối thiểu:
  * Nữ: < 140 g/tuần (< 20 g/ngày, tương đương < 17.5 đơn vị cồn UK/tuần).
  * Nam: < 210 g/tuần (< 30 g/ngày, tương đương < 26.25 đơn vị cồn UK/tuần).
* **MetALD (Thể hỗn hợp chuyển hóa & rượu)**: Thỏa tiêu chuẩn chuyển hóa NHƯNG có mức uống rượu trung bình:
  * Nữ: 140 – 350 g/tuần (20 – 50 g/ngày, hoặc 17.5 – 43.75 đơn vị UK/tuần).
  * Nam: 210 – 420 g/tuần (30 – 60 g/ngày, hoặc 26.25 – 52.5 đơn vị UK/tuần).
  * *Ý nghĩa lâm sàng*: Nhóm này có tốc độ tiến triển xơ hóa và xơ gan nhanh hơn gấp 2-3 lần so với MASLD đơn thuần.
* **ALD (Bệnh gan liên quan rượu thuần túy)**:
  * Nữ > 350 g/tuần (> 50 g/ngày), Nam > 420 g/tuần (> 60 g/ngày), hoặc sàng lọc AUDIT-C ≥ 5.

### 4. Thang Điểm Đánh Giá Xơ Hóa Không Xâm Lấn: FIB-4 & NFS
Theo Hướng dẫn Hội Tiêu hóa Anh (**BSG 2018 - Gut 2018;67:6-19**) và **BMJ 2025**:
* **NAFLD Fibrosis Score (NFS)**:
  $$\\text{NFS} = -1.675 + 0.037 \\times \\text{Tuổi} + 0.094 \\times \\text{BMI} + 1.13 \\times \\text{IFG/ĐTĐ} + 0.99 \\times (\\text{AST/ALT}) - 0.013 \\times \\text{Tiểu cầu} - 0.66 \\times \\text{Albumin}$$
  * Tuổi < 65: Ngưỡng loại trừ xơ hóa là < -1.455 (NPV ~90%).
  * **Tuổi ≥ 65 (Hiệu chỉnh BSG 2018)**: Ngưỡng loại trừ được nâng lên **< 0.12**!
* **FIB-4 Index**:
  * Tuổi < 65: Nguy cơ thấp < 1.30; Nguy cơ cao > 2.67.
  * **Tuổi ≥ 65 (Hiệu chỉnh BSG 2018 & BMJ 2025)**: Ngưỡng nguy cơ thấp được nâng lên **< 2.00** để tránh chuyển tuyến quá mức không cần thiết do sinh lý lão hóa.

### 5. An Toàn Của Thuốc Hạ Mỡ Nhóm Statin Trên Bệnh Gan
* **Quy tắc < 3x ULN**: Theo BSG 2018 và BMJ 2025, statin **HOÀN TOÀN AN TOÀN** khi transaminase < 3 lần ULN.
* Nguy cơ tử vong hàng đầu ở bệnh nhân MASLD là **biến cố tim mạch** (nhồi máu cơ tim, đột quỵ), chứ không phải suy gan. Việc ngưng statin không đúng chỉ định làm tăng đáng kể nguy cơ tử vong tim mạch.
* Thậm chí, statin còn làm giảm viêm gan thoái hóa mỡ và giảm nguy cơ ung thư biểu mô tế bào gan (HCC).`,
    keyTakeaways: [
      'MASLD thay thế NAFLD, đưa yếu tố tim mạch - chuyển hóa vào định nghĩa chủ động.',
      'MetALD là nhóm bệnh sinh kép (rượu trung bình + chuyển hóa), xơ hóa tiến triển nhanh, cần can thiệp kiêng rượu.',
      'Ở người ≥ 65 tuổi, điểm cắt loại trừ xơ hóa của FIB-4 tăng lên < 2.0 và NFS tăng lên < 0.12.',
      'Statin an toàn và cần thiết ở người MASLD khi men gan < 3x ULN.'
    ]
  },
  {
    id: 'dili-rucam-hla-genetics',
    title: '8. Đánh Giá Tổn Thương Gan Do Thuốc: Thang Điểm RUCAM & Di Truyền Miễn Dịch HLA',
    category: 'Độc chất & Dược lâm sàng',
    readTime: '6 phút',
    summary: 'Nguyên lý 7 miền của thang điểm RUCAM, thời gian khởi phát và thoái lui của các thuốc kinh điển, và đột biến gen HLA nhạy cảm theo DILI Update 2023.',
    contentMarkdown: `### 1. Thang Điểm RUCAM (Roussel Uclaf Causality Assessment Method)
RUCAM là công cụ tính điểm khách quan được **ACG 2017**, **EASL** và bản cập nhật **DILI Update 2023** công nhận là tiêu chuẩn vàng đánh giá mối quan hệ nhân quả giữa thuốc và tổn thương gan:
* **7 Miền đánh giá cốt lõi**:
  1. **Thời gian khởi phát (Time to onset)**: Khởi phát từ 5-90 ngày sau khi bắt đầu dùng thuốc (+2 điểm).
  2. **Diễn tiến sau ngưng thuốc (Dechallenge)**: Men gan giảm ≥ 50% trong vòng 8-30 ngày (+3 điểm đối với thể tế bào gan).
  3. **Yếu tố nguy cơ cơ địa**: Tuổi ≥ 55 (+1), tiêu thụ rượu (+1), mang thai ở thể ứ mật (+1).
  4. **Thuốc dùng đồng thời**: Không dùng thuốc khác (0 điểm); có thuốc dùng cùng có độc tính gan (-2 điểm).
  5. **Loại trừ nguyên nhân ngoài thuốc**: Bilan virus cấp (HAV, HBV, HCV), tự miễn, siêu âm loại trừ tắc mật (+2 điểm nếu âm tính hoàn toàn).
  6. **Dữ liệu độc tính thuốc đã biết**: Có trong tờ thông tin sản phẩm (+2 điểm) hoặc y văn (+1 điểm).
  7. **Tái sử dụng thuốc vô ý (Rechallenge)**: Men gan tăng vọt gấp đôi trở lại (+3 điểm).
* **Phân tầng tổng điểm**:
  * **> 8 điểm**: Rất chắc chắn (Highly probable).
  * **6 – 8 điểm**: Khả năng cao (Probable).
  * **3 – 5 điểm**: Có thể (Possible).
  * **1 – 2 điểm**: Ít khả năng (Unlikely).
  * **≤ 0 điểm**: Đã loại trừ (Excluded).

### 2. Thời Gian Khởi Phát & Hồi Phục Của Một Số Thuốc Phổ Biến (DILI 2023 Update)
Theo biểu đồ động học của Allison et al. (J Toxicol Environ Health 2023):
* **Amoxicillin-Clavulanic Acid (Augmentin)**:
  * Thời gian khởi phát (Latency): 2 – 8 tuần (đặc biệt thường khởi phát **sau khi đã kết thúc đợt kháng sinh 1-4 tuần**).
  * Thời gian hồi phục (Recovery): 4 – 16 tuần (thể ứ mật hồi phục chậm).
* **Isoniazid (INH)**:
  * Latency: 2 – 24 tuần. Thể hoại tử tế bào gan.
* **Diclofenac (NSAIDs)**:
  * Latency: 1 – 12 tuần. Thể tế bào gan hoặc hỗn hợp.

### 3. Di Truyền Miễn Dịch: Đột Biến Gen Kháng Nguyên Bạch Cầu Người (HLA)
Nghiên cứu GWAS hiện đại đã chứng minh DILI đặc ứng (Idiosyncratic DILI) phần lớn có cơ chế miễn dịch qua trung gian tế bào T nhận diện phức hợp thuốc - peptide trên phân tử HLA:
* **Flucloxacillin**: Liên quan mạnh nhất với **HLA-B*57:01** (Odds Ratio = **80.6**!). Thường gây tổn thương thể ứ mật.
* **Amoxicillin-Clavulanate**: Liên quan với **HLA-DRB1*15:01** và **HLA-DQB1*06:02** (Odds Ratio = **9.3**).
* **Allopurinol**: Liên quan với **HLA-B*58:01** (Odds Ratio > **80**), thường đi kèm hội chứng quá mẫn nặng DRESS hoặc Stevens-Johnson.
* **Ticlopidine**: Liên quan với **HLA-A*33:03** (Odds Ratio = **36.5**).
* **Minocycline**: Liên quan với **HLA-B*35:02** (Odds Ratio = **29.6**), thường biểu hiện như viêm gan tự miễn do thuốc (AIH-like DILI).`,
    keyTakeaways: [
      'RUCAM là tiêu chuẩn vàng đánh giá DILI với 7 miền tính điểm khách quan.',
      'Amoxicillin-Clavulanate là nguyên nhân DILI hàng đầu và thường khởi phát sau khi đã ngưng thuốc vài tuần.',
      'Các alen HLA (như HLA-B*57:01, HLA-DRB1*15:01) là bằng chứng khoa học vững chắc về tính nhạy cảm di truyền miễn dịch trong DILI.'
    ]
  },
  {
    id: 'ilft-reflex-isolated-alp',
    title: '9. Chiến Lược Xét Nghiệm Phản Xạ Thông Minh (iLFT) & Xử Trí Tăng ALP Đơn Độc',
    category: 'Chiến lược lâm sàng',
    readTime: '5 phút',
    summary: 'Mô hình xét nghiệm phản xạ tự động iLFT (Dillon et al. / BSG 2018), các bước chuẩn tiếp cận bất thường sinh hóa gan và tầm soát thiếu hụt Vitamin D trong tăng ALP đơn độc (BMJ 2025).',
    contentMarkdown: `### 1. Khái Niệm Xét Nghiệm Phản Xạ Thông Minh (Intelligent LFT - iLFT)
Được phát triển tại Tayside (Scotland) bởi Dillon và cộng sự (J Hepatol 2019) và chuẩn hóa trong **Hướng dẫn BSG 2018**:
* Khi phòng xét nghiệm phát hiện bất thường men gan (ALT, AST, ALP, Bilirubin), hệ thống sẽ **tự động phân tích thuật toán và chỉ định phản xạ (reflex testing)** các xét nghiệm chuyên khoa trên cùng mẫu huyết thanh ban đầu mà không cần bệnh nhân phải quay lại lấy máu nhiều lần.
* **Hiệu quả thực tế**:
  * Tăng tỷ lệ chẩn đoán đúng nguyên nhân thêm **43%**.
  * Phát hiện bệnh gan xơ hóa sớm hơn đáng kể và tiết kiệm chi phí y tế toàn diện.

### 2. Bộ Xét Nghiệm Căn Nguyên Chuẩn (Standard Liver Screen - Tier 1)
Áp dụng cho mọi bệnh nhân có men gan tăng dai dẳng:
1. **Bilan virus**: HBsAg, Anti-HCV (với phản xạ đo HCV RNA nếu kháng thể dương tính).
2. **Bilan tự miễn**: Kháng thể kháng nhân (ANA), Kháng thể cơ trơn (ASMA), Kháng thể kháng ty thể (AMA).
3. **Định lượng Immunoglobulins**:
   * IgG tăng ưu thế: gợi ý Viêm gan tự miễn (AIH).
   * IgM tăng ưu thế: gợi ý Viêm đường mật tiên phát (PBC).
   * IgA tăng: thường gặp trong bệnh gan do rượu.
4. **Bilan sắt**: Ferritin và Độ bão hòa Transferrin (TSAT) (nếu TSAT ≥ 45% -> chỉ định xét nghiệm đột biến gen HFE).
5. **Siêu âm bụng tổng quát (USS Abdomen)**: Đánh giá nhu mô, bờ gan, kích thước lách, đường kính tĩnh mạch cửa và dãn đường mật.

### 3. Tăng Alkaline Phosphatase (ALP) Đơn Độc & Thiếu Hụt Vitamin D
Theo **Clinical Practice Pointer (BMJ 2025;391:e082648)**:
* **Khẳng định nguồn gốc**: Kiểm tra GGT. Nếu GGT bình thường, ALP tăng là nguồn gốc ngoài gan (thường từ xương).
* **Cái bẫy xét nghiệm**: Thiếu hụt Vitamin D là nguyên nhân cực kỳ phổ biến gây tăng ALP đơn độc từ xương (chiếm tới **30% trường hợp tăng ALP lành tính** tại phòng khám ngoại trú).
* **Cơ chế sinh lý bệnh**:
  $$\\text{Thiếu hụt Vitamin D} \\rightarrow \\text{Giảm hấp thu Canxi tại ruột} \\rightarrow \\text{Tụt Canxi ion hóa nhẹ} \\rightarrow \\text{Cường tuyến cận giáp thứ phát (Tăng PTH)} \\rightarrow \\text{Kích hoạt hủy cốt bào và tạo cốt bào} \\rightarrow \\text{Phóng thích ALP xương vào máu}.$$
* **Khuyến cáo hành động**: Luôn định lượng **25-OH Vitamin D** trước khi chỉ định các kỹ thuật chẩn đoán hình ảnh xương phức tạp (chụp xạ hình xương, MRI) và điều trị bổ sung Vitamin D nếu nồng độ < 20-30 ng/mL.`,
    keyTakeaways: [
      'Mô hình iLFT tự động phản xạ làm tăng hiệu quả chẩn đoán bệnh gan lên 43%.',
      'Bilan căn nguyên chuẩn (Tier 1) gồm Virus (HBV/HCV), Tự miễn (ANA/ASMA/AMA), Immunoglobulin, Bilan sắt và Siêu âm.',
      'Tăng ALP đơn độc với GGT bình thường cần nghĩ ngay tới thiếu hụt Vitamin D gây cường cận giáp thứ phát trước khi tầm soát bệnh xương ác tính.'
    ]
  }
];
