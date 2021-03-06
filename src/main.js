import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import './style/common.less'
import "./style/font/fonts.css";
import VueClipboard from 'vue-clipboard2'
Vue.config.productionTip = false
Vue.use(Element,{ locale })
Vue.use(VueClipboard)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')