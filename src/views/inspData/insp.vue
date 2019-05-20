<template>
  <div class="app-container">
    <el-col>
      <el-button style="margin-left: 87%; margin-top: 1%" type="primary" @click="handleImport">+ 导入数据</el-button>
    </el-col>
    <el-table
      :data="tableData"
      border
      style="width: 90%; margin-left: auto; margin-right: auto; margin-top: 5%"
    >
      <el-table-column
        prop="name"
        label="名称"
      />

    </el-table>
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
      <el-button style="margin-top: 20px; margin-left: 70%" @click="importDialog = false">取 消</el-button>
      <el-button type="primary" @click="doImport">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { convertExcelToJson } from '@/utils/tool'
import { importInspectionData } from '@/api/insp'

export default {
  components: { UploadExcelComponent },
  data() {
    return {
      importDialog: false,
      importData: null,
      workbook: null,
      loading: false,
      range: 2
    }
  },
  created() {

  },
  methods: {
    // 点击导入数据的确定按钮
    async doImport() {
      this.loading = true
      const jsonData = await convertExcelToJson(this.importData)
      importInspectionData(jsonData).then(response => {
        this.$message({
          type: 'success',
          message: '导入数据成功！'
        })
        this.importDialog = false
        this.loading = false
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    handleImport() {
      this.importDialog = true
    },
    handleSuccess({ results, header, workbook }) {
      this.importData = results
      this.workbook = workbook
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
