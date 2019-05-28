<template>
  <div class="app-container">
    <div>
      <el-button style="margin-left: 60%" type="primary" @click="generateLogPipe">生成管线巡检记录</el-button>
      <el-button type="primary" @click="generateLogReview">生成复检巡检记录</el-button>
      <el-button type="primary" @click="addDuty">+ 添加排班</el-button>
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
            prop="start_time"
            label="开始时间"
          />
          <el-table-column
            align="center"
            prop="type"
            label="类型"
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
                  <p>班中检查: {{ item.duty_checks }}</p>
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
            prop="execute_time"
            label="执行时间"
          />
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
                @click="deleteConfig(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
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
          <el-select v-model="operation" class="form_item_value" placeholder="请选择" @change="addTamplate">
            <el-option
              v-for="item in operationWay"
              :key="item.id"
              :label="item.name"
              :value="operationWay.indexOf(item)"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="form_item" label="值">
          <el-select v-model="teams" class="form_item_value" placeholder="请选择">
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
            <el-select v-model="item.turns" class="form_item_value" multiple placeholder="请选择">
              <el-option
                v-for="i in turns"
                :key="i.id"
                :label="i.display_name"
                :value="i.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="班中检查" class="form_item">
            <el-select v-model="item.duty_checks" class="form_item_value" multiple placeholder="请选择">
              <el-option
                v-for="i in dutyChecks"
                :key="i.id"
                :label="i.name"
                :value="i.id"
              />
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <el-form :inline="true">
        <el-form-item class="form_item" label="类型">
          <el-select v-model="type" class="form_item_value" placeholder="请选择">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="连班天数" class="form_item">
          <el-input v-model="continuous" class="form_item_value" />
        </el-form-item>
        <el-form-item label="交接班区间" class="form_item">
          <el-select v-model="takeover_timedelta" class="form_item_value" placeholder="请选择">
            <el-option
              v-for="item in takeoverTimedeltas"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="margin-left: 80%">
        <el-button @click="cancelConfig">取消</el-button>
        <el-button style="margin-left: 50px" type="primary" @click="addDutyConfig">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="40%"
      :before-close="cancelConfig"
      :visible.sync="generateLogDialog"
    >
      <el-form v-model="generateData">
        <el-form-item label="是否生成本周、月、季记录">
          <el-radio-group v-model="generateData.raise_time">
            <el-radio label="true">是</el-radio>
            <el-radio label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="专业">
          <el-select
            v-model="generateData.profession_id"
            style="width: 80%"
          >
            <el-option
              v-for="item in professions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-button style="margin-left: 80%" type="primary" @click="generateLogByFrequency">确定</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { getDutyLogConfig, addDutyLogConfig, updateDutyLogConfig, deleteDutyLogConfig, getTeamSet, getDutyLogOperationWay, genLogByFrequencyREview, genLogByFrequencyPipe, dutyCheckGetChoices } from '@/api/duty'
import { getTurn } from '@/api/insp'
import { getRoleUser } from '@/api/user'
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
      type: null,
      continuous: null,
      teams: null,
      takeover_timedelta: null,
      template: [],
      turns: [],
      dutyChecks: [],
      teamsSet: [],
      rowID: undefined,
      page: 1,
      total: null,
      operation: null,
      operationWay: [],
      generateLogDialog: false,
      generateData: {
        raise_time: null,
        profession_id: null
      },
      professions: []
    }
  },
  created() {
    this.fetchData()
    this.fecthSelect()
  },
  methods: {
    // 翻页
    handleCurrentChange(index) {
      this.page = index
      this.fetchData()
    },
    // 更新
    updateConfig(index, obj) {
      this.rowID = obj.id
      this.start_time = obj.start_time
      this.type = obj.type
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
          turns: '',
          duty_checks: ''
        })
      }
    },
    addDutyConfig() {
      const data = {
        teams: this.teams,
        start_time: this.start_time,
        continuous: this.continuous,
        type: this.type,
        takeover_timedelta: this.takeover_timedelta,
        check_times_ratio: [15, 20, 30, 20, 15],
        template: this.template,
        duty_checks: this.duty_checks
      }
      if (this.rowID === undefined) {
        addDutyLogConfig(data).then(response => {
          this.clearDate()
          this.fetchData()
          this.$message({
            type: 'success',
            message: '排班配置成功'
          })
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
      getDutyLogConfig({ page: this.page }).then(response => {
        this.page = response.data.page
        this.total = response.data.count
        this.tableData = response.data.items
      })
    },
    // 获取选择框数据
    fecthSelect() {
      getTurn().then(response => {
        this.turns = response.data.items
      })
      dutyCheckGetChoices().then(response => {
        this.dutyChecks = response
      })
      getTeamSet().then(response => {
        this.teamsSet = response.data
      })
      getDutyLogOperationWay().then(response => {
        this.operationWay = response.data.items
      })
    },
    // 清空表单
    clearDate() {
      this.teams = null
      this.start_time = null
      this.operation = null
      this.type = null
      this.takeover_timedelta = null
      this.template = [{ name: '', turns: '' }]
      this.duty_checks = null
      this.addDutyDialog = false
      this.generateData = [{ raise_time: null, profession_id: null }]
      this.generateLogDialog = false
    },
    // 生成复检巡检记录
    generateLogReview() {
      this.generateLogDialog = true
      getRoleUser({ role_type: 'REVIEW_PROFESSION' }).then(response => {
        this.professions = response.data
      })
    },
    // 生成管线巡检记录
    generateLogPipe() {
      this.generateLogDialog = true
      getRoleUser({ role_type: 'PIPE_PROFESSION' }).then(response => {
        this.professions = response.data
      })
    },
    generateLogByFrequency() {
      console.log(this.generateData)
      if (this.professions[0].role_type === 'REVIEW_PROFESSION') {
        genLogByFrequencyREview(this.generateData).then(response => {
          this.generateLogDialog = false
          this.clearDate()
          this.$message({
            type: 'success',
            message: '生成复检巡检记录成功！'
          })
        }).catch(err => {
          console.log(err)
        })
      } else if (this.professions[0].role_type === 'PIPE_PROFESSION') {
        genLogByFrequencyPipe(this.generateData).then(response => {
          this.generateLogDialog = false
          this.clearDate()
          this.$message({
            type: 'success',
            message: '生成管线巡检记录成功！'
          })
        }).catch(err => {
          console.log(err)
        })
      }
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
  .form_item {
    margin-left: 28px
  }
  .form_item_value {
    width: 280px
  }
</style>
