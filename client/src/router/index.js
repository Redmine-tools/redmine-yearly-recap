import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

const routes = [
  {
    path: "/",
    name: "Login",
    component: () => import(/* webpackChunkName: "Login" */ "@/pages/Login.vue")
  },
  {
    path: "/review",
    name: "Review",
    component: () =>
      import(/* webpackChunkName: "Review" */ "@/pages/Review.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/loading",
    name: "Loading",
    component: () =>
      import(/* webpackChunkName: "Review" */ "@/pages/Loading.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () =>
      import(/* webpackChunkName: "NotFound" */ "@/pages/NotFound.vue")
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name === 'Login' && store.state.user.api_key) {
    next({ name: 'Review' });
  }
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.state.user.api_key) {
      next({ name: 'Login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;