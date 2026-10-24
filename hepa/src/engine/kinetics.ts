/**
 * HepaCDSS Longitudinal Kinetics & Time-Series Pattern Recognition Engine
 * Phân tích động học men gan và chức năng tổng hợp qua các ngày điều trị.
 */

import { KineticAnalysisResult, KineticPatternType, TimePointLab } from '../types';
import { UnitConverter } from './units';

export class HepaKineticsEngine {
  /**
   * Phân tích chuỗi xét nghiệm qua các ngày nằm viện
   */
  static analyzeKinetics(points: TimePointLab[]): KineticAnalysisResult | undefined {
    if (!points || points.length < 2) {
      return undefined;
    }

    // Sắp xếp các điểm theo thời gian
    const sortedPoints = [...points].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const first = sortedPoints[0];
    const latest = sortedPoints[sortedPoints.length - 1];
    const prev = sortedPoints[sortedPoints.length - 2];

    const trendSeries = sortedPoints.map(p => ({
      dayLabel: p.dayLabel,
      alt: p.alt,
      ast: p.ast,
      alp: p.alp,
      totalBilirubinMgDl: UnitConverter.bilirubinToMgDl(p.totalBilirubin, 'umol_l'),
      inr: p.inr,
      deRitis: Number((p.ast / (p.alt || 1)).toFixed(2)),
    }));

    // Tính % biến thiên của ALT và AST trong lần xét nghiệm gần nhất
    const altChangePercent = Number(
      (((latest.alt - prev.alt) / (prev.alt || 1)) * 100).toFixed(1)
    );
    const astChangePercent = Number(
      (((latest.ast - prev.ast) / (prev.ast || 1)) * 100).toFixed(1)
    );

    // Tính % biến thiên của Bilirubin và INR
    const prevBili = UnitConverter.bilirubinToMgDl(prev.totalBilirubin, 'umol_l');
    const latestBili = UnitConverter.bilirubinToMgDl(latest.totalBilirubin, 'umol_l');
    const biliChangePercent = Number((((latestBili - prevBili) / (prevBili || 1)) * 100).toFixed(1));

    const inrChange =
      latest.inr !== undefined && prev.inr !== undefined
        ? Number((latest.inr - prev.inr).toFixed(2))
        : 0;

    // Ước tính thời gian bán hủy t½ của ALT nếu đang giảm (hours)
    let estimatedAltHalfLifeHours: number | undefined = undefined;
    if (prev.alt > latest.alt && latest.alt > 50) {
      const hoursDiff = Math.max(
        12,
        (new Date(latest.timestamp).getTime() - new Date(prev.timestamp).getTime()) / (1000 * 3600)
      );
      if (hoursDiff > 0) {
        const k = Math.log(prev.alt / latest.alt) / hoursDiff;
        if (k > 0) {
          estimatedAltHalfLifeHours = Number((Math.log(2) / k).toFixed(1));
        }
      }
    }

    // 1. Kiểm tra BÁO ĐỘNG PHÂN LY MEN GAN - CHỨC NĂNG GAN (DISSOCIATION ALERT)
    // Men ALT/AST giảm sâu (> 40%) nhưng Bilirubin tăng vọt (> 25%) hoặc INR tăng kéo dài (>= 0.3)
    const isTransaminaseDroppingFast = altChangePercent <= -40 || astChangePercent <= -40;
    const isSyntheticFailing = biliChangePercent >= 25 || inrChange >= 0.3;
    const isDissociationAlert = isTransaminaseDroppingFast && isSyntheticFailing;

    if (isDissociationAlert) {
      return {
        pattern: 'enzyme_bilirubin_dissociation_failure',
        title: 'BÁO ĐỘNG TỐI KHẨN: HIỆN TƯỢNG PHÂN LY MEN GAN - CHỨC NĂNG TỔNG HỢP (LIVER FAILURE WARNING)',
        summary: `Men gan giảm đột ngột (${altChangePercent}%) nhưng Bilirubin tiếp tục tăng (${biliChangePercent}%) hoặc INR kéo dài (+${inrChange}).`,
        clinicalImplication:
          'ĐÂY LÀ DẤU HIỆU CỰC KỲ NGUY HIỂM: Hiện tượng giảm men gan ở đây KHÔNG PHẢI là bệnh nhân đang hồi phục, mà là khối tế bào gan bị hoại tử ồ ạt đến mức cạn kiệt enzyme nội bào để phóng thích. Đi kèm chức năng tổng hợp sụp đổ, báo hiệu nguy cơ SUY GAN CẤP NẶNG (Acute Liver Failure) hoặc hoại tử gan diện rộng. Cần chuyển ngay ICU Gan Mật / xem xét danh sách ghép gan khẩn cấp.',
        altChangePercentPer24h: altChangePercent,
        astChangePercentPer24h: astChangePercent,
        estimatedAltHalfLifeHours,
        isDissociationAlert: true,
        trendSeries,
      };
    }

    // 2. Kiểm tra MẪU GAN SỐC (Rapid Halving - Ischemic Hepatitis)
    // Men gan giảm >= 50% sau 24-48 giờ
    if (altChangePercent <= -50 || astChangePercent <= -50) {
      return {
        pattern: 'rapid_halving_ischemic',
        title: 'ĐỘNG HỌC GAN SỐC / THIẾU MÁU CỤC BỘ (RAPID HALF-LIFE CLEARANCE)',
        summary: `Transaminase giảm cực kỳ nhanh chóng (${altChangePercent}% trong 24-48 giờ).`,
        clinicalImplication:
          'Động học giảm men > 50% sau 24-48h là tiêu chuẩn đặc thù khẳng định Viêm gan thiếu máu cục bộ (Ischemic Hepatitis / Shock Liver) sau khi huyết động học được khôi phục tốt. Tế bào gan vùng 3 xoang gan được tái tưới máu thành công, men gan sẽ tiếp tục hạ về bình thường trong vòng 7-10 ngày.',
        altChangePercentPer24h: altChangePercent,
        astChangePercentPer24h: astChangePercent,
        estimatedAltHalfLifeHours,
        isDissociationAlert: false,
        trendSeries,
      };
    }

    // 3. Kiểm tra MẪU SỎI KẸT CẤP DI CHUYỂN (Choledocholithiasis Spike & Drop)
    // Ban đầu men transaminase tăng vọt rồi giảm nhanh, trong khi ALP hoặc Bilirubin tiếp tục tăng ưu thế
    const prevAlp = prev.alp || 120;
    const latestAlp = latest.alp || 120;
    const isAlpRising = latestAlp > prevAlp;
    if (altChangePercent < -30 && isAlpRising) {
      return {
        pattern: 'choledocholithiasis_spike_drop',
        title: 'ĐỘNG HỌC TẮC MẬT CẤP DO SỎI DI CHUYỂN (SPIKE & DROP PATTERN)',
        summary: 'Transaminase giảm nhanh trong khi ALP đường mật và Bilirubin tăng dần.',
        clinicalImplication:
          'Cơ chế kinh điển: Sỏi di chuyển qua bóng Vater gây tăng áp lực đường mật đột ngột làm men tế bào gan phóng thích thoái lui sớm trong 24-48h đầu, sau đó nhường chỗ cho hội chứng ứ mật (ALP, GGT và Bilirubin trực tiếp tăng cao bền vững). Chỉ định: Siêu âm RUQ hoặc MRCP/ERCP lấy sỏi.',
        altChangePercentPer24h: altChangePercent,
        astChangePercentPer24h: astChangePercent,
        estimatedAltHalfLifeHours,
        isDissociationAlert: false,
        trendSeries,
      };
    }

    // 4. Kiểm tra MẪU VIÊM GAN VIRUS CẤP (Men đạt đỉnh trước, Bili tăng muộn sau)
    if (altChangePercent < 0 && latestBili >= prevBili && latestBili > 2.0) {
      return {
        pattern: 'viral_peak_lagging_bili',
        title: 'ĐỘNG HỌC VIÊM GAN VIRUS CẤP TÍNH (PEAK TRANSAMINASE -> LAGGING ICTERUS)',
        summary: 'Men gan đã qua đỉnh và đang thoái triển dần, Bilirubin xuất hiện muộn và đang tăng dần.',
        clinicalImplication:
          'Diễn biến tự nhiên kinh điển của Viêm gan virus cấp tính (HAV, HBV, HCV, HEV): Triệu chứng vàng da lâm sàng (Bilirubin) thường xuất hiện trễ vài ngày sau khi men hoại tử tế bào gan đã đạt đỉnh tối đa. Cần theo dõi tiếp động học Bilirubin và INR để đảm bảo không chuyển sang suy gan cấp.',
        altChangePercentPer24h: altChangePercent,
        astChangePercentPer24h: astChangePercent,
        estimatedAltHalfLifeHours,
        isDissociationAlert: false,
        trendSeries,
      };
    }

    // 5. Kiểm tra MẪU ĐẢO NGƯỢC DE RITIS (Tiến triển xơ hóa gan)
    const prevDeRitis = prev.ast / (prev.alt || 1);
    const latestDeRitis = latest.ast / (latest.alt || 1);
    if (prevDeRitis < 1.0 && latestDeRitis >= 1.0 && latest.alt < 500) {
      return {
        pattern: 'deritis_inversion_fibrosis',
        title: 'CẢNH BÁO: ĐẢO NGƯỢC TỶ SỐ DE RITIS (AST/ALT TỪ < 1 CHUYỂN SANG >= 1)',
        summary: `Tỷ số De Ritis tăng từ ${prevDeRitis.toFixed(2)} lên ${latestDeRitis.toFixed(2)} qua các lần khám.`,
        clinicalImplication:
          'Ở bệnh nhân có bệnh gan mạn tính, sự chuyển dịch tỷ số AST/ALT vượt mốc 1.0 là dấu hiệu báo động xơ hóa gan đang tiến triển sang giai đoạn nặng (F3-F4) hoặc xơ gan do xoang gan suy giảm thanh thải AST. Cần làm lại FIB-4 và chỉ định đo độ đàn hồi mô gan (FibroScan).',
        altChangePercentPer24h: altChangePercent,
        astChangePercentPer24h: astChangePercent,
        estimatedAltHalfLifeHours,
        isDissociationAlert: false,
        trendSeries,
      };
    }

    // 6. Đang hồi phục đều hoặc xấu đi
    if (altChangePercent < -15 && astChangePercent < -15) {
      return {
        pattern: 'improving',
        title: 'XU HƯỚNG ĐANG HỒI PHỤC (IMPROVING TREND)',
        summary: `Men gan và các chỉ số sinh hóa đang giảm đều đặn (${altChangePercent}% / đợt).`,
        clinicalImplication:
          'Bệnh nhân đáp ứng tốt với phác đồ điều trị hiện tại hoặc tổn thương tế bào gan đang tự thoái lui. Tiếp tục duy trì phác đồ và hẹn xét nghiệm lại theo lịch.',
        altChangePercentPer24h: altChangePercent,
        astChangePercentPer24h: astChangePercent,
        estimatedAltHalfLifeHours,
        isDissociationAlert: false,
        trendSeries,
      };
    }

    if (altChangePercent > 20 || astChangePercent > 20) {
      return {
        pattern: 'worsening',
        title: 'CẢNH BÁO: XU HƯỚNG TỔN THƯƠNG ĐANG TIẾN TRIỂN TĂNG (WORSENING TREND)',
        summary: `Men gan tiếp tục tăng cao thêm +${altChangePercent}% so với lần xét nghiệm trước.`,
        clinicalImplication:
          'Tổn thương tế bào gan đang bùng phát hoặc tiếp tục tiếp xúc với độc chất/tác nhân gây viêm. Cần rà soát ngay danh mục thuốc, tìm thêm biến chứng hoặc đợt bùng phát viêm gan virus mạn.',
        altChangePercentPer24h: altChangePercent,
        astChangePercentPer24h: astChangePercent,
        estimatedAltHalfLifeHours,
        isDissociationAlert: false,
        trendSeries,
      };
    }

    return {
      pattern: 'stable',
      title: 'XU HƯỚNG DAO ĐỘNG ỔN ĐỊNH (STABLE TREND)',
      summary: 'Các chỉ số sinh hóa gan biến thiên tối thiểu trong khoảng theo dõi.',
      clinicalImplication: 'Tình trạng gan ổn định, tiếp tục theo dõi theo kế hoạch lâm sàng.',
      altChangePercentPer24h: altChangePercent,
      astChangePercentPer24h: astChangePercent,
      estimatedAltHalfLifeHours,
      isDissociationAlert: false,
      trendSeries,
    };
  }
}
