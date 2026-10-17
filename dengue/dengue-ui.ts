/**
 * CliniPortal CDSS — Dengue UI Workstation & Interactive Controller v3.0
 * Path: public/cdss/dengue/dengue-ui.ts
 * Standard: Clean Clinical, Ultra-Responsive (Desktop / Tablet / Mobile), Icon-First, Zero-Pill Discipline
 * Comprehensive Non-Response & Refractory Shock Management Suite (BYT QĐ 2760/2023)
 */

import {
  DenguePatientInput,
  DengueCDSSPlan,
  Gender,
  DengueSeverity,
  ColloidType,
  HemodynamicProfile,
  VasopressorDecisionResult
} from '../cdss-types';

import {
  generateDengueCDSSPlan,
  calculateAlbuminDose,
  calculateColloidSchedule,
  evaluateVasopressorAlgorithm,
  calculatePumpRateFromDose,
  calculateDoseFromPumpRate
} from './dengue-engine';

import {
  DENGUE_FLUID_TEMPLATES,
  DENGUE_NON_RESPONSE_SCENARIOS,
  CDC_STANDARD_WEIGHT,
  ADULT_SHOCK_HEIGHTS,
  ADULT_SHOCK_WEIGHTS,
  getAdultShockCell,
  DENGUE_COLLOID_METADATA,
  DENGUE_COLLOID_TEMPLATES,
  DENGUE_DE_ESCALATION_CHECKLIST
} from './dengue-data';

export type WorkspaceMode = 'fluid_schedule' | 'colloid_schedule' | 'refractory_suite' | 'vasopressors' | 'nursing_checklist';

interface ClinicalSampleCase {
  id: string;
  category: 'initial' | 'refractory';
  icon: string;
  label: string;
  tag: string;
  isDanger?: boolean;
  input: {
    ageYears: number;
    gender: Gender;
    actualWeightKg: number;
    heightCm?: number;
    severity: DengueSeverity;
    clinicalResponse?: string;
    currentHctPercent?: number;
    baselineHctPercent?: number;
    massiveBleeding?: boolean;
    liverEnzymesAST_ALT?: number;
    plateletsCount?: number;
    cvpValue?: number;
  };
  clinicalHighlight: string;
}

const CLINICAL_SAMPLE_CASES: ClinicalSampleCase[] = [
  // 1. Nhóm Bù Dịch Ban Đầu & Phân Tầng Thể Trạng
  {
    id: 'child-obese',
    category: 'initial',
    icon: 'fa-solid fa-child',
    label: 'Bé 8T Béo Phì (38kg)',
    tag: 'CDC 2014',
    input: {
      ageYears: 8,
      gender: 'male',
      actualWeightKg: 38,
      severity: 'warning_signs',
      clinicalResponse: 'good',
      currentHctPercent: 42,
      baselineHctPercent: 36
    },
    clinicalHighlight: 'Trẻ béo phì > 120% chuẩn: Tự động dùng cân nặng hiệu chỉnh CDC 2014 (26kg) tránh phù phổi cấp.'
  },
  {
    id: 'adult-obese-shock',
    category: 'initial',
    icon: 'fa-solid fa-weight-scale',
    label: 'Nam 35T Béo Phì (75kg)',
    tag: 'Phụ Lục 9 BYT',
    input: {
      ageYears: 35,
      gender: 'male',
      actualWeightKg: 75,
      heightCm: 165,
      severity: 'shock',
      clinicalResponse: 'good',
      currentHctPercent: 47,
      baselineHctPercent: 39
    },
    clinicalHighlight: 'Nam 35T béo phì (165cm, 75kg, BMI 27.5 ≥ 25): Bắt buộc dùng Cân nặng hiệu chỉnh Phụ lục 9 BYT (67kg thay vì 75kg) để phòng ngừa phù phổi cấp.'
  },
  {
    id: 'child-shock',
    category: 'initial',
    icon: 'fa-solid fa-heart-pulse',
    label: 'Bé Gái 5T Sốc (16kg)',
    tag: 'Sốc Còn Bù',
    input: {
      ageYears: 5,
      gender: 'female',
      actualWeightKg: 16,
      severity: 'shock',
      clinicalResponse: 'good',
      currentHctPercent: 41,
      baselineHctPercent: 35
    },
    clinicalHighlight: 'Trẻ nhỏ sốc còn bù: Chống sốc 15 ml/kg/h cữ 1, theo dõi sát sinh hiệu và Hct.'
  },
  {
    id: 'adult-severe-shock',
    category: 'initial',
    icon: 'fa-solid fa-bolt',
    label: 'Nữ 35T Sốc Nguy Kịch (62kg)',
    tag: 'Mạch 0 - HA 0',
    isDanger: true,
    input: {
      ageYears: 35,
      gender: 'female',
      actualWeightKg: 62,
      heightCm: 155,
      severity: 'severe_shock',
      clinicalResponse: 'good',
      currentHctPercent: 49,
      baselineHctPercent: 38
    },
    clinicalHighlight: 'Nữ 35T sốc nguy kịch 62kg (155cm, BMI 25.8 ≥ 25, hiệu chỉnh 54kg): Bơm dịch 20 ml/kg/h siêu tốc + chuẩn bị Noradrenalin bơm tiêm điện.'
  },
  {
    id: 'adult-shock-compensated',
    category: 'initial',
    icon: 'fa-solid fa-person',
    label: 'Nam 30T Sốc Còn Bù (70kg)',
    tag: 'Đáp Ứng Tốt',
    input: {
      ageYears: 30,
      gender: 'male',
      actualWeightKg: 70,
      heightCm: 170,
      severity: 'shock',
      clinicalResponse: 'good',
      currentHctPercent: 46,
      baselineHctPercent: 38
    },
    clinicalHighlight: 'Nam 30T sốc còn bù (170cm, 70kg, BMI 24.2 < 25): Dùng cân nặng thực 70kg theo Phụ lục 9, bù dịch nấc thang 15 -> 10 -> 6 -> 3 -> 1.5 ml/kg/h.'
  },

  // 2. Nhóm Sốc Trơ & Xử Trí Không Đáp Ứng
  {
    id: 'child-refractory-cpt',
    category: 'refractory',
    icon: 'fa-solid fa-arrow-trend-up',
    label: 'Trẻ 7T Trơ Dịch (23kg)',
    tag: 'Hct 48% · Đổi CPT',
    isDanger: true,
    input: {
      ageYears: 7,
      gender: 'male',
      actualWeightKg: 23,
      severity: 'shock',
      clinicalResponse: 'refractory_hct_high',
      currentHctPercent: 48,
      baselineHctPercent: 37
    },
    clinicalHighlight: 'Sốc trơ dịch tinh thể, Hct 48%: Thoát huyết tương nặng -> Đổi ngay Cao phân tử Dextran 40 10-20 ml/kg/h.'
  },
  {
    id: 'adult-bleeding',
    category: 'refractory',
    icon: 'fa-solid fa-droplet',
    label: 'Nam 32T Sốc Kéo Dài (58kg)',
    tag: 'Hct 26% · Mất Máu Ẩn',
    isDanger: true,
    input: {
      ageYears: 32,
      gender: 'male',
      actualWeightKg: 58,
      severity: 'shock',
      clinicalResponse: 'refractory_bleeding',
      currentHctPercent: 26,
      baselineHctPercent: 44,
      massiveBleeding: true
    },
    clinicalHighlight: 'Sốc kéo dài kèm Hct tụt sâu 26%: Báo động đỏ Xuất huyết nội tạng ẩn -> Truyền Hồng Cầu Lắng & CPT song song.'
  },
  {
    id: 'refractory-cvp',
    category: 'refractory',
    icon: 'fa-solid fa-gauge-high',
    label: 'Nữ 26T Sốc Trơ Dịch (48kg)',
    tag: 'CVP > 15 · Vận Mạch',
    isDanger: true,
    input: {
      ageYears: 26,
      gender: 'female',
      actualWeightKg: 48,
      severity: 'shock',
      clinicalResponse: 'refractory_shock_cvp',
      currentHctPercent: 39,
      baselineHctPercent: 38,
      cvpValue: 17
    },
    clinicalHighlight: 'Bù CPT ≥ 60ml/kg nhưng vẫn sốc: Đặt catheter đo CVP tĩnh mạch nền, test dịch & Dobutamin / Bù Albumin.'
  },
  {
    id: 'acute-liver',
    category: 'refractory',
    icon: 'fa-solid fa-triangle-exclamation',
    label: 'Nam 42T Suy Gan Cấp (64kg)',
    tag: 'AST 1650 · Phác Đồ NAC',
    isDanger: true,
    input: {
      ageYears: 42,
      gender: 'male',
      actualWeightKg: 64,
      severity: 'warning_signs',
      clinicalResponse: 'liver_failure',
      liverEnzymesAST_ALT: 1650,
      currentHctPercent: 40
    },
    clinicalHighlight: 'AST 1650 U/L tổn thương gan cấp: Phác đồ NAC 4 pha, TUYỆT ĐỐI CẤM Ringer Lactate & Paracetamol.'
  }
];

