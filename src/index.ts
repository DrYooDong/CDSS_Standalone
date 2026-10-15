/**
 * CDSS Standalone Suite — Master Hub Application
 */
import { CDSS_MODULES, getCDSSModuleById, getCDSSModuleBySlug } from './cdss-registry';
import { CDSSModuleMeta } from './cdss-types';

export * from './cdss-types';
export * from './cdss-registry';

export function initCDSSHub(containerId: string): void {
  const container = document.getElementById(containerId);
  if (!container) return;

  let activeCategory = 'all';
  let searchQuery = '';

  const categories = [
    { id: 'all', name: 'Tất Cả 9 CDSS', icon: 'fa-solid fa-shapes' },
    { id: 'resuscitation', name: 'Hồi Sức Cấp Cứu', icon: 'fa-solid fa-biohazard' },
    { id: 'cardiology', name: 'Tim Mạch', icon: 'fa-solid fa-heart-pulse' },
    { id: 'respiratory', name: 'Hô Hấp (ABG)', icon: 'fa-solid fa-lungs' },
    { id: 'pharmacology', name: 'Kháng Sinh & Dược Lý', icon: 'fa-solid fa-viruses' },
    { id: 'gastroenterology', name: 'Tiêu Hóa & Gan', icon: 'fa-solid fa-virus' },
    { id: 'endocrinology', name: 'Nội Tiết & Insulin', icon: 'fa-solid fa-syringe' },
    { id: 'internal', name: 'Nội Khoa Khám Bệnh', icon: 'fa-solid fa-stethoscope' }
  ];

  function render() {
    const filtered = CDSS_MODULES.filter(m => {
      const matchCat = activeCategory === 'all' || m.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        m.title.toLowerCase().includes(q) ||
        (m.titleEn && m.titleEn.toLowerCase().includes(q)) ||
        m.shortDesc.toLowerCase().includes(q) ||
        m.guidelineSource.toLowerCase().includes(q) ||
        (m.icd10 && m.icd10.some(c => c.toLowerCase().includes(q)));
      return matchCat && matchSearch;
    });

    container.innerHTML = `
      <div class="cdss-hub-container">
        <!-- Hero Banner -->
        <section class="cdss-hub-hero">
          <div class="cdss-hero-tag">
            <i class="fa-solid fa-microchip"></i> Nền Tảng Hỗ Trợ Quyết Định Lâm Sàng Độc Lập
          </div>
          <h1 class="cdss-hero-title">
            Bộ Công Cụ CDSS Lâm Sàng Chuyên Sâu
          </h1>
          <p class="cdss-hero-subtitle">
            Hệ sinh thái 9 công cụ thuật toán tính toán liều lượng, phân tầng nguy cơ sốc, phân tích điện tim, khí máu động mạch và hỗ trợ ra quyết định điều trị tại giường bệnh (Bedside Clinical Decision Support System).
          </p>

          <!-- Search Bar -->
          <div style="max-width: 640px; margin: 1.75rem auto 0; position: relative;">
            <div style="position: relative; display: flex; align-items: center;">
              <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 1.1rem; color: var(--color-text-muted); font-size: 1rem;"></i>
              <input 
                id="cdss-search-input" 
                type="text" 
                placeholder="Tìm kiếm công cụ theo tên, bệnh lý, guideline, ICD-10..." 
                value="${searchQuery}"
                style="width: 100%; padding: 0.85rem 1.2rem 0.85rem 2.85rem; border-radius: 9999px; border: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-text); font-size: 0.92rem; outline: none; box-shadow: 0 4px 20px rgba(0,0,0,0.06); transition: border-color 0.2s;"
              />
              ${searchQuery ? `
                <button id="cdss-clear-search" style="position: absolute; right: 1rem; border: none; background: transparent; color: var(--color-text-muted); cursor: pointer; font-size: 0.9rem;">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              ` : ''}
            </div>
          </div>
        </section>

        <!-- Category Filter Tabs -->
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center; margin: 1.5rem 0 2.5rem; padding: 0 1rem;">
          ${categories.map(cat => `
            <button 
              class="cdss-filter-tab ${activeCategory === cat.id ? 'active' : ''}" 
              data-cat="${cat.id}"
              style="padding: 0.5rem 1rem; border-radius: 9999px; border: 1px solid ${activeCategory === cat.id ? 'var(--color-primary)' : 'var(--color-border)'}; background: ${activeCategory === cat.id ? 'var(--color-primary)' : 'var(--color-surface)'}; color: ${activeCategory === cat.id ? '#fff' : 'var(--color-text)'}; font-size: 0.82rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 0.45rem; transition: all 0.2s;"
            >
              <i class="${cat.icon}"></i> ${cat.name}
            </button>
          `).join('')}
        </div>

        <!-- Grid of CDSS Modules -->
        <section class="cdss-hub-modules-section">
          <div class="cdss-modules-header">
            <h2 class="cdss-section-heading">
              <i class="fa-solid fa-shapes"></i> Danh Sách 9 Công Cụ Lâm Sàng
            </h2>
            <span class="cdss-module-count">${filtered.length} / ${CDSS_MODULES.length} modules</span>
          </div>

          ${filtered.length === 0 ? `
            <div style="text-align: center; padding: 4rem 1rem; color: var(--color-text-muted);">
              <i class="fa-solid fa-folder-open" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
              <p style="font-size: 1.1rem; font-weight: 600;">Không tìm thấy công cụ CDSS phù hợp</p>
              <p style="font-size: 0.9rem;">Thử tìm kiếm với từ khóa khác hoặc bấm nút "Tất Cả 9 CDSS".</p>
            </div>
          ` : `
            <div class="cdss-modules-grid">
              ${filtered.map(m => `
                <div class="cdss-module-card cdss-module-card--${m.category}">
                  <div class="cdss-card-top">
                    <div class="cdss-card-icon-wrap">
                      <i class="${m.icon}"></i>
                    </div>
                    <div class="cdss-card-badges">
                      <span class="cdss-badge cdss-badge--category">${m.categoryName}</span>
                      ${m.badge ? `<span class="cdss-badge cdss-badge--highlight">${m.badge}</span>` : ''}
                    </div>
                  </div>

                  <h3 class="cdss-card-title">
                    <a href="${m.standaloneUrl}">${m.title}</a>
                  </h3>
                  ${m.titleEn ? `<p class="cdss-card-title-en">${m.titleEn}</p>` : ''}
                  
                  <p class="cdss-card-desc">${m.shortDesc}</p>

                  <div class="cdss-card-meta">
                    <div class="cdss-meta-item">
                      <i class="fa-solid fa-book-medical"></i> <span>${m.guidelineSource}</span>
                    </div>
                    ${m.icd10 && m.icd10.length > 0 ? `
                      <div class="cdss-meta-item">
                        <i class="fa-solid fa-barcode"></i> <span>ICD-10: ${m.icd10.join(', ')}</span>
                      </div>
                    ` : ''}
                  </div>

                  <div class="cdss-card-footer">
                    <span class="cdss-version-tag">Phiên bản ${m.version}</span>
                    <a href="${m.standaloneUrl}" class="cdss-open-btn">
                      <span>Mở CDSS</span> <i class="fa-solid fa-arrow-right"></i>
                    </a>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </section>
      </div>
    `;

    // Bind Search events
    const searchInput = document.getElementById('cdss-search-input');
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

    const clearBtn = document.getElementById('cdss-clear-search');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchQuery = '';
        render();
      });
    }

    // Bind Category filter events
    const tabs = container.querySelectorAll('.cdss-filter-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const cat = (e.currentTarget as HTMLElement).getAttribute('data-cat') || 'all';
        activeCategory = cat;
        render();
      });
    });
  }

  render();
}

if (typeof window !== 'undefined') {
  (window as any).initCDSSHub = initCDSSHub;
  (window as any).CDSS_MODULES = CDSS_MODULES;
  (window as any).getCDSSModuleById = getCDSSModuleById;
  (window as any).getCDSSModuleBySlug = getCDSSModuleBySlug;
}
