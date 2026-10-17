import {
  LeadWaveData,
  LeadName,
  LeadAnatomyInfo,
  LeadFilterMode,
  ManualAnnotation,
  AnnotationValidationReport,
  AnnotationValidationItem,
  WaveType,
} from './ecg-types';

export interface EcgPoint {
  x: number; // in millimeters (1mm = 0.04s)
  y: number; // in millimeters (10mm = 1mV)
}

/**
 * Detailed anatomical and coronary artery territorial map for each 12-lead
 */
export const LEAD_ANATOMY_MAP: Record<LeadName, LeadAnatomyInfo> = {
  I: {
    lead: "I",
    nameVi: "Chuyển đạo I (DI)",
    type: "Limb Bipolar",
    region: "Thành bên cao (High Lateral)",
    culpritVessel: "ĐM Mũ (LCx) / Nhánh chéo LAD",
    viewAngle: "Trục 0° (Cực âm: Cổ tay P, Cực dương: Cổ tay T)",
    description: "Khảo sát mặt bên thất trái. Bình thường QRS chủ yếu dương. ST chênh lên gợi ý NMCT thành bên.",
  },
  II: {
    lead: "II",
    nameVi: "Chuyển đạo II (DII)",
    type: "Limb Bipolar",
    region: "Thành dưới (Inferior Wall)",
    culpritVessel: "ĐM Vành Phải (RCA 85%) / ĐM Mũ (LCx 15%)",
    viewAngle: "Trục +60° (Dọc theo trục giải phẫu buồng tim)",
    description: "Trục dẫn truyền song song với khử cực thất. Sóng P và QRS rõ nhất, được chọn làm dải nhịp chuẩn (Rhythm Strip).",
  },
  III: {
    lead: "III",
    nameVi: "Chuyển đạo III (DIII)",
    type: "Limb Bipolar",
    region: "Thành dưới (Inferior Wall)",
    culpritVessel: "ĐM Vành Phải (RCA - Đoạn gần hoặc giữa)",
    viewAngle: "Trục +120° (Cực âm: Cổ tay T, Cực dương: Cổ chân T)",
    description: "Khảo sát mặt dưới tim. Khi ST chênh ở DIII > DII gợi ý mạnh tắc RCA hơn là LCx.",
  },
  aVR: {
    lead: "aVR",
    nameVi: "Chuyển đạo aVR",
    type: "Limb Unipolar",
    region: "Đáy tim / Buồng nhĩ-thất phải (Right Atrium/Basal)",
    culpritVessel: "Thân chung vành trái (LMCA) / Bệnh 3 nhánh nặng",
    viewAngle: "Trục -150° (Nhìn ngược hướng vào lòng buồng thất)",
    description: "Bình thường P, QRS, T đều âm sâu. ST chênh lên ≥ 1mm ở aVR là dấu hiệu báo động đỏ đe dọa sốc tim (tắc LMCA).",
  },
  aVL: {
    lead: "aVL",
    nameVi: "Chuyển đạo aVL",
    type: "Limb Unipolar",
    region: "Thành bên cao (High Lateral)",
    culpritVessel: "ĐM Mũ (LCx) / Nhánh chéo (Diagonal LAD)",
    viewAngle: "Trục -30° (Hướng về vai trái)",
    description: "Cùng DI quan sát thành bên cao. Sóng ST chênh xuống ở aVL là hình ảnh soi gương sớm nhất và nhạy nhất của NMCT thành dưới.",
  },
  aVF: {
    lead: "aVF",
    nameVi: "Chuyển đạo aVF",
    type: "Limb Unipolar",
    region: "Thành dưới (Inferior Wall)",
    culpritVessel: "ĐM Vành Phải (RCA) / ĐM Mũ (LCx)",
    viewAngle: "Trục +90° (Hướng thẳng đứng xuống bàn chân)",
    description: "Hợp cùng DII và DIII thành bộ ba chuyển đạo thành dưới. Đoạn ST chênh lên báo hiệu NMCT cấp thành dưới.",
  },
  V1: {
    lead: "V1",
    nameVi: "Chuyển đạo V1",
    type: "Precordial",
    region: "Vách liên thất (Septal) & Thất phải",
    culpritVessel: "Nhánh xuyên vách của ĐM Liên Thất Trước (LAD)",
    viewAngle: "Khoang liên sườn 4 bờ phải xương ức",
    description: "Nhìn trực tiếp thất phải và vách ngăn. R nhỏ, S sâu (rS). R cao bất thường gợi ý phì đại thất phải hoặc Bloc nhánh phải (RBBB).",
  },
  V2: {
    lead: "V2",
    nameVi: "Chuyển đạo V2",
    type: "Precordial",
    region: "Vách liên thất (Septal Wall)",
    culpritVessel: "ĐM Liên Thất Trước (LAD đoạn gần)",
    viewAngle: "Khoang liên sườn 4 bờ trái xương ức",
    description: "Quan sát vách liên thất. Vùng nhạy cảm phát hiện hội chứng Brugada (dạng vòm rSr' ở V1-V2) và thiếu máu cơ tim cấp.",
  },
  V3: {
    lead: "V3",
    nameVi: "Chuyển đạo V3",
    type: "Precordial",
    region: "Thành trước mỏm tim (Anterior Wall)",
    culpritVessel: "ĐM Liên Thất Trước (LAD đoạn giữa)",
    viewAngle: "Nằm giữa V2 và V4 (KLS 5)",
    description: "Vùng chuyển tiếp điện học. Bình thường sóng R và S cân bằng. ST chênh lên dạng vòm ở V3 là dấu hiệu điển hình của NMCT thành trước.",
  },
  V4: {
    lead: "V4",
    nameVi: "Chuyển đạo V4",
    type: "Precordial",
    region: "Thành trước mỏm tim (Anterior / Apical)",
    culpritVessel: "ĐM Liên Thất Trước (LAD)",
    viewAngle: "Khoang liên sườn 5 trên đường trung đòn trái",
    description: "Nhìn vào mỏm tim thất trái. ST chênh lên kèm sóng T cao nhọn khổng lồ (hyperacute T) báo hiệu tắc nghẽn cấp LAD.",
  },
  V5: {
    lead: "V5",
    nameVi: "Chuyển đạo V5",
    type: "Precordial",
    region: "Thành trước - bên (Anterolateral Wall)",
    culpritVessel: "ĐM Mũ (LCx) / Nhánh chéo LAD",
    viewAngle: "Khoang liên sườn 5 trên đường nách trước trái",
    description: "Quan sát mặt bên thất trái. Sóng R chiếm ưu thế biên độ cao. Dùng trong tiêu chuẩn Sokolow-Lyon chẩn đoán dày thất trái.",
  },
  V6: {
    lead: "V6",
    nameVi: "Chuyển đạo V6",
    type: "Precordial",
    region: "Thành bên thất trái (Lateral Wall)",
    culpritVessel: "ĐM Mũ (LCx)",
    viewAngle: "Khoang liên sườn 5 trên đường nách giữa trái",
    description: "Quan sát phần bên xa thất trái. QRS dương đồng dạng với DI và aVL. Sóng q nhỏ sinh lý thường thấy do khử cực vách ngăn.",
  },
};

