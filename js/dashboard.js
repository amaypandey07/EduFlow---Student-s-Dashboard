/* ==========================================================================
   DASHBOARD.JS
   Purpose: Turns StudentData (data.js) into actual DOM elements on the
   dashboard page. This file follows one repeated pattern throughout:
   READ data -> BUILD an HTML string -> INJECT it into a container via
   innerHTML. This is the core "render" pattern used by every page's
   JS file in this app (academics.js, attendance.js, etc all do the
   same 3-step thing with different data).
   ========================================================================== */

const Dashboard = (() => {

  function animateCounters() {
    document.querySelectorAll('[data-counter]').forEach((el) => {
      const target = parseFloat(el.dataset.target);
      const decimals = parseInt(el.dataset.decimal || '0', 10);
      const suffix = el.dataset.suffix ?? '';
      const duration = 1200;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        // ease-out curve so the count-up decelerates naturally
        // instead of moving at a constant linear speed
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        el.textContent = current.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  function renderAcademicPerformance() {
    const container = document.getElementById('academic-performance-list');
    if (!container) return;

    container.innerHTML = StudentData.subjects.map((s) => `
      <div class="perf-row">
        <div class="perf-row-label">
          <span>${s.name}</span>
          <span class="badge badge-neutral">${s.grade}</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill ${scoreClass(s.score)}" data-fill="${s.score}"></div>
        </div>
      </div>
    `).join('');

    // Trigger the width transition AFTER the elements exist in the DOM.
    // Setting width in the same tick as innerHTML would skip the CSS
    // transition (browser paints the final state immediately) —
    // this is a genuinely common animation bug worth knowing about.
    requestAnimationFrame(() => {
      container.querySelectorAll('[data-fill]').forEach((bar) => {
        bar.style.width = bar.dataset.fill + '%';
      });
    });
  }

  function scoreClass(score) {
    if (score >= 85) return 'success';
    if (score >= 70) return '';
    return 'danger';
  }

  function renderUpcomingAssignments() {
    const container = document.getElementById('upcoming-assignments-list');
    if (!container) return;

    const assignments = Storage.get('assignments', StudentData.defaultAssignments)
      .filter((a) => a.status === 'pending')
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 4);

    if (assignments.length === 0) {
      container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-circle-check empty-state-icon"></i><p>All caught up — no pending assignments.</p></div>`;
      return;
    }

    container.innerHTML = assignments.map((a) => `
      <div class="list-row">
        <div>
          <div class="list-row-title">${a.title}</div>
          <div class="list-row-sub">${a.subject} · Due ${formatDate(a.dueDate)}</div>
        </div>
        <span class="badge badge-${a.priority === 'high' ? 'danger' : a.priority === 'medium' ? 'warning' : 'neutral'}">${a.priority}</span>
      </div>
    `).join('');
  }

  function renderAttendanceRing() {
    const value = StudentData.attendance.overall;
    const circle = document.getElementById('attendance-ring-fill');
    const label = document.getElementById('attendance-ring-value');
    if (!circle || !label) return;

    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;

    label.textContent = value + '%';

    requestAnimationFrame(() => {
      const offset = circumference - (value / 100) * circumference;
      circle.style.strokeDashoffset = offset;
    });
  }

  function renderTodaysClasses() {
    const container = document.getElementById('todays-classes-list');
    if (!container) return;

    const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const today = StudentData.timetable.find((d) => d.day === dayName);
    const slots = today ? today.slots : StudentData.timetable[0].slots; // fallback so Sunday still shows something

    container.innerHTML = slots.map((s) => `
      <div class="list-row">
        <div>
          <div class="list-row-title">${s.subject}</div>
          <div class="list-row-sub">${s.room} · ${s.faculty}</div>
        </div>
        <span class="list-row-time">${s.time.split(' - ')[0]}</span>
      </div>
    `).join('');
  }

  function renderRecentActivity() {
    const container = document.getElementById('recent-activity-list');
    if (!container) return;

    container.innerHTML = StudentData.recentActivity.map((item) => `
      <div class="list-row">
        <div class="list-row-icon"><i class="fa-solid ${item.icon}"></i></div>
        <div style="flex:1">
          <div class="list-row-title">${item.text}</div>
          <div class="list-row-sub">${item.time}</div>
        </div>
      </div>
    `).join('');
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  }

  function setGreeting() {
    const hour = new Date().getHours();
    const name = StudentData.profile.name.split(' ')[0];
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const el = document.getElementById('greeting-text');
    if (el) el.textContent = `${greeting}, ${name}`;

    const dateEl = document.getElementById('today-date');
    if (dateEl) {
      dateEl.textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      });
    }
  }

  function init() {
    setGreeting();
    animateCounters();
    renderAcademicPerformance();
    renderUpcomingAssignments();
    renderAttendanceRing();
    renderTodaysClasses();
    renderRecentActivity();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', Dashboard.init);
