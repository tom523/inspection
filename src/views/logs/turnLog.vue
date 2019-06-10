<template>
  <div class="app-container">
    <div style="margin-top: 50px">
      <el-col>
        <el-table
          :row-class-name="row_class"
          border
          :data="tableData"
          style="width: 80%; margin-left: auto; margin-right: auto; margin-top: 20px"
        >
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="80"
          />
          <el-table-column
            align="center"
            label="轮次"
            prop="snapshot.name"
          />
          <el-table-column
            align="center"
            label="巡检点"
          >
            <template slot-scope="scope">
              <span v-for="(point, index) in scope.row.snapshot.points.split(',')" :key="index">{{ point }}<br></span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="100"
            label="状态"
          >
            <template slot-scope="scope">
              {{ scope.row.checking_status | statusFilter }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="轮次开始时间"
            prop="plan_start_time"
          />
          <el-table-column
            align="center"
            label="轮次结束时间"
            prop="plan_end_time"
          />
          <el-table-column
            align="center"
            label="巡检开始时间"
          >
            <template slot-scope="scope">
              {{ scope.row.actual_start_time || '--' }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="巡检结束时间"
            prop="actual_end_time"
          >
            <template slot-scope="scope">
              {{ scope.row.actual_end_time || '--' }}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin-top: 20px; margin-left: 10%; margin-bottom: 5%"
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
import { getTurnLog } from '@/api/insp'
export default {
  filters: {
    statusFilter(key) {
      const map = {
        'NO': '已检',
        'LO': '未检',
        'OM': '遗漏'
      }
      return map[key]
    }
  },
  data() {
    return {
      tableData: [],
      page: 1,
      total: null
    }
  },
  created() {
    this.fecthdata()
  },
  methods: {
    handleCurrentChange(index) {
      this.page = index
      this.fecthdata()
    },
    fecthdata() {
      getTurnLog({ page: this.page }).then(response => {
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
    margin-left: 70%;
    margin-right: auto;
    height: 40px;
    border: 1px dashed #c1c1cd;
    border-radius: 3px;
    cursor: pointer;
    justify-content: center;
    display: flex;
}
</style>