/**
 * Filter categories for grouping leads by technique or heart territory
 */
export interface LeadGroupFilterDef {
  id: LeadFilterMode;
  label: string;
  badge: string;
  category: "all" | "technique" | "anatomy";
  leads: LeadName[];
  description: string;
  coronaryVessel?: string;
  clinicalRelevance: string;
}

export const LEAD_FILTER_DEFINITIONS: LeadGroupFilterDef[] = [
  {
    id: "ALL",
    label: "Toàn Bộ 12 Chuyển Đạo",
    badge: "12 Leads",
    category: "all",
    leads: ["I", "II", "III", "aVR", "aVL", "aVF", "V1", "V2", "V3", "V4", "V5", "V6"],
    description: "Bao quát toàn diện không gian 3 chiều của quả tim: 6 đạo trình chi + 6 đạo trình trước tim.",
    clinicalRelevance: "Khảo sát toàn bộ buồng tim, nhịp, dẫn truyền và trục điện học.",
  },
  {
    id: "LIMB_BIPOLAR",
    label: "Lưỡng Cực Chi (I, II, III)",
    badge: "Einthoven (3)",
    category: "technique",
    leads: ["I", "II", "III"],
    description: "Tam giác Einthoven đo hiệu điện thế giữa 2 chi (DI: Tay P-T, DII: Tay P-Chân T, DIII: Tay T-Chân T).",
    clinicalRelevance: "Kiểm tra định luật Einthoven (DII = DI + DIII), xác định trục QRS mặt phẳng trán và thiếu máu thành dưới.",
  },
  {
    id: "LIMB_UNIPOLAR",
    label: "Đơn Cực Chi Tăng Cường",
    badge: "Goldberger (3)",
    category: "technique",
    leads: ["aVR", "aVL", "aVF"],
    description: "Hệ thống Goldberger khuếch đại 50% biên độ so với điện cực trung tâm Wilson.",
    clinicalRelevance: "Phát hiện tắc thân chung vành trái (aVR), tổn thương thành bên (aVL) và thành dưới (aVF).",
  },
  {
    id: "LIMB_ALL",
    label: "Toàn Bộ 6 Chuyển Đạo Chi",
    badge: "Limb Leads (6)",
    category: "technique",
    leads: ["I", "II", "III", "aVR", "aVL", "aVF"],
    description: "6 chuyển đạo ngoại biên nằm trên mặt phẳng đứng trán (Frontal Plane).",
    clinicalRelevance: "Tính toán chính xác trục điện tim (góc alpha) trên vòng tròn Cabrera và phát hiện sớm đảo điện cực chi.",
  },
  {
    id: "CHEST_ALL",
    label: "Thành Ngực / Trước Tim (V1-V6)",
    badge: "Wilson Precordial (6)",
    category: "technique",
    leads: ["V1", "V2", "V3", "V4", "V5", "V6"],
    description: "6 chuyển đạo trước tim nằm trên mặt phẳng cắt ngang (Horizontal Plane) ôm sát thành ngực.",
    clinicalRelevance: "Khảo sát thành trước, vách liên thất, mỏm tim và thành bên. Đánh giá sự tiến triển sóng R (rS -> qR).",
  },
  {
    id: "INFERIOR",
    label: "Vùng Thành Dưới (DII, DIII, aVF)",
    badge: "Thành Dưới (3)",
    category: "anatomy",
    leads: ["II", "III", "aVF"],
    coronaryVessel: "ĐM Vành Phải (RCA 85%) / ĐM Mũ (LCx 15%)",
    description: "Mặt dưới (hoành) của tâm thất trái nằm áp lên cơ hoành.",
    clinicalRelevance: "Chẩn đoán NMCT thành dưới. Cần đo thêm V3R-V4R loại trừ NMCT thất phải trước khi dùng Nitroglycerin.",
  },
  {
    id: "SEPTAL",
    label: "Vùng Vách Liên Thất (V1, V2)",
    badge: "Vách Ngăn (2)",
    category: "anatomy",
    leads: ["V1", "V2"],
    coronaryVessel: "Nhánh xuyên vách của ĐM Liên Thất Trước (LAD)",
    description: "Nằm sát vách ngăn 2 buồng thất và mặt trước thất phải.",
    clinicalRelevance: "Nhận diện Bloc nhánh phải (rSR'), Bloc nhánh trái, hội chứng Brugada Type 1/2 và hoại tử vách.",
  },
  {
    id: "ANTERIOR",
    label: "Vùng Thành Trước (V3, V4)",
    badge: "Thành Trước (2)",
    category: "anatomy",
    leads: ["V3", "V4"],
    coronaryVessel: "ĐM Liên Thất Trước (LAD đoạn giữa và xa)",
    description: "Thành trước tự do của tâm thất trái và vùng mỏm tim.",
    clinicalRelevance: "Vùng cơ tim dày nhất của thất trái; NMCT thành trước có nguy cơ suy tim cấp, rối loạn nhịp thất và vỡ tim cao nhất.",
  },
  {
    id: "ANTEROSEPTAL",
    label: "Trước - Vách (V1, V2, V3, V4)",
    badge: "Trước Vách (4)",
    category: "anatomy",
    leads: ["V1", "V2", "V3", "V4"],
    coronaryVessel: "ĐM Liên Thất Trước (LAD)",
    description: "Bao quát toàn bộ vách liên thất kéo dài ra thành trước thất trái.",
    clinicalRelevance: "Vùng giải phẫu kinh điển tổn thương khi tắc ĐM LAD. ST chênh lên vòm cao kèm mất sóng R (Poor R progression).",
  },
  {
    id: "LATERAL",
    label: "Vùng Thành Bên (DI, aVL, V5, V6)",
    badge: "Thành Bên (4)",
    category: "anatomy",
    leads: ["I", "aVL", "V5", "V6"],
    coronaryVessel: "ĐM Mũ (LCx) & Nhánh chéo (Diagonal) của LAD",
    description: "Bao gồm thành bên cao (DI, aVL) và thành bên thấp gần mỏm tim (V5, V6).",
    clinicalRelevance: "Chẩn đoán NMCT thành bên đơn thuần hoặc phối hợp trong NMCT trước - bên diện rộng.",
  },
];

