import { jsPDF } from 'jspdf';
import { HepaInputData, HepaAnalysisResult } from '../types';

function removeVietnameseTones(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export function generateConsultationPDF(
  input: HepaInputData,
  analysis: HepaAnalysisResult,
  doctorNotes?: string
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = 14;

  // Header Banner
  doc.setFillColor(15, 76, 129); // Medical Deep Slate Blue
  doc.rect(margin, y, contentWidth, 16, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('HEPACDSS - BIEN BAN HOI CHAN & PHAN TICH SINH HOA GAN', margin + 4, y + 6.5);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('HE THONG HO TRO QUYET DINH LAM SANG CHUYEN SAU (ACG 2017 & WHO & BYT)', margin + 4, y + 12);

  y += 21;

  // Patient & Context Box
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'F');
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');

  const currentDate = new Date().toLocaleString('vi-VN');
  doc.text(`Ngay phan tich: ${currentDate}`, margin + 4, y + 6);
  doc.text(`Gioi tinh: ${input.gender === 'male' ? 'Nam' : 'Nu'}`, margin + 110, y + 6);

  doc.setFont('helvetica', 'normal');
  const bmiStr = input.bmi ? `${input.bmi} kg/m2` : 'Chua ghi nhan';
  doc.text(`Tuoi: ${input.age} | BMI: ${bmiStr}`, margin + 4, y + 12);
  const alcoholStr = input.alcoholGramsPerWeek ? `${input.alcoholGramsPerWeek} g/tuan` : 'Khong ghi nhan';
  doc.text(`Tieu thu con: ${alcoholStr}`, margin + 110, y + 12);

  const ulnInfo = `ULN Chuan: ALT ${input.altUln || (input.gender === 'male' ? 35 : 25)} U/L | AST ${input.astUln || (input.gender === 'male' ? 35 : 25)} U/L | ALP ${input.alpUln || 120} U/L`;
  doc.text(ulnInfo, margin + 4, y + 18);

  y += 26;

  // 1. Ket qua xet nghiem
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 76, 129);
  doc.text('1. KET QUA SINH HOA GAN & CHUC NANG TONG HOP', margin, y);
  y += 5;

  doc.setFillColor(226, 232, 240);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text('Xet nghiem', margin + 4, y + 4.5);
  doc.text('Gia tri', margin + 65, y + 4.5);
  doc.text('Khoang tham chieu / ULN', margin + 105, y + 4.5);
  doc.text('Boi so / Danh gia', margin + 145, y + 4.5);
  y += 6;

  const labRows = [
    {
      name: 'ALT (SGPT)',
      val: `${input.alt} U/L`,
      ref: `ULN: ${input.altUln || (input.gender === 'male' ? 35 : 25)} U/L`,
      interp: `${analysis.altMultiples}x ULN`
    },
    {
      name: 'AST (SGOT)',
      val: `${input.ast} U/L`,
      ref: `ULN: ${input.astUln || (input.gender === 'male' ? 35 : 25)} U/L`,
      interp: `${analysis.astMultiples}x ULN`
    },
    {
      name: 'ALP (Phosphatase kiem)',
      val: `${input.alp} U/L`,
      ref: `ULN: ${input.alpUln || 120} U/L`,
      interp: `${analysis.alpMultiples}x ULN`
    },
    {
      name: 'GGT (Gamma-GT)',
      val: input.ggt !== undefined ? `${input.ggt} U/L` : 'Chua lam',
      ref: 'Nam <50, Nu <35 U/L',
      interp: input.ggt !== undefined ? `${analysis.ggtMultiples || 1}x ULN` : '-'
    },
    {
      name: 'Total Bilirubin',
      val: `${analysis.normalizedValues.totalBilirubinUmolL} umol/L (${analysis.normalizedValues.totalBilirubinMgDl} mg/dL)`,
      ref: '< 17-21 umol/L',
      interp: analysis.normalizedValues.totalBilirubinMgDl > 1.2 ? 'Tang' : 'Binh thuong'
    },
    {
      name: 'Direct Bilirubin (Lien hop)',
      val:
        analysis.normalizedValues.directBilirubinUmolL !== undefined
          ? `${analysis.normalizedValues.directBilirubinUmolL} umol/L`
          : 'Chua lam',
      ref: '< 5 umol/L',
      interp: analysis.conjugatedPercent !== undefined ? `${analysis.conjugatedPercent}% tong luong` : '-'
    },
    {
      name: 'Albumin Mau',
      val:
        analysis.normalizedValues.albuminGL !== undefined
          ? `${analysis.normalizedValues.albuminGL} g/L (${analysis.normalizedValues.albuminGDl} g/dL)`
          : 'Chua lam',
      ref: '35 - 50 g/L (3.5 - 5.0 g/dL)',
      interp:
        analysis.normalizedValues.albuminGL !== undefined
          ? analysis.normalizedValues.albuminGL < 35
            ? 'Giam'
            : 'Binh thuong'
          : '-'
    },
    {
      name: 'PT / INR',
      val: input.inr !== undefined ? `INR ${input.inr}` : 'Chua lam',
      ref: '0.85 - 1.15',
      interp: input.inr !== undefined ? (input.inr >= 1.5 ? 'Keo dai - Canh bao' : 'Binh thuong') : '-'
    },
    {
      name: 'Tieu cau (Platelets)',
      val:
        analysis.normalizedValues.plateletsKUl !== undefined
          ? `${analysis.normalizedValues.plateletsKUl} G/L (10^9/L)`
          : 'Chua lam',
      ref: '150 - 450 G/L',
      interp:
        analysis.normalizedValues.plateletsKUl !== undefined
          ? analysis.normalizedValues.plateletsKUl < 150
            ? 'Giam tieu cau'
            : 'Binh thuong'
          : '-'
    }
  ];

  doc.setFont('helvetica', 'normal');
  labRows.forEach((row, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 5.2, 'F');
    }
    doc.text(removeVietnameseTones(row.name), margin + 4, y + 3.8);
    doc.text(row.val, margin + 65, y + 3.8);
    doc.text(row.ref, margin + 105, y + 3.8);
    doc.text(removeVietnameseTones(row.interp), margin + 145, y + 3.8);
    y += 5.2;
  });

  y += 4;

  // 2. Phan tich CDSS & Chi so tinh toan
  doc.setFillColor(238, 242, 255);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 27, 75);
  doc.text('2. PHAN TICH CDSS & CAC CHI SO CHUYEN KHOA TINH TOAN', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`- Kieu ton thuong gan: ${analysis.pattern.toUpperCase()} (${removeVietnameseTones(analysis.patternDescription)})`, margin + 4, y + 10);
  doc.text(`- Chi so R (R-ratio): ${analysis.rRatio} | De Ritis (AST/ALT): ${analysis.deRitisRatio} (${removeVietnameseTones(analysis.deRitisInterpretation)})`, margin + 4, y + 15);

  let scoreSummary = '';
  if (analysis.childPugh) {
    scoreSummary += `Child-Pugh: ${analysis.childPugh.score} diem (Hang ${analysis.childPugh.grade}) | `;
  }
  if (analysis.meld) {
    scoreSummary += `MELD 3.0: ${analysis.meld.meld30 ?? analysis.meld.meldOriginal} | `;
  }
  if (analysis.fib4) {
    scoreSummary += `FIB-4: ${analysis.fib4.score} (${analysis.fib4.riskCategory.toUpperCase()}) | `;
  }
  if (analysis.nfs) {
    scoreSummary += `NFS: ${analysis.nfs.score} (${removeVietnameseTones(analysis.nfs.stage)})`;
  }
  if (!scoreSummary) {
    scoreSummary = 'Chua du thong so tinh cac thang diem xet nghiem nang cao.';
  }
  doc.text(`- Thang diem: ${scoreSummary}`, margin + 4, y + 20);

  y += 28;

  // 3. Canh bao Red flags
  if (analysis.redFlags.length > 0) {
    doc.setFillColor(254, 226, 226);
    const boxHeight = Math.min(22, 6 + analysis.redFlags.length * 5);
    doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'F');
    doc.setTextColor(185, 28, 28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('CANH BAO NGUY CO LAM SANG (RED FLAGS):', margin + 4, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    analysis.redFlags.slice(0, 3).forEach((rf, i) => {
      doc.text(
        `* ${removeVietnameseTones(rf.title)}: ${removeVietnameseTones(rf.immediateAction)}`,
        margin + 4,
        y + 9 + i * 4.5
      );
    });
    y += boxHeight + 4;
  }

  // 4. Chan doan phan biet xep hang
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 76, 129);
  doc.text('3. CHAN DOAN PHAN BIET XEP THEO XAC SUAT (DIFFERENTIAL DIAGNOSES)', margin, y);
  y += 5;

  analysis.differentialDiagnoses.slice(0, 3).forEach((d) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text(`* [${d.likelihood.toUpperCase()}] ${removeVietnameseTones(d.disease)}`, margin + 2, y);
    y += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(`  Dau hieu: ${removeVietnameseTones(d.clues)}`, margin + 2, y);
    y += 4;
    doc.text(`  Xac nhan: ${removeVietnameseTones(d.confirmingTests)}`, margin + 2, y);
    y += 5;
  });

  y += 2;

  // 5. Khuyen cao tiep theo
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 76, 129);
  doc.text('4. KHUYEN CAO XU TRI & XET NGHIEM TIEP THEO (THEO ACG & WHO)', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  analysis.stepByStepRecommendations.slice(0, 4).forEach((rec) => {
    const safeRec = removeVietnameseTones(rec);
    const splitLines = doc.splitTextToSize(`- ${safeRec}`, contentWidth - 4);
    doc.text(splitLines, margin + 2, y);
    y += splitLines.length * 4;
  });

  // Doctor Signature
  y = Math.max(y + 6, 260);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Bac si dieu tri / Hoi chan ky ten:', margin + 115, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Bac si chuyen khoa', margin + 115, y + 14);

  // Footer Disclaimer
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Bao cao duoc tao tu he thong HepaCDSS v2.0 - Ho tro quyet dinh lam sang. Gia tri tinh toan phai duoc doi chieu lam sang boi bac si.',
    margin,
    288
  );

  doc.save(`HepaCDSS_BaoCao_HoiChan_${Date.now()}.pdf`);
}
