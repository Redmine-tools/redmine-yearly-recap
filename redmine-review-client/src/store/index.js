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
    }
  },
  plugins: [
    createPersistedState({
      storage: window.localStorage
    })
  ]
});

export default store;
