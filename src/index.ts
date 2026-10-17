/**
 * CDSS Standalone Suite — Master Hub Application
 * Redesigned Modern Clinical Command Center & Multi-View Decision Support Portal
 * Styled according to HepaCDSS Medical Aesthetics & Evidence-Based Guidelines
 */
import { CDSS_MODULES, getCDSSModuleById, getCDSSModuleBySlug } from './cdss-registry';
import { CDSSModuleMeta } from './cdss-types';

export * from './cdss-types';
export * from './cdss-registry';

type ViewMode = 'grid' | 'grouped' | 'matrix';

interface ClinicalScenario {
  id: string;
  icon: string;
  label: string;
  trigger: string;
  targetSlug: string;
  colorClass: string;
}

const CLINICAL_SCENARIOS: ClinicalScenario[] = [
  {
    id: 'sepsis-shock',
    icon: 'fa-solid fa-biohazard',
    label: 'Nhiễm Khuẩn Huyết & Sốc',
    trigger: 'Sốt cao, tụt huyết áp, lactate > 2 mmol/L, SOFA/Phoenix tăng',
    targetSlug: 'sepsis',
    colorClass: 'cdss-emblem--resuscitation'
  },
  {
    id: 'abg-acidbase',
    icon: 'fa-solid fa-lungs',
    label: 'Khí Máu Động Mạch & Toan Kiềm',
    trigger: 'Khó thở, PaO2/PaCO2 biến thiên, toan chuyển hóa Anion Gap',
    targetSlug: 'abg',
    colorClass: 'cdss-emblem--respiratory'
  },
  {
    id: 'hepa-biochem',
    icon: 'fa-solid fa-virus',
    label: 'Sinh Hóa Gan & Vàng Da Ứ Mật',
    trigger: 'ALT/AST tăng vọt, De Ritis, tính tỷ số R-ratio, xơ hóa FIB-4/APRI',
    targetSlug: 'hepa',
    colorClass: 'cdss-emblem--gastroenterology'
  },
  {
    id: 'abx-renal',
    icon: 'fa-solid fa-viruses',
    label: 'Kháng Sinh & Chỉnh Liều Thận',
    trigger: 'Tiêu chuẩn NHSN, vi khuẩn đa kháng MDR & chỉnh 43 KS theo CrCl',
    targetSlug: 'antibiotic',
    colorClass: 'cdss-emblem--pharmacology'
  },
  {
    id: 'vancomycin-tdm',
    icon: 'fa-solid fa-syringe',
    label: 'Vancomycin PK & Giám Sát TDM',
    trigger: 'Liều nạp 25-35 mg/kg, mục tiêu AUC24/MIC 400-600, lọc máu IHD',
    targetSlug: 'vancomycin',
    colorClass: 'cdss-emblem--pharmacology'
  },
  {
    id: 'diacare-insulin',
    icon: 'fa-solid fa-syringe',
    label: 'Đường Huyết & Insulin Nội Viện',
    trigger: 'Phác đồ Basal-Bolus, phác đồ trượt SSI, cấp cứu toan ceton DKA/HHS',
    targetSlug: 'diacare',
    colorClass: 'cdss-emblem--endocrinology'
  },
  {
    id: 'dengue-shock',
    icon: 'fa-solid fa-droplet',
    label: 'SXHD Dengue & Chống Sốc',
    trigger: 'SXHD ngày 4-6, cô đặc máu Hct cao, cọc dịch 4 cột động học BYT',
    targetSlug: 'dengue',
    colorClass: 'cdss-emblem--cardiology'
  },
  {
    id: 'ecg-stemi',
    icon: 'fa-solid fa-heart-pulse',
    label: 'Điện Tim 12 Đạo Trình & STEMI',
    trigger: 'Đo trục điện tim, QT/QTc, thước Caliper, định khu nhồi máu & Brugada',
    targetSlug: 'ecg',
    colorClass: 'cdss-emblem--cardiology'
  },
  {
    id: 'inpatient-exam',
    icon: 'fa-solid fa-stethoscope',
    label: 'Khám Lâm Sàng & Bệnh Sử Nội Trú',
    trigger: 'Hỏi bệnh 7 thuộc tính (OPQRST), khám hệ cơ quan Bates & Macleod',
    targetSlug: 'inpatient',
    colorClass: 'cdss-emblem--internal'
  }
];

