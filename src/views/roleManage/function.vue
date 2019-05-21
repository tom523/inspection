<template>
  <div class="app-container">
    <div style="margin-top: 50px">
      <el-col>
        <el-table
          v-loading="loading"
          element-loading-text="拼命加载中"
          :row-class-name="row_class"
          border
          :data="tableData"
          style="width: 80%; margin-left: auto; margin-right: auto; margin-top: 20px"
        >
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="80"
          />
          <el-table-column
            align="center"
            prop="name"
            label="功能"
            width="100"
          />
          <el-table-column
            align="center"
            label="用户"
          >
            <template slot-scope="scope">
              {{ scope.row.select_show ? '' : scope.row.members.toString() }}
              <div v-if="scope.row.select_show">
                <el-select
                  v-model="scope.row.members"
                  style="width: 100%"
                  multiple
                >
                  <el-option
                    v-for="item in members"
                    :key="item.username"
                    :lable="item.id"
                    :value="item.username"
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
                @click="cancel(scope.$index, scope.row)"
              >取消</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </div>
  </div>
</template>

<script>
// import { getList } from '@/api/table'
import { getRoleUser, getAccountUser, addRoleUser, updataRoleUser } from '@/api/user'

export default {
  filters: {
    chooseProfessionType: function(info) {
      if (info === 'PROFESSION') {
        info = '普通专业'
      } else if (info === 'REVIEW_PROFESSION') {
        info = '复检专业'
      } else if (info === 'PIPE_PROFESSION') {
        info = '管线专业'
      }
      return info
    }
  },
  data() {
    return {
      professionType: [{
        value: 'PROFESSION',
        label: '普通专业'
      }, {
        value: 'REVIEW_PROFESSION',
        label: '复检专业'
      }, {
        value: 'PIPE_PROFESSION',
        label: '管线专业'
      }],
      tableData: [],
      rowMember: [],
      members: [],
      loading: true
    }
  },
  created() {
    this.fecthdata()
    this.fecthUser()
  },
  methods: {
    editRowOrConfirm(row, index) {
      // 点击确定
      if (this.tableData[row].select_show) {
        index.members = index.members.toString()
        // 新建专业
        if (index.id === undefined) {
          addRoleUser(index).then(response => {
            index.members = index.members.split(',')
            this.fecthdata()
            this.$message({
              type: 'success',
              message: '添加成功'
            })
          }).catch(err => {
            this.tableData.splice(row, 1)
            this.$message({
              type: 'warning',
              message: err.response.data.data.members
            })
            console.log(err)
          })
        } else {
          // 更新专业
          updataRoleUser(index.id, index).then(response => {
            index.members = index.members.split(',')
            this.fecthdata()
            this.$message({
              type: 'success',
              message: '更新成功'
            })
          }).catch(err => {
            this.tableData[row].members = this.rowMember
            this.$message({
              type: 'warning',
              message: err.response.data.data.members
            })
            console.log(err)
          })
        }
        this.tableData[row].select_show = false
      } else {
        // 点击编辑
        this.rowMember = JSON.parse(JSON.stringify(index.members))
        this.tableData[row].select_show = true
      }
    },
    cancel(row, index) {
      // 点击取消
      if (index.select_show) {
        this.tableData[row].members = this.rowMember
        this.tableData[row].select_show = false
      }
    },
    async fecthdata() {
      // 获取功能
      const functionData = await getRoleUser({ role_type: 'ADMIN' })
      var data = functionData.data
      data.map(item => {
        item.select_show = false
        item.members = item.members.split(',')
        item.members.pop()
        item.members.shift()
      })
      this.tableData = data
      this.loading = false
    },
    async fecthUser() {
      // 获取用户
      const membersData = await getAccountUser()
      this.members = membersData.data.items
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
