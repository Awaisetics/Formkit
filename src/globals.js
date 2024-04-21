export const provideGlobals = {
  getApiUrl: () => {
    return "http://localhost:8000/api/";
  },

  setLocalStorageItem: (key = '', value = false) => {
    localStorage.setItem(key, value);
  },
  getLocalStorageItem: (key = '') => {
    return localStorage.getItem(key);
  },
};