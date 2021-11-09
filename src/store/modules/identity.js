const identity = {
  namespaced: true,
  state: {
    userType: 0 
  },
  mutations: {
    setUserType(state, val) {
      state.userType = val
    }
  }
}
export default identity
