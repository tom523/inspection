<template>
  <div class="app-container">
    <div style="margin-top: 10px">
      <el-col>
        <el-button class="el-table-add-row" type="primary" @click="add_row">+ 添加设备</el-button>
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
              {{ scope.row.select_show ? '' : scope.row.point }}
              <div v-if="scope.row.select_show">
                <el-select
                  v-model="scope.row.point"
                  filterable
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in points"
                    :key="item.id"
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
      rowName: null,
      rowProfession: null,
      rowPoint: null
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
          addDevice(obj).then(response => {
            this.fetchData()
            this.$message({
              type: 'sussess',
              message: '添加设备成功！'
            })
          }).catch(err => {
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
    add_row() {
      // 点击添加
      this.tableData.push({
        is_virtual: true,
        name: '',
        profession: '',
        point: '',
        select_show: true
      })
    },
    fetchData() {
      getDevice({
        is_virtual: false,
        page: this.page
      }).then(response => {
        this.page = response.data.page
        this.total = response.data.count
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
