<template>
  <div class="app-container">
    <div style="margin-top: 1%">
      <el-button style="margin-left: 6%" type="success" @click="handleImport">+ 导入数据</el-button>
      <el-button type="primary" @click="addRow">+ 添加巡检点</el-button>
      <el-table
        :data="tableData"
        border
        style="width: 88%; margin-left: auto; margin-right: auto; margin-top: 1%"
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
          label="位置"
        >
          <template slot-scope="scope">
            {{ scope.row.select_show ? '' : scope.row.extra.location }}
            <div v-if="scope.row.select_show">
              <el-input v-model="scope.row.extra.location" />
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
      <el-pagination
        style="margin-top: 20px; margin-left: 6%"
        :current-page="page"
        :total="total"
        background
        prev-text="上一页"
        next-text="下一页"
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      v-loading="loading"
      element-loading-text="数据上传中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :visible.sync="importDialog"
      title="导入数据"
      width="50%"
    >
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" :ignore-range="range" />
    </el-dialog>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { convertExcelToJson } from '@/utils/tool'
import { importInspectionData, getPoint, addPoint, updatePoint, deletePoint } from '@/api/insp'

export default {
  components: { UploadExcelComponent },
  data() {
    return {
      importDialog: false,
      importData: null,
      workbook: null,
      loading: false,
      range: 2,
      tableData: [],
      page: 1,
      total: null,
      rowName: null,
      rowLocathion: null
    }
  },
  created() {
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
        // 新建巡检点
        if (obj.id === undefined) {
          addPoint(obj).then(response => {
            this.fetchData()
            this.$message({
              type: 'sussess',
              message: '添加巡检点成功！'
            })
          }).catch(err => {
            this.tableData[index].select_show = true
            console.log(err)
          })
        } else {
          updatePoint(obj.id, obj).then(response => {
            this.fetchData()
            this.$message({
              type: 'sussess',
              message: '更新巡检点成功'
            })
          }).catch(err => {
            console.log(err)
          })
        }
        this.tableData[index].select_show = false
      } else {
        // 点击编辑
        this.rowName = JSON.parse(JSON.stringify(obj.name))
        this.rowLocathion = JSON.parse(JSON.stringify(obj.extra))
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
          this.tableData[index].extra = this.rowLocathion
          this.tableData[index].select_show = false
        }
      } else {
        // 点击删除，删除值
        this.$confirm('此操作将删除' + obj.name + ',是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deletePoint(obj.id).then(response => {
            this.tableData.splice(index, 1)
            this.$message({
              type: 'sussess',
              message: '删除巡检点成功'
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
    addRow() {
      this.tableData.push({
        name: '',
        extra: { location: '' },
        select_show: true
      })
    },
    fetchData() {
      getPoint({ page: this.page }).then(response => {
        var pointData = response.data.items
        this.total = response.data.count
        this.page = response.data.page
        pointData.map(item => {
          item.select_show = false
        })
        this.tableData = pointData
      })
    },
    // 导入数据
    async doImport() {
      this.loading = true
      const jsonData = await convertExcelToJson(this.importData)
      importInspectionData(jsonData).then(response => {
        this.importDialog = false
        this.$message({
          type: 'success',
          message: '导入数据成功！'
        })
        this.fetchData()
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message({
          type: 'warning',
          message: err.response.data[0]
        })
        console.log(err)
      })
    },
    handleImport() {
      this.importDialog = true
    },
    handleSuccess({ results, header, workbook }) {
      this.importData = results
      this.workbook = workbook
      this.doImport()
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    }
  }
}
</script>
