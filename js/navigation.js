/* ==========================================================================
   NAVIGATION.JS
   Purpose: Sidebar behavior — desktop collapse/expand, mobile drawer
   open/close, and highlighting the current page in the sidebar.
   ========================================================================== */

const Navigation = (() => {
  const STORAGE_KEY = 'sidebar_collapsed';

  function markActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.sidebar-link').forEach((link) => {
      const linkPage = link.getAttribute('data-page');
      link.classList.toggle('active', linkPage === currentPage);
    });
  }

  function initDesktopCollapse() {
    const shell = document.querySelector('.app-shell');
    const toggleBtn = document.querySelector('[data-sidebar-toggle]');
    if (!shell || !toggleBtn) return;

    const collapsed = Storage.get(STORAGE_KEY, false);
    shell.classList.toggle('sidebar-collapsed', collapsed);

    toggleBtn.addEventListener('click', () => {
      const isCollapsed = shell.classList.toggle('sidebar-collapsed');
      Storage.set(STORAGE_KEY, isCollapsed);
    });
  }

  function initMobileDrawer() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const menuBtn = document.querySelector('[data-mobile-menu]');
    if (!sidebar || !overlay || !menuBtn) return;

    function open() {
      sidebar.classList.add('mobile-open');
      overlay.classList.add('active');
    }

    function close() {
      sidebar.classList.remove('mobile-open');
      overlay.classList.remove('active');
    }

    menuBtn.addEventListener('click', open);
    overlay.addEventListener('click', close);

    // Close drawer automatically when a nav link is tapped on mobile,
    // otherwise the drawer stays open after navigating — a common bug
    // in hand-rolled mobile nav implementations.
    document.querySelectorAll('.sidebar-link').forEach((link) => {
      link.addEventListener('click', close);
    });
  }

  function init() {
    markActiveLink();
    initDesktopCollapse();
    initMobileDrawer();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', Navigation.init);
