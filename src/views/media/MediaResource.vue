<template>
  <div class="media-resource">
    <h2>媒体资源管理</h2>
    <div class="media-tabs">
      <button :class="{ active: activeTab === 'images' }" @click="switchTab('images')">图片资源</button>
      <button :class="{ active: activeTab === 'videos' }" @click="switchTab('videos')">视频资源</button>
    </div>
    <!-- 图片资源部分 -->
    <div v-if="activeTab === 'images'" class="photo-section">
      <div class="photo-grid">
        <div v-for="photo in photos" :key="photo.name" class="photo-item">
          <img :src="photo.url" :alt="photo.name" />
          <div class="photo-info">{{ photo.name }}</div>
        </div>
        <div v-if="photos.length === 0" class="no-data">暂无图片资源数据</div>
      </div>
    </div>
    <!-- 视频资源部分 -->
    <div v-if="activeTab === 'videos'" class="video-section">
      <div class="video-grid">
        <div v-for="video in videos" :key="video.name" class="video-item">
          <video controls :src="video.url"></video>
          <div class="video-info">
            <span class="video-name">{{ video.name }}</span>
            <span class="video-duration">{{ video.duration }}秒</span>
          </div>
        </div>
        <div v-if="videos.length === 0" class="no-data">暂无视频资源数据</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const activeTab = ref('images')  // 默认显示图片资源
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

.video-duration {
  font-size: 12px;
  color: #999;
}

.no-data {
  grid-column: 1 / -1;
  text-align: center;
  color: #888;
  font-size: 16px;
  padding: 20px 0;
}
</style> 