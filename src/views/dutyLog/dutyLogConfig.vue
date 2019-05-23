<template>
  <div class="app-container">
    <div style="margin-top: 10px">
      <el-col>
        <el-button class="el-table-add-row" type="primary" @click="addDuty">+ 添加排班</el-button>
      </el-col>
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
            prop="teams"
            label="值"
          />
          <el-table-column
            align="center"
            label="班次"
          >
            <template slot-scope="scope">
              <div v-for="item in scope.row.template">
                <el-popover trigger="hover" placement="top">
                  <p>班次: {{ item.name }}</p>
                  <p>轮次: {{ item.turns }}</p>
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium">{{ item.name }}</el-tag>
                  </div>
                </el-popover>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col>
        <!-- <el-pagination
          style="margin-top: 50px; margin-left: 10%"
          :current-page="page"
          :total="total"
          background
          prev-text="上一页"
          next-text="下一页"
          layout="total, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
        /> -->
      </el-col>
    </div>
    <el-dialog
      title="添加排班"
      :visible.sync="addDutyDialog"
      width="50%"
      center
    >
      <el-form ref="changePasswordForm">
        <div />
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="start_time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="运转方式">
          <el-select v-model="desc" placeholder="请选择">
            <el-option
              v-for="item in descs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="type" placeholder="请选择">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="值">
          <el-select v-model="teams" placeholder="请选择">
            <el-option
              v-for="item in teamsSet"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <div
          v-for="item in template"
          :key="item.name"
          :label="item.turns"
          :value="item.name"
        >
          <el-form-item label="班次">
            <el-input v-model="item.name" style="width: 30%" />
          </el-form-item>
          <el-form-item label="轮次">
            <el-select v-model="item.turns" multiple placeholder="请选择">
              <el-option
                v-for="i in turns"
                :key="i.id"
                :label="i.name"
                :value="i.id"
              />
            </el-select>
          </el-form-item>
        </div>
        <div><el-button @click="addTamplate">+</el-button></div>
        <el-form-item label="班中检查">
          <el-select v-model="duty_checks" multiple placeholder="请选择">
            <el-option
              v-for="item in dutyChecks"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="交接班区间">
          <el-select v-model="takeover_timedelta" placeholder="请选择">
            <el-option
              v-for="item in takeoverTimedeltas"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-button @click="cancelConfig">取消</el-button>
        <el-button type="primary" @click="addDutyConfig">确定</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getDutyLogConfig, addDutyLogConfig, updateDutyLogConfig, deleteDutyLogConfig, getTeamSet } from '@/api/duty'
import { getTurn, getDutyCheck } from '@/api/insp'
export default {
  data() {
    return {
      tableData: [],
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
      desc: '',
      descs: [{
        value: 43,
        label: '四班三运转'
      },
      {
        value: 53,
        label: '五班三运转'
      },
      {
        value: 54,
        label: '五班四运转'
      }],
      loading: false,
      tableData: [],
      addDutyDialog: false,
      start_time: null,
      type: null,
      continuous: null,
      teams: null,
      takeover_timedelta: null,
      template: [{
        name: '',
        turns: ''
      }],
      duty_checks: [],
      turns: [],
      dutyChecks: [],
      teamsSet: []
    }
  },
  created() {
    this.fetchData()
    this.fecthSelect()
  },
  methods: {
    addDutyConfig() {
      console.log(this.template)
      const data = {
        teams: this.teams,
        start_time: this.start_time,
        continuous: this.desc % 10,
        type: this.type,
        takeover_timedelta: this.takeover_timedelta,
        check_times_ratio: [15, 20, 30, 20, 15],
        template: this.template,
        duty_checks: this.duty_checks
      }
      addDutyLogConfig(data).then(response => {
        this.clearDate()
        this.$message({
          type: 'success',
          message: '排班配置成功'
        })
      })
    },
    cancelConfig() {
      this.clearDate()
    },
    addDuty() {
      // 点击添加
      this.addDutyDialog = true
    },
    addTamplate() {
      this.template.push({
        name: '',
        turns: ''
      })
    },
    fetchData() {
      getDutyLogConfig().then(response => {
        debugger
        this.tableData = response.data.items
      })
    },
    fecthSelect() {
      getTurn().then(response => {
        this.turns = response.data.items
      })
      getDutyCheck().then(response => {
        this.dutyChecks = response.data.items
      })
      getTeamSet().then(response => {
        this.teamsSet = response.data
      })
    },
    clearDate() {
      this.teams = null
      this.start_time = null
      this.desc = null
      this.type = null
      this.takeover_timedelta = null
      this.template = [{ name: '', turns: '' }]
      this.duty_checks = null
      this.addDutyDialog = false
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
