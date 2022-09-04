import { App } from 'vue';
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

// 路由树
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/home/home.vue'),
  },
];

// 创建路由
export const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

// 注册路由
export const setupRouter = (app: App): void => {
  app.use(router);
};

// 路由守卫
router.beforeEach((from, to) => {
  return true;
});
