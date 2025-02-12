<template>
  <div class="travel-map">
    <h2>行迹图管理</h2>
    <hr />
    <table class="journey-table">
      <thead>
        <tr>
          <th>行迹编号</th>
          <th>起点</th>
          <th>终点</th>
          <th>起点坐标</th>
          <th>终点坐标</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="journey in journeyRecords" :key="journey.code">
          <td>{{ journey.code }}</td>
          <td>{{ journey.startPlace }}</td>
          <td>{{ journey.endPlace }}</td>
          <td>({{ journey.startX }}, {{ journey.startY }})</td>
          <td>({{ journey.endX }}, {{ journey.endY }})</td>
        </tr>
        <tr v-if="!journeyRecords.length">
          <td colspan="5" class="no-data">暂无行迹图数据</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

const journeyRecords = ref([])

function loadJourneys() {
  axios.get('https://api.yunshangmalan.online/api/v1/admin/journeys')
    .then(res => {
      if (res.data.code === 200) {
        // 假设接口返回的数据结构为：
        // { code: 200, msg: "success", data: { current, total, size, records: [...] } }
        if (res.data.data && res.data.data.records) {
          journeyRecords.value = res.data.data.records
        } else {
          journeyRecords.value = []
        }
      } else {
        console.error("获取行迹图数据失败", res.data.msg)
      }
    })
    .catch(error => {
      console.error("获取行迹图数据失败", error)
    })
}

onMounted(() => {
  loadJourneys()
})
</script>

<style scoped>
.travel-map {
  padding: 20px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  background-color: #f9f9f9;
}

.journey-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  overflow: hidden;
}

.journey-table thead {
  background: linear-gradient(135deg, #2d8cf0, #66b1ff);
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
}

.journey-table th,
.journey-table td {
  padding: 12px 15px;
  text-align: left;
}

.journey-table tr {
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.3s;
}

.journey-table tr:nth-child(even) {
  background-color: #fdfdfd;
}


.journey-table tr:last-child {
  border-bottom: 2px solid #2d8cf0;
}

.no-data {
  text-align: center;
  color: #888;
  padding: 20px;
}
</style>