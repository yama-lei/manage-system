<template>
  <div class="course-management">
    <h2>课程管理</h2>
    <!-- 添加课程按钮 -->
    <button class="add-course-btn" @click="openAddModal">添加课程</button>
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
          <th>操作</th>
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
            <div v-for="vid in course.videoId" :key="vid">
              {{ vid }}
            </div>
          </td>
          <td>
            <div v-for="pid in course.photoId" :key="pid">
              {{ pid }}
            </div>
          </td>
          <td>{{ course.visits }}</td>
          <td>
            <button class="action-btn" @click="openEditModal(course)">修改课程</button>
            <button class="action-btn delete" @click="openDeleteModal(course)">删除课程</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 添加课程弹窗 -->
    <div v-if="showAddCourse" class="dialog">
      <h3>添加课程</h3>
      <div class="dialog-content">
        <label for="edit-course-code">课程编号:</label>
        <input type="text" id="edit-course-code" v-model="newCourse.code" placeholder="请输入课程编号" />

        <label for="edit-course-characters">人物 (多个用逗号分隔):</label>
        <input type="text" id="edit-course-characters" v-model="newCourse.characters" placeholder="例如：程开甲" />

        <label for="edit-course-title">标题:</label>
        <input type="text" id="edit-course-title" v-model="newCourse.title" placeholder="请输入课程标题" />

        <label for="edit-course-introduction">介绍:</label>
        <textarea id="edit-course-introduction" v-model="newCourse.introduction" placeholder="请输入课程介绍"></textarea>

        <label for="edit-course-expireTime">过期时间（expireTime）:</label>
        <input type="datetime-local" id="edit-course-expireTime" v-model="newCourse.expireTime" />

        <label for="edit-course-videos">视频id (整数):</label>
        <input type="text" id="edit-course-videos" v-model="newCourse.videos" />

        <label for="edit-course-photos">照片id (整数):</label>
        <input type="text" id="edit-course-photos" v-model="newCourse.photos" /> </div>
      <div class="dialog-actions">
        <button @click="submitNewCourse">提交</button>
        <button @click="closeAddModal">取消</button>
      </div>
    </div>

    <!-- 修改课程弹窗 -->
    <div v-if="showEditCourse" class="dialog">
      <h3>修改课程</h3>
      <div class="dialog-content">
        <label for="edit-course-code">课程编号:</label>
        <input type="text" id="edit-course-code" v-model="editCourseData.code" placeholder="请输入课程编号" />

        <label for="edit-course-characters">人物 (多个用逗号分隔):</label>
        <input type="text" id="edit-course-characters" v-model="editCourseData.characters" placeholder="例如：程开甲" />

        <label for="edit-course-title">标题:</label>
        <input type="text" id="edit-course-title" v-model="editCourseData.title" placeholder="请输入课程标题" />

        <label for="edit-course-introduction">介绍:</label>
        <textarea id="edit-course-introduction" v-model="editCourseData.introduction" placeholder="请输入课程介绍"></textarea>

        <label for="edit-course-expireTime">过期时间（expireTime）:</label>
        <input type="datetime-local" id="edit-course-expireTime" v-model="editCourseData.expireTime" />

        <label for="edit-course-videos">视频id (整数):</label>
        <input type="text" id="edit-course-videos" v-model="editCourseData.videos" />

        <label for="edit-course-photos">照片id (整数):</label>
        <input type="text" id="edit-course-photos" v-model="editCourseData.photos" />
      </div>
      <div class="dialog-actions">
        <button @click="submitEditCourse">提交</button>
        <button @click="closeEditModal">取消</button>
      </div>
    </div>

    <!-- 删除课程弹窗 -->
    <div v-if="showDeleteCourse" class="dialog">
      <h3>删除课程</h3>
      <div class="dialog-content">
        <p>确认删除课程：<strong>{{ deleteCourseData.title }}</strong>？</p>
      </div>
      <div class="dialog-actions">
        <button @click="submitDeleteCourse">删除</button>
        <button @click="closeDeleteModal">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

// 辅助方法：将 datetime-local 的值转换为 "YYYY-MM-DD HH:MM:SS" 格式
function formatExpireTime(dateTimeStr) {
  if (!dateTimeStr) return ''
  const dt = dateTimeStr.replace('T', ' ')
  return dt.length === 16 ? dt + ":00" : dt
}

// 课程列表数据
const courseList = ref([])

// 从后端接口加载课程数据（接口地址为示例）
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

// =====================
// 添加课程相关
// =====================
const showAddCourse = ref(false)
const newCourse = ref({
  code: '',
  characters: '',  // 用户输入的逗号分隔字符串
  title: '',
  introduction: '',
  videos: '',      // 输入视频id字符串，例如 "1,2,3"
  photos: '',      // 输入照片id字符串，例如 "4,5,6"
  expireTime: '',
  available: true
})

function openAddModal() {
  showAddCourse.value = true
}

function closeAddModal() {
  showAddCourse.value = false
  resetNewCourse()
}

function resetNewCourse() {
  newCourse.value = {
    code: '',
    characters: '',
    title: '',
    introduction: '',
    videos: '',
    photos: '',
    expireTime: '',
    available: true
  }
}

