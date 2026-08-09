/* ==========================================================================
   PROFILE.JS
   Purpose: Display + edit the student profile.

   KEY PATTERN — merging saved edits with defaults:
   StudentData.profile (data.js) has the ORIGINAL/default profile info.
   If the user has ever edited their profile, Storage holds their CHANGES
   (not a full copy — just whatever they've overridden). On load, we
   merge: { ...defaults, ...savedEdits }. Object spread syntax means
   savedEdits' keys OVERWRITE matching keys from defaults, keeping
   anything the user never touched.
   This avoids duplicating the entire profile object in Storage when
   only one field (say, email) was ever changed.
   ========================================================================== */

const Profile = (() => {
  const STORAGE_KEY = 'profile_edits';
  let currentProfile = {};

  function load() {
    const savedEdits = Storage.get(STORAGE_KEY, {});
    currentProfile = { ...StudentData.profile, ...savedEdits };
  }

  function getInitials(name) {
    return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  }

  function renderView() {
    document.getElementById('profile-name').textContent = currentProfile.name;
    document.getElementById('profile-roll').textContent = currentProfile.rollNumber;
    document.getElementById('profile-avatar').textContent = getInitials(currentProfile.name);
    document.getElementById('detail-branch').textContent = currentProfile.branch;
    document.getElementById('detail-semester').textContent = currentProfile.semester;
    document.getElementById('detail-email').textContent = currentProfile.email;
    document.getElementById('detail-college').textContent = currentProfile.college;

    // also keep the header avatar (top-right corner) in sync
    document.querySelectorAll('.avatar').forEach((el) => {
      el.textContent = getInitials(currentProfile.name);
    });
  }

  function enterEditMode() {
    const form = document.getElementById('profile-edit-form');
    const view = document.getElementById('profile-details-view');

    // Pre-fill the form with CURRENT values, not blank fields —
    // editing should start from what's already there.
    form.name.value = currentProfile.name;
    form.branch.value = currentProfile.branch;
    form.semester.value = currentProfile.semester;
    form.email.value = currentProfile.email;

    view.style.display = 'none';
    form.style.display = 'grid';
  }

  function exitEditMode() {
    document.getElementById('profile-edit-form').style.display = 'none';
    document.getElementById('profile-details-view').style.display = 'grid';
  }

  function handleSave(e) {
    e.preventDefault();
    const form = e.target;

    const edits = {
      name: form.name.value.trim(),
      branch: form.branch.value.trim(),
      semester: form.semester.value.trim(),
      email: form.email.value.trim(),
    };

    // Persist ONLY the edits object (not the full merged profile) —
    // this keeps rollNumber/college, which aren't editable here,
    // always sourced from data.js rather than duplicated in Storage.
    Storage.set(STORAGE_KEY, edits);
    currentProfile = { ...StudentData.profile, ...edits };

    renderView();
    exitEditMode();
    Notify.show('Profile updated successfully.', 'success');
  }

  function bindEvents() {
    document.getElementById('edit-profile-btn')?.addEventListener('click', enterEditMode);
    document.getElementById('cancel-edit-btn')?.addEventListener('click', exitEditMode);
    document.getElementById('profile-edit-form')?.addEventListener('submit', handleSave);
  }

  function init() {
    load();
    renderView();
    bindEvents();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', Profile.init);
