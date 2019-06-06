<template>
  <div class="app-container">
    <div style="margin-top: 10px">
      <el-col>
        <el-table
          :row-class-name="row_class"
          border
          :data="tableData"
          style="width: 80%; margin-left: auto; margin-right: auto; margin-top: 30px"
        >
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="80"
          />
          <el-table-column
            align="center"
            label="被调人"
            prop="shift_staff"
          />
          <el-table-column
            align="center"
            label="原属值"
            prop="before_shift_team"
          />
          <el-table-column
            align="center"
            label="现属值"
            prop="after_shift_team"
          />
        </el-table>
      </el-col>
      <el-col />
    </div>
  </div>
</template>

<script>
import { getTransferLog } from '@/api/user'
export default {
  data() {
    return {
      tableData: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getTransferLog().then(response => {
        this.tableData = response.data
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
