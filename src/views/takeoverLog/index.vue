<template>
  <div class="app-container">
    <div style="margin-top: 50px">
      <span style="margin-left: 8%">选择专业</span>
      <el-select v-model="listQuery.professions" placeholder="请选择">
        <el-option
          v-for="item in professions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-timeline style="width: 90%; margin-left: auto; margin-right: auto;margin-top: 30px">
        <el-timeline-item v-for="item in tableData" :key="item.id" :timestamp="item.create_at" placement="top">
          <el-card v-if="item.handOverStaff === 'admin' && item.takeOverStaff === 'admin'">
            <h4>系统自动交接班</h4>
            <el-steps :active="2" simple>
              <el-step :title="item.handOverDutyName + '--' + item.handOverTeam" />
              <el-step :title="item.takeOverDutyName + '--' + item.takeOverTeam" />
            </el-steps>
          </el-card>
          <el-card v-else>
            <h4>员工交接班</h4>
            <el-steps :active="2" simple>
              <el-step :title="item.handOverDutyName + '--' + item.handOverTeam + '--' + item.handOverStaff" />
              <el-step :title="item.takeOverDutyName + '--' + item.takeOverTeam + '--' + item.takeOverStaff" />
            </el-steps>
          </el-card>
        </el-timeline-item>

      </el-timeline>
      <!-- <el-table
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
            label="交班班次"
            prop="handOverDutyName"
          />
          <el-table-column
            align="center"
            label="接班班次"
            prop="takeOverDutyName"
          />
          <el-table-column
            align="center"
            label="交班值"
            prop="handOverTeam"
          />
          <el-table-column
            align="center"
            label="接班值"
            prop="takeOverTeam"
          />
          <el-table-column
            align="center"
            label="交班人"
            prop="handOverStaff"
          />
          <el-table-column
            align="center"
            label="接班人"
            prop="takeOverStaff"
          />
        </el-table> -->
      <el-pagination
        style="margin-top: 20px; margin-left: 10%; margin-bottom: 5%"
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
import { gettakeoverLog, getTeamProfessionChoices } from '@/api/duty'
export default {

  data() {
    return {
      tableData: [],
      professions: null,
      listQuery: {
        page: 1,
        professions: null
      },
      total: null
    }
  },
  watch: {
    'listQuery.professions': function() {
      this.listQuery.page = 1
      this.fecthdata()
    }
  },
  async created() {
    await getTeamProfessionChoices().then(response => {
      this.professions = response.data
      this.listQuery.professions = this.professions[0]
    })
    this.fecthdata()
  },
  methods: {
    handleCurrentChange(index) {
      this.page = index
      this.fecthdata()
    },
    fecthdata() {
      gettakeoverLog(this.listQuery).then(response => {
        this.listQuery.page = response.data.page
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
