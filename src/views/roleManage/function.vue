<template>
  <div class="app-container">
    <div style="margin-top: 60px">
      <el-col>
        <el-table
          :row-class-name="row_class"
          border
          :data="tableData"
          style="width: 80%; margin-left: auto; margin-right: auto"
        >
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="80"
          />
          <el-table-column
            align="center"
            label="功能"
            width="100"
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
                @click="deleteRowOrCancel(scope.$index, scope.row)"
              >{{ scope.row.select_show ? '取消' : '删除' }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col>
        <el-button class="el-table-add-row" type="primary" @click="add_row">+ 添加</el-button>
      </el-col>
    </div>
  </div>
</template>

<script>
// import { getList } from '@/api/table'
import { getRoleUser, getAccountUser, addRoleUser, updataRoleUser, deleteRoleUser } from '@/api/user'

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
      members: []
    }
  },
  created() {
    this.fecthdata()
  },
  methods: {
    editRowOrConfirm(row, index) {
      debugger
      // 点击确定
      if (this.tableData[row].select_show) {
        index.members = index.members.toString()
        // 新建专业
        if (index.id === undefined) {
          addRoleUser(index).then(response => {
            index.members = index.members.split(',')
            this.$message({
              type: 'success',
              message: '添加成功'
            })
          }).catch(err => {
            console.log(err)
          })
        } else {
          // 更新专业
          updataRoleUser(index.id, index).then(response => {
            index.members = index.members.split(',')
            this.$message({
              type: 'success',
              message: '更新成功'
            })
          }).catch(err => {
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
    deleteRowOrCancel(row, index) {
      if (this.tableData[row].select_show) {
        // 点击取消
        this.tableData[row].members = this.rowMember
        this.tableData[row].select_show = false
      } else {
        // 点击删除，删除值
        deleteRoleUser(index.id).then(response => {
          this.tableData.splice(row, 1)
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
        }).catch(err => {
          console.log(err)
        })
      }
    },
    add_row() {
      // 点击添加
      this.tableData.push({
        role_type: 'ADMIN',
        name: '',
        members: '',
        access: '',
        desc: '',
        role_key: '',
        access_name: '',
        select_show: true
      })
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
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    height: 40px;
    border: 1px dashed #c1c1cd;
    border-radius: 3px;
    cursor: pointer;
    justify-content: center;
    display: flex;
}
</style>
