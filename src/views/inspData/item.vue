<template>
  <div class="app-container">
    <div style="margin-top: 10px">
      <el-button style="margin-left: 85%" type="primary" @click="add_row">+ 添加巡检点项</el-button>
      <el-col>
        <el-table
          v-loading="loading"
          element-loading-text="拼命加载中"
          :row-class-name="row_class"
          border
          :data="tableData"
          style="width: 90%; margin-left: auto; margin-right: auto; margin-top: 20px"
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
            width="100"
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
                    :key="item.name"
                    :lable="item.id"
                    :value="item.name"
                  />
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="类型"
            width="100"
          >
            <template slot-scope="scope">
              {{ scope.row.select_show ? '' : scope.row.type }}
              <div v-if="scope.row.select_show">
                <el-select v-model="scope.row.type">
                  <el-option
                    v-for="item in types"
                    :key="item.value"
                    :lable="item.lable"
                    :value="item.value"
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
              <div v-if="scope.row.select_show">
                <el-select
                  v-model="scope.row.point"
                  width="100"
                >
                  <el-option
                    v-for="item in points"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </div>
              <div v-else>{{ points.filter(item => item.id === scope.row.point)[0].name }}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="设备"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.select_show">
                <el-select v-model="scope.row.device" filterable>
                  <el-option
                    v-for="item in devices"
                    :key="item.id"
                    :label="item.display_name"
                    :value="item.id"
                  />
                </el-select>
              </div>
              <div v-else>{{ devices.filter(item => item.id === scope.row.device)[0].name }}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="阈值"
            width="100"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.select_show && scope.row.type !== '普通巡检项'">
                <el-input v-model="scope.row.extra.threshold" />
              </div>
              <div v-else>{{ scope.row.extra.threshold }}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="越限方式"
            width="100"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.select_show && scope.row.type !== '普通巡检项'">
                <el-input v-model="scope.row.extra.comparisonOperator" />
              </div>
              <div v-else>{{ scope.row.extra.comparisonOperator }}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="单位(文字)"
            width="100"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.select_show && scope.row.type !== '普通巡检项'">
                <el-input v-model="scope.row.extra.cnUnit" />
              </div>
              <div v-else>{{ scope.row.extra.cnUnit }}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="单位(符号)"
            width="100"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.select_show && scope.row.type !== '普通巡检项'">
                <el-input v-model="scope.row.extra.symbolUnit" />
              </div>
              <div v-else>{{ scope.row.extra.symbolUnit }}</div>
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
          style="margin-top: 50px; margin-left: 5%"
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
import { getItem, addItem, updateItem, deleteItem, getAllPoint, getAllDevice } from '@/api/insp'
import { getRoleUser } from '@/api/user'
export default {
  data() {
    return {
      types: [{
        value: '普通巡检项',
        label: '普通巡检项'
      }, {
        value: '温度测量项',
        label: '温度测量项'
      }, {
        value: '其他测量项',
        label: '其他测量项'
      }],
      loading: false,
      tableData: [],
      total: null,
      page: 1,
      totalPage: null,
      professions: [],
      points: [],
      devices: [],
      rowName: null,
      rowProfesson: null,
      rowType: null,
      rowThreshold: null,
      rowComparisonOperator: null,
      rowCnUnit: null,
      rowSymolUnit: null,
      rowPoint: null,
      rowDevice: null
    }
  },
  created() {
    this.fetchSelect()
    this.fetchData()
  },
  methods: {
    handleCurrentChange(index) {
      this.page = index
      this.fetchData()
    },
    editRowOrConfirm(index, obj) {
      // 点击确定
      if (this.tableData[index].select_show) {
        if (obj.id === undefined) {
          // 添加
          addItem(obj).then(response => {
            this.fetchData()
            this.$message({
              type: 'success',
              message: '添加巡检点成功'
            })
          }).catch(err => {
            console.log(err)
          })
        } else {
          // 更新
          updateItem(obj.id, obj).then(response => {
            this.fetchData()
            this.$message({
              type: 'success',
              message: '更新巡检项成功！'
            })
          })
        }
        this.tableData[index].select_show = false
      } else {
        // 点击编辑
        this.rowName = JSON.parse(JSON.stringify(obj.name))
        this.rowProfesson = JSON.parse(JSON.stringify(obj.profession))
        this.rowType = JSON.parse(JSON.stringify(obj.type))
        this.rowThreshold = JSON.parse(JSON.stringify(obj.extra.threshold))
        this.rowComparisonOperator = JSON.parse(JSON.stringify(obj.extra.comparisonOperator))
        this.rowCnUnit = JSON.parse(JSON.stringify(obj.extra.cnUnit))
        this.rowSymolUnit = JSON.parse(JSON.stringify(obj.extra.symbolUnit))
        this.rowPoint = JSON.parse(JSON.stringify(obj.point))
        this.rowDevice = JSON.parse(JSON.stringify(obj.device))
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
          this.tableData[index].profession = this.rowProfesson
          this.tableData[index].type = this.rowType
          this.tableData[index].extra.threshold = this.rowThreshold
          this.tableData[index].extra.comparisonOperator = this.rowComparisonOperator
          this.tableData[index].extra.cnUnit = this.rowCnUnit
          this.tableData[index].extra.symbolUnit = this.rowSymolUnit
          this.tableData[index].point = this.rowPoint
          this.tableData[index].device = this.rowDevice
          this.tableData[index].select_show = false
        }
      } else {
        // 点击删除
        this.$confirm('此操作将删除“' + obj.name + '”,是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteItem(obj.id).then(response => {
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
    // 点击添加
    async add_row() {
      this.page = this.totalPage
      await this.fetchData()
      this.tableData.push({
        name: '',
        profession: '',
        type: '',
        extra: {
          threshold: '-',
          comparisonOperator: '-',
          cnUnit: '-',
          symbolUnit: '-'
        },
        select_show: true
      })
    },
    async fetchData() {
      await getItem({ page: this.page }).then(response => {
        var itemData = response.data.items
        this.total = response.data.count
        this.page = response.data.page
        this.totalPage = response.data.total_page
        itemData.map(item => {
          item.select_show = false
        })
        this.tableData = itemData
      })
    },
    fetchSelect() {
      getRoleUser({ role_type: 'PROFESSION' }).then(response => {
        this.professions = response.data
      })
      getAllPoint().then(response => {
        this.points = response.data
      })
      getAllDevice().then(response => {
        this.devices = response.data
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
    margin-left: 85%;
    margin-right: auto;
    height: 40px;
    border: 1px dashed #c1c1cd;
    border-radius: 3px;
    cursor: pointer;
    justify-content: center;
    display: flex;
}
</style>