export class DengueCDSSController {
  private container: HTMLElement;
  private currentPlan: DengueCDSSPlan | null = null;
  private customDurations: Record<number, number> = {};
  private activeCaseId: string = 'child-obese';
  private activeWorkspaceMode: WorkspaceMode = 'fluid_schedule';
  private activeRefractorySubTab: string = 'tab-cpt';
  private includeVasopressorInPrint: boolean = false;
  private selectedColloidType: ColloidType = 'dextran_40';
  private currentHemodynamic: HemodynamicProfile = {
    cvpLevel: 'low_normal',
    cardiacContractility: 'normal',
    vascularTone: 'normal',
    isOverloaded: false
  };
  private interactiveDrugName: string = 'Dopamin';
  private interactiveDose: number = 5;
  private interactivePumpRate: number = 5;
  private deEscalationChecked: Record<number, boolean> = {};

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) {
      throw new Error(`Container #${containerId} not found`);
    }
    this.container = el;
    this.init();
  }

  private init(): void {
    this.renderInitialLayout();
    this.attachEventListeners();
    this.recalculate();
  }

  private renderInitialLayout(): void {
    const now = new Date();
    const curTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    this.container.innerHTML = `
      <!-- DEDICATED MEDICAL PRINT SHEET (Chỉ hiển thị khi in phiếu y lệnh) -->
      <div id="cdss-print-sheet" class="cdss-print-sheet"></div>

      <div class="dengue-cdss-app">
        <!-- TOP CLINICAL WORKSTATION TOOLBAR -->
        <header class="cdss-top-bar">
          <div class="cdss-bar-branding">
            <div class="cdss-icon-badge">
              <i class="fa-solid fa-droplet"></i>
            </div>
            <div class="cdss-brand-titles">
              <h1 class="cdss-brand-title">
                CDSS Điều Trị SXHD Dengue &amp; Chống Sốc Phức Tạp
              </h1>
              <div class="cdss-brand-subtitle">
                <span>Bộ Y Tế 2023</span>
                <span aria-hidden="true">·</span>
                <span>QĐ 2760/QĐ-BYT</span>
                <span aria-hidden="true">·</span>
                <span>Phụ lục 6, 8, 16, 17, 18 &amp; 26</span>
              </div>
            </div>
          </div>

          <div class="cdss-toolbar-actions">
            <button id="btn-copy-soap" class="cdss-action-btn cdss-action-btn--primary cdss-action-btn--icon-only" title="Sao chép Kế hoạch SOAP vào Bệnh án / DocSpace" aria-label="Sao chép SOAP">
              <i class="fa-solid fa-notes-medical"></i>
            </button>
            <button id="btn-copy-handover" class="cdss-action-btn cdss-action-btn--icon-only" title="Sao chép báo cáo giao ban cọc dịch" aria-label="Bàn Giao Ca">
              <i class="fa-solid fa-clipboard-check"></i>
            </button>
            <label class="cdss-print-vaso-checkbox" title="Tùy chọn in kèm phác đồ thuốc vận mạch bơm tiêm điện (khi có sốc trơ)">
              <input type="checkbox" id="chk-include-vaso" />
              <span>In kèm Vận mạch</span>
            </label>
            <button id="btn-print" class="cdss-action-btn cdss-action-btn--icon-only" title="In phiếu y lệnh cọc dịch chuẩn A4">
              <i class="fa-solid fa-print"></i>
            </button>
            <button id="btn-reset-durations" class="cdss-action-btn cdss-action-btn--icon-only" title="Khôi phục thời lượng chuẩn Bộ Y Tế">
              <i class="fa-solid fa-clock-rotate-left"></i>
            </button>
          </div>
        </header>

        <!-- CA LÂM SÀNG PHÂN TẦNG (CLINICAL CASES BAR) -->
        <div class="cdss-cases-bar">
          <!-- Nhóm 1: Bù dịch ban đầu -->
          <div class="cdss-cases-group">
            <div class="cdss-cases-group-title">
              <i class="fa-solid fa-hand-holding-droplet text-primary"></i> Bù Dịch Ban Đầu:
            </div>
            <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
              ${CLINICAL_SAMPLE_CASES.filter(c => c.category === 'initial').map(c => `
                <button type="button" 
                  class="cdss-case-pill ${c.isDanger ? 'cdss-case-pill--danger' : ''} ${c.id === this.activeCaseId ? 'active' : ''}" 
                  data-case-id="${c.id}"
                  title="${c.clinicalHighlight}">
                  <i class="${c.icon} cdss-case-pill-icon"></i>
                  <span>${c.label}</span>
                  <span class="cdss-case-pill-tag">${c.tag}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Nhóm 2: Sốc trơ & Không đáp ứng -->
          <div class="cdss-cases-group" style="padding-top:0.4rem; border-top:1px dashed var(--cdss-border-subtle);">
            <div class="cdss-cases-group-title" style="color:var(--cdss-danger);">
              <i class="fa-solid fa-shield-virus text-danger"></i> Sốc Trơ &amp; Biến Chứng:
            </div>
            <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
              ${CLINICAL_SAMPLE_CASES.filter(c => c.category === 'refractory').map(c => `
                <button type="button" 
                  class="cdss-case-pill cdss-case-pill--danger ${c.id === this.activeCaseId ? 'active' : ''}" 
                  data-case-id="${c.id}"
                  title="${c.clinicalHighlight}">
                  <i class="${c.icon} cdss-case-pill-icon"></i>
                  <span>${c.label}</span>
                  <span class="cdss-case-pill-tag">${c.tag}</span>
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- MAIN GRID LAYOUT -->
        <div class="cdss-main-grid">
          <!-- LEFT COLUMN: TRẠM ĐÁNH GIÁ NGƯỜI BỆNH UNIFIED PATIENT STATION -->
          <aside class="cdss-left-col">
            <div class="cdss-card" style="padding:0; overflow:hidden;">
              <div class="cdss-card-header" style="padding:0.85rem 1rem;">
                <h2 class="cdss-card-title">
                  <i class="fa-solid fa-user-injured text-primary"></i> Trạm Đánh Giá Người Bệnh
                </h2>
                <span id="case-status-indicator" class="cdss-brand-badge" style="display:none;"></span>
              </div>

              <!-- KHỐI 1: DỮ KIỆN BAN ĐẦU & THỂ TRẠNG -->
              <div class="cdss-station-section">
                <div class="cdss-station-title">
                  <span>01. Thể Trạng &amp; Phân Tầng Ban Đầu</span>
                  <span style="font-size:0.7rem; font-weight:600; text-transform:none; color:var(--cdss-text-muted);">CDC 2014</span>
                </div>

                <form id="dengue-input-form" style="display:flex; flex-direction:column; gap:0.75rem;">
                  <!-- Tuổi & Giới tính -->
                  <div class="cdss-form-row">
                    <div class="cdss-form-group">
                      <label class="cdss-form-label" for="input-age">Tuổi (Năm)</label>
                      <div class="cdss-input-group">
                        <input type="number" id="input-age" min="1" max="100" value="8" step="1" required class="cdss-input" />
                        <span class="cdss-input-suffix">tuổi</span>
                      </div>
                    </div>

                    <div class="cdss-form-group">
                      <label class="cdss-form-label">Giới Tính</label>
                      <div class="cdss-segmented" id="gender-segmented">
                        <button type="button" class="cdss-segmented-btn active" data-gender="male">
                          <i class="fa-solid fa-mars"></i> Nam
                        </button>
                        <button type="button" class="cdss-segmented-btn" data-gender="female">
                          <i class="fa-solid fa-venus"></i> Nữ
                        </button>
                      </div>
                      <input type="hidden" id="input-gender" value="male" />
                    </div>
                  </div>

                  <!-- Cân nặng thực tế & Chiều cao -->
                  <div class="cdss-form-row">
                    <div class="cdss-form-group">
                      <label class="cdss-form-label" for="input-weight">
                        <span>Cân Nặng Thực Tế</span>
                      </label>
                      <div class="cdss-input-group">
                        <input type="number" id="input-weight" min="5" max="180" value="38" step="0.5" required class="cdss-input" />
                        <span class="cdss-input-suffix">kg</span>
                      </div>
                    </div>

                    <div class="cdss-form-group">
                      <label class="cdss-form-label" for="input-height">
                        <span>Chiều Cao</span>
                        <small style="color:var(--cdss-text-muted);">Tùy chọn</small>
                      </label>
                      <div class="cdss-input-group">
                        <input type="number" id="input-height" min="50" max="220" placeholder="165" step="1" class="cdss-input" />
                        <span class="cdss-input-suffix">cm</span>
                      </div>
                    </div>
                  </div>

                  <!-- Phân độ lâm sàng ban đầu -->
                  <div class="cdss-form-group">
                    <label class="cdss-form-label" for="input-severity">Phân Độ Lâm Sàng Ban Đầu</label>
                    <select id="input-severity" class="cdss-select">
                      <option value="warning_signs" selected>1. Có Dấu Hiệu Cảnh Báo (DHCB)</option>
                      <option value="shock">2. Sốc SXHD (Còn Bù)</option>
                      <option value="severe_shock">3. Sốc Nguy Kịch (Mạch 0, HA 0)</option>
                    </select>
                  </div>

                  <!-- Giờ bắt đầu truyền -->
                  <div class="cdss-form-group">
                    <label class="cdss-form-label" for="input-starttime">Mốc Giờ Bắt Đầu Truyền</label>
                    <input type="time" id="input-starttime" value="${curTime}" class="cdss-input" />
                  </div>
                </form>
              </div>

              <!-- KHỐI 2: TÁI ĐÁNH GIÁ & CẬN LÂM SÀNG (ĐỘNG HỌC) -->
              <div class="cdss-station-section" style="background: rgba(239, 68, 68, 0.02);">
                <div class="cdss-station-title" style="color:var(--cdss-danger);">
                  <span>02. Tái Đánh Giá &amp; Cận Lâm Sàng</span>
                  <span style="font-size:0.7rem; font-weight:700; text-transform:none; color:var(--cdss-danger);">QĐ 2760</span>
                </div>

                <div style="display:flex; flex-direction:column; gap:0.75rem;">
                  <!-- Dropdown Đáp Ứng Lâm Sàng Lớn -->
                  <div class="cdss-form-group">
                    <label class="cdss-form-label" for="input-response">
                      <span>Tình Trạng Đáp Ứng Sau Bù Dịch Ban Đầu</span>
                    </label>
                    <select id="input-response" class="cdss-select" style="font-weight:700; border-color:rgba(239,68,68,0.3);">
                      <option value="good">🟢 Đáp ứng tốt, ra sốc (Bù dịch nấc thang chuẩn)</option>
                      <option value="refractory_hct_high">🟠 Không đáp ứng + Hct còn cao ≥ 40% (Đổi CPT nấc thang)</option>
                      <option value="refractory_bleeding">🔴 Không đáp ứng + Hct tụt hoặc Xuất huyết ẩn (Truyền Máu HCL)</option>
                      <option value="refractory_shock_cvp">🟣 Sốc thất bại bù dịch / Tái sốc ≥ 2 lần (Đo CVP & Vận Mạch)</option>
                      <option value="fluid_overload">⚠️ Biến chứng Dư dịch / Quá tải tuần hoàn / Phù phổi cấp</option>
                      <option value="liver_failure">🟤 Biến chứng Suy gan cấp / AST-ALT ≥ 1000 U/L (Phác đồ NAC)</option>
                    </select>
                  </div>

                  <!-- Hct Hiện Tại & Hct Nền -->
                  <div class="cdss-form-row">
                    <div class="cdss-form-group">
                      <label class="cdss-form-label" for="input-current-hct">Hct Hiện Tại (%)</label>
                      <div class="cdss-input-group">
                        <input type="number" id="input-current-hct" min="15" max="65" value="42" step="0.5" class="cdss-input" />
                        <span class="cdss-input-suffix">%</span>
                      </div>
                    </div>
                    <div class="cdss-form-group">
                      <label class="cdss-form-label" for="input-baseline-hct">Hct Nền (%)</label>
                      <div class="cdss-input-group">
                        <input type="number" id="input-baseline-hct" min="20" max="55" value="36" step="0.5" class="cdss-input" />
                        <span class="cdss-input-suffix">%</span>
                      </div>
                    </div>
                  </div>

                  <!-- CVP & Men Gan AST/ALT -->
                  <div class="cdss-form-row">
                    <div class="cdss-form-group">
                      <label class="cdss-form-label" for="input-cvp">CVP Đo Được</label>
                      <div class="cdss-input-group">
                        <input type="number" id="input-cvp" min="0" max="30" placeholder="Chưa đo" step="1" class="cdss-input" />
                        <span class="cdss-input-suffix">cmH2O</span>
                      </div>
                    </div>
                    <div class="cdss-form-group">
                      <label class="cdss-form-label" for="input-ast-alt">Men Gan AST/ALT</label>
                      <div class="cdss-input-group">
                        <input type="number" id="input-ast-alt" min="10" max="10000" placeholder="U/L" step="10" class="cdss-input" />
                        <span class="cdss-input-suffix">U/L</span>
                      </div>
                    </div>
                  </div>

                  <!-- Tiểu Cầu & Xuất Huyết Ẩn -->
                  <div class="cdss-form-row">
                    <div class="cdss-form-group">
                      <label class="cdss-form-label" for="input-platelets">Số Lượng Tiểu Cầu</label>
                      <div class="cdss-input-group">
                        <input type="number" id="input-platelets" min="1000" max="500000" placeholder="/mm³" step="1000" class="cdss-input" />
                        <span class="cdss-input-suffix">/mm³</span>
                      </div>
                    </div>
                    <div class="cdss-form-group" style="display:flex; align-items:flex-end;">
                      <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.76rem; font-weight:700; color:var(--cdss-danger); cursor:pointer; padding-bottom:0.6rem;">
                        <input type="checkbox" id="input-bleeding" style="width:16px; height:16px; accent-color:var(--cdss-danger);" />
                        <span>Có Xuất Huyết Ẩn / Tiêu Hóa</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- KHỐI 3: PHÂN TÍCH CÂN NẶNG CDC 2014 & CÂN TÍNH DỊCH (INLINE METRIC) -->
              <div id="weight-analysis-box" class="cdss-station-section">
                <!-- Dynamically populated via renderWeightAnalysis -->
              </div>
            </div>
          </aside>

          <!-- RIGHT COLUMN: CDSS DIRECTIVE & WORKSPACE MODES -->
          <main class="cdss-right-col">
            <!-- Dynamic Alert Banners -->
            <div id="cdss-alerts-wrap" class="cdss-alerts-container"></div>

            <!-- CLINICAL DIRECTIVE EXECUTIVE CARD (CHỈ ĐẠO LÂM SÀNG ĐỘNG HỌC) -->
            <div id="cdss-directive-wrap"></div>

            <!-- WORKSPACE MODE SWITCHER TABS -->
            <div class="cdss-mode-switcher-wrap">
              <div class="cdss-mode-tabs" id="cdss-mode-tabs">
                <button type="button" class="cdss-mode-btn active" data-mode="fluid_schedule">
                  <i class="fa-solid fa-table-list"></i>
                  <span>1. Cọc Điện Giải</span>
                </button>
                <button type="button" class="cdss-mode-btn" data-mode="colloid_schedule" id="btn-mode-colloid">
                  <i class="fa-solid fa-flask-vial"></i>
                  <span>2. Cọc Cao Phân Tử (CPT)</span>
                  <span id="colloid-alert-dot" style="display:none; width:8px; height:8px; border-radius:50%; background:#ef4444;"></span>
                </button>
                <button type="button" class="cdss-mode-btn" data-mode="refractory_suite" id="btn-mode-refractory">
                  <i class="fa-solid fa-shield-virus"></i>
                  <span>3. Sốc Trơ &amp; Không Đáp Ứng</span>
                  <span id="refractory-alert-dot" style="display:none; width:8px; height:8px; border-radius:50%; background:#ef4444;"></span>
                </button>
                <button type="button" class="cdss-mode-btn" data-mode="vasopressors">
                  <i class="fa-solid fa-syringe"></i>
                  <span>4. Vận Mạch 50ml (Phụ Lục 15 &amp; 18)</span>
                </button>
                <button type="button" class="cdss-mode-btn" data-mode="nursing_checklist">
                  <i class="fa-solid fa-user-nurse"></i>
                  <span>5. Điều Dưỡng An Toàn</span>
                </button>
              </div>

              <div class="cdss-mode-hint" id="cdss-mode-hint">
                <i class="fa-solid fa-circle-info text-primary"></i>
                <span id="cdss-mode-hint-text">Đang hiển thị phác đồ bù dịch nấc thang</span>
              </div>
            </div>

            <!-- WORKSPACE CONTENT CONTAINER (DYNAMIC VIEWS) -->
            <div id="cdss-workspace-content">
              <!-- Dynamically populated via renderWorkspaceContent -->
            </div>
          </main>
        </div>

        <!-- STICKY MOBILE BOTTOM BAR -->
        <div class="cdss-mobile-sticky-bar">
          <div class="cdss-mobile-bar-inner">
            <div class="cdss-mbar-summary">
              <div class="cdss-mbar-main">
                <span id="mbar-weight">26 kg</span>
                <span class="cdss-brand-badge" id="mbar-severity-badge">DHCB</span>
              </div>
              <div class="cdss-mbar-sub" id="mbar-volume-sub">Tổng: 2.340 ml / 24h</div>
            </div>
            <div class="cdss-mbar-actions">
              <button type="button" id="btn-open-drawer" class="cdss-action-btn cdss-action-btn--primary cdss-action-btn--icon-only" title="Chỉnh thông số ca bệnh" aria-label="Chỉnh Ca">
                <i class="fa-solid fa-sliders"></i>
              </button>
              <button type="button" id="btn-mbar-soap" class="cdss-action-btn cdss-action-btn--icon-only" title="Chép Bệnh Án" aria-label="Chép Bệnh Án">
                <i class="fa-solid fa-notes-medical"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- MOBILE DRAWER OVERLAY & PANEL -->
        <div class="cdss-drawer-overlay" id="cdss-drawer-overlay"></div>
        <div class="cdss-mobile-drawer" id="cdss-mobile-drawer">
          <div class="cdss-drawer-handle"></div>
          <div class="cdss-drawer-header">
            <h3 class="cdss-drawer-title">
              <i class="fa-solid fa-sliders"></i> Chỉnh Thông Số Ca Bệnh
            </h3>
            <button type="button" class="cdss-action-btn cdss-action-btn--icon-only" id="btn-close-drawer">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div id="drawer-form-container">
            <!-- Mirrored controls for phone -->
          </div>
        </div>

        <!-- TOAST NOTIFICATION -->
        <div id="cdss-toast" class="cdss-toast">
          <i class="fa-solid fa-circle-check"></i>
          <span id="cdss-toast-text">Thông báo</span>
        </div>
      </div>
    `;
  }

  private attachEventListeners(): void {
    const form = document.getElementById('dengue-input-form');
    if (form) {
      form.addEventListener('input', () => {
        this.clearActivePreset();
        this.recalculate();
      });
      form.addEventListener('change', () => {
        this.clearActivePreset();
        this.recalculate();
      });
    }

    // Response and Lab Inputs
    const responseSelect = document.getElementById('input-response');
    if (responseSelect) {
      responseSelect.addEventListener('change', () => {
        this.clearActivePreset();
        const val = (responseSelect as HTMLSelectElement).value;
        if (val !== 'good') {
          this.activeWorkspaceMode = 'refractory_suite';
        }
        // Tự động bật vận mạch chỉ khi sốc trơ cần CVP & Vận mạch
        const chkVaso = document.getElementById('chk-include-vaso') as HTMLInputElement | null;
        if (val === 'refractory_shock_cvp') {
          this.includeVasopressorInPrint = true;
          if (chkVaso) chkVaso.checked = true;
        } else {
          this.includeVasopressorInPrint = false;
          if (chkVaso) chkVaso.checked = false;
        }
        this.recalculate();
      });
    }

    const labInputs = ['input-current-hct', 'input-baseline-hct', 'input-cvp', 'input-ast-alt', 'input-platelets', 'input-bleeding'];
    labInputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => {
          this.clearActivePreset();
          this.recalculate();
        });
        el.addEventListener('change', () => {
          this.clearActivePreset();
          this.recalculate();
        });
      }
    });

    // Gender Segmented Buttons
    const genderBtns = document.querySelectorAll('#gender-segmented .cdss-segmented-btn');
    genderBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const gender = target.getAttribute('data-gender') as Gender;
        genderBtns.forEach(b => b.classList.remove('active'));
        target.classList.add('active');
        const inputGender = document.getElementById('input-gender') as HTMLInputElement | null;
        if (inputGender) inputGender.value = gender;
        this.clearActivePreset();
        this.recalculate();
      });
    });

    // Clinical Sample Cases Pills
    const casePills = document.querySelectorAll('.cdss-case-pill');
    casePills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const caseId = target.getAttribute('data-case-id');
        if (caseId) {
          this.applySampleCase(caseId);
        }
      });
    });

    // Workspace Mode Switcher
    const modeBtns = document.querySelectorAll('.cdss-mode-btn');
    modeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const mode = target.getAttribute('data-mode') as WorkspaceMode;
        if (mode) {
          modeBtns.forEach(b => b.classList.remove('active'));
          target.classList.add('active');
          this.activeWorkspaceMode = mode;
          this.renderWorkspaceContent();
        }
      });
    });

    // Reset Durations
    const btnReset1 = document.getElementById('btn-reset-durations');
    const handleReset = () => {
      this.customDurations = {};
      this.recalculate();
      this.showToast('Đã khôi phục thời lượng cữ chuẩn theo Bộ Y Tế!');
    };
    if (btnReset1) btnReset1.addEventListener('click', handleReset);

    // Copy SOAP
    const btnSoap = document.getElementById('btn-copy-soap');
    const btnMbarSoap = document.getElementById('btn-mbar-soap');
    if (btnSoap) btnSoap.addEventListener('click', () => this.copySoapPlan());
    if (btnMbarSoap) btnMbarSoap.addEventListener('click', () => this.copySoapPlan());

    // Copy Handover
    const btnHandover = document.getElementById('btn-copy-handover');
    if (btnHandover) btnHandover.addEventListener('click', () => this.copyHandoverReport());

    // Print & Vasopressor toggle
    const chkVaso = document.getElementById('chk-include-vaso') as HTMLInputElement | null;
    if (chkVaso) {
      chkVaso.addEventListener('change', () => {
        this.includeVasopressorInPrint = chkVaso.checked;
        if (this.currentPlan) this.renderPrintSheet(this.currentPlan);
      });
    }

    const btnPrint = document.getElementById('btn-print');
    if (btnPrint) btnPrint.addEventListener('click', () => window.print());

    // Mobile Drawer
    const btnOpenDrawer = document.getElementById('btn-open-drawer');
    const btnCloseDrawer = document.getElementById('btn-close-drawer');
    const drawerOverlay = document.getElementById('cdss-drawer-overlay');
    const drawer = document.getElementById('cdss-mobile-drawer');

    const openDrawer = () => {
      if (drawer && drawerOverlay) {
        drawer.classList.add('active');
        drawerOverlay.classList.add('active');
      }
    };
    const closeDrawer = () => {
      if (drawer && drawerOverlay) {
        drawer.classList.remove('active');
        drawerOverlay.classList.remove('active');
      }
    };

    if (btnOpenDrawer) btnOpenDrawer.addEventListener('click', openDrawer);
    if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
  }

  private clearActivePreset(): void {
    this.activeCaseId = '';
    const pills = document.querySelectorAll('.cdss-case-pill');
    pills.forEach(p => p.classList.remove('active'));
    const ind = document.getElementById('case-status-indicator');
    if (ind) ind.style.display = 'none';
  }

  public applySampleCase(caseId: string): void {
    const sample = CLINICAL_SAMPLE_CASES.find(c => c.id === caseId);
    if (!sample) return;

    this.activeCaseId = caseId;
    this.customDurations = {};

    // Update Pills
    const pills = document.querySelectorAll('.cdss-case-pill');
    pills.forEach(p => {
      if (p.getAttribute('data-case-id') === caseId) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    // Update Form Inputs
    this.setInputValue('input-age', sample.input.ageYears.toString());
    this.setInputValue('input-weight', sample.input.actualWeightKg.toString());
    if (sample.input.heightCm !== undefined) {
      this.setInputValue('input-height', sample.input.heightCm.toString());
    } else {
      this.setInputValue('input-height', '');
    }
    this.setInputValue('input-severity', sample.input.severity);
    this.setGender(sample.input.gender);

    if (sample.input.clinicalResponse) {
      this.setInputValue('input-response', sample.input.clinicalResponse);
    }
    if (sample.input.currentHctPercent !== undefined) {
      this.setInputValue('input-current-hct', sample.input.currentHctPercent.toString());
    }
    if (sample.input.baselineHctPercent !== undefined) {
      this.setInputValue('input-baseline-hct', sample.input.baselineHctPercent.toString());
    }
    if (sample.input.liverEnzymesAST_ALT !== undefined) {
      this.setInputValue('input-ast-alt', sample.input.liverEnzymesAST_ALT.toString());
    } else {
      this.setInputValue('input-ast-alt', '');
    }
    if (sample.input.cvpValue !== undefined) {
      this.setInputValue('input-cvp', sample.input.cvpValue.toString());
    } else {
      this.setInputValue('input-cvp', '');
    }

    const bleedCheckbox = document.getElementById('input-bleeding') as HTMLInputElement | null;
    if (bleedCheckbox) {
      bleedCheckbox.checked = !!sample.input.massiveBleeding;
    }

    // Auto-switch workspace mode & sub-tab according to clinical category
    if (sample.category === 'refractory') {
      this.activeWorkspaceMode = 'refractory_suite';
      if (sample.input.clinicalResponse === 'refractory_hct_high') {
        this.activeRefractorySubTab = 'tab-cpt';
      } else if (sample.input.clinicalResponse === 'refractory_bleeding' || sample.input.massiveBleeding) {
        this.activeRefractorySubTab = 'tab-blood';
      } else if (sample.input.clinicalResponse === 'refractory_shock_cvp') {
        this.activeRefractorySubTab = 'tab-cvp';
      } else if (sample.input.clinicalResponse === 'liver_failure') {
        this.activeRefractorySubTab = 'tab-liver';
      }
    } else {
      this.activeWorkspaceMode = 'fluid_schedule';
    }

    // Đồng bộ trạng thái in kèm vận mạch cho ca mẫu
    const chkVaso = document.getElementById('chk-include-vaso') as HTMLInputElement | null;
    if (sample.input.clinicalResponse === 'refractory_shock_cvp') {
      this.includeVasopressorInPrint = true;
      if (chkVaso) chkVaso.checked = true;
    } else {
      this.includeVasopressorInPrint = false;
      if (chkVaso) chkVaso.checked = false;
    }

    // Update Status Indicator
    const ind = document.getElementById('case-status-indicator');
    if (ind) {
      ind.textContent = sample.label;
      ind.style.display = 'inline-block';
    }

    this.recalculate();
    this.showToast(`Đã áp dụng ca lâm sàng: ${sample.label}`);
  }

  private setInputValue(id: string, val: string): void {
    const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
    if (el) el.value = val;
  }

  private setGender(val: Gender): void {
    const hidden = document.getElementById('input-gender') as HTMLInputElement | null;
    if (hidden) hidden.value = val;

    const btns = document.querySelectorAll('#gender-segmented .cdss-segmented-btn');
    btns.forEach(btn => {
      if (btn.getAttribute('data-gender') === val) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  private getFormData(): DenguePatientInput {
    const age = parseFloat((document.getElementById('input-age') as HTMLInputElement)?.value) || 8;
    const gender = ((document.getElementById('input-gender') as HTMLInputElement)?.value as Gender) || 'male';
    const weight = parseFloat((document.getElementById('input-weight') as HTMLInputElement)?.value) || 30;
    const height = parseFloat((document.getElementById('input-height') as HTMLInputElement)?.value) || undefined;
    const severity = ((document.getElementById('input-severity') as HTMLSelectElement)?.value as DengueSeverity) || 'warning_signs';
    const startTime = (document.getElementById('input-starttime') as HTMLInputElement)?.value || '08:00';
    const response = ((document.getElementById('input-response') as HTMLSelectElement)?.value) || 'good';
    const currentHct = parseFloat((document.getElementById('input-current-hct') as HTMLInputElement)?.value) || undefined;
    const baselineHct = parseFloat((document.getElementById('input-baseline-hct') as HTMLInputElement)?.value) || undefined;
    const massiveBleeding = (document.getElementById('input-bleeding') as HTMLInputElement)?.checked || false;
    const liverEnzymesAST_ALT = parseFloat((document.getElementById('input-ast-alt') as HTMLInputElement)?.value) || undefined;
    const plateletsCount = parseFloat((document.getElementById('input-platelets') as HTMLInputElement)?.value) || undefined;

    return {
      ageYears: age,
      gender,
      actualWeightKg: weight,
      heightCm: height,
      severity,
      startTime,
      clinicalResponse: response,
      currentHctPercent: currentHct,
      baselineHctPercent: baselineHct,
      massiveBleeding,
      liverEnzymesAST_ALT,
      plateletsCount
    };
  }

  public recalculate(): void {
    const input = this.getFormData();
    this.currentPlan = generateDengueCDSSPlan(input, this.customDurations);
    this.renderPlan(this.currentPlan);
  }

  private renderPlan(plan: DengueCDSSPlan): void {
    this.renderWeightAnalysis(plan);
    this.renderAlerts(plan);
    this.renderDirective(plan);
    this.updateWorkspaceModeSwitcher(plan);
    this.renderWorkspaceContent();
    this.updateMobileStickyBar(plan);
    this.renderPrintSheet(plan);
  }

  private activeModalTab: 'male_table' | 'female_table' | 'cdc_table' | 'formula_guide' = 'male_table';

  private renderWeightAnalysis(plan: DengueCDSSPlan): void {
    const box = document.getElementById('weight-analysis-box');
    if (!box) return;

    const { weightResult, patient } = plan;
    const isAdult = patient.ageYears >= 16;
    const isObese = weightResult.isObese;

    if (isAdult) {
      // Giao diện cho Người lớn (Phụ lục 9 QĐ 2760/BYT)
      const hasHeight = patient.heightCm && patient.heightCm >= 100;
      const bmiStr = weightResult.bmi !== undefined ? `${weightResult.bmi} kg/m²` : 'Chưa có';
      const bmiStatusText = !hasHeight
        ? 'Cần nhập Chiều cao'
        : isObese
          ? `BMI ${weightResult.bmi} (≥ 25: Thừa Cân / Béo Phì)`
          : `BMI ${weightResult.bmi} (< 25: Thể Trạng Chuẩn)`;
      const bmiBadgeClass = !hasHeight
        ? 'cdss-weight-status-badge--warning'
        : isObese
          ? 'cdss-weight-status-badge--obese'
          : 'cdss-weight-status-badge--normal';

      box.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem; flex-wrap:wrap; gap:4px;">
          <span style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:var(--cdss-text-muted); display:flex; align-items:center; gap:4px;">
            <i class="fa-solid fa-scale-balanced text-primary"></i> Cân Nặng Tính Dịch (Phụ Lục 9 BYT)
          </span>
          <span class="cdss-weight-status-badge ${bmiBadgeClass}" style="font-size:0.7rem; font-weight:700;">
            ${bmiStatusText}
          </span>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr 1fr 1.25fr; gap:0.35rem; background:var(--cdss-surface-alt); border:1px solid var(--cdss-border-subtle); border-radius:8px; padding:0.5rem; text-align:center;">
          <div>
            <div style="font-size:0.65rem; color:var(--cdss-text-muted); text-transform:uppercase;">Thực tế</div>
            <strong style="font-size:0.9rem; font-family:var(--cdss-font-mono);">${weightResult.actualWeightKg} kg</strong>
          </div>
          <div style="border-left:1px solid var(--cdss-border-subtle);">
            <div style="font-size:0.65rem; color:var(--cdss-text-muted); text-transform:uppercase;">BMI</div>
            <strong style="font-size:0.9rem; font-family:var(--cdss-font-mono); color:${isObese ? 'var(--cdss-danger)' : 'var(--cdss-text)'};">${hasHeight ? weightResult.bmi : '---'}</strong>
          </div>
          <div style="border-left:1px solid var(--cdss-border-subtle);">
            <div style="font-size:0.65rem; color:var(--cdss-text-muted); text-transform:uppercase;">Lý tưởng (IBW)</div>
            <strong style="font-size:0.9rem; font-family:var(--cdss-font-mono); color:var(--cdss-text-muted);">${weightResult.idealWeightKg ? weightResult.idealWeightKg + ' kg' : '---'}</strong>
          </div>
          <div style="border-left:1px solid var(--cdss-border-subtle); background:var(--cdss-surface); border-radius:6px; padding:2px 0;">
            <div style="font-size:0.65rem; color:var(--cdss-primary); font-weight:700; text-transform:uppercase;">Tính dịch</div>
            <strong style="font-size:1.05rem; font-family:var(--cdss-font-mono); color:var(--cdss-primary);">${weightResult.adjustedWeightKg} kg</strong>
            ${isObese && weightResult.tableRoundedWeightKg ? `<div style="font-size:0.62rem; color:var(--cdss-text-muted);">(Bảng tra: ${weightResult.tableRoundedWeightKg}kg)</div>` : ''}
          </div>
        </div>

        <div style="font-size:0.72rem; color:var(--cdss-text-muted); line-height:1.4; margin-top:0.45rem;">
          <i class="fa-solid fa-circle-info text-primary"></i> ${weightResult.formulaNote}
        </div>

        <button type="button" id="btn-open-weight-modal" class="cdss-btn-lookup-weight" style="margin-top:0.5rem; width:100%; display:flex; align-items:center; justify-content:center; gap:0.4rem; padding:0.45rem 0.6rem; font-size:0.75rem; font-weight:700; background:rgba(13,148,136,0.08); color:var(--cdss-primary); border:1px solid rgba(13,148,136,0.25); border-radius:6px; cursor:pointer;">
          <i class="fa-solid fa-table-cells"></i> <span>Tra Cứu 02 Bảng SXH Nam/Nữ &amp; CDC 2014</span>
        </button>
      `;
    } else {
      // Giao diện cho Trẻ em (CDC 2014)
      const ratioPct = Math.round((weightResult.ratioToStandard || (weightResult.actualWeightKg / weightResult.standardWeightKg)) * 100);
      const badgeClass = isObese ? 'cdss-weight-status-badge--obese' : 'cdss-weight-status-badge--normal';
      const badgeText = isObese ? `Dư Cân / Béo Phì (${ratioPct}% Chuẩn)` : `Thể Trạng Chuẩn (${ratioPct}%)`;

      box.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem; flex-wrap:wrap; gap:4px;">
          <span style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:var(--cdss-text-muted); display:flex; align-items:center; gap:4px;">
            <i class="fa-solid fa-child text-primary"></i> Cân Nặng Tính Dịch (CDC 2014)
          </span>
          <span class="cdss-weight-status-badge ${badgeClass}" style="font-size:0.7rem; font-weight:700;">
            ${badgeText}
          </span>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr 1.3fr; gap:0.4rem; background:var(--cdss-surface-alt); border:1px solid var(--cdss-border-subtle); border-radius:8px; padding:0.5rem; text-align:center;">
          <div>
            <div style="font-size:0.68rem; color:var(--cdss-text-muted);">Thực tế</div>
            <strong style="font-size:0.95rem; font-family:var(--cdss-font-mono);">${weightResult.actualWeightKg} kg</strong>
          </div>
          <div style="border-left:1px solid var(--cdss-border-subtle); border-right:1px solid var(--cdss-border-subtle);">
            <div style="font-size:0.68rem; color:var(--cdss-text-muted);">CDC 2014</div>
            <strong style="font-size:0.95rem; font-family:var(--cdss-font-mono); color:var(--cdss-text-muted);">${weightResult.standardWeightKg} kg</strong>
          </div>
          <div style="background:var(--cdss-surface); border-radius:6px; padding:2px 0;">
            <div style="font-size:0.68rem; color:var(--cdss-primary); font-weight:700;">Tính dịch</div>
            <strong style="font-size:1.05rem; font-family:var(--cdss-font-mono); color:var(--cdss-primary);">${weightResult.adjustedWeightKg} kg</strong>
          </div>
        </div>

        <div style="font-size:0.72rem; color:var(--cdss-text-muted); line-height:1.4; margin-top:0.45rem;">
          <i class="fa-solid fa-circle-info text-primary"></i> ${weightResult.formulaNote}
        </div>

        <button type="button" id="btn-open-weight-modal" class="cdss-btn-lookup-weight" style="margin-top:0.5rem; width:100%; display:flex; align-items:center; justify-content:center; gap:0.4rem; padding:0.45rem 0.6rem; font-size:0.75rem; font-weight:700; background:rgba(13,148,136,0.08); color:var(--cdss-primary); border:1px solid rgba(13,148,136,0.25); border-radius:6px; cursor:pointer;">
          <i class="fa-solid fa-table-cells"></i> <span>Tra Cứu Bảng CDC 2014 &amp; Phụ Lục 9</span>
        </button>
      `;
    }

    // Gắn sự kiện mở modal
    const btnModal = document.getElementById('btn-open-weight-modal');
    if (btnModal) {
      btnModal.onclick = () => this.openWeightLookupModal();
    }
  }

  public openWeightLookupModal(): void {
    let modal = document.getElementById('cdss-weight-modal-overlay');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'cdss-weight-modal-overlay';
      modal.className = 'cdss-weight-modal-overlay';
      document.body.appendChild(modal);
    }

    // Tự động chọn tab phù hợp với bệnh nhân hiện tại
    if (this.currentPlan) {
      if (this.currentPlan.patient.ageYears < 16) {
        this.activeModalTab = 'cdc_table';
      } else {
        this.activeModalTab = this.currentPlan.patient.gender === 'female' ? 'female_table' : 'male_table';
      }
    }

    this.renderWeightLookupModalContent();
    modal.classList.add('active');
  }

  public closeWeightLookupModal(): void {
    const modal = document.getElementById('cdss-weight-modal-overlay');
    if (modal) {
      modal.classList.remove('active');
    }
  }

  private renderWeightLookupModalContent(): void {
    const modal = document.getElementById('cdss-weight-modal-overlay');
    if (!modal) return;

    modal.innerHTML = `
      <div class="cdss-weight-modal-dialog" onclick="event.stopPropagation()">
        <!-- Header -->
        <div class="cdss-weight-modal-header">
          <div>
            <h3 class="cdss-weight-modal-title">
              <i class="fa-solid fa-table-cells text-primary"></i>
              <span>Tra Cứu Bảng Cân Nặng Chống Sốc SXHD &amp; CDC 2014</span>
            </h3>
            <div style="font-size:0.75rem; color:var(--cdss-text-muted); margin-top:2px;">
              Phụ lục 9 — Hướng dẫn chẩn đoán, điều trị SXHD (Ban hành kèm Quyết định 2760/QĐ-BYT ngày 04/07/2023)
            </div>
          </div>
          <button type="button" class="cdss-weight-modal-close" id="btn-close-weight-modal" title="Đóng">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Tabs -->
        <div class="cdss-weight-modal-tabs">
          <button type="button" class="cdss-weight-modal-tab-btn ${this.activeModalTab === 'male_table' ? 'active' : ''}" data-tab="male_table">
            <i class="fa-solid fa-mars"></i> <span>1. Bảng Chống Sốc SXH - NAM</span>
          </button>
          <button type="button" class="cdss-weight-modal-tab-btn ${this.activeModalTab === 'female_table' ? 'active' : ''}" data-tab="female_table">
            <i class="fa-solid fa-venus"></i> <span>2. Bảng Chống Sốc SXH - NỮ</span>
          </button>
          <button type="button" class="cdss-weight-modal-tab-btn ${this.activeModalTab === 'cdc_table' ? 'active' : ''}" data-tab="cdc_table">
            <i class="fa-solid fa-child"></i> <span>3. Bảng CDC 2014 (Trẻ Em)</span>
          </button>
          <button type="button" class="cdss-weight-modal-tab-btn ${this.activeModalTab === 'formula_guide' ? 'active' : ''}" data-tab="formula_guide">
            <i class="fa-solid fa-square-root-variable"></i> <span>4. Công Thức &amp; Nguyên Tắc Phụ Lục 9</span>
          </button>
        </div>

        <!-- Body Content -->
        <div class="cdss-weight-modal-body">
          ${this.getWeightModalTabHtml()}
        </div>
      </div>
    `;

    // Bind close events
    modal.onclick = (e) => {
      if (e.target === modal) this.closeWeightLookupModal();
    };
    const btnClose = document.getElementById('btn-close-weight-modal');
    if (btnClose) btnClose.onclick = () => this.closeWeightLookupModal();

    // Bind tab clicks
    const tabBtns = modal.querySelectorAll('.cdss-weight-modal-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab') as any;
        if (tab) {
          this.activeModalTab = tab;
          this.renderWeightLookupModalContent();
        }
      });
    });

    // Bind cell clicks to apply height and weight to form
    const cells = modal.querySelectorAll('.cdss-matrix-cell[data-h][data-w]');
    cells.forEach(c => {
      c.addEventListener('click', () => {
        const h = c.getAttribute('data-h');
        const w = c.getAttribute('data-w');
        const eff = c.getAttribute('data-eff');
        if (h && w) {
          this.setInputValue('input-height', h);
          this.setInputValue('input-weight', w);
          this.recalculate();
          this.showToast(`Đã áp dụng: Chiều cao ${h} cm, Cân nặng thực ${w} kg ➜ Cân chống sốc: ${eff} kg`);
          this.closeWeightLookupModal();
        }
      });
    });

    // Bind CDC row click
    const cdcRows = modal.querySelectorAll('.cdss-cdc-row[data-age][data-weight]');
    cdcRows.forEach(r => {
      r.addEventListener('click', () => {
        const age = r.getAttribute('data-age');
        const weight = r.getAttribute('data-weight');
        if (age && weight) {
          this.setInputValue('input-age', age);
          this.setInputValue('input-weight', weight);
          this.recalculate();
          this.showToast(`Đã áp dụng trẻ ${age} tuổi ➜ Cân nặng CDC 2014: ${weight} kg`);
          this.closeWeightLookupModal();
        }
      });
    });
  }

  private getWeightModalTabHtml(): string {
    switch (this.activeModalTab) {
      case 'male_table':
        return this.renderMatrixTableHtml('male');
      case 'female_table':
        return this.renderMatrixTableHtml('female');
      case 'cdc_table':
        return this.renderCDCTableHtml();
      case 'formula_guide':
        return this.renderFormulaGuideHtml();
      default:
        return '';
    }
  }

  private renderMatrixTableHtml(gender: Gender): string {
    const isMale = gender === 'male';
    const patient = this.currentPlan?.patient;
    const curHeight = patient?.heightCm ? Math.round(patient.heightCm) : undefined;
    const curWeight = patient?.actualWeightKg ? Math.round(patient.actualWeightKg) : undefined;
    const curGender = patient?.gender;

    // Tìm mốc gần nhất trong bảng cho bệnh nhân hiện tại
    let matchedH: number | undefined = undefined;
    let matchedW: number | undefined = undefined;
    if (curHeight && curWeight && curGender === gender && patient.ageYears >= 16) {
      matchedH = ADULT_SHOCK_HEIGHTS.reduce((prev, curr) => Math.abs(curr - curHeight) < Math.abs(prev - curHeight) ? curr : prev);
      matchedW = ADULT_SHOCK_WEIGHTS.reduce((prev, curr) => Math.abs(curr - curWeight) < Math.abs(prev - curWeight) ? curr : prev);
    }

    const rowsHtml = ADULT_SHOCK_HEIGHTS.map(h => {
      const isRowHighlight = matchedH === h;
      const cellsHtml = ADULT_SHOCK_WEIGHTS.map(w => {
        const cell = getAdultShockCell(h, w, gender);
        const isCurrent = matchedH === h && matchedW === w;
        const cellClass = isCurrent
          ? 'cdss-matrix-cell cdss-matrix-cell--current'
          : cell.isAdjusted
            ? 'cdss-matrix-cell cdss-matrix-cell--adjusted'
            : 'cdss-matrix-cell cdss-matrix-cell--real';

        const tooltip = `Cao ${h}cm, Nặng ${w}kg ➜ BMI ${cell.bmi} kg/m² ${cell.isAdjusted ? '(≥25: Béo phì)' : '(<25: Chuẩn)'} ➜ Cân chống sốc: ${cell.tableWeight}kg (Click để áp dụng)`;

        return `
          <td class="${cellClass}" data-h="${h}" data-w="${w}" data-eff="${cell.tableWeight}" title="${tooltip}">
            ${cell.isAdjusted ? cell.tableWeight : '<span style="opacity:0.4; font-size:0.6rem;">BN</span>'}
          </td>
        `;
      }).join('');

      return `
        <tr class="${isRowHighlight ? 'cdss-matrix-row--highlight' : ''}">
          <th class="cdss-matrix-th-left">${h}</th>
          ${cellsHtml}
          <th class="cdss-matrix-th-right">${h}</th>
        </tr>
      `;
    }).join('');

    return `
      <div>
        <div class="cdss-matrix-guide-bar">
          <div>
            <strong style="color:${isMale ? '#0284c7' : '#ec4899'}; font-size:0.85rem;">
              <i class="fa-solid ${isMale ? 'fa-mars' : 'fa-venus'}"></i>
              BẢNG CÂN NẶNG CHỐNG SỐC SXH — ${isMale ? 'NAM' : 'NỮ'} (PHỤ LỤC 9)
            </strong>
            <div style="color:var(--cdss-text-muted); margin-top:2px;">
              Chiều cao: 145 – 187 cm &bull; Cân nặng thực tế: 45 – 101 kg. Click vào ô bất kỳ để điền nhanh vào form tính dịch.
            </div>
          </div>
          <div class="cdss-matrix-legend">
            <div class="cdss-matrix-legend-item">
              <span class="cdss-matrix-legend-box" style="background:#e0f2fe;"></span>
              <span><strong>BMI &lt; 25:</strong> Sử dụng cân nặng thực BN</span>
            </div>
            <div class="cdss-matrix-legend-item">
              <span class="cdss-matrix-legend-box" style="background:#ffffff; border:1px solid #cbd5e1;"></span>
              <span><strong>BMI &ge; 25:</strong> Cân nặng hiệu chỉnh (AdjBW)</span>
            </div>
            ${matchedH && matchedW ? `
              <div class="cdss-matrix-legend-item" style="color:var(--cdss-danger); font-weight:700;">
                <span class="cdss-matrix-legend-box" style="background:#ef4444; border-color:#facc15;"></span>
                <span>BN hiện tại: Cao ${matchedH}cm, Nặng ${matchedW}kg</span>
              </div>
            ` : ''}
          </div>
        </div>

        <div class="cdss-matrix-wrapper">
          <table class="cdss-matrix-table">
            <thead>
              <tr>
                <th class="cdss-matrix-corner">Cao (cm)</th>
                ${ADULT_SHOCK_WEIGHTS.map(w => `<th class="cdss-matrix-th-top">${w}</th>`).join('')}
                <th class="cdss-matrix-corner">Cao (cm)</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  private renderCDCTableHtml(): string {
    const patient = this.currentPlan?.patient;
    const curAge = patient?.ageYears;
    const curGender = patient?.gender || 'male';

    const ages = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    const rowsHtml = ages.map(age => {
      const entry = CDC_STANDARD_WEIGHT[age];
      const isCurrentAge = curAge !== undefined && Math.round(curAge) === age;
      const targetWeight = curGender === 'male' ? entry.male : entry.female;

      return `
        <tr class="cdss-cdc-row ${isCurrentAge ? 'current-age-row' : ''}" data-age="${age}" data-weight="${targetWeight}" style="cursor:pointer;" title="Click để áp dụng cho trẻ ${age} tuổi">
          <td style="font-weight:700;">${age} tuổi ${isCurrentAge ? '<span style="font-size:0.7rem; color:var(--cdss-primary); font-weight:800;">(BN Hiện Tại)</span>' : ''}</td>
          <td style="color:${curGender === 'male' && isCurrentAge ? 'var(--cdss-primary)' : 'inherit'}; font-weight:${curGender === 'male' && isCurrentAge ? '900' : '600'};">${entry.male} kg</td>
          <td style="color:${curGender === 'female' && isCurrentAge ? 'var(--cdss-primary)' : 'inherit'}; font-weight:${curGender === 'female' && isCurrentAge ? '900' : '600'};">${entry.female} kg</td>
        </tr>
      `;
    }).join('');

    return `
      <div style="max-width:760px; margin:0 auto;">
        <div style="background:var(--cdss-surface); border:1px solid var(--cdss-border); border-radius:8px; padding:0.85rem 1.1rem; margin-bottom:1rem;">
          <h4 style="margin:0 0 0.4rem 0; font-size:0.92rem; font-weight:800; color:var(--cdss-text); display:flex; align-items:center; gap:0.4rem;">
            <i class="fa-solid fa-child text-primary"></i>
            <span>1. CÂN NẶNG HIỆU CHỈNH Ở TRẺ EM DƯ CÂN HOẶC BÉO PHÌ</span>
          </h4>
          <div style="font-size:0.78rem; color:var(--cdss-text-muted); font-style:italic; margin-bottom:0.5rem;">
            (Dựa theo hướng dẫn của CDC 2014 — Trích Phụ lục 9 Quyết định số 2760/QĐ-BYT)
          </div>
          <div style="font-size:0.75rem; color:var(--cdss-danger); background:rgba(239,68,68,0.06); border-left:3px solid var(--cdss-danger); padding:0.5rem 0.75rem; border-radius:4px; line-height:1.45;">
            <strong>Khuyến cáo BYT:</strong> Áp dụng tính cân nặng bù dịch cho trẻ em dư cân, béo phì này chỉ ước tính cho những giờ đầu và <u>nên đo áp lực tĩnh mạch trung tâm (CVP)</u> để theo dõi trong khi bù dịch.
          </div>
        </div>

        <div class="cdss-cdc-table-wrap">
          <table class="cdss-cdc-table">
            <thead>
              <tr>
                <th>Tuổi (năm)</th>
                <th><i class="fa-solid fa-mars" style="color:#0284c7;"></i> Nam (kg)</th>
                <th><i class="fa-solid fa-venus" style="color:#ec4899;"></i> Nữ (kg)</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  private renderFormulaGuideHtml(): string {
    return `
      <div class="cdss-formula-card">
        <h4 style="margin:0 0 0.75rem 0; font-size:1rem; font-weight:800; color:var(--cdss-text); border-bottom:1px solid var(--cdss-border-subtle); padding-bottom:0.5rem;">
          <i class="fa-solid fa-book-medical text-primary"></i>
          HƯỚNG DẪN TÍNH CÂN NẶNG BÙ DỊCH CHỐNG SỐC SXHD (PHỤ LỤC 9 - BYT 2023)
        </h4>

        <!-- Phần Người Lớn -->
        <div style="margin-bottom:1.25rem;">
          <h5 style="font-size:0.88rem; font-weight:800; color:var(--cdss-primary); margin:0 0 0.5rem 0;">
            - Cân nặng (CN) chống sốc ở người lớn: xem Phụ lục 9
          </h5>
          <div style="font-size:0.8rem; line-height:1.6; color:var(--cdss-text); padding-left:0.5rem;">
            <div><strong>a) BMI &lt; 25 kg/m²:</strong> sử dụng <u>Cân nặng thực tế</u>.</div>
            <div><strong>b) BMI &ge; 25 kg/m²:</strong> sử dụng <u>Cân nặng hiệu chỉnh</u>.</div>
            
            <div style="background:var(--cdss-surface-alt); border:1px solid var(--cdss-border); border-radius:8px; padding:0.75rem 1rem; margin:0.6rem 0;">
              <div style="font-weight:700; color:var(--cdss-text); margin-bottom:0.35rem;">+ CN lý tưởng (IBW - kg):</div>
              <div style="font-family:var(--cdss-font-mono); font-size:0.82rem; color:var(--cdss-text); padding-left:0.75rem;">
                &bull; <strong>Nữ:</strong> 45,5 + 0,91 &times; (chiều cao (cm) - 152,4)<br/>
                &bull; <strong>Nam:</strong> 50,0 + 0,91 &times; (chiều cao (cm) - 152,4)
              </div>
              <div style="font-weight:700; color:var(--cdss-primary); margin-top:0.6rem; margin-bottom:0.35rem;">+ CN hiệu chỉnh (AdjBW - kg):</div>
              <div style="font-family:var(--cdss-font-mono); font-size:0.85rem; font-weight:800; color:var(--cdss-primary); padding-left:0.75rem;">
                CN hiệu chỉnh = CN lý tưởng + 0,4 &times; (CN thực - CN lý tưởng)
              </div>
            </div>
          </div>
        </div>

        <!-- Phần Trẻ Em -->
        <div>
          <h5 style="font-size:0.88rem; font-weight:800; color:#0284c7; margin:0 0 0.5rem 0;">
            - Cân nặng hiệu chỉnh ở trẻ em dư cân hoặc béo phì: dựa theo CDC 2014
          </h5>
          <div style="font-size:0.8rem; line-height:1.6; color:var(--cdss-text); padding-left:0.5rem;">
            <div>&bull; Khi cân nặng thực của trẻ vượt quá ngưỡng thừa cân (&gt; 120% so với cân nặng chuẩn theo tuổi CDC 2014): <strong>Bắt buộc dùng Cân nặng hiệu chỉnh CDC 2014</strong> tương ứng với độ tuổi để tính lượng dịch bù.</div>
            <div>&bull; <em>Khuyến cáo áp dụng tính cân nặng bù dịch cho trẻ em dư cân, béo phì này chỉ ước tính cho những giờ đầu và nên đo áp lực tĩnh mạch trung tâm (CVP) để theo dõi trong khi bù dịch.</em></div>
          </div>
        </div>
      </div>
    `;
  }

  private renderAlerts(plan: DengueCDSSPlan): void {
    const wrap = document.getElementById('cdss-alerts-wrap');
    if (!wrap) return;

    if (plan.alerts.length === 0) {
      wrap.innerHTML = '';
      return;
    }

    wrap.innerHTML = plan.alerts.map(a => `
      <div class="cdss-alert-box cdss-alert-box--${a.level}">
        <i class="fa-solid ${a.level === 'danger' ? 'fa-triangle-exclamation' : a.level === 'warning' ? 'fa-circle-exclamation' : 'fa-circle-info'}"></i>
        <div class="cdss-alert-body">
          <strong>${a.title}</strong>
          <div>${a.message}</div>
        </div>
      </div>
    `).join('');
  }

  private renderDirective(plan: DengueCDSSPlan): void {
    const wrap = document.getElementById('cdss-directive-wrap');
    if (!wrap) return;

    const { branchDecision, patient } = plan;
    const isDanger = branchDecision.branchType === 'blood' || branchDecision.branchType === 'refractory_shock';
    const isWarning = branchDecision.branchType === 'cpt';
    const isStandard = branchDecision.branchType === 'standard';

    wrap.innerHTML = `
      <div class="cdss-directive-card ${isDanger ? 'directive--danger' : isWarning ? 'directive--warning' : ''}">
        <div class="cdss-directive-header">
          <h2 class="cdss-directive-title">
            <i class="fa-solid ${isDanger ? 'fa-triangle-exclamation text-danger' : isWarning ? 'fa-arrow-trend-up text-warning' : 'fa-circle-check text-primary'}"></i>
            <span>${branchDecision.title}</span>
          </h2>
          <span class="cdss-directive-tag" style="background:${isDanger ? 'rgba(239,68,68,0.1)' : isWarning ? 'rgba(245,158,11,0.1)' : 'rgba(2,132,199,0.1)'}; color:${isDanger ? 'var(--cdss-danger)' : isWarning ? 'var(--cdss-warning)' : 'var(--cdss-primary)'};">
            ${branchDecision.branchType === 'blood' ? 'MẤT MÁU CẤP' : branchDecision.branchType === 'cpt' ? 'THOÁT HUYẾT TƯƠNG TRƠ' : branchDecision.branchType === 'refractory_shock' ? 'SỐC KHÁNG TRỊ' : 'ĐÁP ỨNG CHUẨN'}
          </span>
        </div>

        <div class="cdss-directive-action-banner ${isDanger ? 'action--danger' : isWarning ? 'action--warning' : 'action--primary'}">
          <i class="fa-solid fa-arrow-right-arrow-left" style="font-size:1.1rem;"></i>
          <div>
            <div style="font-size:0.72rem; text-transform:uppercase; letter-spacing:0.04em; font-weight:800; opacity:0.85;">Khuyến Cáo Xử Trí Ưu Tiên:</div>
            <strong style="font-size:0.95rem;">${branchDecision.recommendedFluid}</strong>
          </div>
        </div>

        <div class="cdss-directive-reasoning">
          <strong>Lý luận lâm sàng:</strong> ${branchDecision.reasoning}
        </div>

        <!-- Thanh Thử Nghiệm Kịch Bản Lâm Sàng 1 Chạm -->
        <div class="cdss-scenario-bar">
          <span style="font-size:0.72rem; font-weight:800; text-transform:uppercase; color:var(--cdss-text-muted); margin-right:4px;">
            Thử nghiệm kịch bản:
          </span>
          <button type="button" class="cdss-scenario-btn ${patient.clinicalResponse === 'good' ? 'active' : ''}" onclick="window.__dengueSetScenario('good');">
            🟢 Ổn định
          </button>
          <button type="button" class="cdss-scenario-btn ${patient.clinicalResponse === 'refractory_hct_high' ? 'active' : ''}" onclick="window.__dengueSetScenario('refractory_hct_high');">
            🟠 Hct cao ≥40% (Đổi CPT)
          </button>
          <button type="button" class="cdss-scenario-btn ${patient.clinicalResponse === 'refractory_bleeding' ? 'active' : ''}" onclick="window.__dengueSetScenario('refractory_bleeding');">
            🔴 Xuất huyết (Truyền Máu)
          </button>
          <button type="button" class="cdss-scenario-btn ${patient.clinicalResponse === 'refractory_shock_cvp' ? 'active' : ''}" onclick="window.__dengueSetScenario('refractory_shock_cvp');">
            🟣 Đo CVP &amp; Vận Mạch
          </button>
          <button type="button" class="cdss-scenario-btn ${patient.clinicalResponse === 'liver_failure' ? 'active' : ''}" onclick="window.__dengueSetScenario('liver_failure');">
            🟤 Suy Gan (NAC)
          </button>
          <button type="button" class="cdss-scenario-btn ${patient.clinicalResponse === 'fluid_overload' ? 'active' : ''}" onclick="window.__dengueSetScenario('fluid_overload');">
            ⚠️ Dư Dịch / Phù Phổi
          </button>
        </div>
      </div>
    `;

    // Global scenario setter helper
    (window as any).__dengueSetScenario = (scenario: string) => {
      const respEl = document.getElementById('input-response') as HTMLSelectElement | null;
      if (respEl) {
        respEl.value = scenario;
      }
      if (scenario === 'refractory_bleeding') {
        const bl = document.getElementById('input-bleeding') as HTMLInputElement | null;
        if (bl) bl.checked = true;
      } else if (scenario === 'liver_failure') {
        const ast = document.getElementById('input-ast-alt') as HTMLInputElement | null;
        if (ast && !ast.value) ast.value = '1500';
      }
      if (scenario !== 'good') {
        this.activeWorkspaceMode = 'refractory_suite';
        if (scenario === 'refractory_hct_high') this.activeRefractorySubTab = 'tab-cpt';
        else if (scenario === 'refractory_bleeding') this.activeRefractorySubTab = 'tab-blood';
        else if (scenario === 'refractory_shock_cvp') this.activeRefractorySubTab = 'tab-cvp';
        else if (scenario === 'liver_failure') this.activeRefractorySubTab = 'tab-liver';
        else if (scenario === 'fluid_overload') this.activeRefractorySubTab = 'tab-overload';
      }
      this.recalculate();
    };
  }

  private updateWorkspaceModeSwitcher(plan: DengueCDSSPlan): void {
    const modeBtns = document.querySelectorAll('.cdss-mode-btn');
    modeBtns.forEach(btn => {
      const m = btn.getAttribute('data-mode');
      if (m === this.activeWorkspaceMode) {
        btn.classList.add('active');
        if (m === 'refractory_suite' && plan.patient.clinicalResponse !== 'good') {
          btn.classList.add('mode-danger');
        } else {
          btn.classList.remove('mode-danger');
        }
      } else {
        btn.classList.remove('active', 'mode-danger');
      }
    });

    const dot = document.getElementById('refractory-alert-dot');
    if (dot) {
      dot.style.display = plan.patient.clinicalResponse !== 'good' ? 'inline-block' : 'none';
    }

    const colloidDot = document.getElementById('colloid-alert-dot');
    if (colloidDot) {
      colloidDot.style.display = plan.colloidPlan.isOverLimit ? 'inline-block' : 'none';
    }

    const hintText = document.getElementById('cdss-mode-hint-text');
    if (hintText) {
      if (this.activeWorkspaceMode === 'fluid_schedule') {
        hintText.textContent = 'Bảng điều phối cọc dịch điện giải nấc thang chuẩn hóa (BYT 2023)';
      } else if (this.activeWorkspaceMode === 'colloid_schedule') {
        hintText.textContent = 'Phác đồ cọc dịch Cao Phân Tử & giám sát trần an toàn 60 ml/kg (Phụ lục 10)';
      } else if (this.activeWorkspaceMode === 'refractory_suite') {
        hintText.textContent = 'Phác đồ 6 phân nhánh khi bệnh nhân không đáp ứng bù dịch';
      } else if (this.activeWorkspaceMode === 'vasopressors') {
        hintText.textContent = 'Lưu đồ chọn vận mạch theo CVP & Bộ tính bơm tiêm điện 50ml 2 chiều';
      } else {
        hintText.textContent = 'Quy trình kiểm soát an toàn điều dưỡng tại giường';
      }
    }
  }

  private renderWorkspaceContent(): void {
    const container = document.getElementById('cdss-workspace-content');
    if (!container || !this.currentPlan) return;

    const plan = this.currentPlan;

    switch (this.activeWorkspaceMode) {
      case 'fluid_schedule':
        this.renderFluidScheduleView(container, plan);
        break;
      case 'colloid_schedule':
        this.renderColloidScheduleView(container, plan);
        break;
      case 'refractory_suite':
        this.renderRefractorySuiteView(container, plan);
        break;
      case 'vasopressors':
        this.renderVasopressorsView(container, plan);
        break;
      case 'nursing_checklist':
        this.renderNursingChecklistView(container, plan);
        break;
    }
  }

  // VIEW 1: BẢNG CỌC DỊCH BAN ĐẦU (INITIAL FLUID VIEW)
  private renderFluidScheduleView(container: HTMLElement, plan: DengueCDSSPlan): void {
    const mlPerKg = Math.round(plan.totalVolumeMl / plan.weightResult.adjustedWeightKg);
    const bottles500 = Math.ceil(plan.totalVolumeMl / 500);

    const ageGroup = plan.ageGroup;
    const tpls = DENGUE_FLUID_TEMPLATES[plan.patient.severity][ageGroup];

    container.innerHTML = `
      <!-- Summary Bento Stats -->
      <div class="cdss-kpi-grid" style="margin-bottom: 1.25rem;">
        <div class="cdss-kpi-card">
          <div class="cdss-kpi-icon cdss-kpi-icon--blue">
            <i class="fa-solid fa-fill-drip"></i>
          </div>
          <div class="cdss-kpi-content">
            <span class="cdss-kpi-label">Tổng Dịch Ban Đầu</span>
            <span class="cdss-kpi-value">${plan.totalVolumeMl.toLocaleString('vi-VN')} <small>ml</small></span>
            <span class="cdss-kpi-sub">~ ${mlPerKg} ml/kg cân tính dịch</span>
          </div>
        </div>

        <div class="cdss-kpi-card">
          <div class="cdss-kpi-icon cdss-kpi-icon--purple">
            <i class="fa-solid fa-hourglass-half"></i>
          </div>
          <div class="cdss-kpi-content">
            <span class="cdss-kpi-label">Thời Lượng Dự Kiến</span>
            <span class="cdss-kpi-value">${plan.totalDurationHours} <small>giờ</small></span>
            <span class="cdss-kpi-sub">${plan.fluidRows.length} bậc tốc độ giảm dần</span>
          </div>
        </div>

        <div class="cdss-kpi-card">
          <div class="cdss-kpi-icon cdss-kpi-icon--teal">
            <i class="fa-solid fa-bottle-water"></i>
          </div>
          <div class="cdss-kpi-content">
            <span class="cdss-kpi-label">Ước Tính Số Chai 500ml</span>
            <span class="cdss-kpi-value">${bottles500} <small>chai</small></span>
            <span class="cdss-kpi-sub">Ringer Lactate / NaCl 0.9%</span>
          </div>
        </div>
      </div>

      <!-- VISUAL FLUID TIMELINE -->
      <div class="cdss-timeline-card">
        <div class="cdss-timeline-header">
          <span class="cdss-timeline-title">
            <i class="fa-solid fa-chart-gantt"></i> Tiến Trình Bậc Dịch Truyền Ban Đầu Theo Giờ
          </span>
          <span class="cdss-brand-badge" style="background:var(--cdss-primary-light); color:var(--cdss-primary); border-color:var(--cdss-primary);">
            ${plan.totalDurationHours} Giờ Truyền
          </span>
        </div>
        <div class="cdss-timeline-track" id="cdss-timeline-track">
          ${plan.fluidRows.map((r, idx) => {
            const colors = ['cdss-seg-1', 'cdss-seg-2', 'cdss-seg-3', 'cdss-seg-4', 'cdss-seg-5'];
            const colClass = colors[idx % colors.length];
            return `
              <div class="cdss-timeline-segment ${colClass}" style="flex: ${r.durationHours};" title="Cữ ${r.stepIndex}: ${r.rateMlKgH} ml/kg/h (${r.durationHours}h) - Cần ${r.totalMl} ml">
                <span>${r.rateMlKgH} ml/kg/h</span>
                <small>Cữ ${r.stepIndex} (${r.durationHours}h)</small>
              </div>
            `;
          }).join('')}
        </div>
        <div class="cdss-timeline-ticks">
          <span><i class="fa-regular fa-clock"></i> Khởi đầu: <strong>${plan.fluidRows[0]?.timeWindow.split(' - ')[0] || '08:00'}</strong></span>
          <span>${plan.fluidRows.length} giai đoạn bù dịch liên tục</span>
          <span>Kết thúc: <strong>${plan.fluidRows[plan.fluidRows.length - 1]?.timeWindow.split(' - ')[1]?.split(' ')[0] || '24h'}</strong></span>
        </div>
      </div>

      <!-- BẢNG ĐIỀU PHỐI CỌC DỊCH 4 CỘT -->
      <section class="cdss-table-card">
        <div class="cdss-table-header-wrap">
          <div class="cdss-table-title-area">
            <h2 class="cdss-table-title">
              <i class="fa-solid fa-table-list"></i> Bảng Điều Phối Cọc Dịch 4 Cột Chuẩn Hóa
            </h2>
            <p class="cdss-table-desc">
              Tự động gộp thể tích, tính giọt/phút (dây 20g/ml), chuyển dịch dư và tính số chai 500ml treo thêm tại cọc.
            </p>
          </div>
          <button id="btn-reset-durations-sub" class="cdss-action-btn cdss-action-btn--icon-only" title="Khôi phục thời lượng chuẩn Bộ Y Tế" aria-label="Đặt Lại Giờ Chuẩn">
            <i class="fa-solid fa-clock-rotate-left"></i>
          </button>
        </div>

        <!-- Desktop / Tablet Table -->
        <div class="cdss-table-scroll">
          <table class="cdss-table">
            <thead>
              <tr>
                <th style="width: 22%;">Cột 1: Mốc Giờ &amp; Thời Lượng</th>
                <th style="width: 28%;">Cột 2: Tốc Độ &amp; Lượng Dịch Cần</th>
                <th style="width: 26%;">Cột 3: Dịch Có SẴN / Treo Thêm</th>
                <th style="width: 24%;">Cột 4: Tổng Cọc &amp; Giám Sát</th>
              </tr>
            </thead>
            <tbody>
              ${plan.fluidRows.map((r, idx) => {
                const tpl = tpls[idx];
                const durationOptions = tpl?.durationOptions || [r.durationHours];
                const optionsHtml = durationOptions.map(dur => `
                  <option value="${dur}" ${dur === r.durationHours ? 'selected' : ''}>${dur} giờ</option>
                `).join('');

                return `
                  <tr>
                    <td>
                      <div class="cdss-step-badge">Cữ ${r.stepIndex}</div>
                      <div class="cdss-time-window">${r.timeWindow}</div>
                      <div class="cdss-duration-picker">
                        <label><i class="fa-regular fa-clock"></i> Thời lượng:</label>
                        <select class="cdss-duration-select" data-row-idx="${idx}">
                          ${optionsHtml}
                        </select>
                      </div>
                      <div class="cdss-stage-title">${r.stageName}</div>
                    </td>
                    <td>
                      <div class="cdss-rate-display">
                        <span class="cdss-rate-number">${r.rateMlKgH}</span>
                        <span class="cdss-rate-unit">ml/kg/giờ</span>
                      </div>
                      <div class="cdss-drops-box">
                        <i class="fa-solid fa-water" style="color:var(--cdss-info);"></i> 
                        <strong>${r.dropsPerMin}</strong> giọt/phút
                        <small style="color:var(--cdss-text-muted);">${ageGroup === 'child' ? '(Dây vi giọt 60 g/ml)' : '(Dây chuẩn 20 g/ml)'}</small>
                      </div>
                      <div class="cdss-volume-calc">
                        Thể tích cần: <strong>${r.totalMl.toLocaleString('vi-VN')} ml</strong>
                        <div style="font-size:0.7rem; color:var(--cdss-text-muted);">
                          (${r.rateMlKgH} × ${plan.weightResult.adjustedWeightKg}kg × ${r.durationHours}h)
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="cdss-carry-over">
                        Dịch sẵn từ cữ trước: <strong>${r.existingFluidMl} ml</strong>
                      </div>
                      <div>
                        <span class="cdss-hang-badge ${r.bottlesToHang > 0 ? 'cdss-hang-badge--active' : ''}">
                          <i class="fa-solid fa-plus"></i> Treo thêm: <strong>${r.bottlesToHang}</strong> chai 500ml
                        </span>
                      </div>
                    </td>
                    <td>
                      <div class="cdss-pole-metric">
                        Tổng có trên cọc: <strong>${r.totalAtPoleMl.toLocaleString('vi-VN')} ml</strong>
                      </div>
                      ${r.hctCheckRequired ? `
                        <div class="cdss-hct-pill">
                          <i class="fa-solid fa-vial"></i> <strong>Đo lại Hct tại giường</strong>
                        </div>
                      ` : ''}
                      <div class="cdss-monitor-tip">
                        ${r.monitoringNotes}
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <!-- Mobile Adaptive Fluid Cards Stack (< 768px) -->
        <div class="cdss-fluid-cards-stack">
          ${plan.fluidRows.map((r, idx) => {
            const tpl = tpls[idx];
            const durationOptions = tpl?.durationOptions || [r.durationHours];
            const optionsHtml = durationOptions.map(dur => `
              <option value="${dur}" ${dur === r.durationHours ? 'selected' : ''}>${dur} giờ</option>
            `).join('');

            return `
              <div class="cdss-mfluid-card ${r.hctCheckRequired ? 'cdss-mfluid-card--hct' : ''}">
                <div class="cdss-mfluid-card-header">
                  <div class="cdss-step-badge">Cữ ${r.stepIndex}</div>
                  <div class="cdss-mfluid-timewindow">${r.timeWindow}</div>
                  <div class="cdss-duration-picker" style="margin-left:auto;">
                    <select class="cdss-duration-select" data-row-idx="${idx}" aria-label="Thời lượng cữ ${r.stepIndex}">
                      ${optionsHtml}
                    </select>
                  </div>
                </div>

                <div class="cdss-mfluid-stage-title">${r.stageName}</div>

                <div class="cdss-mfluid-stats-grid">
                  <div class="cdss-mfluid-stat">
                    <span class="cdss-mfluid-stat-label">Tốc Độ</span>
                    <strong class="cdss-mfluid-stat-val text-primary">${r.rateMlKgH} <small>ml/kg/h</small></strong>
                    <span class="cdss-mfluid-stat-sub"><i class="fa-solid fa-water text-info"></i> ${r.dropsPerMin} giọt/ph (${ageGroup === 'child' ? 'Dây 60g' : 'Dây 20g'})</span>
                  </div>
                  <div class="cdss-mfluid-stat">
                    <span class="cdss-mfluid-stat-label">Lượng Dịch Cần</span>
                    <strong class="cdss-mfluid-stat-val">${r.totalMl.toLocaleString('vi-VN')} <small>ml</small></strong>
                    <span class="cdss-mfluid-stat-sub">${r.durationHours}h × ${plan.weightResult.adjustedWeightKg}kg</span>
                  </div>
                  <div class="cdss-mfluid-stat">
                    <span class="cdss-mfluid-stat-label">Treo Thêm</span>
                    <strong class="cdss-mfluid-stat-val ${r.bottlesToHang > 0 ? 'text-danger' : ''}">
                      ${r.bottlesToHang > 0 ? `+${r.bottlesToHang} chai 500ml` : '0 (Dùng sẵn)'}
                    </strong>
                    <span class="cdss-mfluid-stat-sub">Có sẵn: ${r.existingFluidMl} ml</span>
                  </div>
                  <div class="cdss-mfluid-stat">
                    <span class="cdss-mfluid-stat-label">Tại Cọc</span>
                    <strong class="cdss-mfluid-stat-val text-teal-600">${r.totalAtPoleMl.toLocaleString('vi-VN')} <small>ml</small></strong>
                    <span class="cdss-mfluid-stat-sub">Dư sau cữ: ${Math.max(0, r.totalAtPoleMl - r.totalMl)} ml</span>
                  </div>
                </div>

                ${r.hctCheckRequired ? `
                  <div class="cdss-hct-pill" style="margin-top:0.4rem; width:100%; justify-content:center;">
                    <i class="fa-solid fa-vial"></i> <strong>BẮT BUỘC ĐO LẠI HCT SAU CỮ NÀY (${r.durationHours}h)</strong>
                  </div>
                ` : ''}

                <div class="cdss-monitor-tip" style="margin-top:0.4rem;">
                  ${r.monitoringNotes}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>
    `;

    // Attach row select events
    const selects = container.querySelectorAll('.cdss-duration-select');
    selects.forEach(sel => {
      sel.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement;
        const rowIdx = parseInt(target.getAttribute('data-row-idx') || '0', 10);
        const newDur = parseFloat(target.value);
        this.customDurations[rowIdx] = newDur;
        this.recalculate();
      });
    });

    const btnSub = container.querySelector('#btn-reset-durations-sub');
    if (btnSub) {
      btnSub.addEventListener('click', () => {
        this.customDurations = {};
        this.recalculate();
        this.showToast('Đã khôi phục thời lượng cữ chuẩn theo Bộ Y Tế!');
      });
    }
  }

  // VIEW 2: BẢNG CỌC DỊCH CAO PHÂN TỬ (COLLOID VIEW - PHỤ LỤC 10)
  private renderColloidScheduleView(container: HTMLElement, plan: DengueCDSSPlan): void {
    const colloidPlan = calculateColloidSchedule(
      plan.patient,
      plan.weightResult.adjustedWeightKg,
      this.selectedColloidType
    );
    plan.colloidPlan = colloidPlan;

    const meta = DENGUE_COLLOID_METADATA[this.selectedColloidType];
    const pctOfSafeLimit = Math.min(100, Math.round((colloidPlan.totalColloidMlPerKg / 60) * 100));
    const isOverLimit = colloidPlan.isOverLimit;
    const isNearLimit = !isOverLimit && colloidPlan.totalColloidMlPerKg >= 45;

    // Tính liều Albumin hỗ trợ khi đạt trần hoặc cần kéo dịch
    const albResult = calculateAlbuminDose(plan.weightResult.adjustedWeightKg, 2.0, 3.5);

    container.innerHTML = `
      <!-- Bento Stats & Cảnh Báo Trần 60 ml/kg -->
      <div class="cdss-kpi-grid" style="margin-bottom: 1.25rem;">
        <div class="cdss-kpi-card ${isOverLimit ? 'cdss-kpi-card--danger' : isNearLimit ? 'cdss-kpi-card--warning' : ''}">
          <div class="cdss-kpi-icon ${isOverLimit ? 'cdss-kpi-icon--red' : isNearLimit ? 'cdss-kpi-icon--amber' : 'cdss-kpi-icon--teal'}">
            <i class="fa-solid fa-flask-vial"></i>
          </div>
          <div class="cdss-kpi-content">
            <span class="cdss-kpi-label">Tổng Liều CPT Tích Lũy</span>
            <span class="cdss-kpi-value ${isOverLimit ? 'text-danger' : ''}">${colloidPlan.totalColloidMlPerKg} <small>ml/kg</small></span>
            <span class="cdss-kpi-sub">
              ${isOverLimit ? '⚠️ VƯỢT TRẦN 60 ml/kg' : isNearLimit ? '⚠️ CẬN TRẦN 60 ml/kg' : '✓ Trong ngưỡng an toàn'}
            </span>
          </div>
        </div>

        <div class="cdss-kpi-card">
          <div class="cdss-kpi-icon cdss-kpi-icon--blue">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          <div class="cdss-kpi-content">
            <span class="cdss-kpi-label">Trần An Toàn Tối Đa (60 ml/kg)</span>
            <span class="cdss-kpi-value">${colloidPlan.safeLimitVolumeMl.toLocaleString('vi-VN')} <small>ml</small></span>
            <span class="cdss-kpi-sub">${plan.weightResult.adjustedWeightKg} kg × 60 ml/kg</span>
          </div>
        </div>

        <div class="cdss-kpi-card">
          <div class="cdss-kpi-icon cdss-kpi-icon--purple">
            <i class="fa-solid fa-gauge"></i>
          </div>
          <div class="cdss-kpi-content">
            <span class="cdss-kpi-label">Lượng CPT Còn Phép Dùng</span>
            <span class="cdss-kpi-value ${colloidPlan.remainingSafeMl <= 0 ? 'text-danger' : 'text-primary'}">
              ${colloidPlan.remainingSafeMl.toLocaleString('vi-VN')} <small>ml</small>
            </span>
            <span class="cdss-kpi-sub">
              ${colloidPlan.remainingSafeMl <= 0 ? 'Đã hết quota an toàn' : `~ ${Math.round(colloidPlan.remainingSafeMl / plan.weightResult.adjustedWeightKg)} ml/kg còn lại`}
            </span>
          </div>
        </div>
      </div>

      <!-- THANH ĐO TÍCH LŨY CPT SO VỚI TRẦN AN TOÀN 60 ML/KG -->
      <div class="cdss-timeline-card" style="margin-bottom:1.25rem;">
        <div class="cdss-timeline-header">
          <span class="cdss-timeline-title">
            <i class="fa-solid fa-chart-simple text-primary"></i> Mức Độ Sử Dụng Dung Lượng Dịch Cao Phân Tử Tối Đa
          </span>
          <span class="cdss-brand-badge ${isOverLimit ? 'cdss-brand-badge--danger' : ''}">
            ${colloidPlan.totalColloidMlPerKg} / 60 ml/kg (${pctOfSafeLimit}%)
          </span>
        </div>
        <div style="background:var(--cdss-surface-alt); border-radius:8px; height:18px; width:100%; overflow:hidden; position:relative; border:1px solid var(--cdss-border-subtle); margin:0.6rem 0;">
          <div style="height:100%; width:${pctOfSafeLimit}%; background:${isOverLimit ? '#ef4444' : isNearLimit ? '#f59e0b' : 'var(--cdss-primary)'}; transition:width 0.4s ease;"></div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--cdss-text-muted);">
          <span>0 ml/kg (Bắt đầu)</span>
          <span style="color:#f59e0b; font-weight:700;">45 ml/kg (Ngưỡng cảnh báo)</span>
          <span style="color:#ef4444; font-weight:800;">60 ml/kg (Trần an toàn tuyệt đối)</span>
        </div>
        ${isOverLimit ? `
          <div style="margin-top:0.75rem; background:rgba(239, 68, 68, 0.08); border:1.5px solid var(--cdss-danger); border-radius:8px; padding:0.85rem 1rem;">
            <div style="font-size:0.88rem; font-weight:800; color:var(--cdss-danger); margin-bottom:0.25rem;">
              <i class="fa-solid fa-triangle-exclamation"></i> CẢNH BÁO TRẦN CAO PHÂN TỬ: ĐÃ DÙNG ${colloidPlan.totalColloidMlPerKg} ML/KG (≥ 60 ML/KG)
            </div>
            <div style="font-size:0.78rem; line-height:1.45; color:var(--cdss-text);">
              Theo Quyết định 2760/QĐ-BYT, tổng liều dịch cao phân tử không quá 60 ml/kg để tránh tổn thương thận cấp và rối loạn đông máu.
              <strong>Nếu bệnh nhân vẫn còn sốc:</strong> Bắt buộc đo CVP, không tăng thêm CPT, chuyển sang bù <strong>Albumin 5% hoặc 10%</strong> (Trang 20 QĐ 2760) kết hợp phối hợp thuốc vận mạch (Noradrenalin / Dopamin / Dobutamin).
            </div>
          </div>
        ` : ''}
      </div>

      <!-- SELECTOR CHỌN LOẠI DỊCH CAO PHÂN TỬ & THÔNG TIN DƯỢC LÝ HỌC -->
      <section class="cdss-table-card" style="margin-bottom:1.25rem;">
        <div class="cdss-table-header-wrap">
          <div class="cdss-table-title-area">
            <h2 class="cdss-table-title">
              <i class="fa-solid fa-vial-circle-check"></i> Lựa Chọn Loại Dung Dịch Cao Phân Tử (Bộ Y Tế 2023)
            </h2>
            <p class="cdss-table-desc">
              Ưu tiên Dextran 40 trong NaCl 0.9% hoặc Hydroxyethyl Starch (6% HES 200/0.5). Không dùng HES cho bệnh nhân đã có tổn thương thận trước đó.
            </p>
          </div>
        </div>

        <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1rem;" id="colloid-type-selector">
          ${(Object.keys(DENGUE_COLLOID_METADATA) as ColloidType[]).map(key => {
            const cMeta = DENGUE_COLLOID_METADATA[key];
            const isSel = key === this.selectedColloidType;
            return `
              <button type="button" class="cdss-case-pill ${isSel ? 'active' : ''}" data-colloid-type="${key}" style="font-size:0.8rem; padding:0.5rem 0.85rem;">
                <i class="fa-solid fa-droplet text-primary"></i>
                <strong>${cMeta.shortName}</strong>
                <span style="font-size:0.68rem; opacity:0.8;">(${cMeta.brandNames[0]})</span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- THẺ DƯỢC LÝ LÂM SÀNG CỦA DỊCH CPT ĐANG CHỌN -->
        <div style="background:var(--cdss-surface-alt); border:1px solid var(--cdss-border-subtle); border-radius:10px; padding:0.85rem 1rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem; flex-wrap:wrap; gap:6px;">
            <strong style="font-size:0.95rem; color:var(--cdss-primary);">
              <i class="fa-solid fa-info-circle"></i> ${meta.name}
            </strong>
            <span class="cdss-brand-badge">${meta.shortName}</span>
          </div>

          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap:0.6rem; margin-bottom:0.75rem;">
            <div style="background:var(--cdss-surface); border-radius:6px; padding:0.5rem; border:1px solid var(--cdss-border-subtle);">
              <div style="font-size:0.68rem; color:var(--cdss-text-muted); text-transform:uppercase;">Trọng Lượng Phân Tử</div>
              <strong style="font-size:0.85rem;">${meta.molecularWeight}</strong>
            </div>
            <div style="background:var(--cdss-surface); border-radius:6px; padding:0.5rem; border:1px solid var(--cdss-border-subtle);">
              <div style="font-size:0.68rem; color:var(--cdss-text-muted); text-transform:uppercase;">Thời Gian Lưu Lòng Mạch</div>
              <strong style="font-size:0.85rem; color:var(--cdss-primary);">${meta.intravascularPersistence}</strong>
            </div>
            <div style="background:var(--cdss-surface); border-radius:6px; padding:0.5rem; border:1px solid var(--cdss-border-subtle);">
              <div style="font-size:0.68rem; color:var(--cdss-text-muted); text-transform:uppercase;">Tăng Thể Tích Lòng Mạch</div>
              <strong style="font-size:0.85rem; color:var(--cdss-success);">${meta.plasmaExpansion}</strong>
            </div>
            <div style="background:var(--cdss-surface); border-radius:6px; padding:0.5rem; border:1px solid var(--cdss-border-subtle);">
              <div style="font-size:0.68rem; color:var(--cdss-text-muted); text-transform:uppercase;">Giới Hạn Tối Đa Liều</div>
              <strong style="font-size:0.85rem; color:var(--cdss-danger);">${meta.maxSafeDose}</strong>
            </div>
          </div>

          <div style="font-size:0.78rem; line-height:1.45; color:var(--cdss-text-muted);">
            <div><strong style="color:var(--cdss-text);">Ưu điểm & Chỉ định:</strong> ${meta.pros}</div>
            <div style="margin-top:2px;"><strong style="color:var(--cdss-danger);">Cảnh báo an toàn:</strong> ${meta.cons}</div>
          </div>
        </div>
      </section>

      <!-- BẢNG CỌC DỊCH CAO PHÂN TỬ 4 CỘT -->
      <section class="cdss-table-card" style="margin-bottom:1.25rem;">
        <div class="cdss-table-header-wrap">
          <div class="cdss-table-title-area">
            <h2 class="cdss-table-title">
              <i class="fa-solid fa-table-list"></i> Bảng Cọc Dịch Cao Phân Tử Nấc Thang &amp; Chuyển Điện Giải (Phụ Lục 10)
            </h2>
            <p class="cdss-table-desc">
              Tiến trình giảm liều từ 15-20 ml/kg/h ➜ 10 ml/kg/h ➜ 7.5-5 ml/kg/h ➜ 3 ml/kg/h ➜ Chuyển điện giải (Ringer Lactate / NaCl 0.9%).
            </p>
          </div>
        </div>

        <div class="cdss-table-scroll">
          <table class="cdss-table">
            <thead>
              <tr>
                <th style="width: 24%;">Cột 1: Mốc Giờ &amp; Giai Đoạn</th>
                <th style="width: 26%;">Cột 2: Tốc Độ &amp; Lượng Cần</th>
                <th style="width: 26%;">Cột 3: Tích Lũy CPT &amp; Ngưỡng 60ml/kg</th>
                <th style="width: 24%;">Cột 4: Yêu Cầu Đo Hct &amp; Giám Sát</th>
              </tr>
            </thead>
            <tbody>
              ${colloidPlan.rows.map(r => {
                const rowPct = Math.round((r.cumulativeColloidMlPerKg / 60) * 100);
                const isStepOver = r.exceedsThreshold;
                return `
                  <tr class="${isStepOver ? 'cdss-row--danger' : ''}">
                    <td>
                      <div class="cdss-step-badge">Cữ ${r.stepIndex}</div>
                      <div class="cdss-time-window">${r.timeWindow}</div>
                      <div class="cdss-stage-title" style="margin-top:2px; font-weight:700; color:${r.fluidKind === 'colloid' ? 'var(--cdss-primary)' : 'var(--cdss-teal)'};">
                        ${r.stageName}
                      </div>
                      <div style="font-size:0.72rem; color:var(--cdss-text-muted);">
                        <i class="fa-solid fa-flask"></i> ${r.fluidName}
                      </div>
                    </td>
                    <td>
                      <div class="cdss-rate-display">
                        <span class="cdss-rate-number">${r.rateMlKgH}</span>
                        <span class="cdss-rate-unit">ml/kg/giờ</span>
                      </div>
                      <div class="cdss-drops-box">
                        <i class="fa-solid fa-water" style="color:var(--cdss-info);"></i>
                        <strong>${r.dropsPerMin}</strong> giọt/phút
                        <small style="color:var(--cdss-text-muted);">${plan.ageGroup === 'child' ? '(Dây vi giọt)' : '(Dây 20 g/ml)'}</small>
                      </div>
                      <div class="cdss-volume-calc">
                        Cần: <strong>${r.stepVolumeMl.toLocaleString('vi-VN')} ml</strong> (${r.durationHours}h)
                      </div>
                    </td>
                    <td>
                      <div style="font-size:0.82rem; font-weight:800; color:${isStepOver ? 'var(--cdss-danger)' : 'var(--cdss-text)'};">
                        Tích lũy: ${r.cumulativeColloidMlPerKg} ml/kg
                      </div>
                      <div style="font-size:0.72rem; color:var(--cdss-text-muted);">
                        Tổng thể tích: ${r.cumulativeColloidMl.toLocaleString('vi-VN')} ml
                      </div>
                      <div style="margin-top:4px; height:8px; width:100%; background:var(--cdss-surface-alt); border-radius:4px; overflow:hidden; border:1px solid var(--cdss-border-subtle);">
                        <div style="height:100%; width:${Math.min(100, rowPct)}%; background:${isStepOver ? '#ef4444' : rowPct >= 75 ? '#f59e0b' : 'var(--cdss-primary)'};"></div>
                      </div>
                      <div style="font-size:0.68rem; margin-top:2px; color:${isStepOver ? 'var(--cdss-danger)' : 'var(--cdss-text-muted)'};">
                        ${isStepOver ? '⚠️ Đã vượt 60 ml/kg' : `${rowPct}% trần an toàn`}
                      </div>
                    </td>
                    <td>
                      ${r.hctCheckRequired ? `
                        <div class="cdss-hct-pill" style="margin-bottom:4px;">
                          <i class="fa-solid fa-vial"></i> <strong>Đo lại Hct sau cữ này</strong>
                        </div>
                      ` : ''}
                      <div class="cdss-monitor-tip">
                        ${r.monitoringNotes}
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <!-- 7 TIÊU CHUẨN DE-ESCALATION CHUYỂN CPT SANG ĐIỆN GIẢI (PHỤ LỤC 10) -->
      <section class="cdss-card" style="margin-bottom:1.25rem;">
        <div class="cdss-card-header">
          <div>
            <h2 class="cdss-card-title">
              <i class="fa-solid fa-list-check text-success"></i> 7 Tiêu Chuẩn Giảm Liều &amp; Chuyển Từ CPT Sang Điện Giải (Phụ Lục 10 - QĐ 2760)
            </h2>
            <div style="font-size:0.78rem; color:var(--cdss-text-muted); margin-top:2px;">
              Bác sĩ kiểm tra tại giường trước khi quyết định hạ bậc tốc độ hoặc chuyển sang Ringer Lactate / NaCl 0.9%.
            </div>
          </div>
          <button type="button" id="btn-check-all-de-escalation" class="cdss-action-btn cdss-action-btn--icon-only" title="Đánh dấu chọn tất cả tiêu chuẩn hạ bậc" aria-label="Chọn Tất Cả">
            <i class="fa-solid fa-check-double"></i>
          </button>
        </div>

        <div style="padding:1rem;">
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:0.65rem;">
            ${DENGUE_DE_ESCALATION_CHECKLIST.map((crit, idx) => {
              const isChecked = !!this.deEscalationChecked[idx];
              return `
                <label style="display:flex; align-items:flex-start; gap:0.65rem; padding:0.65rem 0.8rem; background:var(--cdss-surface-alt); border:1px solid ${isChecked ? 'var(--cdss-success)' : 'var(--cdss-border-subtle)'}; border-radius:8px; cursor:pointer; transition:all 0.2s ease;">
                  <input type="checkbox" class="cdss-de-esc-cb" data-crit-idx="${idx}" ${isChecked ? 'checked' : ''} style="margin-top:3px; width:16px; height:16px; accent-color:var(--cdss-success);" />
                  <span style="font-size:0.8rem; line-height:1.4; color:var(--cdss-text);">
                    ${crit}
                  </span>
                </label>
              `;
            }).join('')}
          </div>

          <div id="de-escalation-verdict" style="margin-top:0.85rem;">
            <!-- Dynamically populated verdict badge -->
          </div>
        </div>
      </section>

      <!-- WIDGET BÙ ALBUMIN KHI CPT ĐẠT TRẦN HOẶC GIẢM ALBUMIN MÁU (TRANG 20 - QĐ 2760) -->
      <section class="cdss-card" style="margin-bottom:0;">
        <div class="cdss-card-header">
          <div>
            <h2 class="cdss-card-title">
              <i class="fa-solid fa-droplet text-purple-600" style="color:var(--cdss-purple);"></i> Phác Đồ Bù Albumin Tĩnh Mạch (Bộ Y Tế - Trang 20 QĐ 2760)
            </h2>
            <div style="font-size:0.78rem; color:var(--cdss-text-muted); margin-top:2px;">
              Chỉ định khi tổng liều CPT ≥ 60 ml/kg mà còn sốc, hoặc sốc trơ kèm Albumin máu < 2.5 - 3.0 g/dL.
            </div>
          </div>
          <span class="cdss-brand-badge" style="background:var(--cdss-purple-light); color:var(--cdss-purple); border-color:var(--cdss-purple);">Albumin 5% / 10% / 20%</span>
        </div>

        <div style="padding:1rem;">
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:0.75rem; margin-bottom:1rem;">
            <div class="cdss-recipe-box">
              <div class="cdss-recipe-row">
                <span class="cdss-recipe-key">Tổng lượng Albumin cần bù:</span>
                <strong>${albResult.albuminGrams} gam</strong>
              </div>
              <div class="cdss-recipe-row">
                <span class="cdss-recipe-key">Tương đương lọ 20% 50ml:</span>
                <strong style="color:var(--cdss-purple);">${albResult.vials20Percent50ml} lọ (50ml/lọ)</strong>
              </div>
              <div class="cdss-recipe-row">
                <span class="cdss-recipe-key">Tốc độ truyền gợi ý:</span>
                <span>${albResult.infusionRateMlH}</span>
              </div>
            </div>

            <div style="background:var(--cdss-surface-alt); border:1px solid var(--cdss-border-subtle); border-radius:8px; padding:0.75rem;">
              <div style="font-size:0.8rem; font-weight:800; color:var(--cdss-purple); margin-bottom:0.35rem;">
                <i class="fa-solid fa-mortar-pestle"></i> Hướng Dẫn Pha Dung Dịch Albumin (Phụ lục 18):
              </div>
              <div style="font-size:0.76rem; line-height:1.45; color:var(--cdss-text);">
                • <strong>Pha Albumin 5%:</strong> ${albResult.preparation5Percent}<br>
                • <strong>Pha Albumin 10%:</strong> ${albResult.preparation10Percent}<br>
                • <strong>Dùng Albumin 20% nguyên chất:</strong> Truyền qua bơm tiêm điện 2 - 5 ml/kg khi có quá tải tuần hoàn nặng hoặc phù phổi cấp.
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    // Attach colloid type selection events
    const colloidBtns = container.querySelectorAll('#colloid-type-selector button');
    colloidBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const cType = target.getAttribute('data-colloid-type') as ColloidType;
        if (cType) {
          this.selectedColloidType = cType;
          this.renderColloidScheduleView(container, plan);
          this.showToast(`Đã chuyển loại CPT: ${DENGUE_COLLOID_METADATA[cType].shortName}`);
        }
      });
    });

    // Attach de-escalation checkboxes
    const cbList = container.querySelectorAll('.cdss-de-esc-cb');
    const updateVerdict = () => {
      const checkedCount = Object.values(this.deEscalationChecked).filter(Boolean).length;
      const totalCount = DENGUE_DE_ESCALATION_CHECKLIST.length;
      const verdictEl = container.querySelector('#de-escalation-verdict');
      if (verdictEl) {
        if (checkedCount >= 5) {
          verdictEl.innerHTML = `
            <div style="background:rgba(16, 185, 129, 0.1); border:1.5px solid var(--cdss-success); border-radius:8px; padding:0.75rem 1rem; display:flex; align-items:center; gap:0.6rem;">
              <i class="fa-solid fa-circle-check text-success" style="font-size:1.25rem;"></i>
              <div>
                <strong style="color:var(--cdss-success); font-size:0.88rem;">ĐÃ ĐẠT ${checkedCount}/${totalCount} TIÊU CHUẨN DE-ESCALATION (PHỤ LỤC 10)</strong>
                <div style="font-size:0.76rem; color:var(--cdss-text);">Bệnh nhân cải thiện tốt. Đủ điều kiện hạ bậc tốc độ CPT hoặc chuyển sang bù dịch tinh thể điện giải (Ringer Lactate / NaCl 0.9%).</div>
              </div>
            </div>
          `;
        } else {
          verdictEl.innerHTML = `
            <div style="background:var(--cdss-surface-alt); border:1px solid var(--cdss-border-subtle); border-radius:8px; padding:0.6rem 0.85rem; font-size:0.76rem; color:var(--cdss-text-muted);">
              Đã đạt <strong>${checkedCount}/${totalCount}</strong> tiêu chuẩn. Tiếp tục duy trì phác đồ CPT hiện tại và đánh giá lại sau 1 giờ.
            </div>
          `;
        }
      }
    };

    cbList.forEach(cb => {
      cb.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        const idx = parseInt(target.getAttribute('data-crit-idx') || '0', 10);
        this.deEscalationChecked[idx] = target.checked;
        const label = target.closest('label');
        if (label) {
          label.style.borderColor = target.checked ? 'var(--cdss-success)' : 'var(--cdss-border-subtle)';
        }
        updateVerdict();
      });
    });

    const btnCheckAll = container.querySelector('#btn-check-all-de-escalation');
    if (btnCheckAll) {
      btnCheckAll.addEventListener('click', () => {
        DENGUE_DE_ESCALATION_CHECKLIST.forEach((_, idx) => {
          this.deEscalationChecked[idx] = true;
        });
        cbList.forEach(cb => {
          (cb as HTMLInputElement).checked = true;
          const label = cb.closest('label');
          if (label) label.style.borderColor = 'var(--cdss-success)';
        });
        updateVerdict();
        this.showToast('Đã đánh dấu đạt 7/7 tiêu chuẩn chuyển điện giải!');
      });
    }

    updateVerdict();
  }

  // VIEW 3: PHÁC ĐỒ XỬ TRÍ KHI KHÔNG ĐÁP ỨNG & SỐC TRƠ
  private renderRefractorySuiteView(container: HTMLElement, plan: DengueCDSSPlan): void {
    const effectiveWeight = plan.weightResult.adjustedWeightKg;
    const albuminCalc = calculateAlbuminDose(effectiveWeight, 2.0, 3.5);

    container.innerHTML = `
      <section class="cdss-refractory-card" style="margin-top:0;">
        <div class="cdss-refractory-header">
          <h2 class="cdss-refractory-title">
            <i class="fa-solid fa-shield-virus"></i> Phác Đồ Xử Trí Khi Không Đáp Ứng &amp; Sốc Trơ (Bộ Y Tế 2023)
          </h2>
          <span class="cdss-brand-badge" style="background:rgba(239, 68, 68, 0.1); color:var(--cdss-danger); border-color:rgba(239,68,68,0.3);">
            Phụ lục 8, 16, 17, 18 &amp; 26
          </span>
        </div>

        <!-- Refractory Sub-Tabs Nav -->
        <div class="cdss-refractory-nav" id="cdss-ref-subtabs">
          <button type="button" class="cdss-ref-tab-btn ${this.activeRefractorySubTab === 'tab-cpt' ? 'active' : ''}" data-subtab="tab-cpt">
            <i class="fa-solid fa-arrow-trend-up text-warning"></i>
            <span>1. Đổi CPT Nấc Thang</span>
          </button>
          <button type="button" class="cdss-ref-tab-btn ${this.activeRefractorySubTab === 'tab-blood' ? 'active' : ''}" data-subtab="tab-blood">
            <i class="fa-solid fa-droplet text-danger"></i>
            <span>2. Máu &amp; Albumin (PL 17)</span>
          </button>
          <button type="button" class="cdss-ref-tab-btn ${this.activeRefractorySubTab === 'tab-cvp' ? 'active' : ''}" data-subtab="tab-cvp">
            <i class="fa-solid fa-gauge-high text-primary"></i>
            <span>3. Đo CVP &amp; Vận Mạch (PL 18)</span>
          </button>
          <button type="button" class="cdss-ref-tab-btn ${this.activeRefractorySubTab === 'tab-abcs' ? 'active' : ''}" data-subtab="tab-abcs">
            <i class="fa-solid fa-kit-medical text-purple"></i>
            <span>4. Gói Hồi Sức ABCS</span>
          </button>
          <button type="button" class="cdss-ref-tab-btn ${this.activeRefractorySubTab === 'tab-liver' ? 'active' : ''}" data-subtab="tab-liver">
            <i class="fa-solid fa-triangle-exclamation text-danger"></i>
            <span>5. Suy Gan Cấp (NAC - PL 26)</span>
          </button>
          <button type="button" class="cdss-ref-tab-btn ${this.activeRefractorySubTab === 'tab-overload' ? 'active' : ''}" data-subtab="tab-overload">
            <i class="fa-solid fa-water text-info"></i>
            <span>6. Quá Tải / Phù Phổi Cấp</span>
          </button>
        </div>

        <div class="cdss-refractory-body" id="cdss-ref-subtab-content">
          <!-- Dynamic Content -->
        </div>
      </section>
    `;

    // Render active sub-tab content
    this.renderSubTabContent(plan);

    // Attach sub-tab click events
    const subTabBtns = container.querySelectorAll('.cdss-ref-tab-btn');
    subTabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const sub = target.getAttribute('data-subtab');
        if (sub) {
          subTabBtns.forEach(b => b.classList.remove('active'));
          target.classList.add('active');
          this.activeRefractorySubTab = sub;
          this.renderSubTabContent(plan);
        }
      });
    });
  }

  private renderSubTabContent(plan: DengueCDSSPlan): void {
    const body = document.getElementById('cdss-ref-subtab-content');
    if (!body) return;

    const effectiveWeight = plan.weightResult.adjustedWeightKg;
    const albuminCalc = calculateAlbuminDose(effectiveWeight, 2.0, 3.5);

    switch (this.activeRefractorySubTab) {
      case 'tab-cpt': {
        const cptScen = DENGUE_NON_RESPONSE_SCENARIOS.cpt_escalation;
        const rateAdult = Math.round(15 * effectiveWeight);
        const rateChild = Math.round(20 * effectiveWeight);
        body.innerHTML = `
          <div class="cdss-tab-pane active">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
              <div>
                <h3 style="font-size:1.05rem; font-weight:800; color:var(--cdss-text); margin:0;">
                  ${cptScen.name}
                </h3>
                <div style="font-size:0.8rem; color:var(--cdss-text-muted); margin-top:2px;">
                  ${cptScen.triggerCriteria}
                </div>
              </div>
              <span class="cdss-dose-badge">${cptScen.tag}</span>
            </div>

            <div style="background:var(--cdss-surface-alt); border:1px solid var(--cdss-border); border-radius:8px; padding:0.85rem 1rem; margin-bottom:1rem;">
              <div style="font-size:0.82rem; line-height:1.45; margin-bottom:0.6rem;">
                <strong>Cơ chế sinh lý bệnh:</strong> ${cptScen.mechanism}
              </div>
              <div style="font-size:0.85rem; font-weight:700; color:var(--cdss-primary);">
                <strong>Xử trí tức thì:</strong> ${cptScen.primaryAction}
              </div>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1rem; margin-bottom:1rem;">
              <div class="cdss-card" style="padding:0.85rem; border-top:3px solid var(--cdss-warning);">
                <div style="font-size:0.85rem; font-weight:800; margin-bottom:0.4rem; color:var(--cdss-text);">
                  <i class="fa-solid fa-child text-warning"></i> Liều Trẻ Em (< 16 Tuổi)
                </div>
                <div style="font-size:1.15rem; font-weight:800; color:var(--cdss-warning); font-family:var(--cdss-font-mono);">
                  10 - 20 ml/kg/giờ
                </div>
                <div style="font-size:0.8rem; color:var(--cdss-text-muted); margin-top:4px;">
                  Bệnh nhân (${effectiveWeight}kg): <strong>${Math.round(10 * effectiveWeight)} - ${rateChild} ml/giờ</strong>
                </div>
                <div style="font-size:0.75rem; color:var(--cdss-text-muted); margin-top:6px;">
                  Truyền trong 1 giờ. Nếu ra sốc: giảm bậc 10 ml/kg/h (1-2h) -> 7.5 -> 5 -> 3 ml/kg/h.
                </div>
              </div>

              <div class="cdss-card" style="padding:0.85rem; border-top:3px solid var(--cdss-primary);">
                <div style="font-size:0.85rem; font-weight:800; margin-bottom:0.4rem; color:var(--cdss-text);">
                  <i class="fa-solid fa-user-doctor text-primary"></i> Liều Người Lớn (≥ 16 Tuổi)
                </div>
                <div style="font-size:1.15rem; font-weight:800; color:var(--cdss-primary); font-family:var(--cdss-font-mono);">
                  10 - 15 ml/kg/giờ
                </div>
                <div style="font-size:0.8rem; color:var(--cdss-text-muted); margin-top:4px;">
                  Bệnh nhân (${effectiveWeight}kg): <strong>${Math.round(10 * effectiveWeight)} - ${rateAdult} ml/giờ</strong>
                </div>
                <div style="font-size:0.75rem; color:var(--cdss-text-muted); margin-top:6px;">
                  Truyền trong 1 giờ. Nếu ra sốc: chuyển điện giải 10 (2h) -> 6 (2h) -> 3 (5-7h) -> 1.5 ml/kg/h (12h).
                </div>
              </div>
            </div>

            <div style="font-size:0.8rem; background:var(--cdss-surface); border:1px solid var(--cdss-border); border-radius:6px; padding:0.75rem 1rem;">
              <strong style="color:var(--cdss-text);"><i class="fa-solid fa-list-check text-primary"></i> Y lệnh cụ thể &amp; Giám sát:</strong>
              <ul style="margin:0.4rem 0 0 1.2rem; padding:0; line-height:1.45;">
                ${cptScen.keyOrders.map(o => `<li>${o}</li>`).join('')}
              </ul>
              <div style="margin-top:0.6rem; padding-top:0.4rem; border-top:1px dashed var(--cdss-border); color:var(--cdss-danger); font-size:0.76rem; font-weight:600;">
                <i class="fa-solid fa-triangle-exclamation"></i> Giới hạn tổng liều CPT: Tối đa 60 ml/kg. Nếu tổng CPT ≥ 60 ml/kg mà còn sốc -> Bắt buộc đo CVP và xem xét bù Albumin 5%!
              </div>
            </div>
          </div>
        `;
        break;
      }

      case 'tab-blood': {
        const bloodScen = DENGUE_NON_RESPONSE_SCENARIOS.occult_bleeding;
        const products = plan.bloodProducts;
        body.innerHTML = `
          <div class="cdss-tab-pane active">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
              <div>
                <h3 style="font-size:1.05rem; font-weight:800; color:var(--cdss-danger); margin:0;">
                  <i class="fa-solid fa-droplet"></i> ${bloodScen.name}
                </h3>
                <div style="font-size:0.8rem; color:var(--cdss-text-muted); margin-top:2px;">
                  ${bloodScen.triggerCriteria}
                </div>
              </div>
              <span class="cdss-dose-badge cdss-dose-badge--danger">${bloodScen.tag}</span>
            </div>

            <!-- Bảng Tính Chế Phẩm Máu Theo Cân Nặng Bệnh Nhân -->
            <table class="cdss-ref-table">
              <thead>
                <tr>
                  <th style="width: 25%;">Chế Phẩm Máu / Thuốc</th>
                  <th style="width: 25%;">Liều Tính Ra (${effectiveWeight}kg)</th>
                  <th style="width: 28%;">Chỉ Định &amp; Ngưỡng Truyền (BYT 2023)</th>
                  <th style="width: 22%;">Lưu Ý An Toàn</th>
                </tr>
              </thead>
              <tbody>
                ${products.map(p => `
                  <tr>
                    <td>
                      <div style="font-weight:700; color:var(--cdss-text);">${p.productName}</div>
                      <div style="font-size:0.72rem; color:var(--cdss-text-muted);">${p.doseFormula}</div>
                    </td>
                    <td>
                      <span class="cdss-dose-badge ${p.thresholdMet ? 'cdss-dose-badge--danger' : ''}">${p.calculatedDose}</span>
                    </td>
                    <td style="font-size:0.76rem;">${p.indication}</td>
                    <td style="font-size:0.74rem; color:var(--cdss-text-muted);">${p.precautions}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <!-- Bảng Tính Bù Albumin Theo Công Thức QĐ 2760 -->
            <div class="cdss-albumin-calc-card">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                <div style="font-size:0.9rem; font-weight:800; color:var(--cdss-primary);">
                  <i class="fa-solid fa-flask-vial"></i> Bảng Tính Bù Albumin (Bộ Y Tế Trang 20 - QĐ 2760)
                </div>
                <span class="cdss-brand-badge">Áp lực keo</span>
              </div>
              <div style="font-size:0.8rem; color:var(--cdss-text); margin-bottom:0.6rem;">
                ${albuminCalc.indicationNotes}
              </div>
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:0.6rem; background:var(--cdss-surface); border-radius:6px; padding:0.6rem; border:1px solid var(--cdss-border);">
                <div>
                  <div style="font-size:0.72rem; color:var(--cdss-text-muted);">Liều Albumin nguyên chất</div>
                  <strong style="font-size:1.05rem; color:var(--cdss-primary); font-family:var(--cdss-font-mono);">${albuminCalc.albuminGrams} g</strong>
                  <div style="font-size:0.7rem; color:var(--cdss-text-muted);">Cần ${albuminCalc.vials20Percent50ml} lọ Albumin 20% 50ml</div>
                </div>
                <div>
                  <div style="font-size:0.72rem; color:var(--cdss-text-muted);">Cách pha 5% (chuẩn)</div>
                  <div style="font-size:0.76rem; font-weight:600;">${albuminCalc.preparation5Percent}</div>
                </div>
                <div>
                  <div style="font-size:0.72rem; color:var(--cdss-text-muted);">Tốc độ truyền khuyến cáo</div>
                  <div style="font-size:0.76rem; font-weight:700; color:var(--cdss-primary);">${albuminCalc.infusionRateMlH}</div>
                </div>
              </div>
            </div>
          </div>
        `;
        break;
      }

      case 'tab-cvp': {
        const cvpScen = DENGUE_NON_RESPONSE_SCENARIOS.refractory_shock_cvp;
        const testDose = Math.round(5 * effectiveWeight);
        body.innerHTML = `
          <div class="cdss-tab-pane active">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
              <div>
                <h3 style="font-size:1.05rem; font-weight:800; color:var(--cdss-purple); margin:0;">
                  <i class="fa-solid fa-gauge-high"></i> ${cvpScen.name}
                </h3>
                <div style="font-size:0.8rem; color:var(--cdss-text-muted); margin-top:2px;">
                  ${cvpScen.triggerCriteria}
                </div>
              </div>
              <span class="cdss-dose-badge" style="background:var(--cdss-purple-light); color:var(--cdss-purple); border-color:var(--cdss-purple);">
                ${cvpScen.tag}
              </span>
            </div>

            <!-- Khuyến cáo đặt Catheter Tĩnh Mạch Nền Khuỷu Tay -->
            <div style="background:rgba(139, 92, 246, 0.05); border:1px solid rgba(139, 92, 246, 0.2); border-radius:8px; padding:0.85rem 1rem; margin-bottom:1rem;">
              <div style="font-size:0.85rem; font-weight:700; color:var(--cdss-purple); margin-bottom:0.35rem;">
                <i class="fa-solid fa-triangle-exclamation"></i> KỸ THUẬT ĐẶT CVP BẮT BUỘC: QUA TĨNH MẠCH NỀN KHUỶU TAY (SELDINGER CẢI TIẾN)
              </div>
              <div style="font-size:0.78rem; line-height:1.45; color:var(--cdss-text);">
                <strong>Tuyệt đối KHÔNG chọc tĩnh mạch cảnh trong hoặc dưới đòn:</strong> Bệnh nhân SXHD nặng có rối loạn đông máu và giảm tiểu cầu sâu; nguy cơ tụ máu chèn ép khí quản và tràn máu màng phổi tử vong không thể ép cầm máu được. Đặt TM nền khuỷu tay ép cầm máu dễ dàng và an toàn 100%.
              </div>
            </div>

            <!-- Test Dịch & Phân Nhánh CVP -->
            <div style="background:var(--cdss-surface-alt); border:1px solid var(--cdss-border); border-radius:8px; padding:0.85rem; margin-bottom:1rem;">
              <div style="font-size:0.85rem; font-weight:800; margin-bottom:0.4rem; color:var(--cdss-text);">
                <i class="fa-solid fa-vial"></i> Test Dịch Đo CVP: Cao Phân Tử 5 ml/kg trong 30 phút (${testDose} ml)
              </div>
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:0.75rem; margin-top:0.6rem;">
                <div style="background:var(--cdss-surface); border:1px solid rgba(2, 132, 199, 0.3); border-radius:6px; padding:0.75rem; border-top:3px solid var(--cdss-primary);">
                  <div style="font-weight:800; color:var(--cdss-primary); font-size:0.88rem; margin-bottom:0.25rem;">
                    1. Nếu CVP ≤ 15 cmH2O (IVC xẹp)
                  </div>
                  <div style="font-size:0.78rem; line-height:1.4; color:var(--cdss-text-muted);">
                    • Vẫn còn thiếu thể tích tuần hoàn hữu hiệu.<br>
                    • Tiếp tục truyền Cao Phân Tử 10 - 20 ml/kg/h.<br>
                    • Nếu tổng CPT ≥ 60 ml/kg kèm Albumin < 2.5 g/dL: Bù Albumin 5% hoặc 10%.
                  </div>
                </div>

                <div style="background:var(--cdss-surface); border:1px solid rgba(239, 68, 68, 0.3); border-radius:6px; padding:0.75rem; border-top:3px solid var(--cdss-danger);">
                  <div style="font-weight:800; color:var(--cdss-danger); font-size:0.88rem; margin-bottom:0.25rem;">
                    2. Nếu CVP > 15 cmH2O (IVC căng to)
                  </div>
                  <div style="font-size:0.78rem; line-height:1.4; color:var(--cdss-text-muted);">
                    • Quá tải thể tích hoặc suy co bóp tim.<br>
                    • Ngưng dịch nếu có dấu hiệu quá tải.<br>
                    • <strong>Dobutamin 3 - 10 µg/kg/phút</strong> tăng co bóp cơ tim.<br>
                    • Phối hợp <strong>Noradrenalin</strong> nếu HA tâm trương tụt (sốc ấm).<br>
                    • Phối hợp <strong>Adrenalin</strong> nếu sốc kháng trị co bóp tim suy giảm.
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        break;
      }

      case 'tab-abcs': {
        const abcs = plan.abcsChecklist;
        body.innerHTML = `
          <div class="cdss-tab-pane active">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
              <h3 style="font-size:1.05rem; font-weight:800; color:var(--cdss-text); margin:0;">
                <i class="fa-solid fa-kit-medical text-primary"></i> Gói Hồi Sức Toàn Diện ABCS (Phụ Lục 16.2 &amp; 18)
              </h3>
              <span class="cdss-brand-badge">Bắt buộc khi sốc trơ</span>
            </div>
            <div style="font-size:0.8rem; color:var(--cdss-text-muted); margin-bottom:0.85rem;">
              Ở mọi bệnh nhân sốc SXHD không đáp ứng bù dịch hoặc tái sốc nhiều lần, bắt buộc rà soát đồng thời 4 yếu tố cơ bản ABCS để đảo ngược toan kiềm, hạ canxi và suy tạng:
            </div>

            <div class="cdss-abcs-grid">
              <div class="cdss-abcs-card cdss-abcs-card--acidosis">
                <div class="cdss-abcs-card-title">
                  <i class="fa-solid fa-vial-virus text-danger"></i> ${abcs.acidosis.title}
                </div>
                <div class="cdss-abcs-criteria">Ngưỡng: ${abcs.acidosis.criteria}</div>
                <div class="cdss-abcs-action">${abcs.acidosis.action}</div>
              </div>

              <div class="cdss-abcs-card cdss-abcs-card--bleeding">
                <div class="cdss-abcs-card-title">
                  <i class="fa-solid fa-droplet text-danger"></i> ${abcs.bleeding.title}
                </div>
                <div class="cdss-abcs-criteria">Ngưỡng: ${abcs.bleeding.criteria}</div>
                <div class="cdss-abcs-action">${abcs.bleeding.action}</div>
              </div>

              <div class="cdss-abcs-card cdss-abcs-card--calcium">
                <div class="cdss-abcs-card-title">
                  <i class="fa-solid fa-bone text-warning"></i> ${abcs.calcium.title}
                </div>
                <div class="cdss-abcs-criteria">Ngưỡng: ${abcs.calcium.criteria}</div>
                <div class="cdss-abcs-action">${abcs.calcium.action}</div>
              </div>

              <div class="cdss-abcs-card cdss-abcs-card--sugar">
                <div class="cdss-abcs-card-title">
                  <i class="fa-solid fa-cubes-stacked text-success"></i> ${abcs.sugar.title}
                </div>
                <div class="cdss-abcs-criteria">Ngưỡng: ${abcs.sugar.criteria}</div>
                <div class="cdss-abcs-action">${abcs.sugar.action}</div>
              </div>
            </div>
          </div>
        `;
        break;
      }

      case 'tab-liver': {
        const nac = plan.nacProtocol;
        const liverScen = DENGUE_NON_RESPONSE_SCENARIOS.acute_liver_failure;
        body.innerHTML = `
          <div class="cdss-tab-pane active">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
              <div>
                <h3 style="font-size:1.05rem; font-weight:800; color:var(--cdss-danger); margin:0;">
                  <i class="fa-solid fa-triangle-exclamation"></i> ${liverScen.name}
                </h3>
                <div style="font-size:0.8rem; color:var(--cdss-text-muted); margin-top:2px;">
                  ${liverScen.triggerCriteria}
                </div>
              </div>
              <span class="cdss-dose-badge cdss-dose-badge--danger">${liverScen.tag}</span>
            </div>

            <!-- Cảnh Báo Chống Chỉ Định Tuyệt Đối Ringer Lactate & Paracetamol -->
            <div style="background:rgba(239, 68, 68, 0.08); border:1.5px solid var(--cdss-danger); border-radius:8px; padding:0.85rem 1rem; margin-bottom:1rem;">
              <div style="font-size:0.9rem; font-weight:800; color:var(--cdss-danger); margin-bottom:0.35rem;">
                <i class="fa-solid fa-ban"></i> CHỐNG CHỈ ĐỊNH TUYỆT ĐỐI RINGER LACTATE &amp; PARACETAMOL!
              </div>
              <div style="font-size:0.78rem; line-height:1.45; color:var(--cdss-text);">
                Khi gan tổn thương nặng hoặc suy gan cấp (AST/ALT ≥ 1000 U/L), gan không chuyển hóa được lactate dẫn đến bùng phát toan lactic tử vong. Dịch thay thế bắt buộc: <strong>NaCl 0.9% hoặc Ringer Acetate, Dextrosaline</strong>. Hạ sốt bằng lau mát nước ấm.
              </div>
            </div>

            <!-- Bảng Phác Đồ N-Acetylcysteine 4 Pha -->
            <div style="font-size:0.85rem; font-weight:800; color:var(--cdss-text); margin-bottom:0.4rem;">
              Phác Đồ Truyền N-Acetylcysteine (NAC) Tĩnh Mạch 4 Pha (Phụ Lục 26 - QĐ 2760)
            </div>
            <table class="cdss-ref-table">
              <thead>
                <tr>
                  <th style="width: 25%;">Giai Đoạn</th>
                  <th style="width: 20%;">Liều mg/kg</th>
                  <th style="width: 25%;">Tổng Lượng (${effectiveWeight}kg)</th>
                  <th style="width: 30%;">Dung Môi &amp; Tốc Độ Bơm Tiêm</th>
                </tr>
              </thead>
              <tbody>
                ${nac.phases.map(p => `
                  <tr>
                    <td><strong>${p.phaseName}</strong></td>
                    <td><span class="cdss-dose-badge">${p.doseMgKg} mg/kg</span></td>
                    <td><strong>${p.totalMg.toLocaleString('vi-VN')} mg</strong></td>
                    <td style="font-size:0.78rem;">
                      <div>${p.diluent}</div>
                      <div style="color:var(--cdss-primary); font-weight:700;">Tốc độ: ${p.pumpRateMlH}</div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
        break;
      }

      case 'tab-overload': {
        const overScen = DENGUE_NON_RESPONSE_SCENARIOS.fluid_overload;
        const furoDose = Math.round(0.75 * effectiveWeight * 10) / 10;
        body.innerHTML = `
          <div class="cdss-tab-pane active">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
              <div>
                <h3 style="font-size:1.05rem; font-weight:800; color:var(--cdss-warning); margin:0;">
                  <i class="fa-solid fa-water"></i> ${overScen.name}
                </h3>
                <div style="font-size:0.8rem; color:var(--cdss-text-muted); margin-top:2px;">
                  ${overScen.triggerCriteria}
                </div>
              </div>
              <span class="cdss-dose-badge" style="background:var(--cdss-warning-light); color:var(--cdss-warning); border-color:var(--cdss-warning);">
                ${overScen.tag}
              </span>
            </div>

            <!-- Xử Trí Khẩn Cấp -->
            <div style="background:rgba(245, 158, 11, 0.08); border:1.5px solid var(--cdss-warning); border-radius:8px; padding:0.85rem 1rem; margin-bottom:1rem;">
              <div style="font-size:0.9rem; font-weight:800; color:var(--cdss-warning); margin-bottom:0.35rem;">
                <i class="fa-solid fa-stop-circle"></i> NGƯNG NGAY DỊCH TRUYỀN TĨNH MẠCH!
              </div>
              <div style="font-size:0.8rem; line-height:1.45; color:var(--cdss-text);">
                (1) Nằm đầu cao 30 - 45°.<br>
                (2) Thở oxy qua canulla 2 - 5 L/p -> Thở NCPAP áp lực 4 - 6 cmH2O nếu SpO2 < 92%.<br>
                (3) <strong>Furosemide:</strong> 0.5 - 1 mg/kg tiêm TM chậm (Bệnh nhân ${effectiveWeight}kg: <strong>${furoDose} mg</strong> TM). <em>Chỉ dùng khi huyết áp ổn định</em>.<br>
                (4) <strong>Dobutamin:</strong> 5 - 10 µg/kg/phút để tăng co bóp cơ tim, giảm áp lực mao mạch phổi bít.<br>
                (5) Chọc hút giải áp màng bụng/màng phổi khi suy hô hấp nặng và áp lực bàng quang > 27 cmH2O.
              </div>
            </div>
          </div>
        `;
        break;
      }
    }
  }

  // VIEW 4: THUỐC VẬN MẠCH & LƯU ĐỒ HUYẾT ĐỘNG CVP BƠM TIÊM ĐIỆN 50ML (PHỤ LỤC 15 & 18)
  private renderVasopressorsView(container: HTMLElement, plan: DengueCDSSPlan): void {
    const effectiveWeight = plan.weightResult.adjustedWeightKg;
    const {
      vasopressorDopamin: d,
      vasopressorNoradrenalin: n,
      vasopressorDobutamin: dob,
      vasopressorAdrenalin: adr
    } = plan;

    // Đánh giá lưu đồ theo trạng thái huyết động hiện tại
    const decision = evaluateVasopressorAlgorithm(
      this.currentHemodynamic,
      effectiveWeight,
      plan.patient.ageYears
    );
    plan.vasopressorDecision = decision;

    // Tính toán cho Test dịch CPT 5 ml/kg trong 30 phút
    const cptTestMl = Math.round(5 * effectiveWeight);
    const cptTestPumpRate = Math.round(10 * effectiveWeight);

    // Tính toán cho bộ tính liều 2 chiều
    const curDrug = this.interactiveDrugName;
    const isNoraOrAdr = curDrug.toLowerCase().includes('noradrenalin') || curDrug.toLowerCase().includes('adrenalin');
    const calcRecipeTotalMg = isNoraOrAdr
      ? Math.round(0.3 * effectiveWeight * 100) / 100
      : Math.round(3 * effectiveWeight * 10) / 10;
    const calcEquivText = isNoraOrAdr
      ? '1 ml/giờ = 0.1 µg/kg/phút'
      : '1 ml/giờ = 1 µg/kg/phút';

    container.innerHTML = `
      <!-- KHỐI 1: LƯU ĐỒ CHỌN THUỐC VẬN MẠCH THEO CVP & HUYẾT ĐỘNG (PHỤ LỤC 15 & 18) -->
      <section class="cdss-card" style="margin-top:0; margin-bottom:1.25rem;">
        <div class="cdss-card-header">
          <div>
            <h2 class="cdss-card-title">
              <i class="fa-solid fa-diagram-project text-primary"></i> Lưu Đồ Chọn Thuốc Vận Mạch &amp; Inotrope Theo CVP &amp; Huyết Động (Phụ Lục 15 &amp; 18)
            </h2>
            <div style="font-size:0.78rem; color:var(--cdss-text-muted); margin-top:2px;">
              Phân tầng theo Áp lực tĩnh mạch trung tâm (CVP), Co bóp cơ tim và Trương lực mạch (QĐ 2760/QĐ-BYT)
            </div>
          </div>
          <span class="cdss-brand-badge">Phụ lục 15 &amp; 18</span>
        </div>

        <div style="padding:1rem;">
          <!-- BỘ CHỌN 4 TRỤC HUYẾT ĐỘNG HỌC -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:0.75rem; margin-bottom:1rem;">
            <!-- 1. Mức CVP -->
            <div style="background:var(--cdss-surface-alt); border:1px solid var(--cdss-border-subtle); border-radius:8px; padding:0.65rem 0.8rem;">
              <div style="font-size:0.72rem; font-weight:800; text-transform:uppercase; color:var(--cdss-text-muted); margin-bottom:0.4rem;">
                <i class="fa-solid fa-gauge-high text-primary"></i> 1. Mức CVP Đo Được:
              </div>
              <div style="display:flex; flex-direction:column; gap:0.35rem;">
                <button type="button" class="cdss-segmented-btn ${this.currentHemodynamic.cvpLevel === 'low_normal' ? 'active' : ''}" data-hemo-prop="cvpLevel" data-hemo-val="low_normal" style="font-size:0.75rem; text-align:left; padding:0.35rem 0.6rem;">
                  <strong>CVP ≤ 15 cmH2O</strong> (Chưa đủ tiền tải / Test CPT)
                </button>
                <button type="button" class="cdss-segmented-btn ${this.currentHemodynamic.cvpLevel === 'high' ? 'active' : ''}" data-hemo-prop="cvpLevel" data-hemo-val="high" style="font-size:0.75rem; text-align:left; padding:0.35rem 0.6rem;">
                  <strong>CVP > 15 cmH2O</strong> (Đủ tiền tải / Nguy cơ quá tải)
                </button>
              </div>
            </div>

            <!-- 2. Sức co bóp cơ tim -->
            <div style="background:var(--cdss-surface-alt); border:1px solid var(--cdss-border-subtle); border-radius:8px; padding:0.65rem 0.8rem;">
              <div style="font-size:0.72rem; font-weight:800; text-transform:uppercase; color:var(--cdss-text-muted); margin-bottom:0.4rem;">
                <i class="fa-solid fa-heart-pulse text-danger"></i> 2. Co Bóp Cơ Tim:
              </div>
              <div style="display:flex; flex-direction:column; gap:0.35rem;">
                <button type="button" class="cdss-segmented-btn ${this.currentHemodynamic.cardiacContractility === 'normal' ? 'active' : ''}" data-hemo-prop="cardiacContractility" data-hemo-val="normal" style="font-size:0.75rem; text-align:left; padding:0.35rem 0.6rem;">
                  <strong>Bình thường</strong>
                </button>
                <button type="button" class="cdss-segmented-btn ${this.currentHemodynamic.cardiacContractility === 'reduced' ? 'active' : ''}" data-hemo-prop="cardiacContractility" data-hemo-val="reduced" style="font-size:0.75rem; text-align:left; padding:0.35rem 0.6rem;">
                  <strong>Giảm co bóp</strong> (Viêm cơ tim / Sốc tim Dengue)
                </button>
              </div>
            </div>

            <!-- 3. Trương lực mạch & Huyết áp -->
            <div style="background:var(--cdss-surface-alt); border:1px solid var(--cdss-border-subtle); border-radius:8px; padding:0.65rem 0.8rem;">
              <div style="font-size:0.72rem; font-weight:800; text-transform:uppercase; color:var(--cdss-text-muted); margin-bottom:0.4rem;">
                <i class="fa-solid fa-bolt text-warning"></i> 3. Trương Lực Mạch &amp; HA:
              </div>
              <div style="display:flex; flex-direction:column; gap:0.35rem;">
                <button type="button" class="cdss-segmented-btn ${this.currentHemodynamic.vascularTone === 'normal' ? 'active' : ''}" data-hemo-prop="vascularTone" data-hemo-val="normal" style="font-size:0.75rem; text-align:left; padding:0.35rem 0.6rem;">
                  <strong>Bình thường</strong>
                </button>
                <button type="button" class="cdss-segmented-btn ${this.currentHemodynamic.vascularTone === 'low_warm_shock' ? 'active' : ''}" data-hemo-prop="vascularTone" data-hemo-val="low_warm_shock" style="font-size:0.75rem; text-align:left; padding:0.35rem 0.6rem;">
                  <strong>Tụt HA tâm trương / Sốc ấm</strong> (Giảm kháng lực)
                </button>
              </div>
            </div>

            <!-- 4. Quá tải tuần hoàn -->
            <div style="background:var(--cdss-surface-alt); border:1px solid var(--cdss-border-subtle); border-radius:8px; padding:0.65rem 0.8rem;">
              <div style="font-size:0.72rem; font-weight:800; text-transform:uppercase; color:var(--cdss-text-muted); margin-bottom:0.4rem;">
                <i class="fa-solid fa-water text-teal-600"></i> 4. Quá Tải Tuần Hoàn:
              </div>
              <div style="display:flex; flex-direction:column; gap:0.35rem;">
                <button type="button" class="cdss-segmented-btn ${!this.currentHemodynamic.isOverloaded ? 'active' : ''}" data-hemo-prop="isOverloaded" data-hemo-val="false" style="font-size:0.75rem; text-align:left; padding:0.35rem 0.6rem;">
                  <strong>Không quá tải</strong>
                </button>
                <button type="button" class="cdss-segmented-btn ${this.currentHemodynamic.isOverloaded ? 'active' : ''}" data-hemo-prop="isOverloaded" data-hemo-val="true" style="font-size:0.75rem; text-align:left; padding:0.35rem 0.6rem;">
                  <strong>Có quá tải / Dọa phù phổi cấp</strong>
                </button>
              </div>
            </div>
          </div>

          <!-- KẾT QUẢ CHỈ ĐẠO LÂM SÀNG THEO THUẬT TOÁN BỘ Y TẾ -->
          <div style="background:var(--cdss-surface-alt); border:1.5px solid var(--cdss-primary); border-radius:10px; padding:1rem;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem; flex-wrap:wrap; gap:8px;">
              <div>
                <span style="font-size:0.7rem; font-weight:800; text-transform:uppercase; color:var(--cdss-primary); letter-spacing:0.5px;">
                  Chỉ Định Thuốc &amp; Hành Động Khuyến Cáo:
                </span>
                <div style="font-size:1.15rem; font-weight:800; color:var(--cdss-text); margin-top:2px;">
                  ${decision.primaryDrug}
                </div>
              </div>
              <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
                <span class="cdss-dose-badge cdss-dose-badge--danger" style="font-size:0.8rem;">Liều: ${decision.primaryDose}</span>
                <span class="cdss-dose-badge" style="font-size:0.8rem; background:rgba(13,148,136,0.12); color:var(--cdss-primary); border-color:var(--cdss-primary);">
                  Bơm điện: ${decision.primaryPumpRateMlH}
                </span>
              </div>
            </div>

            <!-- Hành Động Với Dịch Truyền -->
            <div style="background:var(--cdss-surface); border:1px solid var(--cdss-border-subtle); border-radius:6px; padding:0.65rem 0.85rem; margin-bottom:0.65rem;">
              <strong style="color:var(--cdss-danger); font-size:0.82rem;">
                <i class="fa-solid fa-hand-holding-droplet"></i> Hành động dịch truyền:
              </strong>
              <span style="font-size:0.8rem; color:var(--cdss-text); margin-left:4px;">
                ${decision.fluidAction}
              </span>
            </div>

            <!-- Thuốc Phối Hợp / Cứu Nguy nếu có -->
            ${decision.secondaryDrug || decision.rescueDrug ? `
              <div style="display:flex; gap:0.75rem; flex-wrap:wrap; margin-bottom:0.65rem; font-size:0.78rem;">
                ${decision.secondaryDrug ? `
                  <div style="background:var(--cdss-surface); border:1px solid var(--cdss-border-subtle); border-radius:6px; padding:0.45rem 0.75rem;">
                    <strong>Phối hợp:</strong> <span style="color:var(--cdss-purple); font-weight:700;">${decision.secondaryDrug}</span> ${decision.secondaryDose ? `(${decision.secondaryDose})` : ''}
                  </div>
                ` : ''}
                ${decision.rescueDrug ? `
                  <div style="background:var(--cdss-surface); border:1px solid var(--cdss-danger); border-radius:6px; padding:0.45rem 0.75rem; color:var(--cdss-danger);">
                    <strong>Cứu nguy:</strong> <span style="font-weight:800;">${decision.rescueDrug}</span>
                  </div>
                ` : ''}
              </div>
            ` : ''}

            <!-- Lý luận lâm sàng & Chỉ dẫn theo dõi -->
            <div style="font-size:0.78rem; line-height:1.45; color:var(--cdss-text-muted);">
              <div><strong>Lý luận lâm sàng:</strong> ${decision.clinicalRationale}</div>
              <ul style="margin:0.4rem 0 0 1.2rem; padding:0;">
                ${decision.monitoringDirectives.map(dir => `<li>${dir}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- KHỐI 2: Ô TEST DỊCH CAO PHÂN TỬ 5 ML/KG TRONG 30 PHÚT (PHỤ LỤC 18) -->
      <section class="cdss-card" style="margin-bottom:1.25rem;">
        <div class="cdss-card-header">
          <div>
            <h2 class="cdss-card-title">
              <i class="fa-solid fa-stopwatch text-teal-600"></i> Quy Trình Test Dịch Cao Phân Tử 5 ml/kg Trong 30 Phút (Phụ Lục 18 - QĐ 2760)
            </h2>
            <div style="font-size:0.78rem; color:var(--cdss-text-muted); margin-top:2px;">
              Bắt buộc thực hiện khi CVP ≤ 15 cmH2O nhằm đánh giá mức đáp ứng thể tích trước khi nâng vận mạch.
            </div>
          </div>
          <span class="cdss-brand-badge" style="background:var(--cdss-primary-light); color:var(--cdss-primary); border-color:var(--cdss-primary);">5 ml/kg / 30 phút</span>
        </div>

        <div style="padding:1rem;">
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:0.75rem; margin-bottom:0.85rem;">
            <div class="cdss-recipe-box">
              <div class="cdss-recipe-row">
                <span class="cdss-recipe-key">Cân nặng tính dịch:</span>
                <strong>${effectiveWeight} kg</strong>
              </div>
              <div class="cdss-recipe-row">
                <span class="cdss-recipe-key">Thể tích Test CPT (5 ml/kg):</span>
                <strong style="color:var(--cdss-primary); font-size:1.05rem;">${cptTestMl} ml</strong>
              </div>
              <div class="cdss-recipe-row">
                <span class="cdss-recipe-key">Thời gian truyền:</span>
                <span>Chính xác <strong>30 phút</strong></span>
              </div>
              <div class="cdss-recipe-row cdss-recipe-highlight text-primary">
                <span>Tốc độ bơm máy:</span>
                <span><strong>${cptTestPumpRate} ml/giờ</strong> trong 30 phút</span>
              </div>
            </div>

            <div style="background:var(--cdss-surface-alt); border:1px solid var(--cdss-border-subtle); border-radius:8px; padding:0.75rem; font-size:0.78rem; line-height:1.45;">
              <strong style="color:var(--cdss-primary); font-size:0.82rem; display:block; margin-bottom:0.35rem;">
                <i class="fa-solid fa-stethoscope"></i> Đánh Giá Đáp Ứng Sau 30 Phút Test CPT:
              </strong>
              • <strong>ΔCVP tăng ≥ 5 cmH2O hoặc Huyết áp lên:</strong> Thể tích lòng mạch thiếu hụt ➜ Tiếp tục truyền CPT tốc độ 10 - 20 ml/kg/h.<br>
              • <strong>CVP tăng vọt > 15 cmH2O mà HA không lên:</strong> Tiền tải đã đầy, nguy cơ suy tim/quá tải ➜ Ngưng dịch, dùng ngay <strong>Dobutamin</strong> hoặc <strong>Noradrenalin</strong>.<br>
              • <strong>ΔCVP < 5 cmH2O & HA không cải thiện:</strong> Thất thoát huyết tương cực nhanh hoặc mất máu ẩn ➜ Đo lại Hct tại giường, siêu âm tim/bụng khẩn.
            </div>
          </div>
        </div>
      </section>

      <!-- KHỐI 3: BỘ TÍNH LIỀU & TỐC ĐỘ BƠM TIÊM ĐIỆN 50ML HAI CHIỀU THỜI GIAN THỰC -->
      <section class="cdss-card" style="margin-bottom:1.25rem;">
        <div class="cdss-card-header">
          <div>
            <h2 class="cdss-card-title">
              <i class="fa-solid fa-calculator text-primary"></i> Bộ Tính Liều &amp; Tốc Độ Bơm Tiêm Điện 50ml Hai Chiều Tương Tác
            </h2>
            <div style="font-size:0.78rem; color:var(--cdss-text-muted); margin-top:2px;">
              Nhập Liều (µg/kg/phút) ➜ Tự tính Tốc độ bơm (ml/h) HOẶC Nhập Tốc độ bơm (ml/h) ➜ Tự tính Liều
            </div>
          </div>
          <span class="cdss-brand-badge">Realtime 2-Way</span>
        </div>

        <div style="padding:1rem;">
          <!-- Nút chọn 4 loại thuốc vận mạch -->
          <div style="display:flex; gap:0.4rem; flex-wrap:wrap; margin-bottom:1rem;" id="calc-drug-selector">
            ${['Dopamin', 'Noradrenalin', 'Dobutamin', 'Adrenalin'].map(dr => `
              <button type="button" class="cdss-case-pill ${dr === this.interactiveDrugName ? 'active' : ''}" data-calc-drug="${dr}" style="font-size:0.8rem; padding:0.45rem 0.85rem;">
                <i class="fa-solid fa-syringe ${dr.includes('Noradrenalin') || dr.includes('Adrenalin') ? 'text-danger' : 'text-primary'}"></i>
                <span>${dr}</span>
              </button>
            `).join('')}
          </div>

          <!-- Card công thức pha của thuốc đang chọn -->
          <div style="background:var(--cdss-surface-alt); border:1px solid var(--cdss-border-subtle); border-radius:8px; padding:0.75rem 1rem; margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
            <div>
              <span style="font-size:0.72rem; color:var(--cdss-text-muted); text-transform:uppercase;">Công Thức Pha Bơm Tiêm Điện 50ml (BYT):</span>
              <div style="font-size:0.95rem; font-weight:800; color:var(--cdss-text); margin-top:2px;">
                ${curDrug}: Pha <strong>${calcRecipeTotalMg} mg</strong> trong 50ml Glucose 5%
              </div>
            </div>
            <div class="cdss-brand-badge" style="font-size:0.8rem; background:rgba(13,148,136,0.12); color:var(--cdss-primary); border-color:var(--cdss-primary);">
              Quy đổi: ${calcEquivText}
            </div>
          </div>

          <!-- Bảng 2 input song song + Slider -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
            <!-- Input 1: Liều (µg/kg/phút) -->
            <div style="background:var(--cdss-surface); border:1.5px solid var(--cdss-primary); border-radius:8px; padding:0.85rem;">
              <label class="cdss-form-label" style="font-size:0.78rem; font-weight:800; color:var(--cdss-primary);">
                <i class="fa-solid fa-weight-hanging"></i> Liều Thuốc (µg/kg/phút):
              </label>
              <div class="cdss-input-group" style="margin-top:4px;">
                <input type="number" id="calc-input-dose" min="0" max="30" step="${isNoraOrAdr ? '0.01' : '0.5'}" value="${this.interactiveDose}" class="cdss-input" style="font-size:1.15rem; font-weight:800; font-family:var(--cdss-font-mono);" />
                <span class="cdss-input-suffix">µg/kg/p</span>
              </div>
              <div style="font-size:0.68rem; color:var(--cdss-text-muted); margin-top:4px;">
                Liều chuẩn: ${curDrug.toLowerCase().includes('dopamin') ? '5 - 10 µg/kg/p' : curDrug.toLowerCase().includes('noradrenalin') ? '0.05 - 1.0 µg/kg/p' : curDrug.toLowerCase().includes('dobutamin') ? '3 - 10 µg/kg/p' : '0.05 - 0.3 µg/kg/p'}
              </div>
            </div>

            <!-- Input 2: Tốc độ bơm tiêm điện (ml/giờ) -->
            <div style="background:var(--cdss-surface); border:1.5px solid var(--cdss-teal); border-radius:8px; padding:0.85rem;">
              <label class="cdss-form-label" style="font-size:0.78rem; font-weight:800; color:var(--cdss-teal);">
                <i class="fa-solid fa-sliders"></i> Tốc Độ Bơm Tiêm Điện 50ml (ml/giờ):
              </label>
              <div class="cdss-input-group" style="margin-top:4px;">
                <input type="number" id="calc-input-rate" min="0" max="50" step="0.1" value="${this.interactivePumpRate}" class="cdss-input" style="font-size:1.15rem; font-weight:800; font-family:var(--cdss-font-mono); color:var(--cdss-teal);" />
                <span class="cdss-input-suffix">ml/giờ</span>
              </div>
              <div style="font-size:0.68rem; color:var(--cdss-text-muted); margin-top:4px;">
                Cài đặt trực tiếp trên máy bơm tiêm điện 50ml
              </div>
            </div>
          </div>

          <!-- Slider kéo tốc độ -->
          <div style="background:var(--cdss-surface-alt); border:1px solid var(--cdss-border-subtle); border-radius:8px; padding:0.75rem 1rem;">
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:4px;">
              <span>Kéo chỉnh tốc độ bơm nhanh:</span>
              <strong id="slider-rate-label" style="color:var(--cdss-primary); font-family:var(--cdss-font-mono);">${this.interactivePumpRate} ml/giờ (${this.interactiveDose} µg/kg/p)</strong>
            </div>
            <input type="range" id="calc-slider-rate" min="0" max="${isNoraOrAdr ? '15' : '30'}" step="${isNoraOrAdr ? '0.1' : '0.5'}" value="${this.interactivePumpRate}" style="width:100%; height:6px; accent-color:var(--cdss-primary); cursor:pointer;" />
          </div>
        </div>
      </section>

      <!-- KHỐI 4: 4 THẺ THUỐC VẬN MẠCH CHUẨN BƠM TIÊM ĐIỆN 50ML -->
      <div class="cdss-card" style="margin-top:0;">
        <div class="cdss-card-header">
          <div>
            <h2 class="cdss-card-title">
              <i class="fa-solid fa-pills text-primary"></i> Tra Cứu 4 Thuốc Vận Mạch Chuẩn Bơm Tiêm Điện 50ml
            </h2>
            <div style="font-size:0.78rem; color:var(--cdss-text-muted); margin-top:2px;">
              Công thức pha, chỉ định, dung môi và liều dùng chuẩn Bộ Y Tế (Tính theo ${effectiveWeight} kg)
            </div>
          </div>
          <span class="cdss-brand-badge">Bơm Tiêm 50ml</span>
        </div>

        <div style="padding:1rem;">
          <div class="cdss-vaso-quad-grid">
            <!-- 1. Dopamin -->
            <div class="cdss-vaso-card">
              <div class="cdss-vaso-card-header">
                <div>
                  <div class="cdss-drug-name cdss-drug-name--primary">1. Dopamin</div>
                  <div class="cdss-drug-indication">Lựa chọn đầu tay ở trẻ em</div>
                </div>
                <span class="cdss-brand-badge" style="background:var(--cdss-primary-light); color:var(--cdss-primary); border-color:var(--cdss-primary);">1 ml/h = 1 µg</span>
              </div>
              <div class="cdss-recipe-box">
                <div class="cdss-recipe-row">
                  <span class="cdss-recipe-key">Công thức pha:</span>
                  <span><strong>${d.totalMg} mg</strong> Dopamin (3 × ${d.patientWeightKg} kg)</span>
                </div>
                <div class="cdss-recipe-row">
                  <span class="cdss-recipe-key">Dung môi:</span>
                  <span>Glucose 5% vừa đủ <strong>50 ml</strong></span>
                </div>
                <div class="cdss-recipe-row cdss-recipe-highlight text-primary">
                  <span>Quy đổi liều:</span>
                  <span>Tốc độ 1 ml/giờ = 1 µg/kg/phút</span>
                </div>
              </div>
              <div class="cdss-dosing-strip">
                <div>
                  <div style="font-size:0.7rem; color:var(--cdss-text-muted); text-transform:uppercase;">Liều Khuyến Cáo</div>
                  <strong>${d.standardDoseRange}</strong>
                </div>
                <div style="text-align:right;">
                  <div style="font-size:0.7rem; color:var(--cdss-text-muted); text-transform:uppercase;">Tốc Độ Bơm</div>
                  <strong style="color:var(--cdss-primary); font-size:1.05rem;">${d.recommendedPumpRateMlH}</strong>
                </div>
              </div>
              <p class="cdss-vaso-warning">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <span>${d.precautions}</span>
              </p>
            </div>

            <!-- 2. Noradrenalin -->
            <div class="cdss-vaso-card">
              <div class="cdss-vaso-card-header">
                <div>
                  <div class="cdss-drug-name cdss-drug-name--danger">2. Noradrenalin</div>
                  <div class="cdss-drug-indication">Sốc giãn mạch / Tụt HA tâm trương / Người lớn</div>
                </div>
                <span class="cdss-brand-badge cdss-brand-badge--danger">High Alert</span>
              </div>
              <div class="cdss-recipe-box">
                <div class="cdss-recipe-row">
                  <span class="cdss-recipe-key">Công thức pha:</span>
                  <span><strong>${n.totalMg} mg</strong> Noradrenalin (0.3 × ${n.patientWeightKg} kg)</span>
                </div>
                <div class="cdss-recipe-row">
                  <span class="cdss-recipe-key">Dung môi:</span>
                  <span>Glucose 5% vừa đủ <strong>50 ml</strong></span>
                </div>
                <div class="cdss-recipe-row cdss-recipe-highlight text-danger">
                  <span>Quy đổi liều:</span>
                  <span>Tốc độ 1 ml/giờ = 0.1 µg/kg/phút</span>
                </div>
              </div>
              <div class="cdss-dosing-strip">
                <div>
                  <div style="font-size:0.7rem; color:var(--cdss-text-muted); text-transform:uppercase;">Liều Khởi Đầu</div>
                  <strong>${n.standardDoseRange}</strong>
                </div>
                <div style="text-align:right;">
                  <div style="font-size:0.7rem; color:var(--cdss-text-muted); text-transform:uppercase;">Tốc Độ Bơm</div>
                  <strong style="color:var(--cdss-danger); font-size:1.05rem;">${n.recommendedPumpRateMlH}</strong>
                </div>
              </div>
              <p class="cdss-vaso-warning">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <span>${n.precautions}</span>
              </p>
            </div>

            <!-- 3. Dobutamin -->
            <div class="cdss-vaso-card">
              <div class="cdss-vaso-card-header">
                <div>
                  <div class="cdss-drug-name" style="color:var(--cdss-purple);">3. Dobutamin</div>
                  <div class="cdss-drug-indication">CVP > 15 cmH2O / Giảm co bóp cơ tim</div>
                </div>
                <span class="cdss-brand-badge" style="background:var(--cdss-purple-light); color:var(--cdss-purple); border-color:var(--cdss-purple);">Inotrope</span>
              </div>
              <div class="cdss-recipe-box">
                <div class="cdss-recipe-row">
                  <span class="cdss-recipe-key">Công thức pha:</span>
                  <span><strong>${dob.totalMg} mg</strong> Dobutamin (3 × ${dob.patientWeightKg} kg)</span>
                </div>
                <div class="cdss-recipe-row">
                  <span class="cdss-recipe-key">Dung môi:</span>
                  <span>Glucose 5% vừa đủ <strong>50 ml</strong></span>
                </div>
                <div class="cdss-recipe-row cdss-recipe-highlight" style="color:var(--cdss-purple);">
                  <span>Quy đổi liều:</span>
                  <span>Tốc độ 1 ml/giờ = 1 µg/kg/phút</span>
                </div>
              </div>
              <div class="cdss-dosing-strip">
                <div>
                  <div style="font-size:0.7rem; color:var(--cdss-text-muted); text-transform:uppercase;">Liều Khởi Đầu</div>
                  <strong>${dob.standardDoseRange}</strong>
                </div>
                <div style="text-align:right;">
                  <div style="font-size:0.7rem; color:var(--cdss-text-muted); text-transform:uppercase;">Tốc Độ Bơm</div>
                  <strong style="color:var(--cdss-purple); font-size:1.05rem;">${dob.recommendedPumpRateMlH}</strong>
                </div>
              </div>
              <p class="cdss-vaso-warning">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <span>${dob.precautions}</span>
              </p>
            </div>

            <!-- 4. Adrenalin -->
            <div class="cdss-vaso-card">
              <div class="cdss-vaso-card-header">
                <div>
                  <div class="cdss-drug-name text-danger">4. Adrenalin</div>
                  <div class="cdss-drug-indication">Sốc kháng trị / Mạch rời rạc / Ngừng tuần hoàn</div>
                </div>
                <span class="cdss-brand-badge cdss-brand-badge--danger">Cấp cứu tối khẩn</span>
              </div>
              <div class="cdss-recipe-box">
                <div class="cdss-recipe-row">
                  <span class="cdss-recipe-key">Công thức pha:</span>
                  <span><strong>${adr.totalMg} mg</strong> Adrenalin (0.3 × ${adr.patientWeightKg} kg)</span>
                </div>
                <div class="cdss-recipe-row">
                  <span class="cdss-recipe-key">Dung môi:</span>
                  <span>Glucose 5% vừa đủ <strong>50 ml</strong></span>
                </div>
                <div class="cdss-recipe-row cdss-recipe-highlight text-danger">
                  <span>Quy đổi liều:</span>
                  <span>Tốc độ 1 ml/giờ = 0.1 µg/kg/phút</span>
                </div>
              </div>
              <div class="cdss-dosing-strip">
                <div>
                  <div style="font-size:0.7rem; color:var(--cdss-text-muted); text-transform:uppercase;">Liều Cứu Nguy</div>
                  <strong>${adr.standardDoseRange}</strong>
                </div>
                <div style="text-align:right;">
                  <div style="font-size:0.7rem; color:var(--cdss-text-muted); text-transform:uppercase;">Tốc Độ Bơm</div>
                  <strong style="color:var(--cdss-danger); font-size:1.05rem;">${adr.recommendedPumpRateMlH}</strong>
                </div>
              </div>
              <p class="cdss-vaso-warning">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <span>${adr.precautions}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Gắn sự kiện cho các nút chọn trục huyết động
    const hemoBtns = container.querySelectorAll('.cdss-segmented-btn[data-hemo-prop]');
    hemoBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const prop = target.getAttribute('data-hemo-prop') as keyof HemodynamicProfile;
        const val = target.getAttribute('data-hemo-val');
        if (prop && val !== null) {
          if (prop === 'isOverloaded') {
            this.currentHemodynamic.isOverloaded = val === 'true';
          } else {
            (this.currentHemodynamic as any)[prop] = val;
          }
          this.renderVasopressorsView(container, plan);
          this.showToast('Đã cập nhật lưu đồ huyết động học!');
        }
      });
    });

    // Gắn sự kiện cho bộ chọn thuốc trong bộ tính 2 chiều
    const calcDrugBtns = container.querySelectorAll('#calc-drug-selector button');
    calcDrugBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const drug = target.getAttribute('data-calc-drug');
        if (drug) {
          this.interactiveDrugName = drug;
          // Cài đặt lại liều mặc định phù hợp với từng thuốc
          if (drug.toLowerCase().includes('noradrenalin') || drug.toLowerCase().includes('adrenalin')) {
            this.interactiveDose = 0.1;
            this.interactivePumpRate = 1.0;
          } else {
            this.interactiveDose = 5.0;
            this.interactivePumpRate = 5.0;
          }
          this.renderVasopressorsView(container, plan);
        }
      });
    });

    // Gắn sự kiện 2 chiều cho input Liều & input Tốc độ bơm
    const inputDose = container.querySelector('#calc-input-dose') as HTMLInputElement | null;
    const inputRate = container.querySelector('#calc-input-rate') as HTMLInputElement | null;
    const sliderRate = container.querySelector('#calc-slider-rate') as HTMLInputElement | null;
    const sliderLabel = container.querySelector('#slider-rate-label');

    const syncFromDose = (dose: number) => {
      this.interactiveDose = dose;
      const rate = calculatePumpRateFromDose(this.interactiveDrugName, dose);
      this.interactivePumpRate = rate;
      if (inputRate) inputRate.value = rate.toString();
      if (sliderRate) sliderRate.value = rate.toString();
      if (sliderLabel) sliderLabel.textContent = `${rate} ml/giờ (${dose} µg/kg/p)`;
    };

    const syncFromRate = (rate: number) => {
      this.interactivePumpRate = rate;
      const dose = calculateDoseFromPumpRate(this.interactiveDrugName, rate);
      this.interactiveDose = dose;
      if (inputDose) inputDose.value = dose.toString();
      if (sliderRate) sliderRate.value = rate.toString();
      if (sliderLabel) sliderLabel.textContent = `${rate} ml/giờ (${dose} µg/kg/p)`;
    };

    if (inputDose) {
      inputDose.addEventListener('input', () => {
        const dose = parseFloat(inputDose.value) || 0;
        syncFromDose(dose);
      });
    }

    if (inputRate) {
      inputRate.addEventListener('input', () => {
        const rate = parseFloat(inputRate.value) || 0;
        syncFromRate(rate);
      });
    }

    if (sliderRate) {
      sliderRate.addEventListener('input', () => {
        const rate = parseFloat(sliderRate.value) || 0;
        syncFromRate(rate);
      });
    }
  }

  // VIEW 4: ĐIỀU DƯỠNG AN TOÀN & BẢNG KIỂM
  private renderNursingChecklistView(container: HTMLElement, plan: DengueCDSSPlan): void {
    container.innerHTML = `
      <div class="cdss-card" style="margin-top:0;">
        <div class="cdss-card-header">
          <h2 class="cdss-card-title">
            <i class="fa-solid fa-user-nurse text-success"></i> Quy Trình Điều Dưỡng An Toàn &amp; Bảng Kiểm Tại Giường
          </h2>
          <span class="cdss-brand-badge">HKKK Chuẩn BYT</span>
        </div>
        <div style="padding:1rem;">
          <ul class="cdss-nursing-list" style="margin:0;">
            ${plan.nursingInstructions.map(item => `
              <li class="cdss-nursing-item">
                <i class="fa-solid fa-circle-check"></i>
                <span>${item}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  private updateMobileStickyBar(plan: DengueCDSSPlan): void {
    const elWeight = document.getElementById('mbar-weight');
    const elSeverity = document.getElementById('mbar-severity-badge');
    const elVolume = document.getElementById('mbar-volume-sub');

    if (elWeight) {
      elWeight.textContent = `${plan.weightResult.adjustedWeightKg} kg`;
    }
    if (elSeverity) {
      const sevMap: Record<DengueSeverity, string> = {
        warning_signs: 'Dấu Hiệu Cảnh Báo',
        shock: 'Sốc SXHD',
        severe_shock: 'Sốc Nguy Kịch'
      };
      elSeverity.textContent = sevMap[plan.patient.severity];
    }
    if (elVolume) {
      elVolume.textContent = `Tổng: ${plan.totalVolumeMl.toLocaleString('vi-VN')} ml (${plan.totalDurationHours}h)`;
    }
  }

  private renderPrintSheet(plan: DengueCDSSPlan): void {
    const el = document.getElementById('cdss-print-sheet');
    if (!el) return;

    const {
      patient,
      weightResult,
      fluidRows,
      totalVolumeMl,
      totalDurationHours,
      vasopressorDopamin: d,
      vasopressorNoradrenalin: n,
      branchDecision
    } = plan;

    const now = new Date();
    const dateFormatted = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const severityText = patient.severity === 'warning_signs'
      ? 'Có Dấu Hiệu Cảnh Báo (DHCB)'
      : patient.severity === 'shock'
        ? 'Sốc SXHD (Còn Bù)'
        : 'Sốc SXHD Nguy Kịch (Mạch 0, HA 0)';

    const genderText = patient.gender === 'male' ? 'Nam' : 'Nữ';
    const mlPerKg = Math.round(totalVolumeMl / weightResult.adjustedWeightKg);
    const bottles500 = Math.ceil(totalVolumeMl / 500);

    // Xác định tên loại dịch truyền chỉ định
    const indicatedFluid = branchDecision.branchType === 'cpt'
      ? 'Cao Phân Tử: Dextran 40 hoặc 6% HES 200'
      : branchDecision.branchType === 'blood'
        ? 'Hồng Cầu Lắng (5-10 ml/kg) + Cao Phân Tử'
        : 'Ringer Lactate hoặc NaCl 0.9%';

    // Chỉ hiển thị khối vận mạch khi có chỉ định sốc trơ hoặc bác sĩ chủ động chọn in kèm
    const isVasopressorNeeded = this.includeVasopressorInPrint ||
      patient.clinicalResponse === 'refractory_shock_cvp' ||
      branchDecision.branchType === 'refractory_shock';

    el.innerHTML = `
      <div class="cdss-print-page">
        <!-- HEADER CƠ QUAN & TIÊU ĐỀ PHIẾU IN -->
        <div class="cdss-print-meta-top">
          <div class="cdss-print-left-org">
            <div style="font-weight:700; text-transform:uppercase;">KHOA CẤP CỨU / HỒI SỨC</div>
            <div>Phòng/Giường: ................ | BA số: ................</div>
          </div>
          <div class="cdss-print-right-org">
            <div style="font-weight:600;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
            <div style="font-style:italic; font-size:0.85em;">Độc lập - Tự do - Hạnh phúc</div>
            <div style="font-size:0.85em; margin-top:2px;">Thời điểm lập phiếu: <strong>${dateFormatted}</strong></div>
          </div>
        </div>

        <div class="cdss-print-title-area">
          <h1 class="cdss-print-main-title">PHIẾU THEO DÕI TRUYỀN DỊCH SXHD DENGUE</h1>
          <div class="cdss-print-sub-title">(Theo Hướng dẫn Chẩn đoán &amp; Điều trị SXHD — Quyết định 2760/QĐ-BYT 2023)</div>
        </div>

        <!-- THÔNG TIN BỆNH NHÂN TINH GỌN CHUẨN LÂM SÀNG -->
        <div class="cdss-print-patient-box">
          <div class="cdss-print-row">
            <span>Họ và tên người bệnh: <strong>...........................................................................</strong></span>
            <span>Tuổi: <strong>${patient.ageYears} tuổi</strong></span>
            <span>Giới tính: <strong>${genderText}</strong></span>
            <span class="cdss-print-weight-highlight">
              CÂN TÍNH DỊCH (CDSS): <strong>${weightResult.adjustedWeightKg} kg</strong>
              ${weightResult.isObese ? (patient.ageYears >= 16 ? '<em style="font-size:0.8em; color:#b91c1c;">(BÉO PHÌ - PHỤ LỤC 9 BYT)</em>' : '<em style="font-size:0.8em; color:#b91c1c;">(BÉO PHÌ - HIỆU CHỈNH CDC)</em>') : `<span style="font-size:0.82em; color:#555;">(Thực tế: ${weightResult.actualWeightKg}kg)</span>`}
            </span>
          </div>

          <div class="cdss-print-row" style="margin-top: 5px;">
            <span>Chẩn đoán: <strong style="text-transform:uppercase;">${severityText}</strong></span>
            <span>Dịch chỉ định: <strong style="color:#0369a1;">${indicatedFluid}</strong></span>
          </div>

          ${branchDecision.branchType !== 'standard' ? `
            <div style="margin-top: 5px; padding: 3px 8px; border: 1px dashed #c2410c; background: #fff7ed; font-size: 8.5pt;">
              <strong style="color:#c2410c;">[!] Hướng xử trí:</strong> ${branchDecision.recommendedFluid} (${branchDecision.title})
            </div>
          ` : ''}
        </div>

        <!-- BẢNG ĐIỀU PHỐI CỌC DỊCH CHUẨN ĐIỀU DƯỠNG (TẬP TRUNG - RÕ RÀNG) -->
        <table class="cdss-print-table">
          <thead>
            <tr>
              <th style="width: 17%;">CỮ TRUYỀN &amp; GIỜ</th>
              <th style="width: 25%;">TỐC ĐỘ &amp; LƯỢNG DỊCH</th>
              <th style="width: 24%;">CHUẨN BỊ TẠI CỌC</th>
              <th style="width: 22%;">THEO DÕI &amp; HCT</th>
              <th style="width: 12%;">ĐD KÝ</th>
            </tr>
          </thead>
          <tbody>
            ${fluidRows.map(r => {
              // Rút gọn stageName (loại bỏ tiền tố lặp 'Cữ X:')
              const stageShort = r.stageName.replace(/^Cữ\s*\d+\s*:\s*/i, '').trim();

              // Rút gọn monitoring notes: bỏ câu dông dài lý thuyết
              let monitorShort = r.monitoringNotes
                .replace(/Bù dịch tinh thể đẳng trương\.?\s*/gi, '')
                .replace(/Bù dịch cao phân tử đẳng trương\.?\s*/gi, '')
                .replace(/Đo Hct ngay kết thúc/gi, 'Đo Hct sau')
                .trim();
              if (!monitorShort) {
                monitorShort = 'Theo dõi M, HA, NT, lượng nước tiểu';
              }

              return `
              <tr>
                <td style="text-align: center;">
                  <div style="font-weight: 800; font-size: 1.05em;">Cữ ${r.stepIndex} <span style="font-size:0.85em; font-weight:600;">(${r.durationHours}h)</span></div>
                  <div style="font-weight: 700; margin: 2px 0; font-size: 0.95em;">${r.timeWindow}</div>
                  <div style="font-size: 0.8em; color: #444;">${stageShort}</div>
                </td>
                <td>
                  <div>Tốc độ: <strong style="font-size: 1.15em;">${r.rateMlKgH} ml/kg/h</strong></div>
                  <div style="font-size: 0.9em; margin-top: 1px;">Số giọt: <strong>${r.dropsPerMin} giọt/phút</strong></div>
                  <div style="font-size: 0.88em; margin-top: 1px;">Lượng dịch: <strong>${r.totalMl.toLocaleString('vi-VN')} ml</strong></div>
                </td>
                <td>
                  <div style="font-weight: 700; font-size: 0.95em;">
                    ${r.bottlesToHang > 0 ? `Treo thêm: +${r.bottlesToHang} chai (500ml)` : 'Dùng dịch sẵn có'}
                  </div>
                  <div style="font-size: 0.85em; margin-top: 2px;">
                    Tổng tại cọc: <strong>${r.totalAtPoleMl.toLocaleString('vi-VN')} ml</strong>
                  </div>
                  ${r.existingFluidMl > 0 ? `
                    <div style="font-size: 0.76em; color: #555;">(Dư cữ trước: ${r.existingFluidMl} ml)</div>
                  ` : ''}
                </td>
                <td>
                  ${r.hctCheckRequired ? `
                    <div style="font-weight: 800; color: #b91c1c; font-size: 0.86em; margin-bottom: 2px;">
                      [!] ĐO LẠI HCT (${r.durationHours}h)
                    </div>
                  ` : ''}
                  <div style="font-size: 0.82em; line-height: 1.3;">${monitorShort}</div>
                </td>
                <td style="text-align: center; vertical-align: middle;">
                  <div style="font-size: 0.78em; color: #555;">Giờ: ...h...</div>
                  <div style="font-size: 0.78em; margin-top: 14px;">Ký: .........</div>
                </td>
              </tr>
            `}).join('')}
          </tbody>
        </table>

        <!-- TỔNG KẾT DỊCH TRUYỀN DỰ KIẾN -->
        <div class="cdss-print-summary-strip">
          <span>Tổng dịch bù: <strong>${totalVolumeMl.toLocaleString('vi-VN')} ml</strong> (~<strong>${mlPerKg} ml/kg</strong>)</span>
          <span>Thời gian dự kiến: <strong>${totalDurationHours} giờ</strong> (${fluidRows.length} cữ)</span>
          <span>Ước tính: <strong>${bottles500} chai 500ml</strong> (${branchDecision.branchType === 'cpt' ? 'Cao Phân Tử' : 'Ringer Lactate / NaCl 0.9%'})</span>
        </div>

        <!-- PHÁC ĐỒ VẬN MẠCH BƠM TIÊM ĐIỆN (CHỈ HIỂN THỊ KHI CÓ CHỈ ĐỊNH HOẶC CHỌN IN KÈM) -->
        ${isVasopressorNeeded ? `
          <div class="cdss-print-vaso-box">
            <div style="font-weight: bold; text-transform: uppercase; font-size: 0.85em; margin-bottom: 2px; border-bottom: 1px dotted #666; padding-bottom: 2px;">
              PHÁC ĐỒ THUỐC VẬN MẠCH BƠM TIÊM ĐIỆN 50ML (ÁP DỤNG KHI TÁI SỐC HOẶC SỐC TRƠ DỊCH TRUYỀN)
            </div>
            <div style="font-size: 8.5pt; line-height: 1.35; margin-top: 3px;">
              ${plan.ageGroup === 'child' ? `
                <div><strong>• Dopamin (Lựa chọn đầu tay ở trẻ em):</strong> Pha <strong>${d.totalMg} mg</strong> (3 × ${d.patientWeightKg}kg) vừa đủ 50ml Glucose 5%. Tốc độ bơm: <strong>${d.recommendedPumpRateMlH}</strong> (Liều khuyến cáo: ${d.standardDoseRange}; Quy đổi: 1 ml/h = 1 µg/kg/phút).</div>
              ` : `
                <div><strong>• Noradrenalin (Sốc giãn mạch / người lớn):</strong> Pha <strong>${n.totalMg} mg</strong> (0.3 × ${n.patientWeightKg}kg) vừa đủ 50ml Glucose 5%. Tốc độ bơm: <strong>${n.recommendedPumpRateMlH}</strong> (Liều khuyến cáo: ${n.standardDoseRange}; Quy đổi: 1 ml/h = 0.1 µg/kg/phút).</div>
              `}
              <div style="font-size: 8pt; color: #444; margin-top: 2px;">
                <em>* Chỉ dùng khi CVP &gt; 10 cmH2O hoặc sốc thất bại bù dịch. Giám sát HA mỗi 15-30 phút.</em>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- LƯU Ý ĐIỀU DƯỠNG AN TOÀN -->
        <div class="cdss-print-safety-notes">
          <strong>Lưu ý điều dưỡng an toàn:</strong>
          (1) Luôn đo lại Hct tại giường trước khi quyết định giảm bậc dịch theo y lệnh.
          (2) Đích nước tiểu &ge; 0.5 - 1 ml/kg/giờ. Báo Bác sĩ ngay nếu có dấu hiệu phù mi mắt, thở nhanh khó thở, ran ẩm đáy phổi hoặc tái sốc.
          (3) Ngưng truyền dịch khi mạch, huyết áp ổn định, thoát sốc sau 24-48 giờ giai đoạn hồi phục.
        </div>

        <!-- CHỮ KÝ XÁC NHẬN Y LỆNH -->
        <div class="cdss-print-signatures">
          <div class="cdss-print-sign-col">
            <div style="font-weight: bold;">ĐIỀU DƯỠNG THEO DÕI</div>
            <div style="font-style: italic; font-size: 0.85em;">(Ký và ghi rõ họ tên)</div>
            <div style="margin-top: 36px; font-weight: bold;">............................................................</div>
          </div>
          <div class="cdss-print-sign-col">
            <div style="font-weight: bold;">BÁC SĨ CHỈ ĐỊNH Y LỆNH</div>
            <div style="font-style: italic; font-size: 0.85em;">(Ký và ghi rõ họ tên)</div>
            <div style="margin-top: 36px; font-weight: bold;">............................................................</div>
          </div>
        </div>
      </div>
    `;
  }

  private copyHandoverReport(): void {
    if (!this.currentPlan) return;
    const p = this.currentPlan;
    const text = [
      `📋 BÁO CÁO GIAO BAN DỊCH TRUYỀN SXHD DENGUE (QĐ 2760/QĐ-BYT)`,
      `• Bệnh nhân: ${p.patient.ageYears} tuổi (${p.patient.gender === 'male' ? 'Nam' : 'Nữ'}) | Nặng thực tế: ${p.weightResult.actualWeightKg} kg`,
      p.patient.ageYears >= 16
        ? `• Cân tính dịch Phụ lục 9 BYT (AdjBW): ${p.weightResult.adjustedWeightKg} kg ${p.weightResult.isObese ? '(ĐÃ HIỆU CHỈNH NGƯỜI LỚN BÉO PHÌ)' : ''}`
        : `• Cân tính dịch CDC 2014: ${p.weightResult.adjustedWeightKg} kg ${p.weightResult.isObese ? '(ĐÃ HIỆU CHỈNH TRẺ THỪA CÂN)' : ''}`,
      `• Phân độ: ${p.patient.severity === 'warning_signs' ? 'Dấu hiệu cảnh báo' : p.patient.severity === 'shock' ? 'Sốc SXHD' : 'Sốc nguy kịch'}`,
      `• Đánh giá đáp ứng: ${p.branchDecision.title}`,
      `• Hướng xử trí: ${p.branchDecision.recommendedFluid}`,
      `• Kế hoạch cọc dịch:`,
      ...p.fluidRows.map(r => `  - Cữ ${r.stepIndex} (${r.timeWindow}): ${r.rateMlKgH} ml/kg/h (${r.dropsPerMin} giọt/phút) | Cần ${r.totalMl} ml | Treo thêm: ${r.bottlesToHang} chai | Tại cọc: ${r.totalAtPoleMl} ml`),
      `• Tổng dịch: ${p.totalVolumeMl} ml trong ${p.totalDurationHours} giờ.`,
      `• Điều dưỡng lưu ý: Theo dõi nước tiểu mỗi giờ (đích ≥ 0.5-1 ml/kg/h), đo lại Hct trước khi giảm cữ dịch.`
    ].join('\n');

    navigator.clipboard.writeText(text).then(() => {
      this.showToast('Đã sao chép bảng bàn giao cọc dịch vào bộ nhớ tạm!');
    });
  }

  private copySoapPlan(): void {
    if (!this.currentPlan) return;
    navigator.clipboard.writeText(this.currentPlan.soapExportText).then(() => {
      this.showToast('Đã sao chép Kế hoạch SOAP Plan (Bệnh Án / DocSpace)!');
    });
  }

  private showToast(msg: string): void {
    const toast = document.getElementById('cdss-toast');
    const toastText = document.getElementById('cdss-toast-text');
    if (!toast || !toastText) return;

    toastText.textContent = msg;
    toast.classList.add('visible');

    setTimeout(() => {
      toast.classList.remove('visible');
    }, 3200);
  }
}

// Global window registration for fallback environments
if (typeof window !== 'undefined') {
  (window as any).DengueCDSSController = DengueCDSSController;
}
