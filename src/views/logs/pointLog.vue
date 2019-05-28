<template>
  <div class="app-container">
    <div style="margin-top: 5%">
      <el-table
        :data="tableData"
        border
        style="width: 88%; margin-left: auto; margin-right: auto; margin-top: 1%"
      >
        <el-table-column
          align="center"
          type="index"
          label="序号"
          width="80"
        />
        <el-table-column
          align="center"
          label="名称"
          prop="name"
        />
        <el-table-column
          align="center"
          label="位置"
        >
          <template slot-scope="scope">
            {{ scope.row.extra.location }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="经度"
        >
          <template slot-scope="scope">
            {{ scope.row.extra.longitude }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="纬度"
        >
          <template slot-scope="scope">
            {{ scope.row.extra.latitude }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 20px; margin-left: 6%"
        :current-page="page"
        :total="total"
        background
        prev-text="上一页"
        next-text="下一页"
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { getPoint } from '@/api/insp'
export default {
  data() {
    return {
      tableData: [],
      page: 1,
      total: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleCurrentChange(index) {
      this.page = index
      this.fetchData()
    },
    fetchData() {
      getPoint({ page: this.page }).then(response => {
        this.tableData = response.data.items
        this.total = response.data.count
        this.page = response.data.page
      })
    }
  }
}
</script>
