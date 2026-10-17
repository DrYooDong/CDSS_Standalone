/**
 * CliniPortal CDSS — ECG UI Controller & Waveform Component Precision Inspector
 * Path: src/content/knowledge-vault/cdss/ecg/ecg-ui.ts
 */

import { EcgCase, LeadName, WaveType, AnnotationValidationReport } from './ecg-types';
import { ECG_CASES } from './ecg-cases';
import { EcgCanvasRenderer, EcgCanvasOptions } from './ecg-canvas-renderer';
import {
  calculateCasePoincareHrv,
  generateBeatMorphologyProfile,
  PoincareHrvAnalysis,
  BeatMorphologyPoint
} from './ecg-math';

const ALL_12_LEADS: LeadName[] = [
  'I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'
];

export class EcgCDSSController {
  private container: HTMLElement;
  private currentCase: EcgCase;
  private renderer: EcgCanvasRenderer | null = null;
  private currentTab: 'components' | 'advanced-graphics' | 'caliper-annotation' = 'components';
  private selectedInspectorLead: LeadName = 'II';

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Container #${containerId} not found`);
    this.container = el;
    this.currentCase = ECG_CASES[0];
    this.init();
  }

  private init(): void {
    this.renderLayout();
    this.initCanvasRenderer();
    this.attachEventListeners();
    this.updateTelemetryStrip();
    this.updateContentPanel();
  }

  private renderLayout(): void {
    this.container.innerHTML = `
      <div class="ecg-cdss-app">
        <!-- Top Toolbar Card -->
        <header class="ecg-top-card">
          <div class="ecg-header-main">
            <div class="ecg-badge-group">
              <span class="ecg-badge ecg-badge--cardio"><i class="fa-solid fa-heart-pulse"></i> Đồ Họa & Độ Chính Xác Thành Phần Sóng ECG 12 Chuyển Đạo</span>
              <span class="ecg-badge ecg-badge--live" id="live-indicator"><i class="fa-solid fa-circle"></i> Sẵn sàng</span>
              <span class="ecg-badge ecg-badge--secondary" id="grid-spec-badge">Lưới Y Học 25mm/s • 10mm/mV • Xung 1mV</span>
            </div>
            <h1 class="ecg-app-title">
              Hệ Thống Đồ Họa & Phân Tích Độ Chính Xác Thành Phần Điện Tâm Đồ (ECG Precision Inspector)
            </h1>
          </div>

          <!-- Case Selector -->
          <div class="ecg-case-selector-wrap">
            <label for="ecg-case-select"><i class="fa-solid fa-folder-open"></i> Thư Viện Ca Điện Tâm Đồ:</label>
            <select id="ecg-case-select" class="ecg-select">
              ${ECG_CASES.map(c => `
                <option value="${c.id}" ${c.id === this.currentCase.id ? 'selected' : ''}>
                  [${c.category}] ${c.title}
                </option>
              `).join('')}
            </select>
          </div>
        </header>

        <!-- Telemetry & Waveform Metrics Ribbon -->
        <section class="ecg-telemetry-strip" id="ecg-telemetry-strip">
          <!-- Dynamic Telemetry items -->
        </section>

        <!-- Canvas Toolbar (Speed, Gain, Theme, Markers, Caliper, Live, Audio) -->
        <div class="ecg-canvas-toolbar">
          <div class="ecg-tool-group">
            <button id="btn-toggle-live" class="ecg-tool-btn" title="Mô phỏng quét máy monitor thời gian thực">
              <i class="fa-solid fa-play"></i> <span>Mô Phỏng Monitor</span>
            </button>
            <button id="btn-toggle-audio" class="ecg-tool-btn" title="Bật/Tắt âm thanh nhịp tim QRS">
              <i class="fa-solid fa-volume-xmark"></i> <span>Âm Nhịp QRS</span>
            </button>
            <button id="btn-toggle-markers" class="ecg-tool-btn" title="Bật/Tắt hiển thị mốc sóng P-Q-R-S-J-T-U trên đồ họa">
              <i class="fa-solid fa-tags"></i> <span>Mốc Sóng (P-Q-R-S-J-T)</span>
            </button>
            <button id="btn-toggle-caliper" class="ecg-tool-btn" title="Bật thước đo Caliper điện tử trực tiếp trên đồ họa">
              <i class="fa-solid fa-ruler-combined"></i> <span>Thước Caliper</span>
            </button>
          </div>

          <div class="ecg-tool-group">
            <span class="ecg-tool-label">Bố cục:</span>
            <select id="select-layout" class="ecg-select-sm">
              <option value="3x4" selected>Tiêu chuẩn 3x4 + DII kéo dài</option>
              <option value="6x2">6 Chi / 6 Trước tim (6x2)</option>
              <option value="12x1">Dọc 12 đạo trình</option>
              <option value="single">Phóng đại 1 đạo trình</option>
            </select>
          </div>

          <div class="ecg-tool-group">
            <span class="ecg-tool-label">Tốc độ giấy:</span>
            <select id="select-speed" class="ecg-select-sm">
              <option value="25" selected>25 mm/s (Chuẩn lâm sàng)</option>
              <option value="50">50 mm/s (Phóng đại chi tiết)</option>
            </select>
          </div>

          <div class="ecg-tool-group">
            <span class="ecg-tool-label">Biên độ:</span>
            <select id="select-gain" class="ecg-select-sm">
              <option value="0.5">0.5x (5mm/mV)</option>
              <option value="1.0" selected>1.0x (10mm/mV chuẩn)</option>
              <option value="2.0">2.0x (20mm/mV)</option>
            </select>
          </div>

          <div class="ecg-tool-group">
            <span class="ecg-tool-label">Giao diện:</span>
            <select id="select-theme" class="ecg-select-sm">
              <option value="paper" selected>Giấy Hồng ECG Lâm Sàng</option>
              <option value="monitor">Monitor Hồi Sức (Xanh Neon)</option>
              <option value="amber">Monitor CRT Hổ Phách</option>
            </select>
          </div>
        </div>

        <!-- Annotation Tools Strip (Active when manually labeling) -->
        <div class="ecg-annotation-toolbar" id="ecg-annotation-toolbar">
          <span class="ecg-ann-label"><i class="fa-solid fa-crosshairs"></i> Chấm Điểm Thẩm Định Mốc Sóng:</span>
          <div class="ecg-ann-btn-group">
            <button class="ecg-ann-btn" data-wave="P">Sóng P</button>
            <button class="ecg-ann-btn" data-wave="Q">Sóng Q</button>
            <button class="ecg-ann-btn" data-wave="R">Đỉnh R</button>
            <button class="ecg-ann-btn" data-wave="S">Sóng S</button>
            <button class="ecg-ann-btn" data-wave="J">Điểm J</button>
            <button class="ecg-ann-btn" data-wave="T">Sóng T</button>
            <button class="ecg-ann-btn" data-wave="U">Sóng U</button>
            <button id="btn-clear-ann" class="ecg-ann-btn ecg-ann-btn--clear" title="Xóa toàn bộ nhãn đã chấm">
              <i class="fa-solid fa-trash-can"></i> Xóa Mốc
            </button>
          </div>
        </div>

        <!-- Main Canvas Mount Point -->
        <div class="ecg-canvas-wrapper" id="ecg-canvas-mount-point">
          <!-- Canvas injected here -->
        </div>

        <!-- ECG Waveform Components & Precision Measurement Subsystem -->
        <section class="ecg-diagnostic-section">
          <!-- Navigation Tabs -->
          <div class="ecg-diag-tabs">
            <button class="ecg-tab-btn active" data-tab="components">
              <i class="fa-solid fa-wave-square"></i> Bảng Đo Lường & Độ Chính Xác Thành Phần Sóng (ECG Components Inspector)
            </button>
            <button class="ecg-tab-btn" data-tab="advanced-graphics">
              <i class="fa-solid fa-chart-line text-teal-600"></i> Đồ Họa Nâng Cao & Động Học Poincaré (WFDB / MIT-BIH)
            </button>
            <button class="ecg-tab-btn" data-tab="caliper-annotation">
              <i class="fa-solid fa-ruler-combined"></i> Thước Đo Caliper & Chấm Mốc Sóng
            </button>
          </div>

          <!-- Tab Content Container -->
          <div class="ecg-tab-content" id="ecg-tab-content">
            <!-- Dynamic Tab Content -->
          </div>
        </section>

        <!-- Toast -->
        <div id="ecg-toast" class="ecg-toast" style="display:none;"></div>
      </div>
    `;
  }

  private initCanvasRenderer(): void {
    const isDarkGlobal = document.documentElement.getAttribute('data-theme') === 'dark';
    const initialCanvasTheme = isDarkGlobal ? 'monitor' : 'paper';

    this.renderer = new EcgCanvasRenderer('ecg-canvas-mount-point', this.currentCase, {
      theme: initialCanvasTheme,
      layoutMode: '3x4',
      paperSpeed: 25,
      voltageGain: 1.0,
      isLiveMode: false,
      isAudioMuted: true,
      showWaveMarkers: true
    });

    const selectTheme = document.getElementById('select-theme') as HTMLSelectElement | null;
    if (selectTheme) {
      selectTheme.value = initialCanvasTheme;
    }

    // Sync button state for markers
    const btnMarkers = document.getElementById('btn-toggle-markers');
    if (btnMarkers) {
      btnMarkers.classList.add('active');
    }

    window.addEventListener('ecg-annotation-update', (e: any) => {
      const report = e.detail?.report as AnnotationValidationReport | null;
      if (report && this.currentTab === 'caliper-annotation') {
        this.renderAnnotationTab(report);
      }
    });
  }

  private attachEventListeners(): void {
    // Case Selector
    const caseSelect = document.getElementById('ecg-case-select') as HTMLSelectElement | null;
    if (caseSelect) {
      caseSelect.addEventListener('change', () => {
        const found = ECG_CASES.find(c => c.id === caseSelect.value);
        if (found) {
          this.currentCase = found;
          this.renderer?.setCase(found);
          this.updateTelemetryStrip();
          this.updateContentPanel();
          this.showToast(`Đã tải điện tâm đồ: ${found.title}`);
        }
      });
    }

    // Live Mode Toggle
    const btnLive = document.getElementById('btn-toggle-live');
    if (btnLive) {
      btnLive.addEventListener('click', () => {
        if (!this.renderer) return;
        const isLive = this.renderer.toggleLive();
        btnLive.classList.toggle('active', isLive);
        btnLive.innerHTML = isLive
          ? `<i class="fa-solid fa-pause"></i> <span>Tạm Dừng</span>`
          : `<i class="fa-solid fa-play"></i> <span>Mô Phỏng Monitor</span>`;

        const ind = document.getElementById('live-indicator');
        if (ind) {
          ind.className = `ecg-badge ${isLive ? 'ecg-badge--danger' : 'ecg-badge--live'}`;
          ind.innerHTML = isLive
            ? `<i class="fa-solid fa-heartbeat fa-beat"></i> ĐANG QUÉT MONITOR`
            : `<i class="fa-solid fa-circle"></i> Sẵn sàng`;
        }
      });
    }

    // Audio Mute Toggle
    const btnAudio = document.getElementById('btn-toggle-audio');
    if (btnAudio) {
      btnAudio.addEventListener('click', () => {
        if (!this.renderer) return;
        const isMuted = this.renderer.toggleMute();
        btnAudio.classList.toggle('active', !isMuted);
        btnAudio.innerHTML = !isMuted
          ? `<i class="fa-solid fa-volume-high"></i> <span>Âm Thanh: Bật</span>`
          : `<i class="fa-solid fa-volume-xmark"></i> <span>Âm Nhịp QRS</span>`;
      });
    }

    // Wave Markers Toggle
    const btnMarkers = document.getElementById('btn-toggle-markers');
    if (btnMarkers) {
      btnMarkers.addEventListener('click', () => {
        if (!this.renderer) return;
        const isShown = this.renderer.toggleWaveMarkers();
        btnMarkers.classList.toggle('active', isShown);
        this.showToast(isShown ? 'Đã bật hiển thị mốc sóng P-Q-R-S-J-T-U' : 'Đã ẩn mốc sóng');
      });
    }

    // Caliper Toggle
    const btnCaliper = document.getElementById('btn-toggle-caliper');
    if (btnCaliper) {
      btnCaliper.addEventListener('click', () => {
        if (!this.renderer) return;
        const isActive = this.renderer.toggleCaliper();
        btnCaliper.classList.toggle('active', isActive);
        if (isActive) {
          this.showToast('Thước Caliper BẬT: Nhấp và kéo chuột trên đồ họa để đo');
        }
      });
    }

    // Layout Selector
    const selectLayout = document.getElementById('select-layout') as HTMLSelectElement | null;
    if (selectLayout) {
      selectLayout.addEventListener('change', () => {
        this.renderer?.setOptions({ layoutMode: selectLayout.value as any });
      });
    }

    // Speed Selector (25 vs 50 mm/s)
    const selectSpeed = document.getElementById('select-speed') as HTMLSelectElement | null;
    if (selectSpeed) {
      selectSpeed.addEventListener('change', () => {
        const speed = parseFloat(selectSpeed.value) || 25;
        this.renderer?.setOptions({ paperSpeed: speed });
        this.showToast(`Tốc độ kéo giấy: ${speed} mm/s`);
      });
    }

    // Gain Selector
    const selectGain = document.getElementById('select-gain') as HTMLSelectElement | null;
    if (selectGain) {
      selectGain.addEventListener('change', () => {
        const gain = parseFloat(selectGain.value) || 1.0;
        this.renderer?.setOptions({ voltageGain: gain });
      });
    }

    // Theme Selector
    const selectTheme = document.getElementById('select-theme') as HTMLSelectElement | null;
    if (selectTheme) {
      selectTheme.addEventListener('change', () => {
        this.renderer?.setOptions({ theme: selectTheme.value as any });
      });
    }

    // Synchronize ECG canvas with portal global theme toggle
    window.addEventListener('cliniportal-theme-change', (e: any) => {
      const isDark = e.detail?.theme === 'dark';
      const targetTheme = isDark ? 'monitor' : 'paper';
      const selectThemeEl = document.getElementById('select-theme') as HTMLSelectElement | null;
      if (selectThemeEl) {
        selectThemeEl.value = targetTheme;
      }
      this.renderer?.setOptions({ theme: targetTheme });
    });

    // Manual Wave Annotation Buttons
    const annBtns = document.querySelectorAll('.ecg-ann-btn[data-wave]');
    annBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const wave = btn.getAttribute('data-wave') as WaveType;
        const isAlreadyActive = btn.classList.contains('active');

        annBtns.forEach(b => b.classList.remove('active'));
        if (!isAlreadyActive) {
          btn.classList.add('active');
          this.renderer?.setAnnotationMode(wave);
          this.showToast(`Chế độ chấm mốc: ${wave}. Nhấp chuột lên đồ họa ECG.`);
        } else {
          this.renderer?.setAnnotationMode(null);
        }
      });
    });

    const btnClearAnn = document.getElementById('btn-clear-ann');
    if (btnClearAnn) {
      btnClearAnn.addEventListener('click', () => {
        this.renderer?.clearAnnotations();
        annBtns.forEach(b => b.classList.remove('active'));
        this.showToast('Đã xóa toàn bộ nhãn mốc sóng.');
        if (this.currentTab === 'caliper-annotation') {
          this.renderAnnotationTab(null);
        }
      });
    }

    // Diagnostic Tabs
    const tabBtns = document.querySelectorAll('.ecg-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTab = btn.getAttribute('data-tab') as any;
        this.updateContentPanel();
      });
    });
  }

  private updateTelemetryStrip(): void {
    const strip = document.getElementById('ecg-telemetry-strip');
    if (!strip) return;

    const m = this.currentCase.metrics;
    const rrMs = Math.round(60000 / Math.max(30, m.heartRate));

    strip.innerHTML = `
      <div class="ecg-telem-item">
        <span class="ecg-telem-label"><i class="fa-solid fa-heart-pulse text-danger"></i> Tần Số Tim (HR)</span>
        <span class="ecg-telem-val ${m.heartRate > 100 || m.heartRate < 60 ? 'text-danger' : ''}">${m.heartRate} bpm <small style="font-weight:normal; color:#64748b;">(RR: ${rrMs}ms)</small></span>
      </div>

      <div class="ecg-telem-item">
        <span class="ecg-telem-label"><i class="fa-solid fa-wave-square text-primary"></i> Nhịp & Tính Chất</span>
        <span class="ecg-telem-val" title="${m.rhythmType}">${m.rhythmType}</span>
      </div>

      <div class="ecg-telem-item">
        <span class="ecg-telem-label"><i class="fa-solid fa-compass text-teal-600"></i> Trục QRS (Góc α)</span>
        <span class="ecg-telem-val">${m.axis} (${m.alphaAngle}°)</span>
      </div>

      <div class="ecg-telem-item">
        <span class="ecg-telem-label"><i class="fa-solid fa-arrows-left-right text-indigo-600"></i> Khoảng PR</span>
        <span class="ecg-telem-val ${m.prInterval > 200 || m.prInterval < 120 ? 'text-danger' : ''}">${m.prInterval} ms <small style="font-weight:normal; color:#64748b;">(120-200ms)</small></span>
      </div>

      <div class="ecg-telem-item">
        <span class="ecg-telem-label"><i class="fa-solid fa-gauge-high text-amber-600"></i> Thời Gian QRS</span>
        <span class="ecg-telem-val ${m.qrsDuration >= 120 ? 'text-danger' : ''}">${m.qrsDuration} ms <small style="font-weight:normal; color:#64748b;">(&lt;120ms)</small></span>
      </div>

      <div class="ecg-telem-item">
        <span class="ecg-telem-label"><i class="fa-solid fa-stopwatch text-purple-600"></i> QT / QTc (Bazett)</span>
        <span class="ecg-telem-val ${m.qtc > 450 ? 'text-danger' : ''}">${m.qt} / ${m.qtc} ms</span>
      </div>

      <div class="ecg-telem-item">
        <span class="ecg-telem-label"><i class="fa-solid fa-bolt text-warning"></i> Sokolow-Lyon / Cornell</span>
        <span class="ecg-telem-val">${m.sokolowLyon !== undefined ? `${m.sokolowLyon} mm` : '—'} / ${m.cornellCriteria !== undefined ? `${m.cornellCriteria} mm` : '—'}</span>
      </div>
    `;
  }

  private updateContentPanel(): void {
    const wrap = document.getElementById('ecg-tab-content');
    if (!wrap) return;

    if (this.currentTab === 'components') {
      this.renderComponentsTab(wrap);
    } else if (this.currentTab === 'advanced-graphics') {
      this.renderAdvancedGraphicsTab(wrap);
    } else {
      this.renderAnnotationTab(this.renderer?.lastValidationReport || null);
    }
  }

  /**
   * Dedicated ECG Wave Components Precision Inspector
   */
  private renderComponentsTab(wrap: HTMLElement): void {
    const c = this.currentCase;
    const m = c.metrics;
    const lead = this.selectedInspectorLead;
    const leadData = c.leadsData[lead] || c.leadsData['II'];

    // Calculations for accuracy status
    const pDurMs = Math.round((leadData.pWave.dur || 0.08) * 1000);
    const pAmpMv = leadData.pWave.amp || 0.15;
    const pAmpMm = (pAmpMv * 10).toFixed(1);
    const isPNormal = pDurMs < 120 && pAmpMv < 0.25 && pAmpMv > -0.05;

    const prDurMs = m.prInterval;
    const prElevMv = leadData.prSegment.elevation || 0;
    const isPrNormal = prDurMs >= 120 && prDurMs <= 200 && Math.abs(prElevMv) < 0.05;

    const qDurMs = Math.round((leadData.qWave.dur || 0.02) * 1000);
    const qAmpMv = Math.abs(leadData.qWave.amp || 0);
    const rAmpMv = leadData.rWave.amp || 1.0;
    const isQPathological = qDurMs >= 40 || (rAmpMv > 0 && qAmpMv / rAmpMv >= 0.25);

    const sAmpMv = Math.abs(leadData.sWave.amp || 0);
    const rsRatio = sAmpMv > 0 ? (rAmpMv / sAmpMv).toFixed(2) : '∞';

    const isQrsWide = m.qrsDuration >= 120;
    const stElevMv = leadData.stSegment.elevation || 0;
    const stElevMm = (stElevMv * 10).toFixed(1);
    const isStElevated = stElevMv >= 0.10;
    const isStDepressed = stElevMv <= -0.05;

    const tAmpMv = leadData.tWave.amp || 0.3;
    const tDurMs = Math.round((leadData.tWave.dur || 0.16) * 1000);
    const tShape = leadData.tWave.shape || 'bất đối xứng sinh lý';

    const uAmpMv = leadData.uWave ? leadData.uWave.amp : 0;
    const hasUWave = uAmpMv !== 0;

    wrap.innerHTML = `
      <!-- Lead Quick Selector Pills -->
      <div class="ecg-lead-pills-container">
        <span class="ecg-lead-pills-label"><i class="fa-solid fa-filter"></i> Khảo sát chi tiết đạo trình:</span>
        ${ALL_12_LEADS.map(l => `
          <button class="ecg-lead-pill ${l === lead ? 'active' : ''}" data-lead="${l}">
            ${l}
          </button>
        `).join('')}
      </div>

      <!-- 9 ECG Waveform Component Precision Cards Grid -->
      <div class="ecg-comp-grid">
        <!-- 1. Sóng P -->
        <div class="ecg-comp-card">
          <div class="ecg-comp-card-header">
            <h4 class="ecg-comp-card-title">
              <i class="fa-solid fa-circle-dot text-primary"></i> 1. Sóng P (Khử Cực Nhĩ)
            </h4>
            <span class="ecg-comp-badge ${isPNormal ? 'ecg-comp-badge--normal' : 'ecg-comp-badge--warning'}">
              ${isPNormal ? 'Đạt chuẩn sinh lý' : 'Bất thường / Biến đổi'}
            </span>
          </div>
          <table class="ecg-comp-table">
            <tr>
              <td class="ecg-comp-table-lbl">Biên độ (Amplitude):</td>
              <td class="ecg-comp-table-val">${pAmpMv.toFixed(2)} mV (${pAmpMm} mm)</td>
            </tr>
            <tr>
              <td class="ecg-comp-table-lbl">Thời gian (Duration):</td>
              <td class="ecg-comp-table-val">${pDurMs} ms</td>
            </tr>
            <tr>
              <td class="ecg-comp-table-lbl">Hình thái / Cực tính:</td>
              <td class="ecg-comp-table-val">${pAmpMv >= 0 ? 'Dương đồng dạng' : 'Âm / Hai pha'}</td>
            </tr>
          </table>
          <div class="ecg-comp-ref-box">
            <strong>Giới hạn sinh lý bình thường:</strong> Thời gian &lt; 120 ms (3 ô nhỏ), Biên độ &lt; 0.25 mV (2.5 mm). Cao nhọn &ge; 2.5mm: Dày nhĩ phải (P phế); Hai đỉnh rộng &ge; 120ms: Dày nhĩ trái (P nhĩ).
          </div>
        </div>

        <!-- 2. Khoảng PR & Đoạn PR -->
        <div class="ecg-comp-card">
          <div class="ecg-comp-card-header">
            <h4 class="ecg-comp-card-title">
              <i class="fa-solid fa-left-right text-indigo-600"></i> 2. Khoảng PR &amp; Đoạn PR
            </h4>
            <span class="ecg-comp-badge ${isPrNormal ? 'ecg-comp-badge--normal' : 'ecg-comp-badge--danger'}">
              ${isPrNormal ? 'Đẳng điện chuẩn' : (prDurMs > 200 ? 'PR kéo dài (Bloc AV I)' : (prDurMs < 120 ? 'PR ngắn (WPW)' : 'PR chênh xuống'))}
            </span>
          </div>
          <table class="ecg-comp-table">
            <tr>
              <td class="ecg-comp-table-lbl">Khoảng PR (P start &rarr; Q):</td>
              <td class="ecg-comp-table-val">${prDurMs} ms</td>
            </tr>
            <tr>
              <td class="ecg-comp-table-lbl">Đoạn PR (P end &rarr; Q):</td>
              <td class="ecg-comp-table-val">${prElevMv !== 0 ? `${(prElevMv * 10).toFixed(1)} mm (${prElevMv.toFixed(2)} mV)` : '0.0 mm (Đẳng điện)'}</td>
            </tr>
            <tr>
              <td class="ecg-comp-table-lbl">Dẫn truyền nhĩ thất:</td>
              <td class="ecg-comp-table-val">${prDurMs > 200 ? 'Chậm trễ qua nút AV' : (prDurMs < 120 ? 'Kích thích sớm bó phụ' : 'Dẫn truyền bình thường')}</td>
            </tr>
          </table>
          <div class="ecg-comp-ref-box">
            <strong>Giới hạn sinh lý bình thường:</strong> Khoảng PR 120 - 200 ms (3 - 5 ô nhỏ). Đoạn PR bình thường đẳng điện; chênh xuống trong Viêm màng ngoài tim cấp hoặc Nhồi máu cơ tim tâm nhĩ.
          </div>
        </div>

        <!-- 3. Sóng Q -->
        <div class="ecg-comp-card">
          <div class="ecg-comp-card-header">
            <h4 class="ecg-comp-card-title">
              <i class="fa-solid fa-arrow-down-long text-amber-600"></i> 3. Sóng Q (Khử Cực Vách)
            </h4>
            <span class="ecg-comp-badge ${qAmpMv === 0 ? 'ecg-comp-badge--normal' : (isQPathological ? 'ecg-comp-badge--danger' : 'ecg-comp-badge--normal')}">
              ${qAmpMv === 0 ? 'Không có sóng Q' : (isQPathological ? 'Q hoại tử bệnh lý' : 'q nhỏ sinh lý')}
            </span>
          </div>
          <table class="ecg-comp-table">
            <tr>
              <td class="ecg-comp-table-lbl">Biên độ âm (Depth):</td>
              <td class="ecg-comp-table-val">${qAmpMv.toFixed(2)} mV (${(qAmpMv * 10).toFixed(1)} mm)</td>
            </tr>
            <tr>
              <td class="ecg-comp-table-lbl">Thời gian (Width):</td>
              <td class="ecg-comp-table-val">${qDurMs} ms</td>
            </tr>
            <tr>
              <td class="ecg-comp-table-lbl">Tỷ lệ Q/R:</td>
              <td class="ecg-comp-table-val">${rAmpMv > 0 ? `${Math.round((qAmpMv / rAmpMv) * 100)}% R` : '—'}</td>
            </tr>
          </table>
          <div class="ecg-comp-ref-box">
            <strong>Tiêu chuẩn sóng Q bệnh lý (Hoại tử cơ tim):</strong> Thời gian &ge; 40 ms (1 ô nhỏ) HOẶC biên độ &ge; 25% chiều cao sóng R kế tiếp (ngoại trừ đạo trình III và aVR).
          </div>
        </div>

        <!-- 4. Sóng R & S -->
        <div class="ecg-comp-card">
          <div class="ecg-comp-card-header">
            <h4 class="ecg-comp-card-title">
              <i class="fa-solid fa-arrows-up-down text-red-600"></i> 4. Sóng R &amp; S (Khử Cực Thất)
            </h4>
            <span class="ecg-comp-badge ${leadData.rPrimeWave?.amp ? 'ecg-comp-badge--warning' : 'ecg-comp-badge--normal'}">
              ${leadData.rPrimeWave?.amp ? 'Dạng rSR\' (Bloc nhánh)' : 'Hình thái chuẩn'}
            </span>
          </div>
          <table class="ecg-comp-table">
            <tr>
              <td class="ecg-comp-table-lbl">Đỉnh R (Amplitude):</td>
              <td class="ecg-comp-table-val">${rAmpMv.toFixed(2)} mV (${(rAmpMv * 10).toFixed(1)} mm)</td>
            </tr>
            <tr>
              <td class="ecg-comp-table-lbl">Đáy S (Depth):</td>
              <td class="ecg-comp-table-val">${sAmpMv.toFixed(2)} mV (${(sAmpMv * 10).toFixed(1)} mm)</td>
            </tr>
            <tr>
              <td class="ecg-comp-table-lbl">Tỷ số R/S:</td>
              <td class="ecg-comp-table-val">${rsRatio}</td>
            </tr>
          </table>
          <div class="ecg-comp-ref-box">
            <strong>Tiến triển R trước tim bình thường:</strong> R tăng dần từ V1 &rarr; V5, S sâu nhất ở V1-V2 và giảm dần về V6. Vùng chuyển tiếp (R &asymp; S) thường ở V3 hoặc V4.
          </div>
        </div>

        <!-- 5. Phức Bộ QRS -->
        <div class="ecg-comp-card">
          <div class="ecg-comp-card-header">
            <h4 class="ecg-comp-card-title">
              <i class="fa-solid fa-heart text-danger"></i> 5. Phức Bộ QRS Toàn Thể
            </h4>
            <span class="ecg-comp-badge ${isQrsWide ? 'ecg-comp-badge--danger' : 'ecg-comp-badge--normal'}">
              ${isQrsWide ? 'QRS giãn rộng (&ge;120ms)' : 'QRS hẹp sinh lý (&lt;120ms)'}
            </span>
          </div>
          <table class="ecg-comp-table">
            <tr>
              <td class="ecg-comp-table-lbl">Tổng thời gian QRS:</td>
              <td class="ecg-comp-table-val">${m.qrsDuration} ms</td>
            </tr>
            <tr>
              <td class="ecg-comp-table-lbl">Trục điện tim:</td>
              <td class="ecg-comp-table-val">${m.axis} (${m.alphaAngle}°)</td>
            </tr>
            <tr>
              <td class="ecg-comp-table-lbl">Điện thế dày thất:</td>
              <td class="ecg-comp-table-val">Sokolow-Lyon: ${m.sokolowLyon !== undefined ? `${m.sokolowLyon} mm` : '—'}</td>
            </tr>
          </table>
          <div class="ecg-comp-ref-box">
            <strong>Giới hạn sinh lý bình thường:</strong> Thời gian 70 - 100 ms (hẹp, thanh mảnh). Giãn rộng &ge; 120 ms gặp trong Bloc nhánh phải/trái, nhịp tự thất hoặc ngoại tâm thu thất.
          </div>
        </div>

        <!-- 6. Điểm J (J-Point) -->
        <div class="ecg-comp-card">
          <div class="ecg-comp-card-header">
            <h4 class="ecg-comp-card-title">
              <i class="fa-solid fa-location-dot text-emerald-600"></i> 6. Điểm J (J-Point Precision)
            </h4>
            <span class="ecg-comp-badge ${Math.abs(stElevMv) < 0.05 ? 'ecg-comp-badge--normal' : (stElevMv > 0 ? 'ecg-comp-badge--danger' : 'ecg-comp-badge--warning')}">
              ${Math.abs(stElevMv) < 0.05 ? 'Điểm J đẳng điện' : (stElevMv > 0 ? `Điểm J nâng cao (+${stElevMm} mm)` : `Điểm J hạ thấp (${stElevMm} mm)`)}
            </span>
          </div>
          <table class="ecg-comp-table">
            <tr>
              <td class="ecg-comp-table-lbl">Vị trí điểm J:</td>
              <td class="ecg-comp-table-val">Giao điểm cuối QRS &amp; đầu ST</td>
            </tr>
            <tr>
              <td class="ecg-comp-table-lbl">Độ chênh tại điểm J:</td>
              <td class="ecg-comp-table-val">${stElevMv >= 0 ? `+${stElevMv.toFixed(2)}` : stElevMv.toFixed(2)} mV (${stElevMm} mm)</td>
            </tr>
            <tr>
              <td class="ecg-comp-table-lbl">Mốc chuẩn đối chiếu:</td>
              <td class="ecg-comp-table-val">Đoạn TP hoặc đoạn PR trước đó</td>
            </tr>
          </table>
          <div class="ecg-comp-ref-box">
            <strong>Ý nghĩa then chốt:</strong> Điểm J là mốc vàng đo lường đoạn ST. Điểm J chênh lên &ge; 1 mm (đạo trình chi) hoặc &ge; 2 mm (V2-V3 ở nam &ge; 40t) là tiêu chuẩn chẩn đoán STEMI.
          </div>
        </div>

        <!-- 7. Đoạn ST -->
        <div class="ecg-comp-card">
          <div class="ecg-comp-card-header">
            <h4 class="ecg-comp-card-title">
              <i class="fa-solid fa-chart-area text-orange-600"></i> 7. Đoạn ST (Tái Cực Thất Sớm)
            </h4>
            <span class="ecg-comp-badge ${isStElevated ? 'ecg-comp-badge--danger' : (isStDepressed ? 'ecg-comp-badge--danger' : 'ecg-comp-badge--normal')}">
              ${isStElevated ? 'ST chênh lên' : (isStDepressed ? 'ST chênh xuống' : 'ST đẳng điện')}
            </span>
          </div>
          <table class="ecg-comp-table">
            <tr>
              <td class="ecg-comp-table-lbl">Mức độ chênh (J+60ms):</td>
              <td class="ecg-comp-table-val">${stElevMv >= 0 ? `+${stElevMm}` : stElevMm} mm (${stElevMv >= 0 ? `+${stElevMv.toFixed(2)}` : stElevMv.toFixed(2)} mV)</td>
            </tr>
            <tr>
              <td class="ecg-comp-table-lbl">Hình thái đoạn ST:</td>
              <td class="ecg-comp-table-val">${isStElevated ? 'Vòm lồi (Coved / STEMI)' : (isStDepressed ? 'Dốc xuống (Downsloping)' : 'Đẳng điện sinh lý')}</td>
            </tr>
            <tr>
              <td class="ecg-comp-table-lbl">Thời gian đoạn ST:</td>
              <td class="ecg-comp-table-val">&asymp; 80 - 120 ms</td>
            </tr>
          </table>
          <div class="ecg-comp-ref-box">
            <strong>Phân loại hình thái:</strong> ST chênh lên dạng vòm lồi (STEMI/Brugada type 1); ST chênh lõm đáy thuyền (Viêm màng ngoài tim); ST chênh dốc xuống (Thiếu máu cục bộ); Múc thìa (Ngấm Digoxin).
          </div>
        </div>

        <!-- 8. Sóng T -->
        <div class="ecg-comp-card">
          <div class="ecg-comp-card-header">
            <h4 class="ecg-comp-card-title">
              <i class="fa-solid fa-mountain text-purple-600"></i> 8. Sóng T (Tái Cực Thất Muộn)
            </h4>
            <span class="ecg-comp-badge ${tAmpMv > 0.8 ? 'ecg-comp-badge--warning' : (tAmpMv < -0.1 ? 'ecg-comp-badge--danger' : 'ecg-comp-badge--normal')}">
              ${tAmpMv > 0.8 ? 'T cao nhọn (Tented T)' : (tAmpMv < -0.1 ? 'Sóng T âm sâu' : 'T dương sinh lý')}
            </span>
          </div>
          <table class="ecg-comp-table">
            <tr>
              <td class="ecg-comp-table-lbl">Biên độ sóng T:</td>
              <td class="ecg-comp-table-val">${tAmpMv.toFixed(2)} mV (${(tAmpMv * 10).toFixed(1)} mm)</td>
            </tr>
            <tr>
              <td class="ecg-comp-table-lbl">Thời gian sóng T:</td>
              <td class="ecg-comp-table-val">${tDurMs} ms</td>
            </tr>
            <tr>
              <td class="ecg-comp-table-lbl">Tính đối xứng &amp; Cực tính:</td>
              <td class="ecg-comp-table-val">${tShape}</td>
            </tr>
          </table>
          <div class="ecg-comp-ref-box">
            <strong>Giới hạn sinh lý bình thường:</strong> Sóng T bình thường <em>bất đối xứng</em> (sườn lên thoai thoải, sườn xuống dốc). T đối xứng cao nhọn gặp trong Tăng kali máu; T âm sâu nhọn đối xứng (Hội chứng Wellens - Hẹp LAD).
          </div>
        </div>

        <!-- 9. Sóng U & Khoảng QT/QTc -->
        <div class="ecg-comp-card">
          <div class="ecg-comp-card-header">
            <h4 class="ecg-comp-card-title">
              <i class="fa-solid fa-stopwatch text-teal-600"></i> 9. Sóng U &amp; Khoảng QT / QTc
            </h4>
            <span class="ecg-comp-badge ${m.qtc > 450 ? 'ecg-comp-badge--danger' : (hasUWave && uAmpMv >= 0.15 ? 'ecg-comp-badge--warning' : 'ecg-comp-badge--normal')}">
              ${m.qtc > 450 ? 'QTc kéo dài' : (hasUWave && uAmpMv >= 0.15 ? 'Sóng U nổi cao (Hạ K+)' : 'Đạt chuẩn')}
            </span>
          </div>
          <table class="ecg-comp-table">
            <tr>
              <td class="ecg-comp-table-lbl">Khoảng QT đo được:</td>
              <td class="ecg-comp-table-val">${m.qt} ms</td>
            </tr>
            <tr>
              <td class="ecg-comp-table-lbl">QTc hiệu chỉnh (Bazett):</td>
              <td class="ecg-comp-table-val ${m.qtc > 450 ? 'text-danger' : ''}">${m.qtc} ms</td>
            </tr>
            <tr>
              <td class="ecg-comp-table-lbl">Sóng U (Sau sóng T):</td>
              <td class="ecg-comp-table-val">${hasUWave ? `${uAmpMv.toFixed(2)} mV (${(uAmpMv * 10).toFixed(1)} mm)` : 'Không xuất hiện'}</td>
            </tr>
          </table>
          <div class="ecg-comp-ref-box">
            <strong>Ngưỡng an toàn điện tim:</strong> QTc bình thường &le; 440 ms (nam), &le; 460 ms (nữ). QTc &gt; 500 ms có nguy cơ kích phát xoắn đỉnh (TdP). Sóng U &gt; 1.5 mm gợi ý Hạ kali máu nặng.
          </div>
        </div>
      </div>
    `;

    // Attach pill events
    const pills = wrap.querySelectorAll('.ecg-lead-pill');
    pills.forEach(p => {
      p.addEventListener('click', () => {
        const selected = p.getAttribute('data-lead') as LeadName;
        if (selected) {
          this.selectedInspectorLead = selected;
          this.renderComponentsTab(wrap);
        }
      });
    });
  }

  /**
   * Advanced Graphics Tab (Poincaré HRV & Beat Morphology Superposition)
   */
  private renderAdvancedGraphicsTab(wrap: HTMLElement): void {
    const c = this.currentCase;
    const m = c.metrics;
    const poincare = calculateCasePoincareHrv(m.heartRate, m.regularity, c.category);
    const selectedLead: LeadName = this.selectedInspectorLead;
    const leadData = c.leadsData[selectedLead] || c.leadsData['II'];
    const morphology = generateBeatMorphologyProfile(leadData, m.heartRate);

    wrap.innerHTML = `
      <div class="ecg-adv-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap: 16px; margin-bottom: 20px;">
        <!-- Card 1: Poincaré Plot (RR_n vs RR_n+1) -->
        <div class="ecg-diag-card" style="background:#ffffff; border:1px solid #cbd5e1; border-radius:10px; padding:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <i class="fa-solid fa-chart-line text-primary" style="font-size:1.2rem; color:#2563eb;"></i>
              <h3 style="margin:0; font-size:1.05rem; font-weight:700;">Biểu Đồ Động Học Poincaré HRV (RR<sub>n</sub> vs RR<sub>n+1</sub>)</h3>
            </div>
            <span class="ecg-badge ecg-badge--cardio">${m.regularity}</span>
          </div>
          <p style="font-size:12.5px; color:#64748b; margin-bottom:10px;">
            Thuật toán phân tích động học phân tán chu kỳ R-R: Đánh giá độ biến thiên nhịp tim (HRV), phát hiện rung nhĩ và ngoại tâm thu.
          </p>
          <div style="position:relative; width:100%; height:270px; background:#f8fafc; border-radius:8px; border:1px solid #e2e8f0; overflow:hidden;">
            <canvas id="canvas-poincare" style="width:100%; height:100%; display:block;"></canvas>
          </div>
          <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:8px; margin-top:12px; font-size:12px; text-align:center;">
            <div style="background:#f1f5f9; padding:6px; border-radius:6px;"><strong>SD1:</strong><br>${poincare.sd1} ms</div>
            <div style="background:#f1f5f9; padding:6px; border-radius:6px;"><strong>SD2:</strong><br>${poincare.sd2} ms</div>
            <div style="background:#f1f5f9; padding:6px; border-radius:6px;"><strong>SD1/SD2:</strong><br>${poincare.sdRatio}</div>
            <div style="background:#f1f5f9; padding:6px; border-radius:6px;"><strong>RMSSD:</strong><br>${poincare.rmssd} ms</div>
          </div>
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; padding:10px; border-radius:6px; font-size:12.5px; margin-top:10px; color:#166534;">
            <i class="fa-solid fa-circle-info"></i> <strong>Đánh giá động học:</strong> ${poincare.rhythmInterpretation}
          </div>
        </div>

        <!-- Card 2: Beat Morphology Overlay -->
        <div class="ecg-diag-card" style="background:#ffffff; border:1px solid #cbd5e1; border-radius:10px; padding:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <i class="fa-solid fa-wave-square" style="font-size:1.2rem; color:#dc2626;"></i>
              <h3 style="margin:0; font-size:1.05rem; font-weight:700;">Xếp Chồng Hình Thái Nhát Bóp (Đạo Trình ${selectedLead})</h3>
            </div>
            <span class="ecg-badge ecg-badge--secondary">Mean Beat &plusmn; 1 SD</span>
          </div>
          <p style="font-size:12.5px; color:#64748b; margin-bottom:10px;">
            Phổ xếp chồng hình thái nhát bóp và dải độ lệch chuẩn để khảo sát chi tiết chênh lệch ST, sóng T khổng lồ hoặc sóng Delta.
          </p>
          <div style="position:relative; width:100%; height:270px; background:#fffdfa; border-radius:8px; border:1px solid #fecaca; overflow:hidden;">
            <canvas id="canvas-morphology" style="width:100%; height:100%; display:block;"></canvas>
          </div>
          <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:8px; margin-top:12px; font-size:12px; text-align:center;">
            <div style="background:#fef2f2; padding:6px; border-radius:6px;"><strong>Đỉnh R:</strong><br>${leadData.rWave.amp.toFixed(2)} mV</div>
            <div style="background:#fef2f2; padding:6px; border-radius:6px;"><strong>Đoạn ST:</strong><br>${leadData.stSegment.elevation > 0 ? `+${leadData.stSegment.elevation.toFixed(2)} mV` : `${leadData.stSegment.elevation.toFixed(2)} mV`}</div>
            <div style="background:#fef2f2; padding:6px; border-radius:6px;"><strong>Sóng T:</strong><br>${leadData.tWave.amp.toFixed(2)} mV</div>
          </div>
          <div style="background:#eff6ff; border:1px solid #bfdbfe; padding:10px; border-radius:6px; font-size:12.5px; margin-top:10px; color:#1e40af;">
            <i class="fa-solid fa-magnifying-glass-chart"></i> <strong>Đặc điểm sóng:</strong> ${c.diagnosis.keyFindings[0] || 'Hình thái nhát bóp trong giới hạn khảo sát.'}
          </div>
        </div>
      </div>

      <!-- High-DPI Graphic Export Hub -->
      <div class="ecg-diag-card" style="background:#ffffff; border:1px solid #cbd5e1; border-radius:10px; padding:18px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:12px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <i class="fa-solid fa-file-image" style="font-size:1.3rem; color:#0284c7;"></i>
            <h3 style="margin:0; font-size:1.1rem; font-weight:700;">Xuất Bản Đồ Họa ECG Độ Nét Cao 300 DPI</h3>
          </div>
          <button id="btn-export-canvas-hi-res" class="ecg-btn ecg-btn--primary">
            <i class="fa-solid fa-download"></i> Tải Ảnh Đồ Họa 12 Đạo Trình (PNG)
          </button>
        </div>
        <p style="font-size:13px; color:#64748b; margin-bottom:12px;">
          Lưới milimet chuẩn y tế (ô nhỏ 1mm = 0.04s/0.1mV, ô lớn 5mm = 0.20s/0.5mV), xung định chuẩn chuẩn mực 1mV x 0.20s.
        </p>
      </div>
    `;

    setTimeout(() => {
      this.drawPoincareCanvas(poincare);
      this.drawMorphologyCanvas(morphology, selectedLead);

      const btnExport = document.getElementById('btn-export-canvas-hi-res');
      if (btnExport) {
        btnExport.addEventListener('click', () => {
          const mainCanvas = document.querySelector('.ecg-main-canvas') as HTMLCanvasElement | null;
          if (mainCanvas) {
            const link = document.createElement('a');
            link.download = `ECG_12Lead_${this.currentCase.id}_${Date.now()}.png`;
            link.href = mainCanvas.toDataURL('image/png');
            link.click();
            this.showToast('Đã tải xuống đồ họa ECG chất lượng cao!');
          }
        });
      }
    }, 40);
  }

  private drawPoincareCanvas(poincare: PoincareHrvAnalysis): void {
    const canvas = document.getElementById('canvas-poincare') as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = rect.width || 420;
    const h = rect.height || 270;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    const minMs = 300;
    const maxMs = 1500;
    const padding = 35;
    const plotW = w - padding * 2;
    const plotH = h - padding * 2;

    const toX = (ms: number) => padding + ((ms - minMs) / (maxMs - minMs)) * plotW;
    const toY = (ms: number) => (h - padding) - ((ms - minMs) / (maxMs - minMs)) * plotH;

    // Grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.font = '10px monospace';
    ctx.fillStyle = '#94a3b8';

    for (let ms = 400; ms <= 1400; ms += 200) {
      const x = toX(ms);
      const y = toY(ms);

      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, h - padding);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(w - padding, y);
      ctx.stroke();

      ctx.fillText(`${ms}`, x - 12, h - padding + 15);
      ctx.fillText(`${ms}`, padding - 28, y + 4);
    }

    // Line of identity y = x
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(toX(minMs), toY(minMs));
    ctx.lineTo(toX(maxMs), toY(maxMs));
    ctx.stroke();
    ctx.setLineDash([]);

    // Ellipse
    const cx = toX(poincare.meanRr);
    const cy = toY(poincare.meanRr);
    const rx = (poincare.sd2 / (maxMs - minMs)) * plotW;
    const ry = (poincare.sd1 / (maxMs - minMs)) * plotH;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-Math.PI / 4);
    ctx.beginPath();
    ctx.ellipse(0, 0, Math.max(8, rx * 1.5), Math.max(5, ry * 1.5), 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.fill();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // Scatter points
    ctx.fillStyle = '#dc2626';
    for (const pt of poincare.points) {
      const px = toX(pt.rrCurrent);
      const py = toY(pt.rrNext);
      if (px >= padding && px <= w - padding && py >= padding && py <= h - padding) {
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  private drawMorphologyCanvas(points: BeatMorphologyPoint[], lead: LeadName): void {
    const canvas = document.getElementById('canvas-morphology') as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = rect.width || 420;
    const h = rect.height || 270;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#fffdfa';
    ctx.fillRect(0, 0, w, h);

    // ECG grid background
    ctx.strokeStyle = '#fee2e2';
    ctx.lineWidth = 0.5;
    const step = 10;
    for (let x = 0; x < w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    if (!points || points.length === 0) return;

    const padX = 25;
    const centerY = h * 0.55;
    const plotW = w - padX * 2;
    const maxT = points[points.length - 1].timeSec;
    const scaleY = 70; // 70px per mV

    const toX = (t: number) => padX + (t / maxT) * plotW;
    const toY = (v: number) => centerY - v * scaleY;

    // Confidence Band (+/- 1 SD)
    ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
    ctx.beginPath();
    ctx.moveTo(toX(points[0].timeSec), toY(points[0].meanVoltage + points[0].stdDev));
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(toX(points[i].timeSec), toY(points[i].meanVoltage + points[i].stdDev));
    }
    for (let i = points.length - 1; i >= 0; i--) {
      ctx.lineTo(toX(points[i].timeSec), toY(points[i].meanVoltage - points[i].stdDev));
    }
    ctx.closePath();
    ctx.fill();

    // Baseline
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(padX, centerY);
    ctx.lineTo(w - padX, centerY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Mean waveform
    ctx.strokeStyle = '#b91c1c';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(toX(points[0].timeSec), toY(points[0].meanVoltage));
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(toX(points[i].timeSec), toY(points[i].meanVoltage));
    }
    ctx.stroke();
  }

  /**
   * Caliper & Wave Landmark Annotation Tab
   */
  private renderAnnotationTab(report: AnnotationValidationReport | null): void {
    const wrap = document.getElementById('ecg-tab-content');
    if (!wrap) return;

    if (!report || report.totalAnnotations === 0) {
      wrap.innerHTML = `
        <div class="ecg-empty-ann-state">
          <i class="fa-solid fa-crosshairs fa-3x text-muted"></i>
          <h3>Thước Caliper &amp; Thẩm Định Chấm Mốc Sóng Tương Tác</h3>
          <p>
            1. Bật <strong>Thước Caliper</strong> trên thanh công cụ và kéo chuột trên đồ họa để đo khoảng thời gian (ms) và điện thế (mV).<br>
            2. Hoặc chọn các nút sóng (<strong>P, Q, R, S, J, T, U</strong>) và nhấp chuột trực tiếp lên đỉnh/đáy sóng để hệ thống chấm điểm độ chính xác nhận diện thành phần.
          </p>
        </div>
      `;
      return;
    }

    wrap.innerHTML = `
      <div class="ecg-ann-report">
        <div class="ecg-ann-summary-card">
          <div class="ecg-ann-score-box">
            <span class="ecg-ann-score">${report.overallScore}</span>
            <span class="ecg-ann-score-label">/ 100 Điểm</span>
          </div>
          <div class="ecg-ann-summary-text">
            <h3>Kết Quả Nhận Diện Thành Phần Sóng</h3>
            <p class="ecg-ann-feedback">${report.feedback}</p>
            <p class="ecg-ann-pearl"><i class="fa-solid fa-lightbulb text-warning"></i> ${report.clinicalPearl}</p>
          </div>
        </div>

        <div class="ecg-ann-items-list">
          <h4>Chi Tiết Từng Vị Trí Sóng Đã Chấm:</h4>
          ${report.items.map(item => `
            <div class="ecg-ann-result-row ecg-ann-result-row--${item.status}">
              <div class="ecg-ann-wave-badge">${item.waveType} (${item.lead})</div>
              <div class="ecg-ann-item-desc">
                <strong>${item.message}</strong>
                <p>${item.morphologyEvaluation}</p>
              </div>
              <div class="ecg-ann-item-score font-bold">${item.score}đ</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  private showToast(msg: string): void {
    const toast = document.getElementById('ecg-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 2800);
  }
}