function submitNewCourse() {
  // 将人物字符串转换为数组
  const charactersArray = newCourse.value.characters
    .split(',')
    .map(item => item.trim())
    .filter(item => item)

  // 将视频输入转换为整型数组
  const videoIdArray = newCourse.value.videos.split(',')
    .map(item => parseInt(item.trim()))
    .filter(item => !isNaN(item))

  // 将照片输入转换为整型数组
  const photoIdArray = newCourse.value.photos.split(',')
    .map(item => parseInt(item.trim()))
    .filter(item => !isNaN(item))

  // 格式化 expireTime 为 "YYYY-MM-DD HH:MM:SS"
  const formattedExpireTime = formatExpireTime(newCourse.value.expireTime)

  // 构造提交数据，符合后端接口的要求
  const courseData = {
    code: newCourse.value.code,
    characters: charactersArray,
    title: newCourse.value.title,
    introduction: newCourse.value.introduction,
    photoId: photoIdArray,
    videoId: videoIdArray,
    questionId: [],  // 默认空数组
    expireTime: formattedExpireTime,
    available: newCourse.value.available
  }
  console.log(courseData)
  axios.post('https://api.yunshangmalan.online/api/v1/courses/add', courseData, {
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => {
      loadCourses()
      closeAddModal()
    })
    .catch(error => {
      console.error("添加课程失败", error)
    })
}

// =====================
// 修改课程相关
// =====================
const showEditCourse = ref(false)
const editCourseData = ref({
  code: '',
  title: '',
  introduction: '',
  characters: '',
  expireTime: '',
  videos: '',
  photos: ''
})

function openEditModal(course) {
  // 假设后端返回的课程数据中 videoId、photoId 均为整型数组
  editCourseData.value = {
    code: course.code,
    title: course.title,
    introduction: course.introduction,
    characters: course.characters.join(', '),
    expireTime: course.expireTime,  // 应该为 "YYYY-MM-DD HH:MM:SS" 格式
    videos: course.videoId ? course.videoId.join(', ') : '',
    photos: course.photoId ? course.photoId.join(', ') : ''
  }
  showEditCourse.value = true
}

function closeEditModal() {
  showEditCourse.value = false
}

function submitEditCourse() {
  const charactersArray = editCourseData.value.characters
    .split(',')
    .map(item => item.trim())
    .filter(item => item)

  const videoIdArray = editCourseData.value.videos.split(',')
    .map(item => parseInt(item.trim()))
    .filter(item => !isNaN(item))

  const photoIdArray = editCourseData.value.photos.split(',')
    .map(item => parseInt(item.trim()))
    .filter(item => !isNaN(item))

  const formattedExpireTime = formatExpireTime(editCourseData.value.expireTime)

  const updatedCourse = {
    code: editCourseData.value.code,
    characters: charactersArray,
    title: editCourseData.value.title,
    introduction: editCourseData.value.introduction,
    photoId: photoIdArray,
    videoId: videoIdArray,
    questionId: [],
    expireTime: formattedExpireTime,
    available: true
  }

  axios.put('https://api.yunshangmalan.online/api/v1/admin/courses/edit', updatedCourse, {
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => {
      loadCourses()
      closeEditModal()
    })
    .catch(error => {
      console.error("修改课程失败", error)
    })
}

// =====================
// 删除课程相关
// =====================
const showDeleteCourse = ref(false)
const deleteCourseData = ref({})

function openDeleteModal(course) {
  deleteCourseData.value = {
    code: course.code,
    title: course.title
  }
  showDeleteCourse.value = true
}

function closeDeleteModal() {
  showDeleteCourse.value = false
}

function submitDeleteCourse() {
  axios.delete('https://api.yunshangmalan.online/api/v1/admin/courses/delete', {
    data: { code: deleteCourseData.value.code },
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => {
      loadCourses()
      closeDeleteModal()
    })
    .catch(error => {
      console.error("删除课程失败", error)
    })
}
</script>

<style scoped>
.course-management {
  padding: 20px;
}

/* 添加课程按钮 */
.add-course-btn {
  background-color: #2d8cf0;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background-color 0.3s;
}

.add-course-btn:hover {
  background-color: #1f78d1;
}

/* 课程表样式 */
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

/* 操作按钮样式 */
.action-btn {
  background-color: #2d8cf0;
  color: #fff;
  border: none;
  padding: 5px 10px;
  margin: 2px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-btn:hover {
  background-color: #1f78d1;
}

.action-btn.delete {
  background-color: #e74c3c;
}

.action-btn.delete:hover {
  background-color: #c0392b;
}

/* 弹窗样式 */
.dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  padding: 20px;
  width: 400px;
  max-width: 90%;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.dialog h3 {
  margin-bottom: 15px;
  font-size: 18px;
  color: #2d8cf0;
}

.dialog-content label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.dialog-content input,
.dialog-content textarea {
  width: 95%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.dialog-content textarea {
  resize: vertical;
}

.dialog-actions {
  text-align: right;
}

.dialog-actions button {
  padding: 8px 16px;
  margin-left: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.dialog-actions button:first-of-type {
  background-color: #2d8cf0;
  color: #fff;
}

.dialog-actions button:first-of-type:hover {
  background-color: #1f78d1;
}

.dialog-actions button:last-of-type {
  background-color: #ccc;
  color: #333;
}

.dialog-actions button:last-of-type:hover {
  background-color: #b3b3b3;
}
</style>
