import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import TravelMap from '../views/TravelMap.vue'
import CourseManagement from '../views/CourseManagement.vue'
import MediaResource from '../views/MediaResource.vue'
import Manager from '../views/Manager.vue'
const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    component: DashboardLayout,
    children: [
      { path: '', redirect: 'travel-map' },
      { path: 'travel-map', name: 'TravelMap', component: TravelMap },
      { path: 'course-management', name: 'CourseManagement', component: CourseManagement },
      { path: 'media-resource', name: 'MediaResource', component: MediaResource },
      { path: 'manager', name: 'Manager', component: Manager },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：未登录状态下除登录页外一律跳转到 /login
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('auth') === 'true'
  if (to.path !== '/login' && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router 