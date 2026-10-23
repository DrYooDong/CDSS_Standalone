/**
 * CDSS Platform Suite — Master Hub Application
 * Modern Medical Command Center & Bedside Decision Support Portal
 * Minimalist, High-Speed, Professional Clinical Tool Architecture
 */
import { CDSS_MODULES, getCDSSModuleById, getCDSSModuleBySlug } from './cdss-registry';
import { CDSSModuleMeta } from './cdss-types';

export * from './cdss-types';
export * from './cdss-registry';

type ViewMode = 'grid' | 'table' | 'grouped';

interface TriageItem {
  slug: string;
  label: string;
  trigger: string;
  icon: string;
}

const STAT_TRIAGE_ITEMS: TriageItem[] = [
  { slug: 'dengue', label: 'Sốc SXHD Dengue', trigger: 'Hct cao, cô đặc máu, sốc tụt HA', icon: 'fa-solid fa-droplet' },
  { slug: 'sepsis', label: 'Sepsis & Sốc Nhiễm Khuẩn', trigger: 'Sốt cao, tụt HA, Lactate > 2, SOFA', icon: 'fa-solid fa-biohazard' },
  { slug: 'abg', label: 'Khí Máu ABG & Toan Kiềm', trigger: 'Toan chuyển hóa, PaO2/PaCO2, Anion Gap', icon: 'fa-solid fa-lungs' },
  { slug: 'ecg', label: 'STEMI ECG 12 Chuyển Đạo', trigger: 'Đau ngực, STEMI định khu, QTc, Caliper', icon: 'fa-solid fa-heart-pulse' },
  { slug: 'csf', label: 'Dịch Não Tủy CSF', trigger: 'Sốt, đau đầu, viêm màng não, SAH', icon: 'fa-solid fa-brain' }
];

const PINNED_STORAGE_KEY = 'cdss_pinned_module_slugs';
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

