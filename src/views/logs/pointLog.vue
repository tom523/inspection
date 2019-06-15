<template>
  <div class="app-container">
    <div style="margin-top: 2%">
      <el-row>
        <span style="margin-left: 6%">检查级别</span>
        <el-select v-model="listQuery.inspection_level" clearable placeholder="请选择">
          <el-option
            v-for="item in inspection_level"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <span style="margin-left: 20px">巡检点状态</span>
        <el-select v-model="listQuery.checking_status" clearable placeholder="请选择">
          <el-option
            v-for="item in checking_status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button style="width: 10%; margin-left: 39%" type="primary" @click="listQuery = {}">查看全部</el-button>
      </el-row>
      <el-table
        :row-class-name="row_class"
        :data="tableData"
        border
        style="width: 88%; margin-left: auto; margin-right: auto; margin-top: 2%"
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
      page: 1,
      listQuery: {
        checking_status: null,
        inspection_level: null,
        turn_log__plan_start_time__gte: getDate() + ' 00:00:00',
        turn_log__plan_start_time__lte: getDate() + ' 23:59:59'
      },
      total: null,
      checking_status: [{
        label: '锁定',
        value: 'LO'
      },
      {
        label: '解锁',
        value: 'UN'
      },
      {
        label: '正常',
        value: 'NO'
      },
      {
        label: '异常',
        value: 'AB'
      },
      {
        label: '停检',
        value: 'ST'
      },
      {
        label: '漏检',
        value: 'OM'
      }],
      inspection_level: [{
        label: '巡检',
        value: 1
      },
      {
        label: '复检',
        value: 2
      },
      {
        label: '抽检',
        value: 3
      },
      {
        label: '管线',
        value: 9
      }]
    }
  },
  watch: {
    listQuery: {
      handler: function() {
        this.listQuery.page = 1
        this.fetchData()
      },
      deep: true
    }
    // 'listQuery.checking_status': function() {
    //   this.listQuery.page = 1
    //   this.fetchData()
    // }
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
