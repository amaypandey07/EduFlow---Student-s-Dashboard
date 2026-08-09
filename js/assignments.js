/* ==========================================================================
   ASSIGNMENTS.JS — THE CORE CRUD SYSTEM
   ==========================================================================
   THIS IS THE MOST IMPORTANT FILE IN THE PROJECT FOR YOUR VIVA.
   Read the comments below carefully — this is the exact chain of
   operations an examiner is most likely to ask you to trace.

   THE DATA FLOW (memorize this order, and WHY it's this order):

   1. LOAD: On page load, read the assignments array from Storage.
      If nothing is saved yet (first-ever visit), fall back to
      StudentData.defaultAssignments and immediately save THAT to
      Storage — this is called "seeding". Without seeding, every
      reload with no saved data would show different fallback data
      instead of a consistent state.

   2. RENDER: Take whatever's in memory (`state.assignments`) and
      turn it into HTML cards. Render is a PURE function of state —
      it never decides what data to show, it just draws whatever
      state currently holds. This separation (state vs render) is
      the same principle React/Vue are built around, just done by hand.

   3. MUTATE: User adds/edits/deletes -> we change the `state.assignments`
      ARRAY IN MEMORY FIRST.

   4. PERSIST: Immediately after mutating memory, call Storage.set()
      to write the whole array back to LocalStorage. Order matters:
      memory changes, THEN persist, THEN re-render. If you persisted
      BEFORE updating memory, you'd save stale data.

   5. RE-RENDER: Call render() again so the UI reflects the new state.

   Every single CRUD action (add/edit/delete/toggle-complete) follows
   this exact MUTATE -> PERSIST -> RE-RENDER sequence. Once you can
   explain that sequence for ONE action, you can explain it for all of them.
   ========================================================================== */

