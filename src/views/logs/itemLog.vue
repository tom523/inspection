<template>
  <div class="app-container">
    <div style="margin-top: 10px">
      <el-col style="margin-left: 5%">
        <span>检查级别</span>
        <el-select v-model="listQuery.inspection_level" clearable placeholder="检查级别">
          <el-option
            v-for="item in inspectionLevels"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col>
        <el-table
          :row-class-name="row_class"
          border
          :data="tableData"
          style="width: 90%; margin-left: auto; margin-right: auto; margin-top: 20px"
        >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="巡检点：">
                  <span>{{ scope.row.point_name }}</span>
                </el-form-item>
                <el-form-item label="设备：">
                  <span>{{ scope.row.device_name }}</span>
                </el-form-item>
                <div v-if="scope.row.snapshot.type !== '普通检查项' && scope.row.snapshot.type !== '其他检查项'">
                  <el-form-item label="数值：">
                    <span>{{ scope.row.comments }}</span>
                  </el-form-item>
                  <el-form-item label="越限值：">
                    <span>{{ scope.row.snapshot.extra.threshold }}</span>
                  </el-form-item>
                  <el-form-item label="越限方式：">
                    <span>{{ scope.row.snapshot.extra.comparisonOperator }}</span>
                  </el-form-item>
                  <el-form-item label="单位(文字):">
                    <span>{{ scope.row.snapshot.extra.symbolUnit }}</span>
                  </el-form-item>
                  <el-form-item label="单位(符号):">
                    <span>{{ scope.row.snapshot.extra.cnUnit }}</span>
                  </el-form-item>
                </div>
                <el-form-item label="检查描述:">
                  <span>{{ scope.row.comments }}</span>
                </el-form-item>
                <el-form-item v-if="scope.row.checking_status === 'AB'" label="缺陷等级">
                  <span>{{ scope.row.fault_level }}</span>
                </el-form-item>
                <el-form-item label="图片:">
                  <span><el-button type="text" :disabled="scope.row.photo ? false : true" @click="onClickPhoto(scope.row.photo)">查看</el-button></span>
                </el-form-item>
                <el-form-item label="检查人:">
                  <span>{{ scope.row.staff }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
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
              {{ scope.row.snapshot.name }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="专业"
          >
            <template slot-scope="scope">
              {{ scope.row.snapshot.profession }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="类型"
          >
            <template slot-scope="scope">
              {{ scope.row.snapshot.type }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="检查级别"
          >
            <template slot-scope="scope">
              {{ scope.row.inspection_level | levalFilter }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="状态"
          >
            <template slot-scope="scope">
              {{ scope.row.checking_status | statusFilter }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="巡检时间"
          >
            <template slot-scope="scope">
              {{ scope.row.actual_check_time || '--' }}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col>
        <el-pagination
          style="margin-top: 30px; margin-left: 5%; margin-bottom: 40px; margin-bottom: 10%"
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
    <el-dialog :visible.sync="cpDialogPhoto" title="图片详情" width="40%">
      <div class="img_wap">
        <img :src="picture" class="head-img">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getItemLog } from '@/api/insp'
import { getDate } from '@/utils/tool'
export default {
  filters: {
    statusFilter: function(code) {
      const statusMap = {
        'LO': '锁定',
        'UN': '解锁',
        'AB': '异常',
        'NO': '正常',
        'ST': '停检',
        'OM': '漏检'
      }
      return statusMap[code]
    },
    levalFilter: function(code) {
      const levalMap = {
        1: '巡检',
        2: '复检',
        3: '抽检',
        9: '管线'
      }
      return levalMap[code]
    }
  },
  data() {
    return {
      tableData: [],
      total: null,
      cpDialogPhoto: false,
      picture: null,
      // page: 1,
      listQuery: {
        page: 1,
        inspection_level: null,
        checking_status: null,
        actual_check_time__lte: null,
        actual_check_time__gte: null
      },
      inspectionLevels: [{
        value: 1,
        label: '巡检'
      },
      {
        value: 2,
        label: '复检'
      },
      {
        value: 3,
        label: '抽检'
      },
      {
        value: 9,
        label: '管线'
      }]

    }
  },
  watch: {
    'listQuery.checking_status': function() {
      this.listQuery.page = 1
      this.listQuery.actual_check_time__gte = getDate() + ' 00:00:00'
      this.listQuery.actual_check_time__lte = getDate() + ' 23:59:59'
      this.fetchData()
    },
    'listQuery.inspection_level': function() {
      this.listQuery.page = 1
      this.fetchData()
    }
  },
  created() {
    if (this.$route.query.status) {
      this.listQuery.checking_status = this.$route.query.status
    }
    this.fetchData()
  },
  methods: {
    handleCurrentChange(index) {
      this.listQuery.page = index
      this.fetchData()
    },
    onClickPhoto(cpLog) {
      this.cpDialogPhoto = true
      // console.log(cpLog)
      this.picture = cpLog
    },
    fetchData() {
      getItemLog(this.listQuery).then(response => {
        this.tableData = response.data.items
        this.total = response.data.count
        this.listQuery.page = response.data.page
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
    .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .head-img {
    width: 100%;
    height: auto;
  }
</style>
