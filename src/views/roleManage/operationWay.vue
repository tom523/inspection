<template>
  <div class="app-container">
    <div style="margin-top: 50px">
      <el-col class="el-table-add-row">
        <el-button type="primary" @click="add_row">新建运转类型</el-button>
      </el-col>
      <el-col>
        <el-table
          v-loading="loading"
          element-loading-text="拼命加载中"
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
            label="名称"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.select_show">
                <el-input v-model="scope.row.name" />
              </div>
              <div v-else>
                {{ scope.row.name }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="值(个数)"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.select_show">
                <el-input v-model="scope.row.team_count" />
              </div>
              <div v-else>
                {{ scope.row.team_count }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="运转次数"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.select_show">
                <el-input v-model="scope.row.running_count" />
              </div>
              <div v-else>
                {{ scope.row.running_count }}
              </div>
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
                @click="editRowOrConfirm(scope.$index, scope.row)"
              >{{ scope.row.select_show ? '确定' : '编辑' }}</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="deleteRowOrCancel(scope.$index, scope.row)"
              >{{ scope.row.select_show ? '取消' : '删除' }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </div>
  </div>
</template>

<script>
// import { getList } from '@/api/table'
import { getDutyLogOperationWay, addDutyLogOperationWay, updateDutyLogOperationWay, deleteDutyLogOperationWay } from '@/api/duty'

export default {
  data() {
    return {
      loading: false,
      tableData: [],
      rowName: null,
      rowTeamCount: null,
      rowRunningCount: null
    }
  },
  created() {
    this.fecthdata()
    this.fecthSelect()
  },
  methods: {
    editRowOrConfirm(index, obj) {
      // 点击确定
      if (this.tableData[index].select_show) {
        // 新建值
        if (obj.id === undefined) {
          addDutyLogOperationWay(obj).then(response => {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.fecthdata()
          }).catch(err => {
            this.$message({
              type: 'warning',
              message: err
            })
            this.tableData[index].select_show = true
            // this.tableData.splice(index, 1)
            console.log(err)
          })
        } else {
          updateDutyLogOperationWay(obj.id, obj).then(response => {
            this.fecthdata()
            this.$message({
              type: 'success',
              message: '更新成功'
            })
          }).catch(err => {
            this.$message({
              type: 'warning',
              message: err
            })
            console.log(err)
          })
        }
        this.tableData[index].select_show = false
      } else {
        // 点击编辑
        this.rowName = JSON.parse(JSON.stringify(obj.name))
        this.rowTeamCount = JSON.parse(JSON.stringify(obj.team_count))
        this.rowRunningCount = JSON.parse(JSON.stringify(obj.running_count))
        this.tableData[index].select_show = true
      }
    },
    deleteRowOrCancel(index, obj) {
      if (this.tableData[index].select_show) {
        // 点击取消
        if (obj.id === undefined) {
          this.tableData.splice(index, 1)
        } else {
          this.tableData[index].name = this.rowName
          this.tableData[index].team_count = this.rowTeamCount
          this.tableData[index].running_count = this.rowRunningCount
          this.tableData[index].select_show = false
        }
      } else {
        // 点击删除，删除值
        this.$confirm('此操作将删除' + obj.name + ',是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDutyLogOperationWay(obj.id).then(response => {
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
      }
    },
    add_row() {
      // 点击添加
      this.tableData.push({
        name: '',
        team_count: null,
        running_count: null,
        select_show: true
      })
    },
    fecthdata() {
      getDutyLogOperationWay().then(response => {
        var data = response.data.items
        data.map(item => {
          item.select_show = false
        })
        this.tableData = data
      })
    },
    fecthSelect() {

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
    margin-left: 75%;
    margin-right: auto;
    height: 40px;
    cursor: pointer;
    justify-content: center;
    display: flex;
}
</style>
