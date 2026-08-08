/* ==========================================================================
   THEME.JS
   Purpose: Dark/light mode switching.

   HOW IT WORKS END TO END (the mechanism, not just the code):
   1. On page load, we check Storage for a saved preference.
      If none exists, we check the OS-level preference via
      `prefers-color-scheme` media query (respects the user's system
      setting on first visit — a nice UX touch that's genuinely expected
      in production apps, not just a college-project flourish).
   2. We set `data-theme="dark"` or `data-theme="light"` on <html>.
   3. variables.css has a `[data-theme='dark'] { ... }` block that
      OVERRIDES the :root CSS variables when that attribute is present.
      Since every component's CSS uses var(--surface) etc instead of a
      hardcoded color, the ENTIRE app re-themes instantly — this JS file
      never touches individual elements' colors. It only flips one
      attribute; CSS does the rest. This separation (JS = state,
      CSS = presentation) is intentional and important to explain in viva.
   4. Every toggle click re-saves the preference via Storage.set(),
      so it persists across page reloads and across different pages
      of the multi-page app.
   ========================================================================== */

const Theme = (() => {
  const STORAGE_KEY = 'theme';

  function getSystemPreference() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateToggleIcon(theme);
  }

  function updateToggleIcon(theme) {
    const btn = document.querySelector('[data-theme-toggle]');
    if (!btn) return;
    const icon = btn.querySelector('i');
    if (!icon) return;
    icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }

  function toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    apply(next);
    Storage.set(STORAGE_KEY, next);
  }

  function init() {
    const saved = Storage.get(STORAGE_KEY);
    const theme = saved || getSystemPreference();
    apply(theme);

    const btn = document.querySelector('[data-theme-toggle]');
    if (btn) {
      btn.addEventListener('click', toggle);
    }
  }

  return { init, toggle };
})();

document.addEventListener('DOMContentLoaded', Theme.init);
