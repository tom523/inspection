<template>
  <div class="app-container">
    <div style="margin-top: 10px">
      <el-col>
        <el-table
          v-loading="loading"
          element-loading-text="拼命加载中"
          :row-class-name="row_class"
          border
          :data="tableData"
          style="width: 80%; margin-left: auto; margin-right: auto; margin-top: 25px"
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
            label="检查类型"
            prop="duty_check"
          />
        </el-table>
      </el-col>
      <el-col>
        <el-pagination
          style="margin-top: 50px; margin-left: 10%"
          :current-page="page"
          :total="total"
          background
          prev-text="上一页"
          next-text="下一页"
          layout="total, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </div>
  </div>
</template>

<script>
import { getDutyCheckItem } from '@/api/insp'
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
    this.fetchSelect()
  },
  methods: {
    handleCurrentChange(index) {
      this.page = index
      this.fetchData()
    },
    fetchData() {
      getDutyCheckItem().then(response => {
        this.page = response.data.page
        this.total = response.data.count
        this.tableData = response.data.items
      })
    },
    row_class({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row'
      } else if (rowIndex % 2 === 1) {
        return 'success-row'
      }
    }
  }
}
</script>
<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
  .el-table-add-row {
    margin-top: 5px;
    width: 10%;
    margin-left: 80%;
    margin-right: auto;
    height: 40px;
    border: 1px dashed #c1c1cd;
    border-radius: 3px;
    cursor: pointer;
    justify-content: center;
    display: flex;
}
</style>
