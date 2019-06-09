<template>
  <div class="app-container">
    <el-container>
      <el-main style="width: 50%; height: 760px;background-color: #E9EEF3;">
        <div>
          <el-row>
            <el-col :span="6">巡检日报</el-col>
          </el-row>
          <el-steps style="height: auto; margin-top: 20px" direction="vertical" align-center>
            <!-- 当天所有的班次 -->
            <el-step style="cursor: pointer" status="finish" title="班次" @click.native="changeTable('班次')">
              <template slot="description">
                <el-row style="margin-top: 40px">
                  <el-col align="center" :span="4">名称</el-col>
                  <el-col align="center" :span="4">值</el-col>
                  <el-col align="center" :span="6">开始时间</el-col>
                  <el-col align="center" :span="8">结束时间</el-col>
                </el-row>
                <el-row v-for="(item, index) in todayAllDutyLog" :key="index" style="margin-top: 10px">
                  <el-col align="center" :span="4">{{ item.name }}</el-col>
                  <el-col align="center" :span="4">{{ item.team }}</el-col>
                  <el-col align="center" :span="6">{{ item.start_time }}</el-col>
                  <el-col align="center" :span="8">{{ item.end_time }}</el-col>
                </el-row>
              </template>
            </el-step>
            <!-- 点记录所有状态统计 -->
            <el-step style="cursor: pointer" status="finish" title="巡检点" @click.native="changeTable('巡检点')">
              <template slot="description">
                <el-row style="margin-top: 40px">
                  <el-col v-for="(item, index) in pointCount" :key="index" :span="4" align="center">{{ item.value }}</el-col>
                </el-row>
                <el-row style="margin-top: 40px">
                  <el-col v-for="(item, index) in pointCount" :key="index" :span="4" align="center">{{ item.name }}</el-col>
                </el-row>
              </template>
            </el-step>
            <!-- 设备记录的所有状态统计 -->
            <el-step style="cursor: pointer" status="finish" title="设备" @click.native="changeTable('设备')">
              <template slot="description">
                <el-row style="margin-top: 40px">
                  <el-col v-for="(item, index) in deviceLogCount" :key="index" :span="4" align="center">{{ item.value }}</el-col>
                </el-row>
                <el-row style="margin-top: 40px">
                  <el-col v-for="(item, index) in deviceLogCount" :key="index" :span="4" align="center">{{ item.name }}</el-col>
                </el-row>
              </template>
            </el-step>
            <!-- 项记录的所有状态统计 -->
            <el-step style="cursor: pointer" status="finish" title="巡检项" @click.native="changeTable('巡检项')">
              <template slot="description">
                <el-row style="margin-top: 40px">
                  <el-col v-for="(item, index) in itemLogCount" :key="index" :span="4" align="center">{{ item.value }}</el-col>
                </el-row>
                <el-row style="margin-top: 40px">
                  <el-col v-for="(item, index) in itemLogCount" :key="index" :span="4" align="center">{{ item.name }}</el-col>
                </el-row>
              </template>
            </el-step>
            <el-step style="cursor: pointer" status="finish" title="轮次" @click.native="changeTable('轮次')">
              <template slot="description">
                <el-row style="margin-top: 40px">
                  <el-col v-for="(item, index) in turnCount" :key="index" :span="4" align="center">{{ item.value }}</el-col>
                </el-row>
                <el-row style="margin-top: 40px">
                  <el-col v-for="(item, index) in turnCount" :key="index" :span="4" align="center">{{ item.name }}</el-col>
                </el-row>
              </template>
            </el-step>
          </el-steps>
        </div>
      </el-main>
      <el-main>
        <div style="margin-left: 20px; height: 720px">
          <div v-if="tableStatus === '班次'">
            <el-table
              height="720px"
              :data="todayAllDutyLog"
              border
              stripe
            >
              <el-table-column align="center" :label="tableStatus">
                <el-table-column
                  prop="name"
                  width="100"
                  align="center"
                  label="名称"
                />
                <el-table-column
                  label="轮次"
                  width="220"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span v-for="(turn, index) in scope.row.turns" :key="index">{{ turn }}<br></span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="班中检查"
                  align="center"
                >
                  <template slot-scope="scope">

                    <el-popover trigger="hover" placement="left">
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
                        <span v-for="(check, index) in scope.row.duty_checks" :key="index">{{ check }}<br></span>
                      </div>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column
                  label="交接班时间"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.takeover_start_time }}<br></span>
                    <span>{{ scope.row.takeover_end_time }}</span>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>
          <div v-else style="margin-left: 20px;">
            <el-table
              height="720px"
              border
              :span-method="objectSpanMethod"
              :data="tableData"
            >
              <el-table-column align="center" :label="tableStatus">
                <el-table-column
                  label="值"
                  align="center"
                  prop="team"
                />
                <el-table-column
                  v-if="tableStatus !== '巡检点' && tableStatus !== '轮次'"
                  label="专业"
                  align="center"
                  prop="profession"
                />
                <el-table-column
                  label="未检"
                  align="center"
                  prop="UN"
                />
                <el-table-column
                  label="正常"
                  align="center"
                  prop="NO"
                />
                <el-table-column
                  v-if="tableStatus !== '轮次'"
                  label="异常"
                  align="center"
                  prop="AB"
                />
                <el-table-column
                  v-if="tableStatus !== '轮次'"
                  label="停检"
                  align="center"
                  prop="ST"
                />
                <el-table-column
                  label="漏检"
                  align="center"
                  prop="OM"
                />
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getDayPointCount, getDayDeviceLogCount, getDayItemLogCount, getDayTeamProfessionItemCount, getDayTeamProfessionDeviceCount, getTodayAllDutyLog, getDayTurnCount, getDayTeamPointCount, getDayTeamTurnCount } from '@/api/photoAndDaily'
export default {
  data() {
    return {
      tableStatus: '班次',
      pointCount: null,
      deviceLogCount: null,
      itemLogCount: null,
      teamProfessionItemCount: null,
      teamProfessionDeviceCount: null,
      todayAllDutyLog: null,
      tableData: null,
      turnCount: null,
      teamPointCount: null,
      teamTurnCount: null,
      spanArr: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getDayPointCount().then(response => {
        this.pointCount = response.data
      })
      getDayDeviceLogCount().then(response => {
        this.deviceLogCount = response.data
      })
      getDayItemLogCount().then(response => {
        this.itemLogCount = response.data
      })
      getDayTeamProfessionItemCount().then(response => {
        this.teamProfessionItemCount = response.data
      })
      getDayTeamProfessionDeviceCount().then(response => {
        this.teamProfessionDeviceCount = response.data
      })
      getTodayAllDutyLog().then(response => {
        this.todayAllDutyLog = response.data.duty_logs
      })
      getDayTurnCount().then(response => {
        this.turnCount = response.data.data
      })
      getDayTeamPointCount().then(response => {
        this.teamPointCount = response.data
      })
      getDayTeamTurnCount().then(response => {
        this.teamTurnCount = response.data
      })
    },
    // 判断是否需要合并单元格
    getSpanArr(data) {
      this.spanArr = []
      var pos = 0
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1)
          pos = 0
        } else {
          if (data[i].team === data[i - 1].team) {
            this.spanArr[pos] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            pos = i
          }
        }
      }
    },
    changeTable(status) {
      this.tableStatus = status
      if (this.tableStatus === '设备') {
        this.tableData = this.teamProfessionDeviceCount
      } else if (this.tableStatus === '巡检项') {
        this.tableData = this.teamProfessionItemCount
      } else if (this.tableStatus === '巡检点') {
        this.tableData = this.teamPointCount
      } else if (this.tableStatus === '轮次') {
        this.tableData = this.teamTurnCount
      } else {
        return
      }
      this.getSpanArr(this.tableData)
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      // if (columnIndex === 0) {
    //       if (rowIndex % 3 === 0) {
    //         return {
    //           rowspan: 3,
    //           colspan: 1
    //         };
    //       } else {
    //         return {
    //           rowspan: 0,
    //           colspan: 0
    //         };
    //       }
    //     }
    }
  }
}
</script>
<style>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .bg-purple {
    background: #d3dce6;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

</style>
