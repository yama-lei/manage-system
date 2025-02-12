<template>
  <div class="dashboard">
    <aside class="sidebar">
      <nav>
        <ul>
          <li><router-link to="/course-management">课程管理</router-link></li>
          <li><router-link to="/media-resource">媒体资源管理</router-link></li>
          <li><router-link to="/manager">管理员管理</router-link></li>
          <li><router-link to="/travel-map">行迹图管理</router-link></li>
        </ul>
      </nav>
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </aside>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const handleLogout = () => {
  localStorage.removeItem('auth')
  router.push('/login')
}
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 200px;
  background-color: #f0f2f5;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
}

.sidebar nav ul {
  list-style: none;
  padding: 0;
}

.sidebar nav ul li {
  margin-bottom: 10px;
}

.sidebar nav ul li a {
  text-decoration: none;
  color: #333;
}

.logout-btn {
  margin-top: 20px;
  width: 100%;
  padding: 10px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.content {
  flex: 1;
  padding: 20px;
}
</style> 