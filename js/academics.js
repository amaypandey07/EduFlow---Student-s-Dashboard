/* ==========================================================================
   ACADEMICS.JS
   Purpose: Renders the subject-wise performance table on academics.html.
   Same pattern as dashboard.js: read StudentData -> build HTML string ->
   inject into container -> trigger progress-bar width transition on the
   next animation frame.
   ========================================================================== */

const Academics = (() => {

  function gradeColor(score) {
    if (score >= 85) return 'success';
    if (score >= 70) return 'warning';
    return 'danger';
  }

  function renderSubjectsTable() {
    const container = document.getElementById('subjects-table');
    if (!container) return;

    container.innerHTML = StudentData.subjects.map((s) => `
      <div class="subject-row">
        <div class="subject-row-info">
          <span class="subject-row-name">${s.name}</span>
          <span class="subject-row-credits">${s.credits} credits</span>
        </div>
        <div class="subject-row-progress">
          <div class="progress-track">
            <div class="progress-fill ${gradeColor(s.score)}" data-fill="${s.score}"></div>
          </div>
        </div>
        <span class="subject-row-score">${s.score}%</span>
        <span class="badge badge-neutral">${s.grade}</span>
      </div>
    `).join('');

    // Same reasoning as dashboard.js: set widths on the next frame so
    // the CSS transition actually plays instead of snapping instantly.
    requestAnimationFrame(() => {
      container.querySelectorAll('[data-fill]').forEach((bar) => {
        bar.style.width = bar.dataset.fill + '%';
      });
    });
  }

  function init() {
    renderSubjectsTable();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', Academics.init);
