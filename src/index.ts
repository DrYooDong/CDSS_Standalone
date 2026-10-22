/**
 * CDSS Standalone Suite — Master Hub Application
 * Modern Medical Command Center & Bedside Decision Support Portal
 * Aligned with HepaCDSS & SepsisCDSS Clinical Aesthetics
 */
import { CDSS_MODULES, getCDSSModuleById, getCDSSModuleBySlug } from './cdss-registry';
import { CDSSModuleMeta } from './cdss-types';

export * from './cdss-types';
export * from './cdss-registry';

type ViewMode = 'grid' | 'list' | 'grouped';

interface ClinicalTriageChip {
  id: string;
  label: string;
  slug: string;
  icon: string;
  urgency: 'stat' | 'urgent' | 'routine';
  highlightText: string;
}

const TRIAGE_CHIPS: ClinicalTriageChip[] = [
  { id: 'triage-dengue', label: 'Sốc SXHD Dengue', slug: 'dengue', icon: 'fa-solid fa-droplet', urgency: 'stat', highlightText: 'Hct cao, cô đặc máu, sốc tụt HA' },
  { id: 'triage-sepsis', label: 'Sepsis / Sốc Nhiễm Khuẩn', slug: 'sepsis', icon: 'fa-solid fa-biohazard', urgency: 'stat', highlightText: 'Sốt cao, tụt HA, Lactate > 2, SOFA' },
  { id: 'triage-abg', label: 'Khí Máu & Toan Kiềm ABG', slug: 'abg', icon: 'fa-solid fa-lungs', urgency: 'stat', highlightText: 'Toan chuyển hóa, PaO2/PaCO2, Anion Gap' },
  { id: 'triage-ecg', label: 'STEMI & Đo ECG Caliper', slug: 'ecg', icon: 'fa-solid fa-heart-pulse', urgency: 'stat', highlightText: 'Đau ngực, STEMI định khu, QTc, Caliper' },
  { id: 'triage-abx', label: 'Kháng Sinh & Lọc Máu', slug: 'antibiotic', icon: 'fa-solid fa-viruses', urgency: 'urgent', highlightText: '43 KS, chỉnh thận CrCl, vi khuẩn MDR' },
  { id: 'triage-vanco', label: 'Vancomycin AUC/MIC', slug: 'vancomycin', icon: 'fa-solid fa-syringe', urgency: 'urgent', highlightText: 'Liều nạp, AUC 400-600, lọc máu IHD' },
  { id: 'triage-diacare', label: 'Cấp Cứu DKA & Insulin', slug: 'diacare', icon: 'fa-solid fa-vial-circle-check', urgency: 'urgent', highlightText: 'Basal-Bolus, phác đồ trượt SSI, toan ceton' },
  { id: 'triage-hepa', label: 'Sinh Hóa Gan ACG', slug: 'hepa', icon: 'fa-solid fa-virus', urgency: 'routine', highlightText: 'Tỷ số R-ratio, De Ritis, FIB-4, DILI' },
  { id: 'triage-csf', label: 'Dịch Não Tủy CSF', slug: 'csf', icon: 'fa-solid fa-brain', urgency: 'stat', highlightText: 'Viêm màng não, chạm mạch vs SAH, LP' },
  { id: 'triage-bates', label: 'Khám Bệnh Bates & Macleod', slug: 'inpatient', icon: 'fa-solid fa-stethoscope', urgency: 'routine', highlightText: 'Hỏi bệnh 7 thuộc tính OPQRST, 30+ hội chứng' }
];

const PINNED_STORAGE_KEY = 'cdss_pinned_module_slugs';

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

