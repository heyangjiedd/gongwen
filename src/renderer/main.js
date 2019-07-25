import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon

import format from './utils/format'
import '@/permission' // permission control

import * as filters from './filters' // global filters

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.use(ElementUI, { locale })

Vue.mixin(format)

Vue.config.productionTip = false

new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
