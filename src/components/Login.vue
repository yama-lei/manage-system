<template>
  <div class="login-container">
    <h2>后台管理系统登录</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">用户名:</label>
        <input type="text" id="username" v-model="username" placeholder="请输入用户名" />
      </div>
      <div>
        <label for="password">密码:</label>
        <input type="password" id="password" v-model="password" placeholder="请输入密码" />
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
  // 如果输入的是默认凭据，则直接通过默认验证（无需接口调用）
  if(username.value.trim() === 'admin' && password.value === 'password'){
    localStorage.setItem('auth', 'true')
    // 可选：保存默认 token 或其它信息，例如 localStorage.setItem('token', 'default-token')
    router.push('/')
    username.value = ''
    password.value = ''
    return
  }

  axios.post("http://127.0.0.1:4523/m1/5812904-5497981-default/api/v1/admin/login", {
    name: username.value,
    password: password.value
  })
  .then(res => {
    // 根据接口返回判断是否登录成功，下面的判断逻辑根据实际接口返回结果进行调整
    if (res.data.code === 200 || res.data.code === "200") {
      localStorage.setItem('auth', 'true')
      // 可选：保存 token 等信息，如 localStorage.setItem('token', res.data.token)
      router.push('/')
      username.value = ''
      password.value = ''
    } else {
      alert("登录失败: " + res.data.msg)
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
  max-width: 300px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.login-container input {
  width: 100%;
  margin: 8px 0;
  padding: 8px;
}

.login-container button {
  width: 100%;
  padding: 10px;
  background-color: #42b883;
  color: #fff;
  border: none;
  border-radius: 4px;
}
</style> 