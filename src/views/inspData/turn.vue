<template>
  <div class="app-container">
    <div style="margin-top: 50px">
      <el-col>
        <el-button class="el-table-add-row" type="primary" @click="add_row">+ 添加轮次</el-button>
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
            label="轮次"
            width="100"
          >
            <template slot-scope="scope">
              {{ scope.row.select_show ? '' : scope.row.name }}
              <div v-if="scope.row.select_show">
                <el-input v-model="scope.row.name" />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="巡检点"
          >
            <template slot-scope="scope">
              {{ scope.row.select_show ? '' : scope.row.points.toString() }}
              <div v-if="scope.row.select_show">
                <el-select
                  v-model="scope.row.points"
                  filterable
                  style="width: 100%"
                  multiple
                >
                  <el-option
                    v-for="item in points"
                    :key="item.username"
                    :lable="item.id"
                    :value="item.name"
                  />
                </el-select>
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
import { getTurn, updateTurn, addTurn, deleteTurn, getAllPoint } from '@/api/insp'
export default {
  data() {
    return {
      loading: false,
      tableData: [],
      points: [],
      rowName: '',
      rowPoint: ''
    }
  },
  created() {
    this.fecthdata()
    this.fecthPoint()
  },
  methods: {
    editRowOrConfirm(index, obj) {
      // 点击确定
      if (this.tableData[index].select_show) {
        obj.points = obj.points.toString()
        if (obj.id === undefined) {
          // 新建轮次
          addTurn({
            name: obj.name,
            points: obj.points
          }).then(response => {
            this.fecthdata()
            this.$message({
              type: 'sussess',
              message: '添加轮次成功！'
            })
          }).catch(err => {
            this.$message({
              type: 'warning',
              message: err.response.data.data.members
            })
            console.log(err)
          })
        } else {
          updateTurn(obj.id, obj).then(response => {
            this.fecthdata()
            this.$message({
              type: 'sussess',
              message: '更新轮次成功'
            })
          }).catch(err => {
            this.$message({
              type: 'warning',
              message: err.response.data.data.members
            })
            console.log(err)
          })
        }
        this.tableData[index].select_show = false
      } else {
        // 点击编辑
        this.rowName = JSON.parse(JSON.stringify(obj.name))
        this.rowPoint = JSON.parse(JSON.stringify(obj.points))
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
          this.tableData[index].points = this.rowPoint
          this.tableData[index].select_show = false
        }
      } else {
        // 点击删除
        this.$confirm('此操作将删除' + obj.name + ',是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteTurn(obj.id).then(response => {
            this.tableData.splice(index, 1)
            this.$message({
              type: 'sussess',
              message: '删除轮次成功'
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
    // 点击添加
    add_row() {
      this.tableData.push({
        name: '',
        points: [],
        select_show: true
      })
    },
    fecthdata() {
      getTurn().then(response => {
        var turnData = response.data.items
        turnData.map(item => {
          if (item.points !== '') {
            item.points = item.points.split(',')
          }
          item.select_show = false
        })
        this.tableData = turnData
      })
    },
    fecthPoint() {
      getAllPoint().then(response => {
        this.points = response.data
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
