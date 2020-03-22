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
Vue.config.productionTip = false
axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:8080/'
axios.defaults.headers.post['Content-Type'] = 'application/json'
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
// Vue.use(VueResource)
new Vue({
  VueAxios,
  axios,
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
