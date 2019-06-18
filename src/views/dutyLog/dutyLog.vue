<template>
  <div class="app-container">
    <div style="margin-top: 10px">
      <span>运转方式</span>
      <el-select v-model="listQuery.duty_log_config__operation_way" placeholder="请选择" style="width: 20%">
        <el-option
          v-for="item in teamDescs"
          :key="item.id"
          :label="item.display_name"
          :value="item.name"
        />
      </el-select>
      <el-col style="margin-top: 30px">
        <el-table
          v-loading="createdLoading"
          element-loading-text="拼命加载中"
          :row-class-name="row_class"
          border
          :data="tableData"
          style="width: 100%; margin-left: auto; margin-right: auto;"
        >
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="50"
            :index="indexMethod"
          />
          <el-table-column
            align="center"
            label="名称"
            prop="name"
            width="90"
          />
          <el-table-column
            align="center"
            label="值"
            prop="team"
            width="80"
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
            label="轮次"
          >
            <template slot-scope="scope">
              <span
                v-for="(turn, index) in scope.row.turns"
                :key="index"
              >
                {{ turn }}
                <br>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="班中检查"
            width="130"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.duty_checks.length !== 0">
                <span
                  v-for="(item, index) in scope.row.duty_checks"
                  :key="index"
                >
                  {{ item }}
                  <br>
                </span>
              </div>
              <div v-else>--</div>
            </template>
          </el-table-column>
          <el-table-column
            label="交接班区间"
            align="center"
            width="110"
          >
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>开始时间: {{ scope.row.takeover_start_time }}</p>
                <p>结束时间: {{ scope.row.takeover_end_time }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">交接班区间</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="检查时间"
            align="center"
            width="100"
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
          <el-table-column
            align="center"
            width="120"
            label="是否生成"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.has_created">
                <el-button type="text" @click="dutyLogDrewer(scope.row)">已生成</el-button>
              </div>
              <div v-else>
                <el-button round type="success" @click="createdLog(scope.$index, scope.row)">生成</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin-top: 20px; margin-bottom: 10%"
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
    <a-drawer
      title="排班记录"
      width="50%"
      placement="right"
      :closable="true"
      :visible="visible"
      @close="onClose"
    >
      <a-list
        bordered
        :split="true"
      >
        <div v-if="activeDutyLog !== null">
          <a-list-item>{{ '概述：该排班记录共有' + activeDutyLog.turn_logs_count + '条轮次记录,' + activeDutyLog.check_point_logs_count + '条巡检点记录,' + activeDutyLog.device_logs_count + '条设备记录,' + activeDutyLog.item_logs_count + '第巡检项记录' }}</a-list-item>
          <div v-for="item in activeDutyLog.turn_logs" :key="item.id">
            <a-list-item>{{ '轮次：' + item.snapshot.name }}</a-list-item>
            <a-list-item>{{ '巡查点：' + item.snapshot.points }}</a-list-item>
            <a-list-item>{{ '专业：' }}
              <span v-for="(profession, index) in item.related_professions" :key="index">{{ profession + ',' }}</span>
            </a-list-item>
            <a-list-item>{{ '状态：' + statusFilter(item.checking_status) }}</a-list-item>
            <a-list-item>{{ '轮次开始时间：' + item.plan_start_time }}</a-list-item>
            <a-list-item>{{ '轮次结束时间：' + item.plan_end_time }}</a-list-item>
            <a-list-item v-if="item.actual_start_time">{{ '巡检开始时间：' + item.actual_start_time }}</a-list-item>
            <a-list-item v-if="item.actual_end_time">{{ '巡检结束时间：' + item.actual_end_time }}</a-list-item>
            <a-list-item />
          </div>
        </div>

      </a-list>
    </a-drawer>
  </div>
</template>

<script>
import { getDutyLog, createInspectionLogByDutyLog, getChoicesOperationWay, getCreatedLogSummary } from '@/api/duty'
// import { getCurTime } from '@/utils/tool'
import { MessageBox } from 'element-ui'
export default {
  data() {
    return {
      listQuery: {
        page: 1,
        // end_time__gte: null,
        duty_log_config__operation_way: null
      },
      total: null,
      tableData: [],
      createdLoading: false,
      loading: true,
      teamDescs: null,
      visible: false,
      activeDutyLog: null
    }
  },
  watch: {
    'listQuery.duty_log_config__operation_way': function() {
      // this.listQuery.end_time__gte = getCurTime()
      this.listQuery.page = 1
      this.fecthData()
    }
  },
  created() {
    this.fecthData()
    getChoicesOperationWay().then(response => {
      this.teamDescs = response.data
      // this.listQuery.team_desc = this.teamDescs[0].name
    })
  },
  methods: {
    statusFilter(key) {
      const map = {
        'LO': '未检',
        'OM': '漏检',
        'NO': '正常'
      }
      return map[key]
    },
    onClose() {
      this.visible = false
    },
    handleCurrentChange(index) {
      this.listQuery.page = index
      this.fecthData()
    },
    createdLog(index, obj) {
      this.createdLoading = true
      createInspectionLogByDutyLog({
        raise_error: false,
        id: obj.id
      }).then(response => {
        if (response.data.length !== 0) {
          // this.$message({
          //   type: 'success',
          //   message: '生成排班记录成功'
          // })
          MessageBox.confirm('成功生成' + response.data[0].turn_log_count + '条轮次记录,' + response.data[0].point_log_count + '条巡检点记录,' + response.data[0].device_log_count + '条设备记录,' + response.data[0].item_log_count + '条巡检项记录', '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'success'
          })
        }
        this.fecthData()
        this.createdLoading = false
      })
    },
    fecthData() {
      this.createdLoading = true
      getDutyLog(this.listQuery).then(response => {
        this.tableData = response.data.items
        this.listQuery.page = response.data.page
        this.total = response.data.count
        this.loading = false
        this.createdLoading = false
      })
    },
    dutyLogDrewer(dutyLog) {
      this.visible = true
      getCreatedLogSummary({ duty_log_id: dutyLog.id }).then(response => {
        this.activeDutyLog = response.data
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