const Assignments = (() => {
  const STORAGE_KEY = 'assignments';

  // In-memory state. This is the SINGLE SOURCE OF TRUTH while the page
  // is open — every render() call reads from here, never from Storage
  // directly (that would mean re-parsing JSON on every keystroke of a
  // search box, which is wasteful).
  let state = {
    assignments: [],
    filters: { search: '', status: 'all', priority: 'all' },
    editingId: null, // null = "add" mode, otherwise = "edit" mode for this id
  };

  // ---- LOAD (with seeding) ----
  function load() {
    const saved = Storage.get(STORAGE_KEY);
    if (saved === null) {
      // First-ever visit: seed Storage with the defaults so future
      // loads are consistent instead of re-generating fallback data.
      state.assignments = StudentData.defaultAssignments;
      Storage.set(STORAGE_KEY, state.assignments);
    } else {
      state.assignments = saved;
    }
  }

  // ---- DERIVED DATA: apply filters without mutating the original array ----
  function getFilteredAssignments() {
    const { search, status, priority } = state.filters;
    return state.assignments.filter((a) => {
      const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase())
        || a.subject.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === 'all' || a.status === status;
      const matchesPriority = priority === 'all' || a.priority === priority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }

  // ---- RENDER (pure function of state) ----
  function render() {
    const container = document.getElementById('assignments-list');
    if (!container) return;

    const list = getFilteredAssignments();

    if (list.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-inbox empty-state-icon"></i>
          <p>No assignments match your filters.</p>
        </div>`;
      return;
    }

    container.innerHTML = list
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .map((a) => `
        <div class="assignment-card ${a.status === 'completed' ? 'is-completed' : ''}">
          <div class="assignment-card-check">
            <button class="check-btn" data-toggle="${a.id}" aria-label="Mark complete">
              <i class="fa-solid ${a.status === 'completed' ? 'fa-circle-check' : 'fa-circle'}"></i>
            </button>
          </div>
          <div class="assignment-card-body">
            <div class="assignment-card-title">${escapeHtml(a.title)}</div>
            <div class="assignment-card-meta">
              <span>${escapeHtml(a.subject)}</span>
              <span>·</span>
              <span>Due ${formatDate(a.dueDate)}</span>
            </div>
          </div>
          <span class="badge badge-${a.priority === 'high' ? 'danger' : a.priority === 'medium' ? 'warning' : 'neutral'}">${a.priority}</span>
          <div class="assignment-card-actions">
            <button class="icon-btn btn-sm" data-edit="${a.id}" aria-label="Edit"><i class="fa-solid fa-pen"></i></button>
            <button class="icon-btn btn-sm" data-delete="${a.id}" aria-label="Delete"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      `).join('');
  }

  // Prevents user-typed text (like an assignment title) from being
  // interpreted as HTML/script if it happens to contain characters
  // like < or >. Basic defensive coding practice.
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  // ---- CREATE ----
  function addAssignment(data) {
    const newAssignment = {
      id: 'a' + Date.now(), // timestamp-based id: simple, unique enough for a client-only app
      title: data.title,
      subject: data.subject,
      dueDate: data.dueDate,
      priority: data.priority,
      status: 'pending',
    };

    // MUTATE (memory) -> PERSIST (storage) -> RE-RENDER (DOM)
    state.assignments.push(newAssignment);
    Storage.set(STORAGE_KEY, state.assignments);
    render();
    Notify.show('Assignment added successfully.', 'success');
  }

  // ---- UPDATE ----
  function updateAssignment(id, data) {
    const index = state.assignments.findIndex((a) => a.id === id);
    if (index === -1) return; // defensive: id not found, do nothing

    state.assignments[index] = { ...state.assignments[index], ...data };
    Storage.set(STORAGE_KEY, state.assignments);
    render();
    Notify.show('Assignment updated.', 'success');
  }

  function toggleComplete(id) {
    const assignment = state.assignments.find((a) => a.id === id);
    if (!assignment) return;
    assignment.status = assignment.status === 'completed' ? 'pending' : 'completed';
    Storage.set(STORAGE_KEY, state.assignments);
    render();
  }

  // ---- DELETE ----
  function deleteAssignment(id) {
    state.assignments = state.assignments.filter((a) => a.id !== id);
    Storage.set(STORAGE_KEY, state.assignments);
    render();
    Notify.show('Assignment deleted.', 'error');
  }

  // ---- MODAL HANDLING ----
  function openModal(editId = null) {
    const overlay = document.getElementById('assignment-modal');
    const form = document.getElementById('assignment-form');
    const title = document.getElementById('assignment-modal-title');
    if (!overlay || !form) return;

    state.editingId = editId;

    if (editId) {
      const a = state.assignments.find((x) => x.id === editId);
      if (!a) return;
      title.textContent = 'Edit Assignment';
      form.title.value = a.title;
      form.subject.value = a.subject;
      form.dueDate.value = a.dueDate;
      form.priority.value = a.priority;
    } else {
      title.textContent = 'Add Assignment';
      form.reset();
    }

    overlay.classList.add('open');
  }

  function closeModal() {
    document.getElementById('assignment-modal')?.classList.remove('open');
    state.editingId = null;
  }

  function handleFormSubmit(e) {
    e.preventDefault(); // stop the browser's default full-page-reload form submission
    const form = e.target;

    const data = {
      title: form.title.value.trim(),
      subject: form.subject.value,
      dueDate: form.dueDate.value,
      priority: form.priority.value,
    };

    if (!data.title) {
      Notify.show('Assignment title is required.', 'error');
      return;
    }

    if (state.editingId) {
      updateAssignment(state.editingId, data);
    } else {
      addAssignment(data);
    }

    closeModal();
  }

  // ---- EVENT WIRING ----
  function bindEvents() {
    document.getElementById('add-assignment-btn')?.addEventListener('click', () => openModal());
    document.getElementById('assignment-modal-close')?.addEventListener('click', closeModal);
    document.getElementById('assignment-modal-cancel')?.addEventListener('click', closeModal);
    document.getElementById('assignment-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'assignment-modal') closeModal(); // click outside the card closes it
    });
    document.getElementById('assignment-form')?.addEventListener('submit', handleFormSubmit);

    // Event delegation: ONE listener on the container instead of one
    // listener per card. This matters because cards are re-rendered
    // constantly (every add/edit/delete rebuilds the innerHTML), which
    // would destroy and leak individually-attached listeners. Attaching
    // to the stable parent container avoids that entirely.
    document.getElementById('assignments-list')?.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('[data-toggle]');
      const editBtn = e.target.closest('[data-edit]');
      const deleteBtn = e.target.closest('[data-delete]');

      if (toggleBtn) toggleComplete(toggleBtn.dataset.toggle);
      if (editBtn) openModal(editBtn.dataset.edit);
      if (deleteBtn) {
        if (confirm('Delete this assignment?')) deleteAssignment(deleteBtn.dataset.delete);
      }
    });

    document.getElementById('search-input')?.addEventListener('input', (e) => {
      state.filters.search = e.target.value;
      render();
    });

    document.getElementById('status-filter')?.addEventListener('change', (e) => {
      state.filters.status = e.target.value;
      render();
    });

    document.getElementById('priority-filter')?.addEventListener('change', (e) => {
      state.filters.priority = e.target.value;
      render();
    });
  }

  function init() {
    load();
    bindEvents();
    render();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', Assignments.init);