function getStoredViewMode(): ViewMode {
  try {
    const mode = localStorage.getItem(VIEW_MODE_STORAGE_KEY) as ViewMode;
    return (mode === 'grid' || mode === 'table' || mode === 'grouped') ? mode : 'grid';
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

  const categories = [
    { id: 'all', label: 'Tất cả (10)', icon: 'fa-solid fa-shapes' },
    { id: 'stat', label: '🚨 Cấp cứu STAT (5)', icon: 'fa-solid fa-bolt-lightning', isStat: true },
    { id: 'resus', label: 'Hồi sức & Cấp cứu', icon: 'fa-solid fa-truck-medical' },
    { id: 'cardio-resp', label: 'Tim mạch & Hô hấp', icon: 'fa-solid fa-heart-pulse' },
    { id: 'pharma', label: 'Kháng sinh & Dược', icon: 'fa-solid fa-pills' },
    { id: 'internal', label: 'Nội khoa & Thần kinh', icon: 'fa-solid fa-hospital-user' }
  ];

  const specialtyGroups = [
    {
      id: 'group-resus',
      title: 'Hồi Sức Cấp Cứu & Nhiễm Trùng Nguy Kịch',
      desc: 'Phác đồ bù dịch chống sốc SXHD Dengue, phân tầng nhiễm khuẩn huyết và toan kiềm cơ thể',
      icon: 'fa-solid fa-truck-medical',
      slugs: ['dengue', 'sepsis', 'abg']
    },
    {
      id: 'group-cardio-resp',
      title: 'Tim Mạch, Hô Hấp & Điện Tim Chuyên Sâu',
      desc: 'Phân tích điện tâm đồ 12 đạo trình trực quan trên canvas và thăng bằng toan kiềm khí máu',
      icon: 'fa-solid fa-heart-pulse',
      slugs: ['ecg', 'abg']
    },
    {
      id: 'group-pharma',
      title: 'Dược Động Học Kháng Sinh & Tối Ưu Hóa Liều',
      desc: 'Cá thể hóa liều 43 kháng sinh theo độ thanh thải thận lọc máu và TDM Vancomycin AUC/MIC',
      icon: 'fa-solid fa-pills',
      slugs: ['antibiotic', 'vancomycin']
    },
    {
      id: 'group-internal',
      title: 'Tiêu Hóa - Gan Mật, Chuyển Hóa & Thần Kinh',
      desc: 'Biện giải sinh hóa gan ACG, quản lý insulin nội viện, chọc dò dịch não tủy và kỹ năng khám Bates',
      icon: 'fa-solid fa-hospital-user',
      slugs: ['hepa', 'diacare', 'csf', 'inpatient']
    }
  ];

  function filterModules(modules: CDSSModuleMeta[]): CDSSModuleMeta[] {
    const q = searchQuery.toLowerCase().trim();
    return modules.filter(m => {
      // Category filtering
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

      // Search query filtering
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
    const activeCatObj = categories.find(c => c.id === activeCategory);

    container.innerHTML = `
      <div class="cdss-hub-workspace">

        <!-- ================================================================
             1. REFINED BEDSIDE HERO (Minimalist, Professional, High Clarity)
             ================================================================ -->
        <header class="cdss-hero">
          <div class="cdss-hero-badge">
            <span class="cdss-badge-dot"></span>
            <span>HỆ THỐNG CDSS ĐỘC LẬP · BEDSIDE READY</span>
            <span class="cdss-hero-version">v2.5</span>
          </div>
          <h1 class="cdss-hero-title">Trung Tâm Hỗ Trợ Quyết Định Lâm Sàng</h1>
          <p class="cdss-hero-subtitle">
            Hợp nhất 10 công cụ lâm sàng chuyên sâu tại giường bệnh chuẩn Bộ Y Tế &amp; Y học chứng cứ (EBM).
            Tính toán liều, phân tầng nguy cơ và phác đồ xử trí 100% Client-side ngoại tuyến.
          </p>
        </header>

        <!-- ================================================================
             2. COMMAND LAUNCHER BAR (Search, STAT Quick Strip, Filters)
             ================================================================ -->
        <section class="cdss-command-bar">
          <!-- Main Search Box -->
          <div class="cdss-search-wrap">
            <i class="fa-solid fa-magnifying-glass cdss-search-icon"></i>
            <input 
              id="cdss-search-input" 
              type="text" 
              class="cdss-search-input"
              placeholder="Tra cứu nhanh theo tên CDSS, thuốc, bệnh lý, chỉ định, mã ICD-10 (nhấn / để tìm)..." 
              value="${searchQuery}"
              autocomplete="off"
              spellcheck="false"
            />
            ${searchQuery ? `
              <button id="cdss-clear-search" class="cdss-search-clear" title="Xóa từ khóa tìm kiếm" aria-label="Xóa tìm kiếm">
                <i class="fa-solid fa-xmark"></i>
              </button>
            ` : `
              <span class="cdss-search-kbd" title="Nhấn / để tra cứu nhanh">/</span>
            `}
          </div>

          <!-- Rapid STAT Shortcuts Strip -->
          <div class="cdss-stat-strip" id="cdss-rapid-bar">
            <span class="cdss-stat-strip-label">
              <i class="fa-solid fa-bolt-lightning text-amber-500"></i> STAT Cấp Cứu:
            </span>
            <div class="cdss-stat-strip-items">
              ${STAT_TRIAGE_ITEMS.map(item => `
                <button 
                  type="button" 
                  class="cdss-stat-quick-link" 
                  data-quick-slug="${item.slug}"
                  title="${item.label} — ${item.trigger}"
                >
                  <i class="${item.icon}"></i>
                  <span>${item.label}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Pinned Favorites Strip (Rendered only if pinned tools exist) -->
          ${pinnedModules.length > 0 ? `
            <div class="cdss-pinned-bar">
              <div class="cdss-pinned-head">
                <i class="fa-solid fa-star text-amber-500"></i>
                <span>Đã ghim (${pinnedModules.length}):</span>
              </div>
              <div class="cdss-pinned-items">
                ${pinnedModules.map(m => `
                  <div class="cdss-pinned-chip">
                    <a href="${m.standaloneUrl}" class="cdss-pinned-link">
                      <i class="${m.icon}"></i>
                      <span>${m.shortTitle || m.title}</span>
                    </a>
                    <button type="button" class="cdss-pinned-remove" data-unpin-slug="${m.slug}" title="Bỏ ghim">
                      <i class="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                `).join('')}
                <button type="button" id="cdss-clear-all-pinned" class="cdss-pinned-clear-btn" title="Xóa tất cả mục đã ghim">
                  Xóa hết
                </button>
              </div>
            </div>
          ` : ''}

          <!-- Filters Row: Category Tabs + View Switcher -->
          <div class="cdss-filter-row">
            <div class="cdss-category-tabs">
              ${categories.map(cat => {
                const isActive = activeCategory === cat.id;
                return `
                  <button 
                    type="button" 
                    class="cdss-cat-tab ${isActive ? 'active' : ''} ${cat.isStat ? 'is-stat' : ''}" 
                    data-cat="${cat.id}"
                  >
                    <i class="${cat.icon}"></i>
                    <span>${cat.label}</span>
                  </button>
                `;
              }).join('')}
            </div>

            <div class="cdss-view-toggle">
              <button 
                type="button" 
                class="cdss-view-btn ${viewMode === 'grid' ? 'active' : ''}" 
                data-mode="grid"
                title="Xem dạng Lưới Thẻ Chuyên Khoa"
              >
                <i class="fa-solid fa-table-cells-large"></i>
                <span>Lưới</span>
              </button>
              <button 
                type="button" 
                class="cdss-view-btn ${viewMode === 'table' ? 'active' : ''}" 
                data-mode="table"
                title="Xem dạng Bảng Gọn Giường Bệnh"
              >
                <i class="fa-solid fa-table-list"></i>
                <span>Bảng gọn</span>
              </button>
              <button 
                type="button" 
                class="cdss-view-btn ${viewMode === 'grouped' ? 'active' : ''}" 
                data-mode="grouped"
                title="Xem theo Khối Khoa Lâm Sàng"
              >
                <i class="fa-solid fa-layer-group"></i>
                <span>Nhóm khoa</span>
              </button>
            </div>
          </div>
        </section>

        <!-- ================================================================
             3. RESULTS STATUS & RESET CONTROLS
             ================================================================ -->
        <div class="cdss-status-row">
          <div class="cdss-status-left">
            <span>Hiển thị <strong>${filtered.length}</strong> / <strong>${CDSS_MODULES.length}</strong> công cụ CDSS</span>
            ${activeCategory !== 'all' ? `
              <span class="cdss-active-filter-tag">
                ${activeCatObj?.label}
                <button type="button" data-reset="category" class="cdss-tag-close" title="Bỏ lọc chuyên khoa">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </span>
            ` : ''}
            ${searchQuery ? `
              <span class="cdss-active-filter-tag">
                "${searchQuery}"
                <button type="button" data-reset="search" class="cdss-tag-close" title="Xóa từ khóa tìm kiếm">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </span>
            ` : ''}
          </div>

          ${(activeCategory !== 'all' || searchQuery) ? `
            <button type="button" id="cdss-reset-filters-btn" class="cdss-reset-btn">
              <i class="fa-solid fa-rotate-left"></i> Đặt lại bộ lọc
            </button>
          ` : ''}
        </div>

        <!-- Empty State -->
        ${filtered.length === 0 ? `
          <div class="cdss-empty-box">
            <i class="fa-solid fa-magnifying-glass cdss-empty-icon"></i>
            <h3 class="cdss-empty-title">Không tìm thấy công cụ CDSS phù hợp</h3>
            <p class="cdss-empty-desc">
              Không có công cụ nào khớp với từ khóa "<strong>${searchQuery}</strong>". Thử tìm kiếm với từ khóa khác như <em>Dengue, Sepsis, ABG, ECG, Vancomycin, Insulin, DNT</em> hoặc chọn chuyên khoa bên trên.
            </p>
            <button type="button" id="cdss-empty-reset" class="cdss-empty-btn">
              <i class="fa-solid fa-arrows-rotate"></i> Xem tất cả 10 công cụ CDSS
            </button>
          </div>
        ` : ''}

        <!-- ================================================================
             4. VIEW MODES (GRID, TABLE, GROUPED)
             ================================================================ -->

        <!-- VIEW MODE 1: MINIMALIST PROFESSIONAL CARDS GRID (DEFAULT) -->
        ${viewMode === 'grid' && filtered.length > 0 ? `
          <div class="cdss-grid">
            ${filtered.map(m => renderCard(m)).join('')}
          </div>
        ` : ''}

        <!-- VIEW MODE 2: COMPACT TABLE (BEDSIDE ROUNDS) -->
        ${viewMode === 'table' && filtered.length > 0 ? `
          <div class="cdss-table-container">
            <table class="cdss-table">
              <thead>
                <tr>
                  <th style="width: 44px; text-align: center;">★</th>
                  <th style="width: 28%;">Công cụ CDSS</th>
                  <th style="width: 16%;">Chuyên khoa &amp; Mức</th>
                  <th style="width: 32%;">Chỉ định &amp; Phạm vi tính toán</th>
                  <th style="width: 14%;">Cơ sở hướng dẫn</th>
                  <th style="width: 10%; text-align: right;">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.map(m => {
                  const isPinned = pinnedSlugs.includes(m.slug);
                  const isStat = m.urgency === 'stat';
                  return `
                    <tr class="cdss-table-row" id="cdss-row-${m.slug}">
                      <td style="text-align: center;">
                        <button 
                          type="button" 
                          class="cdss-star-btn ${isPinned ? 'pinned' : ''}" 
                          data-pin-slug="${m.slug}" 
                          title="${isPinned ? 'Bỏ ghim' : 'Ghim yêu thích'}"
                          aria-label="${isPinned ? 'Bỏ ghim' : 'Ghim'}"
                        >
                          <i class="${isPinned ? 'fa-solid' : 'fa-regular'} fa-star"></i>
                        </button>
                      </td>
                      <td>
                        <div class="cdss-table-cell-title">
                          <a href="${m.standaloneUrl}" class="cdss-table-link">
                            ${m.title}
                          </a>
                          <div class="cdss-table-sub">
                            <span class="cdss-table-code">${m.brandCode}</span>
                            ${m.titleEn ? `<span>${m.titleEn}</span>` : ''}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="cdss-table-dept">${m.department || m.categoryName}</div>
                        ${isStat ? `<span class="cdss-stat-tag">🚨 STAT Cấp cứu</span>` : `<span class="cdss-routine-tag">Thường quy</span>`}
                      </td>
                      <td>
                        <p class="cdss-table-desc">${m.shortDesc}</p>
                        ${m.features ? `
                          <div class="cdss-table-features">
                            ${m.features.slice(0, 3).join(' · ')}
                          </div>
                        ` : ''}
                      </td>
                      <td>
                        <div class="cdss-table-guide">${m.badge || m.guidelineSource}</div>
                      </td>
                      <td style="text-align: right;">
                        <a href="${m.standaloneUrl}" class="cdss-table-action-btn">
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

        <!-- VIEW MODE 3: SPECIALTY CLINICAL GROUPS -->
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

                  <div class="cdss-grid" style="margin-bottom:0;">
                    ${groupModules.map(m => renderCard(m)).join('')}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : ''}

        <!-- ================================================================
             5. REFINED EBM LEGAL & CLINICAL STANDARDS FOOTER
             ================================================================ -->
        <footer class="cdss-bottom-info">
          <div class="cdss-bottom-info-inner">
            <div class="cdss-info-col">
              <div class="cdss-info-title">
                <i class="fa-solid fa-circle-check text-teal-600"></i>
                <span>Bộ Y Tế Việt Nam</span>
              </div>
              <p>Tuân thủ Quyết định 2760/QĐ-BYT (SXHD Dengue), 5631/QĐ-BYT (Sử dụng kháng sinh), Hướng dẫn BV Bệnh Nhiệt Đới eMed 2026 và BVĐK Cà Mau.</p>
            </div>
            <div class="cdss-info-col">
              <div class="cdss-info-title">
                <i class="fa-solid fa-shield-halved text-teal-600"></i>
                <span>Y Học Chứng Cứ Quốc Tế</span>
              </div>
              <p>Cập nhật theo NICE NG253 (2024/2026), Surviving Sepsis Campaign, Phoenix 2024, ASHP/IDSA 2020 (Vancomycin AUC/MIC), ADA 2026, EFNS và ACG 2017.</p>
            </div>
            <div class="cdss-info-col">
              <div class="cdss-info-title">
                <i class="fa-solid fa-lock text-teal-600"></i>
                <span>Bảo Mật Y Khoa &amp; Ngoại Tuyến</span>
              </div>
              <p>Toàn bộ thuật toán chạy 100% tại trình duyệt bác sĩ (Client-side), không truyền dữ liệu định danh bệnh nhân (No PII), hoạt động mượt mà ngoại tuyến (Offline Ready).</p>
            </div>
          </div>
        </footer>

      </div>
    `;

    // Render individual module card
    function renderCard(m: CDSSModuleMeta): string {
      const isPinned = pinnedSlugs.includes(m.slug);
      const isStat = m.urgency === 'stat';

      return `
        <article class="cdss-card ${isStat ? 'is-stat-card' : ''}" id="cdss-card-${m.slug}" data-slug="${m.slug}">
          <!-- Top Row: Icon + Meta + Pin -->
          <div class="cdss-card-header">
            <div class="cdss-card-header-left">
              <div class="cdss-card-emblem cdss-emblem--${m.category}">
                <i class="${m.icon}"></i>
              </div>
              <div class="cdss-card-meta">
                <span class="cdss-card-dept">${m.department || m.categoryName}</span>
                ${isStat ? `<span class="cdss-card-stat"><i class="fa-solid fa-bolt-lightning"></i> STAT</span>` : ''}
              </div>
            </div>

            <button 
              type="button" 
              class="cdss-star-btn ${isPinned ? 'pinned' : ''}" 
              data-pin-slug="${m.slug}"
              title="${isPinned ? 'Bỏ ghim' : 'Ghim yêu thích'}"
              aria-label="${isPinned ? 'Bỏ ghim' : 'Ghim'}"
            >
              <i class="${isPinned ? 'fa-solid' : 'fa-regular'} fa-star"></i>
            </button>
          </div>

          <!-- Title & Guideline Reference -->
          <div class="cdss-card-body">
            <h3 class="cdss-card-title">
              <a href="${m.standaloneUrl}">${m.title}</a>
            </h3>
            <div class="cdss-card-guideline">
              <span>${m.badge || m.guidelineSource}</span>
            </div>

            ${m.statTrigger ? `
              <div class="cdss-trigger-row">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <span>${m.statTrigger}</span>
              </div>
            ` : ''}

            <!-- Clinical Description -->
            <p class="cdss-card-desc">${m.shortDesc}</p>

            <!-- Key Features / Formulas (Clean unboxed text) -->
            ${m.features && m.features.length > 0 ? `
              <div class="cdss-card-features">
                ${m.features.slice(0, 3).join(' · ')}
              </div>
            ` : ''}
          </div>

          <!-- Bottom Row: Code/Version + Open Action Link -->
          <div class="cdss-card-footer">
            <span class="cdss-card-code">${m.brandCode} · v${m.version.split(' ')[0]}</span>
            <a href="${m.standaloneUrl}" class="cdss-card-launch">
              <span>Mở công cụ</span>
              <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </article>
      `;
    }

    attachEvents();
  }

  function attachEvents() {
    // 1. Search Input
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

    // 3. Category Tabs
    const catTabs = container.querySelectorAll('.cdss-cat-tab');
    catTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const cat = tab.getAttribute('data-cat') || 'all';
        activeCategory = cat;
        render();
      });
    });

    // 4. View Mode Switcher
    const viewBtns = container.querySelectorAll('.cdss-view-btn');
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

    // 5. STAT Quick Links
    const quickLinks = container.querySelectorAll('.cdss-stat-quick-link');
    quickLinks.forEach(link => {
      link.addEventListener('click', () => {
        const targetSlug = link.getAttribute('data-quick-slug');
        if (!targetSlug) return;

        // Reset search/category if needed so target card is visible
        if (activeCategory !== 'all' || searchQuery) {
          activeCategory = 'all';
          searchQuery = '';
          render();
        }

        setTimeout(() => {
          const targetEl = document.getElementById(`cdss-card-${targetSlug}`) || document.getElementById(`cdss-row-${targetSlug}`);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetEl.classList.add('cdss-highlight-pulse');
            setTimeout(() => targetEl.classList.remove('cdss-highlight-pulse'), 1800);
          }
        }, 60);
      });
    });

    // 6. Star Pin Toggle
    const pinBtns = container.querySelectorAll('.cdss-star-btn');
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

    // 7. Unpin from Pinned Strip
    const unpinBtns = container.querySelectorAll('.cdss-pinned-remove');
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

    // 8. Clear All Pinned
    const clearPinnedBtn = document.getElementById('cdss-clear-all-pinned');
    if (clearPinnedBtn) {
      clearPinnedBtn.addEventListener('click', () => {
        pinnedSlugs = [];
        setPinnedSlugs([]);
        render();
      });
    }

    // 9. Reset Filter Tag Click
    const tagCloseBtns = container.querySelectorAll('.cdss-tag-close');
    tagCloseBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const resetTarget = btn.getAttribute('data-reset');
        if (resetTarget === 'category') activeCategory = 'all';
        if (resetTarget === 'search') searchQuery = '';
        render();
      });
    });

    // 10. Reset Filters Buttons
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

    // 11. Clickable Whole Card (except star button and links)
    const cards = container.querySelectorAll('.cdss-card');
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.closest('.cdss-star-btn') || target.closest('a')) return;

        const slug = card.getAttribute('data-slug');
        const meta = CDSS_MODULES.find(m => m.slug === slug);
        if (meta && meta.standaloneUrl) {
          window.location.href = meta.standaloneUrl;
        }
      });
    });
  }

  // Keyboard shortcut listener ('/' or 'Cmd+K' to focus search)
  document.addEventListener('keydown', (e) => {
    if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) && 
        document.activeElement?.tagName !== 'INPUT' && 
        document.activeElement?.tagName !== 'TEXTAREA') {
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
