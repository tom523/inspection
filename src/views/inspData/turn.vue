<template>
  <div class="app-container">
    <div style="margin-top: 50px">
      <el-button style="margin-left: 80%; width: 10%" type="primary" @click="add_row">+ 添加轮次</el-button>
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        :row-class-name="row_class"
        border
        :data="tableData"
        style="width: 80%; margin-left: auto; margin-right: auto; margin-top: 20px; margin-bottom: 10%"
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
          label="轮次"
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
            <div v-else>
              <span
                v-for="(point, index) in scope.row.points"
                :key="index"
              >
                {{ point }}
                <br v-if="typeof scope.row.points === 'object'">
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="相关专业"
          prop="related_professions"
        />
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
      <el-pagination
        style="margin-left: 10%; margin-bottom: 40px; margin-bottom: 10%"
        :current-page="page"
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
import { getTurn, updateTurn, addTurn, deleteTurn, getTurnChoices } from '@/api/insp'
export default {
  data() {
    return {
      loading: false,
      tableData: [],
      points: [],
      rowName: '',
      rowPoint: '',
      page: 1,
      total: null
    }
  },
  created() {
    this.fecthdata()
    this.fecthPoint()
  },
  methods: {
    handleCurrentChange(index) {
      this.page = index
      this.fecthdata()
    },
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
              message: err.response.data.data.members || err.response.data.data.non_field_errors
            })
            obj.points = obj.points.split(',')
            this.tableData[index].select_show = true
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
      getTurn({ page: this.page }).then(response => {
        this.page = response.data.page
        this.total = response.data.count
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
      getTurnChoices().then(response => {
        this.points = response.data
      })
    },
    row_class({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row'
      } else if (rowIndex % 2 === 1) {
        return 'success-row'
      }
    },
    indexMethod(index) {
      return (this.page - 1) * 10 + index + 1
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
</style>
