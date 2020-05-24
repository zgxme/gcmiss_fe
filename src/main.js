/*
 * @Descripttion: 
 * @version: 
 * @Author: Zheng Gaoxiong
 * @Date: 2019-12-16 23:20:22
 * @LastEditors: Zheng Gaoxiong
 * @LastEditTime: 2020-05-20 01:59:22
 */
import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import qs from 'qs'
import VueAxios from 'vue-axios'
// import VueResource from 'vue-resource'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import 'material-design-icons-iconfont/dist/material-design-icons.css'
Vue.config.productionTip = true
axios.defaults.withCredentials = true
// axios.defaults.baseURL = 'http://39.105.160.133:80/'
axios.defaults.baseURL = 'http://192.168.1.9:8081/'

axios.defaults.headers.post['Content-Type'] = 'application/json'
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
// Vue.use(VueResource)
const opts = {
  theme: {
    themes: {
      light: {
        primary: '#03a9f4',
        secondary: '#009688',
        accent: '#9c27b0',
        error: '#f44336',
        warning: '#ff5722',
        info: '#607d8b',
        success: '#4caf50'
      }

    }
  }
}
new Vue({
  VueAxios,
  axios,
  qs,
  router,
  store,
  vuetify: new Vuetify(opts),
  render: h => h(App)
}).$mount('#app')
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
})