import Vue from 'vue'
import axios from 'axios'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'

import App from './App'
import router from './router'
// import chatrouter from './chatrouter'
import store from './store'

// import ChatApp from './ChatApp'
// import remote from 'electron'
// import LoadScript from 'vue-plugin-load-script'

// Vue.use(LoadScript)
Vue.use(Vuetify)
// 전역 사용자 정의 디렉티브 v-focus 등록
// Vue.directive('focus', {
//   // 바인딩 된 엘리먼트가 DOM에 삽입되었을 때...
//   inserted: function (el) {
//     // 엘리먼트에 포커스를 줍니다
//     el.focus()
//   }
// })
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

// new Vue({
//   components: { ChatApp },
//   chatrouter,
//   store,
//   template: '<ChatApp/>'
// }).$mount('#app')
