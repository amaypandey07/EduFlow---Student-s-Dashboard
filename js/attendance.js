/* ==========================================================================
   ATTENDANCE.JS
   Purpose: Turns StudentData.attendance (raw present/total counts) into
   percentages, then renders color-coded progress bars.

   KEY LOGIC — the threshold decision:
   Most colleges require 75% attendance minimum to sit exams. So the
   color-coding here isn't arbitrary — it maps to that real-world rule:
     >= 75%  -> green  (safe)
     65-74%  -> amber  (warning, getting close to the cutoff)
     < 65%   -> red    (critical, already below or nearly below cutoff)
   This is a good example of "the UI should encode a real business rule",
   not just "look nice" — worth mentioning in viva if asked why these
   specific colors/cutoffs were chosen.
   ========================================================================== */

const Attendance = (() => {
  const SAFE_THRESHOLD = 75;
  const WARNING_THRESHOLD = 65;

  function getStatusClass(percentage) {
    if (percentage >= SAFE_THRESHOLD) return 'success';
    if (percentage >= WARNING_THRESHOLD) return 'warning';
    return 'danger';
  }

  function getStatusLabel(percentage) {
    if (percentage >= SAFE_THRESHOLD) return 'Good';
    if (percentage >= WARNING_THRESHOLD) return 'Low';
    return 'Critical';
  }

  function renderOverall() {
    const value = StudentData.attendance.overall;
    const valueEl = document.getElementById('overall-value');
    const fillEl = document.getElementById('overall-fill');
    if (!valueEl || !fillEl) return;

    valueEl.textContent = value + '%';
    fillEl.classList.add(getStatusClass(value));

    requestAnimationFrame(() => {
      fillEl.style.width = value + '%';
    });
  }

  function renderSubjectList() {
    const container = document.getElementById('attendance-list');
    if (!container) return;

    container.innerHTML = StudentData.attendance.subjects.map((s) => {
      // Percentage is DERIVED data — we never store it directly,
      // we always compute it from present/total. This avoids the two
      // numbers ever going out of sync with each other.
      const percentage = Math.round((s.present / s.total) * 100);
      const statusClass = getStatusClass(percentage);

      return `
        <div class="attendance-row">
          <div class="attendance-row-header">
            <span class="attendance-row-name">${s.subject}</span>
            <span class="badge badge-${statusClass}">${getStatusLabel(percentage)}</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill ${statusClass}" data-fill="${percentage}"></div>
          </div>
          <div class="attendance-row-footer">
            <span>${s.present} / ${s.total} classes attended</span>
            <span class="attendance-row-percent">${percentage}%</span>
          </div>
        </div>
      `;
    }).join('');

    requestAnimationFrame(() => {
      container.querySelectorAll('[data-fill]').forEach((bar) => {
        bar.style.width = bar.dataset.fill + '%';
      });
    });
  }

  function init() {
    renderOverall();
    renderSubjectList();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', Attendance.init);