/**
 * Generates an authentic ECG waveform signal in mm units for drawing on standard
 * 25mm/s, 10mm/mV ECG grid paper.
 * Length: durationSec (e.g. 2.5s for 3x4 view, or 10s for rhythm strip)
 */
export function generateLeadWaveformPoints(
  waveData: LeadWaveData,
  heartRate: number,
  durationSec: number = 2.5,
  options: {
    rhythmVariance?: number; // 0 for strictly regular, >0 for AFib
    baselineWander?: boolean;
    sampleRate?: number; // samples per second
    voltageScale?: number; // 1.0 = 10mm/mV
  } = {}
): EcgPoint[] {
  const sampleRate = options.sampleRate || 350; // 350 Hz high-fidelity clinical standard
  const totalSamples = Math.floor(durationSec * sampleRate);
  const rrIntervalSec = 60 / Math.max(25, Math.min(240, heartRate));
  const points: EcgPoint[] = [];

  const mmPerSec = 25; // 25mm/s paper speed
  const mmPerMv = 10 * (options.voltageScale ?? 1.0); // 10mm/mV standard calibration

  // Track cardiac cycles
  let cycleStartSec = 0.15; // start with slight margin after calibration pulse
  const cycles: number[] = [];
  while (cycleStartSec < durationSec + 1.0) {
    cycles.push(cycleStartSec);
    let currentRr = rrIntervalSec;
    if (options.rhythmVariance) {
      // irregular rhythm e.g. Atrial Fibrillation
      const jitter = (Math.sin(cycleStartSec * 3.7) + Math.cos(cycleStartSec * 7.1)) * 0.5;
      currentRr = rrIntervalSec * (1 + jitter * options.rhythmVariance);
    }
    cycleStartSec += currentRr;
  }

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate; // time in seconds
    const xMm = t * mmPerSec;

    // Baseline drift if enabled
    let baseline = 0;
    if (options.baselineWander) {
      baseline = Math.sin(t * 0.8) * 0.5 + Math.cos(t * 0.3) * 0.3;
    }

    // Find closest cardiac cycle
    let vMv = 0;
    for (const cStart of cycles) {
      const dt = t - cStart;
      if (dt >= -0.15 && dt < rrIntervalSec) {
        vMv += calculateCycleVoltage(dt, waveData, heartRate);
      }
    }

    // Slight high-frequency biological fuzz (0.01 mV) for clinical authenticity
    const microFuzz = (Math.sin(i * 1.3) * Math.cos(i * 2.7)) * 0.015;
    const finalMv = vMv + baseline + microFuzz;

    // On standard ECG grid: y is in mm (positive deflection points upward)
    const yMm = finalMv * mmPerMv;
    points.push({ x: xMm, y: yMm });
  }

  return points;
}