export function initCDSSHub(containerId: string): void {
  const container = document.getElementById(containerId);
  if (!container) return;

  let activeCategory = 'all';
  let searchQuery = '';
  let viewMode: ViewMode = 'grid';

  const categories = [
    { id: 'all', name: 'Tất Cả (9 CDSS)', icon: 'fa-solid fa-shapes' },
    { id: 'resuscitation', name: 'Hồi Sức Cấp Cứu', icon: 'fa-solid fa-biohazard' },
    { id: 'cardiology', name: 'Tim Mạch & Điện Tim', icon: 'fa-solid fa-heart-pulse' },
    { id: 'respiratory', name: 'Hô Hấp & Khí Máu', icon: 'fa-solid fa-lungs' },
    { id: 'pharmacology', name: 'Kháng Sinh & Dược Lý', icon: 'fa-solid fa-viruses' },
    { id: 'gastroenterology', name: 'Tiêu Hóa & Gan Mật', icon: 'fa-solid fa-virus' },
    { id: 'endocrinology', name: 'Nội Tiết & Đường Huyết', icon: 'fa-solid fa-syringe' },
    { id: 'internal', name: 'Khám Bệnh Nội Khoa', icon: 'fa-solid fa-stethoscope' }
  ];

  const specialtyGroups = [
    {
      id: 'resus-emer',
      title: 'Hồi Sức Cấp Cứu & Bệnh Nhiễm Trùng Nguy Kịch',
      desc: 'Phác đồ hồi sức chống sốc SXHD, phân tầng nhiễm khuẩn huyết và hướng dẫn kháng sinh ban đầu',
      icon: 'fa-solid fa-truck-medical',
      slugs: ['sepsis', 'dengue', 'antibiotic']
    },
    {
      id: 'cardio-resp',
      title: 'Tim Mạch, Hô Hấp & Cân Bằng Nội Môi',
      desc: 'Phân tích điện tâm đồ 12 chuyển đạo, khí máu động mạch và thăng bằng toan kiềm',
      icon: 'fa-solid fa-heart-pulse',
      slugs: ['ecg', 'abg']
    },
    {
      id: 'hepato-endocrine',
      title: 'Tiêu Hóa - Gan Mật & Chuyển Hóa Nội Tiết',
      desc: 'Tiếp cận sinh hóa gan theo ACG, định lượng R-ratio và kiểm soát insulin nội viện',
      icon: 'fa-solid fa-virus',
      slugs: ['hepa', 'diacare']
    },
    {
      id: 'pharma-internal',
      title: 'Dược Động Học Kháng Sinh & Khám Bệnh Nội Khoa',
      desc: 'Cá thể hóa liều Vancomycin TDM và kỹ năng tiếp cận triệu chứng lâm sàng nội trú Bates',
      icon: 'fa-solid fa-stethoscope',
      slugs: ['vancomycin', 'inpatient']
    }
  ];

  function render() {
    const q = searchQuery.toLowerCase().trim();
    const filtered = CDSS_MODULES.filter(m => {
      const matchCat = activeCategory === 'all' || m.category === activeCategory;
      const matchSearch = !q || 
        m.title.toLowerCase().includes(q) ||
        (m.titleEn && m.titleEn.toLowerCase().includes(q)) ||
        m.shortDesc.toLowerCase().includes(q) ||
        m.guidelineSource.toLowerCase().includes(q) ||
        (m.features && m.features.some(f => f.toLowerCase().includes(q))) ||
        (m.icd10 && m.icd10.some(c => c.toLowerCase().includes(q)));
      return matchCat && matchSearch;
    });

    container.innerHTML = `
      <div class="cdss-hub-workspace">
        
        <!-- ================================================================
             1. HERO COMMAND CENTER (HepaCDSS Light Medical Aesthetics)
             ================================================================ -->
        <section class="cdss-hero-container">
          <div class="cdss-hero-top">
            <div class="cdss-hero-pill">
              <span class="cdss-hero-pulse-dot"></span>
              <span>HỆ THỐNG CDSS BEDSIDE • CHUẨN Y HỌC CHỨNG CỨ (EBM)</span>
            </div>

            <div class="cdss-hero-meta-badge">
              <i class="fa-solid fa-shield-halved"></i>
              <span>100% Xử Lý Trực Tiếp Tại Trình Duyệt • Không Lưu Trữ PII</span>
            </div>
          </div>

          <h1 class="cdss-hero-title">
            Hệ Sinh Thái Quyết Định Lâm Sàng <span class="highlight">Chuẩn Hóa Y Khoa</span>
          </h1>

          <p class="cdss-hero-desc">
            Nền tảng tích hợp 9 module CDSS độc lập chuyên sâu với giao diện chuẩn hóa: tính toán liều 43 kháng sinh, phác đồ dịch truyền chống sốc SXHD Dengue, phân tích khí máu ABG 6 bước, đánh giá sinh hóa gan theo ACG, phân tầng Sepsis, quản lý Vancomycin AUC/MIC, kiểm soát insulin nội viện và khám bệnh nội trú Bates &amp; Macleod.
          </p>

          <!-- Suite Bedside Metrics Strip -->
          <div class="cdss-metrics-strip">
            <div class="cdss-metric-card">
              <div class="cdss-metric-icon cdss-metric-icon--teal">
                <i class="fa-solid fa-shapes"></i>
              </div>
              <div>
                <div class="cdss-metric-num">9</div>
                <div class="cdss-metric-label">Module Chuyên Khoa</div>
              </div>
            </div>

            <div class="cdss-metric-card">
              <div class="cdss-metric-icon cdss-metric-icon--emerald">
                <i class="fa-solid fa-pills"></i>
              </div>
              <div>
                <div class="cdss-metric-num">43</div>
                <div class="cdss-metric-label">Kháng Sinh Chỉnh Liều</div>
              </div>
            </div>

            <div class="cdss-metric-card">
              <div class="cdss-metric-icon cdss-metric-icon--cyan">
                <i class="fa-solid fa-book-medical"></i>
              </div>
              <div>
                <div class="cdss-metric-num">45+</div>
                <div class="cdss-metric-label">Ca Lâm Sàng Mẫu</div>
              </div>
            </div>

            <div class="cdss-metric-card">
              <div class="cdss-metric-icon cdss-metric-icon--amber">
                <i class="fa-solid fa-hospital-user"></i>
              </div>
              <div>
                <div class="cdss-metric-num">100%</div>
                <div class="cdss-metric-label">Bảo Mật Người Bệnh</div>
              </div>
            </div>
          </div>
        </section>

        <!-- ================================================================
             2. CLINICAL EMERGENCY & TRIAGE SCENARIOS (Quick Bedside Launcher)
             ================================================================ -->
        <section class="cdss-triage-panel" id="cdss-clinical-scenarios">
          <div class="cdss-triage-top">
            <div class="cdss-triage-heading">
              <i class="fa-solid fa-bolt-lightning"></i>
              <span>Tra Cứu Nhanh Theo Tình Huống Lâm Sàng Khẩn Cấp</span>
            </div>
            <span class="cdss-triage-tag">9 Tình Huống Phổ Biến</span>
          </div>

          <div class="cdss-scenarios-grid">
            ${CLINICAL_SCENARIOS.map(sc => `
              <a href="${sc.targetSlug}/index.html" class="cdss-scenario-card" title="Mở module ${sc.label}">
                <div class="cdss-scenario-icon ${sc.colorClass}">
                  <i class="${sc.icon}"></i>
                </div>
                <div class="cdss-scenario-content">
                  <div class="cdss-scenario-title">${sc.label}</div>
                  <div class="cdss-scenario-desc">${sc.trigger}</div>
                </div>
                <i class="fa-solid fa-arrow-right cdss-scenario-arrow"></i>
              </a>
            `).join('')}
          </div>
        </section>

        <!-- ================================================================
             3. SEARCH & CATEGORY FILTER TOOLBAR
             ================================================================ -->
        <section class="cdss-toolbar">
          <!-- Search Box -->
          <div class="cdss-search-wrap">
            <i class="fa-solid fa-magnifying-glass cdss-search-icon"></i>
            <input 
              id="cdss-search-input" 
              type="text" 
              class="cdss-search-input"
              placeholder="Tra cứu theo tên CDSS, thuốc, bệnh lý, phác đồ, ICD-10 (nhấn / để tìm nhanh)..." 
              value="${searchQuery}"
              autocomplete="off"
            />
            ${searchQuery ? `
              <button id="cdss-clear-search" class="cdss-search-clear" title="Xóa tìm kiếm">
                <i class="fa-solid fa-xmark"></i>
              </button>
            ` : `
              <span class="cdss-search-hint">/</span>
            `}
          </div>

          <!-- Controls Row: Category Tabs & View Switcher -->
          <div class="cdss-controls-row">
            <div class="cdss-cat-tabs">
              ${categories.map(cat => `
                <button 
                  class="cdss-cat-btn ${activeCategory === cat.id ? 'active' : ''}" 
                  data-cat="${cat.id}"
                >
                  <i class="${cat.icon}"></i>
                  <span>${cat.name}</span>
                  ${cat.id === 'all' ? `<span class="cdss-cat-badge">${CDSS_MODULES.length}</span>` : ''}
                </button>
              `).join('')}
            </div>

            <div class="cdss-view-switcher">
              <button 
                class="cdss-view-btn ${viewMode === 'grid' ? 'active' : ''}" 
                data-mode="grid"
                title="Xem dạng Lưới Thẻ Chuẩn HepaCDSS"
                aria-label="Xem dạng Lưới"
              >
                <i class="fa-solid fa-table-cells-large"></i>
              </button>

              <button 
                class="cdss-view-btn ${viewMode === 'grouped' ? 'active' : ''}" 
                data-mode="grouped"
                title="Xem theo Khối Chuyên Khoa Điều Trị"
                aria-label="Xem theo Phân Khoa"
              >
                <i class="fa-solid fa-layer-group"></i>
              </button>

              <button 
                class="cdss-view-btn ${viewMode === 'matrix' ? 'active' : ''}" 
                data-mode="matrix"
                title="Xem Bảng Ma Trận Lâm Sàng & ICD-10"
                aria-label="Xem Bảng Ma Trận"
              >
                <i class="fa-solid fa-table-list"></i>
              </button>
            </div>
          </div>
        </section>

        <!-- Results Counter & Reset Action -->
        <div class="cdss-results-strip">
          <div>
            Hiển thị <strong>${filtered.length}</strong> / <strong>${CDSS_MODULES.length}</strong> công cụ hỗ trợ quyết định
            ${activeCategory !== 'all' ? ` • Chuyên khoa: <em>${categories.find(c => c.id === activeCategory)?.name}</em>` : ''}
            ${q ? ` • Từ khóa: "<em>${q}</em>"` : ''}
          </div>
          ${(activeCategory !== 'all' || q) ? `
            <button id="cdss-reset-filters" class="cdss-reset-btn" title="Đặt lại bộ lọc (Hiển thị tất cả)" aria-label="Đặt lại bộ lọc">
              <i class="fa-solid fa-rotate-left"></i>
            </button>
          ` : ''}
        </div>

        <!-- ================================================================
             4. MAIN WORKSPACE CONTENT (CARD GRID / GROUPED / MATRIX)
             ================================================================ -->
        ${filtered.length === 0 ? `
          <div style="text-align:center; padding: 4rem 1rem; background: var(--color-surface); border: 1px dashed var(--color-border); border-radius: 20px;">
            <i class="fa-solid fa-magnifying-glass" style="font-size: 2.5rem; color: var(--color-text-muted); opacity: 0.5; margin-bottom: 1rem;"></i>
            <h3 style="font-family: var(--cdss-font-display); font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">Không tìm thấy công cụ CDSS phù hợp</h3>
            <p style="color: var(--color-text-muted); max-width: 500px; margin: 0 auto 1.5rem; font-size: 0.9rem;">
              Thử tìm kiếm với tên thuốc (Vancomycin, Meropenem), chỉ số lâm sàng (R-ratio, FIB-4, SOFA, PaO2) hoặc mã ICD-10.
            </p>
            <button id="cdss-empty-reset-btn" class="cdss-btn-teal">
              <i class="fa-solid fa-arrows-rotate"></i> Xem lại tất cả 9 CDSS
            </button>
          </div>
        ` : ''}

        <!-- VIEW 1: MODERN GRID VIEW (DEFAULT - HepaCDSS Standard) -->
        ${viewMode === 'grid' && filtered.length > 0 ? `
          <div class="cdss-cards-grid">
            ${filtered.map(m => renderModuleCard(m)).join('')}
          </div>
        ` : ''}

        <!-- VIEW 2: GROUPED SPECIALTY VIEW -->
        ${viewMode === 'grouped' && filtered.length > 0 ? `
          <div>
            ${specialtyGroups.map(grp => {
              const groupModules = filtered.filter(m => grp.slugs.includes(m.slug));
              if (groupModules.length === 0) return '';
              return `
                <div class="cdss-group-card">
                  <div class="cdss-group-header-row">
                    <div class="cdss-group-title-wrap">
                      <div class="cdss-group-icon">
                        <i class="${grp.icon}"></i>
                      </div>
                      <div>
                        <h3 class="cdss-group-title">${grp.title}</h3>
                        <p class="cdss-group-desc">${grp.desc}</p>
                      </div>
                    </div>
                    <span class="cdss-badge cdss-badge--teal">${groupModules.length} Modules</span>
                  </div>

                  <div class="cdss-cards-grid" style="margin-bottom:0;">
                    ${groupModules.map(m => renderModuleCard(m)).join('')}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : ''}

        <!-- VIEW 3: CLINICAL MATRIX TABLE VIEW -->
        ${viewMode === 'matrix' && filtered.length > 0 ? `
          <div class="cdss-matrix-wrapper">
            <table class="cdss-matrix-table">
              <thead>
                <tr>
                  <th style="width: 25%;">Công Cụ CDSS</th>
                  <th style="width: 14%;">Chuyên Khoa</th>
                  <th style="width: 32%;">Năng Lực Tính Toán &amp; Thuật Toán</th>
                  <th style="width: 17%;">Cơ Sở Pháp Lý &amp; EBM</th>
                  <th style="width: 12%; text-align: right;">Khởi Chạy</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.map(m => `
                  <tr>
                    <td>
                      <div style="display:flex; align-items:center; gap:0.75rem;">
                        <div class="cdss-card-emblem cdss-emblem--${m.category}" style="width:36px; height:36px; font-size:1rem; border-radius:8px;">
                          <i class="${m.icon}"></i>
                        </div>
                        <div>
                          <a href="${m.standaloneUrl}" style="font-weight:700; color:var(--color-text); text-decoration:none;">
                            ${m.title}
                          </a>
                          ${m.titleEn ? `<div style="font-size:0.75rem; color:var(--color-text-muted); font-style:italic;">${m.titleEn}</div>` : ''}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="cdss-badge cdss-badge--teal">${m.categoryName}</span>
                    </td>
                    <td>
                      <p style="margin:0 0 0.5rem; font-size:0.82rem; color:var(--color-text-muted); line-height:1.5;">${m.shortDesc}</p>
                      ${m.features ? `
                        <div style="display:flex; flex-wrap:wrap; gap:0.3rem;">
                          ${m.features.slice(0, 3).map(f => `<span class="cdss-feature-chip">${f}</span>`).join('')}
                        </div>
                      ` : ''}
                    </td>
                    <td>
                      <div style="font-size:0.78rem; color:var(--color-text-muted); line-height:1.5;">
                        <i class="fa-solid fa-book-medical text-teal-600"></i> ${m.guidelineSource}
                      </div>
                      ${m.icd10 && m.icd10.length > 0 ? `
                        <div style="margin-top:0.35rem; font-size:0.72rem; color:var(--color-text-muted);">
                          ICD-10: ${m.icd10.slice(0, 3).map(c => `<span class="cdss-icd-pill">${c}</span>`).join('')}
                        </div>
                      ` : ''}
                    </td>
                    <td style="text-align: right;">
                      <a href="${m.standaloneUrl}" class="cdss-launch-link" style="padding:0.35rem 0.75rem; font-size:0.78rem;">
                        <span>Mở</span> <i class="fa-solid fa-arrow-right"></i>
                      </a>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}

        <!-- ================================================================
             5. CLINICAL PRACTICE STANDARDS ACCORDION & EBM FOOTER
             ================================================================ -->
        <section class="cdss-ebm-footer-card">
          <div class="cdss-ebm-top-row">
            <div class="cdss-ebm-head">
              <i class="fa-solid fa-shield-halved"></i>
              <span>Tiêu Chuẩn Thực Hành Lâm Sàng &amp; Cơ Sở Pháp Lý Y Khoa</span>
            </div>
            <span class="cdss-badge cdss-badge--emerald">
              <i class="fa-solid fa-check"></i> Tuân thủ Hướng Dẫn Bộ Y Tế &amp; Quốc Tế
            </span>
          </div>

          <div class="cdss-ebm-columns">
            <div class="cdss-ebm-col">
              <h4 class="cdss-ebm-col-title">
                <i class="fa-solid fa-certificate"></i>
                <span>Bộ Y Tế Việt Nam</span>
              </h4>
              <p>
                Tuân thủ Quyết định 2760/QĐ-BYT (Phác đồ SXHD Dengue), Quyết định 5631/QĐ-BYT (Sử dụng kháng sinh), Hướng dẫn Bệnh viện Bệnh Nhiệt Đới eMed 2026 và BVĐK Cà Mau.
              </p>
            </div>

            <div class="cdss-ebm-col">
              <h4 class="cdss-ebm-col-title">
                <i class="fa-solid fa-globe"></i>
                <span>Khuyến Cáo Quốc Tế (EBM)</span>
              </h4>
              <p>
                NICE NG253 (2024/2026), Surviving Sepsis Campaign (SSC), Phoenix Sepsis Criteria 2024, ASHP/IDSA 2020 (Vancomycin AUC/MIC), ADA Standards of Care 2026 và ACG 2017 (Men gan).
              </p>
            </div>

            <div class="cdss-ebm-col">
              <h4 class="cdss-ebm-col-title">
                <i class="fa-solid fa-laptop-medical"></i>
                <span>Độc Lập &amp; An Toàn Dữ Liệu</span>
              </h4>
              <p>
                Toàn bộ thuật toán chạy client-side 100% không gửi dữ liệu người bệnh lên máy chủ bên ngoài, đảm bảo an toàn bí mật y khoa và sẵn sàng sử dụng tại buồng bệnh nội trú hoặc khoa ICU.
              </p>
            </div>
          </div>
        </section>

      </div>
    `;

    // Render individual module card following HepaCDSS refined styling
    function renderModuleCard(m: CDSSModuleMeta): string {
      return `
        <article class="cdss-module-card" data-slug="${m.slug}">
          <!-- Top Row: Badges & Emblem -->
          <div class="cdss-card-top-row">
            <div class="cdss-card-badges-wrap">
              <span class="cdss-badge cdss-badge--teal">${m.categoryName}</span>
              ${m.badge ? `<span class="cdss-badge cdss-badge--emerald">${m.badge}</span>` : ''}
            </div>

            <div class="cdss-card-emblem cdss-emblem--${m.category}">
              <i class="${m.icon}"></i>
            </div>
          </div>

          <!-- Title & Subtitle -->
          <div class="cdss-card-title-group">
            <h3 class="cdss-card-title">
              <a href="${m.standaloneUrl}">${m.title}</a>
            </h3>
            ${m.titleEn ? `<p class="cdss-card-title-en">${m.titleEn}</p>` : ''}
          </div>

          <!-- Description -->
          <p class="cdss-card-desc">${m.shortDesc}</p>

          <!-- Core Clinical Features Chips (HepaCDSS Style) -->
          ${m.features && m.features.length > 0 ? `
            <div class="cdss-feature-chips">
              ${m.features.map(f => `<span class="cdss-feature-chip">${f}</span>`).join('')}
            </div>
          ` : ''}

          <!-- Evidence & ICD-10 Metadata Box -->
          <div class="cdss-evidence-box">
            <div class="cdss-evidence-row">
              <i class="fa-solid fa-book-medical"></i>
              <span title="${m.guidelineSource}">${m.guidelineSource}</span>
            </div>
            ${m.icd10 && m.icd10.length > 0 ? `
              <div class="cdss-evidence-row">
                <i class="fa-solid fa-barcode" style="color:var(--color-text-muted);"></i>
                <span>Mã ICD-10: ${m.icd10.slice(0, 4).map(c => `<span class="cdss-icd-pill">${c}</span>`).join('')}</span>
              </div>
            ` : ''}
          </div>

          <!-- Action Footer -->
          <div class="cdss-card-footer">
            <span class="cdss-card-version">${m.version}</span>
            <a href="${m.standaloneUrl}" class="cdss-launch-link">
              <span>Mở CDSS</span>
              <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </article>
      `;
    }

    // Attach Event Handlers
    attachEvents();
  }

  function attachEvents() {
    // 1. Live Search
    const searchInput = document.getElementById('cdss-search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = (e.target as HTMLInputElement).value;
        render();
        const updatedInput = document.getElementById('cdss-search-input') as HTMLInputElement;
        if (updatedInput) {
          updatedInput.focus();
          updatedInput.selectionStart = updatedInput.selectionEnd = updatedInput.value.length;
        }
      });
    }

    // 2. Clear Search
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

    // 4. View Switcher Buttons
    const modeBtns = container.querySelectorAll('.cdss-view-btn');
    modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode') as ViewMode;
        if (mode) {
          viewMode = mode;
          render();
        }
      });
    });

    // 5. Reset Filter Buttons
    const resetBtn = document.getElementById('cdss-reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        activeCategory = 'all';
        searchQuery = '';
        render();
      });
    }

    const emptyResetBtn = document.getElementById('cdss-empty-reset-btn');
    if (emptyResetBtn) {
      emptyResetBtn.addEventListener('click', () => {
        activeCategory = 'all';
        searchQuery = '';
        render();
      });
    }
  }

  // Keyboard shortcut listener ('/' to focus search)
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
      e.preventDefault();
      const input = document.getElementById('cdss-search-input') as HTMLInputElement;
      if (input) {
        input.focus();
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
