import Vue from 'vue'
import App from './App.vue'
import Vant from 'vant';
import 'vant/lib/index.css';
import _ken  from './ken'
Vue.prototype.ken = _ken;

import store from './store'
import {router} from "./router";
import _api from '@/api/api'



Vue.prototype.api = _api;

// _如何全局使用
// Vue.prototype._=_;
Vue.use(Vant);
Vue.config.productionTip = false

new Vue({
  store,
  router,
  el: '#app',
  render: h => h(App)
});