/**
 * Calculates voltage (mV) at time offset dt (seconds from cycle start)
 * Incorporates Bazett-style rate scaling and sharp high-slew biological depolarizations.
 */
function calculateCycleVoltage(dt: number, w: LeadWaveData, heartRate: number = 75): number {
  let v = 0;

  // Rate adaptation factor for ST-T duration (based on Bazett principle sqrt(RR / 0.8))
  const hrClamped = Math.max(30, Math.min(220, heartRate));
  const rrSec = 60 / hrClamped;
  const rateFactor = Math.max(0.65, Math.min(1.35, Math.sqrt(rrSec / 0.8)));

  // P Wave (begins at dt = 0.0)
  const pDur = (w.pWave.dur || 0.08) * (rateFactor < 1.0 ? Math.max(0.75, rateFactor) : 1.0);
  const pAmp = w.pWave.amp || 0.15;
  if (dt >= 0 && dt < pDur) {
    const norm = dt / pDur;
    if (w.pWave.shape === "bifid") {
      // P mitrale / 2 peaks (M shape)
      v += pAmp * (Math.sin(norm * Math.PI * 2) * 0.45 + Math.sin(norm * Math.PI) * 0.65);
    } else if (w.pWave.shape === "peaked") {
      // P pulmonale (peaked tented P wave)
      v += pAmp * Math.pow(Math.sin(norm * Math.PI), 1.8);
    } else if (w.pWave.shape === "inverted") {
      v -= Math.abs(pAmp) * Math.sin(norm * Math.PI);
    } else if (w.pWave.shape === "flat") {
      v += 0;
    } else {
      // Physiological asymmetric dome: slightly slower ascending limb
      const skewedNorm = Math.pow(norm, 0.92);
      v += pAmp * Math.sin(skewedNorm * Math.PI);
    }
  }

  // PR Segment
  const prDur = (w.prSegment.dur || 0.08) * (rateFactor < 1.0 ? Math.max(0.75, rateFactor) : 1.0);
  const prEnd = pDur + prDur;
  if (dt >= pDur && dt < prEnd && w.prSegment.deviation) {
    v += w.prSegment.deviation;
  }

  // QRS Complex (sharp biological depolarization)
  const qrsStart = prEnd;
  const qDur = w.qWave.dur || 0.02;
  const rDur = w.rWave.dur || 0.04;
  const sDur = w.sWave.dur || 0.03;

  // Q wave (sharp nadir trough)
  if (dt >= qrsStart && dt < qrsStart + qDur) {
    const norm = (dt - qrsStart) / qDur;
    v += w.qWave.amp * Math.pow(Math.sin(norm * Math.PI), 1.25);
  }

  // R wave (sharp triangular apex)
  const rStart = qrsStart + qDur;
  if (dt >= rStart && dt < rStart + rDur) {
    const norm = (dt - rStart) / rDur;
    let rVal = w.rWave.amp * Math.pow(Math.sin(norm * Math.PI), 1.25);
    if (w.rWave.notched) {
      rVal *= (1 - 0.28 * Math.sin(norm * Math.PI * 3));
    }
    v += rVal;
  }

  // S wave (sharp negative deflection)
  const sStart = rStart + rDur;
  if (dt >= sStart && dt < sStart + sDur) {
    const norm = (dt - sStart) / sDur;
    v += w.sWave.amp * Math.pow(Math.sin(norm * Math.PI), 1.25);
  }

  // R' wave (R prime for RBBB / Brugada)
  const rPrimeStart = sStart + sDur;
  if (w.rPrimeWave && w.rPrimeWave.amp > 0) {
    const rPrimeDur = w.rPrimeWave.dur || 0.04;
    if (dt >= rPrimeStart && dt < rPrimeStart + rPrimeDur) {
      const norm = (dt - rPrimeStart) / rPrimeDur;
      v += w.rPrimeWave.amp * Math.pow(Math.sin(norm * Math.PI), 1.25);
    }
  }

  // ST Segment (rate-scaled)
  const qrsEnd = rPrimeStart + (w.rPrimeWave?.amp ? (w.rPrimeWave.dur || 0.04) : 0);
  const stDur = 0.10 * rateFactor;
  if (dt >= qrsEnd && dt < qrsEnd + stDur) {
    const norm = (dt - qrsEnd) / stDur;
    const elev = w.stSegment.elevation;
    if (w.stSegment.slope === "coved") {
      // Tombstone / coved elevation (STEMI or Brugada Type 1)
      v += elev * (Math.cos(norm * (Math.PI / 2)) * 0.8 + 0.2);
    } else if (w.stSegment.slope === "scooped") {
      // Digoxin scooped depression
      v += elev * Math.sin(norm * Math.PI) * 1.1;
    } else if (w.stSegment.slope === "downsloping") {
      v += elev * (1 - norm * 0.75);
    } else if (w.stSegment.slope === "upsloping") {
      v += elev * (0.25 + norm * 0.75);
    } else {
      v += elev;
    }
  }

  // T Wave (rate-scaled with physiological asymmetry)
  const tStart = qrsEnd + stDur;
  const tDur = (w.tWave.dur || 0.16) * rateFactor;
  if (dt >= tStart && dt < tStart + tDur) {
    const norm = (dt - tStart) / tDur;
    const tAmp = w.tWave.amp;
    if (w.tWave.shape === "peaked") {
      // Tall tented peaked T (Hyperkalemia)
      v += tAmp * Math.pow(Math.sin(norm * Math.PI), 2.3);
    } else if (w.tWave.shape === "inverted") {
      // Inverted T
      v -= Math.abs(tAmp) * Math.sin(norm * Math.PI);
    } else if (w.tWave.shape === "biphasic") {
      // Biphasic (+/- or -/+)
      v += tAmp * Math.sin(norm * Math.PI * 2);
    } else if (w.tWave.shape === "hyperacute") {
      v += tAmp * 1.5 * Math.pow(Math.sin(norm * Math.PI), 1.3);
    } else {
      // Standard asymmetric T: slow rise, faster fall
      const skewedNorm = Math.pow(norm, 0.82);
      v += tAmp * Math.sin(skewedNorm * Math.PI);
    }
  }

  // U Wave
  const uStart = tStart + tDur + 0.02 * rateFactor;
  const uDur = (w.uWave?.dur || 0.08) * rateFactor;
  if (w.uWave && w.uWave.amp !== 0 && dt >= uStart && dt < uStart + uDur) {
    const norm = (dt - uStart) / uDur;
    v += w.uWave.amp * Math.sin(norm * Math.PI);
  }

  return v;
}

