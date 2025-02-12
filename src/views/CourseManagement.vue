<template>
  <div class="course-management">
    <h2>课程管理</h2>
    <hr>

    <div class="course-list">
      <h3>所有课程数据</h3>
      <div v-for="course in courseList" :key="course.code" class="course-card">
        <p>code(课程编号)：{{ course.code }}</p>
        <h3>Title:{{ course.title }}</h3>
        <p><strong>introduction:</strong> {{ course.introduction }}</p>
        <p><strong>characters:</strong> {{ course.characters.join(', ') }}</p>
        <p><strong>createTime:</strong> {{ course.createTime }}</p>
        <p><strong>visits:</strong> {{ course.visits }}</p>
        <div class="course-videos">
          <h4>videos</h4>
          <ul>
            <li v-for="video in course.videos" :key="video.name">
              <a :href="video.url" target="_blank">{{ video.name }}</a>
            </li>
          </ul>
        </div>
        <div class="course-photos">
          <h4>photos</h4>
          <ul>
            <li v-for="photo in course.photos" :key="photo.name">
              <a :href="photo.url" target="_blank">{{ photo.name }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
const courseList = ref([])

// 请求接口，获取所有课程数据
const loadCourses = () => {
  axios.get('http://127.0.0.1:4523/m1/5812904-5497981-default/api/v1/courses')
    .then(res => {
      // 根据接口返回的数据结构，记录数组在 data.records，总数在 data.total
      courseList.value = res.data.data.records
    })
    .catch(error => {
      console.error("获取课程列表失败", error)
    })
}

onMounted(() => {
  loadCourses()
})
</script>

<style scoped>
.course-management {
  padding: 20px;
}
.course-card {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
}
.course-card h3 {
  margin-top: 0;
}
.course-videos ul, .course-photos ul {
  list-style: none;
  padding: 0;
}
.course-videos li, .course-photos li {
  margin-bottom: 5px;
}
</style> 