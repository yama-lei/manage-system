<template>
  <div class="travel-map">
    <h2>行迹图管理</h2>
    <div class="actions">
      <button class="addJourney" @click="openAddJourneyModal">添加行迹</button>
      <button class="delJourney" @click="openDelJourneyModal">删除行迹</button>
    </div>
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

    <!-- 添加行迹弹窗 -->
    <div v-if="addJourneyShow" class="dialog">
      <h3>添加行迹</h3>
      <label for="journey-code">行迹编号：</label>
      <input type="text" id="journey-code" v-model="newJourney.code" placeholder="请输入行迹编号" />

      <label for="startPlace">起点：</label>
      <input type="text" id="startPlace" v-model="newJourney.startPlace" placeholder="请输入起点" />

      <label for="endPlace">终点：</label>
      <input type="text" id="endPlace" v-model="newJourney.endPlace" placeholder="请输入终点" />

      <label for="startX">起点坐标 X：</label>
      <input type="number" id="startX" v-model.number="newJourney.startX" placeholder="请输入起点X坐标" />

      <label for="startY">起点坐标 Y：</label>
      <input type="number" id="startY" v-model.number="newJourney.startY" placeholder="请输入起点Y坐标" />

      <label for="endX">终点坐标 X：</label>
      <input type="number" id="endX" v-model.number="newJourney.endX" placeholder="请输入终点X坐标" />

      <label for="endY">终点坐标 Y：</label>
      <input type="number" id="endY" v-model.number="newJourney.endY" placeholder="请输入终点Y坐标" />

      <div class="dialog-actions">
        <button @click="submitAddJourney">提交</button>
        <button @click="closeAddJourneyModal">取消</button>
      </div>
    </div>

    <!-- 删除行迹弹窗 -->
    <div v-if="delJourneyShow" class="dialog">
      <h3>删除行迹</h3>
      <label for="delete-code">请输入要删除的行迹编号：</label>
      <input type="text" id="delete-code" v-model="journeyToDelete" placeholder="行迹编号" />
      <div class="dialog-actions">
        <button @click="submitDelJourney">提交</button>
        <button @click="closeDelJourneyModal">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

// 行迹图记录数据
const journeyRecords = ref([])

// 加载行迹图数据
function loadJourneys() {
  axios.get('https://api.yunshangmalan.online/api/v1/admin/journeys')
    .then(res => {
      if (res.data.code === 200) {
        // 假设接口返回的数据结构为：{ code: 200, msg: "success", data: { records: [...] } }
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

// ====================
// 添加行迹操作（调用后端接口）
// ====================
const addJourneyShow = ref(false)
const newJourney = ref({
  code: '',
  startPlace: '',
  endPlace: '',
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0
})

function openAddJourneyModal() {
  addJourneyShow.value = true
}

function closeAddJourneyModal() {
  addJourneyShow.value = false
  // 重置输入
  newJourney.value = {
    code: '',
    startPlace: '',
    endPlace: '',
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0
  }
}

function submitAddJourney() {
  // 判断必要字段是否填写
  if (newJourney.value.code && newJourney.value.startPlace && newJourney.value.endPlace) {
    axios.post('https://api.yunshangmalan.online/api/v1/admin/journeys/add', {
      code: newJourney.value.code,
      startPlace: newJourney.value.startPlace,
      endPlace: newJourney.value.endPlace,
      startX: newJourney.value.startX,
      startY: newJourney.value.startY,
      endX: newJourney.value.endX,
      endY: newJourney.value.endY
    })
    .then(res => {
      if (res.data.code === 200) {
        loadJourneys()
        closeAddJourneyModal()
      } else {
        console.error("添加行迹失败", res.data.msg)
      }
    })
    .catch(error => {
      console.error("添加行迹失败", error)
    })
  } else {
    alert("请填写完整的行迹信息")
  }
}

// ====================
// 删除行迹操作（调用后端接口）
// ====================
const delJourneyShow = ref(false)
const journeyToDelete = ref('')

function openDelJourneyModal() {
  delJourneyShow.value = true
}

function closeDelJourneyModal() {
  delJourneyShow.value = false
  journeyToDelete.value = ''
}

function submitDelJourney() {
  if (journeyToDelete.value) {
    axios.delete('https://api.yunshangmalan.online/api/v1/admin/journeys/delete', {
      data: { code: journeyToDelete.value }
    })
    .then(res => {
      if (res.data.code === 200) {
        loadJourneys()
        closeDelJourneyModal()
      } else {
        console.error("删除行迹失败", res.data.msg)
      }
    })
    .catch(error => {
      console.error("删除行迹失败", error)
    })
  } else {
    alert("请输入要删除的行迹编号")
  }
}
</script>

<style scoped>
.travel-map {
  padding: 20px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  background-color: #f9f9f9;
}

.actions {
  margin-bottom: 15px;
}

.actions button {
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  background-color: #e6f7ff;
  color: #333;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
}

.actions button:hover {
  background-color: #1f78d1;
  color: #fff;
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

.dialog .dialog-actions {
  text-align: right;
}

.dialog .dialog-actions button {
  padding: 10px 20px;
  margin-left: 10px;
  border: none;
  background-color: #2d8cf0;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.dialog .dialog-actions button:hover {
  background-color: #1f78d1;
}
</style>
