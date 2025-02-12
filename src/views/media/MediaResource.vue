<template>
  <div class="media-resource">
    <h2>媒体资源管理</h2>
    <div class="media-tabs">
      <button :class="{ active: activeTab === 'images' }" @click="switchTab('images')">图片资源</button>
      <button :class="{ active: activeTab === 'videos' }" @click="switchTab('videos')">视频资源</button>
    </div>
    <!-- 图片资源部分 -->
    <div v-if="activeTab === 'images'" class="photo-section">
      <div class="actions">
        <strong>操作：</strong>
        <button class="addPhoto" @click="openAddPhotoModal">增加照片</button>
        <button class="delPhoto" @click="openDelPhotoModal">删除照片</button>
        <hr>
      </div>
      <div class="photo-grid">
        <div v-for="photo in photos" :key="photo.name" class="photo-item">
          <img :src="photo.url" :alt="photo.name" />
          <hr>
          <div class="photo-info">{{ photo.name }}</div>
          {{ photo.url }}
        </div>
        <div v-if="photos.length === 0" class="no-data">暂无图片资源数据</div>
      </div>

      <!-- 增加照片弹窗 -->
      <div v-if="addPhotoShow" class="dialog">
        <h3>增加照片</h3>
        <label for="photoName">图片名称：</label>
        <input type="text" id="photoName" v-model="newPhoto.name" placeholder="请输入图片名称" />
        <br />
        <label for="photoUrl">图片链接：</label>
        <input type="text" id="photoUrl" v-model="newPhoto.url" placeholder="请输入图片链接" />
        <br />
        <label for="photoUrl">图片类型：</label>
        <select name="photoType" id="photoType" v-model="newPhoto.tags[0]">
          <option value="avatar">人物头像</option>
          <option value="cover">视频封面</option>
        </select>
        <br />
        <button @click="submitAddPhoto">提交</button>
        <button @click="closeAddPhotoModal">取消</button>
      </div>

      <!-- 删除照片弹窗 -->
      <div v-if="delPhotoShow" class="dialog">
        <h3>删除照片</h3>
        <label for="photoId">图片名称：</label>
        <input type="text" id="photoId" v-model="photoToDelete" placeholder="请输入要删除的图片名称" />
        <br />
        <button @click="submitDelPhoto">提交</button>
        <button @click="closeDelPhotoModal">取消</button>
      </div>
    </div>

    <!-- 视频资源部分 -->
    <div v-if="activeTab === 'videos'" class="video-section">
      <div class="actions">
        <strong>操作：</strong>
        <button class="addVideo" @click="openAddVideoModal">增加视频</button>
        <button class="delVideo" @click="openDelVideoModal">删除视频</button>
        <hr>
      </div>
      <div class="video-grid">
        <div v-for="video in videos" :key="video.name" class="video-item">
          <video controls :src="video.url"></video>
          <div class="video-info">
            <span class="video-name">{{ video.name }}</span>
            <div class="video-name">{{ video.url }}</div>
          </div>
        </div>
        <div v-if="videos.length === 0" class="no-data">暂无视频资源数据</div>
      </div>

      <!-- 增加视频弹窗 -->
      <div v-if="addVideoShow" class="dialog">
        <h3>增加视频</h3>
        <label for="videoName">视频名称：</label>
        <input type="text" id="videoName" v-model="newVideo.name" placeholder="请输入视频名称" />
        <br />
        <label for="videoUrl">视频链接：</label>
        <input type="text" id="videoUrl" v-model="newVideo.url" placeholder="请输入视频链接" />
        <br />
        <button @click="submitAddVideo">提交</button>
        <button @click="closeAddVideoModal">取消</button>
      </div>

      <!-- 删除视频弹窗 -->
      <div v-if="delVideoShow" class="dialog">
        <h3>删除视频</h3>
        <label for="videoId">视频名称：</label>
        <input type="text" id="videoId" v-model="videoToDelete" placeholder="请输入要删除的视频名称" />
        <br />
        <button @click="submitDelVideo">提交</button>
        <button @click="closeDelVideoModal">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

// 当前选中的标签
const activeTab = ref('images')
const photos = ref([])
const videos = ref([])

function loadPhotos() {
  axios.get('https://api.yunshangmalan.online/api/v1/admin/photos')
    .then(res => {
      if (res.data.code === 200) {
        photos.value = res.data.data
      } else {
        console.error("获取图片资源数据失败", res.data.msg)
      }
    })
    .catch(error => {
      console.error("获取图片资源数据失败", error)
    })
}

function loadVideos() {
  axios.get('https://api.yunshangmalan.online/api/v1/admin/videos')
    .then(res => {
      if (res.data.code === 200) {
        videos.value = res.data.data
      } else {
        console.error("获取视频资源数据失败", res.data.msg)
      }
    })
    .catch(error => {
      console.error("获取视频资源数据失败", error)
    })
}

function switchTab(tab) {
  activeTab.value = tab
  if (tab === 'images') {
    loadPhotos()
  } else if (tab === 'videos') {
    loadVideos()
  }
}

// 页面加载时，根据默认 tab 加载数据
switchTab(activeTab.value)

// ====================
// 图片操作（调用后端接口）
// ====================
const addPhotoShow = ref(false)
const delPhotoShow = ref(false)

