/**
 * CliniPortal CDSS — Master Shared Shell, Navigation, Theme & Command Palette
 * Path: /shared/cdss-shell.js
 * 
 * Features:
 * 1. Synchronized Light/Dark Theme Controller (Default: Light Mode)
 * 2. Universal Command Palette (Ctrl+K / Cmd+K Quick Switcher) for Laptop, Tablet, Mobile
 * 3. Mobile & Tablet Bedside Floating Bottom Navigation Dock
 * 4. Mobile Bottom Sheet for fast thumb-friendly module jumping
 * 5. Global Floating Back-to-Top Button
 * 6. Smooth Haptic Feedback & Toast Notification API
 * 7. PWA Offline Service Worker Registration
 */

(function () {
  'use strict';

  var THEME_KEY = 'cliniportal_theme';

  // Determine relative prefix depending on current page depth
  var isSubModule = /[\/\\](dengue|ecg|abg|hepa|sepsis|antibiotic|vancomycin|diacare|inpatient|csf)[\/\\]/i.test(window.location.pathname);
  var rootPrefix = isSubModule ? '../' : './';

  // Master Registry of 10 CDSS Modules
  var MODULES = [
    {
      id: 'dengue',
      num: 1,
      title: 'SXHD Dengue & Chống Sốc (Bộ Y Tế 2023)',
      short: 'SXHD Dengue',
      desc: 'Cân nặng CDC 2014, cọc dịch 4 cột động học, bơm tiêm điện Dopamin/Noradrenalin',
      slug: 'dengue',
      url: rootPrefix + (isSubModule ? 'dengue/index.html' : 'dengue/index.html'),
      icon: 'fa-solid fa-droplet',
      color: '#0d9488',
      badge: 'Bộ Y Tế 2023'
    },
    {
      id: 'ecg',
      num: 2,
      title: 'Điện Tâm Đồ 12 Cần & STEMI (ECG Master)',
      short: 'ECG Master',
      desc: '21 ca lâm sàng, thước Caliper miligiây, định khu STEMI & thuật toán Brugada',
      slug: 'ecg',
      url: rootPrefix + (isSubModule ? 'ecg/index.html' : 'ecg/index.html'),
      icon: 'fa-solid fa-heart-pulse',
      color: '#e11d48',
      badge: '21 Ca + Caliper'
    },
    {
      id: 'abg',
      num: 3,
      title: 'Khí Máu Động Mạch & Toan Kiềm (ABG Pro)',
      short: 'Khí Máu ABG',
      desc: '6 bước toan kiềm, 24 ca lâm sàng, Nomogram Siggaard-Andersen, Anion Gap',
      slug: 'abg',
      url: rootPrefix + (isSubModule ? 'abg/index.html' : 'abg/index.html'),
      icon: 'fa-solid fa-lungs',
      color: '#0284c7',
      badge: '24 Ca + Nomogram'
    },
    {
      id: 'hepa',
      num: 4,
      title: 'Sinh Hóa Gan & R-ratio (HepaCDSS)',
      short: 'Sinh Hóa Gan',
      desc: 'Lưu đồ tiếp cận ACG, tính tỷ số R-ratio, De Ritis, FIB-4, APRI, Child-Pugh',
      slug: 'hepa',
      url: rootPrefix + (isSubModule ? 'hepa/index.html' : 'hepa/index.html'),
      icon: 'fa-solid fa-virus',
      color: '#10b981',
      badge: 'Chuẩn ACG 2017'
    },
    {
      id: 'sepsis',
      num: 5,
      title: 'Nhiễm Khuẩn Huyết & Sốc (SepsisCDSS)',
      short: 'Sepsis CDSS',
      desc: 'Phân tầng nguy cơ NICE 2024, Sepsis-3 SOFA/qSOFA, Phoenix 2024 nhi khoa',
      slug: 'sepsis',
      url: rootPrefix + (isSubModule ? 'sepsis/index.html' : 'sepsis/index.html'),
      icon: 'fa-solid fa-biohazard',
      color: '#d97706',
      badge: 'NICE 2024 + SOFA'
    },
    {
      id: 'antibiotic',
      num: 6,
      title: 'Kháng Sinh & Chỉnh Thận (InfectoDose)',
      short: 'InfectoDose',
      desc: 'Tiêu chuẩn NHSN, phân tầng vi khuẩn MDR, tính liều 43 KS theo CrCl & lọc máu',
      slug: 'antibiotic',
      url: rootPrefix + (isSubModule ? 'antibiotic/index.html' : 'antibiotic/index.html'),
      icon: 'fa-solid fa-viruses',
      color: '#8b5cf6',
      badge: 'BVBND 2026 + 43 KS'
    },
    {
      id: 'vancomycin',
      num: 7,
      title: 'Dược Động Học Vancomycin & TDM (ASHP 2020)',
      short: 'Vancomycin PK',
      desc: 'Liều nạp 25-35 mg/kg, duy trì theo CrCl, mục tiêu AUC24/MIC 400-600, lọc máu IHD',
      slug: 'vancomycin',
      url: rootPrefix + (isSubModule ? 'vancomycin/index.html' : 'vancomycin/index.html'),
      icon: 'fa-solid fa-syringe',
      color: '#6366f1',
      badge: 'ASHP 2020 + AUC/MIC'
    },
    {
      id: 'diacare',
      num: 8,
      title: 'Insulin & Đường Huyết Nội Viện (DiaCare)',
      short: 'DiaCare Insulin',
      desc: 'Phác đồ Basal-Bolus, phác đồ trượt SSI, cấp cứu DKA/HHS theo ADA 2026',
      slug: 'diacare',
      url: rootPrefix + (isSubModule ? 'diacare/index.html' : 'diacare/index.html'),
      icon: 'fa-solid fa-vial-circle-check',
      color: '#f59e0b',
      badge: 'ADA 2026 + Basal-Bolus'
    },
    {
      id: 'inpatient',
      num: 9,
      title: 'Khám Bệnh Lâm Sàng & Bệnh Sử (Bates)',
      short: 'Khám Nội Trú',
      desc: 'Hỏi bệnh 7 thuộc tính OPQRST, khám hệ cơ quan Bates & Macleod có hệ thống',
      slug: 'inpatient',
      url: rootPrefix + (isSubModule ? 'inpatient/index.html' : 'inpatient/index.html'),
      icon: 'fa-solid fa-stethoscope',
      color: '#059669',
      badge: 'Bates & Macleod'
    },
    {
      id: 'csf',
      num: 10,
      title: 'Phân Tích Dịch Não Tủy & Viêm Màng Não (CSF CDSS)',
      short: 'Dịch Não Tủy',
      desc: 'Phân tầng Vi khuẩn/Virus/Lao/Nấm, chạm mạch vs SAH, tỷ số glucose DNT & cẩm nang LP',
      slug: 'csf',
      url: rootPrefix + (isSubModule ? 'csf/index.html' : 'csf/index.html'),
      icon: 'fa-solid fa-brain',
      color: '#4f46e5',
      badge: 'EFNS + LP Guide'
    }
  ];

  // Clinical Quick Shortcuts
  var QUICK_ACTIONS = [
    {
      title: 'Sốc SXHD Dengue Ngày 4-6 (Cọc Dịch & Vận Mạch)',
      desc: 'Bù dịch nấc thang, chuyển Cao Phân Tử Dextran 40 khi Hct ≥ 40%',
      targetUrl: rootPrefix + 'dengue/index.html',
      icon: 'fa-solid fa-droplet',
      tag: 'Cấp Cứu'
    },
    {
      title: 'STEMI Nhồi Máu Cơ Tim Cấp (12 Chuyển Đạo)',
      desc: 'Khảo sát ST chênh lên định khu thành trước, dưới, bên & soi gương',
      targetUrl: rootPrefix + 'ecg/index.html',
      icon: 'fa-solid fa-heart-pulse',
      tag: 'Tim Mạch'
    },
    {
      title: 'Toan Chuyển Hóa Tăng Anion Gap (DKA / Lactic / Suy Thận)',
      desc: 'Định lượng Anion Gap hiệu chỉnh Albumin, Delta-Delta & công thức Winter',
      targetUrl: rootPrefix + 'abg/index.html',
      icon: 'fa-solid fa-lungs',
      tag: 'Hồi Sức'
    },
    {
      title: 'Sốc Nhiễm Khuẩn (Sepsis-3 SOFA & Gói 1 Giờ SSC)',
      desc: 'Nhận diện sốc nhiễm khuẩn, đích MAP ≥ 65 mmHg và kháng sinh sớm',
      targetUrl: rootPrefix + 'sepsis/index.html',
      icon: 'fa-solid fa-biohazard',
      tag: 'Cấp Cứu'
    },
    {
      title: 'Tổn Thương Gan Cấp / Vàng Da Ứ Mật (R-ratio)',
      desc: 'Tính tỷ số R phân định tế bào gan vs ứ mật theo ACG Clinical Guidelines',
      targetUrl: rootPrefix + 'hepa/index.html',
      icon: 'fa-solid fa-virus',
      tag: 'Gan Mật'
    },
    {
      title: 'Chỉnh Liều 43 Kháng Sinh Theo Chức Năng Thận (CrCl)',
      desc: 'Cá thể hóa liều theo Cockcroft-Gault & phác đồ lọc máu HD/CRRT',
      targetUrl: rootPrefix + 'antibiotic/index.html',
      icon: 'fa-solid fa-viruses',
      tag: 'Dược Lý'
    },
    {
      title: 'Mục Tiêu Vancomycin AUC24/MIC 400 - 600',
      desc: 'Tính liều nạp 25-35 mg/kg và giám sát TDM nồng độ đáy Trough',
      targetUrl: rootPrefix + 'vancomycin/index.html',
      icon: 'fa-solid fa-syringe',
      tag: 'Dược Lý'
    },
    {
      title: 'Cấp Cứu Toan Ceton Đái Tháo Đường (DKA & HHS)',
      desc: 'Bù dịch đẳng trương, bù Kali, truyền Insulin tĩnh mạch liên tục',
      targetUrl: rootPrefix + 'diacare/index.html',
      icon: 'fa-solid fa-vial-circle-check',
      tag: 'Nội Tiết'
    },
    {
      title: 'Hội Chứng Màng Não & Phân Tích Dịch Não Tủy (CSF)',
      desc: 'Phân tầng Vi khuẩn vs Virus vs Lao vs Nấm, phân biệt Chạm mạch vs SAH',
      targetUrl: rootPrefix + 'csf/index.html',
      icon: 'fa-solid fa-brain',
      tag: 'Thần Kinh'
    }
  ];

  /* --------------------------------------------------------------------------
     1. THEME CONTROLLER (Auto Light Mode Default + Universal Synchronization)
     -------------------------------------------------------------------------- */
  var THEME_KEYS = ['cliniportal_theme', 'clinical_theme', 'theme', 'dsp-theme'];

  function saveStoredTheme(theme) {
    if (theme !== 'dark' && theme !== 'light') theme = 'light';
    THEME_KEYS.forEach(function (k) {
      try {
        localStorage.setItem(k, theme);
      } catch (e) {}
    });
    try {
      if (window.history && window.history.replaceState) {
        var url = new URL(window.location.href);
        url.searchParams.set('theme', theme);
        window.history.replaceState(null, '', url.toString());
      }
    } catch (e) {}
  }

  function getPreferredTheme() {
    try {
      // 1. URL search param has highest immediate priority (supports file:/// protocol)
      var urlParams = new URLSearchParams(window.location.search);
      var urlTheme = urlParams.get('theme');
      if (urlTheme === 'dark' || urlTheme === 'light') {
        saveStoredTheme(urlTheme);
        return urlTheme;
      }

      // 2. Check stored theme keys
      for (var i = 0; i < THEME_KEYS.length; i++) {
        var saved = localStorage.getItem(THEME_KEYS[i]);
        if (saved === 'dark' || saved === 'light') {
          saveStoredTheme(saved);
          return saved;
        }
      }
    } catch (e) {}

    // 3. Absolute Clinical Default: LIGHT MODE
    return 'light';
  }

  function applyTheme(theme, updateToggleBtn) {
    if (theme !== 'dark' && theme !== 'light') theme = 'light';
    if (typeof updateToggleBtn === 'undefined') updateToggleBtn = true;

    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      if (document.body) {
        document.body.classList.add('dark');
        document.body.setAttribute('data-theme', 'dark');
      }
    } else {
      document.documentElement.classList.remove('dark');
      if (document.body) {
        document.body.classList.remove('dark');
        document.body.setAttribute('data-theme', 'light');
      }
    }

    if (updateToggleBtn) {
      var toggleBtns = document.querySelectorAll('#theme-toggle, .cdss-portal-theme-btn, .cdss-theme-toggle, .cdss-dock-theme-btn');
      toggleBtns.forEach(function (btn) {
        btn.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        btn.setAttribute('title', theme === 'dark' ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối');
      });
    }

    window.dispatchEvent(new CustomEvent('cliniportal-theme-change', { detail: { theme: theme } }));
  }

  function toggleTheme() {
    triggerHaptic();
    var current = document.documentElement.getAttribute('data-theme') || 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    saveStoredTheme(next);
    applyTheme(next, true);
    showToast(next === 'dark' ? 'Đã bật chế độ Tối (Dark Mode)' : 'Đã bật chế độ Sáng (Clinical Light)');
  }

  // Pre-apply theme before render to eliminate flash of unstyled content
  applyTheme(getPreferredTheme(), false);

  /* --------------------------------------------------------------------------
     2. HAPTIC & TOAST HELPERS
     -------------------------------------------------------------------------- */
  function triggerHaptic() {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(10);
      } catch (e) {}
    }
  }

  function showToast(message) {
    var toast = document.querySelector('.cdss-shell-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'cdss-shell-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span>' + message + '</span>';
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(function () {
      toast.classList.remove('show');
    }, 2800);
  }

  /* --------------------------------------------------------------------------
     3. COMMAND PALETTE (Ctrl+K / Cmd+K Quick Switcher)
     -------------------------------------------------------------------------- */
  var cmdOverlay = null;
  var cmdInput = null;
  var cmdBody = null;
  var selectedIndex = 0;
  var currentFilteredItems = [];

  function buildCommandPaletteDOM() {
    if (document.querySelector('.cdss-cmd-overlay')) return;

    cmdOverlay = document.createElement('div');
    cmdOverlay.className = 'cdss-cmd-overlay';
    cmdOverlay.innerHTML = [
      '<div class="cdss-cmd-modal" role="dialog" aria-modal="true" aria-label="Tra cứu và chuyển nhanh CDSS">',
      '  <div class="cdss-cmd-search-wrap">',
      '    <i class="fa-solid fa-magnifying-glass"></i>',
      '    <input type="text" class="cdss-cmd-input" placeholder="Tìm CDSS, thuốc, phác đồ, sốc, ECG, ABG, men gan... (nhấn 1-9 để nhảy nhanh)" autocomplete="off" />',
      '    <span class="cdss-cmd-badge">ESC để đóng</span>',
      '  </div>',
      '  <div class="cdss-cmd-body"></div>',
      '  <div class="cdss-cmd-footer">',
      '    <div class="cdss-cmd-hints">',
      '      <span><span class="cdss-cmd-kbd">↑</span> <span class="cdss-cmd-kbd">↓</span> Di chuyển</span>',
      '      <span><span class="cdss-cmd-kbd">↵</span> Mở ngay</span>',
      '      <span><span class="cdss-cmd-kbd">1-9</span> Phím tắt</span>',
      '    </div>',
      '    <span>9 Chuyên Khoa CDSS</span>',
      '  </div>',
      '</div>'
    ].join('');

    document.body.appendChild(cmdOverlay);
    cmdInput = cmdOverlay.querySelector('.cdss-cmd-input');
    cmdBody = cmdOverlay.querySelector('.cdss-cmd-body');

    // Click outside to close
    cmdOverlay.addEventListener('click', function (e) {
      if (e.target === cmdOverlay) {
        closeCommandPalette();
      }
    });

    // Input search filter
    cmdInput.addEventListener('input', function () {
      renderCommandList(cmdInput.value.trim().toLowerCase());
    });

    // Keyboard navigation
    cmdInput.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        navigateList(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        navigateList(-1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        activateSelectedItem();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeCommandPalette();
      } else if (e.key >= '1' && e.key <= '9' && !cmdInput.value) {
        var num = parseInt(e.key, 10);
        var mod = MODULES[num - 1];
        if (mod) {
          e.preventDefault();
          window.location.href = mod.url;
        }
      }
    });
  }

  function openCommandPalette() {
    triggerHaptic();
    buildCommandPaletteDOM();
    cmdOverlay.classList.add('open');
    cmdInput.value = '';
    renderCommandList('');
    setTimeout(function () {
      cmdInput.focus();
    }, 50);
  }

  function closeCommandPalette() {
    if (cmdOverlay) {
      cmdOverlay.classList.remove('open');
    }
  }

  function renderCommandList(query) {
    if (!cmdBody) return;

    var filteredMods = MODULES.filter(function (m) {
      if (!query) return true;
      return m.title.toLowerCase().indexOf(query) !== -1 ||
             m.desc.toLowerCase().indexOf(query) !== -1 ||
             m.short.toLowerCase().indexOf(query) !== -1 ||
             m.slug.toLowerCase().indexOf(query) !== -1;
    });

    var filteredActions = QUICK_ACTIONS.filter(function (a) {
      if (!query) return true;
      return a.title.toLowerCase().indexOf(query) !== -1 ||
             a.desc.toLowerCase().indexOf(query) !== -1 ||
             a.tag.toLowerCase().indexOf(query) !== -1;
    });

    currentFilteredItems = [];
    filteredMods.forEach(function (m) {
      currentFilteredItems.push({ type: 'module', url: m.url });
    });
    filteredActions.forEach(function (a) {
      currentFilteredItems.push({ type: 'action', url: a.targetUrl });
    });

    selectedIndex = 0;

    if (currentFilteredItems.length === 0) {
      cmdBody.innerHTML = '<div class="cdss-cmd-empty"><i class="fa-solid fa-search" style="font-size:1.5rem; margin-bottom:0.5rem; opacity:0.5;"></i><br>Không tìm thấy module hoặc phác đồ khớp với từ khóa "' + query + '".</div>';
      return;
    }

    var html = [];

    if (filteredMods.length > 0) {
      html.push('<div class="cdss-cmd-group-title"><span>Hệ Thống 9 Module CDSS</span><span>Phím 1-9</span></div>');
      filteredMods.forEach(function (m, idx) {
        var isCurrentPage = window.location.pathname.indexOf('/' + m.slug + '/') !== -1;
        html.push([
          '<a href="' + m.url + '" class="cdss-cmd-item ' + (idx === 0 ? 'selected' : '') + '" data-index="' + idx + '">',
          '  <div class="cdss-cmd-item-icon" style="color:' + m.color + ';"><i class="' + m.icon + '"></i></div>',
          '  <div class="cdss-cmd-item-content">',
          '    <div class="cdss-cmd-item-title">' + m.title + (isCurrentPage ? ' <small style="color:var(--color-primary); font-weight:600;">(Đang mở)</small>' : '') + '</div>',
          '    <div class="cdss-cmd-item-desc">' + m.desc + '</div>',
          '  </div>',
          '  <span class="cdss-cmd-item-shortcut">' + m.num + '</span>',
          '</a>'
        ].join(''));
      });
    }

    if (filteredActions.length > 0) {
      var startIndex = filteredMods.length;
      html.push('<div class="cdss-cmd-group-title" style="margin-top:0.6rem;"><span>Tình Huống Cấp Cứu &amp; Phác Đồ Nhanh</span><span>' + filteredActions.length + ' tình huống</span></div>');
      filteredActions.forEach(function (a, aIdx) {
        var overallIdx = startIndex + aIdx;
        html.push([
          '<a href="' + a.targetUrl + '" class="cdss-cmd-item ' + (overallIdx === selectedIndex ? 'selected' : '') + '" data-index="' + overallIdx + '">',
          '  <div class="cdss-cmd-item-icon" style="color:var(--color-primary);"><i class="' + a.icon + '"></i></div>',
          '  <div class="cdss-cmd-item-content">',
          '    <div class="cdss-cmd-item-title">' + a.title + '</div>',
          '    <div class="cdss-cmd-item-desc">' + a.desc + '</div>',
          '  </div>',
          '  <span class="cdss-cmd-item-shortcut">' + a.tag + '</span>',
          '</a>'
        ].join(''));
      });
    }

    cmdBody.innerHTML = html.join('');

    // Hover listeners
    var items = cmdBody.querySelectorAll('.cdss-cmd-item');
    items.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        items.forEach(function (i) { i.classList.remove('selected'); });
        el.classList.add('selected');
        selectedIndex = parseInt(el.getAttribute('data-index') || '0', 10);
      });
    });
  }

  function navigateList(direction) {
    if (!cmdBody || currentFilteredItems.length === 0) return;
    selectedIndex = (selectedIndex + direction + currentFilteredItems.length) % currentFilteredItems.length;
    var items = cmdBody.querySelectorAll('.cdss-cmd-item');
    items.forEach(function (el, idx) {
      if (idx === selectedIndex) {
        el.classList.add('selected');
        el.scrollIntoView({ block: 'nearest' });
      } else {
        el.classList.remove('selected');
      }
    });
  }

  function activateSelectedItem() {
    if (currentFilteredItems[selectedIndex]) {
      window.location.href = currentFilteredItems[selectedIndex].url;
    }
  }

  /* --------------------------------------------------------------------------
     4. MOBILE BOTTOM SHEET (Chạm Đổi Nhanh 9 CDSS)
     -------------------------------------------------------------------------- */
  var sheetOverlay = null;

  function buildBottomSheetDOM() {
    if (document.querySelector('.cdss-sheet-overlay')) return;

    sheetOverlay = document.createElement('div');
    sheetOverlay.className = 'cdss-sheet-overlay';
    
    var itemsHtml = MODULES.map(function (m) {
      var isCurrentPage = window.location.pathname.indexOf('/' + m.slug + '/') !== -1;
      return [
        '<a href="' + m.url + '" class="cdss-sheet-item ' + (isCurrentPage ? 'active' : '') + '">',
        '  <div class="cdss-sheet-item-icon" style="background:' + m.color + ';"><i class="' + m.icon + '"></i></div>',
        '  <div class="cdss-sheet-item-info">',
        '    <div class="cdss-sheet-item-name">' + m.short + (isCurrentPage ? ' <span style="font-size:0.75rem; color:var(--color-primary); font-weight:700;">● Hiện tại</span>' : '') + '</div>',
        '    <div class="cdss-sheet-item-badge">' + m.badge + '</div>',
        '  </div>',
        '  <i class="fa-solid fa-chevron-right" style="color:var(--color-text-muted); font-size:0.8rem;"></i>',
        '</a>'
      ].join('');
    }).join('');

    sheetOverlay.innerHTML = [
      '<div class="cdss-bottom-sheet">',
      '  <div class="cdss-sheet-handle"></div>',
      '  <div class="cdss-sheet-header">',
      '    <h3 class="cdss-sheet-title"><i class="fa-solid fa-layer-group text-teal-600"></i> Chọn Chuyên Khoa CDSS</h3>',
      '    <button type="button" class="cdss-sheet-close" aria-label="Đóng"><i class="fa-solid fa-xmark"></i></button>',
      '  </div>',
      '  <div class="cdss-sheet-body">',
      itemsHtml,
      '  </div>',
      '</div>'
    ].join('');

    document.body.appendChild(sheetOverlay);

    sheetOverlay.addEventListener('click', function (e) {
      if (e.target === sheetOverlay || e.target.closest('.cdss-sheet-close')) {
        closeBottomSheet();
      }
    });
  }

  function openBottomSheet() {
    triggerHaptic();
    buildBottomSheetDOM();
    sheetOverlay.classList.add('open');
  }

  function closeBottomSheet() {
    if (sheetOverlay) {
      sheetOverlay.classList.remove('open');
    }
  }

  /* --------------------------------------------------------------------------
     5. MOBILE & TABLET BEDSIDE DOCK (Thanh Công Cụ Đáy)
     -------------------------------------------------------------------------- */
  function buildBedsideDockDOM() {
    if (document.querySelector('.cdss-bedside-dock')) return;

    var dock = document.createElement('nav');
    dock.className = 'cdss-bedside-dock';
    dock.setAttribute('aria-label', 'Bedside Quick Navigation');

    var isHome = !isSubModule || window.location.pathname.endsWith('index.html') && !window.location.pathname.includes('/');
    var homeUrl = rootPrefix + 'index.html';

    dock.innerHTML = [
      '<a href="' + homeUrl + '" class="cdss-dock-btn ' + (!isSubModule ? 'active' : '') + '" title="Cổng CDSS Platform" aria-label="Cổng CDSS Platform">',
      '  <i class="fa-solid fa-microchip"></i>',
      '  <span>Cổng CDSS</span>',
      '</a>',
      '<button type="button" class="cdss-dock-btn cdss-dock-btn--accent" id="btn-dock-switcher" title="Đổi Chuyên Khoa CDSS (9 Modules)" aria-label="Đổi Chuyên Khoa CDSS">',
      '  <i class="fa-solid fa-shapes"></i>',
      '  <span>Đổi CDSS</span>',
      '</button>',
      '<button type="button" class="cdss-dock-btn" id="btn-dock-search" title="Tra cứu phác đồ & thuốc (Ctrl+K)" aria-label="Tra cứu phác đồ và thuốc">',
      '  <i class="fa-solid fa-magnifying-glass"></i>',
      '  <span>Tra Cứu</span>',
      '</button>',
      '<button type="button" class="cdss-dock-btn cdss-dock-theme-btn" id="btn-dock-theme" title="Chuyển chế độ Sáng / Tối" aria-label="Chuyển giao diện sáng tối">',
      '  <i class="fa-solid fa-moon"></i>',
      '  <span>Giao Diện</span>',
      '</button>',
      '<button type="button" class="cdss-dock-btn" id="btn-dock-top" title="Cuộn lên đầu trang" aria-label="Cuộn lên đầu trang">',
      '  <i class="fa-solid fa-arrow-up"></i>',
      '  <span>Lên Đầu</span>',
      '</button>'
    ].join('');

    document.body.appendChild(dock);

    // Event handlers for dock buttons
    dock.querySelector('#btn-dock-switcher').addEventListener('click', function () {
      openBottomSheet();
    });

    dock.querySelector('#btn-dock-search').addEventListener('click', function () {
      openCommandPalette();
    });

    dock.querySelector('#btn-dock-theme').addEventListener('click', function () {
      toggleTheme();
    });

    dock.querySelector('#btn-dock-top').addEventListener('click', function () {
      triggerHaptic();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --------------------------------------------------------------------------
     6. FLOATING BACK TO TOP & NAVBAR QUICK-SWITCH INJECTION
     -------------------------------------------------------------------------- */
  function buildBackToTopDOM() {
    if (document.querySelector('.cdss-back-to-top')) return;

    var btn = document.createElement('button');
    btn.className = 'cdss-back-to-top';
    btn.setAttribute('title', 'Cuộn lên đầu trang');
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    document.body.appendChild(btn);

    btn.addEventListener('click', function () {
      triggerHaptic();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', function () {
      if (window.scrollY > 350) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });
  }

  function injectNavbarQuickSwitch() {
    var navRight = document.querySelector('.cdss-portal-nav-right');
    if (!navRight || navRight.querySelector('.cdss-nav-cmd-btn')) return;

    var cmdBtn = document.createElement('button');
    cmdBtn.type = 'button';
    cmdBtn.className = 'cdss-portal-nav-btn cdss-portal-icon-btn cdss-nav-cmd-btn';
    cmdBtn.setAttribute('title', 'Chuyển nhanh CDSS (Phím tắt: Ctrl+K / ⌘K)');
    cmdBtn.setAttribute('aria-label', 'Chuyển nhanh CDSS');
    cmdBtn.innerHTML = '<i class="fa-solid fa-bolt text-teal-600"></i>';
    
    // Insert before theme toggle button
    navRight.insertBefore(cmdBtn, navRight.firstChild);

    cmdBtn.addEventListener('click', function (e) {
      e.preventDefault();
      openCommandPalette();
    });
  }

  /* --------------------------------------------------------------------------
     7. PWA SERVICE WORKER REGISTRATION
     -------------------------------------------------------------------------- */
  function registerPwa() {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.location.protocol.indexOf('http') === 0) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register(rootPrefix + 'sw.js').catch(function () {});
      });
    }
  }

  /* --------------------------------------------------------------------------
     8. GLOBAL EVENT LISTENERS & SHORTCUTS
     -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(getPreferredTheme(), true);
    buildCommandPaletteDOM();
    buildBottomSheetDOM();
    buildBedsideDockDOM();
    buildBackToTopDOM();
    injectNavbarQuickSwitch();
    registerPwa();

    // Universal Global Hotkey Listener
    window.addEventListener('keydown', function (e) {
      // Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (cmdOverlay && cmdOverlay.classList.contains('open')) {
          closeCommandPalette();
        } else {
          openCommandPalette();
        }
      }
      // Press '/' to search when focus is not inside an input/textarea
      if (e.key === '/' && !cmdOverlay?.classList.contains('open')) {
        var activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
        if (activeTag !== 'input' && activeTag !== 'textarea' && activeTag !== 'select') {
          e.preventDefault();
          var localSearch = document.getElementById('cdss-search-input');
          if (localSearch) {
            localSearch.focus();
          } else {
            openCommandPalette();
          }
        }
      }
    });

    // Theme toggle delegate
    document.addEventListener('click', function (e) {
      var target = e.target;
      var btn = target && target.closest ? target.closest('#theme-toggle, .cdss-portal-theme-btn, .cdss-theme-toggle') : null;
      if (btn) {
        e.preventDefault();
        toggleTheme();
      }
    });

    // Storage listener across tabs
    window.addEventListener('storage', function (e) {
      if (THEME_KEYS.indexOf(e.key) !== -1 && (e.newValue === 'light' || e.newValue === 'dark')) {
        applyTheme(e.newValue, true);
      }
    });

    // Universal link theme decorator to ensure file:/// and cross-page navigation maintains theme
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a') : null;
      if (a && a.href) {
        var href = a.getAttribute('href');
        if (href && href.indexOf('.html') !== -1 && href.indexOf('javascript:') !== 0 && href.indexOf('#') !== 0) {
          var currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
          saveStoredTheme(currentTheme);
          var parts = href.split('#');
          var base = parts[0];
          var hash = parts.length > 1 ? '#' + parts[1] : '';
          var sep = base.indexOf('?') !== -1 ? '&' : '?';
          if (base.indexOf('theme=') !== -1) {
            base = base.replace(/theme=(dark|light)/g, 'theme=' + currentTheme);
          } else {
            base = base + sep + 'theme=' + currentTheme;
          }
          a.setAttribute('href', base + hash);
        }
      }
    }, true);
  });

  // Expose global controller
  window.CliniPortal = {
    theme: {
      get: getPreferredTheme,
      apply: applyTheme,
      toggle: toggleTheme
    },
    toast: showToast,
    openPalette: openCommandPalette,
    closePalette: closeCommandPalette,
    openSheet: openBottomSheet,
    closeSheet: closeBottomSheet,
    modules: MODULES
  };

  window.CliniPortalTheme = window.CliniPortal.theme;
})();
