import { ElMessage } from 'element-plus'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/recog',
      name: 'recog',
      component: () => import('@/views/RecognitionView.vue')
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('@/views/GameView.vue')
    },
    {
      path: '/info',
      name: 'info',
      component: () => import('@/views/InfoView.vue')
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('@/views/UserView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/manageUser',
      name: 'manageUser',
      component: () => import('@/views/ManageUserView.vue')
    },
    {
      path: '/manageRecog',
      name: 'manageRecog',
      component: () => import('@/views/ManageRecogView.vue')
    },
    {
      path: '/manageInfo',
      name: 'manageInfo',
      component: () => import('@/views/ManageInfoView.vue')
    }
  ]
})

// 增加路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.name !== 'login' && !token && (to.name === 'game' || to.name === 'user')) {
    ElMessage.error('请先登录')
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
