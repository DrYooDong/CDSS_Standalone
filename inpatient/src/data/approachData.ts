import { ApproachTopic } from '../types/clinical';

export const APPROACH_TOPICS: ApproachTopic[] = [
  {
    id: 'approach-chest-pain',
    title: 'Tiếp Cận Bệnh Nhân Đau Ngực',
    englishTitle: 'Approach to Chest Pain',
    system: 'cardiovascular',
    urgencyLevel: 'Emergency',
    definition: 'Đau ngực là cảm giác khó chịu, đau tức, đè nặng ở vùng ngực trước, có thể do tổn thương tim mạch, phổi, tiêu hóa, cơ xương hoặc thần kinh.',
    pathophysiology: 'Đau tạng tim (thiếu máu cơ tim) qua sợi giao cảm C7-T4 cho cảm giác mơ hồ, lan lên hàm, cánh tay; đau màng phổi qua dây thần kinh liên sườn và hoành cho cảm giác nhói sắc, tăng khi hít sâu.',
    redFlags: [
      'Đau ngực sau xương ức đè ép dữ dội lan lên hàm, cánh tay trái > 20 phút (Hội chứng vành cấp / STEMI)',
      'Đau ngực xé rách đột ngột lan ra sau lưng giữa hai xương bả vai (Bóc tách động mạch chủ ngực)',
      'Đau ngực kèm tụt huyết áp, nhịp tim nhanh, khó thở đột ngột, SpO2 tụt (Thuyên tắc phổi cấp hoặc Tràn khí màng phổi áp lực)',
      'Nôn dữ dội xong đau ngực dữ dội, tràn khí dưới da vùng cổ (Vỡ thực quản / Hội chứng Boerhaave)',
      'Bệnh nhân vã mồ hôi, da tái lạnh, rối loạn tri giác'
    ],
    keyHistoryQuestions: [
      {
        dimension: 'O - Onset (Khởi phát)',
        question: 'Cơn đau bắt đầu đột ngột dữ dội ngay từ đầu hay tăng dần? Bác đang làm gì khi đau?',
        clinicalMeaning: 'Đau dữ dội đạt đỉnh ngay lập tức gợi ý Bóc tách ĐMC, Thuyên tắc phổi hoặc Tràn khí màng phổi. Đau tăng dần theo kiểu crescendo gợi ý Nhồi máu cơ tim.'
      },
      {
        dimension: 'P - Provoking / Palliating (Yếu tố tăng/giảm)',
        question: 'Đau có tăng khi hít sâu, ho hay xoay trở mình không? Ngồi cúi người ra trước có đỡ không? Dùng thuốc ngậm dưới lưỡi có bớt không?',
        clinicalMeaning: 'Tăng khi hít sâu -> Đau màng phổi (Viêm phổi, PE, Pleurisy). Giảm khi cúi người ra trước -> Viêm màng ngoài tim cấp. Giảm sau ngậm Nitroglycerin 2-5 phút -> Đau thắt ngực do thiếu máu cơ tim.'
      },
      {
        dimension: 'Q - Quality (Tính chất đau)',
        question: 'Bác cảm thấy đau như thế nào: đè nặng như đá đè, bóp nghẹt, xé rách, hay nhói buốt như dao đâm?',
        clinicalMeaning: 'Đè nặng/bóp nghẹt -> Thiếu máu cơ tim (ACS). Xé rách (tearing/ripping) -> Bóc tách ĐMC. Nhói buốt như kim châm/dao đâm -> Màng phổi hoặc thần kinh cơ.'
      },
      {
        dimension: 'R - Radiation (Hướng lan)',
        question: 'Cơn đau có lan đi đâu không? Lên hàm, cổ, vai hay lan xuống cánh tay trái, ra sau lưng?',
        clinicalMeaning: 'Lan hàm, cổ, bờ trong cánh tay trái: ACS. Lan thẳng ra sau lưng giữa hai bả vai: Bóc tách ĐMC.'
      },
      {
        dimension: 'S - Severity (Mức độ đau)',
        question: 'Thang điểm từ 1 đến 10, cơn đau dữ dội mức mấy điểm? Có cảm giác lo âu sợ chết (Angor animi) không?',
        clinicalMeaning: 'Điểm 9-10/10 kèm Angor animi là dấu hiệu cảnh báo NMCT cấp hoặc Bóc tách ĐMC.'
      },
      {
        dimension: 'T - Timing (Thời gian kéo dài)',
        question: 'Cơn đau kéo dài bao lâu: vài giây, 2-10 phút, hay liên tục nhiều giờ?',
        clinicalMeaning: 'Đau thoáng qua vài giây hoặc nhói vài ngày liên tục ít khi là đau thắt ngực. Đau thắt ngực ổn định 2-10 phút. Đau > 20 phút cảnh báo NMCT cấp.'
      }
    ],
    physicalExamFocus: [
      {
        step: 'Sinh hiệu & Tư thế',
        finding: 'Tụt huyết áp + Mạch nhanh + SpO2 giảm',
        meaning: 'Sốc tim, thuyên tắc phổi diện rộng hoặc tràn khí màng phổi áp lực.'
      },
      {
        step: 'Huyết áp 2 tay',
        finding: 'Chênh lệch HA tâm thu giữa 2 tay > 20 mmHg',
        meaning: 'Bóc tách động mạch chủ type A tổn thương thân cánh tay đầu hoặc ĐM dưới đòn T.'
      },
      {
        step: 'Nghe tim',
        finding: 'Tiếng thổi tâm trương mới xuất hiện ở đáy tim',
        meaning: 'Hở van ĐMC cấp do bóc tách ĐMC lan vào gốc van.'
      },
      {
        step: 'Khám ngực & phổi',
        finding: 'Một bên phế trường gõ vang, mất rì rào phế nang, khí quản bị đẩy lệch',
        meaning: 'Tràn khí màng phổi áp lực - Cần chọc kim giải áp khoang màng phổi ngay!'
      },
      {
        step: 'Khám chân',
        finding: 'Một bên bắp chân sưng to, nóng đỏ, ấn đau dọc tĩnh mạch',
        meaning: 'Huyết khối tĩnh mạch sâu (DVT) dẫn tới Thuyên tắc phổi (PE).'
      }
    ],
    differentialDiagnosis: [
      {
        category: 'Nguy hiểm tính mạng - Không được bỏ sót (Rule-Out First)',
        diseases: [
          {
            name: 'Hội chứng vành cấp (STEMI / NSTEMI / Unstable Angina)',
            distinguishingFeatures: 'Đau đè nghẹt sau xương ức > 20 phút, vã mồ hôi, buồn nôn, lan tay trái.',
            initialInvestigation: 'ECG 12 chuyển đạo trong vòng 10 phút, Troponin hs I/T mẫu 0h và 1-2h.',
            priority: 'cannot-miss'
          },
          {
            name: 'Bóc tách động mạch chủ ngực (Aortic Dissection)',
            distinguishingFeatures: 'Đau xé rách khởi phát đột ngột dữ dội lan ra sau lưng, chênh lệch HA 2 tay, tiền sử tăng huyết áp.',
            initialInvestigation: 'Chụp cắt lớp vi tính mạch máu ngực cản quang (CT Angiography). Chống chỉ định dùng thuốc tiêu sợi huyết!',
            priority: 'cannot-miss'
          },
          {
            name: 'Thuyên tắc động mạch phổi (Pulmonary Embolism)',
            distinguishingFeatures: 'Khó thở đột ngột + Đau ngực kiểu màng phổi + Nhịp tim nhanh, yếu tố nguy cơ DVT (bất động, ung thư).',
            initialInvestigation: 'D-dimer (nếu nguy cơ thấp-trung bình), CTA ngực (CTPA), khí máu động mạch, ECG (S1Q3T3).',
            priority: 'cannot-miss'
          },
          {
            name: 'Tràn khí màng phổi áp lực (Tension Pneumothorax)',
            distinguishingFeatures: 'Khó thở cấp dữ dội, lệch khí quản sang bên lành, gõ vang trống, tĩnh mạch cổ nổi, tụt huyết áp.',
            initialInvestigation: 'Chẩn đoán lâm sàng! Không chờ chụp X-quang, chọc kim giải áp khoang liên sườn 2 đường trung đòn ngay.',
            priority: 'cannot-miss'
          },
          {
            name: 'Vỡ thực quản tự phát (Hội chứng Boerhaave)',
            distinguishingFeatures: 'Đau ngực dữ dội sau cơn nôn ói thốc tháo, tràn khí dưới da vùng cổ, tràn khí trung thất.',
            initialInvestigation: 'X-quang ngực, CT ngực uống thuốc cản quang tan trong nước (Gastrografin).',
            priority: 'cannot-miss'
          }
        ]
      },
      {
        category: 'Bệnh lý thường gặp khác (Common Causes)',
        diseases: [
          {
            name: 'Viêm màng ngoài tim cấp (Acute Pericarditis)',
            distinguishingFeatures: 'Đau nhói ngực tăng khi nằm ngửa, giảm rõ rệt khi ngồi cúi người ra trước, tiếng cọ màng tim.',
            initialInvestigation: 'ECG (ST chênh lên lan toả lõm hình đáy chén + PR chênh xuống), Siêu âm tim.',
            priority: 'common'
          },
          {
            name: 'Trào ngược dạ dày thực quản (GERD) / Co thắt thực quản',
            distinguishingFeatures: 'Cảm giác nóng rát sau xương ức sau ăn no hoặc nằm ngửa, ợ chua, giảm khi uống thuốc dạ dày.',
            initialInvestigation: 'Nội soi thực quản dạ dày (OGD), đo pH thực quản.',
            priority: 'common'
          },
          {
            name: 'Viêm khớp ức sườn / Đau cơ thành ngực (Tietze syndrome)',
            distinguishingFeatures: 'Đau nhói nông tại chỗ, ấn tay trực tiếp vào khớp ức sườn tái tạo đúng cơn đau của bệnh nhân.',
            initialInvestigation: 'Khám thực thể ấn đau khu trú, đáp ứng với thuốc giảm đau NSAIDs.',
            priority: 'common'
          }
        ]
      }
    ],
    algorithm: {
      title: 'Lưu đồ Tiếp Cận Đau Ngực Cấp (Chest Pain CDSS)',
      summary: 'Phân tầng nguy cơ đe dọa tính mạng trong 10 phút đầu tiên dựa trên ECG và sinh hiệu',
      startingPoint: 'node-start',
      nodes: [
        {
          id: 'node-start',
          question: 'Bệnh nhân có rối loạn huyết động (Huyết áp < 90, Mạch > 120, SpO2 < 90% hoặc tri giác suy giảm)?',
          options: [
            {
              label: 'CÓ - Nguy kịch (Unstable)',
              targetId: 'node-unstable',
              severity: 'urgent'
            },
            {
              label: 'KHÔNG - Huyết động ổn định',
              targetId: 'node-ecg',
              severity: 'routine'
            }
          ]
        },
        {
          id: 'node-unstable',
          question: 'Xử trí ngay hồi sức ABC: Lập 2 đường truyền lớn, thở oxy, đo ECG tại giường. Khám thấy gì nổi bật?',
          options: [
            {
              label: 'Lồng ngực một bên gõ vang + Lệch khí quản',
              diagnosis: 'Tràn khí màng phổi áp lực (Tension Pneumothorax) -> Chọc kim giải áp KLS 2 đường trung đòn NGAY.',
              severity: 'urgent'
            },
            {
              label: 'Chênh lệch huyết áp 2 tay > 20 mmHg + Đau xé lưng',
              diagnosis: 'Nghi ngờ Bóc tách động mạch chủ ngực -> Hồi sức, kiểm soát HA bằng Esmolol/Labetalol, CTA ngực khẩn cấp.',
              severity: 'urgent'
            },
            {
              label: 'Tụt HA + SpO2 giảm + Chân sưng to (DVT)',
              diagnosis: 'Nghi ngờ Thuyên tắc phổi diện rộng (Massive PE) -> Siêu âm tim tại giường (Bedside Echo), xem xét thuốc tiêu sợi huyết.',
              severity: 'urgent'
            },
            {
              label: 'Tụt huyết áp + ST chênh lên trên ECG',
              diagnosis: 'Nhồi máu cơ tim cấp có sốc tim (Cardiogenic Shock) -> Kích hoạt phòng can thiệp mạch vành (Cathlab) khẩn cấp.',
              severity: 'urgent'
            }
          ]
        },
        {
          id: 'node-ecg',
          question: 'Kết quả ECG 12 chuyển đạo trong 10 phút đầu tiên:',
          options: [
            {
              label: 'ST chênh lên (ST-elevation) ở ít nhất 2 chuyển đạo liên tiếp',
              diagnosis: 'Nhồi máu cơ tim ST chênh lên (STEMI) -> Kích hoạt Cathlab can thiệp PCI thì đầu trong 90-120 phút. Cho Aspirin + Ticagrelor/Clopidogrel + Heparin.',
              severity: 'urgent'
            },
            {
              label: 'ST chênh xuống hoặc T âm sâu đối xứng',
              diagnosis: 'Hội chứng vành cấp không ST chênh lên (NSTEMI / UA) -> Đo Troponin hs, phân tầng thang điểm TIMI/GRACE, dùng thuốc chống đông và kháng kết tập tiểu cầu.',
              severity: 'urgent'
            },
            {
              label: 'ST chênh lên lõm hình thuyền lan toả khắp các chuyển đạo + PR chênh xuống',
              diagnosis: 'Viêm màng ngoài tim cấp (Acute Pericarditis) -> Siêu âm tim, điều trị NSAIDs + Colchicine.',
              severity: 'warning'
            },
            {
              label: 'ECG bình thường hoặc biến đổi không đặc hiệu',
              targetId: 'node-pain-type',
              severity: 'routine'
            }
          ]
        },
        {
          id: 'node-pain-type',
          question: 'Đặc điểm cơn đau ngực của bệnh nhân thế nào?',
          options: [
            {
              label: 'Đau ngực kiểu màng phổi (tăng khi hít sâu/ho) + Khó thở',
              diagnosis: 'Đánh giá nguy cơ Thuyên tắc phổi (Thang điểm Wells score), xét nghiệm D-dimer và chụp CTPA; hoặc Chụp X-quang phổi loại trừ Viêm phổi/Tràn khí màng phổi.',
              severity: 'warning'
            },
            {
              label: 'Ấn vào sụn sườn đau chói tái tạo đúng cơn đau',
              diagnosis: 'Viêm sụn sườn / Đau cơ thành ngực (Costochondritis) -> Trấn an, dùng thuốc chống viêm NSAIDs.',
              severity: 'routine'
            },
            {
              label: 'Nóng rát thượng vị lan lên sau ức, ợ chua sau ăn',
              diagnosis: 'Trào ngược dạ dày thực quản (GERD) -> Thử điều trị thuốc ức chế bơm proton (PPI), theo dõi và nội soi nếu cần.',
              severity: 'routine'
            }
          ]
        }
      ]
    },
    residentClinicalPearls: [
      'Đi buồng: ECG bình thường KHÔNG loại trừ Hội chứng vành cấp! Có tới 5-8% bệnh nhân NSTEMI có ECG ban đầu hoàn toàn bình thường. Phải làm lại ECG sau 15-30 phút nếu cơn đau vẫn tiếp diễn.',
      'Bóc tách động mạch chủ: Tuyệt đối không dùng thuốc tiêu sợi huyết hoặc chống đông nếu chưa loại trừ bóc tách ĐMC, vì sẽ gây tử vong do vỡ động mạch chủ.',
      'Đau ngực ở người cao tuổi, đái tháo đường hoặc phụ nữ thường biểu hiện không điển hình: không đau ngực mà chỉ khó thở đột ngột, mệt lả, tụt huyết áp hoặc lú lẫn.'
    ]
  },
  {
    id: 'approach-dyspnoea',
    title: 'Tiếp Cận Bệnh Nhân Khó Thở',
    englishTitle: 'Approach to Dyspnoea',
    system: 'respiratory',
    urgencyLevel: 'Emergency',
    definition: 'Khó thở (Dyspnoea) là cảm giác chủ quan của người bệnh về việc thở không thoải mái, không đủ không khí, hoặc phải gắng sức để thở.',
    pathophysiology: 'Do mất cân xứng giữa tín hiệu chỉ huy hô hấp từ vỏ não/hành tủy và đáp ứng thông khí cơ học (tải cơ học tăng do tắc nghẽn đường thở, giảm độ giãn nở phổi, hoặc kích thích hóa thụ cảm thể do toan máu, thiếu oxy).',
    redFlags: [
      'Khó thở kèm không nói được trọn câu, thở rên, thở nghịch thường ngực-bụng',
      'Thở nhanh > 30 lần/phút hoặc thở chậm < 10 lần/phút (dấu hiệu kiệt cơ hô hấp)',
      'Tím tái trung ương, SpO2 < 88% dù đã thở oxy',
      'Tụt huyết áp, mạch đảo (Pulsus paradoxus > 10 mmHg)',
      'Lồng ngực im lặng (Silent chest) ở bệnh nhân hen phế quản nặng'
    ],
    keyHistoryQuestions: [
      {
        dimension: 'Thời gian khởi phát (Time course)',
        question: 'Khó thở xuất hiện đột ngột trong vài phút hay tăng dần qua vài ngày đến vài tuần?',
        clinicalMeaning: 'Vài giây đến vài phút: Thuyên tắc phổi, Tràn khí màng phổi, Dị vật đường thở, Phù phổi cấp. Vài ngày: Viêm phổi, Đợt cấp COPD/Hen. Vài tuần-tháng: Bệnh phổi kẽ, Suy tim sung huyết mạn.'
      },
      {
        dimension: 'Tư thế (Positional disposition)',
        question: 'Bác có phải kê nhiều gối khi ngủ (Orthopnoea) không? Có bị thức giấc nửa đêm vì ngạt thở phải ngồi dậy mở cửa sổ (PND) không?',
        clinicalMeaning: 'Khó thở khi nằm phẳng (Orthopnoea) và Khó thở kịch phát về đêm (PND) là dấu hiệu kinh điển của suy tim trái ứ huyết (máu ứ dồn về phổi khi nằm).'
      },
      {
        dimension: 'Triệu chứng hô hấp đi kèm',
        question: 'Có kèm ho khạc đờm mủ đục không? Có nghe tiếng rít cò cử trong ngực không? Có sốt hoặc sút cân không?',
        clinicalMeaning: 'Đờm xanh/vàng + Sốt: Nhiễm trùng phế quản phổi. Khò khè cò cử: Co thắt phế quản (Hen, COPD). Đờm hồng bọt khí: Phù phổi cấp.'
      },
      {
        dimension: 'Tiền sử bệnh lý & Phơi nhiễm',
        question: 'Bác có hút thuốc lá bao nhiêu gói-năm? Có tiền sử bệnh tim mạch, suy thận, hoặc dị ứng không?',
        clinicalMeaning: 'Hút thuốc > 20 gói-năm: COPD, ung thư phổi. Tiền sử nhồi máu cơ tim: Suy tim suy giảm phân suất tống máu (HFrEF).'
      }
    ],
    physicalExamFocus: [
      {
        step: 'Nhìn kiểu thở & cơ hô hấp',
        finding: 'Co kéo cơ liên sườn, cánh mũi phập phồng, thở nghịch thường cơ hoành',
        meaning: 'Kiệt cơ hô hấp, nguy cơ suy hô hấp cấp sắp phải đặt nội khí quản.'
      },
      {
        step: 'Khám tĩnh mạch cổ (JVP)',
        finding: 'JVP nổi cao > 4cm trên góc ức',
        meaning: 'Suy tim phải, suy tim sung huyết hoặc tăng áp động mạch phổi.'
      },
      {
        step: 'Gõ phổi',
        finding: 'Gõ đục như gỗ một bên đáy phổi vs Gõ vang trống',
        meaning: 'Đục: Tràn dịch màng phổi. Vang: Tràn khí màng phổi hoặc khí phế thũng.'
      },
      {
        step: 'Nghe phổi',
        finding: 'Rale nổ ẩm dâng lên nhanh từ hai đáy phổi',
        meaning: 'Cơn phù phổi cấp huyết động (Acute Cardiogenic Pulmonary Oedema).'
      },
      {
        step: 'Nghe tim',
        finding: 'Nhịp tim nhanh kèm tiếng T3 gallop ở mỏm tim',
        meaning: 'Suy tim thất trái cấp hoặc đợt mất bù cấp của suy tim mạn.'
      }
    ],
    differentialDiagnosis: [
      {
        category: 'Nguyên nhân Tim Mạch (Cardiovascular)',
        diseases: [
          {
            name: 'Phù phổi cấp huyết động (Acute Pulmonary Oedema)',
            distinguishingFeatures: 'Khó thở dữ dội khi nằm, ho khạc bọt hồng, rale ẩm hai đáy phổi dâng như nước thủy triều, JVP nổi.',
            initialInvestigation: 'X-quang ngực (hình cánh bướm quanh rốn phổi), NT-proBNP hoặc BNP, Siêu âm tim, Khí máu động mạch.',
            priority: 'cannot-miss'
          },
          {
            name: 'Thuyên tắc động mạch phổi cấp (Pulmonary Embolism)',
            distinguishingFeatures: 'Khó thở đột ngột không giải thích được, đau ngực màng phổi, khám phổi thường "trong sạch" nhưng SpO2 thấp.',
            initialInvestigation: 'Chụp CT mạch máu phổi (CTPA), D-dimer, Siêu âm Doppler tĩnh mạch chi dưới.',
            priority: 'cannot-miss'
          },
          {
            name: 'Chèn ép tim cấp (Cardiac Tamponade)',
            distinguishingFeatures: 'Tam chứng Beck (tụt HA, JVP nổi, tiếng tim mờ), mạch nghịch thường > 10 mmHg.',
            initialInvestigation: 'Siêu âm tim tại giường (thấy tràn dịch màng tim và sụp thất phải thì tâm trương).',
            priority: 'cannot-miss'
          }
        ]
      },
      {
        category: 'Nguyên nhân Hô Hấp (Respiratory)',
        diseases: [
          {
            name: 'Cơn hen phế quản cấp nặng (Acute Severe Asthma)',
            distinguishingFeatures: 'Tiền sử hen, thở rít cò cử thì thở ra kéo dài, lồng ngực căng phồng, nói từng từ ngắt quãng.',
            initialInvestigation: 'Đo đo lưu lượng đỉnh (PEF), Khí máu động mạch (PaCO2 bình thường hoặc tăng là dấu hiệu kiệt sức nguy kịch).',
            priority: 'cannot-miss'
          },
          {
            name: 'Tràn khí màng phổi tự phát (Pneumothorax)',
            distinguishingFeatures: 'Khó thở đột ngột sau cơn đau ngực nhói, gõ vang trống, rì rào phế nang mất hoàn toàn một bên.',
            initialInvestigation: 'X-quang ngực thẳng thì thở ra (thấy viền màng phổi tạng và phế trường sáng không có vân phổi).',
            priority: 'cannot-miss'
          },
          {
            name: 'Viêm phổi mắc phải cộng đồng (CAP)',
            distinguishingFeatures: 'Sốt cao, rét run, ho đờm mủ đục, hội chứng đông đặc (rung thanh tăng, gõ đục, rale nổ khu trú).',
            initialInvestigation: 'X-quang ngực, CTM, CRP/Procalcitonin, cấy đờm và cấy máu.',
            priority: 'common'
          },
          {
            name: 'Đợt cấp bệnh phổi tắc nghẽn mạn tính (AE-COPD)',
            distinguishingFeatures: 'Tiêu chuẩn Anthonisen: Tăng khó thở + Tăng lượng đờm + Đờm mủ đục ở bệnh nhân COPD có tiền sử hút thuốc.',
            initialInvestigation: 'X-quang ngực, Khí máu động mạch (đánh giá toan hô hấp tăng CO2), CRP.',
            priority: 'common'
          }
        ]
      }
    ],
    algorithm: {
      title: 'Lưu đồ Tiếp Cận Khó Thở Cấp (Dyspnoea Diagnostic Flowchart)',
      summary: 'Dựa trên tốc độ khởi phát, X-quang ngực và các chỉ điểm sinh học (Biomarkers)',
      startingPoint: 'node-start',
      nodes: [
        {
          id: 'node-start',
          question: 'Khó thở khởi phát đột ngột trong vòng vài phút đến vài giờ?',
          options: [
            {
              label: 'CÓ - Đột ngột / Cấp tính',
              targetId: 'node-acute',
              severity: 'urgent'
            },
            {
              label: 'KHÔNG - Khó thở mạn tính tiến triển từ từ',
              targetId: 'node-chronic',
              severity: 'routine'
            }
          ]
        },
        {
          id: 'node-acute',
          question: 'Khám phổi và chụp X-quang phổi cấp cứu phát hiện tổn thương gì?',
          options: [
            {
              label: 'Mất vân phổi một bên + Viền lá tạng màng phổi',
              diagnosis: 'Tràn khí màng phổi (Pneumothorax) -> Đặt dẫn lưu màng phổi (Chest tube) hoặc chọc hút.',
              severity: 'urgent'
            },
            {
              label: 'Hình ảnh thâm nhiễm phế nang / Đông đặc có phế quản hơi',
              diagnosis: 'Viêm phổi cấp (Pneumonia) -> Kháng sinh theo kinh nghiệm đường tĩnh mạch, bù dịch, thở oxy.',
              severity: 'warning'
            },
            {
              label: 'Bóng tim to, sung huyết rốn phổi hai bên, đường Kerley B',
              diagnosis: 'Phù phổi cấp / Suy tim ứ huyết -> Furosemide tĩnh mạch, Nitroglycerin truyền tĩnh mạch, thông khí áp lực dương không xâm lấn (CPAP/BiPAP).',
              severity: 'urgent'
            },
            {
              label: 'X-quang phổi BÌNH THƯỜNG hoặc gần như bình thường nhưng bệnh nhân thiếu oxy nặng',
              targetId: 'node-normal-cxr',
              severity: 'urgent'
            }
          ]
        },
        {
          id: 'node-normal-cxr',
          question: 'Bệnh nhân có yếu tố nguy cơ huyết khối (bất động, phẫu thuật gần đây, ung thư, DVT)?',
          options: [
            {
              label: 'CÓ - Nghi ngờ cao Thuyên tắc phổi',
              diagnosis: 'Chụp cắt lớp vi tính động mạch phổi (CTPA) ngay lập tức; điều trị chống đông Heparin trọng lượng phân tử thấp.',
              severity: 'urgent'
            },
            {
              label: 'KHÔNG - Nghe phổi có tiếng thở rít wheezing co thắt',
              diagnosis: 'Cơn hen phế quản cấp hoặc co thắt phế quản -> Phun khí dung Salbutamol + Ipratropium, Corticosteroid toàn thân.',
              severity: 'warning'
            },
            {
              label: 'Bệnh nhân thở nhanh sâu, toan chuyển hoá nặng (Anion gap cao)',
              diagnosis: 'Toan chuyển hoá kích thích thở Kussmaul (DKA, toan lactic, suy thận urê máu cao) -> Kiểm tra khí máu động mạch, đường huyết, chức năng thận.',
              severity: 'urgent'
            }
          ]
        },
        {
          id: 'node-chronic',
          question: 'Đo hô hấp ký (Spirometry) cho kết quả rối loạn thông khí dạng nào?',
          options: [
            {
              label: 'Rối loạn thông khí tắc nghẽn (FEV1/FVC < 0.70)',
              diagnosis: 'COPD hoặc Hen phế quản mạn tính -> Làm test phục hồi phế quản bằng thuốc giãn phế quản.',
              severity: 'routine'
            },
            {
              label: 'Rối loạn thông khí hạn chế (FVC < 80%, FEV1/FVC bình thường)',
              diagnosis: 'Bệnh phổi kẽ (ILD / Xơ phổi), gù vẹo cột sống, béo phì hoặc bệnh thần kinh cơ -> Đo DLCO, chụp HRCT ngực.',
              severity: 'routine'
            }
          ]
        }
      ]
    },
    residentClinicalPearls: [
      'Khí máu động mạch trong cơn hen cấp: Ở người bình thường khó thở thở nhanh, PaCO2 phải GIẢM do tăng thông khí. Nếu bệnh nhân hen cấp mà PaCO2 "BÌNH THƯỜNG" (khoảng 40 mmHg) hoặc TĂNG, đó là báo hiệu KIỆT SỨC HÔ HẤP NGUY KỊCH, sắp ngừng thở!',
      'Siêu âm phổi tại giường (Point-of-Care Ultrasound - POCUS / BLUE Protocol): Chỉ mất 3 phút để phân biệt Tràn dịch màng phổi, Tràn khí màng phổi (mất dấu trượt màng phổi Lung sliding), Phù phổi cấp (hội chứng B-lines lan toả hai bên), Viêm phổi (đông đặc màng phổi).'
    ]
  },
  {
    id: 'approach-abdominal-pain',
    title: 'Tiếp Cận Bệnh Nhân Đau Bụng Cấp',
    englishTitle: 'Approach to Acute Abdominal Pain',
    system: 'gastrointestinal',
    urgencyLevel: 'Emergency',
    definition: 'Đau bụng cấp là tình trạng đau bụng khởi phát đột ngột trong vòng vài giờ đến vài ngày, đòi hỏi phải đánh giá khẩn trương để quyết định can thiệp ngoại khoa hay điều trị nội khoa.',
    pathophysiology: 'Gồm 3 cơ chế: Đau tạng (Visceral pain - căng trướng tạng rỗng hoặc bao tạng đặc, mơ hồ đường giữa); Đau thành (Parietal pain - kích thích phúc mạc thành, khu trú rõ, đau dữ dội liên tục); Đau quy chiếu (Referred pain - do chung khoanh tủy cảm giác).',
    redFlags: [
      'Bụng gồng cứng như gỗ (Board-like rigidity) và cảm ứng phúc mạc lan toả',
      'Dấu hiệu sốc: Tụt huyết áp, mạch nhanh nhỏ, thiểu niệu, chi lạnh vã mồ hôi',
      'Nôn ra máu hoặc đi cầu phân đen/máu tươi số lượng nhiều',
      'Bí trung đại tiện hoàn toàn kèm bụng chướng căng, nôn ra dịch giống phân',
      'Đau bụng dữ dội ở phụ nữ độ tuổi sinh sản kèm trễ kinh (nguy cơ vỡ thai ngoài tử cung)'
    ],
    keyHistoryQuestions: [
      {
        dimension: 'Vị trí ban đầu và vị trí hiện tại',
        question: 'Đau bắt đầu ở đâu và bây giờ đau ở vị trí nào?',
        clinicalMeaning: 'Đau lúc đầu quanh rốn sau chuyển xuống hố chậu phải: Kinh điển của Viêm ruột thừa cấp. Đau hạ sườn phải: Gan mật. Thượng vị xuyên sau lưng: Viêm tụy cấp.'
      },
      {
        dimension: 'Tính chất cơn đau',
        question: 'Đau từng cơn quặn thắt (Colicky) hay đau liên tục dữ dội âm ỉ?',
        clinicalMeaning: 'Đau quặn từng cơn kèm khoảng nghỉ: Tắc ruột cơ học. Đau liên tục dữ dội như dao đâm: Thủng tạng rỗng, Viêm tụy cấp hoại tử, Bóc tách ĐMC bụng.'
      },
      {
        dimension: 'Dấu hiệu tiêu hóa đi kèm',
        question: 'Có nôn ói không? Nôn xong có đỡ đau không? Còn trung tiện (đánh rắm) được không? Đi cầu phân thế nào?',
        clinicalMeaning: 'Nôn xong đỡ đau: Loét dạ dày. Nôn xong không hề đỡ đau: Viêm tụy cấp. Bí trung đại tiện: Tắc ruột.'
      },
      {
        dimension: 'Tiền sử kinh nguyệt (nữ giới)',
        question: 'Kỳ kinh cuối cùng cách đây bao lâu? Có đều không? Có đau bụng lệch một bên kèm ra máu âm đạo bất thường không?',
        clinicalMeaning: 'Loại trừ ngay Thai ngoài tử cung (Ectopic Pregnancy) ở mọi phụ nữ trong độ tuổi sinh đẻ có đau bụng dưới.'
      }
    ],
    physicalExamFocus: [
      {
        step: 'Nhìn thành bụng',
        finding: 'Bụng bất động không di động theo nhịp thở, co cứng gồ cơ thẳng bụng',
        meaning: 'Viêm phúc mạc toàn thể (Peritonitis) do thủng dạ dày hoặc tạng rỗng.'
      },
      {
        step: 'Sờ phát hiện đề kháng',
        finding: 'Đề kháng thành bụng (Involuntary Guarding) và Cảm ứng phúc mạc (Rebound tenderness)',
        meaning: 'Viêm phúc mạc khu trú hoặc toàn thể, chỉ định hội chẩn ngoại khoa khẩn.'
      },
      {
        step: 'Khám các điểm đau ngoại khoa',
        finding: 'Điểm McBurney đau, Dấu hiệu Rovsing (+), Psoas (+), Obturator (+)',
        meaning: 'Viêm ruột thừa cấp tính.'
      },
      {
        step: 'Nghe nhu động ruột',
        finding: 'Nhu động ruột âm sắc kim loại leng keng (Tinkling) vs Im lặng hoàn toàn (Silent abdomen)',
        meaning: 'Leng keng: Tắc ruột cơ học. Im lặng: Liệt ruột hoại tử hoặc viêm phúc mạc.'
      },
      {
        step: 'Khám bẹn và tinh hoàn',
        finding: 'Khối phồng vùng bẹn ấn nghẹt căng đau không đẩy lên được',
        meaning: 'Thoát vị bẹn nghẹt (Strangulated hernia) - Cần mổ cấp cứu tránh hoại tử ruột.'
      }
    ],
    differentialDiagnosis: [
      {
        category: 'Cấp cứu Ngoại khoa (Surgical Emergencies)',
        diseases: [
          {
            name: 'Viêm ruột thừa cấp (Acute Appendicitis)',
            distinguishingFeatures: 'Đau quanh rốn chuyển hố chậu phải, sốt nhẹ, McBurney (+), tăng bạch cầu đa nhân trung tính.',
            initialInvestigation: 'Siêu âm bụng (ruột thừa đường kính > 6mm không xẹp, thâm nhiễm mỡ), CT bụng có cản quang.',
            priority: 'cannot-miss'
          },
          {
            name: 'Thủng tạng rỗng (Perforated Peptic Ulcer)',
            distinguishingFeatures: 'Đau thượng vị đột ngột dữ dội như dao đâm, bụng cứng như gỗ, mất vùng đục trước gan.',
            initialInvestigation: 'X-quang ngực thẳng đứng hoặc bụng đứng không chuẩn bị (tìm liềm hơi dưới vòm hoành).',
            priority: 'cannot-miss'
          },
          {
            name: 'Tắc ruột cơ học (Intestinal Obstruction)',
            distinguishingFeatures: 'Tứ chứng kinh điển: Đau bụng cơn + Nôn ói + Bí trung đại tiện + Bụng chướng quai ruột nổi.',
            initialInvestigation: 'X-quang bụng đứng không sửa soạn (hình ảnh mức nước - mức hơi xếp bậc thang).',
            priority: 'cannot-miss'
          },
          {
            name: 'Vỡ thai ngoài tử cung (Ruptured Ectopic Pregnancy)',
            distinguishingFeatures: 'Nữ giới trễ kinh, đau đột ngột dữ dội hố chậu/hạ vị, tụt HA, phản ứng thành bụng, túi cùng Douglas căng đau.',
            initialInvestigation: 'Quick test thai (nước tiểu), Beta-hCG máu, Siêu âm tử cung phần phụ qua ngả âm đạo.',
            priority: 'cannot-miss'
          },
          {
            name: 'Phình động mạch chủ bụng vỡ/doạ vỡ (Ruptured AAA)',
            distinguishingFeatures: 'Người già hút thuốc, đau bụng/lưng dữ dội đột ngột, khối u đập nảy ngang trên rốn, sốc mất máu.',
            initialInvestigation: 'Siêu âm bụng tại giường cấp cứu, CT Angiography bụng nếu huyết động cho phép.',
            priority: 'cannot-miss'
          }
        ]
      },
      {
        category: 'Bệnh lý Nội khoa & Thường gặp',
        diseases: [
          {
            name: 'Viêm tụy cấp (Acute Pancreatitis)',
            distinguishingFeatures: 'Đau thượng vị dữ dội liên tục lan xuyên ra sau lưng sau bữa ăn thịnh soạn hoặc uống rượu, nôn nhiều không đỡ đau.',
            initialInvestigation: 'Amylase và Lipase máu (Lipase tăng >= 3 lần giới hạn trên bình thường), Siêu âm/CT bụng.',
            priority: 'common'
          },
          {
            name: 'Cơn đau quặn mật / Viêm túi mật cấp (Acute Cholecystitis)',
            distinguishingFeatures: 'Đau hạ sườn phải lan lên vai phải/sau lưng, sốt, nghiệm pháp Murphy (+).',
            initialInvestigation: 'Siêu âm ổ bụng (sỏi kẹt cổ túi mật, thành túi mật dày > 4mm, dịch quanh túi mật).',
            priority: 'common'
          },
          {
            name: 'Cơn đau quặn thận (Renal Colic)',
            distinguishingFeatures: 'Đau quặn dữ dội vùng hố thắt lưng lan xuống bẹn/bìu/môi lớn, đái máu, bệnh nhân lăn lộn không tư thế giảm đau.',
            initialInvestigation: 'Tổng phân tích nước tiểu (hồng cầu vi thể), Siêu âm hệ tiết niệu, CT hệ niệu không cản quang (CT KUB).',
            priority: 'common'
          }
        ]
      }
    ],
    algorithm: {
      title: 'Lưu đồ Tiếp Cận Đau Bụng Cấp theo Khu Vực Giải Phẫu',
      summary: 'Định hướng chẩn đoán nhanh dựa trên vị trí đau ưu thế và dấu hiệu phúc mạc',
      startingPoint: 'node-location',
      nodes: [
        {
          id: 'node-location',
          question: 'Vị trí đau bụng chiếm ưu thế nhất của bệnh nhân ở đâu?',
          options: [
            {
              label: 'Thượng vị (Epigastrium) hoặc Toàn thể có gồng cứng bụng',
              targetId: 'node-epigastric',
              severity: 'urgent'
            },
            {
              label: 'Hạ sườn phải (RUQ)',
              targetId: 'node-ruq',
              severity: 'warning'
            },
            {
              label: 'Hố chậu phải (RLQ)',
              targetId: 'node-rlq',
              severity: 'urgent'
            },
            {
              label: 'Hố chậu trái (LLQ)',
              targetId: 'node-llq',
              severity: 'warning'
            }
          ]
        },
        {
          id: 'node-epigastric',
          question: 'Khám thấy bụng cứng đờ như gỗ, mất vùng đục trước gan?',
          options: [
            {
              label: 'CÓ - Nghi ngờ Thủng tạng rỗng',
              diagnosis: 'Chụp X-quang bụng/ngực đứng tìm liềm hơi dưới hoành -> Hội chẩn phẫu thuật cấp cứu ngoại khoa ngay!',
              severity: 'urgent'
            },
            {
              label: 'KHÔNG - Đau xuyên lưng, nôn nhiều, có yếu tố sỏi mật/rượu',
              diagnosis: 'Nghi ngờ Viêm tụy cấp -> Xét nghiệm Lipase máu (> 3 lần bình thường), Siêu âm bụng, phân tầng thang điểm Balthazar/APACHE II.',
              severity: 'urgent'
            }
          ]
        },
        {
          id: 'node-ruq',
          question: 'Khám thấy nghiệm pháp Murphy dương tính, sốt, kèm vàng da?',
          options: [
            {
              label: 'Có Sốt + Đau hạ sườn P + Vàng da (Tam chứng Charcot)',
              diagnosis: 'Nhiễm trùng đường mật cấp (Acute Cholangitis) -> Kháng sinh phổ rộng, hội chẩn tiêu hóa làm ERCP giải áp đường mật cấp cứu.',
              severity: 'urgent'
            },
            {
              label: 'Murphy (+) đơn thuần, không vàng da, đau sau ăn mỡ',
              diagnosis: 'Viêm túi mật cấp do sỏi -> Làm siêu âm bụng xác định độ dày thành túi mật, chỉ định cắt túi mật nội soi.',
              severity: 'warning'
            }
          ]
        },
        {
          id: 'node-rlq',
          question: 'Bệnh nhân là nữ trong độ tuổi sinh đẻ có trễ kinh hoặc ra máu âm đạo?',
          options: [
            {
              label: 'CÓ - Nguy cơ Thai ngoài tử cung',
              diagnosis: 'Thử que thai khẩn cấp, siêu âm đầu dò âm đạo kiểm tra buồng tử cung và túi cùng Douglas.',
              severity: 'urgent'
            },
            {
              label: 'KHÔNG - Điểm McBurney đau, Dấu hiệu Rovsing (+), sốt nhẹ',
              diagnosis: 'Viêm ruột thừa cấp -> Siêu âm hố chậu phải, chuẩn bị mổ cắt ruột thừa nội soi.',
              severity: 'urgent'
            }
          ]
        },
        {
          id: 'node-llq',
          question: 'Bệnh nhân lớn tuổi có sốt, thay đổi thói quen đại tiện, đau hố chậu trái?',
          options: [
            {
              label: 'CÓ',
              diagnosis: 'Viêm túi thừa đại tràng Sigma (Diverticulitis) -> Chụp CT bụng có cản quang, kháng sinh phổ rộng, tạm nhịn ăn.',
              severity: 'warning'
            },
            {
              label: 'KHÔNG - Đau quặn từng cơn lan xuống bẹn, tiểu máu vi thể',
              diagnosis: 'Sỏi niệu quản trái -> Siêu âm hệ tiết niệu, giảm đau bằng NSAIDs dạng tiêm/uống, chụp CT KUB.',
              severity: 'routine'
            }
          ]
        }
      ]
    },
    residentClinicalPearls: [
      'Nguyên tắc vàng cấp cứu: Ở mọi bệnh nhân nữ trong độ tuổi sinh đẻ có đau bụng dưới, THAI NGOÀI TỬ CUNG luôn phải được loại trừ đầu tiên bằng xét nghiệm nước tiểu hoặc máu, dù bệnh nhân khai kinh nguyệt hoàn toàn đều đặn!',
      'Giảm đau trong đau bụng cấp: Quan niệm cổ điển "không được cho thuốc giảm đau vì sợ làm lu mờ triệu chứng ngoại khoa" hiện nay đã lỗi thời! Sau khi đánh giá ban đầu, cần dùng giảm đau thích hợp (paracetamol, chống co thắt hoặc opioid liều dò) để người bệnh đỡ vật vã và hợp tác khám bụng chính xác hơn.',
      'Người cao tuổi đau bụng cấp: Thường không có sốt cao, không có phản ứng thành bụng rầm rộ dù ruột đã hoại tử thủng phúc mạc, vì cơ thành bụng teo mỏng và đáp ứng miễn dịch suy giảm.'
    ]
  },
  {
    id: 'approach-jaundice',
    title: 'Tiếp Cận Bệnh Nhân Vàng Da (Jaundice)',
    englishTitle: 'Approach to Jaundice',
    system: 'gastrointestinal',
    urgencyLevel: 'Urgent',
    definition: 'Vàng da (Jaundice/Icterus) là tình trạng đổi màu vàng của củng mạc mắt, niêm mạc và da do nồng độ Bilirubin trong máu tăng cao (thường phát hiện lâm sàng khi Bilirubin toàn phần > 50 µmol/L hay 3 mg/dL).',
    pathophysiology: 'Chia làm 3 nhóm lớn: Trước gan (Tăng gián tiếp do tăng sinh Bilirubin quá mức - tan máu); Tại gan (Tổn thương tế bào gan hoặc tắc mật trong gan); Sau gan (Tắc nghẽn đường mật ngoài gan).',
    redFlags: [
      'Tam chứng Charcot (Đau bụng + Sốt rét run + Vàng da) hoặc Ngũ chứng Reynolds (thêm Tụt huyết áp + Rối loạn tri giác): Nhiễm trùng đường mật sốc nhiễm trùng nguy kịch',
      'Vàng da kèm rối loạn đông máu nặng (INR > 1.5) và bệnh não gan (lú lẫn, ngủ gà, run vỗ asterixis): Suy gan cấp (Acute Liver Failure)',
      'Vàng da tiến triển nhanh kèm phân bạc màu như phân cò, nước tiểu sẫm màu như nước vối, ngứa dữ dội, sút cân không đau (U đầu tụy hoặc đường mật)'
    ],
    keyHistoryQuestions: [
      {
        dimension: 'Màu sắc phân và nước tiểu',
        question: 'Nước tiểu có sậm màu như trà đặc/nước vối không? Phân có bị bạc màu (trắng xám như phân cò) không?',
        clinicalMeaning: 'Phân bạc màu + Nước tiểu sẫm màu: Chắc chắn là Tắc mật sau gan (Bilirubin trực tiếp bài xuất qua thận, không xuống được ruột). Nước tiểu vàng trong, phân sẫm màu: Tan máu trước gan.'
      },
      {
        dimension: 'Đau bụng và sốt',
        question: 'Có sốt rét run không? Có cơn đau hạ sườn phải dữ dội không?',
        clinicalMeaning: 'Sốt rét run + Đau quặn mật: Sỏi ống mật chủ gây nhiễm trùng đường mật. Vàng da tăng dần KHÔNG ĐAU: U đầu tụy, u bóng Vater, ung thư biểu mô đường mật (Cholangiocarcinoma).'
      },
      {
        dimension: 'Thuốc, rượu và độc chất',
        question: 'Bác có uống rượu bia không? Có dùng Paracetamol liều cao, thuốc bắc, thuốc nam hay thuốc kháng lao gần đây không?',
        clinicalMeaning: 'Ngộ độc Paracetamol, viêm gan do thuốc kháng lao (INH, Rifampicin, Pyrazinamide), viêm gan rượu cấp.'
      },
      {
        dimension: 'Yếu tố nguy cơ lây nhiễm virus',
        question: 'Có tiền sử truyền máu, tiêm chích ma túy, xăm mình, quan hệ tình dục không an toàn không?',
        clinicalMeaning: 'Viêm gan virus B, C cấp hoặc mạn bùng phát.'
      }
    ],
    physicalExamFocus: [
      {
        step: 'Khám củng mạc mắt & niêm mạc dưới lưỡi',
        finding: 'Vàng rực củng mạc mắt dưới ánh sáng tự nhiên',
        meaning: 'Củng mạc mắt giàu elastin nên có ái lực gắn kết đặc biệt mạnh với bilirubin.'
      },
      {
        step: 'Khám da tìm dấu hiệu suy tế bào gan',
        finding: 'Sao mạch (Spider naevi), lòng bàn tay son (Palmar erythema), phù chân, tuần hoàn bàng hệ',
        meaning: 'Bệnh gan mạn tính tiến triển / Xơ gan mất bù.'
      },
      {
        step: 'Sờ hạ sườn phải (Khám túi mật)',
        finding: 'Sờ thấy khối căng tròn nhẵn không đau vùng đáy túi mật (Định luật Courvoisier)',
        meaning: 'Tắc mật do u ác tính chèn ép đường mật ngoài gan (u đầu tụy).'
      },
      {
        step: 'Khám thần kinh tìm Bệnh não gan',
        finding: 'Dấu run vỗ cánh (Asterixis / Flapping tremor) khi giơ thẳng 2 tay ngửa cổ tay',
        meaning: 'Bệnh não gan do tăng nồng độ ammoniac máu và độc chất thần kinh.'
      }
    ],
    differentialDiagnosis: [
      {
        category: 'Sau gan / Tắc mật ngoài gan (Obstructive Jaundice)',
        diseases: [
          {
            name: 'Sỏi ống mật chủ (Choledocholithiasis)',
            distinguishingFeatures: 'Tam chứng Charcot (Đau hạ sườn P -> Sốt rét run -> Vàng da dao động), tiền sử sỏi mật.',
            initialInvestigation: 'Siêu âm gan mật, MRCP (Chụp cộng hưởng từ đường mật tụy), ERCP vừa chẩn đoán vừa lấy sỏi.',
            priority: 'cannot-miss'
          },
          {
            name: 'Ung thư đầu tụy / Ung thư biểu mô đường mật (Cholangiocarcinoma)',
            distinguishingFeatures: 'Vàng da tắc mật tăng dần không đau, sút cân nhanh, ngứa toàn thân, túi mật to (Courvoisier +).',
            initialInvestigation: 'Chụp CT ổ bụng 4 thì có tiêm thuốc cản quang, chất chỉ điểm ung thư CA 19-9.',
            priority: 'cannot-miss'
          }
        ]
      },
      {
        category: 'Tại gan (Hepatocellular Jaundice)',
        diseases: [
          {
            name: 'Viêm gan virus cấp (Hepatitis A, B, C, E)',
            distinguishingFeatures: 'Giai đoạn tiền vàng da mệt mỏi chán ăn sợ mùi thịt cá, sau đó vàng da niêm mạc, gan to hơi đau.',
            initialInvestigation: 'Men gan AST/ALT tăng vọt > 1000 U/L, HBsAg, Anti-HBc IgM, Anti-HCV, Anti-HAV IgM.',
            priority: 'common'
          },
          {
            name: 'Viêm gan do thuốc / Độc chất (DILI)',
            distinguishingFeatures: 'Tiền sử dùng thuốc (Paracetamol, kháng lao, NSAIDs, thực phẩm chức năng lạ) trong vòng vài tuần.',
            initialInvestigation: 'Men gan, định lượng nồng độ Paracetamol máu, đông máu toàn bộ (PT/INR).',
            priority: 'cannot-miss'
          },
          {
            name: 'Hội chứng Gilbert (Tăng Bilirubin gián tiếp lành tính)',
            distinguishingFeatures: 'Người trẻ, vàng mắt nhẹ thoáng qua khi nhịn đói, stress, mất ngủ hoặc nhiễm lạnh, men gan hoàn toàn bình thường.',
            initialInvestigation: 'Bilirubin gián tiếp tăng nhẹ (< 80 µmol/L), các xét nghiệm chức năng gan và siêu âm gan bình thường.',
            priority: 'common'
          }
        ]
      },
      {
        category: 'Trước gan / Tan máu (Hemolytic Jaundice)',
        diseases: [
          {
            name: 'Thiếu máu tan máu (Hemolytic Anaemia)',
            distinguishingFeatures: 'Da vàng rơm nhạt kèm da xanh tái thiếu máu, lách to, nước tiểu sẫm do urobilinogen.',
            initialInvestigation: 'Tổng phân tích tế bào máu, hồng cầu lưới tăng cao, Haptoglobin giảm, Test Coombs trực tiếp.',
            priority: 'cannot-miss'
          }
        ]
      }
    ],
    algorithm: {
      title: 'Lưu đồ Tiếp Cận Vàng Da Dựa Trên Bilirubin và Siêu Âm',
      summary: 'Phân định bước đầu giữa Tăng Bilirubin gián tiếp và trực tiếp, sau đó khảo sát giãn đường mật',
      startingPoint: 'node-bili',
      nodes: [
        {
          id: 'node-bili',
          question: 'Xét nghiệm Bilirubin toàn phần & thành phần: Loại Bilirubin nào chiếm ưu thế?',
          options: [
            {
              label: 'Tăng Bilirubin GIÁN TIẾP chiếm > 80%',
              targetId: 'node-indirect',
              severity: 'routine'
            },
            {
              label: 'Tăng Bilirubin TRỰC TIẾP hoặc Hỗn hợp (> 50% là trực tiếp)',
              targetId: 'node-direct',
              severity: 'warning'
            }
          ]
        },
        {
          id: 'node-indirect',
          question: 'Bệnh nhân có thiếu máu (Hb giảm) và hồng cầu lưới tăng không?',
          options: [
            {
              label: 'CÓ - Có bằng chứng tan máu',
              diagnosis: 'Thiếu máu tán huyết (Tán huyết miễn dịch, bệnh huyết sắc tố, thiếu men G6PD) -> Làm xét nghiệm Coombs test, Haptoglobin, Phết máu ngoại vi.',
              severity: 'warning'
            },
            {
              label: 'KHÔNG - Máu bình thường, men gan bình thường',
              diagnosis: 'Hội chứng Gilbert (khiếm khuyết gen glucuronyl transferase lành tính) -> Trấn an bệnh nhân, không cần điều trị thuốc.',
              severity: 'routine'
            }
          ]
        },
        {
          id: 'node-direct',
          question: 'Siêu âm gan mật cấp cứu: Đường mật trong và ngoài gan CÓ GIÃN không?',
          options: [
            {
              label: 'CÓ GIÃN ĐƯỜNG MẬT - Tắc mật cơ học sau gan',
              targetId: 'node-obstructive',
              severity: 'urgent'
            },
            {
              label: 'KHÔNG GIÃN ĐƯỜNG MẬT - Tổn thương tế bào gan tại gan',
              targetId: 'node-hepatic',
              severity: 'warning'
            }
          ]
        },
        {
          id: 'node-obstructive',
          question: 'Bệnh nhân có sốt rét run và đau bụng hạ sườn phải không?',
          options: [
            {
              label: 'CÓ - Nghi ngờ Sỏi ống mật chủ kèm Nhiễm trùng đường mật',
              diagnosis: 'Nhiễm trùng đường mật cấp (Tam chứng Charcot) -> Kháng sinh khẩn cấp, làm ERCP gắp sỏi giải áp đường mật.',
              severity: 'urgent'
            },
            {
              label: 'KHÔNG - Vàng da tăng dần không đau, sút cân, túi mật to',
              diagnosis: 'U đầu tụy hoặc u đường mật ác tính -> Chụp CT bụng cản quang/MRCP, hội chẩn phẫu thuật hoặc đặt stent đường mật.',
              severity: 'urgent'
            }
          ]
        },
        {
          id: 'node-hepatic',
          question: 'Men gan AST/ALT tăng ở mức độ nào?',
          options: [
            {
              label: 'Tăng vọt > 1000 U/L',
              diagnosis: 'Viêm gan virus cấp tính (Hepatitis A, B, E) hoặc Hoại tử gan do thuốc (Paracetamol, độc chất). Cần theo dõi sát đông máu INR đề phòng suy gan cấp!',
              severity: 'urgent'
            },
            {
              label: 'Tăng vừa phải (< 500 U/L), ALP và GGT tăng ưu thế',
              diagnosis: 'Viêm gan mạn tính, Xơ gan, Viêm đường mật tiên phát (PBC) hoặc Viêm gan do rượu (AST/ALT > 2).',
              severity: 'warning'
            }
          ]
        }
      ]
    },
    residentClinicalPearls: [
      'Điểm khám vàng da nhạy nhất: Củng mạc mắt (dưới ánh sáng tự nhiên ban ngày, không dùng đèn vàng) và niêm mạc mặt dưới lưỡi. Không nhầm với chứng tăng caroten máu (ăn nhiều cà rốt, đu đủ): Caroten làm vàng da lòng bàn tay bàn chân nhưng HOÀN TOÀN KHÔNG làm vàng củng mạc mắt.',
      'Theo dõi suy gan cấp: Dấu hiệu cảnh báo suy gan cấp tối khẩn cấp không phải là nồng độ Bilirubin hay men gan, mà chính là TỶ LỆ PROTHROMBIN (PT/INR) kéo dài và RỐI LOẠN Ý THỨC (bệnh não gan).'
    ]
  },
  {
    id: 'approach-coma',
    title: 'Tiếp Cận Hôn Mê & Rối Loạn Ý Thức',
    englishTitle: 'Approach to Altered Mental Status & Coma',
    system: 'neurological',
    urgencyLevel: 'Emergency',
    definition: 'Hôn mê (Coma) là tình trạng mất ý thức sâu và không thể đánh thức được, người bệnh không có phản ứng có ý thức với môi trường xung quanh dù bị kích thích đau mạnh.',
    pathophysiology: 'Tổn thương cấu trúc trực tiếp hoặc ức chế chuyển hóa hệ thống lưới hoạt hóa hướng lên (Reticular Activating System - ARAS) ở thân não hoặc cả hai bán cầu đại não lan toả.',
    redFlags: [
      'Hôn mê khởi phát đột ngột kèm dấu thần kinh khu trú (đột quỵ xuất huyết não/nhồi máu não diện rộng)',
      'Đồng tử một bên giãn to cố định mất phản xạ ánh sáng (dấu hiệu thoát vị hồi móc thái dương chèn ép dây III)',
      'Tam chứng Cushing: Tăng huyết áp kịch phát + Nhịp tim chậm + Thở bất thường (đe doạ tụt não sắp tử vong)',
      'Hôn mê kèm sốt cao, co giật liên tục hoặc cứng gáy (viêm màng não, viêm não)',
      'Đường huyết mao mạch < 2.8 mmol/L (Hạ đường huyết gây tổn thương não không hồi phục nếu không cấp cứu trong vài phút)'
    ],
    keyHistoryQuestions: [
      {
        dimension: 'Tốc độ khởi phát & Hoàn cảnh xảy ra',
        question: 'Người nhà thấy bệnh nhân bất tỉnh từ khi nào? Đột ngột ngã quỵ hay lơ mơ ngủ gà tăng dần qua nhiều ngày?',
        clinicalMeaning: 'Đột ngột trong tích tắc: Xuất huyết não, Nhồi máu thân não, Xuất huyết dưới nhện, Co giật. Tăng dần: Rối loạn chuyển hoá (hôn mê gan, toan DKA, tăng ure máu), u não, viêm màng não mủ.'
      },
      {
        dimension: 'Thuốc và độc chất xung quanh',
        question: 'Tại hiện trường có vỉ thuốc ngủ, thuốc an thần, bơm kim tiêm hay vỏ rượu bia không? Bệnh nhân có bệnh trầm cảm không?',
        clinicalMeaning: 'Ngộ độc thuốc an thần Benzodiazepine, thuốc phiện Opioids, ngộ độc Paracetamol, ngộ độc rượu.'
      },
      {
        dimension: 'Tiền sử bệnh mạn tính',
        question: 'Bệnh nhân có tiền sử đái tháo đường đang dùng Insulin, suy thận lọc máu, xơ gan hay động kinh không?',
        clinicalMeaning: 'Hạ đường huyết do quá liều insulin, Hôn mê tăng áp lực thẩm thấu, Hôn mê gan, Hôn mê urê huyết cao.'
      }
    ],
    physicalExamFocus: [
      {
        step: 'Thang điểm Glasgow & Dấu sinh tồn',
        finding: 'GCS ≤ 8 điểm, rối loạn nhịp thở (Cheyne-Stokes hoặc Ataxic)',
        meaning: 'Tổn thương thân não nặng, chỉ định đặt ống nội khí quản bảo vệ đường thở khẩn cấp.'
      },
      {
        step: 'Khám đồng tử (Pupillary Reflex)',
        finding: 'Đồng tử co nhỏ như đầu đinh ghim (Pinpoint < 1mm) phản xạ ánh sáng yếu',
        meaning: 'Ngộ độc Opioid hoặc Xuất huyết cầu não (Pontine haemorrhage).'
      },
      {
        step: 'Đồng tử một bên giãn to cố định',
        finding: 'Một bên đồng tử giãn 5-7mm không co khi soi đèn',
        meaning: 'Tụt não thùy thái dương (Uncal herniation) chèn ép dây III cùng bên -> Cần chụp CT đầu và can thiệp ngoại thần kinh ngay.'
      },
      {
        step: 'Phản xạ mắt búp bê (Oculocephalic Reflex)',
        finding: 'Mắt di chuyển ngược hướng xoay đầu (bình thường) vs Mắt nằm đờ ra xoay theo đầu (mất phản xạ)',
        meaning: 'Mất phản xạ mắt búp bê chứng tỏ tổn thương cấu trúc cầu não và trung não nặng nề.'
      },
      {
        step: 'Vận động & Trương lực',
        finding: 'Tư thế mất vỏ (Decorticate: 2 tay gấp cứng, 2 chân duỗi) vs Tư thế mất não (Decerebrate: 2 tay duỗi xoay trong, 2 chân duỗi cứng)',
        meaning: 'Mất vỏ: Tổn thương trên nhân đỏ (bán cầu/bao trong). Mất não: Tổn thương dưới nhân đỏ (thân não - tiên lượng rất xấu).'
      }
    ],
    differentialDiagnosis: [
      {
        category: 'Nguyên nhân chuyển hóa / Nhiễm độc (Toxic-Metabolic Coma)',
        diseases: [
          {
            name: 'Hạ đường huyết cấp (Severe Hypoglycaemia)',
            distinguishingFeatures: 'Vã mồ hôi đầm đìa, mạch nhanh, da tái lạnh, đồng tử giãn nhẹ, hôn mê sâu có thể co giật.',
            initialInvestigation: 'Bấm đường huyết mao mạch tại giường (Dextrostix). Phải làm NGAY LẬP TỨC!',
            priority: 'cannot-miss'
          },
          {
            name: 'Ngộ độc Opioid (Heroin, Morphine, Fentanyl)',
            distinguishingFeatures: 'Tam chứng ngộ độc: Ức chế hô hấp (thở chậm < 8 l/p) + Đồng tử co nhỏ đầu đinh ghim + Hôn mê.',
            initialInvestigation: 'Thử đáp ứng tiêm tĩnh mạch Naloxone 0.4 - 2 mg; xét nghiệm độc chất nước tiểu.',
            priority: 'cannot-miss'
          },
          {
            name: 'Hôn mê toan Ceton đái tháo đường (DKA) / Tăng áp lực thẩm thấu (HHS)',
            distinguishingFeatures: 'Thở nhanh sâu Kussmaul có mùi táo thối/acetone, mất nước nặng, da khô nóng, đường huyết tăng vọt > 25-35 mmol/L.',
            initialInvestigation: 'Khí máu động mạch, Ceton máu/nước tiểu, Điện giải đồ tính khoảng trống Anion gap.',
            priority: 'cannot-miss'
          },
          {
            name: 'Bệnh não gan (Hepatic Encephalopathy)',
            distinguishingFeatures: 'Tiền sử xơ gan, vàng da, cổ trướng, dấu sao mạch, mùi gan fetor hepaticus trên hơi thở.',
            initialInvestigation: 'Amoniac máu (NH3), men gan, đông máu PT/INR, điện giải.',
            priority: 'common'
          }
        ]
      },
      {
        category: 'Nguyên nhân cấu trúc / Thần kinh (Structural Coma)',
        diseases: [
          {
            name: 'Đột quỵ xuất huyết não diện rộng hoặc nhồi máu não thân não',
            distinguishingFeatures: 'Khởi phát đột ngột, liệt nửa người, liệt dây sọ đối bên, đồng tử bất đối xứng.',
            initialInvestigation: 'Chụp CT sọ não không cản quang cấp cứu.',
            priority: 'cannot-miss'
          },
          {
            name: 'Chấn thương sọ não (Máu tụ ngoài màng cứng / dưới màng cứng)',
            distinguishingFeatures: 'Có khoảng tỉnh (Lucid interval) sau chấn thương đầu rồi hôn mê nhanh, đồng tử giãn một bên.',
            initialInvestigation: 'Chụp CT sọ não khẩn cấp (thấy hình thấu kính hai mặt lồi hoặc hình trăng khuyết).',
            priority: 'cannot-miss'
          },
          {
            name: 'Viêm màng não mủ / Viêm não',
            distinguishingFeatures: 'Sốt cao, cứng gáy, dấu Kernig (+), ban xuất huyết hoại tử (Não mô cầu).',
            initialInvestigation: 'Chụp CT não loại trừ khối choán chỗ, sau đó chọc dò dịch não tủy (CSF analysis).',
            priority: 'cannot-miss'
          }
        ]
      }
    ],
    algorithm: {
      title: 'Lưu đồ Cấp Cứu Hôn Mê Tiếp Cận ABC-DEFG',
      summary: 'Quy tắc "Don’t Ever Forget Glucose" và phân biệt tổn thương chuyển hóa vs tổn thương cấu trúc',
      startingPoint: 'node-abc',
      nodes: [
        {
          id: 'node-abc',
          question: 'Hồi sức ABC: Đường thở có thông suốt không? Thở có tự chủ tốt không? Mạch và HA thế nào?',
          options: [
            {
              label: 'Thở chậm < 10 l/p, tắc nghẽn đờm dãi, GCS ≤ 8',
              diagnosis: 'Đặt nội khí quản thở máy ngay lập tức để bảo vệ đường thở và oxy hóa não!',
              severity: 'urgent'
            },
            {
              label: 'Đường thở ổn định tạm thời',
              targetId: 'node-defg',
              severity: 'routine'
            }
          ]
        },
        {
          id: 'node-defg',
          question: 'Quy tắc DEFG: Đo đường huyết mao mạch (Dextrostix) cho kết quả gì?',
          options: [
            {
              label: 'Đường huyết < 3.0 mmol/L (< 54 mg/dL)',
              diagnosis: 'HẠ ĐƯỜNG HUYẾT CẤP -> Bơm tĩnh mạch ngay 50ml Glucose 20-30% hoặc 100ml Glucose 10%. Đánh giá lại tri giác sau 5 phút.',
              severity: 'urgent'
            },
            {
              label: 'Đường huyết bình thường hoặc tăng cao',
              targetId: 'node-pupils',
              severity: 'routine'
            }
          ]
        },
        {
          id: 'node-pupils',
          question: 'Khám đồng tử: Kích thước và phản xạ ánh sáng của đồng tử hai mắt như thế nào?',
          options: [
            {
              label: 'Đồng tử co nhỏ như đầu đinh ghim (< 1mm) hai bên',
              diagnosis: 'Nghi ngờ Ngộ độc Opiate -> Tiêm tĩnh mạch Naloxone 0.4mg lặp lại; hoặc Xuất huyết cầu não.',
              severity: 'urgent'
            },
            {
              label: 'Đồng tử bất đối xứng: Một bên giãn to mất phản xạ ánh sáng',
              diagnosis: 'Dấu hiệu chèn ép tụt não thùy thái dương -> Chụp CT sọ não cấp cứu, dùng dung dịch ưu trương (Mannitol hoặc NaCl 3%), mời phẫu thuật thần kinh.',
              severity: 'urgent'
            },
            {
              label: 'Đồng tử hai bên tròn đều, co tốt với ánh sáng',
              targetId: 'node-focal',
              severity: 'warning'
            }
          ]
        },
        {
          id: 'node-focal',
          question: 'Bệnh nhân có dấu thần kinh khu trú (liệt nửa người, méo miệng) hoặc hội chứng màng não không?',
          options: [
            {
              label: 'CÓ DẤU KHU TRÚ',
              diagnosis: 'Bệnh lý cấu trúc não bộ (Đột quỵ não, máu tụ nội sọ, u não) -> Đi chụp CT hoặc MRI sọ não cấp cứu.',
              severity: 'urgent'
            },
            {
              label: 'KHÔNG CÓ DẤU KHU TRÚ (Cổ mềm, tứ chi mềm đều)',
              diagnosis: 'Hôn mê do căn nguyên Chuyển hóa / Độc chất / Toan kiềm / Nhiễm trùng toàn thân -> Xét nghiệm bộ khí máu, độc chất, chức năng gan thận, amoniac, điện giải đồ.',
              severity: 'warning'
            }
          ]
        }
      ]
    },
    residentClinicalPearls: [
      'Khắc cốt ghi tâm công thức cấp cứu "COMA COCKTAIL": 1) Oxy; 2) Glucose ưu trương (trừ khi đã bấm que đường huyết bình thường); 3) Thiamine (Vitamin B1 100mg trước khi truyền đường ở người nghiện rượu để ngừa hội chứng não Wernicke); 4) Naloxone (nếu nghi ngờ ngộ độc thuốc phiện).',
      'Đồng tử trong hôn mê: Nếu đồng tử hai bên vẫn còn phản xạ ánh sáng (dù co nhỏ hay giãn vừa), 90% căn nguyên là do Rối loạn chuyển hóa hoặc ngộ độc thuốc. Nếu mất phản xạ ánh sáng hoặc đồng tử bất đối xứng, khả năng rất cao là tổn thương cấu trúc thân não hoặc thoát vị não!'
    ]
  },
  {
    id: 'approach-weakness',
    title: 'Tiếp Cận Bệnh Nhân Yếu Cơ & Liệt',
    englishTitle: 'Approach to Weakness & Motor Deficit',
    system: 'neurological',
    urgencyLevel: 'Urgent',
    definition: 'Yếu cơ (Weakness) là tình trạng giảm sức mạnh co bóp chủ động của cơ bắp, cần phân biệt với cảm giác mệt mỏi toàn thân (Asthenia/Fatigue).',
    pathophysiology: 'Tổn thương bất kỳ khâu nào trong chuỗi vận động: Vỏ não vận động -> Bó tháp -> Tủy sống -> Rễ thần kinh -> Đám rối -> Dây thần kinh ngoại biên -> Khớp nối thần kinh-cơ (NMJ) -> Sợi cơ.',
    redFlags: [
      'Yếu cơ tiến triển tăng dần từ ngón chân lan lên ngực kèm khó thở (Hội chứng Guillain-Barré đe dọa suy hô hấp)',
      'Liệt nửa người khởi phát đột ngột trong vòng 4.5 giờ (Cửa sổ vàng tiêu sợi huyết điều trị đột quỵ thiếu máu não)',
      'Liệt hai chi dưới kèm mất cảm giác tầng sinh môn và bí tiểu (Hội chứng chèn ép tủy sống cấp hoặc hội chứng chùm đuôi ngựa)',
      'Yếu cơ hô hấp, sụp mi, khó nuốt tăng nặng vào cuối ngày (Cơn nhược cơ tối cấp - Myasthenic crisis)'
    ],
    keyHistoryQuestions: [
      {
        dimension: 'Phân bố giải phẫu của sự yếu cơ',
        question: 'Yếu ở đâu: Nửa người (tay và chân cùng bên), hai chân, hay chỉ ở ngọn chi (bàn tay, bàn chân) hoặc gốc chi (vai, đùi)?',
        clinicalMeaning: 'Liệt nửa người: Bán cầu não đối bên. Liệt 2 chân: Tủy sống. Yếu gốc chi (khó chải đầu, khó đứng dậy khỏi ghế): Bệnh cơ (Myopathy). Yếu ngọn chi (khó cài khuy áo, vấp ngón chân): Bệnh thần kinh ngoại biên.'
      },
      {
        dimension: 'Tính chất mỏi cơ theo thời gian',
        question: 'Sức cơ có bị yếu tăng dần khi làm việc và hồi phục sau khi nghỉ ngơi không? Buổi sáng thức dậy thấy khỏe hơn buổi chiều tối?',
        clinicalMeaning: 'Hiện tượng mỏi cơ dao động trong ngày là dấu hiệu đặc trưng của bệnh lý khớp nối thần kinh - cơ (Nhược cơ Myasthenia Gravis).'
      },
      {
        dimension: 'Rối loạn cảm giác và cơ vòng đi kèm',
        question: 'Có kèm tê bì, mất cảm giác không? Có bị bí tiểu hoặc tiểu đại tiện không tự chủ không?',
        clinicalMeaning: 'Có rối loạn cơ vòng + Rối loạn cảm giác có ranh giới mức tủy -> Tổn thương tủy sống. Yếu cơ đơn thuần KHÔNG có rối loạn cảm giác: Bệnh sừng trước tủy (ALS), Nhược cơ hoặc Bệnh cơ.'
      }
    ],
    physicalExamFocus: [
      {
        step: 'Khám trương lực cơ (Tone)',
        finding: 'Tăng trương lực kiểu co cứng (Spasticity) vs Giảm trương lực mềm nhẽo (Flaccidity)',
        meaning: 'Tăng: Tổn thương nơron vận động trên (UMN). Giảm: Tổn thương nơron vận động dưới (LMN) hoặc sốc tủy giai đoạn cấp.'
      },
      {
        step: 'Khám phản xạ gân xương (DTRs)',
        finding: 'Tăng nhạy, đa động, có giật cơ (Clonus) vs Mất phản xạ gân xương',
        meaning: 'Tăng: UMN (đột quỵ, chèn ép tủy). Mất/giảm: LMN (viêm đa rễ dây thần kinh, bệnh thần kinh ngoại biên).'
      },
      {
        step: 'Khám phản xạ da lòng bàn chân',
        finding: 'Dấu hiệu Babinski dương tính (ngón cái duỗi ngược, xòe nan quạt)',
        meaning: 'Khẳng định tổn thương đường dẫn truyền bó tháp (Corticospinal tract).'
      },
      {
        step: 'Tìm dấu hiệu teo cơ & Rung giật bó cơ',
        finding: 'Teo cơ nhanh chóng kèm rung giật sợi cơ (Fasciculations)',
        meaning: 'Tổn thương sừng trước tủy (Bệnh xơ cứng cột bên teo cơ - ALS).'
      }
    ],
    differentialDiagnosis: [
      {
        category: 'Tổn thương Nơron vận động trên (UMN Lesions)',
        diseases: [
          {
            name: 'Đột quỵ nhồi máu não / Xuất huyết não',
            distinguishingFeatures: 'Liệt nửa người đột ngột, méo miệng cùng bên liệt (liệt VII trung ương), nói ngọng, phản xạ gân xương tăng, Babinski (+).',
            initialInvestigation: 'Chụp CT sọ não không cản quang hoặc MRI não khẩn cấp.',
            priority: 'cannot-miss'
          },
          {
            name: 'Chèn ép tủy sống cấp tính (Spinal Cord Compression)',
            distinguishingFeatures: 'Liệt hai chân tăng dần, có ranh giới mất cảm giác rõ rệt trên thân mình, bí tiểu tiện, đau cột sống tại chỗ.',
            initialInvestigation: 'Chụp cộng hưởng từ (MRI) toàn bộ cột sống khẩn cấp để mổ giải áp.',
            priority: 'cannot-miss'
          }
        ]
      },
      {
        category: 'Tổn thương Nơron vận động dưới & Ngoại biên (LMN Lesions)',
        diseases: [
          {
            name: 'Hội chứng Guillain-Barré (Viêm đa rễ dây thần kinh cấp)',
            distinguishingFeatures: 'Yếu cơ gốc và ngọn chi đối xứng tiến triển từ dưới lên trên sau đợt sốt/tiêu chảy, MẤT PHẢN XẠ GÂN XƯƠNG hoàn toàn.',
            initialInvestigation: 'Chọc dò tủy sống (phân ly đạm - tế bào: Protein tăng cao trong khi tế bào bình thường), Đo điện cơ (EMG).',
            priority: 'cannot-miss'
          },
          {
            name: 'Bệnh Nhược Cơ (Myasthenia Gravis)',
            distinguishingFeatures: 'Sụp mi mắt, nhìn đôi, nuốt khó, yếu cơ tay chân thay đổi theo mức độ hoạt động gắng sức, phản xạ gân xương bình thường.',
            initialInvestigation: 'Kháng thể kháng thụ thể Acetylcholine (AChR-Ab), Test Tensilon / Khí dung Neostigmine, Đo điện cơ sợi đơn độc (SFEMG).',
            priority: 'common'
          },
          {
            name: 'Viêm đa cơ / Viêm da cơ (Polymyositis / Dermatomyositis)',
            distinguishingFeatures: 'Yếu cơ gốc chi đối xứng (khó nhấc tay, khó đứng lên khỏi ghế), đau cơ, men cơ tăng cao, có thể kèm ban tím mi mắt (Heliotrope).',
            initialInvestigation: 'Định lượng men cơ CK (Creatine Kinase), Sinh thiết cơ, Kháng thể tự miễn (Anti-Jo-1).',
            priority: 'common'
          }
        ]
      }
    ],
    algorithm: {
      title: 'Lưu đồ Tiếp Cận Chẩn Đoán Yếu Liệt Cơ (Motor Deficit CDSS)',
      summary: 'Phân tầng UMN vs LMN dựa trên trương lực, phản xạ gân xương và dấu Babinski',
      startingPoint: 'node-umn-lmn',
      nodes: [
        {
          id: 'node-umn-lmn',
          question: 'Khám thực thể: Bệnh nhân có tăng phản xạ gân xương, tăng trương lực co cứng và dấu Babinski (+) không?',
          options: [
            {
              label: 'CÓ - Kiểu tổn thương UMN (Trung ương)',
              targetId: 'node-umn-pattern',
              severity: 'urgent'
            },
            {
              label: 'KHÔNG - Giảm trương lực cơ, mất phản xạ gân xương, Babinski (-) (Kiểu LMN / Bệnh cơ)',
              targetId: 'node-lmn-pattern',
              severity: 'warning'
            }
          ]
        },
        {
          id: 'node-umn-pattern',
          question: 'Phân bố của tổn thương yếu liệt kiểu UMN như thế nào?',
          options: [
            {
              label: 'Liệt nửa người (Mặt, tay, chân cùng bên)',
              diagnosis: 'Tổn thương bán cầu đại não hoặc bao trong đối bên (Đột quỵ, U não, Viêm não) -> Chụp CT/MRI sọ não cấp.',
              severity: 'urgent'
            },
            {
              label: 'Liệt hai chân (Paraplegia) kèm rối loạn tiểu tiện và mức cảm giác',
              diagnosis: 'Tổn thương cắt ngang tủy sống (Chèn ép tủy, viêm tủy cắt ngang) -> Chụp MRI cột sống khẩn cấp để mổ giải áp.',
              severity: 'urgent'
            },
            {
              label: 'Liệt tứ chi (Quadriplegia) có rối loạn cảm giác từ cổ trở xuống',
              diagnosis: 'Tổn thương tủy cổ (Cervical cord lesion) -> Cố định cột sống cổ, chụp MRI cột sống cổ.',
              severity: 'urgent'
            }
          ]
        },
        {
          id: 'node-lmn-pattern',
          question: 'Đặc điểm phân bố yếu cơ và rối loạn cảm giác đi kèm ra sao?',
          options: [
            {
              label: 'Yếu cơ tăng dần từ 2 chân lên 2 tay, MẤT PHẢN XẠ GÂN XƯƠNG, không teo cơ cấp',
              diagnosis: 'Hội chứng Guillain-Barré -> Theo dõi sát dung tích sống (FVC), chuẩn bị lọc huyết tương (PE) hoặc IVIG.',
              severity: 'urgent'
            },
            {
              label: 'Yếu cơ dao động trong ngày, mệt mỏi tăng khi gắng sức, sụp mi, KHÔNG rối loạn cảm giác',
              diagnosis: 'Bệnh nhược cơ (Myasthenia Gravis) -> Xét nghiệm kháng thể kháng thụ thể AChR, chụp CT ngực tìm u tuyến ức.',
              severity: 'warning'
            },
            {
              label: 'Yếu cơ gốc chi đối xứng hai bên, đau cơ, KHÔNG có rối loạn cảm giác',
              diagnosis: 'Bệnh lý cơ (Viêm đa cơ Polymyositis, bệnh cơ do thuốc/nội tiết) -> Xét nghiệm men cơ CK, đo điện cơ EMG.',
              severity: 'routine'
            },
            {
              label: 'Teo cơ ngọn chi, yếu cơ kèm RUNG GIẬT BÓ CƠ (Fasciculations), vừa có dấu UMN vừa có LMN',
              diagnosis: 'Bệnh xơ cứng cột bên teo cơ (ALS / Bệnh nơron vận động) -> Đo điện cơ khảo sát 3 vùng giải phẫu.',
              severity: 'warning'
            }
          ]
        }
      ]
    },
    residentClinicalPearls: [
      'Giai đoạn sốc tủy (Spinal Shock) trong chấn thương tủy cấp: Dù là tổn thương nơron vận động trên (UMN) nhưng trong giai đoạn cấp (vài ngày đến vài tuần đầu), các chi liệt lại MỀM NHẼO và MẤT HOÀN TOÀN PHẢN XẠ GÂN XƯƠNG. Phải chờ sau giai đoạn sốc tủy mới xuất hiện tăng trương lực co cứng và tăng phản xạ gân xương.',
      'Quy tắc 20-30-40 trong theo dõi Hội chứng Guillain-Barré: Bệnh nhân có nguy cơ suy hô hấp cần đặt ống thở khi: Dung tích sống (FVC) < 20 ml/kg, Áp lực hít vào tối đa (MIP) < 30 cmH2O, hoặc Áp lực thở ra tối đa (MEP) < 40 cmH2O.'
    ]
  },
  {
    id: 'approach-cough-haemoptysis',
    title: 'Tiếp Cận Ho & Ho Ra Máu',
    englishTitle: 'Approach to Cough & Haemoptysis',
    system: 'respiratory',
    urgencyLevel: 'Emergency',
    definition: 'Ho là phản xạ tống xuất dị vật và đờm dịch khỏi đường thở; Ho mạn tính kéo dài > 8 tuần. Ho ra máu (Haemoptysis) là sự khạc máu từ đường hô hấp dưới thanh môn (cần phân biệt với nôn ra máu và chảy máu mũi họng).',
    pathophysiology: 'Máu có thể xuất phát từ hệ mạch áp lực thấp (Động mạch phổi 10-20 mmHg) hoặc mạch áp lực cao (Động mạch phế quản 100-120 mmHg - 90% các ca ho ra máu ồ ạt đe doạ tính mạng).',
    redFlags: [
      'Ho ra máu sét đánh / ồ ạt: Lượng máu >= 100 ml/giờ hoặc >= 500 ml/24 giờ (nguy cơ tử vong do ngạt thở cấp)',
      'Ho ra máu kèm suy hô hấp, SpO2 tụt, khó thở dữ dội',
      'Ho mạn tính ở bệnh nhân hút thuốc lá kèm sút cân, khó nuốt, khàn tiếng',
      'Đau ngực màng phổi cấp kèm nhịp tim nhanh và ho ra máu (Thuyên tắc phổi)',
      'Tụt huyết áp, sốc mất máu'
    ],
    keyHistoryQuestions: [
      {
        dimension: 'Lượng máu và tốc độ ho ra máu',
        question: 'Bác ho khạc ra mấy cốc/chén máu? Máu đỏ tươi có lẫn bọt khí không?',
        clinicalMeaning: 'Máu từ đường hô hấp dưới có tính kiềm, đỏ tươi và lẫn bọt khí. Phân biệt với nôn ra máu: dịch toan tính axit, màu nâu sẫm bã cà phê, lẫn thức ăn.'
      },
      {
        dimension: 'Thời gian ho (Cấp vs Mạn)',
        question: 'Cơn ho đã kéo dài bao nhiêu tuần? Ho khan hay có đờm?',
        clinicalMeaning: 'Ho < 3 tuần: Nhiễm trùng hô hấp cấp. Ho > 8 tuần: Hội chứng ho đường hô hấp trên (UACS), Hen phế quản thể ho, Trào ngược dạ dày thực quản (GERD), Thuốc ức chế men chuyển ACEi, Lao hoặc Ung thư phổi.'
      },
      {
        dimension: 'Tiền sử bệnh lý phổi',
        question: 'Trước đây bác có từng bị Lao phổi, Giãn phế quản, hoặc sốt về chiều đổ mồ hôi trộm không?',
        clinicalMeaning: 'Lao phổi tiến triển hoặc di chứng giãn phế quản sau lao là nguyên nhân hàng đầu gây ho ra máu nặng tại Việt Nam.'
      },
      {
        dimension: 'Thuốc đang sử dụng',
        question: 'Bác có đang dùng thuốc chống đông máu (Warfarin, NOAC) hay thuốc hạ huyết áp ức chế men chuyển (Enalapril, Perindopril) không?',
        clinicalMeaning: 'Ho khan do ACEi xảy ra ở 10-15% bệnh nhân. Thuốc chống đông làm tăng nặng nguy cơ xuất huyết phế nang.'
      }
    ],
    physicalExamFocus: [
      {
        step: 'Đánh giá đường thở & Huyết động',
        finding: 'Bệnh nhân nghẹn thở, thở rít, co kéo, SpO2 tụt, huyết áp tụt',
        meaning: 'Cấp cứu ho ra máu ngạt thở: Cho nằm nghiêng bên phổi tổn thương, hút thông đường thở, đặt nội khí quản nòng đôi.'
      },
      {
        step: 'Khám toàn trạng',
        finding: 'Ngón tay dùi trống + Sụt cân, hạch thượng đòn to',
        meaning: 'Ung thư phế quản phổi di căn hoặc Giãn phế quản mạn tính.'
      },
      {
        step: 'Nghe phổi',
        finding: 'Rale nổ khu trú vùng đỉnh phổi vs Rale ẩm to hạt rải rác hai đáy',
        meaning: 'Đỉnh phổi: Lao phổi. Đáy phổi: Giãn phế quản bội nhiễm.'
      }
    ],
    differentialDiagnosis: [
      {
        category: 'Nguyên nhân Ho ra máu đe dọa tính mạng (Cannot Miss)',
        diseases: [
          {
            name: 'Giãn phế quản bội nhiễm (Bronchiectasis)',
            distinguishingFeatures: 'Tiền sử ho khạc đờm mủ đục số lượng nhiều hàng ngày từ nhiều năm, ho ra máu tái phát nhiều đợt.',
            initialInvestigation: 'Chụp CT ngực lớp mỏng độ phân giải cao (HRCT ngực - tiêu chuẩn vàng), Cấy đờm.',
            priority: 'cannot-miss'
          },
          {
            name: 'Lao phổi tiến triển (Pulmonary Tuberculosis)',
            distinguishingFeatures: 'Ho kéo dài > 2-3 tuần, sốt nhẹ về chiều, ra mồ hôi đêm, sút cân, thâm nhiễm hoặc hang đỉnh phổi.',
            initialInvestigation: 'Xét nghiệm đờm soi tìm AFB, GeneXpert MTB/RIF, X-quang phổi.',
            priority: 'cannot-miss'
          },
          {
            name: 'Ung thư phế quản phổi (Bronchogenic Carcinoma)',
            distinguishingFeatures: 'Người > 45 tuổi hút thuốc lá nhiều, ho máu dai dẳng vệt máu tươi, khàn giọng (bovoid cough), gầy sút.',
            initialInvestigation: 'Chụp CT ngực có cản quang, Soi phế quản ống mềm sinh thiết khối u.',
            priority: 'cannot-miss'
          },
          {
            name: 'Thuyên tắc động mạch phổi (PE)',
            distinguishingFeatures: 'Khó thở đột ngột, đau ngực màng phổi, ho ra máu ít, nhịp tim nhanh, yếu tố nguy cơ DVT.',
            initialInvestigation: 'CT Angiography động mạch phổi (CTPA), D-dimer.',
            priority: 'cannot-miss'
          }
        ]
      },
      {
        category: 'Nguyên nhân Ho mạn tính thường gặp (> 8 tuần)',
        diseases: [
          {
            name: 'Hội chứng ho đường hô hấp trên (UACS / Chảy mũi sau)',
            distinguishingFeatures: 'Cảm giác vướng đờm ở cổ họng, liên tục tằng hắng giọng, viêm mũi dị ứng, hình ảnh sỏi lát (cobblestone) thành sau họng.',
            initialInvestigation: 'Soi mũi xoang, thử điều trị kháng Histamin H1 + xịt Corticoid tại chỗ.',
            priority: 'common'
          },
          {
            name: 'Hen phế quản thể ho (Cough-Variant Asthma)',
            distinguishingFeatures: 'Ho khan kích phát về đêm hoặc khi gắng sức, lạnh, không nghe thấy khò khè rõ.',
            initialInvestigation: 'Hô hấp ký đo tính phản ứng phế quản (Methacholine challenge test).',
            priority: 'common'
          },
          {
            name: 'Trào ngược dạ dày thực quản (GERD)',
            distinguishingFeatures: 'Ho sau khi nằm hoặc sau ăn no, ợ nóng, khàn tiếng buổi sáng, không có đờm.',
            initialInvestigation: 'Nội soi thực quản dạ dày, thử điều trị PPI liều cao trong 4-8 tuần.',
            priority: 'common'
          },
          {
            name: 'Ho do thuốc ức chế men chuyển (ACEi-induced cough)',
            distinguishingFeatures: 'Bệnh nhân tim mạch/tăng huyết áp đang dùng Enalapril, Captopril, Lisinopril, ho khan ngứa họng liên tục.',
            initialInvestigation: 'Ngừng thuốc ACEi chuyển sang ARB (nhóm ức chế thụ thể), ho sẽ hết trong 1-4 tuần.',
            priority: 'common'
          }
        ]
      }
    ],
    algorithm: {
      title: 'Lưu đồ Tiếp Cận Ho Ra Máu Cấp Cứu',
      summary: 'Phân loại mức độ xuất huyết và xử trí bảo tồn đường thở tức thì',
      startingPoint: 'node-severity',
      nodes: [
        {
          id: 'node-severity',
          question: 'Lượng máu ho ra có nguy kịch (>= 100ml/h hoặc gây suy hô hấp tụt HA)?',
          options: [
            {
              label: 'CÓ - Ho ra máu ồ ạt / Sét đánh (Massive)',
              targetId: 'node-massive',
              severity: 'urgent'
            },
            {
              label: 'KHÔNG - Ho ra máu số lượng ít đến trung bình',
              targetId: 'node-non-massive',
              severity: 'warning'
            }
          ]
        },
        {
          id: 'node-massive',
          question: 'Xử trí cấp cứu: Cho bệnh nhân nằm nghiêng về bên tổn thương (nếu biết). Bước tiếp theo:',
          options: [
            {
              label: 'Có dấu hiệu nghẹt thở suy hô hấp',
              diagnosis: 'Đặt nội khí quản nòng đôi (Double-lumen tube) hoặc đặt NKQ qua soi phế quản hút sạch máu đông, thở máy bảo vệ phổi lành.',
              severity: 'urgent'
            },
            {
              label: 'Huyết động ổn định tạm thời',
              diagnosis: 'Chuyển can thiệp mạch: Chụp mạch và nút tắc động mạch phế quản cấp cứu (BAE - Bronchial Artery Embolization).',
              severity: 'urgent'
            }
          ]
        },
        {
          id: 'node-non-massive',
          question: 'Chụp phim X-quang phổi và làm xét nghiệm đờm cho thấy tổn thương gì?',
          options: [
            {
              label: 'Thâm nhiễm hoặc hang ở phân thùy đỉnh/sau thùy trên',
              diagnosis: 'Nghi ngờ Lao phổi hoạt động -> Làm xét nghiệm AFB nhuộm soi và GeneXpert đờm, cách ly đường hô hấp.',
              severity: 'warning'
            },
            {
              label: 'Khối mờ tròn hoặc xẹp phổi có dày màng phổi, hạch trung thất',
              diagnosis: 'Nghi ngờ Ung thư phổi -> Chụp CT ngực có cản quang, chỉ định nội soi phế quản sinh thiết mô bệnh học.',
              severity: 'urgent'
            },
            {
              label: 'Đường ray xe lửa, bóng sáng nang giãn phế quản',
              diagnosis: 'Đợt bội nhiễm của Giãn phế quản -> Kháng sinh diệt trực khuẩn mủ xanh (Pseudomonas), dẫn lưu tư thế, thuốc cầm máu.',
              severity: 'warning'
            }
          ]
        }
      ]
    },
    residentClinicalPearls: [
      'Tư thế sống còn khi ho ra máu: Cho bệnh nhân nằm nghiêng về BÊN PHỔI CHẢY MÁU để máu không chảy tràn qua phế quản gốc bên đối diện làm ngạt thở phổi lành!',
      'Trong ho mạn tính, "Bộ ba kinh điển" chiếm 85% các trường hợp ở bệnh nhân không hút thuốc có X-quang ngực bình thường là: 1) Chảy mũi sau (UACS); 2) Hen phế quản; 3) Trào ngược dạ dày thực quản (GERD).'
    ]
  },
  {
    id: 'approach-dizziness-vertigo',
    title: 'Tiếp Cận Chóng Mặt & Mất Thăng Bằng',
    englishTitle: 'Approach to Dizziness & Vertigo',
    system: 'neurological',
    urgencyLevel: 'Emergency',
    definition: 'Chóng mặt (Dizziness) là thuật ngữ mơ hồ mà bệnh nhân dùng để mô tả: 1) Chóng mặt xoay tròn thực sự (Vertigo); 2) Choáng váng/Tiền ngất (Presyncope); 3) Mất thăng bằng khi đi lại (Dysequilibrium); 4) Cảm giác lâng lâng tâm lý (Lightheadedness).',
    pathophysiology: 'Vertigo do xung đột thông tin giữa 2 mê đạo tiền đình hoặc thân não/tiểu não. Presyncope do giảm tưới máu não thoáng qua. Dysequilibrium do tổn thương cảm giác sâu, thị giác hoặc tiểu não.',
    redFlags: [
      'Chóng mặt cấp tính kèm nuốt khó, nói ngọng, tê nửa mặt hoặc nhìn đôi (Hội chứng Wallenberg / Nhồi máu hành não sau ngoài)',
      'Nystagmus đập dọc (Vertical nystagmus) hoặc nystagmus đổi hướng theo hướng nhìn (chắc chắn tổn thương trung ương!)',
      'Mất thăng bằng nghiêm trọng đến mức không thể tự ngồi vững trên giường dù hai tay chống đỡ',
      'Đau đầu dữ dội vùng chẩm hoặc đau cổ đột ngột (Bóc tách động mạch đốt sống)',
      'Khám HINTS (Head Impulse - Nystagmus - Test of Skew) chỉ điểm đột quỵ tiểu não'
    ],
    keyHistoryQuestions: [
      {
        dimension: 'Bản chất cảm giác "chóng mặt"',
        question: 'Bác cảm thấy nhà cửa quay cuồng chao đảo quanh mình, hay cảm giác hoa mắt xây xẩm tối sầm mặt lại?',
        clinicalMeaning: 'Nhà cửa xoay tròn: Chóng mặt tiền đình (Vertigo). Hoa mắt tối sầm khi đứng lên: Tiền ngất do tụt huyết áp tư thế (Presyncope).'
      },
      {
        dimension: 'Thời gian kéo dài của mỗi cơn',
        question: 'Mỗi cơn chóng mặt kéo dài bao lâu: vài giây, vài giờ hay liên tục nhiều ngày?',
        clinicalMeaning: 'Vài giây (khi trở mình trên giường): Chóng mặt kịch phát lành tính theo tư thế (BPPV). Vài giờ (kèm ù tai, giảm thính lực): Bệnh Ménière. Nhiều ngày liên tục dữ dội: Viêm thần kinh tiền đình hoặc Đột quỵ tiểu não.'
      },
      {
        dimension: 'Yếu tố khởi kích',
        question: 'Cơn chóng mặt xuất hiện khi xoay đầu, ngửa cổ nhìn lên, hay xuất hiện tự phát khi đang ngồi yên?',
        clinicalMeaning: 'Xoay đầu trên giường -> BPPV. Tự phát kéo dài -> Viêm thần kinh tiền đình hoặc đột quỵ mạch máu não sau.'
      }
    ],
    physicalExamFocus: [
      {
        step: 'Bộ ba nghiệm pháp HINTS (Rất quan trọng!)',
        finding: 'Head Impulse bình thường + Nystagmus đổi hướng + Test of Skew (+)',
        meaning: 'ĐỘT QUỴ TIỂU NÃO / THÂN NÃO (Trung ương). Nhạy hơn cả chụp MRI não trong 24 giờ đầu!'
      },
      {
        step: 'Nghiệm pháp Dix-Hallpike',
        finding: 'Sau 5-15s xuất hiện nystagmus xoay tròn giật lên trên kèm chóng mặt, kéo dài < 30s và mỏi mệt khi lặp lại',
        meaning: 'Chẩn đoán xác định BPPV ống bán khuyên sau. Điều trị khỏi ngay bằng Nghiệm pháp tái định vị sỏi tai Epley.'
      },
      {
        step: 'Đo Huyết áp tư thế',
        finding: 'HA tâm thu tụt > 20 mmHg hoặc tâm trương tụt > 10 mmHg sau đứng 3 phút',
        meaning: 'Hạ huyết áp tư thế (Orthostatic hypotension).'
      }
    ],
    differentialDiagnosis: [
      {
        category: 'Tiền đình Ngoại biên (Peripheral Vertigo - Lành tính)',
        diseases: [
          {
            name: 'Chóng mặt kịch phát lành tính theo tư thế (BPPV)',
            distinguishingFeatures: 'Cơn chóng mặt ngắn < 1 phút khi thay đổi tư thế đầu, Dix-Hallpike (+), thính lực hoàn toàn bình thường.',
            initialInvestigation: 'Nghiệm pháp Dix-Hallpike chẩn đoán, điều trị ngay bằng nghiệm pháp Epley.',
            priority: 'common'
          },
          {
            name: 'Viêm thần kinh tiền đình (Vestibular Neuritis)',
            distinguishingFeatures: 'Chóng mặt dữ dội liên tục nhiều ngày sau nhiễm virus, nôn nhiều, đi lại loạng choạng, KHÔNG giảm thính lực.',
            initialInvestigation: 'Khám HINTS (Head Impulse bất thường sang bên bệnh, nystagmus một hướng), loại trừ đột quỵ bằng MRI não nếu nghi ngờ.',
            priority: 'common'
          },
          {
            name: 'Bệnh Ménière (Ứ dịch nội dịch tai trong)',
            distinguishingFeatures: 'Tam chứng: Cơn chóng mặt 20 phút - vài giờ + Ù tai trầm + Giảm thính lực tiếp nhận tần số thấp + Cảm giác đầy tức tai.',
            initialInvestigation: 'Đo thính lực đồ (Audiometry), MRI góc cầu tiểu não loại trừ u dây thần kinh VIII.',
            priority: 'common'
          }
        ]
      },
      {
        category: 'Tiền đình Trung ương (Central Vertigo - Nguy hiểm)',
        diseases: [
          {
            name: 'Nhồi máu tiểu não hoặc thân não (Cerebellar / Brainstem Stroke)',
            distinguishingFeatures: 'Khám HINTS chỉ điểm trung ương, thất điều chi, nói khó, liệt mặt, nystagmus dọc hoặc đa hướng.',
            initialInvestigation: 'Chụp MRI sọ não xung khuếch tán (DWI MRI).',
            priority: 'cannot-miss'
          }
        ]
      }
    ],
    algorithm: {
      title: 'Lưu đồ Tiếp Cận Chóng Mặt và Khám HINTS',
      summary: 'Phân loại theo thời gian cơn và ứng dụng HINTS protocol loại trừ đột quỵ',
      startingPoint: 'node-vertigo-type',
      nodes: [
        {
          id: 'node-vertigo-type',
          question: 'Chóng mặt kiểu xoay tròn (Vertigo) hay cảm giác choáng váng hoa mắt (Presyncope)?',
          options: [
            {
              label: 'Chóng mặt xoay tròn thực sự (Vertigo)',
              targetId: 'node-timing',
              severity: 'warning'
            },
            {
              label: 'Choáng váng tối sầm mặt khi thay đổi tư thế đứng',
              diagnosis: 'Hạ huyết áp tư thế hoặc Rối loạn nhịp tim -> Đo HA nằm-đứng, làm ECG, đánh giá thuốc hạ áp và thuốc lợi tiểu.',
              severity: 'routine'
            }
          ]
        },
        {
          id: 'node-timing',
          question: 'Thời gian kéo dài của cơn chóng mặt xoay tròn:',
          options: [
            {
              label: 'Cơn rất ngắn (dưới 1 phút), kích phát khi lật trở mình',
              targetId: 'node-dix-hallpike',
              severity: 'routine'
            },
            {
              label: 'Kéo dài 20 phút đến vài giờ, kèm ù tai và giảm thính lực',
              diagnosis: 'Bệnh Ménière -> Đo thính lực đồ, giảm muối trong khẩu phần ăn, thuốc lợi tiểu hoặc Betahistine.',
              severity: 'warning'
            },
            {
              label: 'Chóng mặt liên tục dữ dội kéo dài nhiều ngày (Hội chứng tiền đình cấp)',
              targetId: 'node-hints',
              severity: 'urgent'
            }
          ]
        },
        {
          id: 'node-dix-hallpike',
          question: 'Làm nghiệm pháp Dix-Hallpike: Có xuất hiện nystagmus xoay giật lên sau thời gian tiềm tàng?',
          options: [
            {
              label: 'CÓ - Điển hình',
              diagnosis: 'BPPV (Sỏi ốc tai ống bán khuyên sau) -> Tiến hành thủ thuật xoay chuyển sỏi Epley (Epley Manoeuvre), khỏi ngay tại phòng khám.',
              severity: 'routine'
            },
            {
              label: 'KHÔNG - Nystagmus hướng xuống cố định không mỏi',
              diagnosis: 'Nghi ngờ tổn thương hố sau / dị tật Chiari -> Chỉ định chụp MRI sọ não.',
              severity: 'urgent'
            }
          ]
        },
        {
          id: 'node-hints',
          question: 'Kết quả bộ ba khám HINTS (Head Impulse, Nystagmus, Test of Skew):',
          options: [
            {
              label: 'Bất kỳ dấu hiệu trung ương nào: Head Impulse bình thường HOẶC Nystagmus đổi hướng HOẶC Lệch trục nhãn cầu (Skew)',
              diagnosis: 'CẢNH BÁO ĐỘT QUỴ TIỂU NÃO / THÂN NÃO -> Chụp MRI não khẩn cấp, theo dõi phù não chèn ép thân não.',
              severity: 'urgent'
            },
            {
              label: 'Cả 3 dấu hiệu đều là ngoại biên: Head impulse giật mắt điều chỉnh (bất thường) + Nystagmus 1 hướng duy nhất + Không Skew',
              diagnosis: 'Viêm thần kinh tiền đình cấp (Vestibular Neuritis) -> Corticosteroid ngắn ngày, thuốc chống nôn, tập phục hồi chức năng tiền đình.',
              severity: 'warning'
            }
          ]
        }
      ]
    },
    residentClinicalPearls: [
      'Nghịch lý Head Impulse Test trong khám HINTS: Khi làm nghiệm pháp lắc đầu nhanh (Head Impulse Test), nếu thấy xuất hiện "cử động giật mắt điều chỉnh" (bất thường) thì lại là LÀNH TÍNH (tổn thương tiền đình ngoại biên)! Còn nếu Head Impulse "hoàn toàn bình thường" ở một bệnh nhân đang chóng mặt nystagmus liên tục, thì đó lại là DẤU HIỆU NGUY CƠ CAO CỦA ĐỘT QUỴ TIỂU NÃO!',
      'Nghiệm pháp Epley chữa BPPV: Là can thiệp lâm sàng kỳ diệu nhất trong y khoa. Bệnh nhân có thể khỏi hoàn toàn cơn chóng mặt hành hạ nhiều tháng chỉ sau 5 phút làm thủ thuật nắn sỏi mà không cần bất kỳ viên thuốc nào.'
    ]
  },
  {
    id: 'approach-joint-pain',
    title: 'Tiếp Cận Bệnh Nhân Đau Khớp & Viêm Khớp',
    englishTitle: 'Approach to Joint Pain & Arthritis',
    system: 'musculoskeletal',
    urgencyLevel: 'Urgent',
    definition: 'Đau khớp (Arthralgia) là triệu chứng cơ năng đau ở khớp; Viêm khớp (Arthritis) là tình trạng viêm thực thể với đầy đủ triệu chứng sưng, nóng, đỏ, đau và hạn chế vận động.',
    pathophysiology: 'Viêm khớp nhiễm khuẩn (vi khuẩn xâm nhập ổ khớp phá hủy sụn); Viêm khớp vi tinh thể (tinh thể Urat hoặc Canxi pyrophosphat kích hoạt đại thực bào); Tự miễn (Viêm khớp dạng thấp, Lupus, Viêm cột sống dính khớp); Thoái hoá (Mất cân bằng thoái triển sụn khớp).',
    redFlags: [
      'Viêm một khớp cấp tính: Khớp sưng to, nóng đỏ, đau dữ dội, không thể cử động kèm sốt (Viêm khớp nhiễm khuẩn - CẤP CỨU CẦN CHỌC DÒ KHỚP NGAY!)',
      'Đau khớp kèm sốt cao, ban xuất huyết hoại tử trên da, sút cân nhanh',
      'Đau cột sống thắt lưng kèm sốt, đau gõ gai sống, yếu 2 chân (Viêm đĩa đệm đốt sống nhiễm khuẩn / Áp xe ngoài màng cứng)',
      'Viêm đa khớp kèm tổn thương thận (protein niệu, đái máu) hoặc khó thở'
    ],
    keyHistoryQuestions: [
      {
        dimension: 'Số lượng khớp và tính chất phân bố',
        question: 'Đau một khớp duy nhất (Monoarthritis) hay nhiều khớp (Polyarthritis)? Có đối xứng hai bên cơ thể không?',
        clinicalMeaning: '1 khớp: Viêm khớp nhiễm khuẩn, Gout, Chấn thương. Nhiều khớp đối xứng (khớp bàn ngón, cổ tay): Viêm khớp dạng thấp (RA). Không đối xứng: Viêm khớp vảy nến, Viêm khớp phản ứng.'
      },
      {
        dimension: 'Thời gian cứng khớp buổi sáng',
        question: 'Buổi sáng thức dậy khớp có bị cứng đờ không? Phải mất bao nhiêu phút hoặc tiếng xoa bóp thì mới cử động dễ dàng?',
        clinicalMeaning: 'Cứng khớp buổi sáng > 30-60 phút: Chắc chắn là Bệnh lý Viêm (Inflammatory). Cứng khớp thoáng qua < 15-30 phút: Thoái hoá khớp cơ học (Osteoarthritis).'
      },
      {
        dimension: 'Các biểu hiện ngoài khớp',
        question: 'Có vảy nến ở da/móng không? Có loét miệng, rụng tóc, đỏ mắt hay tiền sử tiêu chảy, nhiễm trùng niệu đạo trước đó không?',
        clinicalMeaning: 'Ban cánh bướm + rụng tóc + loét miệng: Lupus (SLE). Vảy nến + dính móng: Viêm khớp vảy nến. Viêm niệu đạo + viêm kết mạc sau tiêu chảy: Viêm khớp phản ứng (Reiter).'
      }
    ],
    physicalExamFocus: [
      {
        step: 'Khám 4 dấu hiệu viêm',
        finding: 'Khớp sưng phồng do tràn dịch màng hoạt dịch, nóng đỏ rực rỡ, đau chói',
        meaning: 'Viêm khớp nhiễm khuẩn hoặc Cơn Gout cấp.'
      },
      {
        step: 'Khám bàn tay chi tiết',
        finding: 'Hạt Heberden (khớp ngón xa DIP) và Bouchard (khớp ngón gần PIP)',
        meaning: 'Thoái hoá khớp ngón tay (Nodal Osteoarthritis).'
      },
      {
        step: 'Tìm biến dạng khớp giai đoạn muộn',
        finding: 'Bàn tay gió thổi (Ulnar deviation), ngón tay cổ cò (Swan-neck), ngón tay cài khuy (Boutonniere)',
        meaning: 'Di chứng của Viêm khớp dạng thấp (RA) phá hủy dây chằng và sụn khớp.'
      }
    ],
    differentialDiagnosis: [
      {
        category: 'Viêm một khớp cấp tính (Acute Monoarthritis - Rule out Sepsis)',
        diseases: [
          {
            name: 'Viêm khớp nhiễm khuẩn (Septic Arthritis)',
            distinguishingFeatures: 'Sưng nóng đỏ đau dữ dội 1 khớp (hay gặp nhất là khớp gối), sốt, hạn chế vận động tuyệt đối.',
            initialInvestigation: 'Chọc hút dịch khớp làm xét nghiệm tế bào, nhuộm Gram và cấy vi khuẩn NGAY LẬP TỨC.',
            priority: 'cannot-miss'
          },
          {
            name: 'Cơn Gout cấp tính (Acute Gouty Arthritis)',
            distinguishingFeatures: 'Đau dữ dội đạt đỉnh trong 12-24h, hay gặp nhất ở khớp bàn ngón chân cái (khớp ngón I - Podagra), tiền sử tăng axit uric máu.',
            initialInvestigation: 'Soi tươi dịch khớp dưới kính hiển vi phân cực (thấy tinh thể Urat hình kim có tính lưỡng chiết quang âm tính).',
            priority: 'common'
          }
        ]
      },
      {
        category: 'Viêm nhiều khớp mạn tính (Chronic Polyarthritis)',
        diseases: [
          {
            name: 'Viêm khớp dạng thấp (Rheumatoid Arthritis - RA)',
            distinguishingFeatures: 'Nữ giới tuổi trung niên, viêm đối xứng các khớp nhỏ bàn tay (MCP, PIP, cổ tay), cứng khớp sáng > 1h, không tổn thương DIP.',
            initialInvestigation: 'Kháng thể Anti-CCP (rất đặc hiệu), Yếu tố dạng thấp RF, X-quang khớp bàn tay hai bên.',
            priority: 'common'
          },
          {
            name: 'Thoái hoá khớp (Osteoarthritis - OA)',
            distinguishingFeatures: 'Người cao tuổi, đau tăng khi vận động chịu lực, giảm khi nghỉ, cứng khớp sáng < 30 phút, hạt Heberden và Bouchard.',
            initialInvestigation: 'X-quang khớp (4 dấu hiệu kinh điển: hẹp khe khớp không đều, đặc xương dưới sụn, gai xương ở rìa, nang xương dưới sụn).',
            priority: 'common'
          }
        ]
      }
    ],
    algorithm: {
      title: 'Lưu đồ Tiếp Cận Bệnh Nhân Đau Khớp (Joint Pain CDSS)',
      summary: 'Phân loại theo số lượng khớp và tính chất Viêm vs Cơ học',
      startingPoint: 'node-joint-count',
      nodes: [
        {
          id: 'node-joint-count',
          question: 'Số lượng khớp bị tổn thương là bao nhiêu?',
          options: [
            {
              label: 'Một khớp duy nhất (Viêm 1 khớp cấp - Monoarthritis)',
              targetId: 'node-mono',
              severity: 'urgent'
            },
            {
              label: 'Nhiều khớp (Viêm đa khớp - Polyarthritis)',
              targetId: 'node-poly',
              severity: 'warning'
            }
          ]
        },
        {
          id: 'node-mono',
          question: 'Khớp sưng nóng đỏ đau dữ dội: Bước xử trí thiết yếu hàng đầu là gì?',
          options: [
            {
              label: 'CHỌC HÚT DỊCH KHỚP XÉT NGHIỆM KHẨN CẤP',
              diagnosis: 'Phân tích dịch khớp: Bạch cầu > 50.000/mm3 với > 90% bạch cầu đa nhân trung tính -> Viêm khớp nhiễm khuẩn; Tìm tinh thể Urat -> Gout; Tinh thể CPPD hình thoi -> Giả Gout.',
              severity: 'urgent'
            }
          ]
        },
        {
          id: 'node-poly',
          question: 'Thời gian cứng khớp buổi sáng của bệnh nhân kéo dài bao lâu?',
          options: [
            {
              label: 'Cứng khớp sáng kéo dài > 30-60 phút (Đặc trưng của Viêm)',
              targetId: 'node-poly-pattern',
              severity: 'warning'
            },
            {
              label: 'Cứng khớp thoáng qua < 15-30 phút, đau tăng khi đi lại (Đặc trưng Cơ học)',
              diagnosis: 'Thoái hoá khớp (Osteoarthritis) -> Chụp X-quang khớp chịu lực, tập vật lý trị liệu, giảm cân, Paracetamol/NSAIDs.',
              severity: 'routine'
            }
          ]
        },
        {
          id: 'node-poly-pattern',
          question: 'Kiểu phân bố tổn thương khớp có đối xứng hai bên không?',
          options: [
            {
              label: 'Đối xứng hai bên, ưu thế khớp nhỏ cổ tay, bàn ngón tay (MCP, PIP)',
              diagnosis: 'Viêm khớp dạng thấp (RA) hoặc Lupus ban đỏ (SLE) -> Xét nghiệm Anti-CCP, RF, ANA, CRP, chỉ định sớm thuốc DMARDs.',
              severity: 'warning'
            },
            {
              label: 'Không đối xứng, kèm sưng ngón tay hình khúc dồi (Dactylitis) hoặc viêm cột sống',
              diagnosis: 'Bệnh lý cột sống huyết thanh âm tính (Viêm cột sống dính khớp, Viêm khớp vảy nến, Viêm khớp phản ứng) -> Xét nghiệm HLA-B27, chụp MRI khớp cùng chậu.',
              severity: 'warning'
            }
          ]
        }
      ]
    },
    residentClinicalPearls: [
      'Quy tắc vàng về Viêm một khớp cấp: Bất kỳ bệnh nhân nào xuất hiện sưng nóng đỏ đau một khớp cấp tính đều phải xem là VIÊM KHỚP NHIỄM KHUẨN cho đến khi dịch khớp được chọc hút và xét nghiệm loại trừ! Đừng bao giờ vội vàng kết luận là Gout hay tiêm Corticoid vào khớp.',
      'Khớp bàn ngón xa (DIP): Nếu bệnh nhân có viêm sưng đau ở khớp ngón xa DIP, hai chẩn đoán phải nghĩ tới là THOÁI HOÁ KHỚP (hạt Heberden) hoặc VIÊM KHỚP VẢY NẾN. Viêm khớp dạng thấp kinh điển KHÔNG BAO GIỜ tổn thương khớp ngón xa DIP đơn độc!'
    ]
  },
  {
    id: 'approach-headache',
    title: 'Tiếp Cận Bệnh Nhân Đau Đầu Cấp & Mạn Tính',
    englishTitle: 'Approach to Acute & Chronic Headache (Macleod Ch.7)',
    system: 'neurological',
    urgencyLevel: 'Emergency',
    definition: 'Đau đầu là cảm giác đau nhức ở bất kỳ phần nào của đầu hoặc cổ trên, chia thành đau đầu nguyên phát (Migraine, Tension, Cluster) và đau đầu thứ phát nguy hiểm tính mạng.',
    pathophysiology: 'Nhu mô não không có thụ cảm thể đau; đau đầu phát sinh do kích thích màng não, mạch máu màng não (qua dây V), xoang tĩnh mạch, cơ da đầu và dây thần kinh sọ.',
    redFlags: [
      'S - Systemic symptoms: Sốt, sụt cân, tiền sử ung thư, suy giảm miễn dịch HIV.',
      'N - Neurological signs: Liệt khu trú, lú lẫn, co giật, phù gai thị, nhìn đôi.',
      'O - Onset: Đau đầu sét đánh (Thunderclap headache) - đau dữ dội nhất cuộc đời đạt đỉnh trong vòng 1 phút.',
      'O - Older age: Đau đầu mới khởi phát lần đầu ở người > 50 tuổi (nghi ngờ Viêm động mạch thái dương hoặc U não).',
      'P - Pattern change: Thay đổi tính chất cơn đau đầu mạn tính, đau tăng khi ho/rặn, đau dữ dội khi thức giấc hoặc đau tư thế.'
    ],
    keyHistoryQuestions: [
      {
        dimension: 'Tốc độ khởi phát (Onset)',
        question: 'Cơn đau bắt đầu đột ngột dữ dội như bị sét đánh trúng đầu trong vài giây hay đau âm ỉ tăng dần?',
        clinicalMeaning: 'Đau đầu sét đánh đạt đỉnh trong < 1 phút là dấu hiệu chỉ điểm của Xuất huyết khoang dưới nhện (SAH) do vỡ phình mạch não.'
      },
      {
        dimension: 'Yếu tố tư thế & thời điểm (Timing & Posture)',
        question: 'Cơn đau có dữ dội nhất vào lúc sáng sớm thức dậy kèm buồn nôn không? Đau có tăng khi ho, cúi người hoặc rặn đại tiện không?',
        clinicalMeaning: 'Đau sáng sớm tăng khi ho/rặn gợi ý Tăng áp lực nội sọ (U não, xuất huyết). Đau dữ dội khi đứng dậy và biến mất khi nằm phẳng gợi ý Giảm áp lực dịch não tủy do rò DNT.'
      },
      {
        dimension: 'Triệu chứng đi kèm (Associated symptoms)',
        question: 'Bác có thấy sốt, cứng cổ sợ ánh sáng, đau buốt thái dương khi chải đầu, hay đau mỏi cơ hàm khi nhai thức ăn (Jaw claudication) không?',
        clinicalMeaning: 'Đau cơ hàm khi nhai + Đau thái dương ở người > 50 tuổi là dấu hiệu vàng của Viêm động mạch thái dương tế bào khổng lồ (GCA - nguy cơ mù vĩnh viễn).'
      }
    ],
    physicalExamFocus: [
      {
        step: 'Khám dấu màng não',
        finding: 'Dấu cứng gáy (Neck stiffness) & Dấu Kernig / Brudzinski (+)',
        meaning: 'Kích thích màng não do Viêm màng não mủ hoặc Xuất huyết khoang dưới nhện.'
      },
      {
        step: 'Soi đáy mắt',
        finding: 'Phù gai thị (Papilloedema) - bờ gai mờ, mất hõm gai sinh lý',
        meaning: 'Tăng áp lực nội sọ kéo dài; CHỐNG CHỈ ĐỊNH chọc dò tủy sống trước khi chụp CT sọ não!'
      },
      {
        step: 'Bắt mạch thái dương',
        finding: 'Động mạch thái dương nông căng cứng như sợi thừng, không đập, ấn đau',
        meaning: 'Viêm động mạch tế bào khổng lồ (Giant Cell Arteritis).'
      }
    ],
    differentialDiagnosis: [
      {
        category: 'Nguy kịch đe dọa tính mạng (Thứ phát)',
        diseases: [
          {
            name: 'Xuất huyết khoang dưới nhện (SAH)',
            distinguishingFeatures: 'Đau đầu sét đánh dữ dội nhất cuộc đời, nôn ói, lú lẫn, gáy cứng, có thể mất ý thức thoáng qua.',
            initialInvestigation: 'Chụp CT sọ não không cản quang khẩn cấp trong 6 giờ đầu. Nếu CT âm tính nhưng nghi ngờ cao: Chọc dò dịch não tủy tìm Xanthochromia (sau 12 giờ).',
            priority: 'cannot-miss'
          },
          {
            name: 'Viêm màng não cấp tính (Bacterial Meningitis)',
            distinguishingFeatures: 'Tam chứng: Sốt cao + Cứng gáy + Rối loạn tri giác, có thể có ban xuất huyết hoại tử hình sao (não mô cầu).',
            initialInvestigation: 'Kháng sinh phổ rộng tiêm mạch (Ceftriaxone 2g + Vancomycin + Dexamethasone) NGAY LẬP TỨC, không trì hoãn chờ kết quả chọc dò nếu nghi ngờ cao.',
            priority: 'cannot-miss'
          },
          {
            name: 'Viêm động mạch thái dương (Giant Cell Arteritis)',
            distinguishingFeatures: 'Tuổi > 50, đau thái dương một bên, đau mỏi hàm khi nhai, tốc độ máu lắng ESR > 50-100 mm/h.',
            initialInvestigation: 'Dùng Corticoid liều cao (Prednisolone 60 mg/ngày) ngay tức thì để bảo tồn thị lực, sau đó làm sinh thiết động mạch thái dương.',
            priority: 'cannot-miss'
          }
        ]
      },
      {
        category: 'Đau đầu nguyên phát lành tính',
        diseases: [
          {
            name: 'Đau nửa đầu Migraine',
            distinguishingFeatures: 'Đau theo nhịp mạch đập nửa đầu, kéo dài 4-72 giờ, sợ ánh sáng sợ tiếng ồn, buồn nôn, có thể có tiền triệu aura thị giác.',
            initialInvestigation: 'Cắt cơn bằng Triptans (Sumatriptan) hoặc NSAIDs; phòng ngừa bằng Beta-blocker hoặc Topiramate.',
            priority: 'common'
          },
          {
            name: 'Đau đầu căng thẳng (Tension-type Headache)',
            distinguishingFeatures: 'Đau thắt vòng quanh đầu như đội vòng kim cô, âm ỉ hai bên, không có buồn nôn hay sợ ánh sáng.',
            initialInvestigation: 'Paracetamol, NSAIDs, thư giãn cơ, giảm căng thẳng.',
            priority: 'common'
          }
        ]
      }
    ],
    algorithm: {
      title: 'Lưu đồ chẩn đoán đau đầu cấp & mạn tính',
      summary: 'Phân loại nhanh chóng giữa đau đầu nguy kịch (SAH, Viêm màng não, U não) và đau đầu nguyên phát lành tính.',
      startingPoint: 'node-headache-onset',
      nodes: [
        {
          id: 'node-headache-onset',
          question: 'Cơn đau đầu có phải là đau đầu sét đánh (Thunderclap: đạt đỉnh dữ dội tối đa trong vòng 1 phút)?',
          options: [
            {
              label: 'CÓ - Đau sét đánh dữ dội đạt đỉnh ngay lập tức',
              diagnosis: 'CẢNH BÁO XUẤT HUYẾT DƯỚI NHỆN (SAH) -> Chụp CT sọ não không cản quang cấp cứu ngay lập tức!',
              severity: 'urgent'
            },
            {
              label: 'KHÔNG - Khởi phát từ từ hoặc bán cấp',
              targetId: 'node-headache-redflags',
              severity: 'warning'
            }
          ]
        },
        {
          id: 'node-headache-redflags',
          question: 'Bệnh nhân có sốt, cứng gáy, dấu thần kinh khu trú, phù gai thị hoặc tiền sử ung thư?',
          options: [
            {
              label: 'CÓ - Có dấu màng não hoặc dấu thần kinh khu trú',
              diagnosis: 'Nghi ngờ Viêm màng não hoặc Khối choán chỗ nội sọ -> Kháng sinh khẩn + Chụp CT sọ não trước khi chọc DNT.',
              severity: 'urgent'
            },
            {
              label: 'KHÔNG - Khám thần kinh hoàn toàn bình thường',
              targetId: 'node-headache-primary',
              severity: 'routine'
            }
          ]
        },
        {
          id: 'node-headache-primary',
          question: 'Đau đầu theo nhịp đập nửa bên kèm buồn nôn và sợ ánh sáng, hay đau thắt đè ép cả hai bên?',
          options: [
            {
              label: 'Đau giật nửa bên, nôn ói, sợ ánh sáng (Migraine)',
              diagnosis: 'Cơn Migraine cấp tính -> Điều trị cắt cơn bằng Triptans + chống nôn.',
              severity: 'routine'
            },
            {
              label: 'Đau đè ép như đội vòng siết quanh trán hai bên',
              diagnosis: 'Đau đầu căng thẳng (Tension headache) -> Paracetamol / NSAIDs + nghỉ ngơi.',
              severity: 'routine'
            }
          ]
        }
      ]
    },
    residentClinicalPearls: [
      'Quy tắc vàng chọc dò dịch não tủy trong SAH: Nếu nghi ngờ Xuất huyết dưới nhện mà phim CT sọ não chụp sau 6 giờ cho kết quả bình thường, BẮT BUỘC phải chọc dò thắt lưng sau thời điểm khởi phát 12 giờ để tìm Xanthochromia (dịch não tủy vàng do thoái hóa oxyhaemoglobin thành bilirubin).',
      'Đau đầu ở người trên 50 tuổi: Không bao giờ được chẩn đoán Migraine lần đầu tiên ở bệnh nhân > 50 tuổi mà không loại trừ Viêm động mạch thái dương (GCA) hoặc U não di căn!'
    ]
  },
  {
    id: 'approach-fever',
    title: 'Tiếp Cận Bệnh Nhân Sốt',
    englishTitle: 'Approach to Fever (Acute Fever, Sepsis & FUO)',
    system: 'general',
    urgencyLevel: 'Emergency',
    definition: 'Thân nhiệt gồm khoang lõi (core) và khoang vỏ (shell); đo tại trực tràng hoặc màng nhĩ phản ánh chính xác nhất thân nhiệt trung tâm (đo tại miệng thấp hơn ~0,5°C, tại nách thấp hơn ~0,8°C; đo trán và nách độ nhạy thấp, sai lệch lớn). Theo định nghĩa lâm sàng hiện đại (Mackowiak), sốt là nhiệt độ đo ở miệng vào sáng sớm ≥ 37,2°C (99,0°F) hoặc ≥ 37,8°C (100,0°F) vào bất kỳ thời điểm nào trong ngày (thay thế ngưỡng cũ ≥ 38,3°C). Nhịp sinh học ngày đêm bình thường dao động 0,5–1,0°C, đạt đáy (nadir) lúc ~6 giờ sáng và đỉnh (zenith) lúc 16–18 giờ; nhịp tim sinh lý tăng ~4,4 nhịp/phút mỗi 1°C tăng thân nhiệt (ước tính lâm sàng ~10 nhịp/phút mỗi 1°C hoặc 9–10 nhịp/phút mỗi 1°F). Phân biệt theo thời gian: sốt cấp tính (≤ 7 ngày), bán cấp/kéo dài (> 7 ngày đến vài tuần), và Classic FUO (> 38,3°C nhiều lần, > 3 tuần, chưa rõ nguyên nhân sau ≥ 1 tuần khảo sát nội trú hoặc 3 ngày nội trú tích cực / 3 lần khám ngoại trú có hệ thống).',
    pathophysiology: '1) Phân biệt then chốt Sốt vs Tăng thân nhiệt thụ động (Hyperthermia): Sốt (Fever) là tăng thân nhiệt lõi có sự điều hòa của chất gây sốt (pyrogens) làm tăng điểm đặt nhiệt (set-point) tại vùng dưới đồi; cơ thể chủ động tăng sinh nhiệt (run cơ, sinh nhiệt mô mỡ nâu BAT) và co mạch da, đáp ứng với thuốc hạ sốt. Tăng thân nhiệt (Hyperthermia: say nắng/heat stroke, tăng thân nhiệt ác tính do thuốc mê, NMS, hội chứng serotonin) không qua trung gian pyrogen và không đổi điểm đặt nhiệt; hệ điều nhiệt thất bại dù đã vã mồ hôi và giãn mạch tối đa, khi thân nhiệt ≥ 40,0–40,6°C dễ tổn thương đa cơ quan, KHÔNG đáp ứng thuốc hạ sốt mà bắt buộc làm mát vật lý tích cực. 2) Cơ chế phân tử phát sinh sốt: MAMPs/PAMPs (LPS, RNA virus, peptidoglycan) gắn thụ thể PRRs (như TLR4) trên đại thực bào gan, phổi và tế bào đơn nhân → giải phóng cytokine sinh sốt (IL-1α, IL-1β, TNF-α, IL-6, IFN) → kích hoạt COX-2 và mPGES-1 tổng hợp PGE2 (pha sớm từ ngoại vi gan/phổi qua hàng rào máu não; pha muộn tổng hợp tại chỗ ở tế bào nội mô và quanh mạch não) → PGE2 gắn thụ thể EP3 trên neuron nhạy cảm nhiệt ấm GABA-ergic tại nhân trước thị giữa (POA) gây giải ức chế dòng thác giao cảm ly tâm (co mạch da, run cơ, BAT). 3) Đáp ứng pha cấp & Ý nghĩa sinh học: IL-6 thúc đẩy gan tăng protein pha cấp dương tính (CRP, Ferritin, Fibrinogen, Serum Amyloid A) và giảm protein pha cấp âm tính (Albumin, Transferrin), kèm chán ăn, ngủ gà, tăng cortisol, hạ kẽm/sắt huyết thanh. Sốt sinh lý giúp ức chế sao chép một số vi khuẩn/virus, tăng thực bào và trí nhớ miễn dịch; trong sepsis/viêm phổi, có sốt liên quan tỷ lệ sống tốt hơn, ngược lại hạ thân nhiệt trong nhiễm trùng nặng báo hiệu sốc nhiễm độc tiến triển và tỷ lệ tử vong rất cao.',
    redFlags: [
      'Huyết động không ổn định / Sốc nhiễm khuẩn (Septic Shock): Huyết áp tâm thu < 90 mmHg (hoặc ≤ 100 mmHg theo qSOFA), MAP < 65 mmHg, mạch nhanh > 120 lần/phút, chi lạnh ẩm, vân tím da (mottling), thời gian đổ đầy mao mạch CRT > 3 giây, thiểu niệu, lactate máu ≥ 2–4 mmol/L (qSOFA ≥ 2 hoặc tăng SOFA ≥ 2).',
      'Suy hô hấp cấp: Nhịp thở > 20–24 lần/phút (qSOFA ≥ 22), thở co kéo cơ hô hấp phụ, SpO₂ < 92%.',
      'Rối loạn tri giác / Tổn thương thần kinh trung ương cấp: Glasgow (GCS) < 15, li bì, lú lẫn mới xuất hiện, co giật, hoặc dấu kích thích màng não (cổ gượng, Kernig/Brudzinski dương tính) gợi ý viêm màng não mủ hoặc viêm não.',
      'Nhiễm trùng tối cấp đe dọa tính mạng tức thì: Ban xuất huyết / tử ban hoại tử không mất màu khi ấn tiến triển nhanh (Nhiễm não mô cầu Neisseria meningitidis hoặc DIC); Hội chứng sốc nhiễm độc TSS (sốt, hạ HA, đỏ da toàn thân dạng tinh hồng nhiệt, suy đa tạng); Viêm cân mạc hoại tử (đau dữ dội vượt mức tổn thương da, bóng nước xuất huyết, lạo xạo dưới da).',
      'Sốt giảm bạch cầu hạt (Febrile Neutropenia): Bệnh nhân ung thư đang hóa trị có sốt > 38,0°C và số lượng bạch cầu trung tính tuyệt đối ANC < 500/μL — cấp cứu nội khoa phải truyền kháng sinh tĩnh mạch phổ rộng chống Pseudomonas ngay trong vòng 1 giờ.',
      'Tăng thân nhiệt nguy kịch (≥ 40,0–40,6°C) không đáp ứng thuốc hạ sốt, kèm rối loạn tri giác hoặc cứng cơ (say nắng, tăng thân nhiệt ác tính, NMS, hội chứng serotonin) — nguy cơ suy đa tạng tức thì.',
      'Cần cách ly phòng ngừa lây nhiễm ngay (giọt bắn / không khí): Nghi ngờ sởi, thủy đậu, cúm, SARS-CoV-2 hoặc viêm màng não do não mô cầu.'
    ],
    keyHistoryQuestions: [
      {
        dimension: 'Thời gian khởi phát & Diễn biến sốt',
        question: 'Bác sốt được bao nhiêu ngày rồi? Sốt cấp tính đột ngột hay âm ỉ kéo dài? Nhiệt độ cao nhất đo được là bao nhiêu, có rét run hay đáp ứng thuốc hạ sốt không?',
        clinicalMeaning: 'Sốt cấp ≤ 7 ngày thường do nhiễm trùng cấp (viêm đường hô hấp, Dengue, cúm, nhiễm khuẩn tiết niệu, sốt rét). Bán cấp/kéo dài > 7 ngày nghĩ đến áp-xe sâu (áp-xe gan, áp-xe cơ thắt lưng chậu), lao, viêm nội tâm mạc, thương hàn, HIV cấp, bệnh tự miễn. Classic FUO khi sốt > 38,3°C kéo dài > 3 tuần chưa rõ nguyên nhân.'
      },
      {
        dimension: 'Triệu chứng định khu cơ quan (Localizing Symptoms)',
        question: 'Bác có đau đầu/sợ ánh sáng/cứng cổ; ho khạc đờm mủ/đau ngực/khó thở; đau bụng/tiêu chảy phân nhầy máu/vàng da; tiểu buốt rắt/đau hông lưng; hay sưng nóng đỏ đau khớp/cột sống không?',
        clinicalMeaning: 'Định hướng ngay ổ nhiễm trùng cơ quan đích: Thần kinh (viêm màng não/não), Hô hấp (viêm phổi, áp-xe phổi), Tiêu hóa-Gan mật (viêm đường mật, viêm ruột thừa, áp-xe gan), Tiết niệu-Sinh dục (viêm đài bể thận, viêm tuyến tiền liệt), Cơ xương khớp (viêm khớp nhiễm khuẩn, viêm xương tủy).'
      },
      {
        dimension: 'Tiền sử dùng thuốc & Phản ứng thuốc (30–60 ngày)',
        question: 'Trong vòng 30–60 ngày qua bác có dùng thuốc kê đơn mới, kháng sinh, thuốc kháng giáp, chống co giật, thuốc hướng thần, thực phẩm chức năng hay tiêm chích tĩnh mạch không?',
        clinicalMeaning: 'Phát hiện sốt do thuốc (Drug fever - cắt sốt sau ngừng thuốc 48–72h), phản ứng thuốc nặng (DRESS, SJS/TEN), tăng thân nhiệt ác tính, NMS hoặc hội chứng serotonin. Tiền sử tiêm chích ma túy gợi ý viêm nội tâm mạc van ba lá hoặc áp-xe sâu.'
      },
      {
        dimension: 'Dịch tễ, Du lịch & Phơi nhiễm (PDCs)',
        question: 'Gần đây bác có đi rừng núi/vùng đồi bụi rậm, vùng dịch sốt rét/Dengue; tiếp xúc gia súc/chó mèo; bị ve/mò/côn trùng đốt; ăn hải sản sống, uống sữa chưa tiệt trùng hay tiếp xúc nước ao hồ không?',
        clinicalMeaning: 'Vùng đồi núi/bụi rậm/mò đốt → Sốt mò (Scrub typhus), RMSF, Lyme. Vùng lưu hành → Sốt rét, Dengue, Rickettsia. Gia súc/mèo/sữa tươi → Brucellosis, sốt Q, bệnh mèo cào (Bartonella). Hải sản sống → Vibrio vulnificus; nước ao hồ chưa xử lý → Aeromonas, Leptospira.'
      },
      {
        dimension: 'Cơ địa vật chủ & Dụng cụ nhân tạo',
        question: 'Bác có đái tháo đường, cắt lách, HIV/AIDS, bệnh lý ác tính đang hóa trị, dùng corticoid/ức chế miễn dịch, hoặc đang đặt catheter, van tim nhân tạo, máy tạo nhịp, khớp nhân tạo, dẫn lưu não thất không?',
        clinicalMeaning: 'Cắt lách → nguy cơ nhiễm trùng tối cấp do phế cầu, Capnocytophaga. Hóa trị → sốt giảm bạch cầu hạt. Đái tháo đường → nhiễm khuẩn tiết niệu, áp-xe gan/thận, lao. Dụng cụ nhân tạo → nhiễm trùng huyết liên quan catheter (CRBSI), viêm nội tâm mạc van nhân tạo (PVE).'
      },
      {
        dimension: 'Dấu hiệu đặc thù người cao tuổi & FUO',
        question: 'Ở người > 50 tuổi hoặc sốt kéo dài: Có đau đầu vùng thái dương, đau khi nhai (đau cách hồi hàm), mờ mắt thoáng qua, cứng mỏi vai hông, sụt cân hay vã mồ hôi đêm ướt áo không?',
        clinicalMeaning: 'Đau đầu thái dương + đau cách hồi hàm + mờ mắt ở người > 50 tuổi cảnh báo Viêm động mạch thái dương (GCA - nguy cơ mù mắt cần corticoid ngay). Sụt cân + mồ hôi đêm gợi ý U lympho hoặc Lao.'
      }
    ],
    physicalExamFocus: [
      {
        step: 'Đánh giá A-B-C-D-E & Sinh hiệu chuẩn',
        finding: 'HATT < 90 (hoặc ≤ 100 mmHg), MAP < 65 mmHg, mạch > 120, nhịp thở ≥ 22, SpO₂ < 92%, GCS < 15, CRT > 3 giây, vân tím da',
        meaning: 'Nhận diện ngay Sốc nhiễm khuẩn / Sepsis (qSOFA ≥ 2) hoặc suy hô hấp cấp; đo nhiệt độ trực tràng/màng nhĩ để xác định chính xác thân nhiệt lõi.'
      },
      {
        step: 'Phân ly mạch - nhiệt (Faget’s sign)',
        finding: 'Nhiệt độ tăng cao (39–40°C) nhưng nhịp tim không tăng tương ứng (< 90 lần/phút, ví dụ mạch 82 l/p khi sốt 39,6°C)',
        meaning: 'Gợi ý kinh điển: Sốt thương hàn (Salmonella), viêm phổi không điển hình (Legionella, Mycoplasma, Chlamydia), sốt vẹt (Psittacosis), sốt mò, sốt rét hoặc sốt do thuốc.'
      },
      {
        step: 'Khám toàn diện Da - Niêm mạc & Nếp gấp kín',
        finding: 'Tử ban sờ được/không mất màu khi ấn; Vết loét hoại tử vảy đen không đau (Eschar / Tache noire) ở bẹn, nách, bìu; Dát hồng (Rose spots); Bóng nước xuất huyết hoại tử; Tổn thương Janeway/Osler/splinter; Hạt Koplik / lưỡi dâu tây',
        meaning: 'Tử ban → Não mô cầu, viêm mạch, IE. Eschar → Sốt mò (Orientia tsutsugamushi) hoặc Rickettsia. Rose spots → Thương hàn tuần 2. Bóng nước hoại tử → Vibrio vulnificus, Ecthyma gangrenosum (Pseudomonas), viêm cân mạc hoại tử. Enanthem → Sởi, Kawasaki, TSS, tinh hồng nhiệt.'
      },
      {
        step: 'Khám Đầu - Mặt - Cổ (HEENT) & Động mạch thái dương',
        finding: 'Mủ amydal, giả mạc họng, nấm miệng (thrush), viêm tai giữa/xoang, áp-xe quanh cuống răng; Động mạch thái dương nổi gồ, xơ cứng, giảm đập hoặc ấn đau ở người cao tuổi',
        meaning: 'Tìm ổ nhiễm trùng sâu vùng đầu mặt cổ thường bị bỏ sót; dấu hiệu ĐM thái dương cảnh báo Viêm động mạch tế bào khổng lồ (GCA).'
      },
      {
        step: 'Khám Tim - Phổi - Bụng - Hạch - Thận',
        finding: 'Tiếng thổi tim mới; Hội chứng đông đặc / ran nổ / tiếng cọ màng phổi; Điểm đau bụng khu trú, phản ứng thành bụng, gan lách to; Gõ rung thận dương tính; Hạch ngoại vi to',
        meaning: 'Tiếng thổi mới → Viêm nội tâm mạc nhiễm khuẩn. Ran/đông đặc → Viêm phổi. Đau HSP/HCP, gan lách to → Viêm đường mật, viêm ruột thừa, áp-xe gan, sốt mò, thương hàn. Rung thận → Viêm đài bể thận.'
      },
      {
        step: 'Khám các vị trí "ẩn" (Occult sites)',
        finding: 'Sưng đỏ/mủ chân catheter tĩnh mạch trung tâm, vết mổ, loét tì đè vùng cùng cụt; Ấn đau tuyến tiền liệt khi thăm trực tràng hoặc khối phồng đau quanh hậu môn',
        meaning: 'Nhiễm trùng liên quan catheter, nhiễm trùng vết mổ, áp-xe quanh hậu môn hoặc viêm tuyến tiền liệt cấp gây nhiễm khuẩn huyết.'
      }
    ],
    differentialDiagnosis: [
      {
        category: '1. CẤP CỨU NHIỄM TRÙNG TỐI CẤP — KHÔNG ĐƯỢC BỎ SÓT (Rule-Out First)',
        diseases: [
          {
            name: 'Nhiễm khuẩn huyết (Sepsis) & Sốc nhiễm khuẩn (Septic Shock)',
            distinguishingFeatures: 'Sốt cao (hoặc hạ thân nhiệt — tiên lượng tử vong rất cao), rét run, qSOFA ≥ 2, tụt HA (HATT < 90 / MAP < 65), CRT > 3s, vân tím, thiểu niệu, tăng lactate ≥ 2–4 mmol/L.',
            initialInvestigation: 'Cấy máu ≥ 2 bộ trước kháng sinh, khí máu + lactate máu, CBC (WBC tăng/giảm < 4.000, bands > 10%), CRP, PCT (> 0,5 ng/mL), sinh hóa gan thận, X-quang ngực, cấy bệnh phẩm đích.',
            priority: 'cannot-miss'
          },
          {
            name: 'Nhiễm não mô cầu tối cấp (Meningococcemia) & Viêm màng não mủ',
            distinguishingFeatures: 'Sốt cao đột ngột, đau đầu dữ dội, cứng cổ, Kernig/Brudzinski (+), rối loạn tri giác, ban tử ban tiến triển nhanh không mất màu khi ấn.',
            initialInvestigation: 'Cấy máu ngay, chọc dò dịch não tủy (chụp CT sọ trước nếu có dấu thần kinh khu trú/phù gai thị), nhuộm Gram/PCR dịch não tủy, cách ly giọt bắn và dùng kháng sinh TM ngay.',
            priority: 'cannot-miss'
          },
          {
            name: 'Viêm cân mạc hoại tử (Necrotizing Fasciitis) & Hội chứng sốc nhiễm độc (TSS)',
            distinguishingFeatures: 'Viêm cân mạc: đau dữ dội vượt mức tổn thương da, bóng nước xuất huyết, lạo xạo dưới da, tiến triển hoại tử nhanh. TSS: sốt, hạ HA, đỏ da toàn thân dạng tinh hồng nhiệt, suy đa tạng.',
            initialInvestigation: 'Đánh giá lâm sàng khẩn, lactate, CK, CRP, cấy máu/dịch tổn thương, chụp CT/X-quang tìm khí dưới da nếu chưa rõ; hội chẩn Ngoại cắt lọc khẩn cấp (không trì hoãn vì chờ hình ảnh).',
            priority: 'cannot-miss'
          },
          {
            name: 'Sốt giảm bạch cầu hạt (Febrile Neutropenia)',
            distinguishingFeatures: 'Bệnh nhân ung thư đang hóa trị có sốt > 38,0°C và ANC < 500/μL; thường ít có dấu hiệu viêm khu trú rõ do thiếu bạch cầu trung tính.',
            initialInvestigation: 'CBC khẩn, cấy máu 2 bộ (qua catheter + ngoại vi), cấy nước tiểu, X-quang ngực; truyền ngay kháng sinh phổ rộng chống Pseudomonas trong vòng 1 giờ.',
            priority: 'cannot-miss'
          },
          {
            name: 'Viêm nội tâm mạc nhiễm khuẩn (Infective Endocarditis - IE)',
            distinguishingFeatures: 'Sốt kéo dài, tiếng thổi tim mới xuất hiện, lách to, nốt Osler, tổn thương Janeway, xuất huyết dưới móng dạng mảnh vụn, đốm Roth, tiền sử van tim nhân tạo/tiêm chích.',
            initialInvestigation: 'Cấy máu tối thiểu 3 bộ ở các vị trí khác nhau trước kháng sinh, siêu âm tim qua thành ngực (TTE) và qua thực quản (TEE).',
            priority: 'cannot-miss'
          }
        ]
      },
      {
        category: '2. NHIỄM TRÙNG CẤP TÍNH THƯỜNG GẶP & BỆNH NHIỆT ĐỚI',
        diseases: [
          {
            name: 'Nhiễm khuẩn cơ quan định khu (Viêm phổi, Viêm đài bể thận, Nhiễm trùng đường mật, Áp-xe sâu)',
            distinguishingFeatures: 'Sốt kèm triệu chứng khu trú cơ quan rõ: ho đờm mủ/đông đặc phổi; tiểu buốt/đau hông lưng; tam chứng Charcot; hoặc đau sâu ổ bụng kéo dài sau phẫu thuật.',
            initialInvestigation: 'CBC, CRP/PCT, TPTNT & cấy nước tiểu, men gan/bilirubin, X-quang ngực, Siêu âm ổ bụng, CT scan ngực-bụng-chậu có cản quang.',
            priority: 'common'
          },
          {
            name: 'Sốt mò (Scrub Typhus - Orientia tsutsugamushi) & Sốt thương hàn (Salmonella Typhi)',
            distinguishingFeatures: 'Phân ly mạch - nhiệt (Faget sign). Sốt mò: đi vùng đồi núi/bụi rậm, sung huyết kết mạc, ban dát sẩn, hạch khu trú, vết loét hoại tử đáy đen không đau (Eschar). Thương hàn: sốt bậc thang sang tuần 2, dát hồng (Rose spots) ngực bụng, lách to.',
            initialInvestigation: 'Cấy máu (thương hàn), PCR mẫu quệt đáy eschar/máu toàn phần và IgM ELISA (sốt mò), men gan (thường tăng nhẹ-vừa trong sốt mò).',
            priority: 'common'
          },
          {
            name: 'Sốt xuất huyết Dengue, Cúm, COVID-19 & Sốt rét (Plasmodium)',
            distinguishingFeatures: 'Dengue: sốt cao đột ngột, đau đầu sau hốc mắt, đau cơ khớp, sung huyết kết mạc, chấm xuất huyết, giảm tiểu cầu/cô đặc máu ngày 4–7. Sốt rét: cơn sốt rét run - nóng - vã mồ hôi có chu kỳ, đi vùng dịch tễ.',
            initialInvestigation: 'NS1 Ag và IgM/IgG Dengue, CBC theo dõi tiểu cầu/Hct, phết máu dày/mỏng hoặc test nhanh KST sốt rét, test nhanh/PCR Cúm & SARS-CoV-2.',
            priority: 'common'
          },
          {
            name: 'Lao (Lao phổi, Lao ngoài phổi, Lao kê) & Áp-xe ẩn sâu',
            distinguishingFeatures: 'Sốt kéo dài > 2–3 tuần, thường về chiều, sụt cân, ra mồ hôi đêm, ho kéo dài hoặc tổn thương màng phổi/màng bụng/hạch/cột sống.',
            initialInvestigation: 'X-quang/CT ngực, AFB/GeneXpert đờm hoặc dịch màng, xét nghiệm IGRA hoặc TST, siêu âm/CT ổ bụng.',
            priority: 'common'
          }
        ]
      },
      {
        category: '3. TĂNG THÂN NHIỆT THỤ ĐỘNG & CẤP CỨU KHÔNG NHIỄM TRÙNG',
        diseases: [
          {
            name: 'Tăng thân nhiệt (Say nắng/Heat Stroke, Tăng thân nhiệt ác tính, NMS, Hội chứng Serotonin)',
            distinguishingFeatures: 'Thân nhiệt ≥ 40,0–40,6°C, không đáp ứng thuốc hạ sốt; tiền sử phơi nắng nóng gắng sức, dùng thuốc mê (Succinylcholine/Halothane), thuốc an thần kinh (cứng cơ kiểu ống chì) hoặc thuốc serotonergic (tăng phản xạ, rung giật cơ).',
            initialInvestigation: 'Đo thân nhiệt lõi, CK (tiêu cơ vân), điện giải, chức năng gan thận, đông máu (DIC); làm mát vật lý tích cực NGAY LẬP TỨC.',
            priority: 'cannot-miss'
          },
          {
            name: 'Thuyên tắc huyết khối (Thuyên tắc phổi PE / DVT) & Cơn bão giáp / Suy thượng thận cấp',
            distinguishingFeatures: 'PE: sốt nhẹ-vừa kèm thở nhanh, nhịp nhanh, đau ngực màng phổi, tụt SpO₂, sưng đau bắp chân. Bão giáp: sốt cao, nhịp rất nhanh, kích động. Suy thượng thận cấp: sốt, tụt HA kháng trị, hạ Na/tăng K.',
            initialInvestigation: 'D-dimer, CTPA ngực, siêu âm Doppler tĩnh mạch chi dưới; TSH, FT4; Cortisol máu, ACTH, điện giải đồ.',
            priority: 'cannot-miss'
          }
        ]
      },
      {
        category: '4. BỆNH ÁC TÍNH, TỰ MIỄN (NIID) & NGUYÊN NHÂN KHÁC (FUO)',
        diseases: [
          {
            name: 'Bệnh lý ác tính (U lympho, Bệnh bạch cầu, Ung thư tế bào thận, Đại trực tràng)',
            distinguishingFeatures: 'Sốt kéo dài > 3 tuần không đáp ứng kháng sinh, sốt chu kỳ Pel-Ebstein (Hodgkin), sụt cân, vã mồ hôi đêm, hạch to không đau, gan lách to.',
            initialInvestigation: 'CBC, phết máu ngoại biên, LDH, CT ngực-bụng-chậu, sinh thiết hạch trọn vẹn hoặc tủy xương, ¹⁸F-FDG-PET/CT.',
            priority: 'cannot-miss'
          },
          {
            name: 'Bệnh viêm không nhiễm trùng (Viêm ĐM thái dương GCA, PMR, Bệnh Still người lớn, Lupus, Viêm mạch)',
            distinguishingFeatures: 'GCA/PMR (> 50 tuổi): đau đầu thái dương, đau cách hồi hàm, cứng vai hông, ESR tăng cao. Still: sốt vọt chiều tối, ban cá hồi thoáng qua, Ferritin tăng rất cao. SLE: ban bướm, đau đa khớp, viêm thanh mạc.',
            initialInvestigation: 'ESR, CRP, Ferritin, ANA, RF, ANCA, siêu âm Doppler / sinh thiết động mạch thái dương.',
            priority: 'common'
          },
          {
            name: 'Sốt do thuốc (Drug-induced fever) & Sốt giả tạo (Factitious fever)',
            distinguishingFeatures: 'Sốt do thuốc: khởi phát sau dùng thuốc (beta-lactam, sulfonamide, kháng giáp, chống co giật) trong 1–3 tuần (hoặc 30–60 ngày), phân ly mạch-nhiệt, tổng trạng tương đối khỏe, tăng eosinophil, hết sốt 48–72h sau ngừng thuốc. Sốt giả tạo: không tăng nhịp tim tương ứng, ESR/CRP bình thường.',
            initialInvestigation: 'Rà soát toàn bộ thuốc 30–60 ngày qua và ngừng thuốc nghi ngờ; đo thân nhiệt trực tiếp có giám sát và đo nhiệt độ nước tiểu mới bài xuất nếu nghi giả sốt.',
            priority: 'less-common'
          }
        ]
      }
    ],
    algorithm: {
      title: 'Lưu đồ Tiếp Cận Bệnh Nhân Sốt (Cấp Tính, Sepsis & FUO)',
      summary: 'Quy trình 4 giai đoạn: (1) Sàng lọc Red Flags & Hồi sức A-B-C-D-E → (2) Phân biệt Tăng thân nhiệt & Cách ly → (3) Tiếp cận sốt cấp theo ổ định khu & PDCs → (4) Thuật toán 3 bước Sốt kéo dài (FUO).',
      startingPoint: 'node-fever-abc',
      nodes: [
        {
          id: 'node-fever-abc',
          question: 'Bước 1 (Khẩn cấp): Đánh giá A-B-C-D-E & Red Flags — Bệnh nhân có rối loạn huyết động/Sepsis, suy hô hấp, rối loạn tri giác/dấu màng não, tử ban/viêm cân hoại tử, hay sốt giảm bạch cầu hạt?',
          subtext: 'Kiểm tra qSOFA ≥ 2 (NT ≥ 22, HATT ≤ 100 mmHg, GCS < 15), MAP < 65 mmHg, SpO₂ < 92%, ban không mất màu khi ấn, hoặc ANC < 500/μL.',
          options: [
            {
              label: 'CÓ — Nghi ngờ Sepsis / Sốc nhiễm khuẩn hoặc Nhiễm trùng tối cấp đe dọa tính mạng',
              targetId: 'node-sepsis-six',
              severity: 'urgent'
            },
            {
              label: 'Thân nhiệt ≥ 40,0–40,6°C không đáp ứng thuốc hạ sốt + phơi nắng nóng / thuốc mê / thuốc hướng thần',
              targetId: 'node-hyperthermia',
              severity: 'urgent'
            },
            {
              label: 'KHÔNG — Sinh hiệu ổn định, chưa có dấu hiệu đe dọa tính mạng tức thì',
              targetId: 'node-isolation-duration',
              severity: 'routine'
            }
          ]
        },
        {
          id: 'node-sepsis-six',
          question: 'Kích hoạt Gói "Sepsis Six" trong 1 giờ đầu & Xử trí tối khẩn theo bệnh cảnh:',
          subtext: 'Thực hiện song song 3 bước điều trị và 3 bước chẩn đoán trước khi chuyển ICU/chuyên khoa.',
          options: [
            {
              label: 'Sốc nhiễm khuẩn / Sepsis chưa rõ ổ (qSOFA ≥ 2 hoặc Lactate ≥ 2–4 mmol/L)',
              diagnosis: 'GÓI SEPSIS SIX (TRONG 60 PHÚT): (1) Oxy giữ SpO₂ > 94% (88–92% nếu COPD); (2) Lấy ≥ 2 bộ cấy máu ngoại vi (+ qua catheter nếu có) TRƯỚC kháng sinh; (3) Đo Lactate máu & CBC; (4) Bolus dịch tinh thể đẳng trương 500 mL, đạt 20–30 mL/kg trong 3 giờ đầu nếu tụt HA/lactate ≥ 4; (5) Kháng sinh TM phổ rộng trong 1 giờ (Ceftriaxone 2g + Vancomycin 15–20 mg/kg hoặc Pip/Tazo 4,5g; cân nhắc Meropenem nếu nghi ESBL); (6) Đặt sonde tiểu theo dõi ≥ 0,5 mL/kg/giờ. Nếu MAP < 65 sau 30 mL/kg → Norepinephrine 0,05–0,2 μg/kg/phút, kiểm soát ổ nhiễm < 12h và chuyển ICU.',
              severity: 'urgent'
            },
            {
              label: 'Sốt giảm bạch cầu hạt (Bệnh nhân ung thư hóa trị: T° > 38,0°C và ANC < 500/μL)',
              diagnosis: 'CẤP CỨU NỘI KHOA UNG THƯ: Lấy 2 bộ cấy máu (catheter + ngoại vi) và truyền NGAY trong vòng 1 giờ đơn trị liệu kháng sinh phổ rộng chống Pseudomonas aeruginosa: Cefepime 2g IV mỗi 8h, hoặc Meropenem 1g IV mỗi 8h, hoặc Piperacillin/Tazobactam 4,5g IV mỗi 6h (thêm Vancomycin nếu nghi nhiễm catheter hoặc tụt huyết áp).',
              severity: 'urgent'
            },
            {
              label: 'Ban tử ban tiến triển nhanh / Dấu màng não / Đau dữ dội lạo xạo mô mềm',
              diagnosis: 'NGHI NHIỄM NÃO MÔ CẦU / VIÊM MÀNG NÃO MỦ / VIÊM CÂN HOẠI TỬ: Cách ly giọt bắn ngay (não mô cầu), cấy máu + chọc DNT (CT sọ trước nếu có dấu TKKT), dùng kháng sinh TM liều cao màng não ngay (Ceftriaxone 2g q12h + Vancomycin ± Ampicillin nếu > 50 tuổi), hoặc gọi Ngoại khoa cắt lọc cấp cứu nếu nghi viêm cân hoại tử.',
              severity: 'urgent'
            }
          ]
        },
        {
          id: 'node-hyperthermia',
          question: 'Xử trí Tăng thân nhiệt thụ động (Hyperthermia ≥ 40,0–40,6°C):',
          subtext: 'Điểm đặt nhiệt hạ đồi bình thường — Paracetamol/NSAIDs KHÔNG có tác dụng.',
          options: [
            {
              label: 'Say nắng (Heat stroke) / Tăng thân nhiệt ác tính / NMS / Hội chứng Serotonin',
              diagnosis: 'LÀM MÁT VẬT LÝ TÍCH CỰC NGAY LẬP TỨC (chườm đá, ngâm/lau nước lạnh, quạt đối lưu, truyền dịch lạnh) để hạ nhanh thân nhiệt lõi xuống < 38,5°C; ngừng thuốc gây kích phát; dùng Dantrolene nếu tăng thân nhiệt ác tính; theo dõi CK, điện giải, chức năng thận và đông máu (DIC).',
              severity: 'urgent'
            }
          ]
        },
        {
          id: 'node-isolation-duration',
          question: 'Bước 2: Kiểm tra nhu cầu Cách ly phòng ngừa lây nhiễm & Phân loại theo Thời gian sốt:',
          subtext: 'Cách ly giọt bắn/không khí ngay nếu nghi sởi, thủy đậu, cúm, SARS-CoV-2 hoặc não mô cầu.',
          options: [
            {
              label: 'Sốt cấp tính (≤ 7 ngày) hoặc Bán cấp (> 7 ngày) có yếu tố định hướng cấp',
              targetId: 'node-acute-localizing',
              severity: 'warning'
            },
            {
              label: 'Sốt kéo dài / Sốt chưa rõ nguyên nhân (Classic FUO: > 38,3°C nhiều lần, > 3 tuần)',
              targetId: 'node-fuo-3steps',
              severity: 'routine'
            }
          ]
        },
        {
          id: 'node-acute-localizing',
          question: 'Bước 3: Khai thác Bệnh sử - Dịch tễ (PDCs) & Khám toàn diện có phát hiện ổ nhiễm trùng khu trú hay manh mối đặc hiệu?',
          subtext: 'Luôn kiểm tra phân ly mạch-nhiệt (Faget), nếp gấp kín tìm vết Eschar, họng/răng/xoang, tim, phổi, bụng, hạch, chân catheter và tầng sinh môn.',
          options: [
            {
              label: 'CÓ triệu chứng định khu cơ quan (Hô hấp, Tiết niệu, Tiêu hóa-Gan mật, Thần kinh, Da-Mô mềm)',
              diagnosis: 'CẬN LÂM SÀNG THEO TỪNG BƯỚC: Xét nghiệm ban đầu (CBC có bands, CRP/PCT, 2 bộ cấy máu trước kháng sinh, TPTNT & cấy nước tiểu, sinh hóa gan thận, X-quang ngực thẳng-nghiêng) + Thăm dò đích (Siêu âm/CT cản quang ổ bụng, chọc DNT, TTE/TEE). Điều trị nguyên nhân; hạ sốt bằng Paracetamol theo giờ đều đặn (CHỐNG CHỈ ĐỊNH NSAIDs/Aspirin nếu chưa loại trừ Dengue; KHÔNG chườm đá/chăn lạnh).',
              severity: 'warning'
            },
            {
              label: 'KHÔNG có ổ định khu rõ, có phân ly mạch-nhiệt (Faget), vết Eschar, ban da, hoặc dịch tễ nhiệt đới',
              diagnosis: 'ĐỊNH HƯỚNG BỆNH NHIỆT ĐỚI & TOÀN THÂN: (1) Sốt mò nếu có eschar/đi rừng bụi rậm → PCR/IgM ELISA, điều trị ngay Doxycycline 100 mg × 2 lần/ngày × 7 ngày (hoặc Azithromycin 500 mg/ngày × 3–5 ngày); (2) Sốt xuất huyết Dengue → NS1 Ag/IgM, theo dõi tiểu cầu/Hct, tuyệt đối tránh NSAIDs; (3) Sốt rét → Phết máu tìm Plasmodium; (4) Thương hàn → Cấy máu/tủy; (5) Rà soát thuốc dùng trong 30–60 ngày qua để loại trừ sốt do thuốc.',
              severity: 'warning'
            }
          ]
        },
        {
          id: 'node-fuo-3steps',
          question: 'Bước 4: Thuật toán 3 bước tiếp cận Classic FUO (> 38,3°C nhiều lần, > 3 tuần):',
          subtext: 'Áp dụng nguyên tắc trì hoãn kháng sinh/corticoid kinh nghiệm khi huyết động ổn định.',
          options: [
            {
              label: 'Bước 1 (FUO): Hỏi bệnh & khám lặp lại nhiều lần phát hiện Manh mối tiềm tàng (PDCs)',
              diagnosis: 'Thăm dò chuyên biệt định hướng theo PDCs: Siêu âm tim TTE/TEE (tiếng thổi tim), Sinh thiết hạch trọn vẹn (hạch to), Siêu âm Doppler/Sinh thiết ĐM thái dương (người > 50 tuổi), Ngừng thuốc nghi ngờ 48–72h (sốt do thuốc). Lưu ý: Nếu nghi cao GCA dọa mất thị lực hoặc lao kê nặng đe dọa tính mạng → BẮT ĐẦU ĐIỀU TRỊ NGAY không trì hoãn.',
              severity: 'warning'
            },
            {
              label: 'Bước 2 (FUO): Chưa có PDCs → Thực hiện Bộ xét nghiệm bắt buộc tối thiểu',
              diagnosis: 'Thực hiện Minimal Obligatory Studies: CBC, Sinh hóa máu (gan, thận, canxi), ESR, CRP, Ferritin, TSH, RF, ANA, Huyết thanh HIV-1/2, TPTNT, 3 bộ cấy máu, Xét nghiệm lao (IGRA hoặc TST), Siêu âm ổ bụng và X-quang ngực thẳng-nghiêng (hoặc CT ngực-bụng-chậu).',
              severity: 'routine'
            },
            {
              label: 'Bước 3 (FUO): Bộ xét nghiệm tối thiểu âm tính',
              diagnosis: 'Đánh giá lại lâm sàng định kỳ kết hợp chẩn đoán hình ảnh chức năng cao cấp ¹⁸F-FDG-PET/CT (độ nhạy 86–98%, độ đặc hiệu 52–85%) để định vị ổ viêm sâu, viêm mạch lớn hoặc khối u ẩn nhằm hướng dẫn sinh thiết mô đích. Tiếp tục KHÔNG dùng kháng sinh/corticoid bao vây khi huyết động ổn định.',
              severity: 'routine'
            }
          ]
        }
      ]
    },
    clinicalScores: [
      {
        title: '1. Tiêu chuẩn SIRS và Thang điểm qSOFA sàng lọc Sepsis',
        source: 'Macleod’s Clinical Examination 14e (Box 18.7) & Algorithms for Emergency Medicine 2023 (Table 8.1)',
        headers: [
          'Tiêu chí đánh giá',
          'Tiêu chuẩn SIRS (Xác định khi có ≥ 2 tiêu chuẩn)',
          'Thang điểm qSOFA (Nguy cơ cao khi có ≥ 2 điểm)'
        ],
        rows: [
          ['Thân nhiệt', 'Thân nhiệt > 38,0°C hoặc < 36,0°C', 'Không tính'],
          ['Nhịp tim', 'Nhịp tim > 90 lần/phút', 'Không tính'],
          ['Tần số hô hấp', 'Nhịp thở > 20 lần/phút (hoặc PaCO₂ < 32 mmHg)', 'Nhịp thở ≥ 22 lần/phút (1 điểm)'],
          ['Huyết áp', 'Không tính', 'Huyết áp tâm thu ≤ 100 mmHg (1 điểm)'],
          ['Tri giác', 'Lú lẫn cấp tính mới xuất hiện', 'Điểm Glasgow (GCS) < 15 (1 điểm)'],
          ['Xét nghiệm máu', 'Bạch cầu máu > 12.000/μL hoặc < 4.000/μL (hoặc > 10% bạch cầu non dạng dải - bandemia)', 'Không tính']
        ],
        notes: [
          'Theo Sepsis-3, chẩn đoán Sepsis khi có nghi ngờ/khẳng định nhiễm khuẩn kèm tăng điểm SOFA cấp tính ≥ 2 điểm; qSOFA ≥ 2 là công cụ sàng lọc nhanh tại giường giúp nhận diện bệnh nhân có nguy cơ tử vong cao.'
        ]
      },
      {
        title: '2. Gói điều trị cấp cứu Sepsis trong 1 giờ đầu ("Sepsis Six" Therapeutic Bundle)',
        source: 'Macleod’s Clinical Examination 14e (Box 18.8) & Algorithms for Emergency Medicine 2023',
        headers: ['Nhóm hành động', 'Bước thực hiện', 'Chi tiết kỹ thuật & Mục tiêu lâm sàng'],
        rows: [
          ['Can thiệp điều trị (1)', 'Thở oxy', 'Cung cấp oxy qua mask/cannula duy trì SpO₂ > 94% (mục tiêu 88–92% ở bệnh nhân có nguy cơ tăng CO₂ máu như COPD).'],
          ['Can thiệp điều trị (2)', 'Bù dịch tĩnh mạch', 'Truyền nhanh dung dịch tinh thể đẳng trương (NaCl 0,9% hoặc Ringer Lactate) 500 mL bolus tĩnh mạch ngay, đánh giá lại; tổng dịch ban đầu tới 20–30 mL/kg trong 3 giờ đầu nếu tụt huyết áp hoặc lactate ≥ 4 mmol/L.'],
          ['Can thiệp điều trị (3)', 'Kháng sinh đường tĩnh mạch', 'Dùng kháng sinh phổ rộng đường tĩnh mạch thích hợp NGAY trong vòng 1 giờ đầu sau khi nhận diện sepsis.'],
          ['Chẩn đoán / Theo dõi (4)', 'Cấy máu', 'Lấy tối thiểu 2–3 bộ cấy máu tại các vị trí chọc mạch khác nhau (kèm mẫu qua catheter nếu có) TRƯỚC khi truyền liều kháng sinh đầu tiên.'],
          ['Chẩn đoán / Theo dõi (5)', 'Đo Lactate máu & Công thức máu', 'Đánh giá giảm tưới máu mô (Lactate > 2 mmol/L bất thường; > 4 mmol/L liên quan tử vong > 30%) và đo lại lactate sau bù dịch.'],
          ['Chẩn đoán / Theo dõi (6)', 'Theo dõi nước tiểu / Cân bằng dịch', 'Đặt thông tiểu theo dõi lượng nước tiểu mỗi giờ (mục tiêu ≥ 0,5 mL/kg/giờ).']
        ]
      }
    ],
    initialManagement: [
      {
        title: '1. Hồi sức khẩn cấp trong Sốc nhiễm khuẩn & Kiểm soát ổ nhiễm',
        items: [
          'Vận mạch: Nếu sau bù đủ dịch tinh thể tĩnh mạch (30 mL/kg) mà MAP vẫn < 65 mmHg hoặc lactate ≥ 2 mmol/L, khởi động ngay thuốc vận mạch qua đường truyền tĩnh mạch trung tâm — Norepinephrine là lựa chọn đầu tay (liều bắt đầu 0,05–0,2 μg/kg/phút, chuẩn độ đạt MAP ≥ 65 mmHg).',
          'Kiểm soát ổ nhiễm khuẩn (Source control) khẩn cấp trong vòng 12 giờ: Dẫn lưu ổ áp-xe, rút bỏ catheter nghi nhiễm trùng, phẫu thuật cắt lọc mô hoại tử (viêm cân mạc hoại tử) hoặc can thiệp giải áp tắc nghẽn đường mật/tiết niệu.'
        ]
      },
      {
        title: '2. Chiến lược dùng Thuốc hạ sốt & Hạ sốt vật lý',
        items: [
          'Chỉ định thực tế: Tăng sự thoải mái, giảm đau mỏi cơ; giảm nhu cầu tiêu thụ oxy và gánh nặng chuyển hóa ở bệnh nhân tim mạch, hô hấp hoặc thiếu máu; phòng ngừa/giảm sảng do sốt ở người cao tuổi. (Lưu ý: Thuốc hạ sốt KHÔNG ngăn được tái phát sốt co giật ở trẻ em).',
          'Nguyên tắc dùng thuốc: Dùng theo khoảng cách thời gian đều đặn (regular intervals) thay vì chỉ dùng khi cần (PRN) để tránh dao động thân nhiệt đột ngột gây rét run và vã mồ hôi tái diễn làm kiệt sức người bệnh.',
          'Paracetamol (Acetaminophen) — Lựa chọn đầu tay: Người lớn 500–1000 mg uống/IV mỗi 4–6 giờ (tối đa 4000 mg/ngày; giảm còn ≤ 2000–3000 mg/ngày ở người suy gan/tăng men gan hoặc nghiện rượu). Trẻ em 10–15 mg/kg mỗi 4–6 giờ (tối đa 60 mg/kg/ngày).',
          'NSAIDs (Ibuprofen 400 mg người lớn hoặc 10 mg/kg trẻ em mỗi 6–8 giờ; Aspirin; Naproxen): Ức chế COX-2 ngừng tổng hợp PGE2 nhưng thận trọng tác dụng phụ tiêu hóa, suy thận cấp, biến cố tim mạch. Corticosteroid không dùng thường quy để hạ sốt đơn thuần vì gây ức chế miễn dịch và che lấp nhiễm trùng.',
          'Hạ sốt vật lý: Với sốt do nhiễm trùng, chỉ lau người bằng nước ấm (tepid sponging) kết hợp thuốc hạ sốt. Ngược lại, trong Tăng thân nhiệt thụ động (say nắng, tăng thân nhiệt ác tính, NMS, serotonin ≥ 40,0–40,6°C), bắt buộc làm mát vật lý tích cực (chườm đá, ngâm nước lạnh, dịch lạnh).'
        ],
        alert: 'CẢNH BÁO AN TOÀN: (1) CHỐNG CHỈ ĐỊNH TUYỆT ĐỐI NSAIDs (Ibuprofen) và Aspirin khi chưa loại trừ Sốt xuất huyết Dengue (nguy cơ xuất huyết nặng khó cầm); tránh Aspirin ở trẻ em vì nguy cơ Hội chứng Reye. (2) TRÁNH dùng chăn lạnh (cooling blankets) hoặc chườm nước đá ở bệnh nhân sốt do nhiễm trùng vì gây phản xạ co mạch lạnh và run cơ dữ dội, làm tăng tiêu thụ oxy lên tới 20% và có thể gây co thắt mạch vành.'
      },
      {
        title: '3. Kháng sinh theo kinh nghiệm (Empiric Antibiotics — sau khi lấy cấy máu)',
        items: [
          'Nhiễm khuẩn huyết chưa rõ ổ: Ceftriaxone 2 g IV mỗi 24 giờ phối hợp Vancomycin 15–20 mg/kg IV mỗi 12 giờ (hoặc Piperacillin/Tazobactam 4,5 g IV mỗi 6–8 giờ nếu nghi Gram âm đa kháng / Pseudomonas; cân nhắc Carbapenem như Meropenem nếu nguy cơ vi khuẩn sinh ESBL).',
          'Sốt giảm bạch cầu hạt (Febrile Neutropenia — ANC < 500/μL): Đơn trị liệu phổ rộng chống Pseudomonas aeruginosa ngay tức thì: Cefepime 2 g IV mỗi 8 giờ, hoặc Meropenem 1 g IV mỗi 8 giờ, hoặc Piperacillin/Tazobactam 4,5 g IV mỗi 6 giờ; bổ sung Vancomycin nếu có nhiễm trùng catheter hoặc tụt huyết áp.'
        ]
      },
      {
        title: '4. Tiêu chuẩn chuyển ICU & Hội chẩn chuyên khoa',
        items: [
          'Chuyển khoa Hồi sức tích cực (ICU): Sốc nhiễm khuẩn cần vận mạch duy trì MAP ≥ 65 mmHg; suy hô hấp cấp tiến triển cần hỗ trợ hô hấp xâm lấn hoặc không xâm lấn; toan chuyển hóa nặng hoặc suy thận cấp thiểu/vô niệu cần lọc máu liên tục; rối loạn tri giác tiến triển (GCS < 10 hoặc tụt nhanh).',
          'Hội chẩn Truyền nhiễm / Vi sinh: Cấy máu phân lập vi khuẩn đa kháng thuốc, sốt kéo dài chưa rõ nguyên nhân (FUO), hoặc cơ địa suy giảm miễn dịch phức tạp (HIV, ghép tạng).',
          'Hội chẩn Ngoại khoa / Can thiệp: Cần phẫu thuật hoặc dẫn lưu qua da ổ áp-xe, viêm ruột thừa, thủng tạng rỗng, viêm cân hoại tử, hoặc giải áp tắc mật do sỏi/u.'
        ]
      }
    ],
    clinicalCases: [
      {
        title: 'Ca lâm sàng 1: Sốt cấp ngày thứ 7, phân ly mạch - nhiệt & vết loét Eschar (Sốt mò Tây Nguyên)',
        patientSummary: 'Nam, 38 tuổi, kỹ sư trắc địa công trình — Sốt cao liên tục ngày thứ 7, đau đầu dữ dội và phát ban da.',
        presentation: 'Khởi phát 7 ngày trước với sốt nhẹ, gai rét, đau mỏi toàn thân, nhức đầu vùng trán; tự uống Paracetamol giảm tạm thời. Từ ngày 4 sốt cao liên tục 39,0–40,0°C, rét run, vã mồ hôi, đau cơ nhiều, buồn nôn; ngày 6 nổi dát đỏ thân mình lan ra hai tay, mắt đỏ, ho khan nhẹ. Dịch tễ: cách ngày khởi phát 12 ngày có đi thực địa vùng đồi núi bụi rậm ở Tây Nguyên 1 tuần, bị nhiều vết côn trùng đốt. Khám: Tỉnh, vẻ mặt nhiễm trùng nhiễm độc, sung huyết kết mạc không mủ; Mạch 82 lần/phút, HA 115/75 mmHg, Nhiệt độ miệng 39,6°C (phân ly mạch - nhiệt rõ), NT 20 l/p, SpO₂ 98%. Phát ban dát sẩn hồng đỏ 2–5 mm ấn mất màu ở ngực-bụng-lưng-gốc chi (không có ở lòng bàn tay/chân). Khám nếp gấp kín phát hiện tại nếp bẹn phải có 01 vết loét tròn ~6 mm, trung tâm đóng vảy hoại tử nâu đen (eschar), bờ viền đỏ gồ nhẹ, nền khô và hoàn toàn không đau, không ngứa; hạch bẹn phải 1,5×2,0 cm ấn đau nhẹ; gan mấp mé bờ sườn, lách to độ I; ran rít rải rác đáy phổi phải.',
        reasoningAndWorkup: [
          'Biện luận phân biệt: (1) Sốt mò (Scrub typhus) nghĩ đến nhiều nhất vì phù hợp dịch tễ bụi rậm, phân ly mạch-nhiệt, viêm hạch bẹn khu trú và đặc hiệu là vết loét eschar không đau ở nếp bẹn; (2) Sốt xuất huyết Dengue ngày 7 (thường có chấm xuất huyết/hạ tiểu cầu nặng/thoát huyết tương, không có eschar); (3) Sốt thương hàn (dát hồng rose spots thưa ở bụng, không có eschar); (4) Nhiễm não mô cầu (tử ban tiến triển sốc rất nhanh).',
          'Cận lâm sàng: CBC (WBC 7,5×10⁹/L, Neut 78%, Tiểu cầu giảm nhẹ 110×10⁹/L, Hct 40%); AST 145 U/L, ALT 168 U/L; Cr 85 μmol/L; CRP 68 mg/L; PCT 0,8 ng/mL; Cấy máu 2 bộ âm tính; NS1/IgM/IgG Dengue âm tính; Phết đáy vết loét eschar và máu toàn phần làm Real-time PCR tìm DNA Orientia tsutsugamushi & ELISA IgM sốt mò dương tính; XQ ngực đậm rốn phổi, dày mô kẽ đáy phổi phải; Siêu âm bụng lách to độ I, dày thành túi mật phản ứng.'
        ],
        diagnosis: 'Sốt mò (Scrub typhus do Orientia tsutsugamushi) thể thông thường ngày thứ 7, biến chứng tổn thương gan nhẹ và viêm phế quản phổi kẽ.',
        managementAndOutcome: 'Khởi trị ngay Doxycycline 100 mg uống 1 viên × 2 lần/ngày (cách 12h, uống sau ăn với nhiều nước) × 7 ngày (thay thế bằng Azithromycin 500 mg/ngày × 3–5 ngày nếu dị ứng hoặc mang thai). Paracetamol 500 mg uống mỗi 6h khi cần (< 3 g/ngày do tăng men gan), bù dịch điện giải, giữ khô vết eschar và bôi povidone iodine (không bóc vảy). Theo dõi sinh hiệu/hô hấp mỗi 4–6h phòng biến chứng ARDS, viêm não-màng não, viêm cơ tim; bệnh nhân cắt sốt nhanh trong 24–48 giờ.'
      },
      {
        title: 'Ca lâm sàng 2: Sốt cao, lú lẫn & tụt huyết áp (Sốc nhiễm khuẩn tiết niệu do E. coli sinh ESBL)',
        patientSummary: 'Nam, 62 tuổi, nông dân, ĐTĐ típ 2 kiểm soát kém (HbA1c 9,2%) — Sốt cao liên tục ngày thứ 5 kèm lú lẫn và tụt huyết áp.',
        presentation: 'Tại Khoa Cấp cứu: Li bì, GCS 13 (E3V4M6); Mạch 122 l/p yếu; HA 82/50 mmHg (MAP ~61 mmHg); Nhiệt độ trực tràng 39,6°C; NT 26 l/p; SpO₂ 93% (khí phòng); chi lạnh, vân tím nhẹ đầu chi, CRT 3,5 giây. Cổ mềm, Kernig/Brudzinski (-), không ban xuất huyết, đáy phổi phải ít ran ẩm, ấn đau nhẹ hạ vị; thăm trực tràng thấy tuyến tiền liệt to nhẹ, ấn đau tức.',
        reasoningAndWorkup: [
          'Phân tầng nguy cơ: Đạt 4/4 tiêu chuẩn SIRS và qSOFA = 3 điểm (GCS 13, NT 26, HATT 82 mmHg) → Sốc nhiễm khuẩn (Septic Shock) từ đường tiết niệu - tuyến tiền liệt trên cơ địa ĐTĐ.',
          'Xử trí cấp cứu giờ đầu (Sepsis Six): Oxy cannula 3 L/phút (SpO₂ đạt 97%); 2 đường truyền lớn 16G truyền nhanh Ringer Lactate 1000 mL trong 30 phút đầu (tiếp tục đạt 2000 mL trong 2 giờ); lấy 2 bộ cấy máu ngoại vi + cấy nước tiểu qua sonde trước kháng sinh; dùng ngay Meropenem 1g IV + Vancomycin 1,25g IV trong 60 phút đầu; đặt sonde tiểu ghi nhận nước tiểu vàng đục có cặn.',
          'Cận lâm sàng: Khí máu pH 7,31, HCO₃⁻ 16,5 mmol/L, PaCO₂ 30 mmHg, Lactate 4,2 mmol/L; WBC 24.800/μL (Neut 89%, bands 12%), Hb 11,5 g/dL, Tiểu cầu 125.000/μL; CRP 186 mg/L, PCT 18,5 ng/mL, Cr 182 μmol/L, Ure 14,5 mmol/L, Glucose 16,2 mmol/L; TPTNT bạch cầu (+++), Nitrit (+), Protein (+); Siêu âm hệ tiết niệu không ứ nước thận, tiền liệt tuyến ~42g, thành bàng quang dày lắng cặn.'
        ],
        diagnosis: 'Sốc nhiễm khuẩn từ đường tiết niệu - tuyến tiền liệt do Escherichia coli sinh men ESBL trên nền ĐTĐ típ 2.',
        managementAndOutcome: 'Sau 2000 mL dịch tinh thể trong 2 giờ, HA 86/52 mmHg (MAP ~63 mmHg) → đặt CVC dưới siêu âm và truyền Norepinephrine 0,1 μg/kg/phút nâng MAP ổn định ≥ 65–70 mmHg. Sau 48 giờ, cấy máu và cấy nước tiểu đều mọc E. coli sinh ESBL (nhạy Meropenem, Amikacin; kháng Quinolone và Cephalosporin thế hệ 3) → xuống thang ngừng Vancomycin, duy trì Meropenem 1g IV mỗi 8h (hiệu chỉnh theo eGFR). Sau 36 giờ cắt được vận mạch, hết sốt (37,2°C), GCS 15, lactate giảm còn 1,4 mmol/L, Creatinine hồi phục về 98 μmol/L; hoàn thành đợt kháng sinh 14 ngày và xuất viện an toàn.'
      }
    ],
    residentClinicalPearls: [
      'Sốt chỉ là một triệu chứng đáp ứng sinh lý học; điều trị hạ sốt không bao giờ được thay thế cho việc tìm kiếm và xử lý căn nguyên cốt lõi gây sốt.',
      'Trong sepsis và viêm phổi, sự hiện diện của sốt liên quan tiên lượng sống tốt hơn; ngược lại HẠ THÂN NHIỆT trong nhiễm trùng nặng phản ánh sốc nhiễm độc tiến triển, suy tuần hoàn và tỷ lệ tử vong rất cao.',
      'Quy tắc Sepsis Six trong 60 phút đầu: Bất kỳ bệnh nhân sốt nào có nhịp thở ≥ 22 lần/phút, tụt huyết áp hoặc lú lẫn cấp tính (qSOFA ≥ 2) phải được lấy ≥ 2 bộ cấy máu trước kháng sinh, đo lactate máu, bù dịch tinh thể và truyền kháng sinh phổ rộng tĩnh mạch trong vòng 1 giờ.',
      'Cảnh báo hạ sốt an toàn: Không dùng Aspirin hoặc NSAIDs khi chưa loại trừ Sốt xuất huyết Dengue (nguy cơ xuất huyết nặng) và tránh Aspirin ở trẻ em (nguy cơ Hội chứng Reye). Dùng thuốc hạ sốt theo khoảng cách đều đặn thay vì PRN để tránh chu kỳ rét run - vã mồ hôi làm kiệt sức bệnh nhân.',
      'Tuyệt đối tránh dùng chăn lạnh (cooling blankets) hoặc chườm nước đá cho bệnh nhân sốt do nhiễm trùng: phản xạ co mạch lạnh và run cơ dữ dội làm tăng tiêu thụ oxy lên tới 20% và có thể gây co thắt mạch vành. Ngược lại, với Tăng thân nhiệt thụ động (say nắng, tăng thân nhiệt ác tính, NMS, serotonin ≥ 40°C), làm mát vật lý tích cực là bắt buộc vì thuốc hạ sốt vô hiệu.',
      'Dấu hiệu phân ly mạch - nhiệt (Faget’s sign): Nhịp tim bình thường tăng ~10 nhịp/phút cho mỗi 1°C tăng thân nhiệt. Khi sốt cao 39–40°C mà mạch không tăng tương ứng, phải nghĩ ngay tới: Sốt thương hàn, Legionella, Mycoplasma, Chlamydia, Psittacosis, Sốt mò, Sốt rét hoặc Sốt do thuốc.',
      'Luôn cởi bỏ y phục kiểm tra kỹ các nếp gấp kín (bẹn, nách, bìu, dưới vú, quanh hậu môn) để tìm vết loét hoại tử đáy đen không đau (Eschar) của Sốt mò; vết loét này không đau, không ngứa nên bệnh nhân hầu như không tự biết.',
      'Trong Sốt chưa rõ nguyên nhân (FUO) huyết động ổn định: Kiên nhẫn hỏi lại tiền sử (thuốc trong 30–60 ngày) và khám thực thể lặp lại mỗi ngày tìm PDCs có giá trị hơn nhiều so với dùng kháng sinh hoặc corticoid bao vây (trừ GCA dọa mất thị lực hoặc lao kê nặng đe dọa tính mạng).'
    ],
    references: [
      'Sajadi MM, Habibzadeh P, Romanovsky AA. Temperature regulation and the pathogenesis of fever. In: Bennett JE, Dolin R, Blaser MJ, eds. Mandell, Douglas, and Bennett’s Principles and Practice of Infectious Diseases. 10th ed. Elsevier; 2025:chap 57.',
      'Wright WF, Auwaerter PG. Fever of unknown origin. In: Bennett JE, Dolin R, Blaser MJ, eds. Mandell, Douglas, and Bennett’s Principles and Practice of Infectious Diseases. 10th ed. Elsevier; 2025:chap 58.',
      'Juliano JJ, Cohen MS, Weber DJ. The acutely ill patient with fever and rash. In: Bennett JE, Dolin R, Blaser MJ, eds. Mandell, Douglas, and Bennett’s Principles and Practice of Infectious Diseases. 10th ed. Elsevier; 2025:chap 59.',
      'Mackowiak PA, Wasserman SS, Levine MM. A critical appraisal of 98.6 degrees F, the upper limit of the normal body temperature, and other legacies of Carl Reinhold August Wunderlich. JAMA. 1992;268(12):1578-1580. doi:10.1001/jama.1992.03490120076031',
      'Petersdorf RG, Beeson PB. Fever of unexplained origin: report on 100 cases. Medicine (Baltimore). 1961;40(1):1-30. doi:10.1097/00005792-196102000-00001',
      'Durack DT, Street AC. Fever of unknown origin reexamined and redefined. Curr Clin Top Infect Dis. 1991;11:35-51.',
      'Singer M, Deutschman CS, Seymour CW, et al. The Third International Consensus Definitions for Sepsis and Septic Shock (Sepsis-3). JAMA. 2016;315(8):801-810. doi:10.1001/jama.2016.0287',
      'Seymour CW, Liu VX, Iwashyna TJ, et al. Assessment of Clinical Criteria for Sepsis: For the Third International Consensus Definitions for Sepsis and Septic Shock (Sepsis-3). JAMA. 2016;315(8):762-774. doi:10.1001/jama.2016.0288',
      'Rumbus Z, Matics R, Hegyi P, et al. Fever is associated with reduced, hypothermia with increased mortality in septic patients: a meta-analysis of clinical trials. PLoS One. 2017;12(1):e0170152. doi:10.1371/journal.pone.0170152',
      'Holgersson J, Ceric A, Sethi N, et al. Fever therapy in febrile adults: systematic review with meta-analyses and trial sequential analyses. BMJ. 2022;378:e069620. doi:10.1136/bmj-2021-069620',
      'Cunha BA. Fever of unknown origin: focused diagnostic approach based on clinical clues from the history, physical examination, and laboratory tests. Infect Dis Clin North Am. 2007;21(4):1137-1187. doi:10.1016/j.idc.2007.09.003',
      'Bharucha T, Rutherford A, Skeoch S, et al. Diagnostic yield of FDG-PET/CT in fever of unknown origin: a systematic review, meta-analysis, and Delphi exercise. Clin Radiol. 2017;72(9):764-771. doi:10.1016/j.crad.2017.03.024',
      'Kingston ME, Mackey D. Skin clues in the diagnosis of life-threatening infections. Rev Infect Dis. 1986;8(1):1-11. doi:10.1093/clinids/8.1.1',
      'Surana NK, Dinarello CA, Porat R. Fever. In: Jameson JL, Fauci AS, Kasper DL, Hauser SL, Longo DL, Loscalzo J, eds. Harrison’s Principles of Internal Medicine. 21st ed. McGraw-Hill Education; 2022:130-132.',
      'Toy EC, Sellack JW, Sandmann SM, et al. Symptoms to Diagnosis: An Evidence-Based Guide. 4th ed. McGraw-Hill Education; 2020:Chapter 26 (Fever).',
      'Innes JA, Dover AR, Fairhurst K. Macleod’s Clinical Examination. 14th ed. Elsevier; 2018:Chapter 18 (The Deteriorating Patient: Sepsis and Fever).',
      'Ramrakha P, Moore K, Sam AH. Algorithms for Emergency Medicine. Oxford University Press; 2023:Chapter 8 (Sepsis) & Chapter 10 (Fever and Hyperthermia).',
      'Gomella LG, Haist SA. Internal Medicine On Call. 4th ed. McGraw-Hill Education; 2004:Chapter 22 (Fever).',
      'World Health Organization. Pocket Book of Hospital Care for Children: Guidelines for the Management of Common Childhood Illnesses. 2nd ed. World Health Organization; 2013:Chapter 6 (Fever) & Chapter 10 (Supportive Care).',
      'Đại học Y Dược TP. Hồ Chí Minh. Các vấn đề lâm sàng thiết yếu của chương trình đào tạo Bác sĩ Y khoa. NXB Y học; 2024:Bài 2 (Tiếp cận bệnh nhân sốt) & Bài 3 (Sốt và phát ban).',
      'Hughes WT, Armstrong D, Bodey GP, et al. 2002 guidelines for the use of antimicrobial agents in neutropenic patients with cancer. Clin Infect Dis. 2002;34(6):730-751. doi:10.1086/339215'
    ]
  },
  {
    id: 'approach-fever-fuo',
    title: 'Tiếp Cận Bệnh Nhân Sốt Kéo Dài & Sốt Chưa Rõ Nguyên Nhân (FUO)',
    englishTitle: 'Approach to Prolonged Fever & Fever of Unknown Origin (FUO / IUO - Delphi Consensus & Macleod)',
    system: 'general',
    urgencyLevel: 'Urgent',
    definition: 'Sốt là sự gia tăng thân nhiệt trung tâm do trung tâm điều nhiệt vùng dưới đồi thiết lập lại ngưỡng nhiệt cao hơn bình thường (> 38.3°C / 101°F). Theo đồng thuận quốc tế (Delphi Consensus 2024), Sốt chưa rõ nguyên nhân (FUO cổ điển) ở người có miễn dịch bình thường đòi hỏi: thời gian sốt kéo dài ≥ 3 tuần, thân nhiệt ≥ 38.3°C trên ít nhất 3 lần đo, và chưa xác định được căn nguyên sau khi hoàn thành một Bộ xét nghiệm tối thiểu tiêu chuẩn (Minimal standard diagnostic tests) tại cơ sở y tế.',
    pathophysiology: 'Các chất sinh nhiệt ngoại sinh (nội độc tố vi khuẩn LPS, siêu kháng nguyên, phức hợp miễn dịch) hoạt hóa bạch cầu đơn nhân và đại thực bào giải phóng các cytokine gây sốt nội sinh (IL-1β, IL-6, TNF-α, IFN-γ). Các cytokine này kích thích thụ thể nội mô mạch máu tại cơ quan mạch lá cùng (OVLT) thuộc vùng dưới đồi sản xuất Prostaglandin E2 (PGE2) qua enzyme COX-2. PGE2 gắn vào thụ thể EP3 tại nhân trước thị của vùng dưới đồi, nâng cao điểm thiết lập thân nhiệt (thermostatic set-point) -> kích hoạt phản xạ co mạch ngoại biên giữ nhiệt (lạnh run) và tăng sinh nhiệt cơ bắp (run cơ). Phân biệt với Tăng thân nhiệt (Hyperthermia - Say nắng, sốt cao ác tính, bão giáp): điểm thiết lập hạ đồi hoàn toàn bình thường, tích nhiệt vượt thải nhiệt và không đáp ứng với thuốc hạ sốt hạ đồi.',
    redFlags: [
      'Dấu hiệu Sốc nhiễm trùng (Septic Shock): Tụt huyết áp (HA tâm thu < 90 mmHg hoặc MAP < 65 mmHg), lactate máu > 2.0 mmol/L dù đã bù đủ dịch, thiểu niệu hoặc da nổi vân tím.',
      'Hội chứng màng não & Nhiễm não mô cầu tối cấp: Sốt cao kèm lú lẫn, cứng gáy, dấu Kernig/Brudzinski (+), xuất huyết hoại tử hình sao (Purpura fulminans) lan nhanh trên da.',
      'Thở nhanh > 25 lần/phút, SpO2 < 92%, suy đa tạng tiến triển nhanh (qSOFA ≥ 2 điểm hoặc điểm SOFA tăng ≥ 2).',
      'Sốt hạ bạch cầu trung tính (Neutropenic Fever): Thân nhiệt ≥ 38.0°C kèm số lượng bạch cầu đa nhân trung tính ANC < 500/μL (hoặc dự kiến giảm < 500/μL trong 24-48h sau hóa trị) - Cấp cứu nội khoa ung thư cần kháng sinh chống trực khuẩn mủ xanh tĩnh mạch ngay.',
      'Đe dọa mù mắt do Viêm động mạch tế bào khổng lồ (GCA): Bệnh nhân > 50 tuổi sốt kéo dài kèm đau đầu thái dương dữ dội, đau tăng khi chải đầu, đau cách hồi hàm khi nhai, mờ mắt thoáng qua hoặc song thị.',
      'Hội chứng thực bào tế bào máu (HLH): Sốt cao liên tục kháng thuốc hạ sốt, gan lách to, suy gan cấp, Ferritin máu tăng cực cao (> 10.000 ng/mL), giảm 2-3 dòng tế bào máu và tụt Fibrinogen.'
    ],
    keyHistoryQuestions: [
      {
        dimension: 'Đặc điểm cơn sốt & Kiểu sốt (Fever Curve & Pattern)',
        question: 'Cơn sốt đã kéo dài chính xác bao nhiêu ngày? Thân nhiệt đo tại nhà cao nhất là bao nhiêu? Sốt liên tục cả ngày, sốt cơn rét run, hay sốt có chu kỳ vài ngày lại hạ?',
        clinicalMeaning: 'Sốt chu kỳ Pel-Ebstein (vài ngày sốt xen kẽ vài ngày không sốt): U lympho Hodgkin. Sốt cao vọt hàng ngày về chiều tối kèm ban cá hồi thoáng qua: Bệnh Still người lớn. Sốt chu kỳ cách nhật (48h) hoặc cách 2 ngày (72h): Ký sinh trùng sốt rét. Sốt cao dao động kèm rét run dữ dội: Nhiễm khuẩn huyết, áp-xe sâu hoặc viêm đường mật.'
      },
      {
        dimension: 'Yếu tố dịch tễ & Lịch trình du lịch (Travel & Geography)',
        question: 'Trong vòng 6-12 tháng qua, bác có đi rừng núi, vùng lưu hành sốt rét, vùng dịch sốt xuất huyết, vùng đất ngập nước hay ra nước ngoài không?',
        clinicalMeaning: 'Sốt rét do Plasmodium vivax / P. ovale có thể ngủ trong gan tái phát sau nhiều tháng. Bệnh Melioidosis (Burkholderia pseudomallei) phơi nhiễm qua đất bùn hoặc nước ngập. Sốt mò (Orientia tsutsugamushi) phơi nhiễm ở vùng đồi núi, bụi rậm. Bệnh Leishmania phủ tạng từ vùng dịch tễ lưu hành.'
      },
      {
        dimension: 'Phơi nhiễm động vật & Thực phẩm (Animal Exposures & Diet)',
        question: 'Bác có nuôi mèo, chó, gia súc hoặc tiếp xúc với chuột bọ; có uống sữa bò/dê tươi chưa tiệt trùng hay ăn nem chua, tiết canh, thịt tái sống không?',
        clinicalMeaning: 'Bệnh Brucellosis lây qua sữa chưa tiệt trùng hoặc tiếp xúc trâu bò dê lợn. Bệnh mèo cào (Bartonella henselae) gây sốt kèm viêm hạch bán cấp. Bệnh Leptospira lây qua nước tiểu chuột. Bệnh Toxoplasmosis từ phân mèo. Áp-xe gan amip hoặc sán lá gan lớn (Fasciola) do ăn rau thủy sinh sống.'
      },
      {
        dimension: 'Đơn thuốc & Tiền sử dị ứng (Drug-Induced Fever)',
        question: 'Bác có mới bắt đầu dùng bất kỳ thuốc kháng sinh, thuốc chống co giật, thuốc tim mạch, Allopurinol hay thực phẩm chức năng nào trong 1-4 tuần gần đây không?',
        clinicalMeaning: 'Sốt do thuốc (Drug fever) chiếm 5-10% các ca FUO. Thuốc thủ phạm thường gặp: beta-lactam, sulfonamide, vancomycin, carbamazepine, phenytoin, allopurinol, methyldopa, quinidine. Đặc trưng: bệnh nhân sốt cao nhưng trông tương đối khỏe khoắn ("relative well-being"), kèm tăng bạch cầu ái toan.'
      },
      {
        dimension: 'Can thiệp xâm lấn & Phẫu thuật (Invasive Devices & Surgeries)',
        question: 'Bác đã từng phẫu thuật ổ bụng, thay van tim nhân tạo, đặt máy tạo nhịp tim, đặt catheter tĩnh mạch trung tâm hoặc thay khớp nhân tạo chưa?',
        clinicalMeaning: 'Áp-xe tồn lưu sâu kín đáo trong ổ bụng hoặc sau phúc mạc sau phẫu thuật. Viêm nội tâm mạc nhiễm trùng trên van tim nhân tạo (PVE) hoặc nhiễm trùng thiết bị cấy ghép tim mạch (CIED). Nhiễm trùng huyết liên quan catheter tĩnh mạch trung tâm. Viêm tủy xương quanh khớp nhân tạo.'
      },
      {
        dimension: 'Triệu chứng B & Toàn thân (B-Symptoms & Systemic Review)',
        question: 'Bác có sút cân nhiều không (> 10% trọng lượng trong 6 tháng)? Có hay bị vã mồ hôi ướt đẫm áo vào ban đêm? Có đau đầu một bên thái dương hay đau mỏi cứng đai vai, đai hông buổi sáng không?',
        clinicalMeaning: 'Tam chứng B-symptoms (Sốt + Sụt cân + Mồ hôi trộm đêm) hướng nhiều đến U lympho ác tính hoặc Lao lan tỏa/Lao kê. Đau vùng thái dương kèm đau tăng khi chải đầu và cứng mỏi vùng đai vai/hông ở người > 50 tuổi là manh mối vàng của Viêm động mạch tế bào khổng lồ (GCA) phối hợp Đau đa cơ do thấp (PMR).'
      },
      {
        dimension: 'Tình trạng suy giảm miễn dịch (Immunocompromised State)',
        question: 'Bác có tiền sử đái tháo đường, suy thận mạn, xơ gan, nhiễm HIV, hoặc đang dùng thuốc Corticoid kéo dài, thuốc ức chế miễn dịch sinh học hay hóa trị ung thư không?',
        clinicalMeaning: 'Cơ địa suy giảm miễn dịch làm mất đi các triệu chứng kinh điển của nhiễm trùng khu trú, dễ mắc các căn nguyên cơ hội nguy hiểm: Lao kê, Mycobacteria không điển hình (MAC), Nấm hệ thống (Histoplasma, Cryptococcus), CMV, Pneumocystis jirovecii.'
      }
    ],
    physicalExamFocus: [
      {
        step: 'Khám toàn bộ bề mặt da & Nếp kẽ kín',
        finding: 'Vết loét vảy mục đen viền đỏ không đau (Eschar) ở nách, bẹn, bìu; ban đỏ màu cá hồi thoáng qua lúc sốt; nốt Janeway và Osler ở lòng bàn tay',
        meaning: 'Vết Eschar khẳng định Sốt mò (Orientia tsutsugamushi); Ban cá hồi chỉ điểm Bệnh Still người lớn; Nốt Osler / Janeway chỉ điểm Viêm nội tâm mạc nhiễm khuẩn.'
      },
      {
        step: 'Khám Động mạch thái dương (Người > 50 tuổi)',
        finding: 'Đoạn động mạch thái dương nông một bên nổi gồ, ngoằn ngoèo, ấn đau chói, thành mạch dày xơ cứng hoặc mạch đập yếu/mất đập',
        meaning: 'Manh mối then chốt của Viêm động mạch tế bào khổng lồ (GCA) - Cần chỉ định siêu âm Doppler mạch máu và dùng Corticoid sớm bảo vệ thị lực!'
      },
      {
        step: 'Soi đáy mắt & Khám Mắt (Fundoscopy)',
        finding: 'Đốm Roth (xuất huyết võng mạc có trung tâm trắng nhạt) hoặc Củ lao màng mạch (Choroidal tubercles dạng nốt vàng trắng tròn nhỏ)',
        meaning: 'Đốm Roth cảnh báo Viêm nội tâm mạc nhiễm khuẩn (IE); Củ lao màng mạch là bằng chứng trực tiếp của Lao kê lan tỏa (Miliary TB).'
      },
      {
        step: 'Răng hàm mặt & Tai mũi họng',
        finding: 'Răng sâu nặng, gõ buốt cuống răng, mủ quanh cuống răng kín đáo; loét áp-tơ niêm mạc miệng; viêm xoang mủ mạn tính',
        meaning: 'Áp-xe quanh cuống răng là nguyên nhân FUO thường bị bỏ sót; Loét miệng tái diễn gợi ý Lupus ban đỏ hệ thống (SLE), Hội chứng Behçet hoặc bệnh Crohn.'
      },
      {
        step: 'Nghe tim & Đánh giá mạch - nhiệt',
        finding: 'Tiếng thổi tâm thu hoặc tâm trương mới xuất hiện / biến đổi; Dấu phân ly mạch - nhiệt (Faget sign: sốt 39-40°C nhưng nhịp tim < 70-80 ck/phút)',
        meaning: 'Tiếng thổi mới chỉ điểm Viêm nội tâm mạc nhiễm khuẩn (IE); Dấu Faget gợi ý Sốt thương hàn, Bệnh Legionella, Sốt mò hoặc Sốt do thuốc (Drug fever).'
      },
      {
        step: 'Sờ hạch bạch huyết toàn thân',
        finding: 'Hạch to nhiều chuỗi (cổ, thượng đòn, nách, bẹn), mật độ chắc đàn hồi như cao su (rubbery), dính chùm không đau; hoặc hạch Virchow bên trái',
        meaning: 'U lympho ác tính (Hodgkin / Non-Hodgkin), Bệnh bạch cầu kinh / cấp, Lao hạch hoặc Di căn ung thư tạng ổ bụng.'
      },
      {
        step: 'Khám Bụng, Gan lách & Thăm trực tràng - Tiết niệu',
        finding: 'Lách to đơn độc hoặc kèm gan to; điểm đau sâu vùng hạ sườn/hố chậu; ấn đau tuyến tiền liệt qua thăm trực tràng; sờ thấy nốt mào tinh hoàn',
        meaning: 'Lách to gợi ý U lympho, Bệnh Still, Viêm nội tâm mạc, Lao; Áp-xe sâu ổ bụng / tuyến tiền liệt; Nốt mào tinh hoàn chỉ điểm Lao sinh dục hoặc Viêm quanh ĐM nút (PAN).'
      },
      {
        step: 'Khám Cột sống & Cơ xương khớp',
        finding: 'Gõ đau chói khu trú tại mỏm gai đốt sống thắt lưng/ngực; hạn chế vận động thụ động khớp vai và đai hông; sưng nóng đỏ một khớp cấp tính',
        meaning: 'Đau gõ gai sống chỉ điểm Viêm thân đốt sống - đĩa đệm nhiễm khuẩn (Spondylodiscitis); Đau đai vai/hông gợi ý Đau đa cơ do thấp (PMR); Viêm khớp nhiễm trùng.'
      }
    ],
    differentialDiagnosis: [
      {
        category: '1. NHIỄM TRÙNG (Chiếm 20% - 40% FUO Cổ Điển)',
        diseases: [
          {
            name: 'Lao ngoài phổi & Lao kê lan tỏa (Extrapulmonary & Miliary TB)',
            distinguishingFeatures: 'Sốt nhẹ về chiều, sụt cân, ra mồ hôi trộm đêm, thâm nhiễm hạt kê đối xứng 2 phế trường trên X-quang/CT ngực hoặc tổn thương màng bụng/màng tim.',
            initialInvestigation: 'X-quang/CT ngực, cấy đờm/dịch màng tìm AFB, xét nghiệm PCR GeneXpert MTB/RIF, xét nghiệm IGRA (QuantiFERON), soi đáy mắt, sinh thiết tủy xương/tạng.',
            priority: 'cannot-miss'
          },
          {
            name: 'Viêm nội tâm mạc nhiễm khuẩn (Infective Endocarditis - IE)',
            distinguishingFeatures: 'Sốt kéo dài, tiếng thổi tim mới hoặc biến đổi âm sắc tiếng thổi cũ, lách to, đái máu vi thể, tổn thương ngoại vi (Janeway, Osler, đốm Roth, xuất huyết móng).',
            initialInvestigation: 'Cấy máu 3 bộ ở 3 vị trí khác nhau (gồm cả chai kỵ khí, ủ kéo dài), siêu âm tim qua thành ngực (TTE) và thực quản (TEE), tiêu chuẩn chẩn đoán Duke cải tiến.',
            priority: 'cannot-miss'
          },
          {
            name: 'Áp-xe ẩn sâu ổ bụng & Sau phúc mạc (Intra-abdominal / Pelvic Abscess)',
            distinguishingFeatures: 'Sốt dao động mạnh kèm rét run, tăng bạch cầu đa nhân trung tính, tiền sử phẫu thuật bụng, viêm túi thừa hoặc nhiễm trùng tiết niệu/sinh dục.',
            initialInvestigation: 'Chụp cắt lớp vi tính (CT) ngực - bụng - chậu có tiêm thuốc cản quang tĩnh mạch, chọc hút dịch mủ dưới hướng dẫn CT/siêu âm để nhuộm Gram và cấy vi sinh.',
            priority: 'cannot-miss'
          },
          {
            name: 'Nhiễm trùng nhiệt đới & Nội bào (Sốt mò, Thương hàn, Brucella, Melioidosis)',
            distinguishingFeatures: 'Sốt cao, dấu phân ly mạch - nhiệt (Faget sign), vết loét vảy mục Eschar ở nách/bẹn/bìu (sốt mò), tiền sử uống sữa tươi chưa tiệt trùng (Brucella) hoặc phơi nhiễm bùn đất.',
            initialInvestigation: 'Huyết thanh học chẩn đoán sốt mò, cấy máu và cấy tủy xương tìm Salmonella typhi / Burkholderia pseudomallei, xét nghiệm huyết thanh Brucella (test Wright).',
            priority: 'common'
          },
          {
            name: 'Nhiễm Vi rút & Nấm / Ký sinh trùng cơ hội (CMV, EBV, HIV, Histoplasma, Leishmania)',
            distinguishingFeatures: 'Hội chứng tăng bạch cầu đơn nhân (sốt, đau họng, hạch to, lách to), giảm tế bào máu nhiều dòng, cơ địa suy giảm miễn dịch hoặc đi vùng dịch tễ.',
            initialInvestigation: 'Huyết thanh chẩn đoán HIV-1/2, PCR CMV và EBV đo tải lượng, sinh thiết tủy xương tìm nấm nội bào Histoplasma hoặc thể Leishmania (amastigote).',
            priority: 'less-common'
          }
        ]
      },
      {
        category: '2. BỆNH VIÊM KHÔNG NHIỄM TRÙNG / TỰ MIỄN (NIID - Chiếm 10% - 30%)',
        diseases: [
          {
            name: 'Bệnh Still khởi phát ở người lớn (Adult-onset Still’s Disease - AOSD)',
            distinguishingFeatures: 'Sốt cao vọt hàng ngày về chiều tối (quotidian fever), ban đỏ màu cá hồi (salmon-pink) thoáng qua chỉ bùng lên lúc sốt, đau khớp, đau họng, Ferritin máu tăng cực cao (> 1000 - 5000 ng/mL).',
            initialInvestigation: 'Định lượng Ferritin toàn phần và tỷ lệ Ferritin glycosylated (< 20%), áp dụng tiêu chuẩn phân loại Yamaguchi (sau khi đã loại trừ nhiễm trùng và u lympho).',
            priority: 'cannot-miss'
          },
          {
            name: 'Viêm động mạch tế bào khổng lồ (GCA) & Đau đa cơ do thấp (PMR)',
            distinguishingFeatures: 'Thường gặp ở người > 50 tuổi; sốt kéo dài kèm đau đầu thái dương dữ dội, đau khi chải đầu, đau cách hồi hàm, mờ mắt thoáng qua; cứng mỏi đai vai và đai hông buổi sáng > 45 phút; ESR tăng cực cao (> 100 mm/h).',
            initialInvestigation: 'Tốc độ máu lắng ESR, CRP, Siêu âm Doppler màu ĐM thái dương (dấu hiệu quầng sáng Halo sign), Sinh thiết động mạch thái dương bên đau; Dùng ngay Prednisone 40-60 mg/ngày nếu có dọa mất thị giác.',
            priority: 'cannot-miss'
          },
          {
            name: 'Bệnh tạo keo hệ thống (Lupus ban đỏ hệ thống SLE, Viêm khớp dạng thấp)',
            distinguishingFeatures: 'Ban cánh bướm mặt, rụng tóc, loét áp-tơ miệng không đau, đau đa khớp nhỏ nhỡ đối xứng, viêm thanh mạc màng phổi/màng ngoài tim, tổn thương thận.',
            initialInvestigation: 'Kháng thể kháng nhân (ANA), anti-dsDNA, yếu tố dạng thấp (RF), anti-CCP, bổ thể C3, C4 giảm, tổng phân tích nước tiểu tìm trụ hồng cầu và protein niệu.',
            priority: 'common'
          },
          {
            name: 'Viêm mạch hệ thống & Bệnh u hạt (GPA / Wegener, PAN, Sarcoidosis)',
            distinguishingFeatures: 'Tổn thương phổi phối hợp viêm cầu thận, loét mũi họng mạn tính, viêm dây thần kinh đa ổ (mononeuritis multiplex), hạch rốn phổi 2 bên, hồng ban nút.',
            initialInvestigation: 'Xét nghiệm kháng thể ANCA (c-ANCA/PR3 và p-ANCA/MPO), Chụp CT ngực độ phân giải cao (HRCT), Đo nồng độ men ACE huyết thanh, Sinh thiết mô tổn thương.',
            priority: 'less-common'
          }
        ]
      },
      {
        category: '3. BỆNH LÝ ÁC TÍNH (Chiếm 15% - 30% FUO Cổ Điển)',
        diseases: [
          {
            name: 'U Lympho ác tính (Hodgkin & U lympho không Hodgkin - NHL)',
            distinguishingFeatures: 'Nguyên nhân ung thư hàng đầu gây FUO; sốt chu kỳ Pel-Ebstein, tam chứng B-symptoms (sụt cân > 10% trong 6 tháng, sốt cao, đổ mồ hôi đêm ướt áo), hạch to không đau mật độ cao su, ngứa da dai dẳng.',
            initialInvestigation: 'Sinh thiết trọn vẹn một hạch bạch huyết (Excisional biopsy - không làm FNA vì không đánh giá được cấu trúc nang hạch), Chụp CT ngực bụng chậu cản quang hoặc 18F-FDG PET/CT toàn thân.',
            priority: 'cannot-miss'
          },
          {
            name: 'Bệnh bạch cầu cấp / mạn & Hội chứng loạn sinh tủy (Leukemias & MDS)',
            distinguishingFeatures: 'Sốt do phóng thích pyrogen nội sinh hoặc nhiễm khuẩn thứ phát, thiếu máu tiến triển nhanh, xuất huyết dưới da/niêm mạc, gan lách to, đau xương.',
            initialInvestigation: 'Tổng phân tích tế bào máu CBC, phết máu ngoại biên tìm tế bào non (blasts), Huyết tủy đồ và Sinh thiết tủy xương (Bone marrow biopsy) kết hợp Flow Cytometry.',
            priority: 'cannot-miss'
          },
          {
            name: 'Khối u đặc (Ung thư biểu mô tế bào thận RCC, K đại trực tràng, K gan, U nhầy nhĩ trái)',
            distinguishingFeatures: 'Ung thư tế bào thận RCC (tiết IL-6 gây sốt kéo dài đơn độc, tiểu máu vi thể, đa hồng cầu); K đại trực tràng gây nhiễm khuẩn huyết Streptococcus gallolyticus; U nhầy nhĩ trái (Myxoma) gây sốt kèm tiếng thổi tim thay đổi tư thế.',
            initialInvestigation: 'Chụp CT đa dãy ngực - bụng - chậu có cản quang, Siêu âm tim qua thành ngực (phát hiện khối u nhầy nhĩ trái), Nội soi đại trực tràng toàn bộ tầm soát ung thư.',
            priority: 'common'
          }
        ]
      },
      {
        category: '4. BỆNH LÝ HỖN HỢP & CĂN NGUYÊN KHÁC (Chiếm 5% - 20%)',
        diseases: [
          {
            name: 'Sốt do thuốc (Drug-Induced Fever)',
            distinguishingFeatures: 'Khởi phát 1-3 tuần sau dùng thuốc (kháng sinh beta-lactam, sulfonamide, allopurinol, carbamazepine, phenytoin, methyldopa); sốt cao nhưng bệnh nhân tỉnh táo tương đối khỏe khoắn ("relative well-being"), tăng bạch cầu ái toan.',
            initialInvestigation: 'Đánh giá mối liên quan thời gian dùng thuốc; Thử nghiệm ngừng toàn bộ thuốc nghi ngờ trong 48-72 giờ: bệnh nhân cắt sốt hoàn toàn khẳng định chẩn đoán.',
            priority: 'common'
          },
          {
            name: 'Thuyên tắc huyết khối tĩnh mạch sâu (DVT) & Thuyên tắc phổi (PE)',
            distinguishingFeatures: 'Sốt nhẹ đến vừa do phản ứng viêm thành mạch và nhồi máu mô phổi; khó thở khởi phát đột ngột, đau ngực màng phổi, sưng nóng đau một bên bắp chân, tiền sử bất động lâu ngày.',
            initialInvestigation: 'Thang điểm Wells, xét nghiệm D-dimer máu, Siêu âm Doppler mạch máu chi dưới, Chụp cắt lớp vi tính mạch máu phổi (CTPA).',
            priority: 'cannot-miss'
          },
          {
            name: 'Hội chứng thực bào tế bào máu (Hemophagocytic Lymphohistiocytosis - HLH)',
            distinguishingFeatures: 'Cơn bão cytokine viêm đe dọa tử vong; sốt cao liên tục không đáp ứng hạ sốt, gan lách to, suy gan cấp, vàng da, giảm ≥ 2 dòng tế bào máu ngoại vi, Ferritin máu tăng vọt (> 10.000 ng/mL), Triglyceride tăng, Fibrinogen giảm.',
            initialInvestigation: 'Tiêu chuẩn chẩn đoán HLH-2004, Sinh thiết tủy xương tìm hình ảnh đại thực bào thực bào tế bào máu (Hemophagocytosis), định lượng sCD25 (chuỗi alpha thụ thể IL-2).',
            priority: 'cannot-miss'
          },
          {
            name: 'Viêm tuyến giáp bán cấp (Subacute Thyroiditis / De Quervain)',
            distinguishingFeatures: 'Sốt kèm đau vùng trước cổ lan lên góc hàm hoặc tai, tuyến giáp sưng to ấn đau chói sau đợt nhiễm siêu vi đường hô hấp trên, hồi hộp run tay thoáng qua.',
            initialInvestigation: 'Tốc độ máu lắng ESR tăng rất cao (> 50-100 mm/h), xét nghiệm chức năng tuyến giáp (TSH giảm, FT4 tăng), Siêu âm tuyến giáp thấy vùng giảm âm loang lổ, độ tập trung Iod phóng xạ (RAIU) giảm thấp.',
            priority: 'common'
          },
          {
            name: 'Sốt giả tạo (Factitious Fever) & Rối loạn điều nhiệt thói quen',
            distinguishingFeatures: 'Thường gặp ở nhân viên y tế hoặc phụ nữ trẻ; nhiệt độ đo rất cao (> 40°C) nhưng da khô lạnh, không có mạch nhanh tương ứng, không rét run, nhiệt độ tụt nhanh bất thường; các dấu ấn viêm ESR, CRP hoàn toàn bình thường.',
            initialInvestigation: 'Đo thân nhiệt trực tiếp có nhân viên y tế giám sát chặt chẽ tại giường, đo đồng thời nhiệt độ nước tiểu ngay sau khi bài xuất ra ngoài.',
            priority: 'less-common'
          }
        ]
      },
      {
        category: '5. SỐT CHƯA RÕ NGUYÊN NHÂN SAU KHẢO SÁT CHUẨN MỰC (Chiếm 10% - 50%)',
        diseases: [
          {
            name: 'FUO chưa xác định căn nguyên có tiên lượng lành tính (Undiagnosed Benign FUO)',
            distinguishingFeatures: 'Thỏa mãn tiêu chuẩn FUO nhưng đã hoàn thành đầy đủ Bộ xét nghiệm tối thiểu tiêu chuẩn và thăm dò bậc hai (gồm cả PET/CT và sinh thiết mô nghi ngờ) mà không phát hiện bệnh ác tính hay nhiễm trùng nặng; thể trạng chung bệnh nhân ổn định, không sụt cân tiến triển.',
            initialInvestigation: 'Trấn an người bệnh, giữ vững nguyên tắc KHÔNG dùng kháng sinh/steroid bao vây bừa bãi; theo dõi ngoại trú định kỳ và lặp lại thăm khám lâm sàng hàng tuần (đa số các ca sẽ tự thoái lui trong vài tháng).',
            priority: 'common'
          }
        ]
      }
    ],
    algorithm: {
      title: 'Lưu đồ Tiếp Cận Sốt Cấp & Sốt Không Rõ Nguyên Nhân (FUO & IUO Algorithm)',
      summary: 'Quy trình chuẩn hóa theo Delphi Consensus: Phân tầng sốc nhiễm khuẩn, sàng lọc manh mối tiềm tàng (PDCs), bộ xét nghiệm tối thiểu tiêu chuẩn và thăm dò nâng cao (18F-FDG PET/CT & Sinh thiết mô).',
      startingPoint: 'node-fever-stability',
      nodes: [
        {
          id: 'node-fever-stability',
          question: 'Bệnh nhân có dấu hiệu sốc nhiễm khuẩn, suy hô hấp cấp hoặc đe dọa sinh mạng ngay lập tức?',
          subtext: 'Đánh giá: HA tâm thu < 90 mmHg (hoặc MAP < 65), Lactate máu > 2.0 mmol/L dù đã bù dịch, thở nhanh > 25 lần/phút, SpO2 < 92%, lú lẫn cứng gáy, xuất huyết hoại tử da sao.',
          options: [
            {
              label: 'CÓ - Sốc nhiễm trùng / Đe dọa tử vong cấp cứu',
              diagnosis: 'CẤP CỨU NHIỄM KHUẨN HUYẾT NGUY KỊCH -> Thực hiện Gói 1 giờ: Kháng sinh phổ rộng tiêm mạch (Meropenem / Cefepime + Vancomycin) + Bù dịch tinh thể 30 ml/kg + Cấy máu 2 bộ trước kháng sinh + Đo lactate máu nối tiếp + Hội chẩn Hồi sức tích cực ICU!',
              severity: 'urgent'
            },
            {
              label: 'KHÔNG - Huyết động ổn định, thở êm',
              targetId: 'node-fever-special-pop',
              severity: 'warning'
            }
          ]
        },
        {
          id: 'node-fever-special-pop',
          question: 'Bệnh nhân thuộc nhóm đối tượng lâm sàng đặc thù nào theo phân loại Durack & Street?',
          subtext: 'Sốt giảm bạch cầu, Sốt bệnh viện, Sốt liên quan HIV, hoặc Người cao tuổi nghi ngờ Viêm động mạch thái dương.',
          options: [
            {
              label: 'Sốt giảm bạch cầu hạt (Neutropenic FUO: ANC < 500/μL sau hóa trị)',
              diagnosis: 'CẤP CỨU NỘI KHOA UNG THƯ -> Dùng ngay kháng sinh diệt trực khuẩn mủ xanh Pseudomonas (Cefepime 2g mỗi 8h hoặc Meropenem 1g mỗi 8h) tĩnh mạch trong vòng 60 phút, cấy máu qua tất cả các nòng catheter và ngoại vi, cách ly phòng áp lực dương!',
              severity: 'urgent'
            },
            {
              label: 'Sốt khởi phát sau nhập viện ≥ 24-48 giờ (Nosocomial FUO)',
              diagnosis: 'Nghi ngờ Nhiễm khuẩn bệnh viện (Viêm phổi thở máy HAP/VAP, Nhiễm trùng huyết do catheter CVC, Nhiễm trùng tiểu, Viêm ruột màng giả do C. difficile, Sốt do thuốc) -> Rút/thay đổi catheter lưu, cấy máu, cấy đờm/nước tiểu, test độc tố C. difficile, rà soát và ngừng các thuốc nghi ngờ.',
              severity: 'warning'
            },
            {
              label: 'Bệnh nhân nhiễm HIV(+) sốt kéo dài (HIV-Associated FUO)',
              diagnosis: 'Nghi ngờ Nhiễm trùng cơ hội nguy kịch hoặc U lympho (Lao lan tỏa, Mycobacteria không điển hình MAC, Nấm Cryptococcus / Histoplasma, CMV, U lympho tế bào B lớn) -> Đo tải lượng HIV, đếm tế bào CD4, cấy máu tìm nấm và AFB, chụp CT ngực bụng chậu, chọc dò dịch não tủy.',
              severity: 'warning'
            },
            {
              label: 'Bệnh nhân > 50 tuổi có đau đầu thái dương, đau khi chải đầu, đau cách hồi hàm, mờ mắt',
              diagnosis: 'CẤP CỨU MẮT & MIỄN DỊCH -> Nghi ngờ Viêm động mạch tế bào khổng lồ (GCA) đe dọa mù vĩnh viễn -> Khởi động ngay Corticosteroid liều cao (Prednisone 40-60 mg/ngày), làm gấp ESR/CRP, chỉ định Siêu âm Doppler ĐM thái dương (Halo sign) và Sinh thiết động mạch thái dương!',
              severity: 'urgent'
            },
            {
              label: 'Bệnh nhân miễn dịch bình thường, sốt kéo dài ≥ 3 tuần (Khảo sát FUO Cổ Điển)',
              targetId: 'node-fever-pdc-check',
              severity: 'routine'
            }
          ]
        },
        {
          id: 'node-fever-pdc-check',
          question: 'Khám lâm sàng toàn diện và hỏi bệnh tỉ mỉ có phát hiện Manh mối chẩn đoán tiềm tàng (Potentially Diagnostic Clues - PDCs)?',
          subtext: 'PDCs là các dấu hiệu định hướng khu trú: vết loét bọ mò Eschar, tiếng thổi tim mới, đau gõ gai sống, hạch ngoại biên to, đau ĐM thái dương, ban cá hồi, viêm một khớp.',
          options: [
            {
              label: 'CÓ - Phát hiện được manh mối lâm sàng khu trú rõ ràng (PDC positive)',
              targetId: 'node-fever-pdc-targeted',
              severity: 'warning'
            },
            {
              label: 'KHÔNG - Khám toàn diện không tìm thấy dấu hiệu khu trú (PDC negative)',
              targetId: 'node-fever-minimum-workup',
              severity: 'routine'
            }
          ]
        },
        {
          id: 'node-fever-pdc-targeted',
          question: 'Manh mối khu trú (PDC) phát hiện được trên lâm sàng là gì?',
          subtext: 'Lựa chọn manh mối tương ứng để chỉ định xét nghiệm và xử trí đặc hiệu đích:',
          options: [
            {
              label: 'Tiếng thổi tim mới / Biến đổi tiếng thổi cũ / Nốt Osler, Janeway, đốm Roth',
              diagnosis: 'Nghi ngờ Viêm nội tâm mạc nhiễm khuẩn (IE) -> Cấy máu 3 bộ ở 3 vị trí khác nhau (gồm cả chai kỵ khí, ủ kéo dài 7-14 ngày) + Siêu âm tim qua thành ngực (TTE) và thực quản (TEE) khẩn cấp.',
              severity: 'urgent'
            },
            {
              label: 'Vết loét vảy mục đen viền đỏ không đau (Eschar) ở nách, bẹn, bìu, quanh hậu môn',
              diagnosis: 'Chẩn đoán xác định Bệnh Sốt mò (Scrub typhus do Orientia tsutsugamushi) -> Điều trị đặc hiệu đích ngay với Doxycycline 100 mg x 2 lần/ngày trong 7 ngày (hoặc Azithromycin nếu phụ nữ có thai); bệnh nhân thường cắt sốt ngoạn mục sau 24-48 giờ!',
              severity: 'warning'
            },
            {
              label: 'Gõ đau chói mỏm gai đốt sống / Đau lưng dữ dội hạn chế vận động',
              diagnosis: 'Nghi ngờ Viêm thân đốt sống - đĩa đệm nhiễm khuẩn (Spondylodiscitis) hoặc Áp-xe ngoài màng cứng -> Chụp Cộng hưởng từ MRI cột sống có tiêm thuốc đối quang từ Gadolinium + Cấy máu.',
              severity: 'warning'
            },
            {
              label: 'Hạch ngoại biên to dính chùm, sờ đàn hồi như cao su, hoặc hạch thượng đòn to',
              diagnosis: 'Nghi ngờ U lympho ác tính, Lao hạch hoặc Ung thư di căn -> Sinh thiết trọn vẹn một hạch bạch huyết (Excisional biopsy - TUYỆT ĐỐI không chọc hút kim nhỏ FNA) làm mô bệnh học và hóa mô miễn dịch.',
              severity: 'warning'
            },
            {
              label: 'Sốt cao vọt buổi chiều + Ban đỏ cá hồi thoáng qua lúc sốt + Đau khớp + Đau họng',
              diagnosis: 'Nghi ngờ Bệnh Still khởi phát ở người lớn (AOSD) -> Định lượng Ferritin toàn phần (> 1000 ng/mL) và Ferritin glycosylated (< 20%), áp dụng tiêu chuẩn Yamaguchi sau khi loại trừ nhiễm trùng và ung thư.',
              severity: 'warning'
            }
          ]
        },
        {
          id: 'node-fever-minimum-workup',
          question: 'Kết quả Bộ xét nghiệm tối thiểu tiêu chuẩn (Minimal Diagnostic Workup) ghi nhận gì?',
          subtext: 'Bộ xét nghiệm: CBC, phết máu, ESR, CRP, Ferritin, chức năng gan thận, cấy máu 3 bộ, cấy nước tiểu, tầm soát lao (XQ/IGRA), ANA, RF, CT ngực-bụng-chậu cản quang.',
          options: [
            {
              label: 'Phù hợp Mô hình Efstathiou: CRP > 60 mg/L, Eosinophil < 40/mm³, Ferritin < 500 μg/L (≥ 2 yếu tố)',
              diagnosis: 'Độ nhạy 91.4% và độ đặc hiệu 92.3% dự báo CĂN NGUYÊN NHIỄM TRÙNG -> Tập trung tối đa tìm ổ nhiễm trùng sâu: rà soát kỹ kết quả cấy máu, cấy nước tiểu, CT cản quang toàn thân, cấy đờm tìm AFB/GeneXpert và xét nghiệm huyết thanh nhiễm trùng nội bào.',
              severity: 'urgent'
            },
            {
              label: 'CT ngực - bụng - chậu có cản quang phát hiện khối u đặc, ổ áp-xe sâu hoặc hạch to bệnh lý',
              diagnosis: 'Phát hiện tổn thương thực thể -> Chỉ định Chọc hút dẫn lưu mủ dưới hướng dẫn CT/siêu âm để nuôi cấy vi sinh; hoặc Sinh thiết lõi mô tổn thương (Core biopsy) làm giải phẫu bệnh xác định bản chất u/viêm u hạt.',
              severity: 'warning'
            },
            {
              label: 'Ferritin máu tăng cực cao (> 1000 - 5000 ng/mL), CRP tăng, cấy máu âm tính, CT âm tính',
              diagnosis: 'Gợi ý mạnh Bệnh Still người lớn (AOSD) hoặc Hội chứng thực bào tế bào máu (HLH) -> Xét nghiệm Triglyceride, Fibrinogen máu, sinh thiết tủy xương tìm thực bào máu, hội chẩn chuyên khoa Dị ứng Miễn dịch Lâm sàng.',
              severity: 'warning'
            },
            {
              label: 'Bộ xét nghiệm cơ bản và CT toàn thân hoàn toàn ÂM TÍNH, chưa ra chẩn đoán',
              targetId: 'node-fever-advanced-imaging',
              severity: 'routine'
            }
          ]
        },
        {
          id: 'node-fever-advanced-imaging',
          question: 'Bước đánh giá giai đoạn 2: Chỉ định thăm dò chuyên sâu nâng cao nào?',
          subtext: 'Theo đồng thuận Delphi Consensus: 18F-FDG PET/CT toàn thân là lựa chọn ưu tiên hàng đầu để định hướng vị trí sinh thiết mô đích.',
          options: [
            {
              label: 'Chụp 18F-FDG PET/CT toàn thân phát hiện ổ tăng chuyển hóa glucose khu trú rõ',
              targetId: 'node-fever-biopsy-trial',
              severity: 'warning'
            },
            {
              label: 'Nghi ngờ Viêm nội tâm mạc cấy máu âm tính (có van nhân tạo hoặc lâm sàng nghi ngờ cao)',
              diagnosis: 'Chỉ định Siêu âm tim qua thực quản (TEE) tìm sùi nhỏ, áp-xe vòng van tim; phối hợp xét nghiệm huyết thanh chẩn đoán vi khuẩn khó mọc (Coxiella burnetii, Bartonella, Brucella).',
              severity: 'urgent'
            },
            {
              label: 'Nghi ngờ mầm bệnh khó nuôi cấy (Fastidious organisms, nấm hiếm, vi khuẩn không điển hình)',
              diagnosis: 'Chỉ định Giải trình tự gen thế hệ mới (Next-Generation Sequencing - NGS) hoặc PCR đa mồi từ máu toàn phần hoặc mẫu mô dịch vô trùng.',
              severity: 'warning'
            },
            {
              label: '18F-FDG PET/CT và toàn bộ thăm dò nâng cao vẫn hoàn toàn bình thường',
              diagnosis: 'Phân loại nhóm "FUO chưa xác định căn nguyên có tiên lượng lành tính" -> Bệnh nhân tổng trạng ổn định, không có cờ đỏ: Trấn an, theo dõi ngoại trú định kỳ, lặp lại thăm khám lâm sàng mỗi 1-2 tuần (đa số sốt sẽ tự thoái lui lành tính).',
              severity: 'routine'
            }
          ]
        },
        {
          id: 'node-fever-biopsy-trial',
          question: 'Thủ thuật xâm lấn quyết định (Sinh thiết mô đích) và Thái độ xử trí điều trị thử:',
          subtext: 'Thực hiện sinh thiết mô có tổn thương và tuân thủ nguyên tắc điều trị thử nghiêm ngặt:',
          options: [
            {
              label: 'Sinh thiết mô đích dưới hướng dẫn PET/CT hoặc Sinh thiết tủy xương (Bone Marrow Biopsy)',
              diagnosis: 'Thủ thuật xâm lấn có giá trị quyết định nhất -> Sinh thiết hạch sâu, sinh thiết tủy xương hoặc sinh thiết gan: cho tỷ lệ chẩn đoán xác định cao nhất đối với U lympho ác tính, Lao kê lan tỏa, Nấm hệ thống và Hội chứng thực bào máu (HLH).',
              severity: 'urgent'
            },
            {
              label: 'Nghi ngờ sốt do thuốc (Bệnh nhân tỉnh táo, sốt cao, có thuốc mới dùng trong 1-3 tuần)',
              diagnosis: 'Thử nghiệm ngừng thuốc (Drug Withdrawal Test): Ngừng toàn bộ các thuốc không thiết yếu trong 48-72 giờ; cắt sốt hoàn toàn trong 72 giờ khẳng định chắc chắn sốt do thuốc mà không cần thêm xét nghiệm tốn kém.',
              severity: 'routine'
            },
            {
              label: 'Nguyên tắc điều trị thử có kiểm soát (Empirical Therapeutic Trials)',
              diagnosis: 'Tuyệt đối KHÔNG dùng kháng sinh/steroid bao vây mò ở bệnh nhân ổn định! Chỉ cho phép điều trị thử trong 2 tình huống: (1) Nghi ngờ Viêm ĐM tế bào khổng lồ GCA dọa mất thị giác -> dùng ngay Prednisone liều cao; (2) Nghi ngờ Lao ở bệnh nhân suy kiệt nặng tiến triển mà mọi thăm dò đều bế tắc (sau khi đã lấy đủ bệnh phẩm vi sinh).',
              severity: 'warning'
            }
          ]
        }
      ]
    },
    residentClinicalPearls: [
      'Dấu hiệu phân ly mạch - nhiệt (Faget’s sign): Quy luật sinh lý bình thường: thân nhiệt tăng 1°C thì nhịp tim tăng 10-15 nhịp/phút. Nếu bệnh nhân sốt cao 39-40°C mà nhịp tim vẫn chậm < 70-80 nhịp/phút, hãy nghĩ ngay đến 4 căn nguyên kinh điển: Sốt thương hàn (Typhoid fever), Bệnh Legionella, Sốt mò / Rickettsia, Sốt vàng và Sốt do thuốc (Drug fever).',
      'Nguyên tắc khám lặp lại mỗi ngày (Serial Physical Examination): Trong FUO, giá trị của việc bác sĩ trực tiếp khám lại bệnh nhân từ đầu đến chân mỗi buổi sáng (soi đáy mắt, sờ nắn ĐM thái dương, khám răng hàm mặt, nghe tim, sờ hạch, thăm trực tràng và vạch các nếp kẽ da) cao hơn gấp nhiều lần so với việc chỉ định lặp lại hàng loạt xét nghiệm máu tốn kém.',
      'Kỹ thuật tìm vết loét mục bọ mò đốt (Eschar): Bọ mò (chigger) thường cắn ở những vùng da ẩm, ấm và kín đáo (nách, dưới nếp lằn vú, bẹn, bìu, quanh hậu môn, vùng rốn). Vết Eschar thường hoàn toàn KHÔNG ĐAU, không ngứa, đáy đóng vảy đen xung quanh có viền đỏ. Nếu không yêu cầu bệnh nhân cởi bỏ hoàn toàn y phục để kiểm tra từng nếp gấp cơ thể, bác sĩ sẽ bỏ sót 100% vết mò đốt!',
      'Kỷ luật thép: Không dùng kháng sinh hoặc Corticoid bao vây ở bệnh nhân FUO ổn định: Kháng sinh mò hoặc thuốc chống viêm làm mờ nhạt triệu chứng lâm sàng, âm tính hóa kết quả cấy vi khuẩn, che giấu diễn tiến sốt và làm chậm trễ thời gian chẩn đoán căn nguyên thực sự hàng tuần lễ. Chỉ dùng kháng sinh khi có sốc nhiễm trùng, giảm bạch cầu hạt hoặc suy giảm miễn dịch nặng.',
      'Bộ ba kinh điển chẩn đoán Bệnh Still người lớn (AOSD): Sốt cao vọt hàng ngày về chiều tối + Ban dát đỏ màu cá hồi (Salmon-pink rash) thoáng qua chỉ bùng lên lúc đỉnh sốt rồi biến mất + Đau đa khớp đối xứng. Khi thấy Ferritin máu tăng vọt > 1.000–5.000 ng/mL kèm Ferritin glycosylated < 20%, hãy nghĩ ngay đến bệnh Still sau khi đã loại trừ nhiễm trùng và u lympho.',
      'Sốt kéo dài ở người trên 50 tuổi: Không bao giờ được quên sờ nắn động mạch thái dương hai bên và hỏi triệu chứng đau cách hồi hàm hoặc đau mỏi vùng đai vai/hông. Viêm động mạch tế bào khổng lồ (GCA) và Đau đa cơ do thấp (PMR) là nguyên nhân gây sốt kéo dài hàng đầu ở nhóm tuổi này với ESR thường > 100 mm/h. Khởi động ngay Corticosteroid nếu có triệu chứng thị giác để bảo vệ thị lực cho bệnh nhân!',
      'Vai trò thực sự của 18F-FDG PET/CT trong FUO: PET/CT không chỉ đơn thuần là một phương tiện chẩn đoán hình ảnh, mà giá trị lâm sàng lớn nhất của nó là một "Bản đồ sinh thiết đích" (Biopsy guide). PET/CT giúp bác sĩ lâm sàng nhìn thấy chính xác vị trí cơ quan nào đang chuyển hóa glucose mạnh nhất (hạch sâu trung thất, ổ viêm thành động mạch chủ, cơ sâu hay tủy xương) để định vị đường kim sinh thiết mô chính xác.',
      'Sốt do thuốc (Drug fever) & Dấu hiệu "khỏe khoắn nghịch thường": Bệnh nhân có thể sốt rất cao 39-40°C kéo dài nhiều ngày nhưng toàn trạng trông tương đối tỉnh táo, hồng hào, sinh hoạt bình thường mà không có vẻ mặt nhiễm trùng nhiễm độc nặng nề (relative well-being). Thường kèm tăng nhẹ bạch cầu ái toan (eosinophil). Thao tác chẩn đoán đơn giản và quyết định nhất là ngừng thuốc nghi ngờ: bệnh nhân thường cắt sốt ngoạn mục trong vòng 48-72 giờ.'
    ]
  }
];