/**
 * Builds SVG path data from array of points on canvas, with optional sweep cutoff
 */
export function pointsToSvgPath(
  points: EcgPoint[],
  pixelsPerMmX: number,
  pixelsPerMmY: number,
  originYPx: number,
  offsetX: number = 0,
  maxPxX?: number
): string {
  if (points.length === 0) return "";
  let d = "";
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const x = offsetX + p.x * pixelsPerMmX;
    if (maxPxX !== undefined && x > maxPxX) {
      break;
    }
    const y = originYPx - p.y * pixelsPerMmY; // inverted Y axis for screen SVG
    if (i === 0) {
      d += `M ${x.toFixed(1)} ${y.toFixed(1)}`;
    } else {
      d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
  }
  return d;
}

/**
 * Audio Context singleton for authentic medical cardiac monitor QRS beep tone
 */
let audioCtx: AudioContext | null = null;

export function playQrsBeep(pitch: number = 880, volume: number = 0.05) {
  if (typeof window === "undefined") return;
  try {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtxClass) return;
    if (!audioCtx) {
      audioCtx = new AudioCtxClass();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(pitch, audioCtx.currentTime);

    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.07);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.075);
  } catch {
    // Gracefully handle browser autoplay policies
  }
}

/**
 * Draw 1mV standard calibration pulse
 * Pulse width = 0.20s (5mm), height = 1mV (10mm)
 */
export function generateCalibrationPulse(
  pixelsPerMmX: number,
  pixelsPerMmY: number,
  originYPx: number,
  startX: number = 5
): string {
  const w = 5 * pixelsPerMmX; // 5mm
  const h = 10 * pixelsPerMmY; // 10mm = 1mV
  const x0 = startX;
  const y0 = originYPx;
  const yTop = originYPx - h;

  return `M ${x0} ${y0} L ${x0} ${yTop} L ${x0 + w} ${yTop} L ${x0 + w} ${y0}`;
}

/**
 * Validates manual wave annotations against theoretical ECG waveform timing and morphology
 * based on clinical rules from BS Nguyễn Tôn Kinh Thi.
 */
