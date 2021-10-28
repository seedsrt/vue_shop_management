import Vue from 'vue'
import App from './App.vue'
import router from './router'
//import ElementUI from 'element-ui'
import './assets/css/global.css'
import './assets/font/iconfont.css'
//import moment from 'moment'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import NProgress from 'nprogress'


Vue.use(VueQuillEditor, /* { default global options } */)
axios.defaults.baseURL = "https://lianghj.top:8888/api/private/v1/"
/* 在request拦截器中，显示进度条 */
axios.interceptors.request.use(config => {
  NProgress.start();
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
/* 在request拦截器中，隐藏进度条 */
axios.interceptors.response.use(config => {
  NProgress.done();
  return config
})
Vue.prototype.$http = axios
Vue.prototype.$moment = moment;
Vue.config.productionTip = false

Vue.component('tree-table',TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')