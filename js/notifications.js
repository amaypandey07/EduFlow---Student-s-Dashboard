/* ==========================================================================
   NOTIFICATIONS.JS
   Purpose: Toast notifications ("Assignment added successfully" etc).
   Any other JS file calls Notify.show(message, type) — this module
   owns the DOM creation and auto-removal timing so that logic isn't
   duplicated across assignments.js, profile.js, etc.
   ========================================================================== */

const Notify = (() => {
  function ensureContainer() {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  /**
   * @param {string} message
   * @param {'success'|'error'|'warning'} type
   * @param {number} duration - ms before auto-dismiss
   */
  function show(message, type = 'success', duration = 3000) {
    const container = ensureContainer();

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? '' : type}`;

    const icon =
      type === 'success' ? 'fa-circle-check' :
      type === 'error' ? 'fa-circle-xmark' : 'fa-triangle-exclamation';

    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    // Auto-dismiss: add the "leaving" class to trigger the CSS
    // slide-out animation, THEN remove the element from the DOM
    // only after that animation finishes (matches the 250ms
    // --transition-base duration in components.css).
    setTimeout(() => {
      toast.classList.add('leaving');
      setTimeout(() => toast.remove(), 250);
    }, duration);
  }

  return { show };
})();
