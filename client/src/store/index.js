import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

function initialState() {
  return {
    user: {},
    issues: [],
  };
}

const store = createStore({
  state: {
    user: {},
    issues: [],
    year: process.env.VUE_APP_YEAR
  },
  mutations: {
    addUser(state, payload) {
      state.user = { ...payload.payload };
    },
    addAllIssues(state, payload) {
      state.issues = [...payload.payload];
    },
    resetState(state) {
      const s = initialState();
      Object.keys(s).forEach(key => {
        state[key] = s[key];
      });
    },
    cleanIssues(state) {
      state.issues = []
    },
    addYear(state, payload) {
      state.year = payload.payload
    }
  },
  plugins: [
    createPersistedState({
      storage: window.localStorage
    })
  ]
});

export default store;
