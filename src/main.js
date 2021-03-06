// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './plugins/element.js'
import './styles/reset.styl'
import './styles/border.css'
import preventReClick from './plugins/preventReClick'

Vue.config.productionTip = false
Vue.use(preventReClick)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
