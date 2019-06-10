<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-table
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
              type="index"
              label="序号"
              width="80"
              :index="indexMethod"
            />
            <el-table-column
              align="center"
              label="名称"
              prop="name"
            />
            <el-table-column
              align="center"
              label="值"
              prop="team"
            />
            <el-table-column
              align="center"
              label="用户"
            >
              <template slot-scope="scope">
                {{ scope.row.users || '--' }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="开始时间"
              prop="start_time"
            />
            <el-table-column
              align="center"
              label="结束时间"
              prop="end_time"
            />
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-pagination
          style="margin-top: 30px; margin-bottom: 20px"
          :current-page="listQuery.page"
          :total="total"
          page-size="5"
          background
          prev-text="上一页"
          next-text="下一页"
          layout="total, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import { getRecentDutyLog } from '@/api/dashboard'
import { getDutyLog } from '@/api/duty'
import { getCurTime } from '@/utils/tool'
export default {
  data() {
    return {
      listQuery: {
        page: 1,
        page_size: 5,
        end_time__gte: getCurTime()
      },
      tableData: [],
      total: null
    }
  },
  created() {
    this.fecthdata()
  },
  methods: {
    handleCurrentChange(index) {
      this.listQuery.page = index
      this.fecthdata()
    },
    fecthdata() {
      getDutyLog(this.listQuery).then(response => {
        this.total = response.data.count
        this.tableData = response.data.items
      })
    },
    indexMethod(index) {
      return (this.listQuery.page - 1) * 5 + index + 1
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
