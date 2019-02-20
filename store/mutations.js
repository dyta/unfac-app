export default {
  setUser: function (state, payload) {
    state.user = payload
  },
  setAuth(state, payload) {
    state.auth = payload
  },
  setLine(state, payload) {
    state.line = payload
  },
  setPackage(state, payload) {
    state.package = payload
  },
  setLoading(state, payload) {
    state.loading = payload
  },
  setSource(state, payload) {
    state.source = payload
  },
  TOGGLE_SIDEBAR(state) {
    state.sidebarOpen = !state.sidebarOpen
  }
}