export function validateUserManualAnnotations(
  annotations: ManualAnnotation[],
  waveData: LeadWaveData,
  lead: LeadName,
  heartRate: number,
  caseTitle: string
): AnnotationValidationReport {
  if (annotations.length === 0) {
    return {
      overallScore: 0,
      totalAnnotations: 0,
      passedCount: 0,
      feedback: "Chưa có nhãn sóng nào được gán trên chuyển đạo " + lead + ". Vui lòng chọn sóng (P, Q, R, S, J, T) và nhấp chuột lên đường biểu diễn điện tâm đồ.",
      items: [],
      clinicalPearl: "Theo BS Nguyễn Tôn Kinh Thi: Xác định chính xác sóng P và phức bộ QRS là chìa khóa để định danh mọi rối loạn nhịp tim.",
      guidanceChapter: "Chương 1 - Nguyên lý các sóng & khoảng thời gian cơ bản",
    };
  }

  // Calculate ground-truth landmark timings within a cycle (in ms)
  const pDurMs = (waveData.pWave.dur || 0.08) * 1000;
  const prSegmentMs = (waveData.prSegment.dur || 0.08) * 1000;
  const prEndMs = pDurMs + prSegmentMs;
  const qDurMs = (waveData.qWave.dur || 0.02) * 1000;
  const rDurMs = (waveData.rWave.dur || 0.04) * 1000;
  const sDurMs = (waveData.sWave.dur || 0.03) * 1000;
  const stDurMs = 100;
  const tDurMs = (waveData.tWave.dur || 0.16) * 1000;

  const expectedLandmarks: Record<WaveType, { expectedMs: number; toleranceMs: number; description: string }> = {
    P: {
      expectedMs: pDurMs * 0.5,
      toleranceMs: 35,
      description: "Đỉnh sóng P (Khử cực hai tâm nhĩ, đi trước phức bộ QRS)",
    },
    Q: {
      expectedMs: prEndMs + qDurMs * 0.5,
      toleranceMs: 25,
      description: "Sóng âm đầu tiên của phức bộ QRS (Khử cực vách liên thất từ trái sang phải)",
    },
    R: {
      expectedMs: prEndMs + qDurMs + rDurMs * 0.5,
      toleranceMs: 30,
      description: "Đỉnh dương lớn nhất (Khử cực tâm thất)",
    },
    S: {
      expectedMs: prEndMs + qDurMs + rDurMs + sDurMs * 0.5,
      toleranceMs: 30,
      description: "Sóng âm theo sau sóng R (Khử cực phần đáy tâm thất)",
    },
    J: {
      expectedMs: prEndMs + qDurMs + rDurMs + sDurMs,
      toleranceMs: 35,
      description: "Điểm J (Giao điểm kết thúc QRS và bắt đầu đoạn ST, then chốt chẩn đoán nhồi máu cơ tim)",
    },
    T: {
      expectedMs: prEndMs + qDurMs + rDurMs + sDurMs + stDurMs + tDurMs * 0.6,
      toleranceMs: 65,
      description: "Đỉnh sóng T (Giai đoạn tái cực nhanh của tâm thất)",
    },
    U: {
      expectedMs: prEndMs + qDurMs + rDurMs + sDurMs + stDurMs + tDurMs + 80,
      toleranceMs: 60,
      description: "Sóng U (Tái cực mạng Purkinje hoặc cơ nhú)",
    },
  };

  const validatedItems: AnnotationValidationItem[] = [];
  let totalScore = 0;
  let passed = 0;

  const cycleMs = heartRate > 0 ? (60000 / heartRate) : 800;

  for (const ann of annotations) {
    const landmark = expectedLandmarks[ann.waveType];
    if (!landmark) continue;

    // Tính chu kỳ nhịp gần nhất để hỗ trợ chấm điểm trên mọi nhịp tim trong toàn dải ECG
    const beatIndex = Math.max(0, Math.round((ann.timeMs - landmark.expectedMs) / cycleMs));
    const targetExpectedMs = landmark.expectedMs + beatIndex * cycleMs;
    const diff = Math.abs(ann.timeMs - targetExpectedMs);
    let status: "EXACT" | "CLOSE" | "MISPLACED" = "MISPLACED";
    let score = 30;
    let message = "";
    let morphologyEvaluation = "";

    if (diff <= landmark.toleranceMs) {
      status = "EXACT";
      score = 100;
      passed++;
      message = `Chính xác tuyệt đối! Vị trí tại ${ann.timeMs}ms trùng khớp hoàn hảo với ${landmark.description} (nhịp ${beatIndex + 1}, lệch ${diff}ms).`;
    } else if (diff <= landmark.toleranceMs * 2.2) {
      status = "CLOSE";
      score = 75;
      passed++;
      message = `Khá chuẩn xác! Vị trí tại ${ann.timeMs}ms lệch ${diff}ms so với đỉnh lý thuyết (${Math.round(targetExpectedMs)}ms, nhịp ${beatIndex + 1}).`;
    } else {
      status = "MISPLACED";
      score = Math.max(10, 50 - Math.round(diff * 0.2));
      message = `Chưa chính xác: Vị trí được chấm tại ${ann.timeMs}ms lệch tới ${diff}ms so với vị trí chuẩn (${Math.round(targetExpectedMs)}ms, nhịp ${beatIndex + 1}).`;
    }

    // Morphology remarks based on BS Nguyễn Tôn Kinh Thi
    if (ann.waveType === "R") {
      morphologyEvaluation = `Đạo trình ${lead}: Sóng R cao ${waveData.rWave.amp.toFixed(2)}mV. Trục khử cực bình thường hướng từ đáy đến mỏm.`;
    } else if (ann.waveType === "P") {
      morphologyEvaluation = `Sóng P thời gian ${pDurMs}ms (< 120ms chuẩn). Chiều cao ${waveData.pWave.amp.toFixed(2)}mV.`;
    } else if (ann.waveType === "J") {
      const elev = waveData.stSegment.elevation;
      morphologyEvaluation = `Điểm J tại ${lead}: Đoạn ST đang ${elev > 0 ? `chênh lên +${elev.toFixed(1)}mV` : elev < 0 ? `chênh xuống ${elev.toFixed(1)}mV` : "đẳng điện 0mV"}.`;
    } else if (ann.waveType === "T") {
      morphologyEvaluation = `Sóng T hình thái ${waveData.tWave.shape || "bình thường"}, biên độ ${waveData.tWave.amp.toFixed(2)}mV.`;
    } else {
      morphologyEvaluation = `${landmark.description}.`;
    }

    totalScore += score;
    validatedItems.push({
      annotationId: ann.id,
      waveType: ann.waveType,
      lead: ann.lead,
      status,
      score,
      actualTimeMs: ann.timeMs,
      expectedTimeMs: Math.round(landmark.expectedMs),
      message,
      morphologyEvaluation,
    });
  }

  const overallScore = Math.round(totalScore / annotations.length);
  let feedback = "";
  if (overallScore >= 90) {
    feedback = `Xuất sắc (${overallScore}/100)! Bạn có kỹ năng nhận diện mốc sóng ECG rất vững vàng và chuẩn xác.`;
  } else if (overallScore >= 70) {
    feedback = `Tốt (${overallScore}/100)! Đa số các sóng cơ bản (P, R, T) đã được gán nhãn đúng vị trí. Chú ý tinh chỉnh thêm mốc điểm J và chân sóng Q/S.`;
  } else {
    feedback = `Cần rèn luyện thêm (${overallScore}/100). Hãy đối chiếu lại khoảng thời gian PR (120-200ms) và thời gian QRS (< 120ms) để nhận diện đúng vị trí từng sóng.`;
  }

  return {
    overallScore,
    totalAnnotations: annotations.length,
    passedCount: passed,
    feedback,
    items: validatedItems,
    clinicalPearl: `Lời khuyên lâm sàng (${caseTitle}): Theo tài liệu BS Nguyễn Tôn Kinh Thi, việc xác định điểm J (J-point) ngay sau phức bộ QRS là mấu chốt để phân biệt nhồi máu cơ tim ST chênh lên (STEMI) với hội chứng tái cực sớm lành tính hoặc bloc nhánh trái.`,
    guidanceChapter: "Chương 2 - Định vị điểm J và phân tích biến đổi đoạn ST-T",
  };
}

