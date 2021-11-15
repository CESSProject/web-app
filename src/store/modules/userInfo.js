import {
  getUserInfo,
  storageFileSize
} from '../../api/api'
const userInfo = {
  namespaced: true,
  state: {
    data: {},
    isLogined: false,
    isMinerLogined: false,
    isCollapse: false,
    isTopNav: false,
    isSidebar: false,
    loading: false,
    fileId: null, // file id
    txHash: '', // transactions hash
    token: '',

  },
  getters: {
    // userInfo: state => {
    //   return state.data
    // }
  },
  mutations: {
    setTxhash(state, value) {
      state.txHash = value
    },
    setFileId(state, value) {
      state.fileId = value
    },
    setUserInfo(state, userInfo) {
      state.data = userInfo
      state.isLogined = true
      state.isMinerLogined = false
    },
    clearUserInfo(state) {
      state.data = {}
      state.isLogined = false
      state.isMinerLogined = false
      state.minterAddress = ''
      state.fileSize = 0
      state.token = ''
    },
    modifyUserInfo(state, newInfo) {
      state.data = Object.assign(state.data, newInfo)
    },
    setStorageFileSize(state, value) {
      state.fileSize = value
    },
    setLoadingState(state, loadState) {
      state.loading = loadState
    },
    setSidebar(state, value) {
      state.isSidebar = value
    }
  },
  actions: {
    updataLoadingState({
      commit
    }, loadState) {
      commit('setLoadingState', loadState)
    },
    saveInfo({
      commit
    }, result) {
      console.log('result===', result)
      commit('setUserInfo', result)
    },
    getUserInfo({
      commit,
      state
    }) {
      const data = {
        ids: [state.data.userId]
      }
      return getUserInfo(data).then(res => {
        if (res.success) {
          return Promise.resolve(res)
        } else {
          return Promise.reject(new Error(res.errorMsg))
        }
      }).catch(error => {
        return Promise.reject(new Error(error))
      });
    },
    logout({
      commit,
      state
    }) {
      commit('clearUserInfo')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('publicUsersInfo')
      location.href = '/'
    }
  }
}
export default userInfo
