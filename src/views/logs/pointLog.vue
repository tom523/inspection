<template>
  <div class="app-container">
    <div style="margin-top: 5%">
      <el-table
        :row-class-name="row_class"
        :data="tableData"
        border
        style="width: 88%; margin-left: auto; margin-right: auto; margin-top: 1%"
      >
        <el-table-column
          align="center"
          type="index"
          label="序号"
          width="80"
          :index="indexMethod"
        />
        <el-table-column
          align="center"
          label="名称"
        >
          <template slot-scope="scope">
            {{ scope.row.snapshot.name }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="检查级别"
        >
          <template slot-scope="scope">
            {{ scope.row.inspection_level | levelFilter }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="状态"
        >
          <template slot-scope="scope">
            {{ scope.row.checking_status | statusFilter }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="轮次"
          prop="turn_log__name"
        />
        <el-table-column
          align="center"
          label="值"
          prop="duty_log__team"
        />
        <el-table-column
          align="center"
          label="专业"
        >
          <template slot-scope="scope">
            <span v-for="(profession, index) in scope.row.related_professions" :key="index">{{ profession }}<br></span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          align="center"
          label="巡检开始时间"
        >
          <template slot-scope="scope">
            {{ scope.row.actual_start_time || '--' }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="巡检结时间"
        >
          <template slot-scope="scope">
            {{ scope.row.actual_end_time || '--' }}
          </template>
        </el-table-column> -->
        <el-table-column
          align="center"
          label="检查人"
        >
          <template slot-scope="scope">
            {{ scope.row.staff || '--' }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 20px; margin-left: 6%"
        :current-page="listQuery.page"
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
import { getPointLog } from '@/api/insp'
import { getDate } from '@/utils/tool'
export default {
  filters: {
    statusFilter(key) {
      const map = {
        'LO': '锁定',
        'UN': '解锁',
        'NO': '正常',
        'AB': '异常',
        'ST': '停检',
        'OM': '漏检'
      }
      return map[key]
    },
    levelFilter(key) {
      const map = {
        1: '巡检',
        2: '复检',
        3: '抽检',
        9: '管线'
      }
      return map[key]
    }
  },
  data() {
    return {
      tableData: [],
      listQuery: {
        page: 1,
        checking_status: null,
        actual_end_time__lte: null,
        actual_end_time__gte: null
      },
      total: null
    }
  },
  watch: {
    'listQuery.checking_status': function() {
      this.listQuery.page = 1
      this.listQuery.actual_end_time__gte = getDate() + ' 00:00:00'
      this.listQuery.actual_end_time__lte = getDate() + ' 23:59:59'
      this.fetchData()
    }
  },
  created() {
    if (this.$route.query.status) {
      this.listQuery.checking_status = this.$route.query.status
    }
    this.fetchData()
  },
  methods: {
    handleCurrentChange(index) {
      this.listQuery.page = index
      this.fetchData()
    },
    fetchData() {
      getPointLog(this.listQuery).then(response => {
        this.tableData = response.data.items
        this.total = response.data.count
        this.listQuery.page = response.data.page
      })
    },
    row_class({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row'
      } else if (rowIndex % 2 === 1) {
        return 'success-row'
      }
    },
    indexMethod(index) {
      return (this.listQuery.page - 1) * 10 + index + 1
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
</style>
