<template>
  <div class="layout">
    <header class="header">
      <div class="logo">马兰花开后台管理系统</div>
      <div class="header-right">
        <button @click="handleLogout">退出登录</button>
      </div>
    </header>
    <div class="container">
      <aside class="sidebar">
        <ul class="menu">
          <li class="menu-item"><router-link to="/dashboard">首页</router-link></li>
          <li class="menu-item"><router-link to="/course-management">课程管理</router-link></li>
          <li class="menu-item"><router-link to="/travel-map">行迹图管理</router-link></li>
          <li class="menu-item has-submenu">
            <router-link to="/media-resource">媒体资源管理</router-link>
          </li>
        </ul>
      </aside>
      <main class="content">
        <router-view />
      </main>
    </div>
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
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2d8cf0;
  color: #fff;
  padding: 0 20px;
  height: 60px;
}
.logo {
  font-size: 20px;
  font-weight: bold;
}
.container {
  flex: 1;
  display: flex;
}
.sidebar {
  width: 220px;
  background-color: #2F4056;
  padding: 10px 0;
}

.menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.menu-item a {
  display: block;
  padding: 12px 20px;
  color: #fff;
  text-decoration: none;
  transition: background-color 0.3s;
}

.menu-item a:hover {
  background-color: #1F2D3D;
}

.menu-item.has-submenu > a::after {
  content: "▼";
  float: right;
  font-size: 12px;
  margin-top: 4px;
}

.sub-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: #32425a;
}

.submenu-item a {
  display: block;
  padding: 10px 40px;
  color: #bfcbd9;
  font-size: 14px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.submenu-item a:hover {
  background-color: #1F2D3D;
  color: #fff;
}
.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
.header-right button {
  background: none;
  border: 1px solid #fff;
  color: #fff;
  padding: 5px 10px;
  cursor: pointer;
}
</style> 