const newPhoto = ref({
  name: '',
  url: '',
  tags:['']
})

const photoToDelete = ref('')

function openAddPhotoModal() {
  addPhotoShow.value = true
}

function closeAddPhotoModal() {
  addPhotoShow.value = false
  newPhoto.value = { name: '', url: '' }
}

function openDelPhotoModal() {
  delPhotoShow.value = true
}

function closeDelPhotoModal() {
  delPhotoShow.value = false
  photoToDelete.value = ''
}

function submitAddPhoto() {
  if (newPhoto.value.name && newPhoto.value.url) {
    axios.post('https://api.yunshangmalan.online/api/v1/photos/add', {
      name: newPhoto.value.name,
      url: newPhoto.value.url,
      tag:newPhoto.value.tags
    })
    .then(res => {
      if (res.data.code === 200) {
        loadPhotos()
        closeAddPhotoModal()
      } else {
        console.error("添加图片失败", res.data.msg)
      }
    })
    .catch(error => {
      console.error("添加图片失败", error)
    })
  } else {
    alert("请输入完整的图片信息")
  }
}

function submitDelPhoto() {
  if (photoToDelete.value) {
    axios.delete('https://api.yunshangmalan.online/api/v1/admin/photos/delete', {
      data: { name: photoToDelete.value }
    })
    .then(res => {
      if (res.data.code === 200) {
        loadPhotos()
        closeDelPhotoModal()
      } else {
        console.error("删除图片失败", res.data.msg)
      }
    })
    .catch(error => {
      console.error("删除图片失败", error)
    })
  } else {
    alert("请输入要删除的图片名称")
  }
}

//后面是视频
const addVideoShow = ref(false)
const delVideoShow = ref(false)

const newVideo = ref({
  name: '',
  url: '',
  tags:[]
})

const videoToDelete = ref('')

function openAddVideoModal() {
  addVideoShow.value = true
}

function closeAddVideoModal() {
  addVideoShow.value = false
  newVideo.value = { name: '', url: '', duration: 0 }
}

function openDelVideoModal() {
  delVideoShow.value = true
}

function closeDelVideoModal() {
  delVideoShow.value = false
  videoToDelete.value = ''
}

function submitAddVideo() {
  if (newVideo.value.name && newVideo.value.url && newVideo.value.duration) {
    axios.post('https://api.yunshangmalan.online/api/v1/videos/add', {
      name: newVideo.value.name,
      url: newVideo.value.url,
      tags: newVideo.value.tags//这里的tags其实一直为空，没有设置
    })
    .then(res => {
      if (res.data.code === 200) {
        loadVideos()
        closeAddVideoModal()
      } else {
        console.error("添加视频失败", res.data.msg)
      }
    })
    .catch(error => {
      console.error("添加视频失败", error)
    })
  } else {
    alert("请输入完整的视频信息")
  }
}

function submitDelVideo() {
  if (videoToDelete.value) {
    axios.delete('https://api.yunshangmalan.online/api/v1/admin/videos/delete', {
      data: { name: videoToDelete.value }
    })
    .then(res => {
      if (res.data.code === 200) {
        loadVideos()
        closeDelVideoModal()
      } else {
        console.error("删除视频失败", res.data.msg)
      }
    })
    .catch(error => {
      console.error("删除视频失败", error)
    })
  } else {
    alert("请输入要删除的视频名称")
  }
}
</script>

<style scoped>
.media-resource {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.media-resource h2 {
  margin-bottom: 20px;
  color: #2d8cf0;
  font-size: 20px;
}

/* 选项卡样式 */
.media-tabs {
  margin-bottom: 20px;
}

.media-tabs button {
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  background-color: #e6f7ff;
  color: #333;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
}

.media-tabs button.active {
  background-color: #2d8cf0;
  color: #fff;
}

.media-tabs button:hover {
  background-color: #1f78d1;
  color: #fff;
}

/* 图片资源样式 */
.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
}

.photo-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  text-align: center;
  padding: 10px;
  transition: box-shadow 0.3s;
}

.photo-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.photo-item img {
  width: 100%;
  height: auto;
  display: block;
}

.photo-info {
  margin-top: 10px;
  font-size: 14px;
  color: #333;
}

.addPhoto, .delPhoto,
.addVideo, .delVideo {
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  background-color: #e6f7ff;
  color: #333;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
}

/* 视频资源样式 */
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.video-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  text-align: center;
  padding: 10px;
  transition: box-shadow 0.3s;
}

.video-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.video-item video {
  width: 100%;
  height: auto;
  display: block;
}

.video-info {
  margin-top: 10px;
  font-size: 14px;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px;
}

.video-name {
  font-weight: bold;
}


.no-data {
  grid-column: 1 / -1;
  text-align: center;
  color: #888;
  font-size: 16px;
  padding: 20px 0;
}

/* 弹窗样式 */
.dialog {
  position: fixed;
  width: 300px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.dialog h3 {
  margin-bottom: 15px;
  font-size: 18px;
  color: #333;
}

.dialog label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.dialog input {
  width: 90%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.dialog button {
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  background-color: #2d8cf0;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.dialog button:hover {
  background-color: #1f78d1;
}
</style>
