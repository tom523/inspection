<template>
  <div class="app-container">
    <div>
      <span style="margin-left: 10%">运转方式</span>
      <el-select v-model="listQuery.operation_way" placeholder="请选择" clearable style="width: 20%">
        <el-option
          v-for="item in operationWay"
          :key="item.id"
          :label="item.display_name"
          :value="item.name"
        />
      </el-select>
      <el-button style="margin-left: 45%; width: 10%;" type="primary" @click="addDuty">+ 添加排班</el-button>
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
            :index="indexMethod"
          />
          <el-table-column
            align="center"
            label="开始时间"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.start_time !== null">
                <span>{{ scope.row.start_time.substring(0,10) }}<br></span>
                <span>{{ scope.row.start_time.substring(11,19) }}</span>
              </div>
              <div v-else>--</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="operation_way"
            label="运转方式"
          />
          <el-table-column
            align="center"
            label="值"
          >
            <template slot-scope="scope">{{ scope.row.teams.toString() }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="班次"
          >
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <div
                  v-for="item in scope.row.template"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                >
                  <p>班次: {{ item.name }}</p>
                  <p>轮次: {{ item.turns }}</p>
                  <p v-if="item.duty_checks.length !== 0">班中检查: {{ item.duty_checks }}</p>
                  <p>----------------------------</p>
                </div>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">班次</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="takeover_timedelta"
            label="交接班区间"
          />
          <el-table-column
            align="center"
            prop="execute_result"
            label="执行结果"
          />
          <el-table-column
            align="center"
            label="执行时间"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.execute_time !== null">
                <span>{{ scope.row.execute_time.substring(0,10) }}<br></span>
                <span>{{ scope.row.execute_time.substring(11,19) }}</span>
              </div>
              <div v-else>--</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="连班天数"
            prop="continuous"
          />
          <el-table-column
            align="center"
            label="全专业巡检"
          >
            <template slot-scope="scope">
              {{ scope.row.full_inspection ? '是' : '否' }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="180"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                disabled
                @click="updateConfig(scope.$index, scope.row)"
              >更新</el-button>
              <el-button
                size="mini"
                type="danger"
                :disabled="scope.row.execute_result !== '未执行'"
                @click="deleteConfig(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col>
        <el-pagination
          style="margin-top: 50px; margin-left: 10%; margin-bottom: 10%"
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
    <!--添加排班dialog-->
    <el-dialog
      :before-close="cancelConfig"
      title="添加排班"
      :visible.sync="addDutyDialog"
      width="88%"
      center
    >
      <el-form :inline="true">
        <el-form-item class="form_item" label="开始时间">
          <el-date-picker
            v-model="start_time"
            class="form_item_value"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item style="margin-left: 50px" label="运转方式">
          <el-select v-model="operation" class="form_item_value" clearable placeholder="请选择">
            <el-option
              v-for="item in operationWay"
              :key="item.id"
              :label="item.name"
              :value="operationWay.indexOf(item)"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="form_item" label="值">
          <el-select v-model="teams" class="form_item_value" clearable placeholder="请选择">
            <el-option
              v-for="item in teamsSet"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-form :inline="true">
        <div
          v-for="item in template"
          :key="template.indexOf(item)"
          :label="item.name"
          :value="item.name"
        >
          <el-form-item label="班次" class="form_item">
            <el-input v-model="item.name" class="form_item_value" />
          </el-form-item>
          <el-form-item label="轮次" class="form_item">
            <el-select
              v-model="item.turns"
              class="form_item_value"
              filterable
              clearable
              reserve-keyword
              collapse-tags
              multiple
              placeholder="请选择"
            >
              <el-button type="text" style="margin-left: 80%" @click="allSelectTurns(item.turns)">全选</el-button>
              <el-option
                v-for="i in turns"
                :key="i.id"
                :label="i.display_name"
                :value="i.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="班中检查" class="form_item">
            <el-select
              v-model="item.duty_checks"
              class="form_item_value"
              clearable
              filterable
              reserve-keyword
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="i in dutyChecks"
                :key="i.id"
                :label="i.display_name"
                :value="i.id"
              />
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <el-form :inline="true">
        <!-- <el-form-item class="form_item" label="类型">
          <el-select v-model="type" style="width: 200px" clearable placeholder="请选择">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="连班天数" class="form_item">
          <el-input v-model="continuous" type="number" min="0" class="form_item_value" />
        </el-form-item>
        <el-form-item label="交接班区间" class="form_item">
          <el-select v-model="takeover_timedelta" class="form_item_value" clearable placeholder="请选择">
            <el-option
              v-for="item in takeoverTimedeltas"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="form_item">
          <el-checkbox v-model="full_inspection">全专业巡检</el-checkbox>
        </el-form-item>
      </el-form>
      <div style="margin-left: 80%">
        <el-button @click="cancelConfig">取消</el-button>
        <el-button v-loading.fullscreen.lock="fullscreenLoading" style="margin-left: 50px" type="primary" @click="addDutyConfig">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDutyLogConfig, addDutyLogConfig, updateDutyLogConfig, deleteDutyLogConfig, getTeamSet, getChoicesOperationWay, dutyCheckGetChoices } from '@/api/duty'
import { getAllTurn } from '@/api/insp'
import { allSelect } from '@/utils/tool'
export default {
  data() {
    return {
      takeoverTimedeltas: [{
        value: 10,
        label: '10分钟'
      },
      {
        value: 20,
        label: '20分钟'
      },
      {
        value: 30,
        label: '30分钟'
      }],
      types: [{
        value: '7*24',
        label: '7*24'
      }],
      loading: false,
      tableData: [],
      addDutyDialog: false,
      start_time: null,
      continuous: null,
      teams: null,
      takeover_timedelta: null,
      template: [],
      turns: [],
      dutyChecks: [],
      teamsSet: [],
      rowID: undefined,
      listQuery: {
        page: 1,
        operation_way: null
      },
      total: null,
      operation: null,
      operationWay: [],
      professions: [],
      fullscreenLoading: false,
      full_inspection: false
    }
  },
  watch: {
    'listQuery.operation_way': function() {
      this.listQuery.page = 1
      this.fetchData()
    },
    operation: function() {
      if (this.operation === null) {
        return
      }
      this.addTamplate()
      this.fecthTeamSet()
    }
  },
  created() {
    this.fetchData()
    this.fecthSelect()
  },
  methods: {
    // 翻页
    handleCurrentChange(index) {
      this.listQuery.page = index
      this.fetchData()
    },
    // 更新
    updateConfig(index, obj) {
      this.rowID = obj.id
      this.start_time = obj.start_time
      this.teams = obj.teams.toString()
      this.template = obj.template
      this.duty_checks = obj.template[0].duty_checks
      this.takeover_timedelta = obj.takeover_timedelta
      this.addDutyDialog = true
      this.continuous = obj.continuous
    },
    // 删除
    deleteConfig(index, obj) {
      this.$confirm('此操作将删除' + obj.name + ',是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDutyLogConfig(obj.id).then(response => {
          this.tableData.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 取消添加排班
    cancelConfig() {
      this.clearDate()
    },
    // 添加排班
    addDuty() {
      this.addDutyDialog = true
    },
    addTamplate() {
      this.template = []
      for (let i = 0; i < this.operationWay[this.operation].running_count; i++) {
        this.template.push({
          name: '',
          turns: [],
          duty_checks: ''
        })
      }
    },
    addDutyConfig() {
      this.fullscreenLoading = true
      const data = {
        teams: this.teams,
        start_time: this.start_time,
        continuous: this.continuous,
        operation_way: this.operationWay[this.operation].name,
        takeover_timedelta: this.takeover_timedelta,
        check_times_ratio: [15, 20, 30, 20, 15],
        template: this.template,
        duty_checks: this.duty_checks,
        full_inspection: this.full_inspection
      }
      if (this.rowID === undefined) {
        addDutyLogConfig(data).then(response => {
          this.clearDate()
          this.fetchData()
          this.fullscreenLoading = false
          this.$message({
            type: 'success',
            message: '排班配置成功'
          })
        }).catch(err => {
          console.log(err)
          this.fullscreenLoading = false
        })
      } else {
        updateDutyLogConfig(this.rowID, data).then(response => {
          this.clearDate()
          this.fetchData()
          this.rowID === undefined
          this.$message({
            type: 'success',
            message: '更新排班配置成功'
          })
        })
      }
    },
    // 获取表格
    fetchData() {
      getDutyLogConfig(this.listQuery).then(response => {
        this.listQuery.page = response.data.page
        this.total = response.data.count
        this.tableData = response.data.items
      })
    },
    // 获取选择框数据
    fecthTeamSet() {
      getTeamSet({
        team_desc: this.operationWay[this.operation].name
      }).then(response => {
        this.teamsSet = response.data
      })
    },
    async fecthSelect() {
      getAllTurn().then(response => {
        this.turns = response.data
      })
      dutyCheckGetChoices().then(response => {
        this.dutyChecks = response.data
      })
      await getChoicesOperationWay().then(response => {
        this.operationWay = response.data
        // this.listQuery.operation_way = this.operationWay[0].name
      })
    },
    // 清空表单
    clearDate() {
      this.teams = null
      this.start_time = null
      this.operation = null
      this.operation_way = null
      this.takeover_timedelta = null
      this.template = []
      this.duty_checks = null
      this.addDutyDialog = false
      this.full_inspection = false
    },
    allSelectTurns(turns) {
      turns = allSelect(turns, this.turns, 'id')
      // for (var i = 0; i < this.turns.length; i++) {
      //   if (turns.filter(item => item === this.turns[i].id).length === 0) {
      //     turns.push(this.turns[i].id)
      //   }
      // }
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
  .form_item {
    margin-left: 28px
  }
  .form_item_value {
    width: 280px
  }
</style>
