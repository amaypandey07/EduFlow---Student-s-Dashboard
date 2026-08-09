/* ==========================================================================
   TIMETABLE.JS
   Purpose: Render the weekly timetable in TWO formats from the SAME data:
   a desktop table and a mobile card list.

   KEY DESIGN DECISION (viva-important):
   We build BOTH structures in the DOM at all times. CSS media queries
   (in responsive.css) decide which one is visually displayed —
   `.timetable-table { display: none }` below 768px, and
   `.timetable-cards { display: none }` above 768px.

   Why not have JS detect screen width and choose? Because CSS media
   queries react to window resizing INSTANTLY and natively — if you
   resize the browser from desktop to mobile width, the layout swaps
   with zero JS involvement. If JS decided this once on load, resizing
   the window wouldn't update anything until the next page reload.
   This is a general principle: prefer CSS for "what does this look
   like at this size" and JS only for actual interactivity/data.
   ========================================================================== */

const Timetable = (() => {

  function renderTable() {
    const table = document.getElementById('timetable-table');
    if (!table) return;

    const days = StudentData.timetable;
    // Find the longest day (most class slots) so every row in the
    // table has a matching column — a timetable is naturally a grid.
    const maxSlots = Math.max(...days.map((d) => d.slots.length));

    let html = '<thead><tr><th>Time</th>';
    days.forEach((d) => { html += `<th>${d.day}</th>`; });
    html += '</tr></thead><tbody>';

    for (let i = 0; i < maxSlots; i++) {
      html += '<tr>';
      html += `<td class="timetable-time">${days[0].slots[i] ? days[0].slots[i].time : ''}</td>`;
      days.forEach((d) => {
        const slot = d.slots[i];
        html += slot
          ? `<td><div class="timetable-cell"><strong>${slot.subject}</strong><span>${slot.room} · ${slot.faculty}</span></div></td>`
          : '<td></td>';
      });
      html += '</tr>';
    }
    html += '</tbody>';

    table.innerHTML = html;
  }

  function renderCards() {
    const container = document.getElementById('timetable-cards');
    if (!container) return;

    container.innerHTML = StudentData.timetable.map((d) => `
      <div class="card timetable-day-card">
        <div class="card-title" style="margin-bottom: var(--space-3);">${d.day}</div>
        ${d.slots.map((s) => `
          <div class="timetable-mobile-slot">
            <span class="timetable-mobile-time">${s.time}</span>
            <div>
              <strong>${s.subject}</strong>
              <span>${s.room} · ${s.faculty}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `).join('');
  }

  function init() {
    renderTable();
    renderCards();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', Timetable.init);
