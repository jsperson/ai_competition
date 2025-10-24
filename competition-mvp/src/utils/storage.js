// Universal localStorage wrapper for any domain
export const storage = {
  // Generic save/get for any data type
  save: (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  },

  get: (key, defaultValue = null) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  },

  remove: (key) => {
    localStorage.removeItem(key);
  },

  clear: () => {
    localStorage.clear();
  },

  // Common patterns for typical app needs:

  // Cart/collection management
  saveCollection: (name, items) => {
    localStorage.setItem(name, JSON.stringify(items));
  },

  getCollection: (name) => {
    return JSON.parse(localStorage.getItem(name) || '[]');
  },

  // User session
  saveUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser: () => {
    return JSON.parse(localStorage.getItem('user') || 'null');
  },

  // Current workflow state
  saveCurrentItem: (name, item) => {
    localStorage.setItem(`current_${name}`, JSON.stringify(item));
  },

  getCurrentItem: (name) => {
    return JSON.parse(localStorage.getItem(`current_${name}`) || 'null');
  }
};
