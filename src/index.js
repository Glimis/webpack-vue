import Vue from "vue";
import App from "./App.vue";
import router from "./router.js";
import elementUi from "element-ui";
import store from './store.js'


new Vue({
    render: h => h(App),
    store,
    router,
    // components: { App },
}).$mount('#app')
