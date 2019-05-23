<template>
  <div class="app-container">
    <div style="margin-top: 50px">
      <el-col>
        <el-table
          :row-class-name="row_class"
          border
          :data="tableData"
          style="width: 100%; margin-left: auto; margin-right: auto; margin-top: 20px"
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
            width="100"
          />
          <el-table-column
            align="center"
            label="值"
            prop="team"
            width="100"
          />
          <el-table-column
            align="center"
            prop="start_time"
            label="开始时间"
          />
          <el-table-column
            align="center"
            prop="end_time"
            label="结束时间"
          />
          <el-table-column
            align="center"
            prop="turns"
            label="轮次"
          />
          <el-table-column
            align="center"
            prop="duty_checks"
            label="班中检查"
          />
          <el-table-column
            label="交接班区间"
            align="center"
            width="180"
          >
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>开始时间: {{ scope.row.takeover_time.s }}</p>
                <p>结束时间: {{ scope.row.takeover_time.e }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">交接班区间</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="检查时间"
            align="center"
            width="180"
          >
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <div
                  v-for="item in scope.row.check_time"
                  :key="item.s"
                  :label="item.s"
                  :value="item.s"
                >
                  <p>开始时间: {{ item.s }}</p>
                  <p>结束时间: {{ item.e }}</p>
                  <p>-----------------------------------------</p>
                </div>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">检查时间</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
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
import { getDutyLog } from '@/api/duty'
export default {
  data() {
    return { page: 1,
      total: null,
      tableData: []
    }
  },
  created() {
    this.fecthData()
  },
  methods: {
    handleCurrentChange(index) {
      this.page = index
      this.fecthData()
    },
    fecthData() {
      getDutyLog({ page: this.page }).then(response => {
        var dutyLogData = response.data.items
        this.page = response.data.page
        this.total = response.data.count
        dutyLogData.map(item => {
          item.takeover_time = item.takeover_time.replace(/u/g, '')
          item.takeover_time = item.takeover_time.replace(/'/g, '"')
          item.takeover_time = JSON.parse(item.takeover_time)
          item.check_time = item.check_time.replace(/u/g, '')
          item.check_time = item.check_time.replace(/'/g, '"')
          item.check_time = JSON.parse(item.check_time)
        })
        this.tableData = dutyLogData
        debugger
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
