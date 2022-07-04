import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/views/Index')
  },
  {
    path: '/content',
    name: 'content',
    component: () => import('@/views/Content'),
    redirect: '/content/school',
    children: [
      {
        path: 'school',
        name: 'school',
        component: () => import('@/views/Content/school')
      },
      {
        path: 'question',
        name: 'question',
        component: () => import('@/views/Content/question')
      },
      {
        path: 'error-question',
        name: 'error-question',
        component: () => import('@/views/Content/error-question')
      },
      {
        path: 'paper',
        name: 'paper',
        component: () => import('@/views/Content/paper')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
  // scrollBehavior(to, from, savedPosition) {
  //   return new Promise((resolve, reject) => {
  //     if (savedPosition) {
  //       return savedPosition
  //     } else {
  //       if (from.meta.saveScrollTop) {
  //         const top: number = document.documentElement.scrollTop || document.body.scrollTop
  //         resolve({left: 0, top})
  //       }
  //     }
  //   })
  // }
});

export default router;
