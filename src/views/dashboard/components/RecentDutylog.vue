<template>
  <div class="app-container">
    <div>
      <el-col>
        <el-table
          :row-class-name="row_class"
          border
          stripe
          :data="tableData"
        >
          <el-table-column
            align="center"
            label="最近班次记录表"
          >
            <el-table-column
              align="center"
              label="班次"
              width="100"
              prop="name"
            />
            <el-table-column
              align="center"
              label="值"
              width="100"
              prop="team"
            />
            <el-table-column
              align="center"
              label="开始时间"
              width="200"
              prop="start_time"
            />
            <el-table-column
              align="center"
              label="结束时间"
              width="200"
              prop="end_time"
            />
            <el-table-column
              align="center"
              width="200"
              label="轮次"
            >
              <template slot-scope="scope">
                <span v-for="(turn, index) in scope.row.turns" :key="index">{{ turn }}<br></span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              width="200"
              label="班中检查"
            >
              <template slot-scope="scope">
                <span v-for="(check, index) in scope.row.duty_checks" :key="index">{{ check }}<br></span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              width="200"
              label="班中检查时间"
            >
              <template slot-scope="scope">
                <span v-for="(time, index) in scope.row.check_time" :key="index">{{ time.s.substring(11) + ' 至 ' + time.e.substring(11) }}<br></span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              width="200"
              label="交班开始时间"
              prop="takeover_start_time"
            />
            <el-table-column
              align="center"
              width="200"
              label="交班结束时间"
              prop="takeover_end_time"
            />
          </el-table-column>
        </el-table>
      </el-col>
    </div>
  </div>
</template>

<script>
import { getRecentDutyLog } from '@/api/dashboard'
export default {
  data() {
    return {
      tableData: []
    }
  },
  created() {
    this.fecthdata()
  },
  methods: {
    fecthdata() {
      getRecentDutyLog().then(response => {
        this.tableData = response.data
      })
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