/**
 * ============================================================================
 * ADVANCED ECG DYNAMICS & POINCARÉ HRV (inspired by mondejar/ecg-classification)
 * ============================================================================
 */
export interface PoincarePoint {
  rrN: number;     // ms
  rrN1: number;    // ms
  label?: string;  // N, V, A, L, R
}

export interface PoincareHrvAnalysis {
  points: PoincarePoint[];
  meanRr: number;
  meanHr: number;
  sd1: number;      // ms (short-term variability)
  sd2: number;      // ms (long-term variability)
  sdRatio: number;  // sd1 / sd2
  rmssd: number;    // Root mean square of successive differences
  rhythmInterpretation: string;
}

export interface BeatMorphologyPoint {
  timeMs: number;   // relative to R peak (-250 to +400ms)
  meanMv: number;
  upperMv: number;  // mean + 1 SD
  lowerMv: number;  // mean - 1 SD
}

/**
 * Generates dynamic Poincaré plot points and HRV autonomic indices (SD1, SD2)
 * for any ECG case based on its clinical heart rate and regularity classification.
 */
/**
 * Generates dynamic sequence of RR intervals matching heart rate and clinical rhythm.
 */
export function generateCaseRrIntervals(
  heartRate: number,
  regularity: string,
  category: string,
  count: number = 80
): number[] {
  const baseRr = 60000 / Math.max(30, Math.min(220, heartRate));
  const isAFib = regularity.includes("Loạn nhịp") || category === "Arrhythmia";
  const isIrregular = regularity.includes("Không đều");

  let targetSd1 = 28.0;
  let targetSd2 = 72.0;

  if (isAFib) {
    targetSd1 = 110.0;
    targetSd2 = 180.0;
  } else if (isIrregular) {
    targetSd1 = 65.0;
    targetSd2 = 115.0;
  } else if (heartRate > 110) {
    targetSd1 = 12.0;
    targetSd2 = 35.0;
  }

  const rrList: number[] = [];
  for (let i = 0; i < count; i++) {
    const u1 = Math.max(1e-6, (Math.sin(i * 12.9898 + 78.233) * 43758.5453) % 1);
    const u2 = Math.max(1e-6, (Math.cos(i * 93.9898 + 67.345) * 24634.6345) % 1);
    const z0 = Math.sqrt(-2.0 * Math.log(Math.abs(u1))) * Math.cos(2.0 * Math.PI * u2);
    const z1 = Math.sqrt(-2.0 * Math.log(Math.abs(u1))) * Math.sin(2.0 * Math.PI * u2);

    let rr = baseRr + (z0 * targetSd2 + z1 * targetSd1) / Math.SQRT2;

    if (isIrregular && i % 10 === 3) {
      rr = baseRr * 0.68; // premature ectopic beat
    } else if (isIrregular && i % 10 === 4) {
      rr = baseRr * 1.32; // compensatory pause
    }

    rrList.push(Math.round(Math.max(280, Math.min(2000, rr))));
  }
  return rrList;
}

