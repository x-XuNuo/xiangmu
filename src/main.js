import Vue from "vue";
import App from "./App.vue";
import router from "./router";

// 1.引入element-ui
import ElementUI from "element-ui";
// 2.引入css
import 'element-ui/lib/theme-chalk/index.css';

import "./assets/css/index.css";

// 3.安装插件
Vue.use(ElementUI)

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");


