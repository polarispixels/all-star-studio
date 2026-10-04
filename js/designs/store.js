// Browser persistence for gallery feedback. Every call survives blocked or full storage.
export const STORAGE_KEY = 'all-star-studio.prototype-feedback.v1';
export const PREVIOUS_KEY = 'all-star-studio.prototype-feedback.v1.previous';

export function readRaw(key = STORAGE_KEY) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeRaw(value, key = STORAGE_KEY) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}
