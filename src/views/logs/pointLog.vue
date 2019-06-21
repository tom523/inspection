<template>
  <div class="app-container">
    <div style="margin-top: 10px">
      <el-row style="margin-left: 6%">
        <el-col :span="8">
          <span>检查级别</span>
          <el-select v-model="listQuery.inspection_level" clearable placeholder="请选择">
            <el-option
              v-for="item in inspection_level"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="8">
          <span>巡检点状态</span>
          <el-select v-model="listQuery.checking_status__in" clearable placeholder="请选择">
            <el-option
              v-for="item in checking_status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="8">
          <span>值：</span>
          <el-select v-model="listQuery.duty_log__team" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in teams"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-top: 30px;margin-left: 6%">
        <el-col :span="8">
          <span>巡检点：</span>
          <el-select v-model="listQuery.check_point__name__contains" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in points"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-col>
        <el-col :span="8">
          <span>选择专业：</span>
          <el-select v-model="listQuery.devicelog__profession__in" style="width: 300px" placeholder="请选择">
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
        </el-col>
        <el-col :span="8">
          <el-switch
            v-model="watchAllPointLog"
            style="margin-top: 10px"
            inactive-text="仅显示当天"
            active-text="显示所有"
          />
        </el-col>
        <!-- <el-button style="width: 10%; margin-left: 39%" type="primary" @click="listQuery = {}">查看全部</el-button> -->
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
            <div v-if="scope.row.checking_status === 'AB'">
              <el-button type="text" @click="watchItem(scope.row)">{{ scope.row.snapshot.name }}</el-button>
            </div>
            <div v-else>{{ scope.row.snapshot.name }}</div>
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
            <div v-if="scope.row.checking_status === 'ST'">
              <el-tooltip class="item" effect="dark" :content="scope.row.stop_comments" placement="right">
                <el-button type="text">{{ scope.row.checking_status | statusFilter }}</el-button>
              </el-tooltip>
            </div>
            <div v-else>
              {{ scope.row.checking_status | statusFilter }}
            </div>
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
          label="轮次开始时间"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.turn_log__plan_start_time.substring(0,10) }}<br></span>
            <span>{{ scope.row.turn_log__plan_start_time.substring(11,19) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="专业"
        >
          <template slot-scope="scope">
            <span v-for="(profession, index) in scope.row.professions" :key="index">{{ profession }}<br></span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="巡检开始时间"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.actual_start_time">
              <span>{{ scope.row.actual_start_time.substring(0,10) }}<br></span>
              <span>{{ scope.row.actual_start_time.substring(11,19) }}</span>
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>
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
    <a-drawer
      title="异常项记录"
      width="40%"
      placement="right"
      :closable="false"
      :visible="visible"
      @close="visible = false"
    >
      <el-card v-for="item in activeItem" :key="item.id" class="box-card">
        <div slot="header" class="clearfix">
          <span>{{ item.snapshot.name }}</span>
          <span v-if="item.checking_status === 'RE'">(已修复)</span>
          <el-button :disabled="item.photo===null" style="float: right; padding: 3px 0" type="text" @click="watchPhoto(item.photo)">查看图片</el-button>
        </div>
        <div>
          <el-row>
            <el-col :span="12">
              <span>{{ '数值：' + item.numerical }}<br><br></span>
              <span>{{ '异常等级：' + item.fault_level }}<br><br></span>
              <span>{{ '越限值：' + item.snapshot.extra.comparisonOperator + ' ' + item.snapshot.extra.threshold + ' ' + item.snapshot.extra.cnUnit }}<br><br></span>
              <span>{{ '轮次：' + item.turn_log.snapshot.name }}<br><br></span>
              <span>{{ '检查人：' + item.staff }}<br><br></span>
            </el-col>
            <el-col :span="12">
              <span>{{ '异常描述：' + item.comments }}<br><br></span>
              <span>{{ '检查类型：' + item.snapshot.type }}<br><br></span>
              <span>{{ '专业：' + item.snapshot.profession }}<br><br></span>
              <span>{{ '设备：' + item.device_name }}<br><br></span>
              <span>{{ '巡检点：' + item.point_name }}<br><br></span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span>{{ '轮次规定时间：' + item.turn_log.plan_start_time + ' ~ ' + item.turn_log.plan_end_time }}<br><br></span>
              <span>{{ '实际巡检时间：' + item.turn_log.actual_start_time + ' ~ ' + item.turn_log.actual_end_time }}</span>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </a-drawer>
    <el-dialog :visible.sync="cpDialogPhoto" title="图片详情" width="40%">
      <div class="img_wap">
        <img :src="photo" class="head-img">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPointLog, getItemLog, getAllPoint } from '@/api/insp'
import { getDate } from '@/utils/tool'
import { putSetHasRead } from '@/api/dashboard'
import { getRoleUser } from '@/api/user'
import { getRelatedTurnProfession } from '@/api/misc'
export default {
  filters: {
    statusFilter(key) {
      const map = {
        'LO': '未检',
        'UN': '未检',
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
        // 3: '抽检',
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
        checking_status__in: null,
        inspection_level: null,
        actual_start_time__gte: getDate() + ' 00:00:00',
        actual_start_time__lte: getDate() + ' 23:59:59',
        check_point__name__contains: null,
        duty_log__team: null,
        devicelog__profession__in: null
      },
      total: null,
      checking_status: [{
        label: '未检',
        value: 'LO,UN'
      },
      // {
      //   label: '解锁',
      //   value: 'UN'
      // },
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
      }],
      watchAllPointLog: false,
      visible: false,
      activeItem: null,
      cpDialogPhoto: false,
      photo: null,
      professions: null,
      teams: null,
      points: null
    }
  },
  watch: {
    listQuery: {
      handler: async function() {
        debugger
        this.listQuery.page = 1
        this.fetchData()
      },
      deep: true
    },
    watchAllPointLog: function() {
      this.watchAllPointLog ? this.listQuery = {} : this.listQuery = {
        checking_status__in: null,
        inspection_level: null,
        actual_start_time__gte: getDate() + ' 00:00:00',
        actual_start_time__lte: getDate() + ' 23:59:59'
      }
    }
    // 'listQuery.checking_status': function() {
    //   this.listQuery.page = 1
    //   this.fetchData()
    // }
  },
  async created() {
    if (this.$route.query.has_read === false) {
      this.listQuery = {
        has_read: false
      }
      // await this.fetchData()
      // this.setHasRead()
    } else if (this.$route.query.status) {
      this.listQuery.checking_status = this.$route.query.status
      this.fetchData()
    } else {
      this.fetchData()
    }
    this.fetchSelectData()
  },
  methods: {
    handleCurrentChange(index) {
      this.listQuery.page = index
      this.fetchData()
    },
    setHasRead() {
      putSetHasRead().then(response => {
        // 设置消息数字为0
      })
    },
    fetchData() {
      getPointLog(this.listQuery).then(response => {
        this.tableData = response.data.items
        this.total = response.data.count
        this.listQuery.page = response.data.page
        if (this.listQuery.has_read === false) {
          this.setHasRead()
        }
      })
    },
    watchItem(rowData) {
      this.visible = true
      getItemLog({
        point_log: rowData.id,
        checking_status__in: 'AB,RE'
      }).then(response => {
        this.activeItem = response.data.items
      })
    },
    fetchSelectData() {
      getRoleUser({ role_type: 'TEAM' }).then(response => {
        this.teams = response.data
      })
      getAllPoint().then(response => {
        this.points = response.data
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
    watchPhoto(photo) {
      this.cpDialogPhoto = true
      this.photo = photo
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
  .itemLog {
    margin-top: 10px
  }
  .el-table .success-row {
    background: #f0f9eb;
  }
  .head-img {
    width: 100%;
    height: auto;
  }
</style>