/**
 * Generates dynamic Poincaré plot points and HRV autonomic indices (SD1, SD2)
 * for any ECG case based on recorded RR intervals or clinical heart rate and regularity classification.
 */
export function calculateCasePoincareHrv(
  heartRate: number,
  regularity: string,
  category: string,
  recordedRrList?: number[]
): PoincareHrvAnalysis {
  const baseRr = 60000 / Math.max(30, Math.min(220, heartRate));
  const isAFib = regularity.includes("Loạn nhịp") || category === "Arrhythmia";

  const rrList: number[] = (recordedRrList && recordedRrList.length >= 8)
    ? [...recordedRrList]
    : generateCaseRrIntervals(heartRate, regularity, category, 90);

  // Build (RR_n, RR_{n+1}) points
  const points: PoincarePoint[] = [];
  const diffs: number[] = [];

  for (let i = 0; i < rrList.length - 1; i++) {
    const rrN = rrList[i];
    const rrN1 = rrList[i + 1];
    const d = rrN1 - rrN;
    diffs.push(d);

    let label = "N";
    if (rrN < baseRr * 0.78) label = "V"; // Ectopic / premature
    else if (rrN > baseRr * 1.25) label = "Pause";

    points.push({ rrN, rrN1, label });
  }

  // Calculate actual SD1, SD2, RMSSD
  const meanRr = rrList.reduce((a, b) => a + b, 0) / rrList.length;
  const meanHr = Math.round(60000 / meanRr);

  const varDiff = diffs.reduce((sum, d) => sum + d * d, 0) / Math.max(1, diffs.length);
  const sd1 = Math.sqrt(0.5 * varDiff);

  const varRr = rrList.reduce((sum, r) => sum + (r - meanRr) ** 2, 0) / Math.max(1, rrList.length);
  const sd2 = Math.sqrt(Math.max(1.0, 2 * varRr - 0.5 * varDiff));
  const sdRatio = sd1 / (sd2 + 1e-6);
  const rmssd = Math.sqrt(varDiff);

  let rhythmInterpretation = "Nhịp xoang bình thường: Biểu đồ Poincaré dạng điếu xì gà (Cigar-shaped), hệ đối giao cảm và giao cảm cân bằng.";
  if (isAFib) {
    rhythmInterpretation = "Rung nhĩ (AFib): Đám mây điểm hình quạt/tam giác phân tán rộng vô định hình, mất tương quan giữa các chu kỳ tim liên tiếp.";
  } else if (sd1 > 50) {
    rhythmInterpretation = "Loạn nhịp / Ngoại tâm thu rải rác: Xuất hiện các cụm điểm vệ tinh nằm tách biệt khỏi trục chính (Line of Identity).";
  } else if (sd2 < 40) {
    rhythmInterpretation = "Giảm biến thiên nhịp tim (Depressed HRV): Đám mây điểm co cụm chặt chẽ quanh tâm, cảnh báo quá tải thần kinh giao cảm.";
  }

  return {
    points,
    meanRr: Math.round(meanRr),
    meanHr,
    sd1: Number(sd1.toFixed(1)),
    sd2: Number(sd2.toFixed(1)),
    sdRatio: Number(sdRatio.toFixed(3)),
    rmssd: Number(rmssd.toFixed(1)),
    rhythmInterpretation
  };
}

/**
 * Computes Beat Morphology Profile with Mean Waveform and Confidence Ribbon
 * (Mean Beat ± 1 SD) for clinical overlay inspection.
 */
export function generateBeatMorphologyProfile(
  leadData: LeadWaveData,
  heartRate: number
): BeatMorphologyPoint[] {
  const points: BeatMorphologyPoint[] = [];
  const dtRange = 0.65; // from -0.25s to +0.40s
  const step = 0.005;   // 5ms resolution = 200 Hz
  const tMin = -0.25;

  for (let t = tMin; t <= 0.40; t += step) {
    const timeMs = Math.round(t * 1000);
    // Base cycle voltage calculation centered at R-peak
    // WaveData timing in ecg-math: P wave is around dt=0, QRS is at ~0.16s
    // Shift so R-peak is at 0ms
    const rOffset = (leadData.pWave.dur || 0.08) + (leadData.prSegment.dur || 0.06) + (leadData.qWave.dur || 0.02) + (leadData.rWave.dur || 0.04) * 0.5;
    const cycleDt = t + rOffset;

    let v = calculateCycleVoltage(cycleDt, leadData, heartRate);

    // Natural beat-to-beat variability (SD) is highest during repolarization (ST-T) and baseline
    const repolFactor = Math.abs(t - 0.20) < 0.15 ? 0.08 : 0.03;
    const stdDev = Math.max(0.02, repolFactor * (1.0 + Math.abs(v) * 0.15));

    points.push({
      timeMs,
      meanMv: Number(v.toFixed(3)),
      upperMv: Number((v + stdDev).toFixed(3)),
      lowerMv: Number((v - stdDev).toFixed(3))
    });
  }

  return points;
}

