<template>
  <div class="course-management">
    <h2>课程管理</h2>
    <hr>
    <table class="course-table">
      <thead>
        <tr>
          <th>课程编号</th>
          <th>标题</th>
          <th>介绍</th>
          <th>人物</th>
          <th>创建时间</th>
          <th>视频</th>
          <th>照片</th>
          <th>访问量</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="course in courseList" :key="course.code">
          <td>{{ course.code }}</td>
          <td>{{ course.title }}</td>
          <td>{{ course.introduction }}</td>
          <td>{{ course.characters.join(', ') }}</td>
          <td>{{ course.createTime }}</td>
          <td>
            <div v-for="video in course.videos" :key="video.name">
              <a :href="video.url" target="_blank">{{ video.name }}</a>
            </div>
          </td>
          <td>
            <div v-for="photo in course.photos" :key="photo.name">
              <a :href="photo.url" target="_blank">{{ photo.name }}</a>
            </div>
          </td>
          <td>{{ course.visits }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
const courseList = ref([])

function loadCourses() {
  axios.get('https://api.yunshangmalan.online/api/v1/admin/courses')
    .then(res => {
      courseList.value = res.data.data
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
.course-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  overflow: hidden;
}

.course-table thead {
  background: linear-gradient(135deg, #2d8cf0, #66b1ff);
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.course-table th,
.course-table td {
  padding: 12px 15px;
  text-align: left;
}

.course-table tr {
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.3s;
}

.course-table tr:nth-child(even) {
  background-color: #fdfdfd;
}


.course-table tr:last-child {
  border-bottom: 2px solid #2d8cf0;
}
</style> 