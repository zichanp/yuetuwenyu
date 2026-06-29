<template>
  <div class="page-container">
    <el-card class="page-header-card">
      <div class="page-title-row">
        <div>
          <h2>Element Plus 示例页面</h2>
          <p>用于验证 Element Plus 是否已在当前 Vue3 项目中正常接入。</p>
        </div>
        <el-button type="primary" @click="handleCreate">
          创建数据
        </el-button>
      </div>
    </el-card>

    <el-card class="filter-card">
      <el-form :inline="true" :model="queryForm">
        <el-form-item label="关键词">
          <el-input
            v-model="queryForm.keyword"
            placeholder="请输入关键词"
            clearable
          />
        </el-form-item>

        <el-form-item label="状态">
          <el-select
            v-model="queryForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 180px"
          >
            <el-option label="全部" value="" />
            <el-option label="未开始" value="not_started" />
            <el-option label="进行中" value="running" />
            <el-option label="已结束" value="ended" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            查询
          </el-button>
          <el-button @click="handleReset">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <el-table
        v-if="tableData.length"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="80" />

        <el-table-column prop="name" label="活动名称" min-width="180" />

        <el-table-column prop="type" label="活动类型" width="140" />

        <el-table-column prop="statusText" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.statusType">
              {{ row.statusText }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" width="180" />

        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">
              查看
            </el-button>
            <el-button link type="primary" @click="handleEdit(row)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-else description="暂无数据" />

      <div class="pagination-row">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-size="queryForm.pageSize"
          :current-page="queryForm.pageNo"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <el-dialog
      v-model="detailVisible"
      title="查看详情"
      width="600px"
    >
      <el-descriptions v-if="currentRow" :column="1" border>
        <el-descriptions-item label="活动名称">
          {{ currentRow.name }}
        </el-descriptions-item>
        <el-descriptions-item label="活动类型">
          {{ currentRow.type }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentRow.statusType">
            {{ currentRow.statusText }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ currentRow.createTime }}
        </el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <el-button @click="detailVisible = false">
          关闭
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

const queryForm = reactive({
  keyword: '',
  status: '',
  pageNo: 1,
  pageSize: 10
})

const total = ref(3)

const tableData = ref([
  {
    id: 1,
    name: '阅读推广活动',
    type: '活动报名',
    status: 'running',
    statusText: '进行中',
    statusType: 'success',
    createTime: '2026-06-26 10:00:00'
  },
  {
    id: 2,
    name: '优秀作品征集',
    type: '作品征集',
    status: 'not_started',
    statusText: '未开始',
    statusType: 'info',
    createTime: '2026-06-26 11:00:00'
  },
  {
    id: 3,
    name: '知识问答活动',
    type: '知识问答',
    status: 'ended',
    statusText: '已结束',
    statusType: 'warning',
    createTime: '2026-06-26 12:00:00'
  }
])

const detailVisible = ref(false)
const currentRow = ref(null)

const handleCreate = () => {
  ElMessage.success('点击了创建数据')
}

const handleSearch = () => {
  ElMessage.success('查询成功')
}

const handleReset = () => {
  queryForm.keyword = ''
  queryForm.status = ''
  queryForm.pageNo = 1
  ElMessage.success('已重置筛选条件')
}

const handleView = row => {
  currentRow.value = row
  detailVisible.value = true
}

const handleEdit = row => {
  ElMessage.info(`点击了编辑：${row.name}`)
}

const handleSizeChange = size => {
  queryForm.pageSize = size
}

const handleCurrentChange = page => {
  queryForm.pageNo = page
}
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.page-header-card {
  margin-bottom: 16px;
}

.page-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-title-row h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.page-title-row p {
  margin: 8px 0 0;
  color: #606266;
  font-size: 14px;
}

.filter-card {
  margin-bottom: 16px;
}

.table-card {
  margin-bottom: 16px;
}

.pagination-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
