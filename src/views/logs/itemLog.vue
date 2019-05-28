<template>
  <div class="app-container">
    <div style="margin-top: 10px">
      <el-col>
        <el-table
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
            prop="name"
          />
          <el-table-column
            align="center"
            label="专业"
            width="100"
            prop="profession"
          />
          <el-table-column
            align="center"
            label="类型"
            width="100"
            prop="type"
          />
          <el-table-column
            align="center"
            label="巡检点"
          >
            <template slot-scope="scope">
              {{ points.filter(item => item.id === scope.row.point)[0].name }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="设备"
          >
            <template slot-scope="scope">
              {{ devices.filter(item => item.id === scope.row.device)[0].name }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="阈值"
            width="100"
          >
            <template slot-scope="scope">
              {{ scope.row.extra.threshold }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="越限方式"
            width="100"
          >
            <template slot-scope="scope">
              {{ scope.row.extra.comparisonOperator }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="单位(文字)"
            width="100"
          >
            <template slot-scope="scope">
              {{ scope.row.extra.cnUnit }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="单位(符号)"
            width="100"
          >
            <template slot-scope="scope">
              {{ scope.row.extra.symbolUnit }}
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
import { getItem, getAllPoint, getAllDevice } from '@/api/insp'
export default {
  data() {
    return {
      points: [],
      devices: [],
      tableData: [],
      total: null,
      page: 1
    }
  },
  created() {
    this.fetchData()
    this.fetchSelect()
  },
  methods: {
    handleCurrentChange(index) {
      this.page = index
      this.fetchData()
    },
    fetchData() {
      getItem({ page: this.page }).then(response => {
        this.tableData = response.data.items
        this.total = response.data.count
        this.page = response.data.page
      })
    },
    fetchSelect() {
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
