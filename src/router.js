import Router from "vue-router";
Vue.use(Router);


const router = new Router({
    mode: "history",
    routes: [
        {
            // 登录
            path: "/user",
            name: "user",
            component: () => import("@/page/user/index.vue")
        }]
});

export default router;
