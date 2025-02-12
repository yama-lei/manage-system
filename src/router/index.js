import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/login/Login.vue'
import BasicLayout from '../layouts/BasicLayout.vue'
import Welcome from '../views/dashboard/Welcome.vue'
import CourseManagement from '../views/course/CourseManagement.vue'
import TravelMap from '../views/travel/TravelMap.vue'
import MediaResource from '../views/media/MediaResource.vue'

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    component: BasicLayout,
    children: [
      { path: '', redirect: 'dashboard' },
      { path: 'dashboard', name: 'Dashboard', component: Welcome },
      { path: 'course-management', name: 'CourseManagement', component: CourseManagement },
      { path: 'travel-map', name: 'TravelMap', component: TravelMap },
      { path: 'media-resource', name: 'MediaResource', component: MediaResource }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：如果未登录则跳转到登录界面
router.beforeEach((to, from, next) => {
  const isAuth = localStorage.getItem('auth') === 'true'
  if (to.path !== '/login' && !isAuth) {
    next('/login')
  } else {
    next()
  }
})

export default router 