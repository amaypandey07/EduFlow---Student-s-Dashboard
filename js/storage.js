/* ==========================================================================
   STORAGE.JS
   Purpose: Abstraction layer over browser LocalStorage.

   WHY THIS FILE EXISTS (viva-important):
   LocalStorage's raw API only stores STRINGS. Every value you save has to
   be JSON.stringify()'d, and every value you read back has to be
   JSON.parse()'d. If every page's JS file did this manually, you'd have
   the same try/catch + JSON.parse boilerplate copy-pasted 6 times.
   That violates DRY (Don't Repeat Yourself). This file centralizes it:
   every other JS file calls Storage.get() / Storage.set() and never
   touches localStorage directly.

   WHY TRY/CATCH: localStorage.setItem() can throw an error if the
   browser's storage quota is full (~5-10MB depending on browser), or if
   the user is in private/incognito mode with storage disabled. Without
   try/catch, that would crash the whole script with an uncaught error.
   ========================================================================== */

const Storage = (() => {
  const PREFIX = 'eduflow_';

  /**
   * Reads a value from localStorage and parses it back to its original type.
   * @param {string} key
   * @param {*} fallback - returned if the key doesn't exist or parsing fails
   */
  function get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (err) {
      console.error(`Storage.get failed for key "${key}":`, err);
      return fallback;
    }
  }

  /**
   * Serializes a value to JSON and writes it to localStorage.
   * @returns {boolean} whether the write succeeded
   */
  function set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`Storage.set failed for key "${key}":`, err);
      // Most common real cause: quota exceeded (QuotaExceededError)
      return false;
    }
  }

  function remove(key) {
    localStorage.removeItem(PREFIX + key);
  }

  return { get, set, remove };
})();
