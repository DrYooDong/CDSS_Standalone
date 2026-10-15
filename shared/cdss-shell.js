/**
 * CliniPortal CDSS — Shared Shell Navigation & Theme Controller
 * Path: /shared/cdss-shell.js
 * 
 * Synchronized Light/Dark Theme Controller (Default: Light Mode)
 * Ensures smooth theme propagation across all CDSS modules & Main Hub.
 */

(function () {
  var THEME_KEY = 'cliniportal_theme';

  function getPreferredTheme() {
    var saved = localStorage.getItem(THEME_KEY);
    // Explicit user choice
    if (saved === 'dark' || saved === 'light') return saved;
    // Default strictly to light mode
    return 'light';
  }

  function applyTheme(theme, updateToggleBtn) {
    if (typeof updateToggleBtn === 'undefined') updateToggleBtn = true;
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    if (updateToggleBtn) {
      var toggleBtns = document.querySelectorAll('#theme-toggle, .cdss-portal-theme-btn, .cdss-theme-toggle');
      toggleBtns.forEach(function (btn) {
        btn.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        btn.setAttribute('title', theme === 'dark' ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối');
      });
    }

    window.dispatchEvent(new CustomEvent('cliniportal-theme-change', { detail: { theme: theme } }));
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') || 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {
      // Ignore localStorage quotas
    }
    applyTheme(next);
  }

  // Khởi tạo theme tức thời trước khi render hoàn tất (Default: Light)
  var initialTheme = getPreferredTheme();
  applyTheme(initialTheme, false);

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(getPreferredTheme(), true);

    // Gán sự kiện cho các nút toggle
    document.addEventListener('click', function (e) {
      var target = e.target;
      var btn = target && target.closest ? target.closest('#theme-toggle, .cdss-portal-theme-btn, .cdss-theme-toggle') : null;
      if (btn) {
        e.preventDefault();
        toggleTheme();
      }
    });

    // Đồng bộ theme qua các tab trình duyệt
    window.addEventListener('storage', function (e) {
      if (e.key === THEME_KEY && (e.newValue === 'light' || e.newValue === 'dark')) {
        applyTheme(e.newValue, true);
      }
    });
  });

  // Expose global controller
  window.CliniPortalTheme = {
    get: getPreferredTheme,
    apply: applyTheme,
    toggle: toggleTheme
  };
})();
