/**
 * CDSS Platform Suite — Master Hub Application
 * Bedside Clinical Command Launchpad (Minimalist, Fast, Icon-Centric)
 */
import { CDSS_MODULES, getCDSSModuleById, getCDSSModuleBySlug } from './cdss-registry';
import { CDSSModuleMeta } from './cdss-types';

export * from './cdss-types';
export * from './cdss-registry';

type ViewMode = 'grid' | 'tiles' | 'list';

interface TriageItem {
  slug: string;
  label: string;
  trigger: string;
  icon: string;
  color: string;
}

const STAT_TRIAGE_ITEMS: TriageItem[] = [
  { slug: 'dengue', label: 'Dengue Sốc', trigger: 'Hct cao, cô đặc máu, sốc tụt HA', icon: 'fa-solid fa-droplet', color: '#e11d48' },
  { slug: 'sepsis', label: 'Sepsis-3', trigger: 'Sốt cao, tụt HA, Lactate > 2, SOFA', icon: 'fa-solid fa-biohazard', color: '#dc2626' },
  { slug: 'ecg', label: 'ECG STEMI', trigger: 'Đau ngực, STEMI định khu, QTc, Caliper', icon: 'fa-solid fa-heart-pulse', color: '#f43f5e' },
  { slug: 'abg', label: 'Khí Máu ABG', trigger: 'Toan kiềm, PaO2/PaCO2, Anion Gap', icon: 'fa-solid fa-lungs', color: '#0d9488' },
  { slug: 'csf', label: 'Dịch Não Tủy', trigger: 'Sốt, đau đầu, viêm màng não, SAH', icon: 'fa-solid fa-brain', color: '#9333ea' }
];

const PINNED_STORAGE_KEY = 'cdss_pinned_module_slugs';
const RECENT_STORAGE_KEY = 'cdss_recent_module_slugs';
const VIEW_MODE_STORAGE_KEY = 'cdss_preferred_view_mode';

