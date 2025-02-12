<template>
  <div class="login-container">
    <h2>后台管理系统登录</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">用户名：</label>
        <input id="username" v-model="username" placeholder="请输入用户名" />
      </div>
      <div class="form-group">
        <label for="password">密码：</label>
        <input id="password" type="password" v-model="password" placeholder="请输入密码" />
      </div>
      <button type="submit">登录</button>
    </form>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const username = ref('')
const password = ref('')

const handleLogin = () => {
  // 如果输入的是默认凭据，则直接登录（不调用接口）
  if (username.value.trim() === 'admin' && password.value === 'password') {
    localStorage.setItem('auth', 'true')
    // 如果使用默认凭据，可以存入默认 token（可选）
    localStorage.setItem('token', 'default-token')
    router.push('/')
    username.value = ''
    password.value = ''
    return
  }
  // 调用后端登录接口
  axios.post("https://api.yunshangmalan.online/api/v1/admin/login", {
    name: username.value,
    password: password.value
  })
    .then(res => {
      if (res.data.code === 200 || res.data.code === "200") {
        localStorage.setItem('auth', 'true')
        // 保存 token，假设接口返回数据在 res.data.data.token，请根据实际字段修改
        localStorage.setItem('token', res.data.data.token)
        router.push('/')
        username.value = ''
        password.value = ''
      } else {
        alert("登录失败：" + res.data.msg)
      }
    })
    .catch(error => {
      console.error("登录请求失败", error)
      alert("登录请求失败")
    })
}
</script>

<style scoped>
.login-container {
  max-width: 350px;
  margin: 80px auto;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.login-container h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #2d8cf0;
  font-size: 24px;
}

.login-container form > div {
  margin-bottom: 20px;
}

.login-container label {
  display: block;
  margin-bottom: 5px;
  font-size: 16px;
  color: #333;
}

.login-container input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.login-container button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #2d8cf0, #66b1ff);
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.login-container button:hover {
  background: linear-gradient(135deg, #1e6bb8, #4b9eca);
}
</style> 