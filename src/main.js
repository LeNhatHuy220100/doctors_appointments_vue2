import Vue from "vue";
import App from "./App.vue";
import CompositionApi from "@vue/composition-api";
import vuetify from "./plugins/vuetify";
import router from "./router/router";

Vue.config.productionTip = false;
Vue.use(CompositionApi);

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app");