function getPinnedSlugs(): string[] {
  try {
    const raw = localStorage.getItem(PINNED_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function setPinnedSlugs(slugs: string[]): void {
  try {
    localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(slugs));
  } catch (e) {}
}

function getRecentSlugs(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function recordRecentSlug(slug: string): void {
  try {
    let recent = getRecentSlugs().filter(s => s !== slug);
    recent.unshift(slug);
    recent = recent.slice(0, 5);
    localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(recent));
  } catch (e) {}
}

function getStoredViewMode(): ViewMode {
  try {
    const mode = localStorage.getItem(VIEW_MODE_STORAGE_KEY) as ViewMode;
    return (mode === 'grid' || mode === 'tiles' || mode === 'list') ? mode : 'grid';
  } catch (e) {
    return 'grid';
  }
}

function setStoredViewMode(mode: ViewMode): void {
  try {
    localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
  } catch (e) {}
}

export function initCDSSHub(containerId: string): void {
  const container = document.getElementById(containerId);
  if (!container) return;

  let activeCategory = 'all';
  let searchQuery = '';
  let viewMode: ViewMode = getStoredViewMode();
  let pinnedSlugs: string[] = getPinnedSlugs();
  let recentSlugs: string[] = getRecentSlugs();
  let infoModalSlug: string | null = null;
  let isCalculatorOpen = false;
  let isShortcutsOpen = false;

  // Bedside Calculator State
  let calcTab: 'renal' | 'body' | 'map' | 'pf' = 'renal';
  let calcData = {
    age: 60,
    sex: 'male',
    weight: 65,
    height: 165,
    scr: 90, // umol/L
    sbp: 120,
    dbp: 80,
    pao2: 85,
    fio2: 21 // %
  };

  const categories = [
    { id: 'all', label: 'Tất cả (10)', icon: 'fa-solid fa-shapes' },
    { id: 'stat', label: 'Cấp cứu STAT (5)', icon: 'fa-solid fa-bolt-lightning', isStat: true },
    { id: 'resus', label: 'Hồi sức', icon: 'fa-solid fa-truck-medical' },
    { id: 'cardio-resp', label: 'Tim - Hô hấp', icon: 'fa-solid fa-heart-pulse' },
    { id: 'pharma', label: 'Kháng sinh & Dược', icon: 'fa-solid fa-pills' },
    { id: 'internal', label: 'Nội khoa & Thần kinh', icon: 'fa-solid fa-hospital-user' }
  ];

  function filterModules(modules: CDSSModuleMeta[]): CDSSModuleMeta[] {
    const q = searchQuery.toLowerCase().trim();
    return modules.filter(m => {
      let matchCat = false;
      if (activeCategory === 'all') {
        matchCat = true;
      } else if (activeCategory === 'stat') {
        matchCat = m.urgency === 'stat';
      } else if (activeCategory === 'resus') {
        matchCat = m.category === 'resuscitation';
      } else if (activeCategory === 'cardio-resp') {
        matchCat = m.category === 'cardiology' || m.category === 'respiratory';
      } else if (activeCategory === 'pharma') {
        matchCat = m.category === 'pharmacology';
      } else if (activeCategory === 'internal') {
        matchCat = m.category === 'gastroenterology' || m.category === 'endocrinology' || m.category === 'neurology' || m.category === 'internal';
      } else {
        matchCat = m.category === activeCategory;
      }

      const matchSearch = !q ||
        m.title.toLowerCase().includes(q) ||
        (m.titleEn && m.titleEn.toLowerCase().includes(q)) ||
        (m.shortTitle && m.shortTitle.toLowerCase().includes(q)) ||
        (m.brandCode && m.brandCode.toLowerCase().includes(q)) ||
        (m.department && m.department.toLowerCase().includes(q)) ||
        (m.statTrigger && m.statTrigger.toLowerCase().includes(q)) ||
        m.shortDesc.toLowerCase().includes(q) ||
        m.guidelineSource.toLowerCase().includes(q);

      return matchCat && matchSearch;
    });
  }

  // Calculator Formulas
  function calculateCrCl(): number {
    const age = Number(calcData.age) || 60;
    const wt = Number(calcData.weight) || 60;
    const scrMgDl = (Number(calcData.scr) || 90) / 88.4;
    if (scrMgDl <= 0) return 0;
    let crcl = ((140 - age) * wt) / (72 * scrMgDl);
    if (calcData.sex === 'female') crcl *= 0.85;
    return Math.round(crcl * 10) / 10;
  }

  function calculateCKDEPI(): number {
    const age = Number(calcData.age) || 60;
    const scrMgDl = (Number(calcData.scr) || 90) / 88.4;
    if (scrMgDl <= 0) return 0;

    const isFemale = calcData.sex === 'female';
    const kappa = isFemale ? 0.7 : 0.9;
    const alpha = isFemale ? -0.241 : -0.302;
    const minVal = Math.min(scrMgDl / kappa, 1);
    const maxVal = Math.max(scrMgDl / kappa, 1);

    let egfr = 142 * Math.pow(minVal, alpha) * Math.pow(maxVal, -1.200) * Math.pow(0.9938, age);
    if (isFemale) egfr *= 1.012;
    return Math.round(egfr * 10) / 10;
  }

  function calculateBMI(): { bmi: number; ibw: number; adjbw: number; cat: string } {
    const wt = Number(calcData.weight) || 60;
    const htCm = Number(calcData.height) || 165;
    const htM = htCm / 100;
    const bmi = htM > 0 ? Math.round((wt / (htM * htM)) * 10) / 10 : 0;

    const htInches = htCm / 2.54;
    const inchesOver5Ft = Math.max(0, htInches - 60);
    const baseIbw = calcData.sex === 'female' ? 45.5 : 50;
    const ibw = Math.round((baseIbw + 2.3 * inchesOver5Ft) * 10) / 10;

    let adjbw = wt;
    if (wt > 1.2 * ibw) {
      adjbw = Math.round((ibw + 0.4 * (wt - ibw)) * 10) / 10;
    }

    let cat = 'Bình thường';
    if (bmi < 18.5) cat = 'Thiếu cân';
    else if (bmi < 23) cat = 'Bình thường (Châu Á)';
    else if (bmi < 25) cat = 'Thừa cân (Châu Á)';
    else if (bmi < 30) cat = 'Béo phì độ I';
    else cat = 'Béo phì độ II+';

    return { bmi, ibw, adjbw, cat };
  }

  function calculateMAP(): { map: number; isHypotension: boolean } {
    const sbp = Number(calcData.sbp) || 120;
    const dbp = Number(calcData.dbp) || 80;
    const map = Math.round(((sbp + 2 * dbp) / 3) * 10) / 10;
    return { map, isHypotension: map < 65 };
  }

  function calculatePF(): { pf: number; ards: string; color: string } {
    const pao2 = Number(calcData.pao2) || 85;
    const fio2Percent = Number(calcData.fio2) || 21;
    const fio2 = fio2Percent / 100;
    const pf = fio2 > 0 ? Math.round(pao2 / fio2) : 0;

    let ards = 'Bình thường';
    let color = '#059669';
    if (pf < 100) {
      ards = 'ARDS Nặng (Berlin: P/F < 100)';
      color = '#dc2626';
    } else if (pf <= 200) {
      ards = 'ARDS Trung bình (Berlin: 100-200)';
      color = '#ea580c';
    } else if (pf <= 300) {
      ards = 'ARDS Nhẹ (Berlin: 200-300)';
      color = '#d97706';
    }
    return { pf, ards, color };
  }

  function render() {
    const filtered = filterModules(CDSS_MODULES);
    const pinnedModules = CDSS_MODULES.filter(m => pinnedSlugs.includes(m.slug));
    const recentModules = recentSlugs.map(s => CDSS_MODULES.find(m => m.slug === s)).filter(Boolean) as CDSSModuleMeta[];
    const modalModule = infoModalSlug ? CDSS_MODULES.find(m => m.slug === infoModalSlug) : null;

    container.innerHTML = `
      <div class="cdss-hub-workspace">

        <!-- Header Bar with Bento Switcher -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-3 py-1 rounded-xl border border-teal-200/60 dark:border-teal-800/60">
                10 CDSS Lâm Sàng
              </span>
              <span class="text-xs text-slate-400 dark:text-slate-500 hidden md:inline">· Chuẩn EBM &amp; Bộ Y Tế</span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 hidden sm:block">
              Hệ thống hỗ trợ quyết định lâm sàng phân tầng nguy cơ, tính liều &amp; xử trí cấp cứu
            </p>
          </div>

          <!-- View Mode Switcher (Icon Buttons Only) -->
          <div class="cdss-view-switch-group self-start sm:self-auto">
            <button 
              type="button" 
              class="cdss-view-icon-btn ${viewMode === 'grid' ? 'active' : ''}" 
              data-mode="grid"
              title="Bố Cục Bento Chuyên Nghiệp (Bento Grid)"
              aria-label="Bố cục Bento"
            >
              <i class="fa-solid fa-table-cells-large"></i>
            </button>
            <button 
              type="button" 
              class="cdss-view-icon-btn ${viewMode === 'tiles' ? 'active' : ''}" 
              data-mode="tiles"
              title="Dạng Ma Trận Biểu Tượng (Tiles)"
              aria-label="Ma trận biểu tượng"
            >
              <i class="fa-solid fa-grip"></i>
            </button>
            <button 
              type="button" 
              class="cdss-view-icon-btn ${viewMode === 'list' ? 'active' : ''}" 
              data-mode="list"
              title="Dạng Danh Sách Trực Đi Buồng (List)"
              aria-label="Danh sách trực"
            >
              <i class="fa-solid fa-list-ul"></i>
            </button>
          </div>
        </div>

        <!-- Empty State -->
        ${filtered.length === 0 ? `
          <div class="cdss-empty-box">
            <i class="fa-solid fa-magnifying-glass cdss-empty-icon"></i>
            <h3 class="cdss-empty-title">Không tìm thấy công cụ phù hợp</h3>
            <p class="cdss-empty-desc">
              Không có công cụ nào khớp với từ khóa "<strong>${searchQuery}</strong>". Thử tìm kiếm với từ khóa khác như <em>Dengue, Sepsis, ABG, ECG, Vancomycin, Insulin, DNT</em>.
            </p>
            <button type="button" id="cdss-empty-reset" class="cdss-empty-btn">
              <i class="fa-solid fa-arrows-rotate"></i> Xem tất cả 10 công cụ CDSS
            </button>
          </div>
        ` : ''}

        <!-- ================================================================
             4. VIEW MODES: BENTO GRID, TILES MATRIX, COMPACT LIST
             ================================================================ -->

        <!-- VIEW MODE 1: MODERN BENTO CLINICAL GRID (DEFAULT) -->
        ${viewMode === 'grid' && filtered.length > 0 ? `
          <div class="cdss-bento-grid">
            ${filtered.map(m => renderBentoCard(m)).join('')}
          </div>
        ` : ''}

        <!-- VIEW MODE 2: HIGH-DENSITY ICON TILES MATRIX -->
        ${viewMode === 'tiles' && filtered.length > 0 ? `
          <div class="cdss-tiles-matrix">
            ${filtered.map(m => renderCompactTile(m)).join('')}
          </div>
        ` : ''}

        <!-- VIEW MODE 3: BEDSIDE COMPACT LIST -->
        ${viewMode === 'list' && filtered.length > 0 ? `
          <div class="cdss-compact-list">
            ${filtered.map(m => renderCompactRow(m)).join('')}
          </div>
        ` : ''}

        <!-- Minimal Footnote -->
        <footer class="cdss-minimal-footnote">
          <div>
            <span>CDSS Platform Suite</span>
            <span aria-hidden="true">·</span>
            <span>Bộ Y Tế Việt Nam &amp; EBM Quốc Tế</span>
            <span aria-hidden="true">·</span>
            <span>100% Client-side Offline</span>
          </div>
        </footer>

      </div>

      <!-- ================================================================
           5. MODAL 1: BEDSIDE RAPID CALCULATOR (Alt+C)
           ================================================================ -->
      ${isCalculatorOpen ? `
        <div class="cdss-modal-overlay" id="cdss-calc-overlay">
          <div class="cdss-modal-container" role="dialog" aria-modal="true" aria-labelledby="calc-title">
            <div class="cdss-modal-header">
              <div class="cdss-modal-title-wrap">
                <div class="cdss-modal-icon-badge">
                  <i class="fa-solid fa-calculator"></i>
                </div>
                <div>
                  <h3 id="calc-title" class="cdss-modal-title">Máy Tính Lâm Sàng Cấp Tốc Tại Giường</h3>
                  <p class="cdss-modal-subtitle">Thanh thải thận, Thể trạng dinh dưỡng, Huyết động MAP và Trao đổi khí P/F</p>
                </div>
              </div>
              <button type="button" id="cdss-close-calc" class="cdss-modal-close-btn" title="Đóng (Esc)">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <!-- Calculator Segmented Tabs -->
            <div class="cdss-calc-tabs">
              <button type="button" class="cdss-calc-tab ${calcTab === 'renal' ? 'active' : ''}" data-calc-tab="renal">
                <i class="fa-solid fa-droplet"></i>
                <span>Thanh Thải Thận (CrCl / eGFR)</span>
              </button>
              <button type="button" class="cdss-calc-tab ${calcTab === 'body' ? 'active' : ''}" data-calc-tab="body">
                <i class="fa-solid fa-weight-scale"></i>
                <span>Thể Trạng (BMI / IBW / AdjBW)</span>
              </button>
              <button type="button" class="cdss-calc-tab ${calcTab === 'map' ? 'active' : ''}" data-calc-tab="map">
                <i class="fa-solid fa-heart-pulse"></i>
                <span>Huyết Động (Huyết Áp MAP)</span>
              </button>
              <button type="button" class="cdss-calc-tab ${calcTab === 'pf' ? 'active' : ''}" data-calc-tab="pf">
                <i class="fa-solid fa-lungs"></i>
                <span>Trao Đổi Khí (Tỷ số P/F)</span>
              </button>
            </div>

            <div class="cdss-modal-body" id="cdss-calc-modal-body">
              ${renderCalculatorContent()}
            </div>
          </div>
        </div>
      ` : ''}

      <!-- ================================================================
           6. MODAL 2: CLINICAL GUIDELINE & PROTOCOL QUICK SHEET
           ================================================================ -->
      ${modalModule ? `
        <div class="cdss-modal-overlay" id="cdss-info-overlay">
          <div class="cdss-modal-container" role="dialog" aria-modal="true" aria-labelledby="info-title">
            <div class="cdss-modal-header">
              <div class="cdss-modal-title-wrap">
                <div class="cdss-modal-icon-badge cdss-icon--${modalModule.category}">
                  <i class="${modalModule.icon}"></i>
                </div>
                <div>
                  <h3 id="info-title" class="cdss-modal-title">${modalModule.title}</h3>
                  <div class="cdss-modal-sub-meta">
                    <span>${modalModule.department || modalModule.categoryName}</span>
                    <span aria-hidden="true">·</span>
                    <span>${modalModule.brandCode}</span>
                    ${modalModule.urgency === 'stat' ? '<span class="cdss-stat-tag">🚨 Cấp cứu STAT</span>' : ''}
                  </div>
                </div>
              </div>
              <button type="button" id="cdss-close-info" class="cdss-modal-close-btn" title="Đóng (Esc)">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div class="cdss-modal-body">
              <div class="cdss-info-section">
                <h4 class="cdss-info-head"><i class="fa-solid fa-file-medical"></i> Chỉ định &amp; Tình huống lâm sàng</h4>
                <p class="cdss-info-text">${modalModule.shortDesc}</p>
                ${modalModule.statTrigger ? `
                  <div class="cdss-info-alert">
                    <i class="fa-solid fa-triangle-exclamation text-amber-500"></i>
                    <span><strong>Tình huống kích hoạt:</strong> ${modalModule.statTrigger}</span>
                  </div>
                ` : ''}
              </div>

              <div class="cdss-info-section">
                <h4 class="cdss-info-head"><i class="fa-solid fa-book-medical"></i> Căn cứ hướng dẫn y khoa (EBM)</h4>
                <p class="cdss-info-guide-text">${modalModule.guidelineSource}</p>
              </div>

              ${modalModule.features && modalModule.features.length > 0 ? `
                <div class="cdss-info-section">
                  <h4 class="cdss-info-head"><i class="fa-solid fa-square-check"></i> Tính năng &amp; Phác đồ tích hợp</h4>
                  <div class="cdss-info-features-grid">
                    ${modalModule.features.map(f => `
                      <div class="cdss-info-feat-item">
                        <i class="fa-solid fa-check text-teal-600"></i>
                        <span>${f}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              <div class="cdss-info-actions">
                <a href="${modalModule.standaloneUrl}" class="cdss-info-launch-btn" data-slug="${modalModule.slug}">
                  <span>Mở Trực Tiếp Công Cụ Này</span>
                  <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- ================================================================
           7. MODAL 3: KEYBOARD SHORTCUTS
           ================================================================ -->
      ${isShortcutsOpen ? `
        <div class="cdss-modal-overlay" id="cdss-shortcuts-overlay">
          <div class="cdss-modal-container cdss-modal-sm" role="dialog" aria-modal="true" aria-labelledby="shortcuts-title">
            <div class="cdss-modal-header">
              <div class="cdss-modal-title-wrap">
                <div class="cdss-modal-icon-badge">
                  <i class="fa-solid fa-keyboard"></i>
                </div>
                <div>
                  <h3 id="shortcuts-title" class="cdss-modal-title">Phím Tắt Thao Tác Nhanh</h3>
                  <p class="cdss-modal-subtitle">Tối ưu tốc độ khám &amp; tra cứu tại giường bệnh</p>
                </div>
              </div>
              <button type="button" id="cdss-close-shortcuts" class="cdss-modal-close-btn" title="Đóng (Esc)">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div class="cdss-modal-body">
              <div class="cdss-shortcuts-list">
                <div class="cdss-shortcut-item">
                  <kbd>/</kbd>
                  <span>Tìm kiếm nhanh công cụ / chỉ định lâm sàng</span>
                </div>
                <div class="cdss-shortcut-item">
                  <kbd>Alt</kbd> + <kbd>C</kbd>
                  <span>Mở Máy tính lâm sàng cấp tốc (CrCl, eGFR, BMI, MAP, P/F)</span>
                </div>
                <div class="cdss-shortcut-item">
                  <kbd>Alt</kbd> + <kbd>S</kbd>
                  <span>Bật / Tắt lọc các công cụ Cấp Cứu STAT</span>
                </div>
                <div class="cdss-shortcut-item">
                  <kbd>?</kbd>
                  <span>Mở bảng hướng dẫn phím tắt này</span>
                </div>
                <div class="cdss-shortcut-item">
                  <kbd>Esc</kbd>
                  <span>Đóng tất cả cửa sổ bật lên / Xóa tìm kiếm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ` : ''}
    `;

    attachEvents();
  }

  // Render individual Bento Box Card (Clinical Hierarchy, Features & Fast Launch)
  function renderBentoCard(m: CDSSModuleMeta): string {
    const isPinned = pinnedSlugs.includes(m.slug);
    const isStat = m.urgency === 'stat';

    // Bento Asymmetric Layout Slot
    let bentoClass = 'bento-medium';
    if (m.slug === 'dengue' || m.slug === 'ecg') {
      bentoClass = 'bento-hero';
    } else if (m.slug === 'diacare' || m.slug === 'inpatient') {
      bentoClass = 'bento-wide';
    }

    // Contextual Launch Action Label
    let actionLabel = 'Mở';
    if (m.slug === 'dengue') actionLabel = 'Bù Dịch 4 Cột';
    else if (m.slug === 'ecg') actionLabel = 'Đọc 12 Cần';
    else if (m.slug === 'vancomycin') actionLabel = 'Chỉnh Liều TDM';
    else if (m.slug === 'sepsis') actionLabel = 'Đánh Giá Sepsis';
    else if (m.slug === 'csf') actionLabel = 'Phân Tích DNT';
    else if (m.slug === 'abg') actionLabel = 'Đọc Khí Máu';
    else if (m.slug === 'hepa') actionLabel = 'Sinh Hóa Gan';
    else if (m.slug === 'antibiotic') actionLabel = 'Kê Kháng Sinh';
    else if (m.slug === 'diacare') actionLabel = 'Phác Đồ Insulin';
    else if (m.slug === 'inpatient') actionLabel = 'Khám Bệnh Án';

    // Key Features for Bento Box
    const maxPills = (bentoClass === 'bento-hero' || bentoClass === 'bento-wide') ? 4 : 2;
    const featurePills = (m.features || []).slice(0, maxPills);

    return `
      <article class="cdss-bento-card ${bentoClass} ${isStat ? 'is-stat-bento' : ''}" data-slug="${m.slug}">
        <div>
          <!-- Top Row: Icon, Department, Urgency Badge & Pin Button -->
          <div class="cdss-bento-header">
            <div class="cdss-bento-icon-title">
              <div class="cdss-bento-icon cdss-icon--${m.category}">
                <i class="${m.icon}"></i>
              </div>
              <div class="cdss-bento-title-wrap">
                <div class="cdss-bento-meta-row">
                  <span>${m.department || m.categoryName}</span>
                  ${isStat ? `<span class="cdss-bento-stat-tag"><i class="fa-solid fa-bolt-lightning"></i> STAT</span>` : ''}
                </div>
                <h3 class="cdss-bento-title">
                  <a href="${m.standaloneUrl}" class="cdss-card-link-title" data-slug="${m.slug}">
                    ${m.shortTitle || m.title}
                  </a>
                </h3>
              </div>
            </div>

            <button 
              type="button" 
              class="cdss-bento-action-btn ${isPinned ? 'is-pinned' : ''}" 
              data-pin-slug="${m.slug}" 
              title="${isPinned ? 'Bỏ ghim khỏi đầu trang' : 'Ghim công cụ yêu thích'}"
              aria-label="${isPinned ? 'Bỏ ghim' : 'Ghim'}"
            >
              <i class="${isPinned ? 'fa-solid' : 'fa-regular'} fa-star"></i>
            </button>
          </div>

          <!-- Clinical Trigger & Summary -->
          <p class="cdss-bento-desc">
            ${m.shortDesc}
          </p>

          <!-- Bento Clinical Capabilities & Protocol Highlights -->
          ${featurePills.length > 0 ? `
            <div class="cdss-bento-features">
              ${featurePills.map(f => `
                <div class="cdss-bento-feat-pill">
                  <i class="fa-solid fa-check"></i>
                  <span>${f}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Bento Footer: Info EBM & Direct Launch Button -->
        <div class="cdss-bento-footer">
          <div class="cdss-bento-footer-left">
            <button 
              type="button" 
              class="cdss-bento-action-btn cdss-info-trigger-btn" 
              data-info-slug="${m.slug}" 
              title="Xem căn cứ EBM, phác đồ &amp; hướng dẫn y khoa"
              aria-label="Thông tin lâm sàng"
            >
              <i class="fa-solid fa-circle-info"></i>
            </button>
            <span class="text-[11px] font-mono text-slate-400 dark:text-slate-500 font-semibold hidden sm:inline">
              ${m.badge || ''}
            </span>
          </div>

          <a 
            href="${m.standaloneUrl}" 
            class="cdss-bento-launch-btn" 
            data-slug="${m.slug}"
            title="Mở ${m.shortTitle || m.title}"
          >
            <span>${actionLabel}</span>
            <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </article>
    `;
  }

  // Render Compact Tile (Ultra-dense Icon Tile View)
  function renderCompactTile(m: CDSSModuleMeta): string {
    const isPinned = pinnedSlugs.includes(m.slug);
    const isStat = m.urgency === 'stat';

    return `
      <div class="cdss-tile-item ${isStat ? 'is-stat-tile' : ''}" data-slug="${m.slug}">
        <div class="cdss-tile-header">
          <div class="cdss-icon-box-sm cdss-icon--${m.category}">
            <i class="${m.icon}"></i>
          </div>
          <div class="cdss-tile-badges">
            ${isStat ? `<span class="cdss-stat-dot" title="STAT Cấp Cứu"></span>` : ''}
            <button 
              type="button" 
              class="cdss-tile-pin ${isPinned ? 'is-pinned' : ''}" 
              data-pin-slug="${m.slug}"
              title="${isPinned ? 'Bỏ ghim' : 'Ghim'}"
            >
              <i class="${isPinned ? 'fa-solid' : 'fa-regular'} fa-star"></i>
            </button>
          </div>
        </div>

        <a href="${m.standaloneUrl}" class="cdss-tile-link" data-slug="${m.slug}">
          <h4 class="cdss-tile-title">${m.shortTitle || m.title}</h4>
          <span class="cdss-tile-sub">${m.department || m.categoryName}</span>
        </a>

        <div class="cdss-tile-footer">
          <button type="button" class="cdss-tile-info-btn" data-info-slug="${m.slug}" title="Thông tin hướng dẫn">
            <i class="fa-solid fa-circle-info"></i>
          </button>
          <a href="${m.standaloneUrl}" class="cdss-tile-go" data-slug="${m.slug}" title="Mở">
            <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>
    `;
  }

  // Render Compact List Row (Bedside Rounds Table View)
  function renderCompactRow(m: CDSSModuleMeta): string {
    const isPinned = pinnedSlugs.includes(m.slug);
    const isStat = m.urgency === 'stat';

    return `
      <div class="cdss-row-item ${isStat ? 'is-stat-row' : ''}" data-slug="${m.slug}">
        <div class="cdss-row-left">
          <button 
            type="button" 
            class="cdss-tool-icon-btn ${isPinned ? 'is-pinned' : ''}" 
            data-pin-slug="${m.slug}" 
            title="${isPinned ? 'Bỏ ghim' : 'Ghim'}"
          >
            <i class="${isPinned ? 'fa-solid' : 'fa-regular'} fa-star"></i>
          </button>

          <div class="cdss-icon-box-xs cdss-icon--${m.category}">
            <i class="${m.icon}"></i>
          </div>

          <div class="cdss-row-title-wrap">
            <a href="${m.standaloneUrl}" class="cdss-row-link" data-slug="${m.slug}">
              ${m.shortTitle || m.title}
            </a>
            <span class="cdss-row-dept">${m.department || m.categoryName}</span>
          </div>
        </div>

        <div class="cdss-row-right">
          ${isStat ? `<span class="cdss-stat-micro-badge"><i class="fa-solid fa-bolt-lightning"></i> STAT</span>` : ''}

          <button 
            type="button" 
            class="cdss-tool-icon-btn cdss-info-trigger-btn" 
            data-info-slug="${m.slug}" 
            title="Xem thông tin"
          >
            <i class="fa-solid fa-circle-info"></i>
          </button>

          <a href="${m.standaloneUrl}" class="cdss-row-launch-btn" data-slug="${m.slug}">
            <span>Mở</span>
            <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>
    `;
  }

  // Render Calculator Tab Content
  function renderCalculatorContent(): string {
    if (calcTab === 'renal') {
      const crcl = calculateCrCl();
      const egfr = calculateCKDEPI();
      return `
        <div class="cdss-calc-grid">
          <div class="cdss-calc-inputs">
            <div class="cdss-calc-form-group">
              <label>Tuổi (năm):</label>
              <input type="number" id="calc-age" class="cdss-calc-input" value="${calcData.age}" min="1" max="120" />
            </div>
            <div class="cdss-calc-form-group">
              <label>Giới tính:</label>
              <div class="cdss-calc-radio-group">
                <label><input type="radio" name="calc-sex" value="male" ${calcData.sex === 'male' ? 'checked' : ''} /> Nam</label>
                <label><input type="radio" name="calc-sex" value="female" ${calcData.sex === 'female' ? 'checked' : ''} /> Nữ</label>
              </div>
            </div>
            <div class="cdss-calc-form-group">
              <label>Cân nặng (kg):</label>
              <input type="number" id="calc-weight" class="cdss-calc-input" value="${calcData.weight}" min="10" max="300" />
            </div>
            <div class="cdss-calc-form-group">
              <label>Serum Creatinine (µmol/L):</label>
              <input type="number" id="calc-scr" class="cdss-calc-input" value="${calcData.scr}" min="10" max="2000" />
            </div>
          </div>

          <div class="cdss-calc-results-card" id="calc-results-panel">
            <h5 class="cdss-calc-res-title">Kết Quả Chức Năng Thận</h5>
            <div class="cdss-calc-metrics">
              <div class="cdss-metric-box">
                <span class="cdss-metric-label">Cockcroft-Gault (CrCl)</span>
                <span class="cdss-metric-val ${crcl < 30 ? 'text-red-500' : crcl < 60 ? 'text-amber-500' : 'text-teal-600'}">
                  ${crcl} <small>mL/phút</small>
                </span>
                <span class="cdss-metric-sub">Dùng hiệu chỉnh liều kháng sinh &amp; Vancomycin</span>
              </div>

              <div class="cdss-metric-box">
                <span class="cdss-metric-label">CKD-EPI 2021 (eGFR)</span>
                <span class="cdss-metric-val ${egfr < 30 ? 'text-red-500' : egfr < 60 ? 'text-amber-500' : 'text-teal-600'}">
                  ${egfr} <small>mL/phút/1.73m²</small>
                </span>
                <span class="cdss-metric-sub">Phân giai đoạn bệnh thận mạn (KDIGO)</span>
              </div>
            </div>

            <div class="cdss-calc-nav-hint">
              <i class="fa-solid fa-arrow-right text-teal-600"></i>
              <a href="antibiotic/index.html" class="cdss-calc-link">Chuyển sang phân hệ InfectoDose 43 Kháng Sinh &gt;</a>
            </div>
          </div>
        </div>
      `;
    }

    if (calcTab === 'body') {
      const { bmi, ibw, adjbw, cat } = calculateBMI();
      return `
        <div class="cdss-calc-grid">
          <div class="cdss-calc-inputs">
            <div class="cdss-calc-form-group">
              <label>Chiều cao (cm):</label>
              <input type="number" id="calc-height" class="cdss-calc-input" value="${calcData.height}" min="50" max="250" />
            </div>
            <div class="cdss-calc-form-group">
              <label>Cân nặng thực tế (kg):</label>
              <input type="number" id="calc-weight-body" class="cdss-calc-input" value="${calcData.weight}" min="10" max="300" />
            </div>
            <div class="cdss-calc-form-group">
              <label>Giới tính:</label>
              <div class="cdss-calc-radio-group">
                <label><input type="radio" name="calc-sex-body" value="male" ${calcData.sex === 'male' ? 'checked' : ''} /> Nam</label>
                <label><input type="radio" name="calc-sex-body" value="female" ${calcData.sex === 'female' ? 'checked' : ''} /> Nữ</label>
              </div>
            </div>
          </div>

          <div class="cdss-calc-results-card" id="calc-results-panel">
            <h5 class="cdss-calc-res-title">Chỉ Số Nhân Trắc &amp; Liều Dùng</h5>
            <div class="cdss-calc-metrics">
              <div class="cdss-metric-box">
                <span class="cdss-metric-label">BMI Thể Trạng: <strong>${cat}</strong></span>
                <span class="cdss-metric-val ${bmi >= 30 ? 'text-red-500' : bmi >= 25 ? 'text-amber-500' : 'text-teal-600'}">
                  ${bmi} <small>kg/m²</small>
                </span>
              </div>

              <div class="cdss-metric-box">
                <span class="cdss-metric-label">Cân Nặng Lý Tưởng (IBW Devine)</span>
                <span class="cdss-metric-val">${ibw} <small>kg</small></span>
              </div>

              <div class="cdss-metric-box">
                <span class="cdss-metric-label">Cân Nặng Hiệu Chỉnh (AdjBW 40%)</span>
                <span class="cdss-metric-val">${adjbw} <small>kg</small></span>
                <span class="cdss-metric-sub">Sử dụng khi bệnh nhân béo phì (TBW &gt; 120% IBW)</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (calcTab === 'map') {
      const { map, isHypotension } = calculateMAP();
      return `
        <div class="cdss-calc-grid">
          <div class="cdss-calc-inputs">
            <div class="cdss-calc-form-group">
              <label>Huyết áp tâm thu (SBP mmHg):</label>
              <input type="number" id="calc-sbp" class="cdss-calc-input" value="${calcData.sbp}" min="40" max="300" />
            </div>
            <div class="cdss-calc-form-group">
              <label>Huyết áp tâm trương (DBP mmHg):</label>
              <input type="number" id="calc-dbp" class="cdss-calc-input" value="${calcData.dbp}" min="20" max="200" />
            </div>
          </div>

          <div class="cdss-calc-results-card" id="calc-results-panel">
            <h5 class="cdss-calc-res-title">Huyết Áp Động Mạch Trung Bình (MAP)</h5>
            <div class="cdss-calc-metrics">
              <div class="cdss-metric-box">
                <span class="cdss-metric-label">Công thức: MAP = [SBP + (2 × DBP)] / 3</span>
                <span class="cdss-metric-val ${isHypotension ? 'text-red-500' : 'text-teal-600'}">
                  ${map} <small>mmHg</small>
                </span>
                ${isHypotension ? `
                  <div class="cdss-alert-strip-red">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <span><strong>CẢNH BÁO TỤT HUYẾT ÁP (MAP &lt; 65 mmHg):</strong> Nguy cơ giảm tưới máu tạng, kích hoạt hồi sức dịch Sepsis / Vận mạch!</span>
                  </div>
                ` : `
                  <span class="cdss-metric-sub text-emerald-600">✓ Đạt đích tưới máu mô tối thiểu (MAP ≥ 65 mmHg)</span>
                `}
              </div>
            </div>

            <div class="cdss-calc-nav-hint">
              <i class="fa-solid fa-arrow-right text-teal-600"></i>
              <a href="sepsis/index.html" class="cdss-calc-link">Chuyển sang CDSS Sepsis &amp; Sốc Nhiễm Khuẩn &gt;</a>
            </div>
          </div>
        </div>
      `;
    }

    // pf tab
    const { pf, ards, color } = calculatePF();
    return `
      <div class="cdss-calc-grid">
        <div class="cdss-calc-inputs">
          <div class="cdss-calc-form-group">
            <label>PaO2 (mmHg - từ khí máu động mạch):</label>
            <input type="number" id="calc-pao2" class="cdss-calc-input" value="${calcData.pao2}" min="20" max="600" />
          </div>
          <div class="cdss-calc-form-group">
            <label>FiO2 (% - nồng độ oxy hít vào):</label>
            <input type="number" id="calc-fio2" class="cdss-calc-input" value="${calcData.fio2}" min="21" max="100" />
            <span class="cdss-input-subtext">Khí phòng: 21%, Canula 1-6L: 24-44%, Mask: 40-100%</span>
          </div>
        </div>

        <div class="cdss-calc-results-card" id="calc-results-panel">
          <h5 class="cdss-calc-res-title">Chỉ Số Oxy Hóa Máu (Horowitz P/F Ratio)</h5>
          <div class="cdss-calc-metrics">
            <div class="cdss-metric-box">
              <span class="cdss-metric-label">Tỷ Số PaO2 / FiO2</span>
              <span class="cdss-metric-val" style="color: ${color};">
                ${pf} <small>mmHg</small>
              </span>
              <div class="cdss-metric-sub" style="font-weight: 700; color: ${color};">
                ${ards}
              </div>
            </div>
          </div>

          <div class="cdss-calc-nav-hint">
            <i class="fa-solid fa-arrow-right text-teal-600"></i>
            <a href="abg/index.html" class="cdss-calc-link">Phân tích chuyên sâu tại Khí Máu Động Mạch ABG Pro &gt;</a>
          </div>
        </div>
      </div>
    `;
  }

  function updateCalculatorView() {
    const modalBody = document.getElementById('cdss-calc-modal-body');
    if (!modalBody) return;
    
    // Re-render tab buttons active state
    const calcTabBtns = container.querySelectorAll('.cdss-calc-tab');
    calcTabBtns.forEach(btn => {
      const t = btn.getAttribute('data-calc-tab');
      if (t === calcTab) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    modalBody.innerHTML = renderCalculatorContent();
    bindCalculatorInputs();
  }

  type NumericCalcKey = 'age' | 'weight' | 'height' | 'scr' | 'sbp' | 'dbp' | 'pao2' | 'fio2';
  function bindCalculatorInputs() {
    const bindLive = (id: string, key: NumericCalcKey) => {
      const el = document.getElementById(id) as HTMLInputElement;
      if (el) {
        el.addEventListener('input', () => {
          calcData[key] = Number(el.value);
          // Update only results panel for zero-flicker typing
          const panel = document.getElementById('calc-results-panel');
          if (panel) {
            if (calcTab === 'renal') {
              const crcl = calculateCrCl();
              const egfr = calculateCKDEPI();
              panel.innerHTML = `
                <h5 class="cdss-calc-res-title">Kết Quả Chức Năng Thận</h5>
                <div class="cdss-calc-metrics">
                  <div class="cdss-metric-box">
                    <span class="cdss-metric-label">Cockcroft-Gault (CrCl)</span>
                    <span class="cdss-metric-val ${crcl < 30 ? 'text-red-500' : crcl < 60 ? 'text-amber-500' : 'text-teal-600'}">
                      ${crcl} <small>mL/phút</small>
                    </span>
                    <span class="cdss-metric-sub">Dùng hiệu chỉnh liều kháng sinh &amp; Vancomycin</span>
                  </div>
                  <div class="cdss-metric-box">
                    <span class="cdss-metric-label">CKD-EPI 2021 (eGFR)</span>
                    <span class="cdss-metric-val ${egfr < 30 ? 'text-red-500' : egfr < 60 ? 'text-amber-500' : 'text-teal-600'}">
                      ${egfr} <small>mL/phút/1.73m²</small>
                    </span>
                    <span class="cdss-metric-sub">Phân giai đoạn bệnh thận mạn (KDIGO)</span>
                  </div>
                </div>
                <div class="cdss-calc-nav-hint">
                  <i class="fa-solid fa-arrow-right text-teal-600"></i>
                  <a href="antibiotic/index.html" class="cdss-calc-link">Chuyển sang phân hệ InfectoDose 43 Kháng Sinh &gt;</a>
                </div>
              `;
            } else if (calcTab === 'body') {
              const { bmi, ibw, adjbw, cat } = calculateBMI();
              panel.innerHTML = `
                <h5 class="cdss-calc-res-title">Chỉ Số Nhân Trắc &amp; Liều Dùng</h5>
                <div class="cdss-calc-metrics">
                  <div class="cdss-metric-box">
                    <span class="cdss-metric-label">BMI Thể Trạng: <strong>${cat}</strong></span>
                    <span class="cdss-metric-val ${bmi >= 30 ? 'text-red-500' : bmi >= 25 ? 'text-amber-500' : 'text-teal-600'}">
                      ${bmi} <small>kg/m²</small>
                    </span>
                  </div>
                  <div class="cdss-metric-box">
                    <span class="cdss-metric-label">Cân Nặng Lý Tưởng (IBW Devine)</span>
                    <span class="cdss-metric-val">${ibw} <small>kg</small></span>
                  </div>
                  <div class="cdss-metric-box">
                    <span class="cdss-metric-label">Cân Nặng Hiệu Chỉnh (AdjBW 40%)</span>
                    <span class="cdss-metric-val">${adjbw} <small>kg</small></span>
                    <span class="cdss-metric-sub">Sử dụng khi bệnh nhân béo phì (TBW &gt; 120% IBW)</span>
                  </div>
                </div>
              `;
            } else if (calcTab === 'map') {
              const { map, isHypotension } = calculateMAP();
              panel.innerHTML = `
                <h5 class="cdss-calc-res-title">Huyết Áp Động Mạch Trung Bình (MAP)</h5>
                <div class="cdss-calc-metrics">
                  <div class="cdss-metric-box">
                    <span class="cdss-metric-label">Công thức: MAP = [SBP + (2 × DBP)] / 3</span>
                    <span class="cdss-metric-val ${isHypotension ? 'text-red-500' : 'text-teal-600'}">
                      ${map} <small>mmHg</small>
                    </span>
                    ${isHypotension ? `
                      <div class="cdss-alert-strip-red">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <span><strong>CẢNH BÁO TỤT HUYẾT ÁP (MAP &lt; 65 mmHg):</strong> Nguy cơ giảm tưới máu tạng, kích hoạt hồi sức dịch Sepsis / Vận mạch!</span>
                      </div>
                    ` : `
                      <span class="cdss-metric-sub text-emerald-600">✓ Đạt đích tưới máu mô tối thiểu (MAP ≥ 65 mmHg)</span>
                    `}
                  </div>
                </div>
                <div class="cdss-calc-nav-hint">
                  <i class="fa-solid fa-arrow-right text-teal-600"></i>
                  <a href="sepsis/index.html" class="cdss-calc-link">Chuyển sang CDSS Sepsis &amp; Sốc Nhiễm Khuẩn &gt;</a>
                </div>
              `;
            } else if (calcTab === 'pf') {
              const { pf, ards, color } = calculatePF();
              panel.innerHTML = `
                <h5 class="cdss-calc-res-title">Chỉ Số Oxy Hóa Máu (Horowitz P/F Ratio)</h5>
                <div class="cdss-calc-metrics">
                  <div class="cdss-metric-box">
                    <span class="cdss-metric-label">Tỷ Số PaO2 / FiO2</span>
                    <span class="cdss-metric-val" style="color: ${color};">
                      ${pf} <small>mmHg</small>
                    </span>
                    <div class="cdss-metric-sub" style="font-weight: 700; color: ${color};">
                      ${ards}
                    </div>
                  </div>
                </div>
                <div class="cdss-calc-nav-hint">
                  <i class="fa-solid fa-arrow-right text-teal-600"></i>
                  <a href="abg/index.html" class="cdss-calc-link">Phân tích chuyên sâu tại Khí Máu Động Mạch ABG Pro &gt;</a>
                </div>
              `;
            }
          }
        });
      }
    };

    bindLive('calc-age', 'age');
    bindLive('calc-weight', 'weight');
    bindLive('calc-weight-body', 'weight');
    bindLive('calc-height', 'height');
    bindLive('calc-scr', 'scr');
    bindLive('calc-sbp', 'sbp');
    bindLive('calc-dbp', 'dbp');
    bindLive('calc-pao2', 'pao2');
    bindLive('calc-fio2', 'fio2');

    const sexRadios = container.querySelectorAll('input[name="calc-sex"], input[name="calc-sex-body"]');
    sexRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        calcData.sex = (e.target as HTMLInputElement).value;
        updateCalculatorView();
      });
    });
  }

  function attachEvents() {
    // 1. Search Input
    const searchInput = document.getElementById('cdss-search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        searchQuery = target.value;
        const cursor = target.selectionStart;
        render();
        const updated = document.getElementById('cdss-search-input') as HTMLInputElement;
        if (updated) {
          updated.focus();
          if (cursor !== null) updated.setSelectionRange(cursor, cursor);
        }
      });
    }

    // 2. Clear Search Button
    const clearBtn = document.getElementById('cdss-clear-search');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchQuery = '';
        render();
      });
    }

    // 3. Category Buttons
    const catBtns = container.querySelectorAll('.cdss-cat-btn');
    catBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-cat') || 'all';
        activeCategory = cat;
        render();
      });
    });

    // 4. View Mode Switcher
    const viewBtns = container.querySelectorAll('.cdss-view-icon-btn');
    viewBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode') as ViewMode;
        if (mode && mode !== viewMode) {
          viewMode = mode;
          setStoredViewMode(mode);
          render();
        }
      });
    });

    // 5. Calculator Modal Close
    const closeCalcBtn = document.getElementById('cdss-close-calc');
    if (closeCalcBtn) {
      closeCalcBtn.addEventListener('click', () => {
        isCalculatorOpen = false;
        render();
      });
    }

    const calcOverlay = document.getElementById('cdss-calc-overlay');
    if (calcOverlay) {
      calcOverlay.addEventListener('click', (e) => {
        if (e.target === calcOverlay) {
          isCalculatorOpen = false;
          render();
        }
      });
    }

    // 6. Calculator Tab Switchers & Form Inputs
    const calcTabBtns = container.querySelectorAll('.cdss-calc-tab');
    calcTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const t = btn.getAttribute('data-calc-tab') as 'renal' | 'body' | 'map' | 'pf';
        if (t) {
          calcTab = t;
          updateCalculatorView();
        }
      });
    });

    bindCalculatorInputs();

    // 7. Shortcuts Modal Close
    const closeShortcutsBtn = document.getElementById('cdss-close-shortcuts');
    if (closeShortcutsBtn) {
      closeShortcutsBtn.addEventListener('click', () => {
        isShortcutsOpen = false;
        render();
      });
    }

    const shortcutsOverlay = document.getElementById('cdss-shortcuts-overlay');
    if (shortcutsOverlay) {
      shortcutsOverlay.addEventListener('click', (e) => {
        if (e.target === shortcutsOverlay) {
          isShortcutsOpen = false;
          render();
        }
      });
    }

    // 8. Info / Guideline Modal Triggers
    const infoBtns = container.querySelectorAll('.cdss-info-trigger-btn, .cdss-tile-info-btn, [data-info-slug]');
    infoBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const slug = btn.getAttribute('data-info-slug');
        if (slug) {
          infoModalSlug = slug;
          render();
        }
      });
    });

    const closeInfoBtn = document.getElementById('cdss-close-info');
    if (closeInfoBtn) {
      closeInfoBtn.addEventListener('click', () => {
        infoModalSlug = null;
        render();
      });
    }

    const infoOverlay = document.getElementById('cdss-info-overlay');
    if (infoOverlay) {
      infoOverlay.addEventListener('click', (e) => {
        if (e.target === infoOverlay) {
          infoModalSlug = null;
          render();
        }
      });
    }

    // 9. Star Pin Buttons
    const pinBtns = container.querySelectorAll('[data-pin-slug]');
    pinBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const slug = btn.getAttribute('data-pin-slug');
        if (!slug) return;

        if (pinnedSlugs.includes(slug)) {
          pinnedSlugs = pinnedSlugs.filter(s => s !== slug);
        } else {
          pinnedSlugs = [...pinnedSlugs, slug];
        }
        setPinnedSlugs(pinnedSlugs);
        render();
      });
    });

    // 10. Unpin from Chip
    const unpinBtns = container.querySelectorAll('[data-unpin-slug]');
    unpinBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const slug = btn.getAttribute('data-unpin-slug');
        if (slug) {
          pinnedSlugs = pinnedSlugs.filter(s => s !== slug);
          setPinnedSlugs(pinnedSlugs);
          render();
        }
      });
    });

    // 11. Record Recent on link click
    const toolLinks = container.querySelectorAll('a[data-slug]');
    toolLinks.forEach(link => {
      link.addEventListener('click', () => {
        const slug = link.getAttribute('data-slug');
        if (slug) {
          recordRecentSlug(slug);
        }
      });
    });

    // 12. Reset filters
    const resetTagBtns = container.querySelectorAll('[data-reset]');
    resetTagBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-reset');
        if (target === 'category') activeCategory = 'all';
        if (target === 'search') searchQuery = '';
        render();
      });
    });

    const resetFiltersBtn = document.getElementById('cdss-reset-filters-btn');
    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener('click', () => {
        activeCategory = 'all';
        searchQuery = '';
        render();
      });
    }

    const emptyResetBtn = document.getElementById('cdss-empty-reset');
    if (emptyResetBtn) {
      emptyResetBtn.addEventListener('click', () => {
        activeCategory = 'all';
        searchQuery = '';
        render();
      });
    }

    // 13. Whole Card Click (except buttons/links)
    const cards = container.querySelectorAll('.cdss-card-clean');
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('a')) return;
        const slug = card.getAttribute('data-slug');
        const meta = CDSS_MODULES.find(m => m.slug === slug);
        if (meta && meta.standaloneUrl) {
          recordRecentSlug(meta.slug);
          window.location.href = meta.standaloneUrl;
        }
      });
    });
  }

  // Bind Navbar Elements (ONLY ONCE outside render)
  const navCalcBtn = document.getElementById('nav-calc-btn');
  if (navCalcBtn) {
    navCalcBtn.addEventListener('click', (e) => {
      e.preventDefault();
      isCalculatorOpen = !isCalculatorOpen;
      render();
    });
  }

  const navStatBtn = document.getElementById('nav-stat-btn');
  if (navStatBtn) {
    navStatBtn.addEventListener('click', (e) => {
      e.preventDefault();
      activeCategory = activeCategory === 'stat' ? 'all' : 'stat';
      render();
    });
  }

  const navShortcutsBtn = document.getElementById('nav-shortcuts-btn');
  if (navShortcutsBtn) {
    navShortcutsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      isShortcutsOpen = true;
      render();
    });
  }

  // Global Keyboard Shortcuts (bound once)
  document.addEventListener('keydown', (e) => {
    // 1. / key: Search focus
    if (e.key === '/' && 
        document.activeElement?.tagName !== 'INPUT' && 
        document.activeElement?.tagName !== 'TEXTAREA') {
      e.preventDefault();
      const input = document.getElementById('cdss-search-input') as HTMLInputElement;
      if (input) {
        input.focus();
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    // 2. Alt+C: Toggle Bedside Calculator
    if (e.altKey && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      isCalculatorOpen = !isCalculatorOpen;
      render();
    }

    // 3. Alt+S: Toggle STAT
    if (e.altKey && e.key.toLowerCase() === 's') {
      e.preventDefault();
      activeCategory = activeCategory === 'stat' ? 'all' : 'stat';
      render();
    }

    // 4. ?: Shortcuts help
    if (e.key === '?' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
      e.preventDefault();
      isShortcutsOpen = true;
      render();
    }

    // 5. Esc: Close modals or search
    if (e.key === 'Escape') {
      if (isCalculatorOpen || isShortcutsOpen || infoModalSlug) {
        isCalculatorOpen = false;
        isShortcutsOpen = false;
        infoModalSlug = null;
        render();
      } else if (searchQuery) {
        searchQuery = '';
        render();
      }
    }
  });

  // Initial render
  render();
}

// Auto-initialize when window loads or DOM is ready
if (typeof window !== 'undefined') {
  (window as any).initCDSSHub = initCDSSHub;
  (window as any).CDSS_MODULES = CDSS_MODULES;
  (window as any).getCDSSModuleById = getCDSSModuleById;
  (window as any).getCDSSModuleBySlug = getCDSSModuleBySlug;

  const runInit = () => {
    if (document.getElementById('cdss-hub-app')) {
      initCDSSHub('cdss-hub-app');
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runInit);
  } else {
    runInit();
  }
}