export function initCDSSHub(containerId: string): void {
  const container = document.getElementById(containerId);
  if (!container) return;

  let activeCategory = 'all';
  let searchQuery = '';
  let viewMode: ViewMode = 'grid';
  let pinnedSlugs: string[] = getPinnedSlugs();

  const categories = [
    { id: 'all', name: 'Tất Cả (10 CDSS)', icon: 'fa-solid fa-shapes' },
    { id: 'stat', name: '🚨 Cấp Cứu STAT (5)', icon: 'fa-solid fa-bolt-lightning', isStat: true },
    { id: 'resuscitation', name: 'Hồi Sức Cấp Cứu', icon: 'fa-solid fa-biohazard' },
    { id: 'cardio-resp', name: 'Tim Mạch & Hô Hấp', icon: 'fa-solid fa-heart-pulse' },
    { id: 'pharmacology', name: 'Kháng Sinh & Dược Lý', icon: 'fa-solid fa-viruses' },
    { id: 'gastro-endo', name: 'Tiêu Hóa & Nội Tiết', icon: 'fa-solid fa-virus' },
    { id: 'neuro-internal', name: 'Thần Kinh & Nội Trú', icon: 'fa-solid fa-brain' }
  ];

  const specialtyGroups = [
    {
      id: 'resus-emer',
      title: 'Hồi Sức Cấp Cứu & Nhiễm Trùng Nguy Kịch',
      desc: 'Phác đồ hồi sức chống sốc SXHD Dengue, phân tầng nhiễm khuẩn huyết và khí máu động mạch',
      icon: 'fa-solid fa-truck-medical',
      slugs: ['dengue', 'sepsis', 'abg']
    },
    {
      id: 'cardio-resp',
      title: 'Tim Mạch, Hô Hấp & Điện Tim Chuyên Sâu',
      desc: 'Phân tích điện tâm đồ 12 đạo trình trực quan và thăng bằng toan kiềm cơ thể',
      icon: 'fa-solid fa-heart-pulse',
      slugs: ['ecg', 'abg']
    },
    {
      id: 'pharma-care',
      title: 'Dược Động Học Kháng Sinh & Tối Ưu Hóa Liều',
      desc: 'Cá thể hóa liều 43 kháng sinh theo chức năng thận lọc máu và giám sát nồng độ Vancomycin AUC/MIC',
      icon: 'fa-solid fa-viruses',
      slugs: ['antibiotic', 'vancomycin']
    },
    {
      id: 'internal-specialty',
      title: 'Tiêu Hóa - Gan Mật, Chuyển Hóa & Thần Kinh',
      desc: 'Biện giải sinh hóa gan ACG, quản lý insulin nội viện, chọc dò dịch não tủy và kỹ năng khám lâm sàng Bates',
      icon: 'fa-solid fa-hospital-user',
      slugs: ['hepa', 'diacare', 'csf', 'inpatient']
    }
  ];

  function filterModules(modules: CDSSModuleMeta[]): CDSSModuleMeta[] {
    const q = searchQuery.toLowerCase().trim();
    return modules.filter(m => {
      // Category filter
      let matchCat = false;
      if (activeCategory === 'all') {
        matchCat = true;
      } else if (activeCategory === 'stat') {
        matchCat = m.urgency === 'stat';
      } else if (activeCategory === 'resuscitation') {
        matchCat = m.category === 'resuscitation';
      } else if (activeCategory === 'cardio-resp') {
        matchCat = m.category === 'cardiology' || m.category === 'respiratory';
      } else if (activeCategory === 'pharmacology') {
        matchCat = m.category === 'pharmacology';
      } else if (activeCategory === 'gastro-endo') {
        matchCat = m.category === 'gastroenterology' || m.category === 'endocrinology';
      } else if (activeCategory === 'neuro-internal') {
        matchCat = m.category === 'neurology' || m.category === 'internal';
      } else {
        matchCat = m.category === activeCategory;
      }

      // Search filter
      const matchSearch = !q ||
        m.title.toLowerCase().includes(q) ||
        (m.titleEn && m.titleEn.toLowerCase().includes(q)) ||
        (m.shortTitle && m.shortTitle.toLowerCase().includes(q)) ||
        (m.brandCode && m.brandCode.toLowerCase().includes(q)) ||
        (m.department && m.department.toLowerCase().includes(q)) ||
        (m.statTrigger && m.statTrigger.toLowerCase().includes(q)) ||
        m.shortDesc.toLowerCase().includes(q) ||
        m.guidelineSource.toLowerCase().includes(q) ||
        (m.features && m.features.some(f => f.toLowerCase().includes(q))) ||
        (m.icd10 && m.icd10.some(c => c.toLowerCase().includes(q)));

      return matchCat && matchSearch;
    });
  }

  function render() {
    const filtered = filterModules(CDSS_MODULES);
    const pinnedModules = CDSS_MODULES.filter(m => pinnedSlugs.includes(m.slug));
    const activeCategoryObj = categories.find(c => c.id === activeCategory);

    container.innerHTML = `
      <div class="cdss-hub-workspace">

        <!-- ================================================================
             1. BEDSIDE CLINICAL COMMAND CENTER (Clean HepaCDSS / Sepsis Style)
             ================================================================ -->
        <header class="cdss-command-header">
          <div class="cdss-command-head-row">
            <div class="cdss-command-brand-block">
              <div class="cdss-command-logo-wrap">
                <img src="./shared/cdss-logo.svg" alt="CDSS Suite Logo" class="cdss-command-logo" />
              </div>
              <div>
                <div class="cdss-command-subtag">
                  <span class="cdss-live-dot"></span>
                  <span>Hệ Thống CDSS Độc Lập • Bedside Ready</span>
                  <span class="cdss-ver-tag">v2.5</span>
                </div>
                <h1 class="cdss-command-title">
                  Trung Tâm Hỗ Trợ Quyết Định Lâm Sàng
                </h1>
              </div>
            </div>

            <!-- EBM & Privacy Telemetry Strip -->
            <div class="cdss-command-telemetry">
              <div class="cdss-telemetry-item">
                <i class="fa-solid fa-shapes text-teal-600"></i>
                <div>
                  <div class="cdss-telemetry-val">10 Module</div>
                  <div class="cdss-telemetry-lbl">Chuyên Khoa Sâu</div>
                </div>
              </div>
              <div class="cdss-telemetry-item">
                <i class="fa-solid fa-pills text-emerald-600"></i>
                <div>
                  <div class="cdss-telemetry-val">43 Kháng Sinh</div>
                  <div class="cdss-telemetry-lbl">Chỉnh Thận &amp; Lọc Máu</div>
                </div>
              </div>
              <div class="cdss-telemetry-item">
                <i class="fa-solid fa-shield-halved text-cyan-600"></i>
                <div>
                  <div class="cdss-telemetry-val">100% Client-Side</div>
                  <div class="cdss-telemetry-lbl">Bảo Mật Y Khoa</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Concise Scope Description -->
          <p class="cdss-command-desc">
            Bộ công cụ CDSS hỗ trợ chẩn đoán và điều trị tại giường bệnh chuẩn Y học chứng cứ (EBM) và Bộ Y tế: 
            phác đồ dịch truyền chống sốc SXHD Dengue, phân tích khí máu ABG 6 bước, điện tim 12 chuyển đạo STEMI, 
            sinh hóa gan HepaCDSS theo ACG, phân tầng Sepsis &amp; sốc nhiễm khuẩn NICE/Phoenix, 
            tính liều 43 kháng sinh InfectoDose, Vancomycin PK AUC/MIC, insulin nội viện DiaCare, 
            khám bệnh nội trú Bates &amp; Macleod và biện giải dịch não tủy CSF CDSS.
          </p>

          <!-- ================================================================
               2. RAPID STAT / CLINICAL EMERGENCY ACCESS BAR
               ================================================================ -->
          <div class="cdss-rapid-bar" id="cdss-rapid-bar">
            <div class="cdss-rapid-label">
              <i class="fa-solid fa-bolt-lightning text-amber-500"></i>
              <span>Truy Cập Nhanh Theo Tình Huống:</span>
            </div>
            <div class="cdss-rapid-chips">
              ${TRIAGE_CHIPS.map(chip => `
                <button 
                  class="cdss-rapid-chip cdss-rapid-chip--${chip.urgency}" 
                  data-target-slug="${chip.slug}"
                  title="${chip.label} — ${chip.highlightText}"
                >
                  <i class="${chip.icon}"></i>
                  <span>${chip.label}</span>
                </button>
              `).join('')}
            </div>
          </div>
        </header>

        <!-- ================================================================
             3. PINNED / FAVORITES SECTION (If user pinned any module)
             ================================================================ -->
        ${pinnedModules.length > 0 ? `
          <section class="cdss-pinned-section">
            <div class="cdss-pinned-head">
              <div class="cdss-pinned-title">
                <i class="fa-solid fa-star text-amber-400"></i>
                <span>Công Cụ Thường Dùng Đã Ghim (${pinnedModules.length})</span>
              </div>
              <button id="cdss-clear-pinned-btn" class="cdss-clear-pinned-link" title="Bỏ ghim tất cả">
                <i class="fa-regular fa-trash-can"></i> Bỏ ghim tất cả
              </button>
            </div>
            <div class="cdss-cards-grid cdss-cards-grid--pinned">
              ${pinnedModules.map(m => renderModuleCard(m, true)).join('')}
            </div>
          </section>
        ` : ''}

        <!-- ================================================================
             4. UNIFIED SEARCH & CLINICAL FILTER TOOLBAR
             ================================================================ -->
        <section class="cdss-toolbar">
          <!-- Search Row -->
          <div class="cdss-search-wrap">
            <i class="fa-solid fa-magnifying-glass cdss-search-icon"></i>
            <input 
              id="cdss-search-input" 
              type="text" 
              class="cdss-search-input"
              placeholder="Tra cứu nhanh theo tên CDSS, thuốc, bệnh lý, triệu chứng, mã ICD-10 (nhấn / để tìm)..." 
              value="${searchQuery}"
              autocomplete="off"
              spellcheck="false"
            />
            ${searchQuery ? `
              <button id="cdss-clear-search" class="cdss-search-clear" title="Xóa từ khóa tìm kiếm" aria-label="Xóa tìm kiếm">
                <i class="fa-solid fa-xmark"></i>
              </button>
            ` : `
              <span class="cdss-search-hint" title="Phím tắt tìm kiếm">/</span >
            `}
          </div>

          <!-- Controls Bar: Category Segmented Tabs + View Switcher -->
          <div class="cdss-controls-bar">
            <div class="cdss-cat-tabs">
              ${categories.map(cat => `
                <button 
                  class="cdss-cat-btn ${activeCategory === cat.id ? 'active' : ''} ${cat.isStat ? 'cdss-cat-btn--stat' : ''}" 
                  data-cat="${cat.id}"
                >
                  <i class="${cat.icon}"></i>
                  <span>${cat.name}</span>
                </button>
              `).join('')}
            </div>

            <div class="cdss-view-switcher">
              <button 
                class="cdss-view-btn ${viewMode === 'grid' ? 'active' : ''}" 
                data-mode="grid"
                title="Xem dạng Lưới Thẻ Chuyên Khoa"
                aria-label="Xem dạng Lưới"
              >
                <i class="fa-solid fa-table-cells-large"></i>
                <span class="cdss-view-btn-text">Lưới</span>
              </button>

              <button 
                class="cdss-view-btn ${viewMode === 'list' ? 'active' : ''}" 
                data-mode="list"
                title="Xem dạng Bảng Giường Bệnh Tối Giản"
                aria-label="Xem dạng Bảng"
              >
                <i class="fa-solid fa-table-list"></i>
                <span class="cdss-view-btn-text">Bảng Gọn</span>
              </button>

              <button 
                class="cdss-view-btn ${viewMode === 'grouped' ? 'active' : ''}" 
                data-mode="grouped"
                title="Xem theo Khối Khoa Lâm Sàng"
                aria-label="Xem theo Khối Khoa"
              >
                <i class="fa-solid fa-layer-group"></i>
                <span class="cdss-view-btn-text">Nhóm Khoa</span>
              </button>
            </div>
          </div>
        </section>

        <!-- Results Counter & Reset Filter Indicator -->
        <div class="cdss-results-strip">
          <div class="cdss-results-info">
            <span>Hiển thị <strong>${filtered.length}</strong> / <strong>${CDSS_MODULES.length}</strong> công cụ CDSS</span>
            ${activeCategory !== 'all' ? `
              <span class="cdss-filter-tag">
                ${activeCategoryObj?.name}
                <i class="fa-solid fa-xmark cdss-tag-remove" data-reset="category"></i>
              </span>
            ` : ''}
            ${searchQuery ? `
              <span class="cdss-filter-tag">
                "${searchQuery}"
                <i class="fa-solid fa-xmark cdss-tag-remove" data-reset="search"></i>
              </span>
            ` : ''}
          </div>

          ${(activeCategory !== 'all' || searchQuery) ? `
            <button id="cdss-reset-filters" class="cdss-reset-link" title="Xem lại tất cả công cụ">
              <i class="fa-solid fa-rotate-left"></i> Đặt lại bộ lọc
            </button>
          ` : ''}
        </div>

        <!-- ================================================================
             5. MAIN WORKSPACE CONTENT (GRID / LIST / GROUPED)
             ================================================================ -->
        ${filtered.length === 0 ? `
          <div class="cdss-empty-state">
            <div class="cdss-empty-icon">
              <i class="fa-solid fa-magnifying-glass"></i>
            </div>
            <h3 class="cdss-empty-title">Không tìm thấy công cụ CDSS phù hợp</h3>
            <p class="cdss-empty-desc">
              Không có kết quả nào khớp với "<strong>${searchQuery}</strong>". Thử tìm với từ khóa khác như <em>Dengue, Vancomycin, SOFA, FIB-4, PaO2, Kháng sinh</em> hoặc chọn chuyên khoa bên trên.
            </p>
            <button id="cdss-empty-reset-btn" class="cdss-btn-primary">
              <i class="fa-solid fa-arrows-rotate"></i> Xem lại tất cả 10 CDSS
            </button>
          </div>
        ` : ''}

        <!-- VIEW 1: MODERN 3-COLUMN CLINICAL GRID (DEFAULT) -->
        ${viewMode === 'grid' && filtered.length > 0 ? `
          <div class="cdss-cards-grid">
            ${filtered.map(m => renderModuleCard(m, false)).join('')}
          </div>
        ` : ''}

        <!-- VIEW 2: BEDSIDE COMPACT LIST / TABLE VIEW -->
        ${viewMode === 'list' && filtered.length > 0 ? `
          <div class="cdss-list-wrapper">
            <table class="cdss-list-table">
              <thead>
                <tr>
                  <th style="width: 44px; text-align: center;">★</th>
                  <th style="width: 28%;">Công Cụ CDSS</th>
                  <th style="width: 14%;">Chuyên Khoa &amp; Mức</th>
                  <th style="width: 32%;">Chỉ Định &amp; Năng Lực Tính Toán</th>
                  <th style="width: 16%;">Cơ Sở Pháp Lý</th>
                  <th style="width: 10%; text-align: right;">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.map(m => {
                  const isPinned = pinnedSlugs.includes(m.slug);
                  return `
                    <tr class="cdss-list-row" id="cdss-row-${m.slug}">
                      <td style="text-align: center;">
                        <button 
                          class="cdss-pin-btn ${isPinned ? 'pinned' : ''}" 
                          data-pin-slug="${m.slug}" 
                          title="${isPinned ? 'Bỏ ghim' : 'Ghim lên đầu'}"
                        >
                          <i class="${isPinned ? 'fa-solid' : 'fa-regular'} fa-star"></i>
                        </button>
                      </td>
                      <td>
                        <div class="cdss-list-cell-tool">
                          <div class="cdss-card-emblem cdss-emblem--${m.category}" style="width: 38px; height: 38px; font-size: 1.05rem; border-radius: 9px;">
                            <i class="${m.icon}"></i>
                          </div>
                          <div>
                            <a href="${m.standaloneUrl}" class="cdss-list-tool-name">
                              ${m.title}
                            </a>
                            <div class="cdss-list-tool-code">
                              <span class="cdss-code-pill">${m.brandCode || m.slug.toUpperCase()}</span>
                              ${m.titleEn ? `<span class="cdss-list-tool-en">${m.titleEn}</span>` : ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="cdss-list-dept">${m.department || m.categoryName}</div>
                        <span class="cdss-urgency-badge cdss-urgency--${m.urgency}">
                          ${m.urgency === 'stat' ? '🚨 STAT Cấp Cứu' : m.urgency === 'urgent' ? '⚡ Khẩn Cấp' : 'Thường Quy'}
                        </span>
                      </td>
                      <td>
                        <div class="cdss-list-desc">${m.shortDesc}</div>
                        ${m.features ? `
                          <div class="cdss-list-features">
                            ${m.features.slice(0, 3).map(f => `<span class="cdss-feature-chip">${f}</span>`).join('')}
                          </div>
                        ` : ''}
                      </td>
                      <td>
                        <div class="cdss-list-guideline" title="${m.guidelineSource}">
                          <i class="fa-solid fa-book-medical text-teal-600"></i> ${m.badge || m.guidelineSource}
                        </div>
                        ${m.icd10 && m.icd10.length > 0 ? `
                          <div class="cdss-list-icd">
                            ${m.icd10.slice(0, 3).map(c => `<span class="cdss-icd-pill">${c}</span>`).join('')}
                          </div>
                        ` : ''}
                      </td>
                      <td style="text-align: right;">
                        <a href="${m.standaloneUrl}" class="cdss-list-launch-btn">
                          <span>Mở</span>
                          <i class="fa-solid fa-arrow-right"></i>
                        </a>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}

        <!-- VIEW 3: SPECIALTY DEPARTMENT GROUPS -->
        ${viewMode === 'grouped' && filtered.length > 0 ? `
          <div class="cdss-groups-container">
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
                    <span class="cdss-group-counter">${groupModules.length} Modules</span>
                  </div>

                  <div class="cdss-cards-grid" style="margin-bottom:0;">
                    ${groupModules.map(m => renderModuleCard(m, false)).join('')}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : ''}

        <!-- ================================================================
             6. CLINICAL PRACTICE STANDARDS ACCORDION & EBM FOOTER
             ================================================================ -->
        <section class="cdss-ebm-footer-card">
          <div class="cdss-ebm-top-row">
            <div class="cdss-ebm-head">
              <i class="fa-solid fa-shield-halved"></i>
              <span>Cơ Sở Pháp Lý Y Khoa &amp; Chuẩn Mực Bằng Chứng (EBM)</span>
            </div>
            <span class="cdss-ebm-badge-ok">
              <i class="fa-solid fa-circle-check"></i> Tuân thủ Hướng Dẫn Bộ Y Tế &amp; Quốc Tế
            </span>
          </div>

          <div class="cdss-ebm-columns">
            <div class="cdss-ebm-col">
              <h4 class="cdss-ebm-col-title">
                <i class="fa-solid fa-certificate text-teal-600"></i>
                <span>Bộ Y Tế Việt Nam</span>
              </h4>
              <p>
                Tuân thủ nghiêm ngặt Quyết định 2760/QĐ-BYT (Phác đồ SXHD Dengue 2023), Quyết định 5631/QĐ-BYT (Sử dụng kháng sinh), Hướng dẫn Bệnh viện Bệnh Nhiệt Đới eMed 2026 và BVĐK Cà Mau.
              </p>
            </div>

            <div class="cdss-ebm-col">
              <h4 class="cdss-ebm-col-title">
                <i class="fa-solid fa-globe text-cyan-600"></i>
                <span>Hướng Dẫn Quốc Tế (EBM)</span>
              </h4>
              <p>
                Cập nhật chuẩn NICE NG253 (2024/2026), Surviving Sepsis Campaign (SSC), Phoenix Sepsis Criteria 2024, ASHP/IDSA 2020 (Vancomycin AUC/MIC), ADA Standards of Care 2026, EFNS và ACG 2017.
              </p>
            </div>

            <div class="cdss-ebm-col">
              <h4 class="cdss-ebm-col-title">
                <i class="fa-solid fa-laptop-medical text-emerald-600"></i>
                <span>Độc Lập &amp; An Toàn Tuyệt Đối</span>
              </h4>
              <p>
                Toàn bộ thuật toán chạy 100% tại trình duyệt bác sĩ (Client-side), không truyền gửi thông tin nhận diện người bệnh (No PII), hoạt động mượt mà ngoại tuyến (Offline Ready) tại khoa cấp cứu và ICU.
              </p>
            </div>
          </div>
        </section>

      </div>
    `;

    // Render individual module card with refined clinical layout
    function renderModuleCard(m: CDSSModuleMeta, isPinnedSection: boolean = false): string {
      const isPinned = pinnedSlugs.includes(m.slug);
      const isStat = m.urgency === 'stat';

      return `
        <article class="cdss-module-card ${isStat ? 'cdss-module-card--stat' : ''}" id="cdss-card-${m.slug}" data-slug="${m.slug}">
          <!-- Card Top Bar: Urgency/Department + Star Pin + Emblem -->
          <div class="cdss-card-top-bar">
            <div class="cdss-card-badges-group">
              <span class="cdss-urgency-badge cdss-urgency--${m.urgency}">
                ${m.urgency === 'stat' ? '<i class="fa-solid fa-bolt-lightning"></i> STAT Cấp Cứu' : m.urgency === 'urgent' ? '<i class="fa-solid fa-clock-rotate-left"></i> Khẩn Cấp' : '<i class="fa-solid fa-stethoscope"></i> Thường Quy'}
              </span>
              <span class="cdss-dept-tag">${m.department || m.categoryName}</span>
            </div>

            <div class="cdss-card-actions-top">
              <button 
                class="cdss-pin-btn ${isPinned ? 'pinned' : ''}" 
                data-pin-slug="${m.slug}" 
                title="${isPinned ? 'Bỏ ghim khỏi Bàn làm việc' : 'Ghim lên đầu Bàn làm việc'}"
                aria-label="${isPinned ? 'Bỏ ghim' : 'Ghim'}"
              >
                <i class="${isPinned ? 'fa-solid' : 'fa-regular'} fa-star"></i>
              </button>
              
              <div class="cdss-card-emblem cdss-emblem--${m.category}">
                <i class="${m.icon}"></i>
              </div>
            </div>
          </div>

          <!-- Title & Brand Acronym Group -->
          <div class="cdss-card-title-group">
            <div class="cdss-brand-row">
              <span class="cdss-brand-code">${m.brandCode || m.slug.toUpperCase()}</span>
              ${m.badge ? `<span class="cdss-badge-evidence">${m.badge}</span>` : ''}
            </div>
            <h3 class="cdss-card-title">
              <a href="${m.standaloneUrl}">${m.title}</a>
            </h3>
            ${m.titleEn ? `<p class="cdss-card-title-en">${m.titleEn}</p>` : ''}
          </div>

          <!-- STAT Symptom Trigger Bar (For rapid bedside visual identification) -->
          ${m.statTrigger ? `
            <div class="cdss-trigger-box">
              <i class="fa-solid fa-triangle-exclamation"></i>
              <span>${m.statTrigger}</span>
            </div>
          ` : ''}

          <!-- Core Clinical Description -->
          <p class="cdss-card-desc">${m.shortDesc}</p>

          <!-- Core Clinical Features Chips -->
          ${m.features && m.features.length > 0 ? `
            <div class="cdss-feature-chips">
              ${m.features.slice(0, 4).map(f => `<span class="cdss-feature-chip">${f}</span>`).join('')}
            </div>
          ` : ''}

          <!-- Guideline Source & ICD-10 Metadata Strip -->
          <div class="cdss-card-meta-strip">
            <div class="cdss-meta-item" title="${m.guidelineSource}">
              <i class="fa-solid fa-book-medical"></i>
              <span>${m.guidelineSource}</span>
            </div>
            ${m.icd10 && m.icd10.length > 0 ? `
              <div class="cdss-meta-item cdss-meta-icd">
                <i class="fa-solid fa-barcode"></i>
                <span>ICD-10: ${m.icd10.slice(0, 3).map(c => `<span class="cdss-icd-pill">${c}</span>`).join('')}</span>
              </div>
            ` : ''}
          </div>

          <!-- Action Footer -->
          <div class="cdss-card-footer">
            <div class="cdss-card-ver-wrap">
              <span class="cdss-card-version">${m.version}</span>
            </div>
            <a href="${m.standaloneUrl}" class="cdss-launch-btn">
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
    // 1. Live Search Input
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

    // 2. Clear Search Button
    const clearBtn = document.getElementById('cdss-clear-search');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchQuery = '';
        render();
      });
    }

    // 3. Category Filter Buttons
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

    // 5. STAT Triage Chips Click Handler (Smooth Scroll & Highlight Pulse)
    const triageChips = container.querySelectorAll('.cdss-rapid-chip');
    triageChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const targetSlug = chip.getAttribute('data-target-slug');
        if (!targetSlug) return;

        // If in filtered state where module is hidden, reset filter to 'all'
        if (activeCategory !== 'all' || searchQuery) {
          activeCategory = 'all';
          searchQuery = '';
          render();
        }

        // Scroll to the target card
        setTimeout(() => {
          const targetCard = document.getElementById(`cdss-card-${targetSlug}`) || document.getElementById(`cdss-row-${targetSlug}`);
          if (targetCard) {
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetCard.classList.remove('cdss-pulse-highlight');
            // Trigger animation restart
            void targetCard.offsetWidth;
            targetCard.classList.add('cdss-pulse-highlight');
          }
        }, 50);
      });
    });

    // 6. Pin / Unpin Favorite Star Toggle
    const pinBtns = container.querySelectorAll('.cdss-pin-btn');
    pinBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
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

    // 7. Clear All Pinned
    const clearPinnedBtn = document.getElementById('cdss-clear-pinned-btn');
    if (clearPinnedBtn) {
      clearPinnedBtn.addEventListener('click', () => {
        pinnedSlugs = [];
        setPinnedSlugs([]);
        render();
      });
    }

    // 8. Reset Filters Links
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

    // 9. Tag remove click
    const tagRemovers = container.querySelectorAll('.cdss-tag-remove');
    tagRemovers.forEach(btn => {
      btn.addEventListener('click', () => {
        const resetType = btn.getAttribute('data-reset');
        if (resetType === 'category') activeCategory = 'all';
        if (resetType === 'search') searchQuery = '';
        render();
      });
    });
  }

  // Keyboard shortcut listener ('/' to focus search)
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
      e.preventDefault();
      const input = document.getElementById('cdss-search-input') as HTMLInputElement;
      if (input) {
        input.focus();
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
