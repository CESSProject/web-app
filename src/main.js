import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import './style/common.less'
import "./style/font/fonts.css";

Vue.config.productionTip = false
Vue.use(Element,{ locale })

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')