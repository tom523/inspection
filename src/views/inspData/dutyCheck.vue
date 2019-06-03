<template>
  <div class="app-container">
    <div style="margin-top: 10px">
      <el-button style="margin-left: 80%; width: 10%" type="primary" @click="add_row">+ 添加班中检查</el-button>
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
            label="名称"
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
            label="类型"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.select_show">
                <el-select
                  v-model="scope.row.type"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in types"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <div v-else>{{ scope.row.type | chooseType }}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="专业"
          >
            <template slot-scope="scope">
              {{ scope.row.select_show ? '' : scope.row.profession }}
              <div v-if="scope.row.select_show">
                <el-select
                  v-model="scope.row.profession"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in professions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="描述"
          >
            <template slot-scope="scope">
              {{ scope.row.select_show ? '' : scope.row.desc }}
              <div v-if="scope.row.select_show">
                <el-input v-model="scope.row.desc" />
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
  </div>
</template>

<script>
import { getDutyCheck, addDutyCheck, updateDutyCheck, deleteDutyCheck } from '@/api/insp'
import { getRoleUser } from '@/api/user'
export default {
  filters: {
    chooseType(info) {
      if (info === 'PRE') {
        info = '班前检查'
      } else if (info === 'MID') {
        info = '班中检查'
      } else if (info === 'AFT') {
        info = '班后检查'
      }
      return info
    }
  },
  data() {
    return {
      types: [{
        value: 'PRE',
        label: '班前检查'
      },
      {
        value: 'MID',
        label: '班中检查'
      },
      {
        value: 'AFT',
        label: '班后检查'
      }],
      loading: false,
      tableData: [],
      professions: null,
      rowName: null,
      rowType: null,
      rowProfession: null,
      rowDesc: null,
      page: 1,
      total: null
    }
  },
  created() {
    this.fetchData()
    this.fecthSelect()
  },
  methods: {
    handleCurrentChange(index) {
      this.page = index
      this.fetchData()
    },
    editRowOrConfirm(index, obj) {
      // 点击确定
      if (this.tableData[index].select_show) {
        // 新建值
        if (obj.id === undefined) {
          debugger
          addDutyCheck(obj).then(response => {
            this.fetchData()
            this.$message({
              type: 'sussess',
              message: '添加班中检查成功！'
            })
          }).catch(err => {
            this.tableData[index].select_show = true
            console.log(err)
          })
        } else {
          updateDutyCheck(obj.id, obj).then(response => {
            this.fetchData()
            this.$message({
              type: 'sussess',
              message: '更新班中检查成功'
            })
          }).catch(err => {
            console.log(err)
          })
        }
        this.tableData[index].select_show = false
      } else {
        // 点击编辑
        this.rowName = JSON.parse(JSON.stringify(obj.name))
        this.rowType = JSON.parse(JSON.stringify(obj.type))
        this.rowProfession = JSON.parse(JSON.stringify(obj.profession))
        this.rowDesc = JSON.parse(JSON.stringify(obj.desc))
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
          this.tableData[index].type = this.rowType
          this.tableData[index].profession = this.rowProfession
          this.tableData[index].desc = this.rowDesc
          this.tableData[index].select_show = false
        }
      } else {
        // 点击删除，删除值
        this.$confirm('此操作将删除' + obj.name + ',是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDutyCheck(obj.id).then(response => {
            this.tableData.splice(index, 1)
            this.$message({
              type: 'sussess',
              message: '删除班中检查成功'
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
        type: null,
        profession: '',
        desc: '',
        select_show: true
      })
    },
    fetchData() {
      getDutyCheck().then(response => {
        this.page = response.data.page
        this.total = response.data.count
        var dutyCheckData = response.data.items
        dutyCheckData.map(item => {
          item.select_show = false
        })
        this.tableData = dutyCheckData
      })
    },
    fecthSelect() {
      getRoleUser({ role_type: 'PROFESSION' }).then(response => {
        this.professions = response.data
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
</style>
