import Vue from 'vue'
import axios from 'axios'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'

import App from './App'
import router from './router'
import store from './store'
// import remote from 'electron'

Vue.use(Vuetify)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

// document.addEventListener('keydown', function (e) {
//   if (e.which === 123) {
//     remote.getCurrentWindow().toggleDevTools()
//   } else if (e.which === 116) {
//     location.reload()
//   }
// })

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
