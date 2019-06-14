<template>
  <div class="app-container">
    <div style="margin-top: 10px">
      <el-col>
        <span style="margin-left: 10%">专业</span>
        <el-select v-model="listQuery.profession" clearable placeholder="选择专业">
          <el-option
            v-for="item in professions"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
        <el-button style="margin-left: 54%; width: 10%" type="primary" @click="add_row">+ 添加设备</el-button>
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
            :index="indexMethod"
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
            label="巡检点"
          >
            <template slot-scope="scope">
              {{ scope.row.select_show ? '' : scope.row.point.name }}
              <div v-if="scope.row.select_show">
                <el-select
                  v-model="scope.row.point.id"
                  filterable
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in points"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
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
  </div>
</template>

<script>
import { getDevice, addDevice, updateDevice, deleteDevice, getAllPoint } from '@/api/insp'
import { getRoleUser } from '@/api/user'
export default {
  data() {
    return {
      loading: false,
      tableData: [],
      page: 1,
      total: null,
      professions: null,
      points: null,
      rowName: null,
      rowProfession: null,
      rowPoint: null,
      totalPage: null,
      listQuery: {
        is_virtual: false,
        page: 1,
        profession: null
      }
    }
  },
  watch: {
    'listQuery.profession': function() {
      this.listQuery.page = 1
      this.fetchData()
    }
  },
  created() {
    this.fetchData()
    this.fecthSelect()
  },
  methods: {
    handleCurrentChange(index) {
      this.listQuery.page = index
      this.fetchData()
    },
    editRowOrConfirm(index, obj) {
      // 点击确定
      if (this.tableData[index].select_show) {
        // 新建设备
        obj.point = obj.point.id
        if (obj.id === undefined) {
          addDevice(obj).then(response => {
            this.fetchData()
            this.$message({
              type: 'sussess',
              message: '添加设备成功！'
            })
          }).catch(err => {
            this.$message({
              type: 'warning',
              message: err.response.data.data.name || err.response.data.data.point
            })
            this.tableData[index].select_show = true
            console.log(err)
          })
        } else {
          updateDevice(obj.id, obj).then(response => {
            this.fetchData()
            this.$message({
              type: 'sussess',
              message: '更新设备成功'
            })
          }).catch(err => {
            console.log(err)
          })
        }
        this.tableData[index].select_show = false
      } else {
        // 点击编辑
        this.rowName = JSON.parse(JSON.stringify(obj.name))
        this.rowProfession = JSON.parse(JSON.stringify(obj.profession))
        this.rowPoint = JSON.parse(JSON.stringify(obj.point))
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
          this.tableData[index].profession = this.rowProfession
          this.tableData[index].point = this.rowPoint
          this.tableData[index].select_show = false
        }
      } else {
        // 点击删除，删除值
        this.$confirm('此操作将删除' + obj.name + ',是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDevice(obj.id).then(response => {
            this.tableData.splice(index, 1)
            this.$message({
              type: 'sussess',
              message: '删除设备成功'
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
    async add_row() {
      // 点击添加
      this.listQuery.page = this.totalPage
      await this.fetchData()
      this.tableData.push({
        is_virtual: false,
        name: '',
        profession: '',
        point: {
          id: null
        },
        select_show: true
      })
    },
    async fetchData() {
      await getDevice(this.listQuery).then(response => {
        this.listQuery.page = response.data.page
        this.total = response.data.count
        this.totalPage = response.data.total_page
        var deviceData = response.data.items
        deviceData.map(item => {
          item.select_show = false
        })
        this.tableData = deviceData
      })
    },
    fecthSelect() {
      getRoleUser({ role_type__in: 'PROFESSION,PIPE_PROFESSION' }).then(response => {
        this.professions = response.data
      })
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
</style>
