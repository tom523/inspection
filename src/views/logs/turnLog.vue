<template>
  <div class="app-container">
    <div style="margin-top: 50px">
      <el-col>
        <span style="margin-left: 5%">值：</span>
        <el-select
          v-model="teams"
          multiple
          collapse-tags
          clearable
          filterable
          style="margin-left: 20px;"
          placeholder="请选择"
        >
          <el-option
            v-for="item in selectTeams"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
        <span style="margin-left: 30px">选择专业：</span>
        <el-select v-model="listQuery.related_professions" style="width: 300px" placeholder="请选择">
          <el-option-group
            v-for="item in professions"
            :key="item.operation_way"
            :label="item.operation_way"
          >
            <el-option
              v-for="(group, index) in item.grouped_professions"
              :key="index"
              style="width: 300px"
              :label="group.toString()"
              :value="group.toString()"
            >
              <span style="float: left">{{ group.toString() }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ index }}</span>
            </el-option>
          </el-option-group>
        </el-select>
        <el-switch
          v-model="watchAllTurn"
          style="margin-left: 5%"
          inactive-text="未检轮次"
          active-text="所有轮次"
        />
        <el-table
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :row-class-name="row_class"
          border
          :data="tableData"
          style="width: 90%; margin-left: auto; margin-right: auto; margin-top: 20px"
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
            label="轮次"
            prop="snapshot.name"
          />
          <el-table-column
            width="200"
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
            label="专业"
            prop="related_professions"
          />
          <el-table-column
            align="center"
            label="值"
          >
            <template slot-scope="scope">
              {{ scope.row.display_team || '--' }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="220"
            label="轮次时间"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.plan_start_time }}<br></span>
              <span>至<br></span>
              <span>{{ scope.row.plan_end_time }}</span>
            </template>
            <!-- <template slot-scope="scope">
              <span>{{ scope.row.plan_start_time.substring(0,10) }}<br></span>
              <span>{{ scope.row.plan_start_time.substring(11,19) }}</span>
            </template> -->
          </el-table-column>
          <!-- <el-table-column
            align="center"
            label="轮次结束时间"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.plan_end_time.substring(0,10) }}<br></span>
              <span>{{ scope.row.plan_end_time.substring(11,19) }}</span>
            </template>
          </el-table-column> -->
          <el-table-column
            align="center"
            label="巡检时间"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.actual_start_time || '--' }}<br></span>
              <span v-if="scope.row.actual_start_time || scope.row.actual_end_time">至<br></span>
              <span>{{ scope.row.actual_end_time || '--' }}</span>
            </template>
            <!-- <template slot-scope="scope">
              <div v-if="scope.row.actual_start_time">
                <span>{{ scope.row.actual_start_time.substring(0,10) }}<br></span>
                <span>{{ scope.row.actual_start_time.substring(11,19) }}</span>
              </div>
              <div v-else>--</div>
            </template> -->
          </el-table-column>
          <!-- <el-table-column
            align="center"
            label="巡检结束时间"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.actual_end_time">
                <span>{{ scope.row.actual_end_time.substring(0,10) }}<br></span>
                <span>{{ scope.row.actual_end_time.substring(11,19) }}</span>
              </div>
              <div v-else>--</div>
            </template>
          </el-table-column> -->
        </el-table>
        <el-pagination
          style="margin-top: 20px; margin-left: 5%; margin-bottom: 5%"
          :current-page="listQuery.page"
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
import { getCurTime } from '@/utils/tool'
import { getRoleUser } from '@/api/user'
import { getRelatedTurnProfession } from '@/api/misc'
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
      listQuery: {
        plan_end_time__gte: getCurTime(),
        duty_log__team__in: [],
        related_professions: null
      },
      total: null,
      loading: false,
      watchAllTurn: false,
      selectTeams: null,
      teams: [],
      professions: null
    }
  },
  watch: {
    listQuery: {
      handler: function() {
        debugger
        this.listQuery.page = 1
        this.fecthdata()
      },
      deep: true
    },
    watchAllTurn: function() {
      this.watchAllTurn ? this.listQuery.plan_end_time__gte = null : this.listQuery.plan_end_time__gte = getCurTime()
    },
    teams: function() {
      this.listQuery.duty_log__team__in = this.teams.toString(',')
    }
  },
  created() {
    this.fecthdata()
    this.fecthSelectData()
  },
  methods: {
    handleCurrentChange(index) {
      this.listQuery.page = index
      this.fecthdata()
    },
    fecthdata() {
      this.loading = true
      getTurnLog(this.listQuery).then(response => {
        this.listQuery.page = response.data.page
        this.total = response.data.count
        this.tableData = response.data.items
        this.loading = false
      })
    },
    fecthSelectData() {
      getRoleUser({ role_type: 'TEAM' }).then(response => {
        this.selectTeams = response.data
      })
      getRelatedTurnProfession().then(response => {
        this.professions = response.data
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
