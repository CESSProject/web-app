import Vue from 'vue'
import Vuex from 'vuex'
import utils from './modules/utils'
import VuexPersistence from 'vuex-persist'
import identity from './modules/identity'
import userInfo from './modules/userInfo'

const vuexLocal = new VuexPersistence({
	storage: window.localStorage,
	key: 'cess_status'
})

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
    removeLocal(vuexLocal) {
			vuexLocal.uos.account = null
			localStorage.removeItem('removeStatus')
		}
  },
  actions: {
  },
  modules: {
    userInfo,
    utils,
		identity
  },
  getters: {
    isLogined: state => {
      return state.userInfo.isLogined
    }
  },
  plugins: [vuexLocal.plugin]
})
